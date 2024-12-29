<script setup>
import { NButton, NTag, NPopconfirm, useMessage } from "naive-ui";
import IconClose from "@/components/Icons/IconClose.vue";
import { storeRss } from "@/stores/storeRss";
import { RSS_SOURCE_TYPES } from "@/stores/storeRss/config";

const store = storeRss();

const message = useMessage();

// 获取所有订阅源
const rssSources = computed(() => store.getSources);

// 获取源类型映射
const sourceTypeMap = computed(() =>
  RSS_SOURCE_TYPES.reduce((map, type) => {
    map[type.value] = type.label;
    return map;
  }, {})
);

// 处理删除订阅源
const handleDeleteSource = (sourceId) => {
  store.removeSource(sourceId);

  const st = setTimeout(() => {
    message.success("已取消关注");
    clearTimeout(st);
  }, 350);
};

// 获取主题颜色，如果有的情况
const getThemeColor = (theme = null) => {
  return theme && theme.color ? { color: theme.color } : {};
};
</script>

<template>
  <section class="managent-rss-section">
    <h2
      class="flex justify-between items-center pr-4 mb-4 text-lg font-bold text-[var(--text-primary)]"
    >
      <span>管理订阅源</span>
      <div class="inline-flex items-center gap-2 text-sm">
        <NButton
          type="primary"
          size="small"
          tertiary
          @click="handleShowImportDialog(0)"
        >
          导出
        </NButton>
        <NButton
          type="primary"
          size="small"
          tertiary
          @click="handleShowImportDialog(1)"
        >
          导入
        </NButton>
      </div>
    </h2>
    <div class="managent-rss-item flex flex-wrap gap-3 pr-4 mb-6">
      <NTag v-for="source in rssSources" :key="source.id">
        <div class="flex gap-2">
          <div>{{ sourceTypeMap[source.type] }}</div>
          <div :style="getThemeColor(source.theme)">{{ source.title }}</div>
          <NPopconfirm
            positive-text="取消关注"
            negative-text="关闭"
            @positive-click="handleDeleteSource(source.id)"
          >
            取消关注【{{ source.title || "此订阅源" }}】？
            <template #trigger>
              <IconClose
                class="text-[var(--color-bg-error-hover)] hover:text-[var(--color-error)] cursor-pointer"
              />
            </template>
          </NPopconfirm>
        </div>
      </NTag>
      <div v-if="rssSources.length === 0" class="text-center text-gray-500">
        暂无订阅源
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
