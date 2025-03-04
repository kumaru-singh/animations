// // const observer = new IntersectionObserver((entries) => {
// //   entries.forEach((entry) => {  
// //     console.log(entry)
// //     if(entry.isIntersecting){
// //         entry.target.classList.add('show');
// //     } else {
// //         entry.target.classList.remove('show');
// //     }
// // });
// // });

// // const hiddenElements = document.querySelectorAll('.hidden');
// // hiddenElements.forEach((el) => 
// //   observer.observe(el)
// // );
 
// //  In the code above, we are creating an IntersectionObserver instance and passing a callback function that will be called whenever an observed element intersects with the viewport. 
// //  The callback function receives an array of  IntersectionObserverEntry  objects, each of which contains information about the intersection of the observed element with the viewport. 
// //  We then iterate over each entry and check if the element is intersecting with the viewport. If it is, we add the  show  class to the element; otherwise, we remove the  show  class. 
// //  Finally, we select all elements with the  hidden  class and call the  observe  method on each of them to start observing their intersection with the viewport. 
// //  Now, when you scroll the page, the elements with the  hidden  class will be revealed when they come into view. 
// //  Conclusion 
// //  In this article, we discussed how to use the Intersection Observer API to detect when an element comes into view. We covered the basics of the Intersection Observer API and how to use it to create lazy loading images and reveal elements when they come into view. 
// //  The Intersection Observer API provides a powerful way to monitor the visibility of elements on a web page and trigger actions based on their visibility. It is a great tool for optimizing the performance of web applications by loading content only when it is needed. 
// //  If you want to learn more about the Intersection Observer API, check out the  MDN Web Docs for detailed information and examples. 
// //  LogRocket: Full visibility into your web apps 
// //  LogRocket is a frontend application monitoring solution that lets you replay JavaScript errors as if they happened in your own browser. Instead of guessing why errors happen, or asking users for screenshots and log dumps, LogRocket lets you replay the session to quickly understand what went wrong. It works perfectly with any app, regardless of framework, and has plugins to log additional context from Redux, Vuex, and @ngrx/store. 
// //  In addition to logging Redux actions and state, LogRocket records console logs, JavaScript errors, stacktraces, network requests/responses with headers + bodies, browser metadata, and custom logs. It also instruments the DOM to record the HTML and CSS on the page, recreating pixel-perfect videos of even



// document.addEventListener("DOMContentLoaded", () => {
//     const hiddenElements = document.querySelectorAll(".hidden");

//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach((entry) => {
//             if (entry.isIntersecting) {
//                 entry.target.classList.add("show");
//             }
//         });
//     }, { threshold: 0.1 });

//     hiddenElements.forEach((el) => observer.observe(el));
// });
// Real-time Water Simulation with Mouse Ripples using WebGPU

async function initWebGPU() {
    if (!navigator.gpu) {
        console.error("WebGPU is not supported on this browser.");
        return;
    }

    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext("webgpu");
    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format });

    const vertexShaderCode = `
        struct VertexOutput {
            @builtin(position) Position : vec4<f32>;
            @location(0) uv : vec2<f32>;
        };
        
        @vertex
        fn main(@location(0) position : vec2<f32>) -> VertexOutput {
            var out: VertexOutput;
            out.Position = vec4<f32>(position, 0.0, 1.0);
            out.uv = (position + vec2<f32>(1.0)) * 0.5;
            return out;
        }
    `;

    const fragmentShaderCode = `
        @fragment
        fn main(@location(0) uv : vec2<f32>) -> @location(0) vec4<f32> {
            let color = vec4<f32>(0.0, 0.5 + uv.y * 0.5, 1.0, 1.0);
            return color;
        }
    `;

    const computeShaderCode = `
        struct Uniforms {
            time: f32;
            mouseX: f32;
            mouseY: f32;
        };
        
        @group(0) @binding(0) var<uniform> uData: Uniforms;
        @group(0) @binding(1) var<storage, read_write> waveData: array<f32>;

        @compute @workgroup_size(64)
        fn main(@builtin(global_invocation_id) id: vec3<u32>) {
            let index = id.x;
            let waveHeight = sin(uData.time + f32(index) * 0.1) * 0.05;
            
            let distance = abs(f32(index) / 1024.0 - uData.mouseX);
            if (distance < 0.05) {
                waveHeight += exp(-distance * 50.0) * 0.2;
            }

            waveData[index] = waveHeight;
        }
    `;

    const vertexShaderModule = device.createShaderModule({ code: vertexShaderCode });
    const fragmentShaderModule = device.createShaderModule({ code: fragmentShaderCode });
    const computeShaderModule = device.createShaderModule({ code: computeShaderCode });

    const pipeline = device.createRenderPipeline({
        layout: "auto",
        vertex: { module: vertexShaderModule, entryPoint: "main", buffers: [] },
        fragment: {
            module: fragmentShaderModule,
            entryPoint: "main",
            targets: [{ format }],
        },
        primitive: { topology: "triangle-strip" },
    });

    const computePipeline = device.createComputePipeline({
        layout: "auto",
        compute: { module: computeShaderModule, entryPoint: "main" },
    });

    const waveBuffer = device.createBuffer({
        size: 1024 * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const uniformBuffer = device.createBuffer({
        size: 12,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const bindGroup = device.createBindGroup({
        layout: computePipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: { buffer: waveBuffer } },
        ],
    });

    let mouseX = 0.5;
    let mouseY = 0.5;

    window.addEventListener("mousemove", (event) => {
        mouseX = event.clientX / window.innerWidth;
        mouseY = 1.0 - event.clientY / window.innerHeight;
    });

    function render() {
        const now = performance.now() / 1000;
        const uniformData = new Float32Array([now, mouseX, mouseY]);
        device.queue.writeBuffer(uniformBuffer, 0, uniformData);

        const commandEncoder = device.createCommandEncoder();

        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(computePipeline);
        computePass.setBindGroup(0, bindGroup);
        computePass.dispatchWorkgroups(16);
        computePass.end();

        const textureView = context.getCurrentTexture().createView();
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: textureView,
                loadOp: "clear",
                storeOp: "store",
                clearValue: { r: 0, g: 0, b: 0, a: 1 },
            }],
        });

        renderPass.setPipeline(pipeline);
        renderPass.draw(4);
        renderPass.end();

        device.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(render);
    }

    render();
}

initWebGPU();
