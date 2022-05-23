export interface IItem {
  name: string;
  type: DraggedElementType,
  value: string;
}

export interface IRemoveItem {
  column: number;
  row: number;
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

export enum DraggedElementType {
  none,
  text,
}