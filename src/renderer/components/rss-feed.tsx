/**
 * Created by betterclever on 24/7/17.
 */

import * as React from "react";
import {IRssProps, RSSCard} from "./rss-card";

export interface IRSSFeedProps {
    feeds: Array<IRssProps>;
}

export class RSSFeed extends React.Component <IRSSFeedProps, any> {

    public constructor(props: IRSSFeedProps) {
        super(props);
    }

    public render(): JSX.Element | any | any {
        return <div className="rss-div">
            {this.props.feeds.map((feed: IRssProps) => {
                    return <RSSCard key={feed.title} title={feed.title} description={feed.description} link={feed.link}/>;
                }
            ).slice(0, 5)}
        </div>;
    }
}
