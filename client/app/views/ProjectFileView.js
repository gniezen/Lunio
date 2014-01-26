/**
 * 
 * @author Patrick Oladimeji
 * @date 1/25/14 15:34:12 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, Handlebars, Backbone, document */
define(function (require, exports, module) {
    "use strict";
    var template = require("text!app/templates/projectFileView.html"),
        Ajax     = require("app/model/Ajax"),
        FileRevisionsView = require("app/views/FileRevisionsView"),
        FileUtils = require("app/utils/FileUtils");
    
    var container = "#content-files";
    var ProjectFileView = Backbone.View.extend({
        initialize: function (model) {
            //update model with type info and create image url or embed 3d github file preview as appropriate
            var t = FileUtils.getFileType(model.name);
            model.type = t;
            if (t === "image") {
                model.image_src = model.html_url.replace("blob", "raw");
                model.image = true;
            } else if (t === "3d") {
                model.threeD = true;
                model.threed_path = model.html_url.replace("https://github.com/", "");
                model.threed_path = model.threed_path.replace("blob/", "");
            } else {
                model.other = true;
            }
            //save a reference to the model
            this._model_data = model;
            this.render(model);
        },
        render: function (model) {
            var content = Handlebars.compile(template);
            this.$el.html(content(model));
            $(container).append(this.el);
            return this;
        },
        events: {
            "click": "getRevisions"
        },
        getRevisions: function (event) {
            var model = this._model_data;
            Ajax.getRevisions(model.path, function (revisions) {
                FileRevisionsView.create({path: model.path, revisions: revisions});
            });
        }
    });
    
    module.exports = {
        create: function (file) {
            return new ProjectFileView(file);
        }
    };
});
