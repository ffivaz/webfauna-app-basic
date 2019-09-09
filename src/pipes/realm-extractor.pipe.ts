import {Pipe} from "@angular/core";
import {RealmsService} from "../services/realms.service";
import {TranslateService} from "@ngx-translate/core";

@Pipe({
    name: 'realmExtractor'
})
export class RealmExtractor {

    lang: string;

    constructor(
        private rs: RealmsService,
        private ts: TranslateService
    ){
        this.lang = this.ts.currentLang;
    }

    transform(value, realmCode, lang): Promise<string> {
        return this.rs.getRealmDesignationFromFile(realmCode, value, this.lang)
            .then(res => res as string);
    }
}