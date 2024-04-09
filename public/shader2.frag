uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;
uniform vec4 iMouse;

void main( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord / iResolution.xy;
    float diff = 0.001;
    float dim = 0.8;
    fragColor = dim * (
        texture(iChannel0, vec2(uv.x-diff, uv.y-diff))+
        texture(iChannel0, vec2(uv.x-diff, uv.y+diff))+
        texture(iChannel0, vec2(uv.x+diff, uv.y-diff))+
        texture(iChannel0, vec2(uv.x+diff, uv.y+diff))
    )/4.;
    
    // Draws a circle around a rotating point
    vec4 mousePos = iMouse;
    float d = distance(mousePos.xy, fragCoord)/iResolution.y;
    
    fragColor += 0.05/d; //* clamp(mousePos.z, 0.0, 1.0);
    fragColor = clamp(pow(fragColor, vec4(1.1)),0.0, 5.0);
}