import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {InsertFormPage} from "../insert-form/insert-form.page";
import {RealmsService} from "../../services/realms.service";
import {RealmDBModel} from "../../models/realm.db.model";
import {SimpleObservationModel} from "../../models/simple-observation.model";
import {TranslateService} from "@ngx-translate/core";
import {GroupService} from "../../services/group.service";

@Component({
    selector: 'page-determination-list',
    templateUrl: 'determination-list.page.html'
})
export class DeterminationListPage implements OnInit {

    list: RealmDBModel[];
    searchTerm: string;
    observation: SimpleObservationModel;
    lang: string;

    constructor(public nc: NavController,
                private np: NavParams,
                private rs: RealmsService,
                private ts: TranslateService,
                private gs: GroupService) {
    }

    select(sel?: RealmDBModel) {
        if (sel) {
            this.observation.samplingMethodCode = sel['REST-ID'];
            this.nc.setRoot(InsertFormPage, {
                'obs': this.observation,
                'fix': this.np.get('fix')
            })
        } else if (sel === null) {
            this.observation.samplingMethodCode = null;
            this.nc.setRoot(InsertFormPage, {
                'obs': this.observation,
                'fix': this.np.get('fix')
            })
        }
    }

    filterList() {
        this.gs.getSamplingMethodCodes(this.np.get('obs').groupId)
            .then(res => {
                this.rs.getRealmFromFile('mec', this.searchTerm, this.lang, res)
                    .then(res => this.list = res)
                    .catch(e => console.log(e));
            });

    }

    ngOnInit() {
        this.lang = this.ts.currentLang;
        this.observation = this.np.get('obs');
        this.gs.getSamplingMethodCodes(this.np.get('obs').groupId)
            .then(res => {
                this.rs.getRealmFromFile('mec', this.searchTerm, this.lang, res)
                    .then(res => this.list = res)
                    .catch(e => console.log(e));
            });
    }
}
