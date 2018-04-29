import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Rx';


//services
import { user_service } from './services/user/user.service';
import { auth_service } from './services/auth/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [user_service, auth_service]
})

export class AppComponent {
	user: any = {
		given_name: '',
		family_name: '',
		level: '',
		email: '',
		email_verification: {
			is_email_verified: true
		},
		avatar: {
			initials: '',
			gradient: '',
			type: ''
		}
	};

	gradient_style: any;
	signed_in_page: boolean = false;

	constructor( private router: Router, private user_service: user_service, private auth_service: auth_service ){
		this.router.events
			.subscribe(event => {
				if(event instanceof NavigationEnd){
					let url = event['url'];
					console.log(url);
					if(url){
						if( url != "/" && url.indexOf("signup") <= 0 && url.indexOf("landing") <= 0 && url.indexOf("login") <= 0 && url.indexOf("forgot-password") <= 0 && url.indexOf("set-password") <= 0 && url.indexOf("email-verification") <= 0 ){
							this.signed_in_page = true;
						}else{
							this.signed_in_page = false;
						}
					}
				}
			});
		
	}
	ngOnInit(){
		this.get_user_details();
	}

	get_user_details(){
		this.user_service.get_user_details()
			.then( user_details => {
				this.user.given_name = user_details.given_name;
				this.user.family_name = user_details.family_name;
				this.user.level = user_details.level;
				this.user.email = user_details.email;
				this.user.email_verification.is_email_verified = user_details.email_verification.is_email_verified;
				this.user.avatar.initials = user_details.avatar.initials;
				this.user.avatar.gradient = user_details.avatar.gradient;
				this.user.avatar.type = user_details.avatar.type;

				this.draw_avatar();
			})
			.catch(error => {
				console.log(error);
			});
	}

	draw_avatar(){
		if( this.user.avatar.type = 'generated' ){
			this.gradient_style = {"background": 'linear-gradient(to right, #' + this.user.avatar.gradient[0] + ', #' + this.user.avatar.gradient[1] + ')'}
		}
	}

	signout(){
		this.user_service.signout()
			.then( is_signed_out => {
				localStorage.removeItem('session');
				this.router.navigate(['landing']);
			})
			.catch(error => {
				console.log(error);
			});
	}

}
