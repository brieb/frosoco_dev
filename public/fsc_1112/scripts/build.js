//steal/js fsc_1112/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('fsc_1112/scripts/build.html',{to: 'fsc_1112'});
});
