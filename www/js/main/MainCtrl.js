angular.module('bsm.app').controller('MainCtrl', function($scope, currentUser) {
  $scope.greeting = 'Hello World!';
  console.log(currentUser);
  $scope.currentUser = currentUser;
});