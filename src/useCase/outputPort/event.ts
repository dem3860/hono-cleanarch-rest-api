import { ResultAsync } from "neverthrow";
import { Event } from "../../domain/entity/event.js";
import { DBError } from "../../domain/entity/error.js";

export interface IEventRepository {
  create(input: Event): ResultAsync<Event, DBError>;
  findById(id: string): ResultAsync<Event, DBError>;
}
