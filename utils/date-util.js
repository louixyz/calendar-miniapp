/**
 * 日历核心工具模块
 * 提供日历网格生成、日期辅助函数等
 */

const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六'];

/**
 * 获取某月的天数
 * @param {number} year
 * @param {number} month 1-12
 * @returns {number}
 */
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * 获取某月第一天是星期几（0=周日, 6=周六）
 * @param {number} year
 * @param {number} month 1-12
 * @returns {number}
 */
function getFirstDayOfMonth(year, month) {
  return new Date(year, month - 1, 1).getDay();
}

/**
 * 生成日历网格数据
 * 每月显示6行7列 = 42天（含上月末尾和下月开头）
 * @param {number} year
 * @param {number} month 1-12
 * @returns {Array} 42个日期对象
 */
function generateCalendarGrid(year, month) {
  const grid = [];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1 || 12);
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  // 上月填充
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    grid.push({
      year: prevYear,
      month: prevMonth,
      day,
      isCurrentMonth: false,
      isToday: false
    });
  }

  // 当月
  const now = new Date();
  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth() + 1;
  const todayDay = now.getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    grid.push({
      year,
      month,
      day: i,
      isCurrentMonth: true,
      isToday: year === todayYear && month === todayMonth && i === todayDay
    });
  }

  // 下月填充
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const remain = 42 - grid.length;
  for (let i = 1; i <= remain; i++) {
    grid.push({
      year: nextYear,
      month: nextMonth,
      day: i,
      isCurrentMonth: false,
      isToday: false
    });
  }

  return grid;
}

/**
 * 格式化日期字符串
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {string} YYYY-MM-DD
 */
function formatDate(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * 判断是否为周末
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {boolean}
 */
function isWeekend(year, month, day) {
  const weekDay = new Date(year, month - 1, day).getDay();
  return weekDay === 0 || weekDay === 6;
}

/**
 * 获取星期几的中文
 * @param {number} dayOfWeek 0-6
 * @returns {string}
 */
function getWeekDayCN(dayOfWeek) {
  const names = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return names[dayOfWeek];
}

/**
 * 计算两个日期之间的天数差（只计算日期，忽略时间）
 * @param {Date} date1
 * @param {Date} date2
 * @returns {number}
 */
function daysBetween(date1, date2) {
  // 修复：改用 UTC 时间或 Math.round，避免被时区偏移吞掉一天
  const d1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.round(Math.abs(d1 - d2) / 86400000);
}

module.exports = {
  WEEK_DAYS,
  getDaysInMonth,
  getFirstDayOfMonth,
  generateCalendarGrid,
  formatDate,
  isWeekend,
  getWeekDayCN,
  daysBetween
};
