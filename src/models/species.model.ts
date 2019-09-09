export interface Link2 {
    rel: string;
    uri: string;
}

export interface VernacularNames {
    de: string;
    it: string;
    fr: string;
    en: string;
}

export interface SpeciesResource {
    links: Link2[];
    family: string;
    genus: string;
    species: string;
    vernacularNames: VernacularNames;
    'REST-ID': string;
    subSpecies: string;
}