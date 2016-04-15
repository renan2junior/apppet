angular.module('starter.services', [])

.factory('wsUserPet', function(WS_FIREBASE_CFG, $firebaseAuth, $firebaseObject) {
    var fbRef = WS_FIREBASE_CFG.baseRef;
    var auth = $firebaseAuth(fbRef.child('users'));
    function logout() {
        WS_FIREBASE_CFG.baseRef.unauth();
    }
    return {
      getUser: function($firebaseAuth){
          return $firebaseAuth(fbRef.child('users'));
      },
      logout: function () {
            return auth.$unauth();
      }
  };
})

.factory("Auth", function($firebaseAuth,WS_FIREBASE_CFG) {
  var fbRef = WS_FIREBASE_CFG.baseRef;
  var auth = $firebaseAuth(fbRef.child('users'));  
  return auth;
})

.factory('wsPet',function(WS_FIREBASE_CFG, $firebaseArray, $firebaseObject) {
    return{
        getPets: function(){
            return $firebaseArray(WS_FIREBASE_CFG.baseRef.child('pets'))
        }
    }
})

.factory('RefBase', function(WS_FIREBASE_CFG){
    var fbRef = WS_FIREBASE_CFG.baseRef;    
    return fbRef;
})

.factory('Pet', function (WS_FIREBASE_CFG, $firebaseObject) {
    var Pet = {
        get: function (petId) {
            return $firebaseObject(WS_FIREBASE_CFG.baseRef.child('pets').child(petId));
        },
        new: function(){
            var new_pet = {
                pet_name: 'Toto',
                pet_racao: 'Rui',
                pet_idade: '2',
                pet_image: 'http://thewatchfullepisodes.com/wp-content/uploads/2016/03/no-image.png',
                pet_sexo:'macho',
                pet_tipo_idade:'anos',
                pet_descricao:'Bom',
                pet_porte:'pequeno',
                pet_raca:'Viralata',
                pet_tipo:'cao'
            }
            return new_pet;
        }
    };
    return Pet;
})

.factory('Usuario', function (WS_FIREBASE_CFG, $firebaseObject) {
    var Usuario = {
        get: function (petId) {
            return $firebaseObject(WS_FIREBASE_CFG.baseRef.child('pets').child(petId));
        },
        new: function(){
            var new_usuario = {
                id : '',
                nome : '',
                avatar : '',
                celular : '21 99998888',
                fixo : '21 33339999',
                endereco : 'Rua Tal',
                email : 'meu@gmail.com'
            }
            return new_usuario;
        }
    };
    return Usuario;
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

;
