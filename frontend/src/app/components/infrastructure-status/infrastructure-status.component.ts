import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-infrastructure-status',
  templateUrl: './infrastructure-status.component.html',
  styleUrls: ['./infrastructure-status.component.scss']
})
export class InfrastructureStatusComponent implements OnInit {

  outputMessages = '';
  response = '';

  constructor() {
  }

  ngOnInit(): void {
    this.outputMessages += 'Loading...';
    const es = new EventSource(`http://localhost:8084/terraform/state/list`);
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
    });
    es.addEventListener('done', (event: Event) => {
      es.close();
      this.outputMessages = this.response;
      if (!this.outputMessages) {
        this.outputMessages = '<div class="text-center">Your stack is empty!</div>';
      } else {
        this.outputMessages += 'DONE!';
      }
    });
  }

}
