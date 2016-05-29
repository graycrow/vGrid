'use strict';

System.register(['aurelia-framework', './v-grid'], function (_export, _context) {
  var inject, Optional, customElement, bindable, VGrid, _createClass, _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, VGridCol;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
      Optional = _aureliaFramework.Optional;
      customElement = _aureliaFramework.customElement;
      bindable = _aureliaFramework.bindable;
    }, function (_vGrid) {
      VGrid = _vGrid.VGrid;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('VGridCol', VGridCol = (_dec = customElement('v-grid-col'), _dec2 = inject(Element, VGrid), _dec(_class = _dec2(_class = (_class2 = function () {
        function VGridCol(element, vGrid, valueConverter) {
          _classCallCheck(this, VGridCol);

          _initDefineProp(this, 'vColWidth', _descriptor, this);

          _initDefineProp(this, 'vColAttribute', _descriptor2, this);

          _initDefineProp(this, 'vColHeader', _descriptor3, this);

          _initDefineProp(this, 'vColDefaultFilter', _descriptor4, this);

          _initDefineProp(this, 'vColReadOnly', _descriptor5, this);

          _initDefineProp(this, 'vColCss', _descriptor6, this);

          _initDefineProp(this, 'vColType', _descriptor7, this);

          _initDefineProp(this, 'vColFormater', _descriptor8, this);

          _initDefineProp(this, 'vColEditRaw', _descriptor9, this);

          _initDefineProp(this, 'vColFilterOnKey', _descriptor10, this);

          this.vGrid = vGrid;
          this.element = element;
        }

        VGridCol.prototype.bind = function bind(bindingContext, overrideContext) {
          this.vGrid.vGridConfig.attributeArray.push(this.vColAttribute);
          this.vGrid.vGridConfig.attributes.push(this.vColAttribute);
          this.vGrid.vGridConfig.columnWidthArray.push(this.vColWidth);
          this.vGrid.vGridConfig.headerArray.push(this.vColHeader || "");
          this.vGrid.vGridConfig.filterArray.push(this.vColDefaultFilter || "=");
          this.vGrid.vGridConfig.readOnlyArray.push(this.vColReadOnly === "true" ? true : false);
          this.vGrid.vGridConfig.colStyleArray.push(this.vColCss);
          this.vGrid.vGridConfig.colTypeArray.push(this.vColType ? this.vColType : "text");
          this.vGrid.vGridConfig.filterOnKeyArray.push(this.vColFilterOnKey === "true" ? true : false);
          this.vGrid.vGridConfig.colEditRawArray.push(this.vColEditRaw === "true" ? true : false);
          this.vGrid.vGridConfig.colFormaterArray.push(this.valueConverters(this.vColFormater));
        };

        _createClass(VGridCol, [{
          key: 'valueConverters',
          get: function get() {
            if (this.vGrid) {
              return this.vGrid.viewResources.lookupFunctions.valueConverters;
            }
          }
        }]);

        return VGridCol;
      }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'vColWidth', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'vColAttribute', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'vColHeader', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'vColDefaultFilter', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'vColReadOnly', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'vColCss', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'vColType', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'vColFormater', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'vColEditRaw', [bindable], {
        enumerable: true,
        initializer: null
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'vColFilterOnKey', [bindable], {
        enumerable: true,
        initializer: null
      })), _class2)) || _class) || _class));

      _export('VGridCol', VGridCol);
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZHcmlkL3YtZ3JpZC1jb2wuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPUTtBQUFRO0FBQVU7QUFBZTs7QUFDakM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQkFJSyxtQkFGWixjQUFjLFlBQWQsV0FDQSxPQUFPLE9BQVAsRUFBZ0IsS0FBaEI7QUFpQkMsaUJBaEJXLFFBZ0JYLENBQVksT0FBWixFQUFxQixLQUFyQixFQUE0QixjQUE1QixFQUE0QztnQ0FoQmpDLFVBZ0JpQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUMxQyxlQUFLLEtBQUwsR0FBYSxLQUFiLENBRDBDO0FBRTFDLGVBQUssT0FBTCxHQUFlLE9BQWYsQ0FGMEM7U0FBNUM7O0FBaEJXLDJCQXFDWCxxQkFBSyxnQkFBZ0IsaUJBQWlCO0FBQ3BDLGVBQUssS0FBTCxDQUFXLFdBQVgsQ0FBdUIsY0FBdkIsQ0FBc0MsSUFBdEMsQ0FBMkMsS0FBSyxhQUFMLENBQTNDLENBRG9DO0FBRXBDLGVBQUssS0FBTCxDQUFXLFdBQVgsQ0FBdUIsVUFBdkIsQ0FBa0MsSUFBbEMsQ0FBdUMsS0FBSyxhQUFMLENBQXZDLENBRm9DO0FBR3BDLGVBQUssS0FBTCxDQUFXLFdBQVgsQ0FBdUIsZ0JBQXZCLENBQXdDLElBQXhDLENBQTZDLEtBQUssU0FBTCxDQUE3QyxDQUhvQztBQUlwQyxlQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLFdBQXZCLENBQW1DLElBQW5DLENBQXdDLEtBQUssVUFBTCxJQUFtQixFQUFuQixDQUF4QyxDQUpvQztBQUtwQyxlQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLFdBQXZCLENBQW1DLElBQW5DLENBQXdDLEtBQUssaUJBQUwsSUFBMEIsR0FBMUIsQ0FBeEMsQ0FMb0M7QUFNcEMsZUFBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixhQUF2QixDQUFxQyxJQUFyQyxDQUEwQyxLQUFLLFlBQUwsS0FBc0IsTUFBdEIsR0FBK0IsSUFBL0IsR0FBc0MsS0FBdEMsQ0FBMUMsQ0FOb0M7QUFPcEMsZUFBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixhQUF2QixDQUFxQyxJQUFyQyxDQUEwQyxLQUFLLE9BQUwsQ0FBMUMsQ0FQb0M7QUFRcEMsZUFBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixZQUF2QixDQUFvQyxJQUFwQyxDQUF5QyxLQUFLLFFBQUwsR0FBZ0IsS0FBSyxRQUFMLEdBQWdCLE1BQWhDLENBQXpDLENBUm9DO0FBU3BDLGVBQUssS0FBTCxDQUFXLFdBQVgsQ0FBdUIsZ0JBQXZCLENBQXdDLElBQXhDLENBQTZDLEtBQUssZUFBTCxLQUF5QixNQUF6QixHQUFrQyxJQUFsQyxHQUF5QyxLQUF6QyxDQUE3QyxDQVRvQztBQVVwQyxlQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLGVBQXZCLENBQXVDLElBQXZDLENBQTRDLEtBQUssV0FBTCxLQUFxQixNQUFyQixHQUE4QixJQUE5QixHQUFxQyxLQUFyQyxDQUE1QyxDQVZvQztBQVdwQyxlQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLGdCQUF2QixDQUF3QyxJQUF4QyxDQUE2QyxLQUFLLGVBQUwsQ0FBcUIsS0FBSyxZQUFMLENBQWxFLEVBWG9DOzs7cUJBckMzQjs7OEJBMkJXO0FBQ3BCLGdCQUFJLEtBQUssS0FBTCxFQUFZO0FBQ2QscUJBQU8sS0FBSyxLQUFMLENBQVcsYUFBWCxDQUF5QixlQUF6QixDQUF5QyxlQUF6QyxDQURPO2FBQWhCOzs7O2VBNUJTO3FGQUNWOzs7d0ZBQ0E7OztxRkFDQTs7OzRGQUNBOzs7dUZBQ0E7OztrRkFDQTs7O21GQUNBOzs7dUZBQ0E7OztzRkFDQTs7OzJGQUNBIiwiZmlsZSI6InZHcmlkL3YtZ3JpZC1jb2wuanMiLCJzb3VyY2VSb290IjoiL3NyYyJ9