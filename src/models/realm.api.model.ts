/**
 * Interface pour l'ensemble des realms du thesaurus webfauna
 * Version pour le téléchargement à partir de l'API
 */

export interface RealmAPIModel {
    "links": any[],
    "languageId": number;
    "designation": string;
    "languageCode": string;
    "REST-ID": string;
}