import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.scss'],
})
export class ChoiceComponent implements OnInit {
  @Input()
  letter = 'A';

  @Input()
  caption = '';

  @Input()
  imageSrc?: string;

  constructor() {}

  @Input('selected')
  isSelected = false;

  ngOnInit(): void {}
}
