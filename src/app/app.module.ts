import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatRippleModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PreparePageComponent } from './prepare-page/prepare-page.component';
import { QuestionPageComponent } from './question-page/question-page.component';
import { ResultPageComponent } from './result-page/result-page.component';
import { ChoiceComponent } from './question-page/choice/choice.component';
import { TrueFalseQuestionComponent } from './question-page/true-false-question/true-false-question.component';
import { MultiChoiceQuestionComponent } from './question-page/multi-choice-question/multi-choice-question.component';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { GameComponent } from './game/game.component';
import { ImgPreSizeDirective } from './img-pre-size.directive';
import { PlatformModule } from '@angular/cdk/platform';
import { LoadingPageComponent } from './loading-page/loading-page.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    AudioPlayerComponent,
    ChoiceComponent,
    ImgPreSizeDirective,
    LandingPageComponent,
    MultiChoiceQuestionComponent,
    GameComponent,
    PreparePageComponent,
    QuestionPageComponent,
    ResultPageComponent,
    TrueFalseQuestionComponent,
    LoadingPageComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatRippleModule,
    PlatformModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
