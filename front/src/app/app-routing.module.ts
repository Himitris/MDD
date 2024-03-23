import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { DetailsComponent } from './pages/details/details.component';
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';
import { FormComponent } from './pages/form/form.component';

// consider a guard combined with canLoad / canActivate route option
// to manage unauthenticated user to access private routes
const routes: Routes = [
  { path: '', canActivate: [UnauthGuard], component: HomeComponent },
  { path: 'login', canActivate: [UnauthGuard], component: LoginComponent },
  {
    path: 'register',
    canActivate: [UnauthGuard],
    component: RegisterComponent,
  },
  { path: 'articles', canActivate: [AuthGuard], component: ArticlesComponent },
  { path: 'form', canActivate: [AuthGuard], component: FormComponent },
  {
    path: 'articles/:id',
    canActivate: [AuthGuard],
    component: DetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
