// @input SceneObject onlyship
// @input SceneObject sceneObject
// @input Component.ScriptComponent colliderScript
// @input SceneObject colliderofship
// @input SceneObject powerbar
// @input SceneObject shield
// @input float powerFillSpeed
// @input Component.Text powerText
// @input Component.Text currentScoreNumber
// @input Component.Text finalScoreNumber
// @input SceneObject minimap
// @input Component.Text facttext
// @input Asset.AudioTrackAsset shieldon
// @input Asset.AudioTrackAsset asteroidhit
// @input SceneObject scene
// @input Component.ScriptComponent spawnerscript

// Initalizing
var startgame = false;
var tutorial = false;
var nexttutorial = false;
var gameEnded = false;
var ship = script.sceneObject;
var onlyspaceship = script.onlyship
var transform = ship.getTransform();
var velocity = new vec3(0, 0, 0);
var rotationUp = 0;
var rotationLR = 0;
var thrustAnimTimer = 0.0;
var updegrees = 0;
var orient = 0;
var axes = [vec3.left(),vec3.up(),vec3.forward(),vec3.right(),vec3.down(),vec3.back()];
var axis = axes[orient];
var collider;
var lowPower = script.powerText.text;
var powerTime = 1;
var valChange = 0;
var collideroff = script.colliderofship
var currentScore = 0;
var spaceshipRotation = ship.getTransform().getWorldRotation();
var facts = [
'There are currently over 600,000 known asteroids in our solar system',
'A meteoroid (piece of asteroid) the size of a car falls into the Earth?s atmosphere on average once every year',
'Halleys Comet wont orbit past Earth again until 2061',
'One day on Venus is longer than one year',
'Enceladus, one of Saturn?s smaller moons, reflects 90% of the Suns light',
'The highest mountain discovered is the Olympus Mons, which is located on Mars',
'The Whirlpool Galaxy (M51) was the first celestial object identified as being spiral',
'There are more stars in space than there are grains of sand in the world',
'Any free-moving liquid in outer space will form itself into a sphere',
'The first living mammal to go into space was a dog named Laika from Russia'
]


// Button functions
function onUpPress() {
    addRotationUp();
}

function onDownPress() {
   removeRotationUp();
}

function onLeftPress() {
    removeRotationLR();
}

function onRightPress() {
    addRotationLR();
}

function addRotationUp()
{
    rotationUp = rotationUp - 0.0005;
    if (rotationUp < -0.05)
    {
        rotationUp = -0.05;
    }
    if (rotationUp > 0.02)
    {
        rotationUp = 0.01
    }
    thrustAnimTimer = 1.0;
}

function removeRotationUp()
{
    rotationUp = rotationUp + 0.0005;
    if (rotationUp >0.03)
    {
        rotationUp = 0.03;
    }
    if (rotationUp < -0.02)
    {
        rotationUp = -0.01
    }
    thrustAnimTimer = 1.0;
}

function addRotationLR()
{
    
    rotationLR = rotationLR - 0.0005;
    if (rotationLR < -0.05)
    {
        rotationLR = -0.05;
    }
    if (rotationLR > 0.02)
    {
        rotationLR = 0.01
    }
    thrustAnimTimer = 1.0;
}

function removeRotationLR()
{
    rotationLR = rotationLR + 0.0005;
    if (rotationLR >0.05)
    {
        rotationLR = 0.05;
    }
    if (rotationLR < -0.02)
    {
        rotationLR = -0.01
    }
    thrustAnimTimer = 1.0;
}

// Shield and powerbar
script.powerText.text ="";
var shieldUp = false;
function onShieldPressDown(){
    if (powerTime<0.8)    {
        valChange = 0.03;
        script.shield.enabled = true;
        playSound(script.shieldon)
        shieldUp = true;
    }
    else{
        script.powerText.text = "Charging";
    }
}

function onShieldPressUp(){
    valChange = 0;
    script.powerText.text ="";
    script.shield.enabled = false;
    shieldUp = false;
}


function playSound(sound) {
    if (!sound) {
       return;
    }
     var channel = script.getSceneObject().createComponent("Component.AudioComponent");
    channel.audioTrack = sound;
    channel.play(1)
}


// Collision 
script.createEvent("TurnOnEvent").bind(function(){
    collider = script.colliderScript.api.collider;
    print('initialized ship');
    script.shield.enabled = false;  
       collider.addOnEnterCallback("enemy", function(otherCollider) {
       print("entered collision with " + otherCollider.name);
        if (!script.shield.enabled)
        {
            onlyspaceship.enabled=false
        }
        else{
            currentScore ++;
            script.currentScoreNumber.text = currentScore.toString();
            otherCollider.sceneObject.getParent().destroy()
            script.spawnerscript.api.globali = script.spawnerscript.api.globali - 1;
        }
     });
    collider.addOnCollidingCallback("enemy", function(otherCollider){
        if (!script.shield.enabled)
        {           
            playSound(script.asteroidhit)
            collideroff.enabled = false;
            otherCollider.sceneObject.getParent().destroy()
            script.spawnerscript.api.globali = script.spawnerscript.api.globali - 1;
            startgame = false;
            gameEnded = true;
        }
        else{
            //asteroid destruction effect here!
        }
    });
    collideroff.enabled = false;
 });

// power bar
function updatePowerBar() {
    if (shieldUp){
        powerTime += valChange;
        if (powerTime>1){
            powerTime = 1;
        }           
    }

    if (shieldUp && powerTime>0.99)
    {
        powerTime = 1;
        valChange = 0;
        var powerScale = new vec3(1, 1, 0);
        script.powerText.text = lowPower;
        script.shield.enabled = false;
    }
    else{
        powerTime -= getDeltaTime() * script.powerFillSpeed;
        powerTime = Math.max(0, powerTime);
        
        if (powerTime) {   
            var powerScale = new vec3(1, 1, 1-powerTime);
        }
        else{
            var powerScale = new vec3(1, 1, 1);
        }
    }  
     script.powerbar.getTransform().setLocalScale(powerScale);
}

function applyRotationUp() {  
    transform = ship.getTransform();
    var rotation = transform.getLocalRotation();
    var rotateAmount = quat.angleAxis(rotationUp, axis);
    rotation = rotation.multiply(rotateAmount);
    transform.setLocalRotation(rotation);   
}

function applyRotationLR() { 
    transform = ship.getTransform();
    var rotation = transform.getLocalRotation();
    var rotateAmount = quat.angleAxis(rotationLR, axes[1]);
    rotation = rotation.multiply(rotateAmount);
    transform.setLocalRotation(rotation);  
}

function onStartPress(){
    tutorial = true;
}

function onNextPress(){
    tutorial=false;
    nexttutorial = true;
}

function onPlayPress(){
    nexttutorial=false;
    startgame = true;
    gameEnded = false;
    onlyspaceship.enabled = true;
    collideroff.enabled = true;
    ship.getTransform().setWorldRotation(spaceshipRotation);
    transform = ship.getTransform();
    velocity = new vec3(0, 0, 0);
    rotationUp = 0;
    rotationLR = 0;
    thrustAnimTimer = 0.0;
    updegrees = 0;
    orient = 0;
    lowPower = script.powerText.text;
    powerTime = 1;
    valChange = 0;
    collideroff = script.colliderofship
    currentScore = 0;
    script.currentScoreNumber.text = currentScore.toString();

}

var i = Math.floor(Math.random() * 10);

function onUpdate() {
    applyRotationUp();
    applyRotationLR();

    updatePowerBar();
    if (gameEnded){
        script.scene.getChild(0).enabled = false;
        script.scene.getChild(1).enabled = false;
        script.scene.getChild(2).enabled = false;
        script.scene.getChild(3).enabled = false;
        script.scene.getChild(4).enabled = true;
        script.powerbar.enabled = false;
        script.minimap.enabled = false;
        script.finalScoreNumber.text = currentScore.toString();
        script.facttext.text = facts[i];   
    }
    else if (startgame){
        script.scene.getChild(0).enabled = false;
        script.scene.getChild(1).enabled = false;
        script.scene.getChild(2).enabled = false;
        script.scene.getChild(3).enabled = true;        
        script.scene.getChild(4).enabled = false;
        script.powerbar.enabled = true;
        script.minimap.enabled = true;   
    }
     else if (tutorial){
        script.scene.getChild(0).enabled = false;
        script.scene.getChild(1).enabled = true;
        script.scene.getChild(2).enabled = false;
        script.scene.getChild(3).enabled = false;        
        script.scene.getChild(4).enabled = false;
        script.powerbar.enabled = false;
        script.minimap.enabled = false;
        script.onlyship.enabled = false;
    }
    else if (nexttutorial){
        script.scene.getChild(0).enabled = false;
        script.scene.getChild(1).enabled = false;
        script.scene.getChild(2).enabled = true;
        script.scene.getChild(3).enabled = false;        
        script.scene.getChild(4).enabled = false;
        script.powerbar.enabled = false;
        script.minimap.enabled = false;
        script.onlyship.enabled = false;  
    }
    else{
        script.scene.getChild(0).enabled = true;
        script.scene.getChild(1).enabled = false;
        script.scene.getChild(2).enabled = false;
        script.scene.getChild(3).enabled = false;        
        script.scene.getChild(4).enabled = false;
        script.powerbar.enabled = false;
        script.minimap.enabled = false;
    }
}

script.createEvent("UpdateEvent").bind(onUpdate);

// Other scripts can call these functions
// For example, call them through UIButton's Event Callbacks - Custom Function
script.api.onUpPress = onUpPress;
script.api.onDownPress = onDownPress;
script.api.onLeftPress = onLeftPress;
script.api.onRightPress = onRightPress;
script.api.onShieldPressDown = onShieldPressDown;
script.api.onShieldPressUp = onShieldPressUp;
script.api.onStartPress = onStartPress;
script.api.onPlayPress = onPlayPress;
script.api.onNextPress = onNextPress;
