// Configuração do dotenv
import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config();
// config({ path: resolve(__dirname, "../.env") });

// Firebase
import * as  admin from "firebase-admin";

const serviceAccount = require("../src/config/api-covid19-b72f3-firebase-adminsdk-9i6r5-d8fddd659f.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});

import { IDadosCovid } from './interfaces/exportInterfaces';
import { dadosCovidController } from './controllers/exportControllers';

import express from 'express';
import routes from './routes';
import cors from 'cors';
import converteAnoParaFull from "./utils/converteAnoParaFull";

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

// Configuração do Cron
const CronJob = require('cron').CronJob;
const job = new CronJob('40 * * * * *', () => {
  scrape().then((value: IDadosCovid) => {
    value.data = converteAnoParaFull(value.data);
    dadosCovidController.create(value);
  });
}, null, true, 'America/Sao_Paulo');

// Configuração do Puppeteer
const site = process.env.SCRAPING_URL;
const puppeteer = require('puppeteer');

let scrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(site);
  const result = await page.evaluate(() => {
    const objeto = {} as IDadosCovid;
    const celulaS19 = new Array;
    document
      .querySelectorAll(
        'div[id="455284170"] > div[class="ritz grid-container"] > table > tbody > tr > td'
      )
      .forEach((celula) => {
        if (celula.className === 's6') {
          objeto.data = celula.textContent as string;
        }
        if (celula.className === 's15') {
          objeto.suspeitos = celula.textContent as string;
        }
        if (celula.className === 's16') {
          objeto.confirmados = celula.textContent as string;
        }
        if (celula.className === 's18') {
          objeto.descartados = celula.textContent as string;
        }
        if (celula.className === 's19') {
          celulaS19.push(celula.textContent);
        }
      });
    objeto.recuperados = celulaS19[2];
    objeto.obitos = celulaS19[3];
    return objeto;
  });
  browser.close();
  return result;
};

app.listen(process.env.APP_PORT || 3333, ()=>{
  console.log("Server on");
});