function searchController($scope, $http, placesFactory, placesService) {

placesService.get().then(function(res){
	$scope.places = res.data;
	/*
	shortDescription
	picture
	latitude
	longitude
	_id
	rating = (rating.cleanness + rating.location + rating.valueForMoney) / 3
	um of avis => ~~((rating.cleanness.length + rating.location.length + rating.valueForMoney.length) / 3))
	*/
});
//init google map
$scope.tile='../assets/search/tileHome.png';
$scope.centerMap = "Lorient";
//init coulor bottons
document.getElementById("btnSpot").style.backgroundColor = "#FFFFFF";
document.getElementById("btnHome").style.backgroundColor = "#69f0ae";
//Flip-flop Spot-Home
$scope.spotOrHome = function(choice){
	$scope.selectHome = choice;
	if ($scope.selectHome==true){
		document.getElementById("btnSpot").style.backgroundColor = "#FFFFFF";
		document.getElementById("btnHome").style.backgroundColor = "#69f0ae";
		tile='../assets/search/tileHome.png';
	} else {
		document.getElementById("btnSpot").style.backgroundColor = "#69f0ae";
		document.getElementById("btnHome").style.backgroundColor = "#FFFFFF";
	}
}
// API Google
$scope.changePlace = function(){
	$scope.centerMap = $scope.formPlace;
}
//add tile in map
$scope.positions =[
	{	shortDescription:"Place 1",
		picture:"Url",
		latitude:48,
		longitude:0},
	{	shortDescription:"Place 2",
		picture:"Url",
		latitude:48.2,
		longitude:0},
	{	shortDescription:"Place 3",
		picture:"Url",
		latitude:48,
		longitude:0.2}
	];


}
