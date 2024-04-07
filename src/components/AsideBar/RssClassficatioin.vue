<script setup>
import { NPopover } from "naive-ui";
import IconXiaoyuzhou from "@/components/Icons/Icon-xiaoyuzhou.vue";
import IconInformation from "@/components/Icons/Icon-information.vue";
import { storeSettings } from "@/stores/storeSettings/index";
import { storeRss } from "@/stores/storeRss/index";
import { rssGroupType } from "@/stores/config";

const rssList = [
  {
    label: "信息源",
    isRss: true,
    list: [
      {
        label: "小宇宙",
        key: rssGroupType.xiaoyuzhoufm,
        icon: IconXiaoyuzhou,
      },
      {
        label: "IT资讯",
        key: rssGroupType.ITinfo,
        icon: IconInformation,
      },
    ],
  },
  {
    label: "应用",
    isLink: true,
    list: [
      {
        label: "文心一言",
        key: "yiyan",
        icon: "icon-yiyan",
        link: "https://yiyan.baidu.com/",
      },
      {
        label: "天工 AI",
        key: "tiangong",
        icon: "icon-tiangong",
        link: "https://search.tiangong.cn/",
      },
    ],
  },
];

const setting = storeSettings();
const { getRssTypeActive } = storeToRefs(setting);

const currentKey = ref(getRssTypeActive.value);
const handleSwitchRss = (key) => {
  // if (currentKey.value === key) return;
  currentKey.value = key;

  // 切换 rss 列表并触发更新
  setting.setRssTypeActive(key);
  storeRss().fetchRssList();
};
</script>

<template>
  <aside class="rss-classfication-box py-4 overflow-hidden">
    <div class="h-full px-2 text-4xl overflow-y-auto">
      <div v-for="item in rssList" :key="item.label">
        <div class="title sticky top-0 mb-2 text-xs select-none">
          {{ item.label }}
        </div>
        <template v-if="item.isRss">
          <NPopover
            v-for="items in item.list"
            trigger="hover"
            placement="right"
            :key="items.key"
            :keep-alive-on-hover="false"
          >
            <template #trigger>
              <div
                v-if="items.isImg"
                :class="[
                  'rss-icon p-0.5 mb-4 cursor-pointer',
                  currentKey === items.key ? 'active' : '',
                ]"
                @click="handleSwitchRss(items.key)"
              >
                <div :class="['icon-img', items.icon]"></div>
              </div>
              <component
                v-else
                :class="[
                  'rss-icon mb-4 rounded-full cursor-pointer',
                  currentKey === items.key ? 'active' : '',
                ]"
                :is="items.icon"
                @click="handleSwitchRss(items.key)"
              />
            </template>
            <span>{{ items.label }}</span>
          </NPopover>
        </template>
        <div v-else-if="item.isLink">
          <NPopover
            v-for="items in item.list"
            trigger="hover"
            placement="right"
            :key="items.key"
            :keep-alive-on-hover="false"
          >
            <template #trigger>
              <a
                :class="['block icon-link mb-4 rounded-lg', items.icon]"
                :href="items.link"
                target="_blank"
                rel="noopener noreferrer"
              >
              </a>
            </template>
            <span>{{ items.label }}</span>
          </NPopover>
        </div>
      </div>
    </div>
  </aside>
</template>

<style lang="scss">
.rss-classfication-box {
  height: calc(100% - 20px);

  background-color: #bfe2ff;
  border-radius: 0 10px 10px 0;
  transition: background 0.35s;

  .title {
    background-color: #bfe2ff;
  }

  .rss-icon {
    border-radius: 10px;

    &.active {
      background-color: var(--color-white);
    }
    &:hover {
      color: var(--rss-card-title-color);
      background-color: #78acd7;
    }

    .icon-img {
      width: 32px;
      height: 32px;
      background-position: center;
      background-size: cover;

      &.icon-itjuzi {
        background-image: url("assets/icons/icon-itjuzi.png");
      }
    }
  }

  .icon-link {
    width: 36px;
    height: 36px;
    background-position: center;
    background-size: cover;

    &.icon-yiyan {
      background-image: url("assets/icons/icon-yiyan.png");
    }
    &.icon-tiangong {
      background-image: url("assets/icons/icon-tiangong.png");
    }
  }
}
@media (prefers-color-scheme: dark) {
  .rss-classfication-box {
    background-color: #2b4459;

    .title {
      background-color: #2b4459;
    }

    .rss-icon {
      &.active {
        background-color: rgba(#0a1d43, 0.8);
      }
      &:hover {
        background-color: #3e769e;
      }
    }
  }
}
</style>
