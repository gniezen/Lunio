/**
 * utilities for working with files
 * @author Patrick Oladimeji
 * @date 1/26/14 10:14:08 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
    "use strict";
    var imageExts = ["jpg", "png", "jpeg", "gif"],
        threeDExts = ["stl"];
    
    function fileType(file) {
        var ext = file.split(".").slice(-1).join("");
        return imageExts.indexOf(ext) > -1 ? "image" : threeDExts.indexOf(ext) > -1 ? "3d" : "other";
    }
    
    module.exports = {
        getFileType: fileType
    };
});
