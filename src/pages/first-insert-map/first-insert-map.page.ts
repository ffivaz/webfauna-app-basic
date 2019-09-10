/** Page affichant la carte OpenStreetMap (elle apparaît lorsque l'utilisateur choisit de commencer la saisie par les cartes (cf. paramètres).
 *  Le déplacement de la carte met à jour les coordonnées (qui deviennent "manuelles", l'utilisateur devant renseigner la précision).
 *  La localisation se fait via le plugin natif ionic Geolocation  https://ionicframework.com/docs/native/geolocation
 *  Pour des raisons énergétiques, le choix s'est porté sur getCurrentPosition() plutôt que sur watchPosition()
 *  Le plugin natif ionic Network est utilisé pour tester si le téléphone est connecté au réseau. Un message apparaît sans réseau */

import {Component, OnInit} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import proj4 from 'proj4';
import {InsertFormPage} from "../insert-form/insert-form.page";
import {SimpleObservationModel} from "../../models/simple-observation.model";
import {HomeListPage} from "../home-list/home-list.page";
import {Network} from "@ionic-native/network";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from "@ionic/storage";
import ol from "openlayers";

@Component({
    selector: 'first-page-map-insert',
    templateUrl: 'first-insert-map.page.html'
})
export class FirstInsertMapPage implements OnInit {
    map: any;
    searching: boolean = false;
    zoom: number = 16;
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
    swissProjection = '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs';
    currentLoc = {
        X: null,
        Y: null,
        pr: null,
        alti: null,
        pralti: null
    };

    constructor(private nc: NavController,
                private gl: Geolocation,
                private n: Network,
                private ac: AlertController,
                private ts: TranslateService,
                private s: Storage) {
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

    goToCurrentLocation() {
        this.searching = true;
        this.gl.getCurrentPosition({'enableHighAccuracy': true})
            .then(position => {
                const {longitude, latitude, accuracy, altitude, altitudeAccuracy} = position.coords;
                let swissCoords = proj4('EPSG:4326', this.swissProjection, [longitude, latitude]);
                this.map.getView().setCenter(ol.proj.fromLonLat([longitude, latitude]));
                this.currentLoc = {
                    X: Math.round(swissCoords[0]),
                    Y: Math.round(swissCoords[1]),
                    pr: Math.round(accuracy),
                    alti: Math.round(altitude),
                    pralti: Math.round(altitudeAccuracy)
                };
                this.observation.precisionCode = this.whatPrecision(Math.round(accuracy));
                this.searching = false;
                this.s.set('lastcoords', [this.currentLoc.X, this.currentLoc.Y]);
            });
    }

    backToInsert() {
        let wgsCoords = proj4('EPSG:4326', this.swissProjection, [this.map.getView().getCenter()[0], this.map.getView().getCenter()[1]]);
        this.observation.swissCoordinatesX = Math.round(wgsCoords[0]);
        this.observation.swissCoordinatesY = Math.round(wgsCoords[1]);
        this.nc.setRoot(InsertFormPage, {
            'obs': this.observation,
            'fix': true
        });
    }

    backToHome() {
        this.nc.setRoot(HomeListPage);
    }

    ionViewDidLoad() {
        this.loadMap();
    }

    loadMap() {
        this.searching = true;

        this.s.get('lastcoords')
            .then((coords) => {
                this.currentLoc = {
                    X: coords[0],
                    Y: coords[1],
                    pr: null,
                    alti: null,
                    pralti: null
                };

                this.observation.precisionCode = null;
                let wgsCoords = proj4(this.swissProjection, 'EPSG:3857', [this.currentLoc.X, this.currentLoc.Y]);

                this.map = new ol.Map({
                    layers: [new ol.layer.Tile({source: new ol.source.OSM()})],
                    target: document.getElementById('olmap'),
                    view: new ol.View({
                        center: wgsCoords,
                        zoom: this.zoom
                    })
                });

                this.goToCurrentLocation();

                let that = this;
                this.map.on('moveend', function () {
                    let wgsCoords = proj4('EPSG:3857', that.swissProjection, that.map.getView().getCenter());
                    that.observation.swissCoordinatesX = Math.round(wgsCoords[0]);
                    that.observation.swissCoordinatesY = Math.round(wgsCoords[1]);
                    that.currentLoc = {
                        X: Math.round(wgsCoords[0]),
                        Y: Math.round(wgsCoords[1]),
                        pr: null,
                        alti: null,
                        pralti: null
                    };
                    that.observation.precisionCode = null;
                });
            });
    }

    ngOnInit() {
        if (this.n.type === 'none') {
            let alert = this.ac.create({
                title: this.ts.instant('NO_NETWORK'),
                message: this.ts.instant('NO_NET_MAP_MESSAGE'),
                buttons: [
                    {
                        text: this.ts.instant('FERMER'),
                        handler: () => {
                        }
                    }
                ]
            });
            alert.present();
        }
    }
}
