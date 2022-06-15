export interface IFormBuilderConfig {
  draggableElements?: IDraggableElementsConfig,
  showSectionSettingsPane?: boolean;
  showItemSettingsPane?: boolean;
}

export interface IDraggableElementsConfig {
  textTitle?: string;
  textIcon?: string;
  showText?: boolean;

  numberTitle?: string;
  numberIcon?: string;
  showNumber?: boolean;

  dateAndTimeTitle?: string;
  dateAndTimeIcon?: string;
  showDateAndTime?: boolean;

  multiSelectTitle?: string;
  multiSelectIcon?: string;
  showMultiSelect?: boolean;

  singleSelectTitle?: string;
  singleSelectIcon?: string;
  showSingleSelect?: boolean;

  mediaAndFilesTitle?: string;
  mediaAndFilesIcon?: string;
  showMediaAndFiles?: boolean;
}