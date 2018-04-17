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

	send_verfication_email( email ): Promise<any>{
		const url = environment.api_url + 'users/send_verfication_email/' + email;
		
		return this.http
			.get(url, {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}

	get_avatar_from_email( email ): Promise<any>{
		const url = environment.api_url + 'users/get-avatar/' + email;
		
		return this.http
			.get(url, {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}

	loginl( user_credential ): Promise<any>{
		const url = environment.api_url + 'users/login';
		
		return this.http
			.post(url, user_credential, {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}
}
