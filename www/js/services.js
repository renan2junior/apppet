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

.factory("Chat", function($firebaseArray,WS_FIREBASE_CFG) {
  var fbRef = WS_FIREBASE_CFG.baseRef;
  var chat = $firebaseArray(fbRef.child('chat'));  
  return chat;
})

.factory('wsPet',function(WS_FIREBASE_CFG, $firebaseArray, $firebaseObject) {
    var Pets = {
            get: function(pet_user){
                var refPets = WS_FIREBASE_CFG.baseRef.child('pets');
                var refq = refPets.orderByChild("pet_user").equalTo(pet_user);
                return $firebaseArray(refq);
            },
            getAdocao: function () {
                var refPets = WS_FIREBASE_CFG.baseRef.child('pets');
                return $firebaseArray(refPets);
            }                    
    };
    return Pets;
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
        addPet: function(pet, callback) {
            
            var pet = WS_FIREBASE_CFG.baseRef.child('pets').child($scope.dados.pet_name);
            if(!pet){
                var push = WS_FIREBASE_CFG.baseRef.child('pets').push();
                var key = push.key();
                push.set(pet, function(error){
                    if (error) {
                        callback('erro');
                    } else {
                        callback(key);
                    }
                });
            }else{
                var update = WS_FIREBASE_CFG.baseRef.child('pets').update;
                var key = push.key();
                push.update(pet, function(error){
                    if (error) {
                        callback('erro');
                    } else {
                        callback(key);
                    }
                });
            }
        },
        getID: function(pepetIdt) {
            var pet = $firebaseObject(WS_FIREBASE_CFG.baseRef.child('pets').child(pepetIdt));
            if(!pet){
                      pet.msg = "erro";  
                      return "erro";
            }else{
                      return pet;
            }
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
                email : 'meu@gmail.com',
                not_resgate:''
            }
            return new_usuario;
        },
        getUser: function(idUser){
            //console.log("IDUSER === >", idUser);
            return $firebaseObject(WS_FIREBASE_CFG.baseRef.child('users').child(idUser));
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
