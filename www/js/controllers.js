angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, Auth) {

  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('loginFBCTRL',function($scope, $stateParams, Auth){
    $scope.loginfb = function() {
        Auth.$authWithOAuthRedirect("facebook").then(function(authData) {
        // User successfully logged in
        }).catch(function(error) {
            
        if (error.code === "TRANSPORT_UNAVAILABLE") {
            Auth.$authWithOAuthPopup("facebook").then(function(authData) {
            // User successfully logged in. We can log to the console
            // since we’re using a popup here
            console.log(authData);
            });
        } else {
            // Another error occurred
            console.log(error);
        }
        });
    }
})

.controller('meuregistroCTRL', function($scope, $stateParams, Auth) {
   
   
   
    Auth.$onAuth(function(authData){
        if(authData === null){
            console.log("Not logged in yet");
        }else{
            console.log("Logged in as", authData.uid);
            console.log( " " , authData.facebook.displayName);
            console.log( " " , authData.facebook.profileImageURL);
        }
        $scope.authData = authData; 
    });
    
    
     $scope.btsave = function(){

        var ref = new Firebase("https://apppetidentidade.firebaseio.com/");

        var objUser = {
            displayName : $scope.authData.facebook.displayName,
            id : $scope.authData.facebook.id,
            imageUrl : $scope.authData.facebook.profileImageURL,
            teste : 'Teste'
        };

        //localStorage.setItem("login", angular.toJson($scope.authData));
        
        var usuario = ref.child("users");
        
        var id_user = usuario.child(btoa(objUser.id));
        
        if(!id_user){
            usuario.child(btoa(objUser.id)).set(objUser);
        }else{
            id_user.update(objUser);
            console.log("O id é : ", id_user.toString());
        }
    }
})

.controller('meuspetsCTRL', function($scope, $stateParams,$ionicLoading, Pets, Auth, Trial) {
    
    $scope.pets_list =  Pets;
    

   Auth.$onAuth(function(authData){
        if(authData === null){
            console.log("Not logged in yet");
        }else{
            console.log("Logged in as", authData.uid);
            console.log( " " , authData.facebook.displayName);
            console.log( " " , authData.facebook.profileImageURL);
        }
        $scope.authData = authData; 
    });


    
})

.controller('buscapetCTRL', function($scope, $stateParams, $cordovaBarcodeScanner) {
    
     $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            alert(imageData.text);
            console.log("Barcode Format -> " + imageData.format);
            console.log("Cancelled -> " + imageData.cancelled);
        }, function(error) {
            console.log("An error happened -> " + error);
        });
    };
 
})

.controller('registropetCTRL', function($scope, $stateParams, $cordovaCamera, Trial) {
    
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

