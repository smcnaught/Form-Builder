import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';

import { SectionSettingsComponent } from './settings-panel/section-settings/section-settings.component';
import { ItemSettingsComponent } from './settings-panel/item-settings/item-settings.component';
import { FormBuilderComponent } from './form-builder.component';
import { SectionComponent } from './section/section.component';

@NgModule({
  declarations: [
    FormBuilderComponent,
    SectionComponent,
    ItemSettingsComponent,
    SectionSettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    FlexLayoutModule,
  ],
  exports: [FormBuilderComponent],
  providers: [],
})
export class FormBuilderModule { }
