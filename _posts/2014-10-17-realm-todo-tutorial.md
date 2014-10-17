---
layout: post
title: Realm实例指南
date: 2014-10-17
tag: android
---
背景
---

Realm 是一个手机数据库，由 YCombinator 孵化的公司 Realm 创造。正如它在[官网](http://realm.io)中自我描述的一样，它的出现是为了替代SQLite和Core Date。抛开性能不说，相对于传统的SQLite，Realm有更好的体验，这也是我喜欢Realm的其中一个重要原因。

然而，相对于它的iOS版本，这个如此好用的数据库的Android版本目前还是没有受到广泛的关注，所以我决定为它布一下道，目前已经为它翻译了[中文文档](http://djyde.github.io/2014/10/17/realm-doc-in-chinese.html)，现在我们就来通过一个 Todo APP 实例粗略地体验一下 Realm 的使用。

开始之前
----
首先你要确保你的运行环境符合要求：

* Android Studio (>=0.8.6)
* 较新的 Android SDK 版本
* JDK（ >=7 ）

我第一次使用 Realm 的时候就是由于使用 JDK6 所以不断调试还报错。

要注意的是，在你下载安装了新版本的 JDK 后，必须检查 Android Studio 是否指向正确版本的 JDK。 你可以在 **File->Project Structure->SDK Location** 中查看指向的 JDK 目录。

Get Start
---
首先，我们要做的是一个 Todo APP，实现添加一条 todo 和修改一条 todo 的完成状态。就是这么简单，主要是演示 Realm 的一些简单的读写查询方法。成品如下：

![](http://blogscdn.qiniudn.com/github1.pic.jpg)

第一步，UI
----
首先我们先把最简单的布局完成。由于本指南的重点是 Realm 的操作，所以在这里只贴代码，不讲解。

**layout/activity_my.xml**：

{% highlight xml %}
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    tools:context=".MyActivity">

    <ListView
        android:id="@+id/todo_list"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="3"/>

    <LinearLayout
        android:layout_marginBottom="5dp"
        android:layout_alignParentBottom="true"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal">

        <EditText
            android:id="@+id/title"
            android:hint="What to do?"
            android:layout_width="0dp"
            android:layout_weight="5"
            android:layout_height="wrap_content"/>
        <ImageView
            android:id="@+id/add"
            android:layout_weight="1"
            android:src="@drawable/add"
            android:layout_width="0dp"
            android:layout_height="match_parent"/>
     </LinearLayout>

</LinearLayout>
{% endhighlight %}

**layout/todo_item.xml**（每个 item 的布局）：
{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>

<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
              android:orientation="vertical"
              android:layout_width="match_parent"
              android:layout_height="match_parent">
    <CheckBox
        android:id="@+id/done"
        android:textSize="22sp"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"/>

</LinearLayout>
{% endhighlight %}

第二步，数据模型
---
根据需求，我们知道一条 todo 应该要有两个属性，一个是 todo 的标题 `String title`，一个是它的完成状态 `Boolean done`。所以我们就可以根据这个建立一个 Todo 的对象。

Realm 的数据对象类似 Java Bean，我们新建一个 Todo 类，然后继承 `RealmObject`：

**java/model/Todo.java**

{% highlight java %}
package com.randy.client.todo4realm.model;

import io.realm.RealmObject;
import io.realm.annotations.RealmClass;

public class Todo extends RealmObject{
    private String title;
    private boolean done;

	//生成的 Getter 和 Setter
    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
{% endhighlight %}

第三步，查询
---
在用户打开 APP 后必须看到数据库中已存在的 todo 项，所以我们要在onCreate中执行查询，查找所有的 todo 对象。

Realm 的查询方法很简单。首先通过 `Realm.getInstance(Context)` 获取一个 realm 实例，再从 realm 的一系列查询方法返回一个 RealmResults<E>，通过自定义一个适配器来处理查询结果渲染到 ListView 上即可：

**java/MyActivity.java**

{% highlight java %}
public class MyActivity extends Activity {

    private ListView lv;
    private ImageView add;
    private EditText title;
    private Realm realm;
    private TodoAdapter todoAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_my);

        // 获得 realm 实例
        realm = Realm.getInstance(this);

        add = (ImageView)findViewById(R.id.add);
        title = (EditText)findViewById(R.id.title);
        lv = (ListView)findViewById(R.id.todo_list);

		// 执行查询
        RealmQuery<Todo> query = realm.where(Todo.class);
        RealmResults<Todo> results = query.findAll();

		// 适配器
        todoAdapter = new TodoAdapter(results,this);
        lv.setAdapter(todoAdapter);
		

    }

}
{% endhighlight %}

**java/adapter/TodoAdapter**(自定义适配器)

{% highlight java %}
package com.randy.client.todo4realm.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.TextView;

import com.randy.client.todo4realm.R;
import com.randy.client.todo4realm.model.Todo;

import java.util.HashMap;
import java.util.List;

import io.realm.Realm;
import io.realm.RealmResults;

/**
 * Created by randy on 14-10-12.
 */
public class TodoAdapter extends BaseAdapter {
    Context context;
    RealmResults<Todo> todoList;
    public TodoAdapter(RealmResults<Todo> todoList,Context context){
        this.todoList = todoList;
        this.context = context;
    }

    public class ViewHolder{
        CheckBox checkBox;
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public int getCount() {
        return todoList.size();
    }

    @Override
    public Object getItem(int i) {
        return null;
    }

    @Override
    public View getView(final int i, View view, ViewGroup viewGroup) {
        ViewHolder holder;
        if(view == null){
            view = LayoutInflater.from(context).inflate(R.layout.todo_item,null);
            holder = new ViewHolder();
            holder.checkBox = (CheckBox)view.findViewById(R.id.done);
            view.setTag(holder);
        } else {
            holder = (ViewHolder)view.getTag();
        }


        //获取done状态和title
        holder.checkBox.setChecked(todoList.get(i).isDone());
        holder.checkBox.setText(todoList.get(i).getTitle());
        return view;
    }
}
{% endhighlight %}


第三步，增加
-----

接下来要为 add 按钮添加插入数据的功能，只需要在绑定一个 onClick 事件，然后通过 `addChangeListener()` 监听数据库变化来实时更新ListView：

**java/MyActivity.java**

{% highlight java %}
add = (ImageView)findViewById(R.id.add);
add.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //添加一条todo
                realm.beginTransaction();

                Todo todo = realm.createObject(Todo.class);
                if(!title.getText().toString().equals("")){
                    todo.setTitle(title.getText().toString());
                    todo.setDone(false);
                }

                realm.commitTransaction();

                title.setText("");

                //监听数据库变化，更新ListView
                realm.addChangeListener(new RealmChangeListener() {
                    @Override
                    public void onChange() {
                        todoAdapter.notifyDataSetChanged();
                    }
                });

            }
        });
{% endhighlight %}

需要注意的是，在 Realm 中，所有有关修改数据（如增加，修改，删除）的动作都必须被包含在 `beginTransaction()` 和 `commitTransaction` 之中，以确保线程安全。

最后一步，修改完成状态
----
修改完成状态非常简单，只需要在 getView 中绑定 CheckBox 的 onCheck 事件然后通过 Realm 修改 done 的值：
{% highlight java %}
holder.checkBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                Realm realm = Realm.getInstance(context);
                realm.beginTransaction();
                todoList.get(i).setDone(b);
                realm.commitTransaction();
            }
        });
{% endhighlight %}

Done!
----
这样我们就完成了一个简单的 Todo APP，是不是很方便？但是，Realm 决不仅仅能够处理这些简单的数据，它还有更多非常棒的特性方法。如果你在看完这篇文章后决定深入了解，那么可以到[官方文档](realm.io/docs/java/)查看更多，或者看我的翻译的[中文文档](http://djyde.github.io/2014/10/17/realm-doc-in-chinese.html)。

本教程的源码托管在 [Github](https://github.com/djyde/Todo4Realm)，大家可以 clone 下来跑一跑试试。