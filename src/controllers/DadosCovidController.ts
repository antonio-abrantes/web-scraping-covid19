import { IDadosCovid } from './../interfaces/exportInterfaces';
import * as admin from 'firebase-admin';
const db = admin.firestore();
import { Request, Response } from 'express';
import dataAtualFormatada from '../utils/dataAtualFormatada';
import dataAnteiorFormatada from '../utils/dataAnteriorFormatada';

class DadosCovidController {
  /**
   * Endpoint que retorna os dados do dia atual ou os do dia anterior, caso ainda
   * não tenham sido atualizados.
   */
  async index(request: Request, response: Response) {
    let collection = db.collection('covid19v3');
    let data = dataAtualFormatada();
    collection
      .where('data', '==', data)
      .get()
      .then(async (dado) => {
        if (dado.empty) {
                    
          let collection = db.collection('covid19v3');
          collection
            .where('data', '==', dataAnteiorFormatada())
            .get()
            .then(async (dado) => {
              let dados = new Array();
              dado.forEach((doc) => {
                console.log('Dados dia anterior');
                dados.push(doc.data());
              });
              return await await response.json([{ status: true }, dados[0]]);
            });
        }else{
          let dados = new Array();
          dado.forEach((doc) => {
            console.log(doc.data());
            dados.push(doc.data());
          });
          return await response.json([{ status: true }, dados[0]]);
        }
      });
  }

  /**
   * Endpoint que retorna os dados de acordo com uma data passada por parametro
   */
  async getByDate(request: Request, response: Response) {
    const { dia, mes, ano } = request.params;
    let data = `${dia}/${mes}/${ano}`;
    let collection = db.collection('covid19v3');
    collection
      .where('data', '==', data)
      .get()
      .then(async (dado) => {
        if (dado.empty) {
          return await response.json({
            qtd: dado.size,
            status: false,
            error: `Sem dados para data de ${data}`,
          });
        }
        let dados = new Array();
        dado.forEach((doc) => {
          console.log(doc.data());
          dados.push(doc.data());
        });
        return await response.json([{ status: true }, dados[0]]);
      });
  }

  /**
   * Este método não tem endpoint, pois é chamado apenas na função do Cron quanto
   * ele é ativado para verificar os dados de acordo com o temporizador
   */
  async create(dadosCovid: IDadosCovid) {
    console.log('Create');
    let collection = db.collection('covid19v3');
    collection
      .where('data', '==', dadosCovid.data)
      .get()
      .then(async (dado) => {
        if (dado.empty) {
          console.log('Gravando dados...');
          console.log(dadosCovid);
          const res = await db.collection('covid19v3').doc().set(dadosCovid);
        } else {
          console.log({ message: 'Dados já existentes' });
        }
      });
  }
}

export const dadosCovidController = new DadosCovidController();
