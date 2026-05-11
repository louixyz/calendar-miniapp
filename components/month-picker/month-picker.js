const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

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
    visible: {
      type: Boolean,
      value: false
    }
  },

  data: {
    months: MONTHS,
    currentYear: new Date().getFullYear(),
    years: []
  },

  lifetimes: {
    attached() {
      // 生成年份列表：当前年前后50年
      const currentYear = this.data.currentYear;
      const years = [];
      for (let i = currentYear - 50; i <= currentYear + 50; i++) {
        years.push(i);
      }
      this.setData({ years });
    }
  },

  methods: {
    onPrevYear() {
      this.setData({ year: this.data.year - 1 });
    },

    onNextYear() {
      this.setData({ year: this.data.year + 1 });
    },

    onSelectMonth(e) {
      const month = e.currentTarget.dataset.month;
      this.triggerEvent('change', { year: this.data.year, month });
    },

    onBackToToday() {
      const now = new Date();
      this.triggerEvent('change', {
        year: now.getFullYear(),
        month: now.getMonth() + 1
      });
    },

    onMaskTap() {
      this.triggerEvent('close');
    },

    noop() {}
  }
});
