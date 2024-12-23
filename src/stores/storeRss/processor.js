import {
  isString,
  isDate,
  calculateTimeDifference,
  localStorage,
  image2Base64,
  hex2rgb,
  parseXML,
  getNodeTextContent,
} from "@linxs/toolkit";
import { RssSourceTypeEnum } from "./config";

// RSS 源的数据获取类型
export const FetchTypeEnum = {
  RSS: "rss", // 标准 RSS feed
  HTML: "html", // 需要爬取 HTML
  API: "api", // REST API
  MIXED: "mixed", // 混合类型，如小宇宙
};

// RSS 源的处理器配置
export const SourceProcessorConfig = {
  [RssSourceTypeEnum.XIAOYUZHOU]: {
    type: FetchTypeEnum.MIXED,
    processor: "xiaoyuzhouProcessor",
    config: {
      media: "https://media.xyzcdn.net/",
      baseUrl: "https://www.xiaoyuzhoufm.com",
      apis: {
        list: "/podcast/",
        episode: "/episode/",
      },
    },
  },
  [RssSourceTypeEnum.KR36]: {
    type: FetchTypeEnum.RSS,
    processor: "rssProcessor",
    config: {
      type: "rss",
      baseUrl: "https://36kr.com",
    },
  },
  [RssSourceTypeEnum.WECHAT]: {
    type: FetchTypeEnum.API,
    processor: "wechatProcessor",
    config: {
      type: "api",
      baseUrl: "https://mp.weixin.qq.com",
      requiresAuth: true,
    },
  },
  [RssSourceTypeEnum.RSS]: {
    type: FetchTypeEnum.RSS,
    processor: "rssProcessor",
    config: {
      type: "rss",
    },
  },
};

// 基础处理器接口
class BaseRssProcessor {
  constructor(source) {
    this.source = source;
    this.config = SourceProcessorConfig[source.type] || {};
    this.sourceConfig = this.config.config;
  }

  // 通用方法：验证源
  async validate() {
    // 基础验证逻辑
    if (!this.source.sourceUrl) {
      throw new Error("URL不能为空");
    }
    return true;
  }

  // 通用方法：获取源信息
  async fetchSourceInfo() {
    throw new Error("未实现的方法");
  }

  // 通用方法：获取最新条目
  async fetchLatestItems() {
    throw new Error("未实现的方法");
  }
}

// 标准 RSS 处理器
class RssProcessor extends BaseRssProcessor {
  async fetchSourceInfo() {
    try {
      const response = await fetch(this.source.url);
      const text = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");

      return {
        title: xmlDoc.querySelector("channel > title")?.textContent,
        description: xmlDoc.querySelector("channel > description")?.textContent,
        link: xmlDoc.querySelector("channel > link")?.textContent,
      };
    } catch (error) {
      console.error("RSS源信息获取失败:", error);
      throw error;
    }
  }

  async fetchLatestItems() {
    try {
      const response = await fetch(this.source.url);
      const text = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");

      const items = Array.from(xmlDoc.querySelectorAll("item")).map((item) => ({
        title: item.querySelector("title")?.textContent,
        link: item.querySelector("link")?.textContent,
        pubDate: item.querySelector("pubDate")?.textContent,
      }));

      return items.slice(0, 10); // 返回最新10条
    } catch (error) {
      console.error("RSS条目获取失败:", error);
      throw error;
    }
  }
}

// 小宇宙播客处理器
class XiaoyuzhouProcessor extends BaseRssProcessor {
  // 实现小宇宙特定的播客信息获取
  async fetchSourceInfo() {
    // 小宇宙解析内容规则
    const jsonMathc =
      /<script\s+id="__NEXT_DATA__"\s+type="application\/json">\s*([\s\S]+?)\s*<\/script>/;

    // 记录服务器时间
    let serverTime = 0;

    try {
      const response = await fetch(this.source.sourceUrl);
      if (response.status !== 200) return;

      // 获取服务器时间
      if (!serverTime) {
        const serDate = response.headers.get("Date");
        serverTime = isString(serDate)
          ? new Date(serDate)
          : isDate(serDate)
          ? serDate
          : new Date();
      }

      const matchTxt = jsonMathc.exec(await response.text());
      if (matchTxt.length < 2) return;

      // 解析为 JSON 数据
      const dataJSON = JSON.parse(matchTxt[1]);

      const { title, brief, episodes, image, color, podcasters } =
        dataJSON.props?.pageProps?.podcast || {};

      // 获取播客主信息
      const author = podcasters.map((item) => item.nickname).join("、");

      // 循环获取播客列表信息
      const list = (episodes || []).map((item) => {
        return {
          title: item.title,
          description: item.description,
          mediaUrl: item.enclosure.url,
          link: `${this.sourceConfig.baseUrl}${this.sourceConfig.apis.episode}${item.eid}`,
          duration: sec2min(item.duration),
          timeAgo: getPubDate(item.pubDate, +serverTime),
          timestamp: +new Date(item.pubDate),
        };
      });

      const { r, g, b } = hex2rgb(color.original);

      const podcastId = this.extractPodcastId();

      const imgBase64 = await getRssLogo(podcastId, image.smallPicUrl);

      return {
        id: podcastId,
        title,
        description: brief,
        author,
        image: imgBase64,
        theme: { original: color.original, rgb: `${r}, ${g}, ${b}` },
        list,
      };
    } catch (error) {
      console.error("小宇宙播客信息获取失败:", error);
      throw error;
    }
  }

  // 从 URL 中提取播客 ID
  extractPodcastId() {
    const match = this.source.sourceUrl.match(/\/podcast\/(\w+)/);
    return match ? match[1] : null;
  }
}

// 36Kr 处理器
class Kr36Processor extends BaseRssProcessor {
  async fetchSourceInfo() {
    try {
      const response = await fetch(this.source.sourceUrl);
      const xml = parseXML(await response.text());

      const list = (xml.children || []).map((child) => {
        const title = getNodeTextContent(child, "title");
        const summary = getNodeTextContent(child, "summary");
        const author = getNodeTextContent(child, "author");
        const pubDate = rmSecAndZone(getNodeTextContent(child, "pubDate"));
        const timestamp = +new Date(pubDate.replace(/-/g, "/"));
        const link = getNodeTextContent(child, "link");

        return {
          title,
          description: summary,
          author,
          pubDate,
          link,
          timestamp,
        };
      });

      return {
        id: this.source.name,
        title: this.source.name,
        link: this.source.url,
        list,
      };
    } catch (error) {
      console.error("36Kr RSS 获取失败:", error);
      throw error;
    }
  }

  async fetchLatestItems() {
    try {
      const response = await fetch(this.source.url);
      const text = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");

      const items = Array.from(xmlDoc.querySelectorAll("item")).map((item) => ({
        title: item.querySelector("title")?.textContent,
        link: item.querySelector("link")?.textContent,
        pubDate: item.querySelector("pubDate")?.textContent,
      }));

      return items.slice(0, 10); // 返回最新10条
    } catch (error) {
      console.error("RSS条目获取失败:", error);
      throw error;
    }
  }
}

// 微信公众号处理器
class WechatProcessor extends BaseRssProcessor {
  async validate() {
    await super.validate();
    if (this.config.config.requiresAuth) {
      // 检查认证状态
      const isAuthenticated = await this.checkAuthentication();
      if (!isAuthenticated) {
        throw new Error("需要微信公众号授权");
      }
    }
    return true;
  }

  async checkAuthentication() {
    // 实现微信公众号认证检查
    return false; // 暂时返回 false
  }
}

// 源处理器工厂
export class RssProcessorFactory {
  static create(source) {
    switch (source.type) {
      case RssSourceTypeEnum.RSS:
        return new RssProcessor(source);
      case RssSourceTypeEnum.XIAOYUZHOU:
        return new XiaoyuzhouProcessor(source);
      case RssSourceTypeEnum.KR36:
        return new Kr36Processor(source);
      case RssSourceTypeEnum.WECHAT:
        return new WechatProcessor(source);
      default:
        throw new Error(`不支持的源类型: ${source.type}`);
    }
  }
}

// 获取 RSS Logo 图片
const getRssLogo = async (rssId, ImageUrl) => {
  const CACHE_RSS_LOGO = "CACHE_RSS_LOGO";
  let logos = localStorage.get(CACHE_RSS_LOGO) || {};
  if (!logos || !Object.keys(logos).length) {
    logos = {};
  }

  if (!logos[rssId]) {
    try {
      const imgBase64 = await image2Base64(ImageUrl);

      logos[rssId] = imgBase64;
      localStorage.set(CACHE_RSS_LOGO, logos);
    } catch (error) {
      return "";
    }
  }

  return logos[rssId];
};

// 获取发布时间
const getPubDate = (startTime, endTime) => {
  if (startTime.includes("T")) {
    startTime = new Date(startTime).getTime();
  }
  const {
    d: days,
    h: hours,
    m: minutes,
    s: seconds,
  } = calculateTimeDifference(startTime, endTime);

  if (!days && !hours && !minutes && seconds) {
    return `${seconds} 秒前`;
  } else if (!days && !hours && minutes) {
    return `${minutes} 分钟前`;
  } else if (!days && hours) {
    return `${hours} 小时前`;
  } else if (days) {
    return days > 365 ? "1年前" : `${days} 天前`;
  }
};

// 秒转换为分钟
const sec2min = (sec) => {
  return `${`${sec / 60}`.split(".")[0]} 分钟`;
};

// 移除秒和时区
const rmSecAndZone = (timeStr = "") => {
  return timeStr.trim().replace(/\s*[+-]\d{4}$/, "");
};
