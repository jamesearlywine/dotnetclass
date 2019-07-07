import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { NgxGalleryOptions, NgxGalleryAnimation, NgxGalleryImage } from 'ngx-gallery';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  @ViewChild('editForm') editForm: NgForm;

  member: User;
  galleryOptions: NgxGalleryOptions[] = [
    {
      width: '500px',
      height: '500px',
      thumbnailsColumns: 4,
      imagePercent: 100,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
    }
  ];
  galleryImages: NgxGalleryImage[];

  @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
      if (this.editForm.dirty) {
        $event.returnValue = true;
      }
    }

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.data.subscribe( (data: {user: User}) => {
      this.member = data.user;
      this.buildGalleryImages();
    });
  }

  buildGalleryImages() {
    this.galleryImages = [];
    for (const photo of this.member.photos) {
      this.galleryImages.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description
      });
    }
  }

  updateUser() {
    this.userService.updateUser(
      this.authService.decodedToken.nameid,
      this.member
    ).subscribe(
      response => {
        this.alertify.success('Profile updated successfully.');
        this.editForm.reset(this.member);
      },
      error => {
        this.alertify.error(error);
      }
    );
  }

  onCurrentMainPhotoUpdated(photo) {
    this.member.photoUrl = photo.url;
    this.authService.updateLoggedInUser({
      photoUrl: photo.url
    });
  }

  onDeletePhoto(photo) {
    this.userService.deletePhoto(
      this.authService.loggedInUser.id,
      photo.id
    ).subscribe(
      response => {
        this.member.photos = this.member.photos.filter(p => p.id !== photo.id);
      },
      error => {
        this.alertify.error(error);
      }
    )
  }

}
