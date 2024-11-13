import { getReservationById, updateReservation, deleteReservation } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id);

  if (event.method === 'GET') {
    return await getReservationById(id);
  }

  if (event.method === 'PUT') {
    const body = await readBody(event);
    return await updateReservation(id, body);
  }

  if (event.method === 'DELETE') {
    return await deleteReservation(id);
  }
});