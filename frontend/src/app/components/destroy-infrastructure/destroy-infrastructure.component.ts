import {Component} from '@angular/core';

@Component({
  selector: 'app-destroy-infrastructure',
  templateUrl: './destroy-infrastructure.component.html',
  styleUrls: ['./destroy-infrastructure.component.scss']
})
export class DestroyInfrastructureComponent {

  outputMessages = '';
  response = '';
  loading = false;

  constructor() {
  }

  destroyInfrastructure(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.outputMessages = '';
    this.response = '';
    const es = new EventSource('http://localhost:8084/terraform/destroy');
    this.outputMessages += 'Loading...';
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
      this.outputMessages += 'ERROR: check console for more details';
      this.loading = false;
    });
    es.addEventListener('done', (event: Event) => {
      es.close();
      this.outputMessages = this.response;
      this.outputMessages += 'DONE!';
      this.loading = false;
    });
  }

}
