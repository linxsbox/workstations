import { isFunction } from "@linxs/toolkit";

export const clipboard = ({ data, success, error }) => {
  if (!isFunction(success)) {
    success = null;
  }
  if (!isFunction(error)) {
    error = null;
  }
  if (!data) {
    error && error("没有数据");
    return;
  }

  isFunction;

  try {
    // 现代浏览器方法
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(data)
        .then(() => {
          success && success("复制成功");
        })
        .catch(() => {
          fallbackCopyTextToClipboard(data, success, error);
        });
    } else {
      // 兼容旧浏览器的降级方案
      fallbackCopyTextToClipboard(data, success, error);
    }
  } catch (err) {
    error && error("复制失败");
    console.error(err);
  }
};

// 兼容性降级复制方法
function fallbackCopyTextToClipboard(
  text = "",
  success = () => {},
  error = () => {}
) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // 避免在屏幕上显示
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    const msg = successful ? "复制成功" : "复制失败";
    success && success(msg);
  } catch (err) {
    error && error("复制失败");
    console.error("Unable to copy", err);
  }

  document.body.removeChild(textArea);
}
