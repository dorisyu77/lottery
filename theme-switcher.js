/**
 * Theme Switcher - 切換 baseColor 主題
 * 動態載入 themes/{themeName}.css 覆蓋 CSS custom properties
 *
 * 新增主題步驟：
 * 1. scss/{themeName}/_baseColor.scss  — SCSS 原始檔
 * 2. themes/{themeName}.css            — 編譯後的 CSS（:root 變數）
 * 3. HTML <select> 加入 <option value="{themeName}">
 */
(function () {
  var DEFAULT_THEME = 'tc_001-sp';
  var LINK_ID = 'theme-css';

  var select = document.getElementById('themeSwitcher');
  if (!select) return;

  // 從 localStorage 恢復上次選擇
  var saved = localStorage.getItem('lottery-theme');
  if (saved) {
    select.value = saved;
    applyTheme(saved);
  }

  select.addEventListener('change', function () {
    var theme = this.value;
    localStorage.setItem('lottery-theme', theme);
    applyTheme(theme);
  });

  function applyTheme(themeName) {
    // 移除舊的主題 CSS
    var old = document.getElementById(LINK_ID);
    if (old) old.remove();

    // 載入新主題 CSS（所有主題都載入，包含預設）
    var link = document.createElement('link');
    link.id = LINK_ID;
    link.rel = 'stylesheet';
    link.href = 'themes/' + themeName + '.css';
    document.head.appendChild(link);
  }
})();
