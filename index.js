const { nextISSTimesForMyLocation } = require('./iss');
nextISSTimesForMyLocation((error, outputArray) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  } else {
    for (const pass of outputArray) {
      console.log(pass);
    }
    return;
  }
});

