/*!
  DMXzone jQuery.csstransform
  
  Version 1.3
  
  Copyright (c) 2010 DMXzone.com 
*/
(function($) {
  
  // ===========================================================================
  // Starts file: jquery.csstransform_patch.js 
  // ===========================================================================
  
  // Create the bundings skeleton if needed
  $.bindings = $.extend(true, $.bindings || {}, {
    setter : {
      css  : {},
      attr : {}
    },
    getter : {
      css  : {},
      attr : {}
    },
    filter : {},
    formatter : {}
  });
  
  // Register CSSTransform setters
  $.extend($.bindings.setter.css, {
    "matrix"     : function(elem, value) { TransformManager.getInstance(elem).set("matrix"    , value).paint(); },
    "rotate"     : function(elem, value) { TransformManager.getInstance(elem).set("rotate"    , value).paint(); },
    "scale"      : function(elem, value) { TransformManager.getInstance(elem).set("scale"     , value).paint(); },
    "scaleX"     : function(elem, value) { TransformManager.getInstance(elem).set("scaleX"    , value).paint(); },
    "scaleY"     : function(elem, value) { TransformManager.getInstance(elem).set("scaleY"    , value).paint(); },
    "skew"       : function(elem, value) { TransformManager.getInstance(elem).set("skew"      , value).paint(); },
    "skewX"      : function(elem, value) { TransformManager.getInstance(elem).set("skewX"     , value).paint(); },
    "skewY"      : function(elem, value) { TransformManager.getInstance(elem).set("skewY"     , value).paint(); },
    "translate"  : function(elem, value) { TransformManager.getInstance(elem).set("translate" , value).paint(); },
    "translateX" : function(elem, value) { TransformManager.getInstance(elem).set("translateX", value).paint(); },
    "translateY" : function(elem, value) { TransformManager.getInstance(elem).set("translateY", value).paint(); },
    "transform"  : function(elem, value) { TransformManager.getInstance(elem).set("transform" , value).paint(); }
  });
  
  // Register CSSTransform getters
  $.extend($.bindings.getter.css, {
    "matrix"     : function(elem) { return TransformManager.getInstance(elem).get("matrix"    ); },
    "rotate"     : function(elem) { return TransformManager.getInstance(elem).get("rotate"    ); },
    "scale"      : function(elem) { return TransformManager.getInstance(elem).get("scale"     ); },
    "scaleX"     : function(elem) { return TransformManager.getInstance(elem).get("scaleX"    ); },
    "scaleY"     : function(elem) { return TransformManager.getInstance(elem).get("scaleY"    ); },
    "skew"       : function(elem) { return TransformManager.getInstance(elem).get("skew"      ); },
    "skewX"      : function(elem) { return TransformManager.getInstance(elem).get("skewX"     ); },
    "skewY"      : function(elem) { return TransformManager.getInstance(elem).get("skewY"     ); },
    "translate"  : function(elem) { return TransformManager.getInstance(elem).get("translate" ); },
    "translateX" : function(elem) { return TransformManager.getInstance(elem).get("translateX"); },
    "translateY" : function(elem) { return TransformManager.getInstance(elem).get("translateY"); },
    "transform"  : function(elem) { return TransformManager.getInstance(elem).get(            ); },
    "multiplied-matrix" : function(elem) { return TransformManager.getInstance(elem).get("multiplied-matrix"); }
  });
  
  // Register CSSTransform animation step callbacks
  $.extend($.fx.step, {
    "matrix"     : function(fx) {},
    "rotate"     : function(fx) { fx.unit = "deg"; TransformManager.getInstance(fx.elem).set(fx.prop, fx.now).paint(); },
    "scale"      : function(fx) { fx.unit = "";    TransformManager.getInstance(fx.elem).set(fx.prop, fx.now).paint(); },
    "scaleX"     : function(fx) { fx.unit = "";    TransformManager.getInstance(fx.elem).set(fx.prop, fx.now).paint(); },
    "scaleY"     : function(fx) { fx.unit = "";    TransformManager.getInstance(fx.elem).set(fx.prop, fx.now).paint(); },
    "skew"       : function(fx) { fx.unit = "deg"; TransformManager.getInstance(fx.elem).set(fx.prop, fx.now).paint(); },
    "skewX"      : function(fx) { fx.unit = "deg"; TransformManager.getInstance(fx.elem).set(fx.prop, fx.now).paint(); },
    "skewY"      : function(fx) { fx.unit = "deg"; TransformManager.getInstance(fx.elem).set(fx.prop, fx.now).paint(); },
    "translate"  : function(fx) { fx.unit = "px";  TransformManager.getInstance(fx.elem).set(fx.prop, fx.now).paint(); },
    "translateX" : function(fx) { fx.unit = "px";  TransformManager.getInstance(fx.elem).set(fx.prop, fx.now).paint(); },
    "translateY" : function(fx) { fx.unit = "px";  TransformManager.getInstance(fx.elem).set(fx.prop, fx.now).paint(); }
  });
  
  
  /* 
  +----------------------------------------------------------------------------+
  |                          Patch jQuery.curCSS                               |
  |                                                                            |
  | Add support for our properties. Checks for presence of user-defined        |
  | handler and use it instead of default (if one was found).                  |
  |                                                                            |
  | Note that $.fn.css uses this method internaly to read CSS properies.       |
  +----------------------------------------------------------------------------+
  */
  var orig_curCSS = jQuery.curCSS;
  jQuery.curCSS = function( elem, name, force )
  {
    var handler = $.bindings.getter.css[name] || null;
    if (handler) {
      return handler(elem);
    }
    return orig_curCSS.apply(jQuery, arguments);
  };
  
  
  /* 
  +----------------------------------------------------------------------------+
  |                            Patch $.fn.css                                  |
  |                                                                            |
  | All further calls to $.fn.css will be proxied through                      |
  | $.bindings.getter.css, or $.bindings.getter.css.                           |
  | If custom handlers are defined there, thew will be invoked. Otherwise the  |
  | original $.fn.css will be used.                                            |
  |                                                                            |
  | This is only modified to handle SET css operations. For getting css        |
  | properties, jQuery.curCSS is patched above.                                |
  |                                                                            |
  | $.bindings is our extensibility entry point, and that's where we can add   |
  | custom handlers.                                                           |
  +----------------------------------------------------------------------------+
  */
  var orig_css = $.fn.css;
  $.fn.css = function( key, value ) 
  {
    // set single style property
    if (typeof key == "string") {
      if (value !== undefined) {
        var handler = $.bindings.setter.css[key] || null;
        if (handler) { 
          return this.each(
            function(i) {
              handler(
                this, 
                $.isFunction(value) ? value(i, $(this).css(key)) : value
              );
            }
          );
        }
      }
    }
    
    // set style from a given css object
    else {
    
      this.each(function(i) {
        var x, handler, value;
        
        // Note that key is an object, passed by refference, so we just 
        // "scan" it, and do not remove custom properties (leave this task
        // to the browser) 
        for ( x in key ) {
          handler = $.bindings.setter.css[x] || null;
          if (handler) { 
            value = key[x];
            
            // since jQuery 1.4
            if ($.isFunction(value)) {
              value = value(i, $(this).css(x));
            }
            
            handler(this, value);
          }
        }
      });
    }
    
    return orig_css.call( this, key, value );
  };
  
  
  /* 
  +----------------------------------------------------------------------------+
  |                       Patch $.fx.prototype.cur                             |
  |                                                                            |
  | If owr custom property is detected - it will be returned as numeric value. |
  | Otherwise the original $.fx.prototype.cur will be used.                    |
  |                                                                            |
  +----------------------------------------------------------------------------+
  */
  var orig_cur = $.fx.prototype.cur;
  $.fx.prototype.cur = function () 
  {
    var handler = $.bindings.getter.css[this.prop] || null;
    if (handler) {
      return parseFloat(handler(this.elem).replace(/^[^\d-\.\+]*/, ""));
    }
    return orig_cur.apply(this, arguments);
  };
  
  // ===========================================================================
  // Ends file: jquery.csstransform_patch.js 
  // ===========================================================================  
  
  // ===========================================================================
  // Starts file: matrix.js 
  // ===========================================================================  
  
  /**
   * Matrix class constructor.
   * This is intensively used and it is important to be as fast, as possible.
   * For this reason, instead of checking each argument, we do accept 6 or 0
   * arguments only. Also the argument validation is omitted, be sure to use 
   * numbers only.
   * 
   * @constructor
   * @param  {Number} a  (Ignored if arguments are less than six)
   * @param  {Number} b  (Ignored if arguments are less than six)
   * @param  {Number} c  (Ignored if arguments are less than six)
   * @param  {Number} d  (Ignored if arguments are less than six)
   * @param  {Number} tx (Ignored if arguments are less than six)
   * @param  {Number} ty (Ignored if arguments are less than six)
   * @return {Matrix} Matrix
   * 
   */
  function Matrix(a, b, c, d, tx, ty)
  {
    /**
     * X scale factor
     * @type Number
     */
    this.a  = 1;
    
    /**
     * Y skew factor
     * @type Number
     */
    this.b  = 0;
    
    /**
     * X skew factor
     * @type Number
     */
    this.c  = 0;
    
    /**
     * Y scale factor
     * @type Number
     */
    this.d  = 1;
    
    /**
     * X translation factor
     * @type Number
     */
    this.tx = 0;
    
    /**
     * Y translation factor
     * @type Number
     */
    this.ty = 0;
    
    if (arguments.length == 6)
    {
      this.a  = a;
      this.b  = b;
      this.c  = c;
      this.d  = d;
      this.tx = tx;
      this.ty = ty;
    }
    
    var transforms = [
      "rotate", 
      "scale", 
      "scaleX", 
      "scaleY", 
      "translate", 
      "translateX", 
      "translateY", 
      "skew", 
      "skewX", 
      "skewY", 
      "matrix"
    ];

    for (var i = 0; i < transforms.length; i++) {
      var fn = transforms[i];
      this[fn] = function() {
        this.multiply(Matrix[fn].apply(Matrix, arguments));
        return this;
      };
    }
  }

  /**
   * Multiply this matrix with another one. This modifies the current matrix.
   *
   * @param {Matrix} m2 - The Matrix, that this will be multiplied by.
   * @return {Matrix} This Matrix object (modified)
   */
  Matrix.prototype.multiply = function(m2)
  {
    var a1  = this.a,
        b1  = this.b,
        c1  = this.c,
        d1  = this.d,
        tx1 = this.tx,
        ty1 = this.ty;
    
    this.a  = a1  * m2.a + b1  * m2.c;
    this.b  = a1  * m2.b + b1  * m2.d;
    this.c  = c1  * m2.a + d1  * m2.c;
    this.d  = c1  * m2.b + d1  * m2.d;
    this.tx = tx1 * m2.a + ty1 * m2.c + m2.tx;
    this.ty = tx1 * m2.b + ty1 * m2.d + m2.ty;
    
    a1 = b1 = c1 = d1 = tx1 = ty1 = null;
    
    return this;
  };

  /**
   * Get a clone of this matrix.
   * 
   * @return {Matrix} New Matrix instance, clone of this one.
   */
  Matrix.prototype.clone = function()
  {
    return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
  };

  /**
   * Returns browser-copatible (css) string representation af the matrix.
   *
   * @return {String}
   */
  Matrix.prototype.toString = function() 
  {
    var units = $.browser.mozilla ? 'px' : '';
    return this.a  + ', '   + 
           this.b  + ', '   + 
           this.c  + ', '   + 
           this.d  + ', '   + 
           this.tx + units + ', ' + 
           this.ty + units;
  };

  /**
   * Returns an array of six elements coresponding to the six matrix values.
   *
   * @return {Array}
   */
  Matrix.prototype.toArray = function() 
  {
    return [this.a, this.b, this.c, this.d, this.tx, this.ty];
  };

  /**
   * Checks if the matrix is an identity matrix.
   * 
   * @return {Boolean} True if identity, false otherwise.
   */
  Matrix.prototype.isIdentity = function() 
  {
    return this.a  === 1 && 
           this.b  === 0 && 
           this.c  === 0 && 
           this.d  === 1 && 
           this.tx === 0 && 
           this.ty === 0;
  };

  /**
   * Returns the inverted version of this Matrix (the one, that if multiplied by
   * this, will couse disabling all transformations)
   * 
   * @return {Matrix}
   */ 
  Matrix.prototype.invert = function() 
  {
    var a  = this.a,
        b  = this.b,
        c  = this.c,
        d  = this.d,
        tx = this.tx,
        ty = this.ty;
    
    this.a  =  d / (a * d - b * c);
    this.b  = -b / (a * d - b * c);
    this.c  = -c / (a * d - b * c);
    this.d  =  a / (a * d - b * c);
    this.tx =  (c * ty - d * tx) / (a * d - b * c);
    this.ty = -(a * ty - b * tx) / (a * d - b * c);
    
    a = b = c = d = tx = ty = null;
    
    return this;
  };

  /**
   * For a given point ({x:X, y:Y}), returns it's new coordinates, after applying
   * this transformation matrix.
   *
   * @return {Object} An object with "x" and "y" properties.
   */
  Matrix.prototype.deltaTransformPoint = function(point)
  {
    return {
      x: point.x * this.a + point.y * this.c + this.tx,
      y: point.x * this.b + point.y * this.d + this.ty
    };
  };

  /**
   * Given the width (w) and height (h) of an object, to be transformed,
   * returns the width and height of the resulting rectangle (in witch
   * the rendered object will fit)
   *
   * @return {Object} An object with "width" and "height" properties.
   */
  Matrix.prototype.getSize = function(w, h)
  {    
    var max = Math.max, min = Math.min;
    var pts = {
      tl : {
        x : this.tx,
        y : this.ty
      },
      tr : {
        x : w * this.a + this.tx,
        y : w * this.b + this.ty
      },
      bl : {
        x : h * this.c + this.tx,
        y : h * this.d + this.ty
      },
      br : {
        x : w * this.a + h * this.c + this.tx,
        y : w * this.b + h * this.d + this.ty
      }
    };
    
    var minW = min(min(pts.tl.x, pts.bl.x), min(pts.tr.x, pts.br.x));
    var maxW = max(max(pts.tl.x, pts.bl.x), max(pts.tr.x, pts.br.x));
    var minH = min(min(pts.tl.y, pts.bl.y), min(pts.tr.y, pts.br.y));
    var maxH = max(max(pts.tl.y, pts.bl.y), max(pts.tr.y, pts.br.y));
    
    var result = {
      width  : Math.abs(minW - w) + maxW - w,
      height : Math.abs(minH - h) + maxH - h
    };
    
    min = max = pts = minW = maxW = minH = maxH = null;
    
    return result;
  };




  // STATIC //////////////////////////////////////////////////////////////////////

  /**
   * Returns new Matrix rotated in degrees.
   * Note: some browsers may ignore anfle of zero, since it produces an identity 
   * matrix. This is not  a correct behavior, that can couse many (hard to debug)
   * problems, so we are replacing 0 with 0.0001.
   *
   * @param  {Number} angle The rotation angle in degrees
   * @return {Matrix}
   */
  Matrix.rotate = function(angle) {
    var rad = (Math.PI/180) * angle;
    rad = rad === 0 ? rad : rad + 0.0001;
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);
    return new Matrix(cos, sin, -sin, cos, 0, 0);
  };

  /**
   * The scale method scales a transform matrix by an qX amount in x 
   * and an qY amount in y. These values are multiplied so a value of 1 
   * represents no scale. 
   * If qY argument is omitted (or is not a number), value of 1 (no scale) is used.
   *
   * @param  {Number} qX The X-scale amount 
   * @param  {Number} qY The Y-scale amount 
   * @return {Matrix}
   */
  Matrix.scale = function(qX, qY) {
    qX = isNumber(qX) ? qX === 0 ? 0.001 : qX : 1;
    qY = isNumber(qY) ? qY === 0 ? 0.001 : qY : qX;
    return new Matrix(qX, 0, 0, qY, 0, 0);
  };

  /**
   * The scale method scales a transform matrix by an q amount in x.
   * Value of 1 represents no scale. 
   *
   * @param  {Number} q The X-scale amount 
   * @return {Matrix}
   */
  Matrix.scaleX = function(q) { 
    q = isNumber(q) ? q === 0 ? 0.001 : q : 1;
    return new Matrix(q, 0, 0, 1, 0, 0);
  };

  /**
   * The scale method scales a transform matrix by an q amount in y.
   * Value of 1 represents no scale. 
   *
   * @param  {Number} q The Y-scale amount 
   * @return {Matrix}
   */
  Matrix.scaleY = function(q) { 
    q = isNumber(q) ? q === 0 ? 0.001 : q : 1;
    return new Matrix(1, 0, 0, q, 0, 0);
  };

  /**
   * The translate method simply moves a transformation by tx and ty. 
   * This process is additive so the tx and ty passed to translate is added on 
   * to any existing value of tx and ty in the matrix. 
   *
   * @param  {Number} x The X-move amount 
   * @param  {Number} y The Y-move amount 
   * @return {Matrix}
   */
  Matrix.translate = function(x, y) {
    return new Matrix(1, 0, 0, 1, isNumber(x) ? x : 0, isNumber(y) ? y : 0);
  };

  /**
   * Moves a transformation by x on X axis.
   *
   * @param  {Number} x The X-move amount 
   * @return {Matrix}
   */
  Matrix.translateX = function(x) { 
    return new Matrix(1, 0, 0, 1, isNumber(x) ? x : 0, 0); 
  };

  /**
   * Moves a transformation by x on Y axis.
   *
   * @param  {Number} x The Y-move amount 
   * @return {Matrix}
   */
   Matrix.translateY = function(x) { 
    return new Matrix(1, 0, 0, 1, 0, isNumber(x) ? x : 0); 
  };

  /**
   * Skews the matrix in given degX and degY angles.
   * If an argument is omitted (or is not a number), 
   * a value of 0 (no skew) is used.
   *
   * @param  {Number} degX Skew X angle in degrees
   * @param  {Number} degY Skew Y angle in degrees
   * @return {Matrix} Matrix
   */
  Matrix.skew = function(degX, degY) {
    degY = isNumber(degY) ? Math.tan(degY * (Math.PI/180)) : 0;
    degX = isNumber(degX) ? Math.tan(degX * (Math.PI/180)) : 0;
    return new Matrix(1, degY, degX, 1, 0, 0);
  };

  /**
   * Skews the matrix horizontally in given deg angle.
   *
   * @param  {Number} deg Skew X angle in degrees
   * @return {Matrix} Matrix
   */
  Matrix.skewX = function(deg) { 
    deg = isNumber(deg) ? Math.tan(deg * (Math.PI/180)) : 0;
    return new Matrix(1, 0, deg, 1, 0, 0); 
  };

  /**
   * Skews the matrix vertically in given deg angle.
   *
   * @param  {Number} deg Skew Y angle in degrees
   * @return {Matrix} Matrix
   */
  Matrix.skewY = function(deg) { 
    deg = isNumber(deg) ? Math.tan(deg * (Math.PI/180)) : 0;
    return new Matrix(1, deg, 0, 1, 0, 0);
  };

  /**
   * Returns new Matrix with the six matrix values applied to it.
   *
   * @param  {Number} a  X scale
   * @param  {Number} b  Y skew
   * @param  {Number} c  X skew
   * @param  {Number} d  Y scale
   * @param  {Number} tx X translation
   * @param  {Number} ty Y translation
   * @return {Matrix} Matrix
   */
  Matrix.matrix = function(a, b, c, d, tx, ty) { 
    return new Matrix(a, b, c, d, tx, ty);
  };


  // helper
  function isNumber(x) {
    return typeof x == "number" || (x && typeof x == "object" && "toFixed" in x);
  }
  
  // ===========================================================================
  // Ends file: matrix.js 
  // ===========================================================================
  
  // ===========================================================================
  // Starts file: transformation.js 
  // ===========================================================================
  
  /**
   * The constructor just creates new Transformation instance, and later 
   * it must be "populated" with value(s), using the init() method.
   *
   * @class Instances of this class represents a single CSSTransform value.
   * For example if we have CSS like "transform: rotate(12deg) skew(5);",
   * it can be represented as a collection of one Transformation for rotate
   * and one for skew.
   * 
   * @constructor 
   * 
   * @param {String} type The transformation type. 
   *                       Must be one of matrix, rotate, scale, scaleX, scaleY, 
   *                       skew, skewX, skewY, translate, translateX, translateY.
   *
   * @throws {InvalidType} If type is not acceptable.
   *
   * @todo: Autodetect more than one arguments and invoke init(), if so...
   * @todo: This class can be written with no jQuery dependency
   */ 
  function Transformation(type)
  {
    /**
     * List of supported transformation functions and their units.
     * NOTE: 
     * Modifying this object can change the constructor behavior (make it
     * accept, or not) given transformation function.
     */
    this.units  = {
      "matrix"     : "",
      "rotate"     : "deg",
      "scale"      : "",
      "scaleX"     : "",
      "scaleY"     : "",
      "skew"       : "deg",
      "skewX"      : "deg",
      "skewY"      : "deg",
      "translate"  : "px",
      "translateX" : "px",
      "translateY" : "px"
    };
    
    if (!type || !(type in this.units))
    {
      throw 'Invalid transformation type "' + type + '"';
    }
    
    /**
     * The CSSTransform function name.
     * 
     * @type String
     */
    this.type = type;
    
    /**
     * The matrix representation of the CSSTransform function.
     *
     * @type Matrix
     */
    this.matrix = new Matrix();
    
    /**
     * Holds the current CSSTransform function arguments.
     *
     * @type Array
     */
    this.args   = [];
    
  }

  Transformation.prototype = {
    
    /**
     * Returns the String (CSS) representation of the Transformation.
     *
     * @return {String} CSS property value fragment.
     */
    toString : function()
    {
      return this.type + ( 
        this.type == "matrix" 
        ? "(" + this.matrix.toString()  + ")"
        : "(" + this.args.join(this.units[this.type] + ", ") + this.units[this.type] + ")"
      );
    },
    
    /**
     * Validates and applies one or more arguments to the transformation.
     * Also updates the matrix representation to match the current state.
     *
     * @return {Transformation} Returns this object
     */
    init : function()
    {
      var args = arguments.length == 1 && arguments[0] && arguments[0].push
        ? arguments[0]
        : arguments;
      this.args = jQuery.map(
        args,
        function(arg, i) {
          arg = parseFloat(arg);
          return isNaN(arg) ? null : arg;
        }
      );
      
      this.matrix = Matrix[this.type].apply(Matrix, this.args);
      
      return this;
    }
  };
  
  // ===========================================================================
  // Ends file: transformation.js 
  // ===========================================================================
  
  // ===========================================================================
  // Starts file: transform_manager.js 
  // ===========================================================================
  
  /**
   * Class TransformManager
   *
   * @class TransformManager instances are intended to manage it's own collection
   * of css transform functions. As each browser handles CSS transform 
   * differently (and some does not support it at all), the only way to 
   * have fully functional transforms is to have our own manager for it.
   * <p>
   * TransformManager instance is "dedicated" to a single DOM Element (the
   * one, that will be transformed).
   * </p>
   *
   * @constructor
   * @param {DOMElement} element The element to be transformed
   * @TODO: Add support for multi-argument functions
   * @TODO: Add support for priority order...
   */
  function TransformManager(element) 
  {
    /**
     * Array of Transformation instances, representing the current state (style)
     *
     * @type Array
     */
    this._stack = [];
    
    /**
     * Maps named keys to keys at this._stack.
     *
     * @type Array
     */
    this._stackIndex = {};
    
    /**
     * The element, that this TransformManager is dedecated (and attached) to
     *
     * @type DOMElement
     */
    this.element = element || null;
    
  }

  /**
   * A map of css transform function names and their default arguments (as string).
   * Note that matrix differs in Gecko (translation units are rquired).
   *
   * @type Object
   */
  TransformManager.prototype._defaultValues = {
    "matrix"     : $.browser.mozilla ? [1, 0, 0, 1, "0px", "0px"] : [1, 0, 0, 1, 0, 0],
    "rotate"     : ["0deg"],
    "scale"      : [1, 1],
    "scaleX"     : [1],
    "scaleY"     : [1],
    "skew"       : ["0deg", "0deg"],
    "skewX"      : ["0deg"],
    "skewY"      : ["0deg"],
    "translate"  : ["0px", "0px"],
    "translateX" : ["0px"],
    "translateY" : ["0px"]
  };
    
  /**
   * Clears the current state 
   *
   * @return {TransformManager} Returns "this" object to allow chainable usage
   */
  TransformManager.prototype.empty = function()
  {
    this._stack = [];
    this._stackIndex = {};
    return this;
  };

  /**
   * Check if there are any transformation at the current state
   *
   * @return {Boolean}
   */
  TransformManager.prototype.isEmpty = function()
  {
    return this._stack.length === 0;
  };

  /**
   * Gets the CSSProperty value for the given type.
   * If no such transformation is currently applied, it returns it's identity
   * equivalent. For example if there is no rotation applied, calling 
   * get("rotate") will return "rotate(0deg)".
   * 
   * Estension: Use "transform" (or call it with no arguments) to get 
   * the entire CSSTransform string (no mather of the browser).
   * 
   * Estension: Use "multiplied-matrix" to get the current multiplied 
   * matrix (the result of "merging" all the current transforms into 
   * one single Matrix).
   *
   * @return {String} The CSS transformation value
   */
  TransformManager.prototype.get = function(type)
  {
    if ( !type || type == "transform" ) {
      return this.toString();
    }
    
    if ( type == "multiplied-matrix" ) {
      return "matrix(" + this.getMatrix().toString() + ")";
    }
    
    if ( this._stackIndex[type] !== undefined ) {
      return this._stack[this._stackIndex[type]].toString();
    }
    
    return type + "(" + this._defaultValues[type].join(", ") + ")";
  };

  /**
   * Returns the string (CSS) representation of the current transformations
   * stack.
   * @return {String} 
   */
  TransformManager.prototype.toString = function()
  {
    var str = [];
    for (var i = 0; i < this._stack.length; i++) {
      str.push(this._stack[i].toString());
    }
    return str.join(" ") || "none";
  };

  /**
   * Returns the current multiplied 
   * matrix (the result of "merging" all the current transforms into 
   * one single Matrix).
   *
   * @return {Matrix} The multiplied matrix
   */
  TransformManager.prototype.getMatrix = function() 
  {
    var m = new Matrix();
    for (var i = 0; i < this._stack.length; i++) {
      m = this._stack[i].matrix.clone().multiply(m);
    }
    return m;
  };

  /**
   * Returns the entire CSSTransform string.
   *
   * @return {String} CSSTransform
   */
  TransformManager.prototype.getCSS = function() 
  {
    return this.toString();
  };

  /**
   * Parse a CSS string and insert it's (valid) entries to the stack.
   * NOTE: This method always resets (empty) the current stack,
   * before inserting new transformations, so calling it with empty or invalid 
   * argument will "turn off" all transformations.
   * Invalid css function names are skipped. CSS function arguments does not 
   * need to be strictly formatted (to contain units).
   *
   * @return {TransformManager} This object
   */ 
  TransformManager.prototype.setCSS = function(css)
  {
    this.empty(); // setCSS replaces the current state!
    var reg = /^(\w+)\(([\d\w,-\.]+)$/i;
    var data = String(css || "");
    if (data && data != "none") {
      data = data.replace(/\s+/g, '').split(")");// split to function calls
      if (data.length > 0) {
        var match, fn, args, tmp, tmp2;
        for (var i = 0; i < data.length; i++) {
          if (!data[i]) {
            continue;
          }
          match = reg.exec(data[i]);
          if (match) {
            fn = match[1];
            if (specialProps[fn]) {
              this.set(fn, match[2]);
            }
          }
        }
      }
    }
    return this;
  };

  /**
   * @return {TransformManager} This object
   */
  TransformManager.prototype.set = function(type, value)
  {
    if ( type ) {
      if (type == "transform") {
        this.setCSS(value);
      }
      else {
        if (type != "none") {
          
          // prepare arguments as array
          var args = $.isArray(value) 
            ? value 
            : typeof value == "string"
              ? value.split(/,/)
              : [value];
          
          var manager = this;
          
          args = jQuery.map(
            args,
            function(arg, i) {
              
              // if transformation type does not exist - inser new identity
              if (manager._stackIndex[type] === undefined) {
                var t = new Transformation(type);
                t.init.apply(t, manager._defaultValues[type]);
                manager._stackIndex[type] = manager._stack.push(t) - 1;
              }
              
              // calculate the current value
              var _current = parseFloat(
                manager._stack[manager._stackIndex[type]].args[i]
              );
              
              // trim current arg
              arg = $.trim(arg.toString());
              
              // test for relative expressions
              var m = arg.replace(/\s/g, "").match(/^(([\+-]=)?(-?\d+(\.\d+)?))(.+)?$/);
              if (m) {   
                if (m[3]) {
                  arg = parseFloat(m[3]);
                }
                
                if (m[2]) {
                  switch (m[2]) {
                    case '+=': 
                      arg = _current + arg;
                    break;
                    case '-=': 
                      arg = _current - arg;
                    break;
                  }
                }
              }
              
              return isNaN(arg) ? null : arg;
            }
          );
          
          var trasformation = this._stack[this._stackIndex[type]];
          trasformation.init.apply(trasformation, args);
        }
      }
    }
    
    return this;
  };

  /**
   * Commit the current state to be rendered by the browser.
   *
   * @return {TransformManager} Returns "this" object to allow chainable usage.
   */
  TransformManager.prototype.paint = function()
  {
    this.element.style[
      TransformManager.getCssTransformPropertyName()
    ] = this.getCSS();
    return this;
  };

  // STATIC ----------------------------------------------------------------------

  /**
   * Returns the ransform CSS property name supported by the current browser.
   * If none is supported, returns empty string (IE and older browsers).
   * 
   * @return {String} The ransform CSS property name,
   *                  as supported by the current browser.
   */
  TransformManager.getCssTransformPropertyName = function()
  {
    var s = $("body")[0].style, result = "", name, p, vendorPrefixes = {
      "Moz"    : 1,
      "Webkit" : 1,
      "O"      : 1,
      "Khtml"  : 1,
      "Ms"     : 1
    };
    
    for (p in vendorPrefixes) {
      
      do {
        name = "transform";
        if (s[name] !== undefined) {
          result = name;
          break;
        }
        
        name = p + "Transform";
        if (s[name] !== undefined) {
          result = name;
          break;
        }
        
        name = p.toLowerCase() + "Transform";
        if (s[name] !== undefined) {
          result = name;
          break;
        }
        
        name = "-" + p.toLowerCase() + "-transform";
        if (s[name] !== undefined) {
          result = name;
          break;
        }
        
      } while (false);
    }
    
    // self override for faster further calls
    TransformManager.getCssTransformPropertyName = function() 
    {
      return result;
    };
    
    return result;
  };

  /**
   * Creates and returns an instance of TransformManager, or it's specialized
   * subclasses if needed.
   *
   * @return {TransformManager} Returns an instance of TransformManager, 
   *                            CanvasTransformManager or IETransformManager
   */
  TransformManager.factory = function(element)
  {
    var transform = TransformManager.getCssTransformPropertyName();
    
    // Non-standart (IE or canvas)
    if (!transform) {
      if (TransformManager.isCanvasSupported()) {
        return new CanvasTransformManager(element);
      }
      
      else if (TransformManager.isFilterSupported()) {
        return new IETransformManager(element);
      }
    }
    
    // unsupported goes here too! They will use 
    // element.style[""] = csstransform value
    return new TransformManager(element);
  };

  /**
   * Creates and returns an instance of TransformManager, or it's specialized
   * subclasses if needed. Works like factory, but attaches the instance to the 
   * element and reuses reuses it later.
   *
   * @return {TransformManager} Returns an instance of TransformManager, 
   *                            CanvasTransformManager or IETransformManager
   */
  TransformManager.getInstance = function(element)
  {
    if (!element.transformManager) {
      element.transformManager = TransformManager.factory(element);
    }
    return element.transformManager;
  };

  /**
   * Check if the browser supports Canvas
   *
   * @return {Boolean}
   */
  TransformManager.isCanvasSupported = function()
  {
    var result = typeof document.createElement("canvas").getContext == "function";
    TransformManager.isCanvasSupported = function() { 
      return result; 
    };
    return result;
  };

  /**
   * Check if the browser supports filters (IE)
   *
   * @return {Boolean}
   */
  TransformManager.isFilterSupported = function()
  {
    var f = document.getElementsByTagName("body")[0].filters;
    var result = f && typeof f == "object" && !window.opera;
    TransformManager.isFilterSupported = function() { 
      return result; 
    };
    return result;
  };

  // ===========================================================================
  // Ends file: transform_manager.js 
  // ===========================================================================
  
  // ===========================================================================
  // Starts file: ie_transform_manager.js 
  // ===========================================================================
  
  /**
   * @class This is a subclass of TransformManager, implementing IE specific 
   * methods to render CSS Transformations, using ActiveX filters.
   *
   * @constructor
   * @param {DOMElement} element The element to be transformed
   * @overrides TransformManager.prototype.paint
   * @version 1.1.0
   */
  function IETransformManager(element) 
  {
    /**
     * The element, that this TransformManager is dedecated to
     *
     * @type DOMElement
     */
    this.element = element || null;
    
    /**
     * A backup of the style properties, that was modified
     *
     * @type Object|null
     */
    this.origStyle = null;

    /**
     * Additional information about the initial state of the element is stored here.
     *
     * @type Object
     */
    this.origState = {};

    /**
     * A reference to the wrapper node (if any)
     *
     * @type jQuery|null
     */
    this.wrapper = null;
    
    /**
     * Array of Transformation instances, representing the current state (style)
     *
     * @type Array
     */
    this._stack = [];
    
    /**
     * Maps named keys to keys at this._stack.
     *
     * @type Array
     */
    this._stackIndex = {};
  }

  IETransformManager.prototype = new TransformManager();

  /**
   * Override the baseClass paint() method.
   * Commit the current state to be rendered by the browser. This involves 
   * invoking custom functions for IE Filters implementation.
   *
   * @return {IETransformManager} Returns "this" object to allow chainable usage.
   */
  IETransformManager.prototype.paint = function()
  {
    if (!this.origStyle) {
      this.initTransform();
    }
    
    var M = this.getMatrix();
    
    // turn transform off?
    if ( M.isIdentity() ) {
      this.uninitTransform();
    }
    else {
      // clip huge dimensions with skew 90, 180...
      var diff = Math.abs( M.b - M.c );
      if ( diff > 100 ) {
        M.b *= diff / 100;
      }
      
      this.element.style.filter = " progid:DXImageTransform.Microsoft.Matrix(" 
      + "M11=" + M.a  + ","
      + "M12=" + M.c  + ","
      + "M21=" + M.b  + ","
      + "M22=" + M.d  + ","
      //+ "Dx="  + M.tx + "," // MSDN: This property is ignored if the SizingMethod is set to auto expand.
      //+ "Dy="  + M.ty + "," // MSDN: This property is ignored if the SizingMethod is set to auto expand.
      + "sizingMethod='auto expand'," 
      + "FilterType='nearest neighbor') "
      + String(this.element.style.filter || "").replace(
        /(progid:DXImageTransform\.Microsoft\.)?Matrix\s*\([^\)]*\)\s*/gi, 
        "" 
      );
      
      this.element.style.top  = (
        (this.origState.height - $(this.element).height()) / 2
      ) + M.ty + this.origState.top  + 'px';
      
      this.element.style.left = (
        (this.origState.width  - $(this.element).width() ) / 2
      ) + M.tx + this.origState.left + 'px';
    }
    
    return this;
  };

  /**
   * This method prepares the element for transformation, witch may include
   * wraping it, modifying it's style and so on.
   * This method is automatically called from paint(), if needed.
   */
  IETransformManager.prototype.initTransform = function()
  {
    var obj = $(this.element);
    var manager = this;
    
    function storeCss()
    {
      if (!manager.origStyle) {
        manager.origStyle = {};
      }
      
      for (var i = 0; i < arguments.length; i++) {
        manager.origStyle[arguments[i]] = obj.css(arguments[i]);
      }
    }
    
    function getCssFloat()
    {
      var cssFloat = obj.css("float");
      if (cssFloat == "none") {
        cssFloat = obj.attr("align");
      }
      
      if (cssFloat != "left" &&  cssFloat != "right") {
        cssFloat = "none";
      }
      return cssFloat;
    }
    
    this.origState = {
      width      : obj.width(),
      height     : obj.height(),
      top        : 0,
      left       : 0
    };
    
    switch (obj.css("position"))
    {
      case "absolute":
        
        // we need to store top/left values
        this.origState.top  = obj.position().top;
        this.origState.left = obj.position().left;
        
        // fix to exactly specified position
        storeCss("width", "height", "top", "left");
        obj.css({
          width  : this.origState.width,
          height : this.origState.height,
          top    : this.origState.top,
          left   : this.origState.left
        });
        
        break;
        
      case "fixed":
        
        // we need to store top/left values
        this.origState.top  = obj.offset().top;
        this.origState.left = obj.offset().left;
        
        // fix to exactly specified position
        storeCss("width", "height", "top", "left");
        obj.css({
          width  : this.origState.width,
          height : this.origState.height,
          top    : this.origState.top,
          left   : this.origState.left
        });
        
        break;
        
      case "relative":
        
        // we need to store top/left values
        this.origState.top  = parseFloat(obj.css("top" ));
        this.origState.left = parseFloat(obj.css("left"));
        if (isNaN(this.origState.top)) { // auto
          this.origState.top = 0;
        }
        if (isNaN(this.origState.left)) { // auto
          this.origState.left = 0;
        }
        
        // fix to exactly specified position and make it absolute
        storeCss("width", "height", "top", "left", "position");
        obj.css({
          width    : this.origState.width,
          height   : this.origState.height,
          top      : this.origState.top,
          left     : this.origState.left,
          position : "absolute"
        });
        
        // Create wrapper and wrap the element
        if (!this.wrapper) {
          obj.wrap('<span class="dmx-filter-transform-wrapper" />');
          this.wrapper = obj.parent().css({
            display  : obj.css("display") == "block" ? "block" : "inline-block",
            position : "relative",
            "float"  : getCssFloat(),
            width    : obj.outerWidth ({ margin : true }),
            height   : obj.outerHeight({ margin : true })
          });
        }
        
        break;
        
      default: // static
        
        // we need to store top/left values
        this.origState.top  = 0; // ignored for static
        this.origState.left = 0; // ignored for static
        storeCss("width", "height", "top", "left", "position");
        obj.css({
          width    : this.origState.width,
          height   : this.origState.height,
          top      : this.origState.top,  // ignored for static
          left     : this.origState.left, // ignored for static
          position : "absolute"
        });
        
        // Create wrapper and wrap the element
        if (!this.wrapper) {
          obj.wrap('<span class="dmx-filter-transform-wrapper" />');
          this.wrapper = obj.parent().css({
            display  : obj.css("display") == "block" ? "block" : "inline-block",
            position : "relative",
            "float"  : getCssFloat(),
            width    : obj.outerWidth ({ margin : true }),
            height   : obj.outerHeight({ margin : true })
          });
        }
        break;
    }
  };

  /**
   * Clears the origState, removes the wrapper (if any), 
   * restores the original style and disables the Matrix filter.
   * This method is automatically called from paint(), if needed 
   * (if transformation equals to identity matrix). 
   */
  IETransformManager.prototype.uninitTransform = function()
  {
    //function removeMatrixFilter(element)
    //{
    //  if (element.filters.length > 0) {
    //    element.style.filter = element.style.filter.replace(
    //      /\s*(progid:DXImageTransform\.Microsoft\.)?Matrix\s*\([^\)]*\)/gi, ''
    //    );
    //  }
    //}
    
    this.origState = {};
    
    // restore style
    if (this.origStyle) { 
      $(this.element).css(this.origStyle);
      this.origStyle = null;
    }
    
    // unwrap
    if (this.wrapper) { 
      this.wrapper.before($(this.element));
      this.wrapper.remove();
      this.wrapper = null;
    }
    
    // disable filter
    //if (this.filter) { 
      //this.filter.enabled = false;
    //  removeMatrixFilter(this.element);
      //this.filter = null;
    //}
  };
  
  // ===========================================================================
  // Ends file: ie_transform_manager.js 
  // ===========================================================================
  
  // ===========================================================================
  // Starts file: canvas_transform_manager.js 
  // ===========================================================================
  
  /**
   * @class This is a subclass of TransformManager, implementing specific 
   * methods to render CSS Transformations, using Canvas (images only!).
   *
   * @constructor
   * @param {DOMElement} element The element(image) to be transformed
   * @overrides TransformManager.prototype.paint
   * @version 1.1.0
   */
  function CanvasTransformManager(element) 
  {
    /**
     * The element, that this TransformManager is dedecated to
     *
     * @type DOMElement
     */
    this.element = element || null;
    
    /**
     * Reference to the canvas node (jQuery)
     *
     * @type jQuery
     */
    this.canvas = null;

    /**
     * Reference to the canvas drawing context
     *
     * @type Object
     */
    this.canvasContext = null;

    /**
     * A backup of the style properties, that was modified
     *
     * @type Object|null
     */
    this.origStyle = null;

    /**
     * Additional information about the initial state of the element is stored here.
     *
     * @type Object
     */
    this.origState = {};

    /**
     * A reference to the wrapper node (if any)
     *
     * @type jQuery|null
     */
    this.wrapper = null;
    
    /**
     * Array of Transformation instances, representing the current state (style)
     *
     * @type Array
     */
    this._stack = [];
    
    /**
     * Maps named keys to keys at this._stack.
     *
     * @type Array
     */
    this._stackIndex = {};

  }

  CanvasTransformManager.prototype = new TransformManager();

  /**
   * Override the baseClass paint() method.
   * Commit the current state to be rendered by the browser. This involves 
   * invoking custom functions for IE Filters implementation.
   *
   * @return {CanvasTransformManager} Returns "this" object to allow chainable usage.
   */
  CanvasTransformManager.prototype.paint = function()
  {
    var $img = $(this.element);
    
    // Only images
    if ($img.is("img")) {
      
      var m = this.getMatrix();
      
      if (m.isIdentity()) {
        this.uninitTransform();
      }
      
      else {
        
        if (!this.origStyle) {
          this.initTransform();
        }
        
        var w = this.origState.imageWidth;
        var h = this.origState.imageHeight;
        
        // Canvas needs to be dynamically resized and moved to fit the new content
        //this.canvasContext.clearRect(0, 0, this.canvas[0].width, this.canvas[0].height);
        var size = m.getSize(w, h);
        
        // The browser usualy can not draw such huge areas on canvas...
        if (size.width < 10000 && size.height < 10000) {
          
          var alpha = parseFloat($img.css("opacity"));
          if (alpha < 1) {
            this.canvas.css("opacity", alpha);
          }
          alpha = null;
          
          if (size.width == this.canvas[0].width && size.height == this.canvas[0].height) {
            this.canvasContext.clearRect(0, 0, this.canvas[0].width, this.canvas[0].height);
          }
          else {
            this.canvas
            .attr('width' , Math.max(size.width , 1))
            .attr('height', Math.max(size.height, 1))
            .css({
              left: this.origState.left + m.tx - (size.width  - w)/2, 
              top : this.origState.top  + m.ty - (size.height - h)/2
            });
          }
          //this.canvasContext.save();
          //this.canvasContext.translate(data.canvas[0].width/2, data.canvas[0].height/2); 
          this.canvasContext.setTransform(
            m.a, m.b, m.c, m.d, this.canvas[0].width/2, this.canvas[0].height/2
          );
          this.canvasContext.drawImage(this.element, -w/2, -h/2, w, h);
          //this.canvasContext.translate(-data.canvas[0].width/2, -data.canvas[0].height/2); 
          //this.canvasContext.restore();
        }
        w = h = size = null;
        
      }
      m = null;
    }
    
    return this;
  };

  /**
   * Called once on the first transformation. 
   * Wraps the image and modities its style as needed
   */
  CanvasTransformManager.prototype.initTransform = function() 
  { 
    var manager = this;
    var $img = $(this.element);
    
    this.origState = {
      imageWidth  : $img.width(),
      imageHeight : $img.height(),
      top         : 0,
      left        : 0
    };
    
    this.origStyle = {
      visibility : $img.css("visibility"),
      position   : $img.css("position"),
      zIndex     : $img.css("zIndex")
    };
    
    var WRAPPER_STYLE = {
      display : "inline-block"
    };
    
    var CANVAS_STYLE  = {
      position : "absolute",
      opacity  : $img.css("opacity")
    };
    
    function wrap(wrapperCss, canvasCss) 
    {
      // Create canvas
      var canvas = $(
        '<canvas width="' + manager.origState.imageWidth + 
        '" height="' + manager.origState.imageHeight + '" />'
      );
      
      canvas.css($.extend({}, CANVAS_STYLE, canvasCss));
      
      manager.canvas = canvas;
      manager.canvasContext = canvas[0].getContext('2d');
      
      // Create wrapper
      $img.wrap('<span class="dmx-canvas-transform-wrapper" />');
      manager.wrapper = $img.parent().css($.extend({}, WRAPPER_STYLE, wrapperCss));
      
      // Hide image
      $img.css({ 
        position   : "absolute", 
        zIndex     : -1, 
        visibility : "hidden" 
      }).after(manager.canvas);
      
      // proxy evets to the image
      jQuery.each( ("blur,focus,load,resize,scroll,unload,click,dblclick," +
        "mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave," +
        "select,keydown,keypress,keyup,error").split(","), function(i, name) {
        
        manager.canvas.bind(name, function(e) {
          $img.trigger(name);
        });
      });
    }
    
    function numCss($el, prop, defaultValue) 
    {
      var result = parseFloat($el.css(prop));
      if (isNaN(result)) {
        result = defaultValue || 0;
      }
      return result;
    }
    
    function getCssFloat()
    {
      var cssFloat = $img.css("float");
      if (cssFloat == "none") {
        cssFloat = $img.attr("align");
      }
      
      if (cssFloat != "left" &&  cssFloat != "right") {
        cssFloat = "none";
      }
      return cssFloat;
    }
    
    var pt = numCss($img, "paddingTop");
    var pl = numCss($img, "paddingLeft");
    var bt = numCss($img, "borderTopWidth");
    var bl = numCss($img, "borderLeftWidth");
    
    switch ($img.css("position"))
    {
      case "absolute":
        wrap({
          position : "absolute",
          width    : this.origState.width,
          height   : this.origState.height,
          top      : $img.position().top  + pt + bt,
          left     : $img.position().left + pl + bl
        },
        {
          margin  : $img.css("margin")
        });
      break;
      
      case "fixed":
        wrap({
          position : "fixed",
          width    : this.origState.imageWidth,
          height   : this.origState.imageHeight,
          top      : $img.offset().top  + pt + bt,
          left     : $img.offset().left + pl + bl
        });
      break;
        
      case "relative":
        
        var top  = parseFloat($img[0].style.top );
        var left = parseFloat($img[0].style.left);
        
        if (isNaN(top)) {
          top = 0;
        }
        
        if (isNaN(left)) {
          left = 0;
        }
        
        this.origState.top  = top  + pt + bt;
        this.origState.left = left + pl + bl;
        
        wrap({
          display  : "inline-block",
          position : "relative",
          "float"  : getCssFloat(),
          width    : $img.outerWidth ({ margin : true }),
          height   : $img.outerHeight({ margin : true })
        }, 
        {
          margin : $img.css("margin")
        });
        top = left = null;
        
      break;
      
      default: // static
        
        this.origState.top  = pt + bt;
        this.origState.left = pl + bl;
        
        wrap({
          display  : "inline-block",
          position : "relative",
          "float"  : getCssFloat(),
          width    : $img.outerWidth ({ margin : true }),
          height   : $img.outerHeight({ margin : true })
        },
        {
          margin : $img.css("margin"),
          top    : pt + bt,
          left   : pl + bl
        });
        
      break;
    }
    pt = pl = bt = bl = null;
  };

  /**
   * Called once to reset transformation. 
   * Unwraps the image and restores its style as needed
   */
  CanvasTransformManager.prototype.uninitTransform = function() 
  {
    if (this.origStyle) {
      var $img = $(this.element);
      $img.css(this.origStyle);
      this.origStyle = null;
      this.canvas.unbind();
      this.wrapper.before($img);
      this.wrapper.remove();
    }
  };


  
  // ===========================================================================
  // Ends file: canvas_transform_manager.js 
  // ===========================================================================
  
})(jQuery);
