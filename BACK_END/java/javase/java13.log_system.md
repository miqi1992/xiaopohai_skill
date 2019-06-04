# Java日志详解  

## 一、日志框架和日志系统  
&emsp;&emsp;随着项目越来越复杂，谁也不能保证自己的项目在运行过程中不出现错误，出现错误不可怕，问题是要及时的排除错误，让项目更加健壮并继续运行。排除这些错误就需要获取错误信息，信息从哪里来呢？一个设计良好的项目，肯定记录了项目运行的日志。更重要的是，它还能完成跟踪调试、程序状态记录、奔溃数据恢复等工作。那么我们怎样来设计这个日志类呢？  
&emsp;&emsp;在java的世界里，日志类是一般不需要考虑和设计的，因为存在很多优秀的日志系统，比如常见的Log4j和Logback。  
&emsp;&emsp;但是日志系统多了，也不是什么好事！因为在java EE的项目中，我们会引入很多的第三方包，比如Spring、Mybatis、Httpclient等等。。。每个第三方包都会有自己的日志系统，问题就来了，如果日志系统不兼容甚至产生冲突，灾难就产生了？或者是不同的日志系统打印日志的规则不同，接口也不同，那使用方就要做各种适配。。。

日志框架解决了这些问题！！！

<span style="color: red; font-style: bold; font-size:20px;">日志系统：  </span>日志的具体实现。经典的有log4j;jdk自带的有java.util.Logging; 还有log4j作者推出的被高度评价的logBack等等；  
<span style="color: red; font-style: bold;font-size: 20px;">日志框架： </span>如果只存在一种日志系统，日志框架完全没有必要存在（logBack无法独立使用），但事与愿违。为了解决多个日志系统的兼容问题，日志框架应运而生。主流的日志框架有commons-logging和sl4j；  

commons-logging是apache推出的日志框架，commons-logging<span style="color:red">只是规定了日志的接口规范</span>，其设计原理类似于jdk中servlet和jdbc的设计。  

&emsp;&emsp;主流的日志系统都实现了commons-logging定义的接口，这样就看通过commons-logging统一的使用的日志，而不用关系具体使用的是哪种日志系统。

## 日志框架

1、Commons-logging：common-logging是apache提供的一个通用的日志接口。用户可以自由选择第三方的日志组件作为具体实现，像log4j，或者jdk自带的logging，common-logging会通过动态查找的机制，在程序运行时自动找出真正使用的日志库。  
Commons-logging+log4j 是经典的一个日志实现方案。出现在各种框架里。如spring 、webx 、ibatis 等等。一般为了避免直接依赖具体的日志实现，一般都是结合commons-logging 来实现。常见代码如下：  
``` java
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

private static Log logger = LogFactory.getLog(XXX.class);
```

2. sl4j：slf4j全称为Simple Logging Facade for JAVA，java简单日志门面。类似于Apache Common-Logging，是对不同日志框架提供的一个门面封装，可以在部署的时候不修改任何配置即可接入一种日志实现方案。但是，他在编译时静态绑定真正的Log库。使用SLF4J时，如果你需要使用某一种日志实现，那么你必须选择正确的SLF4J的jar包的集合。  

3.  logback+sl4j也是经典的一个日志实现方案。Logback作为一个通用可靠、快速灵活的日志框架，将作为Log4j 的替代和SLF4J 组成新的日志系统的完整实现。Logback必须配合sl4j使用。由于logback和sl4j是同一个作者，其兼容性不言而喻。但sl4j面临与其他日志框架和日志系统的兼容性问题。常见代码如下： 
``` java
import org.slf4j.Logger;  
import org.slf4j.LoggerFactory;  
  
public class A {  
    private static Log logger = LogFactory.getLog(this.getClass());  
} 
```