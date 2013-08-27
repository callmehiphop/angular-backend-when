angular.module('dg.backend', ['ngMockE2E'])
  .factory('when', function($httpBackend) {

    'use strict';


    /**
     * Needs to be called with .call(), used to turn
     * arguments into an array.
     *
     * @param  {object} arguments
     * @return {array}  arguments
     */
    var slice = Array.prototype.slice;



    /**
     * Used to make fancy pants routes/responses with $httpBackend
     * since the current setup is ugly as shit when you actually
     * use all the different arguments
     *
     * @param  {string} route url
     * @return {object} request types
     */
    var BackendRequest = function(url) {

      // args to be apply()'d to $httpBackend.when
      var data = [undefined, url];




      /**
       * Exposed Singleton used to set the different arguments
       * that can be used and initiates the request itself
       */
      var setters = {

        /**
         * Does what it says, nothing!
         * Then it returns itself to allow for additional chaining
         *
         * @return {object} setters
         */
        doNothing: getSetters,


        /**
         * Adds data object to params
         * this is typically any data you want to post/put, etc.
         *
         * @param  {object} data
         * @return {object} setters
         */
        using: makeSetter(2),


        /**
         * Headers to be verified from request
         * Will respond with a 401 if they don't checkout
         *
         * @param {object|function} header stuff
         * @return {object} setters
         */
        verify: makeSetter(3),


        /**
         * Once this method is called, it will initiate the request
         * then it will allow for registering a response or telling
         * the request to pass through
         *
         * @return {object} then object
         */
        then: function() {
          var when = $httpBackend.when.apply($httpBackend, data);


          return {

            /**
             * Registers a response to be sent back when
             * the specified route matches what's in the data array
             *
             * @param {number} HTTP status code
             * @param {object|function} data to be sent back
             * @return {object} requestTypes
             */
            respond: thenHandler('respond'),


            /**
             * Tells the request to simple pass through, typically
             * only used for retrieving views and the like
             *
             * @return {object} requestTypes
             */
            passThrough: thenHandler('passThrough')

          };


          /**
           * Creates wrapper for requestHandler object
           * so we can call the desired method while returning
           * the different request types for chaining purposes
           *
           * @param  {string}   method name
           * @return {function} request methods
           */
          function thenHandler(method) {
            return function() {
              var args = slice.call(arguments);
              when[method].apply(when, args);

              return getRequestTypes();
            }
          }

        }

      };


      /**
       * Creates a function to set a supplied value to
       * a specified index, if the index is 0, we run
       * a toUpperCase() to ensure we have valid HTTP methods
       *
       * @param  {number} data index
       * @return {object} setters
       */
      function makeSetter(index) {
        return function(value) {
          data[index] = index ? value : value.toUpperCase();

          return getSetters();
        };
      }


      /**
       * Retrieves the setters object
       * @return {object} setters
       */
      function getSetters() {
        return setters;
      }




      /**
       * Singleton of all the different HTTP request
       * types. Anytime one is used, it basically "resets"
       * the entire procedure, clearing out any old stored data
       */
      var requestTypes = {

        /**
         * Sets HTTP method to DELETE
         * @return {object} setters
         */
        'delete': on('delete'),


        /**
         * Sets HTTP method to GET
         * @return {object} setters
         */
        get: on('get'),


        /**
         * Sets HTTP method to HEAD
         * @return {object} setters
         */
        head: on('head'),


        /**
         * Sets HTTP method to JSONP
         * @return {object} setters
         */
        jsonp: on('jsonp'),


        /**
         * Sets HTTP method to POST
         * @return {object} setters
         */
        post: on('post'),


        /**
         * Sets HTTP method to PUT
         * @return {object} setters
         */
        put: on('put')

      };


      /**
       * Generates the request type methods,
       * once called they will trim the data array
       * down to only the url and request type to remove
       * old data in the event of chaining
       *
       * @param  {string} request type
       * @return {function}
       */
      function on(requestType) {
        return function() {
          var set = makeSetter(0);

          data.length = 2;

          return set(requestType);
        };
      }


      /**
       * Retrieves request type singleton
       * @return {object} request types
       */
      function getRequestTypes() {
        return requestTypes;
      }



      // start the party!
      return getRequestTypes();

    };




    /**
     * The Facade/Subscriber function that creates
     * a new backend request to listen for
     *
     * @param  {string} url
     * @return {object} backend request
     */
    return function(url) {
      return new BackendRequest(url);
    };

  });
