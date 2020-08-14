import { dadosCovidController } from './controllers/exportControllers';
import express, { json }  from 'express';
import * as  admin from "firebase-admin";
const db = admin.firestore();

const routes = express.Router();

routes.get('/covid19', dadosCovidController.index);

routes.get('/covid19/:dia/:mes/:ano', dadosCovidController.getByDate);

routes.get('/teste', (request, response, next) => {
  response.send([{ ok: 'ok' }, {t: "ok"}]);
});

export default routes;
