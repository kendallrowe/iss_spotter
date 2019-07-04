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
  request("https://ipvigilante.com/" + ip, (error, response, body) => {
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
      const coordinatesObj = {};
      coordinatesObj.latitude = JSON.parse(body).data.latitude.trim();
      coordinatesObj.longitude = JSON.parse(body).data.longitude.trim();
      callback(null, coordinatesObj);
      return;
    }

  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const lat = coords.latitude;
  const lon = coords.longitude;
  request(`http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`, (error, response, body) => {
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
      callback(null, JSON.parse(body));
      return;
    }

  });
};

// iss.js

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const dateStringConversion = function(timestamp) {
  const date = new Date(timestamp * 1000);
  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = weekday[date.getDay() - 1];
  // Hours part from the timestamp
  const hours = date.getHours();
  // Minutes part from the timestamp
  const minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  const seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  return `Next pass at ${day} ${month} ${year} ${formattedTime} GMT-0700 (Pacific Daylight Time)`;
  // Next pass at Fri Jun 01 2021 13:01:35 GMT-0700 (Pacific Daylight Time) for 465 seconds!
};

const nextISSTimesForMyLocation = function(callback) {
  // fetch IP Address
  fetchMyIP((error, ip) => {

    if (error) {
      console.log("IP search didn't work!" , error);
      callback(error, null);
    }
    
    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        console.log("It didn't work!" , error);
        callback(error, null);
      }
    
      fetchISSFlyOverTimes(coordinates, (error, data) => {
        let outputStringArray = [];
        let outputString = "";
        if (error) {
          console.log("It didn't work!" , error);
          callback(error, null);
        }
        
        data.response.forEach((pass) => {
          outputString = dateStringConversion(pass.risetime);
          outputString += ` for ${pass.duration} seconds!`;
          outputStringArray.push(outputString);
        });

        callback(null, outputStringArray);
        
      });
      return;
    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };