(function () {
  // Initialize static flickr
  var staticFlickrApi = new StaticFlickrApi({
    host: 'https://udaan18-gallery-api.herokuapp.com/',
    onPhotosetLoad: setupView
  });

  window.addEventListener('hashchange', hashChangeEvent);

  var hasAlbumViewerBooted = false;

  var albums = document.querySelector('.albums');
  var albumViewer = document.querySelector('.album-viewer');
  var albumTitle = document.querySelector('.album-title');
  var albumDescription = document.querySelector('.album-description');
  var thumbnailContainer = document.querySelector('.thumbnail-container');

  function hashChangeEvent() {
    var hash = location.hash.slice(1);
    if(isValidPhotosetId(hash)) {

      albums.style.display = 'none';
      albumViewer.style.display = 'block';
      setupPhotoset();
      if(!hasAlbumViewerBooted) {
        window.albumViewer.init();
      } else {
        window.albumViewer.initViewer();
        window.setTimeout(function () {
          window.albumViewer.switchTo(0, true);
        }, 0);
      }
    } else {
      albums.style.display = 'block';
      albumViewer.style.display = 'none';
    }
  }

  function setupPhotoset(photoset) {
    photoset = photoset || getCurrentPhotoset();
    if(photoset) {
      albumTitle.innerText = photoset.title._content;
      albumDescription.innerText = photoset.description._content;
      thumbnailContainer.innerHTML = "";
      Object.values(photoset.photos).map(function (photo) {
        var title = photo.title;
        var thumbnail = photo.sizes["medium"].source;
        var externalLink = photo.sizes["medium"].url.slice(0, photo.sizes["medium"].url.lastIndexOf('sizes/'));
        var large = photo.sizes["large"] || photo.sizes["large-1600"] || photo.sizes["large-2048"];
        large = large.source || thumbnail;
        thumbnailContainer.appendChild(newThumbnailView(title, externalLink, thumbnail, large));
      });
    }

  }

  function isValidPhotosetId(photosetId) {
    return Object.keys(staticFlickrApi.photosets.data).indexOf(photosetId) > -1;
  }

  function getCurrentPhotoset() {
    var photosetId = location.hash.slice(1);
    if(isValidPhotosetId(photosetId)) {
      return staticFlickrApi.photosets.data[photosetId];
    }
    return null;
  }

  var newThumbnailView = function (title, externalLink, thumbnailFile, originalFile) {
    var article = document.createElement('article');

    var anchor = document.createElement('a');
    anchor.classList.add('thumbnail');
    anchor.setAttribute('href', originalFile);

    var img = document.createElement('img');
    img.setAttribute('src', thumbnailFile);
    anchor.appendChild(img);
    article.appendChild(anchor);

    var h2 = document.createElement('h2');
    h2.innerText = title;
    article.appendChild(h2);

    var p = document.createElement('p');
    p.innerHTML = '<a href="' + externalLink + '" target=\"_blank\">View on Flickr</a>';
    article.appendChild(p);

    return article;
  };

  var newPhotosetView = function (title, description, photos, href) {
    // if(!title || !description || !photos.length) return;

    var coverPhoto = photos[0];
    var coverPhotoThumbnail = coverPhoto.sizes["medium"].source || "";

    var anchor = document.createElement('a');
    anchor.classList.add('grid__item');
    anchor.href = href || '#';
    anchor.addEventListener('click', function () {
      location.reload();
    });

    var stack = document.createElement('div');
    stack.classList.add('stack');
    for(var i = 1; i < photos.length && i < 4; i++) {
      var stackDeco = document.createElement('div');
      stackDeco.classList.add('stack__deco');
      var stackDecoImg = document.createElement('img');
      stackDecoImg.setAttribute('src', photos[i].sizes["medium"].source);
      stackDeco.appendChild(stackDecoImg);
      stack.appendChild(stackDeco);
    }

    var stackFigure = document.createElement('div');
    stackFigure.classList.add('stack__figure');
    var stackImg = document.createElement('img');
    stackImg.classList.add('stack__img');
    stackImg.setAttribute('src', coverPhotoThumbnail);
    // TODO: Add alt attribute
    stackFigure.appendChild(stackImg);
    stack.appendChild(stackFigure);
    anchor.appendChild(stack);

    var gridItemCaption = document.createElement('div');
    gridItemCaption.classList.add('grid__item-caption');
    var gridItemTitle = document.createElement('h3');
    gridItemTitle.classList.add('grid__item-title');
    gridItemTitle.innerText = title;

    gridItemCaption.appendChild(gridItemTitle);

    anchor.appendChild(gridItemCaption);
    return anchor;
  };

  function setupView(photosetsData) {
    var photosetsContainer = document.querySelector('.content .grid');
    for(var i in photosetsData.data) {
      var photoset = photosetsData.data[i];
      var arrayOfPhotos = Object.values(photoset.photos);
      var photosetView = newPhotosetView(photoset.title._content, "", arrayOfPhotos, '#' + photoset.id);
      photosetsContainer.appendChild(photosetView);
    }
    setupAnimationEffects();
    hashChangeEvent();
  }

  function setupAnimationEffects() {
    [].slice.call(document.querySelectorAll('.grid--effect-castor > .grid__item'))
      .forEach(function (stackEl) {
        new CastorFx(stackEl);
      });
  }
})();
