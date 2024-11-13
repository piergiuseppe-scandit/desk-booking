import { getDeskStatus } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { startDate, endDate } = query;

  if (!startDate || !endDate) {
    throw createError({
      statusCode: 400,
      message: 'startDate and endDate are required query parameters'
    });
  }

  return await getDeskStatus(startDate.toString(), endDate.toString());
});