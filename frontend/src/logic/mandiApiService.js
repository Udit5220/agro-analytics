// services/mandiApiService.js
import apiClient from "./apiClient";

/**
 * Get historical spot prices for a commodity
 * Uses existing NCDEX/MCX backend APIs
 */
export const getHistoricalSpotPrices = async (
  commodityId,
  fromDate,
  toDate,
  cityId = null,
) => {
  try {
    const payload = {
      fromDate: fromDate || getDefaultStartDate(),
      toDate: toDate || getCurrentDate(),
      source: "NCDEX",
      commodity_id: [commodityId],
      page: 1,
      limit: 100,
    };

    if (cityId) {
      payload.city_id = [cityId];
    }

    const response = await apiClient.post(
      "/commoditiesv2/get-ncdex-spot-prices",
      payload,
    );

    if (response?.data?.success) {
      return {
        success: true,
        data: response.data.data,
        metadata: {
          wow_change: response.data.wow_change_percent,
          mom_change: response.data.mom_change_percent,
          yoy_change: response.data.yoy_change_percent,
        },
      };
    }
    throw new Error("No spot price data available");
  } catch (error) {
    console.error("Failed to fetch spot prices:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get future/expiry price curves
 * Uses existing expiry graph API
 */
export const getFuturePriceCurve = async (commodityId, fromDate, toDate) => {
  try {
    const payload = {
      fromDate: fromDate || getDefaultStartDate(),
      toDate: toDate || getCurrentDate(),
      commodity_id: commodityId,
      source: "NCDEX",
    };

    const response = await apiClient.post(
      "/commoditiesv2/get-ncdex-expiry-graph-data",
      payload,
    );

    if (response?.data?.success) {
      return {
        success: true,
        data: response.data.data, // Array of expiry contracts with price points
        metadata: {
          contractCount: response.data.data?.length || 0,
          farthestExpiry: getFarthestExpiry(response.data.data),
        },
      };
    }
    throw new Error("No expiry graph data available");
  } catch (error) {
    console.error("Failed to fetch future price curve:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get commodity ID mapping (crop name → backend commodity_id)
 * You'll need to create this mapping based on your database
 */
export const getCommodityId = (cropName, district) => {
  // This mapping should come from your backend
  // For now, hardcoded based on your existing data
  const commodityMap = {
    Rice: "commodity_rice_id",
    Paddy: "commodity_rice_id",
    Wheat: "commodity_wheat_id",
    Cotton: "commodity_cotton_id",
    Mustard: "commodity_mustard_id",
  };

  const cropKey = cropName?.split(" ")[0] || "Wheat";
  return commodityMap[cropKey] || "commodity_default_id";
};

/**
 * Get district ID from name (using your existing location API)
 */
export const getDistrictId = async (districtName, stateName) => {
  try {
    const response = await apiClient.get("/districts", {
      params: { name: districtName, state: stateName },
    });

    if (response?.data?.success && response.data.data?.length > 0) {
      return response.data.data[0]._id;
    }
    return null;
  } catch (error) {
    console.error("Failed to get district ID:", error);
    return null;
  }
};

// Helper functions
const getDefaultStartDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split("T")[0];
};

const getCurrentDate = () => {
  return new Date().toISOString().split("T")[0];
};

const getFarthestExpiry = (contracts) => {
  if (!contracts?.length) return null;
  const dates = contracts.map((c) => new Date(c.expiry_date));
  return new Date(Math.max(...dates)).toISOString().split("T")[0];
};
