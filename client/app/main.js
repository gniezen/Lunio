/**
 * Entry point for client app
 * @author Patrick Oladimeji
 * @date 1/25/14 15:23:08 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, document */
define(function (require, exports, module) {
    "use strict";
    var ProjectFileView = require("app/views/ProjectFileView"),
        Ajax            = require("app/model/Ajax");
    
   
    var projectFiles = Ajax.getFiles({user: "gniezen", project: "openpump"}, function (data) {
        data.forEach(function (file) {
            ProjectFileView.create(file);
        });
    });
    
});
