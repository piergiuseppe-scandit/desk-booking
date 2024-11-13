import { getReservations, createReservation } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    return await getReservations();
  }

  if (event.method === 'POST') {
    const body = await readBody(event);
    return await createReservation(body);
  }
});