

script.api.resetRotation = function() {
    script.getTransform().setWorldRotation(quat.quatIdentity());
}