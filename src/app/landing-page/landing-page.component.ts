import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  @Output() enter: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onTriggerEnter() {
    this.enter.emit(null);
  }
}
