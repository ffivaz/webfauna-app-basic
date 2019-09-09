export interface Link2 {
    rel: string;
    uri: string;
}

export interface User {
    links: Link2[],
    email: string;
    firstName: string;
    lastName: string;
    lang: string;
    institution: string;
    'REST-ID': number
}
