import {Component, OnInit} from "@angular/core";
import {DeteGroup} from "../../../models/dete-groups.model";
import {NavController} from "ionic-angular";
import {HomeListPage} from "../../home-list/home-list.page";
import {DeterminationService} from "../../../services/determination.service";
import {TranslateService} from "@ngx-translate/core";
import {ListesEspecesPage} from "../listes-especes/listes-especes.page";
import {Storage} from "@ionic/storage";
import {ParamsDeteGroupsPage} from "../../params-dete-groups/params-dete-groups.page";
import {File} from "@ionic-native/file";

@Component({
    selector: 'listes-groupes-page',
    templateUrl: 'listes-groupes.page.html',
})
export class ListesGroupesPage implements OnInit {

    groups: DeteGroup[];
    lang: string;
    selection: boolean[];

    constructor(
        private ds: DeterminationService,
        private nc: NavController,
        private ts: TranslateService,
        private s: Storage,
        private f: File
    ){}

    select(group: DeteGroup) {
        this.nc.push(ListesEspecesPage, {
            'group': group
        })
    }

    backToHome() {
        this.nc.setRoot(HomeListPage);
    }

    returnNameWithLang(group: DeteGroup): string {
        return eval("group.name_" + this.lang);
    }

    toDeteGroups() {
        this.nc.setRoot(ParamsDeteGroupsPage);
    }

    returnImagePath(group: DeteGroup) {
        return this.f.dataDirectory + group.short + "/" + group.logo;
    }

    ngOnInit() {
        this.lang = this.ts.currentLang;
        this.s.get('deteGroupSel')
            .then((s) => {
                this.selection = s;
                this.ds.getGroups()
                    .then(res => {
                        let data = res.filter((item) => {
                            return s[res.indexOf(item)]
                        });
                        this.groups = data;
                    });
            });
    }
}