import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-build-infrastructure',
  templateUrl: './build-infrastructure.component.html',
  styleUrls: ['./build-infrastructure.component.scss']
})
export class BuildInfrastructureComponent implements OnInit {

  loading = false;
  outputMessages = '';
  response = '';
  awsForm = new FormGroup({
    region: new FormControl('', Validators.required),
    zone: new FormControl('', Validators.required),
    ami: new FormControl('', Validators.required),
    vpcName: new FormControl('', Validators.required),
    ec2TypeMaster: new FormControl('', Validators.required),
    ec2TypeWorker: new FormControl('', Validators.required)
  });

  get region(): AbstractControl | null {
    return this.getFormControl('region');
  }

  get zone(): AbstractControl | null {
    return this.getFormControl('zone');
  }

  get ami(): AbstractControl | null {
    return this.getFormControl('ami');
  }

  get vpcName(): AbstractControl | null {
    return this.getFormControl('vpcName');
  }

  get ec2TypeMaster(): AbstractControl | null {
    return this.getFormControl('ec2TypeMaster');
  }

  get ec2TypeWorker(): AbstractControl | null {
    return this.getFormControl('ec2TypeWorker');
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  buildInfrastructure(): void {
    this.markAllInputsAsTouched();
    if (!this.awsForm.valid || this.loading) {
      return;
    }
    this.loading = true;
    this.outputMessages = '';
    this.response = '';
    let params = `region=${this.getValue('region')}`;
    params += `&zone=${this.getValue('zone')}`;
    params += `&ami=${this.getValue('ami')}`;
    params += `&vpcName=${this.getValue('vpcName')}`;
    params += `&ec2TypeMaster=${this.getValue('ec2TypeMaster')}`;
    params += `&ec2TypeWorker=${this.getValue('ec2TypeWorker')}`;

    this.outputMessages += 'Loading...';
    const es = new EventSource(`http://localhost:8084/terraform/apply?${params}`);
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
    return this.awsForm.get(controlName)?.value;
  }

  private getFormControl(controlName: string): AbstractControl | null {
    return this.awsForm.get(controlName);
  }

  private markAllInputsAsTouched(): void {
    this.region?.markAllAsTouched();
    this.zone?.markAllAsTouched();
    this.ami?.markAllAsTouched();
    this.vpcName?.markAllAsTouched();
    this.ec2TypeMaster?.markAllAsTouched();
    this.ec2TypeWorker?.markAllAsTouched();
  }

}
