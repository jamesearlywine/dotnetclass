import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() photos: Photo[];
  @Output() currentMainPhotoUpdated = new EventEmitter<Photo>();
  @Output() deletePhoto = new EventEmitter<Photo>();

  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;
  public currentMainPhoto: Photo;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) { }

  ngOnInit() {
    this.updateCurrentMainPhoto();
    this.initUploader();
  }

  initUploader() {
    const endpoint = environment.webservices.baseUrl + '/users/' + this.authService.decodedToken.nameid + '/photos';
    this.uploader = new FileUploader({
      url: endpoint,
      authToken: 'Bearer ' + localStorage.getItem('token'),
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: true,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        this.photos.push(photo);
      }
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public setMainPhoto(photoId: number) {
    this.userService.setMainPhoto(
      this.authService.decodedToken.nameid,
      photoId
    ).subscribe(
      response => {
        this.photos.map(p => p.isMain = p.id === photoId);
        this.updateCurrentMainPhoto();
      },
      error => {
        this.alertify.error(error);
      }
    );
  }

  public updateCurrentMainPhoto() {
    this.currentMainPhoto = this.photos.filter(p => p.isMain === true)[0];
    this.currentMainPhotoUpdated.emit(this.currentMainPhoto);
  }

  public onClickDeletePhoto(photo) {
    this.deletePhoto.emit(photo);
  }

}
