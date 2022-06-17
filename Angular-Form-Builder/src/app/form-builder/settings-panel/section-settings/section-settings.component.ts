import { Component, EventEmitter, Input, Output } from "@angular/core";

import { ISectionSettingsPaneConfig } from "../../shared/form-builder-config";
import { ISectionSettings } from "../../shared/types";

@Component({
  selector: 'section-settings',
  templateUrl: './section-settings.component.html',
  styleUrls: ['./section-settings.component.scss']
})
export class SectionSettingsComponent {
  @Input() sectionSettings: ISectionSettings;
  @Input() config: ISectionSettingsPaneConfig;
  @Output() updatedSection = new EventEmitter<ISectionSettings>();

  public updateSectionSettings(): void {
    this.updatedSection.emit(this.sectionSettings);
  }
}