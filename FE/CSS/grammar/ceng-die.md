# CSS层叠
&emsp;&emsp;层叠样式表CSS最基本的一个特性就是层叠。冲突的声明通过层叠进行排序，由此最终确定最终的文档表示。而这个过程的核心就是选择器即其相关声明的特殊性、重要性、来源及继承机制。本文将详细介绍CSS层叠。  

### 特殊性
&emsp;&emsp;选择器的特殊性由选择器本身的组件确定。特殊性值表述为4个部分(如：0,0,0,0)
    1. 内联样式 -> 1,0,0,0
    2. ID属性值 -> 0,1,0,0
    3. 类属性值、属性选择器或伪类 -> 0,0,1,0
    4. 元素或伪元素 -> 0,0,0,1
    5. 结合符与通配选择器 -> 0,0,0,0

&emsp;&emsp;特殊性的值是从左到右排序的，特殊性值1,0,0,0大于以0开头的所有者，而无论后面是什么数。在一种规则中，特殊性最高的规则胜出。  
```
h1{} -> 0,0,0,1
p em{} -> 0,0,0,2
.grape{} -> 0,0,1,0
*.bright{} -> 0,0,1,0
p.bright em.dark{} -> 0,0,2,2
#id121{} -> 0,1,0,0
div#side *[href]{} -> 0,1,1,1
```

### 重要性
&emsp;&emsp;有时某个声明可能非常重要，超过了其它声明，CSS2.1称之为重要声明。重要声明在声明的结束分号之前插入!import来标志，如果!import放在声明的任何其他位置，整个声明豆浆无效。  
>如果一个声明是重要声明，则超过所有的非重要声明。  

### 继承
&emsp;&emsp;继承是从一个元素向后代元素传递属性值所采用的机制。基于继承机制，样式不仅可应用到指定元素，还会应用到它的后代元素。  
&emsp;&emsp;在两个比较特殊的情况需要注意：一个是在HTML中，应用到body元素的背景样式可以传递到html元素；另一个是&lt;a&gt;标签不会继承父元素的文本样式。  
>继承的属性没有特殊性。

### 来源
&emsp;&emsp;CSS按来源的不同分为3类：author(作者)、user(用户)、user agent(代理)  
1. author(作者)：来自文档的样式文件。我们平常所写的样式基本上都是这一类的  
2. user(用户)：用户指定的自定义的样式文件。一些UA允许用户导入自定义的样式文件  
3. user agent(代理)：一些UA(如：浏览器)要为某些元素预设一个默认的样式，以方便阅读。

关于用户CSS因为不常见，可能一些朋友不太理解。IE可以通过`Internet 选项 -> 外观 -> 辅助功能 -> 用户样式表`来指定样式文件。Chrome可以使用`Stylish`扩展来实现

## 层叠
&emsp;&emsp;CSS层叠样式表的层叠特性就是让样式表层叠在一起，通过特殊性、重要性、来源以及继承机制来排列层叠样式的顺序及选出胜出者。  

1. 首先，按照来源及重要性排序。在不考虑重要性的前提下，优先级顺序为：author(作者)->user(用户)->user agent(代理)。但是，如果考虑重要性，则user(用户)的优先级大于author(作者)的优先级，这样就是试图平衡author(作者)和用户(用户)。所以，最终的优先级排序为:user(用户) !import > author(作者) !import > author > user > user agent  
2. 接着，对于非重要声明来说，按照特殊性排序。特殊性越高的规则，权重越大。  
3. 最后，如果特殊性相同，则按照出现顺序排序。声明在样式表或文档中越靠后出现，权重越大。如果样式表中通过@import导入的样式表，一般认为出现在导入样式表中的声明在前，主样式表的声明在后。  