import {AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-console-output',
  templateUrl: './console-output.component.html',
  styleUrls: ['./console-output.component.scss']
})
export class ConsoleOutputComponent implements AfterViewChecked {

  outputMessage = '';

  @Input() customClass = '';
  @Input() output = 'Output';
  @Input() set message(message: string) {
    this.outputMessage = message;
  }

  // @ts-ignore
  @ViewChild('console') console: ElementRef;

  constructor() {
  }

  ngAfterViewChecked(): void {
    const consoleElement = this.console.nativeElement;
    console.log(consoleElement);
    consoleElement.scrollTop = consoleElement.scrollHeight;
  }

}
