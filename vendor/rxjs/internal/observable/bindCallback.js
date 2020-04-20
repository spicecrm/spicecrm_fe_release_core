"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var Observable_1=require("../Observable"),AsyncSubject_1=require("../AsyncSubject"),map_1=require("../operators/map"),canReportError_1=require("../util/canReportError"),isArray_1=require("../util/isArray"),isScheduler_1=require("../util/isScheduler");function bindCallback(u,c,s){if(c){if(!isScheduler_1.isScheduler(c))return function(){for(var r=[],e=0;e<arguments.length;e++)r[e]=arguments[e];return bindCallback(u,s).apply(void 0,r).pipe(map_1.map(function(r){return isArray_1.isArray(r)?c.apply(void 0,r):c(r)}))};s=c}return function(){for(var c=[],r=0;r<arguments.length;r++)c[r]=arguments[r];var t,a=this,n={context:a,subject:t,callbackFunc:u,scheduler:s};return new Observable_1.Observable(function(r){if(s){var e={args:c,subscriber:r,params:n};return s.schedule(dispatch,0,e)}if(!t){t=new AsyncSubject_1.AsyncSubject;try{u.apply(a,c.concat([function(){for(var r=[],e=0;e<arguments.length;e++)r[e]=arguments[e];t.next(r.length<=1?r[0]:r),t.complete()}]))}catch(r){canReportError_1.canReportError(t)?t.error(r):console.warn(r)}}return t.subscribe(r)})}}function dispatch(r){var t=this,e=r.args,c=r.subscriber,a=r.params,n=a.callbackFunc,u=a.context,s=a.scheduler,i=a.subject;if(!i){i=a.subject=new AsyncSubject_1.AsyncSubject;try{n.apply(u,e.concat([function(){for(var r=[],e=0;e<arguments.length;e++)r[e]=arguments[e];var c=r.length<=1?r[0]:r;t.add(s.schedule(dispatchNext,0,{value:c,subject:i}))}]))}catch(r){i.error(r)}}this.add(i.subscribe(c))}function dispatchNext(r){var e=r.value,c=r.subject;c.next(e),c.complete()}function dispatchError(r){var e=r.err;r.subject.error(e)}exports.bindCallback=bindCallback;