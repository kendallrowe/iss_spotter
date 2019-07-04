// index.js
const { fetchMyIP, fetchCoordsByIP } = require('./iss');

// const ipForComputer = fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("IP search didn't work!" , error);
//     return;
//   }

//   return ip;
// });

// fetchCoordsByIP(ipForComputer, (error, data) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log("It worked!", data);
//   return;
// });

