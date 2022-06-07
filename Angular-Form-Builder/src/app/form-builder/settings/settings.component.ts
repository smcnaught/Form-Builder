import { Component, EventEmitter, Input, Output } from "@angular/core";

import { DraggedElementType, IItem } from "../shared/types";

export interface IItemUpdatedFromSettingsInfo {
  item: IItem,
  isSingleSelect: boolean;
  singleSelectIndex: number;
}

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  @Input() item: IItem;
  @Output() updatedItem = new EventEmitter<IItemUpdatedFromSettingsInfo>();

  public get DraggedElementType() {
    return DraggedElementType;
  }
  
  public updateItem(isSingleSelect?: boolean, positionOfSingleSelectItem?: number): void {
    const itemUpdateInfo: IItemUpdatedFromSettingsInfo = {
      item: this.item,
      isSingleSelect: isSingleSelect === true,
      singleSelectIndex: positionOfSingleSelectItem
    }
    this.updatedItem.emit(itemUpdateInfo);
  }
}