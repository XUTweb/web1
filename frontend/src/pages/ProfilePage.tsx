import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AuthContext } from '@/contexts/authContext';
import { useTheme } from '@/hooks/useTheme';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// 学习统计数据类型
interface LearningStats {
  totalProblems: number;
  completedProblems: number;
  accuracyRate: number;
  dailyStreak: number;
  averageTimePerProblem: number;
  problemsByCategory: {
    name: string;
    value: number;
  }[];
  weeklyProgress: {
    day: string;
    problemsSolved: number;
  }[];
  difficultyDistribution: {
    name: string;
    value: number;
  }[];
}

// 模拟学习统计数据
const MOCK_LEARNING_STATS: LearningStats = {
  totalProblems: 126,
  completedProblems: 48,
  accuracyRate: 78.5,
  dailyStreak: 12,
  averageTimePerProblem: 15.2,
  problemsByCategory: [
    { name: '数组', value: 12 },
    { name: '字符串', value: 8 },
    { name: '链表', value: 5 },
    { name: '树', value: 7 },
    { name: '动态规划', value: 6 },
    { name: '其他', value: 10 },
  ],
  weeklyProgress: [
    { day: '周一', problemsSolved: 3 },
    { day: '周二', problemsSolved: 5 },
    { day: '周三', problemsSolved: 2 },
    { day: '周四', problemsSolved: 7 },
    { day: '周五', problemsSolved: 4 },
    { day: '周六', problemsSolved: 8 },
    { day: '周日', problemsSolved: 6 },
  ],
  difficultyDistribution: [
    { name: '简单', value: 24 },
    { name: '中等', value: 18 },
    { name: '困难', value: 6 },
  ]
};

// 错题本数据类型
interface WrongProblem {
  id: number;
  title: string;
  category: string;difficulty: 'easy' | 'medium' | 'hard';
  lastAttempt: string;
  mistakeCount: number;
}

// 模拟错题本数据
const MOCK_WRONG_PROBLEMS: WrongProblem[] = [
  {
    id: 15,
    title: '最长公共前缀',
    category: '字符串',
    difficulty: 'easy',
    lastAttempt: '2023-11-15',
    mistakeCount: 2
  },
  {
    id: 23,
    title: '三数之和',
    category: '数组',
    difficulty: 'medium',
    lastAttempt: '2023-11-18',
    mistakeCount: 3
  },
  {
    id: 42,
    title: '接雨水',
    category: '数组',
    difficulty: 'hard',
    lastAttempt: '2023-11-20',
    mistakeCount: 5
  },
  {
    id: 76,
    title: '最小覆盖子串',
    category: '字符串',
    difficulty: 'hard',
    lastAttempt: '2023-11-22',
    mistakeCount: 4
  }
];

// 收藏题目数据类型
interface BookmarkedProblem extends Omit<WrongProblem, 'mistakeCount'> {
  addedDate: string;
}

// 模拟收藏题目数据
const MOCK_BOOKMARKED_PROBLEMS: BookmarkedProblem[] = [
  {
    id: 5,
    title: '最长回文子串',
    category: '字符串',
    difficulty: 'medium',
    lastAttempt: '2023-11-10',
    addedDate: '2023-11-05'
  },
  {
    id: 10,
    title: '正则表达式匹配',
    category: '字符串',
    difficulty: 'hard',
    lastAttempt: '2023-11-12',
    addedDate: '2023-11-08'
  },
  {
    id: 22,
    title: '括号生成',
    category: '字符串',
    difficulty: 'medium',
    lastAttempt: '2023-11-14',
    addedDate: '2023-11-10'
  },
  {
    id: 30,
    title: '串联所有单词的子串',
    category: '字符串',
    difficulty: 'hard',
    lastAttempt: '2023-11-16',
    addedDate: '2023-11-12'
  }
];

// 用户信息类型
interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  bio: string;
  preferences: {
    darkMode: boolean;
    emailNotifications: boolean;
    dailyReminders: boolean;
  };
}

// 模拟用户信息
const MOCK_USER_PROFILE: UserProfile = {
  name: '张明',
  email: 'zhangming@example.com',
  avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%20male&sign=ebabea4c1f7e5ee731c308221c34a2fe',
  joinDate: '2023-09-15',
  bio: '计算机科学专业大三学生，热爱编程和算法挑战。',
  preferences: {
    darkMode: false,
    emailNotifications: true,
    dailyReminders: true
  }
};

// 颜色常量
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function ProfilePage() {
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('stats');
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [learningStats, setLearningStats] = useState<LearningStats>(MOCK_LEARNING_STATS);
  const [wrongProblems, setWrongProblems] = useState<WrongProblem[]>(MOCK_WRONG_PROBLEMS);
  const [bookmarkedProblems, setBookmarkedProblems] = useState<BookmarkedProblem[]>(MOCK_BOOKMARKED_PROBLEMS);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(MOCK_USER_PROFILE);
  
  // 处理编辑资料提交
  const handleProfileSave = () => {
    setUserProfile(editedProfile);
    setIsEditingProfile(false);
    toast.success('个人资料更新成功！');
  };
  
  // 处理偏好设置变更
  const handlePreferenceChange = (key: keyof UserProfile['preferences'], value: boolean) => {
    const updatedPreferences = {
      ...editedProfile.preferences,
      [key]: value
    };
    
    setEditedProfile({
      ...editedProfile,
      preferences: updatedPreferences
    });
    
    // 如果是切换暗黑模式，立即应用
    if (key === 'darkMode') {
      toggleTheme();
    }
  };
  
  // 移除错题
  const removeFromWrongProblems = (id: number) => {
    setWrongProblems(prev => prev.filter(problem => problem.id !== id));
    toast.success('已从错题本中移除');
  };
  
  // 移除收藏题目
  const removeFromBookmarks = (id: number) => {
    setBookmarkedProblems(prev => prev.filter(problem => problem.id !== id));
    toast.success('已取消收藏');
  };
  
  // 计算完成百分比
  const completionPercentage = Math.round((learningStats.completedProblems / learningStats.totalProblems) * 100);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/problems')}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <h1 className="text-xl font-bold text-gray-900">个人中心</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="px-4 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200"
              >
                <i className="fa-solid fa-sign-out-alt mr-1"></i>
                退出登录
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* 主内容区 */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：用户信息 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 用户卡片 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-24"></div>
              
              <div className="px-6 pb-6">
                <div className="flex justify-center -mt-12">
                  <div className="relative">
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="h-24 w-24 rounded-full border-4 border-white object-cover"
                    />
                    <button className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full border-2 border-white text-white hover:bg-blue-600 transition-colors">
                      <i className="fa-solid fa-camera text-xs"></i>
                    </button>
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <h2 className="text-xl font-bold text-gray-900">{userProfile.name}</h2>
                  <p className="text-gray-500 text-sm">{userProfile.email}</p>
                  
                  <div className="mt-4 flex justify-center space-x-3">
                    <button 
                      onClick={() => setActiveTab('stats')}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                        activeTab === 'stats' 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      )}
                    >
                      学习数据
                    </button>
                    <button 
                      onClick={() => setActiveTab('wrong')}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                        activeTab === 'wrong' 
                          ? "bg-red-100 text-red-800" 
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      )}
                    >
                      错题本
                    </button>
                    <button 
                      onClick={() => setActiveTab('bookmarks')}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                        activeTab === 'bookmarks' 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      )}
                    >
                      收藏
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-gray-900">{learningStats.completedProblems}</p>
                    <p className="text-xs text-gray-500">已完成题目</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-gray-900">{learningStats.dailyStreak}</p>
                    <p className="text-xs text-gray-500">连续学习天数</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button 
                    onClick={() => {
                      setIsEditingProfile(true);
                      setEditedProfile({...userProfile});
                    }}
                    className="w-full py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200"
                  >
                    编辑个人资料
                  </button>
                </div>
              </div>
            </div>
            
            {/* 学习进度卡片 */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">学习进度</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">总体完成度</span>
                    <span className="font-medium">{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">准确率</span>
                    <span className="font-medium">{learningStats.accuracyRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${learningStats.accuracyRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">平均解题时间</span>
                    <span className="font-medium">{learningStats.averageTimePerProblem}分钟</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(100, 100 - (learningStats.averageTimePerProblem - 5) * 5)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 右侧：内容区域 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 学习数据标签页 */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">学习统计</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-700">总题目数</p>
                          <h3 className="text-3xl font-bold text-blue-900 mt-1">{learningStats.totalProblems}</h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                          <i className="fa-solid fa-list text-blue-600"></i>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-blue-700">
                        <i className="fa-solid fa-arrow-up mr-1"></i>
                        <span>较上月增加 12 题</span>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-5 border border-green-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-700">已完成题目</p>
                          <h3 className="text-3xl font-bold text-green-900 mt-1">{learningStats.completedProblems}</h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                          <i className="fa-solid fa-check-circle text-green-600"></i>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-green-700">
                        <i className="fa-solid fa-arrow-up mr-1"></i>
                        <span>本月已完成 8 题</span>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-5 border border-purple-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-700">准确率</p>
                          <h3 className="text-3xl font-bold text-purple-900 mt-1">{learningStats.accuracyRate}%</h3>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                          <i className="fa-solid fa-chart-pie text-purple-600"></i>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-purple-700">
                        <i className="fa-solid fa-arrow-up mr-1"></i>
                        <span>较上月提升 3.2%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">周进度</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={learningStats.weeklyProgress}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value) => [`${value}题`, '解决题目数']}
                            />
                            <Bar 
                              dataKey="problemsSolved" 
                              fill="#3b82f6" 
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">题目难度分布</h3>
                      <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={learningStats.difficultyDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {learningStats.difficultyDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => [`${value}题`, '数量']}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">按类别统计</h2>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={learningStats.problemsByCategory}
                        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip 
                          formatter={(value) => [`${value}题`, '解决数量']}
                        />
                        <Bar 
                          dataKey="value" 
                          fill="#8884d8" 
                          radius={[0, 4, 4, 0]}
                        >
                          {learningStats.problemsByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
            
            {/* 错题本标签页 */}
            {activeTab === 'wrong' && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">错题本</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    <i className="fa-solid fa-download mr-1"></i>导出错题
                  </button>
                </div>
                
                {wrongProblems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <i className="fa-solid fa-check-circle text-gray-400 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">恭喜！没有错题</h3>
                    <p className="text-gray-500">继续保持良好的解题习惯</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            题目
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            类别
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            难度
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            错误次数
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            上次尝试
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {wrongProblems.map((problem) => (
                          <tr key={problem.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                <button 
                                  onClick={() => navigate(`/problems/${problem.id}`)}
                                  className="hover:text-blue-600"
                                >
                                  {problem.title}
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {problem.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={cn(
                                "px-2 py-1 text-xs font-medium rounded-full",
                                problem.difficulty === 'easy' 
                                  ? "bg-green-100 text-green-800" 
                                  : problem.difficulty === 'medium'
                                    ? "bg-yellow-100 text-yellow-800" 
                                    : "bg-red-100 text-red-800"
                              )}>
                                {problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <i 
                                      key={i} 
                                      className={i < problem.mistakeCount ? "fa-solid fa-circle text-red-400 text-xs" : "fa-regular fa-circle text-gray-300 text-xs"}
                                    ></i>
                                  ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-700">{problem.mistakeCount}次</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {problem.lastAttempt}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button 
                                  onClick={() => navigate(`/problems/${problem.id}`)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  重练
                                </button>
                                <button 
                                  onClick={() => removeFromWrongProblems(problem.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  移除
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {/* 收藏题目标签页 */}
            {activeTab === 'bookmarks' && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">收藏题目</h2>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索收藏题目..."
                      className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-sm"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fa-solid fa-search text-gray-400"></i>
                    </div>
                  </div>
                </div>
                
                {bookmarkedProblems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <i className="fa-regular fa-bookmark text-gray-400 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">暂无收藏题目</h3>
                    <p className="text-gray-500">在题目列表中点击书签图标收藏题目</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookmarkedProblems.map((problem) => (
                      <div 
                        key={problem.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-base font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                              onClick={() => navigate(`/problems/${problem.id}`)}>
                            {problem.title}
                          </h3>
                          <button 
                            onClick={() => removeFromBookmarks(problem.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <i className="fa-solid fa-bookmark"></i>
                          </button>
                        </div>
                        
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium",
                            problem.difficulty === 'easy' 
                              ? "bg-green-100 text-green-800" 
                              : problem.difficulty === 'medium'
                                ? "bg-yellow-100 text-yellow-800" 
                                : "bg-red-100 text-red-800"
                          )}>
                            {problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {problem.category}
                          </span>
                        </div>
                        
                        <div className="mt-3 flex justify-between items-center text-sm">
                          <div className="text-gray-500">
                            <i className="fa-solid fa-calendar-plus mr-1"></i>
                            收藏于 {problem.addedDate}
                          </div>
                          
                          <div className="text-gray-500">
                            <i className="fa-solid fa-clock mr-1"></i>
                            上次尝试: {problem.lastAttempt}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* 编辑个人资料表单 */}
            {isEditingProfile && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">编辑个人资料</h2>
                  <button 
                    onClick={() => setIsEditingProfile(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        姓名
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        邮箱
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500">邮箱地址不可修改</p>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      个人简介
                    </label>
                    <textarea
                      id="bio"
                      rows={3}
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    ></textarea>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">偏好设置</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            暗黑模式
                          </label>
                          <p className="text-xs text-gray-500 mt-0.5">切换深色/浅色主题</p>
                        </div>
                        <div className="relative inline-block w-10 align-middle select-none">
                          <input
                            type="checkbox"
                            checked={editedProfile.preferences.darkMode}
                            onChange={(e) => handlePreferenceChange('darkMode', e.target.checked)}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in transform translate-x-0 checked:translate-x-4 checked:border-blue-600"
                          />
                          <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer checked:bg-blue-600"></label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            邮件通知
                          </label>
                          <p className="text-xs text-gray-500 mt-0.5">接收学习报告和重要更新</p>
                        </div>
                        <div className="relative inline-block w-10 align-middle select-none">
                          <input
                            type="checkbox"
                            checked={editedProfile.preferences.emailNotifications}
                            onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in transform translate-x-0 checked:translate-x-4 checked:border-blue-600"
                          />
                          <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer checked:bg-blue-600"></label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            每日提醒
                          </label>
                          <p className="text-xs text-gray-500 mt-0.5">接收每日学习提醒</p>
                        </div>
                        <div className="relative inline-block w-10 align-middle select-none">
                          <input
                            type="checkbox"
                            checked={editedProfile.preferences.dailyReminders}
                            onChange={(e) => handlePreferenceChange('dailyReminders', e.target.checked)}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in transform translate-x-0 checked:translate-x-4 checked:border-blue-600"
                          />
                          <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer checked:bg-blue-600"></label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={handleProfileSave}
                      className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                    >
                      保存更改
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
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