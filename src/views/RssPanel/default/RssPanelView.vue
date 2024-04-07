<script setup>
import CardView from "./CardView.vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ list: [], color: { themeRGB: "" } }),
  },
});
</script>

<template>
  <div class="rss-panel-box flex flex-col flex-none overflow-hidden">
    <div
      class="rss-list-box flex-auto flex flex-col gap-3 px-4 pb-4 overflow-y-auto overflow-x-hidden"
    >
      <!-- Rss 列表表头 -->
      <header
        class="rss-header sticky top-0 flex-none flex gap-2 items-center p-4 -mx-4 z-10"
      >
        <figure class="flex-none h-12">
          <picture class="">
            <img
              class="size-12"
              :src="props.data.image"
              v-if="props.data.image"
            />
          </picture>
        </figure>
        <div class="flex-auto">
          <a
            class="title text-lg pb-1"
            :href="props.data.home"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ props.data.title }}
          </a>
          <div class="flex justify-between h-[14px] text-14 leading-none">
            <div>{{ props.data.author }}</div>
            <div>{{ props.data.description }}</div>
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
  --rss-card-title-color: #2196f3;
  --rss-card-bg-color-hover: #dff3fc;

  width: 480px;
  background-color: var(--rss-bg-color);
  border-radius: var(--border-radius);

  .rss-list-box {
    .rss-header {
      background-color: rgba(160, 212, 255, 0.6);
      border-bottom: 1px solid rgb(var(--origin-theme-rgb, --border-color-4));
      backdrop-filter: blur(6px);

      .title {
        color: rgb(var(--origin-theme-rgb));
        text-shadow: 1px 1px 1px var(--rss-head-shadow-color);
        font-weight: bold;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

@media (prefers-color-scheme: dark) {
  .rss-panel-box {
    --rss-card-title-color: #439dec;
    --rss-card-bg-color-hover: #18191a;

    .rss-list-box {
      .rss-header {
        background-color: rgba(53, 93, 126, 0.6);

        .title {
          color: #69b9ff;
        }
      }
    }
  }
}
</style>
