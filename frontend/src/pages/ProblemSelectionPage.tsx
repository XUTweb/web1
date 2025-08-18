import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn, getUserProblemStatus, calculatePassRate } from "@/lib/utils";
import { toast } from "sonner";

// 测试用例接口定义
interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

// 题目类型定义
interface Problem {
  id: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string; // 学科分类，如"数据结构"、"计算机网络"、"Java"等
  tags: string[]; // 知识点标签，如"哈希表"、"双指针"等
  description?: string;
  testCases?: TestCase[];
  totalSubmissions: number; // 总提交次数
  acceptedSubmissions: number; // 通过次数
}

// 增强的题目类型 - 包含计算后的用户状态
interface EnhancedProblem extends Problem {
  completed: boolean;
  bookmarked: boolean;
  attempts: number;
  通过率: number;
}

// 完善 UserSubmissionRecord 接口  -- 这个接口在utils.tsx文件中被使用.
interface UserSubmissionRecord {
  problemId: number;
  userId: string;
  attempts: number;
  lastStatus: "accepted" | "wrong_answer" | "time_limit_exceeded";
  lastSubmissionTime: string;
  isCompleted: boolean;
  submissionHistory: {
    timestamp: string;
    status: "accepted" | "wrong_answer" | "time_limit_exceeded";
    code: string;
  }[];
}

// 添加用户收藏记录
interface UserBookmark {
  problemId: number;
  userId: string;
  bookmarkedAt: string;
}
// 模拟基础题目数据（不包含用户状态）
const MOCK_PROBLEMS: Problem[] = [
  {
    id: 1,
    title: "两数之和",
    difficulty: "easy",
    category: "数据结构",
    tags: ["数组", "哈希表", "双指针"],
    totalSubmissions: 1234,
    acceptedSubmissions: 563,
  },
  {
    id: 2,
    title: "有效的括号",
    difficulty: "easy",
    category: "数据结构",
    tags: ["字符串", "栈"],
    totalSubmissions: 987,
    acceptedSubmissions: 423,
  },
  {
    id: 3,
    title: "合并两个有序链表",
    difficulty: "easy",
    category: "数据结构",
    tags: ["递归", "链表"],
    totalSubmissions: 756,
    acceptedSubmissions: 440,
  },
  {
    id: 4,
    title: "IP地址与MAC地址的关系",
    difficulty: "medium",
    category: "计算机网络",
    tags: ["网络层", "数据链路层"],
    totalSubmissions: 645,
    acceptedSubmissions: 397,
  },
  {
    id: 5,
    title: "进程调度算法",
    difficulty: "medium",
    category: "操作系统",
    tags: ["进程管理", "调度策略"],
    totalSubmissions: 532,
    acceptedSubmissions: 177,
  },
  {
    id: 6,
    title: "Java多线程同步机制",
    difficulty: "medium",
    category: "Java",
    tags: ["多线程", "并发编程", "synchronized"],
    totalSubmissions: 423,
    acceptedSubmissions: 276,
  },
  {
    id: 7,
    title: "Python装饰器原理",
    difficulty: "hard",
    category: "Python",
    tags: ["函数式编程", "元编程"],
    totalSubmissions: 312,
    acceptedSubmissions: 155,
  },
  {
    id: 8,
    title: "C语言指针与数组",
    difficulty: "hard",
    category: "C语言",
    tags: ["指针", "内存管理", "数组"],
    totalSubmissions: 289,
    acceptedSubmissions: 110,
  },
  {
    id: 9,
    title: "Cache替换算法",
    difficulty: "medium",
    category: "计算机组成原理",
    tags: ["存储系统", "缓存"],
    totalSubmissions: 378,
    acceptedSubmissions: 198,
  },
  {
    id: 10,
    title: "时间复杂度分析",
    difficulty: "easy",
    category: "算法分析",
    tags: ["复杂度", "渐进分析"],
    totalSubmissions: 567,
    acceptedSubmissions: 409,
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
  const [enhancedProblems, setEnhancedProblems] = useState<EnhancedProblem[]>(
    []
  );
  const [filteredProblems, setFilteredProblems] = useState<EnhancedProblem[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 6;

  const navigate = useNavigate();

  // 获取当前用户ID
  const getCurrentUserId = (): string => {
    const user = JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
    );
    return user.id || "anonymous";
  };

  // 初始化数据
  useEffect(() => {
    // 加载基础题目数据（不包含用户相关状态）
    const savedProblems = localStorage.getItem("problems");
    if (savedProblems) {
      setProblems(JSON.parse(savedProblems));
    } else {
      // 初始化基础题目数据
      const baseProblems = MOCK_PROBLEMS.map((p) => ({
        ...p,
        totalSubmissions:
          p.totalSubmissions || Math.floor(Math.random() * 1000) + 100,
        acceptedSubmissions:
          p.acceptedSubmissions || Math.floor(Math.random() * 500) + 50,
      }));
      setProblems(baseProblems);
      localStorage.setItem("problems", JSON.stringify(baseProblems));
    }
  }, []);

  // 当题目数据或用户状态变化时，重新计算增强题目数据
  useEffect(() => {
    if (problems.length > 0) {
      const currentUserId = getCurrentUserId();
      const enhanced = problems.map((problem) => {
        const userStatus = getUserProblemStatus(problem.id, currentUserId);
        return {
          ...problem,
          ...userStatus,
          通过率: calculatePassRate(
            problem.totalSubmissions,
            problem.acceptedSubmissions
          ),
        };
      });
      setEnhancedProblems(enhanced);
    }
  }, [problems]);

  // 过滤题目
  useEffect(() => {
    let result = [...enhancedProblems];

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
    enhancedProblems,
    selectedCategory,
    difficultyFilter,
    searchQuery,
    showCompleted,
    showBookmarked,
  ]);

  // 切换题目收藏状态
  const toggleBookmark = (problemId: number) => {
    const currentUserId = getCurrentUserId();
    const bookmarks = JSON.parse(
      localStorage.getItem("userBookmarks") || "[]"
    ) as UserBookmark[];

    const existingBookmarkIndex = bookmarks.findIndex(
      (b) => b.problemId === problemId && b.userId === currentUserId
    );

    if (existingBookmarkIndex > -1) {
      // 取消收藏
      bookmarks.splice(existingBookmarkIndex, 1);
      toast.success("题目已取消收藏");
    } else {
      // 添加收藏
      bookmarks.push({
        problemId,
        userId: currentUserId,
        bookmarkedAt: new Date().toISOString(),
      });
      toast.success("题目已收藏");
    }

    localStorage.setItem("userBookmarks", JSON.stringify(bookmarks));

    // 重新计算增强题目数据以更新UI
    const enhanced = problems.map((problem) => {
      const userStatus = getUserProblemStatus(problem.id, currentUserId);
      return {
        ...problem,
        ...userStatus,
        通过率: calculatePassRate(
          problem.totalSubmissions,
          problem.acceptedSubmissions
        ),
      };
    });
    setEnhancedProblems(enhanced);
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
return(
<div className="min-h-screen bg-gray-50 flex flex-col bg-gradient-to-br">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-10 bg-gradient-to-br from-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <i className="fa-solid fa-code text-blue-600 text-2xl mr-2"></i>
              <span className="text-xl font-bold text-gray-900">XUTCode</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <i className="fa-solid fa-user-circle text-xl"></i>
                <span className="hidden md:inline">个人中心</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* 主内容区 */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">题目列表</h1>
          <p className="text-gray-500">探索并解决编程问题，提升您的编程技能</p>
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
              <span className="text-sm font-medium text-gray-700">难度:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDifficultyToggle("easy")}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition duration-200",
                    difficultyFilter.includes("easy")
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  )}
                >
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
                >
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
                >
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
                      >
                        {problem.bookmarked ? (
                          <i className="fa-solid fa-bookmark text-yellow-500"></i>
                        ) : (
                          <i className="fa-regular fa-bookmark"></i>
                        )}
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
                  >
                    <i className="fa-solid fa-chevron-left text-xs"></i>
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
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fa-solid fa-chevron-right text-xs"></i>
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
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} CodeMaster. 保留所有权利.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
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
