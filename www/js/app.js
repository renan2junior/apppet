var fb = new Firebase('https://apppetidentidade.firebaseio.com/');
angular.module('starter', ['ionic', 'firebase','ngCordova','starter.configs','starter.services','starter.controllers'])

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
    .state('app.adocao', {
      url: '/adocao',
      views: {
        'menuContent': {
          templateUrl: 'templates/adocao.html',
          controller:  'adocaoCTRL' 
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
