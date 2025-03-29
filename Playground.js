class Playground{
    constructor(){
        this.simulation = new Simulation();
        this.mousePosition = Vector2.Zero();
        this.selectedPoint = null;


        this.clothResolution = 7;
        this.clothWidth = 800;
        this.clothHeight = 200;

        this.initialize();
    }

    initialize(){
        /*
        let point0 = this.simulation.createMassPoint(new Vector2(150,100));
        let point1 = this.simulation.createMassPoint(new Vector2(200,200));
        let point2 = this.simulation.createMassPoint(new Vector2(100,200));

        this.simulation.createConstraint(point0,point1);
        this.simulation.createConstraint(point1,point2);
        this.simulation.createConstraint(point2,point0);
        */


        // Create cloth
        let massPointsX = this.clothWidth / this.clothResolution;
        let massPointsY = this.clothHeight / this.clothResolution;
        let massPoints2d = [];

        for(let y = 0; y < massPointsY; y++){
            massPoints2d[y] = [];
            for(let x = 0; x < massPointsX; x++){
                let offset = new Vector2(canvas.width / 2 - this.clothWidth / 2, 50);
                let position = new Vector2(x * this.clothResolution + offset.x,y * this.clothResolution + offset.y);
                massPoints2d[y][x] = this.simulation.createMassPoint(position);

                if(x % 10 == 0 && y == 0 || x == massPointsX-1 && y == 0){
                    massPoints2d[y][x].isPinned = true;
                }
            }
        }

        for(let y = 0; y < massPointsY; y++){
            for(let x = 0; x < massPointsX; x++){
                if(x < massPointsX-1){
                    this.simulation.createConstraint(massPoints2d[y][x],massPoints2d[y][x+1]);
                }
                if(y < massPointsY-1){
                    this.simulation.createConstraint(massPoints2d[y][x],massPoints2d[y+1][x]);
                }
            }
        }

        console.log("Mass points created: " + this.simulation.points.length);
    }

    update(dt){
        console.time("update");
        this.simulation.update(0.02);

        if(this.selectedPoint != null){
            this.selectedPoint.pos = this.mousePosition.Cpy();
            this.selectedPoint.oldPos = this.mousePosition.Cpy();
        }
        console.timeEnd("update");
    }

    draw(){
        this.simulation.draw();
    }



    onMouseMove(position){
        this.mousePosition = position;
    }

    onMouseDown(button){
        let point = this.simulation.getMassPointAtPosition(this.mousePosition);
        if(point != null){
            this.selectedPoint = point;
        }
    }

    onMouseUp(button){
        this.selectedPoint = null;
    }

}