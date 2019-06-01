# Java泛型详解  

> 一直对泛型不太理解，最近正好好好研究一下泛型的基本概念。  

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

