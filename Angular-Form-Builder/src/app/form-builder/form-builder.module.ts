import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

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
    MatTableModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  exports: [FormBuilderComponent],
  providers: [],
})
export class FormBuilderModule { }
