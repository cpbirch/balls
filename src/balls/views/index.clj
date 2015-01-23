(ns balls.views.index
  (:require [balls.views.layout :refer [view-layout]])
  (:use [hiccup.core]))

(def title "Balls!!")

(defn contents []
  (view-layout title
               [:script {:type "x-shader/x-vertex" :id "vs"}
                "" "
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
										//float t = 1. - max( 0., dot( on, dir / l ) ) * pow( scales[ i ], 2. ) / pow( l, 2. );

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
                " ""]

               [:script {:type "x-shader/x-fragment" :id "fragment-shader"}
                "" "
                varying float occlusion;
                varying float useColor;

								void main(){

									if (useColor < 1.0) {
										gl_FragColor = vec4( 0., occlusion, 0., 1. );
									} else if (useColor < 2.0) {
										gl_FragColor = vec4( occlusion, occlusion, 0., 1. );
									} else if (useColor < 3.0) {
										gl_FragColor = vec4( occlusion, 0., 0., 1. );
									} else {
										vec3 color = vec3( occlusion );
										gl_FragColor = vec4( color, 1. );
									}

								}
                " ""]

               [:div {:id "interface"}
                [:button {:id "controls"} "Controls"]]

               [:div {:id "control-interface"}
                [:input {:type "text" :placeholder "cc-tray url" :id "ci-url-text" :value ""}]
                [:input {:type "button" :id "ci-url-fetch-btn" :value "fetch"}]

                [:input {:type "text" :id "filter-field" :placeholder "filter projects. can use regex" :value ""}]

                [:div {:id "selected-pipelines"}]

                [:div {:id "preferences"}
                 [:p {:class "title"} "preferences"]

                 [:input {:type "checkbox" :id "rotate-non-green-text" :checked "checked"}]
                 [:label "rotate non-green pipeline names"]

								 [:br]

								 [:label "repulsion"]
								 [:input {:type "range" :id "repulsion-factor" :min "1" :max "10" :value "1" :step "1"}]

								 [:br]

								 [:label "attraction"]
								 [:input {:type "range" :id "attraction-factor" :min "1" :max "100" :value "1" :step "1"}]

                 ]

                [:input {:type "button" :id "settings-save-btn" :value "save"}]
                [:input {:type "button" :id "settings-close-btn" :value "close"}]]


               [:div {:id "container"}]

               [:script {:data-main "/scripts/app" :src "/scripts/lib/require.js"}]))


