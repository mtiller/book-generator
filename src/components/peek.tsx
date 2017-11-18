import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
export class Peek extends React.Component<{}, {}> {
    @observable show = false;
    render() {
        return <span onClick={() => this.show = !this.show}>{this.show ? this.props.children : <span style={{ border: "2px ridge #eee", marginLeft: "2px" }}>...</span>}</span>;
    }
}