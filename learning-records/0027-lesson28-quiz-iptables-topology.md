# 0027：第 28 课结业测（iptables 命令模板 + 拓扑填空 · 7/7）

2026-09-20 对话逐题测验：**7/7 全对**。Q1 ✓ filter 本机套接字 → INPUT；Q2 ✓ `-P INPUT ACCEPT` → 黑名单思路；Q3 ✓ 默认拒绝用 `-P INPUT DROP`（不是 -A）；Q4 ✓ SSH：`iptables -A INPUT -p tcp --dport 22 -j ACCEPT`；Q5 ✓ `-A` 追加链尾，`-I` 默认插链头；Q6 ✓ English：INPUT for local sockets；Q7 ✓ Web→DMZ，库→内网。

**错题**：无。

**Implications**：filter 三链（本机套接字走 INPUT）、默认 ACCEPT=黑名单 / 默认拒绝写 `-P INPUT DROP`（不是 `-A`）、SSH 放行模板、`-A` 链尾与 `-I` 链头、英文 INPUT for local sockets、Web→DMZ 且库→内网已掌握。无新增易错点。第 22 课单独结业测分数仍无记录，不编造。下一课入口：真题计时模考 / 题库冲刺——可先刷 `question-bank/sprint.html`（自编综合冲刺卷已存在）；独立「真题计时模考」课尚未制作。
