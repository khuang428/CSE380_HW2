import {SceneObject} from '../SceneObject'

export class GradientCircle extends SceneObject {
    private diameter : number = 256;
    private static colors : Array<string> =["red", "green", "blue", "yellow", "cyan", "magenta"];
    private color : string;
    public constructor(){
        super();
        this.color = GradientCircle.colors[Math.random() * (GradientCircle.colors.length-1)];
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

    public getColor() : string {
        return this.color;
    }

    public toString() : string {
        let colorRGB = "";
        switch(this.getColor()){
            case "red":
                break;
            case "green":
                break;
            case "blue":
                break;
            case "yellow":
                break;
            case "cyan":
                break;
            case "magenta":
                break;
            default:
                break;
        }
        let summary : string =  "{ position: ("
                            +   this.getPosition().getX() + ", " + this.getPosition().getY() + ") "
                            +   "(color: " + colorRGB + ") ";
        return summary;
    }
}