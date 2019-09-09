import {Component, OnInit} from "@angular/core";
import {ModalController, NavController, NavParams} from "ionic-angular";
import {DeterminationService} from "../../../services/determination.service";
import {DeteTaxons} from "../../../models/dete-taxons.model";
import {ListesGroupesPage} from "../listes-groupes/listes-groupes.page";
import {HomeListPage} from "../../home-list/home-list.page";
import {ListesModalEspecePage} from "../listes-modal-espece/listes-modal-espece.page";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'listes-especes-page',
    templateUrl: 'listes-especes.page.html'
})
export class ListesEspecesPage implements OnInit {

    groupInfo;
    species: DeteTaxons[] = [];
    searchTerm: string;
    lang: string;
    groupName: string;

    constructor(private np: NavParams,
                private nc: NavController,
                private ds: DeterminationService,
                private mc: ModalController,
                private ts: TranslateService) {
    }

    backToHome() {
        this.nc.setRoot(HomeListPage);
    }


    filterList() {
        this.ds.getTaxons(this.groupInfo.short)
            .then((r)=>{
                let data = r.filter((item) => {
                        return item.name.concat(item.de).concat(item.fr).concat(item.it).concat().toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
                    });
                data.sort((a, b) => {
                    if (a.name < b.name) return -1;
                    else if (a.name > b.name) return 1;
                    else return 0;
                });
                this.species = data;
            })
    }

    getNameWithLang(spec): string {
        return eval("spec." + this.lang);
    }

    backToGroups() {
        this.nc.setRoot(ListesGroupesPage)
    }

    openModal(specie) {
        let speciesModal = this.mc.create(ListesModalEspecePage, {
            'specie': specie,
            'group': this.groupInfo,
            'species': this.species
        });
        speciesModal.present();
    }

    ngOnInit() {

        this.groupInfo = this.np.get('group');
        this.lang = this.ts.currentLang;
        this.groupName = eval("this.groupInfo.name_" + this.lang);

        this.ds.getTaxons(this.np.get('group').short)
            .then(res => {
                this.species = res;
            });
    }
}