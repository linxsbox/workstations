<script setup>
import { NRadioGroup, NRadio } from "naive-ui";
import { storeSettings } from "@/stores/storeSettings";
import {
  SettingSectionEnum,
  settingChildKeys,
  getSettingChildItems,
} from "@/stores/storeSettings/config";

const store = storeSettings();

const fontSizeOptions = getSettingChildItems(
  SettingSectionEnum.GENERAL,
  settingChildKeys.FONTSIZEOPTIONS
);
</script>

<template>
  <section class="setting-section">
    <h2 class="mb-4 text-lg font-bold text-[var(--text-primary)]">常规设置</h2>

    <!-- 主题设置 -->
    <div class="setting-item mb-6">
      <h3 class="setting-label text-base font-medium mb-3">主题模式</h3>
      <div class="px-5">
        <NRadioGroup v-model:value="store.themeMode" @update:value="store.setThemeMode">
          <div class="inline-flex gap-4">
            <NRadio value="system">跟随系统</NRadio>
            <NRadio value="light">明亮</NRadio>
            <NRadio value="dark">深色</NRadio>
          </div>
        </NRadioGroup>
      </div>
    </div>

    <!-- 字体习惯设置 -->
    <div class="setting-item mb-6">
      <h3 class="setting-label text-base font-medium mb-3">字体大小</h3>
      <div class="px-5">
        <NRadioGroup v-model:value="store.fontSize" @update:value="store.setFontSize">
          <div class="inline-flex flex-wrap gap-4">
            <NRadio v-for="option in fontSizeOptions" :key="option.value" :value="option.value">
              <span class="mr-2">{{ option.label }}</span>
              <span class="text-xs gray">({{ option.value }}px)</span>
            </NRadio>
          </div>
        </NRadioGroup>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
