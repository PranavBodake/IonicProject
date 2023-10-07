import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  options: any[] = [];
  authService: any;
  router: any;

  constructor() { }

  ngOnInit() {
    this.options = [
      {id:1, name: 'Saved Addresses', img:'address.png'},
      {id:2, name: 'Refer a friend', icon:'share-social', color:'primary'},
      {id:3, name: 'Support', img:'life-guard.png'},
      {id:4, name: 'About', icon:'information'},
    ]
  }


  async onLogout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }


}
