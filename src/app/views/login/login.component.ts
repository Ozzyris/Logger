import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	//inputs
	input_email: string = '';
	info_email: string = '';
	input_password: string = '';
	info_password: string = '';

	//primary cta
	button_text: string = 'Login';
	button_class: string = 'button';

	constructor( private afAuth: AngularFireAuth, private router:Router ){}
	ngOnInit(){}

	email_test( email ){
		var emailRegex = new RegExp('^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$', 'i');
		if( emailRegex.test(email) ) {
			return true;
		} else {
			return false;
		}
	}

	input_verification(){
		this.button_class = 'button loading';
		this.button_text = '<span class="icon rotate"></span>';

		let open_door = true;
		this.info_email = this.info_password = '';

		if( this.email_test( this.input_email ) == false ){
			open_door = false;
			this.info_email = '<span class="icon""></span> Your email is incorrect';
		}
		if( this.input_email == ''){
			open_door = false;
			this.info_email = '<span class="icon""></span> Your email is required';
		}
		if( this.input_password == ''){
			open_door = false;
			this.info_password = '<span class="icon""></span> Your password is required';
		}

		if( open_door == true ){
			this.login();
		}
	}

	login(){
		this.afAuth.auth.signInWithEmailAndPassword( this.input_email, this.input_password )
			.then(value => {
				this.button_class = 'button loading success';
				this.button_text = '<span class="icon"></span>';
				let timer = setTimeout(() => {  
					this.router.navigate(['dashboard']);
					clearTimeout(timer);
				}, 1500);
			})
			.catch(err => {
				console.log('Something went wrong:', err.message);
				this.button_class = 'button';
				this.button_text = 'Login';
			});
	}

}
