$(document).ready(function() { 

  var host    = window.location.origin+"/";
  MsgElem     = document.getElementById("msg")
  TokenElem   = document.getElementById("token")
  NotisElem   = document.getElementById("notis")
  ErrElem     = document.getElementById("err")
  // Initialize Firebase
  // TODO: Replace with your project's customized code snippet
   var config = {
    apiKey: "AIzaSyD23aRnKlFRPk7UGlVhUMFsxcQChfPE2rg",
    authDomain: "timelinerc-57999.firebaseapp.com",
    databaseURL: "https://timelinerc-57999.firebaseio.com",
    projectId: "timelinerc-57999",
    storageBucket: "timelinerc-57999.appspot.com",
    messagingSenderId: "840666767189"
  };
  firebase.initializeApp(config);

  const messaging = firebase.messaging();
  
  ask_permission();

  messaging.onMessage(function(payload) {
      console.log("Message received. ", payload);
      // NotisElem.innerHTML = NotisElem.innerHTML + JSON.stringify(payload);
  });

  function ask_permission(){
    messaging
    .requestPermission()
    .then(function () {
        // MsgElem.innerHTML = "Notification permission granted." 
        console.log("Notification permission granted.");
        // get the token in the form of promise
        return messaging.getToken()
    })
    .then(function(token) {
        // TokenElem.innerHTML = "token is : " + token
        save_token(token);
    })
    .catch(function (err) {
        // ErrElem.innerHTML =  ErrElem.innerHTML + "; " + err
        console.log("Unable to get permission to notify.", err);
    });
  }


  function save_token(Token){
    $.ajax({
      url : host + 'welcome/firebase_save_token',
      type: "POST",
      data: {Token : Token},
      dataType: "JSON",
          success: function(json){
            console.log(json);
          },
          error: function (jqXHR, textStatus, errorThrown){
              console.log(jqXHR.responseText);
          }
      });
  }
});