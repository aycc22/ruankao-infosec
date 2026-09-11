(function () {
  var DEFAULT_LESSON = {
    file: '0026-gm-crypto-params.html',
    label: '第 26 课',
    title: '国密算法参数表'
  };

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function renderContinue() {
    var mount = document.getElementById('continue-learning');
    if (!mount) return;

    var last = window.RuankaoPWA && RuankaoPWA.getLastLesson();
    var lesson = DEFAULT_LESSON;

    if (last && last.file) {
      var found = COURSE_CATALOG.lessons.find(function (item) { return item.file === last.file; });
      if (found) lesson = found;
    }

    var card = el('a', 'continue-card');
    card.href = 'lessons/' + lesson.file;
    card.innerHTML =
      '<span class="continue-label">继续学习</span>' +
      '<span class="continue-title">' + lesson.label + ' · ' + lesson.title + '</span>';
    mount.appendChild(card);
  }

  function renderLessons() {
    var mount = document.getElementById('lesson-grid');
    if (!mount) return;

    var last = window.RuankaoPWA && RuankaoPWA.getLastLesson();
    var lastFile = last && last.file;

    COURSE_CATALOG.lessons.forEach(function (item) {
      var card = el('a', 'lesson-card' + (item.file === lastFile ? ' current' : ''));
      card.href = 'lessons/' + item.file;
      card.innerHTML =
        '<span class="card-label">' + item.label + '</span>' +
        '<span class="card-title">' + item.title + '</span>';
      mount.appendChild(card);
    });
  }

  function renderQuestionBank() {
    var mount = document.getElementById('question-bank-entry');
    if (!mount || !COURSE_CATALOG.questionBank) return;

    var hub = COURSE_CATALOG.questionBank[0];
    if (!hub) return;

    var card = el('a', 'continue-card practice-card');
    card.href = 'question-bank/' + hub.file;
    card.innerHTML =
      '<span class="continue-label">题库</span>' +
      '<span class="continue-title">自编冲刺 · 第 1–24 课综合单选 + 下午卷案例</span>';
    mount.appendChild(card);
  }

  function renderRefs() {
    var mount = document.getElementById('ref-chips');
    if (!mount) return;

    var featured = [
      'textbook-index.html',
      'mnemonics.html',
      'exam-overview.html',
      'exam-2023-2025.html'
    ];

    var bankHub = COURSE_CATALOG.questionBank && COURSE_CATALOG.questionBank[0];
    if (bankHub) {
      var bankChip = el('a', 'ref-chip');
      bankChip.href = 'question-bank/' + bankHub.file;
      bankChip.textContent = '题库';
      bankChip.title = bankHub.title;
      mount.appendChild(bankChip);
    }

    featured.forEach(function (file) {
      var item = COURSE_CATALOG.references.find(function (ref) { return ref.file === file; });
      if (!item) return;
      var chip = el('a', 'ref-chip');
      chip.href = 'reference/' + item.file;
      chip.textContent = item.label;
      chip.title = item.title;
      mount.appendChild(chip);
    });

    COURSE_CATALOG.references.forEach(function (item) {
      if (featured.indexOf(item.file) !== -1) return;
      var chip = el('a', 'ref-chip');
      chip.href = 'reference/' + item.file;
      chip.textContent = item.label;
      chip.title = item.title;
      mount.appendChild(chip);
    });
  }

  function renderOnlineStatus() {
    var node = document.getElementById('pwa-status');
    if (!node) return;

    function update() {
      var online = navigator.onLine;
      node.textContent = online ? '已联网 · 课程内容可自动更新' : '离线模式 · 已缓存课程可继续学习';
      node.className = 'pwa-status ' + (online ? 'online' : 'offline');
    }

    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
  }

  function init() {
    renderContinue();
    renderQuestionBank();
    renderLessons();
    renderRefs();
    renderOnlineStatus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
