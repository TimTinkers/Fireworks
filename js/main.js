// Important scene field variables.
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, (window.innerWidth / window.innerHeight), 0.1, 1000);
var controls = new THREE.VRControls(camera);
var raycaster = new THREE.Raycaster();
var clock = new THREE.Clock();
var isMouseDown = false;

// Renderer settings.
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Apply effects and event listeners to the renderer.
var effect = new THREE.VREffect(renderer);
renderer.domElement.addEventListener('mousedown', onMouseDown, false);

// Setup crosshair for scene.
var crosshair = new THREE.Mesh(
	new THREE.RingGeometry(0.02, 0.04, 32),
	new THREE.MeshBasicMaterial({
		color: 0x888888,
		opacity: 0.5,
		transparent: true
	})
);
crosshair.position.z = -2;

// Setup lighting for the scene.
var light1 = new THREE.DirectionalLight(0xffffff, 0.8);
light1.position.set(10, 10, 10);
var light2 = new THREE.DirectionalLight(0xffffff, 0.2);
light2.position.set(-10, 5, -10);
var light3 = new THREE.AmbientLight( 0x404040 );

// Generate terrain mesh.
var terrain = generateTerrain();

// Add scene elements.
camera.add(crosshair);
scene.add(camera);
scene.add(light1);
scene.add(light2);
scene.add(light3);
scene.add(terrain);

// VR-test button, taken from Cube demo.
if (navigator.getVRDisplays) {
	navigator.getVRDisplays()
		.then(function(displays) {
			effect.setVRDisplay(displays[0]);
			controls.setVRDisplay(displays[0]);
		}).catch(function() {
			// no displays
		});
	document.body.appendChild(WEBVR.getButton(effect));
}

// Mouse control flags.
function onMouseDown() { isMouseDown = true; }

// Field variables for fireworks display.
var fireworks = [];
var explosions = [];
var getOne = false;
var fullTime = 0;
var center = new THREE.Vector2();

// Define the main rendering loop.
function render() {
	effect.requestAnimationFrame(render);
	
	// Update time and occasionally spawn a firework.
	var delta = clock.getDelta();
	fullTime += delta;
	if (Math.random() < 0.33) {
		var x = (100 * Math.random()) - 50;
		var z = (100 * Math.random()) - 50;
		var firework = generateFirework(x, 0, z);
		scene.add(firework);
		fireworks.push(firework);
	}

	// Process all fireworks in the scene.
	var processedFireworks = [];
	for (var i = 0; i < fireworks.length; i++) {
		var firework = fireworks[i];
		var speed = firework.speed;
		firework.position.y += speed * delta;
		firework.fuse -= delta;
		if (firework.fuse <= 0) {
			if (!getOne) {
				var explosion = generateExplosion(firework);
				explosion.start = fullTime;
				explosions.push(explosion);
				scene.add(explosion);
				// getOne = true;
			}
			scene.remove(firework);
		} else {
			processedFireworks.push(firework);
		}
	}
	fireworks = processedFireworks;
	
	// Process all explosions in the scene.
	var processedExplosions = [];
	for (var i = 0; i < explosions.length; i++) {
		var explosion = explosions[i];
		var start = explosion.start;
		var currentDuration = (fullTime - start);
		var percent = (currentDuration / explosion.duration);
		var time = explosion.material.uniforms.time;
		time.value = currentDuration;
		time.needsUpdate = true;
				
		// Modify explosion size.
		var attributes = explosion.geometry.attributes;
		for (var j = 0; j < attributes.size.array.length; j++) {
			attributes.size.array[j] = (1 - percent);
		}
		attributes.size.needsUpdate = true;
		
		// Remove explosion if it is over.
		if (percent >= 1.0) {
			scene.remove(explosion);
		} else {
			processedExplosions.push(explosion);
		}
	}
	explosions = processedExplosions;
	
	// If the mouse is down, shoot a firework from the ground.
	if (isMouseDown === true) {
		raycaster.setFromCamera(center, camera);
		var intersects = raycaster.intersectObjects(scene.children);
		for (var i = 0; i < intersects.length; i++) {
			var launch = intersects[i].point;
			var firework = generateFirework(launch.x, launch.y, launch.z);
			scene.add(firework);
			fireworks.push(firework);
			break;
		}
	}
	
	controls.update();
	effect.render(scene, camera);
}

// Start rendering.
render();