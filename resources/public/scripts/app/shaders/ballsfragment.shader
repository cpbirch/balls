varying float occlusion;
varying float useColor;

void main(){

	if (useColor < 1.0) {
		gl_FragColor = vec4( 0., occlusion, 0., 1. );
	} else if (useColor < 2.0) {
		gl_FragColor = vec4( occlusion, occlusion, 0., 1. );
	} else if (useColor < 3.0) {
		gl_FragColor = vec4( occlusion, 0., 0., 1. );
	} else if (useColor < 4.0) {
		gl_FragColor = vec4( occlusion, 0.5, 0., 1. );
	} else {
		vec3 color = vec3( occlusion );
		gl_FragColor = vec4( color, 1. );
	}

}