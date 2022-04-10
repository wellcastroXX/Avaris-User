import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { AngularFireStorage, AngularFireUploadTask } from "@angular/fire/storage"
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';
import { LottieAnimationViewModule } from 'ng-lottie';

@Component({
  selector: 'app-meus-dados',
  templateUrl: './meus-dados.component.html',
  styleUrls: ['./meus-dados.component.scss'],
})
export class MeusDadosComponent implements OnInit {
  
  isLoad: boolean = false;
  loading: boolean = false;
  BoxPhoto: boolean = false;
  userData;
  userId: string = '';

  formData = {
    cpf: '',
    nome: '',
    sobrenome: '',
    celular: '',
    senha: '',
    datadenascimento: ''
  }
  urlobj: any;
  cameraOptions: CameraOptions = {
    quality: 80,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  base64Image: string;
  downloadURL: Observable<string>;
  token: any;
  updatePhoto: boolean = false;
  lottieConfig: { path: string; autoplay: boolean; loop: boolean; };

  constructor(private router: Router, private afstore: AngularFirestore, private camera: Camera, private storage: AngularFireStorage, public actionSheetController: ActionSheetController) 
  { 
    LottieAnimationViewModule.forRoot();
    this.lottieConfig = {
        path: 'assets/load.json',
        autoplay: true,
        loop: true
    };
  }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.userId = this.userId.replace(/^"(.+(?="$))"$/, '$1');
    this.token = this.userId;
    //this.userId = '61f946b17f7e8';

    this.getDataUser();
  }

  getDataUser() {
    firebase.firestore().collection('usuarios').doc(this.userId).onSnapshot(snap => {
      this.userData = snap.data();
      this.formData.cpf = snap.data().cpf;
      this.formData.nome = snap.data().nome;
      this.formData.sobrenome = snap.data().sobrenome;
      this.formData.celular = snap.data().celular;
      this.formData.senha = snap.data().senha;
      this.formData.datadenascimento = snap.data().datadenascimento;
    });
  }

  profile() {
    this.router.navigate(['profile']);
  }

  atualizar() {
    this.afstore.doc(`usuarios/${this.userId}`).update({
      cpf: this.formData.cpf,
      nome: this.formData.nome,
      sobrenome: this.formData.sobrenome,
      celular: this.formData.celular,
      senha: this.formData.senha,
      datadenascimento: this.formData.datadenascimento
    });

    this.router.navigate(['profile']);
  }

  async startPhoto() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Editar foto de perfil',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Tirar foto',
        handler: () => {
          console.log('tira foto');
          this.takePhoto(1);
          this.isLoad = true;
          this.BoxPhoto = true;
        } 
      }, {
        text: 'Escolher da galeria',
        handler: () => {
          console.log('galeria');
          this.takePhoto(0);         
          this.isLoad = true;
          this.BoxPhoto = true;
        }
      }, {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  async takePhoto(sourceType: number) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType
    };
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
      console.error(err);
    });
  }
  upload(): void {
    this.isLoad = true;
    var currentDate = Date.now();
    const file: any = this.base64ToImage(this.base64Image);
    const filePath = `users/${currentDate}`;
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(`users/${currentDate}`, file);
    task.snapshotChanges()
      .pipe(finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe(downloadURL => {
          if (downloadURL) {
            this.urlobj = downloadURL;
            const photo = downloadURL;
            this.afstore.doc(`usuarios/${this.token}`).update({
              photo
            });
            this.isLoad = false;
            this.BoxPhoto = false;
          }
          console.log(downloadURL);
        });
      })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

  base64ToImage(dataURI) {
    const fileDate = dataURI.split(',');
    // const mime = fileDate[0].match(/:(.*?);/)[1];
    const byteString = atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    return blob;
  }

  cancelPhoto(){
    this.isLoad = false;
    this.BoxPhoto = false;
    this.base64Image = null;
  }
  
}
