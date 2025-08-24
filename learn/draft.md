```tsx
// 模拟题目数据   
const MOCK_PROBLEMS: Problem[] = [      
  {
    id: 1,
    title: '两数之和', 
    difficulty: 'easy',
    category: '数据结构',
    tags: ['数组', '哈希表', '双指针'],
    completed: true,
    bookmarked: true,
    通过率: 45.6
  },
  {
    id: 2,
    title: '有效的括号',
    difficulty: 'easy',
    category: '数据结构',
    tags: ['字符串', '栈'],
    completed: true,
    bookmarked: false,
    通过率: 42.8
  },
  {
    id: 3,
    title: '合并两个有序链表',
    difficulty: 'easy',
    category: '数据结构',
    tags: ['递归', '链表'],
    completed: false,
    bookmarked: true,
    通过率: 58.2
  },
  {
    id: 4,
    title: 'IP地址与MAC地址的关系',
    difficulty: 'medium',
    category: '计算机网络',
    tags: ['网络层', '数据链路层'],
    completed: false,
    bookmarked: false,
    通过率: 61.5
  },
  {
    id: 5,
    title: '进程调度算法',
    difficulty: 'medium',
    category: '操作系统',
    tags: ['进程管理', '调度策略'],
    completed: false,
    bookmarked: true,
    通过率: 33.2
  },
  {
    id: 6,
    title: 'Java多线程同步机制',
    difficulty: 'medium',
    category: 'Java',
    tags: ['多线程', '并发编程', 'synchronized'],
    completed: false,
    bookmarked: false,
    通过率: 65.4
  },
  {
    id: 7,
    title: 'Python装饰器原理',
    difficulty: 'hard',
    category: 'Python',
    tags: ['函数式编程', '元编程'],
    completed: false,
    bookmarked: true,
    通过率: 49.8
  },
  {
    id: 8,
    title: 'C语言指针与数组',
    difficulty: 'hard',
    category: 'C语言',
    tags: ['指针', '内存管理', '数组'],
    completed: false,
    bookmarked: false,
    通过率: 38.1
  },
  {
    id: 9,
    title: 'Cache替换算法',
    difficulty: 'medium',
    category: '计算机组成原理',
    tags: ['存储系统', '缓存'],
    completed: false,
    bookmarked: false,
    通过率: 52.3
  },
  {
    id: 10,
    title: '时间复杂度分析',
    difficulty: 'easy',
    category: '算法分析',
    tags: ['复杂度', '渐进分析'],
    completed: true,
    bookmarked: false,
    通过率: 72.1
  }
];
```


