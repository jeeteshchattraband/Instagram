import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BdService } from '../../bd.service';

@Component({
  selector: 'app-publicacoes',
  templateUrl: './publicacoes.component.html',
  styleUrls: ['./publicacoes.component.css']
})
export class PublicacoesComponent implements OnInit {

  public email: string;
  public publicacoes: any;

  constructor(private bdService: BdService, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged((user: any) => {
      this.email = user.email;
      this.atualizarTimeLine();
    });
  }

  public atualizarTimeLine(): void {
    this.bdService.consultaPublicacoes(this.email)
      .then((publicacoes: any) => {
        this.publicacoes = publicacoes;
      });
  }
}
