# 中华传统文化词汇练习小程序

## 📱 扫码访问

扫描下方二维码即可进入填词练习页面：

**公开访问地址（有效期与本地服务器运行时间同步）：**
https://free-months-stop.loca.lt

> ⚠️ **首次访问说明**：localtunnel 免费版在首次访问时会显示"Click to Continue"验证页面，点击按钮后即可进入练习页面。

---

## 📂 文件说明

- `index.html` — 填词练习主页面
- `qrcode.png` — 二维码图片（扫码进入练习）
- `public-url.txt` — 当前公开访问地址
- `server.js` — 本地服务器（Node.js）
- `generate-qr.js` — 启动脚本（自动启动服务器 + 生成隧道 + 生成二维码）

---

## 🚀 启动方式

### 方式一：一键启动（推荐）
直接运行 `generate-qr.js`，会自动完成所有步骤：
```bash
node generate-qr.js
```

### 方式二：手动启动本地服务器
```bash
node server.js
# 然后浏览器访问 http://localhost:8899/
```

### 启动公共隧道（二维码有效）
需要 ngrok 或 localtunnel：
```bash
# localtunnel（自动安装）
npx localtunnel --port 8899

# ngrok（如已安装）
ngrok http 8899
```

---

## 📝 练习内容

### 核心词汇
traditional culture, Chinese painting, flower-and-bird painting, landscape painting, calligraphy, artist, beauty, art treasure, inherit, protect

### 句式练习
1. Chinese traditional arts include ________, ________ and ________.
2. Flower-and-bird painting shows the beauty of ________.
3. Chinese calligraphy is a kind of ________ art.
4. We should ________ and ________ our traditional Chinese arts.
5. Landscape painting makes people feel ________ and ________.

---

## ✅ 功能说明

- 输入答案后点击「检查答案」，正确变绿 ✓，错误变红 ✗
- 点击「重置」可清除所有答案重新填写
- 完成后显示正确率和星级评分
- 全部答对时有彩纸庆祝动画 🎉
