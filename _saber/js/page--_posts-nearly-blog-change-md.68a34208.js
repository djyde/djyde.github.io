(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{79:function(e,t,n){"use strict";n.r(t);var a=n(1),o=function(e){var t,n,a,o=(a=void 0,(t={}).type=n="post",t.internal=a,t.contentType="markdown",t.slug="nearly-blog-change",t.content=a,t.createdAt=new Date(1560266189e3),t.updatedAt=new Date(1573230315234),t.title="博客近期的变化",t.layout=n,t.date="2019-06-11 23:16:29",t.tags=null,t.markdownHeadings=[{text:"图片 CDN 迁移到了阿里云",slug:"图片-cdn-迁移到了阿里云",level:3},{text:"全站 Cloudflare",slug:"全站-cloudflare",level:3}],t.excerpt="<p>从上个月开始，博客的图片全部无法显示，原因是新浪微博开始防盗链了。</p>\n",t.permalink="/blog/nearly-blog-change",t.assets={},t.attributes=t,t),l=e.options.beforeCreate||[];e.options.beforeCreate=[function(){this.$page=o}].concat(l);["layout","transition"].forEach((function(t){var n=e.options.PageComponent;n&&(e.options[t]=n[t]),void 0===e.options[t]&&(e.options[t]=o[t])})),o.slug&&(e.options.name="page-wrapper-"+o.slug.replace(/[^0-9a-z\-]/i,"-"))},l=Object(a.a)({},(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("layout-manager",[n("h3",{attrs:{id:"图片-cdn-迁移到了阿里云"}},[e._v("图片 CDN 迁移到了阿里云")]),e._v(" "),n("p",[e._v("从上个月开始，博客的图片全部无法显示，原因是新浪微博开始防盗链了。")]),e._v(" "),n("p",[e._v("起初选择使用新浪微博的图床，一方面是因为不用花钱，另一方面是因为觉得自己的博客没有多少访问量，也就不折腾 CDN 了。然而这一两年我意识到，我认真写下的文字也被不少人在认真看待。趁着这个契机，就把博客的图片全部迁移到稳定的 CDN 上。")]),e._v(" "),n("p",[e._v("我选择了"),n("saber-link",{attrs:{to:"/link/aliyun"}},[e._v("阿里云 OSS + CDN 的方案")]),e._v("，我用 grep 把博客里所有的新浪图床图片找了出来，然后批量下载下来，上传到 OSS 上。")],1),e._v(" "),n("p",[e._v("比较麻烦的是国内的 CDN 域名需要备案，除此之外，就是阿里云的一条龙服务 —— 域名可以绑定到 CDN，CDN 可以直接关联 OSS。体验还算不错。")]),e._v(" "),n("h3",{attrs:{id:"全站-cloudflare"}},[e._v("全站 Cloudflare")]),e._v(" "),n("p",[e._v("Coding Page 的 Pages 服务在香港的腾讯云，抽风是家常便饭，无法忍受。于是接入了 Cloudflare, 现在你访问的这里就是经过 Cloudflare 加速的页面。")])])}),[],!1,null,null,null);"function"==typeof o&&o(l);t.default=l.exports}}]);