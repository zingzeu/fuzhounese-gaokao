import { Component, Input, OnInit } from '@angular/core';
import { ExamService } from 'src/app/exam.service';
import { questions, TrueFalseQuestion } from 'src/app/questions';

@Component({
  selector: 'app-true-false-question',
  templateUrl: './true-false-question.component.html',
  styleUrls: ['./true-false-question.component.scss'],
})
export class TrueFalseQuestionComponent implements OnInit {
  @Input('question')
  questionIndex: number = 0;

  question?: TrueFalseQuestion;

  selection?: boolean = undefined;

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.question = this.examService.getQuestion(
      this.questionIndex
    ) as TrueFalseQuestion;
    this.selection = this.examService.getAnswer(this.questionIndex) as any;
  }

  onToggleChoice(choice: boolean) {
    if (this.selection === undefined) {
      this.selection = choice;
    } else {
      this.selection = this.selection === choice ? undefined : choice;
    }
    if (this.selection === undefined) {
      this.examService.clearAnswer(this.questionIndex);
    } else {
      this.examService.updateAnswer(this.questionIndex, this.selection);
    }
  }
}
