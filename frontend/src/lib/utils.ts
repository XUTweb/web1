/*
📚📚📚
-1. 这个文件的作用是整合可服用的工具函数 

-2. cn : 这个函数是用来合并类名的，它结合了clsx和tailwind-merge的功能，可以更方便地使用tailwindcss的类名

-3. calculatePassRate : 这个函数是用来计算用户通过率，它接受两个参数，分别是总提交次数和通过次数，返回一个百分比形式的通过率。

-4. getUserProblemStatus : 这个函数是用来获取用户对特定题目的完成状态，它接受两个参数，分别是题目id和用户id，返回一个包含完成状态、是否收藏和尝试次数的对象。


 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export interface UserSubmissionRecord {
  problemId: number;
  userId: string;
  attempts: number;
  lastStatus: 'accepted' | 'wrong_answer' | 'time_limit_exceeded';
  lastSubmissionTime: string;
  isCompleted: boolean;
  submissionHistory: {
    timestamp: string;
    status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded';
    code: string;
  }[];
}

export interface UserBookmark {
  problemId: number;
  userId: string;
  bookmarkedAt: string;
}


export function calculatePassRate(totalSubmissions: number, acceptedSubmissions: number): number {
  if (totalSubmissions === 0) return 0;
  return Math.round((acceptedSubmissions / totalSubmissions) * 100 * 10) / 10;
}

// 获取用户对特定题目的完成状态
export function getUserProblemStatus(problemId: number, userId: string): {
  completed: boolean;
  bookmarked: boolean;
  attempts: number;
} {
  // 从localStorage获取用户提交记录
  const submissions = JSON.parse(localStorage.getItem('userSubmissions') || '[]') as UserSubmissionRecord[];
  const bookmarks = JSON.parse(localStorage.getItem('userBookmarks') || '[]') as UserBookmark[];
  
  const userSubmission = submissions.find(s => s.problemId === problemId && s.userId === userId);
  const isBookmarked = bookmarks.some(b => b.problemId === problemId && b.userId === userId);
  
  return {
    completed: userSubmission?.isCompleted || false,
    bookmarked: isBookmarked,
    attempts: userSubmission?.attempts || 0
  };
}

