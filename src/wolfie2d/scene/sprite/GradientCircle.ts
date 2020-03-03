import {SceneObject} from '../SceneObject'

export class GradientCircle extends SceneObject {
    private diameter : number = 256;
    public constructor(){
        super();
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


    public toString() : string {

        let summary : string =  "{ position: ("
                            +   this.getPosition().getX() + ", " + this.getPosition().getY() + "),  "
                            +   "color: () }";
        return summary;
    }
}