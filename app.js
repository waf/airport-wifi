// register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/airport-wifi/sw.js', { scope: '/airport-wifi/' }).then(function(reg) {

    if(reg.installing) {
      console.log('Service worker installing');
    } else if(reg.waiting) {
      console.log('Service worker installed');
    } else if(reg.active) {
      console.log('Service worker active');
    }

  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}

function getKml(url) {
  // return a promise for KML loading
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'document';

    request.onload = function() {
      if (request.status == 200) {
        console.log(request.response);
        var arrayResponse = [];
        resolve(request.response);
      } else {
        reject(Error('KML didn\'t load successfully; error code:' + request.statusText));
      }
    };

    request.onerror = function() {
      reject(Error('There was a network error.'));
    };

    request.send();
  });
}

function createPlace(placeXml) {
    var description = placeXml.querySelector('description').textContent;
    var appNotice = description.indexOf('Offline version of this map available');
    description = description.substring(0, appNotice);
    return {
        airport: placeXml.querySelector('name').textContent,
        description: description
    };
}

window.addEventListener('load', function() {
    getKml('/airport-wifi/wifi.xml').then(function(kmlResponse) {

        var placemarks = kmlResponse.querySelectorAll('Placemark');
        var places = Array.prototype.map.call(placemarks, createPlace);
        new List("airport-list", {
            valueNames: ['airport', 'description'],
            item: '<section><h2 class="airport"></h2><div class="description"></div></section>'
        }, places);

    }, function(error) {
      console.log(error);
    });
}, false);
