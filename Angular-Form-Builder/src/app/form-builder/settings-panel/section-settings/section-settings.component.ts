import { Component, EventEmitter, Input, Output } from "@angular/core";

import { ISectionSettings } from "../../shared/types";

@Component({
  selector: 'section-settings',
  templateUrl: './section-settings.component.html',
  styleUrls: ['./section-settings.component.scss']
})
export class SectionSettingsComponent {
  @Input() sectionSettings: ISectionSettings;
  @Output() updatedSection = new EventEmitter<ISectionSettings>();

  public updateSectionSettings(): void {
    this.updatedSection.emit(this.sectionSettings);
  }
}