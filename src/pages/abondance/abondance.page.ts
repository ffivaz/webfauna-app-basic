import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {InsertFormPage} from "../insert-form/insert-form.page";
import {SimpleObservationModel} from "../../models/simple-observation.model";

@Component({
    selector: 'page-abondance',
    templateUrl: 'abondance.page.html'
})
export class AbondancePage implements OnInit {

    observation: SimpleObservationModel;

    constructor(
        public nc: NavController,
        private np: NavParams) {}

    clearContent() {
        this.observation.individuals = null;
        this.observation.males = null;
        this.observation.females = null;
        this.observation.eggs = null;
        this.observation.larvae = null;
        this.observation.exuviae = null;
        this.observation.nymphs = null;
        this.observation.subadults = null;
        this.observation.tandem = null;
        this.observation.collection = null;
    }

    saveInsert() {
        this.nc.push(InsertFormPage, {
            'obs': this.observation
        })
    }

    ngOnInit() {
        this.observation = this.np.get('obs');
    }

}
