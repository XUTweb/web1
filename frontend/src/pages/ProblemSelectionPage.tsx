import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ProfilePanel from "@/components/ProfilePanel";
import AIGeneratePanel from "@/components/AIGeneratePanel";
import { useContext } from "react";
import { AuthContext } from "@/contexts/authContext";

// 题目类型定义
interface Problem {
  id: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string; // 学科分类，如"数据结构"、"计算机网络"、"Java"等
  tags: string[]; // 知识点标签，如"哈希表"、"双指针"等
  completed: boolean;
  bookmarked: boolean;
  通过率: number;
}

// 模拟题目数据
const MOCK_PROBLEMS: Problem[] = [
  {
    id: 1,
    title: "两数之和",
    difficulty: "easy",
    category: "数据结构",
    tags: ["数组", "哈希表", "双指针"],
    completed: true,
    bookmarked: true,
    通过率: 45.6,
  },
  {
    id: 2,
    title: "有效的括号",
    difficulty: "easy",
    category: "数据结构",
    tags: ["字符串", "栈"],
    completed: true,
    bookmarked: false,
    通过率: 42.8,
  },
  {
    id: 3,
    title: "合并两个有序链表",
    difficulty: "easy",
    category: "数据结构",
    tags: ["递归", "链表"],
    completed: false,
    bookmarked: true,
    通过率: 58.2,
  },
  {
    id: 4,
    title: "IP地址与MAC地址的关系",
    difficulty: "medium",
    category: "计算机网络",
    tags: ["网络层", "数据链路层"],
    completed: false,
    bookmarked: false,
    通过率: 61.5,
  },
  {
    id: 5,
    title: "进程调度算法",
    difficulty: "medium",
    category: "操作系统",
    tags: ["进程管理", "调度策略"],
    completed: false,
    bookmarked: true,
    通过率: 33.2,
  },
  {
    id: 6,
    title: "Java多线程同步机制",
    difficulty: "medium",
    category: "Java",
    tags: ["多线程", "并发编程", "synchronized"],
    completed: false,
    bookmarked: false,
    通过率: 65.4,
  },
  {
    id: 7,
    title: "Python装饰器原理",
    difficulty: "hard",
    category: "Python",
    tags: ["函数式编程", "元编程"],
    completed: false,
    bookmarked: true,
    通过率: 49.8,
  },
  {
    id: 8,
    title: "C语言指针与数组",
    difficulty: "hard",
    category: "C语言",
    tags: ["指针", "内存管理", "数组"],
    completed: false,
    bookmarked: false,
    通过率: 38.1,
  },
  {
    id: 9,
    title: "Cache替换算法",
    difficulty: "medium",
    category: "计算机组成原理",
    tags: ["存储系统", "缓存"],
    completed: false,
    bookmarked: false,
    通过率: 52.3,
  },
  {
    id: 10,
    title: "时间复杂度分析",
    difficulty: "easy",
    category: "算法分析",
    tags: ["复杂度", "渐进分析"],
    completed: true,
    bookmarked: false,
    通过率: 72.1,
  },
];

// 题目分类
const CATEGORIES = [
  "全部",
  "计算机组成原理",
  "数据结构",
  "计算机网络",
  "操作系统",
  "Java",
  "Python",
  "C语言",
  "算法分析",
];

export default function ProblemSelectionPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeView, setActiveView] = useState<"problems" | "profile" | "ai-generate">(
    "problems"
  );
  
  // 处理AI生成的题目
  const handleGeneratedProblems = (problems: any[]) => {
    // 将生成的题目添加到问题列表中
    const newProblems = problems.map(problem => ({
      ...problem,
      completed: false,
      bookmarked: false,
      通过率: 0
    }));
    
    setProblems(prev => [...prev, ...newProblems]);
    setFilteredProblems(prev => [...prev, ...newProblems]);
    
    // 切换到题目视图
    setActiveView("problems");
    toast.success("题目已添加到题库！");
  };


  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false); // 控制设置菜单的显示状态
  const [bgColor, setBgColor] = useState("bg-gray-50"); // 当前背景颜色
  const problemsPerPage = 6;

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // 使用 AuthContext 中的 logout 函数

  // 当导航栏关闭时，自动关闭设置菜单
  useEffect(() => {
    if (sidebarCollapsed) {
      setShowSettingsMenu(false);
    }
  }, [sidebarCollapsed]);

  // 退出登录函数
  const handleLogout = () => {
    localStorage.removeItem("userProblems"); // 清除题目数据
    logout(); // 调用 AuthContext 中的 logout 函数
    setShowSettingsMenu(false); // 关闭设置菜单
  };

  // 切换设置菜单显示状态
  const toggleSettingsMenu = () => {
    setShowSettingsMenu(!showSettingsMenu);
  };

  // 初始化题目数据
  useEffect(() => {
    // 从localStorage获取用户的题目完成状态
    const savedProblems = localStorage.getItem("userProblems");
    if (savedProblems) {
      setProblems(JSON.parse(savedProblems));
    } else {
      setProblems(MOCK_PROBLEMS);
      localStorage.setItem("userProblems", JSON.stringify(MOCK_PROBLEMS));
    }
  }, []);

  // 过滤题目
  useEffect(() => {
    let result = [...problems];

    // 学科分类过滤
    if (selectedCategory !== "全部") {
      result = result.filter(
        (problem) => problem.category === selectedCategory
      );
    }

    // 难度过滤
    if (difficultyFilter.length > 0) {
      result = result.filter((problem) =>
        difficultyFilter.includes(problem.difficulty)
      );
    }

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (problem) =>
          problem.title.toLowerCase().includes(query) ||
          problem.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // 已完成过滤
    if (!showCompleted) {
      result = result.filter((problem) => !problem.completed);
    }

    // 收藏过滤
    if (showBookmarked) {
      result = result.filter((problem) => problem.bookmarked);
    }

    setFilteredProblems(result);
    setCurrentPage(1); // 重置到第一页
  }, [
    problems,
    selectedCategory,
    difficultyFilter,
    searchQuery,
    showCompleted,
    showBookmarked,
  ]);

  // 切换题目收藏状态
  const toggleBookmark = (id: number) => {
    const updatedProblems = problems.map((problem) =>
      problem.id === id
        ? { ...problem, bookmarked: !problem.bookmarked }
        : problem
    );
    setProblems(updatedProblems);
    localStorage.setItem("userProblems", JSON.stringify(updatedProblems));
    toast.success(
      `题目已${
        updatedProblems.find((p) => p.id === id)?.bookmarked
          ? "收藏"
          : "取消收藏"
      }`
    );
  };

  // 导航到题目详情页
  const navigateToProblem = (id: number) => {
    navigate(`/problems/${id}`);
  };

  // 处理难度过滤切换
  const handleDifficultyToggle = (difficulty: string) => {
    setDifficultyFilter((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  // 计算当前页显示的题目
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  );
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);

  // 生成页码数组
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="flex flex-1 overflow-hidden relative">
        {/* 左侧导航栏 - 类似豆包网页版的丝滑收缩任务栏 */}
        <aside
          className={cn(
            "fixed md:static inset-y-0 left-0 z-50 shadow-lg border-r-2 border-gray-200 bg-white transition-all duration-500 ease-in-out flex-shrink-0",
            sidebarCollapsed ? "translate-x-0 w-16" : "translate-x-0 w-64",
      
          )}
        >
          {/* 边框栏收缩/展开按钮 - 灵动设计 */}
          <button
            onClick={() => {
              setSidebarCollapsed(!sidebarCollapsed);
            }}
            className="text-gray-600 hover:text-blue-600 p-2 absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-white to-gray-50 rounded-full shadow-lg border border-gray-200 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:border-blue-300 flex items-center justify-center"
          >
            {sidebarCollapsed ? (
              <i className="iconfont icon-forward_line text-sm transform transition-transform duration-300 hover:translate-x-1"></i>
            ) : (
              <i className="iconfont icon-backward_line text-sm transform transition-transform duration-300 hover:-translate-x-1"></i>
            )}
          </button>
          <div className="h-full flex flex-col">
            <div className="flex items-center h-16 px-4 border-b border-gray-200 overflow-hidden">
              <i className="fa-solid fa-code text-blue-600 text-2xl flex-shrink-0"></i>
              {!sidebarCollapsed && (
                <span className="text-xl font-bold text-gray-900 ml-2 whitespace-nowrap transition-opacity duration-300">
                  XUTCode
                </span>
              )}
            </div>
            <div
              className={`flex-1 overflow-y-auto transition-all duration-500 ${
                sidebarCollapsed ? "p-2" : "p-4"
              }`}
            >
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveView("problems")}
                  className={cn(
                    "w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300",
                    activeView === "problems"
                      ? "text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-sm"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-blue-600 hover:shadow-sm"
                  )}
                >
                  <i className="fa-solid fa-list-ul flex-shrink-0 transition-transform duration-300 group-hover:scale-110"></i>
                  {!sidebarCollapsed && (
                    <span className="ml-3 whitespace-nowrap transition-all duration-300 group-hover:translate-x-1">
                      题目列表
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveView("profile")}
                  className={cn(
                    "w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300",
                    activeView === "profile"
                      ? "text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-sm"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-blue-600 hover:shadow-sm"
                  )}
                >
                  <i className="fa-solid fa-user-circle flex-shrink-0 transition-transform duration-300 group-hover:scale-110"></i>
                  {!sidebarCollapsed && (
                    <span className="ml-3 whitespace-nowrap transition-all duration-300 group-hover:translate-x-1">
                      个人中心
                    </span>
                  )}
                </button>

                <div
                  className={`pt-4 pb-2 transition-all duration-500 ${
                    sidebarCollapsed ? "px-2" : "px-4"
                  }`}
                >
                  {!sidebarCollapsed && (
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider transition-opacity duration-300">
                      功能
                    </h3>
                  )}
                </div>

                <button
                  onClick={() => setActiveView("ai-generate")}
                  className={cn(
                    "w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300",
                    activeView === "ai-generate"
                      ? "text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-sm"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-blue-600 hover:shadow-sm"
                  )}
                >
                  <i className="fa-solid fa-magic flex-shrink-0 transition-transform duration-300 group-hover:scale-110"></i>
                  {!sidebarCollapsed && (
                    <span className="ml-3 whitespace-nowrap transition-all duration-300 group-hover:translate-x-1">
                      AI 题目生成
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {/* 底部设置按钮 */}
            <div
              className={cn("relative mt-auto", sidebarCollapsed && "-mb+5")}
              onClick={toggleSettingsMenu}
            >
              <button className="flex items-center h-16 px-4 border-t border-gray-200 overflow-hidden hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 w-full group">
                <i className="fa-solid fa-gear text-gray-500 text-xl flex-shrink-0 transition-transform duration-300 group-hover:rotate-90 group-hover:text-blue-600"></i>
                {!sidebarCollapsed && (
                  <span className="text-lg font-medium text-gray-700 ml-2 whitespace-nowrap transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600">
                    设置
                  </span>
                )}
              </button>

              {/* 设置弹出菜单 - 类似 VSCode 的弹出面板 */}
              {showSettingsMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden transition-all duration-200 transform origin-bottom-left animate-scaleIn">
                  <div className="py-2 bg-gray-50 border-b border-gray-200 px-4 text-sm font-medium text-gray-700">
                    设置选项
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    >
                      <i className="fa-solid fa-right-from-bracket mr-3 text-gray-500"></i>
                      <span>退出登录</span>
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                      <i className="fa-solid fa-circle-info mr-3 text-gray-500"></i>
                      <span>关于</span>
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                      <i className="fa-solid fa-question-circle mr-3 text-gray-500"></i>
                      <span>帮助</span>
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <div className="px-4 py-2 text-sm font-medium text-gray-700">
                      背景颜色
                    </div>
                    <div className="grid grid-cols-3 gap-2 px-2 py-1">
                      {[
                        { name: "浅灰", value: "bg-gray-50" },
                        { name: "白色", value: "bg-white" },
                        { name: "浅蓝", value: "bg-blue-50" },
                        { name: "浅绿", value: "bg-green-50" },
                        { name: "浅黄", value: "bg-yellow-50" },
                        { name: "浅紫", value: "bg-purple-50" },
                        { name: "深灰", value: "bg-gray-800" },
                        { name: "深蓝", value: "bg-blue-900" },
                        { name: "深绿", value: "bg-green-900" }
                      ].map((color) => (
                        <button
                          key={color.value}
                          onClick={() => {
                            setBgColor(color.value);
                            localStorage.setItem("bgColor", color.value);
                            toast.success(`背景已更改为${color.name}`);
                          }}
                          className={`h-8 rounded-md border transition-all duration-200 ${bgColor === color.value ? "ring-2 ring-blue-500 ring-offset-2" : "border-gray-200"}`}
                          style={{ backgroundColor: color.value.replace("bg-", "").split("-")[0] === "gray" && color.value.includes("800") ? "#1f2937" : color.value.replace("bg-", "").split("-")[0] === "blue" && color.value.includes("900") ? "#1e3a8a" : color.value.replace("bg-", "").split("-")[0] === "green" && color.value.includes("900") ? "#14532d" : "" }}
                          title={color.name}
                        >
                          <div className={`w-full h-full rounded-md ${color.value}`}></div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* 主内容区 - 使用padding-left而不是margin来避免布局偏移 */}
        <main
          className={cn(
            "flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 transition-all duration-300",
            bgColor,
            sidebarCollapsed ? "md:pl-16" : "md:pl-64"
          )}
        >
          <div>

            {activeView === "problems" ? (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    题目列表
                  </h1>
                  <p className="text-gray-500">
                    探索别样的世界,提升自己的能力📚
                  </p>
                </div>

                {/* 搜索和筛选区 */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 搜索框 */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fa-solid fa-search text-gray-400"></i>
                      </div>
                      <input
                        type="text"
                        placeholder="搜索题目..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      />
                    </div>

                    {/* 分类筛选 */}
                    <div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-white"
                      >
                        {CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 难度筛选 */}
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-700">
                        难度:
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDifficultyToggle("easy")}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium transition duration-200",
                            difficultyFilter.includes("easy")
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          )}
                          aria-label="筛选简单难度题目"
                        >
                          <i className="fa-solid fa-check mr-1"></i>
                          简单
                        </button>
                        <button
                          onClick={() => handleDifficultyToggle("medium")}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium transition duration-200",
                            difficultyFilter.includes("medium")
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          )}
                          aria-label="筛选中等难度题目"
                        >
                          <i className="fa-solid fa-check mr-1"></i>
                          中等
                        </button>
                        <button
                          onClick={() => handleDifficultyToggle("hard")}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium transition duration-200",
                            difficultyFilter.includes("hard")
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          )}
                          aria-label="筛选困难难度题目"
                        >
                          <i className="fa-solid fa-check mr-1"></i>
                          困难
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 额外筛选选项 */}
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <div className="flex items-center">
                      <input
                        id="showCompleted"
                        type="checkbox"
                        checked={showCompleted}
                        onChange={(e) => setShowCompleted(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        aria-label="显示已完成题目"
                      />
                      <label
                        htmlFor="showCompleted"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        显示已完成题目
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="showBookmarked"
                        type="checkbox"
                        checked={showBookmarked}
                        onChange={(e) => setShowBookmarked(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        aria-label="只显示收藏题目"
                      />
                      <label
                        htmlFor="showBookmarked"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        只显示收藏题目
                      </label>
                    </div>
                  </div>
                </div>

                {/* 题目列表 */}
                {filteredProblems.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentProblems.map((problem) => (
                        <div
                          key={problem.id}
                          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group"
                        >
                          <div
                            className="p-6 cursor-pointer"
                            onClick={() => navigateToProblem(problem.id)}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {problem.title}
                              </h3>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBookmark(problem.id);
                                }}
                                className="text-gray-400 hover:text-yellow-500 transition-colors"
                                aria-label={problem.bookmarked ? "取消收藏此题目" : "收藏此题目"}
                              >
                                {problem.bookmarked ? (
                                  <i className="fa-solid fa-bookmark text-yellow-500"></i>
                                ) : (
                                  <i className="fa-regular fa-bookmark"></i>
                                )}
                                <span className="sr-only">{problem.bookmarked ? "已收藏" : "未收藏"}</span>
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                              <span
                                className={cn(
                                  "px-2.5 py-0.5 rounded-full text-xs font-medium",
                                  problem.difficulty === "easy"
                                    ? "bg-green-100 text-green-800"
                                    : problem.difficulty === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                )}
                              >
                                {problem.difficulty === "easy"
                                  ? "简单"
                                  : problem.difficulty === "medium"
                                  ? "中等"
                                  : "困难"}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {problem.category}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-4">
                              {problem.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center text-gray-500">
                                <i className="fa-solid fa-check-circle mr-1"></i>
                                <span>通过率: {problem.通过率}%</span>
                              </div>

                              {problem.completed && (
                                <span className="flex items-center text-green-600">
                                  <i className="fa-solid fa-check mr-1"></i>
                                  <span>已完成</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 分页控件 */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-10">
                        <nav className="inline-flex rounded-md shadow">
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="上一页"
                          >
                            <i className="fa-solid fa-chevron-left text-xs"></i>
                            <span className="sr-only">上一页</span>
                          </button>

                          {pageNumbers.map((number) => (
                            <button
                              key={number}
                              onClick={() => setCurrentPage(number)}
                              className={cn(
                                "relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium",
                                currentPage === number
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "text-gray-700 hover:bg-gray-50"
                              )}
                            >
                              {number}
                            </button>
                          ))}

                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="下一页"
                          >
                            <i className="fa-solid fa-chevron-right text-xs"></i>
                            <span className="sr-only">下一页</span>
                          </button>
                        </nav>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <i className="fa-solid fa-search text-gray-400 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      未找到题目
                    </h3>
                    <p className="text-gray-500 mb-6">
                      尝试调整筛选条件或搜索其他关键词
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory("全部");
                        setDifficultyFilter([]);
                        setSearchQuery("");
                        setShowCompleted(true);
                        setShowBookmarked(false);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      重置筛选条件
                    </button>
                  </div>
                )}
              </>
            ) : activeView === "profile" ? (
              <ProfilePanel />
            ) : (
              <AIGeneratePanel onProblemsGenerated={handleGeneratedProblems} />
            )}
          </div>
        </main>
      </div>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} XUTCode. 保留所有权利.
            </p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <i className="fa-solid fa-question-circle"></i>
                <span className="ml-1">帮助中心</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <i className="fa-solid fa-file-text"></i>
                <span className="ml-1">使用条款</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <i className="fa-solid fa-shield"></i>
                <span className="ml-1">隐私政策</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
