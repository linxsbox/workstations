import { defineStore } from "pinia";
import { localStorages } from "@/utils/index";
import { rssGroupType } from "../config";

const rssActive = localStorages("USER_RSS_ACTIVE");

export const storeSettings = defineStore({
  id: "StoreSettings",
  state: () => ({
    rssTypeActive: rssActive.get() || rssGroupType.xiaoyuzhoufm,
  }),
  getters: {
    getRssTypeActive: (state) => state.rssTypeActive,
  },
  actions: {
    init() {},
    setRssTypeActive(key = "") {
      if (!key) return;

      rssActive.set(key);
      this.rssTypeActive = key;
    },
  },
});
