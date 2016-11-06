export class RowScrollEvents {

  constructor(element, htmlCache) {
    this.htmlCache = htmlCache;
    this.element = element;
    this.timer = null;
    this.largeScroll = false;
    this.collectionLength = 0;
    this.largeScrollUpdateDelay = 0;
  }


  init(rowHeight) {
    this.rowCache = this.htmlCache.rowCache;
    this.rowHeight = rowHeight;
    this.updateInternalHtmlCache();
    this.createRowCache();
    this.addEventListener();
  }


  createRowCache() {
    for (let i = 0; i < this.cacheLength; i++) {
      this.rowCache.push({
        left: this.leftRows[i],
        main: this.mainRows[i],
        right: this.rightRows[i],
        group: this.groupRows[i],
        top: this.rowHeight * i,
        row: i
      });
      this.leftRows[i].avgRow = i;
      this.mainRows[i].avgRow = i;
      this.rightRows[i].avgRow = i;
      this.groupRows[i].avgRow = i;
    }
  }


  updateInternalHtmlCache() {

    this.left = this.htmlCache.avg_content_left_scroll;
    this.main = this.htmlCache.avg_content_main_scroll;
    this.right = this.htmlCache.avg_content_right_scroll;
    this.scroller = this.htmlCache.avg_content_right_scroll;


    this.leftRows = this.htmlCache.avg_left_rows;
    this.mainRows = this.htmlCache.avg_main_rows;
    this.rightRows = this.htmlCache.avg_right_rows;
    this.groupRows = this.htmlCache.avg_group_rows;

    this.cacheLength = this.leftRows.length;

    //this.contentHeight = this.htmlCache.avg_content_main.offsetHeight;

  }


  get contentHeight() {
    return this.htmlCache.avg_content_main.offsetHeight;
  }


  onScroll(event) {
    let isDown = event.detail.isDown;
    let isScrollBarScrolling = event.detail.isScrollBarScrolling;
    let newTopPosition = event.detail.newTopPosition;

    if (this.largeScroll || isScrollBarScrolling) {
      if (this.largeScrollUpdateDelay) {
        clearTimeout(this.timer);
        this.largeScroll = true;
        this.timer = setTimeout(() => {
          this.largeScroll = false;
          this.scrollScrollBar(newTopPosition, isDown);
        }, this.largeScrollUpdateDelay);
      } else {
        this.scrollScrollBar(newTopPosition, isDown);
      }
    } else {
      switch (true) {
        case isDown && !isScrollBarScrolling:
          this.scrollNormal(newTopPosition, true);
          break;
        case !isDown && !isScrollBarScrolling:
          this.scrollNormal(newTopPosition, false);
          break;
      }
    }
  }


  setRowTopValue(cache, top) {
    cache.left.style.transform = `translate3d(0px,${top}px, 0px)`;
    cache.main.style.transform = `translate3d(0px,${top}px, 0px)`;
    cache.right.style.transform = `translate3d(0px,${top}px, 0px)`;
    cache.group.style.transform = `translate3d(0px,${top}px, 0px)`;
    cache.left.avgRow = Math.floor(top / this.rowHeight);
    cache.main.avgRow = Math.floor(top / this.rowHeight);
    cache.right.avgRow = Math.floor(top / this.rowHeight);
    cache.group.avgRow = Math.floor(top / this.rowHeight);
    cache.top = top;
    cache.row = Math.floor(top / this.rowHeight);
  }


  scrollNormal(newTopPosition, downScroll) {

    let rowHeight = this.rowHeight;
    let currentRow = Math.floor(newTopPosition / rowHeight);
    let cacheHeight = rowHeight * this.cacheLength;

    for (let i = 0; i < this.cacheLength; i++) {

      let cache = this.rowCache[i];
      let top = this.rowCache[i].top;
      let update = false;
      let newTop;

      if (!downScroll) {
        if (top > (newTopPosition + this.contentHeight)) {
          update = true;
          newTop = top - cacheHeight;
          currentRow = (top - cacheHeight) / rowHeight;
        }
      } else {

        if (top < (newTopPosition - rowHeight)) {
          update = true;
          newTop = top + cacheHeight;
          currentRow = (top + cacheHeight) / rowHeight;
        }
      }

      if (update === true && currentRow >= 0 && currentRow <= this.collectionLength - 1) {
        this.setRowTopValue(cache, newTop);
        this.triggerRebindRowEvent(currentRow, cache, downScroll);
      }

    }

    //sort array
    this.rowCache.sort(
      function (a, b) {
        return parseInt(a.top) - parseInt(b.top);
      });
  }


  scrollScrollBar(newTopPosition, downScroll) {

    if (this.collectionLength <= this.cacheLength) {
      newTopPosition = 0;
    }

    //vars
    let rowHeight = this.rowHeight;
    let bodyHeight = this.contentHeight;
    let currentRow = Math.floor(newTopPosition / rowHeight);
    let firstRow = Math.floor(newTopPosition / rowHeight);
    let currentRowTop = rowHeight * currentRow;
    let firstRowTop = rowHeight * firstRow;
    let collectionLength = this.collectionLength;


    //for setting after
    let setAfter = (no) => {
      let row = this.rowCache[no];
      this.setRowTopValue(row, currentRowTop);
      currentRowTop = currentRowTop + rowHeight;
    };


    //for setting before (when hitting bottom)
    let setBefore = (no) => {
      let row = this.rowCache[no];
      firstRowTop = firstRowTop - rowHeight;
      this.setRowTopValue(row, firstRowTop);
    };


    //for setting before (when hitting bottom)
    let setHiddenFromView = (no) => {
      let row = this.rowCache[no];
      this.setRowTopValue(row, -(currentRowTop + (rowHeight * 50)));
    };


    //loop row html cache
    for (let i = 0; i < this.cacheLength; i++) {
      let moved = false;
      switch (true) {
        case currentRow >= 0 && currentRow <= collectionLength - 1:
          setAfter(i);
          moved = true;
          break;
        case currentRow >= collectionLength && (collectionLength * rowHeight) >= bodyHeight:
          setBefore(i);
          moved = true;
          break;
      }
      if (!moved) {
        if (currentRow >= collectionLength && (currentRowTop - rowHeight) >= bodyHeight) {
          setHiddenFromView(i);
        } else {
          //if this triggers the collection have been removed, so really just need to place out the rows
          if (currentRow >= collectionLength) {
            setAfter(i);
          }
        }
      }

      currentRow++;
    }


    //I now sort the array again.
    this.rowCache.sort(
      function (a, b) {
        return parseInt(a.top) - parseInt(b.top);
      });

    //update row data
    this.triggerRebindAllRowsEvent(downScroll, this.rowCache);
  }


  addEventListener() {
    this.onScrollBinded = this.onScroll.bind(this);
    this.element.addEventListener("avg-scroll", this.onScrollBinded);
  }

  removeEventListener() {
    this.element.removeEventListener("avg-scroll", this.onScrollBinded);
  }


  setCollectionLength(length) {
    this.collectionLength = length;
  }

  triggerRebindRowEvent(currentRow, rowCache, downScroll) {
    let event = new CustomEvent("avg-rebind-row", {
      detail: {
        currentRow: currentRow,
        rowCache: rowCache,
        downScroll: downScroll
      },
      bubbles: false
    });
    this.element.dispatchEvent(event);
  }


  triggerRebindAllRowsEvent(downScroll, rowCache) {
    let event = new CustomEvent("avg-rebind-all-rows", {
      detail: {
        downScroll: downScroll,
        rowCache: rowCache
      },
      bubbles: false
    });
    this.element.dispatchEvent(event);
  }


}
