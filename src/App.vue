<script setup>
import { NConfigProvider, NMessageProvider } from "naive-ui";
import { themeOverrides } from "./theme/index.js";

import MainPanelView from "./views/MainPanel/MainPanelView.vue";
import AsidePanelView from "./views/AsidePanel/AsidePanelView.vue";
import SettingDialog from "./views/SettingDialog/SettingDialog.vue";
import AddRssDialog from "./views/SettingDialog/AddRssDialog.vue";

import { storeRss } from "@/stores/storeRss/index";
import { storeSettings } from "@/stores/storeSettings/index";
import { rssGroupType } from "@/stores/config";
import { onMounted } from "vue";

const storeRssInstance = storeRss();
const { getRssList } = storeToRefs(storeRssInstance);
storeRssInstance.init();

const storeSettingsInstance = storeSettings();
const { getRssTypeActive } = storeToRefs(storeSettingsInstance);

onMounted(() => {
  storeSettingsInstance.initializeSettings();
});
</script>

<template>
  <NConfigProvider class="inherit-app" :theme-overrides="themeOverrides">
    <NMessageProvider>
      <AsidePanelView />
      <MainPanelView />

      <SettingDialog />
      <AddRssDialog />
    </NMessageProvider>
  </NConfigProvider>
</template>

<style lang="scss" scoped>
.inherit-app {
  display: inherit;
  width: inherit;
  height: inherit;
  margin: inherit;
  overflow: inherit;
}
</style>
