export default {
  fm: {
    label: "播客",
    list: [
      {
        isRss: false,
        id: "xiaoyuzhoufm",
        label: "小宇宙",
        interval: { day: 1 },
        apis: {
          list: "https://www.xiaoyuzhoufm.com/podcast/",
          details: "https://www.xiaoyuzhoufm.com/episode/",
          media: "https://media.xyzcdn.net/",
        },
        dataMatch:
          /<script\s+id="__NEXT_DATA__"\s+type="application\/json">\s*([\s\S]+)\s*<\/script>/,
        recommend: [
          { title: "肥话连篇", id: "61d50d72ee197a3aac3dac42" },
          { title: "高能量", id: "62c6ae08c4eaa82b112b9c84" },
          { title: "GQ Talk", id: "5e280faa418a84a0461f9e09" },
          { title: "商业WHY酱", id: "61315abc73105e8f15080b8a" },
          { title: "纵横四海", id: "62694abdb221dd5908417d1e" },
          { title: "乱翻书", id: "61358d971c5d56efe5bcb5d2" },
        ],
      },
    ],
  },
  im: {
    label: "资讯媒体",
    list: [
      {
        isRss: true,
        id: "36kr",
        label: "36氪",
        interval: { minute: 30 },
        apis: {
          list: "https://36kr.com/feed-article",
          details: "",
          media: "",
        },
        dataMatch: () => {},
        recommend: [],
      },
      {
        isRss: true,
        id: "itjuzi",
        label: "IT 桔子",
        interval: { minute: 30 },
        apis: {
          list: "https://www.itjuzi.com/api/telegraph.xml",
          details: "",
          media: "",
        },
        dataMatch: () => {},
        recommend: [],
      },
    ],
  },
  fc: {
    label: "财经新闻",
    list: [],
  },
};
