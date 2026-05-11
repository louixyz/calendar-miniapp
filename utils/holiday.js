/**
 * 节假日数据模块
 * 包含公历节日、农历节日、调休数据
 * 数据本地存储，无需网络请求
 */

// 公历节日（固定日期）
const SOLAR_HOLIDAYS = {
  '01-01': '元旦',
  '02-14': '情人节',
  '03-08': '妇女节',
  '03-12': '植树节',
  '04-01': '愚人节',
  '05-01': '劳动节',
  '05-04': '青年节',
  '06-01': '儿童节',
  '07-01': '建党节',
  '08-01': '建军节',
  '09-10': '教师节',
  '10-01': '国庆节',
  '10-31': '万圣夜',
  '11-11': '光棍节',
  '12-24': '平安夜',
  '12-25': '圣诞节'
};

// 农历节日（按农历月-日匹配）
const LUNAR_HOLIDAYS = {
  '01-01': '春节',
  '01-15': '元宵节',
  '02-02': '龙抬头',
  '05-05': '端午节',
  '07-07': '七夕',
  '07-15': '中元节',
  '08-15': '中秋节',
  '09-09': '重阳节',
  '12-08': '腊八节',
  '12-23': '北方小年'
  // 除夕特殊处理，见 getLunarHoliday
};

// 法定节假日安排数据
// 数据来源：国务院办公厅每年发布的放假安排
// 格式：年份 -> 节日 -> { holidays: 放假日期, workdays: 调休工作日 }
const ARRANGEMENTS = {
  2026: {
    '元旦': {
      holidays: ['2026-01-01', '2026-01-02', '2026-01-03'],
      workdays: []
    },
    '春节': {
      holidays: ['2026-02-16', '2026-02-17', '2026-02-18', '2026-02-19', '2026-02-20',
                 '2026-02-21', '2026-02-22'],
      workdays: ['2026-02-14', '2026-02-15']
    },
    '清明节': {
      holidays: ['2026-04-04', '2026-04-05', '2026-04-06'],
      workdays: []
    },
    '劳动节': {
      holidays: ['2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05'],
      workdays: ['2026-04-26']
    },
    '端午节': {
      holidays: ['2026-06-19', '2026-06-20', '2026-06-21'],
      workdays: []
    },
    '中秋节': {
      holidays: ['2026-09-25', '2026-09-26', '2026-09-27'],
      workdays: []
    },
    '国庆节': {
      holidays: ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05',
                 '2026-10-06', '2026-10-07', '2026-10-08'],
      workdays: ['2026-09-27']
    }
  }
};

/**
 * 获取指定日期的公历节日
 * @param {number} month 公历月
 * @param {number} day 公历日
 * @returns {string|null}
 */
function getSolarHoliday(month, day) {
  const key = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return SOLAR_HOLIDAYS[key] || null;
}

/**
 * 获取指定日期的农历节日
 * @param {number} lunarMonth 农历月
 * @param {number} lunarDay 农历日
 * @param {boolean} isBigMonth 该月是否为大月（30天）
 * @returns {string|null}
 */
function getLunarHoliday(lunarMonth, lunarDay, isBigMonth = true) {
  // 除夕：农历12月的最后一天
  if (lunarMonth === 12) {
    if ((isBigMonth && lunarDay === 30) || (!isBigMonth && lunarDay === 29)) {
      return '除夕';
    }
  }

  const key = `${String(lunarMonth).padStart(2, '0')}-${String(lunarDay).padStart(2, '0')}`;
  return LUNAR_HOLIDAYS[key] || null;
}

/**
 * 获取指定年份的法定节假日安排
 * @param {number} year
 * @returns {object|null}
 */
function getHolidayArrangement(year) {
  return ARRANGEMENTS[year] || null;
}

/**
 * 判断指定日期是否为法定假日
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {object|null} { name, isHoliday, isWorkday }
 */
function getDayStatus(year, month, day) {
  const arrangement = getHolidayArrangement(year);
  if (!arrangement) return null;

  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  for (const [name, info] of Object.entries(arrangement)) {
    if (info.holidays.includes(dateStr)) {
      return { name, isHoliday: true, isWorkday: false };
    }
    if (info.workdays.includes(dateStr)) {
      return { name, isWorkday: true, isHoliday: false };
    }
  }
  return null;
}

/**
 * 获取指定年份所有法定假日列表
 * @param {number} year
 * @returns {Array}
 */
function getAllHolidaysOfYear(year) {
  const arrangement = getHolidayArrangement(year);
  if (!arrangement) return [];

  const result = [];
  for (const [name, info] of Object.entries(arrangement)) {
    result.push({
      name,
      holidays: info.holidays,
      workdays: info.workdays,
      totalDays: info.holidays.length
    });
  }
  return result;
}

/**
 * 获取下一个最近的节假日倒计时
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {object|null}
 */
function getNextHoliday(year, month, day) {
  const arrangement = getHolidayArrangement(year);
  if (!arrangement) return null;

  // 使用 UTC 消除时区差，确保倒计时精准
  const currentDate = Date.UTC(year, month - 1, day);

  for (const [name, info] of Object.entries(arrangement)) {
    const parts = info.holidays[0].split('-').map(Number);
    const firstDay = Date.UTC(parts[0], parts[1] - 1, parts[2]);
    
    if (firstDay > currentDate) {
      const diffDays = Math.round((firstDay - currentDate) / 86400000);
      return {
        name,
        date: info.holidays[0],
        daysUntil: diffDays,
        totalDays: info.holidays.length
      };
    }
  }

  // 查找下一年的
  const nextArrangement = getHolidayArrangement(year + 1);
  if (nextArrangement) {
    const firstHolidayEntry = Object.entries(nextArrangement)[0];
    if (firstHolidayEntry) {
      const [name, info] = firstHolidayEntry;
      const parts = info.holidays[0].split('-').map(Number);
      const firstDay = Date.UTC(parts[0], parts[1] - 1, parts[2]);
      const diffDays = Math.round((firstDay - currentDate) / 86400000);
      return {
        name,
        date: info.holidays[0],
        daysUntil: diffDays,
        totalDays: info.holidays.length
      };
    }
  }

  return null;
}

module.exports = {
  SOLAR_HOLIDAYS,
  LUNAR_HOLIDAYS,
  getSolarHoliday,
  getLunarHoliday,
  getHolidayArrangement,
  getDayStatus,
  getAllHolidaysOfYear,
  getNextHoliday
};
