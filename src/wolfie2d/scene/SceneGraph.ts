import {SceneObject} from './SceneObject'
import {AnimatedSprite} from './sprite/AnimatedSprite'
import {GradientCircle} from './sprite/GradientCircle'

export class SceneGraph {
    // AND ALL OF THE ANIMATED SPRITES, WHICH ARE NOT STORED
    // SORTED OR IN ANY PARTICULAR ORDER. NOTE THAT ANIMATED SPRITES
    // ARE SCENE OBJECTS
    private animatedSprites : Array<AnimatedSprite>;

    private gradientCircles : Array<GradientCircle>;

    // SET OF VISIBLE OBJECTS, NOTE THAT AT THE MOMENT OUR
    // SCENE GRAPH IS QUITE SIMPLE, SO THIS IS THE SAME AS
    // OUR LIST OF ANIMATED SPRITES
    private visibleSet : Array<SceneObject>;

    public constructor() {
        // DEFAULT CONSTRUCTOR INITIALIZES OUR DATA STRUCTURES
        this.animatedSprites = new Array();
        this.gradientCircles = new Array();
        this.visibleSet = new Array();
    }

    public getNumSprites() : number {
        return this.animatedSprites.length;
    }

    public getNumCircles() : number {
        return this.gradientCircles.length;
    }

    public addAnimatedSprite(sprite : AnimatedSprite) : void {
        this.animatedSprites.push(sprite);
    }

    public addGradientCircle(circle : GradientCircle) : void {
        this.gradientCircles.push(circle);
    }

    public getSpriteAt(testX : number, testY : number) : SceneObject {
        for (let sprite of this.visibleSet) {
            if (sprite.contains(testX, testY))
                return sprite;
        }
        return null;
    }

    /**
     * update
     * 
     * Called once per frame, this function updates the state of all the objects
     * in the scene.
     * 
     * @param delta The time that has passed since the last time this update
     * funcation was called.
     */
    public update(delta : number) : void {
        for (let sprite of this.animatedSprites) {
            sprite.update(delta);
        }
    }

    public scope() : Array<SceneObject> {
        // CLEAR OUT THE OLD
        this.visibleSet = [];

        // PUT ALL THE SCENE OBJECTS INTO THE VISIBLE SET
        for (let sprite of this.animatedSprites) {
            this.visibleSet.push(sprite);
        }

        for (let circle of this.gradientCircles) {
            this.visibleSet.push(circle);
        }

        return this.visibleSet;
    }

    public getAnimatedSprites() : Array<AnimatedSprite>{
        return this.animatedSprites;
    }

    public getGradientCircles() : Array<GradientCircle>{
        return this.gradientCircles;
    }
}