<script setup>
import SearchBox from "./SearchBox.vue";
</script>

<template>
  <header class="header-bar-box flex gap-4 px-5 pt-5 pb-2 justify-center">
    <div class="cell-4-1"></div>
    <div class="search-box flex-auto w-full">
      <SearchBox></SearchBox>
    </div>
    <div class="setting-box cell-4-1"></div>
  </header>
</template>

<style lang="scss" scoped>
$minWidth: 462px;
.header-bar-box {
  width: 100%;

  .search-box {
    min-width: $minWidth;
    max-width: $minWidth * 2;
  }

  .setting-box {
  }

  .cell-4-1 {
    max-width: $minWidth;
  }
}
</style>
