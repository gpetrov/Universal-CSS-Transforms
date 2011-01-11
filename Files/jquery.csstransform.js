/**
 * jQuery.csstransform
 * 
 * version 1.4
 */
(function($) {
  
  var TRANSFORM_PROPS = {
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
    "translateY" : "px",
    "transform"  : ""
  };
  
  $.versionCompare = function(x) {
    var tmp = String(x).split("."), cur = $.prototype.jquery.split(".");
    for ( var i = 0; i < Math.max(cur.length, tmp.length); i++ ) {
      if ( tmp[i] === undefined ) {
        tmp[i] = 0;
      }
      if ( cur[i] === undefined ) {
        cur[i] = 0;
      }
      if ( parseFloat(tmp[i]) > parseFloat(cur[i]) ) {
        return 1;
      }
      if ( parseFloat(tmp[i]) < parseFloat(cur[i]) ) {
        return -1;
      }
    }
    return 0;
  };
  
  // greather or equal then
  $.versionGTE = function(x) {
    return $.versionCompare(x) <= 0;
  };
  
  // less or equal then
  $.versionLTE = function(x) {
    return $.versionCompare(x) >= 0;
  };
  
  var div = document.createElement("div");
  $.support.transform = div.style.transform !== undefined
  ? "transform"
  : div.style["-ms-transform"] !== undefined
    ? "-ms-transform" 
    : div.style.MozTransform !== undefined
      ? "MozTransform"
      : div.style.WebkitTransform !== undefined
        ? "WebkitTransform"
        : div.style.OTransform !== undefined
          ? "OTransform"
          : div.style.KhtmlTransform !== undefined
            ? "KhtmlTransform"
            : false;
  
  //console.log(div.style["-ms-transform"], $.support.transform)
  if (!$.cssHooks) { // jQuery < 1.4.3
    $.cssHooks = {};
  }
  
  $.cssHooks.multipliedMatrix = {
    get : function( elem, computed) {
      return TransformManager.getInstance( elem ).get( "multipliedMatrix" );
    }
  };
  
  $.each(TRANSFORM_PROPS, function(name, unit) {
    $.cssHooks[name] = {
      set : function( elem, value ) {
        TransformManager.getInstance( elem ).set( name, value ).paint();
      },
      get : function( elem, computed) {
        return TransformManager.getInstance( elem ).get( name );
      }
    };
  
    if (name != "matrix") {
      $.fx.step[name] = function(fx) {
        fx.unit = unit;
        TransformManager.getInstance(fx.elem).set(name, fx.now).paint();
      };
    }
  });
  
  
  
  if ($.versionLTE("1.4.2")) {  
    /* 
    +--------------------------------------------------------------------------+
    |                          Patch jQuery.curCSS                             |
    |                                                                          |
    | Add support for our properties. Checks for presence of user-defined      |
    | handler and use it instead of default (if one was found).                |
    |                                                                          |
    | Note that $.fn.css uses this method internaly to read CSS properies.     |
    +--------------------------------------------------------------------------+
    */
    var orig_curCSS = jQuery.curCSS;
    jQuery.curCSS = function( elem, name, force )
    {
      var handler = $.cssHooks[name]
      ? $.cssHooks[name].get
      : null;
      if (name in TRANSFORM_PROPS && handler) {
        return handler(elem);
      }
      return orig_curCSS.apply(jQuery, arguments);
    };
  
    
    /* 
    +--------------------------------------------------------------------------+
    |                            Patch $.fn.css                                |
    |                                                                          |
    | All further calls to $.fn.css will be proxied through                    |
    | $.bindings.getter.css, or $.bindings.getter.css.                         |
    | If custom handlers are defined there, thew will be invoked. Otherwise the|
    | original $.fn.css will be used.                                          |
    |                                                                          |
    | This is only modified to handle SET css operations. For getting css      |
    | properties, jQuery.curCSS is patched above.                              |
    |                                                                          |
    | $.bindings is our extensibility entry point, and that's where we can add |
    | custom handlers.                                                         |
    +--------------------------------------------------------------------------+
    */
    var orig_css = $.fn.css;
    $.fn.css = function( key, value ) 
    {
      // set single style property
      if (typeof key == "string") {
        if (value !== undefined) {
          var handler = $.cssHooks[key]
          ? $.cssHooks[key].set
          : null;
          if (key in TRANSFORM_PROPS && handler) { 
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
            handler = $.cssHooks[x] 
            ? $.cssHooks[x].set
            : null;
            if (x in TRANSFORM_PROPS && handler) { 
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
      
      return orig_css.apply( this, arguments );
    };
  }
  
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
    var handler = $.cssHooks[this.prop]
      ? $.cssHooks[this.prop].get
      : null;
    if (this.prop in TRANSFORM_PROPS && handler) {
      return parseFloat(String(handler(this.elem)).replace(/^[^\d-\.\+]*/, ""));
    }
    return orig_cur.apply(this, arguments);
  };
    
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
    if (arguments.length == 6)
    {
      this.a  = a;
      this.b  = b;
      this.c  = c;
      this.d  = d;
      this.tx = tx;
      this.ty = ty;
    }
  }
  
  Matrix.prototype = {
    /**
     * X scale factor
     * @type Number
     */
    a : 1,
    
    /**
     * Y skew factor
     * @type Number
     */
    b : 0,
    
    /**
     * X skew factor
     * @type Number
     */
    c : 0,
    
    /**
     * Y scale factor
     * @type Number
     */
    d : 1,
    
    /**
     * X translation factor
     * @type Number
     */
    tx : 0,
    
    /**
     * Y translation factor
     * @type Number
     */
    ty : 0
  };
  
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
   * Returns browser-copatible (css) string representation af the matrix.
   *
   * @return {String}
   */
  Matrix.prototype.toString = $.browser.mozilla 
  ? function() 
    {
      return this.a  + ', '   + 
             this.b  + ', '   + 
             this.c  + ', '   + 
             this.d  + ', '   + 
             this.tx + 'px, ' + 
             this.ty + 'px';
    }
  : function() 
    {
      return this.a  + ', ' + 
             this.b  + ', ' + 
             this.c  + ', ' + 
             this.d  + ', ' + 
             this.tx + ', ' + 
             this.ty;
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
  
  // STATIC ////////////////////////////////////////////////////////////////////

  /**
   * Returns new Matrix rotated in degrees.
   * Note: some browsers may ignore angle of zero, since it produces an identity 
   * matrix. This is not  a correct behavior, that can couse many (hard to debug)
   * problems, so we are replacing 0 with 0.0001.
   *
   * @param  {Number} angle The rotation angle in degrees
   * @return {Matrix}
   */
  Matrix.rotate = function(angle) {
    var rad = (Math.PI/180) * toNumber(angle);
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
    qX = toNumber(qX, 1 );
    qY = toNumber(qY, qX);
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
    return new Matrix(toNumber(q, 1), 0, 0, 1, 0, 0);
  };

  /**
   * The scale method scales a transform matrix by an q amount in y.
   * Value of 1 represents no scale. 
   *
   * @param  {Number} q The Y-scale amount 
   * @return {Matrix}
   */
  Matrix.scaleY = function(q) { 
    return new Matrix(1, 0, 0, toNumber(q, 1), 0, 0);
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
    return new Matrix(1, 0, 0, 1, toNumber(x), toNumber(y));
  };

  /**
   * Moves a transformation by x on X axis.
   *
   * @param  {Number} x The X-move amount 
   * @return {Matrix}
   */
  Matrix.translateX = function(x) { 
    return new Matrix(1, 0, 0, 1, toNumber(x), 0); 
  };

  /**
   * Moves a transformation by x on Y axis.
   *
   * @param  {Number} x The Y-move amount 
   * @return {Matrix}
   */
  Matrix.translateY = function(x) { 
    return new Matrix(1, 0, 0, 1, 0, toNumber(x)); 
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
    return new Matrix(
      1, 
      Math.tan(toNumber(degY) * (Math.PI/180)), 
      Math.tan(toNumber(degX) * (Math.PI/180)), 
      1, 
      0, 
      0
    );
  };

  /**
   * Skews the matrix horizontally in given deg angle.
   *
   * @param  {Number} deg Skew X angle in degrees
   * @return {Matrix} Matrix
   */
  Matrix.skewX = function(deg) { 
    return new Matrix(1, 0, Math.tan(toNumber(deg) * (Math.PI/180)), 1, 0, 0);    
  };

  /**
   * Skews the matrix vertically in given deg angle.
   *
   * @param  {Number} deg Skew Y angle in degrees
   * @return {Matrix} Matrix
   */
  Matrix.skewY = function(deg) { 
    return new Matrix(1, Math.tan(toNumber(deg) * (Math.PI/180)), 0, 1, 0, 0);
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
  function toNumber(x, defaultValue) {
    var result = parseFloat(x);
    return result + "" == "NaN" || result + "" == "Infinity" || result + "" == "-Infinity" 
    ? defaultValue === undefined 
      ? 0 
      : defaultValue
    : result;
  }
    
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
    if (!type || !(type in TRANSFORM_PROPS))
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
     * Holds the current CSSTransform function arguments.
     *
     * @type Array
     */
    this.args = [].concat(Transformation.defaultArgs[type]);
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
        ? "(" + this.getMatrix()  + ")"
        : "(" + this.args.join(TRANSFORM_PROPS[this.type] + ", ") + TRANSFORM_PROPS[this.type] + ")"
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
      this.args = [];
      var argc = arguments.length;
      if ( argc > 0 ) {
        var arg, i;
        for ( i = 0; i < argc; i++ ) {
          this.args.push(arguments[i]);
        }
      }
      return this;
    },
    
    getMatrix : function() 
    {
      return Matrix[this.type].apply(Matrix, this.args);
    }
  };
  
  Transformation.defaultArgs = {
    "matrix"     : [1, 0, 0, 1, 0, 0],
    "rotate"     : [0],
    "scale"      : [1, 1],
    "scaleX"     : [1],
    "scaleY"     : [1],
    "skew"       : [0, 0],
    "skewX"      : [0],
    "skewY"      : [0],
    "translate"  : [0, 0],
    "translateX" : [0],
    "translateY" : [0]
  };
  
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
   * Estension: Use "multipliedMatrix" to get the current multiplied 
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
    
    if ( type == "multipliedMatrix" ) {
      return "matrix(" + this.getMatrix() + ")";
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
    var str = [], i = this._stack.length;
    while (i) {
      str.unshift(this._stack[--i].toString());
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
    var m = new Matrix(), l = this._stack.length;
    while ( l ) {
      m.multiply(this._stack[--l].getMatrix());
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
              : [value], args2 = [], l = args.length, arg, m, _cur, fn;
          
          while (l) {
            arg = args[--l];
            
            // if transformation type does not exist - inser new identity
            if (this._stackIndex[type] === undefined) {
              this._stackIndex[type] = this._stack.push(new Transformation(type)) - 1;
            }
            
            fn = this._stack[this._stackIndex[type]];
            
            // calculate the current value
            _cur = parseFloat(fn.args[l]);
            
            // trim current arg
            arg = $.trim(String(arg));
            
            // test for relative expressions
            m = arg.replace(/\s/g, "").match(/^(([\+-]=)?(-?\d+(\.\d+)?)).*$/);
            if (m) {   
              if (m[3]) {
                arg = parseFloat(m[3]);
              }
              
              if (m[2]) {
                switch (m[2]) {
                  case '+=': 
                    arg = _cur + arg;
                  break;
                  case '-=': 
                    arg = _cur - arg;
                  break;
                }
              }
            }
            
            if ( !isNaN(arg) ) {
              // TODO: just use fn.args[l] = arg; and comment the fn.args = args2; below
              args2.unshift(arg);
            }
            
          }
          
          fn.args = args2;
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
    this.element.style[$.support.transform] = this.toString();
    return this;
  };

  // STATIC --------------------------------------------------------------------
  
  /**
   * Creates and returns an instance of TransformManager, or it's specialized
   * subclasses if needed.
   *
   * @return {TransformManager} Returns an instance of TransformManager, 
   *                            CanvasTransformManager or IETransformManager
   */
  TransformManager.factory = function(element)
  {
    // Non-standart (IE or canvas)
    if (!$.support.transform) {
      if (TransformManager.isFilterSupported()) {
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
    
    /**
     * A regular expression to match IE matrix filter strings
     *
     * @type {RegExp}
     */
    this.filterReg = /(progid:DXImageTransform\.Microsoft\.)?Matrix\s*\([^\)]*\)/i;
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
     
      var style = this.element.style;
      var filter = style.filter || "";
      var mx = "";
      
      // Dont fire filters just for translate!
      if ( M.a !== 1 || M.b !== 0 || M.c !== 0 || M.d !== 1 ) {
        
        mx = "progid:DXImageTransform.Microsoft.Matrix(" 
        + "M11=" + M.a  + ","
        + "M12=" + M.c  + ","
        + "M21=" + M.b  + ","
        + "M22=" + M.d  + ","
        //+ "Dx="  + M.tx + "," // MSDN: This property is ignored if the SizingMethod is set to auto expand.
        //+ "Dy="  + M.ty + "," // MSDN: This property is ignored if the SizingMethod is set to auto expand.
        + "sizingMethod='auto expand'," 
        + "FilterType='nearest neighbor')";
      }
      
      if (this.filterReg.test(filter)) {
        style.filter = filter.replace(this.filterReg, mx);
      } else {
        if (mx) {
          style.filter = mx + " " + style.filter;
        }
      }
      
      style.top  = (
        (this.origState.height - $(this.element).height()) / 2
      ) + M.ty + this.origState.top  + 'px';
      
      style.left = (
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
        storeCss("width", "height", "top", "left", "position", "filter");
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
  };
  
})(jQuery);
