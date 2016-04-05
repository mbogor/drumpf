//controls the extension popup view

var app = angular.module('DrumpfEx', ['ui.router']);


app.controller('ReplaceCtrl', function($scope, $state){


  $scope.SendReplace = function(replace){
    var obj = {};

    obj.o = replace.old; 
    obj.f = replace.fresh;
    console.log(obj)

    chrome.storage.local.get(function(values) {

    if (values.wordsArr) {
      values.wordsArr = JSON.parse(values.wordsArr)
      values.wordsArr.push(obj);

      chrome.storage.local.set({
          'wordsArr': JSON.stringify(values.wordsArr)},
                function() {
                  messageToContentScript()});
    } else {
        var wordsArr = [];
        wordsArr.push(obj)
        chrome.storage.local.set({
            'wordsArr': JSON.stringify(wordsArr)},
            function() {
            messageToContentScript()});
      }
    })


    $state.go('success')
  }

  $scope.options = function(){
    $state.go('options')
  }

})

app.config(function($stateProvider){
  $stateProvider.state('home', {
    controller: 'ReplaceCtrl'
  })
})

app.controller('SuccessCtrl', function($scope, $state){
  $scope.back = function(){
    $state.go('home')
  }
})

app.config(function($stateProvider){
  $stateProvider.state('success', {
    templateUrl: '/success.html',
    controller: 'SuccessCtrl'
  })
})


// adds an options view page

// app.factory('OptionsFactory', function(){
//   var OptionsFactory = {};

//   OptionsFactory.getOptions = function(){

//   chrome.storage.local.get(function(values) {
//       if (values.wordsArr) {
//         console.log('inside of options factory')
//         values.wordsArr = JSON.parse(values.wordsArr)
//         return values.wordsArr;
//       } 
//     }).then(function(storage){
//       console.log('inside of the then statement')
//       return storage;
//     })
    
//   }

//   return OptionsFactory;
// })

// app.config(function($stateProvider){
//   $stateProvider.state('options', {
//     templateUrl: '/options.html',
//     controller: 'OptionsCtrl',
//     resolve:{
//       options: function(OptionsFactory){ 
//         return OptionsFactory.getOptions();
//       }
//     }
//   })
// })


// app.controller('OptionsCtrl', function($scope, $state, options){

//   console.log('OptionsCtrl options', options)

//   $scope.selections = options ||"Nothing in here yet!";



//   $scope.back = function(){
//     $state.go('home')
//   }

//   $scope.delete = function(){

//   }

// })



//content script message
//from: https://developer.chrome.com/extensions/messaging
function messageToContentScript() {
    chrome.storage.local.get(function(values) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            var changedWords = values.wordsArr;

            chrome.tabs.sendMessage(tabs[0].id, {
                words: changedWords
            }, function(response) {
            });
        });
    })
}

$(document).ready(function(){
  messageToContentScript();

})

