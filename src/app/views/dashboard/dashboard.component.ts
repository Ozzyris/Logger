import { Component, OnInit } from '@angular/core';
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
	}

	constructor( private afAuth: AngularFireAuth){
		// this.afAuth.auth.currentUser.isEmailVerified()
		
	}
	ngOnInit(){
		this.get_user_data();
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
