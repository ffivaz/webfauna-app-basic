export interface Links {
    rel: string;
    uri: string;
}

export interface Environment {
    environmentCode: string;
    milieuCode: string;
    milieuInclusionCode1: string;
    milieuInclusionCode2: string;
    milieuInclusionCode3: string;
    milieuAdjacentCode1: string;
    milieuAdjacentCode2: string;
    milieuAdjacentCode3: string;
    humanInfluenceCode: string;
    substratCode: string;
    substrat1Code: string;
    substrat2Code: string;
    substrat3Code: string;
    substrat4Code: string;
    structureCode: string;
    associatedOrganism: string;
}

export interface Location {
    countryCode: string;
    departmentCode: string;
    precisionCode: string;
    localite: string;
    lieudit: string;
    swissCoordinatesX: number;
    swissCoordinatesY: number;
    altitude: number;
}

export interface Abundance {
    individuals: number;
    collection: number;
    males: number;
    females: number;
    eggs: number;
    larvae: number;
    exuviae: number;
    nymphs: number;
    subadults: number;
    mating: number;
    tandem: number;
    clutch: number;
}

export interface Source {
    legateeLastname: string;
    legateeFirstName: string;
    museumName: string;
    collectionName: string;
    objectNumber: string;
    projectNumber: string;
    appCode: string;
    occurrenceNumber: number;
}

export interface ObservationResource {
    links: Links[];
    statusCode: string;
    userId: number;
    groupId: string;
    speciesId: string;
    identificationMethodCode: string;
    samplingMethodCode: string;
    dateDay: number;
    dateMonth: number;
    dateYear: number;
    datePrecision: number;
    remark: string;
    environment: Environment;
    location: Location;
    abundance: Abundance;
    source: Source;
    "REST-ID"?: string;
}