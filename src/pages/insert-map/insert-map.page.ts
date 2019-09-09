import {NavController, NavParams} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import proj4 from 'proj4';
import {InsertFormPage} from "../insert-form/insert-form.page";
import {SimpleObservationModel} from "../../models/simple-observation.model";
import {HomeListPage} from "../home-list/home-list.page";
import {Component, NgZone, OnInit} from "@angular/core";
import ol from "openlayers";

@Component({
    selector: 'page-map-insert',
    templateUrl: 'insert-map.page.html'
})
export class InsertMapPage implements OnInit {

    map: any;
    zoom: number = 18;
    swissProjection = '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs';
    currentLoc = {
        X: null,
        Y: null,
        pr: null,
        alti: null,
        pralti: null
    };
    observation: SimpleObservationModel;
    mapType: string = 'SATELLITE';
    searching: boolean = true;

    constructor(private nc: NavController,
                private gl: Geolocation,
                private np: NavParams,
                private z: NgZone) {
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
        /*this.gl.getCurrentPosition({'enableHighAccuracy': true})
            .then(position => {
                let googlePosition: LatLng = new LatLng(position.coords.latitude, position.coords.longitude);
                this.map.moveCamera({
                    target: googlePosition
                });
                let swissCoords = proj4('EPSG:4326', this.swissProjection, [position.coords.longitude, position.coords.latitude]);
                this.observation.swissCoordinatesX = Math.round(swissCoords[0]);
                this.observation.swissCoordinatesY = Math.round(swissCoords[1]);
                this.currentLoc.X = Math.round(swissCoords[0]);
                this.currentLoc.Y = Math.round(swissCoords[1]);
                this.currentLoc.pr = Math.round(position.coords.accuracy);
                this.currentLoc.alti = Math.round(position.coords.altitude);
                this.currentLoc.pralti = Math.round(position.coords.altitudeAccuracy);
                this.observation.precisionCode = this.whatPrecision(Math.round(position.coords.accuracy));
                this.searching = false;
            });*/
    }

    switchMapType() {
        /*if (this.mapType == 'SATELLITE') {
            this.mapType = 'ROADMAP'
        } else {
            this.mapType = 'SATELLITE'
        }

        this.map.setMapTypeId(GoogleMapsMapTypeId[this.mapType]);*/
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

        let wgsCoords = proj4(this.swissProjection, 'EPSG:4326', [this.observation.swissCoordinatesX, this.observation.swissCoordinatesY]);

        this.currentLoc.X = this.observation.swissCoordinatesX;
        this.currentLoc.Y = this.observation.swissCoordinatesY;

        /*let googlePosition: LatLng = new LatLng(wgsCoords[1], wgsCoords[0]);

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
        };*/

        this.map = new ol.Map({
            layers: [new ol.layer.Tile({ source: new ol.source.OSM() })],
            target: document.getElementById('olmap'),
            view: new ol.View({
                center: ol.proj.transform([-0.12755, 51.507222], 'EPSG:4326', 'EPSG:3857'),
                zoom: 3
            })
        });

        /*this.map.on(GoogleMapsEvent.MAP_DRAG_END)
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

        this.searching = false;*/

    }

    ngOnInit() {
        this.observation = this.np.get('obs');
    }

}
