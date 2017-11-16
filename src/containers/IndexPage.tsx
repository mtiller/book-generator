import * as React from 'react';
import { getRouteProps } from 'react-static';
import { IndexPage, IndexPageProps } from '../components';

export default getRouteProps((props: IndexPageProps) => {
    return <IndexPage {...props} />
});
