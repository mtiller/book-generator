import * as React from 'react';
import { getRouteProps } from 'react-static';
import { PageView } from '../components';
import { SphinxPage } from '../sphinx';

interface PageData {
    data: SphinxPage;
    titles: { [id: string]: string };
}

export default getRouteProps((props: PageData) => {
    return <PageView data={props.data} titles={props.titles} />
});
