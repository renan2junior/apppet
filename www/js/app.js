// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var fb = new Firebase('https://apppetidentidade.firebaseio.com/');

angular.module('starter', ['ionic', 'firebase','ngCordova', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
// Factory for login with facebook.
.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https://apppetidentidade.firebaseio.com/users");
  return $firebaseAuth(usersRef);
})
.factory("Pets", function($firebaseArray) {
  var petsRef = new Firebase("https://apppetidentidade.firebaseio.com/pets");
  return $firebaseArray(petsRef);
})
.factory("Firebase", function($firebaseref){
    var fb = new Firebase('https://apppetidentidade.firebaseio.com/');
    return $firebaseref(fb);
})
.factory('Pet', function ($firebaseObject) {
    var ref = new Firebase("https://apppetidentidade.firebaseio.com/pets");
    var Pet = {
        get: function (petId) {
            return $firebaseObject(ref.child(petId));
        }
    };
    return Pet;
})
.factory('customeInterceptor',['$timeout','$injector', '$q',function($timeout, $injector, $q) {
  
  var requestInitiated;

  function showLoadingText() {
    $injector.get("$ionicLoading").show({
      template: 'Loading...',
      animation: 'fade-in',
      showBackdrop: true
    });
  };
  
  function hideLoadingText(){
    $injector.get("$ionicLoading").hide();
  };

  return {
    request : function(config) {
      requestInitiated = true;
      showLoadingText();
      console.log('Request Initiated with interceptor');
      return config;
    },
    response : function(response) {
      requestInitiated = false;
        
      // Show delay of 300ms so the popup will not appear for multiple http request
      $timeout(function() {

        if(requestInitiated) return;
        hideLoadingText();
        console.log('Response received with interceptor');

      },300);
      
      return response;
    },
    requestError : function (err) {
      hideLoadingText();
      console.log('Request Error logging via interceptor');
      return err;
    },
    responseError : function (err) {
      hideLoadingText();
      console.log('Response error via interceptor');
      return $q.reject(err);
    }
  }
    }])





.config(function($stateProvider, $urlRouterProvider,$httpProvider) {
  
  $httpProvider.interceptors.push('customeInterceptor');
   $urlRouterProvider.otherwise('/');  
    
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  
  .state('app.loginfb',{
      url:'/loginfb',
      views:{
          'menuContent':{
              templateUrl : 'templates/loginFB.html',
              controller  : 'loginFBCTRL'
          }
      }
  })

  .state('app.meuregistro', {
    url: '/meuregistro',
    views: {
      'menuContent': {
        templateUrl: 'templates/meuregistro.html',
        controller: 'meuregistroCTRL'
      }
    }
  })

  .state('app.meuspets', {
      url: '/meuspets',
      views: {
        'menuContent': {
          templateUrl: 'templates/meuspets.html',
          controller:  'meuspetsCTRL' 
        }
      }
    })
    .state('app.detalhes_pet',{
        url : '/detalhes_pet/:pet_name',
         views: {
            'menuContent': {
            templateUrl : 'templates/detalhes_pet.html',
            controller : 'detalhesCTRL'
            }
         }
    })
    
    .state('app.registropet', {
      url: '/registropet',
      views: {
        'menuContent': {
          templateUrl: 'templates/registropet.html',
          controller: 'registropetCTRL'
        }
      }
    })
    
    .state('app.buscapet', {
      url: '/buscapet',
      views: {
        'menuContent': {
          templateUrl: 'templates/buscapet.html',
          controller: 'buscapetCTRL'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/buscapet');
});
