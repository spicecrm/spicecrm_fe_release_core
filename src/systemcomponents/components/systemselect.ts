/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    Renderer2,
    SimpleChanges
} from "@angular/core";
import {language} from "../../services/language.service";

@Component({
    selector: "system-select",
    templateUrl: "./src/systemcomponents/templates/systemselect.html"
})
export class SystemSelect implements OnChanges {
    @Input() public selectList: any = [];
    @Input() public label: string = "";
    @Input() public selectedItem: any;
    @Input() public disabled: boolean = false;

    @Output() public selectedOutputItem: EventEmitter<any> = new EventEmitter<any>();

    private searchList: any = [];
    private show_list: boolean = false;
    private clickListener: any;

    private inputValue: string = "";
    private selectedItemId: string = "";

    constructor(private elementRef: ElementRef, private renderer: Renderer2, private language: language) {


    }

    //  -- INPUT LIST STRUCTURE --
    // id
    // name
    // group

    public ngOnChanges(changes: SimpleChanges) {
        if(changes.selectList !== undefined) {
            let result = this.listBuilder(this.selectList);
            this.searchList = result;

        }
        if(changes.selectedItem !== undefined) {
            if(this.selectedItem) {
                this.inputValue = this.selectedItem.name;
                this.selectedItemId = this.selectedItem.id;
            }
        }
    }

    private onKeydown(value) {

        this.searchList = [];
        let copiedList = this.copyList();

        for (let listGroup in copiedList) {
            for (let item of copiedList[listGroup]) {
                let name = item.name.toLowerCase();
                let inputValue = value.target.value.toLowerCase();

                let pos = name.search(inputValue);
                if (pos > -1) {
                    if (inputValue.length > 0) {
                        let boldadd = [item.name.slice(0, pos), "<mark>", item.name.slice(pos, pos + value.target.value.length), "</mark>", item.name.slice(pos + value.target.value.length)].join("");
                        item.name = boldadd;
                    }
                    if(this.searchList[listGroup]) {
                        this.searchList[listGroup].push(item);
                    }else {
                        this.searchList[listGroup] = [];
                        this.searchList[listGroup].push(item);
                    }
                }
            }
        }
    }

    private listBuilder(buildList) {
        let result = [] ;
        for(let searchItem of buildList) {
            if(searchItem.hasOwnProperty('group')) {
                if (!result[searchItem.group]) {
                    result[searchItem.group] = [];
                }
            }else {
                let un = '_undefined';
                searchItem.group = un;
                if (!result[un]) {
                    result[un] = [];
                }
            }
            result[searchItem.group].push({ id: searchItem.id, name: searchItem.name });
        }
        return result;
    }

    private copyList() {
        let copiedList = [];
        let result = this.listBuilder(this.selectList);
        for(let listGroup in result) {
            copiedList[listGroup] = [];
            for (let i = 0, len = result[listGroup].length; i < len; i++) {
                copiedList[listGroup][i] = [];
                for (let prop in result[listGroup][i]) {
                    copiedList[listGroup][i][prop] = result[listGroup][i][prop];
                }
            }
        }
        return copiedList;
    }


    public clickOnSearch(event: MouseEvent): void {

        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.show_list = false;
        }
    }
    private onFocus() {
        this.show_list = true;
        this.clickListener = this.renderer.listen("document", "click", (event) => this.clickOnSearch(event));
    }

    private itemClicked(item) {

        this.show_list = false;


        let outputItem;
        for(let arritem of this.selectList){
            if(arritem.id == item.id) {
                outputItem = arritem;
                this.inputValue = arritem.name;
                this.selectedItemId = arritem.id;
            }
        }
        this.selectedOutputItem.emit(outputItem);
    }

}
