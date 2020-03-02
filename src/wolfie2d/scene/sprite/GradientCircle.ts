import {SceneObject} from '../SceneObject'

export class GradientCircle extends SceneObject {
    private diameter : number = 250;
    public constructor(){
        super();
    }

    public contains(pointX : number, pointY : number) : boolean {
        let spriteLeft = this.getPosition().getX();
        let spriteRight = this.getPosition().getX() + this.diameter;
        let spriteTop = this.getPosition().getY();
        let spriteBottom = this.getPosition().getY() + this.diameter;
        if (    (pointX < spriteLeft)
            ||  (spriteRight < pointX)
            ||  (pointY < spriteTop)
            ||  (spriteBottom < pointY)) {
                return false;
        }
        else {
            return true;
        }
    }

    public getDiameter() : number {
        return this.diameter;
    }
}