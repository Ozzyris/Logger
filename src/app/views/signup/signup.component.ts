import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {
	//inputs
	input_first_name: string = '';
	info_first_name: string = '';
	input_last_name: string = '';
	info_last_name: string = '';
	input_email: string = '';
	info_email: string = '';
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
	button_text: string = 'Create my new account';
	button_class: string = 'button';	

	constructor( private router:Router, private elementRef: ElementRef, private afAuth: AngularFireAuth, private afs: AngularFirestore ){
		Observable.fromEvent(elementRef.nativeElement, 'keyup')
			.map(() => this.input_password)
			.debounceTime( 600 )
			.distinctUntilChanged()
			.subscribe(input => this.password_tester( input ));

		Observable.fromEvent(elementRef.nativeElement, 'keyup')
			.map(() => this.input_email)
			.debounceTime( 600 )
			.distinctUntilChanged()
			.subscribe(input => this.email_tester( input ));			
	}
	ngOnInit(){}

	password_tester( password ){
		if( password ){
			switch( this.password_test( password ) ){
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
	password_test( password ){
		let greatRegex = new RegExp( "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})" ),
		goodRegex = new RegExp( "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})" ),
		averageRegex = new RegExp( "(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})" ),
		poorRegex = new RegExp( "(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})" );

		if (greatRegex.test( password )) {
			return "Great";
		} else if (goodRegex.test( password )) {
			return "Good";
		} else if (averageRegex.test( password )) {
			return "Average";
		} else if (poorRegex.test( password )) {
			return "Poor";
		} else {
			return "Weak";
		}
	}

	email_tester( email ){
		if( email ){
			this.info_email = '';
			if( this.email_test( email ) == false ) {
				this.info_email = '<span class="icon""></span> Your email is incorrect.';
			}
		}
	}

	email_test( email ){
		var emailRegex = new RegExp('^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$', 'i');
		if( emailRegex.test(email) ) {
			return true;
		} else {
			return false;
		}
	}

	input_verification(){
		this.button_class = 'button loading';
		this.button_text = '<span class="icon rotate"></span>';

		let open_door = true;
		this.info_first_name = this.info_last_name = this.info_email = this.info_password = this.info_password_confirmation = '';

		if( this.input_first_name == ''){
			open_door = false;
			this.info_first_name = '<span class="icon""></span> Your first name is required';
		}
		if( this.input_last_name == ''){
			open_door = false;
			this.info_last_name = '<span class="icon""></span> Your last name is required';
		}
		if( this.email_test( this.input_email ) == false ){
			open_door = false;
			this.info_email = '<span class="icon""></span> Your email is incorrect';
		}
		if( this.input_email == ''){
			open_door = false;
			this.info_email = '<span class="icon""></span> Your email is required';
		}
		let pass_strengh = this.password_test( this.input_password );
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
			this.create_new_account();
		}else{
			this.button_class = 'button';
			this.button_text = 'Create my new account';
		}
	}

	create_new_account(){
		this.afAuth.auth.createUserWithEmailAndPassword( this.input_email, this.input_password )
			.then((success) => {
				console.log( success );
				this.send_verification_email( success.uid );
				
			})
			.catch((error) => {
				this.button_class = 'button';
				this.button_text = 'Create my new account';
				this.info_email = '<span class="icon""></span> ' + error.message;
			});
	}

	send_verification_email( user_id ){
		this.afAuth.auth.currentUser.sendEmailVerification()
			.then((success) => {
				this.set_user_details( user_id );
			})
			.catch((error) => {
				//add error notification
				this.button_class = 'button';
				this.button_text = 'Create my new account';

				console.log(error);
			})
	}

	set_user_details( user_id ){
		this.afs.collection('users')
			.add({
				'id': user_id,
				'first_name': this.input_first_name,
				'last_name': this.input_last_name,
				'email': this.input_email
			})
			.then((success) => {
				this.input_first_name = this.input_last_name = this.input_email = this.input_password = this.input_password_confirmation ='';
				this.button_class = 'button loading success';
				this.button_text = '<span class="icon"></span>';
				let timer = setTimeout(() => {  
					this.router.navigate(['dashboard']);
					clearTimeout(timer);
				}, 1500);
			})
			.catch((error) => {
				//add error notification
				this.button_class = 'button';
				this.button_text = 'Create my new account';

				console.log(error);
			});
	}

}
