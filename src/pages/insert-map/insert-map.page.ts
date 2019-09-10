/** Page affichant la carte OpenStreetMap (elle apparaît lorsque l'utilisateur choisit de commencer la saisie par les cartes (cf. paramètres).
 *  Le déplacement de la carte met à jour les coordonnées (qui deviennent "manuelles", l'utilisateur devant renseigner la précision).
 *  La localisation se fait via le plugin natif ionic Geolocation  https://ionicframework.com/docs/native/geolocation
 *  Pour des raisons énergétiques, le choix s'est porté sur getCurrentPosition() plutôt que sur watchPosition() */

import {NavController, NavParams} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import proj4 from 'proj4';
import {InsertFormPage} from "../insert-form/insert-form.page";
import {SimpleObservationModel} from "../../models/simple-observation.model";
import {HomeListPage} from "../home-list/home-list.page";
import {Component, OnInit} from "@angular/core";
import ol from "openlayers";

@Component({
    selector: 'page-map-insert',
    templateUrl: 'insert-map.page.html'
})
export class InsertMapPage implements OnInit {

    map: any;
    zoom: number = 16;
    swissProjection = '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs';
    currentLoc = {
        X: null,
        Y: null,
        pr: null,
        alti: null,
        pralti: null
    };
    observation: SimpleObservationModel;
    searching: boolean = true;

    constructor(private nc: NavController,
                private gl: Geolocation,
                private np: NavParams) {
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
            });
    }

    backToInsert() {
        this.nc.setRoot(InsertFormPage, {
            'obs': this.observation
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

        let wgsCoords = proj4(this.swissProjection, 'EPSG:3857', [this.observation.swissCoordinatesX, this.observation.swissCoordinatesY]);

        this.currentLoc.X = this.observation.swissCoordinatesX;
        this.currentLoc.Y = this.observation.swissCoordinatesY;

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
            let swissCoords = proj4('EPSG:3857', that.swissProjection, that.map.getView().getCenter());
            that.observation.swissCoordinatesX = Math.round(swissCoords[0]);
            that.observation.swissCoordinatesY = Math.round(swissCoords[1]);
            that.currentLoc = {
                X: Math.round(swissCoords[0]),
                Y: Math.round(swissCoords[1]),
                pr: null,
                alti: null,
                pralti: null
            };
            that.observation.precisionCode = null;
        });
        this.searching = false;
    }

    ngOnInit() {
        this.observation = this.np.get('obs');
    }

}
