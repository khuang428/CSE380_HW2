import {SceneObject} from '../SceneObject'

export class GradientCircle extends SceneObject {
    private diameter : number = 256;
    private static colors : Array<Array<number>> = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0], [1.0, 1.0, 0.0], [1.0, 0.0, 1.0], [0.0, 1.0, 1.0]];
    private color : Array<number>;
    public constructor(){
        super();
        this.color = GradientCircle.colors[Math.floor(Math.random() * GradientCircle.colors.length)];
    }

    public contains(pointX : number, pointY : number) : boolean {
        let centerX = this.getPosition().getX() + this.getDiameter()/2;
        let centerY = this.getPosition().getY() + this.getDiameter()/2;
        if(Math.sqrt((Math.pow(pointX - centerX,2)) + (Math.pow(pointY - centerY,2)) ) > this.getDiameter()/2){
            return false;

        }else {
            return true;
        }
    }

    public getDiameter() : number {
        return this.diameter;
    }

    public getColor() : Array<number> {
        return this.color;
    }

    public toString() : string {

        let summary : string =  "{ position: ("
                            +   this.getPosition().getX() + ", " + this.getPosition().getY() + "),  "
                            +   "color: (" + this.color[0] + ", " + this.color[1] + ", " + this.color[2] + ") }";
        return summary;
    }
}