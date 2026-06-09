import mongoose from 'mongoose';
import { AsyncLocalStorage } from 'async_hooks';

export const dbContextStorage = new AsyncLocalStorage();

const compiledPrimaryModels = {};
const compiledSecondaryModels = {};
const registeredSchemas = {};
let secondaryConn = null;
let isConnected = false;

const originalModel = mongoose.model.bind(mongoose);

mongoose.model = function (name, schema, collection) {
  // Save schema details for secondary compilation when connected
  registeredSchemas[name] = { schema, collection };

  // 1. Compile on default/primary connection
  const primaryModel = originalModel(name, schema, collection);
  compiledPrimaryModels[name] = primaryModel;

  // 2. Compile on secondary connection if it is already initialized
  if (secondaryConn) {
    try {
      if (!secondaryConn.models[name]) {
        compiledSecondaryModels[name] = secondaryConn.model(name, schema, collection);
      } else {
        compiledSecondaryModels[name] = secondaryConn.models[name];
      }
    } catch (e) {
      console.warn(`[DB Switcher] Error pre-compiling secondary model ${name}:`, e.message);
    }
  }

  // 3. Return a Proxy that wraps the primary model and switches dynamically
  const modelProxy = new Proxy(primaryModel, {
    get(target, prop, receiver) {
      const context = dbContextStorage.getStore();
      const useSecondary = context?.useSecondary || false;
      const activeModel = useSecondary ? (compiledSecondaryModels[name] || primaryModel) : primaryModel;

      const value = Reflect.get(activeModel, prop, receiver);
      if (typeof value === 'function') {
        return value.bind(activeModel);
      }
      return value;
    },
    construct(target, argumentsList, newTarget) {
      const context = dbContextStorage.getStore();
      const useSecondary = context?.useSecondary || false;
      const activeModel = useSecondary ? (compiledSecondaryModels[name] || primaryModel) : primaryModel;
      return Reflect.construct(activeModel, argumentsList, newTarget);
    }
  });

  return modelProxy;
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  const uriSecondary = process.env.MONGO_URI_1;

  if (!uri) {
    console.warn('⚠️  MONGO_URI not set. MongoDB features unavailable.');
    return;
  }

  try {
    mongoose.set('strictQuery', false);

    // 1. Connect default/primary connection
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
      bufferTimeoutMS: 1000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected (Primary): ${mongoose.connection.host}`);
    console.log(`   Database: ${mongoose.connection.name}`);

    // 2. Connect secondary connection if URI is available
    if (uriSecondary) {
      secondaryConn = mongoose.createConnection(uriSecondary, {
        dbName: 'agro-india',
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 10000,
      });

      // Compile all registered schemas on the secondary connection immediately
      for (const [name, data] of Object.entries(registeredSchemas)) {
        if (!compiledSecondaryModels[name]) {
          try {
            compiledSecondaryModels[name] = secondaryConn.model(name, data.schema, data.collection);
          } catch (err) {
            compiledSecondaryModels[name] = secondaryConn.models[name];
          }
        }
      }

      secondaryConn.on('connected', () => {
        console.log(`✅ MongoDB Connected (Secondary): ${secondaryConn.host}`);
        console.log(`   Database: ${secondaryConn.name}`);
      });

      secondaryConn.on('error', (err) => {
        console.warn(`⚠️  Secondary MongoDB connection failed: ${err.message}`);
      });
    }

  } catch (error) {
    isConnected = false;
    console.warn(`⚠️  MongoDB connection failed: ${error.message}`);
  }
};

export const getIsConnected = () => isConnected;

export default connectDB;

// Trigger database reload to refresh connection configurations

