precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
varying vec2 vUv;
 
const float PI = 3.1415926535897932384626433832795;
const float TAU = PI * 2.;
 
void coswarp(inout vec3 trip, float warpsScale ){
  trip.xyz += warpsScale * .1 * cos(3. * trip.yzx + (u_time * .25));
  trip.xyz += warpsScale * .05 * cos(11. * trip.yzx + (u_time * .25));
  trip.xyz += warpsScale * .025 * cos(17. * trip.yzx + (u_time * .25));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_resolution * .5) / u_resolution.yy + 0.5;
  
  float t = (u_time *.2) + length(fract((uv-.5) *10.));
  float t2 = (u_time *.1) + length(fract((uv-.5) *20.));
  
  vec2 uv2 = uv;
  vec2 uv3 = uv;
	
  vec3 w = vec3(uv.x, uv.y, 1.);
  coswarp(w, 3.);
  
  uv.x+= w.r;
  uv.y+= w.g;
	
  vec3 color = vec3(0., .5, uv2.x);
  
  color.r = sin(u_time *.2) + sin(length(uv-.5) * 10.);
  color.g = sin(u_time *.3) + sin(length(uv-.5) * 20.);
  
  coswarp(color, 3.);
  
  float intensity = smoothstep(color.r, sin(t2), sin(t));
  
  // Teinte bleue uniquement
  vec3 blueColor = vec3(
    intensity * 0.1,        // Rouge très faible
    intensity * 0.3,        // Vert modéré pour nuances
    intensity * 1.0         // Bleu dominant
  );
	
  gl_FragColor = vec4(blueColor, 1.0);
}
