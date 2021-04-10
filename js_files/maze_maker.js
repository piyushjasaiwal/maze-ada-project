let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");

let current;

class Cell{
    constructor(row_num, col_num, parent_grid, parent_size){
        this.row_num = row_num;
        this.col_num = col_num;
        this.parent_grid = parent_grid;
        this.parent_size = parent_size;
        this.visited = false;
        this.walls = {
            top_wall : true,
            right_wall : true,
            bottom_wall : true,
            left_wall : true
        };
    }

    checkNeighbours(){
        let grid = this.parent_grid;
        let row = this.row_num;
        let col = this.col_num;
        let neighbours = [];

        let top = row !== 0 ? grid[row-1][col] : undefined;
        let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
        let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
        let left = col !== 0 ? grid[row][col - 1] : undefined;
        
        if(top && !top.visited) neighbours.push(top);
        if(right && !right.visited) neighbours.push(right);
        if(bottom && !bottom.visited) neighbours.push(bottom);
        if(left && !left.visited) neighbours.push(left);

        if(neighbours.length !== 0){
            let random = Math.floor(Math.random() * neighbours.length);
            return neighbours[random];
        }else{
            return undefined
        }
    }

    draw_top_wall(x, y, size, columns, rows){
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size/columns, y);
        ctx.stroke();
    }

    draw_right_wall(x, y, size, columns, rows){
        ctx.beginPath();
        ctx.moveTo(x + size/columns, y);
        ctx.lineTo(x + size/columns, y + size/rows);
        ctx.stroke();
    }

    draw_bottom_wall(x, y, size, columns, rows){
        ctx.beginPath();
        ctx.moveTo(x, y + size/rows);
        ctx.lineTo(x + size/columns, y + size/rows);
        ctx.stroke();
    }

    draw_left_wall(x, y, size, columns, rows){
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + size/rows);
        ctx.stroke();
    }

    highlight(columns){
        let x = (this.col_num * this.parent_size)/columns + 1;
        let y = (this.row_num * this.parent_size)/columns + 1;
        ctx.fillStyle = "purple";
        ctx.fillRect(x, y, this.parent_size/ columns - 3, this.parentSize / columns - 3);
    }

    remove_walls(cell1, cell2){
        let x = cell1.col_num - cell2 .col_num;
        if(x == 1){
            cell1.walls.left_wall = false;
            cell2.walls.right_wall = false;
        }

        else if(x == -1){
            cell1.walls.right_wall = false;
            cell2.walls.left_wall = false;
        }

        let y = cell1.row_num - cell2 .row_num;
        if(y == -1){
            cell1.walls.bottom_wall = false;
            cell2.walls.top_wall = false;
        }

        else if(y == 1){
            cell1.walls.top_wall = false;
            cell2.walls.bottom_wall = false;
        }

    }

    show(size, r ,c){
        let x = (this.col_num * size) / c;
        let y = (this.row_num * size) / r;

        ctx.strokeStyle = "white";
        // if(x === 0 && y === 0){
        //     ctx.fillStyle = "green";
        // }else if(x === this.col_num - 1 && y === this.row_num - 1){
        //     ctx.fillStyle = "red";
        // }
        // ctx.fillStyle = "green";

        ctx.lineWidth = 2;

        if(this.walls.top_wall){
            this.draw_top_wall(x, y, size, c, r);
        }
        
        if(this.walls.right_wall){
            this.draw_right_wall(x, y, size, c, r);
        }

        if(this.walls.bottom_wall){
            this.draw_bottom_wall(x, y, size, c, r);
        }

        if(this.walls.left_wall){
            this.draw_left_wall(x, y, size, c, r);
        }

        if(this.visited){
            ctx.fillRect(x+1, y+1, (size / c) - 2, (size / r) - 2);
        }

        
    }
}

class Maze{
    constructor(size, rows, columns){
        this.size = size;
        this.rows = rows;
        this.columns = columns;

        this.grid = [];
        this.stack = [];
    }

    setup(){
        for(let r = 0; r < this.rows;r++){
            let row = [];
            for(let c = 0;c <= this.columns;c++){
                let cell = new Cell(r, c, this.grid, this.size);
                row.push(cell);
            }
            this.grid.push(row);
        }
        current = this.grid[0][0];
    }

    draw(){
        maze.width = this.size;
        maze.height = this.size;

        maze.style.background = "black";

        current.visited = true;

        for(let r = 0; r < this.rows;r++){
            for(let c = 0;c <= this.columns;c++){
                let grid = this.grid;
                grid[r][c].show(this.size, this.rows, this.columns);
            }
        }
        let next = current.checkNeighbours();
        if(next){
            next.visited = true;
            this.stack.push(current);

            current.highlight(this.columns);
            
            current.remove_walls(current, next);
            current = next;
        }else if(this.stack.length > 0){
            let cell = this.stack.pop();
            current = cell;
            current.highlight(this.columns);
            
        }

        if(this.stack.length == 0){
            return ;
        }

        window.requestAnimationFrame(() => {
            this.draw();
        })  
        //this function is for animation

        // this.draw();
    }

    maze_setup(){
        maze.width = this.size;
        maze.height = this.size;

        maze.style.background = "black";

        current.visited = true;

        for(let r = 0; r < this.rows;r++){
            for(let c = 0;c <= this.columns;c++){
                let grid = this.grid;
                grid[r][c].show(this.size, this.rows, this.columns);
            }
        }
    }
}
let newMaze ;
document.getElementById("grid").onclick = function(){
    newMaze = new Maze(550, 20, 20);
    newMaze.setup();
    newMaze.maze_setup();
}

document.getElementById("random").onclick = function(){
    newMaze.draw();
}

// newMaze.maze_setup();
// newMaze.draw();