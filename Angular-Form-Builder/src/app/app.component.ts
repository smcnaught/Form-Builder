import { Component, OnInit } from '@angular/core';

import { IFormBuilderConfig } from './form-builder/shared/form-builder-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public customConfig: IFormBuilderConfig;

  public ngOnInit(): void {
    // set form builder config in your own project if you want custom settings.
    // this.customConfig = {
      // draggableElements: {
      //   textTitle: 'Set In App Component',
      // },
      // showSectionSettingsPane: false,
      // showItemSettingsPane: true,
      // itemSettingsPane: {
      //   heading: 'Title Set in App Component'
      // },
    // }
  }
}
