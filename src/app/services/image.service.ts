import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app-config';
import { StateService } from './state.service';
import imageCompression from 'browser-image-compression';
import { saveAs } from 'file-saver';
import { Response } from '../models/response';
import { Image } from '../models/image';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private http: HttpClient,
              private appConfig: AppConfig,
              private stateService: StateService) {
  }

  compress(file, options) {
    return imageCompression(file, options);
  }

  saveFile(file, filename) {
    saveAs(file, filename);
  }

  b64toFile(dataURI) {
    return imageCompression.getFilefromDataUrl(dataURI);
  }

  blobToB64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  }

  getImageDoc(imageFilename) {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/images/${imageFilename}`;
    return this.http.get<Response<Image>>(url);
  }

  fileToB64(file) {
    return imageCompression.getDataUrlFromFile(file);
  }

  uploadImage(image: File) {
    const userId = this.stateService.currentUser._id;
    const url = this.appConfig.API_PREFIX + 'users/' + userId + '/images';
    const formData = new FormData();
    formData.append('imageUpload', image);
    return this.http.post<Response<{filename: string}>>(url, formData);
  }

  getByFaceId(faceId) {
    const userId = this.stateService.currentUser._id;
    const url = `${this.appConfig.API_PREFIX}users/${userId}/faces/${faceId}/imageFilename`;
    return this.http.get<Response<Image>>(url);
  }

  detectFaces(imgFilename: string) {
    const userId = this.stateService.currentUser._id;
    const url = this.appConfig.API_PREFIX + 'users/' + userId + '/images/' + imgFilename + '/analysis';
    return this.http.get<Response<any>>(url);
  }

  generateThumbnailImageURL(faceThumbnailId) {
    const userId = this.stateService.currentUser._id;
    return `${this.appConfig.API_PREFIX}users/${userId}/faceThumbnails/${faceThumbnailId}`;
  }

  generateImageURL(imageFilename, quality: 'original' | 'compressed') {
    const userId = this.stateService.currentUser._id;
    return `${this.appConfig.API_PREFIX}users/${userId}/images/${imageFilename}/${quality}`;
  }

  getAll() {
    const userId = this.stateService.currentUser._id;
    const url = this.appConfig.API_PREFIX + 'users/' + userId + '/images';
    return this.http.get<Response<any>>(url);
  }

  deleteByFilename(filename) {
    const userId = this.stateService.currentUser._id;
    const url = this.appConfig.API_PREFIX + 'users/' + userId + '/images/' + filename;
    return this.http.delete(url);
  }
}
