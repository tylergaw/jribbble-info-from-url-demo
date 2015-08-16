(function() {
  var dribbbleUser = 'wandarca';
  var shotsPerPage = 50;

  // Be sure to change this to your Dribbble API token.
  $.jribbble.setToken('f688ac519289f19ce5cebc1383c15ad5c02bd58205cd83c86cbb0ce09170c1b4');

  // Checks the URL for the presense of a shot id "shot=12345" query param.
  var getShotIdFromURL = function() {
    var q = window.location.search;
    var shotId = null;

    if (q.indexOf('shot=') > -1) {
      shotId = q.split('=')[1];
    }

    return shotId;
  };

  var displayAttachments = function(shotId) {
    $.jribbble.shots(shotId).attachments().then(function(res) {
      var html = [];

      res.forEach(function(attachment) {
        html.push('<li><a href="' + attachment.url + '">');
        html.push('<img src="' + attachment.url + '">');
      	html.push('</a></li>');
      });

      $('.attachments').before('<h3>Attachments</h3>').html(html.join(''));
    });
  };

  var displayShotList = function(shots) {
    var html = [];

    shots.forEach(function(shot) {
      html.push('<li class="shots__shot">');
      html.push('<a class="shot__link" href="shot.html?shot=' + shot.id + '">');
      html.push('<img class="shot__img" src="' + shot.images.normal + '">');
      html.push('</a>');

      if (shot.attachments_count > 0) {
        html.push('<br><small>has attachments</small>');
      }

      html.push('</li>');
    });

    $('.shots').html(html.join(''));
  };

  var displaySingleShot = function(shot) {
    var html = [];

    html.push('<a href="' + shot.html_url + '" target="_blank">');
    html.push('<img src="' + shot.images.hidpi + '">');
    html.push('</a>');

    if (shot.description) {
      html.push('<p class="shot__description">' + shot.description + '</p>');
    }

    $('.shot').append(html.join(''));

    // Since showing attachments requires a 2nd request to the API, we only
    // want to make it it if there are attachments.
    if (shot.attachments_count > 0) {
      displayAttachments(shot.id);
    }
  };

  // This will run as soon as the page loads. If shotId is not null, we'll take
  // the path of displaying a single shot's info. If it is, we default to showing
  // a list of shots for the value in `dribbbleUser`
  var initJribble = function(shotId) {
    if (shotId) {
      $.jribbble.shots(shotId).then(displaySingleShot);
    } else {
      $.jribbble.users(dribbbleUser).shots({per_page: shotsPerPage})
        .then(displayShotList);
    }
  };

  // Init the jribbble request with the value from getShotIdFromURL
  initJribble(getShotIdFromURL());
}());
