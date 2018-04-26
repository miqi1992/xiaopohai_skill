## 深入理解display属性
&emsp;&emsp;每个元素都有一个默认的display值，这与元素的类型有关display属性在网页布局中非常常见，对于大多数元素它们的默认值通常是 block 或 inline 。一个 block 元素通常被叫做块级元素。一个inline元素通常被叫做行内元素。经常用到的有block、inline-block、inline和none等寥寥几个属性值，本文将详细介绍display属性的各个方面  

### 定义
&emsp;&emsp;display属性用于规定元素生成的框类型，影响显示方式  
&emsp;&emsp;值：none | inline | block | inline-block | list-item | run-in | table | inline-table | table-row-group | table-header-group | table-footer-group | table-row | table-colume-group | table-cell | table-caption | inherit  
&emsp;&emsp;初始值：inline  
&emsp;&emsp;应用于：所有元素  
&emsp;&emsp;继承性：无  

> IE7-浏览器不支持table类属性值及inherit

### 分类

#### block
【特征】  
   
    1. 不设置宽度时，宽度为父元素宽度  
    2. 独占一行  
    3. 支持宽高


【标签】
```
<address><article><aside><blockquote><body><dd><details><div><dl><dt><fieldset><figcaption><figure><footer>
<form><h1><header><hgroup><hr><html><legend><menuitem><nav><ol><optgroup><option><p><section><summary><ul>
```

> menuitem标签只有firefox支持

【不支持的样式】
    1. vertical-align

#### inline

【特征】  

    1. 内容撑开宽度
    2. 非独占一行
    3. 不支持宽高
    4. 代码换行被解析成空格


【标签】  
```
<a><abbr><area><b><bdi><bdo><br><cite><code><del><dfn><em><i><ins><kbd><label><map><mark><output><pre><q><rp>
<rt><ruby><s><smap><small><span><strong><sub><sup><time><u><var><wbr>
```

【不支持的样式】  

    1. background-position
    2. clear
    3. clip
    4. height | max-height | min-height
    5. width | max-width | min-width
    6. overflow
    7. text-align
    8. text-indent
    9. text-overflow

#### inline-block

【特征】  

    1. 不设置宽度时，内容撑开宽度
    2. 非独占一行
    3. 支持宽高
    4. 代码换行被解析成空格

【标签】  
```
<audio><button><canvas><embed><iframe><img><input><keygen><meter><object><progress><select><textarea><video>
```

【不支持的样式】  

    1. clear
 
【IE兼容性】  
&emsp;&emsp;IE7-浏览器不支持给块级元素设置inline-block样式，解决方法如下：首先将其变成行内元素，使用具有行内元素的特性，然后触发haslayout，使其具有块级元素的特性，如此就可以模拟出inline-block的效果

```css
div{
    display: inline-block;
    *display: inline;
    zoom:1;
}
```

#### none

【特征】  
&emsp;&emsp;影藏元素并脱离文档流

【标签】  
```
<base><link><meta><title><datalist><dialog><param><script><source><style>
```

#### list-item

【特征】  

    1. 不设置宽度时，宽度撑满一行
    2. 独占一行
    3. 支持宽高

### 表格类元素 

```
table{display: table;}
thead{display: table-header-group;}
tbody{display: table-row-group;}
tfoot{display: table-footer-group;}
tr{display: table-row;}
td,th{display: table-cell;}
col{display: table-column;}
colgroup{display: table-column-group;}
caption{display: table-caption;}
```

&emsp;&emsp;表格类元素的display共有以上几种，&lt;thead&gt;&lt;tbody&gt;&lt;tfoot&gt;&lt;tr&gt;&lt;col&gt;&lt;colgroup&gt;因为无法设置margin和padding用的较少，下面将着重介绍下&lt;table&gt;、&lt;td&gt;、&lt;th&gt;、&lt;caption&gt;这四个标签对应的display属性  

#### table  

【特征】  

    1. 不设置宽度时，宽度由内容撑开
    2. 独占一行
    3. 支持宽高
    4. 默认具有表格特征，可设置table-layout/border-collapse、border-spacing等表格专有特性

> 注意：对于display为table和inline-table，若处于分隔边框模型即border-collapse:separate;，margin和padding都可设置；若处于合并边框模型即border-collapse:collapse，只可设置margin


#### inline-table

【特征】  

    1. 不设置宽度时，宽度由内容撑开
    2. 非独占一行
    3. 支持宽高
    4. 默认具有表格特征，可设置table-layout、border-collapse、border-spacing等表格专有属性

#### table-cell

【特征】  

    1. 不设置宽度时，宽度由内容撑开
    2. 非独占一行
    3. 支持宽高
    4. 垂直对齐
    5. 同级等高

> 注意：display:table-cell的元素不可以设置margin，但可以设置padding


#### table-spacing

【特征】  

    1. 不设置宽度时，宽度由内容撑开
    2. 独占一行
    3. 支持宽高
    
> 注意：display:table-caption的元素margin和padding都可设置 


### 参考
1. [学习CSS布局_display属性](http://zh.learnlayout.com/display.html)