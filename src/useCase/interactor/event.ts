import { ResultAsync, fromPromise, errAsync, okAsync } from "neverthrow";
import { Event } from "../../domain/entity/event.js";
import { EventCreateRequest, IEventCreateUseCase } from "../inputPort/event.js";
import { IEventRepository } from "../outputPort/event.js";
import { NewEvent } from "../../domain/constructor/event.js";
import { DBError, ValidationError } from "../../domain/entity/error.js";

export class EventInteractor implements IEventCreateUseCase {
  constructor(private readonly eventRepo: IEventRepository) {}

  create(
    input: EventCreateRequest
  ): ResultAsync<Event, DBError | ValidationError> {
    const result = NewEvent(input);
    if (result.isErr()) {
      return errAsync(result.error);
    }

    const event = result.value;

    return this.eventRepo.create(event).andThen((event) => {
      return this.eventRepo.findById(event.id);
    });
  }
}
