import { IEventCreateUseCase } from "./useCase/inputPort/event";

export type Deps = {
  eventUseCase: IEventCreateUseCase;
};

export type AppType = {
  Variables: {
    deps: Deps;
  };
};
