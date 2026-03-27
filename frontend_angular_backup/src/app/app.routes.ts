import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreateQuizComponent } from './pages/create-quiz/create-quiz.component';
import { AddQuestionComponent } from './pages/add-question/add-question.component';
import { AttemptQuizComponent } from './pages/attempt-quiz/attempt-quiz.component';
import { ResultComponent } from './pages/result/result.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'create-quiz', component: CreateQuizComponent },
  { path: 'add-question/:id', component: AddQuestionComponent },
  { path: 'attempt-quiz/:id', component: AttemptQuizComponent },
  { path: 'my-results', component: ResultComponent },
  { path: '**', redirectTo: 'dashboard' }
];
