import {Pipe} from "@angular/core";
import moment from 'moment';

@Pipe({
    name: 'moment'
})
export class MomentPipe {

    lang: string;

    constructor(){}

    transform(date) {
        return moment(date).format();
    }
}
