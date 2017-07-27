import * as React from "react";
/**
 * Created by betterclever on 24/7/17.
 */
export interface IRssProps {
    title: string;
    description: string;
    link: string;
}

export class RSSCard extends React.Component <IRssProps, any> {

    constructor(props: IRssProps) {
        super(props);
    }

    public render(): JSX.Element | any | any {
        return <div className="card">
            <div className="card-title">{this.props.title}</div>
            <div className="card-description">{this.props.description}</div>
        </div>;
    }
}
