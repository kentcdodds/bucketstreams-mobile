(function() {
  var app = angular.module('bs.mobile.app', ['ionic', 'bs.common']);


  app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push('DevAuthInterceptor');

    function resolve(thing) {
      return function (CurrentUserInfoService) {
        return CurrentUserInfoService['resolve' + thing]();
      }
    }

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
          isAuthenticated: resolve('Authenticated'),
          currentUser: resolve('User'),
          userBuckets: resolve('Buckets'),
          userStreams: resolve('Streams')
        }
      });

    // if none of the above are matched, go to this one
    $urlRouterProvider.otherwise('/');
  });

  app.run(function($rootScope, $state, CurrentUserInfoService, $ionicPopup) {
    $rootScope.$on(CurrentUserInfoService.events.user, function (event, user) {
      if (!user && /root\.auth/.test($state.current.name)) {
        $state.go('root.anon');
      }
    });
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      console.log(toState.name);
      var authenticated = !!localStorage.getItem('user-token');
      if (/root\.auth/.test(toState.name)) {
        if (!authenticated) {
          event.preventDefault();
          $state.go('root.anon');
        }
      } else if ('root.anon' === toState.name) {
        if (authenticated) {
          event.preventDefault();
          $state.go('root.auth.home');
        }
      }
    });
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      console.error('$stateChangeError');
      console.error(event);
      $ionicPopup.alert({
        content: 'There was a navigation problem.',
        title: 'Uh oh...'
      });
    });
  });
})();