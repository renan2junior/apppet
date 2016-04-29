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

.controller('detalhesCTRL', function($scope, $stateParams, Pet) {
   // QRCode generator
   var qrcode = new QRCode("qrcode",{
        width: 100,
        height: 100,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
    qrcode.makeCode($stateParams.pet_name);
    $scope.pet_busca = Pet.get($stateParams.pet_name);
})

.controller('buscapetCTRL', function($scope, $stateParams, $cordovaBarcodeScanner, Pet) {
    $scope.pet_busca = '';
    $scope.result = false;
     $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            $scope.pet_busca = Pet.get(imageData.text);
            if($scope.pet_busca){
                $scope.result = true;
                // QRCode generator
                var qrcode = new QRCode("qrcode",{
                        width: 100,
                        height: 100,
                        colorDark : "#000000",
                        colorLight : "#ffffff",
                        correctLevel : QRCode.CorrectLevel.H
                    });

                function makeCode () {
                    console.log($scope.pet_busca.pet_name);      
                    qrcode.makeCode($scope.pet_busca.pet_name);
                }
                makeCode();    
            }else{
                alert("Pet não encontrado !");
            }
        }, function(error) {
            console.log("An error happened -> " + error);
        });
    };
})

.controller('registropetCTRL', function($scope, $stateParams, $cordovaCamera, Pet, RefBase, Auth) {
   $scope.dados = Pet.new();
   
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
       $scope.showLoader();
       var pets = RefBase.child("pets");
       var pet = pets.child($scope.dados.pet_name);
        if(!pet){
               
                pets.child($scope.dados.pet_name.set($scope.dados)).then(function(){
                    $scope.dados.pet_name = " ";
                    $scope.hideLoader();
                });
            }else{
                pet.update($scope.dados);
                console.log("O id é : ", $scope.dados.toString());
            }
            $scope.dados.pet_name = " ";
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
   makeCode();
});

