var fonts = ["Futura", "Didot", "Verdana", "Baskerville", "Avenir", "Gill Sans", "Source Code Pro", "Cooper", "Helvetica", "Rockwell", "Didot"];
let size = 800;

var index;
let offscreen, mask;
let stringInput;
let rowsSlider;
let colsSlider;
let backgroundColor;
let textColor;
let fontGrid;
let h;
let secondaryCanvas;

function setup() {
    createCanvas(windowWidth, windowHeight);
    const smallCanvasElement = document.getElementById('smallCanvas');
    smallCanvasElement.width = 400;
    smallCanvasElement.height = 400;

    secondaryCanvas = createGraphics(300, 200); 
    offscreen = createGraphics(windowWidth, windowHeight);
    mask = createGraphics(windowWidth, windowHeight);
    offscreen.textAlign(CENTER, CENTER);

    stringInput = createInput('Here is your text');
    stringInput.style('width', `${windowWidth * 0.25}px`);
    stringInput.style('height', '30px');
    stringInput.position(windowWidth * 0.72, windowHeight * 0.72);
    stringInput.input(scramble);
    stringInput.mousePressed(() => {
        if (stringInput.value() === 'Here is your text') {
            stringInput.value('');
        }
        drawGraphic();
    });

    rowsSlider = createSlider(1, 10, 4, 1);
    rowsSlider.style('width', `${windowWidth * 0.25}px`);
    rowsSlider.position(windowWidth * 0.72, windowHeight * 0.79);
    rowsSlider.input(scramble);

    colsSlider = createSlider(1, 30, 10, 1);
    colsSlider.style('width', `${windowWidth * 0.25}px`);
    colsSlider.position(windowWidth * 0.72, windowHeight * 0.84);
    colsSlider.input(scramble);

    backgroundColor = createColorPicker('#f0f0f0');
    backgroundColor.position(windowWidth * 0.72, windowHeight * 0.89);
    backgroundColor.style('width', `${windowWidth * 0.12}px`);
    backgroundColor.input(drawGraphic);

    textColor = createColorPicker('#ff0000');
    textColor.position(windowWidth * 0.85, windowHeight * 0.89);
    textColor.style('width', `${windowWidth * 0.12}px`);
    textColor.input(drawGraphic);

    scramble();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    stringInput.style('width', `${windowWidth * 0.25}px`);
    stringInput.position(windowWidth * 0.72, windowHeight * 0.72);

    rowsSlider.style('width', `${windowWidth * 0.25}px`);
    rowsSlider.position(windowWidth * 0.72, windowHeight * 0.79);

    colsSlider.style('width', `${windowWidth * 0.25}px`);
    colsSlider.position(windowWidth * 0.72, windowHeight * 0.84);

    backgroundColor.style('width', `${windowWidth * 0.12}px`);
    backgroundColor.position(windowWidth * 0.72, windowHeight * 0.89);

    textColor.style('width', `${windowWidth * 0.12}px`);
    textColor.position(windowWidth * 0.85, windowHeight * 0.89);

    scramble();
}

function scramble() {
    fontGrid = new Array();
    var rows = rowsSlider.value();
    var cols = colsSlider.value();
    for (var j = 0; j < rows; j++) {
        fontGrid[j] = new Array();
        for (var i = 0; i < cols; i++) {
            fontGrid[j].push(fonts[floor(random(0, fonts.length))]);
        }
    }
    getHeight();
    drawGraphic();
}

function getHeight() {
    var x = 0;
    for (var i = 0; i < fonts.length; i++) {
        offscreen.textFont(fonts[i]);
        offscreen.textSize(windowWidth);
        offscreen.textSize(windowWidth * windowWidth / offscreen.textWidth(stringInput.value()));
        x = Math.max(x, offscreen.textAscent());
    }
    h = x;
}

function mouseClicked() {
    var rows = rowsSlider.value();
    var cols = colsSlider.value();
    var col = floor(mouseX / (windowWidth / cols));
    var row = floor((mouseY - (windowHeight * 0.3 - h / 2)) / (h / rows)); 

    if (row < rows && col < cols && fontGrid[row] && fontGrid[row][col]) {
        var font = fontGrid[row][col];
        do {
            var newFont = fonts[floor(random(0, fonts.length))];
        } while (fontGrid[row][col] === newFont);

        fontGrid[row][col] = newFont;
        drawGraphic();
    }
}


function getSector(row, col) {
    var rows = rowsSlider.value();
    var cols = colsSlider.value();
    var gridWidth = windowWidth * 0.8; 
    var gridHeight = h * 0.8;          
    var out = createGraphics(floor(gridWidth / cols), floor(gridHeight / rows));
    out.fill(color(textColor.value()));
    out.textFont(fontGrid[row][col]);
    out.textSize(gridWidth);
    out.textAlign(CENTER, CENTER);

    out.textSize(gridWidth * gridWidth / out.textWidth(stringInput.value()));
    out.text(stringInput.value(), gridWidth / 2 - col * gridWidth / cols, gridHeight / 2 - row * gridHeight / rows);
    return out.get();
}

function drawGraphic() {
    clear();
    background(color(backgroundColor.value()));

    const rows = rowsSlider.value();
    const cols = colsSlider.value();

    let gridWidth = windowWidth * 0.8;  
    let gridHeight = h * 0.8;           
    let gridXOffset = (windowWidth - gridWidth) / 2;  

    stroke(color(textColor.value()));
    strokeWeight(0 );

    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            fill(255, 0);
            rect(gridXOffset + col * gridWidth / cols, windowHeight * 0.35 - gridHeight / 2 + row * gridHeight / rows, gridWidth / cols, gridHeight / rows);
            
            line(gridXOffset + col * gridWidth / cols, windowHeight * 0.35 - gridHeight / 2 + row * gridHeight / rows, 
                 gridXOffset + col * gridWidth / cols, windowHeight * 0.35 - gridHeight / 2 + (row + 1) * gridHeight / rows); 
            line(gridXOffset + col * gridWidth / cols, windowHeight * 0.35 - gridHeight / 2, 
                 gridXOffset + (col + 1) * gridWidth / cols, windowHeight * 0.35 - gridHeight / 2); 

            image(getSector(row, col), gridXOffset + col * gridWidth / cols, windowHeight * 0.35 - gridHeight / 2 + row * gridHeight / rows, gridWidth / cols, gridHeight / rows);
        }
    }
    const uniqueIdentityText = document.querySelector('.rrr');
    const downloadText = document.querySelector('.nnn');
    uniqueIdentityText.style.color = textColor.value();
    downloadText.style.color = textColor.value();
}

function draw() {
    const smallCanvasElement = document.getElementById('smallCanvas');
    const smallCanvasCtx = smallCanvasElement.getContext('2d');
    
    smallCanvasCtx.fillStyle = backgroundColor.value(); 
    smallCanvasCtx.fillRect(0, 0, smallCanvasElement.width, smallCanvasElement.height); 

    const yOffset = 85; 
    smallCanvasCtx.drawImage(canvas, 0, yOffset, smallCanvasElement.width, smallCanvasElement.height - yOffset);
}

function handleMouseMove(event) {
    const x = (window.innerWidth / 2 - event.pageX) / 30;
    const y = (window.innerHeight / 2 - event.pageY) / 30;
    smallCanvas.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`; 
}

document.addEventListener('mousemove', handleMouseMove);

const backgroundButton = document.getElementById('background-button');
const saveButton = document.getElementById('save-button');
const namelabelContainer = document.querySelector('.namelabel-container');

const backgrounds = [
    'url(111.jpg)',
    'url(222.jpg)',
    'url(333.jpg)',
    'url(444.jpg)',
    'url(555.jpg)',
    'url(666.jpg)',
    'url(777.jpg)',
    'url(888.jpg)',
    'url(999.jpg)',
    'url(101010.jpg)',
    

];

let currentBackgroundIndex = 0;

backgroundButton.addEventListener('click', changeBackground);
saveButton.addEventListener('click', saveImage);

function changeBackground() {
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
    document.querySelector('.namelabel-container').style.backgroundImage = backgrounds[currentBackgroundIndex];
    drawGraphic();
}

function saveImage() {
    // 버튼 숨기기
    backgroundButton.style.display = 'none';
    saveButton.style.display = 'none';

    console.log('Current background image:', namelabelContainer.style.backgroundImage);

    // 현재 배경 이미지가 적용된 namelabelContainer를 캡처합니다.
    html2canvas(namelabelContainer).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'nametag.png';
        link.click();

        // 버튼 다시 보이기
        backgroundButton.style.display = '';
        saveButton.style.display = '';
    }).catch((error) => {
        console.error('Error capturing the canvas:', error);
        // 버튼 다시 보이기
        backgroundButton.style.display = '';
        saveButton.style.display = '';
    });
}
