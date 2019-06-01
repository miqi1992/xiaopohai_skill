# Java泛型详解  

> 一直对泛型不太理解，最近正好好好研究一下泛型的基本概念。  
> 泛型： 针对之前类型Object的引用实现任意化的同时，引用泛型可以在IDE阶段和代码编译阶段对类型进行检查；保证在类型任意化的同时，类型转换的安全，实现类型的自动强制转换，提高代码的重用率。  

## 什么是泛型  
Java在1.5之后加入了泛型的概念。泛型，即“参数化类型”。泛型的本质是为了参数化类型（在不创建新的类型的情况下，通过泛型指定的不同类型来控制形参具体限制的类型）。也就是说在泛型使用过程中，操作的数据类型被指定为一个参数，这种参数类型可以用在类、接口和方法中，分别被称为泛型类、泛型接口、泛型方法。

**举个例子**
``` java
List arrayList = new ArrayList();
arrayList.add("aaaa");
arrayList.add(100);

for(int i = 0; i< arrayList.size(); i++){
    String item = (String)arrayList.get(i);
    System.out.println("泛型测试，item = " + item);
}
```

毫无疑问，程序运行会以崩溃结束：  
``` java
Exception in thread "main" java.lang.ClassCastException: java.lang.Integer cannot be cast to java.lang.String
    at Test.main(GenericTest.java:17)
```

ArrayList可以存放任意类型，例子中添加了一个String类型，添加了一个Integer类型，再使用时都以String的方式使用，因此程序崩溃了。为了解决类似这样的问题（在编译阶段就可以解决），泛型应运而生。  


将之前第一行声明list的代码修改一下，编译器就会在编译阶段帮我们提前发现类似的问题。  

``` java
List<String> arrayList = new ArrayList<String>();
...
//arrayList.add(100); 在编译阶段，编译器就会报错
```

如上面所说泛型只在代码编译阶段有效，来看下面的代码：  

``` java
List<String> stringArrayList = new ArrayList<String>();
List<Integer> integerArrayList = new ArrayList<Integer>();

Class classStringArrayList = stringArrayList.getClass();
Class classIntegerArrayList = integerArrayList.getClass();

if(classStringArrayList.equals(classIntegerArrayList)){
     System.out.println("泛型测试,类型相同");
}

```

我们发现对于编译器来说，stringArrayList和integerArrayList其实是同一类型的对象，这是因为代码在编译之后采取了类似于去泛型化得措施，也就是泛型的类型擦除，这个概念后面会介绍。  

## Java为什么要设计泛型  
在Java SE 1.5之前，没有泛型的情况下，通过对类型Object的引用来实现参数的"任意化"，"任意化"带来的缺点是要做显示的强制类型转换，而这种转化是要求开发者对实际参数类型可以预知的情况下进行的。对于将至类型转换错误的情况，编译器可能不提示错误，在运行的时候才会显示错误，这是一个安全隐患。  

泛型的好处：使用泛型，首先可以通过IDE进行代码类型初步检查，然后在编译阶段进行编译类型的检查，以保证类型转换的安全性；并且素有的强制转换都是自动和隐式的，可以提高代码的重用率。  


## 泛型基础
Java泛型有三种使用方式：泛型类、泛型方法、泛型接口  

### 1. 泛型类
泛型类的语法如下：  
``` java
class 类名称<泛型类型标识>{}
```

我们首先定义一个简单的类：  
``` java
public class Generic {
    private String object;
    public void set(String object) {
        this.object = object;
    }
    public String get() {
        return object;
    }
}
```

这是一个常见的Java bean，这样做的一个坏处是Box里面现在只能装入String类型的元素，今后如果我们需要装入Integer等其他类型的元素，还需要另外重写一个类型是Integer的Box类，代码得不到复用。  

**然后通过泛型类可以很好的解决复用的问题**  
``` java
public class Generic<T> {
    private T t;
    public void set(T t) {
        this.t = t;
    }
    public T get() {
        return t;
    }
}
```

这样的Box类就可以装入任何话我们想要的类型：  
``` java
Generic<Integer> integerGeneric = new Generic<Integer>();
Generic<Double> doubleGeneric = new Generic<Double>();
Generic<String> stringGeneric = new Generic<String>();
```

### 2. 泛型方法  
泛型方法的语法如下：  
``` java
[作用域修饰符]<泛型类型标识>[返回类型] 方法名称(参数列表){}
```
按照这个语法声明一个泛型方法很简单，只要在返回类型前面加上一个类似<K,V..>的形式就行了：  

``` java

public class Util {
    public static<K,V> boolean compare(Gneric<K,V> g1, Generic<K,V>){
        return g1.getKey().equals(g2.getKey()) && g1.getValue.equals(g2.getValue());
    }
}

public class Generic<K, V> {
    private K key;
    private V value;
    public Generic(K key, V value) {
        this.key = key;
        this.value = value;
    }
    public void setKey(K key){this.key = key};
    public void setValue(V value) {this.value = value};
    public K getKey(){return key;}
    public V getValue() {return value;}
}
```

Util.compare()就是一个泛型方法，于是我们可以像下面这样调用泛型：  
``` java
Generic<Integer, String> g1 = new Generic<>(1, "apple");
Generic<Integer, String> g2 = new Generic<>(2, "pear");
boolean same = Util.<Integer, String>compare(g1, g2);
```


在Java1.7之后，编译器可以通过type inference（类型推导），根据实参的类型自动推导出相应参数的类型，可以缩写成这样：  
``` java
Generic<Integer, String> p1 = new Generic<>(1, "apple");
Generic<Integer, String> p2 = new Generic<>(2, "pear");
boolean same = Util.compare(p1, p2);
```


### 3. 泛型接口  

泛型接口的定义域泛型类的定义很相似。  
``` java
public interface Generator<T> {
    public T next();
}
```

**当实现泛型接口的类，未给泛型传入实参时**:  
``` java
class FruitGenerator<T> implements Generator<T>{
    @Override
    public T next() {
        return null;
    }
}
```

未传入泛型实参时，与泛型类的定义相同，在声明类的时候，需将泛型的声明也一起加到类中。即：class FruitGenerator<T> implements。我们可以为T传入任意一种实参，形成无数种类型的Generator接口。  

如果不声明泛型，如：class FruitGenerator implements Generator<T>，编译器会报错："Unknown class"。  

**当实现泛型接口的类，给泛型传入了实参时：**  
``` java
public class FruitGenerator implements Generator<String> {

    private String[] fruits = new String[]{"Apple", "Banana", "Pear"};

    @Override
    public String next() {
        Random rand = new Random();
        return fruits[rand.nextInt(3)];
    }
}
```

如果类已经将泛型类型传入实参类型，则所有使用泛型的地方都要替换成传入的实参类型。即：Generator<T>，public T next();中的的T都要替换成传入的String类型。  

#### 4. 通配符  
介绍通配符之前，我们先思考一个场景：  
我们知道Ingeter是Number的一个子类，由于泛型擦除的存在，对于编译器来说Generic<Ingeter>与Generic<Number>实际上是同一种基本类型。那么问题来了，在使用Generic<Number>作为形参的方法中，能否使用Generic<Ingeter>的实例传入呢？在逻辑上类似于Generic<Number>和Generic<Ingeter>是否可以看成是父子关系呢？  
为了弄清楚这个问题，我们定义一个方法：  

``` java
public void showKeyValue(Generic<Number> obj){
    System.out.println("泛型测试,value is " + obj.get());
}
```

如果我们像下面这样使用该方法：  
``` java
Generic<Number> gNumber = new Generic<Number>(456);
Generic<Integer> gInteger = new Generic<Integer>(123);

showKeyValue(gInteger);
```

当我们调用该方法时，编译器会提示我们：  
``` java
Generic<java.lang.Integer> cannot be applied to Generic<java.lang.Number>
showKeyValue(gInteger);
```

通过提示信息我们可以看到Generic<Integer>不能被看作为Generic<Number>的子类。  
**由此可以看出:同一种泛型可以对应多个版本（因为参数类型是不确定的），而不同版本的泛型类实例之间是不兼容的**  

由此会产生一个问题，如果我们想对Generic<Integer>类型使用showKeyValue方法，我们就必须重新定义一个新的方法，这显然与Java的多态理念相违背。因此我们需要一个在逻辑上可以表示同时是Generic<Integer>和Generic<Number>父类的引用类型，通配符应运而生。

我们可以将上面的方法改一下：  
``` java
public void showKeyValue(Generic<?> obj){
    System.out.println("泛型测试,value is " + obj.get());
}
```

此时，showKeyValue方法可以传入任意类型的Generic参数，这是一个无界的通配符。  

### 5. 泛型上下边界  
在使用Java泛型定义时：  
用<T>等大写字母标识泛型类型，用于表示未知类型。  
用<T extends ClassA & InterfaceB...>等标识有界泛型，用于表示有边界的类型。  
在Java泛型实例化时：  
用<?>标识通配符，用于表示实例化时的类型。  
用<? extends 父类型>标识上边界通配符，用于表示实例化时可以确定父类型的类型。  
用<? super 子类型>表示下边界通配符，用于表示实例化时可以确定子类型的类型。  
对上面的Generic类增加一个新方法：  
``` java
public void showKeyValue1(Generic<? extends Number> obj){
    System.out.println("泛型测试,value is " + obj.get());
}
```

``` java
Generic<String> generic1 = new Generic<String>("11111");
Generic<Integer> generic2 = new Generic<Integer>(2222);
Generic<Float> generic3 = new Generic<Float>(2.4f);
Generic<Double> generic4 = new Generic<Double>(2.56);

//这一行代码编译器会提示错误，因为String类型并不是Number类型的子类
showKeyValue1(generic1);

showKeyValue1(generic2);
showKeyValue1(generic3);
showKeyValue1(generic4);
```

如果把泛型类的定义也该一下：  
``` java
public class Generic<T extends Number>{
    private T key;

    public Generic(T key) {
        this.key = key;
    }

    public T getKey(){
        return key;
    }
}
```

``` java
//这一行代码也会报错，因为String不是Number的子类
Generic<String> generic1 = new Generic<String>("11111");
```

泛型的上下边界添加，必须和泛型的声明在一起。  

[通配符T和？的区别](https://blog.csdn.net/woshizisezise/article/details/79374460)   
[class<T>和class<?>区别](https://www.jianshu.com/p/95f349258afb)  

### PECS原则  
首先我们定义几个简单的类，下面我们将用到它：  
``` java
class Fruit {}
class Apple extends Fruit {}
class Orange extends Fruit {}
```

然后定义一个主类：  
``` java
public class Generics {
    public static void main(String[] args) {
        // 通过通配符申明一个List
        List<? extends Fruit> flist = new ArrayList<Apple>();
        // Compile Error: can't add any type of object:
        // flist.add(new Apple())
        // flist.add(new Orange())
        // flist.add(new Fruit())
        // flist.add(new Object())
        flist.add(null); // Legal but uninteresting
        // We Know that it returns at least Fruit:
        Fruit f = flist.get(0);
    }
}
```