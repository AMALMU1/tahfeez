/* منصة تحفيظ — السكريبت الرئيسي */

/* ---- تبويبات ---- */
function initTabs(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const btns = container.querySelectorAll('.tab-btn');
  const panels = container.querySelectorAll('.tab-panel');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}

/* ---- مهام الجدول ---- */
function initTaskChecks() {
  document.querySelectorAll('.task-chk').forEach(chk => {
    chk.addEventListener('click', () => {
      const task = chk.closest('.day-task');
      if (task) task.classList.toggle('done-t');
      chk.textContent = task && task.classList.contains('done-t') ? '✓' : '';
    });
  });
}

/* ---- تحديات: انضم/غادر ---- */
function initChallengeJoin() {
  document.querySelectorAll('[data-join]').forEach(btn => {
    btn.addEventListener('click', () => {
      const joined = btn.dataset.join === 'true';
      if (joined) {
        btn.dataset.join = 'false';
        btn.textContent = 'انضم للتحدي';
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-primary');
      } else {
        btn.dataset.join = 'true';
        btn.textContent = 'انسحب';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
      }
    });
  });
}

/* ---- تحريك أرقام ---- */
function animateNumbers() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('ar-SA');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/* ---- تحديث شريط التقدم بعد التحميل ---- */
function animatePbars() {
  document.querySelectorAll('.pbar-fill[data-w]').forEach(bar => {
    bar.style.width = '0';
    setTimeout(() => { bar.style.width = bar.dataset.w; }, 100);
  });
}

/* ---- رسالة الالتزام التحفيزية ---- */
function streakMessage(days) {
  if (days === 0)  return 'انقطع يوم... والقرآن ينتظرك. ابدأ من جديد.';
  if (days <= 2)   return 'عُد لعهدك مع الله — القرآن يشتاق لمجالستك.';
  if (days <= 6)   return 'استمر — أحب الأعمال إلى الله أدومها وإن قلّ.';
  if (days === 7)  return '٧ أيام مع كتاب الله — المداومة هي طريق أهل القرآن.';
  if (days <= 11)  return `${days} أيام — الملائكة تشهد مجلسك مع كتاب الله.`;
  if (days === 12) return 'ما شاء الله — التزامك يبني شيئاً لا يُرى إلا يوم القيامة.';
  if (days <= 20)  return `${days} يوماً متواصلاً — "من قرأ القرآن وتعلّمه وعمل به أُلبس يوم القيامة تاجًا."`;
  if (days <= 30)  return `${days} يوماً — أنت اليوم من أهل القرآن. هنيئاً لك!`;
  return `${days} يوماً — ما شاء الله! أنت تسطّر تاريخاً مع كتاب الله.`;
}

/* ---- دوائر الأسبوع ---- */
function initWeekCircles(streakDays) {
  const container = document.getElementById('week-circles');
  if (!container) return;
  const days = ['أ','ن','ث','ر','خ','ج','س'];
  const names = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  /* اليوم = الأحد (index 0)، نعرض الأسبوع الأخير */
  const todayIdx = 0;
  container.innerHTML = days.map((d, i) => {
    const isToday = i === todayIdx;
    const checked = streakDays >= (days.length - i);
    const cls = isToday ? 'wc today' : checked ? 'wc done' : 'wc';
    const icon = (isToday || checked) ? '✓' : '';
    return `<div class="${cls}" title="${names[i]}">
      <span class="wc-chk">${icon}</span>
      <span class="wc-day">${d}</span>
    </div>`;
  }).join('');

  /* الرسالة التحفيزية */
  const msgEl = document.getElementById('sh-msg');
  if (msgEl) msgEl.textContent = streakMessage(streakDays);
}

/* ---- شبكة تقدم الأجزاء ---- */
function initJuzzGrid() {
  const container = document.getElementById('juzz-grid-section');
  const tip = document.getElementById('juzz-tooltip');
  if (!container || !tip) return;

  const juzzNames = [
    'الفاتحة','البقرة','آل عمران','آل عمران','النساء',
    'النساء','المائدة','الأنعام','الأعراف','الأنفال',
    'التوبة','هود','يوسف','الحجر','الإسراء',
    'الكهف','الأنبياء','المؤمنون','الفرقان','النمل',
    'العنكبوت','الأحزاب','يس','الزمر','فصلت',
    'الأحقاف','الذاريات','المجادلة','الملك','النبأ'
  ];

  const arNums = ['١','٢','٣','٤','٥','٦','٧','٨','٩','١٠',
    '١١','١٢','١٣','١٤','١٥','١٦','١٧','١٨','١٩','٢٠',
    '٢١','٢٢','٢٣','٢٤','٢٥','٢٦','٢٧','٢٨','٢٩','٣٠'];

  /* الحالات: done / current / none */
  const states = Array(30).fill('none');
  states[27] = 'done';   /* جزء 28 */
  states[28] = 'done';   /* جزء 29 */
  states[29] = 'done';   /* جزء 30 */
  states[0]  = 'current';/* جزء  1  */

  const doneCount = states.filter(s => s === 'done').length;

  const squares = Array.from({length: 30}, (_, i) =>
    `<div class="juzz-sq ${states[i]}" data-tip="جزء ${arNums[i]} — ${juzzNames[i]}"></div>`
  ).join('');

  container.innerHTML = `
    <div style="text-align:right">
      <div style="font-size:14px;color:#3B5037;font-weight:700;line-height:1.4">رحلتك في القرآن</div>
      <div style="font-size:12px;color:rgba(59,80,55,0.45);margin-top:2px">كل مربع جزء أكملته</div>
    </div>
    <div class="juzz-grid">${squares}</div>
    <div style="font-size:13px;color:#8CBF83;text-align:center;margin-top:12px;font-weight:600">
      أكملت ${doneCount} من ٣٠ جزءاً
    </div>`;

  /* tooltip */
  container.querySelectorAll('.juzz-sq').forEach(sq => {
    sq.addEventListener('click', e => {
      e.stopPropagation();
      tip.textContent = sq.dataset.tip;
      tip.style.left = '-9999px';
      tip.style.display = 'block';
      const r = sq.getBoundingClientRect();
      const tw = tip.offsetWidth;
      const th = tip.offsetHeight;
      let left = r.left + r.width / 2 - tw / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
      tip.style.left = left + 'px';
      tip.style.top  = (r.top - th - 10) + 'px';
    });
  });

  document.addEventListener('click', () => { tip.style.display = 'none'; });
}

/* ---- تشغيل عند التحميل ---- */
document.addEventListener('DOMContentLoaded', () => {
  initTabs('tabs-leaderboard');
  initTabs('tabs-challenges');
  initTaskChecks();
  initChallengeJoin();
  animateNumbers();
  animatePbars();
  initJuzzGrid();
  initWeekCircles(14); /* الطالب لديه ١٤ يوم */
});
