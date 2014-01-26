/**
 * view to manage the comments in a revision
 * @author Patrick Oladimeji
 * @date 1/26/14 11:49:43 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, Backbone, Handlebars */
define(function (require, exports, module) {
    "use strict";
    var template = require("text!app/templates/commentsView.html"),
        Ajax     = require("app/model/Ajax"),
        FileUtils = require("app/utils/FileUtils");
    
    var container = "#content-comments";
    
    var RevisionCommentsView = Backbone.View.extend({
        initialize: function (model) {
            $(container).html("");
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
            "click button#post-comment": "postComment"
        },
        postComment: function (event) {
            var comment = $("textarea#comment").val();
            Ajax.postComment(comment, this._model_data.sha, function (res) {
                $("textarea#comment").val("");
                this._model_data.comments.push(res);
                this.create(this._model_data);
                console.log(res);
            });
        }
    });
    
    module.exports = {
        create: function (model) {
            return new RevisionCommentsView(model);
        }
    };
});
