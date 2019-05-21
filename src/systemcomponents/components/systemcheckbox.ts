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
 * @module SystemComponents
 */
import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {language} from "../../services/language.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

/**
 * @ignore
 */
declare var _;

/**
 * a standard checkbox component, compatible with ngModel!
 */
@Component({
    selector: 'system-checkbox',
    templateUrl: './src/systemcomponents/templates/systemcheckbox.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemCheckbox),
            multi: true
        }
    ]
})
export class SystemCheckbox implements ControlValueAccessor {
    private id = _.uniqueId();  // needed to use inside the template for html ids... without, the click events will get confused...
    private _value: any = "1"; // the value used for the "value" attribute of the checkbox itself
    get value() {
        return this._value;
    }

    @Input()
    set value(val: any) {
        this._value = val;
    }

    private _model_value: any; // the value used for ngModel...
    get model_value() {
        return this._model_value;
    }

    set model_value(val) {
        if (val != this._model_value) {
            this.onChange(val);
        }

        this.writeValue(val);
    }

    private _checked = false;
    get checked(): boolean {
        return this._checked;
    }

    @Input()
    set checked(val: boolean) {
        this._checked = val;
    }

    @Input() private disabled = false;
    @Input() private label: string;

    @Output('toggle')
    @Output('click')
    public click$ = new EventEmitter<boolean>();
    @Output('check') private check$ = new EventEmitter();
    @Output('uncheck') private uncheck$ = new EventEmitter();

    constructor(
        private language: language
    ) {

    }

    private click() {
        if (this.disabled) return false;

        this.onTouched();

        this.checked = !this.checked;
        this.click$.emit(this.checked);
        if (this.checked) {
            this.check$.emit();
        } else {
            this.uncheck$.emit();
        }
    }

    // ControlValueAccessor implementation:
    private onChange(val: string){};// => void;
    public registerOnChange(fn: any): void {
        this.onChange = (val) => {
            fn(val);
        };
    }

    private onTouched(){};// => void;
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public writeValue(obj: any): void {
        this._model_value = obj;
        // if checked state and model state are different, model state (model_value) overrules!
        if (this.model_value && !this.checked) {
            this.checked = true;
        } else if (!this.model_value && this.checked) {
            this.checked = false;
        }
    }
}
