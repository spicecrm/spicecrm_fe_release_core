"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var Observable_1=require("../Observable"),subscribeToIterable_1=require("../util/subscribeToIterable"),scheduleIterable_1=require("../scheduled/scheduleIterable");function fromIterable(e,r){if(!e)throw new Error("Iterable cannot be null");return r?scheduleIterable_1.scheduleIterable(e,r):new Observable_1.Observable(subscribeToIterable_1.subscribeToIterable(e))}exports.fromIterable=fromIterable;