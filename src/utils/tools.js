export const checkUserAgent = () => {
  console.log(navigator.userAgent);
};

export const hex2rgb = (hex = "") => {
  const hexArr = hex.slice(1).split(""); // 去掉#，并转换为数组
  if (hexArr.length === 3) {
    hexArr.push(hexArr[0], hexArr[1], hexArr[2]); // 如果是简短格式，则扩展为完整格式
  }
  const r = parseInt(hexArr.splice(0, 2).join(""), 16); // 红色
  const g = parseInt(hexArr.splice(0, 2).join(""), 16); // 绿色
  const b = parseInt(hexArr.splice(0, 2).join(""), 16); // 蓝色

  return { r, g, b };
};

export const image2Base64 = async (url) => {
  const res = await fetch(url);

  const blob = await res.blob();

  const base64 = await new Promise((resolve) => {
    const fReader = new FileReader();
    fReader.onloadend = () => resolve(fReader.result);
    fReader.readAsDataURL(blob);
  });

  return base64;
};

export const parseRssXML = (xmlStr = "") => {
  if (!xmlStr) return;
  const fixXmlStr = `${xmlStr}`.trim().replace(/^\s+/, "");
  if (!fixXmlStr) return;

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(fixXmlStr, "text/xml");

  const channel =
    xmlDoc.querySelector("channel") || xmlDoc.getElementsByTagName("channel");

  if (!channel) return false;

  const title = getNodeTextContent(xmlDoc.firstChild, "channel > title");
  const description = getNodeTextContent(
    xmlDoc.firstChild,
    "channel > description"
  );
  const home = getNodeTextContent(xmlDoc.firstChild, "channel > link");
  const image = getNodeTextContent(xmlDoc.firstChild, "channel > image url");
  const list = xmlDoc.firstChild.querySelectorAll("channel > item") || [];

  return {
    title,
    description,
    home,
    image,
    list,
  };
};

export const getNodeTextContent = (root, nodeName) => {
  if (!root) return "";

  const node = root.querySelector(nodeName);
  if (!node) return "";

  return node.textContent;
};
