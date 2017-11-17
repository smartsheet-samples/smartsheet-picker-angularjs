(function() {
    'use strict';
    angular
        .module('smartsheetPicker')
        .directive('smartsheetPicker', [ smartsheetPicker ]);

    function smartsheetPicker() {
        return {
            restrict: 'E',
            scope: {
                onSheetSelect: "&",
                treeData: "=",
                selectedSheet: "=",
                onLoadComplete : "&",
                includeSheets: "@",
                includeReports: "@",
                includeSights: "@"
            },
            template: '<div class="smartsheetPicker" style="margin: 25px;"><div uib-dropdown auto-close="outsideClick" uib-keyboard-nav="true" is-open="vm.pickerVisible">' +
                    '<div uib-dropdown-menu class="sheetPickerMenu" style="width:100%">'+
                    '<input type="text" ng-model="vm.searchText" placeholder="Search" class="form-control" id="searchSheets" />' +
                    '<div class="sheetPicker" ng-click="vm.handleTreeClick($event)" id="sheetPicker">' +
                    '<img src="data:image/gif;base64,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"></div></div></div>' +
                    '</div>',            
            controller: ['$scope', smartsheetPickerController],
            controllerAs: 'vm',
            bindToController: true
        };

        function smartsheetPickerController($scope) {
            var vm = this;
            vm.pickerVisible = false;
            vm.closePicker = closePicker;
            vm.CONTAINER = {
                FOLDER: 'FOLDER',
                WORKSPACE: 'WORKSPACE',
                SHEET: 'SHEET',
                REPORT: 'REPORT',
                REPORTS: 'REPORTS',
                FAVORITES: 'FAVORITES',
                SIGHTS: 'SIGHTS',
                SIGHT: 'SIGHT'
            };
            vm.selectedSheet = {
                sheet: null
            };
            vm.formattedTree = []; 
            vm.treeElements = []; // When rendering, we keep a list of all of the elements as they are rendered so we can refer to them by an index. This can change every single time the tree is rendered.
            vm.selectedTreeElementIndex = null; // When we select an element in the tree, this is the index into the treeElements array. It is also used to create the id on the HTML element so we can select it later

            vm.lastRenderedSearchTerm = null;
            vm.searchTerm = '';
            vm.searchRegex = null;
            vm.searchTermReplaceRegex = null;
            vm.searchTimeout = null;
            vm.searchTimeoutDelay = 100; // This is modified below. See comments there.

            // Set up a watch on the search text control so we can re-render the tree based upon what the user is searching for
            $scope.$watch('vm.searchText', function (newValue, oldValue) {
                this.searchTerm = newValue ? newValue : '';

                if (this.searchTimeout) {
                    window.clearTimeout(this.searchTimeout);
                    this.searchTimeout = null;
                }

                if (vm.treeData != null) {
                    this.searchTimeout = setTimeout(function () {
                        this.searchTimeout = null;
                        this.renderTree();
                    }.bind(this), this.searchTimeoutDelay);
                }
            }.bind(this));

            $scope.$watch('vm.treeData', function (newValue, oldValue) {
                if (newValue !== undefined) {
                    this.formatTreeData();
                    this.renderTree();                    
                }   
            }.bind(this));

            function closePicker() {
                vm.pickerVisible = false;
            }

            /**
             * This single event handler is on the root div that contains the entire tree.
             * By having a single event handler, the rendering of even extremely large trees is sped up considerably.
             */
            this.handleTreeClick = function (event) {
                var nodeElement = event.srcElement;
                if (!nodeElement) {
                    nodeElement = event.target; // For Firefox
                }

                // Walk the DOM up until we find the li element that has the ID of the node being clicked
                while (nodeElement) {
                    if (nodeElement.id && nodeElement.id.indexOf('node-') == 0) {
                        if (nodeElement.className === 'open') {
                            nodeElement.className = 'closed';
                        } else if (nodeElement.className === 'closed') {
                            nodeElement.className = 'open';
                        } else {
                            var selectedDOMNode = document.getElementById('node-' + vm.selectedTreeElementIndex);
                            if (selectedDOMNode != null) {
                                selectedDOMNode.className = '';
                            }

                            nodeElement.className = 'selected';

                            var nodeId = nodeElement.id.substring(5) * 1;
                            vm.selectedSheet.sheet = this.treeElements[nodeId];
                            vm.selectedTreeElementIndex = nodeId;
                            // make callback to parent with selectedSheet
                            vm.onSheetSelect({selectedSheet:this.selectedSheet});

                            closePicker();
                        }
                        break;
                    }
                    nodeElement = nodeElement.parentElement;
                }
            };
            this.getSelectedSheet = function () {
                return this.selectedSheet;
            };
            /**
             * Opens the tree up to an arbitrary tree element index.
             * Note this is the index of the element in the rendered tree and really isn't usable by an outside component
             */
            this.openTree = function (treeElementIndex) {
                var domNode = document.getElementById('node-' + treeElementIndex);
                if (domNode != null) {
                    var treeElement = this.treeElements[treeElementIndex];
                    if (!elementIsContainer(treeElement)) {
                        domNode = domNode.parentNode.parentNode; // Walk up the dom 2 steps to find the first container
                    }

                    while (domNode != null) {
                        domNode.className = 'open';

                        // Walk up the dom two steps at a time opening all of the parent nodes until we reach the root
                        domNode = domNode.parentNode;
                        if (domNode != null) {
                            domNode = domNode.parentNode;
                            if (domNode != null && domNode.tagName.toLowerCase() === 'div') {
                                break;// Break when we find the div that contains the entire tree
                            }
                        }
                    }
                }
            };
            vm.formatTreeData = function () {
                vm.formattedTree = {
                    "id": null,
                    "folders": [
                        {
                            "id": null,
                            "name": "Favorites",
                            "permalink": null,
                            "type": vm.CONTAINER.FAVORITES,
                            "sheets": [],
                            "reports": [],
                            "sights": [] 
                        }
                    ]
                };
                if (vm.includeSheets === 'true') {
                    var sheetFolder = {
                        "id": null,
                        "name": "Sheets",
                        "permalink": null,
                        "type": vm.CONTAINER.FOLDER,
                        "sheets": vm.treeData.folders.map(function(folder) { 
                            folder.type = vm.CONTAINER.FOLDER; 
                            return folder 
                        })
                    };
                    sheetFolder.sheets = sheetFolder.sheets.concat(vm.treeData.sheets);
                    vm.formattedTree.folders.push(sheetFolder);
                }
                // keeping objects in the order that is expected. workspaces would come after sheets
                var workspaceFolder = {
                    "id":null,
                    "name": "Workspaces",
                    "type": vm.CONTAINER.WORKSPACE,
                    "workspaces": vm.treeData.workspaces 
                };
                vm.formattedTree.folders.push(workspaceFolder);

                if (vm.includeReports === 'true') {
                    var reportsFolder = {
                        "id": null,
                        "name": "Reports",
                        "type": vm.CONTAINER.REPORTS,
                        "reports": vm.treeData.reports
                    };
                    vm.formattedTree.folders.push(reportsFolder);
                }
                if (vm.includeSights === 'true') {
                    this.sightsFolder = {
                        "id": null,
                        "name": "Sights",
                        "type": vm.CONTAINER.SIGHTS,
                        "sights": []
                    };
                    
                    this.extractSightsFromList = function(sights) {
                        sights = sights.map(sight => {
                            sight.type = vm.CONTAINER.SIGHT;
                            return sight;
                        });
                        this.sightsFolder.sights = this.sightsFolder.sights.concat(sights);
                    }
                    this.extractSightsFromFolders = function(folders) {
                        for (var i = 0; i < folders.length; i++) {
                            var folder = folders[i];
                            if (folder.sights) {
                                this.sightsFolder.sights = this.sightsFolder.sights.concat(folder.sights);
                            }
                            if (folder.folders) {
                                this.extractSightsFromFolders(folder.folders);
                            }
                        }
                    }
                    this.extractSights = function() {
                        if (vm.treeData.sights) {
                            this.extractSightsFromList(vm.treeData.sights);
                        }
                        if (vm.treeData.folders) {
                            this.extractSightsFromFolders(vm.treeData.folders)
                        }
                        if (vm.treeData.workspaces) {
                            for (var i = 0; i < vm.treeData.workspaces.length; i++) {
                                var workspace = vm.treeData.workspaces[i];
                                if (workspace.sights) {
                                    this.extractSightsFromList(workspace.sights);
                                }
                                if (workspace.folders) {
                                    this.extractSightsFromFolders(workspace.folders);
                                }
                            }
                        }
                    }    
                    this.extractSights();
                    vm.formattedTree.folders.push(this.sightsFolder);
                }
                /*
                 *  FAVORITES
                 */
                this.extractFavoriteSheetsFromList = function(sheets) {
                    return sheets.filter(function (sheet) {
                        return sheet.favorite;
                    });
                }
                this.extractFavoriteSheetsFromFolders = function(folders) {
                    var favSheets = [];
                    for (var i = 0; i < folders.length; i++) {
                        var folder = folders[i];
                        if (folder.sheets) {
                            favSheets = favSheets.concat(this.extractFavoriteSheetsFromList(folder.sheets));
                        }
                        if (folder.folders) {
                            favSheets = favSheets.concat(this.extractFavoriteSheetsFromFolders(folder.folders));
                        }
                    }
                    return favSheets;
                }
                this.extractFavoriteSheets = function() {
                    var favSheets = this.extractFavoriteSheetsFromList(vm.treeData.sheets);
                    if (vm.treeData.folders) {
                        favSheets = favSheets.concat(this.extractFavoriteSheetsFromFolders(vm.treeData.folders));
                    }
                    return favSheets;
                }
    
                this.extractFavoriteReportsFromList = function(reports) {
                    return reports.filter(function (report) {
                        return report.favorite;
                    });
                }
                this.extractFavoriteReportsFromFolders = function(folders) {
                    var favReports = [];
                    for (var i = 0; i < folders.length; i++) {
                        var folder = folders[i];
                        if (folder.reports) {
                            favReports = favReports.concat(this.extractFavoriteReportsFromList(folder.reports));
                        }
                        if (folder.folders) {
                            favReports = favReports.concat(this.extractFavoriteReportsFromFolders(folder.folders));
                        }
                    }
                    return favReports;
                }
                this.extractFavoriteReports = function() {
                    var favReports = this.extractFavoriteReportsFromList(vm.treeData.reports);
                    if (vm.treeData.folders) {
                        favReports = favReports.concat(this.extractFavoriteReportsFromFolders(vm.treeData.folders));
                    }
                    return favReports;
                }
    
                this.extractFavoriteSightsFromList = function(sights) {
                    return sights.filter(function (sight) {
                        return sight.favorite;
                    }); 
                }
                this.extractFavoriteSightsFromFolders = function(folders) {
                    var favSights = [];
                    for (var i = 0; i < folders.length; i++) {
                        var folder = folders[i];
                        if (folder.sights) {
                            favSights = favSights.concat(this.extractFavoriteSightsFromList(folder.sights));
                        }
                        if (folder.folders) {
                            favSights = favSights.concat(this.extractFavoriteSightsFromFolders(folder.folders));
                        }
                    }
                    return favSights;
                }
                this.extractFavoriteSights = function() {
                    var favSights = [];

                    if (vm.treeData.folders) {
                        favSights = favSights.concat(this.extractFavoriteSightsFromFolders(vm.formattedTree.folders));
                    }
                    return favSights;
                }
                                
                this.extractFavorites = function() {
                    if (vm.includeSheets === 'true') { 
                        // extract favorite sheets
                        vm.formattedTree.folders.filter(folder => folder.id === null && folder.type === vm.CONTAINER.FAVORITES)
                                                .map(favFolder => favFolder.sheets = this.extractFavoriteSheets());
                    }
                    if (vm.includeReports === 'true') {
                        // extract favorite reports
                        vm.formattedTree.folders.filter(folder => folder.id === null && folder.type === vm.CONTAINER.FAVORITES)
                                                .map(favFolder => favFolder.reports = this.extractFavoriteReports());
                    }
                    if (vm.includeSights === 'true') {
                        // extract favorite sights
                        vm.formattedTree.folders.filter(folder => folder.id === null && folder.type === vm.CONTAINER.FAVORITES)
                                                .map(favFolder => favFolder.sights = this.extractFavoriteSights());
                    }
                }
                this.extractFavorites();
            };
            vm.formatTreeData.bind($scope);
            /**
             * Renders the tree using UL and LI elements.
             * This is done in a non-angular way for performance reasons when rendering extremely large trees.
             * This only renders the part of the tree that matches the search term.
             *
             * Final output should look something like this:
             <ul>
             <li id="node-8"><span class="sheet">Sheet 1</span></li>
             <li class="open" id="node-1"><span class="workspace">Workspace</span></li>
             <li>
             <ul>
             <li id="node-2"><span class="sheet">Sheet 1</span></li>
             <li id="node-4" class="closed">
             <span class="folder">Folder 1</span>
             <ul>
             <li id="node-6"><span class="sheet">Sheet 1</span></li>
             </ul>
             </li>
             <li id="node-7"><span class="sheet">Sheet 7</span></li>
             </ul>
             </li>
             </ul>
             */
            this.renderTree = function () {
                if (this.searchTerm !== this.lastRenderedSearchTerm) {
                    this.lastRenderedSearchTerm = this.searchTerm;
                    this.searchRegex = new RegExp(this.searchTerm, 'i');
                    this.searchTermReplaceRegex = new RegExp(this.searchTerm, 'ig');

                    this.treeElements = [];
                    this.selectedTreeElementIndex = null;

                    var childrenBuf = new Buffer();
                    this.renderNodes(vm.formattedTree.folders, vm.CONTAINER.FOLDER, childrenBuf, false);
                    this.renderNodes(vm.formattedTree.workspaces, vm.CONTAINER.WORKSPACE, childrenBuf, false);

                    var childrenHtml = childrenBuf.getSquashedBuffer();

                    var buf = new Buffer();
                    if (childrenHtml.length  > 0) {
                        buf.append('<ul>\n');
                        buf.append(childrenHtml);
                        buf.append('</ul>\n');
                    } else {
                        buf.append('No results!');
                    }

                    var sheetPicker = document.getElementById('sheetPicker');
                    if(sheetPicker){
                        sheetPicker.innerHTML = buf.getSquashedBuffer();
                    }

                    if (this.selectedTreeElementIndex != null) {
                        this.openTree(this.selectedTreeElementIndex);
                    }
                }
            };

            function elementIsContainer(treeElement) {
                return treeElement !== undefined && treeElement.type && 
                    (treeElement.type === vm.CONTAINER.WORKSPACE || 
                    treeElement.type === vm.CONTAINER.FOLDER || 
                    treeElement.type === vm.CONTAINER.FAVORITES || 
                    treeElement.type === vm.CONTAINER.SIGHTS || 
                    treeElement.type === vm.CONTAINER.REPORTS);
            }

            function setElementType(element, container) {
                if (container) {
                    element.type = container;
                } else {
                    element.type = 'SHEET';
                }
                return element;
            }

            this.renderNodes = function(currentTreeElements, container, buf, parentIsMatch) {
                if (currentTreeElements) {
                    for (var iElement = 0; iElement < currentTreeElements.length; iElement++) {
                        var element = currentTreeElements[iElement];
                        var nodeIndex = this.treeElements.length;
                        if(element.type === undefined) {
                            element = setElementType(element, container);
                        }
                        this.treeElements.push(element);

                        var isContainer = elementIsContainer(element);
                        var currentElementIsMatch = parentIsMatch || this.isMatch(element);

                        var childrenHtml = '';
                        if (isContainer) {
                            // The best way to know if we have children that match the search term is to render them
                            // If anything matches, it will get rendered, and thus we know that this element should
                            // also be rendered since it contains children that match.
                            var childrenBuffer = new Buffer();
                            this.renderNodes(element.folders, vm.CONTAINER.FOLDER, childrenBuffer, currentElementIsMatch);
                            this.renderNodes(element.workspaces, vm.CONTAINER.WORKSPACE, childrenBuffer, currentElementIsMatch);
                            
                            if (vm.includeSheets === 'true') {
                                this.renderNodes(element.sheets, vm.CONTAINER.SHEET, childrenBuffer, false);
                            }
                            if (vm.includeSights === 'true') {
                                this.renderNodes(element.sights, vm.CONTAINER.SIGHT, childrenBuffer, false);
                            }
                            if (vm.includeReports === 'true') {
                                this.renderNodes(element.reports, vm.CONTAINER.REPORT, childrenBuffer, false);
                            }
                            childrenHtml = childrenBuffer.getSquashedBuffer();
                        }

                        if (childrenHtml.length > 0 || currentElementIsMatch || parentIsMatch) {
                            buf.append('<li id="node-');
                            buf.append(nodeIndex);
                            buf.append('"');
                            if (isContainer) {
                                if (this.searchTerm != '') {
                                    buf.append(' class="open"');
                                } else {
                                    buf.append(' class="closed"');
                                }
                            } else {
                                if (this.selectedTreeElementIndex == null && // If a sheet is a favorite, it is listed twice in the tree. Only select it in the favorites folder (which has already been rendered)
                                    this.selectedSheet != null && element.type === 'SHEET' && element.id === this.selectedSheet.id) {

                                    buf.append(' class="selected"');
                                    this.selectedTreeElementIndex = nodeIndex;
                                }
                            }
                            buf.append('><span class="');
                            // IDEA: check if object is array then check it's name
                            buf.append(element.type);
                            buf.append('">');

                            var name = toHtml(element.name);
                            if (this.searchTerm != '') {
                                buf.append(name.replace(this.searchTermReplaceRegex, function (v) {
                                    return '<span class="match">' + v + '</span>'
                                }));
                            } else {
                                buf.append(name);
                            }
                            
                            function elementIsContainer(treeElement) {
                                // FIXME: USE vm.CONTAINER constant
                                return (element.type === 'FOLDER' || element.type === 'WORKSPACE' || element.type === 'REPORTS') && ((element.sheets != null && element.sheets.length > 0) || (element.reports != null && element.reports.length > 0));
                                    
                            }

                            buf.append('</span>');

                            if (childrenHtml.length > 0) {
                                buf.append('<ul>\n');
                                buf.append(childrenHtml);
                                buf.append('</ul>\n');
                            }

                            buf.append('</li>\n');
                        }
                    }
                }
            };

            this.isMatch = function (element) {
                return this.searchTerm === '' || element.name.search(this.searchRegex) != -1;
            };
        }

        /**
         * String concatenation is very expensive due to the string repeatedly being reallocated.
         * This buffer object minimizes that overhead by only doing the concat every N iterations.
         */
        function Buffer() {
            this.index = 0;
            this.bufferArray = new Array(500);

            this.append = function (value) {
                this.bufferArray[this.index++] = value;
                if (this.index == this.bufferArray.length) {
                    var squashedBuffer = this.bufferArray.join("");
                    this.bufferArray[0] = squashedBuffer;
                    this.index = 1;
                }
            };

            this.getSquashedBuffer = function() {
                if (this.index > 0) {
                    return this.bufferArray.slice(0, this.index).join("");
                } else {
                    return "";
                }
            };
        }

        // this method is used to convert data to safe HTML for display within our UI
        // (i.e. information that is placed in the innerHTML of a div that is not editable)
        function toHtml(s, convertLineFeedsToBreaks) {

            var htmlEntityMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                '\'': '&#39;',
                '/': '&#x2F;',
                '\n': '<br/>'
            };

            if (s == null) return '';

            // Make sure we are passed a string value - otherwise nothing is returned
            if (typeof(s) != 'string') {
                // Cast value to string and return
                return s + '';
            }

            var rx;
            if (convertLineFeedsToBreaks) {
                rx = /[&<>"'/\n]/g;
            } else {
                rx = /[&<>"'/]/g;
            }

            return s.replace(rx, function(c) {return htmlEntityMap[c];});

        }
    }
})();
