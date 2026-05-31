import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import commodityRoutes from './routes/commodity.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import marketplaceRoutes from './routes/marketplace.routes.js';
import profileRoutes from './routes/profile.routes.js';
import journalRoutes from './routes/journal.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' })); // Auth will restrict this later
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Connect Database ─────────────────────────────────────────────────────────
connectDB();

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AgroIndia Backend',
    version: '1.0.0',
    modules: ['commodity-market-intelligence', 'weather-reservoir', 'marketplace'],
    env: process.env.NODE_ENV || 'development',
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', commodityRoutes);
app.use('/api', profileRoutes);
app.use('/api', journalRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║      AgroIndia Backend — Running on Port ${PORT}       ║
║      MongoDB: ${process.env.MONGO_URI ? 'Configured ✓' : 'Missing ✗'}                       ║
║      Greenleaf API: ${process.env.GREENLEAF_API_BASE ? 'Configured ✓' : 'Missing ✗'}            ║
║      Gemini: ${process.env.GEMINI_API_KEY ? 'Configured ✓' : 'Placeholder (key pending)'}   ║
╚══════════════════════════════════════════════════════╝
  `);
});

export default app;
