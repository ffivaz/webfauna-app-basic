import {Pipe} from "@angular/core";
import {SpeciesService} from "../services/species.service";

@Pipe({
    name: 'speciesName'
})
export class SpeciesName {

    constructor(
        private ss: SpeciesService
    ){}

    transform(value): Promise<string> {
        return this.ss.getSpeciesNameFromFile(value)
            .then(res => {
                let species = res[0];
                let speciesName;

                if (species.subSpecies) {
                    speciesName = species.genus.concat(" ", species.species).concat(" ", species.subSpecies);
                } else {
                    speciesName = species.genus.concat(" ", species.species)
                }

                return speciesName as string;
            });
    }

}