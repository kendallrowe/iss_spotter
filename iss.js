const request = require("request");
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
// request(searchURL + breedName, callback(error, body));
  request("https://api.ipify.org?format=json", (error, response, body) => {
      
    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
      // if non-200 status, assume server error
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      callback(null, JSON.parse(body).ip.trim());
      return;
    }

  });
};

const fetchCoordsByIP = function(ip, callback) {
  request("https://ipvigilante.com/8.8.8.8", (error, response, body) => {
    const coordinatesObj = {};
    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
      // if non-200 status, assume server error
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      coordinatesObj.latitude = JSON.parse(body).data.latitude.trim();
      coordinatesObj.longitude = JSON.parse(body).data.longitude.trim();
      callback(null, coordinatesObj);
      return;
    }

  });
};

module.exports = { fetchMyIP, fetchCoordsByIP };