import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser'

interface IRemoveItem {
  column: number;
  row: number;
}

interface IAddItem {
  column: number;
  row: number;
}

interface INewRow {
  totalColumns: number;
  columnWithData: number;
  columnData: string;
}

interface ISwitchInfo {
  column: number;
  row: number;
}

export enum DraggedElementType {
  text,
}

@Component({
  selector: 'section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>; // TODO this type should be the same type as formData (without the array).
  @Input() draggedElementType: DraggedElementType;
  
  public displayedColumns: string[] = ['column0', 'column1'];
  public formData: any[];

  private dragInfo = { draggedItemColumn: null, draggedItemRow: null, moveToColumn: null, moveToRow: null };
  private defaultElements = { text: null };

  constructor(private sanitizer: DomSanitizer) {}

  public ngOnInit(): void {
    this.formData = [
      { column0: 'text box', column1: 'multiple choice' }, // row 0
      { column0: 'checkboxes', column1: 'user input' }, // row 1
      { column0: 'picture of cat', column1: 'description' }, // row 2
    ]

    this.setDefaultElements();
  }

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

  private moveExistingItem(): void {
    const movingWithinColumn: boolean = this.dragInfo.draggedItemColumn === this.dragInfo.moveToColumn;
    const draggingDown: boolean = this.dragInfo.draggedItemRow < this.dragInfo.moveToRow;

    if (movingWithinColumn && draggingDown) this.dragInfo.moveToRow--;

    // add new row
    if (this.dragInfo.moveToRow === this.formData.length) {
      const dataToMove: string = this.formData[this.dragInfo.draggedItemRow]['column'+this.dragInfo.draggedItemColumn];
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
    if (this.draggedElementType === DraggedElementType.text) {
      newElement = this.defaultElements.text;
    }

    let newColumn = {};
    this.displayedColumns.forEach((col) => {
      newColumn[col] = null;
    })

    newColumn['column' + this.dragInfo.moveToColumn] = newElement;

    this.formData.splice(this.dragInfo.moveToRow, 0, newColumn);
    this.table.renderRows();
  }

  private addColumn(columnID: number): void {
    const columnName: string = 'column' + columnID;
    this.formData.forEach((row) => {
      row[columnName] = null;
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
      else row['column'+i] = null;
    }

    this.formData.push(row);
    if (removeInfo) this.removeData(removeInfo);
    this.table.renderRows();
  }

  private removeData(removeInfo: IRemoveItem): void {
    this.formData[removeInfo.row]['column'+removeInfo.column] = null;
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

  private setDefaultElements(): void {
    const placeholderText: string = "text";
    const inputField: string = `<input type='text' placeholder=${placeholderText} class='input-field' />`;
    this.defaultElements.text = this.sanitizer.bypassSecurityTrustHtml(inputField);
  }
}
