module("Model: fsc_1112")

asyncTest("findAll", function(){
	stop(2000);
	fsc_1112.findAll({}, function(fsc_1112s){
		ok(fsc_1112s)
        ok(fsc_1112s.length)
        ok(fsc_1112s[0].name)
        ok(fsc_1112s[0].description)
		start()
	});
	
})

asyncTest("create", function(){
	stop(2000);
	new fsc_1112({name: "dry cleaning", description: "take to street corner"}).save(function(fsc_1112){
		ok(fsc_1112);
        ok(fsc_1112.id);
        equals(fsc_1112.name,"dry cleaning")
        fsc_1112.destroy()
		start();
	})
})
asyncTest("update" , function(){
	stop();
	new fsc_1112({name: "cook dinner", description: "chicken"}).
            save(function(fsc_1112){
            	equals(fsc_1112.description,"chicken");
        		fsc_1112.update({description: "steak"},function(fsc_1112){
        			equals(fsc_1112.description,"steak");
        			fsc_1112.destroy();
        			start()
        		})
            })

});
asyncTest("destroy", function(){
	stop(2000);
	new fsc_1112({name: "mow grass", description: "use riding mower"}).
            destroy(function(fsc_1112){
            	ok( true ,"Destroy called" )
            	start();
            })
})