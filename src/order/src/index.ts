import express from 'express';
import { ENV_CONFIG } from '@shared/envConfig';
import cors from 'cors';
import router from './order.controller';
import { HttpResponse } from './responses';

const app = express();

app.use(cors(), express.json(), express.urlencoded({ extended: true }));

app.use('/order', router);

app.use((error, _, res, __) => {
  console.log('Error occurred:', error);
  if (error instanceof HttpResponse) {
    res.status(error.statusCode).send(error);
  } else {
    res.status(500).send(
      new HttpResponse({
        statusCode: 500,
        error: error.message ? error.message : 'Internal server error',
      })
    );
  }
});

app.listen(ENV_CONFIG.ORDER_SERVICE_PORT, () => {
  console.log('Order service listening on port', ENV_CONFIG.ORDER_SERVICE_PORT);
});
