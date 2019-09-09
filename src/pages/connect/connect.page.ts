import {Component, OnInit} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {AuthService} from "../../services/auth.service";
import {Credentials} from "../../models/credentials.model";
import {HomeListPage} from "../home-list/home-list.page";
import {Storage} from "@ionic/storage";
import {TranslateService} from "@ngx-translate/core";
import {HTTP} from "@ionic-native/http";
import {Network} from "@ionic-native/network";

@Component({
    selector: 'page-connect',
    templateUrl: 'connect.page.html'
})
export class ConnectPage implements OnInit {

    isConnected: boolean = false;
    credentials: Credentials = {email: null, password: null};
    keepMeConnected: boolean = true;
    user: any;
    hasNetwork: boolean = true;

    constructor(private nc: NavController,
                private as: AuthService,
                private ac: AlertController,
                private s: Storage,
                private ts: TranslateService,
                private http: HTTP,
                private n: Network) {
    }

    backToHome() {
        this.nc.setRoot(HomeListPage);
    }

    lostPassword() {
        window.open("https://webfauna.cscf.ch/Webfauna/PasswordReset_input.do", '_blank', 'location=yes');
    }

    toRegister() {
        window.open("https://webfauna.cscf.ch/Webfauna/Subscription_input.do", '_blank', 'location=yes');
    }

    connect() {
        this.as.login(this.credentials)
            .then((r) => {
                if (r.status == 200) {
                    this.as.getUserInfo()
                        .then((r) => {
                            this.user = JSON.parse(r.data).resource[0].user;
                        });
                    this.http.useBasicAuth(this.credentials.email, this.credentials.password);
                    if (this.keepMeConnected) {
                        this.s.set('creds', this.credentials);
                    }
                    this.s.set('conn', true)
                        .then();
                    this.isConnected = true;
                } else {
                    console.log('bad user/pass');
                    const alert = this.ac.create({
                        title: this.ts.instant('ERREUR'),
                        message: this.ts.instant('ERR_MESSAGE_2'),
                        buttons: [this.ts.instant('FERMER')]
                    });
                    alert.present();
                }
            })
            .catch((e) => {
                const alert = this.ac.create({
                    title: this.ts.instant('ERREUR'),
                    message: this.ts.instant('ERR_MESSAGE_2'),
                    buttons: [this.ts.instant('FERMER')]
                });
                alert.present();
            });
    }

    disconnect() {
        this.http.clearCookies();
        this.s.set('conn', false)
            .then(() => {
                this.s.remove('creds')
                    .then(() => {
                        this.isConnected = false;
                    });
            });
    }

    ngOnInit() {
        if (this.n.type === 'none') {
            this.hasNetwork = false;
        }
        this.s.get('conn')
            .then((r) => {
                if (r) {
                    this.isConnected = true;
                    if (this.hasNetwork) {
                        this.as.getUserInfo()
                            .then((r) => {
                                this.user = JSON.parse(r.data).resource[0].user;
                            });
                    }
                }
            });
    }
}
