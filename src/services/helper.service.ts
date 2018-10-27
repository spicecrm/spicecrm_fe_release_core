/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Injectable} from '@angular/core';
// import {metadata} from './metadata.service';
// import {footer} from './footer.service';
import {Subject, Observable} from 'rxjs';
import {modal} from './modal.service';
//import any = jasmine.any;

@Injectable()
export class helper {

    dialog: any = null;

    private _base64_keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    constructor( private modalservice: modal ) {} // private metadata: metadata, private footer: footer

    confirm( title, message ): Observable<boolean> {

        /*
        // For compatibility reasons this method is not deleted. It triggers "prompt" of modal service.
        // This is the old code:
        let retSubject = new Subject();
        this.metadata.addComponent( 'SystemConfirmDialog', this.footer.footercontainer ).subscribe( dialog => {
            dialog.instance['title'] = title;
            dialog.instance['message'] = message;

            dialog.instance['answer'].subscribe( answer => {
                // destroy the dialog
                this.dialog.destroy();
                this.dialog = null;

                // return the answer
                retSubject.next( answer );
                retSubject.complete();
            } )

            this.dialog = dialog;
        } )
        */

        let retSubject = new Subject<any>();
        this.modalservice.confirm( message, title ).subscribe( ( answer ) => {
            retSubject.next( answer );
            retSubject.complete();
        });
        return retSubject.asObservable();

    }

    shuffle( array: Array<any> ): Array<any> {
        var m = array.length, t, i;
        // While there remain elements to shuffle…
        while ( m ) {
            // Pick a remaining element…
            i = Math.floor( Math.random() * m-- );
            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }

    encodeBase64(e) {
        var t = '', n, r, i, s, o, u, a, f = 0;
        e = this._utf8_encodeBase64(e);
        while ( f < e.length ) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = ( n & 3 ) << 4 | r >> 4;
            u = ( r & 15 ) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64;
            } else if (isNaN(i)) {
                a = 64;
            }
            t = t + this._base64_keyStr.charAt(s) + this._base64_keyStr.charAt(o) + this._base64_keyStr.charAt(u) + this._base64_keyStr.charAt(a);
        }
        return t;
    }

    decodeBase64(e) {
        var t = '', n, r, i, s, o, u, a, f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, '');
        while ( f<e.length ) {
            s = this._base64_keyStr.indexOf(e.charAt(f++));
            o = this._base64_keyStr.indexOf(e.charAt(f++));
            u = this._base64_keyStr.indexOf(e.charAt(f++));
            a = this._base64_keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = ( o & 15 ) << 4 | u >> 2;
            i = ( u & 3 ) << 6 | a;
            t = t + String.fromCharCode(n);
            if ( u!=64 ) t = t + String.fromCharCode(r);
            if ( a!=64 ) t = t + String.fromCharCode(i);
        }
        t = this._utf8_decodeBase64(t);
        return t;
    }

    private _utf8_encodeBase64(e) {
        var t='';
        e = e.replace(/\r\n/g,"\n");
        for (var n = 0; n < e.length; n++ ) {
            var r = e.charCodeAt(n);
            if ( r < 128 ) {
                t += String.fromCharCode(r);
            } else if ( r > 127 && r < 2048 ) {
                t += String.fromCharCode(r >> 6 | 192 );
                t += String.fromCharCode(r & 63 | 128 );
            } else {
                t += String.fromCharCode(r >> 12 | 224 );
                t += String.fromCharCode(r >> 6 & 63 | 128 );
                t += String.fromCharCode(r & 63 | 128 );
            }
        }
        return t;
    }

    private _utf8_decodeBase64(e) {
        var t='', n=0, r=0, c1=0, c2=0, c3=0;
        while ( n < e.length ) {
            r = e.charCodeAt(n);
            if ( r < 128 ) {
                t += String.fromCharCode(r);
                n++;
            } else if ( r > 191 && r < 224 ) {
                c2 = e.charCodeAt(n+1);
                t += String.fromCharCode(( r & 31 ) << 6 | c2 & 63 );
                n += 2;
            } else {
                c2 = e.charCodeAt(n+1);
                c3 = e.charCodeAt(n+2);
                t += String.fromCharCode(( r & 15 ) << 12 | ( c2 & 63 ) << 6 | c3 & 63 );
                n += 3;
            }
        }
        return t;
    }

}