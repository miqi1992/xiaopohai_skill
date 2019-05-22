# 深入理解BFC

## 块状元素的流体特征与自适应布局

### 流体特征
块状水平元素，如`div`元素，默认情况下(非浮动、绝对定位等)，水平方向会自动填满外部的容器，如果有`margin-left/margin-right`,`padding-left/padding-right`、`border-left-width/border-right-width`等，实际内容区域会响应变窄。  

<iframe src="http://www.zhangxinxu.com/study/201502/div-flow.html" width="510" height="520" frameborder="0"></iframe>

图片宽度一直`width:100%`，依次点击3个按钮，结果随着`margin`、`padding`、`border`的出现，其可用宽度自动跟着减小，形成了自适应效果。就像放在容器中的水流一样，内容区域会随着`margin`,`padding`,`border`的出现自动填充剩余的空间，这就是块状元素的流体特征。  

### 自适应布局
下面，稍微做个调整，`div`距离容器左侧`margin`  `150`像素，里面的图片图片100%自适应内容区域。HTML如下：  
```css
.flow-box{
    width:500pc;
    background-colot: #eee;
    overflow: auto;
    resize: horizontal;
}

.flow-content{
    margin-left: 150px;
}
```

```html
<div class="flow-box">
    <div class="flow-content"><img src="mm1.jpg" width="100px" height="100px"></div>
</div>
```

![自适应特性](http://p72a7fll6.bkt.clouddn.com/image/mm1.jpg)  

图片右下角有两道斜杠，我们可以resize拉伸(现代浏览器，且非移动访问)，会发现，左侧永远150像素空白，而图片随着容器宽度变化而自适应变化了。  

此时，我们需要好好利用左侧150香色的留白间距，岂不是就可以实现两单自适应效果了！  

为了不影响原本的流体特征，我们可以使用破坏性属性，如浮动(float:left),或者绝对定位(position:absolute)  

我们直接HTML如下调整即可：  
```html
<div class="flow-box">
    <img src="mm1.jpg" width="128px" style="float: left;">
    <div class="flow-content"><img src="mm1.jpg" width="100%" height="190px"></div>
</div>
```

```html
<div class="flow-box">
    <img src="mm1.jpg" width="128px" style="position: absolute;">
    <div class="flow-content"><img src="mm1.jpg" width="100%" height="190px"></div>
</div>
```

结果分别如下：  
![自适应特性](http://p72a7fll6.bkt.clouddn.com/image/BFC_%E6%A8%A1%E5%9D%97%E9%97%B4%E8%B7%9D%E7%A6%BB.png)  

![自适应特性](http://p72a7fll6.bkt.clouddn.com/image/BFC_%E6%A8%A1%E5%9D%97%E9%97%B4%E8%B7%9D%E7%A6%BB.png)  
当然，你可以左侧有多个浮动，或者左浮动 + 右浮动。于是，我们不仅可以实现两栏自适应效果，多栏自适应效果也不再话下。  

然而，利用块状元素流体特性表现的自适应布局有个不足，就死，我们需要知道浮动或绝对定位内容的尺寸。然后，流体内容才能有对应的`margin`或`padding`或`border`值进行位置修订。于是，问题来了，我们无法单纯使用一个公用的类名，类似`.clearfix`这样，整站通用。因为不同自适应场景的留白距离是不一样的。  

此时，我们可以利用块状元素的BFC特性实现更强大更智能的多栏自适应布局。

## BFC
&emsp;&emsp;在解释BFC之前，先说一下文档流。我们常说的文档流其实分为定位流、浮动流和普通流。而普通流其实就是指BFC中的FC。FC是formating context的首字母缩写，直译过来就是格式化上下文，它是页面中的一块渲染区域，有一套渲染规则，决定了其子元素如何布局，以及和其他元素之间的关系和作用。常见的FC有BFC、IFC，还有GFC和FFC。BFC是block formating context，也就是块级格式化上下文，是用于布局块级盒子的一块渲染区域。BFC特性表现为内部元素再怎么翻江倒海，都不影响外部的元素。  

### 触发条件

满足下列条件之一就可触发BFC  
【1】 根元素，即HTML元素  
【2】 float的值不为none  
【3】 overflow的值不为visible，为`auto`,`scroll`,`hidden`  
【4】 display的值为`inline-block`、`table-cell`、`table-caption`  
【5】 position的值为`absolute`或`fixed`  

### 作用
&emsp;&emsp;BFC是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面元素，反之亦然。它与普通的块框类似，但不同之处在于：  

1. 可以阻止元素被浮动元素覆盖
&lt;说明&gt;通过改变内容为BFC背景为红色的盒子的属性值，使其成为BFC，以此阻止被绿色的浮动盒子覆盖  
<iframe style="line-height: 1.5; width: 100%; height: 437px;" src="https://demo.xiaohuochai.site/css/bfc/b1.html" frameborder="0" width="320" height="240"></iframe>

2. 可以包含浮动元素
&lt;说明&gt;通过改变高度塌陷的黑色边框的盒子的属性值，使其成为BFC，以此来包含绿色的浮动盒子。  
<iframe style="width: 100%; height: 349px;" src="https://demo.xiaohuochai.site/css/bfc/b2.html" frameborder="0" width="320" height="240"></iframe>

3. 属于同一个BFC的两个相邻块级子元素的上下margin会发生重叠，(设置writing-mode:tb-rl时，水平margin会发生重叠)。所以当两个相邻块级子元素
分属于不同的BFC时可以组织margin重叠

&emsp;&emsp;&lt;说明&gt;淡红色背景的块级盒子二的外面包一个div,通过改变此div的属性使红色盒子与绿色盒子分属于不同的BFC，以此来组织margin重叠。  

<iframe style="width: 100%; height: 453px;" src="https://demo.xiaohuochai.site/css/bfc/b3.html" frameborder="0" width="320" height="240"></iframe>

### BFC下的自适应布局
如果是上面介绍的流体特征`div`，当其和浮动元素当兄弟的时候，是覆盖的关系，而如果把元素BFC之后，元素就不会与浮动重叠。
<iframe src="http://www.zhangxinxu.com/study/201502/flow-to-bfc.html" width="100%" height="180" frameborder="0"></iframe>

会发现，普通流体元素BFC后，为了和浮动元素不产生任何交集，顺着浮动边缘形成自己的封闭上下文。  

![BFC元素不和浮动元素产生交集](http://p72a7fll6.bkt.clouddn.com/image/BFC_%E8%87%AA%E9%80%82%E5%BA%94%E5%B8%83%E5%B1%80.png)

BFC之后的元素依然保留原本的流体特性依然。虽然不与浮动交集，自动退避浮动元素宽度的巨鹿，然本身作为普通元素的流动性依然存在，反应在布局上就是自动填满出去浮动内容以外的剩余空间。  

#### BFC自适应布局模块间的间距
以下面例子，设置文本与图片之间的距离为20px，第一想法，给文本加个`margin-left: 20px`,CSS代码参考如下：  

```css
.float-left {
    float: left;
}
.follow-content {
    margin-left: 20px;
    background-color: #cad5eb;
    overflow: hidden;
}
```

![BFC_模块间距离](http://p72a7fll6.bkt.clouddn.com/image/BFC_%E6%A8%A1%E5%9D%97%E9%97%B4%E8%B7%9D%E7%A6%BB.png)  
BFC元素和浮动元素还是紧靠在一起，与我们的初想不太一样呢。

>margin并不是无效，而是值不够

而如果我们把`margin-left:20px`改成`matgin-left:150px`就应该有段距离了吧？
```css
.float-left {
    float: left;
}
.follow-content {
    margin-left: 150px;
    background-color: #cad5eb;
    overflow: hidden;
}
```
![BFC_自适应布局_marigin_left](http://p72a7fll6.bkt.clouddn.com/image/BFC_%E8%87%AA%E9%80%82%E5%BA%94%E5%B8%83%E5%B1%80_margin_left.png)  

> 我这里举margin这个例子，不是让大家这样使用，只是为了让大家可以深入理解BFC元素与浮动元素混排的特性表现。实际开发，我们完全没有必要对BFC元素设置margin, 因为又回到了流体布局，明明是固定的15像素间距，但是，每个布局都要写一个不同的margin值，完全没有重用价值。

我们可以使用浮动元素的`margin-right`或者`padding-right`轻松实现间距距离，间距是`20`像素
```css
.float-left {
    float: left;
    margin-right: 20px;
}
```

#### 与纯流体特性布局的优势
BFC自适应布局有如下2个有点：  
1. 自适应内容由于封闭，更健壮，容错性强。比方说，内部`clear:both`不会与兄弟`float`产生矛盾。而纯流体布局，`clear:both`会让后面内容无法和`float`元素在一个水平上，产生布局问题。  
2. 自适应内容自动填满浮动以为区域，无须关心浮动元素宽度，可以整站大规模应用。而纯流体布局，需要大小不确定的`margin`/`padding`等值撑开合适间距，无法CSS组件化。  

<iframe src="http://www.zhangxinxu.com/study/201502/flow-to-bfc-animation.html" width="400" height="216" frameborder="0"></iframe>

#### BFC元素家族与自适应布局面面观
理论上，任何BFC元素和浮动一起使用的时候，都可以实现自动填充的自适应布局。  

但是，由于绝大多数的触发BFC的属性自身有一些古怪的特性，所以，在实际操作的时候，能兼顾流体特征和BFC特性来实现自适应布局的属性并不多。  

+  `float:left` 浮动元素本身BFC化，然而浮动元素有破坏性和包裹性，失去了元素本身的流体自适应性，因此，无法用来实现自动填满容器的自适应布局。不过，其因兼容性还算良好，与堆积木这种现实认知匹配，上手简单，因此在旧时代被大肆使用，也就是常说的“浮动布局”，也算阴差阳错开创了自己的一套布局。  

+  `position:absolute` 这个脱离文档流有些严重，过于清高，不跟普通小伙伴玩耍，我就不说什么了……  

+  `overflow:hidden` 这个超棒的哦！不像浮动和绝对定位，玩得有点过。也就是溢出剪裁什么的，本身还是个很普通的元素。因此，块状元素的流体特性保存相当完好，附上BFC的独立区域特性，可谓如虎添翼，宇宙无敌！但是, 就跟清除浮动：```.clearfix { overflow: hidden; _zoom: 1; }```
一样。由于很多场景我们是不能overflow:hidden的，因此，无法作为一个通用CSS类整站大规模使用。因此，float+overflow的自适应布局，我们可以在局部（你确定不会有什么被剪裁的情况下）很happy地使用。  

+  `display:inline-block` CSS届最伟大的声明之一，但是，在这里，就有些捉襟见肘了。display:inline-block会让元素尺寸包裹收缩，完全就不是我们想要的block水平的流动特性。唉，只能是一声叹气一枪毙掉的命！然而，峰回路转，世事难料。大家应该知道，IE6/IE7浏览器下，block水平的元素设置display:inline-block元素还是block水平，也就是还是会自适应容器的可用宽度显示。于是，我们就阴差阳错得到一个比overflow:hidden更牛逼的声明，即BFC特性加身，又流体特性保留。  
```css
.float-left {
    float: left;
}
.bfc-content {
    display: inline-block;
}
```
当然，*zoom: 1也是类似效果，不过只适用于低级的IE浏览器，如IE7~  

+ `display:table-cell` 让元素表现得像单元格一样，IE8+以上浏览器才支持。跟`display:inline-block`一样，会跟随内部元素的宽度显示，看样子也是不合适的命。但是，单元格有个非常神奇的特性，就是你宽度值设置地再大，大到西伯利亚，实际宽度也不会超过表格容器的宽度。  
因此，如果我们把`display:table-cell`这个BFC元素宽度设置很大，比方说3000像素。那其实就跟block水平元素自动适应容器空间效果一模一样了。除非你的容器宽度超过3000像素，实际上，一般web页面不会有3000像素宽的模块的。所以，要是你实在不放心，设个9999像素值好了！  
```css
.float-left {
    float: left;
}
.bfc-content {
    display: table-cell; width: 9999px;
}
```
看上去，好像还不错。但是，还是有两点制约，一是IE8+以上浏览器兼容，有些苦逼的团队还要管IE6；二是应付连续英文字符换行有些吃力（可以嵌套table-layout:fixed解决）。但是，总体来看，适用的场景要比overflow:hidden广博很多。  

+ `display:table-row` 对width无感，无法自适应剩余容器空间。  

+ `display:table-caption` 一无是处……还有其他声明也都是一无是处，我就不全部展开了……   

## 参考
1. [CSS深入理解流体特性和BFC特性下多栏自适应布局](http://www.zhangxinxu.com/wordpress/2015/02/css-deep-understand-flow-bfc-column-two-auto-layout/)  
2. [CSS float浮动的深入研究、详解及拓展(一)](http://www.zhangxinxu.com/wordpress/2010/01/css-float%E6%B5%AE%E5%8A%A8%E7%9A%84%E6%B7%B1%E5%85%A5%E7%A0%94%E7%A9%B6%E3%80%81%E8%AF%A6%E8%A7%A3%E5%8F%8A%E6%8B%93%E5%B1%95%E4%B8%80/)

