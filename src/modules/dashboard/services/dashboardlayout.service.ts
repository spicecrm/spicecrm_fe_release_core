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
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {modal} from '../../../services/modal.service';
import {model} from '../../../services/model.service';


@Injectable()
export class dashboardlayout {
    public dashboardData: any = {};
    public dashboardgrid: any[] = [];
    public dashboardId: string = '';
    public dashboardElements: any[] = [];
    public expandedRows: any[] = [];
    public elementWidth: number = 100;
    public boxMargin: number = 5;
    public columns: number = 9;
    public editMode: boolean = false;
    public editing: string = '';
    public mainContainer: any = undefined;
    public isMoving: boolean = false;
    public isloading: boolean = false;

    constructor(private backend: backend, private modelutilities: modelutilities, public model: model, private modal: modal) {
    }

    get dashboardGrid() {
        return this.dashboardgrid;
    }

    set dashboardGrid(val) {
        if (this.expandedRows.length > 0) {
            this.dashboardgrid = this.dashboardgrid.concat(this.expandedRows);
        }
        this.dashboardgrid = val;
    }

    get elementHeight() {
        return this.mainContainer ? this.mainContainer.height / this.columns : 100;
    }

    get compactView() {
        return this.mainContainer.width < 768;
    }

    /*
     * calculate the GRID
     */
    public calculateGrid() {
        // rect = container div
        this.elementWidth = this.mainContainer.width / this.columns;
        this.dashboardGrid = [];
        let rowIndex = 0;
        let mainContainerHeight = this.mainContainer.height;

        if (this.expandedRows.length > 0) {
            mainContainerHeight = this.mainContainer.height + ((this.elementHeight - 2 * this.boxMargin) * this.expandedRows.length);
        }

        while ((rowIndex * this.elementHeight) < mainContainerHeight) {
            let colIndex = 0;
            let dashBoardRow = [];
            while (colIndex < this.columns) {
                dashBoardRow.push({
                    width: (this.mainContainer.width / this.columns) - (2 * this.boxMargin),
                    height: this.elementHeight - (2 * this.boxMargin),
                    top: ((rowIndex * this.elementHeight) + this.boxMargin),
                    left: (colIndex * this.mainContainer.width / this.columns) + this.boxMargin
                });
                colIndex++;
            }
            this.dashboardGrid.push(dashBoardRow);
            rowIndex++;
        }
    }

    /*
     * translate for style from index to pixels on the dashboard
     */
    public getElementStyle(top, left, width, height) {
        let style: any = {};

        style.top = top * this.elementHeight + this.boxMargin;
        style.left = left * this.elementWidth + this.boxMargin;
        style.width = this.compactView ? '100%' : (width * this.elementWidth - 2 * this.boxMargin);
        style.height = height * this.elementHeight - 2 * this.boxMargin;
        return style;
    }

    // function to drop an item
    public dropElement(id, movex, movey, mouseTarget, mouseLast) {
        // item.position count per column
        this.dashboardElements.some(item => {
            if (item.id === id) {
                let moveXDiff = Math.round(movex / this.elementWidth);
                let moveYDiff = Math.round(movey / this.elementHeight);

                const canDrop = this.canDrop(id, item, movex, movey, mouseLast, mouseTarget);
                switch (mouseTarget) {
                    case 'content':
                        if (canDrop.left) {
                            item.position.left += moveXDiff;
                        }

                        if (canDrop.top) {
                            item.position.top += moveYDiff;
                        }
                        break;
                    case 'left':
                        if (canDrop.left) {
                            item.position.width -= moveXDiff;
                            item.position.left += moveXDiff;
                        }
                        break;
                    case 'right':
                        if (canDrop.left) {
                            item.position.width += moveXDiff;
                        }
                        break;
                    case 'top':
                        if (canDrop.top) {
                            item.position.height -= moveYDiff;
                            item.position.top += moveYDiff;
                        }
                        break;
                    case 'bottom':
                        if (canDrop.top) {
                            item.position.height += moveYDiff;
                        }
                        break;
                }
                window.dispatchEvent(new Event('resize'));
                this.handelExpand(item.position.top + (item.position.height - 1));
                return true;
            }
        });
    }

    public canDrop(id, item, movex, movey, mouseLast, mouseTarget) {

        let left: boolean = true;
        let top: boolean = true;
        let moveXDiff = Math.round(movex / this.elementWidth);
        let moveYDiff = Math.round(movey / this.elementHeight);
        let currentElOldLeft: number = item.position.left;
        let currentElOldRight: number = item.position.left + (item.position.width - 1);
        let currentElOldTop: number = item.position.top;
        let currentElOldBottom: number = item.position.top + (item.position.height - 1);
        let currentElLeft: number = currentElOldLeft;
        let currentElWidth: number = item.position.width;
        let currentElRight = currentElOldRight;
        let currentElTop: number = currentElOldTop;
        let currentElHeight: number = item.position.height;
        let currentElBottom = currentElOldBottom;

        switch (mouseTarget) {
            case 'content':
                currentElBottom = currentElOldBottom + moveYDiff;
                currentElRight = currentElOldRight + moveXDiff;
                currentElLeft = currentElOldLeft + moveXDiff;
                currentElTop = currentElOldTop + moveYDiff;
                break;
            case 'left':
                currentElWidth = currentElWidth + moveXDiff;
                currentElLeft = currentElOldLeft + moveXDiff;
                break;
            case 'right':
                currentElWidth = currentElWidth + moveXDiff;
                currentElRight = currentElOldRight + moveXDiff;
                break;
            case 'top':
                currentElHeight = currentElHeight + moveYDiff;
                currentElTop = currentElOldTop + moveYDiff;
                break;
            case 'bottom':
                currentElHeight = currentElHeight + moveYDiff;
                currentElBottom = currentElOldBottom + moveYDiff;
                break;
        }


        for (let element of this.dashboardElements) {

            let elLeft: number = element.position.left;
            let elRight: number = element.position.left + (element.position.width - 1);
            let elTop: number = element.position.top;
            let elBottom: number = element.position.top + (element.position.height - 1);
            let leftIn: boolean = (currentElLeft >= elLeft && currentElLeft <= elRight);
            let rightIn: boolean = (currentElRight <= elRight && currentElRight >= elLeft);
            let topIn: boolean = (currentElTop >= elTop && currentElTop <= elBottom);
            let bottomIn: boolean = (currentElBottom <= elBottom && currentElBottom >= elTop);
            let xIn: boolean = ((rightIn || leftIn) && (topIn || bottomIn) && element.id != id);
            let yIn: boolean = ((topIn || bottomIn) && (leftIn || rightIn) && element.id != id);
            let overflowedX: boolean = (currentElLeft < 0 || currentElRight > (this.columns - 1));
            let overflowedTop: boolean = (currentElTop < 0);
            let isCoveredY: boolean = ((currentElTop < elTop && currentElBottom > elBottom) && (currentElLeft <= elRight && currentElRight >= elLeft) && element.id != id);
            let isCoveredX: boolean = ((currentElRight > elRight && currentElLeft < elLeft) && (currentElTop <= elBottom && currentElBottom >= elTop) && element.id != id);

            switch (mouseTarget) {
                case 'content':
                    if (xIn || yIn || isCoveredX || isCoveredY || overflowedX || overflowedTop) {
                        left = false;
                        top = false;
                    }
                    break;
                case 'left':
                    if (xIn || isCoveredX || overflowedX || (currentElLeft > currentElRight)) {
                        left = false;
                    }
                    break;
                case 'right':
                    if (xIn || isCoveredX || overflowedX || (currentElRight < currentElLeft)) {
                        left = false;
                    }
                    break;
                case 'top':
                    if (yIn || isCoveredY || overflowedTop || (currentElTop > currentElBottom)) {
                        top = false;
                    }
                    break;
                case 'bottom':
                    if (yIn || isCoveredY || overflowedTop || (currentElBottom < currentElTop)) {
                        top = false;
                    }
                    break;
            }
        }

        return {top, left};
    }

    public handelExpand(currentElBottom) {
        let counter = 0;
        while (counter < (currentElBottom - (this.dashboardGrid.length - 1))) {
            this.expandedRows.push(this.dashboardGrid[0]);
            counter++;
        }
        let reservedFields = 0;
        for (let element of this.dashboardElements) {
            reservedFields += element.position.width * element.position.height;
        }
        if (reservedFields >= (+this.dashboardGrid.length * +this.dashboardGrid[0].length)) {
            this.expandedRows.push(this.dashboardGrid[0]);
        }

        this.calculateGrid();
    }

    public addDashlet(position) {

        this.modal.openModal('DashboardAddElement').subscribe(modalRef => {
            modalRef.instance.addDashlet.subscribe(dashlet => {
                if (dashlet !== false) {
                    this.editing = this.modelutilities.generateGuid();
                    this.dashboardElements.push({
                        id: this.editing,
                        name: dashlet.name,
                        component: dashlet.component,
                        componentconfig: dashlet.componentconfig,
                        dashletconfig: dashlet.dashletconfig,
                        dashlet_id: dashlet.dashlet_id,
                        module: dashlet.module,
                        icon: dashlet.icon,
                        acl_action: dashlet.acl_action,
                        label: dashlet.label,
                        sysuidashboard_id: this.dashboardId,
                        position: {
                            top: Math.round(position.top / this.elementHeight),
                            left: Math.round(position.left / this.elementWidth),
                            width: Math.round(position.width / this.elementWidth),
                            height: Math.round(position.height / this.elementHeight)
                        },
                        is_new: true,
                    });
                }
            });
        });
    }

    public deleteDashlet(id) {
        this.dashboardElements.some((dashlet, index) => {
            if (dashlet.id === id) {
                this.dashboardElements.splice(index, 1);
                return true;
            }
        });
    }

    public loadDashboard(id, name?) {
        if (id != this.dashboardId) {
            this.isloading = true;
            this.dashboardId = id;
            this.model.module = 'Dashboards';
            this.model.id = id;
            this.dashboardElements = [];

            if (name) {
                this.model.setField('name', name);
            }

            this.model.getData(false).subscribe(loaded => {
                this.dashboardData = this.model.data;
                this.dashboardElements = this.model.getField('components');

                // sort the elements for the compact view
                this.sortElements();

                this.isloading = false;
            });
        }
    }

    public cancelEdit() {
        this.expandedRows = [];
        this.calculateGrid();
        this.editMode = false;
        this.dashboardElements = JSON.parse(JSON.stringify(this.dashboardData.components));
    }

    public saveDashboard() {
        this.editMode = false;
        this.backend.postRequest('dashboards/' + this.dashboardId, {}, this.dashboardElements).subscribe(data => {
            this.dashboardData.components = this.dashboardElements.slice(0);
        });
    }

    private sortElements() {
        this.dashboardElements = this.dashboardElements.sort((a, b) => {
            if (a.position.top == b.position.top) {
                return a.position.left > b.position.left ? 1 : -1;
            } else {
                return a.position.top > b.position.top ? 1 : -1;
            }
        });
    }
}
