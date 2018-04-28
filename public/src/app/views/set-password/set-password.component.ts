import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { map } from 'rxjs/operators';

//services
import { auth_service } from '../../services/auth/auth.service';
import { validator_service } from '../../services/validator/validator.service';


@Component({
	selector: 'app-setpassword',
	templateUrl: './set-password.component.html',
	styleUrls: ['./set-password.component.scss'],
	providers: [auth_service, validator_service]
})

export class SetpasswordComponent implements OnInit {
	token: string;
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
	button_text: string = 'Update Password';
	button_class: string = 'button';

	//avatar
	gradient_style: any;
	initials: string = '';

	constructor( private route: ActivatedRoute, private elementRef: ElementRef, private auth_service: auth_service, private validator_service: validator_service ){
		Observable.fromEvent(elementRef.nativeElement, 'keyup')
			.map(() => this.input_password)
			.debounceTime( 600 )
			.distinctUntilChanged()
			.subscribe(input => {
				this.password_tester( input );
			});
	}
	ngOnInit(){
		this.route.params.subscribe( params => {
			this.get_avatar_from_token( params['token'] )
			this.token = params['token'];
		})
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

	get_avatar_from_token( token ){
		this.auth_service.get_avatar_from_token( token )
				.then( avatar => {
					if(avatar.type = 'generated'){
						this.gradient_style = {"background": 'linear-gradient(to right, #' + avatar.gradient[0] + ', #' + avatar.gradient[1] + ')'}
						this.initials = avatar.initials;
					}
				})
				.catch(error => {
					let error_content = JSON.parse(error._body);
					console.log( error_content.message);
				});
	}

	input_verification(){
		this.button_class = 'button loading';
		this.button_text = '<span class="icon rotate"></span>';
		this.info_password = this.info_password_confirmation = '';

		let open_door = true;
			
		let pass_strengh = this.validator_service.password_test( this.input_password );
		if( pass_strengh == 'Average' || pass_strengh == "Poor" || pass_strengh == "Weak" ){
			open_door = false;
			this.info_password = this.info_password_confirmation ='<span class="icon""></span> Your password is not strong enough';
		}
		if( this.input_password != this.input_password_confirmation){
			open_door = false;
			this.info_password = '<span class="icon""></span> Your passwords does not match';
		}
		if( this.input_password == ''){
			open_door = false;
			this.info_password = '<span class="icon""></span> Your password is required';
		}
		if( this.input_password_confirmation == ''){
			open_door = false;
			this.info_password_confirmation = '<span class="icon""></span> The confirmation of your password is required';
		}

		if( open_door == true ){
			this.set_password();
		}else{
			this.button_class = 'button';
			this.button_text = 'Update Password';
		}
	}

	set_password(){
		let password_details = {
			password: this.input_password,
			token: this.token
		}
		this.auth_service.set_password( password_details )
			.then( is_new_password_set => {
				console.log( is_new_password_set );
			})
			.catch(error => {
				this.button_class = 'button';
				this.button_text = 'Update Password';

				let error_content = JSON.parse(error._body);
				console.log(error_content);
			});
	}

}
