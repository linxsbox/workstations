export class ChromeAPI {
  constructor(key) {
    this.Key = key;
  }

  /**
   * @param {any} data
   * @returns {Promise<void>}
   */
  async setStorage(data) {
    if (!chrome || !chrome.storage) return;

    await chrome.storage.local.set({
      [this.Key]: data,
    });
  }

  async getStorage() {
    if (!chrome || !chrome.storage) return;

    return await chrome.storage.local.get(this.Key);
  }

  async setAlarm(key, alarmInfo) {
    if (!chrome || !chrome.alarms) return;

    try {
      await chrome.alarms.create(key, alarmInfo);
    } catch (error) {
      console.error(error);
    }
  }

  async getAlarm(key) {
    if (!chrome || !chrome.alarms) return;

    return await chrome.alarms.get(key);
  }
}
