const SPLIT_KEY = "@@1|";

const getData = (eventName, key) => {
  const tmpOrigin = window[eventName].getItem(key);
  if (!tmpOrigin) return tmpOrigin;

  const res = tmpOrigin.trim();
  if (!/^@@\d\|/.test(res)) {
    if (/^-?\d+$/.test(res)) return res * 1;
    return res;
  }
  const data = res.split(SPLIT_KEY)[1];
  if (!data) return;

  return JSON.parse(data);
};

const setData = (eventName, key, data) => {
  try {
    if (
      (typeof data === "object" && Object.keys(data).length >= 0) ||
      Array.isArray(data)
    ) {
      window[eventName].setItem(key, `${SPLIT_KEY}${JSON.stringify(data)}`);
    } else {
      window[eventName].setItem(key, `${data}`.trim());
    }
  } catch (error) {
    console.log(error);
  }
};

export const localStorages = (key = "") => {
  const KEY = `${key}`;

  return {
    get: () => getData("localStorage", KEY),
    set: (data) => setData("localStorage", KEY, data),
  };
};

export const sessionStorages = (key = "") => {
  const KEY = `${key}`;

  return {
    get: () => getData("sessionStorage", KEY),
    set: (data) => setData("sessionStorage", KEY, data),
  };
};

export const localStorageItem = {
  get: (key = "") => localStorages(key).get(),
  set: (key = "", data) => {
    if (!`${key}`) return;
    localStorages(key).set(data);
  },
};

export const sessionStorageItem = {
  get: (key = "") => sessionStorages(key).get(),
  set: (key = "", data) => {
    if (!`${key}`) return;
    sessionStorages(key).set(data);
  },
};
