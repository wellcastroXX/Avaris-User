import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-modal-token',
  templateUrl: './modal-token.page.html',
  styleUrls: ['./modal-token.page.scss'],
})
export class ModalTokenPage implements OnInit {

  safeUrl: any;

  constructor(public sanitizer: DomSanitizer,) { }

  ngOnInit() {
    const url = 'http://avaris-premium.great-site.net/'.replace;
    //window.location.replace('http://avaris-premium.great-site.net/');
    this.getTrustedUrl(url);
  }

  getTrustedUrl(url:any){ 
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
