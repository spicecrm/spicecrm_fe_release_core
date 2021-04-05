/** 
 * © 2015 - 2021 aac services k.s. All rights reserved.
 * release: 2021.01.001
 * date: 2021-04-05 19:09:19
 * build: 2021.01.001.1617642559557
 **/
"use strict";var __decorate=this&&this.__decorate||function(e,r,s,o){var i,t=arguments.length,c=t<3?r:null===o?o=Object.getOwnPropertyDescriptor(r,s):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,r,s,o);else for(var n=e.length-1;0<=n;n--)(i=e[n])&&(c=(t<3?i(c):3<t?i(r,s,c):i(r,s))||c);return 3<t&&c&&Object.defineProperty(r,s,c),c},__metadata=this&&this.__metadata||function(e,r){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,r)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.SpiceUIModule=exports.SpiceUI=void 0;var platform_browser_dynamic_1=require("@angular/platform-browser-dynamic"),platform_browser_1=require("@angular/platform-browser"),animations_1=require("@angular/platform-browser/animations"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),router_1=require("@angular/router"),http_1=require("@angular/common/http"),common_1=require("@angular/common"),systemcomponents_1=require("./systemcomponents/systemcomponents"),globalcomponents_1=require("./globalcomponents/globalcomponents"),objectcomponents_1=require("./objectcomponents/objectcomponents"),services_1=require("./services/services"),services_2=require("./services/services"),services_3=require("./services/services"),services_4=require("./services/services"),services_5=require("./services/services"),services_6=require("./services/services"),services_7=require("./services/services"),services_8=require("./services/services"),services_9=require("./services/services"),services_10=require("./services/services"),services_11=require("./services/services"),services_12=require("./services/services"),services_13=require("./services/services"),services_14=require("./services/services"),services_15=require("./services/services"),services_16=require("./services/services"),services_17=require("./services/services"),services_18=require("./services/services"),services_19=require("./services/services"),services_20=require("./services/services"),services_21=require("./services/services"),services_22=require("./services/services"),services_23=require("./services/services"),services_24=require("./services/services"),services_25=require("./services/services"),services_26=require("./services/services"),services_27=require("./services/services"),services_28=require("./services/services"),services_29=require("./services/services"),services_30=require("./services/services"),systemcomponents_2=require("./systemcomponents/systemcomponents"),globalcomponents_2=require("./globalcomponents/globalcomponents"),systemcomponents_3=require("./systemcomponents/systemcomponents"),globalcomponents_3=require("./globalcomponents/globalcomponents");moment.defaultFormat="YYYY-MM-DD HH:mm:ss";var SpiceUI=function(){function e(e){this.render=e,this.render.listen("window","dragover",function(e){e.preventDefault(),e.dataTransfer.effectAllowed="none",e.dataTransfer.dropEffect="none"}),this.render.listen("window","drop",function(e){e.preventDefault()})}return Object.defineProperty(e.prototype,"outletstyle",{get:function(){return{"margin-top":(this.globalHeader?this.globalHeader.headerHeight:0)+"px"}},enumerable:!1,configurable:!0}),__decorate([core_1.ViewChild(globalcomponents_3.GlobalHeader),__metadata("design:type",globalcomponents_3.GlobalHeader)],e.prototype,"globalHeader",void 0),__decorate([core_1.Component({selector:"spicecrm",template:"<global-header></global-header><div [ngStyle]='outletstyle'><router-outlet></router-outlet><system-navigation-manager></system-navigation-manager></div><global-footer></global-footer>"}),__metadata("design:paramtypes",[core_1.Renderer2])],e)}();exports.SpiceUI=SpiceUI;var SpiceUIModule=function(){function e(e){this.socket=e}return __decorate([core_1.NgModule({imports:[platform_browser_1.BrowserModule,animations_1.BrowserAnimationsModule,http_1.HttpClientModule,forms_1.FormsModule,systemcomponents_1.SystemComponents,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,router_1.RouterModule.forRoot([{path:"install",component:systemcomponents_2.SystemInstallerComponent},{path:"login",component:globalcomponents_2.GlobalLogin},{path:"",redirectTo:"/module/Home",pathMatch:"full"},{path:"**",component:systemcomponents_3.SystemDynamicRouteInterceptor,canActivate:[services_4.loginCheck]}])],declarations:[SpiceUI],entryComponents:[],bootstrap:[SpiceUI],providers:[services_6.aclCheck,services_25.assistant,services_15.backend,services_13.broadcast,services_16.canNavigateAway,services_2.configurationService,services_24.cookie,services_22.currency,services_14.dockedComposer,services_19.favorite,services_23.footer,services_11.fts,services_3.helper,services_8.language,services_27.layout,services_28.libloader,services_12.loader,{provide:common_1.LocationStrategy,useClass:common_1.HashLocationStrategy},services_1.loggerService,services_4.loginCheck,services_4.loginService,services_7.MathExpressionCompilerService,services_6.metadata,services_26.modal,services_17.modelutilities,services_6.noBack,services_16.navigation,services_9.recent,services_20.reminder,services_5.session,services_30.socket,services_29.telephony,services_21.territories,platform_browser_1.Title,services_1.loggerService,services_28.libloader,services_18.toast,services_10.userpreferences]}),__metadata("design:paramtypes",[services_30.socket])],e)}();exports.SpiceUIModule=SpiceUIModule,core_1.enableProdMode(),document.documentMode?(document.getElementsByClassName("loaderspinner")[0].setAttribute("style","display:none"),document.getElementById("loadstatus").innerHTML="",document.getElementById("loadermessage").innerHTML="Internet Explorer is not supported. Please use a supported Browser like Chrome, Safari, Edge, etc."):(document.getElementById("loadstatus").innerHTML="...preparing..",platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(SpiceUIModule)),window.name="SpiceCRM",function(){var r;window.hasOwnProperty("BroadcastChannel")&&((r=new BroadcastChannel("spiceCRM_channel")).onmessage=function(e){e.data.url&&e.data.url.startsWith(window.location.origin+window.location.pathname)&&(window.location=e.data.url,r.postMessage({urlReceived:!0}))})}();