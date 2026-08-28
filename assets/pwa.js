// PWA：manifest 注入、Service Worker 注册、安装提示
(function (global) {
  var STORAGE_LAST_LESSON = 'ruankao-last-lesson';

  function getAppRoot() {
    var path = window.location.pathname || '/';
    var markers = ['/lessons/', '/reference/', '/assets/'];
    for (var i = 0; i < markers.length; i++) {
      var idx = path.indexOf(markers[i]);
      if (idx !== -1) return path.slice(0, idx + 1);
    }
    if (path.endsWith('index.html')) {
      return path.slice(0, path.lastIndexOf('/') + 1);
    }
    if (!path.endsWith('/')) {
      return path.slice(0, path.lastIndexOf('/') + 1);
    }
    return path;
  }

  function assetsPrefix() {
    var path = window.location.pathname || '';
    if (path.indexOf('/textbook/') !== -1) return '../../assets/';
    if (path.indexOf('/lessons/') !== -1 || path.indexOf('/reference/') !== -1) return '../assets/';
    return 'assets/';
  }

  function ensureMeta(name, content) {
    if (!content) return;
    var el = document.querySelector('meta[name="' + name + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function ensureLink(rel, href, extra) {
    var selector = 'link[rel="' + rel + '"]';
    if (extra && extra.sizes) selector += '[sizes="' + extra.sizes + '"]';
    var el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('link');
      el.rel = rel;
      if (extra) {
        Object.keys(extra).forEach(function (k) { el.setAttribute(k, extra[k]); });
      }
      document.head.appendChild(el);
    }
    el.href = href;
  }

  function injectHeadTags() {
    var root = getAppRoot();
    ensureLink('manifest', root + 'manifest.webmanifest');
    ensureMeta('theme-color', '#2f5d50');
    ensureMeta('apple-mobile-web-app-capable', 'yes');
    ensureMeta('apple-mobile-web-app-status-bar-style', 'default');
    ensureMeta('apple-mobile-web-app-title', '软考信安');
    ensureLink('apple-touch-icon', root + 'assets/icons/icon-192.png');
    ensureLink('icon', root + 'assets/icons/icon-192.png', { sizes: '192x192', type: 'image/png' });
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    var root = getAppRoot();
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(root + 'sw.js', { scope: root })
        .catch(function () { /* 本地 file:// 打开时可能失败，忽略 */ });
    });
  }

  function saveLastLesson(file, title) {
    try {
      localStorage.setItem(STORAGE_LAST_LESSON, JSON.stringify({ file: file, title: title, at: Date.now() }));
    } catch (e) { /* ignore */ }
  }

  function getLastLesson() {
    try {
      var raw = localStorage.getItem(STORAGE_LAST_LESSON);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function trackLessonVisit() {
    var path = window.location.pathname || '';
    if (path.indexOf('/lessons/') === -1) return;
    var file = decodeURIComponent(path.split('/').pop() || '');
    if (!file || !global.COURSE_CATALOG) return;
    var lesson = global.COURSE_CATALOG.lessons.find(function (item) { return item.file === file; });
    if (lesson) saveLastLesson(lesson.file, lesson.label + ' · ' + lesson.title);
  }

  function setupInstallPrompt(buttonId) {
    var deferred;
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferred = e;
      var btn = document.getElementById(buttonId);
      if (btn) btn.hidden = false;
    });

    var btn = document.getElementById(buttonId);
    if (!btn) return;

    btn.addEventListener('click', function () {
      if (!deferred) return;
      deferred.prompt();
      deferred.userChoice.finally(function () {
        btn.hidden = true;
        deferred = null;
      });
    });

    window.addEventListener('appinstalled', function () {
      btn.hidden = true;
    });
  }

  function init(options) {
    options = options || {};
    injectHeadTags();
    registerServiceWorker();
    trackLessonVisit();
    if (options.installButtonId) setupInstallPrompt(options.installButtonId);
  }

  global.RuankaoPWA = {
    init: init,
    getAppRoot: getAppRoot,
    assetsPrefix: assetsPrefix,
    getLastLesson: getLastLesson,
    saveLastLesson: saveLastLesson
  };
})(window);
