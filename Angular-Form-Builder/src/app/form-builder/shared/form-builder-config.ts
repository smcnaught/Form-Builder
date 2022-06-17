export interface IFormBuilderConfig {
  draggableElements?: IDraggableElementsConfig;

  showSectionSettingsPane?: boolean;
  sectionSettingsPane?: ISectionSettingsPaneConfig;

  showItemSettingsPane?: boolean;
  itemSettingsPane?: IItemSettingsPaneConfig;
}

export interface IDraggableElementsConfig {
  textLabel?: string;
  textIcon?: string;
  showText?: boolean;

  numberLabel?: string;
  numberIcon?: string;
  showNumber?: boolean;

  dateAndTimeLabel?: string;
  dateAndTimeIcon?: string;
  showDateAndTime?: boolean;

  multiSelectLabel?: string;
  multiSelectIcon?: string;
  showMultiSelect?: boolean;

  singleSelectLabel?: string;
  singleSelectIcon?: string;
  showSingleSelect?: boolean;

  mediaAndFilesLabel?: string;
  mediaAndFilesIcon?: string;
  showMediaAndFiles?: boolean;
}

export interface ISectionSettingsPaneConfig {
  heading?: string;
  sectionTitleLabel?: string;
  sectionTitlePlaceholder?: string;
}

export interface IItemSettingsPaneConfig {
  heading?: string;
  itemNameLabel?: string;
  itemNamePlaceholder?: string;
  itemRequiredLabel?: string;
  itemValueLabel?: string;
  itemValuePlaceholder?: string;
  dateLabel?: string;
  timeLabel?: string;
  multiSelectLabel?: string;
  multiSelectPlaceholder?: string;
  singleSelectLabel?: string;
  singleSelectPlaceholder?: string;
  fileLabel?: string;
  chooseFileButtonText?: string;
}