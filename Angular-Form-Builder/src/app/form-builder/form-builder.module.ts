import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

import { FormBuilderComponent } from './form-builder.component';
import { SectionComponent } from './section/section.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    FormBuilderComponent,
    SectionComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    MatTableModule
  ],
  exports: [FormBuilderComponent],
  providers: [],
})
export class FormBuilderModule { }
