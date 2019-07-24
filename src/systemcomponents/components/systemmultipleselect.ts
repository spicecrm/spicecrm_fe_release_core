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
import {
    Component,
    ElementRef, forwardRef,
    Input,
    OnChanges,
    Renderer2,
} from '@angular/core';
import {language} from '../../services/language.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

declare var _;

@Component({
    selector: 'system-multiple-select',
    templateUrl: './src/systemcomponents/templates/systemmultipleselect.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemMultipleSelect),
            multi: true
        }
    ]
})


/*
* listItems = {[key: string]: string}
* [ngModel] = string[]
* */

export class SystemMultipleSelect implements OnChanges, ControlValueAccessor {
    @Input() public disabled: boolean = false;
    @Input() public grouped: boolean = false;
    @Input() public showPills: boolean = true;
    @Input() public listItems: any = {};
    @Input() public listHeight: string = '7';
    @Input() public groupSeparator: string = '_';

    public parsedListItems: any = {};
    public valueArray: any[] = [];
    private isOpen: boolean = false;
    private clickListener: any;
    private selectedCountText: string = '0 Selected Items';
    private inputTagStyle: any = {
        color: 'transparent',
        cursor: 'pointer'
    };

    // ControlValueAccessor
    private onChange: (value: any[]) => void;
    private onTouched: () => void;

    constructor(private elementRef: ElementRef, private renderer: Renderer2, private language: language) {
    }

    get showEmptyText(): boolean {
        return this.valueArray.filter(value => value.includes(this.groupSeparator)).length == 0;
    }

    get listClass(): string {
        return this.isOpen ? 'slds-is-open' : '';
    }

    get dropdownIcon(): string {
        return this.isOpen ? 'up' : 'down';
    }

    get dropdownLength(): string {
        return 'slds-dropdown_length-' + this.listHeight;
    }

    public ngOnChanges(): void {
        this.buildOptionGroups();
    }

    // ControlValueAccessor
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    // ControlValueAccessor
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    // ControlValueAccessor
    public writeValue(value: any): void {
        if (value) {
            this.valueArray = value;
            this.setSelectedCountText();
        }
    }

    private buildOptionGroups(): void {
        this.parsedListItems = {};
        let newListItems;

        if (this.grouped) {
            newListItems = {};
            // define groups
            for (let optionKey in this.listItems) {
                if (this.listItems.hasOwnProperty(optionKey) && !optionKey.includes(this.groupSeparator)) {
                    newListItems[optionKey] = {
                        value: optionKey,
                        display: this.listItems[optionKey],
                        disabled: false,
                        items: []
                    };
                }
            }

            // define group items
            for (let optionKey in this.listItems) {
                if (this.listItems.hasOwnProperty(optionKey)) {
                    const enumValue = optionKey.split(this.groupSeparator);
                    if (enumValue.length == 2 && newListItems[enumValue[0]]) {
                        newListItems[enumValue[0]].items.push({
                            value: optionKey,
                            display: this.listItems[optionKey]
                        });
                    }
                }
            }
            this.parsedListItems = _.toArray(newListItems);
        } else {
            // define parsedListItems
            newListItems = [];
            for (let optionKey in this.listItems) {
                if (this.listItems.hasOwnProperty(optionKey)) {
                    newListItems.push({
                        value: optionKey,
                        display: this.listItems[optionKey]
                    });
                }
            }
            this.parsedListItems = newListItems;
        }
    }

    private isSelected(itemValue): boolean {
        return this.valueArray.indexOf(itemValue) > -1;
    }

    private onclick(): void {
        this.isOpen = !this.isOpen;
    }

    private onMouseLeave(): void {
        if (this.clickListener) this.clickListener();
        if (this.isOpen) {
            this.clickListener = this.renderer
                .listen('document', 'click', (event) => this.handleCloseDropdown(event));
        }
    }

    public handleCloseDropdown(event: MouseEvent): void {
        const clickIsInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickIsInside) {
            this.isOpen = false;
            this.clickListener();
        }
    }

    private toggleAddRemoveItem(itemValue: string, listGroupValue?: string): void {
        const itemValueIndex = this.valueArray.indexOf(itemValue);
        let listGroupIndex = this.valueArray.indexOf(listGroupValue);

        if (itemValueIndex > -1) {
            this.valueArray.splice(itemValueIndex, 1);
            if (listGroupValue && !this.groupHasItems(listGroupValue)) {
                listGroupIndex = this.valueArray.indexOf(listGroupValue);
                this.valueArray.splice(listGroupIndex, 1);
            }
        } else {
            if (listGroupValue && listGroupIndex == -1) {
                this.valueArray.push(listGroupValue);
            }
            this.valueArray.push(itemValue);
        }

        this.setSelectedCountText();
        this.onChange(this.valueArray);
    }

    private groupHasItems(groupValue) {
        return this.valueArray.some(item => {
            const itemArray = item.split(this.groupSeparator);
            return (itemArray.length == 2 && itemArray[0] == groupValue);
        });
    }

    private trackByFn(index, item) {
        return index;
    }

    private removeItem(index, value) {
        const itemGroup = value.split(this.groupSeparator)[0];
        this.valueArray.splice(index, 1);
        if (!this.groupHasItems(itemGroup)) {
            const itemGroupIndex = this.valueArray.indexOf(itemGroup);
            this.valueArray.splice(itemGroupIndex, 1);
        }
        this.setSelectedCountText();
        this.onChange(this.valueArray);
    }

    private setSelectedCountText(): void {
        this.selectedCountText = this.valueArray.filter(value => value.includes(this.groupSeparator)).length + ' selected items';
    }
}
