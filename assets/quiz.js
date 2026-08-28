// 共享测验脚本：点击选项 → 高亮对错 → 显示解释
// 用法：<div class="quiz"><div class="q">题目</div><div class="opts">
//       <button class="opt" data-correct="true">正确项</button>
//       <button class="opt">干扰项</button></div>
//       <div class="explain">答案解析</div></div>
(function () {
  document.querySelectorAll('.quiz').forEach(function (quiz) {
    var opts = quiz.querySelectorAll('.opt');
    opts.forEach(function (opt) {
      opt.addEventListener('click', function () {
        if (opt.disabled) return;
        opts.forEach(function (o) {
          o.disabled = true;
          if (o.dataset.correct === 'true') o.classList.add('correct');
          else if (o === opt) o.classList.add('wrong');
        });
        var explain = quiz.querySelector('.explain');
        if (explain) explain.classList.add('show');
      });
    });
  });
})();
