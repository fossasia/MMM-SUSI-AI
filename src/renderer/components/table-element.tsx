/**
 * Created by betterclever on 28/7/17.
 */

import * as React from "react";

interface ITableRow {
    data: any;
}

export class TableElement extends React.Component<ITableRow, any> {

    public render(): JSX.Element | any | any {
        return <div className="table-element-div">{this.getValues(this.props.data).map((value) => {
            return <span className="table-element-span">{value}</span>;
        })}</div>;
    }

    private getValues(data: any): string[] {
        const result: string[] = [];
        for (const key of Object.keys(data)) {
            result.push(data[key]);
        }
        return result;
    }
}
