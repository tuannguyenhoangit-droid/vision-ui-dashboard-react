import axios from "axios";

export const getBestPerformanceVolume = async (period = "DAY_1", dayAgo = 7) => {
  return new Promise(async (resolve, reject) => {
    await axios
      .get(`http://localhost:3000/top-volume-performance?period=${period}&dayAgo=${dayAgo}`)
      .then((response) => {
        console.log("response", response);

        resolve(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  });
};

export const getCurrentPositions = async () => {
  return new Promise(async (resolve, reject) => {
    await axios
      .get(`https://sa.premierct.asia/v1/future/positions`)
      .then((response) => {
        console.log("response", response);

        resolve(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  });
};
