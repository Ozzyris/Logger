import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';


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
		photo_url: '',
		avatar: {
			initials: '',
			gradient: '',
			type: ''
		}
	};

	gradient_style: any = {"background": 'linear-gradient(to right, #' + 'd73828' + ', #' + 'e06a4d' + ')'};
	initials: string = 'AN';
	email_verification_message: string = '';

	constructor( private router: Router ){}
	ngOnInit(){
		// do not launch function on suscribe
		// this.afAuth.authState.subscribe( active_user=>{
		// 	if(active_user != null){
		// 		this.get_user_data( active_user.uid );

		// 		if( !active_user.emailVerified ){
		// 			this.write_email_message();
		// 		}
		// 	}else{
		// 		this.router.navigate(['landing']);
		// 	}
		// })
	}

	write_email_message(){
		let array_of_possibility = ['👽', '👻', '🦁', '🐿', '🍕', '🌮'];
		let randomly_selected_icon = array_of_possibility[Math.floor(Math.random() * array_of_possibility.length)];
		this.email_verification_message = 'Verify your email and prove that you are not a ' + randomly_selected_icon;
		this.user.is_email_verified = false;
	}

	logout(){
		// this.afAuth.auth.signOut().then(function() {
		// 	this.router.navigate(['landing']);
		// }).catch(function(error) {
		//   // notification manger here
		// });
	}

	get_user_data( user_id ){
		this.user.id = user_id;
	}

	send_another_email_verification(){
		// this.afAuth.auth.currentUser.sendEmailVerification()
		// 	.then((success) => {
		// 		//success
		// 		console.log('success', success);
		// 	})
		// 	.catch((error) => {
		// 		//add error notification
		// 		console.log('error', error);
		// 	})
	} 
}
