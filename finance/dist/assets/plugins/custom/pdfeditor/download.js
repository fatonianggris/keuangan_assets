//download.js v4.2, by dandavis; 2008-2016. [MIT] see http://danml.com/download.html for tests/usage
// v1 landed a FF+Chrome compat way of downloading strings to local un-named files, upgraded to use a hidden frame and optional mime
// v2 added named files via a[download], msSaveBlob, IE (10+) support, and window.URL support for larger+faster saves than dataURLs
// v3 added dataURL and Blob Input, bind-toggle arity, and legacy dataURL fallback was improved with force-download mime and base64 support. 3.1 improved safari handling.
// v4 adds AMD/UMD, commonJS, and plain browser support
// v4.1 adds url download capability via solo URL argument (same domain/CORS only)
// v4.2 adds semantic variable names, long (over 2MB) dataURL support, and hidden by default temp anchors
// https://github.com/rndme/download

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.download = factory();
    }
}(this, function () {

    return function download(data, strFileName, strMimeType) {

        var self = window, // this script is only for browsers anyway...
                defaultMime = "application/octet-stream", // this default mime also triggers iframe downloads
                mimeType = strMimeType || defaultMime,
                payload = data,
                url = !strFileName && !strMimeType && payload,
                anchor = document.createElement("a"),
                toString = function (a) {
                    return String(a);
                },
                myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString),
                fileName = strFileName || "download",
                blob,
                reader;
        myBlob = myBlob.call ? myBlob.bind(self) : Blob;

        if (String(this) === "true") { //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
            payload = [payload, mimeType];
            mimeType = payload[0];
            payload = payload[1];
        }


        if (url && url.length < 2048) { // if no filename and no mime, assume a url was passed as the only argument
            fileName = url.split("/").pop().split("?")[0];
            anchor.href = url; // assign href prop to temp anchor
            if (anchor.href.indexOf(url) !== -1) { // if the browser determines that it's a potentially valid url path:
                var ajax = new XMLHttpRequest();
                ajax.open("GET", url, true);
                ajax.responseType = 'blob';
                ajax.onload = function (e) {
                    download(e.target.response, fileName, defaultMime);
                };
                setTimeout(function () {
                    ajax.send();
                }, 0); // allows setting custom ajax headers using the return:
                return ajax;
            } // end if valid url?
        } // end if url?


        //go ahead and download dataURLs right away
        if (/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(payload)) {

            if (payload.length > (1024 * 1024 * 1.999) && myBlob !== toString) {
                payload = dataUrlToBlob(payload);
                mimeType = payload.type || defaultMime;
            } else {
                return navigator.msSaveBlob ? // IE10 can't do a[download], only Blobs:
                        navigator.msSaveBlob(dataUrlToBlob(payload), fileName) :
                        saver(payload); // everyone else can save dataURLs un-processed
            }

        } else {//not data url, is it a string with special needs?
            if (/([\x80-\xff])/.test(payload)) {
                var i = 0, tempUiArr = new Uint8Array(payload.length), mx = tempUiArr.length;
                for (i; i < mx; ++i)
                    tempUiArr[i] = payload.charCodeAt(i);
                payload = new myBlob([tempUiArr], {type: mimeType});
            }
        }
        blob = payload instanceof myBlob ?
                payload :
                new myBlob([payload], {type: mimeType});


        function dataUrlToBlob(strUrl) {
            var parts = strUrl.split(/[:;,]/),
                    type = parts[1],
                    decoder = parts[2] == "base64" ? atob : decodeURIComponent,
                    binData = decoder(parts.pop()),
                    mx = binData.length,
                    i = 0,
                    uiArr = new Uint8Array(mx);

            for (i; i < mx; ++i)
                uiArr[i] = binData.charCodeAt(i);

            return new myBlob([uiArr], {type: type});
        }

        function saver(url, winMode) {

            if ('download' in anchor) { //html5 A[download]
                console.log(HOST_redirect);
                Swal.fire({
                    title: "Peringatan!",
                    text: "Apakah anda yakin ingin MENYETUJUI Proposal Atas Nama " + HOST_name + "?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1BC5BD",
                    confirmButtonText: "Ya, Setuju!",
                    cancelButtonText: "Tidak, batal!",
                    showLoaderOnConfirm: true,
                    closeOnConfirm: false,
                    closeOnCancel: false,
                    preConfirm: () => {
                        var url_redirect = HOST_redirect;
                        var file = new File([blob], fileName, {type: blob.type});
                        var formData = new FormData();
                        formData.append("id", HOST_id);
                        formData.append("file_name", fileName);
                        formData.append("file_prop_acc", file);

                        return $.ajax({
                            type: 'POST',
                            url: HOST_upload,
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function (result) {
                                Swal.fire("Disetujui!", "Proposal Atas Nama '" + HOST_name + "' telah disetujui.", "success");
                                setTimeout(function () {
                                    window.open(url_redirect, "_self");
                                }, 1000);
                            },
                            error: function (result) {
                                console.log(result);
                                Swal.fire("Opsss!", "Koneksi Internet Bermasalah.", "error");
                            }
                        });


                    },
                    allowOutsideClick: () => !Swal.isLoading()
                }).then(function (result) {
                    if (!result.isConfirm) {
                        Swal.fire("Dibatalkan!", "Persetujuan Propsal Anggaran " + HOST_name + " dibatalkan.", "error");
                    }
                });
            }

            //do iframe dataURL download (old ch+FF):
            var f = document.createElement("iframe");
            document.body.appendChild(f);

            if (!winMode && /^data:/.test(url)) { // force a mime that will download:
                url = "data:" + url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
            }
            f.src = url;
            setTimeout(function () {
                document.body.removeChild(f);
            }, 333);

        }//end saver


        if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
            return navigator.msSaveBlob(blob, fileName);
        }

        if (self.URL) { // simple fast and modern way using Blob and URL:
            saver(self.URL.createObjectURL(blob), true);
        } else {
            // handle non-Blob()+non-URL browsers:
            if (typeof blob === "string" || blob.constructor === toString) {
                try {
                    return saver("data:" + mimeType + ";base64," + self.btoa(blob));
                } catch (y) {
                    return saver("data:" + mimeType + "," + encodeURIComponent(blob));
                }
            }

            // Blob but not URL support:
            reader = new FileReader();
            reader.onload = function (e) {
                saver(this.result);
            };
            reader.readAsDataURL(blob);
        }
        return true;
    }; /* end download() */
}));