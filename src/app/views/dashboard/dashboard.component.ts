import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	user: any = {
		id: '',
		display_name: 'Anonymous',
		email: 'Anonymous',
		is_email_verified: true,
		phone_number: '',
		photo_url: ''
	};
	email_verification_message: string = '';

	constructor(private router: Router, private afAuth: AngularFireAuth){}
	ngOnInit(){
		this.get_user_data();
		if( this.user.is_email_verified ){
			this.write_alien_message();
		}
	}

	write_alien_message(){
		let array_of_possibility = ['👽', '👻', '🦁', '🐿', '🍕', '🌮'];
		let randomly_selected_icon = array_of_possibility[Math.floor(Math.random() * array_of_possibility.length)];
		this.email_verification_message = 'Verify your email and prove that you are not a ' + randomly_selected_icon;

	}

	logout(){
		this.afAuth.auth.signOut().then(function() {
			this.router.navigate[('landing')];
		}).catch(function(error) {
		  // notification manger here
		});
	}

	get_user_data(){
		this.afAuth.authState.subscribe( active_user=>{
			this.user = {
				id: active_user.uid,
				display_name: active_user.displayName,
				email: active_user.email,
				is_email_verified: active_user.emailVerified,
				phone_number: active_user.phoneNumber,
				photo_url: active_user.photoURL
			}

			console.log(this.user);
		})
	}

	send_another_email_verification(){
		this.afAuth.auth.currentUser.sendEmailVerification()
			.then((success) => {
				//success
				console.log('success', success);
			})
			.catch((error) => {
				//add error notification
				console.log('error', error);
			})
	} 
}
