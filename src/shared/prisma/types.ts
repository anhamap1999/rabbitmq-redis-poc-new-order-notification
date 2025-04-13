import { Order, User } from '@prisma/client';

export type CreateUserInput = Omit<User, 'id'>;
export type CreateOrderInput = Pick<Order, 'userId' | 'totalAmount'>;
