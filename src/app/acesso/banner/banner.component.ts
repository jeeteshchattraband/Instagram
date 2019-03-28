import { Component, OnInit } from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';

import { ImagemModel } from './imagem.model';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  animations: [
    trigger('banner', [
      state('escondido', style({
        opacity: 0
      })),
      state('visivel', style({
        opacity: 1
      })),
      transition('escondido <=> visivel', animate('2s ease-in'))
    ])
  ]
})
export class BannerComponent implements OnInit {

  public estado = 'escondido';

  public imagens: ImagemModel[] = [
    { estado: 'visivel', url: '../../../assets/img_1.png' },
    { estado: 'escondido', url: '../../../assets/img_2.png' },
    { estado: 'escondido', url: '../../../assets/img_3.png' },
    { estado: 'escondido', url: '../../../assets/img_4.png' },
    { estado: 'escondido', url: '../../../assets/img_5.png' },
  ];


  constructor() { }

  ngOnInit() {
    setTimeout(() => this.logicaRotacao(), 3000);
    // this.estado = this.estado === 'visivel' ? 'escondido' : 'visivel';
  }

  public logicaRotacao(): void {
    let idx: number; // auxilio na exibição da imagem seguinte

    for (let i = 0; i <= 4; i++) {
      if (this.imagens[i].estado === 'visivel') {
        this.imagens[i].estado = 'escondido';
        idx = i === 4 ? 0 : i + 1; // impede que idx receba valor fora do array, controlando o indice das imagens
        break;
      }
    }

    this.imagens[idx].estado = 'visivel';
    setTimeout(() => this.logicaRotacao(), 3000);
  }
}
