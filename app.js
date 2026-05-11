App({
  onLaunch() {
    try {
      // 使用微信推荐的新 API 分别获取信息
      const windowInfo = wx.getWindowInfo();
      const deviceInfo = wx.getDeviceInfo();
      const systemSetting = wx.getSystemSetting();
      
      this.globalData.statusBarHeight = windowInfo.statusBarHeight || 0;
      this.globalData.screenWidth = windowInfo.screenWidth || 375;
      this.globalData.screenHeight = windowInfo.screenHeight || 667;
      this.globalData.pixelRatio = deviceInfo.pixelRatio || 2;
      this.globalData.windowWidth = windowInfo.windowWidth || 375;
      this.globalData.windowHeight = windowInfo.windowHeight || 667;
    } catch (e) {
      console.warn('获取设备信息失败，使用默认值');
    }
  },

  globalData: {
    statusBarHeight: 0,
    screenWidth: 375,
    screenHeight: 667,
    pixelRatio: 2,
    windowWidth: 375,
    windowHeight: 667
  }
});
