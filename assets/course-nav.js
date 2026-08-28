// 共享课程目录：左侧导航栏（课程 + 速查资料 + 教材精读）
// 新课发布时：在 COURSE_CATALOG 登记，并在 HTML 中引入本脚本
(function () {
  var COURSE_CATALOG = {
    lessons: [
      { file: '0001-exam-overview-and-cia.html', label: '第 1 课', title: '考试地图与 CIA' },
      { file: '0002-network-attacks.html', label: '第 2 课', title: '常见网络攻击手法' },
      { file: '0003-crypto-basics.html', label: '第 3 课', title: '密码学入门' },
      { file: '0004-pki-https.html', label: '第 4 课', title: '数字证书与 PKI' },
      { file: '0005-firewall-vpn.html', label: '第 5 课', title: '防火墙与 VPN' },
      { file: '0006-ids-ips.html', label: '第 6 课', title: 'IDS 与 IPS' },
      { file: '0007-security-audit-siem.html', label: '第 7 课', title: '安全审计与 SIEM' },
      { file: '0008-vulnerability-patch.html', label: '第 8 课', title: '漏洞与补丁管理' },
      { file: '0009-malware-defense.html', label: '第 9 课', title: '恶意代码防范' },
      { file: '0010-active-defense-honeypot.html', label: '第 10 课', title: '主动防御与蜜罐' },
      { file: '0011-network-risk-assessment.html', label: '第 11 课', title: '网络安全风险评估' },
      { file: '0012-classified-protection.html', label: '第 12 课', title: '等保 2.0 等级保护' },
      { file: '0013-incident-response.html', label: '第 13 课', title: '网络安全应急响应' },
      { file: '0014-os-security.html', label: '第 14 课', title: '操作系统安全' },
      { file: '0015-database-security.html', label: '第 15 课', title: '数据库系统安全' },
      { file: '0016-network-device-security.html', label: '第 16 课', title: '网络设备安全' },
      { file: '0017-website-security.html', label: '第 17 课', title: '网站安全' },
      { file: '0018-milestone-review.html', label: '第 18 课', title: '第一阶段总结' },
      { file: '0019-cloud-security.html', label: '第 19 课', title: '云计算安全' },
      { file: '0020-ics-security.html', label: '第 20 课', title: '工控安全' }
    ],
    references: [
      { file: 'textbook-index.html', label: '教材精读', title: '官方教程 26 章考点' },
      { file: 'exam-overview.html', label: '考试全貌', title: '考试全貌与安全属性' },
      { file: 'exam-2023-2025.html', label: '23–25考点', title: '2023–2025 机考考点分布' },
      { file: 'attacks-glossary.html', label: '攻击词汇', title: '网络攻击手法词汇表' },
      { file: 'crypto-cheatsheet.html', label: '密码学', title: '密码学速查表' },
      { file: 'pki-https-cheatsheet.html', label: 'PKI/HTTPS', title: '证书 / PKI / HTTPS' },
      { file: 'firewall-vpn-cheatsheet.html', label: '防火墙/VPN', title: '防火墙与 VPN 速查' },
      { file: 'ids-ips-cheatsheet.html', label: 'IDS/IPS', title: 'IDS 与 IPS 速查' },
      { file: 'vulnerability-cheatsheet.html', label: '漏洞/补丁', title: '漏洞扫描与补丁管理' },
      { file: 'malware-cheatsheet.html', label: '恶意代码', title: '病毒蠕虫木马与 Botnet' },
      { file: 'honeypot-cheatsheet.html', label: '蜜罐', title: '主动防御与蜜罐速查' },
      { file: 'risk-assessment-cheatsheet.html', label: '风险评估', title: '网络安全风险评估速查' },
      { file: 'classified-protection-cheatsheet.html', label: '等保2.0', title: '网络安全等级保护速查' },
      { file: 'incident-response-cheatsheet.html', label: '应急响应', title: '网络安全应急响应速查' },
      { file: 'os-security-cheatsheet.html', label: 'OS安全', title: '操作系统安全速查' },
      { file: 'database-security-cheatsheet.html', label: '数据库安全', title: '数据库系统安全速查' },
      { file: 'network-device-cheatsheet.html', label: '网络设备', title: '网络设备安全速查' },
      { file: 'website-security-cheatsheet.html', label: '网站安全', title: '网站安全速查' },
      { file: 'cloud-security-cheatsheet.html', label: '云计算安全', title: '云计算安全速查' },
      { file: 'ics-security-cheatsheet.html', label: '工控安全', title: '工控安全速查' },
      { file: 'mnemonics.html', label: '口诀速查', title: '第 1-20 课口诀汇总' }
    ]
  };

  function currentFile() {
    var path = window.location.pathname || '';
    var parts = path.split('/');
    return decodeURIComponent(parts[parts.length - 1] || '');
  }

  function pageContext() {
    var path = window.location.pathname || '';
    if (path.indexOf('/textbook/') !== -1 || path.indexOf('\\textbook\\') !== -1) {
      return { type: 'textbook', lessonPrefix: '../../lessons/', refPrefix: '../' };
    }
    if (path.indexOf('/lessons/') !== -1 || path.indexOf('\\lessons\\') !== -1) {
      return { type: 'lesson', lessonPrefix: './', refPrefix: '../reference/' };
    }
    if (path.indexOf('/reference/') !== -1 || path.indexOf('\\reference\\') !== -1) {
      return { type: 'reference', lessonPrefix: '../lessons/', refPrefix: './' };
    }
    return { type: 'unknown', lessonPrefix: 'lessons/', refPrefix: 'reference/' };
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
    header.innerHTML = '<div class="sidebar-brand">软考信安</div><div class="sidebar-sub">2026 备考 · 课程目录</div>';
    sidebar.appendChild(header);

    var lessonLinks = COURSE_CATALOG.lessons.map(function (item) {
      return buildLink(
        ctx.lessonPrefix + item.file,
        item.label,
        item.title,
        file === item.file
      );
    });
    sidebar.appendChild(buildSection('课程', lessonLinks));

    var refLinks = COURSE_CATALOG.references.map(function (item) {
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
