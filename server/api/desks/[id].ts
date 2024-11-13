import { getDeskById, updateDesk, deleteDesk } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id);

  if (event.method === 'GET') {
    return await getDeskById(id);
  }

  if (event.method === 'PUT') {
    const body = await readBody(event);
    return await updateDesk(id, body);
  }

  if (event.method === 'DELETE') {
    return await deleteDesk(id);
  }
});