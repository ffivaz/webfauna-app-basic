import {Pipe} from "@angular/core";
import {SpeciesService} from "../services/species.service";
import {TranslateService} from "@ngx-translate/core";

@Pipe({
    name: 'vernacularName'
})
export class VernacularNamePipe {

    lang: string;

    constructor(
        private ss: SpeciesService,
        private ts: TranslateService
    ){
        this.lang = this.ts.currentLang;
    }

    transform(value): Promise<string> {
        return this.ss.getSpeciesNameFromFile(value)
            .then(res => {
                let species = res[0];
                let vernacularName = species.vernacularNames[this.lang];
                return vernacularName as string
            });
    }

}