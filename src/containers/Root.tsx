import * as React from 'react';
import { getRouteProps } from 'react-static';
import { SphinxPage, GlobalData } from '../sphinx';
import { LandingPage } from '../components';
import { Sponsors } from '../components';

interface RootRouteData {
    page: SphinxPage;
    sponsors: Sponsors;
    context: GlobalData;
}

export default getRouteProps((data: RootRouteData) => <LandingPage data={data.page} sponsors={data.sponsors} context={data.context} />);
