export {};

export interface Page {
    pageName: string,
    baseUrl: string,
  }
declare global {
    var document: Document;
    var agent: any;
}

