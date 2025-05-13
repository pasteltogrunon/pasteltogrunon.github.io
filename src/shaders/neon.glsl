uniform vec2 iResolution;
uniform float iTime;
uniform vec4 iMouse;
uniform float iScroll;

vec3 palette( float t ) 
{
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 0.718, 0.1);
    vec3 d = vec3(0.984,0.522,0.0);

    return a + b*cos( 6.28318*(c*t+d) );
}

float easeInOutCubic(float x)
{
    if( x < 0.5){
        return 4.0 * x * x * x;
    }
    return 1.0 - pow(-2.0 * x + 2.0, 3.0) * 0.5;
}

float scrollColorDecay(float value)
{
    return 1.0-0.95*easeInOutCubic(pow(value, 0.2));
}

void main() 
{
    vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / max(iResolution.x, iResolution.y);
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);

    for (float i = 0.0; i < 4.0; i++) {
        uv = fract(pow(uv, vec2(2.0)) * 2.0) - 0.5;
        float d = length(uv) * exp(-length(uv0));
        vec3 col = palette(length(uv0) + i * 0.4 + iTime * 0.4);
        d = sin(d * 3.0 + iTime) / 8.0;
        d = abs(d);
        d = pow(0.01 / d, 1.5);
        finalColor += col * d;
    }

    float d = length(iMouse.xy - gl_FragCoord.xy) / max(iResolution.x, iResolution.y);;
    float v = abs(d * 2.5);
    v = easeInOutCubic(v);
    v = clamp(v, 0.0, 1.0);
    finalColor = clamp(pow(finalColor, vec3(1.1)), 0.0, 5.0) * v * scrollColorDecay(iScroll);

    gl_FragColor = vec4(finalColor, 1.0);
}