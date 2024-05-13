<script setup>
import CardView from "./CardView.vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ list: [], color: { themeRGB: "" } }),
  },
});

const originThemeColor = computed(() => {
  return {
    "--origin-theme-rgb": props.data.color.themeRGB,
    "--origin-theme-header-bg-color":
      "linear-gradient(45deg, rgba(var(--origin-theme-rgb), 0.35), rgba(var(--origin-theme-rgb), 0.15))",
  };
});
</script>

<template>
  <div class="rss-panel-box flex flex-col flex-none overflow-hidden">
    <div
      class="rss-list-box flex-auto flex flex-col gap-3 px-4 pb-4 overflow-y-auto overflow-x-hidden"
      :style="originThemeColor"
    >
      <!-- Rss 列表表头 -->
      <header
        class="rss-header sticky top-0 flex-none flex gap-2 items-center p-4 -mx-4 z-10"
      >
        <figure class="flex-none h-12">
          <picture>
            <img
              class="size-12 rounded-lg"
              :src="props.data.image"
              v-if="props.data.image"
            />
          </picture>
        </figure>
        <div class="flex-auto">
          <div class="title text-lg pb-1">
            {{ props.data.title }}
          </div>
          <div class="flex justify-between h-[14px] text-14 leading-none">
            <div>{{ props.data.author }}</div>
            <div>{{ props.data.brief }}</div>
          </div>
        </div>
      </header>

      <!-- Rss 列表卡片 -->
      <CardView
        v-for="item in props.data.list"
        :data="item"
        :key="item.link"
      ></CardView>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rss-panel-box {
  width: 480px;
  background-color: var(--rss-bg-color);
  border-radius: var(--border-radius);

  .rss-list-box {
    .rss-header {
      background-image: var(--origin-theme-header-bg-color);
      border-bottom: 1px solid rgb(var(--origin-theme-rgb, --border-color-4));
      backdrop-filter: blur(6px);

      .title {
        color: rgb(var(--origin-theme-rgb));
        text-shadow: 1px 1px 1px var(--rss-head-shadow-color);
        font-weight: bold;
      }
    }
  }
}
.is-window {
  .rss-list-box {
    --scrollbar-thumb: rgba(var(--origin-theme-rgb), 0.35);
    --scrollbar-thumb-hover: rgba(var(--origin-theme-rgb), 0.65);
  }
}
</style>
