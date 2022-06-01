import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { DraggedElementType, IDragBetweenSectionsData, IItem, ISection } from './shared/types';

@Component({
  selector: 'form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {
  public selectedItem: IItem;
  public selectedItemChanged: Subject<IItem> = new Subject();
  public allSections: Array<ISection>;
  public itemToAddToOtherSection: IItem = null; // needs to be set to null
  public draggedElementType: DraggedElementType;

  private removeItemInfo: IDragBetweenSectionsData;
  private moveSectionInfo = { draggedSectionIndex: null, moveToSectionIndex: null };

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
  }

  public onDragSection(draggedIndex: number): void {
    this.moveSectionInfo.draggedSectionIndex = draggedIndex;
  }

  public onDragOver(event: DragEvent, moveToIndex: number): void {
    event.preventDefault();
    this.moveSectionInfo.moveToSectionIndex = moveToIndex;
  }

  public onDropSection(): void {
    if (this.moveSectionInfo.moveToSectionIndex < 0) this.moveSectionInfo.moveToSectionIndex = 0; // move to beginning of form

    const draggingDown: boolean = this.moveSectionInfo.draggedSectionIndex < this.moveSectionInfo.moveToSectionIndex;
    if (draggingDown) this.moveSectionInfo.moveToSectionIndex--;

    const sectionToMove = this.allSections[this.moveSectionInfo.draggedSectionIndex];
    this.allSections.splice(this.moveSectionInfo.draggedSectionIndex, 1);
    this.allSections.splice(this.moveSectionInfo.moveToSectionIndex, 0, sectionToMove);
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

    this.checkDeleteEmptyRows();
  }

  private checkDeleteEmptyRows(): void {
    this.allSections.forEach((section: ISection, sectionIndex: number) => {
      for (let i = 0; i < section.data.length; i++) {
        const row = section.data[i];

        for(let columns = Object.keys(row), j = 0, end = columns.length; j < end; j++) {
          const column = columns[j];
          const isLast = j === columns.length - 1;

          if (row[column].type !== DraggedElementType.none) break;
          if (isLast) {
            this.allSections[sectionIndex].data.splice(i, 1);
            this.allSections = JSON.parse(JSON.stringify(this.allSections)); // have to deep clone or it doesn't notice the change.
            this.checkDeleteEmptyRows();
          }
        };
      }
    })
  }

  private getIndexOfSection(sectionID: number): number {
    return this.allSections.findIndex((section: ISection) => section.settings.id === sectionID);
  }

  private setSectionData(): void {
    this.allSections = [
      {
        settings: { id: 150, title: 'Animals' }, 
        data: [
          { 'column0': { name: 'name-pup-count', type: DraggedElementType.number, value: 512 }, 'column1': { name: 'name-bird', type: DraggedElementType.text, value: 'bird' } }, // row 0
          { 'column0': { name: 'name-date-time', type: DraggedElementType.dateTime, value: { date: '2018-07-22', time: '13:30' } }, 'column1': { name: 'name-monkey', type: DraggedElementType.text, value: 'monkey' } }, // row 1
          { 'column0': { name: 'name-dog', type: DraggedElementType.multiSelect, value: [{ value: 'one', checked: false }, { value: 'two', checked: false }, { value: 'three', checked: false }] }, 'column1': { name: 'name-tiger', type: DraggedElementType.text, value: 'tiger' } }, // row 2
        ],
      },
      {
        settings: { id: 201, title: 'Colors' },
        data: [
          { 'column0': { name: 'blue label', type: DraggedElementType.text, value: 'blue' }, 'column1': { name: 'orange label', type: DraggedElementType.text, value: 'orange' } }, // row 0
          { 'column0': { name: 'red label', type: DraggedElementType.text, value: 'red' }, 'column1': { name: 'purple label', type: DraggedElementType.text, value: 'purple' } }, // row 1
          { 'column0': { name: 'yellow label', type: DraggedElementType.text, value: 'yellow' }, 'column1': { name: 'pink label', type: DraggedElementType.text, value: 'pink' } }, // row 2
        ]
      },
      {
        settings: { id: 985, title: 'Places' },
        data: [
          { 'column0': { name: 'nyc label', type: DraggedElementType.text, value: 'NYC' }, 'column1': { name: 'spain label', type: DraggedElementType.text, value: 'Spain' } }, // row 0
          { 'column0': { name: 'la label', type: DraggedElementType.text, value: 'Los Angeles' }, 'column1': { name: 'greece label', type: DraggedElementType.text, value: 'Greece' } }, // row 1
          { 'column0': { name: 'london label', type: DraggedElementType.text, value: 'London' }, 'column1': { name: 'banff label', type: DraggedElementType.text, value: 'Banff' } }, // row 2
        ]
      }
    ]
  }
}
