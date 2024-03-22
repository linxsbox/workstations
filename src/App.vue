<script setup>
import { storeRss } from "@/stores/storeRss/index";
import RssPanelView from "./views/RssPanel/RssPanelView.vue";

const store = storeRss();
const { getRssList } = storeToRefs(store);

store.init();
</script>

<template>
  <RssPanelView v-for="item in getRssList" :data="item"></RssPanelView>
</template>
