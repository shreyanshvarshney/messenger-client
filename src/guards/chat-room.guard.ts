import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { WebSocketService } from 'src/services/web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomGuard implements CanActivate {
  constructor(private webSocketService: WebSocketService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.webSocketService.getUserName()) {
      return true;
    }
    this.router.navigateByUrl('/');
    return false;
  }
  
}
