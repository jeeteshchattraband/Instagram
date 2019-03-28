import {Injectable} from '@angular/core';

import {ProgressoService} from './progresso.service';
import * as firebase from 'firebase';
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFireStorage} from '@angular/fire/storage';


@Injectable()
export class BdService {

  constructor(private progressoService: ProgressoService, private afDatabase: AngularFireDatabase, private afStorage: AngularFireStorage) {
  }

  public publicar(publicacao: any): void {
    this.afDatabase.database.ref(`publicacoes/${btoa(publicacao.email)}`)
      .push({titulo: publicacao.titulo})
      .then((response: any) => {
        const nomeImagem = response.key;

        this.afStorage.storage.ref()
          .child(`imagens/${nomeImagem}`)
          .put(publicacao.imagem)
          .on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot: any) => {
            this.progressoService.status = 'andamento';
            this.progressoService.estado = snapshot;
            },
          (erro: Error) => console.log(erro),
          () => this.progressoService.status = 'concluido'
          );
      });
  }

    // firebase.database().ref(`publicacoes/${btoa(publicacao.email)}`)
    //   .push({titulo: publicacao.titulo}) // push = vários documentos dentro do mesmo path
    //   .then((response: any) => {
    //     const nomeImagem = response.key;
    //
    //     firebase.storage().ref()
    //       .child(`imagens/${nomeImagem}`)
    //       .put(publicacao.imagem)
    //       .on(firebase.storage.TaskEvent.STATE_CHANGED,
    //         (snapshot: any) => {
    //           this.progressoService.status = 'andamento';
    //           this.progressoService.estado = snapshot;
    //         },
    //         (error: Error) => this.progressoService.status = 'erro',
    //         () => {
    //           this.progressoService.status = 'concluido';
    //         });
    //   });

  public consultaPublicacoes(emailUsuario: string): Promise<any> {

    return new Promise((resolve, reject) => {

      this.afDatabase.database.ref(`publicacoes/${btoa(emailUsuario)}`)
        .orderByKey()
        .once('value')
        .then((snapshot: any) => {
          const publicacoes: Array<any> = [];
          snapshot.forEach((childSnapshot: any) => {
            const publicacao = childSnapshot.val();
            publicacao.key = childSnapshot.key;
            publicacoes.push(publicacao);

            publicacoes.reverse().forEach((pub: any) => {
              this.afStorage.storage.ref()
                .child(`imagens/${pub.key}`)
                .getDownloadURL()
                .then((url: string) => {
                  pub.url_imagem = url;

                  this.afDatabase.database.ref(`usuario_detalhe/${btoa(emailUsuario)}`)
                    .once('value')
                    .then((snapshotUser: any) => {
                      pub.nome_usuario = snapshotUser.val().nome_usuario;
                    });
                });
            });
            resolve(publicacoes);
          });
        });
    });


    // firebase.database().ref(`publicacoes/${btoa(emailUsuario)}`)
    //   .orderByKey()
    //   .once('value')
    //   .then((snapshot: any) => {
    //     const publicacoes: Array<any> = [];
    //
    //     console.log(snapshot.val());
    //
    //     snapshot.val().forEach((childSnapshot: any) => { // erro no forEach
    //       const publicacao = childSnapshot.val();
    //       publicacao.key = childSnapshot.key;
    //       publicacoes.push(childSnapshot);
    //       return publicacoes.reverse();
    //     })
    //     .then((pub: any) => {
    //       publicacoes.forEach((publicacao: any) => {
    //         firebase.storage().ref()
    //           .child(`imagens/${publicacao.key}`)
    //           .getDownloadURL()
    //           .then((url: string) => {
    //             publicacao.url_imagem = url;
    //
    //             // consultar nome do usuário
    //             firebase.database().ref(`usuario_detalhe/${btoa(emailUsuario)}`)
    //               .once('value')
    //               .then((snapshotUser: any) => {
    //                 publicacao.nome_usuario = snapshotUser.val().nome_usuario;
    //               });
    //           });
    //       });
    //       resolve(publicacoes);
    //     });
    //   });
  }
}



