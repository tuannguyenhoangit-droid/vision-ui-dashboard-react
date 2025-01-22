import axios from "axios";
import { firebaseApp } from "../firebase";
import { getAuth } from "firebase/auth";
const auth = getAuth(firebaseApp);

axios.defaults.baseURL = process.env.REACT_APP_Server_Endpoint;

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
      .get(`/v1/future/openOrders`, {
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
      .get("/v1/future/incomePnL", {
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
      .get("/v1/future/positions", {
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
      .get("/v1/future/tradeList", {
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
      .get("/v1/future/balance", {
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
      .post("/v1/account/sign-in", payload, {
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
      .post("/v1/account/sign-up", payload, {
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
      .post("/v1/account/keys", payload, {
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
  autoTakeProfit,
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
    autoTakeProfit,
    optimizeEntry,
    buyRequireHistogram,
    optimizeEntryPercent,
  };
  return new Promise(async (resolve, reject) => {
    await axios
      .post("/v1/future/symbol-config", payload, {
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

export const quickChangeFrame = async (frame, buyRequireHistogram = []) => {
  const token = await auth.currentUser?.getIdToken?.();
  if (!token) return Promise.reject("Cannot get user token");
  const payload = {
    frame,
    buyRequireHistogram,
  };
  return new Promise(async (resolve, reject) => {
    await axios
      .post("/v1/future/symbol-config/quick-change-frame", payload, {
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
  if (!token) return Promise.reject("Cannot get user token");
  return new Promise(async (resolve, reject) => {
    await axios
      .get("/v1/future/symbol-config", {
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
  if (!token) return Promise.reject("Cannot get user token");
  return new Promise(async (resolve, reject) => {
    await axios
      .delete(`/v1/future/symbol-config/${symbol}`, {
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
  if (!token) return Promise.reject("Cannot get user token");
  return new Promise(async (resolve, reject) => {
    await axios
      .get(`/v1/future/ticker/price/${[symbol, "USDT"].join("")}`, {
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

export const getSubscription = async () => {
  const token = await auth.currentUser?.getIdToken?.();
  if (!token) return Promise.reject("Cannot get user token");
  return new Promise(async (resolve, reject) => {
    await axios
      .get("/v1/account/subscription", {
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

// /v1/payment-config 

export const getPaymentConfigs = async () => {
  const token = await auth.currentUser?.getIdToken?.();
  if (!token) return Promise.reject("Cannot get user token");
  return new Promise(async (resolve, reject) => {
    await axios.get("/v1/payment-configs", {
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

export const changeFutureActive = async (futureActive) => {
  const payload = {
    futureActive,
  };
  const token = await auth.currentUser?.getIdToken?.();
  if (!token) return Promise.reject("Cannot get user token");
  return new Promise(async (resolve, reject) => {
    await axios
      .post("/v1/account/future-active", payload, {
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

// createTransaction: curl -X POST http://localhost:3000/v1/transaction -H "Authorization: Bearer <token>" -d "{\"subscriptionId\":\"SUB_COPY_TRADING_LEADER\",\"network\":\"TRON\",\"priceType\":\"monthly\"}"

export const createTransaction = async (subscriptionId, network, priceType) => {
  const payload = {
    subscriptionId, network, priceType,
  };
  const token = await auth.currentUser?.getIdToken?.();
  if (!token) return Promise.reject("Cannot get user token");
  return new Promise(async (resolve, reject) => {
    await axios
      .post("/v1/transaction", payload, {
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
}

// getPendingTransaction: curl -X GET http://localhost:3000/v1/transaction -H "Authorization: Bearer <token>"

export const getPendingTransaction = async () => {
  const token = await auth.currentUser?.getIdToken?.();
  if (!token) return Promise.reject("Cannot get user token");
  return new Promise(async (resolve, reject) => {
    await axios.get("/v1/transaction", {
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
}

// validateTransaction: curl -X POST http://localhost:3000/v1/transaction/validate -H "Authorization: Bearer <token>" -d "{\"transactionId\":\"<transactionId>\",\"transactionHash\":\"<transactionHash>\"}"

export const validateTransaction = async (transactionId, transactionHash) => {
  const payload = {
    transactionId, transactionHash
  };
  const token = await auth.currentUser?.getIdToken?.();
  if (!token) return Promise.reject("Cannot get user token");
  return new Promise(async (resolve, reject) => {
    await axios
      .post("/v1/transaction/validate", payload, {
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
}

// cancelTransaction: curl -X POST http://localhost:3000/v1/transaction/cancel -H "Authorization: Bearer <token>" -d "{\"transactionId\":\"<transactionId>\"}"

export const cancelTransaction = async (transactionId) => {
  const payload = {
    transactionId,
  };
  const token = await auth.currentUser?.getIdToken?.();
  if (!token) return Promise.reject("Cannot get user token");
  return new Promise(async (resolve, reject) => {
    await axios
      .post("/v1/transaction/cancel", payload, {
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
}