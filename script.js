/**
 * @file script.js
 * @description This file contains the code for the whiteboard application
 * @version 1.0.0
 * @since 1.0.0
 * @author Kaushal Patel
 */

/**
 * @description The canvas element
 * @type {HTMLCanvasElement}
 */
const board = document.querySelector("canvas");

/**
 * @description The tool buttons
 * @type {NodeListOf<Element>}
 */
toolButtons = document.querySelectorAll(".tool");

/**
 * @description The fill color checkbox
 * @type {HTMLInputElement}
 */
fillColor = document.querySelector("#fill-color");

/**
 * @description The stroke size slider
 * @type {HTMLInputElement}
 */
strokeSize = document.querySelector("#size-slider");

/**
 * @description The color buttons
 * @type {NodeListOf<Element>}
 */
colorButtons = document.querySelectorAll(".colors .option");

/**
 * @description The color picker
 * @type {HTMLInputElement}
 */
colorPicker = document.querySelector("#color-picker");

/**
 * @description The clear board button
 * @type {HTMLButtonElement}
 */
clearBoard = document.querySelector(".clear-board");

/**
 * @description The save board button
 * @type {HTMLButtonElement}
 */
saveBoard = document.querySelector(".save-board");

/**
 * @description The 2D Rendering Context of the canvas
 * @type {CanvasRenderingContext2D}
 */
context = board.getContext("2d");

/**
 * @description The previous mouse X position
 * @type {number}
 */
let previousMouseX;

/**
 * @description The previous mouse Y position
 * @type {number}
 */
let previousMouseY;

/**
 * @description The snapshot of the canvas
 * @type {ImageData}
 */
let snapshot;

/**
 * @description The flag to check if the user is drawing, default is false
 * @type {boolean}
 */
let isDrawing = false;

/**
 * @description The selected tool, default is brush
 * @type {string} - The id of the selected tool
 */
let selectedTool = "brush";

/**
 * @description The brush width, default is 5
 * @type {number} - The width of the brush
 */
let brushWidth = 5;

/**
 * @description The selected color, default is black
 * @type {string} - The hex code of the selected color
 */
let selectedColor = "#000000";


/**
 * @description Function to set the background of the canvas
 * @returns {void}
 */
const setBoardBackground = () => {
    context.fillStyle = "#ffffff";  // white
    context.fillRect(0, 0, board.width, board.height); // fill the canvas
    context.fillStyle = selectedColor; // set the color back to the selected color
}

/**
 * @description Function to set the width and height of the canvas on load of the window
 * @returns {void}
 * @listens window#load
 */
window.addEventListener("load", () => {
    board.width = board.offsetWidth;
    board.height = board.offsetHeight;
    setBoardBackground();
});

/**
 * @description Function to draw a rectangle on the canvas
 * @param {MouseEvent} e - The mouse event
 * @returns {void}
 */
const drawRectangle = (e) => {
    if(!fillColor.checked){
        return context.strokeRect(e.offsetX, e.offsetY, previousMouseX - e.offsetX, previousMouseY - e.offsetY);
    }
    context.fillRect(e.offsetX, e.offsetY, previousMouseX - e.offsetX, previousMouseY - e.offsetY);
}

/**
 * @description Function to draw a circle on the canvas
 * @param {MouseEvent} e - The mouse event
 * @returns {void}
 */
const drawCircle = (e) => {
    context.beginPath();
    let radius = Math.sqrt(Math.pow(previousMouseX - e.offsetX, 2) + Math.pow(previousMouseY - e.offsetY, 2));
    context.arc(previousMouseX, previousMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? context.fill() : context.stroke();
}

/**
 * @description Function to draw a triangle on the canvas
 * @param {MouseEvent} e - The mouse event
 * @returns {void}
 */
const drawTriangle = (e) => {
    context.beginPath();    // start path
    context.moveTo(previousMouseX, previousMouseY); // move to the previous mouse position
    context.lineTo(e.offsetX, e.offsetY);   // draw a line to the current mouse position
    context.lineTo(previousMouseX * 2 - e.offsetX, e.offsetY); // draw a line to the opposite side of the current mouse position
    context.closePath();   // close the path
    fillColor.checked ? context.fill() : context.stroke();  // fill or stroke the path
}

/**
 * @description Function to start drawing on the canvas
 * @param {MouseEvent} e - The mouse event
 * @returns {void}
 */
const startDrawing = (e) => {
    isDrawing = true;
    previousMouseX = e.offsetX;
    previousMouseY = e.offsetY;
    context.beginPath();
    context.lineWidth = brushWidth;
    context.strokeStyle = selectedColor;
    context.fillStyle = selectedColor;
    snapshot = context.getImageData(0, 0, board.width, board.height);
}

/**
 * @description Function to handle drawing on the canvas
 * @param {MouseEvent} e - The mouse event
 * @returns {void}
 */
const drawing = (e) => {
    if (!isDrawing) return;
    context.putImageData(snapshot, 0, 0);

    if (selectedTool === "brush" || selectedTool === "eraser") {
        context.strokeStyle = selectedTool === "eraser" ? "#ffffff" : selectedColor;
        context.lineTo(e.offsetX, e.offsetY);
        context.stroke();
    }
    else if (selectedTool === "rectangle") {
        drawRectangle(e);
    }
    else if (selectedTool === "circle") {
        drawCircle(e);
    }
    else if (selectedTool === "triangle") {
        drawTriangle(e);
    }
}

// Add click event listeners to all the tool buttons to change the selected tool
toolButtons.forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        button.classList.add("active");
        selectedTool = button.id;
    });
});


// Add change event listeners to stroke size slider to change the brush width
strokeSize.addEventListener("change", () => {
    brushWidth = strokeSize.value;
});


// Add click event listeners to all the color buttons to change the selected color
colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        button.classList.add("selected");
        selectedColor = window.getComputedStyle(button).getPropertyValue("background-color");
    });
});


// Add change event listener to color picker to change the selected color
colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.backgroundColor = colorPicker.value;
    colorPicker.parentElement.click();
});


// Add click event listeners to clear board to clear the canvas
clearBoard.addEventListener("click", () => {
    context.clearRect(0, 0, board.width, board.height);
    setBoardBackground();
});


// Add click event listeners to save board to save the canvas
saveBoard.addEventListener("click", () => {
    // Create a link element and click it to download the image
    const link = document.createElement("a");

    // Set the download attribute to the current date and time
    let date = Date.now();
    link.download = `${new Date(date)}.jpg`
    link.href = board.toDataURL();
    link.click();
});

// Add event listeners to the canvas to handle drawing
board.addEventListener("mousedown", startDrawing);
board.addEventListener("mousemove", drawing);
board.addEventListener("mouseup", () => {
    isDrawing = false; // stop drawing
});