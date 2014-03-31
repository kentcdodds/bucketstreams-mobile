(function() {
  var app = angular.module('bsm.app', ['ionic', 'bs.common']);

  app.config(function($stateProvider, $urlRouterProvider) {

    var resolveCurrentUserInfo = {};
    _.each(['User', 'Buckets', 'Streams'], function(thing) {
      resolveCurrentUserInfo['resolve' + thing] = function(CurrentUserInfoService, isAuthenticated) {
        if (!isAuthenticated) return null;
        var thingVal = CurrentUserInfoService['get' + thing]();
        if (_.isEmpty(thingVal)) {
          thingVal = CurrentUserInfoService['refresh' + thing]();
        }
        if (thingVal.hasOwnProperty('$resolved')) {
          if (thingVal.$resolved) {
            return thingVal;
          } else {
            return thingVal.$promise;
          }
        } else {
          return thingVal;
        }
      }
    });

    function resolveParameter(param) {
      return function($stateParams) {
        return $stateParams[param];
      }
    }

    var usernameUrl = '{username:(?:[a-zA-Z]|_|\\d){3,16}}';

    $stateProvider
      .state('root', {
        url: '/',
        templateUrl: 'js/main/root.html',
        controller: 'MainCtrl',
        resolve: {
          isAuthenticated: function() {
            return !!localStorage.getItem('user-token');
          },
          currentUser: resolveCurrentUserInfo.resolveUser,
          userBuckets: resolveCurrentUserInfo.resolveBuckets,
          userStreams: resolveCurrentUserInfo.resolveStreams
        }
      });

    // if none of the above are matched, go to this one
    $urlRouterProvider.otherwise('/');
  });
})();