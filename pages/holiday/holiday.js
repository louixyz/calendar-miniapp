// title: 节假日页面逻辑（含点击跳转到日历月份功能）
// filename: holiday.js
// version: 1.2.0
// author: louixyz
// timestamp: 2026-05-12
// note: 点击节假日卡片 → globalData 写入目标年月 → switchTab 到日历页

const holiday = require('../../utils/holiday');
const dateUtil = require('../../utils/date-util');

Page({
  data: {
    year: 0,
    holidays: [],
    nextHoliday: null
  },

  onLoad() {
    const now = new Date();
    this.loadHolidays(now.getFullYear(), now);
  },

  onShow() {
    const now = new Date();
    this.loadHolidays(this.data.year || now.getFullYear(), now);
  },

  loadHolidays(year, now) {
    if (!now) now = new Date();
    const holidays = holiday.getAllHolidaysOfYear(year);
    const next = holiday.getNextHoliday(year, now.getMonth() + 1, now.getDate());

    const enriched = holidays.map(h => {
      const parts = h.holidays[0].split('-').map(Number);
      const lastParts = h.holidays[h.holidays.length - 1].split('-').map(Number);
      const firstDay = Date.UTC(parts[0], parts[1] - 1, parts[2]);
      const lastDay = Date.UTC(lastParts[0], lastParts[1] - 1, lastParts[2]);
      const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
      const daysUntil = Math.round((firstDay - todayUTC) / 86400000);
      const isPast = todayUTC > lastDay;
      return { ...h, daysUntil: daysUntil > 0 ? daysUntil : 0, isPast };
    });

    this.setData({ year, holidays: enriched, nextHoliday: next });
  },

  onPrevYear() {
    this.loadHolidays(this.data.year - 1);
  },

  onNextYear() {
    this.loadHolidays(this.data.year + 1);
  },

  // ✅ 点击节假日卡片，跳转到日历对应月份
  onHolidayCardTap(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.holidays[index];
    if (!item || !item.holidays || item.holidays.length === 0) return;

    const parts = item.holidays[0].split('-').map(Number);
    const [year, month] = parts;

    const app = getApp();
    app.globalData.jumpTarget = { year, month };

    wx.switchTab({ url: '/pages/index/index' });
  },

  onShareAppMessage() {
    return {
      title: `万年历 - ${this.data.year}年法定节假日安排`,
      path: '/pages/holiday/holiday'
    };
  },

  onShareTimeline() {
    return { title: `${this.data.year}年法定节假日安排` };
  }
});
