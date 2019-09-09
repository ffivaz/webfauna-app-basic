import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {Geolocation} from '@ionic-native/geolocation';
import {SQLite} from "@ionic-native/sqlite";

import {MyApp} from "./app.component";
import {HomeListPage} from "../pages/home-list/home-list.page";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {ObservationsService} from "../services/observations.service";
import {InsertFormPage} from "../pages/insert-form/insert-form.page";
import {FirstSpeciesListPage} from "../pages/first-species-list/first-species-list.page";
import {SpeciesService} from "../services/species.service";
import {GroupService} from "../services/group.service";
import {InsertMapPage} from "../pages/insert-map/insert-map.page";
import {IdentificationListPage} from "../pages/identification-list/identification-list.page";
import {RealmsService} from "../services/realms.service";
import {AbondancePage} from "../pages/abondance/abondance.page";
import {ConnectPage} from "../pages/connect/connect.page";
import {ParamsPage} from "../pages/params/params.page";
import {AuthService} from "../services/auth.service";
import {Network} from "@ionic-native/network";
import {SpeciesName} from "../pipes/species-name.pipe";
import {EnvironnementListPage} from "../pages/environnement-list/environnement-list.page";
import {MilieuListPage} from "../pages/milieu-list/milieu-list.page";
import {StructureListPage} from "../pages/structure-list/structure-list.page";
import {SubstratListPage} from "../pages/substrat-list/substrat-list.page";
import {ImagesPage} from "../pages/images/images.page";
import {Camera} from "@ionic-native/camera";
import {RealmExtractor} from "../pipes/realm-extractor.pipe";
import {PrecisionListPage} from "../pages/precision-list/precision-list.page";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {SpeciesListPage} from "../pages/species-list/species-list.page";
import {IonicStorageModule} from "@ionic/storage";
import {ProgressBarComponent} from "../components/progress-bar/progress-bar";
import {FirstInsertMapPage} from "../pages/first-insert-map/first-insert-map.page";
import {DeterminationListPage} from "../pages/determination-list/determination-list.page";
import {ParamsGroupsPage} from "../pages/params-groups/params-groups.page";
import {File} from "@ionic-native/file";
import {VernacularNamePipe} from "../pipes/vernacular-name.pipe";
import {MomentPipe} from "../pipes/moment.pipe";
import {ImageResizer} from "@ionic-native/image-resizer";
import {Zip} from "@ionic-native/zip";
import {AboutPage} from "../pages/about/about.page";
import {HTTP} from "@ionic-native/http";
import {HttpModule} from "@angular/http";
import {WhatsnewModalPage} from "../pages/whatsnew-modal/whatsnew-modal.page";
import {AppVersion} from "@ionic-native/app-version";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        MyApp,
        HomeListPage,
        InsertFormPage,
        FirstSpeciesListPage,
        FirstInsertMapPage,
        SpeciesListPage,
        InsertMapPage,
        IdentificationListPage,
        DeterminationListPage,
        AbondancePage,
        ConnectPage,
        ParamsPage,
        ParamsGroupsPage,
        EnvironnementListPage,
        MilieuListPage,
        StructureListPage,
        SubstratListPage,
        PrecisionListPage,
        ImagesPage,
        SpeciesName,
        RealmExtractor,
        VernacularNamePipe,
        MomentPipe,
        AboutPage,
        ProgressBarComponent,
        WhatsnewModalPage
    ],
    imports: [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomeListPage,
        InsertFormPage,
        FirstSpeciesListPage,
        FirstInsertMapPage,
        SpeciesListPage,
        InsertMapPage,
        IdentificationListPage,
        DeterminationListPage,
        AbondancePage,
        ConnectPage,
        ParamsPage,
        ParamsGroupsPage,
        EnvironnementListPage,
        MilieuListPage,
        StructureListPage,
        SubstratListPage,
        PrecisionListPage,
        ImagesPage,
        AboutPage,
        WhatsnewModalPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        ObservationsService,
        SpeciesService,
        GroupService,
        RealmsService,
        Geolocation,
        SQLite,
        AuthService,
        Network,
        Camera,
        File,
        ImageResizer,
        Zip,
        HTTP,
        AppVersion
    ]
})
export class AppModule {
}
