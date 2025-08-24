# 初学者如何理解和上手 React 项目框架

## 第一步：理解基本概念

### 1. React 是什么？

React 是一个用于构建用户界面的 JavaScript 库，它采用组件化的方式来构建 UI。你可以把它想象成乐高积木，每个组件都是一块积木，你可以用这些积木搭建出复杂的界面。

### 2. 核心概念理解

- **组件**：React 应用由组件构成，每个组件都是独立的、可复用的 UI 单元。
- **TSX**：一种类似 HTML 的语法，让你可以在 TypeScript 中编写 UI 代码。
- **Props**：父组件传递给子组件的数据。
- **State**：组件内部的数据，当 State 改变时，组件会重新渲染。
- **Hooks**：React 16.8 引入的新特性，让你在函数组件中使用状态和其他 React 特性。

### 3.组件学习

React 组件是返回值值是 html 标签的 Typescript 函数

1. _组件是以大写字母开头的_ , 所以在调用的时候<My_button/>(就像这样的是组件) , 小写的是<div> 是 html 标签.
---
2. _显示数据_ : {} 大括号可以"转义回"TypeScript

```tsx
return{
<h1>
{user.name}
<h1/>
}
```
---
>  在这里你可以看到我们可以在返回值的标签里面使用大括号获取函数里面的值
3. _标签属性_ : className: 可以在标签里面定义相对应的 css.
---
4.  _条件渲染_ : 可以使用判断语句来渲染组件
```tsx
let content ;
if (islogin){
content = <AdminPanel/>};
else {
content = <LoginForm/>
};
return (
<div>
{content}
<div/>
)

```
- 当然如果喜欢更简介的书写方式--可以使用? 运算符号
```tsx
return(
<div>
{islogin?(<AdminPanel/>):
(
<LoginForm/>
)
}
<div/>
)
```
---
5. _渲染列表_  (map)
```tsx
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
  {title :"bull",isFruit:false,id:4}
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```
这里就是和循环有点像,但是不用写循环次数,直接便利整个列表. product 这个变量起到了i 应有的作用. 然后就是对这个i 进行操作 , 最终返回一个新的列表,也就是listItems

6. _改变状态_
```tsx
// 这个组件是一个用于计数的函数
import{useState} from 'react';
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}

// 调用组件
export default function MyApp() {
  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

```
