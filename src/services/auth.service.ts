import {Injectable} from "@angular/core";
import {Credentials} from "../models/credentials.model";
import {HTTP, HTTPResponse} from "@ionic-native/http";

@Injectable()
export class AuthService {

    webfaunaApiURL: string = "https://webfauna-api.cscf.ch/webfauna-ws/api/v1";

    constructor(
        private http: HTTP) {
    }

    login(credentials: Credentials): Promise<HTTPResponse> {
        return new Promise((resolve, reject) => {
            let headers = this.http.getBasicAuthHeader(credentials.email, credentials.password);
            this.http.setDataSerializer('json');
            return this.http.head(this.webfaunaApiURL, null, headers)
                .then((r) => {
                    resolve(r);
                })
                .catch((e) => {
                    console.log(e);
                    reject(e);
                });
        })

    }

    getUserInfo(): Promise<HTTPResponse> {
        this.http.setDataSerializer('json');
        return this.http.get(this.webfaunaApiURL, null, null)
            .then((r) => r);
    }
}
