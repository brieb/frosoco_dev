//steal/js frosoco/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('frosoco/scripts/build.html',{to: 'frosoco'});
});
