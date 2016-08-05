var testWeb = angular.module('testWeb',[]);


function mainController($scope, $http){
    $scope.formdata = {};
    
    $http.get('/api/entrypoints')
        .success(function(data){
        $scope.entrypoints = data;
        console.log(data);
        
    })
    
        .error(function(data){
        console.log(data);
    });
}