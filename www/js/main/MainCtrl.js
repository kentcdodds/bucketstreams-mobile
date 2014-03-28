angular.module('bsm.app').controller('MainCtrl', function($scope, currentUser, isAuthenticated, User, $state, $ionicPopup, CurrentUserInfoService) {
  $scope.greeting = 'Hello World!';
  console.log(currentUser);
  $scope.currentUser = currentUser;
  $scope.isAuthenticated = isAuthenticated;

  $scope.$on(CurrentUserInfoService.events.user, function(event, user) {
    $scope.currentUser = user;
    $scope.isAuthenticated = !!user;
  });

  $scope.login = function(input, password) {
    loginOrRegister('login', input, password);
  };

  $scope.signUp = function(input, password) {
    loginOrRegister('register', input, password);
  };

  function loginOrRegister(action, input, password) {
    $scope.going = true;
    User[action](input, password).success(function(data) {
      CurrentUserInfoService.refreshUser();
      CurrentUserInfoService.refreshAuthenticated();
    }).error(function(err) {
      $scope.going = false;
      $ionicPopup.alert({
        content: err.message,
        title: 'Whoops!',
        okType: 'button-energized'
      });
    });
  }
});