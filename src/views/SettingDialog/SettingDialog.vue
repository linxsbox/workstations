<script setup>
import { NModal, NScrollbar } from "naive-ui";
import { storeSettings } from "@/stores/storeSettings";
import { settingMenus } from "@/stores/storeSettings/config";
import GeneralSection from "./components/GeneralSection.vue";
import RssSection from "./components/RssSection.vue";
import NotificationSection from "./components/NotificationSection.vue";
import AdvancedSection from "./components/AdvancedSection.vue";

const store = storeSettings();
const { showSettingDialog, activeSettingSection } = storeToRefs(store);

// 内容区域的引用
const contentRef = ref(null);
// 各个部分的位置缓存
const sectionPositions = ref({});
// 是否正在滚动中
const isScrolling = ref(false);

// 滚动到指定部分
const scrollToSection = (menuId) => {
  if (isScrolling.value) return;

  store.switchSettingSection(menuId);
  nextTick(() => {
    calculateSectionPositions();
    const position = sectionPositions.value[menuId]?.top || 0;
    isScrolling.value = true;
    contentRef.value?.scrollTo({ top: position, behavior: "smooth" });
    setTimeout(() => {
      isScrolling.value = false;
    }, 500);
  });
};

// 计算各个部分的位置
const calculateSectionPositions = () => {
  if (!contentRef.value) return;

  settingMenus.forEach((menu) => {
    const element = document.getElementById(`section-${menu.id}`);
    if (element) {
      sectionPositions.value[menu.id] = {
        top: element.offsetTop,
        bottom: element.offsetTop + element.offsetHeight,
      };
    }
  });
};

// 监听滚动以更新当前菜单
const handleScroll = (e) => {
  if (isScrolling.value) return;

  const scrollTop = e.target.scrollTop;
  for (const menu of settingMenus) {
    const position = sectionPositions.value[menu.id];
    if (position && scrollTop >= position.top && scrollTop < position.bottom) {
      store.switchSettingSection(menu.id);
      break;
    }
  }
};

// 监听对话框打开
watch(showSettingDialog, (isShow) => {
  if (isShow && contentRef.value) {
    nextTick(() => {
      calculateSectionPositions();
      const position =
        sectionPositions.value[activeSettingSection.value]?.top || 0;
      contentRef.value.scrollTo({ top: position });
    });
  }
});

onMounted(() => {
  calculateSectionPositions();
  window.addEventListener("resize", calculateSectionPositions);
});
</script>

<template>
  <NModal v-model:show="showSettingDialog" @update:show="store.closeSetting" :mask-closable="false"
    transform-origin="center" preset="card" title="设置" class="w-[80vw] max-w-[1200px]">
    <div class="flex gap-4 h-[70vh]">
      <!-- 左侧导航 -->
      <aside class="flex-none w-48">
        <NScrollbar>
          <nav class="setting-nav flex flex-col gap-2">
            <button v-for="menu in settingMenus" :key="menu.id"
              class="setting-nav-button px-4 py-2 text-left rounded-md bg-transparent"
              :class="{ active: activeSettingSection === menu.id }" @click="scrollToSection(menu.id)">
              {{ menu.label }}
            </button>
          </nav>
        </NScrollbar>
      </aside>

      <!-- 右侧内容 -->
      <div class="flex-1">
        <NScrollbar ref="contentRef" @scroll="handleScroll">
          <div class="setting-content pr-4">
            <div :id="'section-' + 'general'" class="setting-section mb-8">
              <GeneralSection />
            </div>
            <div :id="'section-' + 'rss'" class="setting-section mb-8">
              <RssSection />
            </div>
            <div :id="'section-' + 'notification'" class="setting-section mb-8">
              <NotificationSection />
            </div>
            <div :id="'section-' + 'advanced'">
              <AdvancedSection />
            </div>
          </div>
        </NScrollbar>
      </div>
    </div>
  </NModal>
</template>

<style lang="scss" scoped>
.setting-nav-button {
  color: var(--interactive-default);
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    color: var(--interactive-hover);
    background-color: var(--interactive-bg-hover);
  }

  &:active {
    color: var(--interactive-active);
    background-color: var(--interactive-bg-active);
  }

  &.active {
    color: var(--interactive-active);
    background-color: var(--interactive-bg-hover);
  }
}

.setting-section {
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-white-alpha-6);
  }
}
</style>
