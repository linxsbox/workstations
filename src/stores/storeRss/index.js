import { defineStore } from "pinia";
import { localStorage } from "@linxs/toolkit";
import { RSS_SOURCE_TYPES } from "./config";
import { RssProcessorFactory } from "./processor";
import { storeTab } from "../storeTab/index";

const STORAGE_KEY = "USER_RSS_SOURCES";

export const storeRss = defineStore({
  id: "StoreRss",

  state: () => ({
    // RSS 源列表
    sources: localStorage.get(STORAGE_KEY) || [],
    // 添加源对话框显示状态
    showAddDialog: false,
    // 当前显示的数据内容
    currentList: [],
  }),

  getters: {
    // 获取所有 RSS 源
    getSources: (state) => state.sources,
    getCurrentList: (state) => state.currentList,
  },

  actions: {
    // 显示添加源对话框
    openAddDialog() {
      this.showAddDialog = true;
    },

    // 关闭添加源对话框
    closeAddDialog() {
      this.showAddDialog = false;
    },

    // 添加 RSS 源
    async addSource(source, cover = false) {
      // 检查是否已存在相同的源
      const exists = this.sources.some((s) => s.sourceUrl === source.sourceUrl);
      if (exists) {
        throw new Error("该 RSS 源已存在");
      }

      try {
        // 使用工厂方法创建处理器并验证源
        const processor = RssProcessorFactory.create(source);
        await processor.validate();

        // 获取源信息
        const sourceInfo = await processor.fetchSourceInfo();

        // 合并源信息和用户提供的信息
        const newSource = {
          ...source,
          ...sourceInfo,
        };

        this.sources.push(newSource);
        this.saveSources();
        this.closeAddDialog();

        const rssInfo = getRssTypeInfo(source.type);
        const tab = storeTab();
        if (rssInfo) {
          tab.addTab("rss", {
            label: rssInfo.label,
            value: rssInfo.value,
          });
        } else {
          tab.addTab("rss", {
            label: source.name,
            value: source.type,
          });
        }

        return newSource;
      } catch (error) {
        console.error("添加 RSS 源失败:", error);
        throw new Error(`添加 RSS 源失败: ${error.message}`);
      }
    },

    // 删除 RSS 源
    removeSource(sourceId) {
      const index = this.sources.findIndex((s) => s.id === sourceId);
      if (index !== -1) {
        this.sources.splice(index, 1);
        this.saveSources();
      }
    },

    // 更新 RSS 源
    updateSource(sourceId, updates) {
      const source = this.sources.find((s) => s.id === sourceId);
      if (source) {
        Object.assign(source, updates);
        this.saveSources();
      }
    },

    // 保存到 localStorage
    saveSources() {
      localStorage.set(STORAGE_KEY, this.sources);
    },

    // 初始化
    init() {
      // 初始化 RSS 源
      if (this.sources.length === 0) {
        this.sources = [];
        this.saveSources();
      }
      const tab = storeTab();

      // 初始化显示数据
      this.switchSourceData(tab.getActiveTabId("rss"));
    },

    // 切换数据显示
    switchSourceData(tabId) {
      // 为显示列表项服务并排序
      const newList = (list = []) => {
        const tmpList = [];
        list.forEach((item) => {
          tmpList.push(item);
          // item.list &&
          //   item.list.forEach((tmp) => {
          //     tmpList.push(tmp);
          //   });
        });

        // tmpList.sort((a, b) => b.timestamp - a.timestamp);

        return tmpList;
      };

      this.currentList =
        tabId === "all"
          ? newList(this.getSources)
          : newList(this.getSources.filter((item) => item.type === tabId));
    },
  },
});

// 获取 RSS 类型信息
const getRssTypeInfo = (type) => {
  return RSS_SOURCE_TYPES.find((item) => item.value === type);
};
