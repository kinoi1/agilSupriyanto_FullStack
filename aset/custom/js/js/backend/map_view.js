var host = window.location.origin;
var map;
// Initialize map after the page is fully loaded
window.onload = function () {
    initMap();
};

const initMap = async () => {
    const NoSPK = document.getElementById("NoSPK").value;
    const FromLat = document.getElementById("FromLat").value;
    const FromLng = document.getElementById("FromLng").value;
    const ToLat = document.getElementById("ToLat").value;
    const ToLng = document.getElementById("ToLng").value;
    const origin = { lat: parseFloat(FromLat), lng: parseFloat(FromLng) };
    const destination = { lat: parseFloat(ToLat), lng: parseFloat(ToLng) };

    // var myLatLng = {
    //     lat: -6.9175,
    //     lng: 107.6191
    // };

    // Create a map object and specify the DOM element for display
    map = new google.maps.Map(document.getElementById('map'), {
        center: origin,
        zoom: 12 // Adjust the zoom level as needed
    });

    setMarker(origin.lat, origin.lng, true);
    setMarker(destination.lat, destination.lng, false);

    getRoutes(NoSPK);

    // generateLine(origin, destination);

}

const setMarker = (lat, lng, isOrigin) => {
    const pinColor = isOrigin ? host + '/aset/img/marker-red-user.png' : host + '/aset/img/marker-red.png';

    var IconMarker = {
        url: pinColor,
        labelOrigin: new google.maps.Point(20, -10),
        scaledSize: new google.maps.Size(40, 40),
        size: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(16, 32)
    };


    var marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: isOrigin ? 'Asal' : 'Tujuan',
        icon: IconMarker,
        label: {
            text: isOrigin ? 'Asal' : 'Tujuan',
            fontWeight: "bold"
        }
    });
};

// getRoutes(NoSPK);





const getRoutes = async (no) => {
    const url = `${host}/Map_view/getRouteBySPK`; // Replace with your API endpoint
    let data_post = {
        NoSPK: no
    };

    show("loadContainer");
    await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data_post) // Send data directly in the body option
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            hide("loadContainer");
            return response.json();
        })
        .then(data => {
            hide("loadContainer");
            console.log(data);
            data = data.res;
            if (data.length > 0) {
                setPolyline(data);
            } else {
                swal("Info", "Data GPS for the Device is not found.");
            }
        })
        .catch(error => {
            hide("loadContainer");
            swal("Error", "There is a problem while connecting to server");
            console.log(error);
        });
};

const setPolyline = (points) => {
    console.log(points)
    const path = [];

    for (let i = 0; i < points.length; i++) {
        let e = {
            lat: points[i].latitude,
            lng: points[i].longitude
        };
        path.push(e);
        // setMarker(points[i].latitude, points[i].longitude);
    }

    const polyline = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    polyline.setMap(map);
}



const hide = (id) => {
    document.getElementById(id).style.display = "none";
}

const show = (id) => {
    document.getElementById(id).style.display = "block";
}


async function getRouteOverview(origin, destination) {
    const startPoint = new google.maps.LatLng(origin.lat, origin.lng);
    const endPoint = new google.maps.LatLng(destination.lat, destination.lng);

    const directionsService = new google.maps.DirectionsService();

    const request = {
        origin: startPoint,
        destination: endPoint,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false // Ensure only one route is provided
    };

    return new Promise((resolve, reject) => {
        directionsService.route(request, (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                // Extract overview polyline points
                const route = response.routes[0];
                const overviewPolyline = route.overview_polyline;
                const decodedPolyline = google.maps.geometry.encoding.decodePath(overviewPolyline);
                const coordinates = decodedPolyline.map(point => ({ lat: point.lat(), lng: point.lng() }));
                resolve(coordinates);
            } else {
                console.error('Directions request failed due to ' + status);
                reject(status);
            }
        });
    });
}

async function generateLine(origin, destination) {
    if (!origin.lat || !origin.lng || !destination.lat || !destination.lng) {
        return;
    }
    const rawPoints = await getRouteOverview(origin, destination);

    setPolyline(rawPoints);

}
