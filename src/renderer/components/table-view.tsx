/**
 * Created by betterclever on 29/7/17.
 */

import * as React from "react";
import {TableElement} from "./table-element";

interface ITableData {
    data: Array<any>;
    columns: any;
}

export class TableView extends React.Component<ITableData> {

    public render(): JSX.Element | any | any {
        return <div>
            <div className="table-element-div">{Object.keys(this.props.columns).map((value) => {
                return <span className="table-element-span">{this.props.columns[value]}</span>;
            })}</div>
            {this.props.data.slice(0, 8).map((value: any) => {
                return <TableElement data={value}/>;
            })}</div>;
    }
}
