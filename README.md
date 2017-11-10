# Smartsheet Picker AngularJS
An AngularJS directive that provides an expandable tree-view of a Smartsheet user's sheets, reports, workspaces and sights. 

![Smartsheet Picker Folder Tree](https://user-images.githubusercontent.com/4098/32123928-eca5352e-bb1a-11e7-8df8-56e2f527a16f.png)

The directive consumes the response from a [`GET /home`](https://smartsheet-platform.github.io/api-docs/#home) call from the [Smartsheet API](https://smartsheet-platform.github.io/api-docs/) and organizes it into a tree structure that is also searchable.


## Install
To install drop the `smartsheetPicker` directory into your project and be sure to include the following files in your html:

smartsheetPicker/
* dist/smartsheetPicker.module.js
* dist/smartsheetPicker.directive.js
* dist/smartsheetPicker.css


## Usage

            <smartsheet-picker
                on-sheet-select="vm.setSelectedSheet(selectedSheet)"
                tree-data="vm.treeData"
                selected-sheet= "vm.selectedSheet"
                include-sheets="true"
                include-reports="true"
                include-sights="false"></sheet-picker>

The directive provides several options for customization. Here's an explanation of each of the available parameters:
* **on-sheet-select:** this is the callback function that will be called when an item in the picker is selected
* **tree-data:** the json response from calling `GET /home` from the Smartsheet API
* **selected-sheet:** value of the selected sheet
* **include-sheets:** boolean value of whether sheets will be included in the picker 
* **include-reports:** boolean value of whether reports will be included in the picker 
* **include-sights:** boolean value of whether sights will be included in the picker 

## Compatibility
This was built and tested with AngularJS v. 1.6.5 and Bootstrap 3.3.7

