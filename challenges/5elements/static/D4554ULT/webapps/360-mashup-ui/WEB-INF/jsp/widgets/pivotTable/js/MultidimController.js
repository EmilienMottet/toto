MultidimController = function () {
};

// initialization
MultidimController.getInstance = function () {
  if (!MultidimController.instance_) {
    MultidimController.instance_ = new MultidimController();
  }
  return MultidimController.instance_;
};

MultidimController.prototype.init = function (feedName, wuid, baseUrl) {
  this.feedName = feedName;
  this.wuid = wuid;
  this.baseUrl = baseUrl;
  this.model = MultidimModel.getInstance();
  this.view = MultidimView.getInstance();

  // if (this.model.getState() == MultidimModel.State.NEW) {
  //   this.sendRefineQuery();
  // }
};

// perform request
MultidimController.prototype.sendRefineQuery = function (tr, refineQueryJson, success, error) {
  this.model.setState(MultidimModel.State.LOADING);
  var self = this;
  $.ajax({
    url : this.baseUrl+'multidim/'+this.feedName+'?wuid='+this.wuid+'&q='+encodeURIComponent(self.model.query),
    success: function (data, textStatus, jqXHR) {
      //console.log("\tsuccess");
      tr.find("th").find("span").slice(0,1).removeClass("refine");
      self.model.setRefineData(tr, data);
      self.view.handleRefineView(tr);
      self.model.setState(MultidimModel.State.OK);
      if (typeof success == 'function') {
        success();
      }
    },
    error: function (xhr, errStatus, error) {
      //console.log("status: " + errStatus);
      //console.log("\terror");
      tr.find("th").find("span").slice(0,1).removeClass("refine");
      self.view.handleRefineView(tr);
      self.model.setState(MultidimModel.State.ERROR);
      if (typeof error == 'function') {
        error();
      }
    },
    type: "POST",
    data: refineQueryJson,
    dataType: 'json'
  });
};

// click to show/hide rows
MultidimController.prototype.createRowClickHandlers = function() {
  var self = this,
    tr;
  $("#multidim-table").find("tbody").bind('click', function(e) {
    var target = e.target,
    $target = $(target);
    if (target.nodeName === 'SPAN') {
      if ($target.hasClass("less")) {
        // hide children
        tr = $target.parent().parent();
        self.view.hideChildren(tr);
      } else if ($target.hasClass("more")) {
        // show children
        if ($target.hasClass("refine")) {
          // a refine is needed
          tr = $target.parent().parent();
          var refineQueryJson = self.buildRefineQuery(self.model.getPathTo(tr));
          self.sendRefineQuery(tr, refineQueryJson);
        } else {
          // just enable display
          tr = $target.parent().parent();
          self.view.showChildren(tr);
        }
      }
    }
  });
};


// Helper to build refine query
MultidimController.prototype.buildRefineQuery = function(pathList) {
  var paths = [];
  
  for (var i=0; i<pathList.length; i++) {
    paths.push(pathList[i]);
  }

  return {
    paths: paths.join('///'),
    pr: this.model.pendingRefines
  };
};


