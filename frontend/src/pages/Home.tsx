import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/*
📚📚📚
javascript 是一个动态的编程语言，所以在变量声明的时候不需要指定类型  -- 这点和python是一样的
- const、let 和 var 都是用来声明变量的关键字
const 用于声明常量，let 用于声明可变变量(作用域较小，只作用在块里面)，而 var 是旧的声明方式(作用域较大，全局作用域)
- className 是用来给 HTML 元素添加css属性的，在 React 中，我们使用 className 而不是 class

- export default 是用来导出模块的关键词，它允许我们在其他文件中导入这个模块

- <i> 标签是 HTML 中的一个元素，用于表示图标. 我们在这个项目里面使用的是阿里标签这个标签库,在代码中使用的话需要引入对应的图标库在Index.html中引入,然后使用<i className="iconfont icon-xxx"></i>来使用
*/

///  想法: 给页面增加落叶效果
//> 落叶效果
const Leaf = ({ delay }: { delay: number }) => {
  return (
    <motion.div
      className="leaf"
      initial={{ y: -20, rotate: 0, opacity: 1 }}
      animate={{
        y: window.innerHeight,
        rotate: 360,
        opacity: 0,
      }}
      transition={{
        duration: Math.random() * 5 + 5,
        delay: delay,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        position: "absolute",
        left: `${Math.random() * 100}%`,
        width: "20px",
        height: "20px",
        backgroundColor: "#856029ff",
        borderRadius: "0 100% 0 100%",
      }}
    />
  );
};

//> 图标列表
const features = [
    {
      icon: "icon-shu",
      title: "丰富的题目库",
      description: "超过1000道编程题目，涵盖各种难度级别和知识点",
    },
    {
      icon: "icon-zhexiantu",
      title: "学习进度跟踪",
      description: "实时监控您的学习进度和解题能力提升情况",
    },
    {
      icon: "icon-erjidaohang_celve",
      title: "详细解析",
      description: "每道题目都配有详细的解题思路和最优解法分析",
    }
  ];

function Home() {
  const navigate = useNavigate();
    return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-indigo-700 flex flex-col text-white">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 bg-[url('..\src\sourse\bg2.jpg')] bg-cover bg-center bg-no-repeat opacity"></div>
      {/* 落叶装饰元素 */}
      <div className="leaves-container">
        {[...Array(15)].map((_, i) => (
          <Leaf key={i} delay={i * 0.5} />
        ))}
           </div>
      {/* 主内容区 */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center max-w-3xl w-full">
          <div className="w-20 h-20 mx-auto mb-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
            <i className="iconfont icon-shengchengdaima text-4xl"></i>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="block">XUTCode</span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
            准备好提升自己了吗? 🧐
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            {/*() =>navigate()
            等价于 
            function(){navigate()}  
            */}
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 border border-transparent rounded-full shadow-lg text-lg font-medium text-blue-700 bg-white hover:bg-blue-50 transition duration-300 transform hover:scale-105"
            >
              Go GO GO ~ <i className="iconfont icon-arrow-right ml-1"></i>
            </button>
          </div>
        </div>
        {/* 特性介绍部分 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"> 
                <i className={`iconfont ${feature.icon} text-2xl text-white`}></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
      {/* 页脚 */}
      <footer className="py-6 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-blue-100">
          <p>&copy; {new Date().getFullYear()} XUTCode. 保留所有权利.👺</p>
        </div>
      </footer>
      {/* 样式 */}
      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.3; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.2); }
         
      `}</style>
    </div>
  );
}

export default Home;

