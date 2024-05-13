<script setup>
import { isMobileDevice } from "@/utils/tools.js";
import HeaderBarView from "@/components/HeaderBar/HeaderBarView.vue";
import RssPanelView from "./views/RssPanel/default/RssPanelView.vue";
import RssPanelThemeView from "./views/RssPanel/theme/RssPanelView.vue";
import RssClassficatioin from "./components/AsideBar/RssClassficatioin.vue";

import { storeRss } from "@/stores/storeRss/index";
import { storeSettings } from "@/stores/storeSettings/index";
import { rssGroupType } from "@/stores/config";

const store = storeRss();
const { getRssList } = storeToRefs(store);
store.init();

const { getRssTypeActive } = storeToRefs(storeSettings());

if (isMobileDevice()) {
  // 执行移动设备上的代码
} else {
  // 执行桌面设备上的代码
}
</script>

<template>
  <HeaderBarView class="flex-none" />
  <div class="relative flex-1 w-full h-full overflow-hidden">
    <!-- rss aside -->
    <RssClassficatioin class="absolute top-0 left-0" />

    <!-- container -->
    <div class="container flex-auto w-full h-full p-5 m-auto overflow-hidden">
      <div
        class="rss-box flex gap-5 h-full pb-4 overflow-x-auto overflow-y-hidden"
        v-if="getRssTypeActive === rssGroupType.xiaoyuzhoufm"
      >
        <RssPanelThemeView
          v-for="item in getRssList"
          :data="item"
          :key="item.id"
        />
      </div>
      <div
        class="rss-box flex gap-5 h-full pb-4 overflow-x-auto overflow-y-hidden"
        v-else
      >
        <RssPanelView v-for="item in getRssList" :data="item" :key="item.id" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
}
</style>
