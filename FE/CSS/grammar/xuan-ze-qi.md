# 选择器
>本文将介绍CSS选择器，要使某个样式应用于特定的HTML元素，首先需要找到该元素。在CSS中，执行这一任务的表现规则称为CSS选择器。  

## 前言
&emsp;&emsp;CSS的一个核心特性是能向文档中的一组元素类型应用某些规则，本文将详细介绍CSS选择器，关于CSS选择器兼容性的详细信息[参考此处](https://www.quirksmode.org/css/selectors/)  

### 通配选择器
型号*代表通配选择器，可以与任何元素匹配。  
```css
*{
    color: red;
}
```

### 元素选择器
文档的元素是最基本的选择器
```css
html{
    color: black;
}

p{
    color: gray;
}

h2{
    color: sliver;
}
```

### 类选择器
类选择器用于选择一类元素
```css
.div{
    color: red;
}
```

1. 多类选择器  
```css
.div1.div2{
    color: red;
}
```
2. 结合元素的类选择器
```css
p.div{
    color: red;
}
```

### ID选择器
ID选择器用于选择一个元素。  
```css
#test {
    color: red;
}
```
>注意：在实际中，浏览器并不会检查ID的唯一性，设置多个ID，可以为这些具有相同ID的元素应用相同的样式，但在编写DOM脚本时只能识别该ID的第一个元素。  
1. 结合元素的ID选择器
```css
div#test{
    color: red;
}
```

### 属性选择器
属性选择器根据元素的属性以及属性值来选择元素(IE6-不支持)
1. 简单属性选择器
```css
h1[class]{
    color: red;
}
img[alt]{
    color: red;
}
a[href][title]{
    color: red;
}
#div[class]{
    color: red;
}
.box[id]{
    color: red;
}
[class]{
    color: red;
}
```

2. 具体属性选择器
```css
a[href="http://www.baidu.com"][title="baidu"]{
    color: red;
}
```
class里面的值以及顺序必须完全相同，并且不可多空格或者少空格
[class="test box"]{
    color: red;
}

ID选择器和指定id属性的属性选择器并不是一回事，主要在于优先级不同
[id="tox"]{
    color: red;
}

3. 部分属性选择器
```css
[class ~= "b"] /*选择class属性值在用空格分隔的词列表中包含词语"b"的所有元素*/
```
例如：class="ab"不满足[class ~="b"]而class="a b"或class="b"满足

```css
[class |= "b"]  /*选择class属性值等于b或以b-开头的所有元素*/
```
例如: class="ab"或class="ab-"不满足[class |= "a"],而class="a"或class="a-"满足

```css
[class ^= "b"] /*选择class属性值以"b"开头的所有元素*/
[class $= "b"] /*选择class属性值以"b"结尾的所有元素*/
[class *= "b"] /*选择classs属性值包含"b"的所有元素*/
```
上面三个属于正则匹配，是CSS3新增的属性选择器。  

### 分组选择器

将要分组的选择器放在规则左边，并用逗号隔开
```css
h1, p{
    color: red;
}
```

### 后代选择器
```css
ul li{
    color: red;
}

div p, ul li{
    color:red;
}
```

#### 子选择器(IE6-不支持)
```css
ul > li {
    color: red;
}
```

### 兄弟选择器
1. 相邻兄弟选择器(IE6-不支持)
```css
div + p{
    color: red;
}
```
>注意：两个元素之间的文本内容不会影响相邻兄弟结合符起作用。  
2. 通用兄弟选择器(IE7-不支持)
选择匹配的F元素，且位于匹配的E元素后的所有匹配的同级F元素
div ~ p {
    color: red;
}
>通用兄弟选择器选中的是与E元素相邻的后面西窘地元素F，其选中的是一个或多个元素；而相邻兄弟选择器选中的仅是与E元素相邻并且紧挨的兄弟元素F，其选中的仅是一个元素。

### 伪类选择器
伪类顺序： link-visited-focus-hover-active
>关于伪类的更多信息[移步知此](http://www.cnblogs.com/xiaohuochai/p/5518943.html)  
1. 静态伪类(只应用于超链接)
>visited只能设置字体颜色、边框颜色、outline颜色的样式
```
:link       未访问
:visited    已访问
a:link{color: red;}
a:visited{color: green;}
```

2. 动态伪类(可应用于任何元素)
```
:focus      拥有焦点(IE7-不支持)
:hover      鼠标停留(IE6-不支持<a>以为的其它元素设置伪类)
:active     正被点击(IE7-不支持<a>以外的其它元素设置伪类)
```
3. 目标伪类:target(IE8-不支持)
匹配锚点对应的目标元素
:target{color:red;}
#test :target{color: red;}  //id为test的目标元素
4. UI元素伪类(IE8-不支持)
```
:enabled        可用状态
:disabled       不可用状态
:checked        选中状态
```

```
input:enabled{color: red;}
```
5. 结构伪类(IE8-不支持)
```
E:first-child(IE6-不支持)  父元素的第一个子元素，且该子元素是E，与E:nth-child(1)等同
E:last-child(IE6-不支持)   父元素的最后一个子元素，且该子元素是E，与E:nth-last-child(1)等同
:root   选择元素的跟元素，即<html>元素
E F:nth-child(n)           选择父元素的第n个子元素，父元素是E，子元素是F
E F:nth-last-child(n)      选择父元素的倒数第n个元素，父元素是E，子元素是F
E F:nth-of-type(n)         选择父元素的具有指定类型的第n个元素，父元素是E，子元素是F
E F:nth-last-of-type(n)    选择父元素的具有指定类型的倒数第n个子元素，父元素是E，子元素是F
E:first-of-type            选择父元素中具有指定类型的第1个子元素，与E:nth-of-type(1)相同
E:last-of-type             选择父元素中具有指定类型的最后1个子元素，有E:nth-last-of-type(1)相同
E:only-child               选择父元素中只包含一个子元素，子元素是E
E:onlu-of-type             选择父元素中只包含一个同类型的子元素，子元素是E
E:empty                    选择没有子元素的元素，而且该元素也不包含任何文本节点   
```
>注意： n可以是整数(从1开始)，也可以是公式，也可以是关键字(even, odd)
```
p:first-child           代表的并不是<p>的第一个子元素，而是<p>元素时某元素的第一个子元素
P > i:first-child       匹配所有<p>元素中的第一个<i>元素
p:first-child i         匹配所有作为一个子元素的<p>元素中的所有<i>元素
```

6. :lang相当于 |= 属性选择器(IE7-不支持)
```
p:lang(en)  匹配语言为"en"的<p>
```

7. 伪类的结合
```css
a:visited:hover:first-child{color: black;}
```
>注意：顺序无关

### 伪元素选择器
IE8-浏览器仅支持微元素选择器的单冒号表示法
>关于伪元素的更多信息[移步至此](http://www.cnblogs.com/xiaohuochai/p/5021121.html)  
1. :first-letter 设置首字母样式
&emsp;&emsp;所有前导标点符号应与第一个字母一同应用该样式；只能与块级元素关联；只有当选择器部分与左大括号之间有空格时，IE-6浏览器才支持。因为first-letter中存在连接符的原因
```css
p:first-letter{
    color: red;
}
```

2. :first-line 设置首行样式
只能与块级元素关联；只有当选择器部分与左大括号之间有空格时，IE-6浏览器才支持，因为first-line中存在连接符的原因。
```css
p:fitst-line{
    color: red;
}
```

3. :before在元素内容前面插入内容(IE-7不支持)
&emsp;&emsp;默认这个伪元素时行内元素，继承元素可继承的属性；所有元素都必须放在出现该伪元素的选择器的最后面。若写成p:before em就是不合法的
```css
p:before{
    content: "text"
}
```
4. :after在元素内容后面插入内容(IE-7不支持)
&emsp;&emsp;默认这个伪元素时行内元素，继承元素可继承的属性。
```css
p:after{
    content: "text"
}
```
5. ::selection 匹配被用户选择的部分
目前selection只支持color和background属性，且只支持双冒号写法(IE8-不支持)
```css
::-moz-selection   /*firefox浏览器需要添加前缀*/
```

### 根元素选择器
单独把它拿出来，是因为其特殊性，根元素选择器:root用来选择HTML元素，但由于其实质是伪类选择器，所以其优先级更高。在HTML上设置的样式，如果在:root上也设置了同样的样式，则会被覆盖。  
```css
html{
    font-size: 20px;
}

:root{
    font-size: 30px;
}
```
上面的代码中，最终1rem = 30px