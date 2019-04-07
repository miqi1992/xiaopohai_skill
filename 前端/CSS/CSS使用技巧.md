
# CSS使用技巧

>本文将介绍使用CSS的一些技巧

1. 文字的水平居中
将一段文字置于容器的水平重点，只要设置text-align属性即可。

``` css
    text-align: center;
```

2. 容器的水平居中
先为该容器设置一个明确宽度，然后将margin的水平值设为auto即可。
``` css
    div#container {
        width: 760px;
        margin: 0 auto;
    }
```

3. 文字的垂直居中
单行文本的垂直居中，只要将行高与容器高设为相等即可。
比如，容器中有一行数字。
``` css
    <div id="container">123456789</div>
```

然后CSS这样写：
``` csss
    div#container {height: 35px; line-height: 35px;}
```

4. 容器的垂直居中
比如，有一大一小两个容器，请问如何想小容器垂直居中？
``` css
    
```
首先，将大容器的定位为relative
``` css
    div#big{
        position: relative;
        height: 480px;
    }
```
然后，将小容器定位为absolute，再将它的左上角沿y抽下移50%,最后将它margin-top上移本身高度的50%即可。

``` css
    div#small {
        position: absolute;
        top: 50%;
        height: 240px;
        margin-top: -120px;
    }
```
使用同样的思路，也可以做出水平居中的效果。

5. 图片宽度的自适应
如何使得较大的图片，能够自适应小容器的宽度？CSS可以这样写：
``` css
    img {
        max-width: 100%
    }
```
但是IE6不支持max-width,所以遇到IE6时，使用IE条件注释，将语句改写成：
``` css
    img {
        width: 100%;
    }
```

6. 3D按钮
要使按钮具有3D效果，只要将它的左上部边框设为浅色，右下部边框设为深色即可。
``` CSS
    div#button {
        background: #888;
        border: 1px solid;
        border-color: #999 #777 #777 #999;
    }
```

7. font属性的快捷写法
font快捷写法的格式为：
``` css
    body {
        font: font-style font-variant font-weight font-size line-height font-family;
    }
```
所以，
``` css
    body {
        font-family: Arial, Helvetica, sans-serif;
        font-size:  13px;
        font-weight: normal;
        font-variant: small-caps;
        font-style: italic;
        line-height: 150%;
    } 
```
可以被写成：
```css
    body {
        font:  italic small-caps normal 13px/150% Arial, Helvetica, sans-serif;
    }
```

8. link的设置顺序
link的四种状态，需要按照下面的前后顺序进行设置：
```css
    a:link
    a:visited
    a:hover
    a:active
```

9. CSS的优先性
如果同一个容器被多条CSS语句定义，那么哪一个定义优先呢？
基本规则是：
```css
    行内样式 -> id样式 -> class样式 -> 标签样式名
```

比如，有一个元素：
``` html
    <div id="ID" class="CLASS" style="color:block;"></div>
```
行内样式是最优先的，然后其他设置的优先性，从低到高一次为：
```
    div < .class < div.class < #id < div#id <#id.class < div#id.class
```

10.font-size基准
浏览器的缺省字体大小是16px, 你可以先将基准字体大小设置为10px;
``` css
    body {font-size: 62.5%;}
```

后面同意采用em作为字体单位，2.4em就表示24px。
``` css
    h1 {font-size: 2.4em;}
```

11. Text-transform和Font Variant
Text-transform用于将所有字母变成小写字母、大写字母或首字母大写：
``` css
    p {text-transform: uppercase;}
    p {text-transform: lowsercase;}
    p {text-transform: capitalize;}
```
Font Variant用于将字体变成小型的大写字母(即与小写字母登高的大写字母)。
``` css
    p {font-variant: small-caps;}
```

12. 用图片充当列表标志
默认情况下，浏览器使用一个黑圆圈作为列表标志，可以用图片取代它：
``` css
    ul {list-style: none;}
    ul li {
        background-image: url('path-to-your-image');
        background-repeat: none;
        background-position: 0 0.5em;
    }
```

13. 透明
将一个容器设为透明，可以使用下面的代码：
``` css
    .element {
        filter: alpha(opacity=50);
        -moz-opacity: 0.5;
        -khtml-opacity:  0.5;
        opacity: 0.5
    }
```

14. CSS三角形
如何使用CSS生成一个三角形？
先编写一个空元素
``` css
    <div class="triangle"></div>
```
然后，将它四个框中的三个边框设为透明，剩下一个设为可见，就可以生成三角形效果。
``` css
    .trangle {
        border-color:  transparent transparent green transparent;
        border-style:  solid;
        border-width:  0px 300px 300px 300px;
        height: 0px;
        width: 0px;
    }
```

15. 禁止自动换行
如果你希望文字在一行中显示完成，不要自动换行，CSS命令如下：
``` css
    h1 {white-space: nowrap;}
```

16. 用图片替换文字
有时我们需要在标题中使用图片，但是又必须保证搜索引擎能够读到标题，CSS语句可以这样写：
``` css
    h1 {
        text-indent: -9999px;
        background: url("h1-image.jpg") no-repeat;
        width:  200px;
        height: 50px;
    }
```

17. 获得焦点的表单元素
当一个表单元素或者焦点时，可以将其突出显示：
```
    input: focus {border: 2px solid green;}
```

18. !important规则
多条CSS语句相互冲突时，具有!important的语句将覆盖其他语句。
``` css
    h1 {
        color: red !important;
        color:  blue;
    }
```
上面这段语句的结果是，其他浏览器都显示红色标题，只有IE显示蓝色标题。

19. CSS提示框
当鼠标移动到链接上方，会自动出现一个提示框
``` css
    <a class="tooltip" href="#">链接文字<span>提示文字</span></a>
```

CSS可以这样写：
``` css
    a.tooltip {position: relative;}
    a.tooltip span {display: none; padding: 5px; width: 200px;}
    a:hover {
        background: #fff;
    }

    a.tooltip:hover span{
        display: inline;
        position: absolute;
    }
```
20. 固定位置的页首
当页面需要滚动时， 有时需要页首在位置固定不变，CSS语句可以这样写，效果参见：[https://limpid.nl/lab/css/fixed/header](https://limpid.nl/lab/css/fixed/header)

``` css
    body {
        margin:  0; 
        padding: 100px 0 0 0;
    }

    div#header {
        position:  absolute;
        top: 0;
        left:  0;
        width:  100%;
        height:  <length>;
    }

    @media screen {
        body>div#header{position: fixed;}
    }

    *html body{overflow: hidden;}
    *html div#content{height:100%;overflow: auto;}
