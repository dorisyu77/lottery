/**
 * TC Lottery Prototype - Banner Countdown + Interactive Number Selection
 */

/* ---- Banner Countdown Timer ---- */
(function () {
  // Demo end time: 30 hours from now
  const endDate = new Date(Date.now() + 30 * 60 * 60 * 1000);
  const dateEl = document.getElementById('bannerDate');
  const hTop = document.getElementById('cdHours');
  const hBot = document.getElementById('cdHoursBot');
  const mTop = document.getElementById('cdMinutes');
  const mBot = document.getElementById('cdMinutesBot');
  const sTop = document.getElementById('cdSeconds');
  const sBot = document.getElementById('cdSecondsBot');

  if (!hTop) return;

  // Format date
  if (dateEl) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    dateEl.textContent = `${days[endDate.getDay()]}, ${months[endDate.getMonth()]} ${endDate.getDate()}, ${endDate.getFullYear()}`;
  }

  function pad(n) { return n.toString().padStart(2, '0'); }

  function tick() {
    const now = Date.now();
    let diff = Math.max(0, Math.floor((endDate.getTime() - now) / 1000));
    const h = Math.floor(diff / 3600);
    diff %= 3600;
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    const hStr = pad(h), mStr = pad(m), sStr = pad(s);
    hTop.textContent = hBot.textContent = hStr;
    mTop.textContent = mBot.textContent = mStr;
    sTop.textContent = sBot.textContent = sStr;
  }

  tick();
  setInterval(tick, 1000);
})();

/* ---- Number Selection ---- */
(function () {
  const grid = document.getElementById('numberGrid');
  if (!grid) return;

  const MAX_PER_BALL = 5;
  const MAX_TOTAL = 10;

  // Demo: some numbers are "hot" (5+ people selected)
  const hotNumbers = new Set([7, 12, 23, 38, 45, 56, 67, 77, 88, 99]);

  // Simulated player counts for "XX 位玩家同選"
  function getPlayerCount(id) {
    if (hotNumbers.has(id)) return Math.floor(Math.random() * 20) + 5;
    return Math.floor(Math.random() * 4) + 1;
  }

  // Ball data
  const balls = [];
  const ballElements = [];
  for (let i = 0; i < 100; i++) {
    balls.push({
      id: i,
      remaining: MAX_PER_BALL,
      selected: 0,
      isHot: hotNumbers.has(i),
      playerCount: getPlayerCount(i),
    });
  }

  // Selection log: array of {ballId} entries (ordered by selection time)
  let selections = [];

  function getState(ball) {
    if (ball.remaining <= 0 && ball.isHot) return 'hot-maxed';
    if (ball.remaining <= 0) return 'maxed';
    if (ball.selected > 0 && ball.isHot) return 'hot-selected';
    if (ball.selected > 0) return 'selected';
    if (ball.isHot) return 'hot';
    return 'available';
  }

  function renderBall(ball, el) {
    const state = getState(ball);
    el.className = `ball ball--${state}`;
    el.querySelector('.ball__count').textContent = `剩 ${ball.remaining}`;
  }

  function buildPickRowHTML(ball, index) {
    const numStr = ball.id.toString().padStart(2, '0');
    return `<div class="pick-row" data-index="${index}">
      <div class="pick-row__left">
        <div class="pick-row__ball">
          <span class="pick-row__ball-num">${numStr}</span>
        </div>
        <span class="pick-row__info">${ball.playerCount} 位玩家同選</span>
      </div>
      <button class="pick-row__delete" data-index="${index}" aria-label="刪除">✕</button>
    </div>`;
  }

  function buildMobilePickHTML(ball, index) {
    const numStr = ball.id.toString().padStart(2, '0');
    const isHot = ball.isHot;
    const bgClass = isHot ? 'm-pick-ball--hot' : 'm-pick-ball--normal';
    return `<div class="m-pick-ball ${bgClass}" data-index="${index}">
      <span class="m-pick-ball__num">${numStr}</span>
      <button class="m-pick-ball__delete" data-index="${index}" aria-label="刪除">✕</button>
    </div>`;
  }

  function updateSelectionPanel() {
    const totalSelected = selections.length;
    const remaining = MAX_TOTAL - totalSelected;

    // Desktop panel elements
    const selRemaining = document.getElementById('selectionRemaining');
    const selBody = document.getElementById('selectionBody');
    const selPicks = document.getElementById('selectionPicks');
    const selBtn = document.getElementById('selectionBtn');

    // Mobile panel elements
    const mRemaining = document.getElementById('mSelectionRemaining');
    const mBody = document.getElementById('mSelectionBody');
    const mPicks = document.getElementById('mSelectionPicks');
    const mBtn = document.getElementById('mSelectionBtn');
    const mPlayerCount = document.getElementById('mPlayerCount');

    // Update remaining count
    if (selRemaining) selRemaining.textContent = `剩 ${remaining}`;
    if (mRemaining) mRemaining.textContent = `剩 ${remaining}`;

    if (selections.length === 0) {
      // Show empty state
      if (selBody) selBody.style.display = '';
      if (selPicks) selPicks.innerHTML = '';
      if (mBody) mBody.style.display = '';
      if (mPicks) mPicks.innerHTML = '';
      if (mPlayerCount) mPlayerCount.textContent = '';
    } else {
      // Hide empty state, show picks
      if (selBody) selBody.style.display = 'none';
      if (mBody) mBody.style.display = 'none';

      const desktopHTML = selections.map((s, i) => buildPickRowHTML(balls[s.ballId], i)).join('');
      const mobileHTML = selections.map((s, i) => buildMobilePickHTML(balls[s.ballId], i)).join('');

      if (selPicks) {
        selPicks.innerHTML = desktopHTML;
        selPicks.querySelectorAll('.pick-row__delete').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleRemove(parseInt(btn.dataset.index));
          });
        });
      }
      if (mPicks) {
        mPicks.innerHTML = mobileHTML;
        mPicks.querySelectorAll('.m-pick-ball__delete').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleRemove(parseInt(btn.dataset.index));
          });
        });
      }
      // Show last selected ball's player count
      if (mPlayerCount) {
        const lastBall = balls[selections[selections.length - 1].ballId];
        mPlayerCount.textContent = `${lastBall.playerCount} 位玩家同選`;
      }
    }

    // Update button state
    const canSubmit = totalSelected > 0;
    if (selBtn) {
      selBtn.disabled = !canSubmit;
      selBtn.textContent = canSubmit ? `確認投注 (${totalSelected})` : '確認投注';
    }
    if (mBtn) {
      mBtn.disabled = !canSubmit;
      mBtn.textContent = canSubmit ? `確認投注 (${totalSelected})` : '確認投注';
    }
  }

  function handleClick(ball, el) {
    if (ball.remaining <= 0) return;
    if (selections.length >= MAX_TOTAL) return;

    ball.remaining--;
    ball.selected++;
    selections.push({ ballId: ball.id });

    renderBall(ball, el);
    updateSelectionPanel();
  }

  function handleRemove(index) {
    const removed = selections[index];
    if (!removed) return;

    const ball = balls[removed.ballId];
    ball.remaining++;
    ball.selected--;
    selections.splice(index, 1);

    renderBall(ball, ballElements[ball.id]);
    updateSelectionPanel();
  }

  // Create ball elements
  balls.forEach((ball) => {
    const el = document.createElement('div');
    const numStr = ball.id.toString().padStart(2, '0');
    const state = getState(ball);

    el.className = `ball ball--${state}`;
    el.innerHTML = `
      <span class="ball__number">${numStr}</span>
      <span class="ball__count">剩 ${ball.remaining}</span>
    `;

    el.addEventListener('click', () => handleClick(ball, el));
    grid.appendChild(el);
    ballElements.push(el);
  });

  // Constrain side panel height to number grid height
  const sidePanel = document.querySelector('.side-panel');
  function syncSidePanelHeight() {
    if (!sidePanel) return;
    sidePanel.style.maxHeight = grid.offsetHeight + 'px';
  }
  syncSidePanelHeight();
  window.addEventListener('resize', syncSidePanelHeight);

  // Scroll fade: hide bottom gradient when scrolled to bottom
  const picksWrapper = document.getElementById('selectionPicksWrapper');
  const picksEl = document.getElementById('selectionPicks');
  if (picksEl && picksWrapper) {
    picksEl.addEventListener('scroll', () => {
      const atBottom = picksEl.scrollHeight - picksEl.scrollTop - picksEl.clientHeight < 2;
      picksWrapper.classList.toggle('at-bottom', atBottom);
    });
  }

  updateSelectionPanel();
})();
