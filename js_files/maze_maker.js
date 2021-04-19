let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");
let output = document.getElementById("message");
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

    show(size, r ,c, fill){
        let x = (this.col_num * size) / c;
        let y = (this.row_num * size) / r;

        ctx.strokeStyle = "blue";
        ctx.fillStyle = fill;

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

        // maze.style.background = "black";

        current.visited = true;

        for(let r = 0; r < this.rows;r++){
            for(let c = 0;c <= this.columns;c++){
                let grid = this.grid;
                // grid[r][c].show(this.size, this.rows, this.columns, );
                if(r === 0 && c === 0){
                    grid[r][c].show(this.size, this.rows, this.columns, "red");
                }else if(r === this.rows - 1 && c === this.columns - 1){
                    grid[r][c].show(this.size, this.rows, this.columns, "green");
                }else{
                    grid[r][c].show(this.size, this.rows, this.columns, "grey");
                }

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

    show_ans(visit){
        for(let r = 0; r < this.rows;r++){
            for(let c = 0;c <= this.columns;c++){
                let grid = this.grid;
                // grid[r][c].show(this.size, this.rows, this.columns);
                if(r === 0 && c === 0){
                    grid[r][c].show(this.size, this.rows, this.columns, "red");
                }else if(r === this.rows - 1 && c === this.columns - 1){
                    grid[r][c].show(this.size, this.rows, this.columns, "green");
                }else if(visit[r][c]){
                    grid[r][c].show(this.size, this.rows, this.columns, "black");
                }else{
                    grid[r][c].show(this.size, this.rows, this.columns, "grey");
                }
            }
        }

        
    }

    solve_back_track(cr, cc, visit){
        console.log("inside the function");
        if(cr < 0 || cc < 0 || cr >= this.rows || cc >= this.cols || visit[cr][cc]){
            return ;
        }

        if(cr == this.rows - 1 && cc == this.columns - 1){
            this.show_ans(visit);
            // document.getElementById("message").innerHTML == "Path Found";
            setTimeout(() => {
                console.log("program ended");
            }, 600000);
        }

        visit[cr][cc] = true;
        
        if(!this.grid[cr][cc].walls.bottom_wall){
            console.log("making call to down");
            this.solve_back_track(cr+1,cc, visit);
        }

        if(!this.grid[cr][cc].walls.right_wall){
            console.log("making call to right");
            this.solve_back_track(cr,cc+1, visit);
        }

        if(!this.grid[cr][cc].walls.left_wall){
            console.log("making call to left");
            this.solve_back_track(cr,cc-1, visit);
        }

        if(!this.grid[cr][cc].walls.top_wall){
            console.log("making call to up");
            this.solve_back_track(cr-1,cc, visit);
        }

        visit[cr][cc] = false;
    }

    solve(){
        console.log("solving");
        var visit = [];
        for(let i = 0;i<this.rows;i++){
            var visit_temp = [];
            for(let j = 0;j<this.columns;j++){
                visit_temp.push(false);
            }
            visit.push(visit_temp);
        }
        console.log(visit);
        // this.solve_BFS(visit);
        this.solve_back_track(0,0,visit);
    }

    solve_BFS(visit){
        console.log("inside the bfs function");
        let queue = [];
        queue.push(new pair(0,0));
        while(queue.length > 0){
            console.log("inside the queue function");
            let curr = queue.shift();
            if(curr.r == this.rows - 1 && curr.c == this.columns - 1){
                // show_message();
                this.show_ans(visit);
                
                setTimeout(() => {
                    console.log("program ended");
                }, 600000);
            }
            visit[curr.r][curr.c] = true;
            if(!this.grid[curr.r][curr.c].top_wall && curr.r-1 >= 0 && !visit[curr.r-1][curr.c]){
                queue.push(new pair(curr.r-1, curr.c))
            }

            if(!this.grid[curr.r][curr.c].right_wall && curr.c+1 < this.columns && !visit[curr.r][curr.c+1]){
                queue.push(new pair(curr.r, curr.c+1))
            }

            if(!this.grid[curr.r][curr.c].bottom_wall && curr.r+1 < this.columns && !visit[curr.r+1][curr.c]){
                queue.push(new pair(curr.r+1, curr.c))
            }

            if(!this.grid[curr.r][curr.c].left_wall && curr.c-1 >= 0 && !visit[curr.r][curr.c-1]){
                queue.push(new pair(curr.r, curr.c-1))
            }
        }
    }


    maze_setup(){
        maze.width = this.size;
        maze.height = this.size;

        maze.style.background = "grey";

        current.visited = true;

        for(let r = 0; r < this.rows;r++){
            for(let c = 0;c <= this.columns;c++){
                let grid = this.grid;
                // grid[r][c].show(this.size, this.rows, this.columns);
                if(r === 0 && c === 0){
                    grid[r][c].show(this.size, this.rows, this.columns, "red");
                }else if(r === this.rows - 1 && c === this.columns - 1){
                    grid[r][c].show(this.size, this.rows, this.columns, "green");
                }else{
                    grid[r][c].show(this.size, this.rows, this.columns, "grey");
                }
            }
        }
    }
}

class pair{
    constructor(r,c){
        this.r = r;
        this.c = c;
    }
}
let newMaze ;

// function show_message(){
//     console.log(document);
//     document.getElementById("message").innerHTML == "Path Found";
// }
document.getElementById("grid").onclick = function(){
    let p_r = prompt("Enter the number of rows and Columns");
    newMaze = new Maze(550, p_r, p_r);
    newMaze.setup();
    newMaze.maze_setup();
}

document.getElementById("random").onclick = function(){
    newMaze.draw();
}


document.getElementById("solve").onclick = function(){
    newMaze.solve();
}