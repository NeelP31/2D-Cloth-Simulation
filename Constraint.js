class Constraint{
    constructor(massPointA, massPointB, strength){
        this.massPointA = massPointA;
        this.massPointB = massPointB;
        this.strength = strength;
        this.restLength = Sub(massPointB.pos, massPointA.pos).Length();
    }

    update(){
        let direction = Sub(this.massPointB.pos, this.massPointA.pos);
        let currentLength = direction.Length();
        let difference = (this.restLength - currentLength);

        let correctionPercentage = (difference / currentLength) / 2;

        let offset = Scale(direction, correctionPercentage * this.strength);
        direction.Normalize();


        if(!this.massPointA.isPinned){
            this.massPointA.pos = Sub(this.massPointA.pos, offset);
        }

        if(!this.massPointB.isPinned){
            this.massPointB.pos = Add(this.massPointB.pos, offset);
        }
    }

    draw(){
        DrawUtils.drawLine(this.massPointA.pos, this.massPointB.pos, "black", 1);
    }

}