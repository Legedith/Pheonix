// -----JS CODE-----
var ship = script.getSceneObject();
var transform = ship.getTransform();
var rotation = transform.getLocalRotation();

// give random starting point
var rotn = quat.fromEulerAngles(Math.random() * 2*Math.PI, Math.random() * 2*Math.PI,Math.random() * 2*Math.PI);
ship.getTransform().setLocalRotation(rotn);
var degrees = 0;

// give random axis
var axes = [vec3.left(),vec3.up(),vec3.forward(),vec3.right(),vec3.down(),vec3.back()];
var axis = axes[Math.floor(Math.random() *Math.floor(6))];

// make it move
function onUpdate() {
    var degrees = (Math.random()+1)/2;
    // Convert degrees to radians
    var radians = degrees * (Math.PI / 180);
    
//// Change direction of asteroids randomly    
//    if (Math.floor(Math.random() * 1000)>990)
//    {
//        axis = axes[Math.floor(Math.random() *Math.floor(6))];
//        print("Axis changed");
//    }
    
    // Rotation we will apply to the object's current rotation
    var rotationToApply = quat.angleAxis(radians, axis);
    
    // Get the object's current world rotation
    var oldRotation = ship.getTransform().getWorldRotation();
    var newRotation = rotationToApply.multiply(oldRotation);
    ship.getTransform().setWorldRotation(newRotation);
        
}

script.createEvent("UpdateEvent").bind(onUpdate);
