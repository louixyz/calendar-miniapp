const constants = require('./utils/constants');

App({
  onLaunch() {
    try {
      // 兼容性处理：优先使用新 API，回退到 getSystemInfoSync
      let info = {};
      if (wx.getWindowInfo) {
        info = { ...info, ...wx.getWindowInfo() };
      }
      if (wx.getDeviceInfo) {
        info = { ...info, ...wx.getDeviceInfo() };
      }
      if (wx.getSystemSetting) {
        info = { ...info, ...wx.getSystemSetting() };
      }

      // 如果新 API 不存在，使用旧 API 获取
      if (!wx.getWindowInfo || !wx.getDeviceInfo) {
        const systemInfo = wx.getSystemInfoSync();
        info = { ...systemInfo, ...info };
      }
      
      this.globalData.statusBarHeight = info.statusBarHeight || 0;
      this.globalData.screenWidth = info.screenWidth || constants.DEFAULT_SCREEN_WIDTH;
      this.globalData.screenHeight = info.screenHeight || constants.DEFAULT_SCREEN_HEIGHT;
      this.globalData.pixelRatio = info.pixelRatio || constants.DEFAULT_PIXEL_RATIO;
      this.globalData.windowWidth = info.windowWidth || constants.DEFAULT_SCREEN_WIDTH;
      this.globalData.windowHeight = info.windowHeight || constants.DEFAULT_SCREEN_HEIGHT;

      // 全局开启分享支持
      this.enableShareMenu();
    } catch (e) {
      console.warn('获取设备信息失败，使用默认值', e);
    }
  },

  /**
   * 全局开启分享菜单（包含分享到朋友圈）
   */
  enableShareMenu() {
    if (wx.showShareMenu) {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
    }
  },

  globalData: {
    statusBarHeight: 0,
    screenWidth: constants.DEFAULT_SCREEN_WIDTH,
    screenHeight: constants.DEFAULT_SCREEN_HEIGHT,
    pixelRatio: constants.DEFAULT_PIXEL_RATIO,
    windowWidth: constants.DEFAULT_SCREEN_WIDTH,
    windowHeight: constants.DEFAULT_SCREEN_HEIGHT,
    jumpTarget: null
  }
});
