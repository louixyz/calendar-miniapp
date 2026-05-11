const solarTermUtil = require('../../utils/solar-term');
const dateUtil = require('../../utils/date-util');

Page({
  data: {
    year: 0,
    terms: [],
    currentIndex: -1
  },

  onLoad() {
    const now = new Date();
    // 强制使用 2026 年（根据环境日期），或者动态获取
    const year = now.getFullYear();
    const terms = solarTermUtil.getSolarTermsOfYear(year);

    // 找到当前所在的节气（即日期大于等于该节气，且小于下一个节气）
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    let currentIndex = 0;
    
    for (let i = terms.length - 1; i >= 0; i--) {
      if (currentMonth > terms[i].month || 
          (currentMonth === terms[i].month && currentDay >= terms[i].day)) {
        currentIndex = i;
        break;
      }
    }

    this.setData({ year, terms, currentIndex });
  },

  onShareAppMessage() {
    return {
      title: `万年历 - ${this.data.year}年二十四节气`,
      path: '/pages/solar-term/solar-term'
    };
  },

  onShareTimeline() {
    return {
      title: `${this.data.year}年二十四节气`
    };
  }
});
