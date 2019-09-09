export interface ImgLink {
    rel: string;
    uri: string;
}

export interface ImageResource {
    links?: ImgLink[];
    fileName: string;
    rank?: number;
    mimeType: string;
    'REST-ID'?: string;
}