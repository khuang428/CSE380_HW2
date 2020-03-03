/*
 * Game is the focal point of the application, it has 4 subsystems,
 * the resource manager, the scene graph, the rendering system, and
 * the UI controller. In addition it serves as the game loop, providing
 * both an update and draw function that is called on a schedule.
 */
import {GameLoopTemplate} from './loop/GameLoopTemplate'
import {WebGLGameRenderingSystem} from './rendering/WebGLGameRenderingSystem'
import {SceneGraph} from './scene/SceneGraph'
import {AnimatedSprite} from './scene/sprite/AnimatedSprite'
import {ResourceManager} from './files/ResourceManager'
import {UIController} from './ui/UIController'
import { TextToRender } from './rendering/TextRenderer'
import { SceneObject } from './scene/SceneObject'
import { GradientCircle } from './scene/sprite/GradientCircle'


export class Game extends GameLoopTemplate {
    private resourceManager : ResourceManager = new ResourceManager();
    private sceneGraph : SceneGraph = new SceneGraph();
    private renderingSystem : WebGLGameRenderingSystem = new WebGLGameRenderingSystem();
    private uiController : UIController = new UIController();

    public constructor() {
        super();
    }

    public getRenderingSystem() : WebGLGameRenderingSystem {
        return this.renderingSystem;
    }

    public getResourceManager() : ResourceManager {
        return this.resourceManager;
    }

    public getSceneGraph() : SceneGraph {
        return this.sceneGraph;
    }

    public init(gameCanvasId : string, textCanvasId : string) : void {
        this.renderingSystem.init(gameCanvasId, textCanvasId);
        this.uiController.init(gameCanvasId, this.sceneGraph);
    }

    public begin() : void {
    }

    /*
     * This draws the game. Note that we are not currently using the 
     * interpolation value, but could once physics is involved.
     */
    public draw(interpolationPercentage : number) : void {
        // GET THE VISIBLE SET FROM THE SCENE GRAPH
        this.sceneGraph.scope();

        let location = this.sceneGraph.getObjMakeLocation();
        if(location != null){
            let rand = Math.random();
            if(rand < 0.33){
                let circleToAdd = new GradientCircle();
                circleToAdd.getPosition().setX(location[0] - circleToAdd.getDiameter()/2);
                circleToAdd.getPosition().setY(location[1] - circleToAdd.getDiameter()/2);
                this.sceneGraph.addGradientCircle(circleToAdd);
                this.sceneGraph.setObjectToShowInfo(circleToAdd);
            }else if(rand < 0.66){
                let spriteType = this.resourceManager.getAnimatedSpriteTypeById('resources/animated_sprites/RedCircleMan.json');
                let spriteToAdd = new AnimatedSprite(spriteType,'FORWARD');
                spriteToAdd.getPosition().setX(location[0] - (spriteType.getSpriteWidth()/2));
                spriteToAdd.getPosition().setY(location[1] - (spriteType.getSpriteHeight()/2));
                this.sceneGraph.addAnimatedSprite(spriteToAdd);
                this.sceneGraph.setObjectToShowInfo(spriteToAdd);
            }else{
                let spriteType = this.resourceManager.getAnimatedSpriteTypeById('resources/animated_sprites/MultiColorBlock.json');
                let spriteToAdd = new AnimatedSprite(spriteType,'FORWARD');
                spriteToAdd.getPosition().setX(location[0] - (spriteType.getSpriteWidth()/2));
                spriteToAdd.getPosition().setY(location[1] - (spriteType.getSpriteHeight()/2));
                this.sceneGraph.addAnimatedSprite(spriteToAdd);
                this.sceneGraph.setObjectToShowInfo(spriteToAdd);
            }
            this.sceneGraph.setObjMakeLocation(null);
        }

        // RENDER THE VISIBLE SET, WHICH SHOULD ALL BE RENDERABLE
        this.renderingSystem.render(this.sceneGraph.getAnimatedSprites(), this.sceneGraph.getGradientCircles());
        
    }

    /**
     * Updates the scene.
     */
    public update(delta : number) : void {
        this.sceneGraph.update(delta);
    }
    
    /**
     * Updates the FPS counter.
     */
    public end(fps : number, panic : boolean) : void {
        if (panic) {
            var discardedTime = Math.round(this.resetFrameDelta());
            console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
        }
    }
}