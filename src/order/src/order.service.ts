import { prismaClient } from '@shared/prisma/client';
import { CreateOrderInput } from '@shared/prisma/types';
import { HttpResponse } from './responses';

export const saveOrder = async (data: CreateOrderInput) => {
  // TODO: handle auth and remove userId from input
  const user = await prismaClient.user.findFirst({
    where: { id: data.userId },
  });
  if (!user) {
    throw new HttpResponse({ statusCode: 404, error: 'User not found' });
  }

  const order = await prismaClient.order.create({ data });

  return order;
};
