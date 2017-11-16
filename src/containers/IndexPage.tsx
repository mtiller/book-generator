import * as React from 'react';
import { getRouteProps } from 'react-static';
import { SphinxPage } from '../sphinx';


export default getRouteProps((props: { data: SphinxPage, titles: { [id: string]: string } }) => {
    return <IndexPage data={props.data} titles={props.titles} />
});
