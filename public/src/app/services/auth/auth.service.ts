import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/toPromise';


@Injectable()

export class auth_service {
	private base_url = environment.api_url + 'auth/';
	private headers = new Headers({'Content-Type': 'application/json'});

	constructor( private http: Http ){}

	// GENRAL
	get_session_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			resolve( localStorage.getItem('session') );
		})
	}
	check_email( email ): Promise<any>{
		let url = this.base_url + 'check-email/' + email;

		return this.http
			.get(url, {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}
	get_avatar_from_email( email ): Promise<any>{
		let url = this.base_url + 'get-avatar-from-email/' + email;
		
		return this.http
			.get(url, {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}
	get_avatar_from_token( token ): Promise<any>{
		let url = this.base_url + 'get-avatar-from-token/' + token;
		
		return this.http
			.get(url, {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}

	// SIGN UP
	signup_with_credentials( user ): Promise<any>{
		let url = this.base_url + 'signup-with-credentials';
		
		return this.http
			.put(url, JSON.stringify(user), {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}

	// SIGN IN
	signin_with_credentials( user_credential ): Promise<any>{
		let url = this.base_url + 'signin-with-credentials';
		
		return this.http
			.post(url, user_credential, {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}

	// VERIFY EMAIL
	send_verification_email(): Promise<any>{
		return this.get_session_from_storage()
			.then(session => {
				let url = this.base_url + 'send-verification-email';
				let token_headers = new Headers({'Content-Type': 'application/json', 'X-Auth-Token': session });

				return this.http
					.get(url, {headers: token_headers})
					.toPromise()
			})
			.then(res => res.json());
	}
	check_verification_email_token( token ): Promise<any>{
		let url = this.base_url + 'check-verification-email-token/' + token;
		
		return this.http
			.get(url, {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}

	// FORGOT PASSWORD
	send_forgot_password_from_email( email ): Promise<any>{
		let url = this.base_url + 'send-forgot-password-from-email/' + email;
		
		return this.http
			.get(url, {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}
	set_password( password_details ): Promise<any>{
		let url = this.base_url + 'set-password';
		
		return this.http
			.post(url, password_details, {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}

}
