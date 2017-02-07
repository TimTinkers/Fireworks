// Generate a firework launched upwards from the given position.
function generateFirework(x, y, z) {
	
	// All fireworks have a speed, size, fuse, and color.
	var speed = 4 + (5 * Math.random());
	var size = Math.random() / 20;
	var fuse = 3 + (3 * Math.random());
	var color = new THREE.Color(Math.random(), Math.random(), Math.random());
	
	// Setup firework scene object.
	var geometry = new THREE.SphereGeometry(size, 8, 8);
	var material = new THREE.PointsMaterial();
	material.color = color;
	var firework = new THREE.Mesh(geometry, material);
	firework.position.x = x;
	firework.position.y = y;
	firework.position.z = z;
	firework.speed = speed;
	firework.fuse = fuse;
	return firework;
}

// Generates an explosion at the given position.
// I am very fortunate that I could draw heavily from
// the three.js examples on particles for this part.
// A lot of this is taken from the "custom attribute points" demo.
function generateExplosion(firework) {
	
	// Set explosion parameters.
	var amount = 500;
	var duration = 2 + (Math.random() * 6);
	var color = firework.material.color;
	
	// Setup base geometry with attributes.
	var positions = new Float32Array(amount * 3);
	var vertex = new THREE.Vector3();
	var directions = new Float32Array(amount * 3);
	var direction = new THREE.Vector3();
	var colors = new Float32Array(amount * 3);
	var sizes = new Float32Array(amount);
	
	// Set all attributes.
	for (var i = 0; i < amount; i++) {
		vertex.x = firework.position.x;
		vertex.y = firework.position.y;
		vertex.z = firework.position.z;
		vertex.toArray(positions, i * 3);
		
		direction.x = (2 * Math.random() - 1);
		direction.y = (2 * Math.random() - 1);
		direction.z = (2 * Math.random() - 1);
		direction.toArray(directions, i * 3);
		
		color.toArray(colors, i * 3);
		
		sizes[i] = Math.random() * 2;
	}
	
	// Add attributes to geometry.
	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.addAttribute('direction', new THREE.BufferAttribute(directions, 3));
	geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
	geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));

	// GLSL vertex and fragment shader code.
	var vertexShader = [
		'uniform float time;',
		'attribute float size;',
		'attribute vec3 direction;',
		'attribute vec3 customColor;',
		'varying vec3 vColor;',
		'void main() {',
			'vColor = (size * customColor);',
			'vec4 mvPosition = (modelViewMatrix * vec4(position, 1.0)) + (time * vec4(direction, 1.0));',
			'gl_PointSize = size * (300.0 / -mvPosition.z);',
			'gl_Position = projectionMatrix * mvPosition;',
		'}'
	].join("\n");
	
	var fragmentShader = [
		'uniform vec3 color;',
		'uniform sampler2D texture;',
		'varying vec3 vColor;',
		'void main() {',
			'gl_FragColor = vec4(color * vColor, 1.0);',
			'gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);',
		'}'
	].join("\n");
	
	// Setup the material. I took this boilerplate and 
	// "particle.png" from the aforementioned points demo.
	var material = new THREE.ShaderMaterial({
		uniforms: {
			time: { value: 1.0 },
			color: { value: new THREE.Color(0xffffff) },
			texture: { value: new THREE.TextureLoader().load('./particle.png') }
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		blending: THREE.AdditiveBlending,
		depthTest: true,
		transparent: true
	});

	// Return the shaded object to display fireworks effect.
	sphere = new THREE.Points(geometry, material);
	sphere.position = firework.position;
	sphere.duration = duration;
	return sphere;
}