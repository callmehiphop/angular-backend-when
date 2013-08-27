`when`.js
=========

`$httpBackend` wrapper to clean up declaring routes/responses for e2e testing

Examples:

Easily add a `passThrough` to anything, like your views!
```javascript
    when(/^\/views\//).
      get().
        doNothing().
        then().
          passThrough();
```
          
Chain different HTTP request types to the same `when()`
```javascript
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
```

Or chain the same request type, creating different scenarios based on the data sent/recieved
```javascript
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
```
