// Field variables.
var size;
var max_height_scale = 160;
var max_distance;

// Get the color of the terrain at a given height.
function generateColor(height) {
	var bottomColor = new THREE.Color(0x228822);
	var topColor = new THREE.Color(0xffffff);
	return bottomColor.lerp(topColor, (height / max_height_scale));
}

// Alter the height scaling so that mountains grow taller in the distance.
function generateHeightScale(x, y) {
	var distance = Math.sqrt(x * x + y * y);
	var distance_scale = (distance / max_distance);
	return (max_height_scale * distance_scale);
}

// Pre-generate the random corner vectors.
function generateCorner() {
	corner = {
		c0x: Math.random(), c0y: Math.random(),
		c1x: Math.random(), c1y: Math.random(),
		c2x: Math.random(), c2y: Math.random(),
		c3x: Math.random(), c3y: Math.random()
	};
	return corner;
}

// Output the terrain's height at a given point.
function generateHeight(x, y) {
	
	// Segment the input into corresponding unit squares.
	var x_pos = x * size + 0.5;
	var y_pos = y * size + 0.5;
	
	// Get the vectorized distance to each corner.
	var c0_d_x = x_pos - Math.floor(x_pos);
	var c0_d_y = y_pos - Math.floor(y_pos);
	var c1_d_x = Math.floor(x_pos + 1) - x_pos;
	var c1_d_y = c0_d_y;
	var c2_d_x = c1_d_x;
	var c2_d_y = Math.floor(y_pos + 1) - y_pos;
	var c3_d_x = c0_d_x;
	var c3_d_y = c2_d_y;
	 
	// Take dot product of distance and randomly-generated vector.
	var corner = generateCorner();
	var c0_prod = c0_d_x * corner.c0x + c0_d_y * corner.c0y;
	var c1_prod = c1_d_x * corner.c1x + c1_d_y * corner.c1y;
	var c2_prod = c2_d_x * corner.c2x + c2_d_y * corner.c2y;
	var c3_prod = c3_d_x * corner.c3x + c3_d_y * corner.c3y;
	
	// Linearly interpolate between the values of dot product vector.
	var c0_3 = c0_prod + (c0_d_y) * (c3_prod - c0_prod);
	var c1_2 = c1_prod + (c1_d_y) * (c2_prod - c1_prod);
	var c0_3_1_2 = c0_3 + (c0_d_x) * (c1_2 - c0_3);
	
	return c0_3_1_2;
}

// Create the procedural terrain mesh.
function generateTerrain() {
	
	// Prepare an empty plane.
	size = 512;
	max_distance = Math.sqrt((size / 2) * (size / 2));
	var valley_scale = 32;
	var spacing = (size / valley_scale);
	var geometry = new THREE.PlaneGeometry(size, size, spacing, spacing);
	var material = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});
	
	// Displace every vertex in the plane according to the height function.
	for (var x = 0; x < spacing; x++) {
		for (var y = 0; y < spacing; y++) {
			var x_perc = x / spacing;
			var y_perc = y / spacing;
			var vertex_idx = (x * spacing + y);
			var vertex = geometry.vertices[vertex_idx];
			var height = generateHeight(x_perc, y_perc);
			var height_scale = generateHeightScale(vertex.x, vertex.y);			
			vertex.z = (height_scale * height);
			geometry.verticesNeedUpdate = true;
		}
	}
	
	// Set the color of each vertex.
	var faces = geometry.faces;
	for (var face_idx = 0; face_idx < faces.length; face_idx++) {
		var face = faces[face_idx];
		var c0 = geometry.vertices[face.a];
		var c1 = geometry.vertices[face.b];
		var c2 = geometry.vertices[face.c];
		face.vertexColors = [generateColor(c0.z), generateColor(c1.z), 
			generateColor(c2.z)];
	}
	
	// Reposition and return plane.
	var plane = new THREE.Mesh(geometry, material);
	plane.rotation.x = -(Math.PI / 2.0);
	plane.position.x = 0;
	plane.position.y = -3;
	plane.position.z = 0;
	return plane;
}