//steal/js frosoco_dev/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('frosoco_dev/scripts/build.html',{to: 'frosoco_dev'});
});
