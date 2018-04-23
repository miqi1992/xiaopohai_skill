# 引入CSS

> 本文将介绍引入CSS样式的3种方式：外部样式表、内部样式表、内联样式

## 简介

Web早期，HTML是一种很有限的语言，这种语言不关心外观，它只是一种简洁的小型标记机制。随着Mosaic网页浏览器的出现，网站开始到处涌现。对于页面改变外观的需求增加，于是增加了类似&lt;font&gt;和&lt;bid&gt;之类的标记元素。几年之后，大多数网站标记几乎完全由表格和font元素组成，且对于所要表现的内容不能传达任何实际含义，且文档可用性降低，且不易于维护。于是1995年，W3C发布了CSS草案，视图解决结构域样式混杂的问题。1996年，W3C正式推出CSS1。1998年，推出了CSS2,2001年从CSS3开始，CSS这门语言分割成多个独立的模块，每个模块独立分级，且只包含一小部分功能;2011年开始设计CSS4。

> CSS语法非常简单，但容易忽略的一点是不能省略分号\(最后一个样式除外\)

## 样式表

### 外部样式表

当样式需要应用于很多页面时，外部样式表将是理想的选择。在使用外部样式表的情况下，你可以通过改变一个文件来改变整个站点的外观。每个页面使用标签链接到样式表。标签在\(文档的\)头部\(head标签内\)

```html
<head><link rel="stylesheet" type="text/css" href="mystyle.css" media="all"></head>
```

> 在link标记中，rel和href属性是必须的，type属性和media属性可省略。
>
> ```html
> <!DOCTYPE html>
> <html lang="en">
> <head>
> <meta charset="UTF-8">
> <link rel="stylesheet" href="sheet1.css">
> <title>Document</title>
> </head>
> <body></body>
> </html>
> ```

```css
body{
background-color: red;
}
```

> 注意：1、样式表中不能包含HTML标记语言，只能有CSS规则和CSS注释
>    2、CSS注释只支持/\*\*/的写法，不支持//的写法
>    3、样式表应该以 .css 扩展名进行保存

#### 多个样式表

一个文档可能关联有多个样式表，如果是这样，文档最初显示时只会使用rel为stylesheet的link标记。

```html
<link rel="stylesheet" href="sheet1.css">
<link rel="stylesheet" href="sheet2.css">
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="sheet1.css">
<link rel="stylesheet" href="sheet2.css">
<title>Document</title>
</head>
<body>
</body>
</html>
```

```css
body{
background-color: red;
}
```

```css
body{
height: 100px;
border: 10px solid black;
}
```

![CSS引入\_多个样式表](http://p72a7fll6.bkt.clouddn.com/image/css引入_多个样式表.jpg)

#### 候选样式表

  将rel属性的设置为altenate stylesheet可以定义候选样式表，只有在用户选择这个样式表时才会用于文档表现。如果浏览器能使用候选样式表，它会使用link元素的title属性值生成一个候选样式列表，可以在菜单栏中查看-&gt;样式中进行选择\(IE和firefox支持\)

> 若一个候选样式表没有设置title，那么它将无法在候选样式列表中出现，则无法被引用。

```html
<link rel="stylesheet" type="text/css" href="sheet1.css" />
<link rel="alternate stylesheet" type="text/css" href="sheet2.css" title="sheet2"/>
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" type="text/css" href="sheet1.css" />
<link rel="alternate stylesheet" type="text/css" href="sheet2.css" title="sheet2"/>
<title>Document</title>
</head>
<body>
</body>
</html>
```

```css
body{
background-color: red;
}
```

```css
body{
height: 100px;
border: 10px solid black;
}
```
![CSS引入_候选样式表](http://p72a7fll6.bkt.clouddn.com/image/css%E5%BC%95%E5%85%A5_%E5%80%99%E9%80%89%E6%A0%B7%E5%BC%8F%E8%A1%A8.gif)

### 内部样式表
当单个文档需要特殊的样式时，就应该使用内部样式表。你可以使用style标签在文档头部定义内部样式表，就像这样:

```html
<head>
<style>
hr {color:sienna;}
p {margin-left:20px;}
body {background-image:url("images/back40.gif");}
</style>
</head>
```

#### 多个style标签
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
body{
background-color: red;
}
</style>
<style>
body{
background-color: blue;
height: 100px;
border: 10px solid black;
}
</style>
<title>Document</title>
</head>
<body>
</body>
</html>
```

![css引入_多个style标签引入](http://p72a7fll6.bkt.clouddn.com/image/css%E5%BC%95%E5%85%A5_%E5%A4%9A%E4%B8%AAstyle%E6%A0%87%E7%AD%BE.jpg)

#### 使用@import指令
与link类似，@import指令用于指示web浏览器加载一个外部样式表，并在表现HTML文档时使用其样式。唯一的区别在于命令的具体语法和位置。@import指令常用于样式表需要使用另一个样式表中的样式的情况。

```html
<style>
@import url(sheet2.css);
body{
background-color: red;
}
</style>
```

>注意：@import必须出现在style元素中，且要放在其他CSS规则之前，否则将根本不起作用。

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
/*将@import放置在CSS规则之后将不起使用*/
body{
background-color: red;
}
@import url(sheet2.css);
</style>
<title>Document</title>
</head>
<body>
</body>
</html>
```

#### 多个@import指令
可以使用@import指令导入多个CSS样式表，且可以使用media来限制应用场景。
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
@import url(sheet1.css) all;
@import url(sheet2.css);
</style>
<title>Document</title>
</head>
<body>
</body>
</html>
```

### 内联样式
由于要将表现和内容混杂在一起，内联样式会损失掉样式表的很多优势。
要使用内联样式，你需要在相关的标签内使用样式(style)属性。Style属性可包含任何CSS属性。
```html
<p style="color: sienna; margin-left: 20px">这是一个段落。</p>
```

### 多重样式将层叠为一个
样式表允许以多种方式规定样式信息。样式可以规定在单个的HTML元素中，在HTML页的头元素中，或在一个外部的CSS文件中。甚至可以在同一个HTML文档内部引用多个外部样式表。

#### 层叠次序
当同一个HTML元素被不止一个样式定义时，会使用哪个样式呢？
一般而言，所有的样式会根据下面的规则层叠与一个新的虚拟样式表中，其中数字4拥有最高的优先权。
1. 浏览器缺省设置。
2. 外部样式表
3. 内部样式表(位于head标签内部)
4. 内联样式(在HTML元素内部)

因此，内联样式(在HTML元素内部)拥有最高的优先权，这意味着它将优先于以下的样式声明:标签中的样式声明，外部样式表中的样式声明，或者浏览器中的样式声明（缺省值）。

#### 多重样式优先级深入理解
优先级用于浏览器是通过判断哪些属性值与元素最相关以决定并应用到该元素上的。
优先级仅由选择器组成的匹配规则决定的。
优先级就是分配给指定的CSS声明的一个权重，它由匹配的选择器中的每一种选择器类型的数值决定。
下列是一份优先级逐级增加的选择器列表，其中数字 7 拥有最高的优先权：
1、通用选择器（*）
2、元素(类型)选择器
3、类选择器
4、属性选择器
5、伪类
6、ID 选择器
7、内联样式

#### !import规则例外
当!import规则被应用在一个样式声明中时，该样式声明会覆盖CSS中任何其他的声明，无论它处在声明列表中的哪里。尽管如此，!important规则还是与优先级毫无关系。使用 !important 不是一个好习惯，因为它改变了你样式表本来的级联规则，从而使其难以调试。

#### CSS优先级法则
+ 选择器都有一个权值，权值越大越优先；
+ 当权值相等时，后出现的样式表设置要优于先出现的样式表设置；
+ 创作者的规则高于浏览者：即网页编写者设置的CSS 样式的优先权高于浏览器所设置的样式；
+ 继承的CSS 样式不如后来指定的CSS 样式；
+ 在同一组属性设置中标有"!important"规则的优先级最大

> &lt;style&gt;标签和&lt;link&gt;标签可以写在&lt;body&gt;标签里面