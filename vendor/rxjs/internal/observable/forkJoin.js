"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var Observable_1=require("../Observable"),isArray_1=require("../util/isArray"),map_1=require("../operators/map"),isObject_1=require("../util/isObject"),from_1=require("./from");function forkJoin(){for(var r=[],e=0;e<arguments.length;e++)r[e]=arguments[e];if(1===r.length){var n=r[0];if(isArray_1.isArray(n))return forkJoinInternal(n,null);if(isObject_1.isObject(n)&&Object.getPrototypeOf(n)===Object.prototype){var t=Object.keys(n);return forkJoinInternal(t.map(function(r){return n[r]}),t)}}if("function"!=typeof r[r.length-1])return forkJoinInternal(r,null);var o=r.pop();return forkJoinInternal(r=1===r.length&&isArray_1.isArray(r[0])?r[0]:r,null).pipe(map_1.map(function(r){return o.apply(void 0,r)}))}function forkJoinInternal(f,l){return new Observable_1.Observable(function(t){var o=f.length;if(0!==o)for(var i=new Array(o),u=0,a=0,r=function(e){var r=from_1.from(f[e]),n=!1;t.add(r.subscribe({next:function(r){n||(n=!0,a++),i[e]=r},error:function(r){return t.error(r)},complete:function(){++u!==o&&n||(a===o&&t.next(l?l.reduce(function(r,e,n){return r[e]=i[n],r},{}):i),t.complete())}}))},e=0;e<o;e++)r(e);else t.complete()})}exports.forkJoin=forkJoin;