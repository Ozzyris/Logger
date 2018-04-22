import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class users_service {
	private headers = new Headers({'Content-Type': 'application/json'});

	constructor( private http: Http ){}

	check_email( email ): Promise<any>{
		const url = environment.api_url + 'users/check-email/' + email;

		return this.http
			.get(url, {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}

	create_user( user ): Promise<any>{
		const url = environment.api_url + 'users/create-user';
		
		return this.http
			.put(url, JSON.stringify(user), {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}

	send_verfication_from_email( email ): Promise<any>{
		const url = environment.api_url + 'users/send-verfication-from-email/' + email;
		
		return this.http
			.get(url, {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}

	get_avatar_from_email( email ): Promise<any>{
		const url = environment.api_url + 'users/get-avatar-from-email/' + email;
		
		return this.http
			.get(url, {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}

	login_with_credentials( user_credential ): Promise<any>{
		const url = environment.api_url + 'users/login-with-credentials';
		
		return this.http
			.post(url, user_credential, {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}

	get_user_details_from_id( user_id ): Promise<any>{
		const url = environment.api_url + 'users/get-user-details-from-id/' + user_id;
		
		return this.http
			.get(url, {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}

	logout(): Promise<any>{
		const url = environment.api_url + 'users/logout-with-header';
		
		return this.http
			.get(url, {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}

	check_verification_email_token( token ): Promise<any>{
		const url = environment.api_url + 'users/check_verification_email_token/' + token;
		
		return this.http
			.get(url, {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}
}
