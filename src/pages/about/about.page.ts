import {Component, OnInit} from '@angular/core';
import {NavController} from "ionic-angular";
import {HomeListPage} from "../home-list/home-list.page";
import {TranslateService} from "@ngx-translate/core";
import {Http} from "@angular/http";
import {AppVersion} from "@ionic-native/app-version";


@Component({
    selector: 'page-about',
    templateUrl: 'about.page.html'
})
export class AboutPage implements OnInit {

    lang: string;
    text: any;
    version: string[] = [];

    constructor(
        private nc: NavController,
        private ts: TranslateService,
        private http: Http,
        private av: AppVersion
    ) {}

    backToHome() {
        this.nc.setRoot(HomeListPage);
    }

    ngOnInit() {
        this.lang = this.ts.currentLang;

        let fileToLoad = 'assets/i18n/about.' + this.lang + '.html';

        this.http.get(fileToLoad)
            .subscribe((r)=>{
                this.text = r.text();
            });

        this.av.getVersionNumber()
            .then((r)=>{
                this.version.push(r);
            });

        this.av.getVersionCode()
            .then((r)=>{
                this.version.push(String(r));
            });
    }

}
