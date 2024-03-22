// const STORAGE_ALARM_KEY = "";
// const config = {
//   alarm: [STORAGE_ALARM_KEY, { delayInMinutes: 0.5, periodInMinutes: 0.5 }],
//   local: { [STORAGE_ALARM_KEY]: true },
// };

// const useAlarm = async () => {
//   const local = await chrome.storage.local.get(STORAGE_ALARM_KEY);
//   const alarm = await chrome.alarms.get(STORAGE_ALARM_KEY);

//   const storeKey = local[STORAGE_ALARM_KEY];

//   if (!storeKey && !alarm) {
//     await chrome.alarms.create(...config.alarm);
//     await chrome.storage.local.set(config.local);
//     return;
//   }

//   if (storeKey && alarm) return;
//   else if (storeKey && !alarm) {
//     await chrome.alarms.create(...config.alarm);
//   } else if (!storeKey && alarm) {
//     await chrome.storage.local.set(config.local);
//   }
// };

// const onInstalled = async () => {
//   if (!chrome) return;

//   chrome.runtime.onInstalled.addListener(async ({ reason }) => {
//     // if (reason !== 'install') return
//     await useAlarm();
//   });

//   chrome.action.onClicked.addListener((tab) => {
//     chrome.tabs.create({ url: "http://osf.to8to.com:8084/" });
//   });
// };

// onInstalled();

// // use alarm

// chrome.alarms.onAlarm.addListener(() => {
//   // todo
// });
