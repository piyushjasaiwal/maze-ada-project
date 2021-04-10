//till 13:17

var canvas;
var ctx;
var output;

var HEIGHT = 500;
var WIDTH = 1000;

tileW=20;   //every tiles width
tileH=20;   //every tiles height

tileColumnCount=40;   //totalcolumn
tileRowCount=20;      //totalrows

var boundX;
var boundY;

//tiles array will be [c][r] unlike the typical [r][c];

var tiles=[];    //tiles array to store tiles
for(c=0;c<tileColumnCount;c++){
  tiles[c]=[];    //creatin 2-D array that will make it like a graph
  for(r=0;r<tileRowCount;r++){
    tiles[c][r] = {x:c*(tileW+3), y:r*(tileH+3), state:'e'};  //e means empty state, +3 makes difference between every tile as 3px
  }
}

tiles[0][0].state='s'; //start from 0,0
tiles[tileColumnCount-1][tileRowCount-1].state='f'; //finishing at col-1,row-1

function rect(x,y,w,h,state){   //to create a rectangle starting from x,y and of h height and w width
  if(state=='s')
  {
    ctx.fillStyle="Green";
  }
  else if(state=='f')
    {
      ctx.fillStyle="Red";
    }
    else if(state=='w')
      {
        ctx.fillStyle="Blue";
      }
  else if(state=='e'){
    ctx.fillStyle="Grey";
  }
  else if(state=='x')
    {
      ctx.fillStyle="Black";
    }
  else{
    ctx.fillStyle="Grey";
  }
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
  window.requestAnimationFrame(rect);
}

function clear(){   //clear the screen or anything pre existing on screen
  ctx.clearRect(0,0,WIDTH,HEIGHT);
}

function draw(){    //fill the figure: rectangle in this case
  clear();

  for(c=0;c<tileColumnCount;c++){   //Print the 2-D grid
    for(r=0;r<tileRowCount;r++){
      rect(tiles[c][r].x,tiles[c][r].y,tileW,tileH,tiles[c][r].state);
    }
  } 
  //rect(10,10,80,80);
}

function solveMaze(){
  var Xqueue=[0];   //contains the next grid to visit in x direction
  var Yqueue=[0];   //contains the next grid to visit in y direction

  var pathFound = false;

  var xLoc; var yLoc;

  while(Xqueue.length>0 && !pathFound){
    xLoc=Xqueue.shift();
    yLoc=Yqueue.shift();

    if(xLoc>0){
      if(tiles[xLoc-1][yLoc].state=='f')  //if reaches to finish
      {pathFound=true;}
    }
    if(xLoc < tileColumnCount-1){
      if(tiles[xLoc+1][yLoc].state=='f')
      {pathFound=true;}
    }
    if(yLoc>0){
      if(tiles[xLoc][yLoc-1].state=='f')
      {pathFound=true;}
    }
    if(yLoc < tileRowCount-1){
      if(tiles[xLoc][yLoc+1].state=='f')
      {pathFound=true;}
    }

    if(xLoc>0){
      if(tiles[xLoc-1][yLoc].state=='e')
      {
        Xqueue.push(xLoc-1);
        Yqueue.push(yLoc);
        tiles[xLoc-1][yLoc].state = tiles[xLoc][yLoc].state+'l';}   //l means left
    }
    if(xLoc < tileColumnCount-1){
      if(tiles[xLoc+1][yLoc].state=='e')
      {Xqueue.push(xLoc+1);
      Yqueue.push(yLoc);
      tiles[xLoc+1][yLoc].state = tiles[xLoc][yLoc].state+'r';}   //r means right
    }
    if(yLoc>0){
      if(tiles[xLoc][yLoc-1].state=='e')
      {Xqueue.push(xLoc);
      Yqueue.push(yLoc-1);
      tiles[xLoc][yLoc-1].state = tiles[xLoc][yLoc].state+'u';}   //u means up
    }
    if(yLoc < tileRowCount-1){
      if(tiles[xLoc][yLoc+1].state=='e')
      {Xqueue.push(xLoc);
      Yqueue.push(yLoc+1);
      tiles[xLoc][yLoc+1].state = tiles[xLoc][yLoc].state+'d';}   //d means down
    }
  }

  if(!pathFound){
    output.innerHTML="No Possible Solution!";
  }
  else{
    output.innerHTML="Solution Found:=)";
    var path=tiles[xLoc][yLoc].state;
    var pathLength=path.length;
    var currX=0;
    var currY=0;
    for(var i=0;i<pathLength-1;i++){
      if(path.charAt(i+1) == 'u'){
        currY-=1;
      }
      if(path.charAt(i+1) == 'd'){
        currY+=1;
      }
      if(path.charAt(i+1) == 'l'){
        currX-=1;
      }
      if(path.charAt(i+1) == 'r'){
        currX+=1;
      }
      tiles[currX][currY].state='x';
    }
  }
}

function reset(){   //a function to reset the grid
  for(c=0;c<tileColumnCount;c++){
    tiles[c]=[];    //creating 2-D array that will make it like a graph
    for(r=0;r<tileRowCount;r++){
      tiles[c][r] = {x:c*(tileW+3), y:r*(tileH+3), state:'e'};  //e means empty state, +3 makes difference between every tile as 3px
    }
  }

  tiles[0][0].state='s'; //start from 0,0
  tiles[tileColumnCount-1][tileRowCount-1].state='f'; //finishing at col-1,row-1
  output.innerHTML="";
}

function init(){    //to initialise everything
  canvas=document.getElementById("myCanvas");
  ctx=canvas.getContext("2d");
  output=document.getElementById("outcome");
  return setInterval(draw,10);
}

function myMove(e){
  x=e.pageX-canvas.offsetLeft;
  y=e.pageY-canvas.offsetTop;

  for(c=0;c<tileColumnCount;c++){
    for(r=0;r<tileRowCount;r++){
      if(x>c*(tileW+3) && x<c*(tileW+3)+tileW && y>r*(tileH+3) && y<r*(tileH+3)+tileH ){
        if(tiles[c][r].state=='e' && (c!=boundX || r!=boundY)){
          tiles[c][r].state='w';
          boundX=c;
          boundY=r;
        }
        else if(tiles[c][r].state=='w' && (c!=boundX || r!=boundY)){
          tiles[c][r].state='e';
          boundX=c;
          boundY=r;
        }
      }
    }
  }
}

function myDown(e){
  canvas.onmousemove = myMove;

  x=e.pageX-canvas.offsetLeft;
  y=e.pageY-canvas.offsetTop;

  for(c=0;c<tileColumnCount;c++){
    for(r=0;r<tileRowCount;r++){
      if(x>c*(tileW+3) && x<c*(tileW+3)+tileW && y>r*(tileH+3) && y<r*(tileH+3)+tileH ){
        if(tiles[c][r].state=='e'){
          tiles[c][r].state='w';
          boundX=c;
          boundY=r;
        }
        else if(tiles[c][r].state=='w'){
          tiles[c][r].state='e';
          boundX=c;
          boundY=r;
        }
      }
    }
  }
}

function myUp(){
  canvas.onmousemove = null;
}

init();
canvas.onmousedown= myDown;
canvas.onmouseup= myUp;

