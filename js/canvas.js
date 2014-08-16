var canvas;

function initCanvas(){
	canvas = new fabric.Canvas('main-canvas');

	canvas.setHeight(400);
	canvas.setWidth(400);
	canvas.renderAll();

	// Listener for new file loaded from user's file system
	$("#imageLoader").change(loadImageCallback);

	// Listener for remove current image button
	$("#removeButton").click(removeImageCallback);

	// Listener for save button
	$("#saveButton").click(saveImageCallback);
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

			// Update height and width of canvas if smaller than current image
			if (currHeight < imgInstance.currentHeight) {
				canvas.setHeight(imgInstance.currentHeight);
			}
			if (currWidth < imgInstance.currentWidth){
				canvas.setWidth(imgInstance.currentWidth);
			}

			// Redraw
			canvas.renderAll();
		}
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

var saveImageCallback = function(ev){
	console.log("save");
	this.href = canvas.toDataURL({
		format: 'jpeg',
		quality: 0.8
	});	
	this.download = 'test.png';
};
