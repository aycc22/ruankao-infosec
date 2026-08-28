// 共享课程目录：左侧导航栏（课程 + 速查资料 + 教材精读）
// 新课发布时：在 assets/course-catalog.js 登记，并在 HTML 中引入本脚本
(function () {
  function currentFile() {
    var path = window.location.pathname || '';
    var parts = path.split('/');
    return decodeURIComponent(parts[parts.length - 1] || '');
  }

  function pageContext() {
    var path = window.location.pathname || '';
    var file = currentFile();
    if (file === '' || file === 'index.html') {
      return {
        type: 'home',
        lessonPrefix: 'lessons/',
        refPrefix: 'reference/',
        assetsPrefix: 'assets/',
        homePrefix: './'
      };
    }
    if (path.indexOf('/textbook/') !== -1 || path.indexOf('\\textbook\\') !== -1) {
      return {
        type: 'textbook',
        lessonPrefix: '../../lessons/',
        refPrefix: '../',
        assetsPrefix: '../../assets/',
        homePrefix: '../../'
      };
    }
    if (path.indexOf('/lessons/') !== -1 || path.indexOf('\\lessons\\') !== -1) {
      return {
        type: 'lesson',
        lessonPrefix: './',
        refPrefix: '../reference/',
        assetsPrefix: '../assets/',
        homePrefix: '../'
      };
    }
    if (path.indexOf('/reference/') !== -1 || path.indexOf('\\reference\\') !== -1) {
      return {
        type: 'reference',
        lessonPrefix: '../lessons/',
        refPrefix: './',
        assetsPrefix: '../assets/',
        homePrefix: '../'
      };
    }
    return {
      type: 'unknown',
      lessonPrefix: 'lessons/',
      refPrefix: 'reference/',
      assetsPrefix: 'assets/',
      homePrefix: './'
    };
  }

  function loadScript(src, callback) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = callback;
    s.onerror = callback;
    document.head.appendChild(s);
  }

  function buildLink(href, label, title, active) {
    var a = document.createElement('a');
    a.className = 'nav-link' + (active ? ' active' : '');
    a.href = href;
    a.title = title;
    a.innerHTML = '<span class="nav-label">' + label + '</span><span class="nav-title">' + title + '</span>';
    return a;
  }

  function buildSection(title, links) {
    var section = document.createElement('div');
    section.className = 'nav-section';
    var heading = document.createElement('div');
    heading.className = 'nav-section-title';
    heading.textContent = title;
    section.appendChild(heading);
    var list = document.createElement('nav');
    list.className = 'nav-list';
    links.forEach(function (link) { list.appendChild(link); });
    section.appendChild(list);
    return section;
  }

  function initNav() {
    var catalog = window.COURSE_CATALOG;
    if (!catalog) return;

    var main = document.querySelector('main');
    if (!main) return;

    var file = currentFile();
    var ctx = pageContext();
    var inTextbookChapter = ctx.type === 'textbook';

    var sidebar = document.createElement('aside');
    sidebar.className = 'course-sidebar';
    sidebar.id = 'course-sidebar';

    var header = document.createElement('div');
    header.className = 'sidebar-head';
    header.innerHTML =
      '<a class="sidebar-brand" href="' + ctx.homePrefix + 'index.html">软考信安</a>' +
      '<div class="sidebar-sub">2026 备考 · 课程目录</div>';
    sidebar.appendChild(header);

    var lessonLinks = catalog.lessons.map(function (item) {
      return buildLink(
        ctx.lessonPrefix + item.file,
        item.label,
        item.title,
        file === item.file
      );
    });
    sidebar.appendChild(buildSection('课程', lessonLinks));

    var refLinks = catalog.references.map(function (item) {
      var active = file === item.file || (inTextbookChapter && item.file === 'textbook-index.html');
      return buildLink(
        ctx.refPrefix + item.file,
        item.label,
        item.title,
        active
      );
    });
    sidebar.appendChild(buildSection('速查与教材', refLinks));

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-controls', 'course-sidebar');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '目录';

    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.hidden = true;

    var shell = document.createElement('div');
    shell.className = 'page-shell';

    main.parentNode.insertBefore(toggle, main);
    main.parentNode.insertBefore(overlay, main);
    main.parentNode.insertBefore(shell, main);
    shell.appendChild(sidebar);
    shell.appendChild(main);

    function setOpen(open) {
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      overlay.hidden = !open;
    }

    toggle.addEventListener('click', function () {
      setOpen(!document.body.classList.contains('nav-open'));
    });

    overlay.addEventListener('click', function () {
      setOpen(false);
    });

    sidebar.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });
  }

  function boot() {
    initNav();
    if (window.RuankaoPWA) {
      RuankaoPWA.init();
    }
  }

  function start() {
    var ctx = pageContext();
    var assets = ctx.assetsPrefix;

    function afterCatalog() {
      if (window.RuankaoPWA) {
        boot();
      } else {
        loadScript(assets + 'pwa.js', boot);
      }
    }

    if (window.COURSE_CATALOG) {
      afterCatalog();
    } else {
      loadScript(assets + 'course-catalog.js', afterCatalog);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
