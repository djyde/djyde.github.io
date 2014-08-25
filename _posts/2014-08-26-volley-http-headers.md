---
layout: post
title: 在Volley中自定义HTTP头实现模拟PC端访问网页
date: 2014-08-26 03:15:00
tag: android
---
最近在用Volley + Jsoup 抓V2EX网站首页数据的时候一直抓不到自己想抓到的数据，换了很多种Jsoup不同的选择器依然抓不到要抓的。后来索性把Volley取到的V2EX首页原代码Log出来，才发现原来是因为手机端访问V2EX会自动跳转到手机版，而手机版里根本就没有这个，难怪一直抓不出来。

终于找到了问题的源头，就着手解决。因为服务器是根据HTTP头的User Agent值来判断浏览器类型，所以我首先想到的方法是通过改写HTTP头去模拟PC端的浏览器访问。 而在Volley中改写HTTP头的方法很方便，只要覆写getHeaders()方法就能实现。代码如下：

{% highlight java %}
StringRequest request = new StringRequest("http://xxx.com", new Response.Listener<String>() {
    @Override
    public void onResponse(String response) {
        //use response to do sth...
    }
},new Response.ErrorListener() {
    @Override
    public void onErrorResponse(VolleyError error) {
        //If error, use error.getMessage() do sth...
        error.getMessage()
    }
}){
    @Override
    public Map<String, String> getHeaders() throws AuthFailureError {
        Map<String,String> headers = new HashMap<String, String>();
        headers.put("User-agent","Mozilla/5.0 (Windows NT 6.3)");
        return headers;
    }
};
{% endhighlight %}
我们需要在getHeaders()中定义一个新的HashMap类型来存放自己要改写的header，比如这里我们要改写“User-agent”为“Mozilla/5.0 (Windows NT 6.3)”。

当然，还可以写自己需要的其它header，只要把它们按key-value形式put到HashMap中，最后返回这个HashMap就成功了。