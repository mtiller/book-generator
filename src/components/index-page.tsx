import * as React from 'react';
import { IndexData } from '../sphinx';

export interface IndexPageProps {
    index: IndexData;
}

export class IndexPage extends React.Component<IndexPageProps, {}> {
    render() {
        return (
            <div>
                <h1>Index</h1>
            </div>
        )
    }
}