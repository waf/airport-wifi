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

    // Send the request
    request.send();
  });
}

var imgSection = document.querySelector('section');

window.addEventListener('load', function() {
    getKml('/airport-wifi/wifi.xml').then(function(kmlResponse) {

        var places = kmlResponse.querySelectorAll('Placemark');
        var fragment = document.createDocumentFragment();

        places.forEach(place => {
            var container = document.createElement("section");
            var title = document.createElement("h2");
            var wifi = document.createElement("div");
            title.textContent = place.querySelector('name').textContent;
            wifi.innerHTML = place.querySelector('description').textContent;
            container.appendChild(title);
            container.appendChild(wifi);
            fragment.appendChild(container);
        });

        document.body.appendChild(fragment);

    }, function(error) {
      console.log(error);
    });
}, false);
