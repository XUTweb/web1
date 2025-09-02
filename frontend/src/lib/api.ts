const API_BASE_URL = 'http://localhost:3001';

export const api = {
  // 获取所有题目
  getProblems: async (): Promise<Problem[]> => {
    const response = await fetch(`${API_BASE_URL}/problems`);
    return response.json();
  },

  // 获取单个题目
  getProblem: async (id: number): Promise<Problem> => {
    const response = await fetch(`${API_BASE_URL}/problems/${id}`);
    return response.json();
  },

  // 更新题目状态（完成/收藏等）
  updateProblem: async (id: number, data: Partial<Problem>): Promise<Problem> => {
    const response = await fetch(`${API_BASE_URL}/problems/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
};

// 题目类型定义
export interface Problem {
  id: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  tags: string[];
  completed: boolean;
  bookmarked: boolean;
  通过率: number;
}
