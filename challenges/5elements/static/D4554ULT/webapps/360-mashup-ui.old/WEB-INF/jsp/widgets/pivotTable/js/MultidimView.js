var MultidimView = function () {
};

MultidimView.getInstance = function () {
	if (!MultidimView.instance_) {
		MultidimView.instance_ = new MultidimView();
	}
	return MultidimView.instance_;
};

MultidimView.prototype.init = function (cssId, baseUrl) {
  this.cssId = cssId;
  this.baseUrl = baseUrl;

  this.model = MultidimModel.getInstance();

  this.computeColumnCellNumbers_();
  this.createLinePattern_();
};

// count the number of cell to display on projection to the last column level
//  this considers spaces + data cells
MultidimView.prototype.computeColumnCellNumbers_ = function() {
  var lastColumnCategories = this.model.columns[this.model.columns.length-1].categories,
    indexCount = 0;
  for (var i=0; i<lastColumnCategories.length; i++) {
    indexCount += this.model.measures.length * (1 + lastColumnCategories[i].nbSpaces);
  }
  this.columnCellNumbers_ = indexCount;
};

// creates the current line pattern
//  used when adding new lines to hide/display columns according to the current state
//  vector of boolean: true=displayed, false=hidden
MultidimView.prototype.createLinePattern_ = function() {
  var lastColumnCategories = this.model.columns[this.model.columns.length-1].categories,
    indexCount = 0;
    this.linePattern_ = new Array(this.columnCellNumbers_);

  for (var i=0; i<lastColumnCategories.length; i++) {
    for (var k=0; k<this.model.measures.length * lastColumnCategories[i].nbSpaces; k++) {
      this.linePattern_[indexCount] = false;
      indexCount++;
    }
    for (var k=0; k<this.model.measures.length; k++) {
      this.linePattern_[indexCount] = true;
      indexCount++;
    }
  }
  //console.log("line pattern created with size=" + this.linePattern_.length);
  //console.log("line pattern: " + this.linePattern_);
};

// release unecessary data
MultidimView.prototype.clear_ = function() {
  this.model.rows = null;
  this.model.measures = null;
};

// when clicking on column headers, this shows/hides all the cells in the concerned columns
MultidimView.toggleColumn = function(span, startDim, startIndex, nbIndexes) {
  if (span.hasClass("more")) {
    MultidimView.getInstance().toggleColumn_(true, startDim, startIndex, nbIndexes);
    span.removeClass("more");
    span.addClass("less");
  } else if (span.hasClass("less")) {
    MultidimView.getInstance().toggleColumn_(false, startDim, startIndex, nbIndexes);
    span.removeClass("less");
    span.addClass("more");
  }
};

MultidimView.prototype.toggleColumn_ = function(enableDisplay, startDim, startIndex, nbIndexes) {
  var model = this.model,
    columns = this.model.columns,
    rows = this.model.rows,
    thead = $("#multidim-table thead"),
    tbody = $("#multidim-table tbody"),
    deltaColSpan = 0,
    cat,
    i,j;

  //console.log("entering toggleColumn with enableDisplay=" + enableDisplay + " startDim=" + startDim + " startIndex=" + startIndex + " nbIndexes=" + nbIndexes);

  // handle the header THs

  // headers on the top of the concerned header: handle the colspans and compute deltaColSpan
  for (i=startDim; i>=0 && i<columns.length-1; i--) {
    //console.log("DIMENSION=" + i + " (<= startDim)");
    var tr = thead.find("tr").slice(i, i+1);

    // first compute the index of the th
    var nbAtomCells = 0;
    var thIndex = 1; // top-left cell
    for (var j=0; j<columns[i].categories.length; j++) {
      cat = columns[i].categories[j];
      if (nbAtomCells <= startIndex && nbAtomCells+cat.nbLeaves >= startIndex + nbIndexes) {
        thIndex += this.model.measures.length * cat.nbSpaces;
        break;
      }

      nbAtomCells += cat.nbLeaves;
      thIndex += 1 + this.model.measures.length * cat.nbSpaces;
    }

    if (i == startDim) {
      deltaColSpan = enableDisplay ? (cat.colSpan - 1) : (1 - cat.colSpan);
    } else {
      cat.colSpan += deltaColSpan;
    }

    // second modify its colspan
    $(tr).find("th").slice(thIndex, thIndex+1).attr("colSpan", function(i, val) {
      //console.log("\tchange colspan thIndex=" + thIndex + " from=" + val + " delta=" + deltaColSpan + " to=" + (parseInt(val) + model.measures.length * deltaColSpan));
      return parseInt(val) + model.measures.length * deltaColSpan;
    });
  }

  var firstTdIndexInLastDim = 0, firstPatternIndexInLastDim = 0, lastPatternIndexInLastDim = 0, categoryTdStartIndex = 0, categoryPatternStartIndex = 0;

  // headers on the bottom of the concerned header: handle the display
  for (i=startDim+1; i<columns.length; i++) {

    //console.log("dimension " + i + " (>dim) startIndex=" + startIndex + " nbIndexes=" + nbIndexes);
    var tr = thead.find("tr").slice(i, i+1);

    // first compute the index of the th
    var nbAtomCells = 0;
    var tdIndex = 1;
    var patternIndex = 0;
    var yetMatched = false;
    for (j=0; j<columns[i].categories.length; j++) {
      cat = columns[i].categories[j];
      //console.log("\tcol=" + j + " nbAtomCells=" + nbAtomCells);
      if (nbAtomCells >= startIndex) {
        if (nbAtomCells < startIndex + nbIndexes) {

          // keep higher dimensions states when hidding/displaying lower dimensions
          var reallyEnableDisplay = enableDisplay;
          if (!enableDisplay) {
            if (!cat.blockingFathers) {
              cat.blockingFathers = [startDim];
            } else {
              cat.blockingFathers.push(startDim);
            }
          } else {
            var tempBlockingFathers = [];
            if (cat.blockingFathers) {
              for (var l=0; l<cat.blockingFathers.length; l++) {
                if (cat.blockingFathers[l] != startDim) {
                  tempBlockingFathers.push(cat.blockingFathers[l]);
                }
              }
            }
            cat.blockingFathers = tempBlockingFathers;
            reallyEnableDisplay = cat.blockingFathers.length == 0;
          }
          //console.log("\t\tnew blocking List:");
          var minBlockingDim = cat.blockingFathers.length > 0 ? cat.blockingFathers[0] : startDim;
          if (cat.blockingFathers) {
            for (var l=0; l<cat.blockingFathers.length; l++) {
              //console.log("\t\t\t" + l + " -> " + cat.blockingFathers[l]);
              if (cat.blockingFathers[l] < minBlockingDim) {
                minBlockingDim = cat.blockingFathers[l];
              }
            }
          }

          // SPACES MANAGEMENT
          if (!yetMatched) {
            firstPatternIndexInLastDim = patternIndex;
            firstTdIndexInLastDim = tdIndex;
          }
          categoryTdStartIndex = minBlockingDim == startDim ? firstTdIndexInLastDim : tdIndex;
          categoryPatternStartIndex = minBlockingDim == startDim ? firstPatternIndexInLastDim : patternIndex;
          // update line pattern
          if (cat.nbSpaces > 0) {
            //console.log("\t\thiding all spaces, from thIndex=" + tdIndex + " to " + (tdIndex + this.model.measures.length * cat.nbSpaces - 1));
            $(tr).find("th").slice(tdIndex, tdIndex + this.model.measures.length * cat.nbSpaces).css({'display':'none'});
            for (var k=0; k<this.model.measures.length * cat.nbSpaces; k++) {
              this.linePattern_[patternIndex+k] = false;
            }
            tdIndex += this.model.measures.length * cat.nbSpaces;
            patternIndex += this.model.measures.length * cat.nbSpaces;
          }

          // if the category is not displayed, pick the first space instead
          if (cat.blockingFathers.length > 0) {
            /* var indexOfSpaceToDisplay = i - minBlockingDim - 1; */
            var indexOfSpaceToDisplay = cat.nbSpaces - (i - minBlockingDim);
            //console.log("\t\tblocking father exists, index of internal space to keep=" + indexOfSpaceToDisplay);
            if (indexOfSpaceToDisplay >= 0 && indexOfSpaceToDisplay < cat.nbSpaces) {
              var realTdIndexOfSpaceToDisplay = this.model.measures.length * indexOfSpaceToDisplay + categoryTdStartIndex;
              var realPatternIndexOfSpaceToDisplay = this.model.measures.length * indexOfSpaceToDisplay + categoryPatternStartIndex;
              //console.log("\t\tsave space at index=" + realTdIndexOfSpaceToDisplay);
              $(tr).find("th").slice(realTdIndexOfSpaceToDisplay, realTdIndexOfSpaceToDisplay + this.model.measures.length).css({'display':'table-cell'});
              for (var l=0; l<this.model.measures.length; l++) {
                this.linePattern_[realPatternIndexOfSpaceToDisplay + l] = true;
              }
            }
          }
          yetMatched = true;
          // END SPACES MANAGEMENT

          // treat real cell
          //console.log("\t\ttreating real cell at index=" + tdIndex);
          if (reallyEnableDisplay) {
            $(tr).find("th").slice(tdIndex, tdIndex + 1).css({'display':'table-cell'});
            //console.log("\t\tenable i=" + i + " thIndex=" + tdIndex);
          } else {
            $(tr).find("th").slice(tdIndex, tdIndex + 1).css({'display':'none'});
            //console.log("\t\tdisable i=" + i + " thIndex=" + tdIndex);
          }
          if (i == columns.length-1) {
            for (var l=0; l<this.model.measures.length; l++) {
              this.linePattern_[patternIndex+l] = reallyEnableDisplay;
            }
          }
          tdIndex += 1;
          patternIndex += this.model.measures.length;
          lastPatternIndexInLastDim = patternIndex;
        } else {
          //console.log("\t\tleaving loop");
          break;
        }
      } else {
        //console.log("\t\tupdating thIndex from " + tdIndex + " to " + (tdIndex + 1 + cat.nbSpaces));
        tdIndex += 1 + this.model.measures.length * cat.nbSpaces;
        patternIndex += this.model.measures.length * (1 + cat.nbSpaces);
      }

      nbAtomCells += cat.nbLeaves;
    }
  }

  //console.log("new line pattern (firstPatternIndexInLastDim=" + firstPatternIndexInLastDim + " lastPatternIndexInLastDim=" + lastPatternIndexInLastDim + ")");;
  //console.log(this.linePattern_);

  // handle the body TDs
  var view = this;
  thead.find("tr").slice(columns.length).each(function() {
    //console.log("apply on th");
    view.applyLinePatternOnTh_($(this), firstPatternIndexInLastDim, lastPatternIndexInLastDim);
  });
  tbody.find("tr").each(function() {
    //console.log("apply on td");
    view.applyLinePattern_($(this), firstPatternIndexInLastDim, lastPatternIndexInLastDim);
  });
};


MultidimView.prototype.handleRefineView = function(tr) {
  var children = tr.data("children"),
    currentTr,
    nextTr;

  if (children) {
    currentTr = tr;
    for (var i=0; i<children.length; i++) {
      nextTr = children[i];

      // add to the view
      currentTr.after(nextTr);

      // apply pattern on line
      this.applyFullLinePattern_(nextTr);

      currentTr = nextTr;
    }
  }

  // display policy
  this.showChildren(tr);
};

// apply the pattern on the full provided line
MultidimView.prototype.applyFullLinePattern_ = function(tr) {
  this.applyLinePattern_(tr, 0, this.columnCellNumbers_-1);
};

// apply the pattern on the provided line (patternStart <= indexes < patternEnd)
MultidimView.prototype.applyLinePattern_ = function(tr, patternStart, patternEnd) {
  var linePattern = this.linePattern_,
    i=patternStart;

  $("td", tr).slice(patternStart, patternEnd+1).each(function() {
    if (linePattern[i]) {
      $(this).css({'display':'table-cell'});
    } else {
      $(this).css({'display':'none'});
    }
    i++;
  });
};

// apply the pattern on the provided line (patternStart <= indexes < patternEnd)
MultidimView.prototype.applyLinePatternOnTh_ = function(tr, patternStart, patternEnd) {
  var linePattern = this.linePattern_,
    i=patternStart;

  $("th", tr).slice(patternStart+1, patternEnd+2).each(function() {
    if (linePattern[i]) {
      $(this).css({'display':'table-cell'});
    } else {
      $(this).css({'display':'none'});
    }
    i++;
  });
};


// Show/hide rows
MultidimView.prototype.hideChildren = function(tr) {
  var toProcess,
    inProcess,
    children = tr.data("children");

  if (children) {
    toProcess = children.slice();
  }

  while (toProcess.length > 0) {
    inProcess = toProcess.pop();
    inProcess.css({"display":"none"});
    this.markAsUndrilled(inProcess);
    children = inProcess.data("children");
    if (children) {
      toProcess = toProcess.concat(children.slice());
    }
  }

  this.markAsUndrilled(tr);
};

MultidimView.prototype.showChildren = function(tr) {
  var toProcess,
    inProcess,
    children;

  toProcess = [tr];

  while (toProcess.length > 0) {
    inProcess = toProcess.pop();
    inProcess.css({"display":"table-row"});
    this.markAsDrilled(inProcess);
    children = inProcess.data("children");
    if (children && children.length > 0) {
      this.markAsDrilled(inProcess);
    } else if (inProcess.find("th").find("span").slice(0,1).hasClass("refine")) {
      this.markAsUndrilled(inProcess);
    } else {
      this.markAsNeutral(inProcess);
    }
    if (children) {
      toProcess = toProcess.concat(children.slice());
    }
  }
};

MultidimView.prototype.markAsDrilled = function(tr) {
  var span = tr.find("th").slice(0,1).find("span").slice(0,1);

  span.addClass("less");
  span.removeClass("more");
};

MultidimView.prototype.markAsUndrilled = function(tr) {
  var span = tr.find("th").slice(0,1).find("span").slice(0,1);

  span.addClass("more");
  span.removeClass("less");
};

MultidimView.prototype.markAsNeutral = function(tr) {
  var span = tr.find("th").slice(0,1).find("span").slice(0,1);

  span.removeClass("more");
  span.removeClass("less");
};
