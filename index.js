// index.js
const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

// // fetch IP Address
// fetchMyIP((error, ip) => {

//   if (error) {
//     console.log("IP search didn't work!" , error);
//     return;
//   }
  
//   fetchCoordsByIP(ip, (error, coordinates) => {
//     if (error) {
//       console.log("It didn't work!" , error);
//       return;
//     }
  
//     console.log("It worked!", coordinates);
//     fetchISSFlyOverTimes(coordinates, (error, data) => {
//       if (error) {
//         console.log("It didn't work!" , error);
//         return;
//       }
    
//       console.log("It worked!", data);
//       return;
//     });
//     return;
//   });
// });