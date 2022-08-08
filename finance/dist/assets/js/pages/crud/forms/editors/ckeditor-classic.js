/******/ (() => { // webpackBootstrap
    /******/ 	"use strict";
    var __webpack_exports__ = {};
    /*!********************************************************************!*\
     !*** ../demo1/src/js/pages/crud/forms/editors/ckeditor-classic.js ***!
     \********************************************************************/

// Class definition

    var KTCkeditor = function () {
        // Private functions
        var demos = function () {
            ClassicEditor
                    .create(document.querySelector('#kt-ckeditor-1'), {
                        removePlugins: ['Heading', 'Link'],
                        toolbar: ['bold', 'italic', '|', 'undo', 'redo', '|', 'numberedList', 'bulletedList']
                    })
                    .catch(error => {
                        console.log(error);
                    });

        };

        return {
            // public functions
            init: function () {
                demos();
            }
        };
    }();

// Initialization
    jQuery(document).ready(function () {
        KTCkeditor.init();
    });
    /******/ })()
        ;
//# sourceMappingURL=ckeditor-classic.js.map