import { IDadosCovid } from './../interfaces/exportInterfaces';
import * as  admin from "firebase-admin";
const db = admin.firestore();
import {Request, Response} from 'express';
import dataAtualFormatada from '../utils/dataAtualFormatada';

class DadosCovidController {

  async index(request: Request, response: Response) {
    let collection = db.collection('covid19v3');
    collection.where('data', '==', dataAtualFormatada())
      .get()
      .then( async (dado) =>{
        let dados = new Array;
          dado.forEach(doc =>{
          console.log(doc.data());
          dados.push(doc.data());
        });
        return await response.json(dados);
      });
  }

  async getByDate(request: Request, response: Response) {
    const {dia, mes, ano } = request.params;
    console.log(request.params);
    let collection = db.collection('covid19v3');
    collection.where('data', '==', `${dia}/${mes}/${ano}`)
      .get()
      .then( async (dado) =>{
        let dados = new Array;
          dado.forEach(doc =>{
          console.log(doc.data());
          dados.push(doc.data());
        });
        return await response.json(dados);
      });
  }

  async create(dadosCovid: IDadosCovid){
    console.log('Create');
    console.log(dadosCovid);
    // const res = await db.collection('covid19v3').doc().set(dadosCovid);
  }
}

export const dadosCovidController = new DadosCovidController();
