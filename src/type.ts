import { IEventCreateUseCase } from "./useCase/inputPort/event.js";

export type Deps = {
  eventUseCase: IEventCreateUseCase;
};

export type AppType = {
  Variables: {
    deps: Deps;
  };
};
