import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-emojis',
  templateUrl: './emojis.component.html',
  styleUrls: ['./emojis.component.scss'],
})
export class EmojisComponent implements OnInit {

  @Output()
  ionClick: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  selecionado = 5;

  ngOnInit() {
  }

  emojiClicked(index: any) {
    this.selecionado = index;
    this.ionClick.emit(index);
  }

}
