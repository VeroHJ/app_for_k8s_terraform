import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InfrastructureStatusComponent} from './components/infrastructure-status/infrastructure-status.component';
import {BuildInfrastructureComponent} from './components/build-infrastructure/build-infrastructure.component';
import {DestroyInfrastructureComponent} from './components/destroy-infrastructure/destroy-infrastructure.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {BuildK8sComponent} from './components/build-k8s/build-k8s.component';
import {K8sStatusComponent} from './components/k8s-status/k8s-status.component';

const routes: Routes = [
  { path: 'aws-status', component: InfrastructureStatusComponent },
  { path: 'aws-build', component: BuildInfrastructureComponent },
  { path: 'aws-destroy', component: DestroyInfrastructureComponent },
  { path: 'k8s-status', component: K8sStatusComponent },
  { path: 'k8s-build', component: BuildK8sComponent },
  { path: '',   redirectTo: '/aws-status', pathMatch: 'full' }, // redirect to `first-component`
  { path: '**', redirectTo: '/aws-status', pathMatch: 'full' }, // redirect to `first-component`
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
