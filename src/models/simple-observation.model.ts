export interface SimpleObservationModel {
    rowid: number;
    StatusCode?: string;
    userId?: number;
    groupId: string;
    speciesId: string;
    identificationMethodCode: string;
    samplingMethodCode: string;
    dateDay: number;
    dateMonth: number;
    dateYear: number;
    datePrecision: number;
    remark: string;
    environmentCode: string;
    milieuCode: string;
    substratCode: string;
    structureCode: string;
    countryCode: string;
    departmentCode: string;
    precisionCode: string;
    localite: string;
    lieudit: string;
    swissCoordinatesX: number;
    swissCoordinatesY: number;
    altitude: number
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
    img_url: string;
    projet: string;
    objectNumber: string;
    uploaded: number;
}