# 三人协作说明

三个成员共用 **一个 React + Vite 网站**，不是分别制作三个网站。

| Branch | 负责内容 |
|---|---|
| chapter-1-ml | `src/chapters/chapter1/` — Machine Learning |
| chapter-2-rl | `src/chapters/chapter2/` — Reinforcement Learning |
| chapter-3-fairness | `src/chapters/chapter3/` — AI Bias & Fairness |
| main | Integration Lead 维护网站框架、翻页组件与总体设计 |

## 开发流程
1. 每个人克隆 repository，切换到自己的 Branch。
2. 在自己的 `src/chapters/chapterN/` 修改故事和小游戏，不要修改其他人的章节。
3. `npm install`，`npm run dev` 本地预览；提交前运行 `npm run build`。
4. 在 GitHub 创建 Pull Request，目标是 `main`，由 Integration Lead 审核合并。

## 开发前统一
- Lily 和 Pip 的视觉形象、插画风格
- 页面排版、字体、颜色（全局 theme.css）
- 游戏嵌入书页，不跳转网站
- 页面 `Content` 组件与 `onComplete('chapterN')` 接口
- 适合 Grades 2–3，游戏要有触屏和键盘替代操作

**注意**：目前为演示原型，游戏不是实际训练的 AI 模型；角色图片是 emoji 占位。
