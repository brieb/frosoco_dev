module("Model: Frosoco.Models.User")

asyncTest("findAll", function(){
	stop(2000);
	Frosoco.Models.User.findAll({}, function(users){
		ok(users)
        ok(users.length)
        ok(users[0].name)
        ok(users[0].description)
		start()
	});
	
})

asyncTest("create", function(){
	stop(2000);
	new Frosoco.Models.User({name: "dry cleaning", description: "take to street corner"}).save(function(user){
		ok(user);
        ok(user.id);
        equals(user.name,"dry cleaning")
        user.destroy()
		start();
	})
})
asyncTest("update" , function(){
	stop();
	new Frosoco.Models.User({name: "cook dinner", description: "chicken"}).
            save(function(user){
            	equals(user.description,"chicken");
        		user.update({description: "steak"},function(user){
        			equals(user.description,"steak");
        			user.destroy();
        			start()
        		})
            })

});
asyncTest("destroy", function(){
	stop(2000);
	new Frosoco.Models.User({name: "mow grass", description: "use riding mower"}).
            destroy(function(user){
            	ok( true ,"Destroy called" )
            	start();
            })
})