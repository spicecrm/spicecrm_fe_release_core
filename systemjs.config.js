(function (global) {
    System.config({
        paths: {
            'vendor:': 'vendor/'
        },
        map: {
            app: 'src',
            '@angular/core': 'vendor:@angular/core/bundles/core.umd.min.js',
            '@angular/common': 'vendor:@angular/common/bundles/common.umd.min.js',
            '@angular/common/http': 'vendor:@angular/common/bundles/common-http.umd.js',
            '@angular/compiler': 'vendor:@angular/compiler/bundles/compiler.umd.min.js',
            '@angular/platform-browser': 'vendor:@angular/platform-browser/bundles/platform-browser.umd.min.js',
            '@angular/platform-browser-dynamic': 'vendor:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.min.js',
            '@angular/router': 'vendor:@angular/router/bundles/router.umd.min.js',
            '@angular/forms': 'vendor:@angular/forms/bundles/forms.umd.min.js',
            '@angular/upgrade': 'vendor:@angular/upgrade/bundles/upgrade.umd.min.js',
            'rxjs': 'vendor:rxjs',
            'rxjs-compat': 'vendor:rxjs-compat',
            'rxjs/ajax': 'vendor:rxjs/ajax/index.js',
            'rxjs/internal-compatibility': 'vendor:rxjs/internal-compatibility/index.js',
            'rxjs/operators': 'vendor:rxjs/operators/index.js',
            'rxjs/testing': 'vendor:rxjs/testing/index.js',
            'rxjs/webSocket': 'vendor:rxjs/webSocket/index.js',
            'tslib': 'vendor:tslib/tslib.js',
            'google-auth-library': 'vendor:google-auth-library'
        },
        packages: {
            app: {
                main: './spiceui.js',
                defaultExtension: 'js'
            },
            rxjs: {
                main: "index.js",
                defaultExtension: 'js'
            },
            "rxjs-compat": {
                main: "index.js",
                defaultExtension: "js"
            }
        }
    });
})(this);
