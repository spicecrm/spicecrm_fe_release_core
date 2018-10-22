/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Injectable} from '@angular/core';
import { metadata } from '../../services/metadata.service';
import { backend } from '../../services/backend.service';
import { modelutilities } from '../../services/modelutilities.service';

declare var moment: any;

@Injectable()
export class objectnote {

    notes: Array<any> = [];
    module: string = '';
    id: string = '';

    constructor(private backend: backend, private modelutilities: modelutilities) {
    }

    getNotes(){
        this.backend.getRequest('module/'+this.module+'/'+this.id+'/note').subscribe(notes => {
            for(let thisNote of notes){
                //thisNote.date = new Date(Date.parse(thisNote.date));
                thisNote.date =   moment.utc(thisNote.date);
                thisNote.global = thisNote.global === '1' || thisNote.global === true ? true : false;
                this.notes.push(thisNote);
            }
        })
    }

    addNote(note, isPrivate){
        this.backend.postRequest('module/'+this.module+'/'+this.id+'/note', {}, {text: note, global: !isPrivate}).subscribe((notes : any ) => {
            for(let thisNote of notes){
                //thisNote.date = new Date(Date.parse(thisNote.date));
                thisNote.date =   moment.utc(thisNote.date);
                thisNote.global = thisNote.global === '1' || thisNote.global === true ? true : false;
                this.notes.unshift(thisNote);
            }
        })
    }

    deleteNote(id){
        this.backend.deleteRequest('module/'+this.module+'/'+this.id+'/note/'+id).subscribe((notes : any ) => {
            this.notes.some((note, index) => {
                if(note.id === id){
                    this.notes.splice(index, 1);
                    return true;
                }
            })
        })
    }
}