/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Injectable, EventEmitter} from '@angular/core';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {Observable, Subject} from 'rxjs';

declare var moment: any;


@Injectable()
export class reminder {

    public reminders: any[] = [];
    public loaded$: EventEmitter<boolean> = new EventEmitter<boolean>()

    constructor(private backend: backend, private broadcast: broadcast, private configurationService: configurationService, private session: session) {
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    private handleMessage(message: any) {
        switch (message.messagetype) {
            case 'model.save':
                this.reminders.some((item, index) => {
                    if (item.module_name === message.messagedata.module && item.item_id == message.messagedata.id) {
                        this.reminders[index].item_summary = message.messagedata.data.summary_text;
                        return true;
                    }
                });
                break;
        }
    }

    public loadReminders(loadhandler: Subject<string>) {
        if (sessionStorage[window.btoa('reminders'+this.session.authData.sessionId)] && sessionStorage[window.btoa('reminders'+this.session.authData.sessionId)].length > 0 && !this.configurationService.data.developerMode) {
            this.reminders = this.session.getSessionData('reminders');
            loadhandler.next('loadReminders');
        } else {
            this.backend.getRequest('spiceui/core/reminders').subscribe(rem => {
                this.session.setSessionData('reminders',rem);
                for(let reminder of rem){
                    reminder.reminder_date = moment.utc(reminder.reminder_date);
                    this.reminders.push(reminder);
                }
                this.loaded$.emit(true);
                delete(this.loaded$);
                loadhandler.next('loadReminders');
            });
        }
    }

    public getReminder(module, id): any {
        let reminderDate = false;
        this.reminders.some(rem => {
            if (rem.module_name === module && rem.item_id === id) {
                reminderDate =  rem.reminder_date;
                return true;
            }
        });
        return reminderDate;
    }

    public getReminders() {
        let retArr = [];
        for (let reminder of this.reminders) {
            if (reminder.module_name === module){
                retArr.push({
                    item_id: reminder.item_id,
                    item_summary: reminder.item_summary
                });
            }
        }

        return retArr;
    }

    public setReminder(model, reminderDate) {
        this.backend.postRequest('spiceui/core/reminders/' + model.module + '/' + model.id + '/' + reminderDate.format('YYYY-MM-DD')).subscribe((fav : any) => {
            this.reminders.splice(0, 0, {
                item_id: model.id,
                module_name: model.module,
                item_summary: model.data.summary_text,
                reminder_date: reminderDate
            });
        });
    }

    public deleteReminder(module, id): Observable<any> {
        let retSubject = new Subject<any>();
        this.backend.deleteRequest('spiceui/core/reminders/' + module + '/' + id).subscribe(fav => {
            this.reminders.some((rem, remindex) => {
                if (rem.module_name === module && rem.item_id === id) {
                    this.reminders.splice(remindex, 1);
                    return true;
                }
            });
            retSubject.next(true);
            retSubject.complete();
        });
        return retSubject.asObservable();
    }

}
