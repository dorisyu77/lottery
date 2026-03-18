#!/bin/bash
# 自動編譯所有 scss/{theme}/_baseColor.scss + common/_lottery.scss → themes/{theme}.css
# 用法: npm run build:themes 或 bash build-themes.sh

SCSS_DIR="scss"
OUT_DIR="themes"
COMMON="$SCSS_DIR/common/_lottery.scss"

mkdir -p "$OUT_DIR"

count=0
for file in "$SCSS_DIR"/*/_baseColor.scss; do
  [ -f "$file" ] || continue
  theme=$(basename "$(dirname "$file")")
  # 跳過 common 資料夾
  [ "$theme" = "common" ] && continue

  # 建立暫存檔，import baseColor + common lottery
  tmp="/tmp/_theme_${theme}.scss"
  echo "@import '$(cd "$(dirname "$file")" && pwd)/baseColor';" > "$tmp"
  [ -f "$COMMON" ] && echo "@import '$(cd "$(dirname "$COMMON")" && pwd)/lottery';" >> "$tmp"
  override_dir="$(cd "$(dirname "$file")" && pwd)"
  if [ -f "$override_dir/_gradationOverride.scss" ]; then
    echo "@import '${override_dir}/gradationOverride';" >> "$tmp"
  fi

  npx sass "$tmp" "$OUT_DIR/$theme.css" --no-source-map
  rm -f "$tmp"
  echo "✓ $theme.css"
  count=$((count + 1))
done

echo "完成：共編譯 $count 個主題"
