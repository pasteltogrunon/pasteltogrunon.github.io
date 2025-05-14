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
vec3 palette1(float t)
{
    vec3 a = vec3(1.0, 1.0, 1.0);
    vec3 b = vec3(1.0, 0.5, 0.0);
    vec3 c = vec3(0.5, 1.0, 0.0);
    
    float value = sin(t) * 0.5 + 0.25;
    
    return value * b + (1.0 - value) * c;
}

vec3 palette2(float t, float t2)
{
    vec3 a = vec3(0.0, 0.5, 1.0);
    vec3 b = vec3(1.0, 0.5, 0.0);
    vec3 c = vec3(0.5, 1.0, 0.0);
    
    float value = t * 0.5 + 0.25;
    float value2 = sin(t2) * 0.5 + 0.25;
    
    return value2 * (value * b + (1.0 - value) * c) + (1.0 - value2) * a;
}

vec3 palette3(float t)
{
    vec3 a = vec3(1.0, 1.0, 1.0);
    vec3 b = vec3(0.0, 0.5, 1.0);
    vec3 c = vec3(0.5, 1.0, 0.0);
    
    float value = sin(t) * 0.5 + 0.25;
    
    return value * b + (1.0 - value) * c;
}


vec3 third(vec2 uv)
{
    float s = sin(-iTime-length(uv));
    float s2 = sin((-iTime-length(uv))*0.5- 0.2);
    
    float d = pow(0.01/abs(s), 0.5) + pow(0.01/abs(s2), 0.5);
    
    float p = pow(abs(cos(s)/length(uv)*0.25), 8.0);
    
    vec2 newUV = uv * exp(-0.1*length(uv))*10.0;
    
    float y = 0.5*cos(abs(uv.x)*5.0-iTime*15.0)*sin(iTime*3.0);
    float e = max(abs(y-newUV.y)+length(uv)* 1.0, 0.0);
    
    e = pow(0.1/e, 1.1)*pow(1.2*abs(cos(abs(uv.x)*0.7-iTime*1.0)), 15.0);
    
    
    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
    
    color += vec4(p*palette2(uv.y/length(uv)*2.0, length(uv)*5.0), 1.0);
    
    color += vec4(d*palette1(-iTime + length(uv)), 1.0);
    
    color += vec4(e*palette3(-iTime + abs(uv.y)*3.0), 1.0);
    
    return 0.5*clamp(color.rgb, 0.0, 1.0);
}

vec3 first(vec2 uvIn)
{
    vec2 uv0 = uvIn;
    vec2 uv = uvIn;
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

    finalColor = clamp(pow(finalColor, vec3(1.1)), 0.0, 5.0);
    return finalColor;
}

void main() 
{
    vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / max(iResolution.x, iResolution.y);
    float scrollLerp = 1.0-(scrollColorDecay(iScroll) - 0.05)/0.95;
    float d = length(iMouse.xy - gl_FragCoord.xy) / max(iResolution.x, iResolution.y);;
    float v = abs(d * 2.5);
    v = easeInOutCubic(v);
    v = clamp(v, 0.0, 1.0);
    vec3 finalColor =  (first(uv)*scrollLerp + (1.0-scrollLerp) *third(uv))* v * scrollColorDecay(iScroll);

    gl_FragColor = vec4(finalColor, 1.0);
}