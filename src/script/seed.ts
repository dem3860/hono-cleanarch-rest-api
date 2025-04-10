import { PrismaClient } from "@prisma/client";

const addEvent = async () => {
  const prisma = new PrismaClient();
  await prisma.event.create({
    data: {
      id: "11111111-1111-1111-1111-446655440000",
      name: "Event 1",
      description: "Description for Event 1",
      startDate: new Date("2023-10-01T00:00:00Z"),
      endDate: new Date("2024-10-01T00:00:00Z"),
      location: "Location 1",
    },
  });
};

const main = async () => {
  await addEvent();
};

main();
