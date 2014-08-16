// Declare global variables
var canvas;
var cb;

// Called on document load
function initCanvas(){
	canvas = new fabric.Canvas('main-canvas');

	canvas.setHeight(400);
	canvas.setWidth(400);
	canvas.renderAll();

	// Init codebird.js
	cb = new Codebird;
    
    cb.setConsumerKey("i3BDCq9mxkjnYBGXV8G00jmr8", "vGz2ZDXjKouT4jSCryW20LWASm0gS9dxvoFkLv7R6vTDDTA0uG");
    //cb.setUseProxy(false);
	// Listener for new file loaded from user's file system
	$("#imageLoader").change(loadImageCallback);

	// Listener for remove current image button
	$("#removeButton").click(removeImageCallback);

	// Listener for save button
	$("#saveButton").click(saveImageCallback);

	$("#tweetButton").click(exportToTwitter);

	//Listener for adding parantheses
	$("#brackets").click(loadBrackets);
}

// Callback for new file loaded from user's file system:
// Add new Fabric Image object to canvas
var loadImageCallback = function (src){
	var currHeight = canvas.height;
	var currWidth = canvas.width;

	var reader = new FileReader();

	// Onload, create new Image 
	reader.onload = function(ev) {
		var img = new Image();

		// Upon image load, create instance of Fabric image and add to Fabric canvas
		img.onload = function() {
			var imgInstance = new fabric.Image(img);
			canvas.add(imgInstance);



			// // Update height and width of canvas if smaller than current image
			// if (currHeight < imgInstance.currentHeight) {
			// 	canvas.setHeight(imgInstance.currentHeight);
			// }
			// if (currWidth < imgInstance.currentWidth){
			// 	canvas.setWidth(imgInstance.currentWidth);
			// }

			if (currHeight < imgInstance.currentHeight || currWidth < imgInstance.currentWidth){
				imgInstance.scale(.2);
			}

			// //Setting absolute maximum height and width
			// if (canvas.height > 600) {
			// 	canvas.setHeight(canvas.height*.2);
			// 	canvas.setWidth(canvas.width*.2);
			// }
			// if(canvas.width > 600) {
			// 	canvas.setHeight(canvas.height*.2);
			// 	canvas.setWidth(canvas.width*.2)
			// }



			// Redraw
			canvas.renderAll();

							//Make buttons appear

	var buttons = document.getElementsByTagName("button");
	for(var i=0; i<buttons.length; i++){
		buttons[i].style.visibility="visible";
	}

	//Make file uploader disappear
	document.getElementById("form").style.visibility="hidden";
		}
		img.crossOrigin = 'anonymous';
		img.src = ev.target.result;
	}

	// For each selected file, display
	for (var i = 0; i < src.target.files.length; i++){
		reader.readAsDataURL(src.target.files[i]);
	}

};

// Callback for removing an image, if one is currently selected on button press.
var removeImageCallback = function(){
	var currObject = canvas.getActiveObject();
	if (currObject){	
		canvas.remove(currObject);
	}
};

// Callback for saving current canvas to file system
var saveImageCallback = function(ev){
	console.log("save");
	this.href = canvas.toDataURL({
		format: 'jpeg',
		quality: 0.8
	});	
	this.download = 'test.png';
};

// Callback for exporting current canvas to Twitter
var exportToTwitter = function(ev) {
	cb.__call(
    	"oauth_requestToken",
    	{oauth_callback: "oob"},
    	function (reply) {
    		cb.setToken(reply.oauth_token, reply.oauth_token_secret);
    		// gets the authorize screen URL
	        cb.__call(
	            "oauth_authorize",
	            {},
	            function (auth_url) {
	                window.codebird_auth = window.open(auth_url);
	                verifyPIN();
	            }
	        );
    	}
    );
};

// Inserts field and button for submitting PINs 
function verifyPIN() {
	// Inject PIN field
	var PINField = $('<input id="pin-field"/>');
	$("#image-container").append(PINField);
	var PINSubmit = $('<button style="visibility:visible;" id="submitPIN">Submit</button>');
	$("#image-container").append(PINSubmit);

	var pinfield = $("#pin-field");
	var button = $("#submitPIN");

	// Listener for PIN Submit
	button.click(function(){
		cb.__call(
			"oauth_accessToken",
		    {oauth_verifier: pinfield.val()},
		    function (reply) {
		        // store the authenticated token, which may be different from the request token (!)
		        cb.setToken(reply.oauth_token, reply.oauth_token_secret);
		        var dataURL = canvas.toDataURL();
		        var res = dataURL.split(",");

		        // Set parameters for image upload
		        if (dataURL){
			        var params = {
			        	"status": "I HAZ A (RED) PHOTO LOLCATZ",
			        	"media[]": res[1]
			        };

			        cb.__call(
			        	"statuses_updateWithMedia",
			        	params,
			        	function (reply) {
			        		console.log(reply);
	    				}
			        );
		    	}
		    }
		);
	});
}

var loadBrackets = function(){
	// var imgInstance = new fabric.Image.fromURL('red_brackets.png', function(oImg) {
 //  		canvas.add(oImg);
	// });
	fabric.util.loadImage('red_brackets.png', function(img){
		var object = new fabric.Image(img);
		object.set({
			left: 0,
			top: 0
		});
	 	canvas.add(object);
	 	canvas.renderAll();
	 }, null, {crossOrigin: 'Anonymous'});

	canvas.renderAll();
}
