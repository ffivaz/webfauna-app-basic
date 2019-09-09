import {Component, OnInit} from "@angular/core";
import {App, NavParams, ViewController} from "ionic-angular";
import {DeteTaxons} from "../../../models/dete-taxons.model";
import {TranslateService} from "@ngx-translate/core";
import {File} from "@ionic-native/file";
import {InsertFormPage} from "../../insert-form/insert-form.page";
import {SimpleObservationModel} from "../../../models/simple-observation.model";

@Component({
    selector: 'listes-modal-espece-page',
    templateUrl: 'listes-modal-espece.page.html'
})
export class ListesModalEspecePage implements OnInit {

    specie: DeteTaxons;
    nextSpecies: DeteTaxons;
    previousSpecies: DeteTaxons;
    species: DeteTaxons[];
    moveSign: boolean = false;
    groupInfo;
    lang: string;
    filePath: string;
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

    constructor(private vc: ViewController,
                private np: NavParams,
                private ts: TranslateService,
                private f: File,
                private ac: App) {
    }

    closeModal() {
        this.vc.dismiss();
    }

    swipe(event) {
        if (event.direction == 2) {
            if (this.nextSpecies) {
                this.moveSign = true;
                setTimeout(() => {
                    this.moveSign = false
                }, 500);
                this.specie = this.nextSpecies;
                this.nextSpecies = this.species[this.species.indexOf(this.specie) + 1];
                this.previousSpecies = this.species[this.species.indexOf(this.specie) - 1];
            }
        }
        if (event.direction == 4) {
            if (this.previousSpecies) {
                this.moveSign = true;
                setTimeout(()=>{
                    this.moveSign = false
                }, 500);
                this.specie = this.previousSpecies;
                this.nextSpecies = this.species[this.species.indexOf(this.specie) + 1];
                this.previousSpecies = this.species[this.species.indexOf(this.specie) - 1];
            }
        }
    }

    returnDescriptionWithLang(): string {
        let data =  eval("this.specie.description_" + this.lang);
        data = data.replace(new RegExp('<source src=\"', 'g'), '<source src=\"' + this.f.dataDirectory + this.groupInfo.short + '/r_images/' );
        return data;
    }

    returnCaptionWithLang(img): string {
        return eval('img.legende_' + this.lang);
    }

    toInsert() {
        this.observation.speciesId = this.specie.nuesp.substring(0, 5);
        this.vc.dismiss();
        this.ac.getRootNav().setRoot(InsertFormPage, {
            'obs': this.observation
        });
    }

    ngOnInit() {
        this.filePath = this.f.dataDirectory;
        this.lang = this.ts.currentLang;
        this.specie = this.np.get('specie');
        this.groupInfo = this.np.get('group');
        this.species = this.np.get('species');
        this.nextSpecies = this.species[this.species.indexOf(this.specie) + 1];
        this.previousSpecies = this.species[this.species.indexOf(this.specie) - 1];
    }
}