angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope,$state, $ionicModal, $timeout,$ionicLoading, wsUserPet) {
    $scope.doLogout = function(){
        wsUserPet.logout();
        $state.go('welcome');
    };
     $scope.showLoader = function() {
        $ionicLoading.show({template: 'Loading...'});
    };
    $scope.hideLoader = function() {
        $ionicLoading.hide();
    };
})

.controller('WelcomeCtrl', function($scope, $state, $ionicLoading, Auth) {
       $scope.loginfb = function() {
        Auth.$authWithOAuthRedirect("facebook").then(function(authData) {
        }).catch(function(error) {
        if (error.code === "TRANSPORT_UNAVAILABLE") {
            Auth.$authWithOAuthPopup("facebook").then(function(authData) {
            console.log(authData);
            });
        } else {
            console.log(error);
        }
        });
    }
    Auth.$onAuth(function(authData){
        $scope.authData = authData; 
        if(authData === null){
            console.log("Not logged in yet");
        }else{
            console.log("Logged in as", authData.uid);
            $state.go('app.buscapet');
        }
     });
})

.controller('chatCTRL', function($scope, $state, $firebaseArray, Auth, Chat) {
    Auth.$onAuth(function(authData){
        $scope.authData = authData; 
        if(authData === null){
            $scope.name = "Anonimo";
        }else{
            $scope.name = $scope.authData.facebook.displayName;
        }
     });
    $scope.messages = Chat;
    $scope.addMessage = function(e) {
    $scope.sendMsg = function() {
            $scope.messages.$add({from: $scope.name, body: $scope.msg});
            $scope.msg = "";
        }
    } 
})

.controller('meuregistroCTRL', function($scope, $stateParams, Auth, RefBase, Usuario) {
    Auth.$onAuth(function(authData){
        $scope.authData = authData; 
         $scope.dados = Usuario.getUser(btoa($scope.authData.facebook.id));
    });
        
     $scope.btsave = function(){
        $scope.dados.nome = $scope.authData.facebook.displayName;
        $scope.dados.displayName = $scope.authData.facebook.displayName;
        $scope.dados.id = $scope.authData.facebook.id;
        $scope.dados.avatar = $scope.authData.facebook.profileImageURL;
        var usuario = RefBase.child("users");
        var id_user = usuario.child(btoa($scope.authData.facebook.id));

           var user_update = Usuario.new();
           user_update.nome = $scope.dados.nome;
           user_update.avatar = $scope.dados.avatar;
           user_update.not_resgate = $scope.dados.not_resgate;
           user_update.endereco = $scope.dados.endereco;
           user_update.celular = $scope.dados.celular;
           user_update.fixo = $scope.dados.fixo;
           user_update.displayName = $scope.dados.displayName;

        
        if(!id_user){
            usuario.child(btoa($scope.authData.facebook.id)).set($scope.dados);
        }else{
            id_user.update(user_update);
        }
    }
})

.controller('meuspetsCTRL', function($scope, $stateParams,$ionicLoading, wsPet, Auth) {
   $scope.pets_list='';
   // Dados do usuario
   Auth.$onAuth(function(authData){
        $scope.authData = authData;
        if(authData === null){
            $scope.name = "Anonimo";
        }else{
            $scope.name = $scope.authData.facebook.displayName;
            $scope.pets_list =  wsPet.get($scope.authData.facebook.id);
        }
     });
})

.controller('adocaoCTRL', function($scope, $stateParams,$ionicLoading, wsPet, Auth) {
   $scope.pets_list='';
   $scope.pets_list =  wsPet.getAdocao();
})

.controller('detalhesCTRL', function($scope, $state ,$ionicPopup, $stateParams, Pet, $ionicLoading, $compile) {
  
  var pet_busca = Pet.get($stateParams.pet_name);
   if (pet_busca) {
       $scope.pet_busca = pet_busca; 
    } else {
       $ionicPopup.alert({
            title: 'Busca Animal',
            template: 'Erro ao buscar o animal selecionado!'
       });
  }
  $scope.initialize = function() {
    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);
    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Uluru (Ayers Rock)'
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });
    $scope.map = map;
  }
    function geocodeAddress() {
        $scope.pet_busca.$loaded().then(function () {
                var petMap = $scope.pet_busca;
                new google.maps.Geocoder().geocode({'address': petMap.pet_endereco}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                            $scope.map.setCenter(results[0].geometry.location);
                            google.maps.event.addListenerOnce($scope.map, 'idle', function(){
                                var marker = new google.maps.Marker({
                                        map: $scope.map,
                                        position: results[0].geometry.location
                                });    
                            });
                    } else {
                            $ionicPopup.alert({ 
                                title: 'Erro',
                                template: 'Erro ao buscar endereço! '
                            });
                    }
                });
        });
    }
    geocodeAddress();
})

.controller('buscapetCTRL', function($scope, $stateParams, $cordovaBarcodeScanner, Pet) {
    $scope.result = false;
     $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            $scope.result = true;
            var pet_busca = Pet.get(imageData.text);
            $scope.pet_busca = pet_busca;
        }, function(error) {
            console.log("An error happened -> " + error);
            $ionicPopup.alert({
                        title: 'Registro',
                        template: 'ERRo'
                    });
        });
    };
    
    
    
    
    var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);
    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Uluru (Ayers Rock)'
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });
    $scope.map = map;

    function geocodeAddress() {
        $scope.pet_busca.$loaded().then(function () {
                var petMap = $scope.pet_busca;
                new google.maps.Geocoder().geocode({'address': petMap.pet_endereco}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                            $scope.map.setCenter(results[0].geometry.location);
                            google.maps.event.addListenerOnce($scope.map, 'idle', function(){
                                var marker = new google.maps.Marker({
                                        map: $scope.map,
                                        position: results[0].geometry.location
                                });    
                            });
                    } else {
                            $ionicPopup.alert({ 
                                title: 'Erro',
                                template: 'Erro ao buscar endereço! '
                            });
                    }
                });
        });
    }
    
})

.controller('registropetCTRL', function($scope, $state, $stateParams, $cordovaCamera, Pet, RefBase, Auth, $ionicPopup) {
   $scope.dados = {}

   // Dados do usuario
   Auth.$onAuth(function(authData){
        $scope.authData = authData; 
        if(authData === null){
            $scope.name = "Anonimo";
        }else{
            $scope.dados.pet_user = $scope.authData.facebook.id;
        }
    }); 
           
   // Save pet    
   $scope.savepet = function(){
       Pet.addPet($scope.dados, function(msg){
          if (msg === 'erro') {
              $ionicPopup.alert({
                  title: 'Registro',
                  template: 'Erro ao registrar animal!'
              });  
          } else {
              $ionicPopup.alert({
                  title: 'Registro',
                  template: 'Animal registrado com sucesso!'
              }).then(function(){
                 $state.go('app.meuspets', {id :msg});   
              });
          }
      });
   }
   
   // upload image 
   $scope.uploadImage = function() {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
	  correctOrientation:true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      var petimageUrl = "data:image/jpeg;base64," + imageData ;
      $scope.dados.pet_image = petimageUrl;
    }, function(err) {
      alert("Erro : " + err);
    });
   }
   
   // QRCode generator
   var qrcode = new QRCode("qrcode",{
        width: 100,
        height: 100,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    function makeCode () {
        console.log($scope.dados.pet_name);      
        qrcode.makeCode($scope.dados.pet_name);
    }
   //makeCode();
});

