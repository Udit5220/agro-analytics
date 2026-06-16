import { getLearningDashboardData } from './controllers/learning.controller.js';

const req = {
  headers: {},
  query: {
    subPath: 'dashboard',
    role: 'Farmer',
    location: 'India',
    language: 'English'
  }
};

const res = {
  status: function(code) {
    console.log('Status:', code);
    return this;
  },
  json: function(data) {
    console.log('JSON:', JSON.stringify(data, null, 2));
  }
};

getLearningDashboardData(req, res).then(() => {
  console.log('Done');
}).catch(err => {
  console.error('Unhandled err:', err);
});
