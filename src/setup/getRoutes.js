import path from 'path';
import find from 'find';
const fs = require('fs');

const mjpage = require('mathjax-node-page/lib/main.js').mjpage;
var lunr = require('lunr');

import debug from 'debug';
const genDebug = debug("mbe:gen");

export function getRoutes(rootDir, sponsors) {
    return async (data) => {
        // Figure out if we are running this in dev mode
        let dev = data.dev;

        // Construct path to build/json directory produced by Sphinx
        // TODO: "." "json" (be consistent with other usage)
        let jsonDir = path.join(rootDir, "..", "text", "build", "json");
        genDebug("jsonDir = %s", jsonDir);

        // Find all .fjson files
        let results = await new Promise((resolve) => {
            find.file(/\.fjson$/, jsonDir, (files) => {
                resolve(files);
            });
        });

        // Strip off absolute path and only keep the bits relative to the 'json' directory
        let pages = results.filter((f) => f.length > jsonDir.length).map((f) => f.slice(jsonDir.length));
        genDebug("# of pages = %j", pages.length);

        // We will build a map that maps page -> JSON data in each file as well as
        // a map of titles that map the URL (id) for a given page to a string (the title)
        // First though, we initialize these maps.
        let map = {};
        let titles = {};

        // Loop over all pages
        for (let i = 0; i < pages.length; i++) {
            // This is the name of the file relative to the 'json' directory
            let page = pages[i];
            // This is the URL that Sphinx uses to refer to that page
            let href = page.slice(0, page.length - 6) + "/";
            // Build path relative to current directory
            let file = path.join(".", "json", page);

            try {
                // Parse the contents of the file as JSON
                let obj = JSON.parse(fs.readFileSync(file).toString());
                // If it has a body and we ARE NOT in development mode, inline the math with mathjax-node-page
                if (obj.body && !dev) {
                    obj.body = await new Promise((resolve) => {
                        genDebug("Rendering math for %s", page);
                        mjpage(obj.body, { format: ["TeX"] }, { svg: true }, (output) => resolve(output));
                        genDebug("...done");
                    });
                }
                // Store away the data from the file and the title
                map[page] = obj;
                titles[href] = obj.title;
            } catch (e) {
                console.error("Error processing page " + page);
                console.error(e);
            }
        }

        // Handle the root as a special case
        let root = {
            path: '/',
            component: 'src/containers/Root',
            getProps: () => ({ page: map["/index.fjson"], sponsors: sponsors }),
        };

        let normal = pages.filter((page) => page !== "index.fjson").map((page) => {
            return {
                path: page.slice(0, page.length - 6) + "/",
                component: 'src/containers/Page',
                getProps: () => ({ data: map[page], titles: titles }),
            }
        });

        // If we aren't in dev model, rebuild the search index and write it into
        // dist/lunr.json
        if (!dev) {
            genDebug("Building index");

            // Create the index
            let index = lunr(function () {
                // Specify the fields in the index
                this.field("id");
                this.field("title");
                this.field("body");

                genDebug("  Pages to index: %o", normal);
                normal.forEach((page) => {
                    // Invoke the getProps method for this page and extract the data 
                    // field (this is SphinxData)
                    let obj = page.getProps().data;
                    genDebug("    Indexing %s", obj.title);
                    // TODO: Pre-filter this
                    if (obj.title && obj.body) {
                        let doc = {
                            id: page.path,
                            body: obj.body,
                            title: obj.title,
                        };
                        this.add(doc);
                    } else {
                        genDebug("      Missing title or body: %o", obj);
                    }
                })
            });

            genDebug("Search for 'equation' yielded %s hits", index.search("equation").length);

            // We need to write to 'dist' because 'public' has already been copied.
            fs.writeFile(path.join("dist", "lunr.json"), JSON.stringify(index.toJSON()), (err) => {
                if (err) console.error(err);
            });
        }

        genDebug("# of normal pages: %j", normal.length);

        // Add a 404 page
        let error = {
            is404: true,
            component: 'src/containers/404',
        };
        return [root, ...normal, error];
    }
}