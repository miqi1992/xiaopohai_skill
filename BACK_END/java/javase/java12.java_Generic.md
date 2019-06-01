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

### 6.PECS原则  
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

对于是那个面的flist, Java编译器不允许我们add任何对象，为什么呢？对于这个问题我们不妨从编译器的角度去考虑。因为List<? extends Fruit> flist它自身可以有多重含义：  
``` java
List<? extends Fruit> flist = new ArrayList<Fruit>();
List<? extends Fruit> flist = new ArrayList<Apple>();
List<? extends Fruit> flist = new ArrayList<Orange>();
```

当我们尝试add一个Apple的时候，flist可能指向new ArrayList<Orange>();
当我们尝试add一个Orange的时候，flist可能指向new ArrayList<Apple>();
当我们尝试add一个Fruit的时候，这个Fruit可以使任何类型的Fruit，而flist可能指向某种特定类型的Fruit，编译器无法识别可能会报错。  

**所以对于实现了<? extends T>的集合类只能将它实现为Producer向外提供(get)元素，而不能作为Consumer来对外获取(add)元素**

如果我们要add元素应该怎么做呢？可以使用<? super T>:  
``` java
public class GenericWriting {
    static List<Apple> apples = new ArrayList<Apple>();
    static List<Fruit> fruit = new ArrayList<Fruit>();
    static <T> void writeExact(List<T> list, T item) {
        list.add(item);
    }
    static void f1() {
        writeExact(apples, new Apple());
        writeExact(fruit, new Apple());
    }
    static <T> void writeWithWildcard(List<? super T> list, T item) {
        list.add(item);
    }
    static void f2() {
        writeWithWildcard(apples, new Apple());
        writeWithWildcard(fruit, new Apple());
    }
    public static void main(String[] args) {
        f1(); f2();
    }
}
```
这样我们可以往容器里面添加元素了，但是使用super后不能从容器里面get元素，从编译器的角度考虑这个问题，对于List<? super Apple> list,它可以有下面几种含义：  
``` java
List<? super Apple> list = new ArrayList<Apple>();
List<? super Apple> list = new ArrayList<Fruit>();
List<? super Apple> list = new ArrayList<Object>();
```

所以对于实现了<? super T>的集合类只能将它视为Consuer消费(add)元素，而不能作为Producer对外获取(get)元素。  
在Java集合类中，我们可以发现通常会将两者结合起来一起用，比如像下面这样：  
``` java
public class Collections {
    public static <T> void copy(List<? super T> dest, List<? extends T> src) {
        for (int i=0; i<src.size(); i++)
            dest.set(i, src.get(i));
    }
}
```


### 7.类型擦除

类型擦除就是说Java泛型只能用于在编译期间的静态类型检查，然后编译器生成的代码会擦除响应的类型信息，这样到了运行期间实际上JVM根本就知道泛型所代表的具体类型。这样做的目的是因为Java泛型是1.5之后才引入的，为了保持向下的兼容性，所以只能作类型擦除类来兼容以前的非泛型代码。  

泛型擦除到底是什么，开看一个简单的例子：  
``` java
public class Node<T> {
    private T data;
    private Node<T> next;
    public Node(T data, Node<T> next) {
        this.data = data;
        this.next = next;
    }
    public T getData() { return data; }
    // ...
}
```

编译器做完相应的类型检查之后，实际上到了运行期间上面这段代码实际上将转换成：  
``` java
public class Node {
    private Object data;
    private Node next;
    public Node(Object data, Node next) {
        this.data = data;
        this.next = next;
    }
    public Object getData() { return data; }
    // ...
}
```

这意味着不管我们声明Node<String>还是Node<Integer>，到了运行期间，JVM统统视为Node<Object>。有没有什么办法可以解决这个问题呢？这就需要我们自己重新设置bounds了，将上面的代码修改成下面这样：  
``` java
public class Node<T extends Comparable<T>> {
    private T data;
    private Node<T> next;
    public Node(T data, Node<T> next) {
        this.data = data;
        this.next = next;
    }
    public T getData() { return data; }
    // ...
}
```

这样编译器就会将T出现的地方替换成Comparable而不再是默认的Object了：  
``` java
public class Node {
    private Comparable data;
    private Node next;
    public Node(Comparable data, Node next) {
        this.data = data;
        this.next = next;
    }
    public Comparable getData() { return data; }
    // ...
}
```

### 8.泛型使用的几个限制  
Java泛型由于类型擦除的存在，会存在一些使用限制：  
**1. Java泛型不能使用基本类型**
使用基本类型的泛型会编译出错，代码如下：  
``` java
List<int> list = new List<int>();// 编译前类型检查报错
```

**2. Java泛型不运行进行直接实例化**  
错误代码如下：  
``` java
<T> void test(T t){
    t = new T();//编译前类型检查报错
}
```

实例化的两种方法：  
1. 通过集合来保存泛型对应的实例  
``` java
public class DbHelper {
    private static final DbHelper instance;

    static {
        instance = new DbHelper();
    }

    private DbHelper() {
    }

    private Map<Class<?>, ChangedListener> changedListeners = new HashMap<>();

    public <Model extends BaseModel> ChangedListener getListener(Class<Model> modelClass) {
        if (changedListeners.containsKey(modelClass)) {
            return changedListeners.get(modelClass);
        }
        return null;
    }

    public <Model extends BaseModel> void addChangedListener(final Class<Model> tClass,
                                                             ChangedListener<Model> listener) {
        ChangedListener changedListener = getListener(tClass);
        // 添加到中的Map
        changedListeners.put(tClass, changedListener);
    }

    public interface ChangedListener<Data extends BaseModel> {
        void onDataSave(Data... list);

        void onDataDelete(Data... list);
    }
}
```

2. 通过反射来实例化泛型类型  
``` java
public class GenericInstance {
    public static <T> T createModelInstance(Class<T> tClass) {
        try {
            // 获取直接父类的类型Type
            Type superClass = tClass.getGenericSuperclass();
            // 调用getActualTypeArguments()方法获得实际绑定的类型
            Type type = ((ParameterizedType) superClass).getActualTypeArguments()[0];
            Class<?> clazz = getRawType(type);
            return (T) clazz.newInstance();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    // type不能直接实例化对象，通过type获取class的类型，然后实例化对象
    private static Class<?> getRawType(Type type) {
        if (type instanceof Class) {
            return (Class) type;
        } else if (type instanceof ParameterizedType) {
            ParameterizedType parameterizedType = (ParameterizedType) type;
            Type rawType = parameterizedType.getRawType();
            return (Class) rawType;
        } else if (type instanceof GenericArrayType) {
            Type componentType = ((GenericArrayType) type).getGenericComponentType();
            return Array.newInstance(getRawType(componentType), 0).getClass();
        } else if (type instanceof TypeVariable) {
            return Object.class;
        } else if (type instanceof WildcardType) {
            return getRawType(((WildcardType) type).getUpperBounds()[0]);
        } else {
            String className = type == null ? "null" : type.getClass().getName();
            throw new IllegalArgumentException("Expected a Class, ParameterizedType, or GenericArrayType, but <"
                    + type + "> is of type " + className);
        }
    }
}
```
**为了防止此类型转换错误的发生，Java禁止进行泛型实例化**

3. Java泛型不运行进行静态化  
参考下面的代码：  
``` java
class StaticGeneric<T>{
    private static T t;// 编译前类型检查报错

    public static T getT() {// 编译前类型检查报错
        return t;
    }
}
```

静态变量在类中共享，而泛型类型是不确定的，因此编译器无法确定要使用的类型，所以不运行进行静态化。  

4. Java泛型不允许直接进行类型转换(通配符可以)  
```java 
List<Integer> integerList = new ArrayList<Integer>();
List<Double> doubleList = new ArrayList<Double>();
//不能直接进行类型转换，类型检查报错
integerList = doubleList;
```
虽然在编译期间integerList与doubleList都会经过类型擦除，但是这种类型转换违反了Java泛型降低类型转换安全隐患的设计初衷。当integerList中存储Interge元素，而doubleList中存储Double元素时，如果不限制类型转换，很容易产生ClassCastException异常。  
但是通配符可以实现。  
``` java
<!--List<Integer> integerList = new ArrayList<Integer>();-->
<!--List<Double> doubleList = new ArrayList<Double>();-->
<!--//通过通配符进行类型转换-->
<!--doubleList = integerList;-->
static void cast(List<?> orgin, List<?> dest){
    dest = orgin;
}
```

5. Java泛型不允许直接使用instanceof运算符进行运行时类型检查(通配符可以)  
直接使用instanceof运算符进行运行时类型检查：  
``` java
List<String> stringList = new ArrayList<String >();
//不能直接使用instanceof，类型检查报错
System.out.println(stringList instanceof ArrayList<Double>);
```
因为Java编译器在生成代码的时候会擦除所有相关泛型的类型信息，正如我们上面验证过的JVM在运行时期无法识别出ArrayList<Integer>和ArrayList<String>的之间的区别。
而我们可以通过通配符的方式进行instanceof运行期检查：  
``` java
// 这个时候的类型检查没有意义
System.out.println(stringList instanceof ArrayList<?>);
```

6. Java类型不允许创建确切类型的泛型数据(通配符可以)  
创建整型泛型数据如下：  
``` java
//类型检查错误
List<Integer>[] list = new ArrayList<Integer>[2];
```

可以通过通配符创建：  
``` java
Generic<?>[] generics = new Generic<?>[2];
generics[0] = new Generic<Integer>(123);
generics[1] = new Generic<String>("hello");
for (Generic<?> generic : generics) {
    System.out.println(generic.get());
}
```

结果会正常打印出123和"hello"  

7. Java泛型不允许作为参数进行重载  
例如：  
``` java
public class GenericTest<T>{
    void test(List<Integer> list){}
    //不允许作为参数列表进行重载
    void test(List<Double> list){}
}
```

原因是：类型擦除后两个方法时一样的参数列表，无法重载。  

## 参考
1. [http://www.importnew.com/24029.html](http://www.importnew.com/24029.html)  
2. [https://blog.csdn.net/s10461/article/details/53941091](https://blog.csdn.net/s10461/article/details/53941091)  
3. [https://blog.csdn.net/unicorn97/article/details/81813712](https://blog.csdn.net/unicorn97/article/details/81813712)  
4. [https://blog.csdn.net/hanchao5272/article/details/79317213](https://blog.csdn.net/hanchao5272/article/details/79317213)  
5. [https://docs.oracle.com/javase/tutorial/extra/generics/intro.html](https://docs.oracle.com/javase/tutorial/extra/generics/intro.html)