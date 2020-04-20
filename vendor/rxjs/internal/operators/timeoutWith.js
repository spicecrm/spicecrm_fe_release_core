"use strict";var __extends=this&&this.__extends||function(){var r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])})(t,e)};return function(t,e){function i(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)}}();Object.defineProperty(exports,"__esModule",{value:!0});var async_1=require("../scheduler/async"),isDate_1=require("../util/isDate"),OuterSubscriber_1=require("../OuterSubscriber"),subscribeToResult_1=require("../util/subscribeToResult");function timeoutWith(r,s,u){return void 0===u&&(u=async_1.async),function(t){var e=isDate_1.isDate(r),i=e?+r-u.now():Math.abs(r);return t.lift(new TimeoutWithOperator(i,e,s,u))}}exports.timeoutWith=timeoutWith;var TimeoutWithOperator=function(){function t(t,e,i,r){this.waitFor=t,this.absoluteTimeout=e,this.withObservable=i,this.scheduler=r}return t.prototype.call=function(t,e){return e.subscribe(new TimeoutWithSubscriber(t,this.absoluteTimeout,this.waitFor,this.withObservable,this.scheduler))},t}(),TimeoutWithSubscriber=function(o){function e(t,e,i,r,s){var u=o.call(this,t)||this;return u.absoluteTimeout=e,u.waitFor=i,u.withObservable=r,u.scheduler=s,u.action=null,u.scheduleTimeout(),u}return __extends(e,o),e.dispatchTimeout=function(t){var e=t.withObservable;t._unsubscribeAndRecycle(),t.add(subscribeToResult_1.subscribeToResult(t,e))},e.prototype.scheduleTimeout=function(){var t=this.action;t?this.action=t.schedule(this,this.waitFor):this.add(this.action=this.scheduler.schedule(e.dispatchTimeout,this.waitFor,this))},e.prototype._next=function(t){this.absoluteTimeout||this.scheduleTimeout(),o.prototype._next.call(this,t)},e.prototype._unsubscribe=function(){this.action=null,this.scheduler=null,this.withObservable=null},e}(OuterSubscriber_1.OuterSubscriber);