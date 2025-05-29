import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoadingPageComponent } from './loading-page/loading-page.component';
import { PreparePageComponent } from './prepare-page/prepare-page.component';
import { QuestionPageComponent } from './question-page/question-page.component';
import { ResultPageComponent } from './result-page/result-page.component';

const routes: Routes = [
  { path: '', component: GameComponent },
  { path: 'loading', component: LoadingPageComponent },
  { path: 'landing', component: LandingPageComponent },
  { path: 'prepare', component: PreparePageComponent },
  { path: 'question', component: QuestionPageComponent },
  { path: 'result', component: ResultPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
