angular.module('bs.mobile.app').controller('MainCtrl', function($scope, currentUser, isAuthenticated, User, $state, $ionicPopup, CurrentUserInfoService) {
  $scope.greeting = 'Hello World!';
  console.log(currentUser);
  $scope.currentUser = currentUser;
  $scope.isAuthenticated = isAuthenticated;

  $scope.$on(CurrentUserInfoService.events.user, function(event, user) {
    $scope.currentUser = user;
    $scope.isAuthenticated = !!user;
    alert('Getting Buckets');
    $scope.buckets = CurrentUserInfoService.refreshBuckets();
    var promise = $scope.buckets.$promise;
    promise.then(function(data) {
      $ionicPopup.alert({
        content: JSON.stringify(data),
        title: 'buckets'
      });
    }).catch(function(data) {
      $ionicPopup.alert({
        content: JSON.stringify(data),
        title: 'error'
      });
    });
  });

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