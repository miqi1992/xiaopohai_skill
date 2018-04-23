# 样式关键字
&emsp;&emsp;在CSS中，有4个关键字理论上可以应用于任何的CSS书写，他们是initial(初始)、inherit(继承)、unset(未设置)、revert(还原)。而all的取值只能是以上这4个关键字。本文将介绍initial、inherit、unset、revert和all

### initial
&emsp;&emsp;表示元素属性的初始默认值(该默认值由官方CSS规范定义)
兼容性: IE不支持
>关于各属性的初始默认值[移步至此](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)  

```html
//display在官方CSS规范中定义的默认值是inline
<style>
.test{display: initial;}
</style>
<div class="box">
    <div class="test">测试一</div><span>文字</span>
    <br>
    <div >测试二</div><span>文字</span>
</div>
```
 

### inherit
&emsp;&emsp;CSS中的每个属性都有一个特定值"inherit",其含义是指定继承父元素的相应属性，使用inherit一方面在代码上能地表明要继承于父元素的样式属性，另一方面也使子元素继承了那些不会被自动继承的属性  
兼容性：IE7-不支持
```html
<style>
.box{
    border: 1px solid black;
    padding: 10px;
    width: 100px;
}
.test{
    border: inherit;
    height: 30px;
}
</style>
<div class="box">
    <div class="test">测试一</div>
</div>
<div class="box">
    <div class="in">
        <div class="test">测试二</div>        
    </div>
</div>
```


#### unset
&emsp;&emsp;unset相对于initial和inherit而言，相对复杂一点。表示如果该属性默认可继承，则值为inherit;否则值为initial。实际上，设置unset相当于不设置  

【常用默认可继承样式】
```
color
cursor
direction
font
letter-spacing
line-height
line-style
list-style
text-align
text-indent
text-shadow
text-transform
white-space
word-break
word-spacing
word-wrap
writing-mode
```

```html
//内容为测试一的元素和内容为测试二的元素的样式是一样的
<style>
.box{
    border: 1px solid black;
    padding: 10px;
    width: 100px;
    color: red;
}
.test1{
    border: unset;
    color: unset;
}
</style>
<div class="box">
    <div class="test1">测试一</div>
    <div>测试二</div>
</div>
```


#### revert
&emsp;&emsp;表示样式表中定义的元素属性的默认值。若用户定义样式表中显示设置，则按此设置；否则，按照浏览器定义样式表的样式设置；否则，等价于unset  

&emsp;&emsp;兼容性：只有safari9.1+和ios9.3+支持

#### all
&emsp;&emsp;表示重设除unicode-bidi和direction之外的所有CSS属性的属性值，取值只能是initial、inherit、unset和revert  

&emsp;&emsp;兼容性：IE不支持，safari9-不支持，ios9.2-不支持，android4.4-不支持  

```html
<style>
.test{
    border: 1px solid black;
    padding: 20px;
    color: red;
}
.in{
/*  all: initial;
    all: inherit;
    all: unset;
    all: revert; */
}
</style>
<div class="test">
    <div class="in">测试文字</div>            
</div>
```

&emsp;&emsp;【1】当all:initial是，in的所有属性都取默认值

```html
border:none;padding:0;color:black;
```

&emsp;&emsp;【2】当all:inherit时，.in的所有属性都取父元素继承值  
```html
border:1px solid black;padding:20px;color:red;
```

&emsp;&emsp;【3】当all:unset时，.in的所有属性都相当于不设置值，默认可继承的继承，不可继承的保持默认值  

```
border:none;padding:0;color:red;
```