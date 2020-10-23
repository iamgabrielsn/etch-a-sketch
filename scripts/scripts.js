let gridContainer = document.getElementById("container");
let gridController = document.getElementById("controller");
let gridEditorOptions = document.getElementById("options");
let gridStatusLog = document.getElementById("status-label");

let grid = {
  color_item: '#E8DD8A',
  color_item_bg: '#13232E',
  size: 500,
  layout: 8
};


function createElement(parentNode = null, elementType, elementId, ...classList) {
  let element = document.createElement(elementType);

  if(elementId != null)
    element.setAttribute("id", elementId);

  if(classList != null && classList.length > 0)
    element.classList = classList;

  if(parentNode != null)
    parentNode.appendChild(element);

  return element;
}

function createGrid(size, containerSize) {
  let gridItemSize = containerSize/size/2;

  gridContainer.style.gridTemplateColumns = `repeat(${size}, ${gridItemSize*2}px)`;
  gridContainer.style.gridTemplateRows = `repeat(${size}, ${gridItemSize*2}px)`;

  for(let x = 0; x < size; x++) {
    for(let y = 0; y < size; y++) {
      let item = createElement(null, "div", null, "item");
      item.style.backgroundColor = grid.color_item_bg;
      gridContainer.appendChild(item);
    }
  }
}

/*
A expressão, containerSize-gridSize, controla o grid-gap para não vazar os itens do layout.
*/
function createGridContainer(containerSize, gridSize) {

  gridContainer = createElement(null, "div", "container");
  gridContainer.style.maxWidth = containerSize+"px";
  gridContainer.style.maxHeight = containerSize+"px";
  gridContainer.style.width = containerSize+"px";
  gridContainer.style.height = containerSize+"px";

  document.body.insertBefore(gridContainer, gridEditorOptions);

  createGrid(gridSize, containerSize-gridSize);
  gridController.style.width = containerSize+"px";
  gridEditorOptions.style.width = containerSize+"px";
  gridContainer.addEventListener("mouseover", hoverItem, false);
  gridContainer.addEventListener("mouseout", hoverOutItem, false);
}
/*getRandomIntInclusive FUNCTION BY devdocs.io*/
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRGBStyleSheet() {

  let rgb = {
    r: getRandomIntInclusive(0, 255),
    g: getRandomIntInclusive(0, 255),
    b: getRandomIntInclusive(0, 255)
  };

  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function hoverItem(event) {
  let item = event.target;
  if(item == gridContainer) return;
  item.style.backgroundColor = grid.color_item;
}

function hoverOutItem(event) {
  let item = event.target;
  if(item == gridContainer) return;
  item.style.backgroundColor = randomRGBStyleSheet();
}

function sendGridStatus(message) {
  gridStatusLog.textContent = message;
  gridStatusLog.removeAttribute("disabled");
  setTimeout(() => {
    gridStatusLog.setAttribute("disabled", "");
  }, 1000);
}

function clearGridContent(event) {

  let clearBtn = event.target;
  if(!clearBtn.hasAttribute("data-action")) {
    if(clearBtn.parentNode.hasAttribute("data-action")) {
      clearBtn = clearBtn.parentNode;
    }
  }
  if(clearBtn.getAttribute("data-action") != "clear") return;
  
  let items = Array.from(gridContainer.children);

  for(let item of items) {
    item.style.backgroundColor = grid.color_item_bg;
  }
  sendGridStatus("The GRID container was wiped content.");
}

function resizeGridContent(event) {
  let resizeBtn = event.target;
  if(!resizeBtn.hasAttribute("data-action")) {
    if(resizeBtn.parentNode.hasAttribute("data-action")) {
      resizeBtn = resizeBtn.parentNode;
    }
  }
  if(resizeBtn.getAttribute("data-action") != "resize") return;

  queryValidSize(500, 1200, "Choose a new grid size.\nMin:500. Max: 1200", size => {

    grid.size = size;
    gridContainer.remove();
    createGridContainer(grid.size, grid.layout);
    sendGridStatus("The GRID container was resized.");
  });

}

function resetGrid(event) {

  queryValidSize(2, 100, "Choose a new GRID layout.\nMin: 2. Max: 100.", size => {

    grid.layout = size;
    gridContainer.remove();
    createGridContainer(grid.size, size);
    sendGridStatus("The GRID was reset.");
  });

}

function queryValidSize(min, max, message, callback, force = false) {
  let newSize;
  while(newSize == undefined) {

    newSize = Number(prompt(message));

    if(Number.isNaN(newSize) || newSize < min || newSize > max) {
      newSize = undefined;
      if(force) {
        continue;
      } else {
        if(!newSize) {
          sendGridStatus("Cancelled. Insert valid Number.");
          return;
        }
      }
    }
  }
  return callback(newSize);
}

gridController.addEventListener("click", resetGrid, true);
gridEditorOptions.addEventListener("click", clearGridContent, false);
gridEditorOptions.addEventListener("click", resizeGridContent, false);
createGridContainer(grid.size, grid.layout);