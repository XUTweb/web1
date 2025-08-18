import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import LoginPage from "@/pages/LoginPage";
import ProblemSelectionPage from "@/pages/ProblemSelectionPage";
import ProblemSolvingPage from "@/pages/ProblemSolvingPage";
import ProfilePage from "@/pages/ProfilePage";
import { useState, useEffect } from "react";
import { AuthContext } from "@/contexts/authContext";
import { toast } from "sonner";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    toast.success("已成功退出登录");
  };

  // 检查用户是否已登录
  useEffect(() => {
    const checkAuth = () => {
      const savedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (savedUser) {
        const userData = JSON.parse(savedUser);

        // 检查是否过期（仅在localStorage中存储的用户需要检查）
        if (localStorage.getItem("user")) {
          if (userData.expiry && Date.now() > userData.expiry) {
            localStorage.removeItem("user");
            setIsAuthenticated(false);
            return;
          }
        }
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // 路由守卫组件
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/problems" replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/problems"
          element={
            <ProtectedRoute>
              <ProblemSelectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems/:id"
          element={
            <ProtectedRoute>
              <ProblemSolvingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/other"
          element={
            <div className="text-center text-xl">Other Page - Coming Soon</div>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthContext.Provider>
  );
}
