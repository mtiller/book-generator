import * as React from 'react';
import { getRouteProps } from 'react-static';
import { PageView } from '../components';
import { SphinxPage } from '../sphinx';

export default getRouteProps((props: { data: SphinxPage, titles: { [id: string]: string } }) => {
    return <PageView data={props.data} titles={props.titles} />
});
