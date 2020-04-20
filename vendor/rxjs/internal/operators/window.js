"use strict";var __extends=this&&this.__extends||function(){var n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o])})(t,e)};return function(t,e){function o(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)}}();Object.defineProperty(exports,"__esModule",{value:!0});var Subject_1=require("../Subject"),OuterSubscriber_1=require("../OuterSubscriber"),subscribeToResult_1=require("../util/subscribeToResult");function window(e){return function(t){return t.lift(new WindowOperator(e))}}exports.window=window;var WindowOperator=function(){function t(t){this.windowBoundaries=t}return t.prototype.call=function(t,e){var o=new WindowSubscriber(t),n=e.subscribe(o);return n.closed||o.add(subscribeToResult_1.subscribeToResult(o,this.windowBoundaries)),n},t}(),WindowSubscriber=function(o){function t(t){var e=o.call(this,t)||this;return e.window=new Subject_1.Subject,t.next(e.window),e}return __extends(t,o),t.prototype.notifyNext=function(t,e,o,n,r){this.openWindow()},t.prototype.notifyError=function(t,e){this._error(t)},t.prototype.notifyComplete=function(t){this._complete()},t.prototype._next=function(t){this.window.next(t)},t.prototype._error=function(t){this.window.error(t),this.destination.error(t)},t.prototype._complete=function(){this.window.complete(),this.destination.complete()},t.prototype._unsubscribe=function(){this.window=null},t.prototype.openWindow=function(){var t=this.window;t&&t.complete();var e=this.destination,o=this.window=new Subject_1.Subject;e.next(o)},t}(OuterSubscriber_1.OuterSubscriber);