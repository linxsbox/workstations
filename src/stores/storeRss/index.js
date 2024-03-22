import { defineStore } from "pinia";
import { ChromeAPI } from "@/utils/chrome";
import RssConfig from "../config";

const USER_KEY = "USER_CONFIG";
const chroemAPI = new ChromeAPI(USER_KEY);

const sec2min = (sec) => {
  return `${`${sec / 60}`.split(".")[0]} 分钟`;
};

const timeBefore = (now, time) => {
  const diff = now - +new Date(time);
  const seconds = Math.round(diff / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30);
  const years = Math.round(days / 365);

  if (seconds < 60) {
    return `${seconds} 秒之前`;
  } else if (minutes < 60) {
    return `${minutes} 分钟之前`;
  } else if (hours < 24) {
    return `${hours} 小时之前`;
  } else if (days < 30) {
    return `${days} 天之前`;
  } else if (months < 12) {
    return `${months} 月之前`;
  } else {
    return `${years} 年之前`;
  }
};

const hex2rgb = (hex = "") => {
  const hexArr = hex.slice(1).split(""); // 去掉#，并转换为数组
  if (hexArr.length === 3) {
    hexArr.push(hexArr[0], hexArr[1], hexArr[2]); // 如果是简短格式，则扩展为完整格式
  }
  const r = parseInt(hexArr.splice(0, 2).join(""), 16); // 红色
  const g = parseInt(hexArr.splice(0, 2).join(""), 16); // 绿色
  const b = parseInt(hexArr.splice(0, 2).join(""), 16); // 蓝色

  return { r, g, b };
};

const image2Base64 = async (url) => {
  const res = await fetch(url);

  const blob = await res.blob();

  const base64 = await new Promise((resolve) => {
    const fReader = new FileReader();
    fReader.onloadend = () => resolve(fReader.result);
    fReader.readAsDataURL(blob);
  });

  return base64;
};

const KEY_UPDATE_TIME = "update-time";
const KEY_CACHE = "cache-data";
const checkUpdate = () => {
  const now = +new Date();
  const lastTime = window.localStorage.getItem(KEY_UPDATE_TIME) || 1;

  const diffmin = now - lastTime * 1 >= 30 * 60 * 1000;
  if (!diffmin) return false;

  window.localStorage.setItem(KEY_UPDATE_TIME, +new Date());
  return true;
};

export const storeRss = defineStore({
  id: "StoreRss",
  state: () => ({
    rssList: [],
  }),
  getters: {
    getRssList: (state) => state.rssList,
  },
  actions: {
    async init() {
      return await this.fetchRssList();
    },
    setAddRss() {},
    setFollowRss() {},
    async fetchRssList() {
      const cache = window.localStorage.getItem(KEY_CACHE);

      if (!checkUpdate() && cache && this.rssList.length) return;

      if (cache && !this.rssList.length) {
        this.rssList = JSON.parse(cache);
        return;
      }

      const fm = RssConfig.fm.list[0];

      const tmpList = [];
      for (let index = 0; index < fm.recommend.length; index++) {
        const item = fm.recommend[index];

        const res = await fetch(`${fm.apis.list}${item.id}`);
        if (res.status !== 200) return;

        const serverTime = new Date(res.headers.get("Date"));

        const matchTxt = fm.dataMatch.exec(await res.text());
        if (matchTxt.length < 2) return;

        try {
          const dataJSON = JSON.parse(matchTxt[1]);

          console.log(dataJSON);

          const { title, brief, episodes, image, color, podcasters } =
            dataJSON.props?.pageProps?.podcast || {};

          const imgBase64 = await image2Base64(image.smallPicUrl);

          const list = (episodes || []).map((item) => ({
            title: item.title,
            description: item.description,
            mediaUrl: item.enclosure.url,
            link: `${fm.apis.details}${item.eid}`,
            duration: sec2min(item.duration),
            timeAgo: timeBefore(+serverTime, item.pubDate),
          }));

          const author = podcasters.map((item) => item.nickname).join("、");

          const { r, g, b } = hex2rgb(color.original);

          tmpList.push({
            title,
            author,
            brief,
            list,
            image: imgBase64,
            id: item.id,
            color: {
              ...color,
              themeRGB: `${[r, g, b]}`,
            },
          });
        } catch (error) {
          console.log(error);
        }
      }
      this.rssList = tmpList;
      window.localStorage.setItem(KEY_CACHE, JSON.stringify(tmpList));
    },
  },
});

// "USER_CONFIG";

// chrome.storage.local.set({
//   [this.Key]: ,
// });

// async rss() {
//   const temp = await getStorage();

//   return Object.freeze(temp.rss);
// }

// async theme() {
//   const temp = await getStorage();

//   return `${temp.theme}`;
// }
