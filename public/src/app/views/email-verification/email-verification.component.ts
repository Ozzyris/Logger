import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

//services
import { users_service } from '../../services/users/users.service';

@Component({
	selector: 'app-email-verification',
	templateUrl: './email-verification.component.html',
	styleUrls: ['./email-verification.component.scss'],
  providers: [users_service]
})
export class EmailVerificationComponent implements OnInit {
	token: string;

	constructor( private route: ActivatedRoute, private users_service: users_service ){}
	ngOnInit(){
		this.route.params.subscribe( params =>
			this.users_service.check_verification_email_token( params['token'] )
				.then(response => {
					this.token = response.message;
				})
				.catch(error => {
					let error_content = JSON.parse(error._body);
					this.token = error_content.message;
				})
    	)
	}

}
