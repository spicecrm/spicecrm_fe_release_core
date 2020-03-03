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
 * @module SpiceImporterModule
 */
import {Component, OnInit} from '@angular/core';

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {navigation} from '../../../services/navigation.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';

/**
 * @ignore
 */
declare var _: any;

@Component({
    templateUrl: './src/include/exchange/templates/exchangeusersettings.html',
})
export class ExchangeUserSettings implements OnInit {

    /**
     * holds the folders that can be subscribed to
     */
    private subscriptionOptions: any[] = ['contacts', 'calendar', 'tasks'];

    /**
     * a list of actrive subscriptions
     */
    private subscriptions: any[] = [];

    constructor(private model: model, private backend: backend) {

    }

    /**
     * load the active subscriptions
     */
    public ngOnInit(): void {
        this.loadSubscriptions();
    }

    /**
     * subscribe to a folder
     */
    private subscribe() {
        this.backend.postRequest(`spicecrmexchange/subscriptions/${this.model.id}/subscribe`).subscribe(response => {
            console.log(response);
        });
    }

    /**
     * subscribe to a folder
     */
    private reload() {
        this.loadSubscriptions();
    }

    /**
     * loads the subscriptions
     */
    private loadSubscriptions() {
        this.subscriptions = [];
        this.backend.getRequest(`spicecrmexchange/subscriptions/${this.model.id}`).subscribe(subscriptions => {
            this.subscriptions = subscriptions;
        });
    }


    /**
     * returns the last active date if there is one
     *
     * @param folder_id
     */
    private lastActive(folder_id) {
        let sub = this.subscriptions.find(sub => sub.folder_id == folder_id);
        return sub ? sub.last_active : '';
    }

    private getSubscriptionIcon(folder_id){
        let sub = this.subscriptions.find(sub => sub.folder_id == folder_id);
        return sub && sub.subscriptionid ? 'check' : 'add';
    }

    /**
     * returns the last active date if there is one
     *
     * @param folder_id
     */
    private toggle(folder_id) {
        let sub = this.subscriptions.find(sub => sub.folder_id == folder_id);
        if (sub && sub.subscriptionid) {
            this.backend.deleteRequest(`spicecrmexchange/subscriptions/${this.model.id}/${folder_id}`).subscribe(response => {
                this.reload();
            });
        } else {
            this.backend.postRequest(`spicecrmexchange/subscriptions/${this.model.id}/${folder_id}`).subscribe(response => {
                this.reload();
            });
        }
    }
}
