import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 题目类型定义
interface Problem {
  id: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  description: string;
  examples: {
    input: string;
    output: string;
    explanation: string;
  }[];
  constraints: string[];
  initialCode: string;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
}

// 模拟题目数据
const MOCK_PROBLEM: Problem = {
  id: 1,
  title: '两数之和',
  difficulty: 'easy',
  category: '数组',
  tags: ['哈希表', '双指针'],
  description: `给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target 的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。`,
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "因为 nums[0] + nums[1] == 9，返回 [0, 1]。"
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "因为 nums[1] + nums[2] == 6，返回 [1, 2]。"
    }
  ],
  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "只会存在一个有效答案"
  ],
  initialCode: `function twoSum(nums: number[], target: number): number[] {
    // 在这里编写你的解决方案
    return [];
}`,
  testCases: [
    { input: "[2,7,11,15],9", expectedOutput: "[0,1]" },
    { input: "[3,2,4],6", expectedOutput: "[1,2]" },
    { input: "[3,3],6", expectedOutput: "[0,1]" }
  ]
};

// 模拟提交历史数据
const submissionHistoryData = [
  { name: '1s', 执行时间: 120 },
  { name: '2s', 执行时间: 90 },
  { name: '3s', 执行时间: 150 },
  { name: '4s', 执行时间: 80 },
  { name: '5s', 执行时间: 65 },
  { name: '6s', 执行时间: 70 },
  { name: '7s', 执行时间: 55 },
];

export default function ProblemSolvingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const problemId = Number(id);
  
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submissionResult, setSubmissionResult] = useState<{
    passed: number;
    total: number;
    errors: string[];
    executionTime: number;
  } | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  
  const timerRef = useRef<number | null>(null);
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);
  
  // 获取题目数据
  useEffect(() => {
    // 在实际应用中，这里会从API获取题目数据
    // 这里使用模拟数据
    setTimeout(() => {
      setProblem(MOCK_PROBLEM);
      setCode(MOCK_PROBLEM.initialCode);
    }, 500);
    
    // 开始计时
    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    // 组件卸载时清除计时器
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // 保存答题进度到localStorage
      if (code !== MOCK_PROBLEM.initialCode) {
        const unsolvedProblems = JSON.parse(localStorage.getItem('unsolvedProblems') || '{}');
        unsolvedProblems[problemId] = {
          code,
          timeSpent,
          lastAccessed: new Date().toISOString()
        };
        localStorage.setItem('unsolvedProblems', JSON.stringify(unsolvedProblems));
      }
    };
  }, [problemId, code, timeSpent]);
  
  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 提交代码
  const handleSubmit = () => {
    setIsSubmitting(true);
    setSubmissionStatus('idle');
    setSubmissionResult(null);
    
    // 模拟API调用和代码执行
    setTimeout(() => {
      // 模拟测试结果
      const passed = Math.floor(Math.random() * problem!.testCases.length) + 1;
      const total = problem!.testCases.length;
      const executionTime = Math.floor(Math.random() * 100) + 30;
      const errors = [];
      
      if (passed < total) {
        errors.push(`测试用例 ${passed + 1} 失败: 预期输出 "${problem!.testCases[passed].expectedOutput}", 实际输出 "错误结果"`);
      }
      
      setSubmissionResult({
        passed,
        total,
        errors,
        executionTime
      });
      
      setSubmissionStatus(passed === total ? 'success' : 'error');
      
      if (passed === total) {
        toast.success('恭喜！所有测试用例通过！');
        
        // 更新题目完成状态
        const problems = JSON.parse(localStorage.getItem('userProblems') || '[]');
        const updatedProblems = problems.map((p: any) => 
          p.id === problemId ? { ...p, completed: true } : p
        );
        localStorage.setItem('userProblems', JSON.stringify(updatedProblems));
      } else {
        toast.error(`提交失败，${passed}/${total} 测试用例通过`);
      }
      
      setIsSubmitting(false);
    }, 1500);
  };
  
  // 格式化代码（简单模拟）
  const formatCode = () => {
    // 在实际应用中，这里会使用专业的代码格式化库
    // 这里仅做简单处理
    try {
      // 尝试使用JSON格式化（仅适用于对象/数组字面量）
      const parsed = JSON.parse(code);
      setCode(JSON.stringify(parsed, null, 2));
    } catch (e) {
      // 简单缩进处理
      let indentLevel = 0;
      const indentSize = 2;
      const lines = code.split('\n');
      const formattedLines = lines.map(line => {
        // 简单处理花括号来调整缩进
        if (line.includes('}')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        const trimmedLine = line.trim();
        const indent = ' '.repeat(indentLevel * indentSize);
        
        if (trimmedLine.includes('{') && !trimmedLine.includes('}')) {
          indentLevel += 1;
        }
        
        return indent + trimmedLine;
      });
      
      setCode(formattedLines.join('\n'));
    }
    
    if (codeEditorRef.current) {
      codeEditorRef.current.focus();
    }
  };
  
  // 切换到上一题/下一题
  const navigateToProblem = (direction: 'prev' | 'next') => {
    // 在实际应用中，这里会根据题目ID导航到相应题目
    // 这里简单处理
    if (direction === 'prev' && problemId > 1) {
      navigate(`/problems/${problemId - 1}`);
    } else if (direction === 'next') {
      navigate(`/problems/${problemId + 1}`);
    } else {
      toast.info('已经是第一题了');
    }
  };
  
  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <h2 className="text-xl font-medium text-gray-900">加载题目中...</h2>
          <p className="text-gray-500 mt-1">请稍候，我们正在准备题目内容</p>
        </div>
      </div>
    );
  }
  
  // 格式化时间显示
  const formattedTime = formatTime(timeSpent);
  
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
              <div>
                <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                  {problem.title}
                </h1>
                <div className="flex items-center mt-0.5">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium mr-2",
                    problem.difficulty === 'easy' 
                      ? "bg-green-100 text-green-800" 
                      : problem.difficulty === 'medium'
                        ? "bg-yellow-100 text-yellow-800" 
                        : "bg-red-100 text-red-800"
                  )}>
                    {problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难'}
                  </span>
                  <span className="text-xs text-gray-500">
                    用时: {formattedTime}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowExplanation(!showExplanation)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200"
              >
                {showExplanation ? '隐藏解析' : '查看解析'}
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    提交中...
                  </>
                ) : (
                  "提交解答"
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* 主内容区 */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：题目描述 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 标签页 */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('description')}
                  className={cn(
                    "py-4 px-1 border-b-2 font-medium text-sm",
                    activeTab === 'description'
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  题目描述
                </button>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={cn(
                    "py-4 px-1 border-b-2 font-medium text-sm",
                    activeTab === 'submissions'
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  提交记录
                </button>
                <button
                  onClick={() => setActiveTab('discussion')}
                  className={cn(
                    "py-4 px-1 border-b-2 font-medium text-sm",
                    activeTab === 'discussion'
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  讨论区
                </button>
              </nav>
            </div>
            
            {/* 题目内容 */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              {activeTab === 'description' && (
                <>
                  <div className="prose max-w-none">
                    <h2 className="text-xl font-semibold mb-4">题目描述</h2>
                    <div className="text-gray-800 whitespace-pre-line mb-6">
                      {problem.description}
                    </div>
                    
                    <h3 className="text-lg font-medium mt-8 mb-3">示例</h3>
                    {problem.examples.map((example, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="mb-2">
                          <span className="font-medium text-gray-700">输入:</span>
                          <pre className="bg-gray-100 p-2 rounded mt-1 text-sm overflow-x-auto">{example.input}</pre>
                        </div>
                        <div className="mb-2">
                          <span className="font-medium text-gray-700">输出:</span>
                          <pre className="bg-gray-100 p-2 rounded mt-1 text-sm overflow-x-auto">{example.output}</pre>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">解释:</span>
                          <p className="mt-1 text-gray-700">{example.explanation}</p>
                        </div>
                      </div>
                    ))}
                    
                    <h3 className="text-lg font-medium mt-8 mb-3">约束条件</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {problem.constraints.map((constraint, index) => (
                        <li key={index}>{constraint}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* 题目解析 */}
                  {showExplanation && (
                    <div className="mt-8 pt-6 border-t border-gray-200 bg-blue-50 rounded-lg p-5">
                      <h3 className="text-lg font-medium text-blue-800 mb-3">
                        <i className="fa-solid fa-lightbulb mr-2"></i>解题思路
                      </h3>
                      <div className="text-blue-900 space-y-3">
                        <p>这道题目可以使用哈希表来解决，时间复杂度为 O(n)，空间复杂度为 O(n)。</p>
                        <p>解题步骤：</p>
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>创建一个哈希表用于存储数组元素和它们的索引</li>
                          <li>遍历数组，对于每个元素 nums[i]：</li>
                          <li className="pl-2">计算目标值与当前元素的差值：complement = target - nums[i]</li>
                          <li className="pl-2">如果哈希表中存在 complement，则返回 [哈希表中 complement 的索引, i]</li>
                          <li className="pl-2">否则，将当前元素和索引存入哈希表</li>
                        </ol>
                        <p>这种方法只需要遍历一次数组，就能找到答案。</p>
                        
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <h4 className="font-medium mb-2">参考代码：</h4>
                          <pre className="bg-gray-900 text-white p-3 rounded text-sm overflow-x-auto">
{`function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  
  return []; // 题目保证有解，所以不会执行到这里
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {activeTab === 'submissions' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">提交记录</h3>
                    <p className="text-gray-500 text-sm mb-6">查看你的解题历史和性能分析</p>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="text-sm font-medium mb-3">性能趋势</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={submissionHistoryData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value) => [`${value}ms`, '执行时间']}
                              labelFormatter={(label) => `提交 ${label}`}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="执行时间" 
                              stroke="#3b82f6" 
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm font-medium text-gray-500 border-b pb-2">
                        <div className="w-1/4">提交时间</div>
                        <div className="w-1/4">状态</div>
                        <div className="w-1/4">执行时间</div>
                        <div className="w-1/4">操作</div>
                      </div>
                      
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center text-sm border-b pb-3 pt-3">
                          <div className="w-1/4 text-gray-700">
                            {new Date(Date.now() - i * 3600000).toLocaleString()}
                          </div>
                          <div className="w-1/4">
                            <span className={i % 3 === 0 ? "text-green-600" : "text-red-600"}>
                              {i % 3 === 0 ? "通过" : "未通过"}
                            </span>
                          </div>
                          <div className="w-1/4 text-gray-700">{55 + i * 10}ms</div>
                          <div className="w-1/4">
                            <button className="text-blue-600 hover:text-blue-800">查看</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'discussion' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">讨论区</h3>
                  <p className="text-gray-500 text-sm mb-6">与其他用户交流解题思路和技巧</p>
                  
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border-b pb-6">
                        <div className="flex items-start">
                          <img 
                            src={`https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%20${i}`} 
                            alt="User avatar" 
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-gray-900">用户{i + 1}</span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-sm text-gray-500">
                                {i + 2} 天前
                              </span>
                            </div>
                            <p className="mt-2 text-gray-700">
                              {i === 0 ? 
                                "我用了双指针的方法，时间复杂度O(n^2)，空间复杂度O(1)，也通过了所有测试用例。" : 
                                i === 1 ? 
                                "哈希表方法确实更优，时间复杂度O(n)，就是需要额外的空间。" : 
                                "有没有考虑过边界情况？比如数组中有负数的情况？"}
                            </p>
                            <div className="mt-3 flex items-center space-x-4">
                              <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                                <i className="fa-regular fa-thumbs-up mr-1"></i>
                                <span>{12 + i * 5}</span>
                              </button>
                              <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                                <i className="fa-regular fa-comment mr-1"></i>
                                <span>回复</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8">
                    <textarea 
                      placeholder="分享你的解题思路..." 
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      rows={4}
                    ></textarea>
                    <div className="flex justify-end mt-3">
                      <button className="px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-200">
                        发表评论
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* 提交结果 */}
            {submissionResult && (
              <div className={cn(
                "p-5 rounded-xl border",
                submissionStatus === 'success' 
                  ? "bg-green-50 border-green-200" 
                  : "bg-red-50 border-red-200"
              )}>
                <div className="flex items-start">
                  <div className={cn(
                    "flex-shrink-0 p-2 rounded-full",
                    submissionStatus === 'success' 
                      ? "bg-green-100 text-green-500" 
                      : "bg-red-100 text-red-500"
                  )}>
                    {submissionStatus === 'success' ? (
                      <i className="fa-solid fa-check text-xl"></i>
                    ) : (
                      <i className="fa-solid fa-times text-xl"></i>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <h3 className={cn(
                      "text-lg font-medium",
                      submissionStatus === 'success' 
                        ? "text-green-800" 
                        : "text-red-800"
                    )}>
                      {submissionStatus === 'success' 
                        ? '恭喜！解答正确' 
                        : '解答错误'}
                    </h3>
                    
                    <div className="mt-2 text-sm">
                      <p className={cn(
                        submissionStatus === 'success' 
                          ? "text-green-700" 
                          : "text-red-700"
                      )}>
                        {submissionResult.passed}/{submissionResult.total} 测试用例通过
                      </p>
                      
                      {submissionStatus === 'success' && (
                        <p className="text-green-700 mt-1">
                          执行时间: {submissionResult.executionTime}ms
                        </p>
                      )}
                      
                      {submissionStatus === 'error' && submissionResult.errors.length > 0 && (
                        <div className="mt-3 bg-white rounded-md p-3 border border-red-200">
                          <h4 className="font-medium text-red-800 mb-2">错误信息:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-red-700">
                            {submissionResult.errors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => setSubmissionResult(null)}
                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200"
                      >
                        关闭
                      </button>
                      
                      {submissionStatus === 'success' && (
                        <button
                          onClick={() => navigateToProblem('next')}
                          className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                        >
                          下一题
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 右侧：代码编辑器 */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">代码编辑器</span>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-full bg-red-400 mr-1"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400 mr-1"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={formatCode}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                    title="格式化代码"
                  >
                    <i className="fa-solid fa-code"></i>
                  </button>
                </div>
              </div>
              
              <div className="flex-grow flex flex-col">
                <textarea
                  ref={codeEditorRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-grow font-mono text-sm p-4 bg-gray-50 focus:outline-none resize-none"
                  spellCheck="false"
                  wrap="off"
                ></textarea>
                
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      JavaScript (ES6+)
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => navigateToProblem('prev')}
                        disabled={problemId <= 1}
                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        上一题
                      </button>
                      
                      <button 
                        onClick={() => navigateToProblem('next')}
                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200"
                      >
                        下一题
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 提示卡片 */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                <i className="fa-solid fa-lightbulb mr-2"></i>解题提示
              </h3>
              <ul className="text-sm text-blue-700 space-y-1 pl-6 list-disc">
                <li>考虑使用哈希表存储已经遍历过的数字及其索引</li>
                <li>对于每个数字，计算目标值与该数字的差值</li>
                <li>检查差值是否已经在哈希表中</li>
                <li>注意数组中同一个元素不能重复使用</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} CodeMaster. 保留所有权利。</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="#" className="hover:text-gray-700">使用条款</a>
              <a href="#" className="hover:text-gray-700">隐私政策</a>
              <a href="#" className="hover:text-gray-700">帮助中心</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}