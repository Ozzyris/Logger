import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

//services
import { auth_service } from '../../services/auth/auth.service';

@Component({
	selector: 'app-email-verification',
	templateUrl: './email-verification.component.html',
	styleUrls: ['./email-verification.component.scss'],
  providers: [auth_service]
})
export class EmailVerificationComponent implements OnInit {
	token: string;

	constructor( private route: ActivatedRoute, private auth_service: auth_service ){}
	ngOnInit(){
		this.route.params.subscribe( params =>
			this.auth_service.check_verification_email_token( params['token'] )
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
