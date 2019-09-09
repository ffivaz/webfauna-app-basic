import {Injectable} from "@angular/core";
import {ObservationResource} from "../models/observation.model";
import 'rxjs/add/operator/toPromise';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {SimpleObservationModel} from "../models/simple-observation.model";
import {HTTP, HTTPResponse} from "@ionic-native/http";

@Injectable()
export class ObservationsService {

    headers = {
        'Content-Type': 'application/json'
    };
    webfaunaApiUrl = "https://webfauna-api.cscf.ch/webfauna-ws/api/v1";

    constructor(private http: HTTP,
                private sqlite: SQLite) {
    }

    setUploaded(obs: SimpleObservationModel): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let query = "UPDATE observations SET uploaded = 1 WHERE rowid = " + obs.rowid;

            this.sqlite.create({
                name: 'webfauna.db',
                location: 'default'
            })
                .then((db: SQLiteObject) => {
                    db.executeSql(query, [])
                        .then((res) => {
                            resolve(true);
                        })
                        .catch((err) => reject(err))
                });
        });
    }

    checkIfObservationTable() {
        this.sqlite.create({
            name: 'webfauna.db',
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                db.executeSql('create table if not exists observations(' +
                    'StatusCode TEXT,' +
                    'userId INTEGER,' +
                    'groupId TEXT,' +
                    'speciesId TEXT,' +
                    'identificationMethodCode TEXT,' +
                    'samplingMethodCode TEXT,' +
                    'dateDay INTEGER,' +
                    'dateMonth INTEGER,' +
                    'dateYear INTEGER,' +
                    'datePrecision INTEGER,' +
                    'remark TEXT,' +
                    'environmentCode TEXT,' +
                    'milieuCode TEXT,' +
                    'substratCode TEXT,' +
                    'structureCode TEXT,' +
                    'countryCode TEXT,' +
                    'departmentCode TEXT,' +
                    'precisionCode TEXT,' +
                    'localite TEXT,' +
                    'lieudit TEXT,' +
                    'swissCoordinatesX INTEGER,' +
                    'swissCoordinatesY INTEGER,' +
                    'altitude INTEGER,' +
                    'individuals INTEGER,' +
                    'collection INTEGER,' +
                    'males INTEGER,' +
                    'females INTEGER,' +
                    'eggs INTEGER,' +
                    'larvae INTEGER,' +
                    'exuviae INTEGER,' +
                    'nymphs INTEGER,' +
                    'subadults INTEGER,' +
                    'mating INTEGER,' +
                    'tandem INTEGER,' +
                    'clutch INTEGER,' +
                    'img_url TEXT,' +
                    'projet TEXT,' +
                    'objectNumber TEXT,' +
                    'uploaded INTEGER' +
                    ')', [])
                    .then()
                    .catch(e => {
                        console.log(e);
                        db.executeSql('alter table observations add column objectNumber TEXT')
                            .then()
                            .catch((e)=>{
                                console.log(e);
                            })
                    });
            })
            .catch(e => console.log(e));
    }

    insertIntoDB(obs: SimpleObservationModel): boolean {

        let errors = false;
        let query = "INSERT INTO observations (StatusCode,userId,groupId,speciesId,identificationMethodCode,samplingMethodCode,dateDay,dateMonth,dateYear,datePrecision,remark,environmentCode,milieuCode,substratCode,structureCode,countryCode,departmentCode,precisionCode,localite,lieudit,swissCoordinatesX,swissCoordinatesY,altitude,individuals,collection,males,females,eggs,larvae,exuviae,nymphs,subadults,mating,tandem,clutch,img_url,projet,objectNumber,uploaded) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

        let subObj = [obs.StatusCode, obs.userId, obs.groupId, obs.speciesId, obs.identificationMethodCode, obs.samplingMethodCode, obs.dateDay, obs.dateMonth, obs.dateYear, obs.datePrecision, obs.remark, obs.environmentCode, obs.milieuCode, obs.substratCode, obs.structureCode, obs.countryCode, obs.departmentCode, obs.precisionCode, obs.localite, obs.lieudit, obs.swissCoordinatesX, obs.swissCoordinatesY, obs.altitude, obs.individuals, obs.collection, obs.males, obs.females, obs.eggs, obs.larvae, obs.exuviae, obs.nymphs, obs.subadults, obs.mating, obs.tandem, obs.clutch, obs.img_url, obs.projet, obs.objectNumber, obs.uploaded];

        this.sqlite.create({
            name: 'webfauna.db',
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                db.executeSql(query, subObj)
                    .then()
                    .catch(e => {
                        console.log(e);
                        errors = true;
                    });
            })
            .catch(e => {
                console.log(e);
                errors = true;
            });

        return !errors;

    }

    updateIntoDB(obs: SimpleObservationModel): boolean {
        let errors = false;
        let query = "UPDATE observations SET StatusCode = ?,userId = ?,groupId = ?,speciesId = ?,identificationMethodCode = ?,samplingMethodCode = ?,dateDay = ?,dateMonth = ?,dateYear = ?,datePrecision = ?,remark = ?,environmentCode = ?,milieuCode = ?,substratCode = ?,structureCode = ?,countryCode = ?,departmentCode = ?,precisionCode = ?,localite = ?,lieudit = ?,swissCoordinatesX = ?,swissCoordinatesY = ?,altitude = ?,individuals = ?,collection = ?,males = ?,females = ?,eggs = ?,larvae = ?,exuviae = ?,nymphs = ?,subadults = ?,mating = ?,tandem = ?,clutch = ?,img_url = ?,projet = ?,objectNumber = ?, uploaded=? WHERE rowid = " + obs.rowid;
        let subObj = [obs.StatusCode, obs.userId, obs.groupId, obs.speciesId, obs.identificationMethodCode, obs.samplingMethodCode, obs.dateDay, obs.dateMonth, obs.dateYear, obs.datePrecision, obs.remark, obs.environmentCode, obs.milieuCode, obs.substratCode, obs.structureCode, obs.countryCode, obs.departmentCode, obs.precisionCode, obs.localite, obs.lieudit, obs.swissCoordinatesX, obs.swissCoordinatesY, obs.altitude, obs.individuals, obs.collection, obs.males, obs.females, obs.eggs, obs.larvae, obs.exuviae, obs.nymphs, obs.subadults, obs.mating, obs.tandem, obs.clutch, obs.img_url, obs.projet, obs.objectNumber, obs.uploaded];

        this.sqlite.create({
            name: 'webfauna.db',
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                db.executeSql(query, subObj)
                    .then()
                    .catch(e => {
                        console.log(e);
                        errors = true;
                    });
            })
            .catch(e => {
                console.log(e);
                errors = true;
            });

        return !errors;
    }

    getFromDB(limit: number): Promise<SimpleObservationModel[]> {
        return new Promise((resolve, reject) => {

            let query = 'SELECT rowid, * FROM observations ORDER BY rowid DESC LIMIT ' + limit;

            return this.sqlite.create({
                name: 'webfauna.db',
                location: 'default'
            })
                .then((db: SQLiteObject) => {

                    return db.executeSql(query, [])
                        .then(res => {
                            if (res.rows.length > 0) {
                                let data = [];
                                for (let _i = 0; _i < res.rows.length; _i++) {
                                    data.push(res.rows.item(_i));
                                }
                                resolve(data);
                            } else {
                                resolve(undefined);
                            }
                        })
                        .catch(e => {
                            reject(e);
                        });
                })
                .catch(e => {
                    reject(e);
                });
        });
    }

    getObjToUpload(): Promise<SimpleObservationModel[]> {
        return new Promise((resolve, reject) => {

            let query = 'SELECT rowid, * FROM observations WHERE uploaded=0 ORDER BY rowid DESC';

            return this.sqlite.create({
                name: 'webfauna.db',
                location: 'default'
            })
                .then((db: SQLiteObject) => {

                    db.executeSql(query, [])
                        .then(res => {
                            if (res.rows.length > 0) {
                                let data = [];
                                for (let _i = 0; _i < res.rows.length; _i++) {
                                    data.push(res.rows.item(_i));
                                }
                                resolve(data);
                            } else {
                                resolve(undefined);
                            }
                        })
                        .catch(e => console.log(e));
                })
                .catch(e => {
                    reject(e);
                });
        });
    }

    deleteFromDB(obs: SimpleObservationModel): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let deleteQuery = 'DELETE FROM observations WHERE rowid=' + obs.rowid;
            this.sqlite.create({
                name: 'webfauna.db',
                location: 'default'
            })
                .then((db: SQLiteObject) => {
                    db.executeSql(deleteQuery, [])
                        .then(() => {
                            resolve(true);
                        })
                        .catch(e => {
                            reject(e);
                        });
                })
        });
    }

    deleteUploadedFromDB(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let deleteQuery = 'DELETE FROM observations WHERE uploaded = 1';
            this.sqlite.create({
                name: 'webfauna.db',
                location: 'default'
            })
                .then((db: SQLiteObject) => {
                    db.executeSql(deleteQuery, [])
                        .then(() => {
                            resolve(true);
                        })
                        .catch(e => {
                            reject(e);
                        });
                })
        });
    }

    /**
     * Reconstruit l'objet pour l'API depuis un objet simple (observations)
     *
     * @param {SimpleObservationModel} obs
     * @return {ObservationResource}
     */
    rebuildData(obs: SimpleObservationModel): ObservationResource {

        let ort: ObservationResource = {
            links: [],
            statusCode: null,
            userId: null,
            groupId: obs.groupId,
            speciesId: obs.speciesId,
            identificationMethodCode: obs.identificationMethodCode,
            samplingMethodCode: obs.samplingMethodCode,
            dateDay: obs.dateDay,
            dateMonth: obs.dateMonth,
            dateYear: obs.dateYear,
            datePrecision: obs.datePrecision,
            remark: obs.remark,
            environment: {
                environmentCode: obs.environmentCode,
                milieuCode: obs.milieuCode,
                milieuInclusionCode1: null,
                milieuInclusionCode2: null,
                milieuInclusionCode3: null,
                milieuAdjacentCode1: null,
                milieuAdjacentCode2: null,
                milieuAdjacentCode3: null,
                humanInfluenceCode: null,
                substratCode: obs.substratCode,
                substrat1Code: null,
                substrat2Code: null,
                substrat3Code: null,
                substrat4Code: null,
                structureCode: obs.structureCode,
                associatedOrganism: null
            },
            location: {
                countryCode: null,
                departmentCode: null,
                precisionCode: obs.precisionCode,
                localite: null,
                lieudit: obs.localite,
                swissCoordinatesX: obs.swissCoordinatesX,
                swissCoordinatesY: obs.swissCoordinatesY,
                altitude: null,
            },
            abundance: {
                individuals: obs.individuals,
                collection: obs.collection,
                males: obs.males,
                females: obs.females,
                eggs: obs.eggs,
                larvae: obs.larvae,
                exuviae: obs.exuviae,
                nymphs: obs.nymphs,
                subadults: obs.subadults,
                mating: obs.mating,
                tandem: obs.tandem,
                clutch: obs.clutch,
            },
            source: {
                legateeLastname: null,
                legateeFirstName: null,
                museumName: null,
                collectionName: null,
                objectNumber: obs.objectNumber,
                projectNumber: obs.projet,
                appCode: "WFA-MOB",
                occurrenceNumber: null
            }
        };

        return ort;

    }

    sendToAPI(obs: SimpleObservationModel): Promise<HTTPResponse> {
        return new Promise((resolve, reject) => {

            let url = this.webfaunaApiUrl + '/observations';
            let formattedObs = this.rebuildData(obs);
            this.http.setDataSerializer('json');

            return this.http
                .post(url, formattedObs, this.headers)
                .then((r) => {
                    resolve(r);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }
}