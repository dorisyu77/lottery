# TC Lottery Prototype - 開發規範

## Quick Start

```bash
npm install          # 安裝 sass 編譯器
npm run build:themes # 編譯 SCSS → themes/*.css
```

直接用瀏覽器開啟 `index.html` 即可預覽（無需 dev server）。

### Prerequisites
- Node.js >= 18

## 專案架構

```
TC-lottery-prototype/
├── index.html              # 主頁（選號）
├── history.html            # 歷史記錄頁
├── styles.css              # 主樣式（手寫，引用 --lottery-* 變數）
├── history.css             # 歷史頁樣式
├── app.js                  # 倒數計時 + 選號互動
├── mock-config.js          # 集中管理 Demo 資料（號碼、期數等）
├── theme-switcher.js       # 主題切換（動態載入 themes/*.css）
├── generate-base-colors.js # 從 online-theme 提取色彩變數
├── build-themes.sh         # SCSS → CSS 編譯腳本
├── themes/                 # [Build 產出] 瀏覽器載入的主題 CSS（50+）
├── scss/
│   ├── common/
│   │   └── _lottery.scss   # 共用語義化變數（--lottery-*）
│   ├── tc_001-sp/          # 主題資料夾範例
│   │   ├── _baseColor.scss            # 基礎調色盤（必要）
│   │   └── _gradationOverride.scss    # 漸層覆蓋（選用，大多數主題有）
│   ├── si-siam99-dark/     # siam99 系列 dark 變體
│   ├── tc_000-bwin789-dark/# 待分配編號的新主題
│   └── ...                 # 共 52 個主題資料夾
└── assets/                 # 圖片資源（全部被 HTML 引用）
```

## 色彩變數三層架構

```
baseColor（底層）→ lottery（中間層）→ styles.css（使用層）
```

### 第一層：baseColor（每個 theme 獨立）

位置：`scss/{theme}/_baseColor.scss`

定義基礎調色盤，包含以下分類：
- `--primary-01` ~ `--primary-10`
- `--secondary-01` ~ `--secondary-10`
- `--neutral-0` ~ `--neutral-1000`
- `--emotional-01` ~ `--emotional-10`
- `--opacity-01` ~ `--opacity-10`
- `--gradient-01` ~ `--gradient-16`
- `--gradation-01` ~ `--gradation-09`

### 第二層：lottery 共用變數（所有 theme 共用）

位置：`scss/common/_lottery.scss`

語義化變數，值只引用 baseColor 變數：

```scss
--lottery-panel-bg: var(--neutral-0);
--lottery-ball-selected-border: var(--primary-08);
--lottery-footer-bg: var(--neutral-600);
```

分類：
- 頁面背景、白底區域
- 號碼球狀態（available / selected / hot / disabled / non-winning）
- 選號面板、規則面板
- 倒數計時 Banner、標題
- Header、Accent / Glow、Sidebar、Nav icons
- Balance box、Style legend
- Footer、歷史記錄頁、中獎 Modal
- 按鈕、Mobile 底部面板、Mobile Header

### 第三層：styles.css（使用變數）

`:root` 區塊引用 `--lottery-*` 變數，元件樣式引用 `:root` 中的變數或直接引用 `--lottery-*`。

## 新增顏色的流程

### 情況 A：新 UI 元件需要顏色

1. 在 `scss/common/_lottery.scss` 新增語義化變數，引用現有 baseColor
2. 在 `styles.css` 中使用新的 `--lottery-*` 變數
3. 執行 `npm run build:themes`

### 情況 B：需要 baseColor 沒有的新色值

1. 在每個 `scss/{theme}/_baseColor.scss` 新增變數（如 `--gradation-10`）
2. 在 `scss/common/_lottery.scss` 建立語義化變數引用它
3. 在 `styles.css` 中使用
4. 執行 `npm run build:themes`

## 新增主題的流程

1. 複製現有主題資料夾
   ```bash
   cp -r scss/tc_001-sp scss/{新名稱}
   ```

2. 修改 `scss/{新名稱}/_baseColor.scss` 的色值

3. 在 HTML 的 `<select id="themeSwitcher">` 加入新選項
   ```html
   <option value="{新名稱}">{新名稱}</option>
   ```
   需修改的檔案：`index.html`、`history.html`

4. 編譯主題
   ```bash
   npm run build:themes
   ```

## 編譯指令

```bash
# 編譯所有主題（自動掃描 scss/*/_baseColor.scss）
npm run build:themes

# 等同於
bash build-themes.sh
```

編譯流程：
- 掃描 `scss/` 下所有含 `_baseColor.scss` 的資料夾（排除 common）
- 每個主題合併 `_baseColor.scss` + `common/_lottery.scss` + `_gradationOverride.scss`（如果存在）
- 產出到 `themes/{theme}.css`

## 主題切換機制

- `theme-switcher.js` 監聽右上角 `<select>` 變化
- 動態建立 `<link>` 標籤載入 `themes/{theme}.css`
- 選擇存入 `localStorage`，下次開啟自動恢復

## UX 流程

### 選號頁（index.html）
1. 進入頁面，顯示倒數計時 Banner（距離開獎時間）
   - 依照後台設定
2. 從 100 顆號碼球（00-99）中選號，每顆球最多被 {數值}人選，每人最多選 {數值}顆
   - 如果後台有開啟此功能才顯示，並依照後台設定顯示
3. 熱門號碼（{數值} 人選取）標記為 hot 狀態
   - 設定固定值，超過極為熱門號碼
4. 選號後側邊面板（Desktop）或底部面板（Mobile）即時更新
5. 確認選號送出

### 歷史記錄頁（history.html）
1. 進入頁面，若有中獎紀錄且為首次查看 → 彈出恭喜中獎 Modal（含 confetti + fireworks 動效）
2. 中獎 Modal 只顯示第一次，關閉後不再出現（透過 localStorage 記錄）
3. 點擊歷史紀錄可展開查看選號明細，中獎號碼以金色標示
4. 紀錄狀態：尚未開獎（pending）、未中獎（lost）、中獎（won）

### 號碼球狀態
- `available`：可選取
- `selected`：已選取
- `hot`：熱門（{數值} 人選取）
- `hot-selected`：熱門 + 已選取
- `maxed`：已滿額（達到 {數值} 人上限）
- `hot-maxed`：熱門 + 已滿額

## 開發規範

### 禁止事項
- 不要在 `styles.css` 寫硬編碼色值（hex/rgb），一律使用 `--lottery-*` 變數
- 不要手動編輯 `themes/*.css`，它是 build 產出
- 修改 SCSS 後務必執行 `npm run build:themes`，確保 `themes/*.css` 與 SCSS 同步
- `_lottery.scss` 的值不要寫硬編碼色值，只引用 `--baseColor` 的變數

### 允許保留的硬編碼
- 裝飾性 `box-shadow` 的 `rgba()` 值
- CSS `mask` 中的 `#fff`
- baseColor 無法對應的漸層中間色（如 cashier 金屬漸層的 `#a0b9c4`、`#fcfbfa`）
- 裝飾性 `text-shadow` 色值
- SVG data URI 中的嵌入色值

### 命名規則
- baseColor：`--{category}-{number}`（如 `--primary-08`、`--neutral-300`）
- lottery 變數：`--lottery-{區塊}-{屬性}`（如 `--lottery-ball-selected-border`）
- 主題資料夾命名格式：
  - `tc_{NNN}-{name}` — 標準主題（如 `tc_001-sp`、`tc_011-fw8`）
  - `tc_000-{name}` — 待分配編號的新主題（如 `tc_000-bwin789-dark`）
  - `si-{name}-{dark|light}` — siam99 系列（如 `si-siam99-dark`）
  - `tc_{NNN}-{name}-dark` / `tc_{NNN}-{name}-light` — 雙色系主題的 dark/light 變體
