(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[526],{47356:function(e,t,n){"use strict";n.d(t,{$:function(){return a}});var r=n(92777),i=n(82262),a=function(){function e(){(0,r.Z)(this,e)}return(0,i.Z)(e,null,[{key:"log",value:function(){}}]),e}()},68835:function(e,t,n){"use strict";n.d(t,{d:function(){return l}});var r=n(51436),i=n(92814),a=n(41664),o=n(32125),c=n(85893),s=o.ZP.div.withConfig({displayName:"GameLink__GameLinkContainer",componentId:"sc-13jm6g6-0"})(["a{width:100%;display:inline-block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:","px;}.gamelink-icon{width:","px;height:","px;}"],16,16,16),l=function(e){var t=e.href,n=e.title,o=t.includes("http://")||t.includes("https://");return(0,c.jsx)(s,{children:!1===o?(0,c.jsx)(a.default,{href:t,children:(0,c.jsx)("a",{title:n,children:n})}):(0,c.jsxs)("a",{title:n,href:t,children:[n," ",(0,c.jsx)(i.G,{className:"gamelink-icon",icon:r.wlW,width:16,height:16})]})})}},4097:function(e,t,n){"use strict";n.d(t,{F:function(){return c}});var r=n(41664),i=n(32125),a=n(85893),o=i.ZP.div.withConfig({displayName:"PageBreadcrumb__PageBreadcrumbContainer",componentId:"sc-jgtqn8-0"})(["max-width:980px;margin:0 auto;.breadcrumb-back{font-size:20px;display:inline-block;padding:5px;background:#fff;border:5px solid #eee;margin:10px 0;line-height:16px;height:20px;}"]),c=function(e){var t=e.route,n=e.title,i=void 0===n?"back":n;return(0,a.jsx)(o,{children:(0,a.jsx)(r.default,{href:"/".concat(t),children:(0,a.jsxs)("a",{className:"breadcrumb-back",children:["<- ",i]})})})};t.Z=c},38008:function(e,t,n){"use strict";n.d(t,{h:function(){return h}});var r=n(59499),i=n(42474),a=n(68835),o=n(41664),c=n(35192),s=n(26671),l=n(32125),m=n(85893);function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function u(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?d(Object(n),!0).forEach((function(t){(0,r.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var g=l.ZP.div.withConfig({displayName:"markdownRenderer__VideoEmbedContainer",componentId:"sc-1ftv8ca-0"})(["margin:10px 0;padding:10px;border-left:10px solid #eee;background:#f9f9f9;"]),p=l.ZP.div.withConfig({displayName:"markdownRenderer__ParagraphAsDiv",componentId:"sc-1ftv8ca-1"})(["display:block;margin-block-start:1em;margin-block-end:1em;margin-inline-start:0px;margin-inline-end:0px;"]),f={},h={breaks:!0,renderer:{code:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"txt";return(0,m.jsx)(c.Z,{language:t,style:s.PX,children:e})},image:function(e,t,n){return(0,m.jsxs)("div",{className:"jamstic-image",children:[(0,m.jsx)(o.default,{href:e,children:(0,m.jsx)("img",{width:320,height:180,alt:t,src:e})}),(0,m.jsx)("div",{className:"jamstic-image-title",children:n})]},e)},link:function(e,t){var n=new URL(null!==e&&void 0!==e?e:"#");if(["www.youtube.com","youtu.be"].includes(n.hostname)){var r,i="";if(i="youtu.be"===n.hostname?n.pathname.replace("/",""):null!==(r=n.searchParams.get("v"))&&void 0!==r?r:"#"){var c={width:560,height:315,frameBorder:0,allowFullScreen:!0,src:"//www.youtube.com/embed/".concat(i)};return(0,m.jsxs)(g,{children:[(0,m.jsx)("iframe",u({},c)),(0,m.jsx)(a.d,{href:e,title:e})]},i)}}return(0,m.jsx)(o.default,{href:e,children:(0,m.jsx)("a",{title:t,children:t})},e+t)},paragraph:function(e){var t=e.toString(),n=Object.keys(f).filter((function(e){return e===t})),r=(0,i.createHash)("md5").update(e.toString()).digest("hex")+n;return(0,m.jsx)(p,{children:e},r)}}}},15398:function(e,t,n){"use strict";n.d(t,{sG:function(){return l},p6:function(){return m},F6:function(){return d}});var r=n(47356),i=n(19252),a=n(21795),o="Etc/GMT-2",c=new Intl.DateTimeFormat("default",{timeZone:o,year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"});i.Z.addLocale(a.Z);var s=new i.Z("en-US"),l=function(e){return e instanceof Date?e:new Date(e)},m=function(e){return c.format(l(e))},d=function(e){var t=s.format(new Date(e.toLocaleString("en-US",{timeZone:o})));return void 0===t?(r.$.log("Couldn't create 'ago' time from ".concat(e)),"-"):t.toString()}},83205:function(e,t,n){"use strict";n.d(t,{gh:function(){return x},H8:function(){return h},jV:function(){return v}});var r,i=n(27812),a=n(92777),o=n(59499),c=n(47356),s=n(31304),l=n.n(s),m=n(92848),d=n(16835),u=/!\[.*?\]\(.*?\)/g,g=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.join("/").replaceAll("///","/").replaceAll("//","/")},p="".concat(null!==(r="/jamstic-next")?r:"","/images/"),f=function(e){var t,n;try{n=new URL(e)}catch(a){return c.$.log("Error trying to parse url: ".concat(e)),"error"}var r=n.pathname,i=r.split("/");return i.length>0&&null!==(t=i.at(-1))&&void 0!==t?t:r},h=function(e,t,n){var r=t;return function(e){return(0,i.Z)(e.matchAll(u)).map((function(e){var t=(0,d.Z)(e,1)[0].split("]("),n=(0,d.Z)(t,2),r=(n[0],n[1].split(")"));return(0,d.Z)(r,1)[0]}))}(r).forEach((function(t){r=r.replace(t,x.ImageFromGame(e,{originalUrl:t,pathType:n}))})),r},x=function e(){(0,a.Z)(this,e)};(0,o.Z)(x,"EntryFromGame",(function(e){return g(e.jamSlug,e.event.slug,e.game.slug)})),(0,o.Z)(x,"CustomEntry",(function(e,t){return g(e,t)})),(0,o.Z)(x,"Image",(function(e,t,n,r){return g(p,e,t,n,r.originalUrl)})),(0,o.Z)(x,"ImageFromGame",(function(e,t){if(t.pathType===m.q.AVATAR&&""===t.originalUrl)return x.DefaultAvatar(e.jamSlug);var n=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"",i=[t];return c.$.log("Determining img path: ".concat(r," ").concat(e.pathType," ").concat(e.originalUrl)),[m.q.BODY,m.q.COMMENT].includes(e.pathType)&&i.push.apply(i,[n,r]),i.push.apply(i,[e.pathType,f(e.originalUrl)]),i}(t,e.jamSlug,e.event.slug,e.game.slug);return g.apply(void 0,[p].concat((0,i.Z)(n)))})),(0,o.Z)(x,"DefaultAvatar",(function(e){return g(p,e,"default-avatar.png")}));var v=function(e){return t="".concat(e.fileName.replaceAll(".json","")),l()(t,{lower:!0,remove:/[*+,~.()'"!:@]/g});var t}},99774:function(e,t,n){"use strict";n.r(t),n.d(t,{__N_SSG:function(){return S},default:function(){return A}});var r=n(59499),i=n(9008),a=n(83205),o=n(38008),c=n(30309),s=n(58445),l=n.n(s),m=n(32125),d=n(92848),u=n(15398),g=n(68835),p=n(85893);function f(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function h(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?f(Object(n),!0).forEach((function(t){(0,r.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):f(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var x=m.ZP.div.withConfig({displayName:"GameComments__GameCommentsContainer",componentId:"sc-1xpl2wu-0"})(["margin-top:5px;padding:20px;padding-top:5px;background:none;.game-comment-body{padding:20px;background:#fff;border:1px solid #eee;margin:0 40px 40px 110px;position:relative;}.game-comment-body:before{content:'';position:absolute;left:-22px;top:12px;width:0;height:0;border:24px solid transparent;border-right-color:#fff;border-left:0;border-top:0;z-index:10;}.game-comment-body:after{content:'';position:absolute;left:-24px;top:11px;width:0;height:0;border:26px solid transparent;border-right-color:#eee;border-left:0;border-top:0;z-index:5;}.game-comment-body p{margin:0 0 5px 0;}.game-comment-body img{max-width:100%;}.game-comment{position:relative;}.game-comment-author-image{position:absolute;width:100px;top:0;}.game-comment-meta{margin-left:110px;display:flex;background:rgba(255,255,255,0.5);background:rgba(0,0,0,0.5);background:linear-gradient(to right,rgba(0,0,0,0.5),rgba(255,255,255,0));padding:0 10px;color:#eee;margin-right:40px;}.game-comment-meta div:first-child{margin:0;}.game-comment-meta div{margin:0 5px;}"]),v=function(e){var t=e.entry,n=e.users,r=t.game;return(0,p.jsx)(x,{children:r.comments.length>0&&(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("h2",{className:"game-comments-container-title",children:"Comments"}),(0,p.jsx)("div",{className:"game-comments-container",children:r.comments.map((function(e){var r=n.find((function(t){return t.id===e.author}));return void 0===r&&(r={id:-1,url:"#",avatar:{originalUrl:"",pathType:d.q.AVATAR},name:"Deleted"}),(0,p.jsx)(b,{entry:t,comment:e,user:r},e.id)}))})]})})},b=function(e){var t=e.entry,n=e.comment,r=e.user,i=(0,u.sG)(n.created),s=(0,u.F6)(i),m=(0,u.p6)(i),f="",x=!1;if(void 0!==n.updated){var v=(0,u.sG)(n.updated);f=(0,u.p6)(v),x=Math.abs(i.getTime()-v.getTime())>3e5&&(0,u.F6)(v)}var b=l().emojify((0,a.H8)(t,n.body,d.q.COMMENT)),j=a.gh.ImageFromGame(t,r.avatar);return(0,p.jsxs)("div",{className:"game-comment",children:[(0,p.jsx)("div",{className:"game-comment-author-image",children:j&&(0,p.jsx)("img",{width:80,height:80,src:j})}),(0,p.jsxs)("div",{className:"game-comment-meta",children:[(0,p.jsx)("div",{className:"game-comment-author",children:(0,p.jsx)(g.d,{href:r.url,title:r.name})}),(0,p.jsxs)("div",{className:"game-comment-created",title:m,children:["on ",m," (",s,")"," ",x&&(0,p.jsx)("span",{className:"game-comment-updated",title:"updated on ".concat(f," (").concat(x,")"),children:"*"})]})]}),(0,p.jsx)("div",{className:"game-comment-body",children:(0,p.jsx)(c.Z,h(h({},o.h),{},{value:b}))})]},n.id)},j=m.ZP.div.withConfig({displayName:"GameContainer",componentId:"sc-1ktmlqt-0"})(["position:relative;max-width:920px;margin:0 auto;@media (max-width:1350px){margin-left:240px;}.game-content{background:#f9f9f9;padding:5px 20px;padding-bottom:20px;}.game-content h2{font-size:1.4em;font-weight:500;}.game-content ul{line-height:1.5;}.game-content li{margin:0 0 0.5em 0;}.game-content img{max-width:100%;}.game-content th,.game-content td{text-align:left;padding:5px;}.game-content table{border-spacing:0;border:1px solid #ccc;}.game-content th{font-size:16px;font-weight:bold;color:#444;background:#eee;}.game-content tr:nth-child(even){background:#f9f9f9;}.game-content tr:nth-child(odd){background:#fff;}jamstic-image{background:#fff;display:inline-block;border:1px solid #ccc;padding:5px;}jamstic-image-title{padding:0 5px;}"]),y=m.ZP.div.withConfig({displayName:"GameMeta__GameMetaContainer",componentId:"sc-1ml8rf0-0"})(["position:absolute;right:100%;height:100%;width:200px;top:0;margin-right:5px;.game-meta{position:sticky;top:0;padding:10px;background:#f9f9f9;}.game-event span{display:block;}.game-meta-section{margin-bottom:20px;}.game-result{position:relative;border-bottom:1px dotted #ccc;background:#fff;padding:2px 5px;}.game-result-value{position:absolute;right:5px;z-index:5;top:0;height:100%;}"]),w=function(e){var t=e.entry,n=t.game,r=t.event,i=e.users,a=n.authors;return(0,p.jsx)(y,{children:(0,p.jsxs)("div",{className:"game-meta",children:[(0,p.jsxs)("div",{className:"game-meta-section",children:[(0,p.jsx)("h2",{children:"Info"}),(0,p.jsxs)("div",{className:"game-event",children:[(0,p.jsx)(g.d,{href:r.url,title:r.name},r.url),(0,p.jsxs)("span",{className:"game-event-type",children:["Type: ",n.division]}),(0,p.jsxs)("span",{className:"game-event-theme",children:["Theme: ",r.theme]})]}),(0,p.jsx)("div",{className:"game-publish-date",title:(0,u.p6)(r.date),children:(0,u.F6)((0,u.sG)(r.date))})]}),(0,p.jsxs)("div",{className:"game-meta-section",children:[(0,p.jsxs)("h2",{children:["Author",a.length>1?"s":""]}),a.map((function(e,t){var n=i.find((function(t){return t.id===e}));return void 0===n?(0,p.jsx)("div",{className:"game-author",children:"Unknown"},"".concat(t,"-").concat(e)):(0,p.jsx)("div",{className:"game-author",children:(0,p.jsx)(g.d,{href:n.url,title:n.name})},n.url)}))]}),(0,p.jsxs)("div",{className:"game-meta-section",children:[(0,p.jsx)("h2",{children:"Results"}),n.results.all.map((function(e){return(0,p.jsxs)("div",{className:"game-result",children:[(0,p.jsx)("div",{className:"game-result-title",children:e.title}),(0,p.jsx)("div",{className:"game-result-value",children:e.result})]},e.title)}))]}),(0,p.jsxs)("div",{className:"game-meta-section",children:[(0,p.jsx)("h2",{children:"Links"}),(0,p.jsx)(g.d,{href:n.url,title:"Original entry page"},n.url),n.links.map((function(e){return(0,p.jsx)(g.d,{href:e.url,title:e.title},e.url)}))]})]})})},O=n(4097);function P(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function k(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?P(Object(n),!0).forEach((function(t){(0,r.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):P(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var N=m.ZP.div.withConfig({displayName:"GamePage__PageContainer",componentId:"sc-1g6i0lu-0"})(["background:linear-gradient(0deg,var(--one) 0%,var(--five) 100%);padding-bottom:40px;margin:0;padding:0;"]),C=m.ZP.div.withConfig({displayName:"GamePage__GameContentContainer",componentId:"sc-1g6i0lu-1"})(["position:relative;"]),Z=m.ZP.div.withConfig({displayName:"GamePage__GameCoverImg",componentId:"sc-1g6i0lu-2"})(["background-size:cover;background-position:center;background-repeat:no-repeat;max-width:920px;height:400px;box-shadow:inset 0px 5px 3px 1px var(--one);margin-bottom:5px;background-image:url('","');&:hover{background-size:contain;}"],(function(e){return e.imgUrl})),_=(0,m.ZP)(N).withConfig({displayName:"GamePage__PageContainerWithCoverColors",componentId:"sc-1g6i0lu-3"})(["",""],(function(e){return e.coverColors})),D=m.ZP.h1.withConfig({displayName:"GamePage__GameTitle",componentId:"sc-1g6i0lu-4"})(["margin:auto;text-align:left;font-size:50px;padding:0 20px;display:flex;align-items:center;border:0;background:linear-gradient(to top,var(--one),var(--five));margin-bottom:5px;text-shadow:2px 2px 0px black;color:#fff;"]),G=m.ZP.div.withConfig({displayName:"GamePage__GameDescription",componentId:"sc-1g6i0lu-5"})(["background:#fff;font-style:italic;padding:20px;"]),E=function(e){var t=e.error,n=e.data,r=e.users;if(t)return(0,p.jsx)("div",{children:n});var i=n,s=i.game,m=a.gh.ImageFromGame(i,s.cover),u=l().emojify((0,a.H8)(i,s.body,d.q.BODY));return(0,p.jsxs)(_,{coverColors:s.coverColors.css,children:[(0,p.jsx)(O.F,{route:"games"}),(0,p.jsxs)(j,{children:[(0,p.jsx)(D,{children:s.name}),(0,p.jsx)(w,{entry:i,users:r}),(0,p.jsx)(Z,{className:"game-meta-cover",imgUrl:m}),(0,p.jsxs)(C,{children:[(0,p.jsx)(G,{children:s.description}),(0,p.jsx)("div",{className:"game-content",children:(0,p.jsx)(c.Z,k(k({},o.h),{},{value:u}))}),(0,p.jsx)(v,{entry:i,users:r})]})]})]})};function I(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function T(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?I(Object(n),!0).forEach((function(t){(0,r.Z)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):I(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var S=!0,A=function(e){return!1!==e.error?(0,p.jsx)("div",{children:e.error}):(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(i.default,{children:(0,p.jsxs)("title",{children:["jamsticnext - ",e.data.game.name]})}),(0,p.jsx)(E,T({},e))]})}},92848:function(e,t,n){"use strict";var r;n.d(t,{q:function(){return r}}),function(e){e.AVATAR="avatar",e.COVER="cover",e.BODY="body",e.COMMENT="comment"}(r||(r={}))},45580:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/games/[...slug]",function(){return n(99774)}])}},function(e){e.O(0,[523,714,417,925,598,774,888,179],(function(){return t=45580,e(e.s=t);var t}));var t=e.O();_N_E=t}]);