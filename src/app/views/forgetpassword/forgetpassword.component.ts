import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss']
})
export class ForgetpasswordComponent implements OnInit {
	//inputs
	input_email: string = '';
	info_email: string = '';

	constructor( private afAuth: AngularFireAuth ){}
	ngOnInit(){}

	email_test( email ){
		var emailRegex = new RegExp('^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$', 'i');
		if( emailRegex.test(email) ) {
			return true;
		} else {
			return false;
		}
	}

	input_verification(){ console.log('ales');
		let open_door = true;
		this.info_email = '';

		if( this.email_test( this.input_email ) == false ){
			open_door = false;
			this.info_email = '<span class="icon""></span> Your email is incorrect';
		}
		if( this.input_email == ''){
			open_door = false;
			this.info_email = '<span class="icon""></span> Your email is required';
		}

		if( open_door == true ){
			this.send_forgot_email();
		}
	}

	send_forgot_email(){
		this.afAuth.auth.sendPasswordResetEmail( this.input_email )
			.then((success) => {
				console.log( success );
				// notification manger here
				this.input_email = '';
			})
			.catch((error) => {
				console.log( error );
				// notification manger here
				this.info_email = '<span class="icon""></span> ' + error.message;
			});
	}
}
