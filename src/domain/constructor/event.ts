import { Result, err, ok } from "neverthrow";
import { ValidationError } from "../entity/error";
import { Event } from "../entity/event";
import { randomUUID } from "crypto";

export interface EventArgs {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
}

export const NewEvent = (input: EventArgs): Result<Event, ValidationError> => {
  const startDate = new Date(input.startDate);
  const endDate = new Date(input.endDate);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return err(new ValidationError("Invalid date format"));
  }

  if (startDate >= endDate) {
    return err(new ValidationError("startDate must be before endDate"));
  }

  const id = randomUUID(); // idを生成する
  const parsed = Event.safeParse({
    id: id,
    name: input.name,
    description: input.description,
    startDate,
    endDate,
    location: input.location,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  if (!parsed.success) {
    return err(new ValidationError("Invalid event data"));
  }
  const event = parsed.data;
  return ok(event);
};
