angular.module('bs.mobile.app').controller('MainCtrl', function($scope, currentUser, isAuthenticated, User, $state, $ionicPopup, CurrentUserInfoService) {
  $scope.greeting = 'Hello World!';
  console.log(currentUser);
  $scope.currentUser = currentUser;
  $scope.isAuthenticated = isAuthenticated;

  $scope.$on(CurrentUserInfoService.events.user, function(event, user) {
    $scope.currentUser = user;
    $scope.isAuthenticated = !!user;
    $scope.buckets = CurrentUserInfoService.refreshBuckets();
  });

  $scope.logout = function() {
    $scope.isAuthenticated = false;
    $scope.currentUser.logout();
    CurrentUserInfoService.setUser(null);
  };

  $scope.login = function(input, password) {
    loginOrRegister('login', input, password);
  };

  $scope.signUp = function(input, password) {
    loginOrRegister('register', input, password);
  };

  function loginOrRegister(action, input, password) {
    $scope.going = true;
    User[action](input, password).then(function(data) {
      CurrentUserInfoService.refreshUser();
    }, function(err) {
      $scope.going = false;
      $ionicPopup.alert({
        content: err.message,
        title: 'Whoops!',
        okType: 'button-energized'
      });
    });
  }
});