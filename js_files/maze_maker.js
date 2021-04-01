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

    show(size, r ,c){
        let x = (this.col_num * size) / c;
        let y = (this.row_num * size) / r;

        ctx.strokeStyle = "white";
        ctx.fillStyle = "black";
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
    }
}


let newMaze = new Maze(500, 10, 10);
newMaze.setup();
newMaze.draw()