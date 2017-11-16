export interface SphinxLink {
    link: string;
    title: string;
}

export interface SphinxPage {
    title: string;
    toc: string;
    body: string;
    parents: Array<SphinxLink> | null;
    prev: SphinxLink | null;
    next: SphinxLink | null;
    meta: {};
    current_page_name: string;
    metatags: string;
    sourcename: string;
    display_toc: boolean;
    sidebars: null;
    page_source_suffix: string;
}

// This is in globalcontext.json
export interface GlobalData {
    shorttitle: string; // Includes git-describe
    docstitle: string; // ditto
    master_doc: string; // index
    copyright: string;
    project: string; // true title
    version: string; // version number
    release: string; // git-describe
    sphinx_version: string;
}

// This is in genindex.fjson
export interface IndexData {
    genindexcounts: number[];
    // This is a bunch of recursive arrays.  I tried to figure out how to
    // represent it in TypeScript, but it turns out that potentially infinite
    // resursive types have to leverage interface definitions.  But since there
    // are no objects anywhere (these are just nested arrays, all the way down),
    // I couldn't really do it without type aliases (which don't support
    // recursion).
    genindexentries: any[];
}

// This is in searchindex.json
export interface SearchData {
    envversion: number;
    terms: { [term: string]: number | number[] };
    objtypes: {};
    docnames: string[];
    objnames: {};
    filenames: string[];
    titles: string[];
    objects: {};
    titleterms: { [term: string]: number | number[] };
}