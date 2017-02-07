# PennVR Fireworks Demo

This demo is based on Threejs [PointerLockControls sample](https://threejs.org/examples/?q=pointer#misc_controls_pointerlock) and draws heavily upon the [CustomAttributePoints sample](https://threejs.org/examples/?q=point#webgl_custom_attributes_points). The particle.png file is entirely from this example.

I also reviewed some basics for interacting with GLSL in Three.js [here](https://aerotwist.com/tutorials/an-introduction-to-shaders-part-2/).

By Tim Clancy.

# GitHub Pages site

The demo is available to view at https://timtinkers.github.io/three-js-clancyt/.

# Techniques used

This demo uses Perlin noise to generate the terrain and runs the logic for simulating fireworks on the GPU. Perlin noise was used because it is an easy algorithm to implement, described in class, and gives attractive-looking terrain. I added another modifier to the noise which would increase the scale with distance from the player, giving the illusion that the player is in a valley with mountains in the distance. The fireworks are implemented using shader code to leverage the power of the GPU for particle effects. This enables me to fit many more fireworks on the screen at one time that would otherwise be possible. While I have the CustomAttributePoints example to thank for the idea and example shader code, my own modifications make particles react based on time to shoot off of the "exploding" firework projectile and fade into tiny black specks over time. I believe this technique resulted in some realistic-looking fireworks.

# Instructions on Building

The code should require no additional steps to build. I did not use any additional frameworks or modules besides standard browser-based Javascript. Visiting the GitHub pages site in a WebVR-capable browser should present the scene and the option to enable VR. Clicking the button at the bottom of the scene should work smoothly.

# When in VR mode, did you feel any motion sickness? Why and why not?

I did not feel any sickness in VR mode. I believe this is largely thanks to the stationary camera. Without movement, there is no real physical disconnect between me sitting in my desk chair and me sitting in a field watching fireworks. The visual effects of the fireworks are also relatively subdued, which avoids potential nauseau due to too many particles. Lastly, the use of GPU shaders keeps performance on my machine very high so reprojection does not activate and sickness-inducing frame drops do not occur.

# What was the hardest part of the assignment?

The hardest part of the assignment was figuring out how to implement my two additional asks. While fireworks launched on mouse click was very simple to achieve, the GPU shader implementation took the bulk of my time. I struggled considerably before realizing there was such a good shader-based point-creating example on the Three.js site. My original plan, before discovering how easy this particle implementation really was, was to simply create a sphere and color each vertex randomly white or black. Any fragment on the sphere which was not of a color similar-enough to white was not drawn. Then I scaled the now-jagged sphere outwards. This looked like a rough approximation of a firework's cloud and made for a clever use of the fragment shader, but in the end was still too ugly. The patterns also looked incredibly repetitive.

# What do you wish you’d done differently?

I wish that I'd more carefully scanned every Three.js example ahead of time. Just about every single line of code we possibly needed for this assignment was in one example or another.

# What do you wish we had done differently?

I really enjoyed this homework assignment. I'd never worked with WebVR or Three.js before, so it was a fun new tool to learn. I would just suggest adding more clarified asks to the write-up since I know it was just supposed to be the minimum. I hope my terrain modifications and GPU shaders are acceptable enough to receive full credit, but in the future it would probably be best to know the minimum or some suggestions required to get all the credit.
