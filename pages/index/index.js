// title: 日历首页逻辑（支持从节假日页跳转到指定月份）
// filename: index.js
// version: 1.2.0
// author: louixyz
// timestamp: 2026-05-12
// note: 在 onShow 中读取 globalData.jumpTarget，切换到目标年月

const lunar = require('../../utils/lunar');
const solarTerm = require('../../utils/solar-term');
const holiday = require('../../utils/holiday');
const dateUtil = require('../../utils/date-util');

Page({
  data: {
    year: 0,
    month: 0,
    selectedDate: '',
    selectedInfo: null,
    showPicker: false,
    detail: {
      lunar: '',
      ganZhi: '',
      animal: '',
      term: '',
      festival: ''
    },
    nextHoliday: null
  },

  onLoad(options) {
    let year, month, day;
    const now = new Date();

    if (options.date) {
      const parts = options.date.split('-');
      year = parseInt(parts[0]);
      month = parseInt(parts[1]);
      day = parseInt(parts[2]);
    } else {
      year = now.getFullYear();
      month = now.getMonth() + 1;
      day = now.getDate();
    }

    const todayKey = dateUtil.formatDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const selectedKey = dateUtil.formatDate(year, month, day);

    this.setData({ year, month, selectedDate: selectedKey, todayKey });
    this.updateSelectedDetail(year, month, day);
    this.updateNextHoliday(year, month, day);
  },

  // ✅ 新增：onShow 中读取节假日页传来的跳转目标
  onShow() {
    const app = getApp();
    const jumpTarget = app.globalData.jumpTarget;
    if (jumpTarget) {
      const { year, month } = jumpTarget;
      app.globalData.jumpTarget = null; // 消费后清空，避免重复触发
      this.setData({ year, month });
    }
  },

  onPickerOpen() {
    this.setData({ showPicker: true });
  },

  onPickerClose() {
    this.setData({ showPicker: false });
  },

  onMonthChange(e) {
    const { year, month } = e.detail;
    this.setData({ year, month, showPicker: false });
  },

  onPrevMonth() {
    let { year, month } = this.data;
    month--;
    if (month < 1) { month = 12; year--; }
    this.setData({ year, month });
  },

  onNextMonth() {
    let { year, month } = this.data;
    month++;
    if (month > 12) { month = 1; year++; }
    this.setData({ year, month });
  },

  onDayTap(e) {
    const { year, month, day, dateKey, lunarInfo, termName, solarHoliday, lunarHoliday } = e.detail;
    this.setData({ selectedDate: dateKey });
    const weekDay = dateUtil.getWeekDayCN(new Date(year, month - 1, day).getDay());
    this.setData({
      detail: {
        year, month, day, weekDay,
        lunar: lunarInfo ? `${lunarInfo.monthCN}${lunarInfo.dayCN}` : '',
        ganZhi: lunarInfo ? `${lunarInfo.yearGanZhi}年` : '',
        animal: lunarInfo ? lunarInfo.animal : '',
        term: termName || '',
        festival: solarHoliday || lunarHoliday || ''
      }
    });
  },

  updateSelectedDetail(year, month, day) {
    const lunarInfo = lunar.solarToLunar(year, month, day);
    const termName = solarTerm.getSolarTerm(year, month, day);
    const solarHoliday = holiday.getSolarHoliday(month, day);
    let lunarHoliday = '';
    if (lunarInfo) {
      const lh = holiday.getLunarHoliday(lunarInfo.lunarMonth, lunarInfo.lunarDay, lunarInfo.isBigMonth);
      if (lh) lunarHoliday = lh;
    }
    const weekDay = dateUtil.getWeekDayCN(new Date(year, month - 1, day).getDay());
    this.setData({
      detail: {
        year, month, day, weekDay,
        lunar: lunarInfo ? `${lunarInfo.monthCN}${lunarInfo.dayCN}` : '',
        ganZhi: lunarInfo ? `${lunarInfo.yearGanZhi}年` : '',
        animal: lunarInfo ? lunarInfo.animal : '',
        term: termName || '',
        festival: solarHoliday || lunarHoliday || ''
      }
    });
  },

  updateNextHoliday(year, month, day) {
    const next = holiday.getNextHoliday(year, month, day);
    this.setData({ nextHoliday: next });
  },

  onGoDetail() {
    const { year, month, day } = this.data.detail;
    wx.navigateTo({
      url: `/pages/day-detail/day-detail?year=${year}&month=${month}&day=${day}`
    });
  },

  onShareAppMessage() {
    return { title: '万年历 - 查看农历、节气、节假日', path: '/pages/index/index' };
  },

  onShareTimeline() {
    return { title: '万年历 - 查看农历、节气、节假日' };
  },

  goHoliday() {
    wx.switchTab({ url: '/pages/holiday/holiday' });
  },

  goAbout() {
    wx.navigateTo({ url: '/pages/about/about' });
  }
});
