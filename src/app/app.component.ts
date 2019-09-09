import {Component, ViewChild} from "@angular/core";
import {Nav, Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {HomeListPage} from "../pages/home-list/home-list.page";
import {ParamsPage} from "../pages/params/params.page";
import {DeteGroupsListPage} from "../pages/determination/groups-list/groups-list.page";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from "@ionic/storage";
import {ObservationsService} from "../services/observations.service";
import {AuthService} from "../services/auth.service";
import {ListesGroupesPage} from "../pages/listes/listes-groupes/listes-groupes.page";
import {ConnectPage} from "../pages/connect/connect.page";
import {FirstInsertMapPage} from "../pages/first-insert-map/first-insert-map.page";
import {AboutPage} from "../pages/about/about.page";
import {HTTP} from "@ionic-native/http";
import {SimpleObservationModel} from "../models/simple-observation.model";
import {ImagesPage} from "../pages/images/images.page";
import {Network} from "@ionic-native/network";
import {FirstSpeciesListPage} from "../pages/first-species-list/first-species-list.page";
import {SpeciesService} from "../services/species.service";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage: any;
    pages: Array<{ title: string, component: any }>;
    onResumeObs: SimpleObservationModel;

    constructor(private platform: Platform,
                private statusBar: StatusBar,
                private splashScreen: SplashScreen,
                private ts: TranslateService,
                private os: ObservationsService,
                private ss: SpeciesService,
                private as: AuthService,
                private s: Storage,
                private http: HTTP,
                private n: Network) {
        this.initializeApp();
    }

    initializeApp() {

        if (this.platform.is('android')) {
            this.platform.resume.subscribe((event: any) => {
                if (event && event.pendingResult.pluginServiceName == 'Camera' && event.pendingResult.pluginStatus == 'OK') {
                    this.s.get('obs_on_resume')
                        .then((r: SimpleObservationModel) => {
                            if (r) {
                                if (r.img_url == undefined) {
                                    let a = [];
                                    a.push(event.pendingResult.result);
                                    r.img_url = JSON.stringify(a);
                                } else {
                                    let a = JSON.parse(r.img_url);
                                    a.push(event.pendingResult.result);
                                    r.img_url = JSON.stringify(a);
                                }
                                this.onResumeObs = r;
                            }
                        });
                }
            })
        }

        this.platform.ready().then(() => {
            let deviceLang = window.navigator.language.substring(0, 2);

            this.s.get('lang').then((val) => {
                if (val) {
                    this.ts.setDefaultLang(val);
                    this.ts.use(val);
                } else {
                    if (['fr', 'de', 'it'].indexOf(deviceLang) > -1) {
                        this.s.set('lang', deviceLang);
                        this.ts.setDefaultLang(deviceLang);
                        this.ts.use(deviceLang);
                    } else {
                        this.s.set('lang', 'fr');
                        this.ts.setDefaultLang('fr');
                        this.ts.use('fr');
                    }
                }

                if (this.onResumeObs) {
                    this.s.set('onResumeObs', this.onResumeObs)
                        .then(() => {
                            this.rootPage = ImagesPage;
                        });
                } else {
                    this.rootPage = HomeListPage;
                }
            });

            if (this.platform.is('ios')) {
                //this.statusBar.overlaysWebView(false);
                this.statusBar.backgroundColorByHexString('#f8f8f8')
                this.statusBar.styleDefault();
            } else {
                this.statusBar.styleBlackOpaque();
            }

            this.splashScreen.hide();

            let whichInsertPage: any = FirstInsertMapPage;
            this.s.get('ord')
                .then((res) => {
                    if (!res) {
                        this.s.set('ord', 'map');
                    }
                    if (res === 'esp') {
                        whichInsertPage = FirstSpeciesListPage;
                    }
                    this.pages = [
                        {title: 'INSERTION', component: whichInsertPage},
                        {title: 'VOSDONNEES', component: HomeListPage},
                        {title: 'DETERMINATION_TITLE', component: DeteGroupsListPage},
                        {title: 'LISTES', component: ListesGroupesPage},
                        {title: 'PARAMETRES', component: ParamsPage},
                        {title: 'CONNECT', component: ConnectPage},
                        {title: 'ABOUT', component: AboutPage}
                    ];
                });

            this.s.get('ord')
                .then((res) => {
                    if (!res) this.s.set('ord', 'map');
                });

            this.s.get('favMode')
                .then((res) => {
                    if (!res) this.s.set('favMode', 'most');
                });

            this.os.checkIfObservationTable();
            this.ss.checkIfFavSpeciesTable();

            this.s.get('creds')
                .then((creds) => {
                    if (creds) {
                        if (this.n.type == 'none') {
                            this.s.set('conn', false);
                        } else {
                            this.as.login(creds)
                                .then((r) => {
                                    if (r.status == 200) {
                                        this.http.useBasicAuth(creds.email, creds.password);
                                        this.s.set('conn', true);
                                    } else if (r.status == 401) {
                                        this.s.set('conn', false);
                                    }
                                })
                        }
                    } else {
                        this.s.set('conn', false);
                    }
                });

            this.s.get('selectedGroups')
                .then((res) => {
                    if (!res) {
                        this.s.set('selectedGroups', [true, true, false, false, false, false, true, true, false, true, false, false, false, true, true, true])
                    }
                });

            this.s.get('deteGroupSel')
                .then((s) => {
                    if (!s) {
                        this.s.set('deteGroupSel', [false, false, false, false, false, false]);
                    }
                });

            this.s.get('lastcoords')
                .then((res) => {
                    if (!res) {
                        this.s.set('lastcoords', [600000, 200000])
                    }
                });
        });
    }

    openPage(page) {
        this.nav.setRoot(page.component);
    }
}
