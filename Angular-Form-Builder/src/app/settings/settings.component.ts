import { Component, EventEmitter, Input, Output } from "@angular/core";

import { IItem } from "../shared/types";

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  @Input() item: IItem;
  @Output() updatedItem = new EventEmitter<IItem>();

  public updateItem(): void {
    this.updatedItem.emit(this.item);
  }
}