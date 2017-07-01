interface IExtendedConfig extends Config {
    accessToken?: string;
}

export class ConfigService {
    private config: IExtendedConfig;

    constructor(config: Config) {
        this.config = config;
    }

    public get Config(): IExtendedConfig {
        return this.config;
    }
}
