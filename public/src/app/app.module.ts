import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { SignupComponent } from './views/signup/signup.component';
import { ForgetpasswordComponent } from './views/forgetpassword/forgetpassword.component';
import { SetpasswordComponent } from './views/setpassword/setpassword.component';
import { LandingComponent } from './views/landing/landing.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PagenotfoundComponent } from './views/pagenotfound/pagenotfound.component';

const appRoutes: Routes = [
	{ path: 'landing', component: LandingComponent },
	{	
		path: '',
		redirectTo: '/landing',
		pathMatch: 'full'
  	},
	{ path: 'signup', component: SignupComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'forget-password', component: ForgetpasswordComponent },
	{ path: 'set-password', component: SetpasswordComponent },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: '**', component: PagenotfoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ForgetpasswordComponent,
    SetpasswordComponent,
    LandingComponent,
    DashboardComponent,
    PagenotfoundComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
