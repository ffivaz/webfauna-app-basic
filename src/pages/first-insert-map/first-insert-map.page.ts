import {Component, NgZone, OnInit} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import proj4 from 'proj4';
import {InsertFormPage} from "../insert-form/insert-form.page";
import {SimpleObservationModel} from "../../models/simple-observation.model";
import {HomeListPage} from "../home-list/home-list.page";
import {Network} from "@ionic-native/network";
import {TranslateService} from "@ngx-translate/core";
import {
    GoogleMap,
    GoogleMapOptions,
    GoogleMaps,
    GoogleMapsEvent,
    GoogleMapsMapTypeId,
    LatLng
} from "@ionic-native/google-maps";
import {Storage} from "@ionic/storage";

@Component({
    selector: 'first-page-map-insert',
    templateUrl: 'first-insert-map.page.html'
})
export class FirstInsertMapPage implements OnInit {
    map: GoogleMap;
    mapType: string = 'SATELLITE';
    searching: boolean = false;

    zoom: number = 18;
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
                private z: NgZone,
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
                let googlePosition: LatLng = new LatLng(position.coords.latitude, position.coords.longitude);
                this.map.moveCamera({
                    target: googlePosition
                });
                let swissCoords = proj4('EPSG:4326', this.swissProjection, [position.coords.longitude, position.coords.latitude]);
                this.currentLoc.X = Math.round(swissCoords[0]);
                this.currentLoc.Y = Math.round(swissCoords[1]);
                this.currentLoc.pr = Math.round(position.coords.accuracy);
                this.currentLoc.alti = Math.round(position.coords.altitude);
                this.currentLoc.pralti = Math.round(position.coords.altitudeAccuracy);
                this.observation.precisionCode = this.whatPrecision(Math.round(position.coords.accuracy));
                this.searching = false;
                this.s.set('lastcoords', [this.currentLoc.X, this.currentLoc.Y]);
            });
    }

    backToInsert() {
        let wgsCoords = proj4('EPSG:4326', this.swissProjection, [this.map.getCameraPosition().target.lng, this.map.getCameraPosition().target.lat]);
        this.observation.swissCoordinatesX = Math.round(wgsCoords[0]);
        this.observation.swissCoordinatesY = Math.round(wgsCoords[1]);
        this.nc.setRoot(InsertFormPage, {
            'obs': this.observation,
            'fix': true
        });
    }

    switchMapType() {
        if (this.mapType == 'SATELLITE') {
            this.mapType = 'ROADMAP'
        } else {
            this.mapType = 'SATELLITE'
        }

        this.map.setMapTypeId(GoogleMapsMapTypeId[this.mapType]);
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
            .then((r) => {
                console.log(r);
                this.currentLoc.X = r[0];
                this.currentLoc.Y = r[1];
                this.currentLoc.pr = null;
                this.currentLoc.alti = null;
                this.currentLoc.pralti = null;
                this.observation.precisionCode = null;

                let wgsCoords = proj4(this.swissProjection, 'EPSG:4326', [this.currentLoc.X, this.currentLoc.Y]);

                let googlePosition: LatLng = new LatLng(wgsCoords[1], wgsCoords[0]);

                let mapOptions: GoogleMapOptions = {
                    mapType: GoogleMapsMapTypeId.SATELLITE,

                    camera: {
                        target: googlePosition,
                        zoom: this.zoom,
                        tilt: 0
                    },

                    controls: {
                        'compass': false,
                        'myLocationButton': false,
                        'myLocation': false,
                        'indoorPicker': false,
                        'zoom': false,
                        'mapToolbar': true
                    }
                };

                this.map = GoogleMaps.create('map-canvas', mapOptions);

                this.map.one(GoogleMapsEvent.MAP_READY)
                    .then(() => {
                        this.gl.getCurrentPosition({'enableHighAccuracy': true})
                            .then(position => {
                                let swissCoords = proj4('EPSG:4326', this.swissProjection, [position.coords.longitude, position.coords.latitude]);
                                let googlePosition: LatLng = new LatLng(position.coords.latitude, position.coords.longitude);
                                this.map.moveCamera({
                                    target: googlePosition
                                });
                                this.currentLoc.X = Math.round(swissCoords[0]);
                                this.currentLoc.Y = Math.round(swissCoords[1]);
                                this.currentLoc.pr = Math.round(position.coords.accuracy);
                                this.currentLoc.alti = Math.round(position.coords.altitude);
                                this.currentLoc.pralti = Math.round(position.coords.altitudeAccuracy);
                                this.observation.precisionCode = this.whatPrecision(Math.round(position.coords.accuracy));
                                this.searching = false;
                                this.s.set('lastcoords', [this.currentLoc.X, this.currentLoc.Y]);
                            });
                    });

                this.map.on(GoogleMapsEvent.MAP_DRAG_END)
                    .subscribe(() => {
                        let wgsCoords = proj4('EPSG:4326', this.swissProjection, [this.map.getCameraPosition().target.lng, this.map.getCameraPosition().target.lat]);
                        this.z.run(() => {
                            this.observation.swissCoordinatesX = Math.round(wgsCoords[0]);
                            this.observation.swissCoordinatesY = Math.round(wgsCoords[1]);
                            this.currentLoc.X = Math.round(wgsCoords[0]);
                            this.currentLoc.Y = Math.round(wgsCoords[1]);
                            this.currentLoc.pr = null;
                            this.currentLoc.alti = null;
                            this.currentLoc.pralti = null;
                            this.observation.precisionCode = null;
                        });
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
                        handler: () => {}
                    }
                ]
            });
            alert.present();
        }
    }
}
