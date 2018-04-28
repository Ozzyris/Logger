import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

//services
import { user_service } from '../../services/user/user.service';
import { auth_service } from '../../services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [user_service, auth_service]
})

export class DashboardComponent implements OnInit {
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
	email_verification_message: string = '';

	constructor( private router: Router, private user_service: user_service, private auth_service: auth_service ){}
	ngOnInit(){
		this.get_user_details();
	}

	get_user_details(){
		this.user_service.get_user_details()
			.then( user_details => {
				console.log(user_details);
				this.user.given_name = user_details.given_name;
				this.user.family_name = user_details.family_name;
				this.user.level = user_details.level;
				this.user.email = user_details.email;
				this.user.email_verification.is_email_verified = user_details.email_verification.is_email_verified;
				this.user.avatar.initials = user_details.avatar.initials;
				this.user.avatar.gradient = user_details.avatar.gradient;
				this.user.avatar.type = user_details.avatar.type;

				this.draw_avatar();
				this.write_email_message();
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

	write_email_message(){
		if( !this.user.is_email_verified ){
			let array_of_possibility = ['👽', '👻', '🦁', '🐿', '🍕', '🌮'];
			let randomly_selected_icon = array_of_possibility[Math.floor(Math.random() * array_of_possibility.length)];
			this.email_verification_message = 'Verify your email and prove that you are not a ' + randomly_selected_icon;
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

	send_verification_email(){
		this.auth_service.send_verification_email()
			.then( is_email_send => {
				this.user.is_email_verified = true;
			})
			.catch(error => {
				console.log(error);
			});
	} 
}
