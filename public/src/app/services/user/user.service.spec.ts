import { TestBed, inject } from '@angular/core/testing';

import { user_service } from './user.service';

describe('Login.ServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ user_service ]
    });
  });

  it('should be created', inject([user_service], (service: user_service) => {
    expect(service).toBeTruthy();
  }));
});
