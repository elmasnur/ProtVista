/*jslint node: true */
/*jshint laxbreak: true */
/*jshint laxcomma: true */
"use strict";

var d3 = require("d3");
var _ = require("underscore");
var ViewerHelper = require("./ViewerHelper");
var Constants = require("./Constants");
var DownloadDataLoader = require("./DownloadDataLoader");

var populateDialog = function (fv, wrapper) {
    var selected = true;
    _.each(Constants.getDownloadFormats(), function(format) {
        var radioDiv = wrapper.append('div');
        radioDiv.append('input')
            .attr('type', 'radio')
            .attr('name', 'upfv_radio_format')
            .attr('value', format)
            .property('checked', selected);
        radioDiv.append('label')
            .text(format);
        selected = false;
    });
    wrapper.append('div').style('text-align', 'right')
        .append('button')
        .text('Download')
        .on('click', function() {
            var selected = wrapper.selectAll('input').filter(function() {
                return d3.select(this).property('checked');
            });
            DownloadDataLoader.get(fv.uniprotacc, selected.attr('value'));
        });
};

var createDialog = function (fv, container) {
    var wrapper = container.append('div')
        .attr('class','up_pftv_popupDialog-container')
        .style('left', (d3.mouse(container.node())[0] + 10) + 'px')
        .style('top', (d3.mouse(container.node())[1] + 5) + 'px')
        .on('mousedown', function() {
            fv.overDownloadDialog = true;
        })
        .on('mouseup', function() {
            fv.overDownloadDialog = false;
        });
    wrapper.append('span')
        .text('x')
        .attr('class','up_pftv_tooltip-close')
        .on('click',function(){
            fv.overDownloadDialog = false;
            wrapper.transition(20)
                .style('opacity',0)
                .style('display','none');
        });
    populateDialog(fv, wrapper);
    return wrapper;
};

var DownloadDialog = function() {
    return {
        displayDialog: function(fv, container) {
            if (!fv.downloadDialog) {
                fv.downloadDialog = createDialog(fv, container);
            }
            fv.downloadDialog.transition(20)
                .style('opacity',1)
                .style('display','block');
        },
        closeDialog: function(fv) {
            if (fv.downloadDialog) {
                fv.downloadDialog.transition(20)
                    .style('opacity', 0)
                    .style('display', 'none');
            }
        }
    };
}();

module.exports = DownloadDialog;