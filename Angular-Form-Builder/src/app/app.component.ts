import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { DraggedElementType, IDragBetweenSectionsData, IItem, ISection } from './shared/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedItem: IItem;
  public selectedItemChanged: Subject<IItem> = new Subject();
  public allSections: Array<ISection>;
  public itemToAddToOtherSection: IItem;
  public draggedElementType: DraggedElementType;

  private removeItemInfo: IDragBetweenSectionsData;

  public ngOnInit(): void {
    this.setSectionData();
  }

  public onSelectedItemChange(item: IItem): void {
    this.selectedItem = item;
  }

  public onUpdateSelectedItem(item: IItem): void {
    this.selectedItemChanged.next(item);
  }

  public get DraggedElementType() {
    return DraggedElementType;
  }

  public onDragNewItemStart(elementType: DraggedElementType): void {
    this.draggedElementType = elementType;
    this.itemToAddToOtherSection = null;
  }

  public setDataForDragBetweenSections(dragInfo: IDragBetweenSectionsData): void {
    // add item to different section
    const sectionIndex = this.getIndexOfSection(dragInfo.fromSection);
    this.itemToAddToOtherSection = this.allSections[sectionIndex].data[dragInfo.draggedRow]['column'+dragInfo.draggedColumn];
    
    // set remove info to be used when the user drops an item into a different section (in removeItem method).
    this.removeItemInfo = dragInfo;
  }

  public removeItem(remove: boolean): void {
    if (remove) {
      const sectionIndex = this.getIndexOfSection(this.removeItemInfo.fromSection);
      this.allSections[sectionIndex].data[this.removeItemInfo.draggedRow]['column'+this.removeItemInfo.draggedColumn] = {
        name: '',
        type: DraggedElementType.none,
        value: ''
      }
    }
  }

  private getIndexOfSection(sectionID: number): number {
    return this.allSections.findIndex((section: ISection) => section.settings.id === sectionID);
  }

  private setSectionData(): void {
    this.allSections = [
      {
        settings: { id: 0, title: 'Animals' }, 
        data: [
          { 'column0': { name: 'name-pup', type: DraggedElementType.text, value: 'pup' }, 'column1': { name: 'name-bird', type: DraggedElementType.text, value: 'bird' } }, // row 0
          { 'column0': { name: 'name-cat', type: DraggedElementType.text, value: 'cat' }, 'column1': { name: 'name-monkey', type: DraggedElementType.text, value: 'monkey' } }, // row 1
          { 'column0': { name: 'name-dog', type: DraggedElementType.text, value: 'dog' }, 'column1': { name: 'name-tiger', type: DraggedElementType.text, value: 'tiger' } }, // row 2
        ],
      },
      {
        settings: { id: 1, title: 'Colors' },
        data: [
          { 'column0': { name: 'blue label', type: DraggedElementType.text, value: 'blue' }, 'column1': { name: 'orange label', type: DraggedElementType.text, value: 'orange' } }, // row 0
          { 'column0': { name: 'red label', type: DraggedElementType.text, value: 'red' }, 'column1': { name: 'purple label', type: DraggedElementType.text, value: 'purple' } }, // row 1
          { 'column0': { name: 'yellow label', type: DraggedElementType.text, value: 'yellow' }, 'column1': { name: 'pink label', type: DraggedElementType.text, value: 'pink' } }, // row 2
        ]
      }
    ]
  }
}
