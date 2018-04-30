import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class admin_service {
	private base_url = environment.api_url + 'admin/';

	constructor( private http: Http ){}

	// GENRAL
	get_session_from_storage(): Promise<any>{
		return new Promise((resolve, reject)=>{
			resolve( localStorage.getItem('session') );
		})
	}
	get_users_summary(): Promise<any>{
		return this.get_session_from_storage()
			.then(session => {
				let url = this.base_url + 'get-users-summary';
				let headers = new Headers({'Content-Type': 'application/json', 'X-Auth-Token': session });

				return this.http
					.get(url, {headers: headers})
					.toPromise()
			})
			.then(res => res.json());
	}

}
