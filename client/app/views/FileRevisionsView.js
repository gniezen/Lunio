/**
 * view managing the list of revisions of a file
 * @author Patrick Oladimeji
 * @date 1/26/14 10:11:11 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, Backbone, Handlebars */
define(function (require, exports, module) {
    "use strict";
    var template = require("text!app/templates/fileRevisionView.html"),
        RevisionCommentsView = require("app/views/RevisionCommentsView"),
        Ajax     = require("app/model/Ajax"),
        FileUtils = require("app/utils/FileUtils");
    
    var container = "#content-revisions";
    
    var FileRevisionsView = Backbone.View.extend({
        initialize: function (mastermodel) {
            $(container).html("");
            //update model in the array with type info and create image url or embed 3d github file preview as appropriate
            mastermodel.revisions.forEach(function (model, i) {
                var t = FileUtils.getFileType(mastermodel.path);
                model.type = t;
                model.data_index = i;
                var root = "https://github.com/";
                var owner_repo = model.html_url.replace(root, "");
                owner_repo = owner_repo.substring(0, owner_repo.indexOf("commit"));
                if (t === "image") {
                    model.image_src = root + owner_repo + "raw/" + model.sha + "/" + mastermodel.path;
                    model.image = true;
                } else if (t === "3d") {
                    model.threeD = true;
                   
                    model.threed_path = owner_repo + model.sha + "/" + mastermodel.path;
                } else {
                    model.other = true;
                }
            });
            //save a reference to the model
            this._model_data = mastermodel;
            this.render(mastermodel);
        },
        render: function (model) {
            var content = Handlebars.compile(template);
            this.$el.html(content(model));
            $(container).append(this.el);
            return this;
        },
        events: {
            "click .file-revision-view": "getComments"
        },
        getComments: function (event) {
            var model = this._model_data;
            var index = +(d3.select(event.currentTarget).attr("data-index"));
            Ajax.getComments(model.revisions[index].sha, function (comments) {
                console.log(comments);
                RevisionCommentsView.create({sha: model.revisions[index].sha, comments: comments});
            });
        }
    });
    
    module.exports = {
        create: function (model) {
            return new FileRevisionsView(model);
        }
    };
});
