//steal/js frosoco_dev/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/clean',function(){
	steal.clean('frosoco_dev/frosoco_dev.html',{indent_size: 1, indent_char: '\t'});
});
