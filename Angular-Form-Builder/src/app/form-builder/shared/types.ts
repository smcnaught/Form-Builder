export interface IItem {
  name: string;
  type: DraggedElementType,
  value: FormItems.TextInput | FormItems.NumberInput |  FormItems.IDateTimeInput | FormItems.ISelectInput[] | FormItems.MultimediaInput;
}

export interface IRemoveItem {
  column: number;
  row: number;
  sectionID: number;
}

export interface IAddItem {
  column: number;
  row: number;
}

export interface INewRow {
  totalColumns: number;
  columnWithData: number;
  columnData: IItem;
}

export interface ISwitchInfo {
  column: number;
  row: number;
}

export interface IDragInfo {
  draggedItemIsSection: boolean;
  draggedItemColumn: number;
  draggedItemRow: number;
  moveToColumn: number;
  moveToRow: number;
}

export interface ISection {
  settings: ISectionSettings,
  data: ISectionData[]
}

export interface ISectionSettings {
  id: number;
  title: string;
}

export interface ISectionData {
  [column: string]: IItem 
}

export namespace FormItems {
  export type TextInput = string;
  export type NumberInput = number;
  export type MultimediaInput = File;

  export interface IDateTimeInput {
    date: string;
    time: string;
  }

  export interface ISelectInput {
    value: string;
    checked: boolean;
  }
}

export interface IDragBetweenSectionsData {
  draggedColumn: number;
  draggedRow: number;
  fromSection: number;
}


export enum DraggedElementType {
  none,
  text,
  number,
  dateTime,
  multiSelect,
  singleSelect,
  multimedia
}
