import { dadosCovidController } from './controllers/exportControllers';
import express, { json }  from 'express';
import * as  admin from "firebase-admin";
const db = admin.firestore();

const routes = express.Router();

routes.get('/covid19', dadosCovidController.index);

routes.get('/covid19/:dia/:mes/:ano', dadosCovidController.getByDate);

// routes.post('/covid19', (request, response, next) => {
//   response.send({ ok: request.body });
// });

export default routes;
