let mandelbrot;
let canvas;
let ctx;
let imageData;
let buffer;
let buffer_view;
let iterations = 100;
let zoom = 150.0;
let width = 1000;
let height = 1000;
let xoffset = width / 2;
let yoffset = height / 2;

function loadWebAssembly(fileName) {
    return fetch(fileName)
        .then(response => response.arrayBuffer())
        .then(bits => WebAssembly.compile(bits))
        .then(module => {
            return new WebAssembly.Instance(module);
        });
};

loadWebAssembly('./mandelbrot.wasm')
    .then(instance => {
        mandelbrot = instance.exports.mandelbrot;
        console.log('Finished compiling! Ready when you are...');

        canvas = document.getElementById("can");
        ctx = canvas.getContext("2d");
        ctx.canvas.width = width;
        ctx.canvas.height = width;
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(0, 0, width, height);
        imageData = ctx.getImageData(0, 0, width, height);
        buffer = imageData.data.buffer; // ArrayBuffer
        buffer_view = new DataView(buffer);

        setInterval(
            function() {
                var id = 0;
                for (var row = 0; row < width; row++) {
                    for (var col = 0; col < height; col++) {
                        let mb = mandelbrot(col, row, iterations, zoom, xoffset, yoffset);
                        // console.log(mb);
                        buffer_view.setUint8(id, mb);
                        buffer_view.setUint8(id + 1, mb);
                        buffer_view.setUint8(id + 2, mb);
                        buffer_view.setUint8(id + 3, 255);
                        id += 4;
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                zoom += 1.0;
            }, 30);

    })
    .catch(e => {
        console.log(e);
    });
