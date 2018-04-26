import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class system_service {
	private headers = new Headers({'Content-Type': 'application/json'});

	constructor( private http: Http ){}

	get_device_info(): Promise<any>{
		const url = 'https://ipapi.co/json/';

		return this.http
			.get(url, {headers: this.headers})
			.toPromise()
			.then(res => res.json());
	}

}
