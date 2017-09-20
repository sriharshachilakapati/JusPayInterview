// Make sure everything runs only after complete page load
window.onload = function()
{
    // Imports, import from THREE namespace into local scope
    const Mesh  = THREE.Mesh;
    const Scene = THREE.Scene;
    const Euler = THREE.Euler;

    const WebGLRenderer = THREE.WebGLRenderer;

    const PerspectiveCamera = THREE.PerspectiveCamera;
    const MeshPhongMaterial = THREE.MeshPhongMaterial;

    const PointLight  = THREE.PointLight;
    const BoxGeometry = THREE.BoxGeometry;
    const Quaternion  = THREE.Quaternion;

    // Constants for the screen and camera
    const WIDTH = 800;
    const HEIGHT = 600;

    const FOV = 45;
    const ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 10000;

    // The scene, renderer and the camera
    const scene = new Scene();
    const renderer = new WebGLRenderer();
    const camera = new PerspectiveCamera(FOV, ASPECT, NEAR, FAR);

    // Add the canvas to the document so that we can see something
    const canvas = renderer.domElement;
    scene.add(camera);
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(canvas);

    // Create a cube, with dark red color
    let geometry = new BoxGeometry(2, 2, 2);
    let material = new MeshPhongMaterial({ color: 0x880000 });
    let cube = new Mesh(geometry, material);
    scene.add(cube);

    // Create a point light so that we get to see something
    const pointLight = new PointLight(0xFFFFFF);
    pointLight.position.z = 5;
    scene.add(pointLight);

    // Move the camera back so that we can see the cube completely
    camera.position.z = 5;

    // Some variables to control the rotation of the cube
    let deltaMove     = { x: 0, y: 0 };
    let previousMouse = { x: 0, y: 0 };

    let dragging = false;
    let acceleration = 0;

    // Event handlers for mouse control
    function onMouseDown() { dragging = true;  }
    function onMouseUp()   { dragging = false; }

    function onMouseMove(e)
    {
        if (dragging)
        {
            deltaMove.x = e.offsetX - previousMouse.x;
            deltaMove.y = e.offsetY - previousMouse.y;

            // Increase acceleration and limit it to 10 as max
            acceleration = Math.max(acceleration += 3, 10);
        }

        previousMouse.x = e.offsetX;
        previousMouse.y = e.offsetY;
    }

    // Function to handle animation frame. Used to render the contents into the canvas
    function render()
    {
        if (acceleration > 0)
        {
            acceleration--;

            // Create a new Quaternion to perform perfect rotations
            let deltaRotationQuaternion = new Quaternion()
                .setFromEuler(new Euler(
                    toRadians(deltaMove.y * acceleration * 0.015),
                    toRadians(deltaMove.x * acceleration * 0.015),
                    0,
                    'XYZ'
                ));

            // Multiply the quaternion with cube's quaternion to apply rotation
            cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);
        }
        else
            acceleration = 0;

        // Render the scene and request another frame
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    // Start the animation loop
    requestAnimationFrame(render);

    // Add the event listeners to the canvas
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);

    // A helper function to convert degrees into radians
    function toRadians(angle) {
    	return angle * (Math.PI / 180);
    }
}
