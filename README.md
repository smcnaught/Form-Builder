# Angular Form Builder
This form builder was built to allow the user to customize and build their own forms. It allows you to drag and drop
form elements within a section, drag in new elements to a section and even re-arrange the sections themselves. 

## Custom Configuration
### Setting up Custom Configuration
To make this form builder your own, set the configuration settings in ngOnInit and pass them to the form builder via the template: 
```html
<form-builder [config]="customConfig"></form-builder>
```
All the config properties are optional, but here is a complete example of how to use all the options: 
```ts
 public customConfig: IFormBuilderConfig;

 public ngOnInit(): void {
  this.customConfig: IFormBuilderConfig = {
    draggableElements: {
      textTitle: 'Text',
      textIcon: 'abc',
      showText: true,

      numberTitle: 'Number',
      numberIcon: '123',
      showNumber: true,

      dateAndTimeTitle: 'Date & Time',
      dateAndTimeIcon: 'today',
      showDateAndTime: true,

      multiSelectTitle: 'Multi Select',
      multiSelectIcon: 'list',
      showMultiSelect: true,

      singleSelectTitle: 'Single Select',
      singleSelectIcon: 'list',
      showSingleSelect: true,

      mediaAndFilesTitle: 'Media & Files',
      mediaAndFilesIcon: 'photo_camera',
      showMediaAndFiles: true,
    },
    showSectionSettingsPane: true,
    sectionSettingsPane: {
      heading: 'SECTION SETTINGS:',
      sectionTitleLabel: 'Section Title:',
      sectionTitlePlaceholder: 'Section Title'
    },
    showItemSettingsPane: true,
    itemSettingsPane: {
      heading: 'ITEM SETTINGS:',
      itemNameLabel: 'Item Name:',
      itemNamePlaceholder: 'Item Name',
      itemRequiredLabel: 'Item Required:',
      itemValueLabel: 'Item Value:',
      itemValuePlaceholder: 'Item Value',
      dateLabel: 'Date:',
      timeLabel: 'Time:',
      multiSelectLabel: 'Options:',
      multiSelectPlaceholder: 'Enter Option',
      singleSelectLabel: 'Options:',
      singleSelectPlaceholder: 'Enter Option',
      fileLabel: 'File:',
      chooseFileButtonText: 'Choose File',
    }
  }
 }
```


### Configuration Options

## Top Level Config Settings: 
| Input         | Type          | Default       | Required      | Description   |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| draggableElements | [IDraggableElementsConfig](#IDraggableElementsConfig) | See IDraggableElementsConfig below. | no | Configure new draggable elements. |
| showSectionSettingsPane  | `boolean` | `true` | no | Whether to show the section settings pane. |
| sectionSettingsPane | [ISectionSettingsPaneConfig](#ISectionSettingsPaneConfig) | See ISectionSettingsPaneConfig below. | no | Configure the section settings pane. |
| showItemSettingsPane | `boolean` | `true` | no | Whether to show the item settings pane. |
| itemSettingsPane | [IItemSettingsPaneConfig](#IItemSettingsPaneConfig) | See IItemSettingsPaneConfig below. | no | Configure the item settings pane. |


## <a name="IDraggableElementsConfig"></a>IDraggableElementsConfig Settings: 
| Input         | Type          | Default       | Required      | Description   |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| textLabel | `string` | `Text` | no | The draggable text button label. |
| textIcon | `string` | `abc` | no | The draggable text button icon. |
| showText | `boolean` | true | no | Whether `text` inputs can be added to your form. |
| numberLabel | `string` | `Number` | no | The draggable number button label. |
| numberIcon | `string` | `123` | no | The draggable number button icon. |
| showNumber | `boolean` | true | no | Whether `number` inputs can be added to your form. |
| dateAndTimeLabel | `string` | `Date & Time` | no | The draggable date and time button label. |
| dateAndTimeIcon | `string` | `today` | no | The draggable date and time button icon. |
| showDateAndTime | `boolean` | true | no | Whether `date and time` inputs can be added to your form. |
| multiSelectLabel | `string` | `Multi Select` | no | The draggable multiselect button label. |
| multiSelectIcon | `string` | `list` | no | The draggable multiselect button icon. |
| showMultiSelect | `boolean` | true | no | Whether `multiselect` inputs can be added to your form. |
| singleSelectLabel | `string` | `Single Select` | no | The draggable single select button label. |
| singleSelectIcon | `string` | `list` | no | The draggable single select button icon. |
| showSingleSelect | `boolean` | true | no | Whether `single select` inputs can be added to your form. |
| mediaAndFilesLabel | `string` | `Media & Files` | no | The draggable media and files button label. |
| mediaAndFilesIcon | `string` | `photo_camera` | no | The draggable media and files button icon. |
| showMediaAndFiles | `boolean` | true | no | Whether `media and files` inputs can be added to your form. |


## <a name="ISectionSettingsPaneConfig"></a>ISectionSettingsPaneConfig Settings: 
| Input         | Type          | Default       | Required      | Description   |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| heading | `string` | `SECTION SETTINGS:` | no | The section settings pane main heading. |
| sectionTitleLabel | `string` | `Section Title:` | no | The section title label text. |
| sectionTitlePlaceholder | `string` | `Section Title` | no | The section title placeholder text. | 


## <a name="IItemSettingsPaneConfig"></a>IItemSettingsPaneConfig Settings: 
| Input         | Type          | Default       | Required      | Description   |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| heading | `string` | `ITEM SETTINGS:` | no | The item settings pane main heading.|
| itemNameLabel | `string` | `Item Name:` | no | The item name label text. |
| itemNamePlaceholder | `string` | `Item Name` | no | The item name placeholder text. |
| itemRequiredLabel | `string` | `Item Required:` | no | The item required label text. |
| itemValueLabel | `string` | `Item Value:` | no | The item value label text. |
| itemValuePlaceholder | `string` | `Item Value` | no | The item value placeholder text. |
| dateLabel | `string` | `Date:` | no | The date label text. |
| timeLabel | `string` | `Time:` | no | The time label text. |
| multiSelectLabel | `string` | `Options:` | no | The multiselect label text. |
| multiSelectPlaceholder | `string` | `Enter Option` | no | The multiselect placeholder text. |
| singleSelectLabel | `string` | `Options:` | no | The single select label text.|
| singleSelectPlaceholder | `string` | `Enter Option` | no | The single select placeholder text. |
| fileLabel | `string` | `File:` | no | The file label text. |
| chooseFileButtonText | `string` | `Choose File` | no | The upload file button text. |