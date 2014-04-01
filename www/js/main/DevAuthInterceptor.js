angular.module('bs.mobile.app').factory('DevAuthInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = $window.BS.basicAuth;
      }
      return config;
    },
    response: function (response) {
      return response || $q.when(response);
    }
  };
});