/**
 * Calculate distance between two geographic points using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2)); // Return distance rounded to 2 decimal places
};

/**
 * Filter items by distance radius
 * @param {array} items - Array of items with latitude and longitude
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {array} Filtered items within radius
 */
export const filterByDistance = (items, userLat, userLon, radiusKm = 10) => {
  return items.filter((item) => {
    if (!item.latitude || !item.longitude) return false;
    const distance = calculateDistance(userLat, userLon, item.latitude, item.longitude);
    return distance <= radiusKm;
  });
};

/**
 * Sort items by distance from user location
 * @param {array} items - Array of items with latitude and longitude
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @returns {array} Items sorted by distance (closest first)
 */
export const sortByDistance = (items, userLat, userLon) => {
  if (!userLat || !userLon) return items;

  return [...items].sort((a, b) => {
    if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) return 0;
    const distanceA = calculateDistance(userLat, userLon, a.latitude, a.longitude);
    const distanceB = calculateDistance(userLat, userLon, b.latitude, b.longitude);
    return distanceA - distanceB;
  });
};
