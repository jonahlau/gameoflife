function GameOfLife(width,height) {
  this.width = width;
  this.height = height;
  var intID; //allow access to the intID variable by clearInterval
  this.intvFuncStart = function() { intID = setInterval(function() {gol.step()}, 100)};
  this.stop = function() { clearInterval(intID)};
};

GameOfLife.prototype.createAndShowBoard = function () {
  // create <table> element
  var goltable = document.createElement("tbody");

  // build Table HTML
  var tablehtml = '';
  for (var h=0; h<this.height; h++) {
    tablehtml += "<tr id='row+" + h + "'>";
    for (var w=0; w<this.width; w++) {
      tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
    }
    tablehtml += "</tr>";
  }
  goltable.innerHTML = tablehtml;

  // add table to the #board element
  var board = document.getElementById('board');
  board.appendChild(goltable);

  // once html elements are added to the page, attach events to them
  this.setupBoardEvents();
};

GameOfLife.prototype.setupBoardEvents = function() {
  var onCellClick = function (e) {
    if (this.getAttribute('data-status') == 'dead') {
      this.className = "alive";
      this.setAttribute('data-status', 'alive');
    } else {
      this.className = "dead";
      this.setAttribute('data-status', 'dead');
    }
  };

  for (var h=0; h<this.height; h++) {   //looping through all cells and assigning the onCellClick function on each cell
    for (var w=0; w<this.width; w++) {
      document.getElementById(w + "-" + h).onclick = onCellClick;
    }
  }
};

GameOfLife.prototype.countNeighbors = function(x,y) { //document.getElementById(x + "-" + y)
  var aliveCount = 0;
  var y_start = y-1, y_end = y+1, x_start = x-1, x_end = x +1;

  for (var i = y_start; i <= y_end; i++) { //looping over 3x3 area around the current cell that the step loop is currently at
    for (var j = x_start; j <= x_end; j++) {
      if (i === -1 || j === -1 || j === this.width || i === this.height || (j === x && i === y)) { //edge cases
        // "do nothing";
      } else {
        if (document.getElementById(j + "-" + i).getAttribute("data-status") === "alive") {
          aliveCount++;
        }
      }
    }
  }
  return aliveCount;
};

GameOfLife.prototype.step = function () {
  var returnArray= [];

  //RUNNING LOOP OVER ALL CELLS
  for (var h = 0; h < this.height; h++) { //this refers to gol
    for (var w = 0; w < this.width; w++) {

      //BASED ON HOW MANY NEIGHBOURS ARE ALIVE RETURNED BY COUNTNEIGHBORS ABOVE, KILL OR BIRTH NEW CELLS
      var currCell = document.getElementById(w+"-"+h).getAttribute("data-status");

      if ((this.countNeighbors(w,h) < 2 && currCell ==="alive") || (this.countNeighbors(w,h) > 3 && currCell === "alive") || (this.countNeighbors(w,h) === 3 && currCell === "dead")) {
        returnArray.push(document.getElementById(w + "-" + h));
      }
    }
  }
  returnArray.forEach(function(elementInReturnArr) {
    elementInReturnArr.click();
  })
};


GameOfLife.prototype.resetRandom = function() {
  gol.clear();
  var randomArr = [];
  for (var h = 0; h < this.height; h++) {
    for (var w = 0; w < this.width; w++) {
      if (Math.random() < 0.5) {
        randomArr.push(document.getElementById(w + "-" + h));
      }
    }
  }
  randomArr.forEach(function(element) {
    element.setAttribute("data-status", "alive");
    element.className = "alive";
  });
};

//CLEAR BOARD BY SETTING CLASS AND DATA-STATUS TO DEAD
GameOfLife.prototype.clear = function() {
  for (var h=0; h<this.height; h++) {
    for (var w=0; w<this.width; w++) {
      document.getElementById(w + "-" + h).setAttribute("data-status", "dead");
      document.getElementById(w + "-" + h).className = "dead";
    }
  }
};


var gol = new GameOfLife(80,80);
gol.createAndShowBoard();

document.getElementById("step").onclick = function() {
  return gol.step();
};

document.getElementById("clear").onclick = function() {
  gol.stop();
  return gol.clear();
};

document.getElementById("autoPlay").onclick = function() {
  gol.stop();
  gol.intvFuncStart();
};

document.getElementById("pause").onclick = function() {
  gol.stop();
};

document.getElementById("resetRandom").onclick = function() {
  gol.stop();
  gol.resetRandom();
};

