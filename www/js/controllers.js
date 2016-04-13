angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, Auth) {

  $scope.loginData = {};
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };
  $scope.login = function() {
    $scope.modal.show();
  };
  $scope.doLogin = function() {
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('loginFBCTRL',function($scope, $stateParams, Auth){
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
})

.controller('chatCTRL', function($scope, $state, $firebaseArray, Auth) {
    Auth.$onAuth(function(authData){
        $scope.authData = authData; 
        if(authData === null){
            $scope.name = "Anonimo";
            alert($scope.name);
            console.log("Not logged in yet");
        }else{
            $scope.name = $scope.authData.facebook.displayName;
            alert($scope.name);
            console.log("Logged in as", authData.uid);
        }
     });
    var ref = new Firebase("https://apppetidentidade.firebaseio.com/chat");    
    $scope.messages = $firebaseArray(ref);
    $scope.addMessage = function(e) {
    $scope.sendMsg = function() {
            $scope.messages.$add({from: $scope.name, body: $scope.msg});
            $scope.msg = "";
        }
    } 
})

.controller('meuregistroCTRL', function($scope, $stateParams, Auth) {
    Auth.$onAuth(function(authData){
        if(authData === null){
            console.log("Not logged in yet");
        }else{
            console.log("Logged in as", authData.uid);
        }
        $scope.authData = authData; 
    });
    var usuario = {
        id : '',
        nome : '',
        avatar : '',
        celular : '21 99998888',
        fixo : '21 33339999',
        endereco : 'Rua Tal',
        email : 'meu@gmail.com'
    }
     $scope.dados = usuario;
    
     $scope.btsave = function(){
        var ref = new Firebase("https://apppetidentidade.firebaseio.com/");
        $scope.dados.nome = $scope.authData.facebook.displayName;
        $scope.dados.id = $scope.authData.facebook.id;
        $scope.dados.avatar = $scope.authData.facebook.profileImageURL;
        var usuario = ref.child("users");
        var id_user = usuario.child(btoa($scope.dados.id.id));
        if(!id_user){
            usuario.child(btoa($scope.dados.id)).set($scope.dados);
        }else{
            id_user.update($scope.dados);
            console.log("O id é : ", id_user.toString());
        }
    }
})

.controller('meuspetsCTRL', function($scope, $stateParams,$ionicLoading, Pets) {
    $scope.pets_list =  Pets;
})

.controller('detalhesCTRL', function($scope, $stateParams, Pet) {
    
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
            }else{
                alert("Pet não encontrado !");
            }
        }, function(error) {
            console.log("An error happened -> " + error);
        });
    };
})

.controller('registropetCTRL', function($scope, $stateParams, $cordovaCamera) {
  var ref = new Firebase("https://apppetidentidade.firebaseio.com/"); 
   // Class Pet
   var Pet = {
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
   $scope.dados = Pet;        
   // Save pet    
   $scope.savepet = function(){
       console.log("nome pet :", $scope.dados.pet_name);
       console.log("pet      :", $scope.dados);
       var pets = ref.child("pets");
       var pet = pets.child($scope.dados.pet_name);
        if(!pet){
                pets.child($scope.dados.pet_name.set($scope.dados));
            }else{
                pet.update($scope.dados);
                console.log("O id é : ", $scope.dados.toString());
            }
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

