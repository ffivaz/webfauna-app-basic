import {Component, ViewChild} from "@angular/core";
import {Nav, Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {HomeListPage} from "../pages/home-list/home-list.page";
import {ParamsPage} from "../pages/params/params.page";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from "@ionic/storage";
import {ObservationsService} from "../services/observations.service";
import {AuthService} from "../services/auth.service";
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

    /**
     * Au moment de prendre une photo, certains téléphones android ferme l'application afin d'économiser de la mémoire.
     * Le code ci-dessous permet de récupérer l'image et de retourner directement au formulaire de saisie lors
     * de la réouverture de l'application.
      */
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

      /**
       * La langue de l'application (fr, de, it) est sélectionnée sur la base de la langue du téléphone. Si la langue est autre (en par exemple),
       * c'est le français qui est défini par défaut. Ce choix peut être modifié dans les paramètres. Le module pour les langues est @ngx-translate.
       */
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

        /**
         * Voir plus haut la remarque concernant les photos prises avec un téléphone android. Si l'application redémarre après une prise d'image,
         * l'utilisateur est renvoyé vers la page d'insertion des images. Sinon, vers la page principal (comportement normal).
         */
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
        this.statusBar.backgroundColorByHexString('#f8f8f8')
        this.statusBar.styleDefault();
      } else {
        this.statusBar.styleBlackOpaque();
      }

      this.splashScreen.hide();

      /**
       * Initialisation du menu principal (accessible en glissant depuis la gauche). La variable whichInsertPage
       * permet de fixer si lors de l'insertion d'une nouvelle donnée, c'est la carte (map) ou la liste des espèces (esp)
       * qui s'affiche.
       */
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
            {title: 'PARAMETRES', component: ParamsPage},
            {title: 'CONNECT', component: ConnectPage},
            {title: 'ABOUT', component: AboutPage}
          ];
        });

      /**
       * Initialisation du mode d'insertion. map = carte d'abord, esp = liste espèces d'abord. Ces paramètres sont modifiés dans
       * la page des paramètres.
       */
      this.s.get('ord')
        .then((res) => {
          if (!res) this.s.set('ord', 'map');
        });

      /**
       * Initialisation des tables sqlite contenant les observations et les espèces favorites, si elles n'existent pas déjà.
       */
      this.os.checkIfObservationTable();
      this.ss.checkIfFavSpeciesTable();

      /**
       * Service d'authentification. Les données sont stockées dans le téléphone. Lors de l'ouverture de l'application, un test est
       * effectué pour contrôler si l'utilisateur s'est déjà enregistré et s'il a décidé de rester connecté. Si oui, l'app se
       * reconnecte à l'API.
       */
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

      /**
       * Initialisation des groupes sélectionnés pour la saisie (espèces s'affichant dans le sous-formulaire des espèces). La liste
       * sélectionnée est ensuite gardée en mémoire.
       */
      this.s.get('selectedGroups')
        .then((res) => {
          if (!res) {
            this.s.set('selectedGroups', [true, true, false, false, false, false, true, true, false, true, false, false, false, true, true, true])
          }
        });

      /**
       * Initialisation des coordonnées (600000/200000 = Berne) pour les cartes. Le dernier endroit visité est ensuite stocké par le module carte.
       */
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
