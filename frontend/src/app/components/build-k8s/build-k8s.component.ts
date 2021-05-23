import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-build-k8s',
  templateUrl: './build-k8s.component.html',
  styleUrls: ['./build-k8s.component.scss']
})
export class BuildK8sComponent implements OnInit {

  loading = false;
  outputMessages = '';
  response = '';
  k8sForm = new FormGroup({
    masterIp: new FormControl('', [Validators.required, Validators.pattern('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')]),
    workerIp: new FormControl('', [Validators.required, Validators.pattern('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')]),
  });

  constructor() {
  }

  ngOnInit(): void {
  }


  get masterIp(): AbstractControl | null {
    return this.getFormControl('masterIp');
  }

  get workerIp(): AbstractControl | null {
    return this.getFormControl('workerIp');
  }

  buildK8S(): void {
    this.markAllInputsAsTouched();
    if (!this.k8sForm.valid || this.loading) {
      return;
    }
    this.loading = true;
    this.outputMessages = '';
    this.response = '';
    let params = `masterIp=${this.getValue('masterIp')}`;
    params += `&workerIp=${this.getValue('workerIp')}`;
    console.log(params);

    this.outputMessages += 'Loading...';
    const es = new EventSource(`http://localhost:8084/k8s/init?${params}`);
    // es.addEventListener('open', (event: Event) => {
    //   this.outputMessages += 'Loading...';
    // });
    es.addEventListener('message', (event: MessageEvent) => {
      console.log('MSG: ', event);
      this.response += event.data;
      this.outputMessages = this.response;
      this.outputMessages += 'Loading...';
    });
    es.addEventListener('error', (event: Event) => {
      console.error(event);
      es.close();
      this.loading = false;
      this.outputMessages += 'ERROR: check console for more details';
    });
    es.addEventListener('done', (event: Event) => {
      es.close();
      this.response += '<br />**************<br />';
      this.response += 'Install K8s Dependencies<br />';
      this.response += '**************<br />';
      this.outputMessages = this.response;
      this.outputMessages += 'Loading...';
      this.installK8sDependencies();
    });
  }

  private installK8sDependencies(): void {
    const es = new EventSource('http://localhost:8084/k8s/dependencies');
    // es.addEventListener('open', (event: Event) => {
    //   this.outputMessages += 'Loading...';
    // });
    es.addEventListener('message', (event: MessageEvent) => {
      console.log('MSG: ', event);
      this.response += event.data;
      this.outputMessages = this.response;
      this.outputMessages += 'Loading...';
    });
    es.addEventListener('error', (event: Event) => {
      console.error(event);
      es.close();
      this.loading = false;
      this.outputMessages += 'ERROR: check console for more details';
    });
    es.addEventListener('done', (event: Event) => {
      es.close();
      this.response += '<br />**************<br />';
      this.response += 'Configure Master node<br />';
      this.response += '**************<br />';
      this.outputMessages = this.response;
      this.outputMessages += 'Loading...';
      this.installK8sMaster();
    });
  }

  private installK8sMaster(): void {
    const es = new EventSource('http://localhost:8084/k8s/master');
    // es.addEventListener('open', (event: Event) => {
    //   this.outputMessages += 'Loading...';
    // });
    es.addEventListener('message', (event: MessageEvent) => {
      console.log('MSG: ', event);
      this.response += event.data;
      this.outputMessages = this.response;
      this.outputMessages += 'Loading...';
    });
    es.addEventListener('error', (event: Event) => {
      console.error(event);
      es.close();
      this.loading = false;
      this.outputMessages += 'ERROR: check console for more details';
    });
    es.addEventListener('done', (event: Event) => {
      es.close();
      this.response += '<br />**************<br />';
      this.response += 'Configure workers<br />';
      this.response += '**************<br />';
      this.outputMessages = this.response;
      this.outputMessages += 'Loading...';
      setTimeout(() => {
        this.installK8sWorkers();
      }, 30000);
      // this.outputMessages += 'DONE!';
      // this.loading = false;
    });
  }

  private installK8sWorkers(): void {
    this.outputMessages += 'Loading...';
    const es = new EventSource('http://localhost:8084/k8s/workers');
    // es.addEventListener('open', (event: Event) => {
    //   this.outputMessages += 'Loading...';
    // });
    es.addEventListener('message', (event: MessageEvent) => {
      console.log('MSG: ', event);
      this.response += event.data;
      this.outputMessages = this.response;
      this.outputMessages += 'Loading...';
    });
    es.addEventListener('error', (event: Event) => {
      console.error(event);
      es.close();
      this.loading = false;
      this.outputMessages += 'ERROR: check console for more details';
    });
    es.addEventListener('done', (event: Event) => {
      es.close();
      this.outputMessages = this.response;
      this.outputMessages += 'DONE!';
      this.loading = false;
    });
  }

  private getValue(controlName: string): string {
    return this.k8sForm.get(controlName)?.value;
  }

  private getFormControl(controlName: string): AbstractControl | null {
    return this.k8sForm.get(controlName);
  }

  private markAllInputsAsTouched(): void {
    this.masterIp?.markAllAsTouched();
    this.workerIp?.markAllAsTouched();
  }
}
