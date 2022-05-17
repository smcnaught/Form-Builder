import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>; // TODO this type should be the same type as formData (without the array).
  
  public displayedColumns: string[] = ['column0', 'column1'];
  public formData: any[];

  private dragInfo = { draggedItemColumn: 0, draggedItemRow: 0, moveToColumn: 0, moveToRow: 0 };

  public ngOnInit(): void {
    this.formData = [
      { column0: 'text box', column1: 'multiple choice' }, // row 0
      { column0: 'checkboxes', column1: 'user input' }, // row 1
      { column0: 'picture of cat', column1: 'description' }, // row 2
    ]

  }

  public onDrop(event: any): void {
    const movingWithinColumn: boolean = this.dragInfo.draggedItemColumn === this.dragInfo.moveToColumn;
    const draggingDown: boolean = this.dragInfo.draggedItemRow < this.dragInfo.moveToRow;

    if (movingWithinColumn) {
      if (draggingDown) {
        this.dragInfo.moveToRow--;
      }
    }

    console.log(this.dragInfo.draggedItemColumn); // column it's coming from: 
    console.log(this.dragInfo.draggedItemRow); // what row it's coming from: 
    console.log(this.dragInfo.moveToColumn); // what column it's going to:
    console.log(this.dragInfo.moveToRow); // what row it's going to:



    if (this.dragInfo.moveToRow > this.displayedColumns.length) {
      // add new row
    }



    // LEAVING this here for reference, but can probably delete soon. It doesn't work for everything.
    // if (droppingOnRow) {
    //   const moveToIndex = Math.max(...[index1, index2]);
    //   event.preventDefault();
      
    //   // Add new item
    //   const itemToMove = this.formData.find((item: IDragItem) => item.id === this.dragInfo.draggedItemId);
    //   this.formData.splice(moveToIndex, 0, itemToMove as IDragItem);
  
    //   // remove old item
    //   this.formData = this.formData.filter((item: IDragItem, index: number) => item.id !== this.dragInfo.draggedItemId || index === moveToIndex);
  
    //   this.table.renderRows();
    // }
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

  private addColumn(columnID: number): void {
    const columnName: string = 'column' + columnID;
    this.formData.forEach((row) => {
      row[columnName] = null;
    })

    this.displayedColumns.push(columnName);
    this.table.renderRows();
  }
}
