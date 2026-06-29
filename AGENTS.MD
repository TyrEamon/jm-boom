# JM Boom Project Notes

本文件给后续接手的 Codex 使用，目标是快速理解项目约束、当前架构。内容应保持短而准，避免记录已经完成的过程流水账。

## 接手约定

- 项目是 Tauri 2 + React 19 + Vite + TanStack Router/Query + Zustand + shadcn/ui + Rust reqwest。
- 当前优先桌面端体验，小屏适配不是近期重点。
- 不要手动编辑 `src/routeTree.gen.ts`，路由树由 TanStack Router 插件、HMR 或 build 生成。
- 读取或写入包含中文的文件时必须显式使用 UTF-8，避免 Windows 终端默认编码导致乱码。
- 可以并行读取文件或搜索；文件编辑使用单次 `apply_patch`，不要重复或并行套同一补丁。
- `cargo check`、`vite build`、`tsc` 等会占用输出目录或 build lock 的验证命令不要并行重复触发。
- 前端和 Rust 通信用 Tauri `invoke`，项目不使用 axios。
- UI 优先复用 shadcn/ui 已安装组件；需要新的 shadcn 组件时，告诉用户安装，不要自己重造复杂基础组件。
- 项目已有 `floating-nav`，不要新增传统 sidebar。
- Rust 依赖可直接添加并用 `cargo check` 下载；前端依赖不要直接安装，先告诉用户。
- 用户此前表示暂时不要纠结 `lint`；不要因为 `lint` 结果扩大无关改动。
- 每次大的变动后，同步用户相应的 `commit msg`。

## 验证命令

- 常规前端验证优先跑 `bun run build`。
- 如果 Windows 环境没有 `bun`，跑：
  - `node_modules/.bin/tsc.exe --noEmit`
  - `node_modules/.bin/vite.exe build`
- 改 `src-tauri` Rust 代码后跑：
  - 工作目录 `src-tauri`
  - `cargo check`
- 只有在新增或调整测试时再跑相关 `cargo test`。

## 发布流程

- 发布前必须同步修改三处版本号：`package.json`、`src-tauri/tauri.conf.json`、`src-tauri/Cargo.toml`。
- 改完 Rust crate 版本后运行 `cargo check`，更新并验证 `src-tauri/Cargo.lock` 中的 `jm-boom` 版本。
- 每个发布 tag 必须有对应发布日志：`docs/release-notes/<tag>.md`，例如 `docs/release-notes/v0.2.2.md`。
- 发布日志按上一个 tag 到本次发布的 commit 生成，建议先看提交范围：
  - `git describe --tags --abbrev=0`
  - `git log <previous-tag>..HEAD --oneline`
- GitHub Actions 会校验发布日志包含以下四个板块，为空则不保留标题：
  - `## 功能`
  - `## 优化`
  - `## 修复`
  - `## 其他`
- 发布日志不需要带类似 “# JM Boom v0.2.2” 的版本号。
- 每条发布日志记录尽量带对应 commit hash 链接，格式示例：`- 设置页进入时自动检查更新 ([abc1234](https://github.com/ppxb/jm-boom/commit/abc1234))`。
- TAURI_SIGNING_PRIVATE_KEY 用户已完成配置，发布由用户手动通过 Github Workflow 完成。

## 参考项目

- API / 数据源主要参考同级 `Breeze-plugin-JmComic`。
- `Breeze` 更适合作为桌面/跨平台阅读器排版与翻页参考。

## 项目结构

- 前端路由在 `src/routes`。
- 普通页面在 `_app` 下，阅读页是独立路由 `src/routes/reader/$comicId.tsx`，不挂 `_app`，所以没有 `floating-nav`。
- 全局用户状态在 `src/stores/user-store.ts`。
- 设置状态在 `src/stores/settings-store.ts`，使用 Zustand persist，当前包含 API endpoint、阅读缓存上限、代理和封面隐私模式。
- 阅读历史在 `src/stores/reading-history-store.ts`，persist key 是 `jm-boom-reading-history`。
- Rust API 已拆分：
  - `src-tauri/src/api.rs`：远程设置、搜索、首页、列表、排行、收藏、详情、评论、登录、签到、代理等普通接口。
  - `src-tauri/src/reader.rs`：阅读 manifest、图片下载、解扰、缓存、reader cache 管理。
  - `src-tauri/src/updater.rs`：应用更新检查和安装。
  - `src-tauri/src/lib.rs`：Tauri command 包装和 invoke handler 注册。

## 当前功能

- 首页：`src/routes/_app/index.tsx`，使用 `getHomeFeed`，信息流纵向展示，右侧轻量导航，含 BackTop。
- 列表页：`src/routes/_app/list.tsx`，复用 `getHomeSectionList`，承接首页分区、周榜、排行等列表入口。
- 每周推荐：`src/routes/_app/weekly.tsx`，使用 shadcn `Tabs`/`Select`，items 用 `ComicGrid`。
- 排行榜：`src/routes/_app/ranking.tsx`，使用 `getHomeSectionList` + `ranking-filters`。
- 收藏：`src/routes/_app/favorites.tsx`，依赖登录态，使用 `getFavoriteComics`。
- 详情页：`src/routes/_app/comic/$comicId.tsx`，展示详情、章节、相关推荐、评论 Drawer，支持收藏切换。
- 历史观看：`src/routes/_app/history.tsx`，以作品 `comicId` 为唯一键覆盖历史，`chapterId` 保存当前章节/read id；点击历史进入 `/reader/$comicId` 并带 `pageIndex` 恢复进度。
- 阅读页：`src/routes/reader/$comicId.tsx` + `src/features/reader/*`，`$comicId` 语义是 read/chapter id，作品 id 来自 search `albumId`。
- 设置页：`src/routes/_app/settings.tsx`，动态发现 API endpoint，支持 HTTP/SOCKS5 代理、主题、封面隐私、缓存上限、缓存管理和应用更新。
- 个人中心：`src/routes/_app/me.tsx`，登录态来自 Zustand，支持签到数据和签到操作。

## Rust / Tauri API 要点

- 主要 commands：`get_remote_setting`、`discover_api_endpoints`、`search_comics`、`get_home_feed`、`get_home_section_list`、`get_week_filters`、`get_week_items`、`get_comic_detail`、`toggle_comic_favorite`、`get_favorite_comics`、`get_comic_comments`、`login`、`get_sign_in_data`、`sign_in`、`clear_session`、`configure_network_proxy`、`get_reader_cache_stats`、`clear_reader_cache`、`open_reader_cache_dir`、`get_comic_read_manifest`、`get_comic_read_page`、`check_app_update`、`install_app_update`。
- 移动端 API `tokenparam` 版本对齐 Breeze 插件为 `2.0.20`。
- API endpoint 动态发现从 `newsvr-2025.txt` 解密 host 池，合并本地 fallback 后测速；业务请求只规范化 http/https endpoint，空 endpoint 回退到 `https://www.cdnhth.club`。
- Rust 侧支持全局代理配置，`configure_network_proxy` 会重建共享 reqwest client；HTTP/SOCKS5 依赖 reqwest `socks` feature。
- 登录使用共享 reqwest client 和全局 JWT token 维持会话，重新登录前和退出时调用 `clear_session`。
- 小说分组已过滤；详情接口遇到小说或书库内容会返回不支持提示，当前只实现漫画图片阅读链路。

## 阅读器行为

- 阅读页左右方向键翻页，`Esc` 返回，左右透明点击区也可翻页。
- 图片使用 `h-screen w-screen object-contain`，尽量占满视口但不裁切。
- 顶部 toolbar 鼠标移动时出现，短暂后隐藏；键盘操作时隐藏。
- 底部悬浮进度条显示页码；最后一页且存在下一章时显示“下一章”按钮。
- `pageIndex` search 作为初始页，`useReaderPages` 会规范化并在 manifest 返回页数后 clamp。
- 阅读进度只在已有章节标题且 `pageCount > 0` 时写入历史，避免保存无效页数。

## 阅读器当前实现

- `get_comic_read_manifest` 请求 `/chapter` 接口，用 `serde_json` 解析响应，构建图片页 manifest。
- `get_comic_read_page` 下载图片、必要时解扰、写入 app cache 的 `reader` 目录，再通过 Tauri asset protocol 给前端显示。
- `tauri.conf.json` 已允许 `$APPCACHE/reader/**`。
- 缓存上限默认约 512MB，设置页可选 128MB 到 2GB；修剪目标约为上限的 82%。
- 非扰图直接缓存原始 bytes，不再整图解码；冷缓存返回宽高 `0/0`，前端当前不依赖宽高排版。
- 扰图缓存输出 lossy WebP，当前使用 `webp` crate / libwebp，质量 `75.0`，缓存文件为 `.webp`。
- 扰图解码先 `image::load_from_memory`，转 RGB 后按 raw row copy 重排；主要成本通常在 `load_ms` 和 `encode_ms`。
- 前端 `useReaderPages` 当前页请求传 `requestOrigin: 'visible'`；相邻预取页传 `requestOrigin: 'prefetch'`。
- 当前预取在前端用 `queryClient.prefetchQuery` 串行执行，半径固定为 `BREEZE_ROW_PREFETCH_RADIUS = 1`，顺序为 `+1, -1`。
- 预取在当前页 ready 后触发；同一窗口用 `prefetchKeyRef` 去重。
- Rust 侧有同缓存路径 single-flight 锁，避免同一页重复冷处理。
- 缓存写入使用同目录 `.tmp` 文件，完成后 rename 为正式缓存文件；缓存统计和清理跳过 `.tmp`，避免并发读取半写文件。
- 当前阅读器性能日志包含 `origin=visible|prefetch`、`lock_wait_ms`、`download_ms`、`cache_ms`、`load_ms`、`reorder_ms`、`encode_ms`、`write_ms`、`cleanup_ms`、`source_kb`、`output_kb`、`ratio`、`delta_kb`。
- 当前没有单独的 Rust `prefetch_comic_read_pages` command，也没有设置页“预载数量/阅读线路”选项；如需恢复，先重新设计前后端契约。

## 后续优化重点

- 保证可见页优先返回，不被后台预热任务拖慢；分析日志时优先看 `origin=visible`。

- 评估是否提前触发预取，不必等当前页完全 ready 才补后续页。
- 检查 `ReaderImage` 的 loading 状态切换，避免图片已可用但界面还在停顿。
- 当前日志适合调参，但发布前应考虑 debug 开关或收敛日志量。
- 后续排版方向参考 Breeze：单页 `contain` 当前已接近；滚动模式可学习 Breeze 的图片尺寸缓存，避免列表高度跳动；双页/RTL/LTR 支持尚未实现。

## 注意事项

- 历史观看依赖 `currentIndex`、`pageCount`、`chapterId`、`albumId` 等前端字段；优化图片解码和缓存时不要改 `get_comic_read_page` 的 `index` 语义、缓存路径命名规则或阅读页 search 参数。
- 阅读缓存路径规则目前是章节 read id 目录下 `0001.ext`；不要随意变更，否则热缓存命中和历史恢复体验会受影响。
- `src/features/reader/reader-bars.tsx` 可能有用户侧小改动，页码显示是 `{current} / {pageCount}`，不要无关回滚。
