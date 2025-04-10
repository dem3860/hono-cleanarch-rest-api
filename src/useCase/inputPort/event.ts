import { z } from "zod";
import { Event, EventList } from "../../domain/entity/event.js";
import { ResultAsync } from "neverthrow";
import { DBError, ValidationError } from "../../domain/entity/error.js";

export const EventCreateRequest = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string(),
});
export type EventCreateRequest = z.infer<typeof EventCreateRequest>;

export const EventUpdateRequest = z.object({
  name: z.string(),
  description: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string(),
});
export type EventUpdateRequest = z.infer<typeof EventUpdateRequest>;

export const EventListRequest = z.object({
  q: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(["startDate", "endDate", "name", "createdAt"]).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});
export type EventListRequest = z.infer<typeof EventListRequest>;

export interface IEventCreateUseCase {
  create(
    input: EventCreateRequest
  ): ResultAsync<Event, DBError | ValidationError>;
  update(
    eventId: string,
    input: EventUpdateRequest
  ): ResultAsync<Event, DBError | ValidationError>;
  delete(eventId: string): ResultAsync<void, DBError>;
  list(input: EventListRequest): ResultAsync<EventList, DBError>;
}
