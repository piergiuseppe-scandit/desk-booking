import { db } from '../db';
import { desks, reservations } from '../db/schema';
import { eq, and, gte, lte, between } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export const getDesks = async () => {
  return await db.select().from(desks);
};

export const getDeskById = async (id: number) => {
  return await db.select().from(desks).where(eq(desks.id, id));
};

export const createDesk = async (data: {
  label: string;
  tags: string[];
}) => {
  return await db.insert(desks).values({
    ...data,
    tags: JSON.stringify(data.tags)
  });
};

export const updateDesk = async (id: number, data: Partial<{
  label: string;
  tags: string[];
}>) => {
  const updateData = { ...data };
  if (data.tags) {
    updateData.tags = JSON.stringify(data.tags);
  }
  return await db.update(desks).set(updateData).where(eq(desks.id, id));
};

export const deleteDesk = async (id: number) => {
  return await db.delete(desks).where(eq(desks.id, id));
};

export const getReservations = async () => {
  return await db.select({
    id: reservations.id,
    username: reservations.username,
    deskId: reservations.deskId,
    startDate: reservations.startDate,
    endDate: reservations.endDate,
    createdAt: reservations.createdAt,
    deskLabel: desks.label,
  })
  .from(reservations)
  .leftJoin(desks, eq(reservations.deskId, desks.id));
};

export const getReservationById = async (id: number) => {
  return await db.select().from(reservations).where(eq(reservations.id, id));
};

export const createReservation = async (data: {
  username: string;
  deskId: number;
  startDate: string;
  endDate: string;
}) => {
  // Check for existing reservations in the date range
  const existingReservations = await db.select()
    .from(reservations)
    .where(
      and(
        eq(reservations.deskId, data.deskId),
        lte(reservations.startDate, data.endDate),
        gte(reservations.endDate, data.startDate)
      )
    );

  if (existingReservations.length > 0) {
    throw new Error('Desk is already reserved during this period');
  }

  return await db.insert(reservations).values(data);
};

export const updateReservation = async (id: number, data: Partial<{
  username: string;
  deskId: number;
  startDate: string;
  endDate: string;
}>) => {
  return await db.update(reservations).set(data).where(eq(reservations.id, id));
};

export const deleteReservation = async (id: number) => {
  return await db.delete(reservations).where(eq(reservations.id, id));
};

export const getDeskStatus = async (startDate: string, endDate: string) => {
  const getDaysDifference = (start: string, end: string) =>
    (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24) + 1;

  const allDesks = await getDesks();
  const reservationsInRange = await db.select()
    .from(reservations)
    .where(
      and(
        lte(reservations.startDate, endDate),
        gte(reservations.endDate, startDate)
      )
    );

  return allDesks.map(desk => {
    const totalDaysInRange = getDaysDifference(startDate, endDate);
    const deskReservations = reservationsInRange.filter(r => r.deskId === desk.id);
    let reservedDays = 0;
    for (const res of deskReservations){
      reservedDays += getDaysDifference(res.startDate > startDate ? res.startDate : startDate, res.endDate < endDate ? res.endDate : endDate);
    }
    let status = 'free';
    if (reservedDays >= totalDaysInRange) {
      status = 'reserved';
    }else if(reservedDays > 0){
      status = 'partial';
    }
    return {
      ...desk,
      tags: JSON.parse(desk.tags),
      status: status,
      reservations: deskReservations
    };
  });
};