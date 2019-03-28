import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import { BdService } from '../../bd.service';
import { ProgressoService } from '../../progresso.service';
import {interval, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-incluir-publicacao',
  templateUrl: './incluir-publicacao.component.html',
  styleUrls: ['./incluir-publicacao.component.css']
})
export class IncluirPublicacaoComponent implements OnInit {

  @Output() public atualizarTimeLine: EventEmitter<any> = new EventEmitter<any>();

  public email: string;
  private imagem: any;

  public progressoPublicacao = 'pendente';
  public porcentagemUpload: number;

  public formulario: FormGroup = new FormGroup({
    'titulo': new FormControl(null)
  });

  constructor(private bdService: BdService, private progressoService: ProgressoService, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged((user: any) => {
      this.email = user.email;
    });
  }

  public publicar(): void {
    this.bdService.publicar({
      email: this.email,
      titulo: this.formulario.value.titulo,
      imagem: this.imagem
    });

    const acompanhamentoUpload = interval(1000);
    const continua = new Subject();

    continua.next(true);

    acompanhamentoUpload
      .pipe(
        takeUntil(continua)
      )
      .subscribe(() => {
      this.progressoPublicacao = 'andamento';

      this.porcentagemUpload = Math.round((this.progressoService.estado.bytesTransferred / this.progressoService.estado.totalBytes) * 100);

      if (this.progressoService.status === 'concluido') {
        this.progressoPublicacao = 'concluido';
        // emitir um evento do component parent
        this.atualizarTimeLine.emit();

        continua.next(false);
      }
    });
  }

  public preparaImagemUpload(event: Event): void {
    this.imagem = (<HTMLInputElement>event.target).files[0];
  }

}
