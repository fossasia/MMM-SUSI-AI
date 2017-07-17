//noinspection TsLint
interface Config {
    hotword: string;
    users: Array<IUser> | "anonymous";
}

//noinspection TsLint
interface UncheckedConfig {
    hotword?: string;
    users?: Array<IUser>;
}
