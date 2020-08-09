import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from '../../components/index/index.component';
import { AboutComponent } from '../../components/index/about/about.component';
import { FeaturesComponent } from '../../components/index/features/features.component';
import { PricingComponent } from '../../components/index/pricing/pricing.component';
import { SigninComponent } from '../../components/index/signin/signin.component';


const routes: Routes = [
  {
    path: '', component: IndexComponent, children: [
      {path: '', redirectTo: 'account', pathMatch: 'full'},
      {path: 'features', component: FeaturesComponent, data: {animationIndex: 0}},
      {path: 'pricing', component: PricingComponent, data: {animationIndex: 1}},
      {path: 'about', component: AboutComponent, data: {animationIndex: 2}},
      {path: 'account', component: SigninComponent, data: {animationIndex: 3}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule {
}
