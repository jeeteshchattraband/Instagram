import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { UsuarioModel } from '../usuario.model';

import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
})
export class CadastroComponent implements OnInit {

  @Output() public exibirPainel: EventEmitter<string> = new EventEmitter<string>();
  public formulario: FormGroup = new FormGroup({
    'email': new FormControl(),
    'nome_completo': new FormControl(),
    'nome_usuario': new FormControl(),
    'senha': new FormControl()
  });

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  public exibirPainelLogin(): void {
    this.exibirPainel.emit('login');
  }

  public cadastrarUsuario(): void {


    const usuario: UsuarioModel = new UsuarioModel(
      this.formulario.value.email,
      this.formulario.value.nome_completo,
      this.formulario.value.nome_usuario,
      this.formulario.value.senha
    );

    this.authService.cadastrarUsuario(usuario)
      .then(() => this.exibirPainelLogin());
  }

}
