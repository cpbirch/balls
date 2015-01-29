#define SPHERES 100

attribute float fragmentColor;

varying vec3 vPosition;
varying float occlusion;
varying vec3 vNormal;
varying float useColor;

uniform vec3 positions[ SPHERES ];
uniform float scales[ SPHERES ];

void main() {

	vPosition = ( modelMatrix * vec4( position, 1. ) ).xyz;
	gl_Position = projectionMatrix *  modelViewMatrix * vec4( position, 1. );

	vec3 nWorld = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

	occlusion = 0.;
	vec3 on = normalize( nWorld );

	float l;
	float t;

	for( int i = 0; i < SPHERES; i++ ) {

		vec3 dir = positions[ i ] - vPosition;
		float l = dir.x * dir.x + dir.y * dir.y + dir.z * dir.z;
		float t = 1. - max( 0., dot( on, dir / sqrt( l ) ) ) * scales[ i ] / l;

		occlusion += t;
	}

	occlusion /= float( SPHERES );
	occlusion = clamp( occlusion, 0., 1. );

	float inBlack = 0.;
	float inWhite = 255.;
	float inGamma = 30.;
	float outBlack = 0.;
	float outWhite = 255.;

	useColor = fragmentColor;

	occlusion = ( pow( ( ( occlusion * 255.0) - inBlack) / (inWhite - inBlack),
								inGamma) * (outWhite - outBlack) + outBlack) / 255.0;


	vNormal = normalMatrix * normal;

}