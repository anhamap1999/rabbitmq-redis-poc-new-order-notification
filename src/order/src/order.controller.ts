import express from 'express';
import { CreateOrderInput } from '@shared/prisma/types';
import { saveOrder } from './order.service';
import { publishMessage } from '@shared/rabbitmq';
import { QueueEvents } from '@shared/rabbitmq/constants';
import { OrderCreatedEvent } from '@shared/rabbitmq/interfaces';
import { Order } from '@prisma/client';
import { HttpResponse } from './responses';

const router = express.Router();

router.post<string, unknown, HttpResponse<Order>, CreateOrderInput>(
  '',
  async (req, res, next) => {
    try {
      const order = await saveOrder(req.body);

      publishMessage({
        event: QueueEvents.OrderCreated,
        body: order,
      } as OrderCreatedEvent);

      res.json(new HttpResponse({ data: order }));
    } catch (error) {
      next(error);
    }
  }
);

export default router;
