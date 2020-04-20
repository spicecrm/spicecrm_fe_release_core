"use strict";var __extends=this&&this.__extends||function(){var n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)};return function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}}(),__assign=this&&this.__assign||function(){return(__assign=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};Object.defineProperty(exports,"__esModule",{value:!0});var Subject_1=require("../../Subject"),Subscriber_1=require("../../Subscriber"),Observable_1=require("../../Observable"),Subscription_1=require("../../Subscription"),ReplaySubject_1=require("../../ReplaySubject"),DEFAULT_WEBSOCKET_CONFIG={url:"",deserializer:function(e){return JSON.parse(e.data)},serializer:function(e){return JSON.stringify(e)}},WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT="WebSocketSubject.error must be called with an object with an error code, and an optional reason: { code: number, reason: string }",WebSocketSubject=function(c){function r(e,t){var r=c.call(this)||this;if(e instanceof Observable_1.Observable)r.destination=t,r.source=e;else{var n=r._config=__assign({},DEFAULT_WEBSOCKET_CONFIG);if(r._output=new Subject_1.Subject,"string"==typeof e)n.url=e;else for(var o in e)e.hasOwnProperty(o)&&(n[o]=e[o]);if(!n.WebSocketCtor&&WebSocket)n.WebSocketCtor=WebSocket;else if(!n.WebSocketCtor)throw new Error("no WebSocket constructor can be found");r.destination=new ReplaySubject_1.ReplaySubject}return r}return __extends(r,c),r.prototype.lift=function(e){var t=new r(this._config,this.destination);return t.operator=e,t.source=this,t},r.prototype._resetState=function(){this._socket=null,this.source||(this.destination=new ReplaySubject_1.ReplaySubject),this._output=new Subject_1.Subject},r.prototype.multiplex=function(r,n,o){var c=this;return new Observable_1.Observable(function(t){try{c.next(r())}catch(e){t.error(e)}var e=c.subscribe(function(e){try{o(e)&&t.next(e)}catch(e){t.error(e)}},function(e){return t.error(e)},function(){return t.complete()});return function(){try{c.next(n())}catch(e){t.error(e)}e.unsubscribe()}})},r.prototype._connectSocket=function(){var n=this,e=this._config,t=e.WebSocketCtor,r=e.protocol,o=e.url,c=e.binaryType,i=this._output,s=null;try{s=r?new t(o,r):new t(o),this._socket=s,c&&(this._socket.binaryType=c)}catch(e){return void i.error(e)}var u=new Subscription_1.Subscription(function(){n._socket=null,s&&1===s.readyState&&s.close()});s.onopen=function(e){if(!n._socket)return s.close(),void n._resetState();var t=n._config.openObserver;t&&t.next(e);var r=n.destination;n.destination=Subscriber_1.Subscriber.create(function(e){if(1===s.readyState)try{var t=n._config.serializer;s.send(t(e))}catch(e){n.destination.error(e)}},function(e){var t=n._config.closingObserver;t&&t.next(void 0),e&&e.code?s.close(e.code,e.reason):i.error(new TypeError(WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT)),n._resetState()},function(){var e=n._config.closingObserver;e&&e.next(void 0),s.close(),n._resetState()}),r&&r instanceof ReplaySubject_1.ReplaySubject&&u.add(r.subscribe(n.destination))},s.onerror=function(e){n._resetState(),i.error(e)},s.onclose=function(e){n._resetState();var t=n._config.closeObserver;t&&t.next(e),e.wasClean?i.complete():i.error(e)},s.onmessage=function(e){try{var t=n._config.deserializer;i.next(t(e))}catch(e){i.error(e)}}},r.prototype._subscribe=function(e){var t=this,r=this.source;return r?r.subscribe(e):(this._socket||this._connectSocket(),this._output.subscribe(e),e.add(function(){var e=t._socket;0===t._output.observers.length&&(e&&1===e.readyState&&e.close(),t._resetState())}),e)},r.prototype.unsubscribe=function(){var e=this._socket;e&&1===e.readyState&&e.close(),this._resetState(),c.prototype.unsubscribe.call(this)},r}(Subject_1.AnonymousSubject);exports.WebSocketSubject=WebSocketSubject;