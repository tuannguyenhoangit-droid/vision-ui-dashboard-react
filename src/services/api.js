import axios from "axios";

export const getBestPerformanceVolume = async (period = "DAY_1", dayAgo = 5) => {
  return new Promise(async (resolve, reject) => {
    await axios
      .get(`http://localhost:3000/top-volume-performance?period=${period}&dayAgo=${dayAgo}`)
      .then((response) => {
        resolve(response.data.slice(0, 6));
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
        resolve(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  });
};

export const getTradeList = async () => {
  return new Promise(async (resolve, reject) => {
    await axios
      .get(`https://sa.premierct.asia/v1/future/tradeList`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  });
};

export const getBalance = async () => {
  return new Promise(async (resolve, reject) => {
    await axios
      .get(`https://sa.premierct.asia/v1/future/balance`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  });
};
