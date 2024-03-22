<script setup>
import PlayButton from "@/components/PlayButton/PlayButton.vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const clickPlay = () => {
  console.log("play");
};
const clickStop = () => {
  console.log("stop");
};
</script>

<template>
  <section class="rss-card flex gap-3 p-3 rounded-lg cursor-default">
    <div class="media">
      <PlayButton
        class="text-4xl"
        style="
          color: rgb(var(--origin-theme-rgb));
          --play-button-bg-color: var(--origin-theme-rgb);
        "
        @play="clickPlay"
        @stop="clickStop"
      ></PlayButton>
    </div>
    <div class="info">
      <a
        class="title text-14 font-bold cursor-pointer"
        :href="props.data.link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ props.data.title }}
      </a>
      <div class="description mt-1 text-sm break-words line-clamp-2">
        {{ props.data.description }}
      </div>
      <div class="foot mt-3 text-xs font-medium">
        {{ props.data.duration }} · {{ props.data.timeAgo }}
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.rss-card {
  background-color: var(--rss-card-bg-color);
  transition: background-color 0.3s 0.15s;

  &:hover {
    background-color: var(
      --rss-card-bg-color-hover,
      rgba(var(--origin-theme-rgb), 0.05)
    );

    transition: background-color 0s;
  }

  .title {
    color: var(--rss-card-title-color, rgb(var(--origin-theme-rgb)));
  }
  &:hover .title {
    text-decoration: underline;
  }
  .description {
    color: var(--rss-card-description-color);
  }
  .foot {
    color: var(--rss-card-foot-color);
  }
}
</style>
