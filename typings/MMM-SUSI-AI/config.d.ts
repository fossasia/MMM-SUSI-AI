//noinspection TsLint
interface Config {
    hotword: string;
    users: Array<IUser>;
}

//noinspection TsLint
interface UncheckedConfig {
    hotword?: string;
    users?: Array<IUser>;
}
