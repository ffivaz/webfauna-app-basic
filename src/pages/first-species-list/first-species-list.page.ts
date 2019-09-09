import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {SpeciesService} from "../../services/species.service";
import {InsertFormPage} from "../insert-form/insert-form.page";
import {SimpleObservationModel} from "../../models/simple-observation.model";
import {HomeListPage} from "../home-list/home-list.page";
import {SpeciesResource} from "../../models/species.model";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'page-first-species-list',
    templateUrl: 'first-species-list.page.html'
})
export class FirstSpeciesListPage implements OnInit, AfterViewInit {

    speciesList: SpeciesResource[];
    observation: SimpleObservationModel = {
        rowid: null,
        StatusCode: null,
        userId: null,
        groupId: null,
        speciesId: null,
        identificationMethodCode: null,
        samplingMethodCode: null,
        dateDay: null,
        dateMonth: null,
        dateYear: null,
        datePrecision: null,
        remark: null,
        environmentCode: null,
        milieuCode: null,
        substratCode: null,
        structureCode: null,
        countryCode: null,
        departmentCode: null,
        precisionCode: null,
        localite: null,
        lieudit: null,
        swissCoordinatesX: null,
        swissCoordinatesY: null,
        altitude: null,
        individuals: null,
        collection: null,
        males: null,
        females: null,
        eggs: null,
        larvae: null,
        exuviae: null,
        nymphs: null,
        subadults: null,
        mating: null,
        tandem: null,
        clutch: null,
        img_url: null,
        projet: null,
        objectNumber: null,
        uploaded: 0
    };

    lang: string;
    searchTerm: string;
    favs: boolean = true;

    constructor(public nc: NavController,
                private ss: SpeciesService,
                private ts: TranslateService) {
    }

    select(species: SpeciesResource) {
        this.observation.speciesId = species['REST-ID'];
        this.nc.setRoot(InsertFormPage, {
            'obs': this.observation
        })
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

    backToHome() {
        this.nc.setRoot(HomeListPage);
    }

    vernacularNameFromLang(species: SpeciesResource) {
        return eval("species.vernacularNames." + this.lang);
    }

    ngOnInit() {
        this.lang = this.ts.currentLang;
    }

    ngAfterViewInit() {
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
