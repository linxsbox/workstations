import { ref, nextTick } from "vue";

export function useScrollNavigation(menus = [], scorllCallBack = () => {}) {
  // 内容区域的引用
  const contentRef = ref(null);
  // 各个部分的位置缓存
  const sectionPositions = ref({});
  // 是否正在滚动中
  const isScrolling = ref(false);

  // 滚动到指定部分
  const scrollToSection = (menuId) => {
    if (isScrolling.value) return;

    scorllCallBack && scorllCallBack(menuId);
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

    menus.forEach((menu) => {
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
    for (const menu of menus) {
      const position = sectionPositions.value[menu.id];
      if (
        position &&
        scrollTop >= position.top &&
        scrollTop < position.bottom
      ) {
        scorllCallBack && scorllCallBack(menu.id);
        break;
      }
    }
  };

  return {
    contentRef,
    scrollToSection,
    calculateSectionPositions,
    handleScroll,
  };
}
