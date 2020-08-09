import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from '../../components/index/index.component';
import { FeaturesComponent } from '../../components/index/features/features.component';
import { PricingComponent } from '../../components/index/pricing/pricing.component';
import { AboutComponent } from '../../components/index/about/about.component';
import { SharedModule } from '../shared/shared.module';
import { SigninComponent } from '../../components/index/signin/signin.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    IndexComponent,
    FeaturesComponent,
    PricingComponent,
    AboutComponent,
    SigninComponent
  ],
  imports: [
    CommonModule,
    IndexRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class IndexModule {
}
