// -----JS CODE-----
// @input float delaySeconds = 1.0
// @input SceneObject sourceObject
// @input int AsteroidCount
// @input vec3 position
script.api.globali = 0;
function spawn() {
    if (script.api.globali<script.AsteroidCount)
    {
        while (script.api.globali<script.AsteroidCount) // first 5 appear simultaneously 
            {
                var newObj = script.getSceneObject().copyWholeHierarchy(script.sourceObject);
                newObj.setParent(null);
                newObj.getTransform().setWorldPosition(script.position);
                newObj.enabled = true;
                delayedEvent.reset(script.delaySeconds);
                script.api.globali = script.api.globali + 1;
            }
        var newObj = script.getSceneObject().copyWholeHierarchy(script.sourceObject);
        newObj.setParent(null);
        newObj.getTransform().setWorldPosition(script.position);
        newObj.enabled = true;
        delayedEvent.reset(script.delaySeconds);
        script.api.globali = script.api.globali + 1;
    }
}
//
var delayedEvent = script.createEvent("DelayedCallbackEvent");
delayedEvent.bind(spawn);
delayedEvent.reset(script.delaySeconds);

script.createEvent("UpdateEvent").bind(function(){
    if(script.api.globali == 3)
    {
        spawn()
    }
})
