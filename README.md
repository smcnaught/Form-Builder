# Angular Form Builder
This form builder was built to allow the user to customize and build their own forms. It allows you to drag and drop
form elements within a section, drag in new elements to a section and even re-arrange the sections themselves. 

## Custom Configuration
### Setting up Custom Configuration
To make this form builder your own, set the configuration settings in ngOnInit and pass them to the form builder via the template: 
```html
<form-builder [config]="customConfig"></form-builder>
```

```ts
 public customConfig: IFormBuilderConfig;
 public ngOnInit(): void {
  this.customConfig = {
    // ...whatever settings you want changed, i.e:
    showItemSettingsPane: false,
  }
 }
```

### Configuration Settings (IFormBuilderConfig)
The complete IFormBuilderConfig looks like this: 
```ts
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
```

The `draggableElements` property contains settings for each of the new elements the user can add to the page. 
<!-- [Draggable Elements](./../draggable-elements.jpg) -->
![Draggable Elements](./../draggable-elements.jpg?raw=true "Draggable Elements")


The `showSectionSettingsPane` determines whether the section settings pane displays when the user clicks on a section.
The `showItemSettingsPane` determines whether the item settings pane displays when the user clicks on an item within the form.