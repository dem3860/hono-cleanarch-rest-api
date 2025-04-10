import { ResultAsync } from "neverthrow";
import { Event, EventList, EventSearch } from "../../domain/entity/event.js";
import { DBError } from "../../domain/entity/error.js";

export interface IEventRepository {
  create(input: Event): ResultAsync<void, DBError>;
  update(input: Event): ResultAsync<void, DBError>;
  findById(id: string): ResultAsync<Event, DBError>;
  delete(id: string): ResultAsync<void, DBError>;
  list(input: EventSearch): ResultAsync<EventList, DBError>;
}
