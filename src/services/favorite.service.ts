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
 * @module services
 */
import {Injectable} from '@angular/core';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {modelutilities} from './modelutilities.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';


@Injectable()
export class favorite {

    public isFavorite: boolean = false;
    public isEnabled: boolean = false;

    private currentModule: string = '';
    private currentId: string = '';

    constructor(
        private backend: backend,
        private broadcast: broadcast,
        private configuration: configurationService,
        private session: session
    ) {
        this.broadcast.message$.subscribe(message => this.handleMessage(message))
    }

    get favorites() {
        let favorites = this.configuration.getData('favorites')
        return favorites ? favorites : [];
    }

    private handleMessage(message: any) {
        switch (message.messagetype) {

            case 'model.save':
                this.favorites.some((item, index) => {
                    if (item.module_name === message.messagedata.module && item.item_id == message.messagedata.id) {
                        this.favorites[index].item_summary = message.messagedata.data.summary_text;
                        return true;
                    }
                });

                break;
        }
    }

    public enable(module: string, id: string) {
        this.isEnabled = true;

        this.currentModule = module;
        this.currentId = id;

        this.favorites.some(fav => {
            if (fav.module_name === module && fav.item_id === id) {
                this.isFavorite = true;
                return true;
            }
        });

    }

    public disable() {
        this.isEnabled = false;
        this.isFavorite = false;
    }

    public getFavorites(module) {
        let retArr = [];
        for (let favorite of this.favorites) {
            if (favorite.module_name === module) {
                retArr.push({
                    item_id: favorite.item_id,
                    item_summary: favorite.item_summary
                });
            }
        }

        return retArr;
    }

    public setFavorite() {
        this.backend.postRequest('SpiceFavorites/' + this.currentModule + '/' + this.currentId).subscribe((fav: any) => {
            this.favorites.splice(0, 0, {
                item_id: fav.id,
                module_name: fav.module,
                item_summary: fav.summary_text
            });

            this.isFavorite = true;
        });
    }

    public deleteFavorite() {
        this.backend.deleteRequest('SpiceFavorites/' + this.currentModule + '/' + this.currentId).subscribe(fav => {
            this.favorites.some((fav, favindex) => {
                if (fav.module_name === this.currentModule && fav.item_id === this.currentId) {
                    this.favorites.splice(favindex, 1);
                    return true;
                }
            });

            this.isFavorite = false;
        });
    }

}
