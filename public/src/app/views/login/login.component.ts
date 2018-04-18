import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { map } from 'rxjs/operators';

//services
import { users_service } from '../../services/users/users.service';
import { validator_service } from '../../services/validator/validator.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [users_service, validator_service]
})
export class LoginComponent implements OnInit {
	//inputs
	input_email: string = '';
	info_email: string = '';
	input_password: string = '';
	info_password: string = '';
	input_stay_loggedin: boolean = false;

	//primary cta
	button_text: string = 'Login';
	button_class: string = 'button';

	//avatar
	gradient_style: any;
	initials: string = '';

	constructor( private router:Router, private elementRef: ElementRef, private users_service: users_service, private validator_service: validator_service ){
		Observable.fromEvent(elementRef.nativeElement, 'keyup')
			.map(() => this.input_email)
			.debounceTime( 600 )
			.distinctUntilChanged()
			.subscribe(email => {
				this.get_avatar( email );
			});
	}
	ngOnInit(){}

	get_avatar( email ){
		if( this.validator_service.email_test( email ) == false ) {
				this.info_email = '<span class="icon""></span> Your email is incorrect.';
		}else{
			this.users_service.get_avatar_from_email( email )
				.then( avatar => {
					this.info_email = '';
					if(avatar.type = 'generated'){
						this.gradient_style = {"background": 'linear-gradient(to right, #' + avatar.gradient[0] + ', #' + avatar.gradient[1] + ')'}
						this.initials = avatar.initials;
					}
				})
				.catch(error => {
					let error_content = JSON.parse(error._body);
					this.info_email = '<span class="icon""></span> ' + error_content.message;
				});
		}
	}

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
		}else{
			this.button_class = 'button';
			this.button_text = 'Login';
		}
	}

	login(){
		let user = {
			email: this.input_email,
			password: this.input_password,
			stay_loggedin: this.input_stay_loggedin
		}

		this.users_service.login_with_credentials( user )
			.then( user_detail => {
				if( user_detail ){
					let user = {
						id: user_detail.user_id
					}
					localStorage.setItem("user", JSON.stringify(user));
					this.button_class = 'button loading success';
					this.button_text = '<span class="icon"></span>';
					let timer = setTimeout(() => {  
						this.router.navigate(['dashboard']);
						clearTimeout(timer);
					}, 1500);
				}
			})
			.catch(error => {
				let error_content = JSON.parse(error._body);
				console.log( error_content );
				this.info_password = error_content.message;
				this.button_class = 'button';
				this.button_text = 'Login';
			});
	}
}
