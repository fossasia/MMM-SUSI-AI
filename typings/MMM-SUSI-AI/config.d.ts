//noinspection TsLint
interface Config {
    hotword: string;
    user: IUser | "anonymous";
}

//noinspection TsLint
interface UncheckedConfig {
    hotword?: string;
    user?: IUser;
}
