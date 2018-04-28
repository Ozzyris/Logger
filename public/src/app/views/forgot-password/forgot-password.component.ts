import { Component, OnInit, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { map } from 'rxjs/operators';

//services
import { auth_service } from '../../services/auth/auth.service';
import { validator_service } from '../../services/validator/validator.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [auth_service, validator_service]
})

export class ForgotpasswordComponent implements OnInit {
	input_email: string = 'nemokervi@yahoo.fr';
	info_email: string = '';

	//primary cta
	button_text: string = 'Send recovery email';
	button_class: string = 'button';

	//avatar
	gradient_style: any;
	initials: string = '';

	constructor( private elementRef: ElementRef, private auth_service: auth_service, private validator_service: validator_service ){
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
			this.auth_service.get_avatar_from_email( email )
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

	input_verification(){
		this.button_class = 'button loading';
		this.button_text = '<span class="icon rotate"></span>';

		let open_door = true;
		this.info_email = '';

		if( this.validator_service.email_test( this.input_email ) == false ){
			open_door = false;
			this.info_email = '<span class="icon""></span> Your email is incorrect';
		}
		if( this.input_email == ''){
			open_door = false;
			this.info_email = '<span class="icon""></span> Your email is required';
		}

		if( open_door == true ){
			this.send_forgot_email();
		}{
			this.button_text = 'Send recovery email';
			this.button_class = 'button';
		}
	}

	send_forgot_email(){
		this.auth_service.send_forgot_password_from_email( this.input_email )
			.then( is_email_send => {
				this.button_class = 'button loading success';
				this.button_text = '<span class="icon"></span>';
				console.log(is_email_send);
			})
			.catch(error => {
				let error_content = JSON.parse(error._body);
				console.log( error_content );
				this.info_email = error_content.message;
				this.button_class = 'button';
				this.button_text = 'Send recovery email';
			});
	}
}
