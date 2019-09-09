export interface GroupLink {
    rel: string;
    uri: string;
}

export interface GroupResourceLink {
    rel: string;
    uri: string;
}

export interface Designations {
    de: string;
    fr: string;
    en: string;
    it: string;
}

export interface GroupResource {
    links: GroupResourceLink[];
    defaultDesignation: string;
    designations: Designations;
    validIdentifcationMethodCodes: string[];
    validSamplingMethodCodes: string[];
    'REST-ID': string;
}

export interface Group {
    links: GroupLink[];
    resource: GroupResource[];
}
