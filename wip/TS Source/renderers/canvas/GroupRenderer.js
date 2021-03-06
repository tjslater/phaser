var Phaser;
(function (Phaser) {
    (function (Renderer) {
        /// <reference path="../../_definitions.ts" />
        (function (Canvas) {
            var GroupRenderer = (function () {
                function GroupRenderer(game) {
                    //  Local rendering related temp vars to help avoid gc spikes through var creation
                    this._ga = 1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = 0;
                    this._sh = 0;
                    this._dx = 0;
                    this._dy = 0;
                    this._dw = 0;
                    this._dh = 0;
                    this._fx = 1;
                    this._fy = 1;
                    this._sin = 0;
                    this._cos = 1;
                    this.game = game;
                }
                GroupRenderer.prototype.preRender = function (camera, group) {
                    if(group.visible == false || camera.transform.scale.x == 0 || camera.transform.scale.y == 0 || camera.texture.alpha < 0.1) {
                        return false;
                    }
                    //  Reset our temp vars
                    this._ga = -1;
                    this._sx = 0;
                    this._sy = 0;
                    this._sw = group.texture.width;
                    this._sh = group.texture.height;
                    this._fx = group.transform.scale.x;
                    this._fy = group.transform.scale.y;
                    this._sin = 0;
                    this._cos = 1;
                    //this._dx = (camera.screenView.x * camera.scrollFactor.x) + camera.frameBounds.x - (camera.worldView.x * camera.scrollFactor.x);
                    //this._dy = (camera.screenView.y * camera.scrollFactor.y) + camera.frameBounds.y - (camera.worldView.y * camera.scrollFactor.y);
                    this._dx = 0;
                    this._dy = 0;
                    this._dw = group.texture.width;
                    this._dh = group.texture.height;
                    //  Global Composite Ops
                    if(group.texture.globalCompositeOperation) {
                        group.texture.context.save();
                        group.texture.context.globalCompositeOperation = group.texture.globalCompositeOperation;
                    }
                    //  Alpha
                    if(group.texture.alpha !== 1 && group.texture.context.globalAlpha !== group.texture.alpha) {
                        this._ga = group.texture.context.globalAlpha;
                        group.texture.context.globalAlpha = group.texture.alpha;
                    }
                    //  Flip X
                    if(group.texture.flippedX) {
                        this._fx = -group.transform.scale.x;
                    }
                    //  Flip Y
                    if(group.texture.flippedY) {
                        this._fy = -group.transform.scale.y;
                    }
                    //	Rotation and Flipped
                    if(group.modified) {
                        if(group.transform.rotation !== 0 || group.transform.rotationOffset !== 0) {
                            this._sin = Math.sin(group.game.math.degreesToRadians(group.transform.rotationOffset + group.transform.rotation));
                            this._cos = Math.cos(group.game.math.degreesToRadians(group.transform.rotationOffset + group.transform.rotation));
                        }
                        group.texture.context.save();
                        group.texture.context.setTransform(this._cos * this._fx, //  scale x
                        (this._sin * this._fx) + group.transform.skew.x, //  skew x
                        -(this._sin * this._fy) + group.transform.skew.y, //  skew y
                        this._cos * this._fy, //  scale y
                        this._dx, //  translate x
                        this._dy);
                        //  translate y
                        this._dx = -group.transform.origin.x;
                        this._dy = -group.transform.origin.y;
                    } else {
                        if(!group.transform.origin.equals(0)) {
                            this._dx -= group.transform.origin.x;
                            this._dy -= group.transform.origin.y;
                        }
                    }
                    this._sx = Math.floor(this._sx);
                    this._sy = Math.floor(this._sy);
                    this._sw = Math.floor(this._sw);
                    this._sh = Math.floor(this._sh);
                    this._dx = Math.floor(this._dx);
                    this._dy = Math.floor(this._dy);
                    this._dw = Math.floor(this._dw);
                    this._dh = Math.floor(this._dh);
                    if(group.texture.opaque) {
                        group.texture.context.fillStyle = group.texture.backgroundColor;
                        group.texture.context.fillRect(this._dx, this._dy, this._dw, this._dh);
                    }
                    if(group.texture.loaded) {
                        group.texture.context.drawImage(group.texture.texture, //	Source Image
                        this._sx, //	Source X (location within the source image)
                        this._sy, //	Source Y
                        this._sw, //	Source Width
                        this._sh, //	Source Height
                        this._dx, //	Destination X (where on the canvas it'll be drawn)
                        this._dy, //	Destination Y
                        this._dw, //	Destination Width (always same as Source Width unless scaled)
                        this._dh);
                        //	Destination Height (always same as Source Height unless scaled)
                                            }
                    return true;
                };
                GroupRenderer.prototype.postRender = function (camera, group) {
                    if(group.modified || group.texture.globalCompositeOperation) {
                        group.texture.context.restore();
                    }
                    if(this._ga > -1) {
                        group.texture.context.globalAlpha = this._ga;
                    }
                };
                return GroupRenderer;
            })();
            Canvas.GroupRenderer = GroupRenderer;            
        })(Renderer.Canvas || (Renderer.Canvas = {}));
        var Canvas = Renderer.Canvas;
    })(Phaser.Renderer || (Phaser.Renderer = {}));
    var Renderer = Phaser.Renderer;
})(Phaser || (Phaser = {}));
