import { Result, err, ok } from "neverthrow";
import { ValidationError } from "../entity/error.js";
import { Event } from "../entity/event.js";

export type EventArgs = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
};

export const NewEvent = (input: EventArgs): Result<Event, ValidationError> => {
  const startDate = new Date(input.startDate);
  const endDate = new Date(input.endDate);

  if (!input.id.trim()) {
    return err(new ValidationError("ID must not be empty"));
  }
  if (!input.name.trim()) {
    return err(new ValidationError("Name must not be empty"));
  }
  if (!input.description.trim()) {
    return err(new ValidationError("Description must not be empty"));
  }
  if (!input.location.trim()) {
    return err(new ValidationError("Location must not be empty"));
  }

  // 日付のフォーマットと整合性チェック
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return err(new ValidationError("Invalid date format"));
  }

  if (startDate >= endDate) {
    return err(new ValidationError("startDate must be before endDate"));
  }

  const parsed = Event.safeParse({
    ...input,
    startDate,
    endDate,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  if (!parsed.success) {
    return err(new ValidationError("Invalid event data"));
  }

  return ok(parsed.data);
};
