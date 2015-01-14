var artie = angular.module('artie',['fb']);

artie.run(['$rootScope','$window',
function($rootScope,$window){
	
}]);

artie.controller('home',function($scope,$http){
	$scope.$watch(
		'user',
		function(val,old){
			$http.post("/user/status",val)
			.success(function(data,status,headers){
				$scope.user.id=data._id;
			});
		}
	);
	$scope.post = function(data){
		$scope.stream.push({name:$scope.user.name,content:data});
		//$scope.$apply();
		data={userID:$scope.user.id,content:data};
		$http.post("/user/post",data)
		.success(function(data,status,headers){
			
		});
	};
	$http.get("/stream").success(function(data){
		$scope.stream=data;
	});
});
