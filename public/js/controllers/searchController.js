function searchController($scope, $http, placesFactory, placesService, NgMap) {
$scope.hobbiesListing = ['Choisissez un hobby...',"Randonnée", "VTT", "Cyclisme", "Equitation", "Pêche", "Plongée", "Golf", "Escalade", "Canoë Kayak", "Surf", "Stand up Paddle", "Kitesurf", "Windsurf", "Ski", "Alpinisme", "Parapente", "Spéléologie", "Cannoning"];
$scope.formHobby = 'Choisissez un hobby...';

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
$scope.changeHobby = function(){
	if ($scope.selectHome==false){
		$scope.tile='../assets/search/tile' + $scope.formHobby + '.png';
	}
}
//init google map
$scope.centerMap = "Lorient";
//init color bottons and tile
document.getElementById("btnSpot").style.backgroundColor = "#FFFFFF";
document.getElementById("btnHome").style.backgroundColor = "#69f0ae";
$scope.tile='../assets/search/tileHome.png';
$scope.selectHome=true;

//Flip-flop Spot-Home
$scope.spotOrHome = function(choice){
	$scope.selectHome = choice;
	if ($scope.selectHome==true){
		document.getElementById("btnSpot").style.backgroundColor = "#FFFFFF";
		document.getElementById("btnHome").style.backgroundColor = "#69f0ae";
		$scope.tile='../assets/search/tileHome.png';

		tile='../assets/search/tileHome.png';
	} else {
		document.getElementById("btnSpot").style.backgroundColor = "#69f0ae";
		document.getElementById("btnHome").style.backgroundColor = "#FFFFFF";
		$scope.changeHobby();
	}
}
// API Google
$scope.changePlace = function(){
	setTimeout($scope.centerMap = $scope.formPlace, 1);
}
NgMap.getMap().then(function(map) {
	 $scope.map = map;
 });
 $scope.howManyPositive = function(t) {
	 return !!t ? (~~(t.reduce(function(a,b){return a+b;}) / t.length) || 0) : 0;
 }
$scope.toggleInfoWindow = function(event, id) {
	 $scope.map.showInfoWindow('popup', this);
	 $scope.indexOfTheTruc = id;
	 $scope.globalRating = $scope.howManyPositive($scope.positions[id].rating.valueForMoney.concat($scope.positions[id].rating.location, $scope.positions[id].rating.cleaness));
	 $scope.globalLowerRating = 5 - $scope.globalRating;
	 $scope.reviewNb = ~~(($scope.positions[id].rating.cleaness.length + $scope.positions[id].rating.location.length + $scope.positions[id].rating.valueForMoney.length) / 3)
 }
 $scope.calculStars = function(widget){
	 $scope.globalRating = $scope.howManyPositive(widget.valueForMoney.concat(widget.location,widget.cleaness));
	 var resul="";
	 for(var i=0 ; i < $scope.globalRating ; i++){resul += "star "};
	 return resul;
 }
 $scope.calculLowerStars = function(widget){
	 $scope.globalLowerRating = 5 - $scope.globalRating;
	 var resul="";
	 for(var i=0 ; i < $scope.globalLowerRating ; i++){resul += "star "};
	 return resul;
 }
 $scope.nbReview = function(widget){
	 return ~~((widget.cleaness.length + widget.location.length + widget.valueForMoney.length) / 3);
 }
 $scope.hobbyIco = function(widget){
	 return "../assets/hobbies/"+ widget.primarySports.type +".png"
 }

//add tile in map
$scope.positions =[
	{	shortDescription:"Lorient",
		picture:"Url",
		latitude:47.791859,
		longitude:-3.362480,
		picture:"../assets/places/place1.jpg",
		rating:{
      valueForMoney: [3],
      location: [4],
      cleaness: [5]},
		home: {
	    price: 57},
		primarySports: {
      type: "Surf"}
  },
	{	shortDescription:"Concarneau",
		picture:"Url",
		latitude:47.883774,
		longitude:-3.909815,
		picture:"../assets/places/place2.jpg",
		rating:{
			valueForMoney: [5],
			location: [5],
			cleaness: [5]},
		home: {
	    price: 60},
		primarySports: {
			type: "Kitesurf"}
			},
	{	shortDescription:"Carnac",
		picture:"Url",
		latitude:47.579523,
		longitude: -3.078903,
		picture:"../assets/places/place3.jpg",
		rating:{
			valueForMoney: [3],
			location: [3],
			cleaness: [3]},
		home: {
			price: 52},
			primarySports: {
	      type: "Cyclisme"}
	  },
	];

	$scope.demo2 = {
    range: {
        min: 0,
        max: 1000
    },
    minPrice: 0,
    maxPrice: 1000
};
}
