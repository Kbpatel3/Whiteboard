const board = document.querySelector("canvas");
toolButtons = document.querySelectorAll(".tool");
fillColor = document.querySelector("#fill-color");
strokeSize = document.querySelector("#size-slider");
colorButtons = document.querySelectorAll(".colors .option");
colorPicker = document.querySelector("#color-picker");
clearBoard = document.querySelector(".clear-board");
saveBoard = document.querySelector(".save-board");
context = board.getContext("2d");

let previousMouseX, previousMouseY, snapshot,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor = "#000000";

const setBoardBackground = () => {
    context.fillStyle = "#ffffff";  // white
    context.fillRect(0, 0, board.width, board.height); // fill the canvas
    context.fillStyle = selectedColor; // set the color back to the selected color
}

window.addEventListener("load", () => {
    board.width = board.offsetWidth;
    board.height = board.offsetHeight;
    setBoardBackground();
});

const drawRectangle = (e) => {
    if(!fillColor.checked){
        return context.strokeRect(e.offsetX, e.offsetY, previousMouseX - e.offsetX, previousMouseY - e.offsetY);
    }
    context.fillRect(e.offsetX, e.offsetY, previousMouseX - e.offsetX, previousMouseY - e.offsetY);
}

const drawCircle = (e) => {
    context.beginPath();
    let radius = Math.sqrt(Math.pow(previousMouseX - e.offsetX, 2) + Math.pow(previousMouseY - e.offsetY, 2));
    context.arc(previousMouseX, previousMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? context.fill() : context.stroke();
}

const drawTriangle = (e) => {
    context.beginPath();
    context.moveTo(previousMouseX, previousMouseY);
    context.lineTo(e.offsetX, e.offsetY);
    context.lineTo(previousMouseX * 2 - e.offsetX, e.offsetY);
    context.closePath();
    fillColor.checked ? context.fill() : context.stroke();
}

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

toolButtons.forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        button.classList.add("active");
        selectedTool = button.id;
    });
});

strokeSize.addEventListener("change", () => {
    brushWidth = strokeSize.value;
});

colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        button.classList.add("selected");
        selectedColor = window.getComputedStyle(button).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.backgroundColor = colorPicker.value;
    colorPicker.parentElement.click();
});

clearBoard.addEventListener("click", () => {
    context.clearRect(0, 0, board.width, board.height);
    setBoardBackground();
});

saveBoard.addEventListener("click", () => {
    const link = document.createElement("a");
    let date = Date.now();
    link.download = `${new Date(date)}.jpg`
    link.href = board.toDataURL();
    link.click();
});

board.addEventListener("mousedown", startDrawing);
board.addEventListener("mousemove", drawing);
board.addEventListener("mouseup", () => {
    isDrawing = false;
});