import {Component, OnInit} from "@angular/core";
import {AlertController, NavController} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {ParamsPage} from "../params/params.page";
import {GroupService} from "../../services/group.service";
import {GroupResource} from "../../models/group.model";
import {Storage} from "@ionic/storage";

@Component({
    selector: 'params-groups-page',
    templateUrl: 'params-groups.page.html'
})
export class ParamsGroupsPage implements OnInit {

    allGroups: GroupResource[];
    selection: boolean[];
    lang: string;

    constructor(
        public ac: AlertController,
        public ts: TranslateService,
        public nc: NavController,
        public gs: GroupService,
        public s: Storage
    ) {
    }

    getGroupFromLang(group: GroupResource) {
        return eval('group.designations.' + this.lang);
    }

    saveGroups() {
        console.log(this.selection);
        this.s.set('selectedGroups', this.selection);
        let alert = this.ac.create({
            title: this.ts.instant('SUCCESS'),
            message: this.ts.instant('GROUPS_SAVED'),
            buttons: [
                {
                    text: this.ts.instant('FERMER'),
                    handler: () => {
                        this.nc.setRoot(ParamsPage);
                    }
                }
            ]
        });
        alert.present();
    }

    backToParams() {
        this.nc.setRoot(ParamsPage);
    }

    ngOnInit() {

        this.lang = this.ts.currentLang;

        this.s.get('selectedGroups')
            .then((res) => {
                if (res) {
                    this.selection = res;
                    this.gs.getAll()
                        .subscribe((res) => {
                            this.allGroups = res;
                        });
                } else {
                    this.gs.getAll()
                        .subscribe((res) => {
                            console.log(res);
                            this.allGroups = res;
                            let arr = new Array<boolean>(res.length);
                            arr.fill(false, 0, res.length);
                            this.selection = arr;
                        });
                }
            });
    }
}