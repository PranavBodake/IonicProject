import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    {title: 'Home', url: '/home', icon: 'home'},
    {title: 'Pickup-Call', url: '/pickup-call', icon: 'call'},
    {title: 'My-pickup-calls', url: '/pickup-calls', icon: 'list'},
  ];
  constructor() {}
}
