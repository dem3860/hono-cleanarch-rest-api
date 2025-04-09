import { z } from "zod";
import { Event } from "../../domain/entity/event";
import { ResultAsync } from "neverthrow";
import { ValidationError } from "../../domain/entity/error";

export const EventCreateRequest = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string(),
});
export type EventCreateRequest = z.infer<typeof EventCreateRequest>;

export interface IEventCreateUseCase {
  create(
    input: EventCreateRequest
  ): ResultAsync<Event, Error | ValidationError>;
}
