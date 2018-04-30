import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

//services
import { admin_service } from '../../services/admin/admin.service';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss'],
	providers: [admin_service]
})

export class AdminComponent implements OnInit {
	users: any;

	constructor( private admin_service: admin_service ){}
	ngOnInit(){
		this.get_users_summary();
	}

	get_users_summary(){
		this.admin_service.get_users_summary()
			.then( users_summary => {
				this.users = users_summary;
			})
			.catch(error => {
				console.log(error);
			});
	}

}
