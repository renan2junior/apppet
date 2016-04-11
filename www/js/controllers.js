angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, Auth) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
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
   /*    
    Auth.$authWithOAuthPopup("facebook").then(function(authData) {
        console.log(authData);
    });
    */

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

};
})

.controller('meuregistroCTRL', function($scope, $stateParams, Auth) {
    Auth.$onAuth(function(authData) {
  if (authData === null) {
    console.log("Not logged in yet");
  } else {
    console.log("Logged in as", authData.uid);
    console.log( " " , authData.facebook.displayName);
  }
  $scope.authData = authData; // This will display the user's name in our view
});
})

.controller('meuspetsCTRL', function($scope, $stateParams) {
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

.controller('registropetCTRL', function($scope, $stateParams) {
});

