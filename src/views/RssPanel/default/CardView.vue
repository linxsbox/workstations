<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<template>
  <section class="rss-card flex gap-3 p-3 rounded-lg cursor-default">
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
        {{ props.data.pubDate }}
        <span v-show="props.data.author" class="ml-2">
          {{ props.data.author }}
        </span>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.rss-card {
  background-color: var(--rss-card-bg-color);
  transition: background-color 0.3s 0.15s;

  &:hover {
    background-color: var(--rss-card-bg-color-hover);
    transition: background-color 0s;
  }

  .title {
    color: var(--rss-card-title-color);

    &:hover {
      text-decoration: underline;
    }
  }

  .description {
    color: var(--rss-card-description-color);
  }
  .foot {
    color: var(--rss-card-foot-color);
  }
}
</style>
