/**
 * 
 * @author Patrick Oladimeji
 * @date 1/25/14 15:34:12 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, Handlebars, Backbone, document */
define(function (require, exports, module) {
    "use strict";
    var template = require("text!app/templates/projectFileView.html");
    var imageExts = ["jpg", "png", "jpeg", "gif"],
        threeDExts = ["stl"];
    
    function fileType(file) {
        var ext = file.split(".").slice(-1).join("");
        return imageExts.indexOf(ext) > -1 ? "image" : threeDExts.indexOf(ext) > -1 ? "3d" : "other";
    }
    
    var ProjectFileView = Backbone.View.extend({
        initialize: function (model) {
            //update model with type info and create image url or embed 3d github file preview as appropriate
            var t = fileType(model.name);
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
            
            this.render(model);
        },
        render: function (model) {
            var content = Handlebars.compile(template);
            this.$el.html(content(model));
            if (model.threeD) {
                d3.select(this.el).append("iframe").attr("src", "https://render.github.com/view/3d?url=https://raw.github.com/gniezen/openpump/master/extruder_print_all_v3.stl");
            }
            $("body").append(this.el);
            return this;
        }
    });
    
    module.exports = {
        create: function (file) {
            return new ProjectFileView(file);
        }
    };
});
