# 万年历微信小程序

一个功能完整的万年历微信小程序，支持农历查询、二十四节气、法定节假日、调休安排等功能。所有数据本地计算，无需联网即可使用。

## 📱 功能特性

### 核心功能
- 📅 **公历农历互查**：支持 1900-2100 年农历计算
- 🌿 **二十四节气**：精确到具体日期的节气显示
- 🎉 **传统节日**：春节、端午、中秋等农历节日
- 🏖️ **法定节假日**：国务院办公厅发布的放假安排
- 🔄 **调休提醒**：清晰的调休工作日标记
- 📊 **日期详情**：选中日期完整信息展示

### 技术特性
- ✅ 纯本地计算，无需网络请求
- ✅ 支持微信分享（会话/朋友圈）
- ✅ 性能优化，启动快速
- ✅ 符合微信小程序规范
- ✅ 通过隐私合规检查

## 📁 项目结构

```
calendar-miniapp/
├── app.js                      # 应用入口
├── app.json                    # 全局配置
├── app.wxss                    # 全局样式
├── project.config.json         # 项目配置
├── sitemap.json                # 搜索索引配置
├── preview.html                # 浏览器预览（非小程序文件）
│
├── pages/                      # 页面目录
│   ├── index/                 # 首页（日历主界面）
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   ├── day-detail/            # 日期详情页
│   │   ├── day-detail.js
│   │   ├── day-detail.json
│   │   ├── day-detail.wxml
│   │   └── day-detail.wxss
│   ├── solar-term/            # 节气页面
│   │   ├── solar-term.js
│   │   ├── solar-term.json
│   │   ├── solar-term.wxml
│   │   └── solar-term.wxss
│   ├── holiday/               # 节假日页面
│   │   ├── holiday.js
│   │   ├── holiday.json
│   │   ├── holiday.wxml
│   │   └── holiday.wxss
│   └── about/                 # 关于页面
│       ├── about.js
│       ├── about.json
│       ├── about.wxml
│       └── about.wxss
│
├── components/                 # 自定义组件
│   ├── calendar-grid/         # 日历网格组件
│   │   ├── calendar-grid.js
│   │   ├── calendar-grid.json
│   │   ├── calendar-grid.wxml
│   │   └── calendar-grid.wxss
│   └── month-picker/          # 月份选择器组件
│       ├── month-picker.js
│       ├── month-picker.json
│       ├── month-picker.wxml
│       └── month-picker.wxss
│
├── utils/                     # 工具模块
│   ├── lunar.js              # 农历算法（1900-2100）
│   ├── solar-term.js         # 节气算法
│   ├── holiday.js            # 节假日数据（含2026年安排）
│   └── date-util.js         # 日期工具函数
│
└── assets/                   # 静态资源
    └── tab/                  # Tab栏图标
        ├── calendar.png
        ├── calendar-active.png
        ├── solar.png
        ├── solar-active.png
        ├── holiday.png
        └── holiday-active.png
```

## 🚀 快速开始

### 1. 导入项目
1. 打开微信开发者工具
2. 选择「导入项目」
3. 选择 `calendar-miniapp` 目录
4. 填入你的 AppID（测试可使用测试号）

### 2. 配置 AppID
编辑 `project.config.json`，将 `appid` 字段改为你的小程序 AppID：
```json
{
  "appid": "你的AppID",
  ...
}
```

### 3. 编译运行
点击「编译」按钮，即可在模拟器中预览

## 📊 数据说明

### 农历数据
- 来源：寿星万年历算法
- 范围：1900年 ~ 2100年
- 精度：支持闰月计算

### 节气数据
- 算法：基于天文算法计算
- 覆盖：二十四节气完整支持

### 节假日数据
- 来源：国务院办公厅每年发布的放假安排
- 当前包含：2026年完整节假日安排
- 扩展：可参考 `utils/holiday.js` 中的 `ARRANGEMENTS` 对象添加新年份

## 🎨 界面预览

小程序包含 4 个主要页面：

1. **日历首页**：月视图日历，显示农历、节气、节日
2. **日期详情**：选中日期的完整信息
3. **节气页面**：全年二十四节气列表
4. **节假日页面**：法定节假日和调休安排

## ⚙️ 技术实现

### 农历算法
- 使用查表法 + 数学计算
- 数据表：`LUNAR_INFO` 数组（1900-2100年）
- 支持闰月、大小月计算

### 节气算法
- 基于寿星万年历算法
- 使用世纪C值表进行精确计算
- 覆盖 1900-2100 年

### 性能优化
- 所有计算本地完成，无网络请求
- 使用组件化开发，支持按需加载
- 日历网格使用纯数据更新，避免频繁 setData

## 📝 开发说明

### 添加新年份节假日
编辑 `utils/holiday.js`，在 `ARRANGEMENTS` 对象中添加：
```javascript
2027: {
  '元旦': {
    holidays: ['2027-01-01', '2027-01-02', '2027-01-03'],
    workdays: []
  },
  // ... 其他节日
}
```

### 自定义主题色
编辑 `app.wxss`，修改 CSS 变量：
```css
page {
  --color-primary: #E85D3A;  /* 主题色 */
  --color-primary-light: #FFF0EC;  /* 浅色主题 */
  /* ... 其他变量 */
}
```

### 分享配置
已在各页面配置 `onShareAppMessage` 和 `onShareTimeline`，支持：
- 分享到微信会话
- 分享到朋友圈

## 🔒 隐私合规

- ✅ 不收集用户个人信息
- ✅ 不使用地理位置等敏感权限
- ✅ 所有数据本地计算
- ✅ 已配置 `__usePrivacyCheck__: true`
- ✅ 符合微信小程序隐私规范

## 📦 项目统计

- **总文件数**：40 个
- **代码大小**：约 90 KB
- **页面数**：5 个（含 tabBar 页面 3 个）
- **组件数**：2 个
- **工具模块**：4 个

## ⚠️ 注意事项

1. **AppID 配置**：记得替换 `project.config.json` 中的 AppID
2. **图标文件**：当前为占位图标，建议替换为设计好的图标（81x81 PNG）
3. **节假日数据**：需要每年更新 `utils/holiday.js` 中的数据
4. **基础库版本**：建议设置基础库版本 >= 2.25.0

## 🛠️ 后续优化建议

- [ ] 添加黄历宜忌功能
- [ ] 支持日历视图切换（周视图/月视图）
- [ ] 添加日期提醒/日程功能
- [ ] 支持农历生日提醒
- [ ] 添加节日倒计时 widget
- [ ] 支持多语言（繁体中文等）

## 📄 开源协议

MIT License

## 🙏 致谢

- 农历算法参考：寿星万年历
- 节气算法参考：天文算法
- 节假日数据来源：国务院办公厅

---

**开发完成时间**：2026年5月
**开发者**：微信小程序开发专家
