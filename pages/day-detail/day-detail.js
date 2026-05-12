const lunar = require('../../utils/lunar');
const solarTerm = require('../../utils/solar-term');
const holiday = require('../../utils/holiday');
const dateUtil = require('../../utils/date-util');

Page({
  data: {
    info: null
  },

  onLoad(options) {
    const { year, month, day } = options;
    this.loadDetail(parseInt(year), parseInt(month), parseInt(day));
  },

  loadDetail(year, month, day) {
    const lunarInfo = lunar.solarToLunar(year, month, day);
    const termName = solarTerm.getSolarTerm(year, month, day);
    const solarHoliday = holiday.getSolarHoliday(month, day);
    let lunarHoliday = '';
    if (lunarInfo) {
      const lh = holiday.getLunarHoliday(lunarInfo.lunarMonth, lunarInfo.lunarDay, lunarInfo.isBigMonth);
      if (lh) lunarHoliday = lh;
    }
    const weekDay = new Date(year, month - 1, day).getDay();
    const weekCN = dateUtil.getWeekDayCN(weekDay);
    const dayStatus = holiday.getDayStatus(year, month, day);

    this.setData({
      info: {
        year,
        month,
        day,
        weekCN,
        lunarYear: lunarInfo ? lunarInfo.lunarYear : 0,
        lunarMonth: lunarInfo ? lunarInfo.lunarMonth : 0,
        lunarDay: lunarInfo ? lunarInfo.lunarDay : 0,
        isLeap: lunarInfo ? lunarInfo.isLeap : false,
        monthCN: lunarInfo ? lunarInfo.monthCN : '',
        dayCN: lunarInfo ? lunarInfo.dayCN : '',
        yearGanZhi: lunarInfo ? lunarInfo.yearGanZhi : '',
        animal: lunarInfo ? lunarInfo.animal : '',
        termName: termName || '',
        solarHoliday: solarHoliday || '',
        lunarHoliday: lunarHoliday || '',
        isWeekend: weekDay === 0 || weekDay === 6,
        dayStatus: dayStatus,
        isBigMonth: lunarInfo ? lunarInfo.isBigMonth : false
      }
    });
  },

  onShareAppMessage() {
    const { info } = this.data;
    if (!info) return { title: '万年历', path: '/pages/index/index' };
    const title = info.lunarHoliday || info.solarHoliday || info.termName
      ? `${info.month}月${info.day}日 ${info.lunarHoliday || info.solarHoliday || info.termName}`
      : `${info.month}月${info.day}日 ${info.monthCN}${info.dayCN}`;
    return {
      title,
      path: `/pages/index/index?date=${info.year}-${info.month}-${info.day}`
    };
  },

  onShareTimeline() {
    const { info } = this.data;
    if (!info) return { title: '万年历' };
    const title = info.lunarHoliday || info.solarHoliday || info.termName
      ? `${info.month}月${info.day}日 ${info.lunarHoliday || info.solarHoliday || info.termName}`
      : `${info.month}月${info.day}日 ${info.monthCN}${info.dayCN}`;
    return {
      title,
      query: `date=${info.year}-${info.month}-${info.day}`
    };
  }
});
