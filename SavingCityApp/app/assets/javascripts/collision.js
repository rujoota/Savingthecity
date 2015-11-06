/*
 * private function initialize()
 *
 * Initializes the object
 *
 */
var sourcemap,targetmap;
function initialize() {
    var image  = document.getElementById("bullet");
    var canvas = document.createElement("canvas");
    image.setAttribute('crossOrigin', 'anonymous');
    document.body.appendChild(canvas);
    canvas.width  = image.width;
    canvas.height = image.height;
    var context = canvas.getContext("2d");

    context.drawImage(image, 0, 0);

    var image1  = document.getElementById("spiderman_img");
    var canvas1 = document.createElement("canvas");
    document.body.appendChild(canvas1);
    image1.setAttribute('crossOrigin', 'anonymous');
    canvas1.width  = 200;
    canvas1.height = 200;
    var context1 = canvas1.getContext("2d");
    context1.drawImage(image1, 0, 0);

    sourcemap=buildPixelMap(canvas);
    targetmap=buildPixelMap(canvas1);


    context.clearRect(0, 0, canvas.width, canvas.height);
    context1.clearRect(0, 0, canvas1.width, canvas1.height);

    if(hitTest(source,target))
        alert('collision');
    else
        alert('no collision');

}

/*
 * public function hitTest()
 *
 * Checks if two objects collide. First with box-model detection
 * and then on a per-pixel detection.
 *
 * Both source and target objects are expected to look like this:
 *
 * {
 *    x: (Number) current x position,
 *    y: (Number) current y position,
 *    width: (Number) object height,
 *    height: (Number) object width,
 *    pixelmap: (Object) pixel map object generated from buildPixelMap()
 * }
 *
 * @param source (Object) The source object
 * @param target (Object) The target object
 *
 * @return boolean, true on collision
 *
 */
this.hitTest = function( source, target ) {

    var hit = false;
    //var start = new Date().getTime();

    //if( this.boxHitTest( source, target ) ) {
        if( this.pixelHitTest( source, target ) ) {
            hit = true;
        }
    //}

    //var end = new Date().getTime();

    if( hit == true ){
        //console.log( 'detection took: ' + (end - start) + 'ms' );
    }

    return hit;
}

/*
 * private function boxHitTest()
 *
 * Checks if two objects collide with box-model detection.
 *
 * Both source and target objects are expected to look like this:
 *
 * {
 *    x: (Number) current x position,
 *    y: (Number) current y position,
 *    width: (Number) object height,
 *    height: (Number) object width
 * }
 *
 * @param source (Object) The source object
 * @param target (Object) The target object
 *
 * @return boolean, true on collision
 *
 */
this.boxHitTest = function( source, target ) {
    return !(
        ( ( source.y + source.height ) < ( target.y ) ) ||
        ( source.y > ( target.y + target.height ) ) ||
        ( ( source.x + source.width ) < target.x ) ||
        ( source.x > ( target.x + target.width ) )
    );
}

/*
 * private function pixelHitTest()
 *
 * Checks if two objects collide on a per-pixel detection.
 *
 * Both source and target objects are expected to look like this:
 *
 * {
 *    x: (Number) current x position,
 *    y: (Number) current y position,
 *    width: (Number) object height,
 *    height: (Number) object width,
 *    height: (Number) object width,
 *    pixelmap: (Object) pixel map object generated from buildPixelMap()
 * }
 *
 * @param source (Object) The source object
 * @param target (Object) The target object
 *
 * @return boolean, true on collision
 *
 */
/* Pixel collision detection pseudo code */
function pixelHitTest( source, target ) {

    // Source and target object contain two properties
    // { data: a render-map, resolution: The precision of the render-map}
    //alert('in pixel hit test');
    // Loop through all the pixels in the source image
    for( var s = 0; s < source.pixelMap.data.length; s++ ) {
        var sourcePixel = source.data.pixelMap[s];
        // Add positioning offset
        var sourceArea = {
            x: sourcePixel.x + source.x,
            y: sourcePixel.y + source.y,
            width: target.pixelMap.resolution,
            height: target.pixelMap.resolution
        };

        // Loop through all the pixels in the target image
        for( var t = 0; t < target.pixelMap.data.length; t++ ) {
            var targetPixel = target.pixelMap.data[t];
            // Add positioning offset
            var targetArea = {
                x: targetPixel.x + target.x,
                y: targetPixel.y + target.y,
                width: target.pixelMap.resolution,
                height: target.pixelMap.resolution
            };

            /* Use the earlier aforementioned hitbox function */
            if( hitBox( sourceArea, targetArea ) ) {
                return true;
            }
        }
    }
    return false;
}

/*
 * public function buildPixelMap()
 *
 * Creates a pixel map on a canvas image. Everything
 * with a opacity above 0 is treated as a collision point.
 * Lower resolution (higher number) will generate a faster
 * but less accurate map.
 *
 *
 * @param source (Object) The canvas object
 * @param resolution (int)(DEPRECATED!) The resolution of the map
 *
 * @return object, a pixelMap object
 *
 */
this.buildPixelMap = function( source ) {
    var resolution = 1;
    var ctx = source.getContext("2d");
    var pixelMap = [];

    for( var y = 0; y < source.height; y++) {
        for( var x = 0; x < source.width; x++ ) {
            var dataRowColOffset = y+"_"+x;//((y * source.width) + x);
            var pixel = ctx.getImageData(x,y,resolution,resolution);
            var pixelData = pixel.data;

            pixelMap[dataRowColOffset] = { x:x, y:y, pixelData: pixelData };

        }
    }
    return {
        data: pixelMap,
        resolution: resolution
    };
}