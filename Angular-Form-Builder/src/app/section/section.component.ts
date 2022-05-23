import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Subject, Subscription } from 'rxjs';

import { DraggedElementType, INewRow, IRemoveItem, ISwitchInfo, IAddItem, IItem } from '../shared/types';

@Component({
  selector: 'section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) table: MatTable<any>; // TODO this type should be the same type as formData (without the array).
  @Input() typeOfDraggedElement: DraggedElementType;
  @Input() itemChangedFromSettings: Subject<IItem>;
  @Output() selectedItem = new EventEmitter<IItem>();
  
  public displayedColumns: string[] = ['column0', 'column1'];
  public formData: { [key: string]: IItem }[];

  private dragInfo = { draggedItemColumn: null, draggedItemRow: null, moveToColumn: null, moveToRow: null };
  private selectedItemLocation = { column: null, row: null };
  private subscriptions = new Subscription();

  public ngOnInit(): void {
    this.formData = [
      { 'column0': { name: 'name-pup', type: DraggedElementType.text, value: 'pup' }, 'column1': { name: 'name-bird', type: DraggedElementType.text, value: 'bird' } }, // row 0
      { 'column0': { name: 'name-cat', type: DraggedElementType.text, value: 'cat' }, 'column1': { name: 'name-monkey', type: DraggedElementType.text, value: 'monkey' } }, // row 1
      { 'column0': { name: 'name-dog', type: DraggedElementType.text, value: 'dog' }, 'column1': { name: 'name-tiger', type: DraggedElementType.text, value: 'tiger' } }, // row 2
    ]

    this.setupSettingsListener();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public get draggedElementEnum() { return DraggedElementType };

  public onDrop(): void {
    const movingExistingItem = this.dragInfo.draggedItemColumn !== null && this.dragInfo.draggedItemColumn !== null;
    if (movingExistingItem) this.moveExistingItem();
    else this.addNewItem();
  }

  public onDragStart(event: DragEvent, columnIndex: number, rowIndex: number): void {
    if (event) {
      this.dragInfo.draggedItemColumn = columnIndex;
      this.dragInfo.draggedItemRow = rowIndex;
    }
  }

  public onDragOver(event: any, rowIndex: number, columnIndex: number) {
    event.preventDefault();
    this.dragInfo.moveToRow = rowIndex;
    this.dragInfo.moveToColumn = columnIndex;
  }

  public onDragLeave(event: any): void {
    event.preventDefault();
  }

  public selectItem(item: IItem, column: number, row: number): void {
    this.selectedItemLocation.column = column;
    this.selectedItemLocation.row = row;
    this.selectedItem.emit(item);
  }

  private moveExistingItem(): void {
    const movingWithinColumn: boolean = this.dragInfo.draggedItemColumn === this.dragInfo.moveToColumn;
    const draggingDown: boolean = this.dragInfo.draggedItemRow < this.dragInfo.moveToRow;

    if (movingWithinColumn && draggingDown) this.dragInfo.moveToRow--;

    // add new row
    if (this.dragInfo.moveToRow === this.formData.length) {
      const dataToMove: IItem = this.formData[this.dragInfo.draggedItemRow]['column'+this.dragInfo.draggedItemColumn];
      const newRowInfo: INewRow = {
        totalColumns: this.displayedColumns.length,
        columnWithData: this.dragInfo.moveToColumn,
        columnData: dataToMove,
      }
      
      let removeInfo: IRemoveItem = {
        column: this.dragInfo.draggedItemColumn,
        row: this.dragInfo.draggedItemRow,
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
      }

      let addInfo: IAddItem = {
        column: this.dragInfo.moveToColumn,
        row: this.dragInfo.moveToRow
      }

      this.moveBetweenColumns(removeInfo, addInfo);
    }

    this.checkDeleteEmptyRows(this.displayedColumns.length);
  }

  private addNewItem(): void {
    let newElement;
    if (this.typeOfDraggedElement === DraggedElementType.text) {
      newElement = { type: this.typeOfDraggedElement, value: 'placeholder' }
    }

    let newRow = {};
    this.displayedColumns.forEach((col) => {
      newRow[col] = { type: DraggedElementType.none, value: null }
    })

    newRow['column' + this.dragInfo.moveToColumn] = newElement;

    this.formData.splice(this.dragInfo.moveToRow, 0, newRow);
    this.table.renderRows();
  }

  private addColumn(columnID: number): void {
    const columnName: string = 'column' + columnID;
    this.formData.forEach((row) => {
      row[columnName] = { name: '', type: DraggedElementType.none, value: '' };
    })

    this.displayedColumns.push(columnName);
    this.table.renderRows();
  }

  private switchItemsInColumn(item1Position: ISwitchInfo, item2Position: ISwitchInfo): void {
    const newItem1 = this.formData[item2Position.row]['column'+item2Position.column];
    const newItem2 = this.formData[item1Position.row]['column'+item1Position.column];

    this.formData[item1Position.row]['column'+item1Position.column] = newItem1;
    this.formData[item2Position.row]['column'+item2Position.column] = newItem2;
    this.table.renderRows();
  }

  private moveBetweenColumns(removeInfo: IRemoveItem, addInfo: IAddItem): void {
    let itemToMove;
    let itemReplacing = this.formData[removeInfo.row]['column'+removeInfo.column];
    this.removeData(removeInfo);
    
    const changingColumn: string = 'column'+addInfo.column;
    for (let i = addInfo.row; i < this.formData.length; i++) {
      itemToMove = this.formData[i][changingColumn];
      this.formData[i][changingColumn] = itemReplacing;      
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

    this.formData.push(row);
    if (removeInfo) this.removeData(removeInfo);
    this.table.renderRows();
  }

  private removeData(removeInfo: IRemoveItem): void {
    this.formData[removeInfo.row]['column'+removeInfo.column] = { name: '', type: DraggedElementType.none, value: null };
  }

  private checkDeleteEmptyRows(columnCount: number): void {
    for (let i = 0; i < this.formData.length; i++) {
      const row = this.formData[i];

      for (let j = 0; j < columnCount; j++) {
        if (row['column'+j]) break;
        if (j === columnCount - 1) {
          this.formData.splice(i, 1);
        }
      }
    }

    this.table.renderRows();
  }

  private setupSettingsListener(): void {
    const settingsSub = this.itemChangedFromSettings.subscribe((updatedItem: IItem) => {
      this.updateItem(updatedItem)
    })

    this.subscriptions.add(settingsSub);
  }

  private updateItem(updatedItem: IItem): void {
    this.formData[this.selectedItemLocation.column][this.selectedItemLocation.row] = updatedItem;
    this.table.renderRows();
  }
}
