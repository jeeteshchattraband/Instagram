import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {UsuarioModel} from './acesso/usuario.model';


import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase} from '@angular/fire/database';

@Injectable()
export class AuthService {

  public token_id: string;

  constructor(private router: Router, private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase) {}

  public cadastrarUsuario(usuario: UsuarioModel): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(usuario.email, usuario.senha)
      .then((response: any) => {
        delete usuario.senha;
        this.afDatabase.database.ref(`usuario_detalhe/${btoa(usuario.email)}`)
          .set(usuario);
      })
      .catch((erro: Error) => console.log(erro));
  }

  public autenticar(email: string, senha: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, senha)
      .then((response: any) => {
        this.afAuth.auth.currentUser.getIdToken()
          .then((idToken: string) => {
            this.token_id = idToken;
            localStorage.setItem('idToken', idToken);
            this.router.navigate(['/home']);
          });
      })
      .catch((erro: Error) => console.log(erro));
  }


  public autenticado(): boolean {
    if (this.token_id === undefined && localStorage.getItem('idToken') !== null) {
      this.token_id = localStorage.getItem('idToken');
    }
    if (this.token_id === undefined) {
      this.router.navigate(['/']);
    }

    return this.token_id !== undefined;
  }

  public sair(): void {
    this.afAuth.auth.signOut()
      .then(() => {
        localStorage.removeItem('idToken');
        this.token_id = undefined;
        this.router.navigate(['/']);
      });
  }
}
