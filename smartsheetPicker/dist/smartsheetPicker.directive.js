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
                includeSheet: "@",
                includeReport: "@",
                includeSight: "@"
            },
            template: '<div uib-dropdown auto-close="outsideClick" uib-keyboard-nav="true" is-open="vm.pickerVisible">' +
                        '<div uib-dropdown-menu class="sheetPickerMenu" style="width:100%">'+
                        '<input type="text" ng-model="vm.searchText" placeholder="Search" class="form-control" id="searchSheets" />' +
                        '<div class="sheetPicker" ng-click="vm.handleTreeClick($event)" id="sheetPicker">' +
                        '<img src="../smartsheetPicker/img/ajax-loader.gif"></div></div></div>',
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
                FAVORITES: 'FAVORITES'
            };
            vm.selectedSheet = {
                sheet: null
            };
            // fixme: Selected sheet. This will a sheet object from the raw json response we got from the server.

            // vm.treeData = null; // Raw json response from the server that contains all of the info about the tree
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
                        // i don't like this here
                        this.formatTreeData();
                        this.renderTree();
                    }.bind(this), this.searchTimeoutDelay);
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
                    "name": null,  // fixme verify we need this
                    "permalink": null,   // fixme verify we need this
                    "type": null,   // fixme verify we need this
                    "sheets": null,   // fixme verify we need this
                    "folders": [
                        {
                            "id": null,
                            "name": "Favorites",
                            "permalink": null,
                            "type": vm.CONTAINER.FAVORITES,
                            // todo get favorites
                            "sheets": [],//vm.treeData.sheets.filter(function(sheet) { return sheet.favorite; }),
                            "reports": [],//vm.treeData.reports.filter(function(report) { return report.favorite; }),
                            "sights": [] //vm.treeData.sights.filter(function(sight) { return sight.favorite; })
                        },
                        {
                            "id": null,
                            "name": "Sheets",
                            "permalink": null,
                            "type": vm.CONTAINER.FOLDER,
                            "sheets": vm.treeData.folders.map(function(folder) { 
                                folder.type = vm.CONTAINER.FOLDER; 
                                return folder 
                            })
                        },
                        {
                            "id":null,
                            "name": "Workspaces",
                            "type": vm.CONTAINER.WORKSPACE,
                            "workspaces": vm.treeData.workspaces                            
                        },
                        {
                            "id": null,
                            "name": "Reports",
                            "type": vm.CONTAINER.REPORT,
                            "reports": vm.treeData.reports
                        }
                    ],
                    
                };
                vm.formattedTree.folders[1].sheets = vm.formattedTree.folders[1].sheets.concat(vm.treeData.sheets)
    
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
                    return reports.filter(function (reports) {
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
                                
                this.extractFavorites = function() {
                    if (vm.includeSheets === 'true') { 
                        // extract favorite sheets
                        vm.formattedTree.folders[0].sheets = this.extractFavoriteSheets();
                    }
                    if (vm.includeReports === 'true') {
                        // extract favorite reports
                        vm.formattedTree.folders[0].reports = this.extractFavoriteReports();
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
                    if (vm.includeSheets === 'true') {
                        this.renderNodes(vm.formattedTree.sheets, vm.CONTAINER.SHEET, childrenBuf, false);
                    }
                    if (vm.includeSights === 'true') {
                        this.renderNodes(vm.formattedTree.sights, vm.CONTAINER.SHEET, childrenBuf, false);
                    }
                    if (vm.includeReports === 'true') {
                        this.renderNodes(vm.formattedTree.sheets, vm.CONTAINER.SHEET, childrenBuf, false);
                    }

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

                // vm.onLoadComplete()();
            };

            function elementIsContainer(treeElement) {
                // todo: what if we just check if treeElement.workpaces || treeElement.folders, etc. exist?
                return treeElement !== undefined && treeElement.type && (treeElement.type === 'WORKSPACE' || treeElement.type === 'FOLDER'
                    || treeElement.type === 'FAVORITES' || treeElement.type === 'SIGHTS' || treeElement.type === 'REPORTS');
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
                            this.renderNodes(element.sheets, vm.CONTAINER.SHEET, childrenBuffer, currentElementIsMatch);
                            this.renderNodes(element.workspaces, vm.CONTAINER.WORKSPACE, childrenBuffer, currentElementIsMatch);
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

                            // Add the count of sheets under this container
                            if ((element.type === 'FOLDER' || element.type === 'WORKSPACE') && element.sheets != null && element.sheets.length > 0) {
                                buf.append(' (');
                                buf.append(element.sheets.length);
                                buf.append(')');
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
