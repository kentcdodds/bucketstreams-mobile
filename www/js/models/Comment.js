angular.module('bs.models').factory('Comment', function($resource, Cacher, BASE_URL) {
  var Comment = $resource(BASE_URL + '/api/v1/rest/comments/:id', { id: '@_id' });
  Comment.prototype.getAuthor = function() {
    return Cacher.userCache.get(this.author);
  };
  return Comment;
});