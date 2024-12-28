import axios from "axios";
import { firebaseApp } from "../firebase";
import { getAuth } from "firebase/auth";
const auth = getAuth(firebaseApp);

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

export const getOpenOrders = async () => {
  const token = await auth.currentUser?.getIdToken?.();
  if (!token) return [];
  return new Promise(async (resolve, reject) => {
    await axios
      .get(`https://sa.premierct.asia/v1/future/openOrders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: ["Bearer", token].join(" "),
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  });
};

export const getIncomePnL = async () => {
  const token = await auth.currentUser?.getIdToken?.();
  if (!token) return [];
  return new Promise(async (resolve, reject) => {
    await axios
      .get(`https://sa.premierct.asia/v1/future/incomePnL`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: ["Bearer", token].join(" "),
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  });
};

export const getCurrentPositions = async () => {
  const token = await auth.currentUser?.getIdToken?.();
  if (!token) return [];
  return new Promise(async (resolve, reject) => {
    await axios
      .get(`https://sa.premierct.asia/v1/future/positions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: ["Bearer", token].join(" "),
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  });
};

export const getTradeList = async () => {
  const token = await auth.currentUser?.getIdToken?.();
  if (!token) return [];
  return new Promise(async (resolve, reject) => {
    await axios
      .get(`https://sa.premierct.asia/v1/future/tradeList`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: ["Bearer", token].join(" "),
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  });
};

export const getBalance = async () => {
  const token = await auth.currentUser?.getIdToken?.();
  if (!token) return [];
  return new Promise(async (resolve, reject) => {
    await axios
      .get(`https://sa.premierct.asia/v1/future/balance`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: ["Bearer", token].join(" "),
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  });
};

/**
 * SYMBOL CONFIGS
 */

export const userSignIn = async (displayName, email, uid, photoURL) => {
  const token = await auth.currentUser?.getIdToken?.();
  const payload = {
    displayName,
    email,
    uid,
    photoURL,
  };

  return new Promise(async (resolve, reject) => {
    await axios
      .post("https://sa.premierct.asia/v1/account/sign-in", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: ["Bearer", token].join(" "),
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  });
};

export const accountUpdateKeys = async (signature) => {
  const token = await auth.currentUser?.getIdToken?.();
  const payload = {
    signature,
  };

  return new Promise(async (resolve, reject) => {
    await axios
      .post("https://sa.premierct.asia/v1/account/keys", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: ["Bearer", token].join(" "),
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  });
};

export const createSymbolConfig = async (
  symbol,
  frame,
  buyAmount,
  maxBudget,
  optimizeEntry,
  side = "BUY",
  buyRequireHistogram = []
) => {
  const token = await auth.currentUser?.getIdToken?.();
  const payload = {
    symbol,
    frame,
    buyAmount,
    maxBudget,
    optimizeEntry,
    side,
    buyRequireHistogram,
  };
  return new Promise(async (resolve, reject) => {
    await axios
      .post("https://sa.premierct.asia/v1/future/symbol-config", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: ["Bearer", token].join(" "),
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  });
};

export const getSymbolConfig = async () => {
  const token = await auth.currentUser?.getIdToken?.();
  if (!token) return [];
  return new Promise(async (resolve, reject) => {
    await axios
      .get("https://sa.premierct.asia/v1/future/symbol-config", {
        headers: {
          "Content-Type": "application/json",
          Authorization: ["Bearer", token].join(" "),
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  });
};
