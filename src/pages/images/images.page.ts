import {Component, OnInit} from "@angular/core";
import {SimpleObservationModel} from "../../models/simple-observation.model";
import {ActionSheetController, NavController, NavParams, Platform} from "ionic-angular";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {InsertFormPage} from "../insert-form/insert-form.page";
import {File} from "@ionic-native/file";
import {ImageResizer, ImageResizerOptions} from "@ionic-native/image-resizer";
import {Storage} from "@ionic/storage";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'page-images',
    templateUrl: 'images.page.html'
})
export class ImagesPage implements OnInit {

    // file:///storage/emulated/0/Android/data/app.cscf.webfauna2/cache/Screenshot_20180509-120130.png?1542199808928
    // file:///storage/emulated/0/1542199808956.jpg

    // file:///storage/emulated/0/Android/data/app.cscf.webfauna2/cache/20181114_075047.jpg?1542200020350
    // file:///storage/emulated/0/1542200020423.jpg

    observation: SimpleObservationModel;
    imgUrl: string[] = [];

    constructor(private np: NavParams,
                private c: Camera,
                private nc: NavController,
                private f: File,
                private imageResizer: ImageResizer,
                private p: Platform,
                private s: Storage,
                private asc: ActionSheetController,
                private ts: TranslateService) {
    }

    saveImages() {
        if (this.imgUrl.length == 0) {
            this.observation.img_url = null;
        } else {
            this.observation.img_url = JSON.stringify(this.imgUrl);
        }
        this.nc.setRoot(InsertFormPage, {
            'obs': this.observation
        })
    }

    takePic() {

        const options: CameraOptions = {
            quality: 50,
            destinationType: this.c.DestinationType.FILE_URI,
            encodingType: this.c.EncodingType.JPEG,
            mediaType: this.c.MediaType.PICTURE,
            saveToPhotoAlbum: true
        };

        if (this.p.is('android')) {
            if (this.imgUrl.length == 0) {
                this.observation.img_url = null;
            } else {
                this.observation.img_url = JSON.stringify(this.imgUrl);
            }
            this.s.set('obs_on_resume', this.observation)
                .then(() => {
                    this.c.getPicture(options)
                        .then((imagePath) => {
                            console.log(imagePath);
                            this.imgUrl.push(imagePath);
                        }, (err) => {
                            console.log(err);
                        });
                });
        } else {
            this.c.getPicture(options)
                .then((imagePath) => {
                    let currentName = imagePath.replace(/^.*[\\\/]/, '');

                    let d = new Date(),
                        n = d.getTime(),
                        newFileName = n + ".jpg";

                    this.f.moveFile(this.f.tempDirectory, currentName, this.f.dataDirectory, newFileName)
                        .then((success) => {
                            this.imgUrl.push(this.f.dataDirectory + newFileName);
                        }, function (error) {
                            console.log(error);
                        });
                }, (err) => {
                    console.log(err);
                });
        }
    }

    picFromLibrary() {

        const options: CameraOptions = {
            quality: 50,
            sourceType: 0,
            destinationType: this.c.DestinationType.FILE_URI,
            encodingType: this.c.EncodingType.JPEG,
            mediaType: this.c.MediaType.PICTURE,
            correctOrientation: true
        };

        this.c.getPicture(options)
            .then((imagePath) => {

                let img = new Image();

                console.log(imagePath);

                img.onload = (() => {
                    let targetWidth = img.width;
                    let targetHeight = img.height;
                    let aspect = img.width / img.height;
                    let longSideMax = 1280;

                    if (img.width > img.height) {
                        longSideMax = Math.min(img.width, longSideMax);
                        targetWidth = longSideMax;
                        targetHeight = longSideMax / aspect;
                    }
                    else {
                        longSideMax = Math.min(img.height, longSideMax);
                        targetHeight = longSideMax;
                        targetWidth = longSideMax * aspect;
                    }

                    let d = new Date(),
                        n = d.getTime(),
                        newFileName = n + ".jpg";

                    let options = {
                        uri: imagePath,
                        fileName: newFileName,
                        quality: 80,
                        width: targetWidth,
                        height: targetHeight
                    } as ImageResizerOptions;

                    if (this.p.is('ios')) {
                        this.imageResizer
                            .resize(options)
                            .then((filePath: string) => {
                                let currentName = filePath.replace(/^.*[\\\/]/, '');

                                this.f.moveFile(this.f.documentsDirectory, currentName, this.f.dataDirectory, newFileName)
                                    .then(() => {
                                        this.imgUrl.push(this.f.dataDirectory + newFileName);
                                    }, function (error) {
                                        console.log(error);
                                    });
                            })
                            .catch(e => console.log(e));
                    } else {
                        this.imgUrl.push(imagePath.split('?')[0]);
                    }

                });

                img.src = imagePath;


            }, (err) => {
                console.log(err);
            });
    }

    openImageMod(img) {
        console.log('delete: ' + img);
        let actionSheet = this.asc.create({
            title: this.ts.instant('ACTION_TEXT'),
            buttons: [
                {
                    text: this.ts.instant('EFFACER'),
                    role: 'destructive',
                    handler: () => {
                        this.imgUrl.splice(this.imgUrl.indexOf(img), 1);
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
        actionSheet.present();
    }

    ngOnInit() {
        if (this.np.get('obs')) {
            this.observation = this.np.get('obs');
            if (this.np.get('obs').img_url) {
                this.imgUrl = JSON.parse(this.np.get('obs').img_url);
            }
        }

        this.s.get('onResumeObs')
            .then((r) => {
                if (r) {
                    this.s.remove('onResumeObs');
                    this.observation = r;
                    this.imgUrl = JSON.parse(r.img_url);
                }
            })
    }
}
