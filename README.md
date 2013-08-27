`when`.js
=========

`$httpBackend` wrapper to clean up declaring routes/responses for e2e testing

Example:

```javascript
angular.module('myApp')
  .run(function(when) {
    
    'use strict';
    
    // do easy pass throughs
    when(/^\/views\//).
      get().
        doNothing().
        then().
          passThrough();
          
          
    // register different HTTP methods to the same address
    when('/awesome/data').
      // GET => /awesome/data
      get().
        verify({
          'X-MY-HEADER': 'weeeee' 
        }).
        then().
          respond(200, {
            data: { 
              you: 'rock' 
            }
          }).
      
      // POST => /awesome/data
      post().
        using({
          username: 'jello',
          password: 'biafra'
        }).
        then().
          respond(200, {
            data: { 
              message: 'winnebago warrior!' 
            }
          });
        

    // create different scenarios for the same request type
    // using/expecting different combinations of data
    when('/log-in').
      // valid credentials
      post().
        using({
          username: 'jello',
          password: 'biafra'
        }).
        verify(function(headers) {
          return headers.authToken === 'winnebago warrior';
        }).
        then().
          respond(200, {
            data: {
              moooove: 'em out'
            }
          }).
          
      // invalid credentials
      post().
        doNothing().
        then().
          respond(401, {
            data: {
              get: 'lost'
            }
          });
        
  });
```
