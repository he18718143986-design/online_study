app/：应用入口层（路由、全局 Providers、样式入口）。
    App.tsx：应用根组件，挂载 RouterProvider。
    AppProviders.tsx：全局上下文与 QueryClientProvider、主题状态容器。
    index.css：应用级样式入口（占位，可放全局覆盖）。
    router.tsx：路由树定义，绑定各 layout 与页面组件。
    routes.ts：路由路径常量及键名类型。

assets/：静态资源占位（icons/images）。
components/：全局可复用组件（cards、widgets、table、布局辅助）。
    cards/
        AssignmentItem.tsx：作业列表卡片，显示班级/状态/未批数量，支持点击和行动按钮。
        CourseCard.tsx：课程卡片，展示标题、时间段、人数和状态，提供进入/更多操作。
        MetricCard.tsx：KPI 小卡片组件，支持颜色、进度条与图标。
        RecordingCard.tsx：录播卡片，含预览、状态徽标与播放/分享/导出操作。
    breadcrumb/
        Breadcrumb.tsx：面包屑导航组件。
    header/
        Header.tsx：主头部栏，容纳导航/用户区。
    sidebar/
        Sidebar.tsx：全局侧边导航菜单。
    table/
        StudentRow.tsx：学生表格行，展示头像、在线状态、出勤与操作。
    ui/
        Drawer.tsx：抽屉容器组件。
        Modal.tsx：模态对话框组件。
        StatusBadge.tsx：通用状态徽章。
    widgets/
        AvatarStack.tsx：头像堆叠展示小部件。
        MetricCard.tsx：与 cards 版本配合的指标卡片封装。

assets/：静态资源占位。
    icons/、images/：图标与图片占位（含 .gitkeep）。

data/：数据文件。
    mock/：本地 mock 数据 JSON（assignments/courses/dashboard/...）。
    fixtures/：预留固定数据位置。

layouts/：页面框架布局。
    AppLayout.tsx：应用级布局容器。
    MainLayout.tsx：主导航布局（含 Sidebar/Header）。
    DetailLayout.tsx：详情页布局（窄侧栏）。
    ImmersiveLayout.tsx：沉浸式布局（直播等）。

modules/：按业务域拆分的组件与 hooks（示例）。
    dashboard/：实时指标、待办、课程卡片等。
    assignments/：作业管理、成绩册、批改工作室。
    courses/：课程日程、详情抽屉、日历、花名册。
    recordings/：录播列表/播放器。
    students/：学生表格、筛选、hooks。
    exams/、question-bank/、analytics/、collaboration/ 等：对应业务子模块。

pages/：路由页面入口（与 routes.ts 对应）。
    dashboard/DashboardPage.tsx：教学总览，今日课程、实时指标、待办作业。 
    courses/
        CourseSchedulePage.tsx：课程日程与花名册入口（日历+列表+抽屉）。
        CourseDetailPage.tsx：课程详情与分栏信息。
    assignments/
        AssignmentManagementPage.tsx：作业管理列表与操作。
        GradebookPage.tsx：成绩册视图。
        GradingWorkspacePage.tsx：批改工作室。
    recordings/RecordingLibraryPage.tsx：录播库页面。
    students/
        StudentListPage.tsx：学生列表、筛选与批量操作。
        StudentProfilePage.tsx：学生档案详情。
    exams/ExamManagementPage.tsx：考试管理。
    question-bank/QuestionBankPage.tsx：题库与试题管理。
    analytics/TeachingAnalyticsPage.tsx：教学分析报表。
    live/LiveTeachingPage.tsx：直播授课页面。
    resources/ResourceLibraryPage.tsx：教学资源库。
    notifications/InboxPage.tsx：通知/收件箱。
    settings/SettingsPage.tsx：系统设置与权限。
    collaboration/CollaborationReviewPage.tsx：协作与审核。
    NotFoundPage.tsx：404 占位。

services/：API/数据服务封装。
    apiClient.ts：HTTP 客户端封装。
    courses.service.ts：课程数据服务（列表/详情）。
    assignments.service.ts：作业数据服务。
    dashboard.service.ts：仪表盘数据（含 mock 回落）。
    recordings.service.ts：录播数据服务。
    students.service.ts：学生数据服务。

styles/：全局样式。
    tailwind.css：Tailwind 入口。

tests/：测试目录占位（e2e/unit）。

types/：全局类型定义。
    models/：领域模型（assignment/course/exam/question/student/recording 等）。
    dashboard.ts：仪表盘相关类型。
    index.d.ts：React/JSX/库 shim 与全局类型声明。

main.tsx：应用启动入口，挂载 App 并加载样式。
