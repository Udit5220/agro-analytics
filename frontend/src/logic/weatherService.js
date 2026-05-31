// services/weatherService.js
export const fetchOpenMeteoWeather = async (latitude, longitude) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API failed: ${response.status}`);
    }

    const data = await response.json();

    // Get current conditions
    const currentTemp =
      data.current?.temperature_2m || data.hourly?.temperature_2m?.[0] || 25;
    const currentHumidity =
      data.current?.relative_humidity_2m ||
      data.hourly?.relative_humidity_2m?.[0] ||
      60;
    const currentRainfall =
      data.current?.precipitation || data.hourly?.precipitation?.[0] || 0;
    const currentWindSpeed = data.current?.wind_speed_10m || 5;

    // Get forecast for next 7 days
    const forecast = [];
    if (data.hourly && data.hourly.time) {
      for (let i = 0; i < 168 && i < data.hourly.time.length; i += 24) {
        forecast.push({
          date: data.hourly.time[i],
          temperature: data.hourly.temperature_2m[i] || currentTemp,
          humidity: data.hourly.relative_humidity_2m[i] || currentHumidity,
          rainfall: data.hourly.precipitation[i] || 0,
        });
      }
    }

    return {
      temperature: Math.round(currentTemp),
      humidity: Math.round(currentHumidity),
      rainfall: Math.round(currentRainfall),
      windSpeed: Math.round(currentWindSpeed),
      forecast: forecast.slice(0, 7),
      timestamp: new Date().toISOString(),
      source: "Open-Meteo",
    };
  } catch (error) {
    console.error("Open-Meteo fetch error:", error);
    throw error;
  }
};
