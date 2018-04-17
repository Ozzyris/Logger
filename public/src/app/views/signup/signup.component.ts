import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { map, take, debounceTime } from 'rxjs/operators';
import { users_service } from '../../services/users/users.service'
import { validator_service } from '../../services/validator/validator.service'

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss'],
	providers: [users_service, validator_service]
})

export class SignupComponent implements OnInit {
	//avatar
	gradient_colors: any = [['d73828', 'e06a4d'], ['005d83', '4f8cad'], ['609c40', '9db37d'], ['901f46', 'b06071'], ['fbad18', 'ffd594'], ['f57e25', 'fbba89'], ['fff08b', 'f8d800'], ['ce9ffc', '7367f0'], ['90f7ec', '32ccbc'], ['81fbb8', '28c76f'], ['fccf31', 'f55555'], ['f761a1', '8c1bab']];
	gradient_color: any;
	gradient_style: any;
	initials: string = '';

	//inputs
	input_given_name: string = '';
	info_given_name: string = '';
	input_family_name: string = '';
	info_family_name: string = '';
	input_email: string = '';
	info_email: string = '';
	input_password: string = '';
	info_password: string = '';
	input_password_confirmation: string = '';
	info_password_confirmation: string = '';

	// password strenghtener
	strength_info: string = 'Weak';
	level_1: string = '';
	level_2: string = '';
	level_3: string = '';
	level_4: string = '';
	level_5: string = '';

	//primary cta
	button_text: string = 'Create my new account';
	button_class: string = 'button';

	//form validator
	form_open_door: boolean = true;

	constructor( private router:Router, private elementRef: ElementRef, private users_service: users_service, private validator_service: validator_service ){
		Observable.fromEvent(elementRef.nativeElement, 'keyup')
			.map(() => this.input_password)
			.debounceTime( 600 )
			.distinctUntilChanged()
			.subscribe(input => {
				this.password_tester( input );
			});
		Observable.fromEvent(elementRef.nativeElement, 'keyup')
			.map(() => this.input_email)
			.debounceTime( 600 )
			.distinctUntilChanged()
			.subscribe(input => {
				this.email_tester( input );
			});
		Observable.fromEvent(elementRef.nativeElement, 'keyup')
			.map(() => this.input_given_name)
			.debounceTime( 600 )
			.distinctUntilChanged()
			.subscribe(input => {
				if( input != '' && this.info_family_name != '' ){
					this.avatar_generator();
				}
			});
		Observable.fromEvent(elementRef.nativeElement, 'keyup')
			.map(() => this.input_family_name)
			.debounceTime( 600 )
			.distinctUntilChanged()
			.subscribe(input => {
				if(  input != '' && this.input_given_name != '' ){
					this.avatar_generator();
				}
			});

	}
	ngOnInit(){
		//choose gradient color
		let random_number = Math.floor(Math.random() * this.gradient_colors.length);
		this.gradient_color = this.gradient_colors[random_number];
	}

	avatar_generator(){
		this.initials = this.input_given_name.charAt(0).toUpperCase() + this.input_family_name.charAt(0).toUpperCase();
		this.gradient_style = {"background": 'linear-gradient(to right, #' + this.gradient_color[0] + ', #' +this.gradient_color[1] + ')'}

	}

	password_tester( password ){
		if( password ){
			switch( this.validator_service.password_test( password ) ){
				case "Great":
					this.strength_info = "Great";
					this.level_1 = this.level_2 = this.level_3 = this.level_4 = this.level_5 = '';
					this.level_1 = this.level_2 = this.level_3 = this.level_4 = this.level_5 = 'success';
					break;
				case "Good":
					this.strength_info = "Good";
					this.level_1 = this.level_2 = this.level_3 = this.level_4 = this.level_5 = '';
					this.level_1 = this.level_2 = this.level_3 = this.level_4 = 'success';
					break;
				case "Average":
					this.strength_info = "Average";
					this.level_1 = this.level_2 = this.level_3 = this.level_4 = this.level_5 = '';
					this.level_1 = this.level_2 = this.level_3 = 'warning';
					break;
				case "Poor":
					this.strength_info = "Poor";
					this.level_1 = this.level_2 = this.level_3 = this.level_4 = this.level_5 = '';
					this.level_1 = this.level_2 = 'error';
					break;
				case "Weak":
					this.strength_info = "Weak";
					this.level_1 = this.level_2 = this.level_3 = this.level_4 = this.level_5 = '';
					this.level_1 = 'error'; 
					break;
			}
		}
	}

	email_tester( email ){
		if( email ){
			this.info_email = '';
			if( this.validator_service.email_test( email ) == false ) {
				this.info_email = '<span class="icon""></span> Your email is incorrect.';
			}else{
				this.users_service.check_email( email )
					.then( is_email_exist => {
						this.form_open_door = true;
					})
					.catch(error => {
						let error_content = JSON.parse(error._body);
						this.form_open_door = false;
						this.info_email = '<span class="icon""></span> ' + error_content.message;
					});
			}
		}
	}

	input_verification(){
			if( this.form_open_door == true ){
			this.button_class = 'button loading';
			this.button_text = '<span class="icon rotate"></span>';

			this.info_given_name = this.info_family_name = this.info_email = this.info_password = this.info_password_confirmation = '';

			if( this.input_given_name == ''){
				this.form_open_door = false;
				this.info_given_name = '<span class="icon""></span> Your given name is required';
			}
			if( this.input_family_name == ''){
				this.form_open_door = false;
				this.info_family_name = '<span class="icon""></span> Your family name is required';
			}
			if( this.validator_service.email_test( this.input_email ) == false ){
				this.form_open_door = false;
				this.info_email = '<span class="icon""></span> Your email is incorrect';
			}
			if( this.input_email == ''){
				this.form_open_door = false;
				this.info_email = '<span class="icon""></span> Your email is required';
			}
			let pass_strengh = this.validator_service.password_test( this.input_password );
			if( pass_strengh == 'Average' || pass_strengh == "Poor" || pass_strengh == "Weak" ){
				this.form_open_door = false;
				this.info_password = this.info_password_confirmation ='<span class="icon""></span> Your password is not strong enough';
			}
			if( this.input_password != this.input_password_confirmation){
				this.form_open_door = false;
				this.info_password = '<span class="icon""></span> Your passwords does not match';
			}
			if( this.input_password == ''){
				this.form_open_door = false;
				this.info_password = '<span class="icon""></span> Your password is required';
			}
			if( this.input_password_confirmation == ''){
				this.form_open_door = false;
				this.info_password_confirmation = '<span class="icon""></span> The confirmation of your password is required';
			}

			if( this.form_open_door == true ){
				this.create_new_account();
			}else{
				this.button_class = 'button';
				this.button_text = 'Create my new account';
			}
		}
	}

	create_new_account(){
		let user = {
			given_name: this.input_given_name.charAt(0).toUpperCase() + this.input_given_name.slice(1).toLowerCase(),
			family_name: this.input_family_name.charAt(0).toUpperCase() + this.input_family_name.slice(1).toLowerCase(),
			email: this.input_email.toLowerCase(),
			password: this.input_password,
			avatar: {
				type: 'generated',
				gradient: this.gradient_color,
				initials: this.initials
			}
		}
		this.users_service.create_user( user )
			.then( user_detail => {
				console.log( user_detail );
				if(user_detail){
					this.send_verification_email( user.email, user_detail.user_id );
				}
			})
			.catch(error => {
				this.button_class = 'button';
				this.button_text = 'Create my new account';

				let error_content = JSON.parse(error._body);
				switch( error_content.code ){
					case 'email_duplicate' :
						this.info_email = error_content.message;
						break;
					default:
						console.log(error);
						break;
				}
			});
	}

	send_verification_email( email, user_id ){
		this.users_service.send_verfication_email( email )
			.then( is_email_send => {
				localStorage.setItem('user_id', user_id);
				this.button_class = 'button loading success';
				this.button_text = '<span class="icon"></span>';
				
				let timer = setTimeout(() => {  
					this.router.navigate(['dashboard']);
					clearTimeout(timer);
				}, 1500);
			})
			.catch(error => {
				this.button_class = 'button';
				this.button_text = 'Create my new account';
				console.log(error);
			});
	}

}
