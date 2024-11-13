import { getDesks, createDesk } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    return await getDesks();
  }

  if (event.method === 'POST') {
    const body = await readBody(event);
    return await createDesk(body);
  }
});