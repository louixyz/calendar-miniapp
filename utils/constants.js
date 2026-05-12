/**
 * 全局常量定义
 */

module.exports = {
  // 默认设备信息
  DEFAULT_SCREEN_WIDTH: 375,
  DEFAULT_SCREEN_HEIGHT: 667,
  DEFAULT_PIXEL_RATIO: 2,

  // 日期相关
  WEEK_DAYS: ['日', '一', '二', '三', '四', '五', '六'],
  WEEK_DAYS_FULL: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],

  // 显示类型
  DISPLAY_TYPE: {
    LUNAR: 'lunar',
    FESTIVAL: 'festival',
    TERM: 'term'
  },

  // 缓存键名
  STORAGE_KEYS: {
    LUNAR_CACHE: 'lunar_cache'
  }
};
