// 请求模型
export const fetchModelApi = (options = {}) => {
  const { before, after } = options || {};

  return async (opts = {}) => {
    const { initRole, msgs, done, onError } = opts || {};

    if (isObject(initRole) && initRole.role === "system") {
      msgs = [initRole];
    }

    isFuntion(before) && before();

    try {
      const res = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            localStorage.get("APIKEYS")?.DeepSeekAPIKey
          }`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: msgs,
          stream: false,
        }),
      });

      const completion = await res.json();

      isFuntion(done) && done(completion);
    } catch (error) {
      isFuntion(onError) && onError(error);
    } finally {
      isFuntion(after) && after();
    }
  };
};
