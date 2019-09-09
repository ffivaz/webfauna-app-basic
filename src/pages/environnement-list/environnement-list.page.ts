import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {InsertFormPage} from "../insert-form/insert-form.page";
import {RealmsService} from "../../services/realms.service";
import {RealmDBModel} from "../../models/realm.db.model";
import {SimpleObservationModel} from "../../models/simple-observation.model";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'page-environnement-list',
    templateUrl: 'environnement-list.page.html'
})
export class EnvironnementListPage implements OnInit {

    list: RealmDBModel[];
    searchTerm: string;
    observation: SimpleObservationModel;
    lang: string;

    constructor(public nc: NavController,
                private np: NavParams,
                private rs: RealmsService,
                private ts: TranslateService) {
    }

    select(sel?: RealmDBModel) {
        if (sel) {
            this.observation.environmentCode = sel['REST-ID'];
            this.nc.setRoot(InsertFormPage, {
                'obs': this.observation
            })
        } else if (sel === null) {
            this.observation.environmentCode = null;
            this.nc.setRoot(InsertFormPage, {
                'obs': this.observation
            })
        }
    }

    filterList() {
        this.rs.getRealmFromFile('env', this.searchTerm, this.lang)
            .then(res => this.list = res)
            .catch(e => console.log(e));
    }

    ngOnInit() {
        this.lang = this.ts.currentLang;
        this.observation = this.np.get('obs');

        this.rs.getRealmFromFile('env', null, this.lang)
            .then(response => {
                this.list = response;
            });
    }
}
