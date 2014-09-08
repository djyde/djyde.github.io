---
layout: post
title: 对Markdown标准化的构想
date: 2014-9-6
tag: internet
---
John Gruber和Aaron Swartz创造Markdown至今已经有十年，在这十年我们用Markdown节约了大量的时间，像Github、Stackoverflow这样的网站都能看到Markdown的身影，这篇文章也是用它写成。

如果用面向对象的思维去看待Markdown，它就像是一个interface，所有人可以根据自己不同的需求去编写自己的Markdown实现，比如Github Flavored Markdown。这样的灵活性促进了它迅猛的发展，但同样也给使用者带来了一些问题。

虽然同样使用Markdown，但在不同的环境下，常用的写法则不一定正确。比如说我通常使用下划线嵌套实现字体倾斜（ \_e.g\_ ），但在Github中，这样的写法是不允许的，因为当我们需要写像hello\_world\_example这样的字符串的时候，会被解析成hello  *world* exapmle，Github选择忽略这种写法，只能使用星号实现斜体，这种做法无疑是正确的。

这样的乱象带给用户很大的不便，由其在面对一个陌生的编辑环境的时候，没有人告诉你，应该按照怎样的标准去编写Markdown，有时甚至会在提交文本后发生无可挽回的结果。

为了解决这样的问题，我们应该人为地去制定一些**比Flavored更大范围**的标准。这个标准要求做到以下几点：

* 标准的名称
* 具有标识（齐备64、128、512px大小的icon）以供用户辨认
* 展示具体语法的wiki page
* 适用范围广

另外，制定标准的人（或组织）应该把解析器写出来。不过这不是必须。

这样，就能按照这些规定制定不同标准，比如说制定用于基础写作的标准（假设叫作**Markdown Writing**）和用于有coding需求的标准（假设叫作**Markdown Coding**）。这样一来，Stackoverflow和Github可以实现**Markdown Coding**的解析，又或者各种不同的Markdown写作工具可以提供标准选择的选项，让用户选择使用哪一个标准去编写Markdown。

巧合的是，Stackoverflow创始人codinghorror正在做这样的事，他所制定的 [Command Markdown](http://commonmark.org/) 正是符合上述要求的一个合规标准。

先写到这，我仍会不断的为Markdown标准化作尽可能的努力，并且我自己也正在写一个合规的标准。

:)
