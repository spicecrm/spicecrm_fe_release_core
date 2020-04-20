"use strict";var __extends=this&&this.__extends||function(){var s=function(r,t){return(s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,t){r.__proto__=t}||function(r,t){for(var e in t)t.hasOwnProperty(e)&&(r[e]=t[e])})(r,t)};return function(r,t){function e(){this.constructor=r}s(r,t),r.prototype=null===t?Object.create(t):(e.prototype=t.prototype,new e)}}();Object.defineProperty(exports,"__esModule",{value:!0});var isArray_1=require("../util/isArray"),fromArray_1=require("./fromArray"),OuterSubscriber_1=require("../OuterSubscriber"),subscribeToResult_1=require("../util/subscribeToResult");function race(){for(var r=[],t=0;t<arguments.length;t++)r[t]=arguments[t];if(1===r.length){if(!isArray_1.isArray(r[0]))return r[0];r=r[0]}return fromArray_1.fromArray(r,void 0).lift(new RaceOperator)}exports.race=race;var RaceOperator=function(){function r(){}return r.prototype.call=function(r,t){return t.subscribe(new RaceSubscriber(r))},r}();exports.RaceOperator=RaceOperator;var RaceSubscriber=function(e){function r(r){var t=e.call(this,r)||this;return t.hasFirst=!1,t.observables=[],t.subscriptions=[],t}return __extends(r,e),r.prototype._next=function(r){this.observables.push(r)},r.prototype._complete=function(){var r=this.observables,t=r.length;if(0===t)this.destination.complete();else{for(var e=0;e<t&&!this.hasFirst;e++){var s=r[e],i=subscribeToResult_1.subscribeToResult(this,s,s,e);this.subscriptions&&this.subscriptions.push(i),this.add(i)}this.observables=null}},r.prototype.notifyNext=function(r,t,e,s,i){if(!this.hasFirst){this.hasFirst=!0;for(var o=0;o<this.subscriptions.length;o++)if(o!==e){var n=this.subscriptions[o];n.unsubscribe(),this.remove(n)}this.subscriptions=null}this.destination.next(t)},r}(OuterSubscriber_1.OuterSubscriber);exports.RaceSubscriber=RaceSubscriber;