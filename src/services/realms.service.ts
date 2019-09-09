import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {RealmDBModel} from "../models/realm.db.model";

@Injectable()
export class RealmsService {

    constructor(private http: Http) {
    }

    getRealmFromFile(realmCode: string, term?: string, lang?: string, identificationCodes?: any): Promise<RealmDBModel[]> {

        let url = "assets/tables/" + realmCode + ".json";

        return this.http
            .get(url)
            .toPromise()
            .then(res => {
                let data = res.json();
                if (lang) {
                    data = data.filter((item) => {
                        return item.languageCode.indexOf(lang) > -1;
                    });
                }
                if (term) {
                    data = data.filter((item) => {
                        return item.designation.toLowerCase().indexOf(term.toLowerCase()) > -1 || item['REST-ID'].replace('-', '').indexOf(term) === 0;
                    });
                }
                if (identificationCodes) {
                    data = data.filter((item) => {
                        return identificationCodes.includes(item['REST-ID']);
                    });
                }

                if (realmCode == 'typ') {
                    data.sort((a, b) => {
                        if (a['REST-ID'] < b['REST-ID']) return -1;
                        else if (a['REST-ID'] > b['REST-ID']) return 1;
                        else return 0;
                    });
                } else if (realmCode == 'prd') {
                    data.sort((a, b) => {
                        if (Number(a['REST-ID']) > Number(b['REST-ID'])) return -1;
                        else if (Number(a['REST-ID']) < Number(b['REST-ID'])) return 1;
                        else return 0;
                    });
                } else {
                    data.sort((a, b) => {
                        if (Number(a['REST-ID']) < Number(b['REST-ID'])) return -1;
                        else if (Number(a['REST-ID']) > Number(b['REST-ID'])) return 1;
                        else return 0;
                    });
                }

                return data as RealmDBModel[];
            });
    }

    getRealmDesignationFromFile(realmCode: string, value: string, lang: string) {
        let url = "assets/tables/" + realmCode + ".json";
        return this.http
            .get(url)
            .toPromise()
            .then(res => {
                let data = res.json();
                data = data.filter((item) => {
                    return item.languageCode.indexOf(lang) > -1;
                });
                data = data.filter((item) => {
                    return item['REST-ID'] == value;
                });
                return data[0].designation;
            });
    }
}
