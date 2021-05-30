// @input Component.RenderMeshVisual minimapSphere
// @input SceneObject targetObject
// @input SceneObject targetRootObject

var sphereBounds = script.minimapSphere.mesh.aabbMax.sub(script.minimapSphere.mesh.aabbMin);
var sphereRadius = sphereBounds.x * 0.5;

var thisTransform = script.getTransform();
var targetTransform = script.targetObject.getTransform();
var rootTransform = script.targetRootObject.getTransform();

script.getSceneObject().setParent(script.minimapSphere.getSceneObject());
thisTransform.setLocalPosition(vec3.zero());

var visual = script.getSceneObject().getComponent("Component.Visual");
if (visual) {
    visual.setRenderOrder(script.minimapSphere.getRenderOrder()-1);
}

function onLateUpdate() {
    if (isNull(script.targetObject)) {
        script.getSceneObject().destroy();
    } else {
        var offset = targetTransform.getWorldPosition().sub(rootTransform.getWorldPosition());
        var direction = offset.normalize();
        thisTransform.setLocalPosition(direction.uniformScale(sphereRadius));
    }
}

script.createEvent("LateUpdateEvent").bind(onLateUpdate);

