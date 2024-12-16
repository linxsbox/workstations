<script setup>
import { storeAside } from "@/stores/storeAside";

const store = storeAside();
const { getMenuItems, getActiveMenuId } = storeToRefs(store);

const handleSwitchMenuItem = (panel) => {
  store.switchPanel(panel);
};
</script>

<template>
  <div class="menu-box flex flex-col gap-3">
    <button class="aside-menu-button bg-transparent inline-flex gap-2 py-2 px-4 cursor-pointer rounded-md" type="button"
      :class="{ active: getActiveMenuId === item.id }" :key="item.id" v-for="item in getMenuItems"
      @click="handleSwitchMenuItem(item.panel)">
      <div class="menu-icon"></div>
      <div class="menu-label">{{ item.label }}</div>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.aside-menu-button {
  color: var(--text-primary);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--interactive-bg-hover-1);
  }

  &:active {
    background-color: var(--interactive-bg-active-1);
  }

  &.active {
    background-color: var(--interactive-bg-hover-1);
  }
}
</style>
