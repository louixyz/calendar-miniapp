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
    // 选中日期详情
    detail: {
      lunar: '',
      ganZhi: '',
      animal: '',
      term: '',
      festival: ''
    },
    // 下一个节假日
    nextHoliday: null
  },

  onLoad(options) {
    let year, month, day;
    const now = new Date();

    // 支持从分享链接带入指定日期
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

    this.setData({
      year,
      month,
      selectedDate: selectedKey,
      todayKey
    });

    this.updateSelectedDetail(year, month, day);
    this.updateNextHoliday(year, month, day);
  },

  // 月份选择器
  onPickerOpen() {
    this.setData({ showPicker: true });
  },

  onPickerClose() {
    this.setData({ showPicker: false });
  },

  onMonthChange(e) {
    const { year, month } = e.detail;
    this.setData({
      year,
      month,
      showPicker: false
    });
  },

  // 切换月份
  onPrevMonth() {
    let { year, month } = this.data;
    month--;
    if (month < 1) {
      month = 12;
      year--;
    }
    this.setData({ year, month });
  },

  onNextMonth() {
    let { year, month } = this.data;
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
    this.setData({ year, month });
  },

  // 选中日期
  onDayTap(e) {
    const { year, month, day, dateKey, lunarInfo, termName, solarHoliday, lunarHoliday } = e.detail;
    this.setData({ selectedDate: dateKey });
    
    // 如果组件已经传回了计算好的数据，直接使用，避免重复计算
    const weekDay = dateUtil.getWeekDayCN(new Date(year, month - 1, day).getDay());
    this.setData({
      detail: {
        year,
        month,
        day,
        weekDay,
        lunar: lunarInfo ? `${lunarInfo.monthCN}${lunarInfo.dayCN}` : '',
        ganZhi: lunarInfo ? `${lunarInfo.yearGanZhi}年` : '',
        animal: lunarInfo ? lunarInfo.animal : '',
        term: termName || '',
        festival: solarHoliday || lunarHoliday || ''
      }
    });
  },

  // 更新选中日期详情
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
        year,
        month,
        day,
        weekDay,
        lunar: lunarInfo ? `${lunarInfo.monthCN}${lunarInfo.dayCN}` : '',
        ganZhi: lunarInfo ? `${lunarInfo.yearGanZhi}年` : '',
        animal: lunarInfo ? lunarInfo.animal : '',
        term: termName || '',
        festival: solarHoliday || lunarHoliday || ''
      }
    });
  },

  // 更新下一个节假日
  updateNextHoliday(year, month, day) {
    const next = holiday.getNextHoliday(year, month, day);
    this.setData({ nextHoliday: next });
  },

  // 跳转到日期详情
  onGoDetail() {
    const { year, month, day } = this.data.detail;
    wx.navigateTo({
      url: `/pages/day-detail/day-detail?year=${year}&month=${month}&day=${day}`
    });
  },

  onShareAppMessage() {
    return {
      title: '万年历 - 查看农历、节气、节假日',
      path: '/pages/index/index'
    };
  },

  onShareTimeline() {
    return {
      title: '万年历 - 查看农历、节气、节假日'
    };
  },

  // 跳转节假日页
  goHoliday() {
    wx.switchTab({
      url: '/pages/holiday/holiday'
    });
  },

  // 跳转关于页
  goAbout() {
    wx.navigateTo({
      url: '/pages/about/about'
    });
  }
});
