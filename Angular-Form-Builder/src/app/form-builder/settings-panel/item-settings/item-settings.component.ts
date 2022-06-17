import { Component, EventEmitter, Input, Output } from "@angular/core";

import { IItemSettingsPaneConfig } from "../../shared/form-builder-config";
import { DraggedElementType, IItem } from "../../shared/types";

export interface IItemUpdatedFromSettingsInfo {
  item: IItem,
  isSingleSelect: boolean;
  singleSelectIndex: number;
  isMultimedia: boolean;
  file: File;
}

@Component({
  selector: 'item-settings',
  templateUrl: './item-settings.component.html',
  styleUrls: ['./item-settings.component.scss']
})
export class ItemSettingsComponent {
  @Input() item: IItem;
  @Input() config: IItemSettingsPaneConfig;
  @Output() updatedItem = new EventEmitter<IItemUpdatedFromSettingsInfo>();

  public get DraggedElementType() {
    return DraggedElementType;
  }
  
  public updateItem(): void {
    const itemUpdateInfo: IItemUpdatedFromSettingsInfo = {
      item: this.item,
      isSingleSelect: false,
      singleSelectIndex: null,
      isMultimedia: false,
      file: null
    }
    this.updatedItem.emit(itemUpdateInfo);
  }

  public updateSingleSelect(positionOfSingleSelectItem: number): void {
    const itemUpdateInfo: IItemUpdatedFromSettingsInfo = {
      item: this.item,
      isSingleSelect: true,
      singleSelectIndex: positionOfSingleSelectItem,
      isMultimedia: false,
      file: null
    }
    this.updatedItem.emit(itemUpdateInfo);
  }

  public updateMultimedia(file: File): void {
    const itemUpdateInfo: IItemUpdatedFromSettingsInfo = {
      item: this.item,
      isSingleSelect: false,
      singleSelectIndex: null,
      isMultimedia: true,
      file: file
    }
    this.updatedItem.emit(itemUpdateInfo);
  }
}