import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from '../../components/user/user.component';
import { ContactsComponent } from '../../components/user/contacts/contacts.component';
import { MessagesComponent } from '../../components/user/messages/messages.component';
import { DetectionComponent } from '../../components/user/detection/detection.component';
import { GalleryComponent } from '../../components/user/gallery/gallery.component';
import { SettingsComponent } from '../../components/user/settings/settings.component';


const routes: Routes = [
  {
    path: '', component: UserComponent, children: [
      {path: '', redirectTo: 'contacts', pathMatch: 'full'},
      {path: 'messages', component: MessagesComponent, data: {animationIndex: 1}},
      {path: 'contacts', component: ContactsComponent, data: {animationIndex: 2}},
      {path: 'gallery', component: GalleryComponent, data: {animationIndex: 3}},
      {path: 'detection', component: DetectionComponent, data: {animationIndex: 4}},
      {path: 'settings', component: SettingsComponent, data: {animationIndex: 5}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
