/**
 * Make ajax requests to the github api
 * @author Patrick Oladimeji
 * @date 1/25/14 15:48:42 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
    "use strict";
    var serverUrl = "http://10.13.239.70:5000/";
    
    function getFiles(obj, cb) {
        var req = serverUrl + "files";
        $.getJSON(req, obj, function (data) {
            cb(data);
        });
    }
    
    function getComments(commitSha, cb) {
        var req = serverUrl + "comments";
        $.getJSON(req, {sha: commitSha}, function (data) {
            cb(data);
        });
    }
    
    function postComment(strComment, commitSha, cb) {
        var data = {
            comment: strComment,
            sha: commitSha
        };
        $.ajax({
            url: serverUrl + "comments",
            data: data,
            success: function (data) {
                if (cb && typeof cb === "function") {
                    cb(data);
                }
            },
            type: "POST"
        });
    }
    
    function getRevisions(path, cb) {
        $.getJSON(serverUrl + "revisions", {path: path}, function (data) {
            if (cb && typeof cb === "function") {
                cb(data);
            }
        });
    }
    
    module.exports = {
        getFiles: getFiles,
        getComments: getComments,
        postComment: postComment,
        getRevisions: getRevisions
    };
});
