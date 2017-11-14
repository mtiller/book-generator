import * as React from 'react';
import { getRouteProps } from 'react-static';
import { PageView } from '../components';
import { SphinxPage } from '../sphinx';

export default getRouteProps((data: SphinxPage) => <PageView data={data} />);
