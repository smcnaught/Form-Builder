import { Component } from '@angular/core';
import { Subject } from 'rxjs';

import { DraggedElementType, IItem } from './shared/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public selectedItem: IItem;
  public selectedItemChanged: Subject<IItem> = new Subject();

  public onSelectedItemChange(item: IItem): void {
    this.selectedItem = item;
  }

  public onUpdateSelectedItem(item: IItem): void {
    this.selectedItemChanged.next(item);
  }

  public draggedElementType: DraggedElementType;

  public get DraggedElementType() {
    return DraggedElementType;
  }

  public onDragStart(elementType: DraggedElementType): void {
    this.draggedElementType = elementType;
  }
}
