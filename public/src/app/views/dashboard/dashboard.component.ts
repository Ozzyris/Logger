import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

//services
import { users_service } from '../../services/users/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [users_service]
})

export class DashboardComponent implements OnInit {
	user: any = {
		id: '',
		given_name: '',
		family_name: '',
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

	constructor( private router: Router, private users_service: users_service ){}
	ngOnInit(){
		let user = JSON.parse(localStorage.getItem("user"));
		if(user.id){
			this.user.id = user.id;
			this.get_user_details( user.id );
		}
	}

	get_user_details( user_id ){
		this.users_service.get_user_details_from_id( user_id )
			.then( user_details => {
				this.user.given_name = user_details.given_name;
				this.user.family_name = user_details.family_name;
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

	logout(){
		this.users_service.logout()
			.then( is_logged_out => {
				this.router.navigate(['landing']);
			})
			.catch(error => {
				console.log(error);
			});
	}

	get_user_data( user_id ){
		this.user.id = user_id;
	}

	send_verification_email(){
		this.users_service.send_verfication_from_email( this.user.email )
			.then( is_email_send => {
				this.user.is_email_verified = true;
			})
			.catch(error => {
				console.log(error);
			});
	} 
}
