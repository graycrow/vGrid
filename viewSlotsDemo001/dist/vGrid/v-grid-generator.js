'use strict';

System.register(['aurelia-framework'], function (_export, _context) {
  var ViewSlot, VGridGenerator;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaFramework) {
      ViewSlot = _aureliaFramework.ViewSlot;
    }],
    execute: function () {
      _export('VGridGenerator', VGridGenerator = function () {
        function VGridGenerator(vGridConfig, vGridElement, vGridSortable, vGridSelection, vGridCellEdit, vGrid) {
          _classCallCheck(this, VGridGenerator);

          this.internalDragDropCount = 10;
          this.sortOrder = [];
          this.contentHeight = 0;
          this.gridHeight = 0;
          this.gridWidth = 0;
          this.queryStringCheck = {};
          this.scrollBodyHeight = 0;
          this.htmlCache = {
            grid: null,
            header: null,
            content: null,
            footer: null,
            rowsArray: [],
            scrollBody: null,
            rowTemplate: null };
          this.scrollVars = {
            lastScrollTop: 0,
            firstTop: 0,
            lastScrollLeft: 0,
            halt: false,
            timer: null,
            clickTimersArray: [],
            scrollCallbackTimer: null
          };

          this.vGridSelection = vGridSelection;
          this.vGridConfig = vGridConfig;
          this.vGridCellEdit = vGridCellEdit;
          this.vGridElement = vGridElement;
          this.vGridSortable = vGridSortable;
          this.vGrid = vGrid;
          this.init(false);
        }

        VGridGenerator.prototype.fillDataInRows = function fillDataInRows(clearAllRows) {
          for (var i = 0; i < this.getRowCacheLength(); i++) {
            var currentRow = this.htmlCache.rowsArray[i].top / this.vGridConfig.rowHeight;
            var row = this.htmlCache.rowsArray[i];
            this.insertRowMarkup(currentRow, row, true, true);
          }
        };

        VGridGenerator.prototype.getSortIcon = function getSortIcon(attribute) {
          var _this = this;

          var result;

          var lineHeigthStyleTag;
          if (!this.vGridConfig.addFilter) {
            lineHeigthStyleTag = 'style=line-height:' + this.vGridConfig.headerHeight + 'px;"';
          } else {
            lineHeigthStyleTag = 'style=line-height:' + this.vGridConfig.headerHeight / 2 + 'px;"';
          }

          if (this.vGridConfig.sortNotOnHeader.indexOf(attribute) !== -1) {
            return "";
          }

          if (this.vGridConfig.sortOnHeaderClick) {
            var main = '<span class=""><span ' + lineHeigthStyleTag + ' class="' + this.vGridConfig.css.sortIcon + ' ' + this.vGridConfig.css.sortIconSort + '"></span></span>';
            if (this.sortOrder.length === 0) {
              result = main;
            } else {
              this.sortOrder.forEach(function (x) {
                if (x.attribute === attribute) {
                  var isAsc = '<span ' + lineHeigthStyleTag + ' class="' + _this.vGridConfig.css.sortIcon + ' ' + _this.vGridConfig.css.sortIconAsc + '"></span>';
                  var isDesc = '<span ' + lineHeigthStyleTag + ' class="' + _this.vGridConfig.css.sortIcon + ' ' + _this.vGridConfig.css.sortIconDesc + '"></span>';

                  var asc = x.asc === true ? isAsc : isDesc;
                  var main = '<span ' + lineHeigthStyleTag + ' class="' + _this.vGridConfig.css.sortIcon + ' ' + _this.vGridConfig.css.sortIconNo + x.no + '">';
                  var end = '</span>';

                  result = main + end + asc;
                }
              });
            }
            if (!result) {
              result = main;
            }
          } else {
            result = "";
          }
          return result;
        };

        VGridGenerator.prototype.fillDataIntoRow = function fillDataIntoRow(rowno, clearRow) {
          for (var i = 0; i < this.getRowCacheLength(); i++) {
            var currentRow = this.htmlCache.rowsArray[i].top / this.vGridConfig.rowHeight;
            if (rowno === currentRow) {
              var row = this.htmlCache.rowsArray[i];
              this.insertRowMarkup(currentRow, row, true, true);
            }
          }
        };

        VGridGenerator.prototype.updateSelectionOnAllRows = function updateSelectionOnAllRows() {
          var i;
          for (i = 0; i < this.getRowCacheLength(); i++) {
            var currentRow = this.htmlCache.rowsArray[i].top / this.vGridConfig.rowHeight;
            if (this.vGridSelection.isSelected(currentRow)) {
              this.htmlCache.rowsArray[i].div.classList.add(this.vGridConfig.css.rowSelected);
            } else {
              this.htmlCache.rowsArray[i].div.classList.remove(this.vGridConfig.css.rowSelected);
            }
          }
        };

        VGridGenerator.prototype.getHeaderTemplate = function getHeaderTemplate(headerNamesArray, attributeNamesArray) {
          var rowTemplate = "";
          var dragHandle = this.vGridConfig.isSortableHeader ? this.vGridConfig.css.dragHandle : "";
          var css = dragHandle + ' ' + this.vGridConfig.css.cellContent + ' ' + this.vGridConfig.css.orderHandle;
          for (var i = 0; i < headerNamesArray.length; i++) {
            var sortIcon = this.getSortIcon(attributeNamesArray[i]);
            rowTemplate = rowTemplate + ('<div><div class="' + css + '" ' + this.vGridConfig.atts.dataAttribute + '="' + attributeNamesArray[i] + '">' + headerNamesArray[i] + sortIcon + '</div></div>');
          }
          return rowTemplate;
        };

        VGridGenerator.prototype.getRowTemplate = function getRowTemplate() {
          var rowTemplate = "";
          if (this.htmlCache.rowTemplate !== null) {
            rowTemplate = this.htmlCache.rowTemplate;
          } else {
            if (this.vGridConfig.onRowMarkupCreate) {
              for (var i = 0; i < this.vGridConfig.attributeArray.length; i++) {
                if (this.vGridConfig.attributes.indexOf(this.vGridConfig.attributeArray[i]) === -1) {
                  this.vGridConfig.attributes.push(this.vGridConfig.attributeArray[i]);
                }
              }
              rowTemplate = this.vGridConfig.onRowMarkupCreate(this.vGridConfig.attributeArray);
            } else {
              for (var i = 0; i < this.vGridConfig.attributeArray.length; i++) {
                var cellClasses = this.vGridConfig.css.rowCell + ' ' + (this.vGridConfig.css.rowColumn + i) + ' ' + (this.vGridConfig.css.gridColumn + i);
                var cellStyle = 'width:' + this.vGridConfig.columnWidthArray[i] + 'px';
                if (this.vGridConfig.attributes.indexOf(this.vGridConfig.attributeArray[i]) === -1) {
                  this.vGridConfig.attributes.push(this.vGridConfig.attributeArray[i]);
                }
                rowTemplate = rowTemplate + ('<v-grid-cell class="' + cellClasses + '" style="' + cellStyle + '" col-no=' + i + '></v-grid-cell>');
              }
            }
          }
          return rowTemplate;
        };

        VGridGenerator.prototype.cacheRowTemplate = function cacheRowTemplate(template) {
          this.htmlCache.rowTemplate = null;
          this.htmlCache.rowTemplate = template || this.getRowTemplate();
        };

        VGridGenerator.prototype.getTotalColumnWidth = function getTotalColumnWidth() {
          var total = 0;
          for (var i = 0; i < this.vGridConfig.attributeArray.length; i++) {
            total = total + parseInt(this.vGridConfig.columnWidthArray[i], 10);
          }
          return total;
        };

        VGridGenerator.prototype.createHeaderMarkup = function createHeaderMarkup() {
          var tempColumns = document.createElement("DIV");
          tempColumns.innerHTML = this.getHeaderTemplate(this.vGridConfig.headerArray, this.vGridConfig.attributeArray);
          var i;
          for (i = 0; i < tempColumns.children.length; i++) {
            tempColumns.children[i].setAttribute("column-no", i);

            if (!this.vGridConfig.addFilter) {
              tempColumns.children[i].style["line-height"] = this.vGridConfig.headerHeight + "px";
            }

            tempColumns.children[i].style.height = "100%";
            tempColumns.children[i].style.width = this.vGridConfig.columnWidthArray[i] + "px";
            tempColumns.children[i].classList.add(this.vGridConfig.css.rowHeaderCell);
            tempColumns.children[i].classList.add(this.vGridConfig.css.rowHeaderColumn + i);
            tempColumns.children[i].classList.add(this.vGridConfig.css.gridColumn + i);
          }

          var row = document.createElement("DIV");
          row.className = this.vGridConfig.css.row + " " + this.vGridConfig.css.rowHeader;

          row.style.height = this.vGridConfig.headerHeight + "px";
          row.style.width = this.getTotalColumnWidth() + "px";
          row.innerHTML = tempColumns.innerHTML;

          var container = document.createElement("DIV");
          container.className = this.vGridConfig.css.rowContainer;
          container.appendChild(row);

          return container;
        };

        VGridGenerator.prototype.createRowMarkup = function createRowMarkup(entity, attributeNames) {
          var tempColumns = document.createElement("DIV");
          tempColumns.innerHTML = this.getRowTemplate(attributeNames);
          return tempColumns.innerHTML;
        };

        VGridGenerator.prototype.getRowCacheLength = function getRowCacheLength() {
          return this.htmlCache.rowsArray.length;
        };

        VGridGenerator.prototype.setRowTopValue = function setRowTopValue(rowArray, elementNo, topValue) {
          rowArray[elementNo].div.style.transform = 'translate3d(0px,' + topValue + 'px, 0px)';
          rowArray[elementNo].top = topValue;
        };

        VGridGenerator.prototype.createGridHtmlWrapper = function createGridHtmlWrapper() {
          var x = document.createElement("DIV");
          this.vGridElement.appendChild(x);
          this.htmlCache.grid = x;

          this.htmlCache.grid.className = this.vGridConfig.css.wrapper;
          this.htmlCache.grid.style.position = "relative";
          this.htmlCache.grid.style.height = this.vGridElement.style.height || "100%";
          this.htmlCache.grid.style.width = this.vGridElement.style.width || "100%";

          this.gridHeight = this.htmlCache.grid.clientHeight;
          this.gridWidght = this.htmlCache.grid.clientWidth;
        };

        VGridGenerator.prototype.createGridHtmlHeaderWrapper = function createGridHtmlHeaderWrapper() {
          this.htmlCache.header = document.createElement("DIV");
          this.htmlCache.header.className = this.vGridConfig.css.mainHeader;
          this.htmlCache.header.style.height = this.vGridConfig.headerHeight + "px";
          this.htmlCache.grid.appendChild(this.htmlCache.header);

          var headerDivs = this.createHeaderMarkup(this.htmlCache.header);
          if (this.vGridConfig.addFilter) {
            var headerCells = headerDivs.lastElementChild.children;
            for (var i = 0; i < headerCells.length; i++) {
              this.addFilterToHeaderCell({
                attributeName: this.vGridConfig.attributeArray[i],
                headerName: this.vGridConfig.headerArray[i],
                defaultFilter: this.vGridConfig.filterArray[i],
                div: headerCells[i]
              });
            }
          }
          this.htmlCache.header.appendChild(headerDivs);
        };

        VGridGenerator.prototype.rebuildGridHeaderHtml = function rebuildGridHeaderHtml() {
          var getScrollLeft = this.htmlCache.header.firstChild.firstChild.style.left;
          this.htmlCache.header.removeChild(this.htmlCache.header.firstChild);

          var headerDivs = this.createHeaderMarkup(this.htmlCache.header);
          if (this.vGridConfig.addFilter) {
            var headerCells = headerDivs.lastElementChild.children;
            for (var i = 0; i < headerCells.length; i++) {
              this.addFilterToHeaderCell({
                attributeName: this.vGridConfig.attributeArray[i],
                headerName: this.vGridConfig.headerArray[i],
                defaultFilter: this.vGridConfig.filterArray[i],
                div: headerCells[i]
              });
            }
          }
          this.htmlCache.header.appendChild(headerDivs);
          this.addResizableAndSortableEvent();

          this.htmlCache.header.firstChild.firstChild.style.left = getScrollLeft;
        };

        VGridGenerator.prototype.createGridHtmlContentWrapper = function createGridHtmlContentWrapper() {
          var gridWrapperHeight = this.gridHeight;
          var headerAndFooterHeight = this.vGridConfig.headerHeight + this.vGridConfig.footerHeight;
          this.contentHeight = gridWrapperHeight - headerAndFooterHeight;

          this.htmlCache.content = document.createElement("DIV");
          this.htmlCache.content.className = this.vGridConfig.css.mainContent;
          this.htmlCache.content.style.height = this.contentHeight + "px";
          this.htmlCache.grid.appendChild(this.htmlCache.content);
        };

        VGridGenerator.prototype.createGridHtmlFooterWrapper = function createGridHtmlFooterWrapper() {
          this.htmlCache.footer = document.createElement("DIV");
          this.htmlCache.footer.className = this.vGridConfig.css.mainFooter;
          this.htmlCache.footer.style.height = this.vGridConfig.footerHeight + "px";
          this.htmlCache.grid.appendChild(this.htmlCache.footer);
        };

        VGridGenerator.prototype.setScrollBodyHeightToVar = function setScrollBodyHeightToVar() {
          var collectionLength = this.vGridConfig.getCollectionLength();
          this.scrollBodyHeight = collectionLength * this.vGridConfig.rowHeight;
        };

        VGridGenerator.prototype.createGridHtmlScrollBodyWrapper = function createGridHtmlScrollBodyWrapper() {
          this.setScrollBodyHeightToVar();

          this.htmlCache.scrollBody = document.createElement("DIV");
          this.htmlCache.scrollBody.className = this.vGridConfig.css.scrollBody;
          this.htmlCache.scrollBody.style.height = this.scrollBodyHeight + "px";
          this.htmlCache.scrollBody.style.width = this.getTotalColumnWidth() + "px";
          this.htmlCache.content.appendChild(this.htmlCache.scrollBody);
        };

        VGridGenerator.prototype.correctRowAndScrollbodyWidth = function correctRowAndScrollbodyWidth() {
          this.htmlCache.scrollBody.style.width = this.getTotalColumnWidth() + "px";
          for (var i = 0; i < this.htmlCache.rowsArray.length; i++) {
            this.htmlCache.rowsArray[i].div.style.width = this.getTotalColumnWidth() + "px";
          }
          this.htmlCache.header.firstChild.firstChild.style.width = this.getTotalColumnWidth() + "px";
        };

        VGridGenerator.prototype.correctHeaderAndScrollbodyWidth = function correctHeaderAndScrollbodyWidth() {
          this.htmlCache.scrollBody.style.width = this.getTotalColumnWidth() + "px";
          this.htmlCache.header.firstChild.firstChild.style.width = this.getTotalColumnWidth() + "px";
        };

        VGridGenerator.prototype.createGridHtmlRowWrapper = function createGridHtmlRowWrapper() {
          var minimumRowsNeeded = parseInt(this.contentHeight / this.vGridConfig.rowHeight, 10);

          if (this.vGridConfig.largeBuffer) {
            minimumRowsNeeded = minimumRowsNeeded * 5;
          }

          if (minimumRowsNeeded % 2 === 1) {
            minimumRowsNeeded = minimumRowsNeeded + 7;
          } else {
            minimumRowsNeeded = minimumRowsNeeded + 6;
          }

          var top = 0;
          for (var i = 0; i < minimumRowsNeeded; i++) {

            var row = document.createElement("DIV");

            row.className = this.vGridConfig.css.row;

            if (i % 2 === 1) {
              row.classList.add(this.vGridConfig.css.rowAlt);
            } else {
              row.classList.add(this.vGridConfig.css.rowEven);
            }

            row.style.height = this.vGridConfig.rowHeight + "px";

            this.setRowTopValue([{
              div: row,
              top: 0
            }], 0, top);

            row.style.minWidth = this.htmlCache.grid.offsetWidth + "px";
            row.style.width = this.getTotalColumnWidth() + "px";

            row.innerHTML = "";

            this.htmlCache.scrollBody.appendChild(row);

            this.htmlCache.rowsArray.push({
              div: row,
              top: top
            });

            top = top + this.vGridConfig.rowHeight;
          }
        };

        VGridGenerator.prototype.insertRowMarkup = function insertRowMarkup(rowNo, row, isDownScroll, isLargeScroll) {
          var _this2 = this;

          this.vGridConfig.getDataElement(rowNo, isDownScroll, isLargeScroll, function (entity) {

            row.div.setAttribute("row", rowNo);

            if (entity === "") {
              row.viewSlot.bind({});
              row.div.classList.add(_this2.vGridConfig.css.noData);
            } else {
              if (row.div.classList.contains(_this2.vGridConfig.css.noData)) {
                row.div.classList.remove(_this2.vGridConfig.css.noData);
              }
            }

            if (entity !== "" && row.viewSlot !== null) {
              entity.ctx = _this2;
              row.viewSlot.bind(entity);
            }

            if (rowNo % 2 === 1) {
              if (row.div.classList.contains(_this2.vGridConfig.css.rowEven)) {
                row.div.classList.remove(_this2.vGridConfig.css.rowEven);
                row.div.classList.add(_this2.vGridConfig.css.rowAlt);
              }
            } else {
              if (row.div.classList.contains(_this2.vGridConfig.css.rowAlt)) {
                row.div.classList.remove(_this2.vGridConfig.css.rowAlt);
                row.div.classList.add(_this2.vGridConfig.css.rowEven);
              }
            }

            if (_this2.vGridSelection.isSelected(rowNo)) {
              row.div.classList.add(_this2.vGridConfig.css.rowSelected);
            } else {
              row.div.classList.remove(_this2.vGridConfig.css.rowSelected);
            }
          });
        };

        VGridGenerator.prototype.addFilterToHeaderCell = function addFilterToHeaderCell(event) {
          var _this3 = this;

          var attributeName = event.attributeName;
          var headerName = event.headerName;
          var defaultFilter = event.defaultFilter;

          var onChangeEventOnFilter = function onChangeEventOnFilter(e) {

            if (e.keyCode !== 9) {
              var queryHtmlInput = _this3.vGridElement.querySelectorAll("." + _this3.vGridConfig.css.filterHandle);

              var queryParams = [];
              for (var i = 0; i < queryHtmlInput.length; i++) {
                if (queryHtmlInput[i].value !== "" && queryHtmlInput[i].value !== undefined) {
                  var dataSourceAttribute = queryHtmlInput[i].getAttribute(_this3.vGridConfig.atts.dataAttribute);
                  var operator = _this3.vGridConfig.filterArray[_this3.vGridConfig.attributeArray.indexOf(dataSourceAttribute)];

                  var value = queryHtmlInput[i].value;

                  queryParams.push({
                    attribute: dataSourceAttribute,
                    value: value,
                    operator: operator
                  });

                  _this3.queryStringCheck[dataSourceAttribute] = queryHtmlInput[i].value;
                } else {

                  if (queryHtmlInput[i].value === "") {
                    var dataSourceAttribute = queryHtmlInput[i].getAttribute(_this3.vGridConfig.atts.dataAttribute);
                    _this3.queryStringCheck[dataSourceAttribute] = queryHtmlInput[i].value = "";
                  }
                }
              }
              _this3.vGridConfig.onFilterRun(queryParams);
            }
          };

          var onKeyUpEventOnFilter = function onKeyUpEventOnFilter(e) {
            if (e.keyCode === 13 && triggerRan === false) {
              e.target.onchange(e);
            }
          };

          var getHeaderCellMarkup = function getHeaderCellMarkup(labelTopCell, valueInput, attribute) {

            var dragHandle = _this3.vGridConfig.isSortableHeader ? _this3.vGridConfig.css.dragHandle : "";

            var cssLabel = _this3.vGridConfig.css.cellContent + ' ' + _this3.vGridConfig.css.filterLabelTop + ' ' + dragHandle + ' ' + _this3.vGridConfig.css.orderHandle;
            var cssInput = _this3.vGridConfig.css.cellContent + ' ' + _this3.vGridConfig.css.filterInputBottom + ' ' + _this3.vGridConfig.css.filterHandle;

            if (_this3.vGridConfig.filterOnAtTop) {
              cssLabel = _this3.vGridConfig.css.cellContent + ' ' + _this3.vGridConfig.css.filterLabelBottom + ' ' + dragHandle + ' ' + _this3.vGridConfig.css.orderHandle;
              cssInput = _this3.vGridConfig.css.cellContent + ' ' + _this3.vGridConfig.css.filterInputTop + ' ' + _this3.vGridConfig.css.filterHandle;
            }

            var sortIcon = _this3.getSortIcon(attribute);

            var filter = _this3.vGridConfig.filterArray[_this3.vGridConfig.attributeArray.indexOf(attribute)] || "filter";
            var filterName = _this3.vGridConfig.getFilterName(filter);

            var lineHeigth = 'line-height:' + _this3.vGridConfig.headerHeight / 2 + 'px;';

            var cellLabel = '<div style="' + lineHeigth + '" class="' + cssLabel + '" ' + _this3.vGridConfig.atts.dataAttribute + '="' + attribute + '">' + labelTopCell + ' ' + sortIcon + '</div>';
            var cellInput = '<input style="' + lineHeigth + '" placeholder="' + filterName + '" class="' + cssInput + '" ' + _this3.vGridConfig.atts.dataAttribute + '="' + attribute + '" value="' + valueInput + '"/>';

            if (_this3.vGridConfig.doNotAddFilterTo.indexOf(attribute) !== -1) {
              cellInput = '<div class="' + cssLabel + '" ' + _this3.vGridConfig.atts.dataAttribute + '="' + attribute + '"></div>';
            }

            var result;
            if (_this3.vGridConfig.filterOnAtTop) {
              result = cellInput + cellLabel;
            } else {
              result = cellLabel + cellInput;
            }
            return result;
          };

          var value = "";

          if (this.queryStringCheck[attributeName] !== undefined) {
            value = this.queryStringCheck[attributeName];
          }

          var onFocus = function onFocus(e) {
            _this3.htmlCache.content.scrollLeft = e.target.offsetParent.offsetParent.offsetParent.scrollLeft;
          };

          event.div.innerHTML = getHeaderCellMarkup(headerName, value, attributeName);

          var cellInputElement = event.div.querySelectorAll("." + this.vGridConfig.css.filterHandle);
          if (this.vGridConfig.filterOnKey !== true) {
            for (var i = 0; i < cellInputElement.length; i++) {
              cellInputElement[i].onchange = onChangeEventOnFilter;
              cellInputElement[i].onkeyup = onKeyUpEventOnFilter;
              cellInputElement[i].onfocus = onFocus;
              cellInputElement[i].onclick = this.vGridConfig.filterCellClick.bind(this.vGridConfig);
            }
          } else {
            for (var i = 0; i < cellInputElement.length; i++) {
              cellInputElement[i].onkeyup = onChangeEventOnFilter;
              cellInputElement[i].onfocus = onFocus;
              cellInputElement[i].onclick = this.vGridConfig.filterCellClick.bind(this.vGridConfig);
            }
          }
        };

        VGridGenerator.prototype.onNormalScrollingLarge = function onNormalScrollingLarge() {
          var _this4 = this;

          this.scrollVars.lastScrollTop = this.htmlCache.content.scrollTop;

          if (this.htmlCache.content.scrollTop === 0 && this.scrollVars.lastScrollTop !== this.htmlCache.content.scrollTop) {
            this.scrollVars.lastScrollTop = 0;
          }

          if (this.vGridConfig.getCollectionLength() <= this.htmlCache.rowsArray.length) {
            this.scrollVars.lastScrollTop = 0;
          }

          var currentRow = parseInt(this.scrollVars.lastScrollTop / this.vGridConfig.rowHeight, 10);
          this.scrollVars.firstTop = currentRow * this.vGridConfig.rowHeight;
          var currentRowTop = this.vGridConfig.rowHeight * currentRow;
          var bottomHitCount;
          for (var i = 0; i < this.getRowCacheLength(); i++) {
            var setNewTopOnRow = function setNewTopOnRow(cacheRowNumber) {
              var row = _this4.htmlCache.rowsArray[cacheRowNumber];
              _this4.setRowTopValue([row], 0, currentRowTop);
              currentRowTop = currentRowTop + _this4.vGridConfig.rowHeight;
            };

            if (currentRow >= 0 && currentRow <= this.vGridConfig.getCollectionLength() - 1) {
              setNewTopOnRow(i);
            }

            if (currentRow === this.vGridConfig.getCollectionLength() - 1 && this.getRowCacheLength() < this.vGridConfig.getCollectionLength() - 1) {
              bottomHitCount = i;
            }

            if (currentRow > this.vGridConfig.getCollectionLength() - 1) {
              setNewTopOnRow(i);
            }

            if (currentRow >= this.vGridConfig.getCollectionLength() && currentRowTop - this.vGridConfig.rowHeight >= this.htmlCache.content.clientHeight) {
              var row = this.htmlCache.rowsArray[i];
              this.setRowTopValue([row], 0, -(currentRowTop + this.vGridConfig.rowHeight * 50));
            }

            currentRow++;
          }

          if (bottomHitCount) {
            var firstTop = parseInt(this.htmlCache.rowsArray[0].top, 10);
            for (i = this.getRowCacheLength() - 1; i > bottomHitCount; i--) {
              var row = this.htmlCache.rowsArray[i];
              firstTop = firstTop - this.vGridConfig.rowHeight;
              this.setRowTopValue(this.htmlCache.rowsArray, i, firstTop);
            }
          }

          this.htmlCache.rowsArray.sort(function (a, b) {
            return parseInt(a.top) - parseInt(b.top);
          });

          this.fillDataInRows(false);
        };

        VGridGenerator.prototype.onNormalScrolling = function onNormalScrolling(isDownScroll, currentScrollTop) {
          var currentScrollTop = this.htmlCache.content.scrollTop;
          if (this.scrollVars.halt === false) {
            var newTopValue;
            var currentRow = parseInt(this.scrollVars.lastScrollTop / this.vGridConfig.rowHeight, 10);
            this.scrollVars.firstTop = currentRow * this.vGridConfig.rowHeight;

            for (var i = 0; i < this.getRowCacheLength(); i++) {

              var row = this.htmlCache.rowsArray[i];
              var rowTop = parseInt(row.top, 10);
              var update = false;

              if (isDownScroll) {
                if (rowTop < currentScrollTop - this.vGridConfig.rowHeight) {
                  update = true;
                  newTopValue = rowTop + this.vGridConfig.rowHeight * this.getRowCacheLength();
                  currentRow = (rowTop + this.vGridConfig.rowHeight * this.getRowCacheLength()) / this.vGridConfig.rowHeight;
                }
                if (rowTop > (this.vGridConfig.getCollectionLength() - 1) * this.vGridConfig.rowHeight && rowTop > parseInt(this.htmlCache.content.style.height)) {
                  this.setRowTopValue([row], 0, -(this.vGridConfig.rowHeight * i + this.vGridConfig.rowHeight * 50));
                }
              } else {
                if (rowTop > currentScrollTop + this.contentHeight) {
                  update = true;
                  newTopValue = rowTop - this.vGridConfig.rowHeight * this.getRowCacheLength();
                  currentRow = (rowTop - this.vGridConfig.rowHeight * this.getRowCacheLength()) / this.vGridConfig.rowHeight;
                }
              }

              if (update === true && currentRow >= 0 && currentRow <= this.vGridConfig.getCollectionLength() - 1) {
                this.setRowTopValue([row], 0, newTopValue);
                this.insertRowMarkup(currentRow, row, isDownScroll, false);
              }
            }
            this.htmlCache.rowsArray.sort(function (a, b) {
              return parseInt(a.top) - parseInt(b.top);
            });
          } else {
            this.onScrollbarScrolling();
          }
        };

        VGridGenerator.prototype.hideRowsThatIsLargerThanCollection = function hideRowsThatIsLargerThanCollection() {
          var currentRow = parseInt(this.scrollVars.lastScrollTop / this.vGridConfig.rowHeight, 10);
          this.scrollVars.firstTop = currentRow * this.vGridConfig.rowHeight;
          for (var i = 0; i < this.getRowCacheLength(); i++) {
            var row = this.htmlCache.rowsArray[i];
            var rowTop = parseInt(row.top, 10);
            if (rowTop > (this.vGridConfig.getCollectionLength() - 1) * this.vGridConfig.rowHeight && rowTop > parseInt(this.htmlCache.content.style.height) - this.vGridConfig.rowHeight) {
              this.setRowTopValue([row], 0, -5000 + i);
            }
          }

          this.htmlCache.rowsArray.sort(function (a, b) {
            return parseInt(a.top) - parseInt(b.top);
          });
        };

        VGridGenerator.prototype.onScrollbarScrolling = function onScrollbarScrolling() {
          var _this5 = this;

          this.scrollVars.halt = true;

          var timeout = this.vGridConfig.dataScrollDelay;

          clearTimeout(this.scrollVars.timer);

          this.scrollVars.timer = setTimeout(function () {
            _this5.onNormalScrollingLarge();
            _this5.scrollVars.halt = false;
          }, timeout);
        };

        VGridGenerator.prototype.onScrollClickCancel = function onScrollClickCancel() {
          var _this6 = this;

          this.scrollVars.clickTimersArray.forEach(function (xTimer) {
            clearTimeout(xTimer);
          });

          if (this.scrollVars.clickTimersArray.length > 0) {
            setTimeout(function () {
              _this6.scrollVars.clickTimersArray.forEach(function (xTimer) {
                clearTimeout(xTimer);
              });
            }, 0);
          }
        };

        VGridGenerator.prototype.onScroll = function onScroll() {
          var _this7 = this;

          this.vGridCellEdit.onScroll();

          var doScroll = function doScroll() {
            var currentScrollTop = _this7.htmlCache.content.scrollTop;
            var currentScrollLeft = _this7.htmlCache.content.scrollLeft;

            if (currentScrollTop !== _this7.scrollVars.lastScrollTop) {
              if (currentScrollLeft !== 0) {
                _this7.htmlCache.content.scrollLeft = _this7.scrollVars.lastScrollLeft;
                _this7.htmlCache.header.scrollLeft = _this7.scrollVars.lastScrollLeft;
              }

              _this7.onScrollClickCancel();

              var isDownScroll = true;
              if (currentScrollTop < _this7.scrollVars.lastScrollTop) {
                isDownScroll = false;
              }

              var isLargeScroll;

              switch (true) {
                case currentScrollTop > _this7.scrollVars.lastScrollTop + _this7.vGridConfig.largeScrollLimit:
                case currentScrollTop < _this7.scrollVars.lastScrollTop - _this7.vGridConfig.largeScrollLimit:
                  isLargeScroll = true;
                  break;

                default:
                  isLargeScroll = false;
              }

              _this7.scrollVars.lastScrollTop = currentScrollTop;

              if (isLargeScroll) {
                if (_this7.vGridConfig.renderOnScrollbarScroll) {
                  _this7.onNormalScrollingLarge(isDownScroll, currentScrollTop);
                } else {
                  _this7.onScrollbarScrolling();
                }
              } else {
                _this7.onNormalScrolling(isDownScroll, currentScrollTop);
              }
            } else {

              if (_this7.htmlCache.content.style.overflowX === "hidden") {
                _this7.htmlCache.content.scrollLeft = 0;
                _this7.scrollVars.lastScrollLeft = 0;
                _this7.htmlCache.header.scrollLeft = 0;
              } else {
                if (_this7.scrollVars.lastScrollLeft !== currentScrollLeft) {
                  currentScrollLeft = _this7.htmlCache.content.scrollLeft;
                  _this7.scrollVars.lastScrollLeft = currentScrollLeft;
                  _this7.htmlCache.header.scrollLeft = currentScrollLeft;
                }
              }

              if (_this7.vGridConfig.lockedColumns > 0) {
                currentScrollLeft = _this7.htmlCache.content.scrollLeft;
                for (var lockedColNo = _this7.vGridConfig.lockedColumns; lockedColNo--;) {

                  var fixHeader = _this7.vGridElement.querySelectorAll("." + _this7.vGridConfig.css.rowHeaderColumn + lockedColNo);
                  var fixRow = _this7.vGridElement.querySelectorAll("." + _this7.vGridConfig.css.rowColumn + lockedColNo);

                  for (var i = fixHeader.length; i--;) {
                    fixHeader[i].style.left = currentScrollLeft + "px";
                    fixHeader[i].style.zIndex = _this7.internalDragDropCount;
                    fixHeader[i].style.position = "relative";
                  }
                  for (var i = fixRow.length; i--;) {
                    fixRow[i].style.left = currentScrollLeft + "px";
                    fixRow[i].style.zIndex = _this7.internalDragDropCount;
                    fixRow[i].style.position = "relative";
                  }
                }
              }
            }
          };
          clearTimeout(this.scrollVars.scrollCallbackTimer);
          if (this.vGridConfig.requestAnimationFrame) {
            requestAnimationFrame(function () {
              doScroll();
            });
          } else {
            doScroll();
          }
          this.scrollVars.scrollCallbackTimer = setTimeout(function () {
            _this7.vGridConfig.onScrolled();
          }, 250);
        };

        VGridGenerator.prototype.updateGridScrollbars = function updateGridScrollbars() {

          var collectionHeight = this.vGridConfig.getCollectionLength() * this.vGridConfig.rowHeight + this.vGridConfig.rowHeight / 2;
          var bodyHeight = this.htmlCache.content.offsetHeight;


          if (collectionHeight <= bodyHeight) {
            this.htmlCache.content.scrollTop = 0;

            this.htmlCache.content.style.overflow = "";
            this.htmlCache.content.style.overflowY = "hidden";
            this.htmlCache.content.style.overflowX = "hidden";
            this.htmlCache.header.style.overflowY = "hidden";
          } else {
            this.htmlCache.content.style.overflow = "";
            this.htmlCache.content.style.overflowY = "scroll";
            this.htmlCache.content.style.overflowX = "hidden";
            this.htmlCache.header.style.overflowY = "scroll";
          }

          if (this.htmlCache.content.offsetWidth - 5 < this.getTotalColumnWidth()) {
            this.htmlCache.content.style.overflowX = "scroll";
          }
        };

        VGridGenerator.prototype.addResizableAndSortableEvent = function addResizableAndSortableEvent() {
          var _this8 = this;

          var resizable = false;
          var screenX;
          var xElement;
          var sortable = false;

          if (this.vGridConfig.sortOnHeaderClick) {
            var orderByClick = function orderByClick(event) {
              if (!sortable && !resizable) {
                _this8.vGridConfig.onOrderBy(event, function (sortorder) {
                  _this8.sortOrder = sortorder;
                  _this8.rebuildGridHeaderHtml();
                });
              }
            };

            var orderBy = this.vGridElement.querySelectorAll("." + this.vGridConfig.css.orderHandle);
            for (var i = 0; i < orderBy.length; i++) {
              orderBy[i].addEventListener("click", orderByClick.bind(this), false);
            }
          }

          if (this.vGridConfig.isResizableHeaders) {
            var x = this.htmlCache.header.querySelectorAll("." + this.vGridConfig.css.rowHeaderCell);
            for (var i = 0; i < x.length; i++) {

              var temp = document.createElement("DIV");
              temp.classList.add(this.vGridConfig.css.resizeHeaderDragHandle);

              temp.onmousedown = function (e) {
                resizable = true;

                if (_this8.vGridConfig.isSortableHeader) {
                  _this8.sortableCtx.option("disabled", resizable);
                }
                screenX = e.screenX;
                xElement = e.target;
                var originalWidth = xElement.offsetParent.style.width;
                var originalWidthx = xElement.offsetParent.style.width;
                var index = xElement.offsetParent.getAttribute("column-no");


                _this8.htmlCache.header.onmousemove = function (e) {
                  _this8.htmlCache.header.onmouseup = function () {
                    setTimeout(function () {
                      resizable = false;
                      if (_this8.vGridConfig.isSortableHeader) {
                        _this8.sortableCtx.option("disabled", resizable);
                      }
                    }, 30);

                    _this8.htmlCache.header.onmouseleave = "";
                    _this8.htmlCache.header.onmousemove = "";
                    _this8.htmlCache.header.onmouseup = "";


                    _this8.vGridConfig.columnWidthArray[index] = parseInt(xElement.offsetParent.style.width);

                    _this8.htmlCache.rowTemplate = null;
                    _this8.correctRowAndScrollbodyWidth();

                    _this8.cacheRowTemplate(null);
                    _this8.recreateViewSlots();
                    _this8.updateGridScrollbars();
                    _this8.fillDataInRows(true);
                  };

                  _this8.htmlCache.header.onmouseleave = function (e) {
                    _this8.htmlCache.header.onmouseup(e);
                  };

                  if (resizable) {
                    var newWidth = parseInt(originalWidth) - (screenX - e.screenX) + "px";
                    _this8.vGridConfig.columnWidthArray[index] = parseInt(newWidth);
                    xElement.offsetParent.style.width = parseInt(originalWidth) - (screenX - e.screenX) + "px";
                    xElement.offsetParent.style.width = parseInt(originalWidthx) - (screenX - e.screenX) + "px";
                    if (_this8.vGridConfig.resizableHeadersAndRows) {
                      var columnsToFix = _this8.htmlCache.content.firstChild.querySelectorAll("." + _this8.vGridConfig.css.rowColumn + index);

                      for (var col = 0; col < columnsToFix.length; col++) {
                        columnsToFix[col].style.width = newWidth;
                      }

                      _this8.correctRowAndScrollbodyWidth();
                      _this8.updateGridScrollbars();
                    }
                  } else {
                    _this8.correctHeaderAndScrollbodyWidth();
                  }
                };
              };

              x[i].appendChild(temp);
            }
          }

          var canMove = false;
          var dragHandles = this.htmlCache.grid.querySelectorAll("." + this.vGridConfig.css.dragHandle);
          [].slice.call(dragHandles).forEach(function (itemEl) {
            itemEl.onmouseenter = function () {
              canMove = true;
            };
            itemEl.onmouseleave = function () {
              canMove = false;
            };
          });

          if (this.vGridConfig.isSortableHeader) {
            this.sortableCtx = new this.vGridSortable(this.htmlCache.header.firstChild.firstChild, function (oldIndex, newIndex) {
              var children = _this8.htmlCache.header.firstChild.firstChild.children;

              var x;
              x = _this8.vGridConfig.attributeArray[oldIndex];
              _this8.vGridConfig.attributeArray.splice(oldIndex, 1);
              _this8.vGridConfig.attributeArray.splice(newIndex, 0, x);

              x = _this8.vGridConfig.filterArray[oldIndex];
              _this8.vGridConfig.filterArray.splice(oldIndex, 1);
              _this8.vGridConfig.filterArray.splice(newIndex, 0, x);

              x = _this8.vGridConfig.headerArray[oldIndex];
              _this8.vGridConfig.headerArray.splice(oldIndex, 1);
              _this8.vGridConfig.headerArray.splice(newIndex, 0, x);

              x = _this8.vGridConfig.columnWidthArray[oldIndex];
              _this8.vGridConfig.columnWidthArray.splice(oldIndex, 1);
              _this8.vGridConfig.columnWidthArray.splice(newIndex, 0, x);

              x = _this8.vGridConfig.colStyleArray[oldIndex];
              _this8.vGridConfig.colStyleArray.splice(oldIndex, 1);
              _this8.vGridConfig.colStyleArray.splice(newIndex, 0, x);

              x = _this8.vGridConfig.colTypeArray[oldIndex];
              _this8.vGridConfig.colTypeArray.splice(oldIndex, 1);
              _this8.vGridConfig.colTypeArray.splice(newIndex, 0, x);

              _this8.htmlCache.rowTemplate = null;
              _this8.cacheRowTemplate(null);
              _this8.rebuildColumns();
              sortable = false;
            }, function (n) {
              sortable = true;
            }, function (n) {
              sortable = false;
            }, function () {
              return canMove;
            });
          }
        };

        VGridGenerator.prototype.addEvents = function addEvents() {
          var _this9 = this;

          var handleClick = function handleClick(e) {
            var currentRow = parseInt(e.currentTarget.getAttribute("row"));
            _this9.vGridConfig.clickHandler(e, currentRow);
            if (_this9.vGridConfig.isMultiSelect !== undefined) {
              _this9.vGridSelection.setHightlight(e, currentRow, _this9);
            }
          };

          var handleTabbing = function handleTabbing(e) {
            var currentRow = parseInt(e.currentTarget.getAttribute("row"));
            _this9.vGridConfig.clickHandler(e, currentRow);
            if (_this9.vGridConfig.isMultiSelect !== undefined) {
              _this9.vGridSelection.setHightlight(e, currentRow, _this9);
            }
          };

          var handleDblClick = function handleDblClick(e) {
            var currentRow = parseInt(e.currentTarget.getAttribute("row"));
            _this9.vGridConfig.clickHandler(e, currentRow);
          };

          var onMouseDownRow = function onMouseDownRow(e) {
            if (e.button === 2) {}
          };

          for (var i = 0; i < this.getRowCacheLength(); i++) {
            var div = this.htmlCache.rowsArray[i].div;

            div.addEventListener("dblclick", handleDblClick.bind(this), false);
            div.addEventListener("click", handleClick.bind(this), false);
            div.addEventListener("tabbing", handleTabbing.bind(this), false);
            div.addEventListener("contextmenu", onMouseDownRow.bind(this), false);
          }

          this.htmlCache.content.addEventListener("scroll", this.onScroll.bind(this));

          this.addResizableAndSortableEvent();
        };

        VGridGenerator.prototype.correctColumnsWidthArray = function correctColumnsWidthArray() {
          var newColumnWidth = [];
          for (var i = 0; i < this.vGridConfig.attributeArray.length; i++) {
            var columnWidth = this.vGridConfig.columnWidthArray[i] || 100;
            newColumnWidth.push(columnWidth);
          }
          this.vGridConfig.columnWidthArray = newColumnWidth;
        };

        VGridGenerator.prototype.setLargeScrollLimit = function setLargeScrollLimit() {
          if (!this.vGridConfig.largeScrollLimit) {
            this.vGridConfig.largeScrollLimit = this.contentHeight * 1.5;
            ;
          }
        };

        VGridGenerator.prototype.addHtml = function addHtml() {
          this.cacheRowTemplate(null);

          this.createGridHtmlWrapper();
          this.createGridHtmlHeaderWrapper();
          this.createGridHtmlContentWrapper();
          this.createGridHtmlFooterWrapper();
          this.createGridHtmlScrollBodyWrapper();
          this.createGridHtmlRowWrapper();
          this.updateGridScrollbars();
        };

        VGridGenerator.prototype.createViewSlots = function createViewSlots() {

          var rows = this.htmlCache.rowsArray;
          for (var i = 0; i < rows.length; i++) {
            var viewFactory = this.vGrid.viewCompiler.compile('<template>' + this.getRowTemplate(this.vGridConfig.attributeArray) + '</template>', this.vGrid.resources);
            var view = viewFactory.create(this.vGrid.container);
            rows[i].viewSlot = new ViewSlot(rows[i].div, true);
            rows[i].viewSlot.add(view);
            rows[i].viewSlot.bind({});
            rows[i].viewSlot.attached();
          }
        };

        VGridGenerator.prototype.recreateViewSlots = function recreateViewSlots() {
          var rows = this.htmlCache.rowsArray;
          for (var i = 0; i < rows.length; i++) {
            rows[i].viewSlot.unbind();
            rows[i].viewSlot.detached();
            rows[i].viewSlot.removeAll();
            rows[i].viewSlot = null;
            rows[i].div.innerHTML = "";
            var viewFactory = this.vGrid.viewCompiler.compile('<template>' + this.getRowTemplate(this.vGridConfig.attributeArray) + '</template>', this.vGrid.resources);
            var view = viewFactory.create(this.vGrid.container);
            rows[i].viewSlot = new ViewSlot(rows[i].div, true);
            rows[i].viewSlot.add(view);
            rows[i].viewSlot.bind({});
            rows[i].viewSlot.attached();
          }
        };

        VGridGenerator.prototype.init = function init(isRebuild) {
          this.correctColumnsWidthArray();
          this.addHtml();
          this.addEvents();
          if (!isRebuild) {
            this.vGridSelection.setMode(this.vGridConfig.isMultiSelect);
          }

          if (this.vGridConfig.predefinedScrolltop) {
            this.setScrollTop(this.vGridConfig.predefinedScrolltop);
          }

          this.createViewSlots();

          this.fillDataInRows(false);

          this.setLargeScrollLimit();
        };

        VGridGenerator.prototype.redrawGrid = function redrawGrid() {
          this.vGridElement.getElementsByClassName(this.vGridConfig.css.wrapper)[0].remove();
          this.htmlCache.rowsArray = [];
          this.htmlCache.header = null;
          this.htmlCache.content = null;
          this.htmlCache.footer = null;
          this.htmlCache.scrollBody = null;
          this.htmlCache.rowTemplate = null;

          this.init(true);
          this.fixHeaderWithBody();
        };

        VGridGenerator.prototype.fixHeaderWithBody = function fixHeaderWithBody() {
          var currentScrollLeft = this.htmlCache.content.scrollLeft;
          this.htmlCache.header.scrollLeft = currentScrollLeft;
          if (this.vGridConfig.lockedColumns > 0) {
            currentScrollLeft = this.htmlCache.content.scrollLeft;
            for (var lockedColNo = this.vGridConfig.lockedColumns; lockedColNo--;) {
              var fix = this.vGridElement.querySelectorAll("." + this.vGridConfig.css.gridColumn + lockedColNo);

              for (var i = fix.length; i--;) {
                fix[i].style.left = currentScrollLeft + "px";
                fix[i].style.zIndex = this.internalDragDropCount;
                fix[i].style.position = "relative";
              }
            }
          }
        };

        VGridGenerator.prototype.rebuildColumns = function rebuildColumns() {
          this.correctColumnsWidthArray();
          this.htmlCache.rowTemplate = null;
          this.cacheRowTemplate(null);
          this.rebuildGridHeaderHtml();
          this.recreateViewSlots();
          this.fillDataInRows(true);
          this.correctRowAndScrollbodyWidth();
          this.updateSelectionOnAllRows();
          this.updateGridScrollbars();
          this.fixHeaderWithBody();
        };

        VGridGenerator.prototype.columnChangeAndCollection = function columnChangeAndCollection(resetScrollToTop) {
          this.correctColumnsWidthArray();
          this.htmlCache.rowTemplate = null;
          this.cacheRowTemplate(null);
          this.rebuildGridHeaderHtml();
          this.fillDataInRows(true);
          this.updateSelectionOnAllRows();
          this.collectionChange(resetScrollToTop);
        };

        VGridGenerator.prototype.collectionChange = function collectionChange(resetScrollToTop, scrollBottom) {
          this.setScrollBodyHeightToVar();
          this.htmlCache.scrollBody.style.height = this.scrollBodyHeight + "px";
          var reset = false;
          if (resetScrollToTop === true) {
            this.htmlCache.content.scrollTop = 0;
          }
          if (this.scrollBodyHeight < this.htmlCache.content.scrollTop || scrollBottom) {
            var collectionLength = this.vGridConfig.getCollectionLength();
            var contentRows = parseInt(this.htmlCache.content.offsetHeight / this.vGridConfig.rowHeight);
            var scrollOffsetHeight = contentRows * this.vGridConfig.rowHeight;
            this.htmlCache.content.scrollTop = collectionLength * this.vGridConfig.rowHeight - scrollOffsetHeight;
          }

          this.updateGridScrollbars();
          this.correctRowAndScrollbodyWidth();
          this.updateSelectionOnAllRows();
          this.fixHeaderWithBody();
          this.onNormalScrollingLarge();
          this.fillDataInRows(true);
          if (scrollBottom) {
            this.htmlCache.content.scrollTop = this.htmlCache.content.scrollTop + this.vGridConfig.rowHeight;
          }

          this.htmlCache.scrollBody.style.height = this.scrollBodyHeight - 1 + "px";
        };

        VGridGenerator.prototype.setRowHeight = function setRowHeight(newHeight) {
          this.vGridConfig.rowHeight = newHeight;
          this.redrawGrid();
        };

        VGridGenerator.prototype.setHeaderHeight = function setHeaderHeight(newHeight) {
          this.vGridConfig.headerHeight = newHeight;
          this.redrawGrid();
        };

        VGridGenerator.prototype.setFooterHeight = function setFooterHeight(newHeight) {
          this.vGridConfig.footerHeight = newHeight;
          this.redrawGrid();
        };

        VGridGenerator.prototype.disableHeaderFilter = function disableHeaderFilter() {
          this.vGridConfig.addFilter = false;
          this.rebuildGridHeaderHtml();
        };

        VGridGenerator.prototype.enableHeaderFilter = function enableHeaderFilter() {
          this.vGridConfig.addFilter = true;
          this.rebuildGridHeaderHtml();
        };

        VGridGenerator.prototype.setHeaderFilterAtBottom = function setHeaderFilterAtBottom() {
          this.vGridConfig.filterOnAtTop = false;
          this.rebuildGridHeaderHtml();
        };

        VGridGenerator.prototype.setHeaderFilterAtTop = function setHeaderFilterAtTop() {
          this.vGridConfig.filterOnAtTop = true;
          this.rebuildGridHeaderHtml();
        };

        VGridGenerator.prototype.setColumns = function setColumns(paramObj) {
          this.vGridConfig.headerArray = paramObj.headerArray;
          this.vGridConfig.attributeArray = paramObj.attributeArray;
          this.vGridConfig.columnWidthArray = paramObj.columnWidthArray;
          this.vGridConfig.filterArray = paramObj.filterArray;
          this.vGridConfig.readOnlyArray = paramObj.readOnlyArray;
          this.vGridConfig.colStyleArray = paramObj.colStyleArray;
          this.vGridConfig.colTypeArray = paramObj.colTypeArray;
        };

        VGridGenerator.prototype.getColumns = function getColumns() {
          return {
            "headerArray": this.vGridConfig.headerArray,
            "attributeArray": this.vGridConfig.attributeArray,
            "columnWidthArray": this.vGridConfig.columnWidthArray,
            "filterArray": this.vGridConfig.filterArray,
            "readOnlyArray": this.vGridConfig.readOnlyArray,
            "colStyleArray": this.vGridConfig.colStyleArray,
            "colTypeArray": this.vGridConfig.colTypeArray
          };
        };

        VGridGenerator.prototype.setLockedColumns = function setLockedColumns(numberOfLockedColumns) {
          this.vGridConfig.lockedColumns = numberOfLockedColumns;
          this.rebuildColumns();
        };

        VGridGenerator.prototype.enableResizableColumns = function enableResizableColumns(option) {
          this.vGridConfig.isResizableHeaders = true;
          this.vGridConfig.resizableHeadersAndRows = option;
          this.rebuildGridHeaderHtml();
        };

        VGridGenerator.prototype.disableResizableColumns = function disableResizableColumns() {
          this.vGridConfig.isResizableHeaders = false;
          this.vGridConfig.resizableHeadersAndRows = false;
          this.rebuildGridHeaderHtml();
        };

        VGridGenerator.prototype.enableSortableColumns = function enableSortableColumns() {
          this.vGridConfig.isSortableHeader = true;
          this.rebuildGridHeaderHtml();
        };

        VGridGenerator.prototype.disableSortableColumns = function disableSortableColumns() {
          this.vGridConfig.isSortableHeader = false;
          this.rebuildGridHeaderHtml();
        };

        VGridGenerator.prototype.setMultiSelection = function setMultiSelection(keepSelection) {
          this.vGridSelection.setMode("multible");
          if (!keepSelection) {
            this.vGridSelection.reset();
          }
          this.updateSelectionOnAllRows();
        };

        VGridGenerator.prototype.setSingleSelection = function setSingleSelection(keepSelection) {
          this.vGridSelection.setMode("single");
          if (!keepSelection) {
            this.vGridSelection.reset();
          }
          this.updateSelectionOnAllRows();
        };

        VGridGenerator.prototype.disableSelection = function disableSelection(keepSelection) {
          this.vGridSelection.setMode(null);
          if (!keepSelection) {
            this.vGridSelection.reset();
          }
          this.updateSelectionOnAllRows();
        };

        VGridGenerator.prototype.getSelectedRows = function getSelectedRows() {
          return this.vGridSelection.getSelectedRows();
        };

        VGridGenerator.prototype.setSelectedRows = function setSelectedRows(sel) {
          this.vGridSelection.setSelectedRows(sel);
          this.updateSelectionOnAllRows();
        };

        VGridGenerator.prototype.scrollBottom = function scrollBottom() {
          var collectionLength = this.vGridConfig.getCollectionLength();
          this.htmlCache.content.scrollTop = collectionLength * this.vGridConfig.rowHeight;
        };

        VGridGenerator.prototype.scrollTop = function scrollTop() {
          this.htmlCache.content.scrollTop = 0;
        };

        VGridGenerator.prototype.setScrollTop = function setScrollTop(newTop) {
          this.htmlCache.content.scrollTop = newTop;
        };

        VGridGenerator.prototype.getScrollTop = function getScrollTop() {
          return this.htmlCache.content.scrollTop;
        };

        VGridGenerator.prototype.updateRow = function updateRow(no, clear) {
          this.fillDataIntoRow(no, clear);
        };

        VGridGenerator.prototype.clearHeaderSortFilter = function clearHeaderSortFilter() {
          this.sortOrder = [];
          this.rebuildGridHeaderHtml();
        };

        VGridGenerator.prototype.setHeaderSortFilter = function setHeaderSortFilter(sortOrder) {
          this.sortOrder = sortOrder;
          this.rebuildGridHeaderHtml();
        };

        VGridGenerator.prototype.enableHeaderSort = function enableHeaderSort() {
          this.vGridConfig.sortOnHeaderClick = true;
          this.rebuildGridHeaderHtml();
        };

        VGridGenerator.prototype.disableHeaderSort = function disableHeaderSort(sortOrder) {
          this.vGridConfig.sortOnHeaderClick = false;
          this.rebuildGridHeaderHtml();
        };

        return VGridGenerator;
      }());

      _export('VGridGenerator', VGridGenerator);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZHcmlkL3YtZ3JpZC1nZW5lcmF0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFROzs7Z0NBU0s7QUFHWCxpQkFIVyxjQUdYLENBQVksV0FBWixFQUF5QixZQUF6QixFQUF1QyxhQUF2QyxFQUFzRCxjQUF0RCxFQUFzRSxhQUF0RSxFQUFxRixLQUFyRixFQUE0RjtnQ0FIakYsZ0JBR2lGOztlQWU1Rix3QkFBd0IsR0Fmb0U7ZUFnQjVGLFlBQVksR0FoQmdGO2VBaUI1RixnQkFBZ0IsRUFqQjRFO2VBa0I1RixhQUFhLEVBbEIrRTtlQW1CNUYsWUFBWSxFQW5CZ0Y7ZUFvQjVGLG1CQUFtQixHQXBCeUU7ZUFxQjVGLG1CQUFtQixFQXJCeUU7ZUF1QjVGLFlBQVk7QUFDVixrQkFBTSxJQUFOO0FBQ0Esb0JBQVEsSUFBUjtBQUNBLHFCQUFTLElBQVQ7QUFDQSxvQkFBUSxJQUFSO0FBQ0EsdUJBQVcsRUFBWDtBQUNBLHdCQUFZLElBQVo7QUFDQSx5QkFBYSxJQUFiLEdBOUIwRjtlQWlDNUYsYUFBYTtBQUNYLDJCQUFlLENBQWY7QUFDQSxzQkFBVSxDQUFWO0FBQ0EsNEJBQWdCLENBQWhCO0FBQ0Esa0JBQU0sS0FBTjtBQUNBLG1CQUFPLElBQVA7QUFDQSw4QkFBa0IsRUFBbEI7QUFDQSxpQ0FBcUIsSUFBckI7WUF4QzBGOztBQUMxRixlQUFLLGNBQUwsR0FBc0IsY0FBdEIsQ0FEMEY7QUFFMUYsZUFBSyxXQUFMLEdBQW1CLFdBQW5CLENBRjBGO0FBRzFGLGVBQUssYUFBTCxHQUFxQixhQUFyQixDQUgwRjtBQUkxRixlQUFLLFlBQUwsR0FBb0IsWUFBcEIsQ0FKMEY7QUFLMUYsZUFBSyxhQUFMLEdBQXFCLGFBQXJCLENBTDBGO0FBTTFGLGVBQUssS0FBTCxHQUFhLEtBQWIsQ0FOMEY7QUFPMUYsZUFBSyxJQUFMLENBQVUsS0FBVixFQVAwRjtTQUE1Rjs7QUFIVyxpQ0FrRFgseUNBQWUsY0FBYztBQUMzQixlQUFLLElBQUksSUFB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d0JBQUwsR0FMOEI7OztBQXpsRHJCLGlDQWttRFgsNkNBQWtCO0FBQ2hCLGlCQUFPLEtBQUssY0FBTCxDQUFvQixlQUFwQixFQUFQLENBRGdCOzs7QUFsbURQLGlDQXVtRFgsMkNBQWdCLEtBQUs7QUFDbkIsZUFBSyxjQUFMLENBQW9CLGVBQXBCLENBQW9DLEdBQXBDLEVBRG1CO0FBRW5CLGVBQUssd0JBQUwsR0FGbUI7OztBQXZtRFYsaUNBNm1EWCx1Q0FBZTtBQUNiLGNBQUksbUJBQW1CLEtBQUssV0FBTCxDQUFpQixtQkFBakIsRUFBbkIsQ0FEUztBQUViLGVBQUssU0FBTCxDQUFlLE9BQWYsQ0FBdUIsU0FBdkIsR0FBbUMsbUJBQW1CLEtBQUssV0FBTCxDQUFpQixTQUFqQixDQUZ6Qzs7O0FBN21ESixpQ0FtbkRYLGlDQUFZO0FBQ1YsZUFBSyxTQUFMLENBQWUsT0FBZixDQUF1QixTQUF2QixHQUFtQyxDQUFuQyxDQURVOzs7QUFubkRELGlDQXduRFgscUNBQWEsUUFBUTtBQUNuQixlQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLFNBQXZCLEdBQW1DLE1BQW5DLENBRG1COzs7QUF4bkRWLGlDQTZuRFgsdUNBQWU7QUFDYixpQkFBTyxLQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLFNBQXZCLENBRE07OztBQTduREosaUNBa29EWCwrQkFBVSxJQUFJLE9BQU87QUFDbkIsZUFBSyxlQUFMLENBQXFCLEVBQXJCLEVBQXlCLEtBQXpCLEVBRG1COzs7QUFsb0RWLGlDQXNvRFgseURBQXdCO0FBQ3RCLGVBQUssU0FBTCxHQUFpQixFQUFqQixDQURzQjtBQUV0QixlQUFLLHFCQUFMLEdBRnNCOzs7QUF0b0RiLGlDQTJvRFgsbURBQW9CLFdBQVc7QUFDN0IsZUFBSyxTQUFMLEdBQWlCLFNBQWpCLENBRDZCO0FBRTdCLGVBQUsscUJBQUwsR0FGNkI7OztBQTNvRHBCLGlDQWdwRFgsK0NBQW1CO0FBQ2pCLGVBQUssV0FBTCxDQUFpQixpQkFBakIsR0FBcUMsSUFBckMsQ0FEaUI7QUFFakIsZUFBSyxxQkFBTCxHQUZpQjs7O0FBaHBEUixpQ0FxcERYLCtDQUFrQixXQUFXO0FBQzNCLGVBQUssV0FBTCxDQUFpQixpQkFBakIsR0FBcUMsS0FBckMsQ0FEMkI7QUFFM0IsZUFBSyxxQkFBTCxHQUYyQjs7O2VBcnBEbEIiLCJmaWxlIjoidkdyaWQvdi1ncmlkLWdlbmVyYXRvci5qcyIsInNvdXJjZVJvb3QiOiIvc3JjIn0=