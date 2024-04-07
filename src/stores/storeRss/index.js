import { defineStore } from "pinia";
import { localStorages } from "@/utils/index";
import RssConfig, { rssGroupType } from "../config";

import { storeSettings } from "../storeSettings/index";

// const USER_KEY = "USER_CONFIG";
// const chroemAPI = new ChromeAPI(USER_KEY);

const updateTimeStorage = localStorages("UPDATE_TIME");
const cacheData = localStorages("CACHE_DATA");

const checkUpdate = () => {
  const now = +new Date();
  const lastTime = updateTimeStorage.get() || 1;

  const diffmin = now - lastTime * 1 >= 10 * 60 * 1000 - 100;
  if (!diffmin) return false;

  updateTimeStorage.set(+new Date());
  return true;
};

export const storeRss = defineStore({
  id: "StoreRss",
  state: () => ({
    rssList: [],
  }),
  getters: {
    getRssList: (state) => state.rssList,
  },
  actions: {
    async init() {
      if (chrome && chrome.alarms) {
        chrome.alarms.onAlarm.addListener(() => {
          this.forceUpdate();
        });
      }

      return await this.fetchRssList();
    },
    async fetchRssList() {
      const cache = cacheData.get();
      const active = storeSettings().getRssTypeActive;

      if (cache && cache[active]) {
        this.rssList = cache[active] || [];
        return;
      }

      if (!checkUpdate() && cache[active] && this.rssList.length) return;

      const dataItems = RssConfig.filter((item) => item.group === active);

      const list = [];
      // 分类列表
      for (let index = 0; index < dataItems.length; index++) {
        const item = dataItems[index];

        if (active === rssGroupType.xiaoyuzhoufm) {
          const childData = await item.dataMatch(item);
          if (Array.isArray(childData) && childData.length) {
            list.push(...childData);
          } else {
            list.push(childData);
          }
        } else {
          const res = await fetch(item.apis.list);
          if (res.status !== 200) return;

          const data = await item.dataMatch(await res.text(), item);
          list.push({ ...data, id: dataItems.id });
        }
      }

      if (!cache) {
        cacheData.set({ [active]: [...list] });
      } else {
        cache[active] = list;
        cacheData.set(cache);
      }

      this.rssList = list;
    },
    async forceUpdate() {
      const cache = cacheData.get();
      Object.values(rssGroupType).forEach(async (active) => {
        const dataItems = RssConfig.filter((item) => item.group === active);

        const list = [];
        // 分类列表
        for (let index = 0; index < dataItems.length; index++) {
          const item = dataItems[index];

          if (active === rssGroupType.xiaoyuzhoufm) {
            const childData = await item.dataMatch(item);
            if (Array.isArray(childData) && childData.length) {
              list.push(...childData);
            } else {
              list.push(childData);
            }
          } else {
            const res = await fetch(item.apis.list);
            if (res.status !== 200) return;

            const data = await item.dataMatch(await res.text(), item);
            list.push({ ...data, id: dataItems.id });
          }
        }

        if (!cache) {
          cacheData.set({ [active]: [...list] });
        } else {
          cache[active] = list;
          cacheData.set(cache);
        }
      });
    },
  },

  setAddRss() {},
  setFollowRss() {},
});

// "USER_CONFIG";

// chrome.storage.local.set({
//   [this.Key]: ,
// });

// async rss() {
//   const temp = await getStorage();

//   return Object.freeze(temp.rss);
// }

// async theme() {
//   const temp = await getStorage();

//   return `${temp.theme}`;
// }
