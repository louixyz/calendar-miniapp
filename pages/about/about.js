Page({
  data: {
    version: '1.0.0'
  },

  onShareAppMessage() {
    return {
      title: '万年历 - 查看农历、节气、节假日',
      path: '/pages/index/index'
    };
  }
});
