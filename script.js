const board = document.querySelector("canvas");
toolButtons = document.querySelectorAll(".tool");
fillColor = document.querySelector("#fill-color");
strokeSize = document.querySelector("#size-slider");
colorButtons = document.querySelectorAll(".colors .option");
colorPicker = document.querySelector("#color-picker");
clearBoard = document.querySelector("#clear-board");
saveBoard = document.querySelector("#save-board");

context = board.getContext("2d");