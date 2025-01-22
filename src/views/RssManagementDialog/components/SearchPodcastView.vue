<script setup>
import { NInput, NModal, NSpin, NScrollbar, useMessage } from "naive-ui";
import { debounce } from "@linxs/toolkit";
import PodcastCardView from "./PodcastCardView.vue";

const message = useMessage();

const searchWord = ref("");
const searchLoading = ref(false);
const showSearchModal = ref(false);

const handleInput = debounce(async () => {
  showSearchModal.value = true;
  try {
    searchLoading.value = true;
    const res = await getPodcastList(searchWord.value);
    if (res.isError) {
      return message.error(res.message);
    }
  } catch (error) {
    message.error(error.message);
  } finally {
    searchLoading.value = false;
  }
}, 500);
</script>

<template>
  <section class="search-podcast">
    <NInput
      v-model:value="searchWord"
      :on-input="handleInput"
      placeholder="请输入播客名称"
    />
  </section>

  <NModal
    v-model:show="showSearchModal"
    :mask-closable="false"
    transform-origin="center"
    preset="card"
    title="搜索播客"
    class="w-[80vw] max-w-[1200px]"
  >
    <div class="flex gap-4">
      <div class="p-3">
        <NInput
          v-model:value="searchWord"
          :on-input="handleInput"
          placeholder="请输入播客名称"
        />
      </div>

      <div class="flex-1">
        <NSpin v-if="searchLoading" size="small" />
        <NScrollbar
          class="flex-1 p-4"
          content-class="flex flex-wrap gap-3 h-[inherit] "
        >
          <template v-for="item in podcastList" :key="item.id">
            <PodcastCardView :data="item" @click="handleClickPodcst(item)" />
          </template>
        </NScrollbar>
      </div>
    </div>
  </NModal>
</template>
