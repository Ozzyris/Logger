import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { map } from 'rxjs/operators';
import { Ng2DeviceService } from 'ng2-device-detector';

//services
import { auth_service } from '../../services/auth/auth.service';
import { validator_service } from '../../services/validator/validator.service';
import { system_service } from '../../services/system/system.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [auth_service, system_service, validator_service]
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

	//user information
	user_information: any;

	constructor( private router:Router, private elementRef: ElementRef, private auth_service: auth_service, private system_service: system_service, private validator_service: validator_service, private deviceService: Ng2DeviceService ){
		Observable.fromEvent(elementRef.nativeElement, 'keyup')
			.map(() => this.input_email)
			.debounceTime( 600 )
			.distinctUntilChanged()
			.subscribe(email => {
				this.get_avatar( email );
			});
	}
	ngOnInit(){
		this.get_navigator_details();
	}

	get_navigator_details(){
		let device_info = this.deviceService.getDeviceInfo();
		this.user_information = {
			device_details: {
				ip: '',
				country: '',
				browser: device_info.browser,
				os: device_info.os,
				device: device_info.device
			}
		}

		this.system_service.get_device_info()
			.then(external_devices_details => {
				this.user_information.device_details.ip = external_devices_details.ip;
				this.user_information.device_details.country = external_devices_details.country_name;
			})
	}

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
		this.info_email = this.info_password = '';

		if( this.validator_service.email_test( this.input_email ) == false ){
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
			this.signin();
		}else{
			this.button_class = 'button';
			this.button_text = 'Login';
		}
	}

	signin(){
		this.user_information.email = this.input_email;
		this.user_information.password = this.input_password;
		this.user_information.stay_loggedin = this.input_stay_loggedin;

		this.auth_service.signin_with_credentials( this.user_information )
			.then( user_detail => {
				if( user_detail ){
					localStorage.setItem("session", user_detail.session);
					this.button_class = 'button loading success';
					this.button_text = '<span class="icon"></span>';
					let timer = setTimeout(() => {  
						this.router.navigate(['dashboard']);
						clearTimeout(timer);
					}, 1000);
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
