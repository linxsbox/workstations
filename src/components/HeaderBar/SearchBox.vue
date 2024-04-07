<script setup>
import { NInputGroup, NSelect, NInput } from "naive-ui";
import { localStorages } from "@/utils/storage";

const searchType = localStorages("USER_SEARCH_TYPE");

const selected = ref(searchType.get() || 0);
const options = [
  { label: "必应", value: 0, url: "https://bing.com/search?q=" },
  { label: "谷歌", value: 1, url: "https://google.com/search?q=" },
  { label: "百度", value: 2, url: "https://github.com/search?q=" },
];

const placeholder = computed(() => `使用${options[selected.value].label}搜索`);

const handleSelect = (key) => {
  selected.value = key;
  searchType.set(key);
};

const searchText = ref("");
const handleGoSearch = () => {
  const url = `${options[selected.value].url}${searchText.value.trim()}`;
  window.open(url, "_blank").focus();
};
</script>

<template>
  <div class="search-box">
    <NInputGroup>
      <NSelect
        class="search-type flex-none"
        v-model:value="selected"
        :options="options"
        @update:value="handleSelect"
      >
      </NSelect>
      <NInput
        v-model:value="searchText"
        :placeholder="placeholder"
        @keyup.enter="handleGoSearch"
      />
    </NInputGroup>

    <a href="http://" target="_blank" rel="noopener noreferrer"></a>
  </div>
</template>

<style lang="scss" scoped>
.search-box {
  & .n-input,
  &::v-deep(.n-base-selection) {
    --n-border-radius: 10px !important;
  }

  .search-type {
    width: 80px;
  }
}
</style>
