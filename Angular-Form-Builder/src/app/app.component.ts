import { Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';

interface IDragItem {
  id: number;
  columnZero: string;
  columnOne: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private formData: IDragItem[] = [
    { id: 0, columnZero: 'col0-0', columnOne: 'col1-0' },
    { id: 1, columnZero: 'col0-1', columnOne: 'col1-1' },
    { id: 2, columnZero: 'col0-2', columnOne: 'col1-2' },
    { id: 3, columnZero: 'col0-3', columnOne: 'col1-3' },
  ]

  public displayedColumns: string[] = ['columnZero', 'columnOne'];
  public displayedForm: IDragItem[] = this.formData;
  public dragDisabled = true;
  @ViewChild(MatTable) table: MatTable<IDragItem>;

  public onDrop(event: any, index1: number, index2: number, isRow: boolean): void {
    if (isRow) {
      const moveToIndex = Math.max(...[index1, index2]);
      event.preventDefault();
      const draggedItemId: number = +event.dataTransfer.getData('text');
      
      // Add new item
      const itemToMove = this.formData.find((item: IDragItem) => item.id === +draggedItemId);
      this.formData.splice(moveToIndex, 0, itemToMove as IDragItem);
  
      // remove old item
      this.formData = this.formData.filter((item: IDragItem, index: number) => item.id !== draggedItemId || index === moveToIndex);
  
      this.displayedForm = this.formData;
      this.table.renderRows();
    }
  }

  public onDragStart(event: DragEvent, item: IDragItem): void {
    if (event) {
      (<any>event)
        .dataTransfer
        .setData('text/plain', item.id);
  
      // (<any>event).currentTarget.style.backgroundColor = 'yellow';
    }
  }

  public onDragOver(event: any, draggedOverId: string) {
    event.preventDefault();
    // event.target.style.border = "10px solid blue"
  }

  public onDragLeave(event: any): void {
    event.preventDefault();
    // event.target.style.border = "none";
  }
}
