<script setup>
import { NInput, NButton, NTag, NPopconfirm, useMessage } from "naive-ui";
import IconClose from "@/components/Icons/IconClose.vue";
import DataImportExport from "@/components/DataImportExportManager/DataImportExport.vue";
import { storeRss } from "@/stores/storeRss";
import { RssSourceTypeEnum, RSS_SOURCE_TYPES } from "@/stores/storeRss/config";

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

// 显示导入对话框
const showImportDialog = ref(false);
const isImporting = ref(false);
const isImportType = ref(0); // 0 导出 | 1 导入
const importData = ref("");
const exportJson = ref("");

// 打开导入对话框
const handleShowImportDialog = (type) => {
  isImportType.value = type;
  showImportDialog.value = true;

  if (type === 0) {
    const data = rssSources.value.reduce((prev, source) => {
      const item = {
        name: source.title,
        sourceUrl: source.sourceUrl,
        id: source.id,
      };

      if (prev[source.type]) {
        prev[source.type].push(item);
      } else {
        prev[source.type] = [item];
      }

      return prev;
    }, {});

    exportJson.value = JSON.stringify(data, null, 2);
  }
};

// 处理导入
const handleImport = async () => {
  try {
    const data = JSON.parse(importData.value);
    let lens = 0;
    Object.keys(data).forEach((type) => {
      data[type].forEach((item) => {
        const isExist = rssSources.value.find(
          (s) => s.sourceUrl === item.sourceUrl
        );
        if (!isExist) {
          store.addSource({
            id: item.id,
            title: item.name,
            sourceUrl: item.sourceUrl,
            type: type,
          });
        } else {
          lens++;
        }
      });
    });

    message.success(`导入成功，已排除${lens}条已有订阅源`);

    showImportDialog.value = false;
  } catch (error) {
    message.error("数据格式错误，请检查");
  }
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

  <DataImportExport
    v-model:show="showImportDialog"
    :title="`导${['出', '入'][isImportType]}订阅源`"
    :import-type="isImportType"
    :export-data="exportJson"
    :loading="isImporting"
    @import="handleImport"
  >
    <template #import>
      <div class="mb-2">参考导出数据格式</div>
      <NInput
        v-model:value="importData"
        :disabled="isImporting"
        rows="20"
        type="textarea"
        placeholder="请贴入订阅源数据"
      />
    </template>

    <template #export>
      <span>请自行保存导出数据</span>
    </template>
  </DataImportExport>
</template>

<style lang="scss" scoped></style>
