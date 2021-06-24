/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/** 
 * © 2015 - 2021 aac services k.s. All rights reserved.
 * release: 2021.02.001
 * date: 2021-06-06 10:06:59
 * build: 2021.02.001.1622966819212
 **/
"use strict";var __decorate=this&&this.__decorate||function(e,s,r,i){var o,t=arguments.length,c=t<3?s:null===i?i=Object.getOwnPropertyDescriptor(s,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,s,r,i);else for(var n=e.length-1;0<=n;n--)(o=e[n])&&(c=(t<3?o(c):3<t?o(s,r,c):o(s,r))||c);return 3<t&&c&&Object.defineProperty(s,r,c),c},__metadata=this&&this.__metadata||function(e,s){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,s)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.SpiceUIModule=exports.SpiceUI=void 0;var platform_browser_dynamic_1=require("@angular/platform-browser-dynamic"),platform_browser_1=require("@angular/platform-browser"),animations_1=require("@angular/platform-browser/animations"),core_1=require("@angular/core"),forms_1=require("@angular/forms"),router_1=require("@angular/router"),http_1=require("@angular/common/http"),common_1=require("@angular/common"),systemcomponents_1=require("./systemcomponents/systemcomponents"),globalcomponents_1=require("./globalcomponents/globalcomponents"),objectcomponents_1=require("./objectcomponents/objectcomponents"),services_1=require("./services/services"),services_2=require("./services/services"),services_3=require("./services/services"),services_4=require("./services/services"),services_5=require("./services/services"),services_6=require("./services/services"),services_7=require("./services/services"),services_8=require("./services/services"),services_9=require("./services/services"),services_10=require("./services/services"),services_11=require("./services/services"),services_12=require("./services/services"),services_13=require("./services/services"),services_14=require("./services/services"),services_15=require("./services/services"),services_16=require("./services/services"),services_17=require("./services/services"),services_18=require("./services/services"),services_19=require("./services/services"),services_20=require("./services/services"),services_21=require("./services/services"),services_22=require("./services/services"),services_23=require("./services/services"),services_24=require("./services/services"),services_25=require("./services/services"),services_26=require("./services/services"),services_27=require("./services/services"),services_28=require("./services/services"),services_29=require("./services/services"),services_30=require("./services/services"),services_31=require("./services/services"),services_32=require("./services/services"),systemcomponents_2=require("./systemcomponents/systemcomponents"),globalcomponents_2=require("./globalcomponents/globalcomponents"),systemcomponents_3=require("./systemcomponents/systemcomponents"),globalcomponents_3=require("./globalcomponents/globalcomponents");moment.defaultFormat="YYYY-MM-DD HH:mm:ss";var SpiceUI=function(){function e(e){this.render=e,this.render.listen("window","dragover",function(e){e.preventDefault(),e.dataTransfer.effectAllowed="none",e.dataTransfer.dropEffect="none"}),this.render.listen("window","drop",function(e){e.preventDefault()})}return Object.defineProperty(e.prototype,"outletstyle",{get:function(){return{"margin-top":(this.globalHeader?this.globalHeader.headerHeight:0)+"px"}},enumerable:!1,configurable:!0}),__decorate([core_1.ViewChild(globalcomponents_3.GlobalHeader),__metadata("design:type",globalcomponents_3.GlobalHeader)],e.prototype,"globalHeader",void 0),e=__decorate([core_1.Component({selector:"spicecrm",template:"<global-header></global-header><div [ngStyle]='outletstyle'><router-outlet></router-outlet><system-navigation-manager></system-navigation-manager></div><global-footer></global-footer>"}),__metadata("design:paramtypes",[core_1.Renderer2])],e)}();exports.SpiceUI=SpiceUI;var SpiceUIModule=function(){function e(e,s){this.socket=e,this.assistant=s}return e=__decorate([core_1.NgModule({imports:[platform_browser_1.BrowserModule,animations_1.BrowserAnimationsModule,http_1.HttpClientModule,forms_1.FormsModule,systemcomponents_1.SystemComponents,globalcomponents_1.GlobalComponents,objectcomponents_1.ObjectComponents,router_1.RouterModule.forRoot([{path:"install",component:systemcomponents_2.SystemInstallerComponent},{path:"login",component:globalcomponents_2.GlobalLogin},{path:"",redirectTo:"/module/Home",pathMatch:"full"},{path:"**",component:systemcomponents_3.SystemDynamicRouteInterceptor,canActivate:[services_4.loginCheck]}])],declarations:[SpiceUI],entryComponents:[],bootstrap:[SpiceUI],providers:[services_8.aclCheck,services_27.assistant,services_17.backend,services_15.broadcast,services_18.canNavigateAway,services_2.configurationService,services_26.cookie,services_24.currency,services_16.dockedComposer,services_21.favorite,services_25.footer,services_13.fts,services_3.helper,services_10.language,services_29.layout,services_30.libloader,services_14.loader,{provide:common_1.LocationStrategy,useClass:common_1.HashLocationStrategy},services_1.loggerService,services_4.loginCheck,services_4.loginService,services_9.MathExpressionCompilerService,services_8.metadata,services_28.modal,services_19.modelutilities,services_8.noBack,services_18.navigation,services_11.recent,services_22.reminder,services_7.session,services_32.socket,services_31.telephony,services_23.territories,platform_browser_1.Title,services_1.loggerService,services_30.libloader,services_20.toast,services_12.userpreferences,services_6.notification,services_5.subscription]}),__metadata("design:paramtypes",[services_32.socket,services_27.assistant])],e)}();exports.SpiceUIModule=SpiceUIModule,core_1.enableProdMode(),document.documentMode?(document.getElementsByClassName("loaderspinner")[0].setAttribute("style","display:none"),document.getElementById("loadstatus").innerHTML="",document.getElementById("loadermessage").innerHTML="Internet Explorer is not supported. Please use a supported Browser like Chrome, Safari, Edge, etc."):(document.getElementById("loadstatus").innerHTML="...preparing..",platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(SpiceUIModule)),window.name="SpiceCRM",function(){if(window.hasOwnProperty("BroadcastChannel")){var s=new BroadcastChannel("spiceCRM_channel");s.onmessage=function(e){e.data.url&&e.data.url.startsWith(window.location.origin+window.location.pathname)&&(window.location=e.data.url,s.postMessage({urlReceived:!0}))}}}();