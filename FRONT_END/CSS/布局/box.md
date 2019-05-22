## 盒模型

&emsp;&emsp;所有文档都生成一个矩形框，这称为元素框(element box),它描述了一个元素在文档布局中所占的空间大小。而且，每个框影响着其他元素框的位置和大小。  
![CSS布局盒模型](http://p72a7fll6.bkt.clouddn.com/image/CSS_layout_box.jpg)  

### 宽高
&emsp;&emsp;宽高width被定义为从左到右边界的距离，高度height被定义为从上内边界到下内边界的距离。  
&emsp;&emsp;在CSS中，可以对任何块级元素设置显示高度。如果指定高度大于显示所需高度，多于的高度会产生一个视觉效果，就好像有额外的内边距一样；如果指定高度小于显示内容所需高度，则会想元素添加一个滚动条。如果元素内容的高度大于元素框的高度，浏览器的具体行为取决于overflow属性。  

> 宽度和高度无法应用到行内非替换元素，且不能为负。

#### width/height

&emsp;&emsp;值：&lt;length&gt; | &lt;percent&gt; | auto | inherit  
&emsp;&emsp;初始值：auto  
&emsp;&emsp;应用于：块级元素和替换元素  
&emsp;&emsp;继承性：无  
&emsp;&emsp;百分数：相对于包含块的width/height  
&emsp;&emsp;计算值：对于auto和百分数，根据指定确定；否则是一个绝对值，除非元素不能应用该属性(此时为auto)  

#### auto

&emsp;&emsp;宽高和margin可以设置为auto，对于块级元素来说，宽度设置为auto，则会尽可能的宽。详细的来说，元素的宽度=包含块宽度-元素水平外边距-元素水平内边距；高度设置为auto，则会尽可能的窄。详细来说，元素高度=恰好足以包含其内联内容的高度。  

> 注意没有显示生命包含块的height，则元素的百分数高度为重置为auto

### 怪异盒模型
&emsp;&emsp;IE-6浏览器的宽高定义的是可见元素框的尺寸，而不是元素框的内容区尺寸

#### 最大最小宽高
&emsp;&emsp;设置最大最小宽高的好处是可以相对安全地混合使用不同的单位。使用百分数大小的同时，也可以设置基于长度的限制。
min-width | min-height  
&emsp;&emsp;值：&lt;length&gt; | &lt;percent&gt; | inherit  
&emsp;&emsp;初始值：0  
&emsp;&emsp;应用于：块级元素和替换元素  
&emsp;&emsp;继承性：无  
&emsp;&emsp;百分数：相对于包含块的宽度(高度)  

max-width | max-height
&emsp;&emsp;值：&lt;length&gt; | &lt;percent&gt; | inherit  
&emsp;&emsp;初始值：none  
&emsp;&emsp;应用于：块级元素和替换元素  
&emsp;&emsp;继承性：无  
&emsp;&emsp;百分数：相对于包含块的宽度(高度)  

> IE-6浏览器不支持min-width | min-height | max-height | max-width
> 当最小宽度(高度)大于最大宽度(高度)时,以最小高度的值为准


<iframe style="width: 100%; height: 380px;" src="https://demo.xiaohuochai.site/css/box/b11.html" frameborder="0" width="320" height="240"></iframe>

### 内边距
&emsp;&emsp;相比于盒模型的其它属性(如在定位中经常使用负值的margin，因为CSS3的到来重获光彩的border等)，padding显得中规中距了很多，没有什么兼容性，也没有一些特殊的问题。  
&emsp;&emsp;对于行内元素，左内边距应用到元素的开始处，右内边距应用到元素的结尾处，垂直内边距不影响行高，但会影响到自身尺寸，加背景色可以看出。
> 内边距不能是负值

#### padding
&emsp;&emsp;值：[&lt;length&gt; | &lt;percent&gt;]{1,4} | inherit  
&emsp;&emsp;初始值：未定义  
&emps;&emsp;应用于：所有元素  
&emsp;&emsp;继承性：无  
&emsp;&emsp;百分数：相对于包含块的width  

#### 【50%】  
&emsp;&emsp;块级元素通过padding:50%可以实现正方形的效果，因为水平和垂直padding的百分比值都是相对于包含块的宽度绝对的，常常用于移动端头图。  
&emsp;&emsp;如果是内联元素使用padding:50%,必须配合font-size:0，因为使用inline元素的垂直padding会出现"幽灵空白节点"，也就是规范中"strut"。所以通过font-size:0使用尺寸为0  

#### 【表单】  
1. 所有浏览器input/textarea/button都内置padding
2. 部分浏览器select下拉内置padding,firefox、IE8+可以设置padding
3. 出IE10-以外的其他浏览器，radio/checkbox单选复选框无内置padding，且无法设置padding。IE10-浏览器以外的其他浏览器，radio/checkbox单选复选框无内置border，且无法设置border

#### button兼容
1、在firefox浏览器中，设置padding:0,按钮左右两侧依然有padding，这时需要使用firefox自有样式
```css
button: -moz-focus-inner{padding: 0;}
```

2、IE7-浏览器下文字月多，左右padding逐渐变大，设置overflow:visible可解决该问题。  

3、button按钮的padding与高度计算不兼容
```css
button{
    line-height: 20px;
    padding: 10px;
    border:none;
}
```

```
结果为：
IE7::45px
firefox: 42px
chrome/IE8+:40px
```


### 问题整理
1、默认情况下图片与文字可以在一行，下端对齐  
2、设置浮动属性，文字可以多行包裹图片
3、浮动可以说是

### 参考
1. [学习CSS](http://zh.learnlayout.com/display.html)  
2. 