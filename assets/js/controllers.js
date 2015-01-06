var arter = angular.module('arter',[]);

arter.controller('home',function($scope,$http){
	$scope.name="cody";
	$scope.email="csb@mct.co";
	$http.get("/stream").success(function(data){
		$scope.stream=data;
	});
});
