/**
 * greenleafApiService.js
 * ─────────────────────
 * Proxy wrapper around the Greenleaf backend API.
 * Base URL comes from GREENLEAF_API_BASE env var.
 * Auth token is NOT required for dev/MVP phase (as instructed).
 *
 * Greenleaf API Endpoints discovered from ZIP analysis:
 *  GET  /commoditiesv2                                    — Commodity list
 *  POST /commodities/sugar/dashboard/global-spot-prices  — Sugar continuous prices
 *  POST /grains/:type/continuous                         — Wheat/Corn/Rice continuous
 *  POST /grains/:type/seasonal                           — Grains seasonal data
 *  GET  /grains/:type/cities                             — Cities for grain
 *  POST /grains/spread/wheat-corn                        — Wheat-Corn spread
 *  GET  /grains/oil-and-seeds/masters                    — Oil & seeds master list
 *  GET  /grains/oil-and-seeds/masters/commodities        — Commodities under master
 *  GET  /grains/oil-and-seeds/locations                  — Location options
 *  POST /grains/oil-and-seeds/continuous                 — Oil & seeds continuous
 *  POST /grains/oil-and-seeds/seasonal                   — Oil & seeds seasonal
 */

import axios from 'axios';

const GL_BASE = process.env.GREENLEAF_API_BASE;

const glClient = axios.create({
  baseURL: GL_BASE,
  timeout: 8000,  // 8s — fast fail so hybrid endpoints don't block the UI
  headers: {
    'Content-Type': 'application/json',
    'X-App-Origin': 'agro-analytic',
  },
});

// ─── Helper ───────────────────────────────────────────────────────────────────
const glGet = async (path, params = {}) => {
  if (!GL_BASE) throw new Error('GREENLEAF_API_BASE is not configured');
  const res = await glClient.get(path, { params });
  return res.data;
};

const glPost = async (path, body = {}) => {
  if (!GL_BASE) throw new Error('GREENLEAF_API_BASE is not configured');
  const res = await glClient.post(path, body);
  return res.data;
};

// ─── Commodity / General ──────────────────────────────────────────────────────
export const getCommoditiesList = (params = {}) =>
  glGet('/commoditiesv2', { page: 1, limit: 50, sort: 'commodity_name', order: 'asc', ...params });

// ─── Grains (Wheat, Corn, Rice, Maize etc) ────────────────────────────────────
export const getGrainCities = (type) =>
  glGet(`/grains/${type.toLowerCase()}/cities`);

export const getGrainContinuous = (type, { startDate, endDate, city = 'all' } = {}) =>
  glPost(`/grains/${type.toLowerCase()}/continuous`, {
    type: type.toLowerCase(),
    startDate,
    endDate,
    city,
  });

export const getGrainSeasonal = (type, { seasons, months = [], city = 'all' } = {}) =>
  glPost(`/grains/${type.toLowerCase()}/seasonal`, {
    seasons,
    months,
    city: Array.isArray(city) ? city[0] || 'all' : city,
  });

export const getWheatCornSpread = ({ startDate, endDate } = {}) =>
  glPost('/grains/spread/wheat-corn', { startDate, endDate });

// ─── Oil & Seeds (Soybean, Mustard, Cotton, Groundnut, Sunflower etc) ─────────
export const getOilSeedsMasters = () =>
  glGet('/grains/oil-and-seeds/masters');

export const getOilSeedsCommodities = (masterId) =>
  glGet('/grains/oil-and-seeds/masters/commodities', { masterId });

export const getOilSeedsLocations = (commodityId, type) =>
  glGet('/grains/oil-and-seeds/locations', { commodityId, type });

export const getOilSeedsContinuous = (commodityId, { startDate, endDate, locationId = 'all', locationType, variant, type } = {}) =>
  glPost('/grains/oil-and-seeds/continuous', { commodityId, startDate, endDate, locationId, locationType, variant, type });

export const getOilSeedsSeasonal = (commodityId, { seasons, months = [], locationId = 'all', locationType, variant, type } = {}) =>
  glPost('/grains/oil-and-seeds/seasonal', { commodityId, seasons, months, locationId, locationType, variant, type });

// ─── Sugar ────────────────────────────────────────────────────────────────────
export const getSugarContinuous = (commodityId, { startDate, endDate, page = 1, limit = 300, months = [] } = {}) =>
  glPost('/commodities/sugar/dashboard/global-spot-prices', {
    commodity_id: commodityId,
    start_date: startDate,
    end_date: endDate,
    page,
    limit,
    months,
  });

export const getSugarComparison = (commodityId, { page = 1, limit = 10 } = {}) =>
  glPost('/commodities/sugar/dashboard/comparison-prices', { commodity_id: commodityId, page, limit });

export const getSugarSeasonal = (commodityId, { seasons, months = [] } = {}) =>
  glPost('/commodities/sugar/dashboard/global-seasonal-prices', {
    commodity_id: commodityId,
    seasons: seasons?.length ? seasons : null,
    months,
  });

// ─── Connectivity Check ───────────────────────────────────────────────────────
export const checkGreenleafHealth = async () => {
  try {
    await glGet('/commoditiesv2', { limit: 1 });
    return { available: true };
  } catch (e) {
    return { available: false, reason: e.message };
  }
};

export default {
  getCommoditiesList,
  getGrainCities,
  getGrainContinuous,
  getGrainSeasonal,
  getWheatCornSpread,
  getOilSeedsMasters,
  getOilSeedsCommodities,
  getOilSeedsLocations,
  getOilSeedsContinuous,
  getOilSeedsSeasonal,
  getSugarContinuous,
  getSugarComparison,
  getSugarSeasonal,
  checkGreenleafHealth,
};
