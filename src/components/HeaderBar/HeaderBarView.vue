<script setup>
import SearchBox from "./SearchBox.vue";
import { storeSettings } from "@/stores/storeSettings";
import { SettingSectionEnum } from "@/stores/storeSettings/config";

const store = storeSettings();
</script>

<template>
  <header class="header-bar-box flex gap-4 justify-center">
    <div class="search-box flex-auto">
      <SearchBox></SearchBox>
    </div>
    <div class="setting-box inline-flex justify-end gap-4 w-1/4">
      <button class="bg-transparent px-2 rounded-md" type="button">
        笔记
      </button>
      <button class="bg-transparent px-2 rounded-md" type="button">
        深色
      </button>
      <button
        class="bg-transparent px-2 rounded-md"
        type="button"
        @click="store.openSetting(SettingSectionEnum.GENERAL)"
      >
        设置
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped></style>
