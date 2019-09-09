import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HomeListPage} from "../home-list/home-list.page";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from "@ionic/storage";
import {AuthService} from "../../services/auth.service";
import {Network} from "@ionic-native/network";
import {GroupService} from "../../services/group.service";
import {ParamsGroupsPage} from "../params-groups/params-groups.page";

@Component({
    selector: 'page-params',
    templateUrl: 'params.page.html'
})
export class ParamsPage implements OnInit {

    lang: string;
    mapFirst: string = 'map';
    logged: boolean = false;
    networked: boolean = true;

    constructor(
        public nc: NavController,
        public ts: TranslateService,
        public st: Storage,
        public as: AuthService,
        public n: Network,
        public gs: GroupService,
        public s: Storage
    ) {
    }

    backToHome() {
        this.nc.setRoot(HomeListPage);
    }

    saveLangSettings() {
        this.ts.use(this.lang);
        this.st.set('lang', this.lang);
    }

    saveMapFirstSettings() {
        this.st.set('ord', this.mapFirst)
    }

    toGroupSelectPage() {
        this.nc.push(ParamsGroupsPage);
    }

    ngOnInit() {
        if (this.n.type === 'none') {
            this.networked = false;
        }

        this.lang = this.ts.currentLang;

        this.st.get('ord')
            .then(res => {
                this.mapFirst = res;
            });
    }
}
