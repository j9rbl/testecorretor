const colorMap = {
    "NUDE 7082/2": "#eab9ae",
    "NUDE 7082/1": "#f5cbc6",
    "NUDE 7082": "#e5c4bb",
"PALHA CLARO 7036/3": "#e4a596",
"PALHA MÉDIO 7035/2": "##d28d7e",
"PALHA ESCURO 7034/1": "#d2797c",
"GOIABA 7033": "#de6e7e",
"ROSÊ 7066": "#e0b0b2",
"ROSA BEBÊ 7009": "#f7bbbb",
"ROSÊ PEACH 7051": "c58c79",
"ROSÊ TAN 7058": "#df988c",
"ROSA CHÁ 7064": "#d9c9c3",
    //... [outras cores]
    "ROSA CHAMPAGNE 7065": "#d6c3b4"
};

const uploadInput = document.getElementById('upload');
const canvasOriginal = document.getElementById('canvas-original');
const canvasAdjusted = document.getElementById('canvas-adjusted');

uploadInput.addEventListener('change', handleImageUpload);

function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            adjustImageColors(img);
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

function adjustImageColors(img) {
    const ctxOriginal = canvasOriginal.getContext('2d');
    const ctxAdjusted = canvasAdjusted.getContext('2d');

    // Define as dimensões do canvas com base nas dimensões da imagem
    canvasOriginal.width = img.width;
    canvasOriginal.height = img.height;
    canvasAdjusted.width = img.width;
    canvasAdjusted.height = img.height;

    // Desenha a imagem original no canvas original
    ctxOriginal.drawImage(img, 0, 0, img.width, img.height);

    // Obtém os dados da imagem original
    const imgData = ctxOriginal.getImageData(0, 0, img.width, img.height);
    const pixels = imgData.data;

    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Encontra a cor mais próxima na lista fornecida
        const nearestColor = findNearestColor(r, g, b);
        pixels[i] = nearestColor[0];
        pixels[i + 1] = nearestColor[1];
        pixels[i + 2] = nearestColor[2];
    }

    // Desenha a imagem ajustada no canvas ajustado
    ctxAdjusted.putImageData(imgData, 0, 0);
}

function findNearestColor(r, g, b) {
    let minDistance = Infinity;
    let nearestColor;

    for (const colorCode of Object.values(colorMap)) {
        const targetColor = color(colorCode).rgb().array();
        const distance = calculateColorDistance([r, g, b], targetColor);

        if (distance < minDistance) {
            minDistance = distance;
            nearestColor = targetColor;
        }
    }

    return nearestColor;
}

function calculateColorDistance(color1, color2) {
    return Math.sqrt(
        Math.pow(color1[0] - color2[0], 2) +
        Math.pow(color1[1] - color2[1], 2) +
        Math.pow(color1[2] - color2[2], 2)
    );
}

