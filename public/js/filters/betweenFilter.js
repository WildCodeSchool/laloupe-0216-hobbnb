angular.module('app')
    .filter('betweenLat', function() {
        return function(items, origin, end) {
            if (origin && end) {
                var newItem = [];
                items.forEach(function(e) {
                    if ((e.latitude >= origin) && (e.latitude <= end) || (e.latitude <= origin) && (e.latitude >= end)) {
                        newItem.push(e);
                    } else if (isNaN(Number(origin))) {
                        newItem.push(e);
                    }
                });
                return newItem;
            } else {
                return items;
            }
        };
    })
    .filter('betweenLon', function() {
        return function(items, origin, end) {
            if (origin && end) {
                var newItem = [];
                items.forEach(function(e) {
                    if ((e.longitude >= origin) && (e.longitude <= end) || (e.longitude <= origin) && (e.longitude >= end)) {
                        newItem.push(e);
                    } else if (isNaN(Number(origin))) {
                        newItem.push(e);
                    }
                });
                return newItem;
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
                var newItem = [];
                items.forEach(function(e) {
                    if ((e.home.price >= origin) && (e.home.price <= end)) {
                        newItem.push(e);
                    }
                });
                return newItem;
            } else {
                return items;
            }
        };
    });
