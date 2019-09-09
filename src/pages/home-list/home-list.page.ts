import {Component, OnInit} from '@angular/core';
import {
    ActionSheetController,
    AlertController,
    LoadingController,
    ModalController,
    NavController,
    Platform
} from 'ionic-angular';
import {ObservationsService} from "../../services/observations.service";
import {SimpleObservationModel} from "../../models/simple-observation.model";
import {InsertFormPage} from "../insert-form/insert-form.page";
import {Network} from "@ionic-native/network";
import {ConnectPage} from "../connect/connect.page";
import {TranslateService} from "@ngx-translate/core";
import {FirstInsertMapPage} from "../first-insert-map/first-insert-map.page";
import {FirstSpeciesListPage} from "../first-species-list/first-species-list.page";
import {Storage} from "@ionic/storage";
import {HTTP} from "@ionic-native/http";
import {WhatsnewModalPage} from "../whatsnew-modal/whatsnew-modal.page";
import {AppVersion} from "@ionic-native/app-version";

@Component({
    selector: 'page-list',
    templateUrl: 'home-list.page.html'
})
export class HomeListPage implements OnInit {

    localObservations: SimpleObservationModel[];
    notUpdatedLocalObservations: SimpleObservationModel[];
    order: string = 'date';
    sendMode: boolean = false;
    selection: boolean[];
    sendInProgress: boolean = false;
    loadProgress: number = 0;
    limit: number = 25;
    isConnected: boolean = true;
    finishedLoading: boolean = false;
    sendDisabled: boolean = true;
    hasNet: boolean = true;

    constructor(private nc: NavController,
                private os: ObservationsService,
                private ac: AlertController,
                private lc: LoadingController,
                private n: Network,
                private ts: TranslateService,
                private st: Storage,
                private http: HTTP,
                private asc: ActionSheetController,
                private mc: ModalController,
                private av: AppVersion,
                private p: Platform) {
    }

    doSimpleRefresh() {

        this.os.getFromDB(this.limit)
            .then((response) => {
                this.localObservations = response;
            });

        this.os.getObjToUpload()
            .then((response) => {
                this.notUpdatedLocalObservations = response;
                if (response) {
                    let arr = new Array<boolean>(response.length);
                    arr.fill(true, 0, response.length);
                    this.selection = arr;
                    if (response.length > 0) {
                        this.sendDisabled = false;
                    }
                }
                setTimeout(() => {
                    this.finishedLoading = true;

                }, 500);
            });
    }

    addLimit() {
        this.limit = this.limit + 25;
        this.doSimpleRefresh();
    }

    toModify(obj: SimpleObservationModel) {
        this.nc.setRoot(InsertFormPage, {
            'obs': obj
        })
    }

    deleteObject(obs: SimpleObservationModel) {
        let alert = this.ac.create({
            title: this.ts.instant('DELETE'),
            message: this.ts.instant('DEL_MESSAGE'),
            buttons: [
                {
                    text: this.ts.instant('OUI'),
                    handler: () => {
                        this.os.deleteFromDB(obs)
                            .then(() => {
                                this.doSimpleRefresh();
                            });
                    }
                },
                {
                    text: this.ts.instant('NON'),
                    role: 'cancel',
                    handler: () => {
                        this.doSimpleRefresh();
                    }
                }
            ]
        });
        alert.present();
    }

    useAsNew(obj: SimpleObservationModel) {
        obj.speciesId = null;
        obj.groupId = null;
        obj.identificationMethodCode = null;
        obj.individuals = null;
        obj.males = null;
        obj.females = null;
        obj.larvae = null;
        obj.exuviae = null;
        obj.eggs = null;
        obj.clutch = null;
        obj.mating = null;
        obj.tandem = null;
        obj.subadults = null;
        obj.collection = null;
        obj.rowid = null;
        obj.uploaded = 0;
        obj.img_url = null;
        obj.milieuCode = null;
        obj.remark = null;
        obj.structureCode = null;
        obj.substratCode = null;
        obj.nymphs = null;
        this.nc.setRoot(InsertFormPage, {
            'obs': obj
        });
    }

    toSendMode() {
        this.st.get('conn')
            .then((res) => {
                if (res) {
                    this.sendMode = true;
                } else {
                    let alert = this.ac.create({
                        title: this.ts.instant('ERREUR'),
                        message: this.ts.instant('NOT_CONN_MESSAGE'),
                        buttons: [
                            {
                                text: this.ts.instant('CONNECT'),
                                handler: () => {
                                    this.nc.push(ConnectPage);
                                }
                            },
                            {
                                text: this.ts.instant('FERMER'),
                                role: 'cancel',
                                handler: () => {

                                }
                            }
                        ]
                    });
                    alert.present();
                }

            })
    }

    toNormalMode() {
        this.sendMode = false;
    }

    sendData() {
        this.sendInProgress = true;
        this.loadProgress = 0;

        let arrayToTransfer = this.notUpdatedLocalObservations.filter((item) => {
            return this.selection[this.notUpdatedLocalObservations.indexOf(item)];
        });

        let i = 1;
        let j = arrayToTransfer.length;

        let loading = this.lc.create({
            content: this.ts.instant('TRANSMISSION_EN_COURS') + ": " + j + " " + this.ts.instant('DONNEES')
        });

        loading.present();

        let that = this;

        async function sendObjects(objs, url) {
            let processed = objs.length;
            for (const obji of objs) {
                await that.http.uploadFile(url, null, null, obji, 'file')
                    .then((r) => {
                        processed--;
                    })
                    .catch((e) => {
                        console.log(e);
                    })
            }
            return (processed == 0);
        }

        arrayToTransfer.forEach((obj) => {
                this.os.sendToAPI(obj)
                    .then((r) => {
                        if (r.status == 201) {
                            if (obj.img_url && JSON.parse(obj.img_url).length > 0) {
                                let rd = JSON.parse(r.data);
                                let url = rd.resource[0].links[0].uri + '/files';
                                url = url.replace('http', 'https');
                                let objs = JSON.parse(obj.img_url);

                                sendObjects(objs, url)
                                    .then((r) => {
                                        this.os.setUploaded(obj)
                                            .then(() => {
                                                this.loadProgress = Math.round(i / j * 100);
                                                if (this.loadProgress == 100) {
                                                    loading.dismiss();
                                                    this.sendInProgress = false;
                                                    this.sendMode = false;
                                                    this.doSimpleRefresh();
                                                } else {
                                                    i++;
                                                }
                                            });
                                    });
                            } else {
                                this.os.setUploaded(obj)
                                    .then(() => {
                                        this.loadProgress = Math.round(i / j * 100);
                                        if (this.loadProgress == 100) {
                                            loading.dismiss();
                                            this.sendInProgress = false;
                                            this.sendMode = false;
                                            this.doSimpleRefresh();
                                        } else {
                                            i++;
                                        }
                                    });
                            }
                        }
                    })
            }
        );

    }

    toInsert() {
        this.st.get('ord')
            .then(res => {
                if (res == 'esp') {
                    this.nc.setRoot(FirstSpeciesListPage);
                } else if (res == 'map') {
                    this.nc.setRoot(FirstInsertMapPage)
                }
            });
    }

    archiveSentData() {
        let alert = this.ac.create({
            title: this.ts.instant('DELETE'),
            message: this.ts.instant('ARCHIVAGE_MESSAGE'),
            buttons: [
                {
                    text: this.ts.instant('OUI'),
                    handler: () => {
                        this.os.deleteUploadedFromDB()
                            .then(() => {
                                this.doSimpleRefresh();
                            });
                    }
                },
                {
                    text: this.ts.instant('NON')
                }
            ]
        });
        alert.present();
    }

    openActionSheet(localObservation) {

        let actionSheet: any;

        if (localObservation.uploaded == 1) {
            actionSheet = this.asc.create({
                title: this.ts.instant('ACTION_TEXT'),
                buttons: [
                    {
                        text: this.ts.instant('EFFACER'),
                        role: 'destructive',
                        handler: () => {
                            this.deleteObject(localObservation)
                        }
                    },
                    {
                        text: this.ts.instant('REPRENDRE'),
                        handler: () => {
                            this.useAsNew(localObservation)
                        }
                    },
                    {
                        text: this.ts.instant('ANNULER'),
                        role: 'cancel',
                        handler: () => {
                        }
                    }
                ]
            });
        } else {
            actionSheet = this.asc.create({
                title: this.ts.instant('ACTION_TEXT'),
                buttons: [
                    {
                        text: this.ts.instant('EFFACER'),
                        role: 'destructive',
                        handler: () => {
                            this.deleteObject(localObservation)
                        }
                    },
                    {
                        text: this.ts.instant('MAJ'),
                        handler: () => {
                            this.toModify(localObservation)
                        }
                    },
                    {
                        text: this.ts.instant('REPRENDRE'),
                        handler: () => {
                            this.useAsNew(localObservation)
                        }
                    },
                    {
                        text: this.ts.instant('ANNULER'),
                        role: 'cancel',
                        handler: () => {
                        }
                    }
                ]
            });
        }

        actionSheet.present();
    }

    toConnectionPage() {
        this.nc.setRoot(ConnectPage);
    }

    showWhatsNewModal() {
        let whatsnewModal = this.mc.create(WhatsnewModalPage);
        whatsnewModal.present();
    }

    ngOnInit() {

        this.av.getVersionNumber()
            .then( (r)=>{
                if(localStorage["whatsnewPopupWasShown"] != r){
                    this.showWhatsNewModal();
                    localStorage.setItem("whatsnewPopupWasShown", r);
                }
            });

        if (this.n.type === 'none') {
            this.hasNet = false;
        }

        this.st.get('conn')
            .then((r) => {
                if (r) {
                    this.isConnected = true;
                } else {
                    this.isConnected = false;
                }
            });

        this.doSimpleRefresh();

    }

    ionViewDidEnter() {
        this.p.registerBackButtonAction(() => {
            console.log('Back button does not work in this app');
        }, 10);
    }

}
