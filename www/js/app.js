var fb = new Firebase('https://apppetidentidade.firebaseio.com/');
angular.module('starter', ['ionic', 'firebase','ngCordova','starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
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
   .state('welcome', {
        url: '/welcome',
        templateUrl: "templates/welcome.html",
        controller: 'WelcomeCtrl'
  })
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
    .state('app.chat', {
      url: '/chat',
      views: {
        'menuContent': {
          templateUrl: 'templates/chat.html',
          controller: 'chatCTRL'
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
  $urlRouterProvider.otherwise('/welcome');
});
