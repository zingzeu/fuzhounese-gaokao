import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExamService } from '../exam.service';
import {
  ImageListeningQuestion,
  ListeningQuestion,
  MultiChoiceQuestion,
  Question,
  questions,
  TranslateQuestion,
  TrueFalseQuestion,
} from '../questions';

@Component({
  selector: 'app-question-page',
  templateUrl: './question-page.component.html',
  styleUrls: ['./question-page.component.scss'],
})
export class QuestionPageComponent implements OnInit {
  @Output() prev: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() submit: EventEmitter<any> = new EventEmitter();

  @Input('question')
  questionIndex = 0;

  question?: Question;

  get isFirst() {
    return this.questionIndex == 0;
  }

  get isLast() {
    return this.questionIndex == questions.length - 1;
  }

  get isTrueFalse() {
    return this.question instanceof TrueFalseQuestion;
  }

  get isMultiChoice() {
    return (
      this.question instanceof MultiChoiceQuestion &&
      !(this.question instanceof TranslateQuestion) &&
      !(this.question instanceof ListeningQuestion)
    );
  }

  get isListening() {
    return (
      this.question instanceof ListeningQuestion ||
      this.question instanceof ImageListeningQuestion
    );
  }

  get isTranslate() {
    return this.question instanceof TranslateQuestion;
  }

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.question = this.examService.getQuestion(this.questionIndex);
  }

  onPrev() {
    this.prev.emit(null);
  }

  onNext() {
    this.next.emit(null);
  }

  onSubmit() {
    this.submit.emit(null);
  }
}
