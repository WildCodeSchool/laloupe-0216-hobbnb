angular.module('app')
    .filter('inArea', function() {
        var r_earth = 6378137;
        function getDistanceFromLatLonInMetters(lat1, lon1, lat2, lon2) {
            var dLat = (Math.PI / 180) * (lat2 - lat1);
            var dLon = (Math.PI / 180) * (lon2 - lon1);
            var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((Math.PI / 180) * (lat1)) * Math.cos((Math.PI / 180) * (lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = r_earth * c; // Distance in km
            return d;
        }
        return function(items, latitudeRange, longitudeRange, center, radius) {
            if (latitudeRange && longitudeRange && center && radius) {
                var newItems = [];
                items.forEach(function(e) {
                    if ((e.latitude >= latitudeRange.min && e.latitude <= latitudeRange.max) || (e.latitude <= latitudeRange.min && e.latitude >= latitudeRange.max) && (e.longitude >= longitudeRange.min && e.longitude <= longitudeRange.max) || (e.longitude <= longitudeRange.min && e.longitude >= longitudeRange.max)) {
                        if (getDistanceFromLatLonInMetters(center.latitude, center.longitude, e.latitude, e.longitude) <=  radius) {
                          newItems.push(e);
                        }
                    }
                });
                return newItems;
            } else {
                return items;
            }
        };
    })
    .filter('betweenPrice', function() {
        return function(items, origin, end) {
            if (!items) {
                return false;
            }
            if (origin !== undefined && end !== undefined) {
                var newItems = [];
                items.forEach(function(e) {
                    if ((e.home.price >= origin) && (e.home.price <= end)) {
                        newItems.push(e);
                    }
                });
                return newItems;
            } else {
                return items;
            }
        };
    })
    .filter('hobbies', function() {
        return function(items, seletedHobbies) {
            if (!items) {
                return false;
            }
            if (seletedHobbies.length !== 0) {
                var newItems = [];
                items.forEach(function(object) {
                    seletedHobbies.forEach(function(currentHobby) {
                        if (object.hobbies[0] == currentHobby ||  object.hobbies[1] == currentHobby || object.hobbies[2] == currentHobby) {
                            newItems.push(object);
                        }
                    });
                });
                return newItems;
            } else {
                return items;
            }
        };
    })
    .filter('hobbiesInSpots', function() {
        return function(items, seletedHobbies) {
            if (!items) {
                return false;
            }
            if (seletedHobbies.length !== 0) {
                var newItems = [];
                items.forEach(function(object) {
                    seletedHobbies.forEach(function(currentHobby) {
                        if (object.hobby == currentHobby) {
                            newItems.push(object);
                        }
                    });
                });
                return newItems;
            } else {
                return items;
            }
        };
    })
    .filter('propertyTypes', function() {
        return function(items, selectedPropertyTypes) {
            if (!items) {
                return false;
            }
            if (selectedPropertyTypes.length !== 0) {
                var newItems = [];
                items.forEach(function(object) {
                    selectedPropertyTypes.forEach(function(propertyType) {
                        if (object.home.propertyType == propertyType) {
                            newItems.push(object);
                        }
                    });
                });
                return newItems;
            } else {
                return items;
            }
        };
    });
