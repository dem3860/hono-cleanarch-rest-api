import { ResultAsync, fromPromise, errAsync, okAsync } from "neverthrow";
import { Event } from "../../domain/entity/event";
import { EventCreateRequest, IEventCreateUseCase } from "../inputPort/event";
import { IEventRepository } from "../outputPort/event";
import { NewEvent } from "../../domain/constructor/event";
import { DBError, ValidationError } from "../../domain/entity/error";

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
