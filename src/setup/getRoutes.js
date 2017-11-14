import path from 'path';
import find from 'find';
const fs = require('fs');

const mjpage = require('mathjax-node-page/lib/main.js').mjpage;

import debug from 'debug';
const genDebug = debug("mbe:gen");

export function getRoutes(rootDir, sponsors) {
    return async (data) => {
        let dev = data.dev;
        let jsonDir = path.join(rootDir, "..", "text", "build", "json");
        genDebug("jsonDir = %s", jsonDir);
        let results = await new Promise((resolve) => {
            find.file(/\.fjson$/, jsonDir, (files) => {
                resolve(files);
            });
        });
        let pages = results.filter((f) => f.length > jsonDir.length).map((f) => f.slice(jsonDir.length));
        genDebug("# of pages = %j", pages.length);

        let map = {};
        for (let i = 0; i < pages.length; i++) {
            let page = pages[i];
            let file = path.join(".", "json", page);
            let obj = JSON.parse(fs.readFileSync(file).toString());
            if (obj.body && !dev) {
                obj.body = await new Promise((resolve) => {
                    genDebug("Rendering math for %s", page);
                    mjpage(obj.body, { format: ["TeX"] }, { svg: true }, (output) => resolve(output));
                    genDebug("...done");
                });
            }
            map[page] = obj;
        }

        let root = {
            path: '/',
            component: 'src/containers/Root',
            getProps: () => ({ page: map["/index.fjson"], sponsors: sponsors }),
        };
        let normal = pages.filter((page) => page !== "index.fjson").map((page) => {
            return {
                path: page.slice(0, page.length - 6) + "/",
                component: 'src/containers/Page',
                getProps: () => map[page],
            }
        });
        genDebug("# of normal pages: %j", normal.length);
        let error = {
            is404: true,
            component: 'src/containers/404',
        };
        return [root, ...normal, error];
    }
}