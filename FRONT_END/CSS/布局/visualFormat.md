# CSS视觉格式化

&emsp;&emsp;CSS视觉格式化这个词可能比较陌生，但说起盒模型可能就恍然大悟了。实际上，盒模型只是CSS视觉格式化的一部分。视觉格式化分为块级和行内两种处理方式。理解视觉格式化，可以确定得到的效果应该显示的正确效果，还是浏览器兼容性的bug。下面将详细介绍CSS视觉格式化。  

## 术语解释
&emsp;&emsp;了解CSS视觉格式化之前首先要了解一些基本术语。而下面的术语中，最重要的就是基本框和包含块【基本框】  
&emsp;&emsp;CSS假定每个元素都会生成一个或多个矩形框，这称为元素框。各元素框中心有一个内容区(content area)。这个内容区周围有可选的内边距、边框和外边距。之可以可选。是因为他们的宽度都可以设置为0.   
&emsp;&emsp;可以用多种属性设置外边距、边框和内边距。内容的背景也会应用到内边距。外边距通常是透明的，从中可以看到父元素的背景。内边距不能是负值，但是外边距可以。  
![CSS布局基本框](http://p72a7fll6.bkt.clouddn.com/image/CSS_layout_basicBox.png)  
&emsp;&emsp;对于不同类型的元素格式化时存在着差别。块级元素的处理不同于行内元素，而浮动元素和定位元素分别有着不同的表现。   

【包含块】  
&emsp;&emsp;每个元素相对于其包含块摆放，包含块就是一个元素的布局上下文。对于正常的文本流中的一个元素而言，包含块由最近的块级祖先框、表单元格或行内祖先框的内容边界组成。  

> 行内元素的摆放方式并不直接依赖于包含块

【其它术语】

+ 正常流  
&emsp;&emsp;文本从左向右、从上向下显示，是传统HTML文档的文本布局。  
+ 非替换元素  
&emsp;&emsp;如果元素的内容包含在文档中，则称之为非替换元素。  
+ 替换元素  
&emsp;&emsp;指作为其它内容占位符的一个元素(&lt;img&gt;、&lt;video&gt;、&lt;audio&gt;等)。但，inline-block元素在布局中也当做替换元素处理。所以，又包含大量的表单元素及表格元素。
+ 块级元素  
&emsp;&emsp;在正常流中，在其元素框之前和之后生成"换行符",且会垂直摆放的元素。通过声明display:block可以让元素生成块级框。  
+ 行内元素
&emsp;&emsp;在正常流中，不会在元素框之前或之后生成"行分隔符"，是块级元素的后代。同声明display:inline可以让元素生成行内框。  
+ 根元素 
&emsp;&emsp;位于文档树顶端的元素，在HTML文档中，是元素HTML。


## 盒模型
盒模型又叫框模型，由宽高、内边距、边框和外边距组成

![盒模型](http://p72a7fll6.bkt.clouddn.com/image/CSS_layout_boxModel.png)  

【四个盒子】  
&emsp;&emsp;关于盒模型，首先要确定四个盒子的概念。  

1、 元素框是指margin box  
&emsp;&emsp;元素框：width/height + padding + border + margin

2、 可视区域是指border box

> 关于可视区域，一直都有两个争论，一个指border box，另一个指padding box。但从字面去理解，可视区域应该就是指可以看到的区域，应该以border box为准

&emsp;&emsp;可视区域： width/height + padding + border  

3、 客户区(client)是指padding box

>  关于客户区这种谁发来源于javascript中的clientWidth和clientHeight

客户区： width/height + padding

4、 内容区是指content box(width和height组成)  

对于水平和垂直布局，有着不同的效果，下面以水平格式化和垂直格式化分别介绍。

### 水平格式化。  
&emsp;&emsp;水平格式化的规则就是正常就中的块级元素框的水平总和等于父元素的width

![水平格式化](http://p72a7fll6.bkt.clouddn.com/image/CSS_layout_horizontalFormate.jpg)

&emsp;&emsp;水平格式化的7大属性是margin-left、border-left、padding-left、width、padding-right、border-right、margin-right。7个属性的值加在一起就是元素包含块的宽度，这就是快元素的父元素的width值(因为块级元素的父级元素几乎都是块级元素)  

#### auto
&emsp;&emsp;视觉格式化中比较重要的一个概念就是auto。auto值是用来弥补实际值与所需总和的差距。  
&emsp;&emsp;在水平格式化的7个属性中只有margin-left、width、margin-right三个属性可以设置为auto，其余属性必须设置为特定的值，或者默认宽度为0

![水平格式化auto布局](http://p72a7fll6.bkt.clouddn.com/image/CSS_layout_horizontalAuto.jpg)  

1、1个auto  
&emsp;&emsp;若只有一个值为auto，则根据7个水平属性的总结等于父级width的公式，计算出auto表示的值。  
&emsp;&emsp;由于只有width默认值为auto，而margin、border和padding默认值都为0，所，会有块级元素默认撑满父元素的表现。  

2、2个auto  
&emsp;&emsp;若margin-left和margin-right为auto，则元素将在父元素中居中显示  
&emsp;&emsp;若margin-left和width为auto，则margin-left将被重置为0  
&emsp;&emsp;若margin-right和width为auto，则margin-right将被重置为0  

3、3个auto  
&emsp;&emsp;若三个值都为auto,则margin-left和margin-right都被重置为0

4、0个auto  
&emsp;&emsp;若margin-left/width/margin-right三个属性都设置为非auto的某个值，这种情况叫做格式化属性过分受限。这样margin-right将被重置为auto  
&emsp;&emsp;  关于auto的演示  

<iframe style="width: 100%; height: 300px;" src="https://demo.xiaohuochai.site/css/context/c1.html" frameborder="0" width="320" height="240"></iframe>


#### 替换元素  
&emsp;&emsp;上面介绍的是正常文本流中非替换块级元素的水平格式化，而替换块级元素管理起来则更简单一些，非替换块元素的所有规则同样适用于替换块元素，只有一个例外：如果width是auto，元素的宽度则是内容的宽度。  

&emsp;&emsp;下面以图片为例子来说明块级替换元素，但由于图片是行内替换元素，所以需要将display设置为block  

&emsp;&emsp;如果一个替换元素的width不同于其固有宽度，那么height值也会成比例变化，除非height显示设置一个特定值，反过来也一样。  

<iframe style="width: 100%; height: 300px;" src="https://demo.xiaohuochai.site/css/context/c2.html" frameborder="0" width="320" height="240"></iframe>  

### 垂直格式化  

![垂直格式化](http://p72a7fll6.bkt.clouddn.com/image/CSS_layout_verticalFormate.jpg)  
&emsp;&emsp;一个元素的默认高度由其内容决定，高度还会受内容宽度的影响，段落越窄，相应地就会越高，以便容纳其中所有的内联内容  
&emsp;&emsp;在CSS中，可以对任何块级元素设置显式高度。如果指定高度大于显示内容所需高度，多余的高度会产生一个视觉效果，就好像有额外的内边距一样；如果指定高度小于显示内容所需高度，则会向元素添加一个滚动条。如果元素内容的高度大于元素框的高度，浏览器的具体行为取决于overflow属性  
&emsp;&emsp;与水平格式化的情况类似，垂直格式化也有7个相关属性：margin-top/border-top/padding-top/height/padding-bottom/border-bottom/margin-bottom  
&emsp;&emsp;垂直格式化7大属性的和必须等于元素包含块的height

#### auto
&emsp;&emsp;在垂直格式化的7个属性中，只有margin-top、height、margin-bottom三个属性可以设置为auto  
&emsp;&emsp;与水平格式化不同，垂直格式化的auto处理较为简单。如果块级正常流元素设置为height:auto，显示时其高度将恰好足以包含其内联内容的行盒；如果margin-top或margin-bottom设置为auto，它会自动计算为0  

> 对于定位元素的上下外边距的auto处理，则有所不同  

### 行布局
&emsp;&emsp;行内元素没有块级元素那么简单和直接，块级元素只是生成框，通常不允许其他内容与这些框并存  

&emsp;&emsp;在了解行内元素视觉格式化之前要先了解一些涉及到的基本术语

【术语】  
1、匿名文本  
&emsp;&emsp;匿名文本(anonymous text)是指所有未包含在行内元素中的字符串  

2、em框  
&emsp;&emsp;em框在字体中定义，也称为字符框(character box)。实际的字形可能比其em框更高或更矮。在CSS中，font-size的值确定了各个em框的高度  

3、内容区  
&emsp;&emsp;在非替换元素中，内容区是元素中各字符的em框串在一起构成的框；而在替换元素中，内容区就是元素的固有高度再加上可能有的外边距、边框或内边距。内容区类似于一个块级元素的内容框(content box)  

4、行间距  
&emsp;&emsp;行间距(leading)是font-size和line-height之差。这个差实际上要分为两半，分别应用到内容区的顶部和底部

> 行间距只应用到非替换元素

5、行内框  
&emsp;&emsp;行间距(leading)是font-size和line-height之差。这个差实际上要分为两半，分别应用到内容区的顶部和底部  

> 行内框的区域与内联元素背景颜色所在的区域无关

6、行框  
&emsp;&emsp;行框是包含该行中出现的行内框的最高点和最低点的最小框。换句话说，行框的上边界要位于最高行内框的上边界；而行框的底边要放在最低行内框的下边界  

【构造行框】  
行框构造是行布局中非常重要的一个环节，接下来介绍行框构造的步骤  

1、构造各元素的行内框  
a、对于替换元素来说，得到各元素的height、margin-top、margin-bottom、padding-top、padding-bottom、border-top-width、border-bottom-width值，把她们