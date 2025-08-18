## 组件样式分类总结

### 🎨 页面容器样式
```typescript
// 全屏容器 - 带渐变背景
className="min-h-screen bg-gradient-to-br from-red-600 to-indigo-700 flex flex-col text-white"

// 背景装饰层
className="absolute inset-0 bg-[url('...')] bg-cover bg-center opacity"

// 主要内容区域
className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative z-10"
```

### 📝 标题组件样式

**大标题（主标题）:**
```typescript
className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
```

**卡片标题:**
```typescript
className="text-xl font-semibold mb-3"
```

**副标题/描述文字:**
```typescript
className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto"
```

### 🔘 按钮组件样式

**主要行动按钮（CTA按钮）:**
```typescript
className="px-8 py-4 border border-transparent rounded-full shadow-lg text-lg font-medium text-blue-700 bg-white hover:bg-blue-50 transition duration-300 transform hover:scale-105"
```

### 🎭 图标容器样式

**大图标容器:**
```typescript
className="w-20 h-20 mx-auto mb-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
```

**小图标容器:**
```typescript
className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
```

### 🃏 卡片组件样式

**玻璃态特性卡片:**
```typescript
className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 text-center transform transition-all duration-300 hover:scale-105 hover:bg-white/15"
```

**卡片描述文字:**
```typescript
className="text-blue-100"
```

### 📋 布局组件样式

**居中内容容器:**
```typescript
className="text-center max-w-3xl w-full"
```

**网格布局容器:**
```typescript
className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-10"
```

**按钮组容器:**
```typescript
className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
```

### 🦶 页脚组件样式

**页脚容器:**
```typescript
className="py-6 mt-auto relative z-10"
```

**页脚内容:**
```typescript
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-blue-100"
```

### 🎨 复用样式模板

**玻璃态效果组合:**
```typescript
"bg-white/10 backdrop-blur-md border border-white/20"
```

**悬停动画组合:**
```typescript
"transform transition-all duration-300 hover:scale-105"
```

**响应式间距组合:**
```typescript
"px-4 sm:px-6 lg:px-8"
```

**文字颜色主题:**
```typescript
"text-white"          // 主要文字
"text-blue-100"       // 次要文字  
"text-blue-700"       // 按钮文字
```

### 📱 响应式断点使用

- `sm:` - 小屏幕 (640px+)
- `md:` - 中屏幕 (768px+) 
- `lg:` - 大屏幕 (1024px+)

这样分类后，你可以轻松复用这些样式组合来创建一致的UI组件！