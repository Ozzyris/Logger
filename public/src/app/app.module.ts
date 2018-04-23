// PLUGIN
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// VIEWS
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { SignupComponent } from './views/signup/signup.component';
import { ForgotpasswordComponent } from './views/forgot-password/forgot-password.component';
import { SetpasswordComponent } from './views/set-password/set-password.component';
import { LandingComponent } from './views/landing/landing.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PagenotfoundComponent } from './views/page-not-found/page-not-found.component';
import { EmailVerificationComponent } from './views/email-verification/email-verification.component';

const appRoutes: Routes = [
	{ path: 'landing', component: LandingComponent },
	{	
		path: '',
		redirectTo: '/landing',
		pathMatch: 'full'
  	},
	{ path: 'signup', component: SignupComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'forget-password', component: ForgotpasswordComponent },
  { path: 'set-password/:token', component: SetpasswordComponent },
	{ path: 'email-verification/:token', component: EmailVerificationComponent },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: '**', component: PagenotfoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ForgotpasswordComponent,
    SetpasswordComponent,
    LandingComponent,
    DashboardComponent,
    PagenotfoundComponent,
    EmailVerificationComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
