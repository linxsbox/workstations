import { markRaw } from "vue";
import RssPanelView from "@/views/RssPanel/RssPanelView.vue";
import ToolsPanelView from "@/views/ToolsPanel/ToolsPanelView.vue";

import IconHome from "@/components/Icons/IconHome.vue";
import IconWork from "@/components/Icons/IconWork.vue";
import IconMark from "@/components/Icons/IconMark.vue";
import IconShare from "@/components/Icons/IconShare.vue";

// 面板配置
export const panelConfig = {
  rss: {
    id: "home",
    icon: markRaw(IconHome),
    label: "首页",
    component: markRaw(RssPanelView),
  },
  tools: {
    id: "tools",
    icon: markRaw(IconWork),
    label: "工具",
    component: markRaw(ToolsPanelView),
  },
  favorites: {
    id: "favorites",
    icon: markRaw(IconMark),
    label: "收藏",
    component: null, // 待实现
  },
  share: {
    id: "share",
    icon: markRaw(IconShare),
    label: "分享",
    component: null, // 待实现
  },
};

// 默认面板
export const DEFAULT_PANEL = "rss";

// 获取所有可用的面板 keys
export const getPanelKeys = () => Object.keys(panelConfig);

// 检查面板是否有效
export const isPanelValid = (panelKey) =>
  panelConfig[panelKey] && panelConfig[panelKey].component;
