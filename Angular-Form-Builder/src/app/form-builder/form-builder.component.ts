import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { IItemUpdatedFromSettingsInfo } from './settings-panel/item-settings/item-settings.component';
import { DraggedElementType, IDragBetweenSectionsData, IItem, ISection, ISectionSettings } from './shared/types';

@Component({
  selector: 'form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {
  public selectedItem: IItem;
  public selectedSectionSettings: ISectionSettings;
  public selectedItemChanged: Subject<IItemUpdatedFromSettingsInfo> = new Subject();
  public userDraggingSection: Subject<boolean> = new Subject();
  public allSections: Array<ISection>;
  public itemToAddToOtherSection: IItem = null; // needs to be set to null
  public draggedElementType: DraggedElementType;
  public showItemDropZones: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public showSectionDropZones = false;

  private removeItemInfo: IDragBetweenSectionsData;
  private moveSectionInfo = { draggedSectionIndex: null, moveToSectionIndex: null };

  public ngOnInit(): void {
    this.setSectionData();
  }

  public get DraggedElementType() {
    return DraggedElementType;
  }

  public onSelectedItemChange(item: IItem): void {
    this.selectedItem = item;
    this.selectedSectionSettings = null;
  }

  public onUpdateSelectedItem(itemInfo: IItemUpdatedFromSettingsInfo): void {
    this.selectedItemChanged.next(itemInfo);
  }

  public onUpdateSelectedSection(updatedSectionSettings: ISectionSettings): void {
    const indexOfSection = this.getIndexOfSection(updatedSectionSettings.id);
    this.allSections[indexOfSection].settings = updatedSectionSettings;
    this.allSections = JSON.parse(JSON.stringify(this.allSections)); // have to deep clone or it doesn't notice the change.
  }

  public onDragNewItemStart(elementType: DraggedElementType): void {
    this.toggleDropZone(true);
    this.draggedElementType = elementType;
  }

  public onDragSection(draggedIndex: number): void {
    this.showSectionDropZones = true;
    this.moveSectionInfo.draggedSectionIndex = draggedIndex;
    this.userDraggingSection.next(true);
  }

  public onDragSectionEnd(): void {
    this.showSectionDropZones = false;
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

  public onSelectSection(sectionID: number, event: MouseEvent): void {
    // check that the user has clicked on the section and not on an item in the section.
    if (event.target === event.currentTarget) {
      this.selectedSectionSettings = this.allSections[sectionID].settings;
      this.selectedItem = null;
    }
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
        value: '',
        settings: { required: false }
      }
    }

    this.checkDeleteEmptyRows();
  }

  public toggleDropZone(showZone: boolean): void {
    this.showItemDropZones.next(showZone);
  }

  public toggleClass(event: any) {
    const hasClass = event.target.classList.contains('drop-zone-hover');

    if(hasClass) {
      event.target.classList.remove('drop-zone-hover');
    } else {
      event.target.classList.add('drop-zone-hover');
    }
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
          { 'column0': { name: 'name-pup-count', type: DraggedElementType.number, value: 512, settings: { required: true } }, 'column1': { name: 'name-bird', type: DraggedElementType.text, value: 'bird', settings: { required: true } } }, // row 0
          { 'column0': { name: 'name-date-time', type: DraggedElementType.dateTime, value: { date: '2018-07-22', time: '13:30' }, settings: { required: true } }, 'column1': { name: 'name-monkey', type: DraggedElementType.text, value: 'monkey', settings: { required: true } } }, // row 1
          { 'column0': { name: 'name-multiSelect', type: DraggedElementType.multiSelect, value: [{ value: 'one', checked: false }, { value: 'two', checked: false }, { value: 'three', checked: false }], settings: { required: true } }, 'column1': { name: 'name-singleSelect', type: DraggedElementType.singleSelect, value: [{ value: 'one', checked: false }, { value: 'two', checked: false }, { value: 'three', checked: false }], settings: { required: true } } }, // row 2
        ],
      },
      {
        settings: { id: 201, title: 'Colors' },
        data: [
          { 'column0': { name: 'blue label', type: DraggedElementType.text, value: 'blue', settings: { required: true } }, 'column1': { name: 'orange label', type: DraggedElementType.text, value: 'orange', settings: { required: true } } }, // row 0
          { 'column0': { name: 'red label', type: DraggedElementType.text, value: 'red', settings: { required: true } }, 'column1': { name: 'purple label', type: DraggedElementType.text, value: 'purple', settings: { required: true } } }, // row 1
          { 'column0': { name: 'yellow label', type: DraggedElementType.text, value: 'yellow', settings: { required: true } }, 'column1': { name: 'pink label', type: DraggedElementType.text, value: 'pink', settings: { required: true } } }, // row 2
        ]
      },
      {
        settings: { id: 985, title: 'Places' },
        data: [
          { 'column0': { name: 'nyc label', type: DraggedElementType.text, value: 'NYC', settings: { required: true } }, 'column1': { name: 'spain label', type: DraggedElementType.text, value: 'Spain', settings: { required: true } } }, // row 0
          { 'column0': { name: 'la label', type: DraggedElementType.text, value: 'Los Angeles', settings: { required: true } }, 'column1': { name: 'greece label', type: DraggedElementType.text, value: 'Greece', settings: { required: true } } }, // row 1
          { 'column0': { name: 'london label', type: DraggedElementType.text, value: 'London', settings: { required: true } }, 'column1': { name: 'banff label', type: DraggedElementType.text, value: 'Banff', settings: { required: true } } }, // row 2
        ]
      }
    ]
  }
}
