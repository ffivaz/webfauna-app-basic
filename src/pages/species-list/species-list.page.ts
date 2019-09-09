import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {SpeciesService} from "../../services/species.service";
import {InsertFormPage} from "../insert-form/insert-form.page";
import {SimpleObservationModel} from "../../models/simple-observation.model";
import {SpeciesResource} from "../../models/species.model";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from "@ionic/storage";

@Component({
    selector: 'page-first-species-list',
    templateUrl: 'species-list.page.html'
})
export class SpeciesListPage implements OnInit, AfterViewInit {

    speciesList: SpeciesResource[];
    observation: SimpleObservationModel;
    lang: string;
    searchTerm: string;
    favs: boolean = true;
    favMode: string = 'most';

    constructor(public nc: NavController,
                private np: NavParams,
                private ss: SpeciesService,
                private ts: TranslateService,
                private s: Storage) {
    }

    select(species: SpeciesResource) {
        this.observation.speciesId = species['REST-ID'];
        this.nc.setRoot(InsertFormPage, {
            'obs': this.observation
        });
    }

    filterList() {
        if (this.searchTerm == '') {
            this.ss.getFavSpecies()
                .then(res => {
                    this.speciesList = res;
                    this.favs = true;
                })
                .catch(e => console.log(e));
        } else {
            this.ss.selectSpeciesFromFileInGroup(this.searchTerm)
                .then(res => {
                    this.speciesList = res;
                    this.favs = false;
                })
                .catch(e => console.log(e));
        }
    }

    vernacularNameFromLang(species: SpeciesResource) {
        return eval("species.vernacularNames." + this.lang);
    }

    ngOnInit() {
        this.lang = this.ts.currentLang;
    }

    ngAfterViewInit() {
        this.observation = this.np.get('obs');

        this.s.get('favMode')
            .then((res) => {
                this.favMode = res;
            });

        this.ss.getFavSpecies()
            .then(res => {
                this.speciesList = res;
                this.favs = true;
            })
            .catch(e => console.log(e));
    }

    ionViewDidEnter() {
        let elem = <HTMLInputElement>document.querySelector('.species-ion-searchbar');
        if (elem) {
            elem.focus();
        }
    }
}
