/**
 * Created by betterclever on 6/28/17.
 */
import {isUndefined} from "util";
import * as WebRequest from "web-request";
import {ConfigService} from "../config-service";

export interface ILocationData {
    latitude: number;
    longitude: number;
    geoSource: string;
}

const DEFAULT_API_ENDPOINT = "api.susi.ai";

export class ChatAPI {
    private apiEndpoint: string;
    private configService: ConfigService;
    private timezoneOffset: number;
    private location: ILocationData;

    constructor(apiEndpoint: string = DEFAULT_API_ENDPOINT,
                timezoneOffset: number = null,
                location: ILocationData = null,
                configService: ConfigService = null) {

        this.apiEndpoint = apiEndpoint;
        this.configService = configService;
        this.location = location;
        this.timezoneOffset = timezoneOffset;
    }

    public async askSusi(query: string): Promise<any> {

        // TODO: Use location parameters
        const accessToken = this.configService.Config.accessToken;

        const requestString: string = (!isUndefined(accessToken) && accessToken != null) ?
            `http://api.susi.ai/susi/chat.json?q=${query}&access_token=${accessToken}` :
            `http://api.susi.ai/susi/chat.json?q=${query}`;

        const response = await WebRequest.get(requestString);
        return JSON.parse(response.content);

    }
}
