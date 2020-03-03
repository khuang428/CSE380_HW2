import {WebGLGameShader} from './WebGLGameShader'
import {MathUtilities} from '../math/MathUtilities'
import { Matrix } from '../math/Matrix'
import { Vector3 } from '../math/Vector3'
import {GradientCircle} from '../scene/sprite/GradientCircle'
import {HashTable} from '../data/HashTable'

var CircleDefaults = {
    A_POSITION: "a_Position",
    A_VALUE_TO_INTERPOLATE: "a_ValueToInterpolate",
    U_SPRITE_TRANSFORM: "u_SpriteTransform",
    NUM_VERTICES: 4,
    FLOATS_PER_VERTEX: 2,
    TOTAL_BYTES: 16,
    VERTEX_POSITION_OFFSET: 0,
    INDEX_OF_FIRST_VERTEX: 0
};

export class WebGLGameCircleRenderer{
    private shader : WebGLGameShader;

    private spriteTransform : Matrix;
    private spriteTranslate : Vector3;
    private spriteRotate : Vector3;
    private spriteScale : Vector3;

    private webGLAttributeLocations : HashTable<GLuint>;
    private webGLUniformLocations : HashTable<WebGLUniformLocation>;

    public constructor() {}

    public init(webGL : WebGLRenderingContext) : void {
        this.shader = new WebGLGameShader();
        var vertexShaderSource =
            'precision highp float;\n' +
            'attribute vec4 ' + CircleDefaults.A_POSITION + ';\n' +
            'attribute vec2 ' + CircleDefaults.A_VALUE_TO_INTERPOLATE + ';\n' +
            'varying vec2 val;\n' +
            'uniform mat4 ' + CircleDefaults.U_SPRITE_TRANSFORM + ';\n' +
            'void main() {\n' +
            '  val = ' + CircleDefaults.A_VALUE_TO_INTERPOLATE + ';\n' +
            '  gl_Position = ' + CircleDefaults.U_SPRITE_TRANSFORM + ' * ' + CircleDefaults.A_POSITION + ';\n' +
            '}\n';
        var fragmentShaderSource =
            'precision highp float;\n' +
            'varying vec2 val;\n' +
            'void main() {\n' +
            '  float R = 0.5;\n' +
            '  float dist = sqrt(dot(val,val));\n' +
            '  float alpha = 1.0;\n' +
            '  if(dist > R){\n' +
            '    discard;\n' +
            '  }\n' +
            '  gl_FragColor = vec4(0.0, 0.0, dist, alpha);\n' +
            '}\n';
        this.shader.init(webGL, vertexShaderSource, fragmentShaderSource);

        this.webGLAttributeLocations = {};
        this.webGLUniformLocations = {};
        this.loadAttributeLocations(webGL, [CircleDefaults.A_POSITION, CircleDefaults.A_VALUE_TO_INTERPOLATE]);
        this.loadUniformLocations(webGL, [CircleDefaults.U_SPRITE_TRANSFORM]);

        this.spriteTransform = new Matrix(4, 4);
        this.spriteTranslate = new Vector3();
        this.spriteRotate = new Vector3();
        this.spriteScale = new Vector3();
    }

    public renderGradientCircles(  webGL : WebGLRenderingContext, canvasWidth : number, canvasHeight : number, visibleSet : Array<GradientCircle>) : void {
        // SELECT THE ANIMATED SPRITE RENDERING SHADER PROGRAM FOR USE
        let shaderProgramToUse = this.shader.getProgram();
        webGL.useProgram(shaderProgramToUse);

        // AND THEN RENDER EACH ONE
        for (let circle of visibleSet) {
            this.renderGradientCircle(webGL, canvasWidth, canvasHeight, circle);        
        }
    }

    private loadAttributeLocations(webGL : WebGLRenderingContext, attributeLocationNames : Array<string>) {
        for (var i = 0; i < attributeLocationNames.length; i++) {
            let locationName : string = attributeLocationNames[i];
            let location : GLuint = webGL.getAttribLocation(this.shader.getProgram(), locationName);
            this.webGLAttributeLocations[locationName] = location;
        }
    }

    private loadUniformLocations(webGL : WebGLRenderingContext, uniformLocationNames : Array<string>) {
        for (let i : number = 0; i < uniformLocationNames.length; i++) {
            let locationName : string = uniformLocationNames[i];
            let location : WebGLUniformLocation = webGL.getUniformLocation(this.shader.getProgram(), locationName);
            this.webGLUniformLocations[locationName] = location;
        }
    }

    private renderGradientCircle(   webGL : WebGLRenderingContext, canvasWidth : number, canvasHeight : number, circle: GradientCircle) {

        // CALCULATE HOW MUCH TO TRANSLATE THE QUAD PER THE CIRCLE POSITION
        let diameter : number = circle.getDiameter();
        let circleXInPixels : number = circle.getPosition().getX() + (diameter/2);
        let circleYInPixels : number = circle.getPosition().getY() + (diameter/2);
        let circleXTranslate : number = (circleXInPixels - (canvasWidth/2))/(canvasWidth/2);
        let circleYTranslate : number = (circleYInPixels - (canvasHeight/2))/(canvasHeight/2);
        this.spriteTranslate.setX(circleXTranslate);
        this.spriteTranslate.setY(-circleYTranslate);

        // CALCULATE HOW MUCH TO SCALE THE QUAD PER THE CIRCLE SIZE
        let defaultWidth : number = canvasWidth/2;
        let defaultHeight : number = canvasHeight/2;
        let scaleX : number = diameter/defaultWidth;
        let scaleY : number = diameter/defaultHeight;
        this.spriteScale.setX(scaleX);
        this.spriteScale.setY(scaleY);

        // @todo - COMBINE THIS WITH THE ROTATE AND SCALE VALUES FROM THE SPRITE
        MathUtilities.identity(this.spriteTransform);
        MathUtilities.model(this.spriteTransform, this.spriteTranslate, this.spriteRotate, this.spriteScale);

        // HOOK UP THE ATTRIBUTES
        let a_PositionLocation : GLuint = this.webGLAttributeLocations[CircleDefaults.A_POSITION];
        webGL.vertexAttribPointer(a_PositionLocation, CircleDefaults.FLOATS_PER_VERTEX, webGL.FLOAT, false, CircleDefaults.TOTAL_BYTES, CircleDefaults.VERTEX_POSITION_OFFSET);
        webGL.enableVertexAttribArray(a_PositionLocation);
        let a_ValueToInterpolate : GLuint = this.webGLAttributeLocations[CircleDefaults.A_VALUE_TO_INTERPOLATE];
        webGL.vertexAttribPointer(a_ValueToInterpolate, CircleDefaults.FLOATS_PER_VERTEX, webGL.FLOAT, false, CircleDefaults.TOTAL_BYTES, CircleDefaults.VERTEX_POSITION_OFFSET);
        webGL.enableVertexAttribArray(a_ValueToInterpolate);
        


        // USE THE UNIFORMS
        let u_SpriteTransformLocation : WebGLUniformLocation = this.webGLUniformLocations[CircleDefaults.U_SPRITE_TRANSFORM];
        webGL.uniformMatrix4fv(u_SpriteTransformLocation, false, this.spriteTransform.getData());
        
        // DRAW THE SPRITE AS A TRIANGLE STRIP USING 4 VERTICES, STARTING AT THE START OF THE ARRAY (index 0)
        webGL.drawArrays(webGL.TRIANGLE_STRIP, CircleDefaults.INDEX_OF_FIRST_VERTEX, CircleDefaults.NUM_VERTICES);
        }

}