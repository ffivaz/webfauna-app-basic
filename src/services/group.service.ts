import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {GroupResource} from "../models/group.model";
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class GroupService {

    constructor(
        private http: Http
    ) {
    }

    getAll(): Observable<GroupResource[]> {
        let url = "assets/tables/groups.json";
        return this.http
            .get(url)
            .map((res) => {
                return <GroupResource[]>res.json();
            });
    }

    getAllPromise(): Promise<GroupResource[]> {
        let url = "assets/tables/groups.json";
        return this.http
            .get(url)
            .map((res) => {
                return <GroupResource[]>res.json();
            })
            .toPromise();
    }

    getIdentificationCodes(groupId: string): Promise<any> {
        let url = "assets/tables/groups.json";
        return this.http
            .get(url)
            .toPromise()
            .then(res => {
                let data = res.json();
                data = data.filter((item) => {
                    return item['REST-ID'] == groupId;
                });
                return data[0].validIdentifcationMethodCodes;
            });
    }

    getSamplingMethodCodes(groupId: string): Promise<any> {
        let url = "assets/tables/groups.json";
        return this.http
            .get(url)
            .toPromise()
            .then(res => {
                let data = res.json();
                data = data.filter((item) => {
                    return item['REST-ID'] == groupId;
                });
                return data[0].validSamplingMethodCodes;
            });
    }
}