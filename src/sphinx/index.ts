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