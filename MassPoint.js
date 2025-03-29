class MassPoint{
	constructor(pos, mass, radius = 7){
		this.pos = pos;
		this.oldPos = pos;
		this.dt0 = 1;
		this.gravity = Vector2.Zero();
        this.velocity = Vector2.Zero();
		
		this.acceleration = Vector2.Zero();
		this.forceAccumulator = Vector2.Zero();
		this.color = "black";
		this.radius = radius;
		
		if(mass > 0){
			this.invMass = 1/mass;
			this.isPinned = false; // step 2
		}
		else{
			this.invMass = 0;
			this.isPinned = true;
		} 
	}
	
	
	update(deltaTime){
		if(!this.isPinned){ 
			this.addForce(Scale(this.gravity,1/this.invMass));
			this.applyAcceleration();
			this.integrateVerlet(deltaTime);

            if(this.pos.y > canvas.height){
                this.pos.y = canvas.height;
                this.oldPos.y = this.pos.y + this.velocity.y * 1.0;
            }

			if(this.pos.x > canvas.width){
				this.pos.x = canvas.width;
				this.oldPos.x = this.pos.x + this.velocity.x * 1.0;
			}
			if(this.pos.x < 0){
				this.pos.x = 0;
				this.oldPos.x = this.pos.x + this.velocity.x * 1.0;
			}
		}
	}
	
	isInside(position){
		let distance = Sub(this.pos,position).Length();
		return distance < this.radius;
	}

	setGravity(gravity){
		this.gravity = gravity;
	}
	
	applyAcceleration(){
		// F = m * a
		// a = F / m
		let accelerationOf = Scale(this.forceAccumulator,this.invMass);
		this.acceleration = Add(this.acceleration,accelerationOf);	
	}	

	integrateVerlet(deltaTime){
		this.improvedVerlet(deltaTime);
		//this.standardVerlet(deltaTime);
	}

	/*
	The Störmer-Verlet method becomes inaccurate when the time step (Δt) varies, 
	because it relies on a constant time step to approximate the solution of the differential equation
	*/
	standardVerlet(deltaTime){
		let positionTerm = Sub(Scale(this.pos, 2), this.oldPos);
		let accelerationTerm = Scale(this.acceleration, deltaTime * deltaTime);
		this.velocity = Sub(this.pos, this.oldPos);

		this.oldPos = this.pos;  
		this.pos = Add(positionTerm, accelerationTerm);

		this.acceleration = Vector2.Zero();
		this.forceAccumulator = Vector2.Zero();
	}
	

	// x1 = x + (x – x0) * (dt / dt0) + a * dt * (dt + dt0) / 2
	improvedVerlet(deltaTime){
		// Berechnung der Geschwindigkeit: (x – x0)
		this.velocity = Sub(this.pos, this.oldPos);

		// Speichern der aktuellen Position als alte Position für den nächsten Schritt
		this.oldPos = this.pos.Cpy();

		// Berechnung des zeitkorrigierten Faktors: (dt / dt0)
		let dt = deltaTime / this.dt0;

		// Berechnung des zeitkorrigierten Geschwindigkeitsterms: (x – x0) * (dt / dt0)
		let timeCorrectedVelocity = Scale(this.velocity, dt);

		// Berechnung des Beschleunigungsterms: a * dt * (dt + dt0) / 2
		let accelerationTerm = Scale(this.acceleration, deltaTime * (deltaTime + this.dt0) / 2);

		// Berechnung der neuen Position: x1 = x + zeitkorrigierte Geschwindigkeit + Beschleunigungsterm
		this.pos = Add(this.pos, Add(timeCorrectedVelocity, accelerationTerm));

		// Aktualisierung von dt0 für den nächsten Schritt
		this.dt0 = deltaTime;

		// Zurücksetzen von Beschleunigung und Kraftakkumulator
		this.acceleration = Vector2.Zero();
		this.forceAccumulator = Vector2.Zero();
	}

	addForce(addForce){
		this.forceAccumulator = Add(this.forceAccumulator,addForce);
	}
	
	draw(){
		if(this.isPinned){
			DrawUtils.drawPoint(this.pos, this.radius, this.color);
		}
	}
}