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
        // .post("http://localhost:3333/v1/account/sign-in", payload, {
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

export const accountSignUp = async (displayName, email, passwordEncrypted) => {
  const payload = {
    displayName,
    email,
    passwordEncrypted,
  };

  return new Promise(async (resolve, reject) => {
    await axios
      .post("https://sa.premierct.asia/v1/account/sign-up", payload, {
        // .post("http://localhost:3333/v1/account/sign-up", payload, {
        headers: {
          "Content-Type": "application/json",
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
  side = "BUY",
  symbol,
  buyAmount,
  maxBudget,
  frame,
  requireHistogramCondition,
  buyRequireHistogram = [],
  optimizeEntry,
  optimizeEntryPercent
) => {
  const token = await auth.currentUser?.getIdToken?.();
  const payload = {
    side,
    symbol,
    buyAmount,
    maxBudget,
    frame,
    requireHistogramCondition,
    optimizeEntry,
    buyRequireHistogram,
    optimizeEntryPercent,
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

export const deleteSymbolConfig = async (symbol) => {
  const token = await auth.currentUser?.getIdToken?.();
  if (!token) return [];
  return new Promise(async (resolve, reject) => {
    await axios
      .delete(`https://sa.premierct.asia/v1/future/symbol-config/${symbol}`, {
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

export const getTickerPrice = async (symbol) => {
  const token = await auth.currentUser?.getIdToken?.();
  if (!token) return {};
  return new Promise(async (resolve, reject) => {
    await axios
      .get(`https://sa.premierct.asia/v1/future/ticker/price/${[symbol, "USDT"].join("")}`, {
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
