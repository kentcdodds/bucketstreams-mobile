angular.module('bs.mobile.app').factory('DevAuthInterceptor', function ($rootScope, $q) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = 'Basic Z3Vlc3Q6YnVja2V0c3RyZWFtc3JvY2tzIQ==';
      }
      return config;
    },
    response: function (response) {
      return response || $q.when(response);
    }
  };
});