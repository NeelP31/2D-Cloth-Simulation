class Simulation{
	constructor(){
		this.points = [];
		this.constraints = [];
		this.gravity = new Vector2(0,250);
	}

	createMassPoint(position, mass = 1){
		let point = new MassPoint(position,mass);
		this.points.push(point);
		return point;
	}

	createConstraint(point0,point1, strength = 0.4){
		let constraint = new Constraint(point0,point1,strength);
		this.constraints.push(constraint);
		return constraint;
	}
	

	getMassPointAtPosition(position){
		for(let i=0;i<this.points.length;i++){
			if(this.points[i].isInside(position)){
				return this.points[i];
			}
		}
		return null;
	}

	update(dt){
		for(let i=0;i<this.points.length;i++){
			this.points[i].setGravity(this.gravity);
			this.points[i].update(dt);
		}

		for(let iterations = 0; iterations < 3; iterations++){
			for(let i=0;i<this.constraints.length;i++){
				this.constraints[i].update();
			}
		}
	}
	
	
	draw(){
		for(let i=0;i<this.points.length;i++){
			this.points[i].draw();
		}

		for(let i=0;i<this.constraints.length;i++){
			this.constraints[i].draw();
		}
	}	
}