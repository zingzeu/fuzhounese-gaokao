import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ExamService } from 'src/app/exam.service';
import {
  ImageListeningQuestion,
  ListeningQuestion,
  MultiChoiceQuestion,
} from 'src/app/questions';

@Component({
  selector: 'app-multi-choice-question',
  templateUrl: './multi-choice-question.component.html',
  styleUrls: ['./multi-choice-question.component.scss'],
  animations: [],
})
export class MultiChoiceQuestionComponent implements OnInit {
  choiceToLetter = ['A', 'B', 'C', 'D'];

  @Input('question')
  questionIndex: number = 0;

  question?: MultiChoiceQuestion | ListeningQuestion | ImageListeningQuestion;
  selection?: number = undefined;
  selections = new Set<number>();

  get textChoices() {
    return (this.question as MultiChoiceQuestion | ListeningQuestion).choices;
  }

  get imageChoices() {
    return (this.question as ImageListeningQuestion).choices;
  }

  get hasAudio() {
    return (
      this.question instanceof ListeningQuestion ||
      this.question instanceof ImageListeningQuestion
    );
  }

  get isImageQuestion() {
    return this.question instanceof ImageListeningQuestion;
  }

  get audioSrcs() {
    return this.hasAudio ? (this.question! as any).audioSrcs : [];
  }

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.question = this.examService.getQuestion(this.questionIndex) as
      | MultiChoiceQuestion
      | ListeningQuestion;
    const restoredState = this.examService.getAnswer(this.questionIndex);
    if (typeof restoredState == 'number') {
      this.selection = restoredState;
    }
    if (typeof restoredState == 'object') {
      (restoredState as number[]).forEach((i) => this.selections.add(i));
    }
  }

  onToggleChoice(choice: number) {
    if (this.isImageQuestion) {
      this.toggleChoiceMulti(choice);
    } else {
      this.toggleChoiceSingle(choice);
    }
  }

  private toggleChoiceSingle(choice: number) {
    if (this.selection == undefined) {
      this.selection = choice;
    } else {
      this.selection = this.selection === choice ? undefined : choice;
    }
    if (this.selection == undefined) {
      this.examService.clearAnswer(this.questionIndex);
    } else {
      this.examService.updateAnswer(this.questionIndex, this.selection);
    }
  }

  private toggleChoiceMulti(choice: number) {
    if (this.selections.has(choice)) {
      this.selections.delete(choice);
    } else {
      this.selections.add(choice);
    }

    if (this.selections.size == 0) {
      this.examService.clearAnswer(this.questionIndex);
    } else {
      this.examService.updateAnswer(
        this.questionIndex,
        Array.from(this.selections)
      );
    }
  }
}
