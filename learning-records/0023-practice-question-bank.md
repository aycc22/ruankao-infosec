# 0023 · 独立自编题库（`question-bank/`）

- 日期：2026-09-10
- 性质：应学员要求把练习题写入项目；**独立目录**，不塞进 `lessons/*.html`。**不是**某课对话结业测，也**不是**官方真题。

## 做了什么

- 目录：`question-bank/`（与 `lessons/`、`reference/` 并列）
- **题库拥有者：aycc345**（`manifest.json` → `"owner": "aycc345"`）。托管在 `aycc22/ruankao-infosec` 不等于 aycc22 拥有本题库。
- 入口：`question-bank/index.html`；综合卷：`question-bank/sprint.html`（由 `_gen.py` 生成）
- 60 道单选（复用 `assets/quiz.js` 点选判分）+ 3 道下午卷风格简答（`<details>` 参考要点）
- 首页按钮「题库」、侧栏「题库」、`COURSE_CATALOG.questionBank`、Service Worker 预缓存已接通

## 覆盖与加练

- 主覆盖第 1–24 课；第 25 课访问控制仅 3 道轻量题（ACL / BLP·Biba / PDRR）
- 历史易错点写入卷首「易错回炉」：公私钥方向、DMZ/屏蔽子网、木马英文三关键词、等保测评≠风险评估

## 使用注意

- 标签必须保持「自编练习」，避免被当成真题原卷
- 学完第 25 课后仍按 `POST-LESSON-QUIZ.md` 做对话结业测
