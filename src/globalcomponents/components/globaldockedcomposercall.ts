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
 * @module GlobalComponents
 */
import {
    Component,
    Input,
    ViewChild,
    ViewContainerRef,
    OnInit
} from '@angular/core';
import {dockedComposer} from '../../services/dockedcomposer.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';
import {modal} from '../../services/modal.service';

@Component({
    selector: 'global-docked-composer-call',
    templateUrl: './src/globalcomponents/templates/globaldockedcomposercall.html'
})
export class GlobalDockedComposerCall implements OnInit {

    @ViewChild('containercontent', {read: ViewContainerRef}) private containercontent: ViewContainerRef;

    @Input() public calldata: any = {};

    private searching: boolean = true;
    private contact: any = {};
    private isClosed: boolean = false;

    constructor(private backend: backend, private dockedComposer: dockedComposer, private language: language, private ViewContainerRef: ViewContainerRef) {

    }

    get callicon() {
        if (this.calldata.callevent == 'END') {
            return 'end_call';
        }

        switch (this.calldata.direction) {
            case 'INBOUND':
                return 'incoming_call';
            case 'OUTBOUND':
                return 'outbound_call';
        }

        return 'call';
    }

    public ngOnInit() {
        this.backend.postRequest('search', {}, {
            modules: 'Contacts',
            searchterm: this.calldata.callnumber
        }).subscribe(results => {
            try {
                this.contact = results.Contacts.hits[0]._source;
                this.searching = false;
            } catch (err) {
                this.searching = false;
            }
        });
    }

    private closeComposer() {
        let i = 0;
        this.dockedComposer.calls.some(call => {
            if (call.callid == this.calldata.callid) {
                this.dockedComposer.calls.splice(i, 1);
                return true;
            }
            i++;
        });
    }
}
