import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Subject, Subscription } from 'rxjs';

import { IItemUpdatedFromSettingsInfo } from '../settings/settings.component';
import {
  DraggedElementType,
  INewRow,
  IRemoveItem,
  ISwitchInfo,
  IAddItem,
  IItem,
  ISectionSettings,
  IDragInfo,
  IDragBetweenSectionsData,
  ISectionData,
  ISection,
  FormItems } from '../shared/types';

@Component({
  selector: 'section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) table: MatTable<ISectionData>;
  @Input() section: ISection;
  @Input() typeOfDraggedElement: DraggedElementType;
  @Input() itemChangedFromSettings: Subject<IItemUpdatedFromSettingsInfo>;
  @Input() userDraggingSection: Subject<boolean>;
  @Input() itemMovedFromOtherSection: IItem = null; // needs to be set to null
  @Input() showDropZones: boolean;
  @Output() toggleDropZone = new EventEmitter<boolean>();
  @Output() dragBetweenSections = new EventEmitter<IDragBetweenSectionsData>();
  @Output() selectedItem = new EventEmitter<IItem>();
  @Output() removeFromSectionItemCameFrom = new EventEmitter<boolean>();

  public displayedColumns: string[] = ['column0', 'column1'];
  public sectionData: ISectionData[];
  public sectionSettings: ISectionSettings;

  private dragInfo: IDragInfo;
  private selectedItemLocation = { column: null, row: null };
  private subscriptions = new Subscription();

  public ngOnInit(): void {
    this.setupPage();
    this.setupSettingsListener();
    this.setupUserDraggingSectionListener();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public get draggedElementEnum() { return DraggedElementType };

  public onDrop(event: DragEvent, movingToRow: boolean, movingToEmptySpace?: boolean, movingToLeftOrRight?: boolean): void {
    if (!this.dragInfo.draggedItemIsSection) {
      this.toggleClass(event)
      this.toggleDropZone.emit(false);
      const movingItemFromThisSection = this.dragInfo.draggedItemColumn !== null && this.dragInfo.draggedItemColumn !== null;
      const movingFromDifferentSection = !movingItemFromThisSection && this.itemMovedFromOtherSection !== null;
      const addingColumnToFarLeftOrFarRight = !this.displayedColumns.includes('column'+this.dragInfo.moveToColumn);
      const movingItemFromThisSectionToNewColumn = !addingColumnToFarLeftOrFarRight && movingToLeftOrRight;
  
      if (addingColumnToFarLeftOrFarRight) {
        const addingToLeft = this.dragInfo.moveToColumn === -1;
        this.addColumn(addingToLeft, !addingToLeft);
      }
      else if (movingItemFromThisSectionToNewColumn) {
        this.addColumn(false, false, this.dragInfo.moveToColumn);
        this.dragInfo.draggedItemColumn++;
      }
  
      if (movingItemFromThisSection || movingItemFromThisSectionToNewColumn) this.moveExistingItem();
      else if (movingFromDifferentSection) this.addItemFromOtherSection(movingToEmptySpace);
      else this.addNewItem(movingToEmptySpace, movingToRow, addingColumnToFarLeftOrFarRight);
      this.resetDragInfo();
      this.checkDeleteEmptyRows();
      this.checkDeleteEmptyColumns();
    }
  }

  public onDragStart(event: DragEvent, columnIndex: number, rowIndex: number): void {
    if (event) {
      this.toggleDropZone.emit(true);
      this.dragInfo.draggedItemColumn = columnIndex;
      this.dragInfo.draggedItemRow = rowIndex;

      const dragBetweenSectionsData: IDragBetweenSectionsData = {
        draggedColumn: this.dragInfo.draggedItemColumn,
        draggedRow: this.dragInfo.draggedItemRow,
        fromSection: this.sectionSettings.id
      }

      this.dragBetweenSections.emit(dragBetweenSectionsData);
      this.dragInfo.draggedItemIsSection = false;
    }
  }

  public onDragEnd(): void {
    this.toggleDropZone.emit(false)
  }

  public toggleClass(event: any) {
    const hasClass = event.target.classList.contains('drop-zone-hover');

    if(hasClass) {
      event.target.classList.remove('drop-zone-hover');
    } else {
      event.target.classList.add('drop-zone-hover');
    }
  }

  public onDragOver(event: DragEvent, rowIndex: number, columnIndex: number) {
    event.preventDefault();
    this.dragInfo.moveToRow = rowIndex;
    this.dragInfo.moveToColumn = columnIndex;
  }

  public changeSelectSingleItem(selectItemIndex: number, item: IItem, column: number, row: number): void {
    (<FormItems.ISelectInput[]>this.sectionData[row]['column' + column].value).forEach((selectItem: FormItems.ISelectInput) => selectItem.checked = false);
    this.sectionData[row]['column' + column].value[selectItemIndex].checked = true;
    this.selectItem(item, column, row);
  }

  public onSelectMultimedia(file: File, item: IItem, column: number, row: number): void {
    item.value = file;
    this.selectItem(item, column, row);
  }

  public selectItem(item: IItem, column: number, row: number): void {
    this.selectedItemLocation.column = column;
    this.selectedItemLocation.row = row;
    this.selectedItem.emit(item);
  }

  public addItemToSelect(row: number, column: number): void {
    (<FormItems.ISelectInput[]>this.sectionData[row]['column'+column].value).push({ value: '', checked: false });
  }

  public removeSelectItem(row: number, column: number, selectItemIndex: number): void {
    (<FormItems.ISelectInput[]>this.sectionData[row]['column'+column].value).splice(selectItemIndex, 1);
  }

  public moveSelectedItemUp(row: number, column: number, movingFrom: number): void {
    const itemMoving = (<FormItems.ISelectInput[]>this.sectionData[row]['column'+column].value).splice(movingFrom, 1)[0];
    (<FormItems.ISelectInput[]>this.sectionData[row]['column'+column].value).splice(movingFrom - 1, 0, itemMoving);
  }

  public moveSelectedItemDown(row: number, column: number, movingFrom: number): void {
    const itemMoving = (<FormItems.ISelectInput[]>this.sectionData[row]['column'+column].value).splice(movingFrom, 1)[0];
    (<FormItems.ISelectInput[]>this.sectionData[row]['column'+column].value).splice(movingFrom + 1, 0, itemMoving);
  }

  public checkDropZoneHover(rowIndex: number, columnIndex: number): boolean {
    return this.dragInfo.moveToRow === rowIndex && this.dragInfo.moveToColumn === columnIndex
  }

  private removeItem(removeInfo: IRemoveItem): void {
    if (this.sectionSettings.id === removeInfo.sectionID) {
      this.sectionData[removeInfo.row]['column'+removeInfo.column] = { name: '', type: DraggedElementType.none, value: '' };
    }
  }

  private moveExistingItem(): void {
    const movingWithinColumn: boolean = this.dragInfo.draggedItemColumn === this.dragInfo.moveToColumn;
    const draggingDown: boolean = this.dragInfo.draggedItemRow < this.dragInfo.moveToRow;

    if (movingWithinColumn && draggingDown) this.dragInfo.moveToRow--;
    const moveItemToAfterLastRow = this.dragInfo.moveToRow === this.sectionData.length;
    const switchTwoItemsInSameColumn = this.dragInfo.draggedItemColumn === this.dragInfo.moveToColumn;
    const switchTwoItemsInSameRow = this.dragInfo.draggedItemRow === this.dragInfo.moveToRow;
    const movingToEmptySpace = this.sectionData[this.dragInfo.moveToRow] !== undefined && this.sectionData[this.dragInfo.moveToRow]['column'+this.dragInfo.moveToColumn].type === DraggedElementType.none;

    if (moveItemToAfterLastRow) {
      const dataToMove: IItem = this.sectionData[this.dragInfo.draggedItemRow]['column'+this.dragInfo.draggedItemColumn];
      const newRowInfo: INewRow = {
        totalColumns: this.displayedColumns.length,
        columnWithData: this.dragInfo.moveToColumn,
        columnData: dataToMove,
      }

      let removeInfo: IRemoveItem = {
        column: this.dragInfo.draggedItemColumn,
        row: this.dragInfo.draggedItemRow,
        sectionID: this.sectionSettings.id
      }

      this.addRow(newRowInfo, removeInfo);
    }
    else if (switchTwoItemsInSameColumn || switchTwoItemsInSameRow || movingToEmptySpace) {
      const switchItem1: ISwitchInfo = {
        column: this.dragInfo.moveToColumn,
        row: this.dragInfo.moveToRow
      }

      const switchItem2: ISwitchInfo = {
        column: this.dragInfo.draggedItemColumn,
        row: this.dragInfo.draggedItemRow,
      }

      this.switchTwoItems(switchItem1, switchItem2);
    }
    else {
      let removeInfo: IRemoveItem = {
        column: this.dragInfo.draggedItemColumn,
        row: this.dragInfo.draggedItemRow,
        sectionID: this.sectionSettings.id
      }

      let addInfo: IAddItem = {
        column: this.dragInfo.moveToColumn,
        row: this.dragInfo.moveToRow
      }

      this.moveBetweenColumns(removeInfo, addInfo);
    }
  }

  private addItemFromOtherSection(movingToEmptySpace: boolean): void {
    if (movingToEmptySpace) {
      this.sectionData[this.dragInfo.moveToRow]['column'+ this.dragInfo.moveToColumn] = this.itemMovedFromOtherSection;
    }
    else {
      let newRow: ISectionData = {};
      this.displayedColumns.forEach((column: string) => {
        newRow[column] = { type: DraggedElementType.none, value: '', name: '' }
      })

      newRow['column' + this.dragInfo.moveToColumn] = this.itemMovedFromOtherSection;
      this.sectionData.splice(this.dragInfo.moveToRow, 0, newRow);
    }

    this.removeFromSectionItemCameFrom.emit(true);
    this.itemMovedFromOtherSection = null; // reset
    this.table.renderRows();
  }

  private addNewItem(movingToEmptySpace: boolean, movingToNewRow: boolean, columnAlreadyAdded: boolean): void {
    let newItem: IItem;
    if (this.typeOfDraggedElement === DraggedElementType.text || this.typeOfDraggedElement === DraggedElementType.number || this.typeOfDraggedElement === DraggedElementType.multimedia) {
      newItem = { type: this.typeOfDraggedElement, value: '', name: '' }
    }
    else if (this.typeOfDraggedElement === DraggedElementType.dateTime) {
      newItem = { type: this.typeOfDraggedElement, value: { date: '', time: '' }, name: '' }
    }
    else if (this.typeOfDraggedElement === DraggedElementType.multiSelect || this.typeOfDraggedElement === DraggedElementType.singleSelect) {
      newItem = { type: this.typeOfDraggedElement, value: [], name: '' }
    }

    if (movingToEmptySpace) {
      this.sectionData[this.dragInfo.moveToRow]['column'+ this.dragInfo.moveToColumn] = newItem;
    }
    else if (movingToNewRow) {
      let newRow: ISectionData = {};
      this.displayedColumns.forEach((columnName: string) => {
        newRow[columnName] = { type: DraggedElementType.none, value: '', name: '' }
      })

      newRow['column' + this.dragInfo.moveToColumn] = newItem;
      this.sectionData.splice(this.dragInfo.moveToRow, 0, newRow);
    }
    else { // moving to new column in between other columns
      if (!columnAlreadyAdded) this.addColumn(false, false, this.dragInfo.moveToColumn);
      this.sectionData[this.dragInfo.moveToRow]['column'+this.dragInfo.moveToColumn] = newItem;
    }

    this.table.renderRows();
  }

  private addColumn(addingToFarLeft: boolean, addingToFarRight: boolean, insertNewAt?: number): void {
    if (insertNewAt) {
      let newColumnNumber: number;
      let newSectionData: ISectionData[] = [];
      for (let i = 0; i < this.sectionData.length; i++) {
        const newRow: ISectionData = {};

        Object.keys(this.sectionData[i]).forEach((column: string) => {
          const columnNumber = +column.substring(6);
          newColumnNumber = columnNumber + 1;
          if (columnNumber < insertNewAt) newRow[column] = this.sectionData[i][column];
          else if (columnNumber >= insertNewAt) newRow['column'+ newColumnNumber] = this.sectionData[i][column];
        })

        newRow['column'+insertNewAt] = { type: DraggedElementType.none, value: '', name: '' };
        newSectionData.push(newRow);
      }

      this.sectionData = JSON.parse(JSON.stringify(newSectionData));
      this.displayedColumns.push('column'+newColumnNumber);
    }
    else if (addingToFarLeft) {
      let newColumnNumber: number;
      let newSectionData: ISectionData[] = [];
      for (let i = 0; i < this.sectionData.length; i++) {
        const newRow: ISectionData = {};

        Object.keys(this.sectionData[i]).forEach((column: string) => {
          newColumnNumber = +column.substring(6) + 1;
          newRow['column'+newColumnNumber] = this.sectionData[i][column];
        })

        newRow['column0'] = { name: '', type: DraggedElementType.none, value: '' };
        newSectionData.push(newRow);
      }

      this.sectionData = JSON.parse(JSON.stringify(newSectionData));
      this.displayedColumns.push('column'+newColumnNumber);
      this.dragInfo.draggedItemColumn++;
      this.dragInfo.moveToColumn++;
    }
    else if (addingToFarRight) {
      const columnName: string = 'column' + this.dragInfo.moveToColumn;
      this.sectionData.forEach((row: ISectionData) => {
        row[columnName] = { name: '', type: DraggedElementType.none, value: '' };
      })

      this.displayedColumns.push(columnName);
    }

    this.table.renderRows();
  }

  // Used to switch two items that are either in the same column or in the same row.
  private switchTwoItems(item1Position: ISwitchInfo, item2Position: ISwitchInfo): void {
    const newItem1: IItem = this.sectionData[item2Position.row]['column'+item2Position.column];
    const newItem2: IItem = this.sectionData[item1Position.row]['column'+item1Position.column];

    this.sectionData[item1Position.row]['column'+item1Position.column] = newItem1;
    this.sectionData[item2Position.row]['column'+item2Position.column] = newItem2;
    this.table.renderRows();
  }

  private moveBetweenColumns(removeInfo: IRemoveItem, addInfo: IAddItem): void {
    let itemToMove: IItem;
    let itemReplacing: IItem = this.sectionData[removeInfo.row]['column'+removeInfo.column];
    this.removeItem(removeInfo);

    const changingColumn: string = 'column'+addInfo.column;
    for (let i = addInfo.row; i < this.sectionData.length; i++) {
      itemToMove = this.sectionData[i][changingColumn];
      this.sectionData[i][changingColumn] = itemReplacing;
      itemReplacing = itemToMove;
    }

    // move the last item in the column
    const newRowInfo: INewRow = {
      totalColumns: this.displayedColumns.length,
      columnWithData: addInfo.column,
      columnData: itemToMove
    }

    this.addRow(newRowInfo);
  }

  private addRow(newRowInfo: INewRow, removeInfo?: IRemoveItem): void {
    let row: ISectionData = {};
    for (let i = 0; i < newRowInfo.totalColumns; i++) {
      if (i === newRowInfo.columnWithData) row['column'+i] = newRowInfo.columnData;
      else row['column'+i] = { type: DraggedElementType.none, value: null, name: null };
    }

    this.sectionData.push(row);
    if (removeInfo) this.removeItem(removeInfo);
    this.table.renderRows();
  }

  private checkDeleteEmptyRows(): void {
    for (let i = 0; i < this.sectionData.length; i++) {
      const row: ISectionData = this.sectionData[i];

      for (let j = 0; j < this.displayedColumns.length; j++) {
        if (row['column'+j].type !== DraggedElementType.none) break;
        if (j === this.displayedColumns.length - 1) {
          this.sectionData.splice(i, 1);
          this.checkDeleteEmptyRows();
        }
      }
    }

    this.table.renderRows();
  }

  private checkDeleteEmptyColumns(): void {
    let columnsToKeep: string[] = [];

    for (let i = 0; i < this.displayedColumns.length; i++) {
      for (let j = 0; j < this.sectionData.length; j++) {
        const row = this.sectionData[j];
        if (row[this.displayedColumns[i]].type !== DraggedElementType.none) {
          columnsToKeep.push(this.displayedColumns[i]);
        }
      }
    }

    this.displayedColumns = [...new Set(columnsToKeep)];
    this.table.renderRows();
  }

  private updateItem(updatedItem: IItem): void {
    if (this.selectedItemLocation.row && this.selectedItemLocation.column) {
      this.sectionData[this.selectedItemLocation.row]['column'+this.selectedItemLocation.column] = updatedItem;
      this.table.renderRows();
    }
  }

  private setupPage(): void {
    this.resetDragInfo();
    this.sectionData = this.section.data;
    this.sectionSettings = this.section.settings;
  }

  private resetDragInfo(): void {
    this.dragInfo = {
      draggedItemColumn: null,
      draggedItemRow: null,
      moveToColumn: null,
      moveToRow: null,
      draggedItemIsSection: false
    }
  }

  private setupSettingsListener(): void {
    const settingsSub = this.itemChangedFromSettings.subscribe((updatedItemInfo: IItemUpdatedFromSettingsInfo) => {
      if (this.selectedItemLocation.column >= 0 && this.selectedItemLocation.row >= 0) {
        if (updatedItemInfo.isSingleSelect) {
          this.changeSelectSingleItem(updatedItemInfo.singleSelectIndex, updatedItemInfo.item, this.selectedItemLocation.column, this.selectedItemLocation.row);
          this.updateItem(updatedItemInfo.item);
        }
        else if (updatedItemInfo.isMultimedia) this.onSelectMultimedia(updatedItemInfo.file, updatedItemInfo.item, this.selectedItemLocation.column, this.selectedItemLocation.row)
        else this.updateItem(updatedItemInfo.item);
      }
    })

    this.subscriptions.add(settingsSub);
  }

  private setupUserDraggingSectionListener(): void {
    const draggingSectionSub = this.userDraggingSection.subscribe((isDraggingSection: boolean) => {
      this.dragInfo.draggedItemIsSection = isDraggingSection;
    })

    this.subscriptions.add(draggingSectionSub);
  }
}
