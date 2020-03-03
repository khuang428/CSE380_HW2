/*
 * This provides responses to UI input.
 */
import {SceneGraph} from "../scene/SceneGraph"
import { SceneObject } from "../scene/SceneObject";
import { AnimatedSprite } from "../scene/sprite/AnimatedSprite";
import { GradientCircle } from "../scene/sprite/GradientCircle";

export class UIController {
    private objectToDrag : SceneObject;
    private objectToShowInfo : SceneObject;
    private scene : SceneGraph;
    private dragOffsetX : number;
    private dragOffsetY : number;

    public constructor() {}

    public init(canvasId : string, initScene : SceneGraph) : void {
        this.objectToDrag = null;
        this.scene = initScene;
        this.dragOffsetX = -1;
        this.dragOffsetY = -1;

        let canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(canvasId);
        canvas.addEventListener("mousedown", this.mouseDownHandler);
        canvas.addEventListener("mousemove", this.mouseMoveHandler);
        canvas.addEventListener("mouseup", this.mouseUpHandler);
        canvas.addEventListener("dblclick", this.mouseDClickHandler);
        canvas.addEventListener("click", this.mouseClickHandler);
    }

    public mouseDClickHandler = (event: MouseEvent) : void => {
        let mousePressX : number = event.clientX;
        let mousePressY : number = event.clientY;
        let sprite : AnimatedSprite = this.scene.getSpriteAt(mousePressX, mousePressY);
        let circle : GradientCircle = this.scene.getCircleAt(mousePressX, mousePressY);
        if(sprite != null){
            console.log(`I'm deleting the sprite ${sprite}`);
            this.scene.deleteAnimatedSprite(sprite);
        }
        if(circle != null){
            console.log(`I'm deleting the circle ${circle}`);
            this.scene.deleteGradientCircle(circle);
        }
    }

    public mouseClickHandler = (event: MouseEvent) : void => {
        let mousePressX : number = event.clientX;
        let mousePressY : number = event.clientY;
        let sprite : AnimatedSprite = this.scene.getSpriteAt(mousePressX, mousePressY);
        let circle : GradientCircle = this.scene.getCircleAt(mousePressX, mousePressY);
        if(sprite == null && circle == null){
            console.log(`I'm making an object at ${mousePressX}, ${mousePressY}`);
            let randnum = Math.random();
            if(randnum < 0.33){
                let circleToAdd : GradientCircle = new GradientCircle();
                circleToAdd.getPosition().set(mousePressX - (circleToAdd.getDiameter()/2), mousePressY - (circleToAdd.getDiameter()/2), 0.0,1.0);
                this.scene.addGradientCircle(circleToAdd);
            }/*else if(randnum < 0.66){
                let animatedSpriteType : AnimatedSpriteType = 
                let spriteToAdd : AnimatedSprite = new AnimatedSprite(animatedSpriteType, 'FORWARD');
                spriteToAdd.getPosition().set(mousePressX, mousePressY, 0.0,1.0);
                this.scene.addAnimatedSprite(spriteToAdd);
            }else{
                let animatedSpriteType : AnimatedSpriteType =
                let spriteToAdd : AnimatedSprite = new AnimatedSprite(animatedSpriteType, 'FORWARD');
                spriteToAdd.getPosition().set(mousePressX, mousePressY, 0.0,1.0);
                this.scene.addAnimatedSprite(spriteToAdd);
            }*/
        }
    }

    public mouseDownHandler = (event : MouseEvent) : void => {
        let mousePressX : number = event.clientX;
        let mousePressY : number = event.clientY;
        let sprite : AnimatedSprite = this.scene.getSpriteAt(mousePressX, mousePressY);
        let circle : GradientCircle = this.scene.getCircleAt(mousePressX, mousePressY);
        console.log("mousePressX: " + mousePressX);
        console.log("mousePressY: " + mousePressY);
        if (sprite != null) {
            // START DRAGGING IT
            console.log("sprite: " + sprite);
            this.objectToDrag = sprite;
            this.dragOffsetX = sprite.getPosition().getX() - mousePressX;
            this.dragOffsetY = sprite.getPosition().getY() - mousePressY;
        }
        if (circle != null) {
            // START DRAGGING IT
            console.log("circle: " + circle);
            this.objectToDrag = circle;
            this.dragOffsetX = circle.getPosition().getX() - mousePressX;
            this.dragOffsetY = circle.getPosition().getY() - mousePressY;
        }
    }
    
    public mouseMoveHandler = (event : MouseEvent) : void => {
        if (this.objectToDrag != null) {
            this.objectToDrag.getPosition().set(event.clientX + this.dragOffsetX, 
                                                event.clientY + this.dragOffsetY, 
                                                this.objectToDrag.getPosition().getZ(), 
                                                this.objectToDrag.getPosition().getW());
        }else{
            let mouseX : number = event.clientX;
            let mouseY : number = event.clientY;
            let sprite : AnimatedSprite = this.scene.getSpriteAt(mouseX, mouseY);
            let circle : GradientCircle = this.scene.getCircleAt(mouseX, mouseY);
            if(sprite != null){
                this.scene.setObjectToShowInfo(sprite);
            }else if(circle != null){
                this.scene.setObjectToShowInfo(circle);
            }else{
                this.scene.setObjectToShowInfo(null);
            }
        }
    }

    public getObjectToShowInfo = () : SceneObject => {
        return this.objectToShowInfo;
    }

    public mouseUpHandler = (event : MouseEvent) : void => {
        this.objectToDrag = null;
    }
}