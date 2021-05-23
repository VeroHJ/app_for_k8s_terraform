import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-k8s-status',
  templateUrl: './k8s-status.component.html',
  styleUrls: ['./k8s-status.component.scss']
})
export class K8sStatusComponent {

  nodesMessages = '';
  nodesResponse = '';
  podsMessages = '';
  podsResponse = '';
  loading = false;
  k8sForm = new FormGroup({
    masterIp: new FormControl('', [Validators.required, Validators.pattern('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')]),
  });

  get masterIp(): AbstractControl | null {
    return this.k8sForm.get('masterIp');
  }

  constructor() {
  }

  getK8sStatus(): void {
    this.markAllInputsAsTouched();
    if (!this.k8sForm.valid || this.loading) {
      return;
    }

    const params = `masterIp=${this.k8sForm.get('masterIp')?.value}`;
    console.log(params);

    this.getNodes(params);
    this.getPods(params);
  }

  private getNodes(params: string): void {
    this.nodesMessages += 'Loading...';
    const es = new EventSource(`http://localhost:8084/k8s/status/nodes?${params}`);
    // es.addEventListener('open', (event: Event) => {
    //   this.outputMessages += 'Loading...';
    // });
    es.addEventListener('message', (event: MessageEvent) => {
      console.log('MSG: ', event);
      this.nodesResponse += event.data;
      this.nodesMessages = this.nodesResponse;
      this.nodesMessages += 'Loading...';
    });
    es.addEventListener('error', (event: Event) => {
      console.error(event);
      es.close();
      this.nodesMessages += 'ERROR: check console for more details';
    });
    es.addEventListener('done', (event: Event) => {
      es.close();
      this.nodesMessages = this.nodesResponse;
      if (!this.nodesMessages) {
        this.nodesMessages = '<div class="text-center">List of nodes is empty!</div>';
      } else {
        this.nodesMessages += '<br />DONE!';
      }
    });
  }

  private getPods(params: string): void {
    this.podsMessages += 'Loading...';
    const es = new EventSource(`http://localhost:8084/k8s/status/pods?${params}`);
    // es.addEventListener('open', (event: Event) => {
    //   this.outputMessages += 'Loading...';
    // });
    es.addEventListener('message', (event: MessageEvent) => {
      console.log('MSG: ', event);
      this.podsResponse += event.data;
      this.podsMessages = this.podsResponse;
      this.podsMessages += 'Loading...';
    });
    es.addEventListener('error', (event: Event) => {
      console.error(event);
      es.close();
      this.podsMessages += 'ERROR: check console for more details';
    });
    es.addEventListener('done', (event: Event) => {
      es.close();
      this.podsMessages = this.podsResponse;
      if (!this.podsMessages) {
        this.podsMessages = '<div class="text-center">List of pods is empty!</div>';
      } else {
        this.podsMessages += '<br />DONE!';
      }
    });
  }

  private markAllInputsAsTouched(): void {
    this.masterIp?.markAllAsTouched();
  }
}
