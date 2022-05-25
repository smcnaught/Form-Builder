import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Subject, Subscription } from 'rxjs';

import { DraggedElementType, INewRow, IRemoveItem, ISwitchInfo, IAddItem, IItem, ISectionSettings, IDragInfo, IDragBetweenSectionsData, ISectionData, ISection } from '../shared/types';

@Component({
  selector: 'section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) table: MatTable<ISectionData>;
  @Input() section: ISection;
  @Input() typeOfDraggedElement: DraggedElementType;
  @Input() itemChangedFromSettings: Subject<IItem>;
  @Input() itemMovedFromOtherSection: IItem = null; // needs to be set to null
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
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public get draggedElementEnum() { return DraggedElementType };

  public onDrop(movingToExistingRow?: boolean): void {
    const movingItemFromThisSection = this.dragInfo.draggedItemColumn !== null && this.dragInfo.draggedItemColumn !== null;
    const movingFromDifferentSection = !movingItemFromThisSection && this.itemMovedFromOtherSection !== null;

    if (movingItemFromThisSection) this.moveExistingItem();
    else if (movingFromDifferentSection) this.addItemFromOtherSection(movingToExistingRow);
    else this.addNewItem(movingToExistingRow);
    this.resetDragInfo();
    this.checkDeleteEmptyRows(this.displayedColumns.length);
  }

  public onDragStart(event: DragEvent, columnIndex: number, rowIndex: number): void {
    if (event) {
      this.dragInfo.draggedItemColumn = columnIndex;
      this.dragInfo.draggedItemRow = rowIndex;

      const dragBetweenSectionsData: IDragBetweenSectionsData = {
        draggedColumn: this.dragInfo.draggedItemColumn,
        draggedRow: this.dragInfo.draggedItemRow,
        fromSection: this.sectionSettings.id
      }

      this.dragBetweenSections.emit(dragBetweenSectionsData);
    }
  }

  public onDragOver(event: DragEvent, rowIndex: number, columnIndex: number) {
    event.preventDefault();
    this.dragInfo.moveToRow = rowIndex;
    this.dragInfo.moveToColumn = columnIndex;
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
  }

  public selectItem(item: IItem, column: number, row: number): void {
    this.selectedItemLocation.column = column;
    this.selectedItemLocation.row = row;
    this.selectedItem.emit(item);
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

    // add new row
    if (this.dragInfo.moveToRow === this.sectionData.length) {
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
    else if (this.dragInfo.draggedItemColumn === this.dragInfo.moveToColumn) {
      const switchItem1: ISwitchInfo = {
        column: this.dragInfo.moveToColumn,
        row: this.dragInfo.moveToRow
      }

      const switchItem2: ISwitchInfo = {
        column: this.dragInfo.draggedItemColumn,
        row: this.dragInfo.draggedItemRow,
      }

      this.switchItemsInColumn(switchItem1, switchItem2);
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

  private addItemFromOtherSection(rowAlreadyExists: boolean): void {
    if (rowAlreadyExists) {
      this.sectionData[this.dragInfo.moveToRow]['column'+ this.dragInfo.moveToColumn] = this.itemMovedFromOtherSection;
    }
    else {
      let newRow = {};
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

  private addNewItem(rowAlreadyExists: boolean): void {
    let newItem: IItem;
    if (this.typeOfDraggedElement === DraggedElementType.text) {
      newItem = { type: this.typeOfDraggedElement, value: '', name: '' }
    }

    if (rowAlreadyExists) {
      this.sectionData[this.dragInfo.moveToRow]['column'+ this.dragInfo.moveToColumn] = newItem;
    }
    else {
      let newRow = {};
      this.displayedColumns.forEach((col) => {
        newRow[col] = { type: DraggedElementType.none, value: '', name: '' }
      })

      newRow['column' + this.dragInfo.moveToColumn] = newItem;
      this.sectionData.splice(this.dragInfo.moveToRow, 0, newRow);
    }

    this.table.renderRows();
  }

  private addColumn(columnID: number): void {
    const columnName: string = 'column' + columnID;
    this.sectionData.forEach((row) => {
      row[columnName] = { name: '', type: DraggedElementType.none, value: '' };
    })

    this.displayedColumns.push(columnName);
    this.table.renderRows();
  }

  private switchItemsInColumn(item1Position: ISwitchInfo, item2Position: ISwitchInfo): void {
    const newItem1 = this.sectionData[item2Position.row]['column'+item2Position.column];
    const newItem2 = this.sectionData[item1Position.row]['column'+item1Position.column];

    this.sectionData[item1Position.row]['column'+item1Position.column] = newItem1;
    this.sectionData[item2Position.row]['column'+item2Position.column] = newItem2;
    this.table.renderRows();
  }

  private moveBetweenColumns(removeInfo: IRemoveItem, addInfo: IAddItem): void {
    let itemToMove;
    let itemReplacing = this.sectionData[removeInfo.row]['column'+removeInfo.column];
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
    let row: any = {};
    for (let i = 0; i < newRowInfo.totalColumns; i++) {
      if (i === newRowInfo.columnWithData) row['column'+i] = newRowInfo.columnData;
      else row['column'+i] = { type: DraggedElementType.none, value: null };
    }

    this.sectionData.push(row);
    if (removeInfo) this.removeItem(removeInfo);
    this.table.renderRows();
  }

  private checkDeleteEmptyRows(columnCount: number): void {
    for (let i = 0; i < this.sectionData.length; i++) {
      const row = this.sectionData[i];

      for (let j = 0; j < columnCount; j++) {
        if (row['column'+j].type !== DraggedElementType.none) break;
        if (j === columnCount - 1) {
          this.sectionData.splice(i, 1);
          this.checkDeleteEmptyRows(this.displayedColumns.length);
        }
      }
    }

    this.table.renderRows();
  }

  private updateItem(updatedItem: IItem): void {
    this.sectionData[this.selectedItemLocation.column][this.selectedItemLocation.row] = updatedItem;
    this.table.renderRows();
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
    }
  }

  private setupSettingsListener(): void {
    const settingsSub = this.itemChangedFromSettings.subscribe((updatedItem: IItem) => {
      this.updateItem(updatedItem)
    })

    this.subscriptions.add(settingsSub);
  }
}
