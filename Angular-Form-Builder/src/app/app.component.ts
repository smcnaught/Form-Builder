import { Component } from '@angular/core';

import { DraggedElementType } from './section/section.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public draggedElementType: DraggedElementType;

  public get DraggedElementType() {
    return DraggedElementType;
  }

  public onDragStart(elementType: DraggedElementType): void {
    this.draggedElementType = elementType;
  }
}
