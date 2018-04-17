import { TestBed, inject } from '@angular/core/testing';

import { users_service } from './users.service';

describe('Login.ServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ users_service ]
    });
  });

  it('should be created', inject([users_service], (service: users_service) => {
    expect(service).toBeTruthy();
  }));
});
