import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private rolesUpdated = new Subject<void>();
  rolesUpdated$ = this.rolesUpdated.asObservable();

  notifyRolesUpdated() {
    this.rolesUpdated.next();
  }
}
