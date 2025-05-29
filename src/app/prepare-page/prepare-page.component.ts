import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ExamService } from '../exam.service';

@Component({
  selector: 'app-prepare-page',
  templateUrl: './prepare-page.component.html',
  styleUrls: ['./prepare-page.component.scss'],
})
export class PreparePageComponent implements OnInit {
  @Output() start: EventEmitter<any> = new EventEmitter();

  // Name from Wechat.
  name = '';

  id = '------';

  userProvidedName = '';

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    let userData = this.examService.getUserData();
    if (userData) {
      this.name = userData.nickname;
      this.id = userData.id;
    }
  }

  onTriggerStart() {
    this.start.emit(null);
  }

  onUpdateName() {
    this.examService.updateName(this.userProvidedName);
  }
}
