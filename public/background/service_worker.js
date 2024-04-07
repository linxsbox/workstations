const STORAGE_ALARM_KEY = "";
const config = {
  alarm: [STORAGE_ALARM_KEY, { delayInMinutes: 10, periodInMinutes: 10 }],
  local: { [STORAGE_ALARM_KEY]: true },
};

const useAlarm = async () => {
  const alarm = await chrome.alarms.get(STORAGE_ALARM_KEY);

  !alarm && chrome.alarms.create(...config.alarm);
};
useAlarm();

// const onInstalled = async () => {
//   if (!chrome) return;

//   chrome.runtime.onInstalled.addListener(async ({ reason }) => {
//     // if (reason !== 'install') return
//     await useAlarm();
//   });

//   // chrome.action.onClicked.addListener((tab) => {
//   //   chrome.tabs.create({ url: "" });
//   // });
// };

// onInstalled();

// use alarm
