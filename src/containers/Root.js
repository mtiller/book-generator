import * as React from 'react';
import { getRouteProps, Link } from 'react-static';

export default getRouteProps((data) => (
    <div>
        <h1>Modelica by Example</h1>
        <div dangerouslySetInnerHTML={{ __html: data.body }}>
        </div>
    </div>
));
