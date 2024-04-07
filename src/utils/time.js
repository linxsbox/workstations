export const timeBefore = (now, time) => {
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

export const sec2min = (sec) => {
  return `${`${sec / 60}`.split(".")[0]} 分钟`;
};

export const rmSecAndZone = (timeStr = "") => {
  return timeStr.trim().replace(/:\d{1,2}[\s\d\.+-]+$/, "");
};
