/**
 * Interface pour l'ensemble des realms du thesaurus webfauna
 * Version pour le chargement dans une table spécifique de la base de données SQLite locale
 */

export interface RealmDBModel {
    "languageId": number;
    "designation": string;
    "languageCode": string;
    "REST-ID": string;
}