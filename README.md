
# Welcome to Autocomplete 

A brief description of this Autocomplete component


## Installation

```bash
  git clone https://github.com/DanielJames0302/Autocomplete.git
  cd Autocomplete
  npm run start
```




    
## Props
Props of Autocomplete commponent

| Name           | Type(s)       | Default   | Description                                                                                                                                              |
|----------------|---------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| description    | string        |           | The description to display below the component.                                                                                                          |
| disabled       | boolean       | false     | If true, the component is disabled, i.e. it cannot be interacted with.                                                                                    |
| filterOptions  | function      |           | A function to determine the filtered options to be rendered on search. If provided, this will override the default built-in filtering of the component.   |                  |
| label          | string        |           | The label to display above the component.                                                                                                                 |
| loading        | boolean       | false     | If true, the component will be in a loading state. This should show a spinner.                                                                            |
| multiple       | boolean       | false     | If true, then value must be an array and the multiple selections should be supported.                                                                     |
| onChange       | function      |           | The callback that is fired when the value changes.                                                                                                        |
| onInputChange  | function      |           | The callback that is fired when the input value changes.                                                                                                  |
| options*       | Array<T>      |           | Array of options to be displayed and selected. Note: T can be either a string or an object.                                                               |
| placeholder    | string        |           | The placeholder search input text.                                                                                                                        |
| renderOption   | function      |           | Customises the rendered option display.                                                                                                                   |
| value          | Array<T>, T   |           | The selected value (if any) of the autocomplete.                                                                                                          |


**filterOptions**

 Signature:   
 ```function(options: any[], inputValue: string) => any[]```
 - ```options``` : the options to render.
 - ```inputValue```: the current value of the input.


**onChange**

 Signature:   
 ```function(newValues: any[]) => void```
 - ```newValues``` : new options selected .


**onInputChange**

 Signature:   
 ```function(event: React.ChangeEvent<HTMLInputElement>) => void```

**renderOption**

 Signature:   
 ```function(option: any, highlightOption: number, index: number) => React.ReactNode```
 - ```option``` : the option to render .
 - ```highlightOption```: the option to be highlighted.
 - ```index```: the index of the ```option``` in the rendered list.

## Component Usage

With this component, you are be able to implement two following use-cases:
- Synchronous autocomplete with single and multiple option(s) selection.
- Debounced search, i.e. filtering of displayed options only occurs after typing has ceased for a specified amount of time.

