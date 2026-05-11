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
    const year = now.getFullYear();
    this.loadHolidays(year, now);
  },

  // onShow 中使用当前时间重新加载（切换年份回来时也需要刷新）
  onShow() {
    const now = new Date();
    this.loadHolidays(this.data.year || now.getFullYear(), now);
  },

  loadHolidays(year, now) {
    if (!now) now = new Date();
    const holidays = holiday.getAllHolidaysOfYear(year);
    const next = holiday.getNextHoliday(year, now.getMonth() + 1, now.getDate());

    // 为每个假期计算倒计时和过期状态
    const enriched = holidays.map(h => {
      const parts = h.holidays[0].split('-').map(Number);
      const lastParts = h.holidays[h.holidays.length - 1].split('-').map(Number);
      
      const firstDay = Date.UTC(parts[0], parts[1] - 1, parts[2]);
      const lastDay = Date.UTC(lastParts[0], lastParts[1] - 1, lastParts[2]);
      const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
      
      const daysUntil = Math.round((firstDay - todayUTC) / 86400000);
      const isPast = todayUTC > lastDay;
      
      return { 
        ...h, 
        daysUntil: daysUntil > 0 ? daysUntil : 0,
        isPast: isPast
      };
    });

    this.setData({
      year,
      holidays: enriched,
      nextHoliday: next
    });
  },

  onPrevYear() {
    this.loadHolidays(this.data.year - 1);
  },

  onNextYear() {
    this.loadHolidays(this.data.year + 1);
  },

  onShareAppMessage() {
    return {
      title: `万年历 - ${this.data.year}年法定节假日安排`,
      path: '/pages/holiday/holiday'
    };
  },

  onShareTimeline() {
    return {
      title: `${this.data.year}年法定节假日安排`
    };
  }
});
