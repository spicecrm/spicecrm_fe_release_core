/**
 * @module WorkbenchModule
 */
import {
    Component
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {domainmanager} from '../services/domainmanager.service';

/**
 * a modal window to add a new validation to a domain field
 */
@Component({
    templateUrl: './src/workbench/templates/domainmanageraddvalidationvaluemodal.html'
})
export class DomainManagerAddValidationValueModal {

    /**
     * reference to the modal itself
     */
    private self: any;

    /**
     *  an empty validation record
     */
    private fieldvalidationvalue: any = {
        scope: 'g',
        sysdomainfieldvalidation_id: null,
        sequence: 0,
        deleted: 0,
        status: 'd'
    };

    constructor(private domainmanager: domainmanager, private modelutilities: modelutilities) {

    }

    /**
     * adds the validation, selects it and closes the modal
     */
    private add() {
        this.fieldvalidationvalue.id = this.modelutilities.generateGuid();
        this.domainmanager.domainfieldvalidationvalues.push(this.fieldvalidationvalue);
        this.close();
    }

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

}
