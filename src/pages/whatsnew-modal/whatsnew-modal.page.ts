/** Lorsque le numéro de version est incrémenté dans /config.xml, l'application affiche un modal lors de la première ouverture, permettant d'informer
 * l'utilisateur des nouveautés. Les fichiers html, par langue, sont dans /src/assets/i18n/whatsnew.*lang*.html.
 * L'affichage (ou non) du modal est géré par la page parincipale (home-list). */

import {Component, OnInit} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";
import {AppVersion} from "@ionic-native/app-version";
import {TranslateService} from "@ngx-translate/core";
import {Http} from "@angular/http";

@Component({
    selector: 'page-whatsnew-modal',
    templateUrl: 'whatsnew-modal.page.html'
})
export class WhatsnewModalPage implements OnInit {

    htmlContent: string;
    title: string;

    constructor(public vc: ViewController,
                public np: NavParams,
                private av: AppVersion,
                private http: Http,
                private ts: TranslateService) {
    }

    closeModal() {
        this.vc.dismiss();
    }

    ngOnInit() {

        let lang = this.ts.currentLang;
        let fileToLoad = 'assets/i18n/whatsnew.' + lang + '.html';

        this.av.getVersionNumber()
            .then((r) => {
                this.title = this.ts.instant('WHATSNEW') + " " + r;
            });

        this.http.get(fileToLoad)
            .subscribe((r)=>{
                this.htmlContent = r.text();
            });
    }
}
