import { Component, ViewChild } from '@angular/core';
import { IonTabs, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class TabsPage {

  @ViewChild('tabs', {static: false}) tabs: IonTabs;
  selectedTab: any;

  constructor() { }

  ngOnInit() {
    console.log('Tabs Page OnInit');
  }

  setCurrentTab() {
    this.selectedTab = this.tabs.getSelected();
    console.log(this.selectedTab);
  }
  
}
