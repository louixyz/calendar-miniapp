const lunar = require('../../utils/lunar');
const solarTerm = require('../../utils/solar-term');
const holiday = require('../../utils/holiday');
const dateUtil = require('../../utils/date-util');
const constants = require('../../utils/constants');

Component({
  properties: {
    year: {
      type: Number,
      value: new Date().getFullYear()
    },
    month: {
      type: Number,
      value: new Date().getMonth() + 1
    },
    selectedDate: {
      type: String,
      value: ''
    }
  },

  data: {
    weekDays: dateUtil.WEEK_DAYS,
    gridData: []
  },

  observers: {
    'year, month': function(year, month) {
      // observer 已负责更新，不需要 attached 再调一次
      if (year && month) {
        this.generateGrid(year, month);
      }
    }
  },

  methods: {
    generateGrid(year, month) {
      const rawGrid = dateUtil.generateCalendarGrid(year, month);
      const gridData = rawGrid.map(item => {
        const dateKey = dateUtil.formatDate(item.year, item.month, item.day);
        const weekend = dateUtil.isWeekend(item.year, item.month, item.day);

        // 非当月日期只显示公历，跳过农历/节气计算
        if (!item.isCurrentMonth) {
          return {
            ...item,
            dateKey,
            weekend,
            displayText: '',
            displayType: constants.DISPLAY_TYPE.LUNAR,
            dayStatus: null
          };
        }

        // 当月日期：完整计算
        const lunarInfo = lunar.solarToLunar(item.year, item.month, item.day);
        const termName = solarTerm.getSolarTerm(item.year, item.month, item.day);
        const solarHoliday = holiday.getSolarHoliday(item.month, item.day);
        let lunarHoliday = null;
        if (lunarInfo) {
          lunarHoliday = holiday.getLunarHoliday(lunarInfo.lunarMonth, lunarInfo.lunarDay, lunarInfo.isBigMonth);
        }
        const dayStatus = holiday.getDayStatus(item.year, item.month, item.day);

        // 显示优先级：农历节日 > 节气 > 公历节日 > 农历日期
        let displayText = lunarInfo ? lunarInfo.dayCN : '';
        let displayType = constants.DISPLAY_TYPE.LUNAR;

        if (lunarHoliday) {
          displayText = lunarHoliday;
          displayType = constants.DISPLAY_TYPE.FESTIVAL;
        } else if (termName) {
          displayText = termName;
          displayType = constants.DISPLAY_TYPE.TERM;
        } else if (solarHoliday) {
          displayText = solarHoliday;
          displayType = constants.DISPLAY_TYPE.FESTIVAL;
        }

        return {
          ...item,
          dateKey,
          weekend,
          lunarInfo,
          termName,
          solarHoliday,
          lunarHoliday,
          dayStatus,
          displayText,
          displayType
        };
      });

      this.setData({ gridData });
    },

    onDayTap(e) {
      const { index } = e.currentTarget.dataset;
      const day = this.data.gridData[index];
      if (!day || !day.isCurrentMonth) return;

      this.triggerEvent('daytap', {
        year: day.year,
        month: day.month,
        day: day.day,
        dateKey: day.dateKey,
        lunarInfo: day.lunarInfo,
        termName: day.termName,
        solarHoliday: day.solarHoliday,
        lunarHoliday: day.lunarHoliday
      });
    }
  }
});
