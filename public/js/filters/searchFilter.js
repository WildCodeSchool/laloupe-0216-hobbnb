angular.module('app')
    .filter('betweenLat', function() {
        return function(items, origin, end) {
            if (origin && end) {
                var newItems = [];
                items.forEach(function(e) {
                    if ((e.latitude >= origin && e.latitude <= end) || (e.latitude <= origin && e.latitude >= end)) {
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
                    if ((e.longitude >= origin && e.longitude <= end) || (e.longitude <= origin && e.longitude >= end)) {
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
