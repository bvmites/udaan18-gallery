/**
 *
 * Static Flickr Api
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Author(s) : Siddharth Goswami (https://github.com/sidx1024)
 *
 */

function StaticFlickrApi(options) {
  this.host = options.host || "http://127.0.0.1/";
  this.isPhotosetsReady = false;
  this.photosets = 0;
  this.onPhotosetLoad = options.onPhotosetLoad || (function () {
    console.log('Photoset json is loaded successfully.');
  });
  this.downloadPhotosetJson(this.onPhotosetLoad);
}

StaticFlickrApi.prototype.downloadPhotosetJson = function (callback) {
  var photosetJsonUrl = this.host + 'photoset.json';
  var that = this;
  fetch(photosetJsonUrl)
    .then(function (response) { return response.json(); })
    .then(function (response) {
      this.photosets = response;
      that.photosets = response;
      this.isPhotosetsReady = true;
      if(typeof callback === 'function') {
        callback(this.photosets);
      } else {
        console.error('Callback parameter is not a function.');
      }
    })
    .catch(function (response){ console.error('Error retreiving photoset.json', response);})
};
