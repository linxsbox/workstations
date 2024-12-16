<script setup>
import { NPopconfirm, useMessage } from "naive-ui";
import { storeRss } from "@/stores/storeRss";

const store = storeRss();
const message = useMessage();

// 默认头像
const defaultAvatar = "https://api.dicebear.com/7.x/bottts/svg";

// 删除确认
const handlePositiveClick = (sourceId) => {
  store.removeSource(sourceId);
  message.success("删除成功");
};

const handleNegativeClick = () => {
  // 取消删除，不做任何操作
};

// 初始化 RSS 源
store.init();
</script>

<template>
  <section class="setting-section">
    <h2 class="mb-4 text-lg font-bold text-[var(--text-primary)]">
      订阅源管理
    </h2>

    <div class="setting-item mb-6">
      <h3 class="setting-label text-base font-medium mb-3">订阅源列表</h3>

      <div class="px-5 flex flex-wrap gap-2">
        <!-- <template v-for="source in store.sources" :key="source.id">
          <div
            class="tag flex gap-2 justify-center items-center bg-teal-100 rounded-md px-2"
          >
            <div class="icon-logo rounded-full"></div>
            <div class="centent">{{ source.name }}</div>
            <NPopconfirm
              @positive-click="() => handlePositiveClick(source.id)"
              @negative-click="handleNegativeClick"
            >
              <template #trigger>
                <div class="icon-close">x</div>
              </template>
              <div>确定删除此信息源?</div>
            </NPopconfirm>
          </div>
        </template> -->
        <!-- <button class="rounded-md px-2" @click="store.openAddDialog()">
          添加源
        </button> -->
      </div>
    </div>

    <div class="setting-item mb-6">
      <h3 class="setting-label text-base font-medium mb-3">导入导出</h3>
      <div class="px-5">
        <div class="text-sm text-gray-400">设置项待实现</div>
      </div>
    </div>

    <!-- <div class="setting-item mb-6">
      <h3 class="setting-label text-base font-medium mb-3">更新设置</h3>
      <div class="px-5"></div>
    </div> -->
  </section>
</template>

<style lang="scss" scoped>
.tag {
  .icon-logo {
    width: 16px;
    height: 16px;
  }
  .icon-close {
    cursor: pointer;
  }
}
</style>
