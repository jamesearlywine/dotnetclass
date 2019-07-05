import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

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


  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
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

}
