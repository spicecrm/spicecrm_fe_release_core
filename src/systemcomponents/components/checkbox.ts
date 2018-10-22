/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {language} from "../../services/language.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

declare var _;

/**
 * a standard checkbox component, compatible with ngModel!
 * created by: sebastian franz at 2018-07-19
 */
@Component({
    selector: 'system-checkbox',
    templateUrl: './src/systemcomponents/templates/checkbox.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemCheckbox),
            multi: true
        }
    ]
})
export class SystemCheckbox implements ControlValueAccessor
{
    id = _.uniqueId();  // needed to use inside the template for html ids... without, the click events will get confused...
    private _value:any = "1"; // the value used for the "value" attribute of the checkbox itself
    get value(){    return this._value; }
    @Input()
    set value(val:any)
    {
        this._value = val;
    }
    private _model_value:any; // the value used for ngModel...
    get model_value(){  return this._model_value;   }
    set model_value(val)
    {
        if(val != this._model_value)
            this.onChange(val);

        this.writeValue(val);
    }
    private _checked = false;
    get checked():boolean{  return this._checked;    }
    @Input()
    set checked(val:boolean)
    {
        //console.log('setting checked with', val);
        this._checked = val;
        /*
        if(val)
            this._model_value = this._value;
        else
            this._model_value = false;
        */
    }
    @Input() disabled = false;
    @Input() label:string;

    @Output('toggle')
    @Output('click')
    click$ = new EventEmitter<boolean>();
    @Output('check') check$ = new EventEmitter();
    @Output('uncheck') uncheck$ = new EventEmitter();

    constructor(
        private language: language
    ){

    }

    click()
    {
        if(this.disabled)
            return false;

        this.onTouched();

        this.checked = !this.checked;
        this.click$.emit(this.checked);
        if(this.checked) {
            //this.writeValue(this.value);
            this.check$.emit();
        }
        else
        {
            //this.writeValue(null);
            this.uncheck$.emit();
        }
    }

    //ControlValueAccessor implementation:
    private onChange = (val) => {};
    registerOnChange(fn: any): void {
        //this.onChange = fn;
        this.onChange = (val) => {
            //console.log('Propagating change', val);
            fn(val);
        }
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    private onTouched = () => {};

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(obj: any): void
    {
        //console.log('write value with:', obj);
        if(this.disabled)
            return;

        this._model_value = obj;
        // if checked state and model state are different, model state (model_value) overrules!
        if(this.model_value && !this.checked)
            this.checked = true;
        else if(!this.model_value && this.checked)
            this.checked = false;
    }

}