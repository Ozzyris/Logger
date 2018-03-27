import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

//https://gist.github.com/katowulf/6479129 
export interface User{
	id: string,
	given_name: string,
	family_name: string,
	email: string,
	avatar: {
		gradient: any,
		initials: string,
		type: string,
	},
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	//inputs
	input_email: string = '';
	info_email: string = '';
	input_password: string = '';
	info_password: string = '';

	//primary cta
	button_text: string = 'Login';
	button_class: string = 'button';

	//avatar
	gradient_style: any;
	initials: string = '';

	private UserCollection: AngularFirestoreCollection<User>;
	users: Observable<User[]>;

	constructor( private router:Router, private elementRef: ElementRef, private afAuth: AngularFireAuth, private afs: AngularFirestore ){
		Observable.fromEvent(elementRef.nativeElement, 'keyup')
			.map(() => this.input_email)
			.debounceTime( 600 )
			.distinctUntilChanged()
			.subscribe(input => {
				this.get_logo_information( input );
			});

			this.UserCollection = afs.collection<User>('users');
    		this.users = this.UserCollection.valueChanges();

    		console.log(this.users);
	}
	ngOnInit(){}

	get_logo_information( input ){
		console.log(input)
		let user = this.afs.collection('users', ref => ref.where('email', '==', input));
		console.log(user);
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
		this.info_email = this.info_password = '';

		if( this.email_test( this.input_email ) == false ){
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
			this.login();
		}else{
			this.button_class = 'button';
			this.button_text = 'Login';
		}
	}

	login(){
		this.afAuth.auth.signInWithEmailAndPassword( this.input_email, this.input_password )
			.then(value => {
				this.button_class = 'button loading success';
				this.button_text = '<span class="icon"></span>';
				let timer = setTimeout(() => {  
					this.router.navigate(['dashboard']);
					clearTimeout(timer);
				}, 1500);
			})
			.catch(err => {
				console.log('Something went wrong:', err.message);
				this.button_class = 'button';
				this.button_text = 'Login';
			});
	}
}
