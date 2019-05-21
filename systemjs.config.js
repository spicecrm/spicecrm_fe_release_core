(function (global) {
    System.config({
        paths: {
            'vendor:': 'vendor/'
        },
        map: {
            app: 'src',
            '@angular/core': 'vendor:@angular/core.umd.min.js?v=7.2.13',
            '@angular/common': 'vendor:@angular/common.umd.min.js?v=7.2.13',
            '@angular/common/http': 'vendor:@angular/common-http.umd.min.js?v=7.2.13',
            '@angular/compiler': 'vendor:@angular/compiler.umd.min.js?v=7.2.13',
            '@angular/platform-browser': 'vendor:@angular/platform-browser.umd.min.js?v=7.2.13',
            '@angular/platform-browser-dynamic': 'vendor:@angular/platform-browser-dynamic.umd.min.js?v=7.2.13',
            '@angular/platform-browser/animations': 'vendor:@angular/platform-browser-animations.umd.min.js?v=7.2.13',
            '@angular/animations': 'vendor:@angular/animations.umd.min.js?v=7.2.13',
            '@angular/animations/browser': 'vendor:@angular/animations-browser.umd.min.js?v=7.2.13',
            '@angular/router': 'vendor:@angular/router.umd.min.js?v=7.2.13',
            '@angular/forms': 'vendor:@angular/forms.umd.min.js?v=7.2.13',
            '@angular/upgrade': 'vendor:@angular/upgrade.umd.min.js?v=7.2.13',
            '@angular/cdk/drag-drop': 'vendor:@angular/cdk-drag-drop.umd.min.js?v=7.3.7',
            '@angular/cdk/coercion': 'vendor:@angular/cdk-coercion.umd.min.js?v=7.3.7',
            '@angular/cdk/platform': 'vendor:@angular/cdk-platform.umd.min.js?v=7.3.7',
            '@angular/cdk/scrolling': 'vendor:@angular/cdk-scrolling.umd.min.js?v=7.3.7',
            '@angular/cdk/bidi': 'vendor:@angular/cdk-bidi.umd.min.js?v=7.3.7',
            '@angular/cdk/collections': 'vendor:@angular/cdk-collections.umd.min.js?v=7.3.7',
            'socket.io-client': 'vendor:socket.io-client/dist/socket.io.js',
            'rxjs': 'vendor:rxjs',
            'rxjs/ajax': 'vendor:rxjs/ajax/index.js',
            'rxjs/internal-compatibility': 'vendor:rxjs/internal-compatibility/index.js',
            'rxjs/operators': 'vendor:rxjs/operators/index.js',
            'rxjs/testing': 'vendor:rxjs/testing/index.js',
            'rxjs/webSocket': 'vendor:rxjs/webSocket/index.js',
            'tslib': 'vendor:tslib/tslib.js',
            'google-auth-library': 'vendor:google-auth-library',
            'hammerjs': 'vendor:hammerjs/hammer.min.js',
        },
        packages: {
            'app': {
                main: './spiceui',
                defaultExtension: 'js?v=201905001'
            },
            rxjs: {
                main: "index.js",
                defaultExtension: 'js'
            }
        }
    });
})(this);
