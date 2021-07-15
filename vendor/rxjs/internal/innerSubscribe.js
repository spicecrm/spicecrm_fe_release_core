"use strict";var __extends=this&&this.__extends||function(){var n=function(e,r){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,r){e.__proto__=r}||function(e,r){for(var t in r)r.hasOwnProperty(t)&&(e[t]=r[t])})(e,r)};return function(e,r){function t(){this.constructor=e}n(e,r),e.prototype=null===r?Object.create(r):(t.prototype=r.prototype,new t)}}();Object.defineProperty(exports,"__esModule",{value:!0});var Subscriber_1=require("./Subscriber"),Observable_1=require("./Observable"),subscribeTo_1=require("./util/subscribeTo"),SimpleInnerSubscriber=function(t){function e(e){var r=t.call(this)||this;return r.parent=e,r}return __extends(e,t),e.prototype._next=function(e){this.parent.notifyNext(e)},e.prototype._error=function(e){this.parent.notifyError(e),this.unsubscribe()},e.prototype._complete=function(){this.parent.notifyComplete(),this.unsubscribe()},e}(Subscriber_1.Subscriber);exports.SimpleInnerSubscriber=SimpleInnerSubscriber;var ComplexInnerSubscriber=function(i){function e(e,r,t){var n=i.call(this)||this;return n.parent=e,n.outerValue=r,n.outerIndex=t,n}return __extends(e,i),e.prototype._next=function(e){this.parent.notifyNext(this.outerValue,e,this.outerIndex,this)},e.prototype._error=function(e){this.parent.notifyError(e),this.unsubscribe()},e.prototype._complete=function(){this.parent.notifyComplete(this),this.unsubscribe()},e}(Subscriber_1.Subscriber);exports.ComplexInnerSubscriber=ComplexInnerSubscriber;var SimpleOuterSubscriber=function(e){function r(){return null!==e&&e.apply(this,arguments)||this}return __extends(r,e),r.prototype.notifyNext=function(e){this.destination.next(e)},r.prototype.notifyError=function(e){this.destination.error(e)},r.prototype.notifyComplete=function(){this.destination.complete()},r}(Subscriber_1.Subscriber);exports.SimpleOuterSubscriber=SimpleOuterSubscriber;var ComplexOuterSubscriber=function(e){function r(){return null!==e&&e.apply(this,arguments)||this}return __extends(r,e),r.prototype.notifyNext=function(e,r,t,n){this.destination.next(r)},r.prototype.notifyError=function(e){this.destination.error(e)},r.prototype.notifyComplete=function(e){this.destination.complete()},r}(Subscriber_1.Subscriber);function innerSubscribe(e,r){if(!r.closed){if(e instanceof Observable_1.Observable)return e.subscribe(r);var t;try{t=subscribeTo_1.subscribeTo(e)(r)}catch(e){r.error(e)}return t}}exports.ComplexOuterSubscriber=ComplexOuterSubscriber,exports.innerSubscribe=innerSubscribe;