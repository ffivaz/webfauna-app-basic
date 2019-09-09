import {Component, OnInit} from "@angular/core";
import {AlertController, NavController, NavParams, Platform} from "ionic-angular";
import {SpeciesListPage} from "../species-list/species-list.page";
import {Geolocation} from "@ionic-native/geolocation";
import {InsertMapPage} from "../insert-map/insert-map.page";
import {IdentificationListPage} from "../identification-list/identification-list.page";
import proj4 from 'proj4';
import {Network} from "@ionic-native/network";
import {SimpleObservationModel} from "../../models/simple-observation.model";
import {EnvironnementListPage} from "../environnement-list/environnement-list.page";
import {MilieuListPage} from "../milieu-list/milieu-list.page";
import {StructureListPage} from "../structure-list/structure-list.page";
import {SubstratListPage} from "../substrat-list/substrat-list.page";
import {AbondancePage} from "../abondance/abondance.page";
import {ImagesPage} from "../images/images.page";
import {PrecisionListPage} from "../precision-list/precision-list.page";
import {ObservationsService} from "../../services/observations.service";
import {HomeListPage} from "../home-list/home-list.page";
import {TranslateService} from "@ngx-translate/core";
import {SpeciesService} from "../../services/species.service";
import {DeterminationListPage} from "../determination-list/determination-list.page";

@Component({
    selector: 'page-insert',
    templateUrl: 'insert-form.page.html'
})
export class InsertFormPage implements OnInit {
    date: String = new Date().toISOString();
    hasNetwork: boolean = true;
    openComplementList: boolean = false;
    observation: SimpleObservationModel;
    swissProjection = '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs';
    accuracy: number;
    hasAbundance: boolean = false;
    rowid: number;
    lang: string;
    geoSearch: boolean = false;

    constructor(public nc: NavController,
                private np: NavParams,
                private ac: AlertController,
                private gl: Geolocation,
                private n: Network,
                private os: ObservationsService,
                private ts: TranslateService,
                private ss: SpeciesService,
                public pl: Platform) {
        pl.registerBackButtonAction(() => {
            this.cancelInsert();
        }, 1);
    }

    fixDate() {
        let formattedDateArray = this.date.split("T")[0].split('-')
        this.observation.dateDay = +formattedDateArray[2];
        this.observation.dateMonth = +formattedDateArray[1];
        this.observation.dateYear = +formattedDateArray[0];
    }

    toMapPage() {
        this.fixDate();
        this.nc.push(InsertMapPage, {
            'obs': this.observation
        });
    }

    toSpeciesListPage() {
        this.fixDate();
        this.nc.push(SpeciesListPage, {
            'obs': this.observation
        });
    }

    toPrecisionPage() {
        this.fixDate();
        this.nc.push(PrecisionListPage, {
            'obs': this.observation
        });
    }

    toIdentificationPage() {
        this.fixDate();
        this.nc.push(IdentificationListPage, {
            'obs': this.observation
        });
    }

    toDeterminationMethodPage() {
        this.fixDate();
        this.nc.push(DeterminationListPage, {
            'obs': this.observation
        })
    }

    toAbondancePage() {
        this.fixDate();
        this.nc.push(AbondancePage, {
            'obs': this.observation
        });
    }

    toEnvironnementPage() {
        this.fixDate();
        this.nc.push(EnvironnementListPage, {
            'obs': this.observation
        })
    }

    toMilieuPage() {
        this.nc.push(MilieuListPage, {
            'obs': this.observation
        })
    }

    toStructurePage() {
        this.fixDate();
        this.nc.push(StructureListPage, {
            'obs': this.observation
        })
    }

    toSubstratPage() {
        this.nc.push(SubstratListPage, {
            'obs': this.observation
        })
    }

    toImagesPage() {
        this.fixDate();
        this.nc.push(ImagesPage, {
            'obs': this.observation
        })
    }

    formatAbondance(obs: SimpleObservationModel) {

        //   "ABONDANCES_CODES": "ind,mal,fem,oeu,lar,exu,juv,sub,coll,acc,tan,femp",

        let codes = this.ts.instant('ABONDANCES_CODES').split(',');
        let formatedAbondance: string = "";

        if (obs.individuals) {
            formatedAbondance = formatedAbondance + codes[0] + ": " + obs.individuals + ", ";
        }
        if (obs.males) {
            formatedAbondance = formatedAbondance + codes[1] + ": " + obs.males + ", ";
        }
        if (obs.females) {
            formatedAbondance = formatedAbondance + codes[2] + ": " + obs.females + ", ";
        }
        if (obs.eggs) {
            formatedAbondance = formatedAbondance + codes[3] + ": " + obs.eggs + ", ";
        }
        if (obs.larvae) {
            formatedAbondance = formatedAbondance + codes[4] + ": " + obs.larvae + ", ";
        }
        if (obs.exuviae) {
            formatedAbondance = formatedAbondance + codes[5] + ": " + obs.exuviae + ", ";
        }
        if (obs.nymphs) {
            formatedAbondance = formatedAbondance + codes[6] + ": " + obs.nymphs + ", ";
        }
        if (obs.subadults) {
            formatedAbondance = formatedAbondance + codes[7] + ": " + obs.subadults + ", ";
        }
        if (obs.collection) {
            formatedAbondance = formatedAbondance + codes[8] + ": " + obs.collection + ", ";
        }
        if (obs.mating) {
            formatedAbondance = formatedAbondance + codes[9] + ": " + obs.mating + ", ";
        }
        if (obs.tandem) {
            formatedAbondance = formatedAbondance + codes[10] + ": " + obs.tandem + ", ";
        }
        if (obs.clutch) {
            formatedAbondance = formatedAbondance + codes[11] + ": " + obs.clutch;
        }

        if (formatedAbondance != "") {
            this.hasAbundance = true;
        }

        return formatedAbondance;
    }

    whatPrecision(accuracy): string {
        let toReturnPrecision = '0';

        if (accuracy <= 10) {
            toReturnPrecision = '6'
        }

        if (accuracy > 10 && accuracy <= 50) {
            toReturnPrecision = '5';
        }

        if (accuracy > 50 && accuracy <= 250) {
            toReturnPrecision = '4';
        }

        if (accuracy > 250 && accuracy <= 1000) {
            toReturnPrecision = '3';
        }

        if (accuracy > 1000 && accuracy <= 3000) {
            toReturnPrecision = '2';
        }

        if (accuracy > 3000) {
            toReturnPrecision = '1';
        }

        return toReturnPrecision;
    }

    cancelInsert() {
        let that = this;
        let alert = this.ac.create({
            title: this.ts.instant('CANCEL_INSERT'),
            message: this.ts.instant('CANCEL_INSERT_MESSAGE'),
            buttons: [
                {
                    text: this.ts.instant('OUI'),
                    handler: () => {
                        that.nc.setRoot(HomeListPage);
                    }
                },
                {
                    text: this.ts.instant('NON'),
                    role: 'cancel',
                    handler: () => {
                    }
                }
            ]
        });
        alert.present();
    }

    fixCoordinates() {
        this.geoSearch = true;
        this.gl.getCurrentPosition({'enableHighAccuracy': true})
            .then(response => {
                let swissCoords = proj4('EPSG:4326', this.swissProjection, [response.coords.longitude, response.coords.latitude]);
                this.observation.swissCoordinatesX = Math.round(swissCoords[0]);
                this.observation.swissCoordinatesY = Math.round(swissCoords[1]);
                this.observation.precisionCode = this.whatPrecision(Math.round(response.coords.accuracy));
                this.geoSearch = false;
            });
    }

    saveInsert() {
        if (!this.observation.speciesId ||
            !this.observation.identificationMethodCode) {
            let alert = this.ac.create({
                title: this.ts.instant('SAI_INCOMPLETE'),
                message: this.ts.instant('SAI_INCOMPLETE_MESSAGE'),
                buttons: [{
                    text: this.ts.instant('RETOUR'),
                    role: 'cancel',
                    handler: () => {
                    }
                }]
            });
            alert.present();
        } else if (!this.observation.swissCoordinatesX && !this.observation.swissCoordinatesY) {
            let alert = this.ac.create({
                title: this.ts.instant('SAI_INCOMPLETE'),
                message: this.ts.instant('SAI_INCOMPLETE_MESSAGE_2'),
                buttons: [{
                    text: this.ts.instant('RETOUR'),
                    role: 'cancel',
                    handler: () => {
                    }
                }]
            });
            alert.present();
        } else {
            this.fixDate();
            this.ss.setFavSpecies(this.observation.speciesId);

            if (this.rowid) {
                this.os.updateIntoDB(this.observation);
            } else {
                this.os.insertIntoDB(this.observation);
            }

            this.nc.setRoot(HomeListPage);
        }
    }

    developComplementList() {
        this.openComplementList = !this.openComplementList;
    }

    getGroupId(url: string): string {
        url = url.replace('http://webfauna-api.cscf.ch/webfauna-ws/api/v1/systematics/groups/', '');
        url = url.replace('/species', '');
        return url;
    }

    ngOnInit() {
        this.lang = this.ts.currentLang;

        this.observation = this.np.get('obs');
        if (this.observation.rowid) {
            this.rowid = this.observation.rowid;
        }

        if (this.observation.speciesId) {
            this.ss.getSpeciesNameFromFile(this.observation.speciesId)
                .then(res => {
                    this.observation.groupId = this.getGroupId(res[0].links[0].uri);
                })
        }

        if (this.n.type === 'none') {
            this.hasNetwork = false;
        }

        if (
            this.np.get('obs').environmentCode ||
            this.np.get('obs').milieuCode ||
            this.np.get('obs').structureCode ||
            this.np.get('obs').substratCode ||
            this.np.get('obs').remark
        ) {
            this.openComplementList = true;
        }

        if (this.np.get('obs').dateDay ||
            this.np.get('obs').dateMonth ||
            this.np.get('obs').dateYear
        ) {
            let simpleDate;
            if (this.np.get('obs').dateMonth > 9) {
                if (this.np.get('obs').dateDay < 10) {
                    simpleDate = this.np.get('obs').dateYear + "-" + this.np.get('obs').dateMonth + "-0" + this.np.get('obs').dateDay;
                } else {
                    simpleDate = this.np.get('obs').dateYear + "-" + this.np.get('obs').dateMonth + "-" + this.np.get('obs').dateDay;
                }
            } else {
                if (this.np.get('obs').dateDay < 10) {
                    simpleDate = this.np.get('obs').dateYear + "-0" + this.np.get('obs').dateMonth + "-0" + this.np.get('obs').dateDay;
                } else {
                    simpleDate = this.np.get('obs').dateYear + "-0" + this.np.get('obs').dateMonth + "-" + this.np.get('obs').dateDay;
                }
            }
            this.date = new Date(simpleDate).toISOString()
        } else {
            this.date = new Date().toISOString();
        }

        if (!this.np.get('obs').swissCoordinatesX && !this.np.get('obs').swissCoordinatesY) {
            this.geoSearch = true;
            this.gl.getCurrentPosition({'enableHighAccuracy': true})
                .then(response => {
                    let swissCoords = proj4('EPSG:4326', this.swissProjection, [response.coords.longitude, response.coords.latitude]);
                    this.observation.swissCoordinatesX = Math.round(swissCoords[0]);
                    this.observation.swissCoordinatesY = Math.round(swissCoords[1]);
                    this.observation.precisionCode = this.whatPrecision(Math.round(response.coords.accuracy));
                    this.geoSearch = false;
                });
        }
    }
}
