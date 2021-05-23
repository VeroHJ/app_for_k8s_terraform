import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BuildInfrastructureComponent } from './components/build-infrastructure/build-infrastructure.component';
import { InfrastructureStatusComponent } from './components/infrastructure-status/infrastructure-status.component';
import { DestroyInfrastructureComponent } from './components/destroy-infrastructure/destroy-infrastructure.component';
import { BuildK8sComponent } from './components/build-k8s/build-k8s.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { K8sStatusComponent } from './components/k8s-status/k8s-status.component';
import {ReactiveFormsModule} from '@angular/forms';
import { ConsoleOutputComponent } from './components/console-output/console-output.component';
import {TrustHtmlModule} from 'trust-html-pipe';

@NgModule({
  declarations: [
    AppComponent,
    BuildInfrastructureComponent,
    InfrastructureStatusComponent,
    DestroyInfrastructureComponent,
    BuildK8sComponent,
    PageNotFoundComponent,
    PageTitleComponent,
    K8sStatusComponent,
    ConsoleOutputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    TrustHtmlModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
