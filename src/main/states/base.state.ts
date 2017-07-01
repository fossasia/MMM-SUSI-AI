import { IStateMachineComponents } from "./susi-state-machine";

export abstract class State {
    protected allowedStateTransitions: Map<StateName, State>;

    constructor(protected components: IStateMachineComponents, public name: StateName) {
        this.allowedStateTransitions = new Map<StateName, State>();
    }

    public abstract onEnter(): void;

    public abstract onExit(): void;

    protected transition(state: State): void {
        if (!this.canTransition(state)) {
            console.error(`Invalid transition to state: ${state}`);
            return;
        }
        console.log(`transiting to state: ${state.name}`);

        this.onExit();
        state.onEnter();
    }

    private canTransition(state: State): boolean {
        return this.allowedStateTransitions.has(state.name);
    }

    public set AllowedStateTransitions(states: Map<StateName, State>) {
        this.allowedStateTransitions = states;
    }
}
