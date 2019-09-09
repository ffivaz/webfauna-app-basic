import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {SpeciesResource} from "../models/species.model";
import {Storage} from "@ionic/storage";
import {GroupService} from "./group.service";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

@Injectable()
export class SpeciesService {

    constructor(private http: Http,
                private s: Storage,
                private gs: GroupService,
                private sqlite: SQLite) {
    }

    fetchMany(result) {
        let output = [];
        for (let i = 0; i < result.rows.length; i++) {
            let item = result.rows.item(i);
            for (let key in item) {
                item[key] = item[key];
            }
            output.push(item);
        }
        return output;
    };

    getSpeciesNameFromFile(id: string) {
        let url = "assets/tables/species.json";
        return this.http
            .get(url)
            .toPromise()
            .then(res => {
                let data = res.json();
                data = data.filter((item) => {
                    return item['REST-ID'] == id;
                });
                return data as SpeciesResource[];
            });
    }

    selectSpeciesFromFileInGroup(term?: string): Promise<SpeciesResource[]> {

        return Promise.all([this.selectFromSpeciesFile(term), this.s.get('selectedGroups'), this.gs.getAllPromise()])
            .then((r) => {

                let rr: string[] = [];
                r[2].forEach((g) => {
                    if (r[1][r[2].indexOf(g)]) {
                        rr.push(g['REST-ID']);
                    }
                });

                let data = r[0];
                data = data.filter((item) => {
                    let gs = item.links[0].uri.replace('http://webfauna-api.cscf.ch/webfauna-ws/api/v1/systematics/groups/', '');
                    gs = gs.replace('/species', '');
                    return rr.indexOf(gs) > -1;
                });

                data = data.slice(0, 25);
                return data as SpeciesResource[];
            });
    }

    selectFromSpeciesFile(term?: string): Promise<SpeciesResource[]> {
        let url = "assets/tables/species.json";
        return this.http
            .get(url)
            .toPromise()
            .then(res => {
                let data = res.json();
                data.sort((a, b) => {
                    if (a.genus.concat(a.species) < b.genus.concat(b.species)) return -1;
                    else if (a.genus.concat(a.species) > b.genus.concat(b.species)) return 1;
                    else return 0;
                });
                if (term) {
                    data = data.filter((item) => {
                        return item.genus.concat(" ")
                            .concat(item.species).concat(" ")
                            .concat(item.subSpecies)
                            .concat(item.vernacularNames.de).normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                            .concat(item.vernacularNames.fr).normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                            .concat(item.vernacularNames.it).normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                            .toUpperCase().indexOf(term.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase()) > -1;
                    });
                }
                return data as SpeciesResource[];
            });
    }

    selectOneSpeciesFile(nuesp: string): Promise<SpeciesResource> {
        let url = "assets/tables/species.json";
        return this.http
            .get(url)
            .toPromise()
            .then(res => {
                let data = res.json();
                data = data.filter((item) => {
                    return item['REST-ID'] == nuesp;
                });
                return data[0] as SpeciesResource;
            });
    }

    checkIfFavSpeciesTable() {
        this.sqlite.create({
            name: 'webfauna.db',
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                db.executeSql('create table if not exists speciesFavs(' +
                    'speciesId TEXT,' +
                    'speciesCount INTEGER,' +
                    'UNIQUE(speciesId)' +
                    ')', [])
                    .then()
                    .catch(e => console.log(e));
            })
            .catch(e => console.log(e));
    }

    setFavSpecies(nuesp: string) {
        this.sqlite.create({
            name: 'webfauna.db',
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                db.executeSql('insert into speciesFavs values (' + nuesp + ', 1)', [])
                    .then()
                    .catch((e) => {
                        db.executeSql('update speciesFavs set speciesCount = speciesCount + 1 where speciesId=' + nuesp, [])
                            .then()
                            .catch((e) => {
                                console.log(e)
                            });
                    });
            })
    }

    async getManyNames(objs) {
        let data = [];
        for (let i = 0; i < objs.length; i++) {
            await this.selectOneSpeciesFile(objs[i].speciesId)
                .then(s => {
                    data.push(s);
                });
        }
        return data;
    }

    getFavSpecies(): Promise<SpeciesResource[]> {
        return new Promise((resolve, reject) => {
            return this.sqlite.create({
                name: 'webfauna.db',
                location: 'default'
            })
                .then((db: SQLiteObject) => {
                    return db.executeSql('select distinct * from speciesFavs order by speciesCount desc limit 20', [])
                        .then((res) => {
                            if (res.rows.length > 0) {
                                let data = this.getManyNames(this.fetchMany(res));
                                resolve(data);
                            } else {
                                resolve(undefined);
                            }
                        })
                        .catch((e) => reject(e));
                })
        });
    }

}
