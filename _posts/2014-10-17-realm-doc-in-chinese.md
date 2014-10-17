---
layout: post
title: Realm 中文文档
date: 2014-10-17
tag: android
---

[官方文档](http://realm.io/docs/java/)

## 开始
> 请注意目前我们不支持除 Android 以外的 Java 环境。

### 环境要求
* Android Studio (>=0.8.6)
* 较新的 Android SDK 版本
* JDK >=7

***我们支持 API 9 以上的 Android 版本**（Android 2.3 以上）。*

## 安装
你有两种安装方法可以选择：

#### Maven
1. 确定你的项目使用 jcenter 作为依赖仓库（最新版本的 Android Gradle 插件默认）
2. 将 `compile 'io.realm:realm-android:0.71.0'` 添加到你的项目依赖
3. 在 Android Studio 菜单中选择：Tools->Android->Sync Project with Gradle Files

#### 使用包
1. [下载](http://static.realm.io/downloads/java/latest)最新包并解压
2. 在 Android Studio 创建一个新的项目
3. 复制 `realm-版本.jar` 文件夹到 `app/libs`
4. 在 Android Studio 菜单中选择：Tools->Android->Sync Project with Gradle Files

### Realm 浏览器
> 目前仅支持 Mac OS X。Windows 和 Linux 版本正在开发中。

![](http://realm.io/assets/docs/browser.png)

我们提供一个独立的应用来读写 .realm 数据库。

你可以在[Cocoa release zip](http://static.realm.io/downloads/cocoa/latest)的`browser/`文件夹中找到

你可以在**Tools>Generate demo database**中生成一个用以测试的数据库。

### 实例
在根目录中我们提供了几个examples来帮助你熟悉运用 Realm。你只需要在 Android Studio 中导入运行即可。

`RelamIntroExample`包含了一个使用当前API的简单实例，在项目中你只能从Log中看到看到输出。

`RealmGridViewExample`是一个app，用来展示如何用Realm渲染GridView。

`RealmConcurrencyExample`是一个简单的app用以展示在多线程中使用Realm，

### 获得帮助
* 订阅[community newsletter](http://eepurl.com/VEKCn)定期获取使用Realm的一些技巧和教程。
* 我们也能通过你们在[google groups](https://groups.google.com/forum/#!forum/realm-java)的问题反馈来完善 Realm for Android。
* 除了google groups，我们还建议你通过[Github](https://github.com/realm/realm-java)提交问题。

## 模型
Realm 的数据模型通过实现类似传统 [Java Bean](https://zh.wikipedia.org/wiki/JavaBeans) 来定义。只需要继承 `RealmObject` 并让 Realm 的注解处理器生成代理类。

{% highlight java %}
public class User extends RealmObject {

    private String          name;
    private int             age;

    @Ignore
    private int             sessionId;

    // 你的 IDE 生成的标准 getter 和 setter…
    public String getName() { return name; }
    public void   setName(String name) { this.name = name; }
    public int    getAge() { return age; }
    public void   setAge(int age) { this.age = age; }
    public int    getSessionId() { return sessionId; }
    public void   setSessionId(int dontPersist) { this.sessionId = sessionId; }
}
{% endhighlight %}

注意，getter 和 setter 会被 RealmObject 内部所使用的自动生成的代理类所重载，因此你在 getter 和 setter 里自己写的逻辑都不会被执行。

RealmObject 强依赖于同一个 [Realm](#realms) 实例，所以一定要用 `realm.createObject()` 实例方法来从 Realm 中实例化它。

### 数据类型
Realm 支持这几种数据类型：`boolean`,`short`,`int`,`long`,`float`,`double`,`string`,`Date`和`byte[]`。再者，还能使用 `RealmObject` 的子类和 `RealmList<? extends RealmObject>` 来表示模型关系。

### 忽略属性
注解 `@Ignore` 表示字段不应被持久化到磁盘中。

### 搜索索引
注解 `@Index` 会为字段增加搜索索引。这会导致插入速度变慢，同时数据文件体积有所增加，但能加速查询。因此建议仅在需要加速查询时才添加索引。目前仅支持索引字符串属性（其它类型会在下个版本支持），且无法删除搜索索引。

## 写入
读取操作是隐式的，但所有的写入操作（增加、修改、移除对象）都必须包裹在写入事务中以确保线程安全：

{% highlight java %}
// 获得一个 Realm 实例
Realm realm = Realm.getInstance(this);

realm.beginTransaction();

//... 在这里执行增添或更新对象 ...

realm.commitTransaction();
{% endhighlight %}

数据对象需要通过Realm来实例化：

{% highlight java %}
// 获得一个Realm实例
Realm realm = Realm.getInstance(this);

realm.beginTransaction();
User user = realm.createObject(User.class); // 创建新对象
user.setName("John");
user.setEmail("john@corporation.com");
realm.commitTransaction();
{% endhighlight %}

请注意写入操作会互相阻塞，并且当存在其它进行中的写入时也会阻塞它们所在的线程。但得益于 Realm 的 MVCC 架构，当正在进行一个写入事务时读取操作并不会被阻塞！也就是说，除非你需要同时在许多线程里进行并发的写入，你应该尽量使用更大的写入事务来做更多的事情，而不是许多小粒度的写入事务。当你向 Realm 提交一个写入事务，将会通知该 Realm 的所有其它实例，同时让隐式的读取事务自动刷新你的 Realm 对象。

## 查询
> Realm 中的所有读取（包括查询）都是延迟执行的，且数据不会被拷贝。

Realm 的查询引擎使用 [Fluent 接口](https://en.wikipedia.org/wiki/Fluent_interface) 来构造多条件查询。

比如查找所有叫做 John 或 Peter 的用户，你可以这么写：
{% highlight java %}
// 构建查找所有用户的查询:
RealmQuery<User> query = realm.where(User.class);

// 添加查询条件:
query.equalTo("name", "John");
query.or().equalTo("name", "Peter");

// 执行查询:
RealmResults<User> result1 = query.findAll();

// 或者同时进行上述操作 (通过 "Fluent 接口"):
RealmResults<User> result2 = realm.where(User.class)
                                  .equalTo("name", "John")
                                  .or()
                                  .equalTo("name", "Peter")
                                  .findAll();
{% endhighlight %}

查询返回一个新的 `RealmResults`，包含名叫 John 和 Peter 的用户。对象并非拷贝，也就是说你得到的是一个所匹配对象的引用的列表，你对所匹配的对象所有的操作都是直接施加于它的原始对象。

### 条件
Realm 支持以下查询条件：

* `greaterThan()`,`lessThan()`,`greateThanOrEqualTo()` 和 `lessThanOrEqualTo()`
* `equalTo()` 和 `notEqualTo()`
* `contains()`,`beiginsWith()` 和 `endsWith()`

并非所有条件都适用于所有数据类型，具体请看 [RealmQuery API](http://realm.io/docs/java/0.71.0/api/io/realm/RealmQuery.html)。

### 逻辑操作
每个查询条件都会被被隐式地被“`逻辑和(&)`”组合在一起，而“`逻辑或(or)`”需要显式地去执行`or()`。

你也可以将查询条件组合在一起，使用`beginGroup()`（相当于左括号）和`endGroup()`（相当于右括号）：

{% highlight java %}
RealmResults<User> r = realm.where(User.class)
	                        .greaterThan("age", 10)  //隐式的逻辑和（&）
	                        .beginGroup()
	                        	.equalTo("name", "Peter")
	                            .or()
	                            .contains("name", "Jo")
	                        .endGroup()
	                        .findAll();
{% endhighlight %}

### 排序
当你执行完查询获得结果后，可以对它进行排序：

{% highlight java %}
RealmResults<User> result = realm.where(User.class).findAll();
RealmResults<User> sortedAscending  = result.sort("age");
RealmResults<User> sortedDescending = result.sort("age", RealmResults.SORT_ORDER_DECENDING);
{% endhighlight %}

### 链式查询
你也可以直接在查询后进行分类筛选：

{% highlight java %}
RealmResults<User> teenagers = Realm.where(User.class).between("age", 13, 20).findAll();
RealmResults<User> firstJohn = teenagers.where().equalTo("name", "John").findFirst();
{% endhighlight %}

### 聚合
`RealmResult` 自带一些聚合方法：

{% highlight java %}
long   sum     = result.sum("age").longValue(); //加法
long   min     = result.min("age").longValue(); //最小值
long   max     = result.max("age").longValue(); //最大值
double average = result.average("age"); //平均数

long   matches = result.size();
{% endhighlight %}

### 迭代
遍历 `RealmResults` 可以这样：

{% highlight java %}
for (User u : result) {
    // ... do something with the object ...
}
{% endhighlight %}

或者使用 `for` 循环：

{% highlight java %}
for (int i = 0; i < result.size(); i++) {
    User u = result.get(i);
    // ... do something with the object ...
}
{% endhighlight %}

### 删除
你可以从查询结果中删除数据

{% highlight java %}
// 所有的数据变更都需要在一个事务里发生
realm.beginTransaction();

// 删除单条数据
result.remove(0);
result.removeLast();

// 删除所有匹配到的数据
result.clear();

realm.commitTransaction();
{% endhighlight %}

<h2 id="realms">Realm(s)</h2>

Realm(s) 是我们对数据库的称谓：它包含多个不同的对象，并对应磁盘中的一个文件。

### 默认的 Realm
你可能已经意识到，我们总是通过 `Realm.getInstance(this)` 来访问我们已初始化的 realm 变量。该单例方法会为你的线程返回一个实例变量，它对应了你的应用文件根目录中一个 default.realm 文件。

### 其它 Realm

It’s sometimes useful to have multiple realms, persisted at different locations,
for example if you have different data groupings, different databases per feature,
 or you need to package some read-only files with your app, separate from the
 database your users will be editing.

有时候你可能需要多个持久化在不同位置的 realm 实例，比如说你需要不同的数据分组、各个功能独立数据库，或你需要独立于你的用户可修改的数据库外附带一些只读数据的时候。

{% highlight java %}
Realm moviesrealm = Realm.getInstance(this, "allmymovies.realm");
{% endhighlight %}

### 跨线程使用 Realm
跨线程使用 Realm 唯一的规则是，`Realm`、`RealmObject` 或 `RealmResults` 实例不能跨线程传递。当你需要在不同的线程访问同样的数据时，你应该为每个线程获取独立的 Realm 实例（比如 `Realm.getInstance(this)` 或其它方式）并通过 `RealmQuery` 取得你的对象。这些对象都对应磁盘上相同的数据，并且对任何线程可读、可写！

## 关系
任意两个 RealmObject 都能互相关联。

{% highlight java %}
public class Email extends RealmObject {
    private String address;
    // ... setters and getters left out
}

public class Contact extends RealmObject {
    private String name;
    private Email email;
    // ... setters and getters left out
}
{% endhighlight %}

请注意现在还不支持对关联进行查询。你可以暂时通过遍历你的结果来过滤出你需要的数据。我们会在下个版本中支持内置关联查询。

### 一对多
也就是使用你的 RealmObject 子类作为类型来声明属性：

{% highlight java %}
public class Email extends RealmObject {
    private Contact contact;
    // Other fields…
}
{% endhighlight %}

### 多对多
你可以通过一个 `RealmList<T>` 字段声明来建立单个对象对应0个、1个或更多个对象的关联。

{% highlight java %}
public class Contact extends RealmObject {
    private RealmList<Email> emails;
    // Other fields…
}
{% endhighlight %}

RealmList 是基本的 RealmObject 容器，类似于普通的 Java `List` 类。

你可以添加标注的 getter 和 setter 来访问关联中的数据。

{% highlight java %}
realm.beginTransaction();
Contact contact = realm.createObject(Contact.class);
contact.setName("John Doe");

Email email1 = realm.createObject(Email.class);
email1.setAddress("john@example.com");
contact.getEmails().add(email1);

Email email2 = realm.createObject(Email.class);
email2.setNumber("jd@example.com");
contact.getEmails().add(email2);

realm.commitTransaction();
{% endhighlight %}

## 通知
如果你在一个后台线程中增加数据，你的 UI 或其它线程可以通过监听器获取 Realm 的变化：

{% highlight java %}
realm.addChangeListener(new RealmChangeListener() {
    @Override
    public void onChange() {
        // ... do something with the updates (UI, etc.) ...
    }
});
{% endhighlight %}

如果有需要，你可以很方便地关掉所有监听器：

{% highlight java %}
realm.removeAllChangeListeners();
{% endhighlight %}

迁移
----
随着时间的推动，数据模型变化是常有的事。从一开始在Realm中定义了数据对象后，如果需要改变它，只需要改变RealmObject子类即可。

如果在储存器中没有旧的数据，那么你只要修改你的代码就能改变数据对象。如果有，那么在执行查询时会因为不匹配而报错。

所以我们提供了方法给你去更新你的旧数据对象，详情请看我们的实例[migrationSample app](https://github.com/realm/realm-java/tree/master/examples/migrationExample)

下一步
----
你可以查看我们的[example](https://github.com/realm/realm-java/tree/master/examples)中的实例（我们会陆续提供更多samples）。

Happy hacking!你可以在[realm-java](https://groups.google.com/d/forum/realm-java)里和真人开发者交流。

FAQ
----
**我应该在产品级应用中使用Realm吗？**

Realm从2012年开始就已经被用于商业产品。

通过交流反馈你还能推动我们的bug修复和发展。

**我需要向Realm支付费用吗？**

不，Realm for Android 完全免费，在商业项目使用它也不需要收费。

**那你们怎么创造收入呢？**

（这个还是放原句好）We’re actually already generating revenue selling enterprise products and services around our technology. If you need more than what is currently in our releases or in [realm-java](http://github.com/realm/realm-java), we’re always happy to chat [by email](http://realm.io/docs/java/0.71.0/info@realm.io). Otherwise, we are committed to developing realm-java in the open, and to keep it free and open-source under the Apache 2.0 license.

**源码里面引用的“tightdb”和"core"是什么？**

TightDB是我们C++存储引擎内核的旧名称，内核目前还没开源，但是我们已经有这个计划，只要我们有时间梳理一下、改改名字，等最后敲定后，就会开放源代码，并且同样使用 Apache 2.0 协议。
