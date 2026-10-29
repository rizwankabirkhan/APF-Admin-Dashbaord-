(function(){
var A=function(){return window.__APF_A||{}};
function key(u){if(!u)return null;var i=u.indexOf('assets/');if(i<0)return null;var k=u.slice(i).split(/[?#]/)[0];try{k=decodeURIComponent(k)}catch(e){}return A()[k]?k:null}
function fixUrlText(t){if(!t||t.indexOf('assets/')<0)return t;return t.replace(/url\((['"]?)([^'")]*assets\/[^'")]+)\1\)/g,function(m,q,u){var k=key(u);return k?'url("'+A()[k]+'")':m})}
var SA=Element.prototype.setAttribute;
Element.prototype.setAttribute=function(n,v){if((n==='src'||n==='poster'||n==='href')&&typeof v==='string'){var k=key(v);if(k)v=A()[k]}else if(n==='style'&&typeof v==='string')v=fixUrlText(v);return SA.call(this,n,v)};
function patchProp(P,prop){var d=Object.getOwnPropertyDescriptor(P,prop);if(!d||!d.set)return;Object.defineProperty(P,prop,{configurable:true,enumerable:d.enumerable,get:d.get,set:function(v){if(typeof v==='string'){var k=key(v);if(k)v=A()[k]}d.set.call(this,v)}})}
patchProp(HTMLImageElement.prototype,'src');patchProp(HTMLMediaElement.prototype,'src');patchProp(HTMLVideoElement.prototype,'poster');patchProp(HTMLSourceElement.prototype,'src');
function fixEl(el){if(el.nodeType!==1)return;var s=el.getAttribute('style');if(s&&s.indexOf('assets/')>=0){var f=fixUrlText(s);if(f!==s)SA.call(el,'style',f)}['src','poster'].forEach(function(a){var v=el.getAttribute(a);var k=key(v);if(k)SA.call(el,a,A()[k])})}
function walk(n){if(n.nodeType!==1)return;fixEl(n);var all=n.querySelectorAll('[style*="assets/"],[src*="assets/"],[poster*="assets/"]');for(var i=0;i<all.length;i++)fixEl(all[i])}
new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var m=ms[i];if(m.type==='attributes')fixEl(m.target);else for(var j=0;j<m.addedNodes.length;j++)walk(m.addedNodes[j])}}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['style','src','poster']});
var IS=CSSStyleDeclaration.prototype.setProperty;CSSStyleDeclaration.prototype.setProperty=function(p,v,pr){return IS.call(this,p,typeof v==='string'?fixUrlText(v):v,pr)};
['background','backgroundImage','maskImage','webkitMaskImage','content'].forEach(function(p){var d=Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype,p);if(d&&d.set)Object.defineProperty(CSSStyleDeclaration.prototype,p,{configurable:true,get:d.get,set:function(v){d.set.call(this,typeof v==='string'?fixUrlText(v):v)}})});
document.addEventListener('DOMContentLoaded',function(){walk(document.documentElement)});
})();