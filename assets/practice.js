// 冲刺练习：统计已作答 / 答对题数（复用 quiz.js 的点击判分）
(function () {
  function count() {
    var quizzes = document.querySelectorAll('.quiz');
    var answered = 0;
    var correct = 0;
    quizzes.forEach(function (quiz) {
      var opts = quiz.querySelectorAll('.opt');
      var done = false;
      opts.forEach(function (o) {
        if (o.disabled || o.classList.contains('correct') || o.classList.contains('wrong')) {
          done = true;
        }
      });
      if (!done) return;
      answered += 1;
      if (!quiz.querySelector('.opt.wrong')) correct += 1;
    });
    return { total: quizzes.length, answered: answered, correct: correct };
  }

  function render() {
    var bar = document.getElementById('practice-progress');
    if (!bar) return;
    var s = count();
    if (s.answered === 0) {
      bar.textContent = '共 ' + s.total + ' 道单选 · 点选项后显示对错与解析';
    } else {
      bar.textContent = '已作答 ' + s.answered + ' / ' + s.total + ' · 答对 ' + s.correct;
    }
  }

  function bind() {
    document.querySelectorAll('.quiz .opt').forEach(function (opt) {
      opt.addEventListener('click', function () {
        setTimeout(render, 0);
      });
    });
    if (typeof MutationObserver === 'function') {
      var observer = new MutationObserver(render);
      document.querySelectorAll('.quiz').forEach(function (quiz) {
        observer.observe(quiz, { attributes: true, subtree: true, attributeFilter: ['class', 'disabled'] });
      });
    }
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
