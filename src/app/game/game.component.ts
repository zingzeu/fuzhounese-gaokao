import { Platform } from '@angular/cdk/platform';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExamService } from '../exam.service';
import { getHowlProps } from '../howler-helper';

declare var Howl: any;
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  state = State.Loading;

  get isLoading() {
    return this.state == State.Loading;
  }
  get isLanding() {
    return this.state == State.Landing;
  }
  get isPrepare() {
    return this.state == State.Prepare;
  }
  get isQuestion() {
    return this.state == State.Question;
  }
  get isResult() {
    return this.state == State.Result;
  }

  questionIndex = 0;
  refresh = true;

  private _howler: any;

  constructor(
    private examService: ExamService,
    private router: Router,
    private platform: Platform
  ) {}

  ngOnInit(): void {
    this._howler = new Howl({
      ...getHowlProps(this.platform.IOS),
      src: ['assets/audio/book_turning.mp3'],
    });
  }

  ngOnDestroy(): void {
    this._howler?.stop();
  }

  onReady() {
    this.state = State.Landing;
  }

  onEnter() {
    this.state = State.Prepare;
  }

  onStart() {
    this.state = State.Question;
  }

  onSubmit() {
    this.router.navigate(['result'], { skipLocationChange: true });
  }

  onPrev() {
    this.questionIndex--;
    this.refresh = false;
    this._howler.stop();
    this._howler.play();
    window.setTimeout(() => (this.refresh = true));
  }

  onNext() {
    this.questionIndex++;
    this.refresh = false;
    this._howler.stop();
    this._howler.play();
    window.setTimeout(() => (this.refresh = true));
  }
}

enum State {
  Loading,
  Landing,
  Prepare,
  Question,
  Result,
}
