// Add to index.js or the first page that loads with your app.
document.addEventListener('deviceready', OneSignalInit, false);
function OneSignalInit() {
    // Uncomment to set OneSignal device logging to VERBOSE  
    // window.plugins.OneSignal.Debug.setLogLevel(6);

    // Uncomment to set OneSignal visual logging to VERBOSE
    // window.plugins.OneSignal.Debug.setAlertLevel(6);

    
    // NOTE: Update the init value below with your OneSignal AppId.  b bv
    window.plugins.OneSignal.initialize("0f8fa9f1-31cf-495a-9d41-5258a1e28050");

  	//Adds an event listener for clicks on notifications
  	
    //Prompts the user for notification permissions.
    //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 6) to better communicate to your users what notifications they will get.
     window.plugins.OneSignal.Notifications.requestPermission(true).then((accepted) => {
        console.log("User accepted notifications: " + accepted);
    });
}