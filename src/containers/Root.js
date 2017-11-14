import * as React from 'react';
import { getRouteProps, Link } from 'react-static';

export default getRouteProps((data) => (
    <div>
        <div className="ui fluid" style={{ textAlign: "center" }}>
            <img src="/_static/images/TitleHeading.png" />
            <h3 style={{ marginTop: 0, marginBottom: "10px" }} className="ui sub header">by Dr. Michael M. Tiller</h3>
        </div>

        <div className="ui segment raised">
            <h1>Table of Contents</h1>
            <div dangerouslySetInnerHTML={{ __html: data.body }}>
            </div>
        </div>
    </div>
));
