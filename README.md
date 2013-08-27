# angular-backend-when

> A wrapper around `$httpBackend` to clean up declaring routes and responses for e2e testing.

### Examples:

##### Easily add a `passThrough` to anything, like your views!
```javascript
when(/^\/views\//).
  get().
    doNothing().
    then().
      passThrough();
```

##### Chain different HTTP request types to the same `when()`
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

##### Or chain the same request type, creating different scenarios based on the data sent/recieved
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


## How to use
### Pass in your route
First thing you need to do is simply call `when` and supply your desired route in the form of a String or Regular Expression.
```javascript
when('/my/awesome/route')
```
### HTTP Response Object
After you call `when` it's going to return an Object containing a list of methods for each HTTP method that Angular accomodates. All you need to do to use it is simply chain.
```javascript
when('/my/awesome/route').get()
```
### Setter Object
Once you've picked your request type, you'll then be given access to an object that can set all the different pieces of data for you. You can chain these methods together, order does not matter.
#### `.doNothing()`
Literally does nothing and is totally optional to use, it was added in to allow your statements to read more like a sentence.
```javascript
when('/my/awesome/route/').
  get().
    doNothing()
```
#### `.using(object)`
Accepts an Object filled with data to expect
```javascript
when('/my/awesome/route').
  post().
    using({
      username: 'jello',
      password: 'biafra'
    })
```
#### `.verify(object|function)`
Checks for supplied headers, can be passed a function or an object.
```javascript
when('/my/awesome/route').
  post().
    verify({
      authToken: 'winnebago warrior'
    })
```
#### `.then()`
When you call this method, you're basically saying your scenario is all setup and you're ready to register a response. Once you call `.then()` it's going to return a different object that has two methods - `passThrough` and `respond`.
```javascript
when('/my/awesome/route').
  post().
    using({
      key: 'value'
    }).
    then().
      respond(200, {
        data: {
          hello: 'world'
        }
      });
      
when(/^\/views\//).
  get().
    doNothing().
    then().
      passThrough();
```
### Chain, chain, chain!
From this point, you can continue to chain addition HTTP request types to the same route, or start all over! It's up to you.
