angular.module('app')
    .filter('betweenLat', function() {
        return function(items, origin, end) {
            if (origin && end) {
                var newItems = [];
                items.forEach(function(e) {
                    if ((e.latitude >= origin) && (e.latitude <= end) || (e.latitude <= origin) && (e.latitude >= end)) {
                        newItems.push(e);
                    } else if (isNaN(Number(origin))) {
                        newItems.push(e);
                    }
                });
                return newItems;
            } else {
                return items;
            }
        };
    })
    .filter('betweenLon', function() {
        return function(items, origin, end) {
            if (origin && end) {
                var newItems = [];
                items.forEach(function(e) {
                    if ((e.longitude >= origin) && (e.longitude <= end) || (e.longitude <= origin) && (e.longitude >= end)) {
                        newItems.push(e);
                    } else if (isNaN(Number(origin))) {
                        newItems.push(e);
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
    .filter('hobbyFilter', function() {
        return function(items, hobby) {
            if (!items) {
                return false;
            }
            if (hobby !== undefined) {
                var newItems = [];
                items.forEach(function(value) {
                    if (value.hobbies[0] == hobby ||  value.hobbies[1] == hobby || value.hobbies[2] == hobby) {
                        newItems.push(value);
                    }
                });
                return newItems;
            } else {
                return items;
            }
        };
    });
