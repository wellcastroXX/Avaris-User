import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  
  delta = 0;
  dataAtual = new Date();
  diaAtual: number = new Date().getDate();
  actualMonth: any;
  travels = 0;

  constructor(private navCtrl: NavController) { }

  semana = [];

  setSemana() {
    this.semana = [];
    let date = new Date();
    date.setDate(date.getDate() - 3 + this.delta);
    
    let diaDaSemana = date.getDay();
    let diaNoMes = date.getDate();
    let mesAnterior = date.getMonth() == 0 ? 11 : date.getMonth() - 1;
    let anoValidador = mesAnterior == 11 ? date.getFullYear() - 1 : date.getFullYear();

    for (let i = 0; i < 7; i++) {
      this.semana.push({
        extenso: this.retornaDiaPorExtenso(diaDaSemana),
        diaNoMes: diaNoMes,
      });

      diaDaSemana++;
      if (diaDaSemana == 7) {
        diaDaSemana -= 7;
      }

      diaNoMes++;
      if (diaNoMes > this.diaNoMes(mesAnterior, anoValidador) || diaNoMes > this.diaNoMes(date.getMonth(), date.getFullYear())) {
        diaNoMes = 1;
      }
    }
    this.actualMonth = date.toLocaleString('default', { month: 'long' });
    console.log(this.semana, this.actualMonth);
    
  }

  retornaDiaPorExtenso(numero: number): string {
    switch (numero) {
      case 0:
        return 'Dom';
      case 1:
        return 'Seg';
      case 2:
        return 'Ter';
      case 3:
        return 'Qua';
      case 4:
        return 'Qui';
      case 5:
        return 'Sex';
      case 6:
        return 'Sáb';
    }
  }

  diaNoMes(mes: number, ano: number): number {
    return new Date(ano, mes, 0).getDate();
  }

  subDay() {
    this.delta--;
    this.setSemana();
  }

  plusDay() {
    this.delta++;
    this.setSemana();
  }

 
  ngOnInit(): void{
    this.setSemana();
  }

  home(){
    this.navCtrl.navigateBack('home');
  }


}
