import * as React from 'react';
import { getRouteProps } from 'react-static';
import { PageView } from '../components';
import { SphinxPage, GlobalData } from '../sphinx';

interface PageData {
    data: SphinxPage;
    titles: { [id: string]: string };
    context: GlobalData;
}

export default getRouteProps((props: PageData) => {
    return <PageView data={props.data} titles={props.titles} context={props.context} />
});
