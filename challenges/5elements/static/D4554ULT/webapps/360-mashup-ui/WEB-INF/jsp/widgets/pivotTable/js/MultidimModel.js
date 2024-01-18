MultidimModel = function () {
  this.state = MultidimModel.State.NEW;
  this.refineData = null;
};

// initialization
MultidimModel.getInstance = function () {
  if (!MultidimModel.instance_) {
    MultidimModel.instance_ = new MultidimModel();
  }
  return MultidimModel.instance_;
};

MultidimModel.prototype.init = function () {
  if (this.getState() == MultidimModel.State.NEW) {
    this.sendGetAlerts();
  }
};

// model state
MultidimModel.State = {
  NEW:0,
  LOADING:1,
  OK:2,
  ERROR:3
};

MultidimModel.prototype.getState = function() {
  return this.state;
};

MultidimModel.prototype.setState = function(state) {
  this.state = state;
};

// set data
MultidimModel.prototype.setData = function(jsonObj) {
  //console.log(jsonObj);
  var data = new Response().jsonDeserialize(jsonObj);
  this.columns = data.columns;
  this.rows = data.rows;
  this.measures = data.measures;
  this.query = data.query;
  this.feedName = data.feedName;
  this.pendingRefines = data.pendingRefines;

  this.initializeColumns();
};

MultidimModel.prototype.setAdditionalRows = function(additionalRows) {
  this.additionalRows = additionalRows;
  this.totalExpectedRows = additionalRows.length + this.rows.length;
};

MultidimModel.prototype.initializeColumns = function() {
  for (var i=0; i<this.columns.length; i++) {
    for (var j=0; j<this.columns[i].categories.length; j++) {
      this.columns[i].categories[j].colSpan = this.columns[i].categories[j].nbLeaves;
    }
  }
};

MultidimModel.prototype.initializeRows = function() {
  var self = this,
    rows = this.rows,
    index = 0,
    indexMax = rows[rows.length-1].categories.length-1,
    headersState = [],
    keepOn = true,
    lowestDimensionIndex,
    trIndex,
    tr,
    fatherTr,
    trList,
    cat,
    i;

  trList = $("#multidim-table").find("tbody").find("tr");

  for (i=0; i<rows.length; i++) {
    cat = rows[i].categories[0];
    headersState.push({
      title: (cat.title != null && cat.title.length > 0) ? cat.title : cat.path,
      path: cat.path,
      limit: cat.nbLeaves,
      offset: 0,
      tr: trList.slice(i, i+1)
    });
  }

  lowestDimensionIndex = 0;
  trIndex = rows.length-1;

  while (keepOn) {
    while (lowestDimensionIndex < rows.length) {
      tr = headersState[lowestDimensionIndex].tr;
      tr.data("path", headersState[lowestDimensionIndex].path);
      if (lowestDimensionIndex > 0) {
        fatherTr = headersState[lowestDimensionIndex-1].tr;
        this.updateFatherChildrenHierarchy(fatherTr, tr);
      }

      lowestDimensionIndex++;
    }

    // find next header dimensions
    index++;

    if (index > indexMax) {
      // last category reached
      break;
    }

    lowestDimensionIndex = 0;
    for (i=rows.length-1; i>=0; i--) {
      if (headersState[i].limit <= index) {
        headersState[i].offset++;

        cat = this.getCategoryAt(i, headersState);
        headersState[i].title = ((cat.title != null && cat.title.length > 0) ? cat.title : cat.path);
        headersState[i].path = cat.path;
        headersState[i].limit += cat.nbLeaves;

        lowestDimensionIndex = i;
      } else {
        // no need to check other dimensions
        break;
      }
    }
    for (i=lowestDimensionIndex; i<rows.length; i++) {
      trIndex++;
      headersState[i].tr = trList.slice(trIndex, trIndex+1);
    }
  }
};


MultidimModel.prototype.getCategoryAt = function(dim, headersState) {
  return this.rows[dim].categories[headersState[dim].offset];
};

MultidimModel.prototype.getPathTo = function(tr) {
  var nextTr = tr,
    trList = [],
    pathList = [];

  trList.push(tr);
  nextTr = tr.data("father");

  while (nextTr) {
    trList.push(nextTr);
    nextTr = nextTr.data("father");
  }

  while (trList.length > 0) {
    pathList.push(trList.pop().data("path"));
  }

  return pathList;
};

// update model after refine
MultidimModel.prototype.setRefineData = function(tr, jsonObj) {
  //console.log(jsonObj);
  var refineData = new Response().jsonDeserialize(jsonObj);
  var columns = this.columns,
    lastLevelIndex = refineData.rows.length-1,
    lastLevelColumnCategories = refineData.columns[refineData.columns.length-1].categories,
    lastLevelRowCategories = refineData.rows[lastLevelIndex].categories,
    cellsByRegularLine = 0,
    cellsByRefineLine = 0,
    currentTr,
    trString,
    fatherRowUrl,
    currentRowAdditionalUrl,
    columnUrl,
    i=0;

  // build adapter mask
  var adapter = this.buildAdapter_(columns, refineData.columns);
  //console.log("adapter: " + adapter);
  currentTr = tr;

  // compute size of one line in refine buffer
  for (i=0; i<lastLevelColumnCategories.length; i++) {
    cellsByRefineLine += lastLevelColumnCategories[i].nbSpaces + 1;
  }

  // compute size of one regular line
  for (i=0; i<columns[columns.length-1].categories.length; i++) {
    cellsByRegularLine += columns[columns.length-1].categories[i].nbSpaces + 1;
  }

  // compute father's row url
  fatherRowUrl = $(tr).find("th").find("a").attr('href');

  // compute url column pattern
  columnUrl = this.computeColumnUrlPattern(tr);

  //console.log("lastLevelIndex=" + lastLevelIndex);

  for (i=0; i<lastLevelRowCategories.length; i++) {
    // current row additional refine
    currentRowAdditionalUrl = "&" + this.feedName + ".r=f%2F" + refineData.rows[refineData.rows.length-1].id + "%2F" + lastLevelRowCategories[i].path;

    trString = '<tr class="hover ' + (i%2 == 0 ? 'odd' : 'even') + '">';
    trString += '<th class="row-header-' + lastLevelIndex + '" >'
                  + '<span class="' +  ((lastLevelIndex+1 < this.totalExpectedRows) ? 'more refine' : 'neutral') + '">&nbsp;&nbsp;&nbsp;&nbsp;</span>'
                  + '<a href="' + fatherRowUrl + currentRowAdditionalUrl + '">'
                    + ((lastLevelRowCategories[i].title && lastLevelRowCategories[i].title.length>0) ? lastLevelRowCategories[i].title : lastLevelRowCategories[i].path)
                  + '</a>'
              + '</th>';

    if (columns.length == 0) {
      trString += '<td></td>';
    } else {
      // get the columns of the last dimension header
      for (var k=0; k<cellsByRegularLine; k++) {
        if (k<adapter.length && adapter[k] != null) {
          for (var l=0; l<this.measures.length; l++) {
            if (refineData.measures[l].type == "int") {
              label = refineData.measures[l].longData[i*cellsByRefineLine + adapter[k]];
              if (label != '9223372036854776000') {
                trString += '<td><a href="' + columnUrl[k] + currentRowAdditionalUrl + '">' + label + '</a></td>';
              } else {
                trString += '<td></td>';
              }
            } else {
              label = refineData.measures[l].doubleData[i*cellsByRefineLine + adapter[k]];
              if (label != '9223372036854776000') {
                trString += '<td><a href="' + columnUrl[k] + currentRowAdditionalUrl + '">' + (refineData.measures[l].decimals >= 0 ? parseFloat(Math.round(label * 100) / 100).toFixed(refineData.measures[l].decimals) : label) + '</a></td>';
              } else {
                trString += '<td></td>';
              }
            }
          }
        } else {
          for (var l=0; l<this.measures.length; l++) {
            trString += '<td></td>';
          }
        }
      }
    }

    trString += '</tr>';
    currentTr = $(trString);
    currentTr.data("path", lastLevelRowCategories[i].path);

    // update father/children information
    this.updateFatherChildrenHierarchy(tr, currentTr);
  }
};

MultidimModel.prototype.buildAdapter_ = function(targetColumns, refineColumns) {
  var adapter = [],
    targetInfo = [],
    refineInfo = [],
    numberOfDimensions = targetColumns.length,
    targetAtomMin,
    targetAtomMax,
    refineAtomCount = 0,
    targetThCount = 0,
    refineThCount = 0,
    targetCat,
    refineCat,
    lowestNotFoundDimension = numberOfDimensions;

  for (var i=0; i<numberOfDimensions; i++) {
    refineInfo[i] = {
      atomStart: 0,
      offset: 0
    };

    targetInfo[i] = {
      atomStart: 0,
      offset: 0
    };
  }

  // loop on all refine categories
  while (refineAtomCount < refineColumns[refineColumns.length-1].categories.length) {
    //console.log("\tnew refine");

    // loop on each dimension
    for (var i=0; i<numberOfDimensions; i++) {
      //console.log("\t\tdim=" + i);

      // category change for this dimension
      if (refineAtomCount == 0 || refineAtomCount >= refineInfo[i].atomStart + refineColumns[i].categories[refineInfo[i].offset].nbLeaves) {
        //console.log("\t\t\tcategory change");

        if (lowestNotFoundDimension < i) {
          //console.log("\t\t\tfather not found, fast cut");
          refineThCount++;
          continue;
        }

        // get the next position in the refine tree
        refineCat = refineColumns[i].categories[refineInfo[i].offset];

        if (refineAtomCount > 0) {
          refineInfo[i].atomStart += refineCat.nbLeaves;
          refineInfo[i].offset++;
          refineCat = refineColumns[i].categories[refineInfo[i].offset];
        }

        //console.log("\t\t\trefine cat=" + refineCat.path + " at refineAtomCount=" + refineAtomCount);

        if (i == 0) {
          targetAtomMin = 0;
          targetAtomMax = targetColumns[targetColumns.length-1].categories.length;
        } else {
          targetAtomMin = targetInfo[i-1].atomStart;
          targetAtomMax = targetAtomMin + targetColumns[i-1].categories[targetInfo[i-1].offset].nbLeaves;
        }
        targetThCount = 0;

        targetInfo[i].atomStart = 0;
        targetInfo[i].offset = 0;

        lowestNotFoundDimension = i;

        // find the category in the target tree if existing
        while (targetInfo[i].offset < targetColumns[i].categories.length && targetInfo[i].atomStart < targetAtomMax) {
          //console.log("\t\t\t\tloop with offset=" + targetInfo[i].offset + " targetAtomMin=" + targetAtomMin + " targetAtomMax=" + targetAtomMax);
          targetCat = targetColumns[i].categories[targetInfo[i].offset];

          // in the good interval, compare pathes
          if (targetInfo[i].atomStart >= targetAtomMin) {
            //console.log("\t\t\t\t\ttargetCat=" + targetCat.path + " in interval");

            if (this.getPath(targetCat) == this.getPath(refineCat)) {
              //console.log("\t\t\t\t\tfound target cat = refine cat");
              if (i < numberOfDimensions - 1) {
                targetThCount = 0;
                var atom = 0;
                var lastLevelCategoriesInData = targetColumns[targetColumns.length-1].categories;
                while (atom < lastLevelCategoriesInData.length && atom < targetInfo[i].atomStart) {
                  targetThCount += lastLevelCategoriesInData[atom].nbSpaces + 1;
                  atom++;
                }
              }
              targetThCount += targetCat.nbSpaces;
              lowestNotFoundDimension = i+1;
              break;
            }
          } else {
            //console.log("\t\t\t\t\ttargetCat=" + targetCat.path + " not in interval yet");
          }

          // condition not satisfied, increment
          targetInfo[i].atomStart += targetCat.nbLeaves;
          targetInfo[i].offset++;
          targetThCount += 1 + targetCat.nbSpaces;
          //console.log("\t\t\t\t\tincrement, new targetThCount=" + targetThCount);
        }
        if (lowestNotFoundDimension > i) {
          //console.log("\t\t\tfound, updating adapter for targetTh=" + targetThCount + " refineTh=" + refineThCount);
          adapter[targetThCount] = refineThCount;
        } else {
          //console.log("\t\t\tnot found, nothing to update in adapter");
        }
        refineThCount++;
      }
    }
    refineAtomCount++;
  }

  return adapter;
};

MultidimModel.prototype.getPath = function(cat) {
  if (cat.path && cat.path.length > 0) {
    return cat.path;
  }
  return cat.title;
};

MultidimModel.prototype.updateFatherChildrenHierarchy = function(fatherTr, childTr) {
  // add to father's children
  if (fatherTr.data("children")) {
    fatherTr.data("children").push(childTr);
  } else {
    fatherTr.data("children", [childTr]);
  }

  // update children's father
  childTr.data("father", fatherTr);
};

MultidimModel.prototype.computeColumnUrlPattern = function(tr) {
  var self = this,
    pattern = [],
    cellUrl;

  $(tr).find('td').each(function() {
    pattern.push($(this).find('a').attr('href'));
  });

  return pattern;
};


