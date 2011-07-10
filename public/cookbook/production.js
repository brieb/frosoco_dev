steal.plugins("jquery/controller", "jquery/controller/subscribe", "jquery/view/ejs", "jquery/controller/view", "jquery/model", "jquery/dom/fixture", "jquery/dom/form_params").css("cookbook").resources().models("recipe").controllers("recipe").views();
;
steal.end();
steal.plugins("jquery/class", "jquery/lang", "jquery/event/destroyed").then(function(e) {
  var u = function(a, b, c) {
    var d,f = a.bind && a.unbind ? a : e(j(a) ? [a] : a);
    if (b.indexOf(">") === 0) {
      b = b.substr(1);
      d = function(g) {
        g.target === a && c.apply(this, arguments)
      }
    }
    f.bind(b, d || c);
    return function() {
      f.unbind(b, d || c);
      a = b = c = d = null
    }
  },p = e.makeArray,v = e.isArray,j = e.isFunction,k = e.extend,q = e.String,w = function(a, b, c, d) {
    var f = a.delegate && a.undelegate ? a : e(j(a) ? [a] : a);
    f.delegate(b, c, d);
    return function() {
      f.undelegate(b, c, d);
      f = a = c = d = b = null
    }
  },
      r = function(a, b, c, d) {
        return d ? w(a, d, b, c) : u(a, b, c)
      },l = function(a) {
    return function() {
      return a.apply(null, [this.nodeName ? e(this) : this].concat(Array.prototype.slice.call(arguments, 0)))
    }
  },x = /\./g,y = /_?controllers?/ig,s = function(a) {
    return q.underscore(a.replace("jQuery.", "").replace(x, "_").replace(y, ""))
  },z = /[^\w]/,t = /\{([^\}]+)\}/g,A = /^(?:(.*?)\s)?([\w\.\:>]+)$/,m,n = function(a, b) {
    return e.data(a, "controllers", b)
  };
  e.Class("jQuery.Controller", {init:function() {
    if (!(!this.shortName || this.fullName == "jQuery.Controller")) {
      this._fullName =
          s(this.fullName);
      this._shortName = s(this.shortName);
      var a = this,b = this.pluginName || this._fullName,c;
      e.fn[b] || (e.fn[b] = function(d) {
        var f = p(arguments),g = typeof d == "string" && j(a.prototype[d]),B = f[0];
        return this.each(function() {
          var h = n(this);
          if (h = h && h[b])g ? h[B].apply(h, f.slice(1)) : h.update.apply(h, f); else a.newInstance.apply(a, [this].concat(f))
        })
      });
      this.actions = {};
      for (c in this.prototype)if (!(c == "constructor" || !j(this.prototype[c])))if (this._isAction(c))this.actions[c] = this._action(c);
      this.onDocument &&
      new a(document.documentElement)
    }
  },hookup:function(a) {
    return new this(a)
  },_isAction:function(a) {
    return z.test(a) ? true : e.inArray(a, this.listensTo) > -1 || e.event.special[a] || o[a]
  },_action:function(a, b) {
    t.lastIndex = 0;
    if (!b && t.test(a))return null;
    a = b ? q.sub(a, [b,window]) : a;
    b = v(a);
    var c = (b ? a[1] : a).match(A);
    return{processor:o[c[2]] || m,parts:c,delegate:b ? a[0] : undefined}
  },processors:{},listensTo:[],defaults:{}}, {setup:function(a, b) {
    var c,d = this.Class;
    a = a.jquery ? a[0] : a;
    this.element = e(a).addClass(d._fullName);
    (n(a) || n(a, {}))[d._fullName] = this;
    this._bindings = [];
    this.options = k(k(true, {}, d.defaults), b);
    for (c in d.actions)if (d.actions.hasOwnProperty(c)) {
      b = d.actions[c] || d._action(c, this.options);
      this._bindings.push(b.processor(b.delegate || a, b.parts[2], b.parts[1], this.callback(c), this))
    }
    this.called = "init";
    var f = l(this.callback("destroy"));
    this.element.bind("destroyed", f);
    this._bindings.push(function() {
      e(a).unbind("destroyed", f)
    });
    return this.element
  },bind:function(a, b, c) {
    if (typeof a == "string") {
      c = b;
      b = a;
      a = this.element
    }
    return this._binder(a,
        b, c)
  },_binder:function(a, b, c, d) {
    if (typeof c == "string")c = l(this.callback(c));
    this._bindings.push(r(a, b, c, d));
    return this._bindings.length
  },delegate:function(a, b, c, d) {
    if (typeof a == "string") {
      d = c;
      c = b;
      b = a;
      a = this.element
    }
    return this._binder(a, c, d, b)
  },update:function(a) {
    k(this.options, a)
  },destroy:function() {
    if (this._destroyed)throw this.Class.shortName + " controller instance has been deleted";
    var a = this,b = this.Class._fullName;
    this._destroyed = true;
    this.element.removeClass(b);
    e.each(this._bindings, function(c, d) {
      d(a.element[0])
    });
    delete this._actions;
    delete this.element.data("controllers")[b];
    e(this).triggerHandler("destroyed");
    this.element = null
  },find:function(a) {
    return this.element.find(a)
  },_set_called:true});
  var o = e.Controller.processors;
  m = function(a, b, c, d, f) {
    var g = f.Class;
    if (g.onDocument && !/^Main(Controller)?$/.test(g.shortName) && a === f.element[0])c = c ? "#" + g._shortName + " " + c : "#" + g._shortName;
    return r(a, b, l(d), c)
  };
  e.each("change click contextmenu dblclick keydown keyup keypress mousedown mousemove mouseout mouseover mouseup reset resize scroll select submit focusin focusout mouseenter mouseleave".split(" "),
      function(a, b) {
        o[b] = m
      });
  var i,C = function(a, b) {
    for (i = 0; i < b.length; i++)if (typeof b[i] == "string" ? a.Class._shortName == b[i] : a instanceof b[i])return true;
    return false
  };
  e.fn.controllers = function() {
    var a = p(arguments),b = [],c,d,f;
    this.each(function() {
      c = e.data(this, "controllers");
      for (f in c)if (c.hasOwnProperty(f)) {
        d = c[f];
        if (!a.length || C(d, a))b.push(d)
      }
    });
    return b
  };
  e.fn.controller = function() {
    return this.controllers.apply(this, arguments)[0]
  }
});
;
steal.end();
steal.plugins("jquery", "jquery/lang").then(function(i) {
  var k = false,p = i.makeArray,q = i.isFunction,m = i.isArray,n = i.extend,r = function(a, c) {
    return a.concat(p(c))
  },t = /xyz/.test(function() {
  }) ? /\b_super\b/ : /.*/,s = function(a, c, d) {
    d = d || a;
    for (var b in a)d[b] = q(a[b]) && q(c[b]) && t.test(a[b]) ? function(g, h) {
      return function() {
        var f = this._super,e;
        this._super = c[g];
        e = h.apply(this, arguments);
        this._super = f;
        return e
      }
    }(b, a[b]) : a[b]
  },j = i.Class = function() {
    arguments.length && j.extend.apply(j, arguments)
  };
  n(j, {callback:function(a) {
    var c =
        p(arguments),d;
    a = c.shift();
    m(a) || (a = [a]);
    d = this;
    return function() {
      for (var b = r(c, arguments),g,h = a.length,f = 0,e; f < h; f++)if (e = a[f]) {
        if ((g = typeof e == "string") && d._set_called)d.called = e;
        b = (g ? d[e] : e).apply(d, b || []);
        if (f < h - 1)b = !m(b) || b._use_call ? [b] : b
      }
      return b
    }
  },getObject:i.String.getObject,newInstance:function() {
    var a = this.rawInstance(),c;
    if (a.setup)c = a.setup.apply(a, arguments);
    if (a.init)a.init.apply(a, m(c) ? c : arguments);
    return a
  },setup:function(a) {
    this.defaults = n(true, {}, a.defaults, this.defaults);
    return arguments
  },
    rawInstance:function() {
      k = true;
      var a = new this;
      k = false;
      return a
    },extend:function(a, c, d) {
      function b() {
        if (!k)return this.constructor !== b && arguments.length ? arguments.callee.extend.apply(arguments.callee, arguments) : this.Class.newInstance.apply(this.Class, arguments)
      }

      if (typeof a != "string") {
        d = c;
        c = a;
        a = null
      }
      if (!d) {
        d = c;
        c = null
      }
      d = d || {};
      var g = this,h = this.prototype,f,e,l,o;
      k = true;
      o = new this;
      k = false;
      s(d, h, o);
      for (f in this)if (this.hasOwnProperty(f))b[f] = this[f];
      s(c, this, b);
      if (a) {
        l = a.split(/\./);
        e = l.pop();
        l = h = j.getObject(l.join("."),
            window, true);
        h[e] = b
      }
      n(b, {prototype:o,namespace:l,shortName:e,constructor:b,fullName:a});
      b.prototype.Class = b.prototype.constructor = b;
      g = b.setup.apply(b, r([g], arguments));
      if (b.init)b.init.apply(b, g || []);
      return b
    }});
  j.prototype.callback = j.callback
})();
;
steal.end();
(function(E, v) {
  function wa(a, b, d) {
    if (d === v && a.nodeType === 1) {
      d = "data-" + b.replace(gb, "$1-$2").toLowerCase();
      d = a.getAttribute(d);
      if (typeof d === "string") {
        try {
          d = d === "true" ? true : d === "false" ? false : d === "null" ? null : !c.isNaN(d) ? parseFloat(d) : hb.test(d) ? c.parseJSON(d) : d
        } catch(e) {
        }
        c.data(a, b, d)
      } else d = v
    }
    return d
  }

  function ia(a) {
    for (var b in a)if (b !== "toJSON")return false;
    return true
  }

  function xa(a, b, d) {
    var e = b + "defer",f = b + "queue",g = b + "mark",i = c.data(a, e, v, true);
    if (i && (d === "queue" || !c.data(a, f, v, true)) && (d === "mark" ||
        !c.data(a, g, v, true)))setTimeout(function() {
      if (!c.data(a, f, v, true) && !c.data(a, g, v, true)) {
        c.removeData(a, e, true);
        i.resolve()
      }
    }, 0)
  }

  function Q() {
    return false
  }

  function aa() {
    return true
  }

  function ya(a, b, d) {
    var e = c.extend({}, d[0]);
    e.type = a;
    e.originalEvent = {};
    e.liveFired = v;
    c.event.handle.call(b, e);
    e.isDefaultPrevented() && d[0].preventDefault()
  }

  function ib(a) {
    var b,d,e,f,g,i,l,m,n,r,A,B = [];
    f = [];
    g = c._data(this, "events");
    if (!(a.liveFired === this || !g || !g.live || a.target.disabled || a.button && a.type === "click")) {
      if (a.namespace)A =
          new RegExp("(^|\\.)" + a.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
      a.liveFired = this;
      var C = g.live.slice(0);
      for (l = 0; l < C.length; l++) {
        g = C[l];
        g.origType.replace(ja, "") === a.type ? f.push(g.selector) : C.splice(l--, 1)
      }
      f = c(a.target).closest(f, a.currentTarget);
      m = 0;
      for (n = f.length; m < n; m++) {
        r = f[m];
        for (l = 0; l < C.length; l++) {
          g = C[l];
          if (r.selector === g.selector && (!A || A.test(g.namespace)) && !r.elem.disabled) {
            i = r.elem;
            e = null;
            if (g.preType === "mouseenter" || g.preType === "mouseleave") {
              a.type = g.preType;
              if ((e = c(a.relatedTarget).closest(g.selector)[0]) &&
                  c.contains(i, e))e = i
            }
            if (!e || e !== i)B.push({elem:i,handleObj:g,level:r.level})
          }
        }
      }
      m = 0;
      for (n = B.length; m < n; m++) {
        f = B[m];
        if (d && f.level > d)break;
        a.currentTarget = f.elem;
        a.data = f.handleObj.data;
        a.handleObj = f.handleObj;
        A = f.handleObj.origHandler.apply(f.elem, arguments);
        if (A === false || a.isPropagationStopped()) {
          d = f.level;
          if (A === false)b = false;
          if (a.isImmediatePropagationStopped())break
        }
      }
      return b
    }
  }

  function ba(a, b) {
    return(a && a !== "*" ? a + "." : "") + b.replace(jb, "`").replace(kb, "&")
  }

  function za(a) {
    return!a || !a.parentNode || a.parentNode.nodeType ===
        11
  }

  function Aa(a, b, d) {
    b = b || 0;
    if (c.isFunction(b))return c.grep(a, function(f, g) {
      return!!b.call(f, g, f) === d
    }); else if (b.nodeType)return c.grep(a, function(f) {
      return f === b === d
    }); else if (typeof b === "string") {
      var e = c.grep(a, function(f) {
        return f.nodeType === 1
      });
      if (lb.test(b))return c.filter(b, e, !d); else b = c.filter(b, e)
    }
    return c.grep(a, function(f) {
      return c.inArray(f, b) >= 0 === d
    })
  }

  function mb(a) {
    return c.nodeName(a, "table") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) :
        a
  }

  function Ba(a, b) {
    if (!(b.nodeType !== 1 || !c.hasData(a))) {
      var d = c.expando,e = c.data(a),f = c.data(b, e);
      if (e = e[d]) {
        a = e.events;
        f = f[d] = c.extend({}, e);
        if (a) {
          delete f.handle;
          f.events = {};
          for (var g in a) {
            d = 0;
            for (e = a[g].length; d < e; d++)c.event.add(b, g + (a[g][d].namespace ? "." : "") + a[g][d].namespace, a[g][d], a[g][d].data)
          }
        }
      }
    }
  }

  function Ca(a, b) {
    var d;
    if (b.nodeType === 1) {
      b.clearAttributes && b.clearAttributes();
      b.mergeAttributes && b.mergeAttributes(a);
      d = b.nodeName.toLowerCase();
      if (d === "object")b.outerHTML = a.outerHTML; else if (d ===
          "input" && (a.type === "checkbox" || a.type === "radio")) {
        if (a.checked)b.defaultChecked = b.checked = a.checked;
        if (b.value !== a.value)b.value = a.value
      } else if (d === "option")b.selected = a.defaultSelected; else if (d === "input" || d === "textarea")b.defaultValue = a.defaultValue;
      b.removeAttribute(c.expando)
    }
  }

  function ca(a) {
    return"getElementsByTagName"in a ? a.getElementsByTagName("*") : "querySelectorAll"in a ? a.querySelectorAll("*") : []
  }

  function Da(a) {
    if (a.type === "checkbox" || a.type === "radio")a.defaultChecked = a.checked
  }

  function Ea(a) {
    if (c.nodeName(a,
        "input"))Da(a); else a.getElementsByTagName && c.grep(a.getElementsByTagName("input"), Da)
  }

  function nb(a, b) {
    b.src ? c.ajax({url:b.src,async:false,dataType:"script"}) : c.globalEval((b.text || b.textContent || b.innerHTML || "").replace(ob, "/*$0*/"));
    b.parentNode && b.parentNode.removeChild(b)
  }

  function Fa(a, b, d) {
    var e = b === "width" ? a.offsetWidth : a.offsetHeight;
    if (d === "border")return e;
    c.each(b === "width" ? pb : qb, function() {
      d || (e -= parseFloat(c.css(a, "padding" + this)) || 0);
      if (d === "margin")e += parseFloat(c.css(a, "margin" + this)) ||
          0; else e -= parseFloat(c.css(a, "border" + this + "Width")) || 0
    });
    return e
  }

  function Ga(a) {
    return function(b, d) {
      if (typeof b !== "string") {
        d = b;
        b = "*"
      }
      if (c.isFunction(d)) {
        b = b.toLowerCase().split(Ha);
        for (var e = 0,f = b.length,g,i; e < f; e++) {
          g = b[e];
          if (i = /^\+/.test(g))g = g.substr(1) || "*";
          g = a[g] = a[g] || [];
          g[i ? "unshift" : "push"](d)
        }
      }
    }
  }

  function da(a, b, d, e, f, g) {
    f = f || b.dataTypes[0];
    g = g || {};
    g[f] = true;
    f = a[f];
    for (var i = 0,l = f ? f.length : 0,m = a === ka,n; i < l && (m || !n); i++) {
      n = f[i](b, d, e);
      if (typeof n === "string")if (!m || g[n])n = v; else {
        b.dataTypes.unshift(n);
        n = da(a, b, d, e, n, g)
      }
    }
    if ((m || !n) && !g["*"])n = da(a, b, d, e, "*", g);
    return n
  }

  function la(a, b, d, e) {
    if (c.isArray(b))c.each(b, function(g, i) {
      d || rb.test(a) ? e(a, i) : la(a + "[" + (typeof i === "object" || c.isArray(i) ? g : "") + "]", i, d, e)
    }); else if (!d && b != null && typeof b === "object")for (var f in b)la(a + "[" + f + "]", b[f], d, e); else e(a, b)
  }

  function sb(a, b, d) {
    var e = a.contents,f = a.dataTypes,g = a.responseFields,i,l,m,n;
    for (l in g)if (l in d)b[g[l]] = d[l];
    for (; f[0] === "*";) {
      f.shift();
      if (i === v)i = a.mimeType || b.getResponseHeader("content-type")
    }
    if (i)for (l in e)if (e[l] &&
        e[l].test(i)) {
      f.unshift(l);
      break
    }
    if (f[0]in d)m = f[0]; else {
      for (l in d) {
        if (!f[0] || a.converters[l + " " + f[0]]) {
          m = l;
          break
        }
        n || (n = l)
      }
      m = m || n
    }
    if (m) {
      m !== f[0] && f.unshift(m);
      return d[m]
    }
  }

  function tb(a, b) {
    if (a.dataFilter)b = a.dataFilter(b, a.dataType);
    var d = a.dataTypes,e = {},f,g,i = d.length,l,m = d[0],n,r,A,B,C;
    for (f = 1; f < i; f++) {
      if (f === 1)for (g in a.converters)if (typeof g === "string")e[g.toLowerCase()] = a.converters[g];
      n = m;
      m = d[f];
      if (m === "*")m = n; else if (n !== "*" && n !== m) {
        r = n + " " + m;
        A = e[r] || e["* " + m];
        if (!A) {
          C = v;
          for (B in e) {
            l =
                B.split(" ");
            if (l[0] === n || l[0] === "*")if (C = e[l[1] + " " + m]) {
              B = e[B];
              if (B === true)A = C; else if (C === true)A = B;
              break
            }
          }
        }
        A || C || c.error("No conversion from " + r.replace(" ", " to "));
        if (A !== true)b = A ? A(b) : C(B(b))
      }
    }
    return b
  }

  function Ia() {
    try {
      return new E.XMLHttpRequest
    } catch(a) {
    }
  }

  function ub() {
    try {
      return new E.ActiveXObject("Microsoft.XMLHTTP")
    } catch(a) {
    }
  }

  function Ja() {
    setTimeout(vb, 0);
    return ea = c.now()
  }

  function vb() {
    ea = v
  }

  function V(a, b) {
    var d = {};
    c.each(Ka.concat.apply([], Ka.slice(0, b)), function() {
      d[this] = a
    });
    return d
  }

  function La(a) {
    if (!ma[a]) {
      var b = c("<" + a + ">").appendTo("body"),d = b.css("display");
      b.remove();
      if (d === "none" || d === "") {
        if (!P) {
          P = x.createElement("iframe");
          P.frameBorder = P.width = P.height = 0
        }
        x.body.appendChild(P);
        if (!Z || !P.createElement) {
          Z = (P.contentWindow || P.contentDocument).document;
          Z.write("<!doctype><html><body></body></html>")
        }
        b = Z.createElement(a);
        Z.body.appendChild(b);
        d = c.css(b, "display");
        x.body.removeChild(P)
      }
      ma[a] = d
    }
    return ma[a]
  }

  function na(a) {
    return c.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView ||
        a.parentWindow : false
  }

  var x = E.document,wb = E.navigator,xb = E.location,c = function() {
    function a() {
      if (!b.isReady) {
        try {
          x.documentElement.doScroll("left")
        } catch(k) {
          setTimeout(a, 1);
          return
        }
        b.ready()
      }
    }

    var b = function(k, s) {
      return new b.fn.init(k, s, f)
    },d = E.jQuery,e = E.$,f,g = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,i = /\S/,l = /^\s+/,m = /\s+$/,n = /\d/,r = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,A = /^[\],:{}\s]*$/,B = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,C = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,G = /(?:^|:|,)(?:\s*\[)+/g,
        R = /(webkit)[ \/]([\w.]+)/,I = /(opera)(?:.*version)?[ \/]([\w.]+)/,M = /(msie) ([\w.]+)/,O = /(mozilla)(?:.*? rv:([\w.]+))?/,h = wb.userAgent,j,o,p = Object.prototype.toString,q = Object.prototype.hasOwnProperty,t = Array.prototype.push,y = Array.prototype.slice,w = String.prototype.trim,D = Array.prototype.indexOf,L = {};
    b.fn = b.prototype = {constructor:b,init:function(k, s, u) {
      var z;
      if (!k)return this;
      if (k.nodeType) {
        this.context = this[0] = k;
        this.length = 1;
        return this
      }
      if (k === "body" && !s && x.body) {
        this.context = x;
        this[0] = x.body;
        this.selector =
            k;
        this.length = 1;
        return this
      }
      if (typeof k === "string")if ((z = k.charAt(0) === "<" && k.charAt(k.length - 1) === ">" && k.length >= 3 ? [null,k,null] : g.exec(k)) && (z[1] || !s))if (z[1]) {
        u = (s = s instanceof b ? s[0] : s) ? s.ownerDocument || s : x;
        if (k = r.exec(k))if (b.isPlainObject(s)) {
          k = [x.createElement(k[1])];
          b.fn.attr.call(k, s, true)
        } else k = [u.createElement(k[1])]; else {
          k = b.buildFragment([z[1]], [u]);
          k = (k.cacheable ? b.clone(k.fragment) : k.fragment).childNodes
        }
        return b.merge(this, k)
      } else {
        if ((s = x.getElementById(z[2])) && s.parentNode) {
          if (s.id !==
              z[2])return u.find(k);
          this.length = 1;
          this[0] = s
        }
        this.context = x;
        this.selector = k;
        return this
      } else return!s || s.jquery ? (s || u).find(k) : this.constructor(s).find(k); else if (b.isFunction(k))return u.ready(k);
      if (k.selector !== v) {
        this.selector = k.selector;
        this.context = k.context
      }
      return b.makeArray(k, this)
    },selector:"",jquery:"1.6.1",length:0,size:function() {
      return this.length
    },toArray:function() {
      return y.call(this, 0)
    },get:function(k) {
      return k == null ? this.toArray() : k < 0 ? this[this.length + k] : this[k]
    },pushStack:function(k, s, u) {
      var z = this.constructor();
      b.isArray(k) ? t.apply(z, k) : b.merge(z, k);
      z.prevObject = this;
      z.context = this.context;
      if (s === "find")z.selector = this.selector + (this.selector ? " " : "") + u; else if (s)z.selector = this.selector + "." + s + "(" + u + ")";
      return z
    },each:function(k, s) {
      return b.each(this, k, s)
    },ready:function(k) {
      b.bindReady();
      j.done(k);
      return this
    },eq:function(k) {
      return k === -1 ? this.slice(k) : this.slice(k, +k + 1)
    },first:function() {
      return this.eq(0)
    },last:function() {
      return this.eq(-1)
    },slice:function() {
      return this.pushStack(y.apply(this,
          arguments), "slice", y.call(arguments).join(","))
    },map:function(k) {
      return this.pushStack(b.map(this, function(s, u) {
        return k.call(s, u, s)
      }))
    },end:function() {
      return this.prevObject || this.constructor(null)
    },push:t,sort:[].sort,splice:[].splice};
    b.fn.init.prototype = b.fn;
    b.extend = b.fn.extend = function() {
      var k,s,u,z,H,F = arguments[0] || {},J = 1,K = arguments.length,oa = false;
      if (typeof F === "boolean") {
        oa = F;
        F = arguments[1] || {};
        J = 2
      }
      if (typeof F !== "object" && !b.isFunction(F))F = {};
      if (K === J) {
        F = this;
        --J
      }
      for (; J < K; J++)if ((k = arguments[J]) !=
          null)for (s in k) {
        u = F[s];
        z = k[s];
        if (F !== z)if (oa && z && (b.isPlainObject(z) || (H = b.isArray(z)))) {
          if (H) {
            H = false;
            u = u && b.isArray(u) ? u : []
          } else u = u && b.isPlainObject(u) ? u : {};
          F[s] = b.extend(oa, u, z)
        } else if (z !== v)F[s] = z
      }
      return F
    };
    b.extend({noConflict:function(k) {
      if (E.$ === b)E.$ = e;
      if (k && E.jQuery === b)E.jQuery = d;
      return b
    },isReady:false,readyWait:1,holdReady:function(k) {
      if (k)b.readyWait++; else b.ready(true)
    },ready:function(k) {
      if (k === true && !--b.readyWait || k !== true && !b.isReady) {
        if (!x.body)return setTimeout(b.ready, 1);
        b.isReady =
            true;
        if (!(k !== true && --b.readyWait > 0)) {
          j.resolveWith(x, [b]);
          b.fn.trigger && b(x).trigger("ready").unbind("ready")
        }
      }
    },bindReady:function() {
      if (!j) {
        j = b._Deferred();
        if (x.readyState === "complete")return setTimeout(b.ready, 1);
        if (x.addEventListener) {
          x.addEventListener("DOMContentLoaded", o, false);
          E.addEventListener("load", b.ready, false)
        } else if (x.attachEvent) {
          x.attachEvent("onreadystatechange", o);
          E.attachEvent("onload", b.ready);
          var k = false;
          try {
            k = E.frameElement == null
          } catch(s) {
          }
          x.documentElement.doScroll && k && a()
        }
      }
    },
      isFunction:function(k) {
        return b.type(k) === "function"
      },isArray:Array.isArray || function(k) {
        return b.type(k) === "array"
      },isWindow:function(k) {
        return k && typeof k === "object" && "setInterval"in k
      },isNaN:function(k) {
        return k == null || !n.test(k) || isNaN(k)
      },type:function(k) {
        return k == null ? String(k) : L[p.call(k)] || "object"
      },isPlainObject:function(k) {
        if (!k || b.type(k) !== "object" || k.nodeType || b.isWindow(k))return false;
        if (k.constructor && !q.call(k, "constructor") && !q.call(k.constructor.prototype, "isPrototypeOf"))return false;
        var s;
        for (s in k);
        return s === v || q.call(k, s)
      },isEmptyObject:function(k) {
        for (var s in k)return false;
        return true
      },error:function(k) {
        throw k;
      },parseJSON:function(k) {
        if (typeof k !== "string" || !k)return null;
        k = b.trim(k);
        if (E.JSON && E.JSON.parse)return E.JSON.parse(k);
        if (A.test(k.replace(B, "@").replace(C, "]").replace(G, "")))return(new Function("return " + k))();
        b.error("Invalid JSON: " + k)
      },parseXML:function(k, s, u) {
        if (E.DOMParser) {
          u = new DOMParser;
          s = u.parseFromString(k, "text/xml")
        } else {
          s = new ActiveXObject("Microsoft.XMLDOM");
          s.async = "false";
          s.loadXML(k)
        }
        u = s.documentElement;
        if (!u || !u.nodeName || u.nodeName === "parsererror")b.error("Invalid XML: " + k);
        return s
      },noop:function() {
      },globalEval:function(k) {
        if (k && i.test(k))(E.execScript || function(s) {
          E.eval.call(E, s)
        })(k)
      },nodeName:function(k, s) {
        return k.nodeName && k.nodeName.toUpperCase() === s.toUpperCase()
      },each:function(k, s, u) {
        var z,H = 0,F = k.length,J = F === v || b.isFunction(k);
        if (u)if (J)for (z in k) {
          if (s.apply(k[z], u) === false)break
        } else for (; H < F;) {
          if (s.apply(k[H++], u) === false)break
        } else if (J)for (z in k) {
          if (s.call(k[z],
              z, k[z]) === false)break
        } else for (; H < F;)if (s.call(k[H], H, k[H++]) === false)break;
        return k
      },trim:w ? function(k) {
        return k == null ? "" : w.call(k)
      } : function(k) {
        return k == null ? "" : k.toString().replace(l, "").replace(m, "")
      },makeArray:function(k, s) {
        s = s || [];
        if (k != null) {
          var u = b.type(k);
          k.length == null || u === "string" || u === "function" || u === "regexp" || b.isWindow(k) ? t.call(s, k) : b.merge(s, k)
        }
        return s
      },inArray:function(k, s) {
        if (D)return D.call(s, k);
        for (var u = 0,z = s.length; u < z; u++)if (s[u] === k)return u;
        return-1
      },merge:function(k, s) {
        var u =
            k.length,z = 0;
        if (typeof s.length === "number")for (var H = s.length; z < H; z++)k[u++] = s[z]; else for (; s[z] !== v;)k[u++] = s[z++];
        k.length = u;
        return k
      },grep:function(k, s, u) {
        var z = [],H;
        u = !!u;
        for (var F = 0,J = k.length; F < J; F++) {
          H = !!s(k[F], F);
          u !== H && z.push(k[F])
        }
        return z
      },map:function(k, s, u) {
        var z,H,F = [],J = 0,K = k.length;
        if (k instanceof b || K !== v && typeof K === "number" && (K > 0 && k[0] && k[K - 1] || K === 0 || b.isArray(k)))for (; J < K; J++) {
          z = s(k[J], J, u);
          if (z != null)F[F.length] = z
        } else for (H in k) {
          z = s(k[H], H, u);
          if (z != null)F[F.length] = z
        }
        return F.concat.apply([],
            F)
      },guid:1,proxy:function(k, s) {
        if (typeof s === "string") {
          var u = k[s];
          s = k;
          k = u
        }
        if (!b.isFunction(k))return v;
        var z = y.call(arguments, 2);
        u = function() {
          return k.apply(s, z.concat(y.call(arguments)))
        };
        u.guid = k.guid = k.guid || u.guid || b.guid++;
        return u
      },access:function(k, s, u, z, H, F) {
        var J = k.length;
        if (typeof s === "object") {
          for (var K in s)b.access(k, K, s[K], z, H, u);
          return k
        }
        if (u !== v) {
          z = !F && z && b.isFunction(u);
          for (K = 0; K < J; K++)H(k[K], s, z ? u.call(k[K], K, H(k[K], s)) : u, F);
          return k
        }
        return J ? H(k[0], s) : v
      },now:function() {
        return(new Date).getTime()
      },
      uaMatch:function(k) {
        k = k.toLowerCase();
        k = R.exec(k) || I.exec(k) || M.exec(k) || k.indexOf("compatible") < 0 && O.exec(k) || [];
        return{browser:k[1] || "",version:k[2] || "0"}
      },sub:function() {
        function k(u, z) {
          return new k.fn.init(u, z)
        }

        b.extend(true, k, this);
        k.superclass = this;
        k.fn = k.prototype = this();
        k.fn.constructor = k;
        k.sub = this.sub;
        k.fn.init = function(u, z) {
          if (z && z instanceof b && !(z instanceof k))z = k(z);
          return b.fn.init.call(this, u, z, s)
        };
        k.fn.init.prototype = k.fn;
        var s = k(x);
        return k
      },browser:{}});
    b.each("Boolean Number String Function Array Date RegExp Object".split(" "),
        function(k, s) {
          L["[object " + s + "]"] = s.toLowerCase()
        });
    h = b.uaMatch(h);
    if (h.browser) {
      b.browser[h.browser] = true;
      b.browser.version = h.version
    }
    if (b.browser.webkit)b.browser.safari = true;
    if (i.test("\u00a0")) {
      l = /^[\s\xA0]+/;
      m = /[\s\xA0]+$/
    }
    f = b(x);
    if (x.addEventListener)o = function() {
      x.removeEventListener("DOMContentLoaded", o, false);
      b.ready()
    }; else if (x.attachEvent)o = function() {
      if (x.readyState === "complete") {
        x.detachEvent("onreadystatechange", o);
        b.ready()
      }
    };
    return b
  }(),pa = "done fail isResolved isRejected promise then always pipe".split(" "),
      Ma = [].slice;
  c.extend({_Deferred:function() {
    var a = [],b,d,e,f = {done:function() {
      if (!e) {
        var g = arguments,i,l,m,n,r;
        if (b) {
          r = b;
          b = 0
        }
        i = 0;
        for (l = g.length; i < l; i++) {
          m = g[i];
          n = c.type(m);
          if (n === "array")f.done.apply(f, m); else n === "function" && a.push(m)
        }
        r && f.resolveWith(r[0], r[1])
      }
      return this
    },resolveWith:function(g, i) {
      if (!e && !b && !d) {
        i = i || [];
        d = 1;
        try {
          for (; a[0];)a.shift().apply(g, i)
        } finally {
          b = [g,i];
          d = 0
        }
      }
      return this
    },resolve:function() {
      f.resolveWith(this, arguments);
      return this
    },isResolved:function() {
      return!!(d || b)
    },cancel:function() {
      e =
          1;
      a = [];
      return this
    }};
    return f
  },Deferred:function(a) {
    var b = c._Deferred(),d = c._Deferred(),e;
    c.extend(b, {then:function(f, g) {
      b.done(f).fail(g);
      return this
    },always:function() {
      return b.done.apply(b, arguments).fail.apply(this, arguments)
    },fail:d.done,rejectWith:d.resolveWith,reject:d.resolve,isRejected:d.isResolved,pipe:function(f, g) {
      return c.Deferred(
          function(i) {
            c.each({done:[f,"resolve"],fail:[g,"reject"]}, function(l, m) {
              var n = m[0],r = m[1],A;
              c.isFunction(n) ? b[l](function() {
                (A = n.apply(this, arguments)) && c.isFunction(A.promise) ?
                    A.promise().then(i.resolve, i.reject) : i[r](A)
              }) : b[l](i[r])
            })
          }).promise()
    },promise:function(f) {
      if (f == null) {
        if (e)return e;
        e = f = {}
      }
      for (var g = pa.length; g--;)f[pa[g]] = b[pa[g]];
      return f
    }});
    b.done(d.cancel).fail(b.cancel);
    delete b.cancel;
    a && a.call(b, b);
    return b
  },when:function(a) {
    function b(l) {
      return function(m) {
        d[l] = arguments.length > 1 ? Ma.call(arguments, 0) : m;
        --g || i.resolveWith(i, Ma.call(d, 0))
      }
    }

    var d = arguments,e = 0,f = d.length,g = f,i = f <= 1 && a && c.isFunction(a.promise) ? a : c.Deferred();
    if (f > 1) {
      for (; e < f; e++)if (d[e] &&
          c.isFunction(d[e].promise))d[e].promise().then(b(e), i.reject); else--g;
      g || i.resolveWith(i, d)
    } else if (i !== a)i.resolveWith(i, f ? [a] : []);
    return i.promise()
  }});
  c.support = function() {
    var a = x.createElement("div"),b = x.documentElement,d,e,f,g,i,l;
    a.setAttribute("className", "t");
    a.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";
    d = a.getElementsByTagName("*");
    e = a.getElementsByTagName("a")[0];
    if (!d || !d.length || !e)return{};
    f = x.createElement("select");
    g = f.appendChild(x.createElement("option"));
    d = a.getElementsByTagName("input")[0];
    i = {leadingWhitespace:a.firstChild.nodeType === 3,tbody:!a.getElementsByTagName("tbody").length,htmlSerialize:!!a.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href") === "/a",opacity:/^0.55$/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:d.value === "on",optSelected:g.selected,getSetAttribute:a.className !== "t",submitBubbles:true,changeBubbles:true,focusinBubbles:false,
      deleteExpando:true,noCloneEvent:true,inlineBlockNeedsLayout:false,shrinkWrapBlocks:false,reliableMarginRight:true};
    d.checked = true;
    i.noCloneChecked = d.cloneNode(true).checked;
    f.disabled = true;
    i.optDisabled = !g.disabled;
    try {
      delete a.test
    } catch(m) {
      i.deleteExpando = false
    }
    if (!a.addEventListener && a.attachEvent && a.fireEvent) {
      a.attachEvent("onclick", function n() {
        i.noCloneEvent = false;
        a.detachEvent("onclick", n)
      });
      a.cloneNode(true).fireEvent("onclick")
    }
    d = x.createElement("input");
    d.value = "t";
    d.setAttribute("type",
        "radio");
    i.radioValue = d.value === "t";
    d.setAttribute("checked", "checked");
    a.appendChild(d);
    e = x.createDocumentFragment();
    e.appendChild(a.firstChild);
    i.checkClone = e.cloneNode(true).cloneNode(true).lastChild.checked;
    a.innerHTML = "";
    a.style.width = a.style.paddingLeft = "1px";
    e = x.createElement("body");
    f = {visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"};
    for (l in f)e.style[l] = f[l];
    e.appendChild(a);
    b.insertBefore(e, b.firstChild);
    i.appendChecked = d.checked;
    i.boxModel = a.offsetWidth === 2;
    if ("zoom"in
        a.style) {
      a.style.display = "inline";
      a.style.zoom = 1;
      i.inlineBlockNeedsLayout = a.offsetWidth === 2;
      a.style.display = "";
      a.innerHTML = "<div style='width:4px;'></div>";
      i.shrinkWrapBlocks = a.offsetWidth !== 2
    }
    a.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
    f = a.getElementsByTagName("td");
    d = f[0].offsetHeight === 0;
    f[0].style.display = "";
    f[1].style.display = "none";
    i.reliableHiddenOffsets = d && f[0].offsetHeight === 0;
    a.innerHTML = "";
    if (x.defaultView && x.defaultView.getComputedStyle) {
      d =
          x.createElement("div");
      d.style.width = "0";
      d.style.marginRight = "0";
      a.appendChild(d);
      i.reliableMarginRight = (parseInt((x.defaultView.getComputedStyle(d, null) || {marginRight:0}).marginRight, 10) || 0) === 0
    }
    e.innerHTML = "";
    b.removeChild(e);
    if (a.attachEvent)for (l in{submit:1,change:1,focusin:1}) {
      b = "on" + l;
      d = b in a;
      if (!d) {
        a.setAttribute(b, "return;");
        d = typeof a[b] === "function"
      }
      i[l + "Bubbles"] = d
    }
    return i
  }();
  c.boxModel = c.support.boxModel;
  var hb = /^(?:\{.*\}|\[.*\])$/,gb = /([a-z])([A-Z])/g;
  c.extend({cache:{},uuid:0,expando:"jQuery" +
      (c.fn.jquery + Math.random()).replace(/\D/g, ""),noData:{embed:true,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:true},hasData:function(a) {
    a = a.nodeType ? c.cache[a[c.expando]] : a[c.expando];
    return!!a && !ia(a)
  },data:function(a, b, d, e) {
    if (c.acceptData(a)) {
      var f = c.expando,g = typeof b === "string",i = a.nodeType,l = i ? c.cache : a,m = i ? a[c.expando] : a[c.expando] && c.expando;
      if (!((!m || e && m && !l[m][f]) && g && d === v)) {
        if (!m)if (i)a[c.expando] = m = ++c.uuid; else m = c.expando;
        if (!l[m]) {
          l[m] = {};
          if (!i)l[m].toJSON = c.noop
        }
        if (typeof b ===
            "object" || typeof b === "function")if (e)l[m][f] = c.extend(l[m][f], b); else l[m] = c.extend(l[m], b);
        a = l[m];
        if (e) {
          a[f] || (a[f] = {});
          a = a[f]
        }
        if (d !== v)a[c.camelCase(b)] = d;
        if (b === "events" && !a[b])return a[f] && a[f].events;
        return g ? a[c.camelCase(b)] : a
      }
    }
  },removeData:function(a, b, d) {
    if (c.acceptData(a)) {
      var e = c.expando,f = a.nodeType,g = f ? c.cache : a,i = f ? a[c.expando] : c.expando;
      if (g[i]) {
        if (b) {
          var l = d ? g[i][e] : g[i];
          if (l) {
            delete l[b];
            if (!ia(l))return
          }
        }
        if (d) {
          delete g[i][e];
          if (!ia(g[i]))return
        }
        b = g[i][e];
        if (c.support.deleteExpando ||
            g != E)delete g[i]; else g[i] = null;
        if (b) {
          g[i] = {};
          if (!f)g[i].toJSON = c.noop;
          g[i][e] = b
        } else if (f)if (c.support.deleteExpando)delete a[c.expando]; else if (a.removeAttribute)a.removeAttribute(c.expando); else a[c.expando] = null
      }
    }
  },_data:function(a, b, d) {
    return c.data(a, b, d, true)
  },acceptData:function(a) {
    if (a.nodeName) {
      var b = c.noData[a.nodeName.toLowerCase()];
      if (b)return!(b === true || a.getAttribute("classid") !== b)
    }
    return true
  }});
  c.fn.extend({data:function(a, b) {
    var d = null;
    if (typeof a === "undefined") {
      if (this.length) {
        d =
            c.data(this[0]);
        if (this[0].nodeType === 1)for (var e = this[0].attributes,f,g = 0,i = e.length; g < i; g++) {
          f = e[g].name;
          if (f.indexOf("data-") === 0) {
            f = c.camelCase(f.substring(5));
            wa(this[0], f, d[f])
          }
        }
      }
      return d
    } else if (typeof a === "object")return this.each(function() {
      c.data(this, a)
    });
    var l = a.split(".");
    l[1] = l[1] ? "." + l[1] : "";
    if (b === v) {
      d = this.triggerHandler("getData" + l[1] + "!", [l[0]]);
      if (d === v && this.length) {
        d = c.data(this[0], a);
        d = wa(this[0], a, d)
      }
      return d === v && l[1] ? this.data(l[0]) : d
    } else return this.each(function() {
      var m =
          c(this),n = [l[0],b];
      m.triggerHandler("setData" + l[1] + "!", n);
      c.data(this, a, b);
      m.triggerHandler("changeData" + l[1] + "!", n)
    })
  },removeData:function(a) {
    return this.each(function() {
      c.removeData(this, a)
    })
  }});
  c.extend({_mark:function(a, b) {
    if (a) {
      b = (b || "fx") + "mark";
      c.data(a, b, (c.data(a, b, v, true) || 0) + 1, true)
    }
  },_unmark:function(a, b, d) {
    if (a !== true) {
      d = b;
      b = a;
      a = false
    }
    if (b) {
      d = d || "fx";
      var e = d + "mark";
      if (a = a ? 0 : (c.data(b, e, v, true) || 1) - 1)c.data(b, e, a, true); else {
        c.removeData(b, e, true);
        xa(b, d, "mark")
      }
    }
  },queue:function(a, b, d) {
    if (a) {
      b =
          (b || "fx") + "queue";
      var e = c.data(a, b, v, true);
      if (d)if (!e || c.isArray(d))e = c.data(a, b, c.makeArray(d), true); else e.push(d);
      return e || []
    }
  },dequeue:function(a, b) {
    b = b || "fx";
    var d = c.queue(a, b),e = d.shift();
    if (e === "inprogress")e = d.shift();
    if (e) {
      b === "fx" && d.unshift("inprogress");
      e.call(a, function() {
        c.dequeue(a, b)
      })
    }
    if (!d.length) {
      c.removeData(a, b + "queue", true);
      xa(a, b, "queue")
    }
  }});
  c.fn.extend({queue:function(a, b) {
    if (typeof a !== "string") {
      b = a;
      a = "fx"
    }
    if (b === v)return c.queue(this[0], a);
    return this.each(function() {
      var d =
          c.queue(this, a, b);
      a === "fx" && d[0] !== "inprogress" && c.dequeue(this, a)
    })
  },dequeue:function(a) {
    return this.each(function() {
      c.dequeue(this, a)
    })
  },delay:function(a, b) {
    a = c.fx ? c.fx.speeds[a] || a : a;
    b = b || "fx";
    return this.queue(b, function() {
      var d = this;
      setTimeout(function() {
        c.dequeue(d, b)
      }, a)
    })
  },clearQueue:function(a) {
    return this.queue(a || "fx", [])
  },promise:function(a, b) {
    function d() {
      --g || e.resolveWith(f, [f])
    }

    if (typeof a !== "string") {
      b = a;
      a = v
    }
    a = a || "fx";
    var e = c.Deferred(),f = this;
    b = f.length;
    var g = 1,i = a + "defer",l = a + "queue";
    a = a + "mark";
    for (var m; b--;)if (m = c.data(f[b], i, v, true) || (c.data(f[b], l, v, true) || c.data(f[b], a, v, true)) && c.data(f[b], i, c._Deferred(), true)) {
      g++;
      m.done(d)
    }
    d();
    return e.promise()
  }});
  var Na = /[\n\t\r]/g,qa = /\s+/,yb = /\r/g,zb = /^(?:button|input)$/i,Ab = /^(?:button|input|object|select|textarea)$/i,Bb = /^a(?:rea)?$/i,Oa = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,Cb = /\:/,S,Pa;
  c.fn.extend({attr:function(a, b) {
    return c.access(this, a,
        b, true, c.attr)
  },removeAttr:function(a) {
    return this.each(function() {
      c.removeAttr(this, a)
    })
  },prop:function(a, b) {
    return c.access(this, a, b, true, c.prop)
  },removeProp:function(a) {
    a = c.propFix[a] || a;
    return this.each(function() {
      try {
        this[a] = v;
        delete this[a]
      } catch(b) {
      }
    })
  },addClass:function(a) {
    if (c.isFunction(a))return this.each(function(n) {
      var r = c(this);
      r.addClass(a.call(this, n, r.attr("class") || ""))
    });
    if (a && typeof a === "string")for (var b = (a || "").split(qa),d = 0,e = this.length; d < e; d++) {
      var f = this[d];
      if (f.nodeType ===
          1)if (f.className) {
        for (var g = " " + f.className + " ",i = f.className,l = 0,m = b.length; l < m; l++)if (g.indexOf(" " + b[l] + " ") < 0)i += " " + b[l];
        f.className = c.trim(i)
      } else f.className = a
    }
    return this
  },removeClass:function(a) {
    if (c.isFunction(a))return this.each(function(m) {
      var n = c(this);
      n.removeClass(a.call(this, m, n.attr("class")))
    });
    if (a && typeof a === "string" || a === v)for (var b = (a || "").split(qa),d = 0,e = this.length; d < e; d++) {
      var f = this[d];
      if (f.nodeType === 1 && f.className)if (a) {
        for (var g = (" " + f.className + " ").replace(Na, " "),
                 i = 0,l = b.length; i < l; i++)g = g.replace(" " + b[i] + " ", " ");
        f.className = c.trim(g)
      } else f.className = ""
    }
    return this
  },toggleClass:function(a, b) {
    var d = typeof a,e = typeof b === "boolean";
    if (c.isFunction(a))return this.each(function(f) {
      var g = c(this);
      g.toggleClass(a.call(this, f, g.attr("class"), b), b)
    });
    return this.each(function() {
      if (d === "string")for (var f,g = 0,i = c(this),l = b,m = a.split(qa); f = m[g++];) {
        l = e ? l : !i.hasClass(f);
        i[l ? "addClass" : "removeClass"](f)
      } else if (d === "undefined" || d === "boolean") {
        this.className && c._data(this,
            "__className__", this.className);
        this.className = this.className || a === false ? "" : c._data(this, "__className__") || ""
      }
    })
  },hasClass:function(a) {
    a = " " + a + " ";
    for (var b = 0,d = this.length; b < d; b++)if ((" " + this[b].className + " ").replace(Na, " ").indexOf(a) > -1)return true;
    return false
  },val:function(a) {
    var b,d,e = this[0];
    if (!arguments.length) {
      if (e) {
        if ((b = c.valHooks[e.nodeName.toLowerCase()] || c.valHooks[e.type]) && "get"in b && (d = b.get(e, "value")) !== v)return d;
        return(e.value || "").replace(yb, "")
      }
      return v
    }
    var f = c.isFunction(a);
    return this.each(function(g) {
      var i = c(this);
      if (this.nodeType === 1) {
        g = f ? a.call(this, g, i.val()) : a;
        if (g == null)g = ""; else if (typeof g === "number")g += ""; else if (c.isArray(g))g = c.map(g, function(l) {
          return l == null ? "" : l + ""
        });
        b = c.valHooks[this.nodeName.toLowerCase()] || c.valHooks[this.type];
        if (!b || !("set"in b) || b.set(this, g, "value") === v)this.value = g
      }
    })
  }});
  c.extend({valHooks:{option:{get:function(a) {
    var b = a.attributes.value;
    return!b || b.specified ? a.value : a.text
  }},select:{get:function(a) {
    var b,d = a.selectedIndex,e =
        [],f = a.options;
    a = a.type === "select-one";
    if (d < 0)return null;
    for (var g = a ? d : 0,i = a ? d + 1 : f.length; g < i; g++) {
      b = f[g];
      if (b.selected && (c.support.optDisabled ? !b.disabled : b.getAttribute("disabled") === null) && (!b.parentNode.disabled || !c.nodeName(b.parentNode, "optgroup"))) {
        b = c(b).val();
        if (a)return b;
        e.push(b)
      }
    }
    if (a && !e.length && f.length)return c(f[d]).val();
    return e
  },set:function(a, b) {
    var d = c.makeArray(b);
    c(a).find("option").each(function() {
      this.selected = c.inArray(c(this).val(), d) >= 0
    });
    if (!d.length)a.selectedIndex =
        -1;
    return d
  }}},attrFn:{val:true,css:true,html:true,text:true,data:true,width:true,height:true,offset:true},attrFix:{tabindex:"tabIndex"},attr:function(a, b, d, e) {
    var f = a.nodeType;
    if (!a || f === 3 || f === 8 || f === 2)return v;
    if (e && b in c.attrFn)return c(a)[b](d);
    if (!("getAttribute"in a))return c.prop(a, b, d);
    var g;
    b = (f = f !== 1 || !c.isXMLDoc(a)) && c.attrFix[b] || b;
    e = c.attrHooks[b];
    if (!e)if (Oa.test(b) && (typeof d === "boolean" || d === v || d.toLowerCase() === b.toLowerCase()))e = Pa; else if (S && (c.nodeName(a, "form") || Cb.test(b)))e =
        S;
    if (d !== v)if (d === null) {
      c.removeAttr(a, b);
      return v
    } else if (e && "set"in e && f && (g = e.set(a, d, b)) !== v)return g; else {
      a.setAttribute(b, "" + d);
      return d
    } else if (e && "get"in e && f)return e.get(a, b); else {
      g = a.getAttribute(b);
      return g === null ? v : g
    }
  },removeAttr:function(a, b) {
    var d;
    if (a.nodeType === 1) {
      b = c.attrFix[b] || b;
      if (c.support.getSetAttribute)a.removeAttribute(b); else {
        c.attr(a, b, "");
        a.removeAttributeNode(a.getAttributeNode(b))
      }
      if (Oa.test(b) && (d = c.propFix[b] || b)in a)a[d] = false
    }
  },attrHooks:{type:{set:function(a, b) {
    if (zb.test(a.nodeName) &&
        a.parentNode)c.error("type property can't be changed"); else if (!c.support.radioValue && b === "radio" && c.nodeName(a, "input")) {
      var d = a.value;
      a.setAttribute("type", b);
      if (d)a.value = d;
      return b
    }
  }},tabIndex:{get:function(a) {
    var b = a.getAttributeNode("tabIndex");
    return b && b.specified ? parseInt(b.value, 10) : Ab.test(a.nodeName) || Bb.test(a.nodeName) && a.href ? 0 : v
  }}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",
    rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a, b, d) {
    var e = a.nodeType;
    if (!a || e === 3 || e === 8 || e === 2)return v;
    var f;
    b = (e !== 1 || !c.isXMLDoc(a)) && c.propFix[b] || b;
    e = c.propHooks[b];
    return d !== v ? e && "set"in e && (f = e.set(a, d, b)) !== v ? f : (a[b] = d) : e && "get"in e && (f = e.get(a, b)) !== v ? f : a[b]
  },propHooks:{}});
  Pa = {get:function(a, b) {
    return a[c.propFix[b] || b] ? b.toLowerCase() : v
  },set:function(a, b, d) {
    var e;
    if (b === false)c.removeAttr(a, d); else {
      e = c.propFix[d] ||
          d;
      if (e in a)a[e] = b;
      a.setAttribute(d, d.toLowerCase())
    }
    return d
  }};
  c.attrHooks.value = {get:function(a, b) {
    if (S && c.nodeName(a, "button"))return S.get(a, b);
    return a.value
  },set:function(a, b, d) {
    if (S && c.nodeName(a, "button"))return S.set(a, b, d);
    a.value = b
  }};
  if (!c.support.getSetAttribute) {
    c.attrFix = c.propFix;
    S = c.attrHooks.name = c.valHooks.button = {get:function(a, b) {
      return(a = a.getAttributeNode(b)) && a.nodeValue !== "" ? a.nodeValue : v
    },set:function(a, b, d) {
      if (a = a.getAttributeNode(d))return a.nodeValue = b
    }};
    c.each(["width",
      "height"], function(a, b) {
      c.attrHooks[b] = c.extend(c.attrHooks[b], {set:function(d, e) {
        if (e === "") {
          d.setAttribute(b, "auto");
          return e
        }
      }})
    })
  }
  c.support.hrefNormalized || c.each(["href","src","width","height"], function(a, b) {
    c.attrHooks[b] = c.extend(c.attrHooks[b], {get:function(d) {
      d = d.getAttribute(b, 2);
      return d === null ? v : d
    }})
  });
  if (!c.support.style)c.attrHooks.style = {get:function(a) {
    return a.style.cssText.toLowerCase() || v
  },set:function(a, b) {
    return a.style.cssText = "" + b
  }};
  if (!c.support.optSelected)c.propHooks.selected =
      c.extend(c.propHooks.selected, {get:function() {
      }});
  c.support.checkOn || c.each(["radio","checkbox"], function() {
    c.valHooks[this] = {get:function(a) {
      return a.getAttribute("value") === null ? "on" : a.value
    }}
  });
  c.each(["radio","checkbox"], function() {
    c.valHooks[this] = c.extend(c.valHooks[this], {set:function(a, b) {
      if (c.isArray(b))return a.checked = c.inArray(c(a).val(), b) >= 0
    }})
  });
  var ja = /\.(.*)$/,ra = /^(?:textarea|input|select)$/i,jb = /\./g,kb = / /g,Db = /[^\w\s.|`]/g,Eb = function(a) {
    return a.replace(Db, "\\$&")
  };
  c.event = {add:function(a, b, d, e) {
    if (!(a.nodeType === 3 || a.nodeType === 8)) {
      if (d === false)d = Q; else if (!d)return;
      var f,g;
      if (d.handler) {
        f = d;
        d = f.handler
      }
      if (!d.guid)d.guid = c.guid++;
      if (g = c._data(a)) {
        var i = g.events,l = g.handle;
        if (!i)g.events = i = {};
        if (!l)g.handle = l = function(C) {
          return typeof c !== "undefined" && (!C || c.event.triggered !== C.type) ? c.event.handle.apply(l.elem, arguments) : v
        };
        l.elem = a;
        b = b.split(" ");
        for (var m,n = 0,r; m = b[n++];) {
          g = f ? c.extend({}, f) : {handler:d,data:e};
          if (m.indexOf(".") > -1) {
            r = m.split(".");
            m = r.shift();
            g.namespace = r.slice(0).sort().join(".")
          } else {
            r =
                [];
            g.namespace = ""
          }
          g.type = m;
          if (!g.guid)g.guid = d.guid;
          var A = i[m],B = c.event.special[m] || {};
          if (!A) {
            A = i[m] = [];
            if (!B.setup || B.setup.call(a, e, r, l) === false)if (a.addEventListener)a.addEventListener(m, l, false); else a.attachEvent && a.attachEvent("on" + m, l)
          }
          if (B.add) {
            B.add.call(a, g);
            if (!g.handler.guid)g.handler.guid = d.guid
          }
          A.push(g);
          c.event.global[m] = true
        }
        a = null
      }
    }
  },global:{},remove:function(a, b, d, e) {
    if (!(a.nodeType === 3 || a.nodeType === 8)) {
      if (d === false)d = Q;
      var f,g,i = 0,l,m,n,r,A,B,C = c.hasData(a) && c._data(a),G = C && C.events;
      if (C && G) {
        if (b && b.type) {
          d = b.handler;
          b = b.type
        }
        if (!b || typeof b === "string" && b.charAt(0) === ".") {
          b = b || "";
          for (f in G)c.event.remove(a, f + b)
        } else {
          for (b = b.split(" "); f = b[i++];) {
            r = f;
            l = f.indexOf(".") < 0;
            m = [];
            if (!l) {
              m = f.split(".");
              f = m.shift();
              n = new RegExp("(^|\\.)" + c.map(m.slice(0).sort(), Eb).join("\\.(?:.*\\.)?") + "(\\.|$)")
            }
            if (A = G[f])if (d) {
              r = c.event.special[f] || {};
              for (g = e || 0; g < A.length; g++) {
                B = A[g];
                if (d.guid === B.guid) {
                  if (l || n.test(B.namespace)) {
                    e == null && A.splice(g--, 1);
                    r.remove && r.remove.call(a, B)
                  }
                  if (e != null)break
                }
              }
              if (A.length ===
                  0 || e != null && A.length === 1) {
                if (!r.teardown || r.teardown.call(a, m) === false)c.removeEvent(a, f, C.handle);
                delete G[f]
              }
            } else for (g = 0; g < A.length; g++) {
              B = A[g];
              if (l || n.test(B.namespace)) {
                c.event.remove(a, r, B.handler, g);
                A.splice(g--, 1)
              }
            }
          }
          if (c.isEmptyObject(G)) {
            if (b = C.handle)b.elem = null;
            delete C.events;
            delete C.handle;
            c.isEmptyObject(C) && c.removeData(a, v, true)
          }
        }
      }
    }
  },customEvent:{getData:true,setData:true,changeData:true},trigger:function(a, b, d, e) {
    var f = a.type || a,g = [],i;
    if (f.indexOf("!") >= 0) {
      f = f.slice(0, -1);
      i = true
    }
    if (f.indexOf(".") >=
        0) {
      g = f.split(".");
      f = g.shift();
      g.sort()
    }
    if (!((!d || c.event.customEvent[f]) && !c.event.global[f])) {
      a = typeof a === "object" ? a[c.expando] ? a : new c.Event(f, a) : new c.Event(f);
      a.type = f;
      a.exclusive = i;
      a.namespace = g.join(".");
      a.namespace_re = new RegExp("(^|\\.)" + g.join("\\.(?:.*\\.)?") + "(\\.|$)");
      if (e || !d) {
        a.preventDefault();
        a.stopPropagation()
      }
      if (d) {
        if (!(d.nodeType === 3 || d.nodeType === 8)) {
          a.result = v;
          a.target = d;
          b = b ? c.makeArray(b) : [];
          b.unshift(a);
          g = d;
          e = f.indexOf(":") < 0 ? "on" + f : "";
          do{
            i = c._data(g, "handle");
            a.currentTarget =
                g;
            i && i.apply(g, b);
            if (e && c.acceptData(g) && g[e] && g[e].apply(g, b) === false) {
              a.result = false;
              a.preventDefault()
            }
            g = g.parentNode || g.ownerDocument || g === a.target.ownerDocument && E
          } while (g && !a.isPropagationStopped());
          if (!a.isDefaultPrevented()) {
            var l;
            g = c.event.special[f] || {};
            if ((!g._default || g._default.call(d.ownerDocument, a) === false) && !(f === "click" && c.nodeName(d, "a")) && c.acceptData(d)) {
              try {
                if (e && d[f]) {
                  if (l = d[e])d[e] = null;
                  c.event.triggered = f;
                  d[f]()
                }
              } catch(m) {
              }
              if (l)d[e] = l;
              c.event.triggered = v
            }
          }
          return a.result
        }
      } else c.each(c.cache,
          function() {
            var n = this[c.expando];
            n && n.events && n.events[f] && c.event.trigger(a, b, n.handle.elem)
          })
    }
  },handle:function(a) {
    a = c.event.fix(a || E.event);
    var b = ((c._data(this, "events") || {})[a.type] || []).slice(0),d = !a.exclusive && !a.namespace,e = Array.prototype.slice.call(arguments, 0);
    e[0] = a;
    a.currentTarget = this;
    for (var f = 0,g = b.length; f < g; f++) {
      var i = b[f];
      if (d || a.namespace_re.test(i.namespace)) {
        a.handler = i.handler;
        a.data = i.data;
        a.handleObj = i;
        i = i.handler.apply(this, e);
        if (i !== v) {
          a.result = i;
          if (i === false) {
            a.preventDefault();
            a.stopPropagation()
          }
        }
        if (a.isImmediatePropagationStopped())break
      }
    }
    return a.result
  },props:"altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),fix:function(a) {
    if (a[c.expando])return a;
    var b = a;
    a = c.Event(b);
    for (var d = this.props.length,
             e; d;) {
      e = this.props[--d];
      a[e] = b[e]
    }
    if (!a.target)a.target = a.srcElement || x;
    if (a.target.nodeType === 3)a.target = a.target.parentNode;
    if (!a.relatedTarget && a.fromElement)a.relatedTarget = a.fromElement === a.target ? a.toElement : a.fromElement;
    if (a.pageX == null && a.clientX != null) {
      d = a.target.ownerDocument || x;
      b = d.documentElement;
      d = d.body;
      a.pageX = a.clientX + (b && b.scrollLeft || d && d.scrollLeft || 0) - (b && b.clientLeft || d && d.clientLeft || 0);
      a.pageY = a.clientY + (b && b.scrollTop || d && d.scrollTop || 0) - (b && b.clientTop || d && d.clientTop ||
          0)
    }
    if (a.which == null && (a.charCode != null || a.keyCode != null))a.which = a.charCode != null ? a.charCode : a.keyCode;
    if (!a.metaKey && a.ctrlKey)a.metaKey = a.ctrlKey;
    if (!a.which && a.button !== v)a.which = a.button & 1 ? 1 : a.button & 2 ? 3 : a.button & 4 ? 2 : 0;
    return a
  },guid:1E8,proxy:c.proxy,special:{ready:{setup:c.bindReady,teardown:c.noop},live:{add:function(a) {
    c.event.add(this, ba(a.origType, a.selector), c.extend({}, a, {handler:ib,guid:a.handler.guid}))
  },remove:function(a) {
    c.event.remove(this, ba(a.origType, a.selector), a)
  }},beforeunload:{setup:function(a, b, d) {
    if (c.isWindow(this))this.onbeforeunload = d
  },teardown:function(a, b) {
    if (this.onbeforeunload === b)this.onbeforeunload = null
  }}}};
  c.removeEvent = x.removeEventListener ? function(a, b, d) {
    a.removeEventListener && a.removeEventListener(b, d, false)
  } : function(a, b, d) {
    a.detachEvent && a.detachEvent("on" + b, d)
  };
  c.Event = function(a, b) {
    if (!this.preventDefault)return new c.Event(a, b);
    if (a && a.type) {
      this.originalEvent = a;
      this.type = a.type;
      this.isDefaultPrevented = a.defaultPrevented || a.returnValue === false || a.getPreventDefault &&
          a.getPreventDefault() ? aa : Q
    } else this.type = a;
    b && c.extend(this, b);
    this.timeStamp = c.now();
    this[c.expando] = true
  };
  c.Event.prototype = {preventDefault:function() {
    this.isDefaultPrevented = aa;
    var a = this.originalEvent;
    if (a)if (a.preventDefault)a.preventDefault(); else a.returnValue = false
  },stopPropagation:function() {
    this.isPropagationStopped = aa;
    var a = this.originalEvent;
    if (a) {
      a.stopPropagation && a.stopPropagation();
      a.cancelBubble = true
    }
  },stopImmediatePropagation:function() {
    this.isImmediatePropagationStopped = aa;
    this.stopPropagation()
  },
    isDefaultPrevented:Q,isPropagationStopped:Q,isImmediatePropagationStopped:Q};
  var Qa = function(a) {
    var b = a.relatedTarget;
    a.type = a.data;
    try {
      if (!(b && b !== x && !b.parentNode)) {
        for (; b && b !== this;)b = b.parentNode;
        b !== this && c.event.handle.apply(this, arguments)
      }
    } catch(d) {
    }
  },Ra = function(a) {
    a.type = a.data;
    c.event.handle.apply(this, arguments)
  };
  c.each({mouseenter:"mouseover",mouseleave:"mouseout"}, function(a, b) {
    c.event.special[a] = {setup:function(d) {
      c.event.add(this, b, d && d.selector ? Ra : Qa, a)
    },teardown:function(d) {
      c.event.remove(this,
          b, d && d.selector ? Ra : Qa)
    }}
  });
  if (!c.support.submitBubbles)c.event.special.submit = {setup:function() {
    if (c.nodeName(this, "form"))return false; else {
      c.event.add(this, "click.specialSubmit", function(a) {
        var b = a.target,d = b.type;
        if ((d === "submit" || d === "image") && c(b).closest("form").length)ya("submit", this, arguments)
      });
      c.event.add(this, "keypress.specialSubmit", function(a) {
        var b = a.target,d = b.type;
        if ((d === "text" || d === "password") && c(b).closest("form").length && a.keyCode === 13)ya("submit", this, arguments)
      })
    }
  },teardown:function() {
    c.event.remove(this,
        ".specialSubmit")
  }};
  if (!c.support.changeBubbles) {
    var $,Sa = function(a) {
      var b = a.type,d = a.value;
      if (b === "radio" || b === "checkbox")d = a.checked; else if (b === "select-multiple")d = a.selectedIndex > -1 ? c.map(a.options,
          function(e) {
            return e.selected
          }).join("-") : ""; else if (c.nodeName(a, "select"))d = a.selectedIndex;
      return d
    },fa = function(a, b) {
      var d = a.target,e,f;
      if (!(!ra.test(d.nodeName) || d.readOnly)) {
        e = c._data(d, "_change_data");
        f = Sa(d);
        if (a.type !== "focusout" || d.type !== "radio")c._data(d, "_change_data", f);
        if (!(e === v || f ===
            e))if (e != null || f) {
          a.type = "change";
          a.liveFired = v;
          c.event.trigger(a, b, d)
        }
      }
    };
    c.event.special.change = {filters:{focusout:fa,beforedeactivate:fa,click:function(a) {
      var b = a.target,d = c.nodeName(b, "input") ? b.type : "";
      if (d === "radio" || d === "checkbox" || c.nodeName(b, "select"))fa.call(this, a)
    },keydown:function(a) {
      var b = a.target,d = c.nodeName(b, "input") ? b.type : "";
      if (a.keyCode === 13 && !c.nodeName(b, "textarea") || a.keyCode === 32 && (d === "checkbox" || d === "radio") || d === "select-multiple")fa.call(this, a)
    },beforeactivate:function(a) {
      a =
          a.target;
      c._data(a, "_change_data", Sa(a))
    }},setup:function() {
      if (this.type === "file")return false;
      for (var a in $)c.event.add(this, a + ".specialChange", $[a]);
      return ra.test(this.nodeName)
    },teardown:function() {
      c.event.remove(this, ".specialChange");
      return ra.test(this.nodeName)
    }};
    $ = c.event.special.change.filters;
    $.focus = $.beforeactivate
  }
  c.support.focusinBubbles || c.each({focus:"focusin",blur:"focusout"}, function(a, b) {
    function d(f) {
      var g = c.event.fix(f);
      g.type = b;
      g.originalEvent = {};
      c.event.trigger(g, null, g.target);
      g.isDefaultPrevented() && f.preventDefault()
    }

    var e = 0;
    c.event.special[b] = {setup:function() {
      e++ === 0 && x.addEventListener(a, d, true)
    },teardown:function() {
      --e === 0 && x.removeEventListener(a, d, true)
    }}
  });
  c.each(["bind","one"], function(a, b) {
    c.fn[b] = function(d, e, f) {
      var g;
      if (typeof d === "object") {
        for (var i in d)this[b](i, e, d[i], f);
        return this
      }
      if (arguments.length === 2 || e === false) {
        f = e;
        e = v
      }
      if (b === "one") {
        g = function(m) {
          c(this).unbind(m, g);
          return f.apply(this, arguments)
        };
        g.guid = f.guid || c.guid++
      } else g = f;
      if (d === "unload" &&
          b !== "one")this.one(d, e, f); else {
        i = 0;
        for (var l = this.length; i < l; i++)c.event.add(this[i], d, g, e)
      }
      return this
    }
  });
  c.fn.extend({unbind:function(a, b) {
    if (typeof a === "object" && !a.preventDefault)for (var d in a)this.unbind(d, a[d]); else {
      d = 0;
      for (var e = this.length; d < e; d++)c.event.remove(this[d], a, b)
    }
    return this
  },delegate:function(a, b, d, e) {
    return this.live(b, d, e, a)
  },undelegate:function(a, b, d) {
    return arguments.length === 0 ? this.unbind("live") : this.die(b, null, d, a)
  },trigger:function(a, b) {
    return this.each(function() {
      c.event.trigger(a,
          b, this)
    })
  },triggerHandler:function(a, b) {
    if (this[0])return c.event.trigger(a, b, this[0], true)
  },toggle:function(a) {
    var b = arguments,d = a.guid || c.guid++,e = 0,f = function(g) {
      var i = (c.data(this, "lastToggle" + a.guid) || 0) % e;
      c.data(this, "lastToggle" + a.guid, i + 1);
      g.preventDefault();
      return b[i].apply(this, arguments) || false
    };
    for (f.guid = d; e < b.length;)b[e++].guid = d;
    return this.click(f)
  },hover:function(a, b) {
    return this.mouseenter(a).mouseleave(b || a)
  }});
  var sa = {focus:"focusin",blur:"focusout",mouseenter:"mouseover",mouseleave:"mouseout"};
  c.each(["live","die"], function(a, b) {
    c.fn[b] = function(d, e, f, g) {
      var i = 0,l,m,n = g || this.selector,r = g ? this : c(this.context);
      if (typeof d === "object" && !d.preventDefault) {
        for (l in d)r[b](l, e, d[l], n);
        return this
      }
      if (b === "die" && !d && g && g.charAt(0) === ".") {
        r.unbind(g);
        return this
      }
      if (e === false || c.isFunction(e)) {
        f = e || Q;
        e = v
      }
      for (d = (d || "").split(" "); (g = d[i++]) != null;) {
        l = ja.exec(g);
        m = "";
        if (l) {
          m = l[0];
          g = g.replace(ja, "")
        }
        if (g === "hover")d.push("mouseenter" + m, "mouseleave" + m); else {
          l = g;
          if (sa[g]) {
            d.push(sa[g] + m);
            g += m
          } else g =
              (sa[g] || g) + m;
          if (b === "live") {
            m = 0;
            for (var A = r.length; m < A; m++)c.event.add(r[m], "live." + ba(g, n), {data:e,selector:n,handler:f,origType:g,origHandler:f,preType:l})
          } else r.unbind("live." + ba(g, n), f)
        }
      }
      return this
    }
  });
  c.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "), function(a, b) {
    c.fn[b] = function(d, e) {
      if (e == null) {
        e = d;
        d = null
      }
      return arguments.length > 0 ? this.bind(b,
          d, e) : this.trigger(b)
    };
    if (c.attrFn)c.attrFn[b] = true
  });
  (function() {
    function a(h, j, o, p, q, t) {
      q = 0;
      for (var y = p.length; q < y; q++) {
        var w = p[q];
        if (w) {
          var D = false;
          for (w = w[h]; w;) {
            if (w.sizcache === o) {
              D = p[w.sizset];
              break
            }
            if (w.nodeType === 1 && !t) {
              w.sizcache = o;
              w.sizset = q
            }
            if (w.nodeName.toLowerCase() === j) {
              D = w;
              break
            }
            w = w[h]
          }
          p[q] = D
        }
      }
    }

    function b(h, j, o, p, q, t) {
      q = 0;
      for (var y = p.length; q < y; q++) {
        var w = p[q];
        if (w) {
          var D = false;
          for (w = w[h]; w;) {
            if (w.sizcache === o) {
              D = p[w.sizset];
              break
            }
            if (w.nodeType === 1) {
              if (!t) {
                w.sizcache = o;
                w.sizset = q
              }
              if (typeof j !==
                  "string") {
                if (w === j) {
                  D = true;
                  break
                }
              } else if (n.filter(j, [w]).length > 0) {
                D = w;
                break
              }
            }
            w = w[h]
          }
          p[q] = D
        }
      }
    }

    var d = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,e = 0,f = Object.prototype.toString,g = false,i = true,l = /\\/g,m = /\W/;
    [0,0].sort(function() {
      i = false;
      return 0
    });
    var n = function(h, j, o, p) {
      o = o || [];
      var q = j = j || x;
      if (j.nodeType !== 1 && j.nodeType !== 9)return[];
      if (!h || typeof h !== "string")return o;
      var t,y,w,D,L,k = true,s = n.isXML(j),u = [],
          z = h;
      do{
        d.exec("");
        if (t = d.exec(z)) {
          z = t[3];
          u.push(t[1]);
          if (t[2]) {
            D = t[3];
            break
          }
        }
      } while (t);
      if (u.length > 1 && A.exec(h))if (u.length === 2 && r.relative[u[0]])y = O(u[0] + u[1], j); else for (y = r.relative[u[0]] ? [j] : n(u.shift(), j); u.length;) {
        h = u.shift();
        if (r.relative[h])h += u.shift();
        y = O(h, y)
      } else {
        if (!p && u.length > 1 && j.nodeType === 9 && !s && r.match.ID.test(u[0]) && !r.match.ID.test(u[u.length - 1])) {
          t = n.find(u.shift(), j, s);
          j = t.expr ? n.filter(t.expr, t.set)[0] : t.set[0]
        }
        if (j) {
          t = p ? {expr:u.pop(),set:G(p)} : n.find(u.pop(), u.length === 1 &&
              (u[0] === "~" || u[0] === "+") && j.parentNode ? j.parentNode : j, s);
          y = t.expr ? n.filter(t.expr, t.set) : t.set;
          if (u.length > 0)w = G(y); else k = false;
          for (; u.length;) {
            t = L = u.pop();
            if (r.relative[L])t = u.pop(); else L = "";
            if (t == null)t = j;
            r.relative[L](w, t, s)
          }
        } else w = []
      }
      w || (w = y);
      w || n.error(L || h);
      if (f.call(w) === "[object Array]")if (k)if (j && j.nodeType === 1)for (h = 0; w[h] != null; h++) {
        if (w[h] && (w[h] === true || w[h].nodeType === 1 && n.contains(j, w[h])))o.push(y[h])
      } else for (h = 0; w[h] != null; h++)w[h] && w[h].nodeType === 1 && o.push(y[h]); else o.push.apply(o,
          w); else G(w, o);
      if (D) {
        n(D, q, o, p);
        n.uniqueSort(o)
      }
      return o
    };
    n.uniqueSort = function(h) {
      if (I) {
        g = i;
        h.sort(I);
        if (g)for (var j = 1; j < h.length; j++)h[j] === h[j - 1] && h.splice(j--, 1)
      }
      return h
    };
    n.matches = function(h, j) {
      return n(h, null, null, j)
    };
    n.matchesSelector = function(h, j) {
      return n(j, null, null, [h]).length > 0
    };
    n.find = function(h, j, o) {
      var p;
      if (!h)return[];
      for (var q = 0,t = r.order.length; q < t; q++) {
        var y,w = r.order[q];
        if (y = r.leftMatch[w].exec(h)) {
          var D = y[1];
          y.splice(1, 1);
          if (D.substr(D.length - 1) !== "\\") {
            y[1] = (y[1] || "").replace(l,
                "");
            p = r.find[w](y, j, o);
            if (p != null) {
              h = h.replace(r.match[w], "");
              break
            }
          }
        }
      }
      p || (p = typeof j.getElementsByTagName !== "undefined" ? j.getElementsByTagName("*") : []);
      return{set:p,expr:h}
    };
    n.filter = function(h, j, o, p) {
      for (var q,t,y = h,w = [],D = j,L = j && j[0] && n.isXML(j[0]); h && j.length;) {
        for (var k in r.filter)if ((q = r.leftMatch[k].exec(h)) != null && q[2]) {
          var s,u,z = r.filter[k];
          u = q[1];
          t = false;
          q.splice(1, 1);
          if (u.substr(u.length - 1) !== "\\") {
            if (D === w)w = [];
            if (r.preFilter[k])if (q = r.preFilter[k](q, D, o, w, p, L)) {
              if (q === true)continue
            } else t =
                s = true;
            if (q)for (var H = 0; (u = D[H]) != null; H++)if (u) {
              s = z(u, q, H, D);
              var F = p ^ !!s;
              if (o && s != null)if (F)t = true; else D[H] = false; else if (F) {
                w.push(u);
                t = true
              }
            }
            if (s !== v) {
              o || (D = w);
              h = h.replace(r.match[k], "");
              if (!t)return[];
              break
            }
          }
        }
        if (h === y)if (t == null)n.error(h); else break;
        y = h
      }
      return D
    };
    n.error = function(h) {
      throw"Syntax error, unrecognized expression: " + h;
    };
    var r = n.selectors = {order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
      ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(h) {
      return h.getAttribute("href")
    },
      type:function(h) {
        return h.getAttribute("type")
      }},relative:{"+":function(h, j) {
      var o = typeof j === "string",p = o && !m.test(j);
      o = o && !p;
      if (p)j = j.toLowerCase();
      p = 0;
      for (var q = h.length,t; p < q; p++)if (t = h[p]) {
        for (; (t = t.previousSibling) && t.nodeType !== 1;);
        h[p] = o || t && t.nodeName.toLowerCase() === j ? t || false : t === j
      }
      o && n.filter(j, h, true)
    },">":function(h, j) {
      var o,p = typeof j === "string",q = 0,t = h.length;
      if (p && !m.test(j))for (j = j.toLowerCase(); q < t; q++) {
        if (o = h[q]) {
          o = o.parentNode;
          h[q] = o.nodeName.toLowerCase() === j ? o : false
        }
      } else {
        for (; q <
                   t; q++)if (o = h[q])h[q] = p ? o.parentNode : o.parentNode === j;
        p && n.filter(j, h, true)
      }
    },"":function(h, j, o) {
      var p,q = e++,t = b;
      if (typeof j === "string" && !m.test(j)) {
        p = j = j.toLowerCase();
        t = a
      }
      t("parentNode", j, q, h, p, o)
    },"~":function(h, j, o) {
      var p,q = e++,t = b;
      if (typeof j === "string" && !m.test(j)) {
        p = j = j.toLowerCase();
        t = a
      }
      t("previousSibling", j, q, h, p, o)
    }},find:{ID:function(h, j, o) {
      if (typeof j.getElementById !== "undefined" && !o)return(h = j.getElementById(h[1])) && h.parentNode ? [h] : []
    },NAME:function(h, j) {
      if (typeof j.getElementsByName !==
          "undefined") {
        var o = [];
        j = j.getElementsByName(h[1]);
        for (var p = 0,q = j.length; p < q; p++)j[p].getAttribute("name") === h[1] && o.push(j[p]);
        return o.length === 0 ? null : o
      }
    },TAG:function(h, j) {
      if (typeof j.getElementsByTagName !== "undefined")return j.getElementsByTagName(h[1])
    }},preFilter:{CLASS:function(h, j, o, p, q, t) {
      h = " " + h[1].replace(l, "") + " ";
      if (t)return h;
      t = 0;
      for (var y; (y = j[t]) != null; t++)if (y)if (q ^ (y.className && (" " + y.className + " ").replace(/[\t\n\r]/g, " ").indexOf(h) >= 0))o || p.push(y); else if (o)j[t] = false;
      return false
    },
      ID:function(h) {
        return h[1].replace(l, "")
      },TAG:function(h) {
        return h[1].replace(l, "").toLowerCase()
      },CHILD:function(h) {
        if (h[1] === "nth") {
          h[2] || n.error(h[0]);
          h[2] = h[2].replace(/^\+|\s*/g, "");
          var j = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(h[2] === "even" && "2n" || h[2] === "odd" && "2n+1" || !/\D/.test(h[2]) && "0n+" + h[2] || h[2]);
          h[2] = j[1] + (j[2] || 1) - 0;
          h[3] = j[3] - 0
        } else h[2] && n.error(h[0]);
        h[0] = e++;
        return h
      },ATTR:function(h, j, o, p, q, t) {
        j = h[1] = h[1].replace(l, "");
        if (!t && r.attrMap[j])h[1] = r.attrMap[j];
        h[4] = (h[4] || h[5] || "").replace(l,
            "");
        if (h[2] === "~=")h[4] = " " + h[4] + " ";
        return h
      },PSEUDO:function(h, j, o, p, q) {
        if (h[1] === "not")if ((d.exec(h[3]) || "").length > 1 || /^\w/.test(h[3]))h[3] = n(h[3], null, null, j); else {
          h = n.filter(h[3], j, o, true ^ q);
          o || p.push.apply(p, h);
          return false
        } else if (r.match.POS.test(h[0]) || r.match.CHILD.test(h[0]))return true;
        return h
      },POS:function(h) {
        h.unshift(true);
        return h
      }},filters:{enabled:function(h) {
      return h.disabled === false && h.type !== "hidden"
    },disabled:function(h) {
      return h.disabled === true
    },checked:function(h) {
      return h.checked ===
          true
    },selected:function(h) {
      return h.selected === true
    },parent:function(h) {
      return!!h.firstChild
    },empty:function(h) {
      return!h.firstChild
    },has:function(h, j, o) {
      return!!n(o[3], h).length
    },header:function(h) {
      return/h\d/i.test(h.nodeName)
    },text:function(h) {
      var j = h.getAttribute("type"),o = h.type;
      return h.nodeName.toLowerCase() === "input" && "text" === o && (j === o || j === null)
    },radio:function(h) {
      return h.nodeName.toLowerCase() === "input" && "radio" === h.type
    },checkbox:function(h) {
      return h.nodeName.toLowerCase() === "input" &&
          "checkbox" === h.type
    },file:function(h) {
      return h.nodeName.toLowerCase() === "input" && "file" === h.type
    },password:function(h) {
      return h.nodeName.toLowerCase() === "input" && "password" === h.type
    },submit:function(h) {
      var j = h.nodeName.toLowerCase();
      return(j === "input" || j === "button") && "submit" === h.type
    },image:function(h) {
      return h.nodeName.toLowerCase() === "input" && "image" === h.type
    },reset:function(h) {
      var j = h.nodeName.toLowerCase();
      return(j === "input" || j === "button") && "reset" === h.type
    },button:function(h) {
      var j = h.nodeName.toLowerCase();
      return j === "input" && "button" === h.type || j === "button"
    },input:function(h) {
      return/input|select|textarea|button/i.test(h.nodeName)
    },focus:function(h) {
      return h === h.ownerDocument.activeElement
    }},setFilters:{first:function(h, j) {
      return j === 0
    },last:function(h, j, o, p) {
      return j === p.length - 1
    },even:function(h, j) {
      return j % 2 === 0
    },odd:function(h, j) {
      return j % 2 === 1
    },lt:function(h, j, o) {
      return j < o[3] - 0
    },gt:function(h, j, o) {
      return j > o[3] - 0
    },nth:function(h, j, o) {
      return o[3] - 0 === j
    },eq:function(h, j, o) {
      return o[3] - 0 === j
    }},filter:{PSEUDO:function(h, j, o, p) {
      var q = j[1],t = r.filters[q];
      if (t)return t(h, o, j, p); else if (q === "contains")return(h.textContent || h.innerText || n.getText([h]) || "").indexOf(j[3]) >= 0; else if (q === "not") {
        j = j[3];
        o = 0;
        for (p = j.length; o < p; o++)if (j[o] === h)return false;
        return true
      } else n.error(q)
    },CHILD:function(h, j) {
      var o = j[1],p = h;
      switch (o) {
        case "only":
        case "first":
          for (; p = p.previousSibling;)if (p.nodeType === 1)return false;
          if (o === "first")return true;
          p = h;
        case "last":
          for (; p = p.nextSibling;)if (p.nodeType === 1)return false;
          return true;
        case "nth":
          o =
              j[2];
          var q = j[3];
          if (o === 1 && q === 0)return true;
          j = j[0];
          var t = h.parentNode;
          if (t && (t.sizcache !== j || !h.nodeIndex)) {
            var y = 0;
            for (p = t.firstChild; p; p = p.nextSibling)if (p.nodeType === 1)p.nodeIndex = ++y;
            t.sizcache = j
          }
          h = h.nodeIndex - q;
          return o === 0 ? h === 0 : h % o === 0 && h / o >= 0
      }
    },ID:function(h, j) {
      return h.nodeType === 1 && h.getAttribute("id") === j
    },TAG:function(h, j) {
      return j === "*" && h.nodeType === 1 || h.nodeName.toLowerCase() === j
    },CLASS:function(h, j) {
      return(" " + (h.className || h.getAttribute("class")) + " ").indexOf(j) > -1
    },ATTR:function(h, j) {
      var o = j[1];
      h = r.attrHandle[o] ? r.attrHandle[o](h) : h[o] != null ? h[o] : h.getAttribute(o);
      o = h + "";
      var p = j[2];
      j = j[4];
      return h == null ? p === "!=" : p === "=" ? o === j : p === "*=" ? o.indexOf(j) >= 0 : p === "~=" ? (" " + o + " ").indexOf(j) >= 0 : !j ? o && h !== false : p === "!=" ? o !== j : p === "^=" ? o.indexOf(j) === 0 : p === "$=" ? o.substr(o.length - j.length) === j : p === "|=" ? o === j || o.substr(0, j.length + 1) === j + "-" : false
    },POS:function(h, j, o, p) {
      var q = r.setFilters[j[2]];
      if (q)return q(h, o, j, p)
    }}},A = r.match.POS,B = function(h, j) {
      return"\\" + (j - 0 + 1)
    };
    for (var C in r.match) {
      r.match[C] =
          new RegExp(r.match[C].source + /(?![^\[]*\])(?![^\(]*\))/.source);
      r.leftMatch[C] = new RegExp(/(^(?:.|\r|\n)*?)/.source + r.match[C].source.replace(/\\(\d+)/g, B))
    }
    var G = function(h, j) {
      h = Array.prototype.slice.call(h, 0);
      if (j) {
        j.push.apply(j, h);
        return j
      }
      return h
    };
    try {
      Array.prototype.slice.call(x.documentElement.childNodes, 0)
    } catch(R) {
      G = function(h, j) {
        var o = 0;
        j = j || [];
        if (f.call(h) === "[object Array]")Array.prototype.push.apply(j, h); else if (typeof h.length === "number")for (var p = h.length; o < p; o++)j.push(h[o]); else for (; h[o]; o++)j.push(h[o]);
        return j
      }
    }
    var I,M;
    if (x.documentElement.compareDocumentPosition)I = function(h, j) {
      if (h === j) {
        g = true;
        return 0
      }
      if (!h.compareDocumentPosition || !j.compareDocumentPosition)return h.compareDocumentPosition ? -1 : 1;
      return h.compareDocumentPosition(j) & 4 ? -1 : 1
    }; else {
      I = function(h, j) {
        if (h === j) {
          g = true;
          return 0
        } else if (h.sourceIndex && j.sourceIndex)return h.sourceIndex - j.sourceIndex;
        var o,p,q = [],t = [];
        o = h.parentNode;
        p = j.parentNode;
        var y = o;
        if (o === p)return M(h, j); else if (o) {
          if (!p)return 1
        } else return-1;
        for (; y;) {
          q.unshift(y);
          y = y.parentNode
        }
        for (y = p; y;) {
          t.unshift(y);
          y = y.parentNode
        }
        o = q.length;
        p = t.length;
        for (y = 0; y < o && y < p; y++)if (q[y] !== t[y])return M(q[y], t[y]);
        return y === o ? M(h, t[y], -1) : M(q[y], j, 1)
      };
      M = function(h, j, o) {
        if (h === j)return o;
        for (h = h.nextSibling; h;) {
          if (h === j)return-1;
          h = h.nextSibling
        }
        return 1
      }
    }
    n.getText = function(h) {
      for (var j = "",o,p = 0; h[p]; p++) {
        o = h[p];
        if (o.nodeType === 3 || o.nodeType === 4)j += o.nodeValue; else if (o.nodeType !== 8)j += n.getText(o.childNodes)
      }
      return j
    };
    (function() {
      var h = x.createElement("div"),j = "script" + (new Date).getTime(),
          o = x.documentElement;
      h.innerHTML = "<a name='" + j + "'/>";
      o.insertBefore(h, o.firstChild);
      if (x.getElementById(j)) {
        r.find.ID = function(p, q, t) {
          if (typeof q.getElementById !== "undefined" && !t)return(q = q.getElementById(p[1])) ? q.id === p[1] || typeof q.getAttributeNode !== "undefined" && q.getAttributeNode("id").nodeValue === p[1] ? [q] : v : []
        };
        r.filter.ID = function(p, q) {
          var t = typeof p.getAttributeNode !== "undefined" && p.getAttributeNode("id");
          return p.nodeType === 1 && t && t.nodeValue === q
        }
      }
      o.removeChild(h);
      o = h = null
    })();
    (function() {
      var h =
          x.createElement("div");
      h.appendChild(x.createComment(""));
      if (h.getElementsByTagName("*").length > 0)r.find.TAG = function(j, o) {
        o = o.getElementsByTagName(j[1]);
        if (j[1] === "*") {
          j = [];
          for (var p = 0; o[p]; p++)o[p].nodeType === 1 && j.push(o[p]);
          o = j
        }
        return o
      };
      h.innerHTML = "<a href='#'></a>";
      if (h.firstChild && typeof h.firstChild.getAttribute !== "undefined" && h.firstChild.getAttribute("href") !== "#")r.attrHandle.href = function(j) {
        return j.getAttribute("href", 2)
      };
      h = null
    })();
    x.querySelectorAll && function() {
      var h = n,j = x.createElement("div");
      j.innerHTML = "<p class='TEST'></p>";
      if (!(j.querySelectorAll && j.querySelectorAll(".TEST").length === 0)) {
        n = function(p, q, t, y) {
          q = q || x;
          if (!y && !n.isXML(q)) {
            var w = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(p);
            if (w && (q.nodeType === 1 || q.nodeType === 9))if (w[1])return G(q.getElementsByTagName(p), t); else if (w[2] && r.find.CLASS && q.getElementsByClassName)return G(q.getElementsByClassName(w[2]), t);
            if (q.nodeType === 9) {
              if (p === "body" && q.body)return G([q.body], t); else if (w && w[3]) {
                var D = q.getElementById(w[3]);
                if (D && D.parentNode) {
                  if (D.id ===
                      w[3])return G([D], t)
                } else return G([], t)
              }
              try {
                return G(q.querySelectorAll(p), t)
              } catch(L) {
              }
            } else if (q.nodeType === 1 && q.nodeName.toLowerCase() !== "object") {
              w = q;
              var k = (D = q.getAttribute("id")) || "__sizzle__",s = q.parentNode,u = /^\s*[+~]/.test(p);
              if (D)k = k.replace(/'/g, "\\$&"); else q.setAttribute("id", k);
              if (u && s)q = q.parentNode;
              try {
                if (!u || s)return G(q.querySelectorAll("[id='" + k + "'] " + p), t)
              } catch(z) {
              } finally {
                D || w.removeAttribute("id")
              }
            }
          }
          return h(p, q, t, y)
        };
        for (var o in h)n[o] = h[o];
        j = null
      }
    }();
    (function() {
      var h = x.documentElement,
          j = h.matchesSelector || h.mozMatchesSelector || h.webkitMatchesSelector || h.msMatchesSelector;
      if (j) {
        var o = !j.call(x.createElement("div"), "div"),p = false;
        try {
          j.call(x.documentElement, "[test!='']:sizzle")
        } catch(q) {
          p = true
        }
        n.matchesSelector = function(t, y) {
          y = y.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
          if (!n.isXML(t))try {
            if (p || !r.match.PSEUDO.test(y) && !/!=/.test(y)) {
              var w = j.call(t, y);
              if (w || !o || t.document && t.document.nodeType !== 11)return w
            }
          } catch(D) {
          }
          return n(y, null, null, [t]).length > 0
        }
      }
    })();
    (function() {
      var h = x.createElement("div");
      h.innerHTML = "<div class='test e'></div><div class='test'></div>";
      if (!(!h.getElementsByClassName || h.getElementsByClassName("e").length === 0)) {
        h.lastChild.className = "e";
        if (h.getElementsByClassName("e").length !== 1) {
          r.order.splice(1, 0, "CLASS");
          r.find.CLASS = function(j, o, p) {
            if (typeof o.getElementsByClassName !== "undefined" && !p)return o.getElementsByClassName(j[1])
          };
          h = null
        }
      }
    })();
    n.contains = x.documentElement.contains ? function(h, j) {
      return h !== j && (h.contains ? h.contains(j) : true)
    } : x.documentElement.compareDocumentPosition ?
        function(h, j) {
          return!!(h.compareDocumentPosition(j) & 16)
        } : function() {
      return false
    };
    n.isXML = function(h) {
      return(h = (h ? h.ownerDocument || h : 0).documentElement) ? h.nodeName !== "HTML" : false
    };
    var O = function(h, j) {
      var o,p = [],q = "";
      for (j = j.nodeType ? [j] : j; o = r.match.PSEUDO.exec(h);) {
        q += o[0];
        h = h.replace(r.match.PSEUDO, "")
      }
      h = r.relative[h] ? h + "*" : h;
      o = 0;
      for (var t = j.length; o < t; o++)n(h, j[o], p);
      return n.filter(q, p)
    };
    c.find = n;
    c.expr = n.selectors;
    c.expr[":"] = c.expr.filters;
    c.unique = n.uniqueSort;
    c.text = n.getText;
    c.isXMLDoc = n.isXML;
    c.contains = n.contains
  })();
  var Fb = /Until$/,Gb = /^(?:parents|prevUntil|prevAll)/,Hb = /,/,lb = /^.[^:#\[\.,]*$/,Ib = Array.prototype.slice,Ta = c.expr.match.POS,Jb = {children:true,contents:true,next:true,prev:true};
  c.fn.extend({find:function(a) {
    var b = this,d,e;
    if (typeof a !== "string")return c(a).filter(function() {
      d = 0;
      for (e = b.length; d < e; d++)if (c.contains(b[d], this))return true
    });
    var f = this.pushStack("", "find", a),g,i,l;
    d = 0;
    for (e = this.length; d < e; d++) {
      g = f.length;
      c.find(a, this[d], f);
      if (d > 0)for (i = g; i < f.length; i++)for (l =
                                                       0; l < g; l++)if (f[l] === f[i]) {
        f.splice(i--, 1);
        break
      }
    }
    return f
  },has:function(a) {
    var b = c(a);
    return this.filter(function() {
      for (var d = 0,e = b.length; d < e; d++)if (c.contains(this, b[d]))return true
    })
  },not:function(a) {
    return this.pushStack(Aa(this, a, false), "not", a)
  },filter:function(a) {
    return this.pushStack(Aa(this, a, true), "filter", a)
  },is:function(a) {
    return!!a && (typeof a === "string" ? c.filter(a, this).length > 0 : this.filter(a).length > 0)
  },closest:function(a, b) {
    var d = [],e,f,g = this[0];
    if (c.isArray(a)) {
      var i,l = {},m = 1;
      if (g &&
          a.length) {
        e = 0;
        for (f = a.length; e < f; e++) {
          i = a[e];
          l[i] || (l[i] = Ta.test(i) ? c(i, b || this.context) : i)
        }
        for (; g && g.ownerDocument && g !== b;) {
          for (i in l) {
            a = l[i];
            if (a.jquery ? a.index(g) > -1 : c(g).is(a))d.push({selector:i,elem:g,level:m})
          }
          g = g.parentNode;
          m++
        }
      }
      return d
    }
    i = Ta.test(a) || typeof a !== "string" ? c(a, b || this.context) : 0;
    e = 0;
    for (f = this.length; e < f; e++)for (g = this[e]; g;)if (i ? i.index(g) > -1 : c.find.matchesSelector(g, a)) {
      d.push(g);
      break
    } else {
      g = g.parentNode;
      if (!g || !g.ownerDocument || g === b || g.nodeType === 11)break
    }
    d = d.length > 1 ?
        c.unique(d) : d;
    return this.pushStack(d, "closest", a)
  },index:function(a) {
    if (!a || typeof a === "string")return c.inArray(this[0], a ? c(a) : this.parent().children());
    return c.inArray(a.jquery ? a[0] : a, this)
  },add:function(a, b) {
    a = typeof a === "string" ? c(a, b) : c.makeArray(a && a.nodeType ? [a] : a);
    b = c.merge(this.get(), a);
    return this.pushStack(za(a[0]) || za(b[0]) ? b : c.unique(b))
  },andSelf:function() {
    return this.add(this.prevObject)
  }});
  c.each({parent:function(a) {
    return(a = a.parentNode) && a.nodeType !== 11 ? a : null
  },parents:function(a) {
    return c.dir(a,
        "parentNode")
  },parentsUntil:function(a, b, d) {
    return c.dir(a, "parentNode", d)
  },next:function(a) {
    return c.nth(a, 2, "nextSibling")
  },prev:function(a) {
    return c.nth(a, 2, "previousSibling")
  },nextAll:function(a) {
    return c.dir(a, "nextSibling")
  },prevAll:function(a) {
    return c.dir(a, "previousSibling")
  },nextUntil:function(a, b, d) {
    return c.dir(a, "nextSibling", d)
  },prevUntil:function(a, b, d) {
    return c.dir(a, "previousSibling", d)
  },siblings:function(a) {
    return c.sibling(a.parentNode.firstChild, a)
  },children:function(a) {
    return c.sibling(a.firstChild)
  },
    contents:function(a) {
      return c.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : c.makeArray(a.childNodes)
    }}, function(a, b) {
    c.fn[a] = function(d, e) {
      var f = c.map(this, b, d),g = Ib.call(arguments);
      Fb.test(a) || (e = d);
      if (e && typeof e === "string")f = c.filter(e, f);
      f = this.length > 1 && !Jb[a] ? c.unique(f) : f;
      if ((this.length > 1 || Hb.test(e)) && Gb.test(a))f = f.reverse();
      return this.pushStack(f, a, g.join(","))
    }
  });
  c.extend({filter:function(a, b, d) {
    if (d)a = ":not(" + a + ")";
    return b.length === 1 ? c.find.matchesSelector(b[0],
        a) ? [b[0]] : [] : c.find.matches(a, b)
  },dir:function(a, b, d) {
    var e = [];
    for (a = a[b]; a && a.nodeType !== 9 && (d === v || a.nodeType !== 1 || !c(a).is(d));) {
      a.nodeType === 1 && e.push(a);
      a = a[b]
    }
    return e
  },nth:function(a, b, d) {
    b = b || 1;
    for (var e = 0; a; a = a[d])if (a.nodeType === 1 && ++e === b)break;
    return a
  },sibling:function(a, b) {
    for (var d = []; a; a = a.nextSibling)a.nodeType === 1 && a !== b && d.push(a);
    return d
  }});
  var Kb = / jQuery\d+="(?:\d+|null)"/g,ta = /^\s+/,Ua = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Va = /<([\w:]+)/,
      Lb = /<tbody/i,Mb = /<|&#?\w+;/,Wa = /<(?:script|object|embed|option|style)/i,Xa = /checked\s*(?:[^=]|=\s*.checked.)/i,Nb = /\/(java|ecma)script/i,ob = /^\s*<!(?:\[CDATA\[|\-\-)/,N = {option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]};
  N.optgroup =
      N.option;
  N.tbody = N.tfoot = N.colgroup = N.caption = N.thead;
  N.th = N.td;
  if (!c.support.htmlSerialize)N._default = [1,"div<div>","</div>"];
  c.fn.extend({text:function(a) {
    if (c.isFunction(a))return this.each(function(b) {
      var d = c(this);
      d.text(a.call(this, b, d.text()))
    });
    if (typeof a !== "object" && a !== v)return this.empty().append((this[0] && this[0].ownerDocument || x).createTextNode(a));
    return c.text(this)
  },wrapAll:function(a) {
    if (c.isFunction(a))return this.each(function(d) {
      c(this).wrapAll(a.call(this, d))
    });
    if (this[0]) {
      var b =
          c(a, this[0].ownerDocument).eq(0).clone(true);
      this[0].parentNode && b.insertBefore(this[0]);
      b.map(
          function() {
            for (var d = this; d.firstChild && d.firstChild.nodeType === 1;)d = d.firstChild;
            return d
          }).append(this)
    }
    return this
  },wrapInner:function(a) {
    if (c.isFunction(a))return this.each(function(b) {
      c(this).wrapInner(a.call(this, b))
    });
    return this.each(function() {
      var b = c(this),d = b.contents();
      d.length ? d.wrapAll(a) : b.append(a)
    })
  },wrap:function(a) {
    return this.each(function() {
      c(this).wrapAll(a)
    })
  },unwrap:function() {
    return this.parent().each(
        function() {
          c.nodeName(this,
              "body") || c(this).replaceWith(this.childNodes)
        }).end()
  },append:function() {
    return this.domManip(arguments, true, function(a) {
      this.nodeType === 1 && this.appendChild(a)
    })
  },prepend:function() {
    return this.domManip(arguments, true, function(a) {
      this.nodeType === 1 && this.insertBefore(a, this.firstChild)
    })
  },before:function() {
    if (this[0] && this[0].parentNode)return this.domManip(arguments, false, function(b) {
      this.parentNode.insertBefore(b, this)
    }); else if (arguments.length) {
      var a = c(arguments[0]);
      a.push.apply(a, this.toArray());
      return this.pushStack(a, "before", arguments)
    }
  },after:function() {
    if (this[0] && this[0].parentNode)return this.domManip(arguments, false, function(b) {
      this.parentNode.insertBefore(b, this.nextSibling)
    }); else if (arguments.length) {
      var a = this.pushStack(this, "after", arguments);
      a.push.apply(a, c(arguments[0]).toArray());
      return a
    }
  },remove:function(a, b) {
    for (var d = 0,e; (e = this[d]) != null; d++)if (!a || c.filter(a, [e]).length) {
      if (!b && e.nodeType === 1) {
        c.cleanData(e.getElementsByTagName("*"));
        c.cleanData([e])
      }
      e.parentNode &&
      e.parentNode.removeChild(e)
    }
    return this
  },empty:function() {
    for (var a = 0,b; (b = this[a]) != null; a++)for (b.nodeType === 1 && c.cleanData(b.getElementsByTagName("*")); b.firstChild;)b.removeChild(b.firstChild);
    return this
  },clone:function(a, b) {
    a = a == null ? false : a;
    b = b == null ? a : b;
    return this.map(function() {
      return c.clone(this, a, b)
    })
  },html:function(a) {
    if (a === v)return this[0] && this[0].nodeType === 1 ? this[0].innerHTML.replace(Kb, "") : null; else if (typeof a === "string" && !Wa.test(a) && (c.support.leadingWhitespace || !ta.test(a)) &&
        !N[(Va.exec(a) || ["",""])[1].toLowerCase()]) {
      a = a.replace(Ua, "<$1></$2>");
      try {
        for (var b = 0,d = this.length; b < d; b++)if (this[b].nodeType === 1) {
          c.cleanData(this[b].getElementsByTagName("*"));
          this[b].innerHTML = a
        }
      } catch(e) {
        this.empty().append(a)
      }
    } else c.isFunction(a) ? this.each(function(f) {
      var g = c(this);
      g.html(a.call(this, f, g.html()))
    }) : this.empty().append(a);
    return this
  },replaceWith:function(a) {
    if (this[0] && this[0].parentNode) {
      if (c.isFunction(a))return this.each(function(b) {
        var d = c(this),e = d.html();
        d.replaceWith(a.call(this,
            b, e))
      });
      if (typeof a !== "string")a = c(a).detach();
      return this.each(function() {
        var b = this.nextSibling,d = this.parentNode;
        c(this).remove();
        b ? c(b).before(a) : c(d).append(a)
      })
    } else return this.length ? this.pushStack(c(c.isFunction(a) ? a() : a), "replaceWith", a) : this
  },detach:function(a) {
    return this.remove(a, true)
  },domManip:function(a, b, d) {
    var e,f,g,i = a[0],l = [];
    if (!c.support.checkClone && arguments.length === 3 && typeof i === "string" && Xa.test(i))return this.each(function() {
      c(this).domManip(a, b, d, true)
    });
    if (c.isFunction(i))return this.each(function(A) {
      var B =
          c(this);
      a[0] = i.call(this, A, b ? B.html() : v);
      B.domManip(a, b, d)
    });
    if (this[0]) {
      e = i && i.parentNode;
      e = c.support.parentNode && e && e.nodeType === 11 && e.childNodes.length === this.length ? {fragment:e} : c.buildFragment(a, this, l);
      g = e.fragment;
      if (f = g.childNodes.length === 1 ? (g = g.firstChild) : g.firstChild) {
        b = b && c.nodeName(f, "tr");
        for (var m = 0,n = this.length,r = n - 1; m < n; m++)d.call(b ? mb(this[m], f) : this[m], e.cacheable || n > 1 && m < r ? c.clone(g, true, true) : g)
      }
      l.length && c.each(l, nb)
    }
    return this
  }});
  c.buildFragment = function(a, b, d) {
    var e,f,g;
    b = b && b[0] ? b[0].ownerDocument || b[0] : x;
    if (a.length === 1 && typeof a[0] === "string" && a[0].length < 512 && b === x && a[0].charAt(0) === "<" && !Wa.test(a[0]) && (c.support.checkClone || !Xa.test(a[0]))) {
      f = true;
      if ((g = c.fragments[a[0]]) && g !== 1)e = g
    }
    if (!e) {
      e = b.createDocumentFragment();
      c.clean(a, b, e, d)
    }
    if (f)c.fragments[a[0]] = g ? e : 1;
    return{fragment:e,cacheable:f}
  };
  c.fragments = {};
  c.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"}, function(a, b) {
    c.fn[a] = function(d) {
      var e =
          [];
      d = c(d);
      var f = this.length === 1 && this[0].parentNode;
      if (f && f.nodeType === 11 && f.childNodes.length === 1 && d.length === 1) {
        d[b](this[0]);
        return this
      } else {
        f = 0;
        for (var g = d.length; f < g; f++) {
          var i = (f > 0 ? this.clone(true) : this).get();
          c(d[f])[b](i);
          e = e.concat(i)
        }
        return this.pushStack(e, a, d.selector)
      }
    }
  });
  c.extend({clone:function(a, b, d) {
    var e = a.cloneNode(true),f,g,i;
    if ((!c.support.noCloneEvent || !c.support.noCloneChecked) && (a.nodeType === 1 || a.nodeType === 11) && !c.isXMLDoc(a)) {
      Ca(a, e);
      f = ca(a);
      g = ca(e);
      for (i = 0; f[i]; ++i)Ca(f[i],
          g[i])
    }
    if (b) {
      Ba(a, e);
      if (d) {
        f = ca(a);
        g = ca(e);
        for (i = 0; f[i]; ++i)Ba(f[i], g[i])
      }
    }
    return e
  },clean:function(a, b, d, e) {
    b = b || x;
    if (typeof b.createElement === "undefined")b = b.ownerDocument || b[0] && b[0].ownerDocument || x;
    for (var f = [],g,i = 0,l; (l = a[i]) != null; i++) {
      if (typeof l === "number")l += "";
      if (l) {
        if (typeof l === "string")if (Mb.test(l)) {
          l = l.replace(Ua, "<$1></$2>");
          g = (Va.exec(l) || ["",""])[1].toLowerCase();
          var m = N[g] || N._default,n = m[0],r = b.createElement("div");
          for (r.innerHTML = m[1] + l + m[2]; n--;)r = r.lastChild;
          if (!c.support.tbody) {
            n =
                Lb.test(l);
            m = g === "table" && !n ? r.firstChild && r.firstChild.childNodes : m[1] === "<table>" && !n ? r.childNodes : [];
            for (g = m.length - 1; g >= 0; --g)c.nodeName(m[g], "tbody") && !m[g].childNodes.length && m[g].parentNode.removeChild(m[g])
          }
          !c.support.leadingWhitespace && ta.test(l) && r.insertBefore(b.createTextNode(ta.exec(l)[0]), r.firstChild);
          l = r.childNodes
        } else l = b.createTextNode(l);
        var A;
        if (!c.support.appendChecked)if (l[0] && typeof(A = l.length) === "number")for (g = 0; g < A; g++)Ea(l[g]); else Ea(l);
        if (l.nodeType)f.push(l); else f = c.merge(f,
            l)
      }
    }
    if (d) {
      a = function(B) {
        return!B.type || Nb.test(B.type)
      };
      for (i = 0; f[i]; i++)if (e && c.nodeName(f[i], "script") && (!f[i].type || f[i].type.toLowerCase() === "text/javascript"))e.push(f[i].parentNode ? f[i].parentNode.removeChild(f[i]) : f[i]); else {
        if (f[i].nodeType === 1) {
          b = c.grep(f[i].getElementsByTagName("script"), a);
          f.splice.apply(f, [i + 1,0].concat(b))
        }
        d.appendChild(f[i])
      }
    }
    return f
  },cleanData:function(a) {
    for (var b,d,e = c.cache,f = c.expando,g = c.event.special,i = c.support.deleteExpando,l = 0,m; (m = a[l]) != null; l++)if (!(m.nodeName &&
        c.noData[m.nodeName.toLowerCase()]))if (d = m[c.expando]) {
      if ((b = e[d] && e[d][f]) && b.events) {
        for (var n in b.events)g[n] ? c.event.remove(m, n) : c.removeEvent(m, n, b.handle);
        if (b.handle)b.handle.elem = null
      }
      if (i)delete m[c.expando]; else m.removeAttribute && m.removeAttribute(c.expando);
      delete e[d]
    }
  }});
  var Ya = /alpha\([^)]*\)/i,Ob = /opacity=([^)]*)/,Pb = /-([a-z])/ig,Qb = /([A-Z]|^ms)/g,Za = /^-?\d+(?:px)?$/i,Rb = /^-?\d/,Sb = /^[+\-]=/,Tb = /[^+\-\.\de]+/g,Ub = {position:"absolute",visibility:"hidden",display:"block"},pb = ["Left",
    "Right"],qb = ["Top","Bottom"],W,$a,ga,Vb = function(a, b) {
    return b.toUpperCase()
  };
  c.fn.css = function(a, b) {
    if (arguments.length === 2 && b === v)return this;
    return c.access(this, a, b, true, function(d, e, f) {
      return f !== v ? c.style(d, e, f) : c.css(d, e)
    })
  };
  c.extend({cssHooks:{opacity:{get:function(a, b) {
    if (b) {
      a = W(a, "opacity", "opacity");
      return a === "" ? "1" : a
    } else return a.style.opacity
  }}},cssNumber:{zIndex:true,fontWeight:true,opacity:true,zoom:true,lineHeight:true,widows:true,orphans:true},cssProps:{"float":c.support.cssFloat ?
      "cssFloat" : "styleFloat"},style:function(a, b, d, e) {
    if (!(!a || a.nodeType === 3 || a.nodeType === 8 || !a.style)) {
      var f,g = c.camelCase(b),i = a.style,l = c.cssHooks[g];
      b = c.cssProps[g] || g;
      if (d !== v) {
        e = typeof d;
        if (!(e === "number" && isNaN(d) || d == null)) {
          if (e === "string" && Sb.test(d))d = +d.replace(Tb, "") + parseFloat(c.css(a, b));
          if (e === "number" && !c.cssNumber[g])d += "px";
          if (!l || !("set"in l) || (d = l.set(a, d)) !== v)try {
            i[b] = d
          } catch(m) {
          }
        }
      } else {
        if (l && "get"in l && (f = l.get(a, false, e)) !== v)return f;
        return i[b]
      }
    }
  },css:function(a, b, d) {
    var e,
        f;
    b = c.camelCase(b);
    f = c.cssHooks[b];
    b = c.cssProps[b] || b;
    if (b === "cssFloat")b = "float";
    if (f && "get"in f && (e = f.get(a, true, d)) !== v)return e; else if (W)return W(a, b)
  },swap:function(a, b, d) {
    var e = {};
    for (var f in b) {
      e[f] = a.style[f];
      a.style[f] = b[f]
    }
    d.call(a);
    for (f in b)a.style[f] = e[f]
  },camelCase:function(a) {
    return a.replace(Pb, Vb)
  }});
  c.curCSS = c.css;
  c.each(["height","width"], function(a, b) {
    c.cssHooks[b] = {get:function(d, e, f) {
      var g;
      if (e) {
        if (d.offsetWidth !== 0)g = Fa(d, b, f); else c.swap(d, Ub, function() {
          g = Fa(d, b, f)
        });
        if (g <=
            0) {
          g = W(d, b, b);
          if (g === "0px" && ga)g = ga(d, b, b);
          if (g != null)return g === "" || g === "auto" ? "0px" : g
        }
        if (g < 0 || g == null) {
          g = d.style[b];
          return g === "" || g === "auto" ? "0px" : g
        }
        return typeof g === "string" ? g : g + "px"
      }
    },set:function(d, e) {
      if (Za.test(e)) {
        e = parseFloat(e);
        if (e >= 0)return e + "px"
      } else return e
    }}
  });
  if (!c.support.opacity)c.cssHooks.opacity = {get:function(a, b) {
    return Ob.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : b ? "1" : ""
  },set:function(a, b) {
    var d = a.style;
    a = a.currentStyle;
    d.zoom = 1;
    b = c.isNaN(b) ? "" : "alpha(opacity=" + b * 100 + ")";
    a = a && a.filter || d.filter || "";
    d.filter = Ya.test(a) ? a.replace(Ya, b) : a + " " + b
  }};
  c(function() {
    if (!c.support.reliableMarginRight)c.cssHooks.marginRight = {get:function(a, b) {
      var d;
      c.swap(a, {display:"inline-block"}, function() {
        d = b ? W(a, "margin-right", "marginRight") : a.style.marginRight
      });
      return d
    }}
  });
  if (x.defaultView && x.defaultView.getComputedStyle)$a = function(a, b) {
    var d,e;
    b = b.replace(Qb, "-$1").toLowerCase();
    if (!(e = a.ownerDocument.defaultView))return v;
    if (e = e.getComputedStyle(a,
        null)) {
      d = e.getPropertyValue(b);
      if (d === "" && !c.contains(a.ownerDocument.documentElement, a))d = c.style(a, b)
    }
    return d
  };
  if (x.documentElement.currentStyle)ga = function(a, b) {
    var d,e = a.currentStyle && a.currentStyle[b],f = a.runtimeStyle && a.runtimeStyle[b],g = a.style;
    if (!Za.test(e) && Rb.test(e)) {
      d = g.left;
      if (f)a.runtimeStyle.left = a.currentStyle.left;
      g.left = b === "fontSize" ? "1em" : e || 0;
      e = g.pixelLeft + "px";
      g.left = d;
      if (f)a.runtimeStyle.left = f
    }
    return e === "" ? "auto" : e
  };
  W = $a || ga;
  if (c.expr && c.expr.filters) {
    c.expr.filters.hidden =
        function(a) {
          var b = a.offsetHeight;
          return a.offsetWidth === 0 && b === 0 || !c.support.reliableHiddenOffsets && (a.style.display || c.css(a, "display")) === "none"
        };
    c.expr.filters.visible = function(a) {
      return!c.expr.filters.hidden(a)
    }
  }
  var Wb = /%20/g,rb = /\[\]$/,ab = /\r?\n/g,Xb = /#.*$/,Yb = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,Zb = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,$b = /^(?:GET|HEAD)$/,ac = /^\/\//,bb = /\?/,bc = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,cc = /^(?:select|textarea)/i,
      Ha = /\s+/,dc = /([?&])_=[^&]*/,cb = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,db = c.fn.load,ka = {},eb = {},T,U;
  try {
    T = xb.href
  } catch(jc) {
    T = x.createElement("a");
    T.href = "";
    T = T.href
  }
  U = cb.exec(T.toLowerCase()) || [];
  c.fn.extend({load:function(a, b, d) {
    if (typeof a !== "string" && db)return db.apply(this, arguments); else if (!this.length)return this;
    var e = a.indexOf(" ");
    if (e >= 0) {
      var f = a.slice(e, a.length);
      a = a.slice(0, e)
    }
    e = "GET";
    if (b)if (c.isFunction(b)) {
      d = b;
      b = v
    } else if (typeof b === "object") {
      b = c.param(b, c.ajaxSettings.traditional);
      e = "POST"
    }
    var g = this;
    c.ajax({url:a,type:e,dataType:"html",data:b,complete:function(i, l, m) {
      m = i.responseText;
      if (i.isResolved()) {
        i.done(function(n) {
          m = n
        });
        g.html(f ? c("<div>").append(m.replace(bc, "")).find(f) : m)
      }
      d && g.each(d, [m,l,i])
    }});
    return this
  },serialize:function() {
    return c.param(this.serializeArray())
  },serializeArray:function() {
    return this.map(
        function() {
          return this.elements ? c.makeArray(this.elements) : this
        }).filter(
        function() {
          return this.name && !this.disabled && (this.checked || cc.test(this.nodeName) ||
              Zb.test(this.type))
        }).map(
        function(a, b) {
          a = c(this).val();
          return a == null ? null : c.isArray(a) ? c.map(a, function(d) {
            return{name:b.name,value:d.replace(ab, "\r\n")}
          }) : {name:b.name,value:a.replace(ab, "\r\n")}
        }).get()
  }});
  c.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(a, b) {
    c.fn[b] = function(d) {
      return this.bind(b, d)
    }
  });
  c.each(["get","post"], function(a, b) {
    c[b] = function(d, e, f, g) {
      if (c.isFunction(e)) {
        g = g || f;
        f = e;
        e = v
      }
      return c.ajax({type:b,url:d,data:e,success:f,dataType:g})
    }
  });
  c.extend({getScript:function(a, b) {
    return c.get(a, v, b, "script")
  },getJSON:function(a, b, d) {
    return c.get(a, b, d, "json")
  },ajaxSetup:function(a, b) {
    if (b)c.extend(true, a, c.ajaxSettings, b); else {
      b = a;
      a = c.extend(true, c.ajaxSettings, b)
    }
    for (var d in{context:1,url:1})if (d in b)a[d] = b[d]; else if (d in c.ajaxSettings)a[d] = c.ajaxSettings[d];
    return a
  },ajaxSettings:{url:T,isLocal:/^(?:about|app|app\-storage|.+\-extension|file|widget):$/.test(U[1]),global:true,type:"GET",contentType:"application/x-www-form-urlencoded",
    processData:true,async:true,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":"*/*"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":E.String,"text html":true,"text json":c.parseJSON,"text xml":c.parseXML}},ajaxPrefilter:Ga(ka),ajaxTransport:Ga(eb),ajax:function(a, b) {
    function d(p, q, t, y) {
      if (I !== 2) {
        I = 2;
        R && clearTimeout(R);
        G = v;
        B = y || "";
        h.readyState = p ? 4 : 0;
        var w,
            D,L;
        t = t ? sb(e, h, t) : v;
        if (p >= 200 && p < 300 || p === 304) {
          if (e.ifModified) {
            if (y = h.getResponseHeader("Last-Modified"))c.lastModified[n] = y;
            if (y = h.getResponseHeader("Etag"))c.etag[n] = y
          }
          if (p === 304) {
            q = "notmodified";
            w = true
          } else try {
            D = tb(e, t);
            q = "success";
            w = true
          } catch(k) {
            q = "parsererror";
            L = k
          }
        } else {
          L = q;
          if (!q || p) {
            q = "error";
            if (p < 0)p = 0
          }
        }
        h.status = p;
        h.statusText = q;
        w ? i.resolveWith(f, [D,q,h]) : i.rejectWith(f, [h,q,L]);
        h.statusCode(m);
        m = v;
        if (M)g.trigger("ajax" + (w ? "Success" : "Error"), [h,e,w ? D : L]);
        l.resolveWith(f, [h,q]);
        if (M) {
          g.trigger("ajaxComplete",
              [h,e]);
          --c.active || c.event.trigger("ajaxStop")
        }
      }
    }

    if (typeof a === "object") {
      b = a;
      a = v
    }
    b = b || {};
    var e = c.ajaxSetup({}, b),f = e.context || e,g = f !== e && (f.nodeType || f instanceof c) ? c(f) : c.event,i = c.Deferred(),l = c._Deferred(),m = e.statusCode || {},n,r = {},A = {},B,C,G,R,I = 0,M,O,h = {readyState:0,setRequestHeader:function(p, q) {
      if (!I) {
        var t = p.toLowerCase();
        p = A[t] = A[t] || p;
        r[p] = q
      }
      return this
    },getAllResponseHeaders:function() {
      return I === 2 ? B : null
    },getResponseHeader:function(p) {
      var q;
      if (I === 2) {
        if (!C)for (C = {}; q = Yb.exec(B);)C[q[1].toLowerCase()] =
            q[2];
        q = C[p.toLowerCase()]
      }
      return q === v ? null : q
    },overrideMimeType:function(p) {
      if (!I)e.mimeType = p;
      return this
    },abort:function(p) {
      p = p || "abort";
      G && G.abort(p);
      d(0, p);
      return this
    }};
    i.promise(h);
    h.success = h.done;
    h.error = h.fail;
    h.complete = l.done;
    h.statusCode = function(p) {
      if (p) {
        var q;
        if (I < 2)for (q in p)m[q] = [m[q],p[q]]; else {
          q = p[h.status];
          h.then(q, q)
        }
      }
      return this
    };
    e.url = ((a || e.url) + "").replace(Xb, "").replace(ac, U[1] + "//");
    e.dataTypes = c.trim(e.dataType || "*").toLowerCase().split(Ha);
    if (e.crossDomain == null) {
      a = cb.exec(e.url.toLowerCase());
      e.crossDomain = !!(a && (a[1] != U[1] || a[2] != U[2] || (a[3] || (a[1] === "http:" ? 80 : 443)) != (U[3] || (U[1] === "http:" ? 80 : 443))))
    }
    if (e.data && e.processData && typeof e.data !== "string")e.data = c.param(e.data, e.traditional);
    da(ka, e, b, h);
    if (I === 2)return false;
    M = e.global;
    e.type = e.type.toUpperCase();
    e.hasContent = !$b.test(e.type);
    M && c.active++ === 0 && c.event.trigger("ajaxStart");
    if (!e.hasContent) {
      if (e.data)e.url += (bb.test(e.url) ? "&" : "?") + e.data;
      n = e.url;
      if (e.cache === false) {
        a = c.now();
        var j = e.url.replace(dc, "$1_=" + a);
        e.url = j + (j ===
            e.url ? (bb.test(e.url) ? "&" : "?") + "_=" + a : "")
      }
    }
    if (e.data && e.hasContent && e.contentType !== false || b.contentType)h.setRequestHeader("Content-Type", e.contentType);
    if (e.ifModified) {
      n = n || e.url;
      c.lastModified[n] && h.setRequestHeader("If-Modified-Since", c.lastModified[n]);
      c.etag[n] && h.setRequestHeader("If-None-Match", c.etag[n])
    }
    h.setRequestHeader("Accept", e.dataTypes[0] && e.accepts[e.dataTypes[0]] ? e.accepts[e.dataTypes[0]] + (e.dataTypes[0] !== "*" ? ", */*; q=0.01" : "") : e.accepts["*"]);
    for (O in e.headers)h.setRequestHeader(O,
        e.headers[O]);
    if (e.beforeSend && (e.beforeSend.call(f, h, e) === false || I === 2)) {
      h.abort();
      return false
    }
    for (O in{success:1,error:1,complete:1})h[O](e[O]);
    if (G = da(eb, e, b, h)) {
      h.readyState = 1;
      M && g.trigger("ajaxSend", [h,e]);
      if (e.async && e.timeout > 0)R = setTimeout(function() {
        h.abort("timeout")
      }, e.timeout);
      try {
        I = 1;
        G.send(r, d)
      } catch(o) {
        status < 2 ? d(-1, o) : c.error(o)
      }
    } else d(-1, "No Transport");
    return h
  },param:function(a, b) {
    var d = [],e = function(g, i) {
      i = c.isFunction(i) ? i() : i;
      d[d.length] = encodeURIComponent(g) + "=" + encodeURIComponent(i)
    };
    if (b === v)b = c.ajaxSettings.traditional;
    if (c.isArray(a) || a.jquery && !c.isPlainObject(a))c.each(a, function() {
      e(this.name, this.value)
    }); else for (var f in a)la(f, a[f], b, e);
    return d.join("&").replace(Wb, "+")
  }});
  c.extend({active:0,lastModified:{},etag:{}});
  var ec = c.now(),ha = /(\=)\?(&|$)|\?\?/i;
  c.ajaxSetup({jsonp:"callback",jsonpCallback:function() {
    return c.expando + "_" + ec++
  }});
  c.ajaxPrefilter("json jsonp", function(a, b, d) {
    b = a.contentType === "application/x-www-form-urlencoded" && typeof a.data === "string";
    if (a.dataTypes[0] ===
        "jsonp" || a.jsonp !== false && (ha.test(a.url) || b && ha.test(a.data))) {
      var e,f = a.jsonpCallback = c.isFunction(a.jsonpCallback) ? a.jsonpCallback() : a.jsonpCallback,g = E[f],i = a.url,l = a.data,m = "$1" + f + "$2";
      if (a.jsonp !== false) {
        i = i.replace(ha, m);
        if (a.url === i) {
          if (b)l = l.replace(ha, m);
          if (a.data === l)i += (/\?/.test(i) ? "&" : "?") + a.jsonp + "=" + f
        }
      }
      a.url = i;
      a.data = l;
      E[f] = function(n) {
        e = [n]
      };
      d.always(function() {
        E[f] = g;
        e && c.isFunction(g) && E[f](e[0])
      });
      a.converters["script json"] = function() {
        e || c.error(f + " was not called");
        return e[0]
      };
      a.dataTypes[0] = "json";
      return"script"
    }
  });
  c.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a) {
    c.globalEval(a);
    return a
  }}});
  c.ajaxPrefilter("script", function(a) {
    if (a.cache === v)a.cache = false;
    if (a.crossDomain) {
      a.type = "GET";
      a.global = false
    }
  });
  c.ajaxTransport("script", function(a) {
    if (a.crossDomain) {
      var b,d = x.head || x.getElementsByTagName("head")[0] || x.documentElement;
      return{send:function(e, f) {
        b = x.createElement("script");
        b.async = "async";
        if (a.scriptCharset)b.charset = a.scriptCharset;
        b.src = a.url;
        b.onload = b.onreadystatechange = function(g, i) {
          if (i || !b.readyState || /loaded|complete/.test(b.readyState)) {
            b.onload = b.onreadystatechange = null;
            d && b.parentNode && d.removeChild(b);
            b = v;
            i || f(200, "success")
          }
        };
        d.insertBefore(b, d.firstChild)
      },abort:function() {
        b && b.onload(0, 1)
      }}
    }
  });
  var ua = E.ActiveXObject ? function() {
    for (var a in X)X[a](0, 1)
  } : false,fc = 0,X;
  c.ajaxSettings.xhr = E.ActiveXObject ?
      function() {
        return!this.isLocal && Ia() || ub()
      } : Ia;
  (function(a) {
    c.extend(c.support, {ajax:!!a,cors:!!a && "withCredentials"in a})
  })(c.ajaxSettings.xhr());
  c.support.ajax && c.ajaxTransport(function(a) {
    if (!a.crossDomain || c.support.cors) {
      var b;
      return{send:function(d, e) {
        var f = a.xhr(),g,i;
        a.username ? f.open(a.type, a.url, a.async, a.username, a.password) : f.open(a.type, a.url, a.async);
        if (a.xhrFields)for (i in a.xhrFields)f[i] = a.xhrFields[i];
        a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType);
        if (!a.crossDomain &&
            !d["X-Requested-With"])d["X-Requested-With"] = "XMLHttpRequest";
        try {
          for (i in d)f.setRequestHeader(i, d[i])
        } catch(l) {
        }
        f.send(a.hasContent && a.data || null);
        b = function(m, n) {
          var r,A,B,C,G;
          try {
            if (b && (n || f.readyState === 4)) {
              b = v;
              if (g) {
                f.onreadystatechange = c.noop;
                ua && delete X[g]
              }
              if (n)f.readyState !== 4 && f.abort(); else {
                r = f.status;
                B = f.getAllResponseHeaders();
                C = {};
                if ((G = f.responseXML) && G.documentElement)C.xml = G;
                C.text = f.responseText;
                try {
                  A = f.statusText
                } catch(R) {
                  A = ""
                }
                if (!r && a.isLocal && !a.crossDomain)r = C.text ? 200 : 404;
                else if (r === 1223)r = 204
              }
            }
          } catch(I) {
            n || e(-1, I)
          }
          C && e(r, A, C, B)
        };
        if (!a.async || f.readyState === 4)b(); else {
          g = ++fc;
          if (ua) {
            if (!X) {
              X = {};
              c(E).unload(ua)
            }
            X[g] = b
          }
          f.onreadystatechange = b
        }
      },abort:function() {
        b && b(0, 1)
      }}
    }
  });
  var ma = {},P,Z,gc = /^(?:toggle|show|hide)$/,hc = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,Y,Ka = [
    ["height","marginTop","marginBottom","paddingTop","paddingBottom"],
    ["width","marginLeft","marginRight","paddingLeft","paddingRight"],
    ["opacity"]
  ],ea,va = E.webkitRequestAnimationFrame || E.mozRequestAnimationFrame ||
      E.oRequestAnimationFrame;
  c.fn.extend({show:function(a, b, d) {
    if (a || a === 0)return this.animate(V("show", 3), a, b, d); else {
      d = 0;
      for (var e = this.length; d < e; d++) {
        a = this[d];
        if (a.style) {
          b = a.style.display;
          if (!c._data(a, "olddisplay") && b === "none")b = a.style.display = "";
          b === "" && c.css(a, "display") === "none" && c._data(a, "olddisplay", La(a.nodeName))
        }
      }
      for (d = 0; d < e; d++) {
        a = this[d];
        if (a.style) {
          b = a.style.display;
          if (b === "" || b === "none")a.style.display = c._data(a, "olddisplay") || ""
        }
      }
      return this
    }
  },hide:function(a, b, d) {
    if (a || a === 0)return this.animate(V("hide",
        3), a, b, d); else {
      a = 0;
      for (b = this.length; a < b; a++)if (this[a].style) {
        d = c.css(this[a], "display");
        d !== "none" && !c._data(this[a], "olddisplay") && c._data(this[a], "olddisplay", d)
      }
      for (a = 0; a < b; a++)if (this[a].style)this[a].style.display = "none";
      return this
    }
  },_toggle:c.fn.toggle,toggle:function(a, b, d) {
    var e = typeof a === "boolean";
    if (c.isFunction(a) && c.isFunction(b))this._toggle.apply(this, arguments); else a == null || e ? this.each(function() {
      var f = e ? a : c(this).is(":hidden");
      c(this)[f ? "show" : "hide"]()
    }) : this.animate(V("toggle",
        3), a, b, d);
    return this
  },fadeTo:function(a, b, d, e) {
    return this.filter(":hidden").css("opacity", 0).show().end().animate({opacity:b}, a, d, e)
  },animate:function(a, b, d, e) {
    var f = c.speed(b, d, e);
    if (c.isEmptyObject(a))return this.each(f.complete, [false]);
    a = c.extend({}, a);
    return this[f.queue === false ? "each" : "queue"](function() {
      f.queue === false && c._mark(this);
      var g = c.extend({}, f),i = this.nodeType === 1,l = i && c(this).is(":hidden"),m,n,r,A,B;
      g.animatedProperties = {};
      for (r in a) {
        m = c.camelCase(r);
        if (r !== m) {
          a[m] = a[r];
          delete a[r]
        }
        n =
            a[m];
        if (c.isArray(n)) {
          g.animatedProperties[m] = n[1];
          n = a[m] = n[0]
        } else g.animatedProperties[m] = g.specialEasing && g.specialEasing[m] || g.easing || "swing";
        if (n === "hide" && l || n === "show" && !l)return g.complete.call(this);
        if (i && (m === "height" || m === "width")) {
          g.overflow = [this.style.overflow,this.style.overflowX,this.style.overflowY];
          if (c.css(this, "display") === "inline" && c.css(this, "float") === "none")if (c.support.inlineBlockNeedsLayout) {
            n = La(this.nodeName);
            if (n === "inline")this.style.display = "inline-block"; else {
              this.style.display =
                  "inline";
              this.style.zoom = 1
            }
          } else this.style.display = "inline-block"
        }
      }
      if (g.overflow != null)this.style.overflow = "hidden";
      for (r in a) {
        i = new c.fx(this, g, r);
        n = a[r];
        if (gc.test(n))i[n === "toggle" ? l ? "show" : "hide" : n](); else {
          m = hc.exec(n);
          A = i.cur();
          if (m) {
            n = parseFloat(m[2]);
            B = m[3] || (c.cssNumber[r] ? "" : "px");
            if (B !== "px") {
              c.style(this, r, (n || 1) + B);
              A = (n || 1) / i.cur() * A;
              c.style(this, r, A + B)
            }
            if (m[1])n = (m[1] === "-=" ? -1 : 1) * n + A;
            i.custom(A, n, B)
          } else i.custom(A, n, "")
        }
      }
      return true
    })
  },stop:function(a, b) {
    a && this.queue([]);
    this.each(function() {
      var d =
          c.timers,e = d.length;
      for (b || c._unmark(true, this); e--;)if (d[e].elem === this) {
        b && d[e](true);
        d.splice(e, 1)
      }
    });
    b || this.dequeue();
    return this
  }});
  c.each({slideDown:V("show", 1),slideUp:V("hide", 1),slideToggle:V("toggle", 1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}}, function(a, b) {
    c.fn[a] = function(d, e, f) {
      return this.animate(b, d, e, f)
    }
  });
  c.extend({speed:function(a, b, d) {
    var e = a && typeof a === "object" ? c.extend({}, a) : {complete:d || !d && b || c.isFunction(a) && a,duration:a,easing:d && b ||
        b && !c.isFunction(b) && b};
    e.duration = c.fx.off ? 0 : typeof e.duration === "number" ? e.duration : e.duration in c.fx.speeds ? c.fx.speeds[e.duration] : c.fx.speeds._default;
    e.old = e.complete;
    e.complete = function(f) {
      if (e.queue !== false)c.dequeue(this); else f !== false && c._unmark(this);
      c.isFunction(e.old) && e.old.call(this)
    };
    return e
  },easing:{linear:function(a, b, d, e) {
    return d + e * a
  },swing:function(a, b, d, e) {
    return(-Math.cos(a * Math.PI) / 2 + 0.5) * e + d
  }},timers:[],fx:function(a, b, d) {
    this.options = b;
    this.elem = a;
    this.prop = d;
    b.orig = b.orig ||
    {}
  }});
  c.fx.prototype = {update:function() {
    this.options.step && this.options.step.call(this.elem, this.now, this);
    (c.fx.step[this.prop] || c.fx.step._default)(this)
  },cur:function() {
    if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null))return this.elem[this.prop];
    var a,b = c.css(this.elem, this.prop);
    return isNaN(a = parseFloat(b)) ? !b || b === "auto" ? 0 : b : a
  },custom:function(a, b, d) {
    function e(l) {
      return f.step(l)
    }

    var f = this,g = c.fx,i;
    this.startTime = ea || Ja();
    this.start = a;
    this.end = b;
    this.unit =
        d || this.unit || (c.cssNumber[this.prop] ? "" : "px");
    this.now = this.start;
    this.pos = this.state = 0;
    e.elem = this.elem;
    if (e() && c.timers.push(e) && !Y)if (va) {
      Y = 1;
      i = function() {
        if (Y) {
          va(i);
          g.tick()
        }
      };
      va(i)
    } else Y = setInterval(g.tick, g.interval)
  },show:function() {
    this.options.orig[this.prop] = c.style(this.elem, this.prop);
    this.options.show = true;
    this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());
    c(this.elem).show()
  },hide:function() {
    this.options.orig[this.prop] = c.style(this.elem, this.prop);
    this.options.hide =
        true;
    this.custom(this.cur(), 0)
  },step:function(a) {
    var b = ea || Ja(),d = true,e = this.elem,f = this.options,g;
    if (a || b >= f.duration + this.startTime) {
      this.now = this.end;
      this.pos = this.state = 1;
      this.update();
      f.animatedProperties[this.prop] = true;
      for (g in f.animatedProperties)if (f.animatedProperties[g] !== true)d = false;
      if (d) {
        f.overflow != null && !c.support.shrinkWrapBlocks && c.each(["","X","Y"], function(l, m) {
          e.style["overflow" + m] = f.overflow[l]
        });
        f.hide && c(e).hide();
        if (f.hide || f.show)for (var i in f.animatedProperties)c.style(e,
            i, f.orig[i]);
        f.complete.call(e)
      }
      return false
    } else {
      if (f.duration == Infinity)this.now = b; else {
        a = b - this.startTime;
        this.state = a / f.duration;
        this.pos = c.easing[f.animatedProperties[this.prop]](this.state, a, 0, 1, f.duration);
        this.now = this.start + (this.end - this.start) * this.pos
      }
      this.update()
    }
    return true
  }};
  c.extend(c.fx, {tick:function() {
    for (var a = c.timers,b = 0; b < a.length; ++b)a[b]() || a.splice(b--, 1);
    a.length || c.fx.stop()
  },interval:13,stop:function() {
    clearInterval(Y);
    Y = null
  },speeds:{slow:600,fast:200,_default:400},
    step:{opacity:function(a) {
      c.style(a.elem, "opacity", a.now)
    },_default:function(a) {
      if (a.elem.style && a.elem.style[a.prop] != null)a.elem.style[a.prop] = (a.prop === "width" || a.prop === "height" ? Math.max(0, a.now) : a.now) + a.unit; else a.elem[a.prop] = a.now
    }}});
  if (c.expr && c.expr.filters)c.expr.filters.animated = function(a) {
    return c.grep(c.timers,
        function(b) {
          return a === b.elem
        }).length
  };
  var ic = /^t(?:able|d|h)$/i,fb = /^(?:body|html)$/i;
  c.fn.offset = "getBoundingClientRect"in x.documentElement ? function(a) {
    var b = this[0],d;
    if (a)return this.each(function(i) {
      c.offset.setOffset(this, a, i)
    });
    if (!b || !b.ownerDocument)return null;
    if (b === b.ownerDocument.body)return c.offset.bodyOffset(b);
    try {
      d = b.getBoundingClientRect()
    } catch(e) {
    }
    var f = b.ownerDocument,g = f.documentElement;
    if (!d || !c.contains(g, b))return d ? {top:d.top,left:d.left} : {top:0,left:0};
    b = f.body;
    f = na(f);
    return{top:d.top + (f.pageYOffset || c.support.boxModel && g.scrollTop || b.scrollTop) - (g.clientTop || b.clientTop || 0),left:d.left + (f.pageXOffset || c.support.boxModel && g.scrollLeft ||
        b.scrollLeft) - (g.clientLeft || b.clientLeft || 0)}
  } : function(a) {
    var b = this[0];
    if (a)return this.each(function(r) {
      c.offset.setOffset(this, a, r)
    });
    if (!b || !b.ownerDocument)return null;
    if (b === b.ownerDocument.body)return c.offset.bodyOffset(b);
    c.offset.initialize();
    var d,e = b.offsetParent,f = b,g = b.ownerDocument,i = g.documentElement,l = g.body;
    d = (g = g.defaultView) ? g.getComputedStyle(b, null) : b.currentStyle;
    for (var m = b.offsetTop,n = b.offsetLeft; (b = b.parentNode) && b !== l && b !== i;) {
      if (c.offset.supportsFixedPosition && d.position ===
          "fixed")break;
      d = g ? g.getComputedStyle(b, null) : b.currentStyle;
      m -= b.scrollTop;
      n -= b.scrollLeft;
      if (b === e) {
        m += b.offsetTop;
        n += b.offsetLeft;
        if (c.offset.doesNotAddBorder && !(c.offset.doesAddBorderForTableAndCells && ic.test(b.nodeName))) {
          m += parseFloat(d.borderTopWidth) || 0;
          n += parseFloat(d.borderLeftWidth) || 0
        }
        f = e;
        e = b.offsetParent
      }
      if (c.offset.subtractsBorderForOverflowNotVisible && d.overflow !== "visible") {
        m += parseFloat(d.borderTopWidth) || 0;
        n += parseFloat(d.borderLeftWidth) || 0
      }
      d = d
    }
    if (d.position === "relative" || d.position ===
        "static") {
      m += l.offsetTop;
      n += l.offsetLeft
    }
    if (c.offset.supportsFixedPosition && d.position === "fixed") {
      m += Math.max(i.scrollTop, l.scrollTop);
      n += Math.max(i.scrollLeft, l.scrollLeft)
    }
    return{top:m,left:n}
  };
  c.offset = {initialize:function() {
    var a = x.body,b = x.createElement("div"),d,e,f,g = parseFloat(c.css(a, "marginTop")) || 0;
    c.extend(b.style, {position:"absolute",top:0,left:0,margin:0,border:0,width:"1px",height:"1px",visibility:"hidden"});
    b.innerHTML = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
    a.insertBefore(b, a.firstChild);
    d = b.firstChild;
    e = d.firstChild;
    f = d.nextSibling.firstChild.firstChild;
    this.doesNotAddBorder = e.offsetTop !== 5;
    this.doesAddBorderForTableAndCells = f.offsetTop === 5;
    e.style.position = "fixed";
    e.style.top = "20px";
    this.supportsFixedPosition = e.offsetTop === 20 || e.offsetTop === 15;
    e.style.position = e.style.top = "";
    d.style.overflow = "hidden";
    d.style.position = "relative";
    this.subtractsBorderForOverflowNotVisible = e.offsetTop === -5;
    this.doesNotIncludeMarginInBodyOffset = a.offsetTop !== g;
    a.removeChild(b);
    c.offset.initialize = c.noop
  },bodyOffset:function(a) {
    var b = a.offsetTop,d = a.offsetLeft;
    c.offset.initialize();
    if (c.offset.doesNotIncludeMarginInBodyOffset) {
      b += parseFloat(c.css(a, "marginTop")) || 0;
      d += parseFloat(c.css(a, "marginLeft")) || 0
    }
    return{top:b,left:d}
  },setOffset:function(a, b, d) {
    var e = c.css(a, "position");
    if (e === "static")a.style.position = "relative";
    var f = c(a),g = f.offset(),i = c.css(a, "top"),l = c.css(a, "left"),m = {},n = {};
    if ((e === "absolute" || e === "fixed") && c.inArray("auto", [i,l]) > -1) {
      n = f.position();
      e = n.top;
      l = n.left
    } else {
      e = parseFloat(i) || 0;
      l = parseFloat(l) || 0
    }
    if (c.isFunction(b))b = b.call(a, d, g);
    if (b.top != null)m.top = b.top - g.top + e;
    if (b.left != null)m.left = b.left - g.left + l;
    "using"in b ? b.using.call(a, m) : f.css(m)
  }};
  c.fn.extend({position:function() {
    if (!this[0])return null;
    var a = this[0],b = this.offsetParent(),d = this.offset(),e = fb.test(b[0].nodeName) ? {top:0,left:0} : b.offset();
    d.top -= parseFloat(c.css(a, "marginTop")) || 0;
    d.left -= parseFloat(c.css(a, "marginLeft")) || 0;
    e.top += parseFloat(c.css(b[0], "borderTopWidth")) || 0;
    e.left += parseFloat(c.css(b[0], "borderLeftWidth")) || 0;
    return{top:d.top - e.top,left:d.left - e.left}
  },offsetParent:function() {
    return this.map(function() {
      for (var a = this.offsetParent || x.body; a && !fb.test(a.nodeName) && c.css(a, "position") === "static";)a = a.offsetParent;
      return a
    })
  }});
  c.each(["Left","Top"], function(a, b) {
    var d = "scroll" + b;
    c.fn[d] = function(e) {
      var f,g;
      if (e === v) {
        f = this[0];
        if (!f)return null;
        return(g = na(f)) ? "pageXOffset"in g ? g[a ? "pageYOffset" : "pageXOffset"] : c.support.boxModel && g.document.documentElement[d] ||
            g.document.body[d] : f[d]
      }
      return this.each(function() {
        if (g = na(this))g.scrollTo(!a ? e : c(g).scrollLeft(), a ? e : c(g).scrollTop()); else this[d] = e
      })
    }
  });
  c.each(["Height","Width"], function(a, b) {
    var d = b.toLowerCase();
    c.fn["inner" + b] = function() {
      return this[0] ? parseFloat(c.css(this[0], d, "padding")) : null
    };
    c.fn["outer" + b] = function(e) {
      return this[0] ? parseFloat(c.css(this[0], d, e ? "margin" : "border")) : null
    };
    c.fn[d] = function(e) {
      var f = this[0];
      if (!f)return e == null ? null : this;
      if (c.isFunction(e))return this.each(function(i) {
        var l =
            c(this);
        l[d](e.call(this, i, l[d]()))
      });
      if (c.isWindow(f)) {
        var g = f.document.documentElement["client" + b];
        return f.document.compatMode === "CSS1Compat" && g || f.document.body["client" + b] || g
      } else if (f.nodeType === 9)return Math.max(f.documentElement["client" + b], f.body["scroll" + b], f.documentElement["scroll" + b], f.body["offset" + b], f.documentElement["offset" + b]); else if (e === v) {
        f = c.css(f, d);
        g = parseFloat(f);
        return c.isNaN(g) ? f : g
      } else return this.css(d, typeof e === "string" ? e : e + "px")
    }
  });
  E.jQuery = E.$ = c
})(window);
;
steal.end();
steal.plugins("jquery").then(function(i) {
  var g = {undHash:/_|-/,colons:/::/,words:/([A-Z]+)([A-Z][a-z])/g,lowUp:/([a-z\d])([A-Z])/g,dash:/([a-z\d])([A-Z])/g,replacer:/\{([^\}]+)\}/g,dot:/\./},k = function(a, c, b) {
    return a[c] || b && (a[c] = {})
  },l = function(a) {
    return(a = typeof a) && (a == "function" || a == "object")
  },m = function(a, c, b) {
    a = a ? a.split(g.dot) : [];
    var f = a.length;
    c = i.isArray(c) ? c : [c || window];
    var d,e,h,n = 0;
    if (f == 0)return c[0];
    for (; d = c[n++];) {
      for (h = 0; h < f - 1 && l(d); h++)d = k(d, a[h], b);
      if (l(d)) {
        e = k(d, a[h], b);
        if (e !==
            undefined) {
          b === false && delete d[a[h]];
          return e
        }
      }
    }
  },j = i.String = i.extend(i.String || {}, {getObject:m,capitalize:function(a) {
    return a.charAt(0).toUpperCase() + a.substr(1)
  },camelize:function(a) {
    a = j.classize(a);
    return a.charAt(0).toLowerCase() + a.substr(1)
  },classize:function(a, c) {
    a = a.split(g.undHash);
    for (var b = 0; b < a.length; b++)a[b] = j.capitalize(a[b]);
    return a.join(c || "")
  },niceName:function(a) {
    j.classize(a, " ")
  },underscore:function(a) {
    return a.replace(g.colons, "/").replace(g.words, "$1_$2").replace(g.lowUp, "$1_$2").replace(g.dash,
        "_").toLowerCase()
  },sub:function(a, c, b) {
    var f = [];
    f.push(a.replace(g.replacer, function(d, e) {
      d = m(e, c, typeof b == "boolean" ? !b : b);
      e = typeof d;
      if ((e === "object" || e === "function") && e !== null) {
        f.push(d);
        return""
      } else return"" + d
    }));
    return f.length <= 1 ? f[0] : f
  }})
});
;
steal.end();
steal.plugins("jquery/event").then(function(a) {
  var e = jQuery.cleanData;
  a.cleanData = function(b) {
    for (var c = 0,d; (d = b[c]) !== undefined; c++)a(d).triggerHandler("destroyed");
    e(b)
  }
});
;
steal.end();
steal.plugins("jquery");
;
steal.end();
steal.plugins("jquery/controller", "jquery/lang/openajax").then(function() {
  jQuery.Controller.processors.subscribe = function(d, e, a, b) {
    var c = OpenAjax.hub.subscribe(a, b);
    return function() {
      OpenAjax.hub.unsubscribe(c)
    }
  };
  jQuery.Controller.prototype.publish = function() {
    OpenAjax.hub.publish.apply(OpenAjax.hub, arguments)
  }
});
;
steal.end();
steal.then(function() {
  if (!window.OpenAjax) {
    OpenAjax = new (function() {
      var d = {};
      this.hub = d;
      d.implementer = "http://openajax.org";
      d.implVersion = "1.0";
      d.specVersion = "1.0";
      d.implExtraData = {};
      var h = {};
      d.libraries = h;
      d.registerLibrary = function(a, c, b, e) {
        h[a] = {prefix:a,namespaceURI:c,version:b,extraData:e};
        this.publish("org.openajax.hub.registerLibrary", h[a])
      };
      d.unregisterLibrary = function(a) {
        this.publish("org.openajax.hub.unregisterLibrary", h[a]);
        delete h[a]
      };
      d._subscriptions = {c:{},s:[]};
      d._cleanup = [];
      d._subIndex =
          0;
      d._pubDepth = 0;
      d.subscribe = function(a, c, b, e, f) {
        b || (b = window);
        var g = a + "." + this._subIndex;
        c = {scope:b,cb:c,fcb:f,data:e,sid:this._subIndex++,hdl:g};
        this._subscribe(this._subscriptions, a.split("."), 0, c);
        return g
      };
      d.publish = function(a, c) {
        var b = a.split(".");
        this._pubDepth++;
        this._publish(this._subscriptions, b, 0, a, c);
        this._pubDepth--;
        if (this._cleanup.length > 0 && this._pubDepth == 0) {
          for (a = 0; a < this._cleanup.length; a++)this.unsubscribe(this._cleanup[a].hdl);
          delete this._cleanup;
          this._cleanup = []
        }
      };
      d.unsubscribe =
          function(a) {
            a = a.split(".");
            var c = a.pop();
            this._unsubscribe(this._subscriptions, a, 0, c)
          };
      d._subscribe = function(a, c, b, e) {
        var f = c[b];
        if (b == c.length)a.s.push(e); else {
          if (typeof a.c == "undefined")a.c = {};
          if (typeof a.c[f] == "undefined")a.c[f] = {c:{},s:[]};
          this._subscribe(a.c[f], c, b + 1, e)
        }
      };
      d._publish = function(a, c, b, e, f, g, l) {
        if (typeof a != "undefined") {
          if (b == c.length)a = a; else {
            this._publish(a.c[c[b]], c, b + 1, e, f, g, l);
            this._publish(a.c["*"], c, b + 1, e, f, g, l);
            a = a.c["**"]
          }
          if (typeof a != "undefined") {
            a = a.s;
            c = a.length;
            for (b =
                     0; b < c; b++)if (a[b].cb) {
              var j = a[b].scope,k = a[b].cb,i = a[b].fcb,m = a[b].data,n = a[b].sid,o = a[b].cid;
              if (typeof k == "string")k = j[k];
              if (typeof i == "string")i = j[i];
              if (!i || i.call(j, e, f, m))if (!g || g(e, f, l, o))k.call(j, e, f, m, n)
            }
          }
        }
      };
      d._unsubscribe = function(a, c, b, e) {
        if (typeof a != "undefined")if (b < c.length) {
          var f = a.c[c[b]];
          this._unsubscribe(f, c, b + 1, e);
          if (f.s.length == 0) {
            for (var g in f.c)return;
            delete a.c[c[b]]
          }
        } else {
          a = a.s;
          c = a.length;
          for (b = 0; b < c; b++)if (e == a[b].sid) {
            if (this._pubDepth > 0) {
              a[b].cb = null;
              this._cleanup.push(a[b])
            } else a.splice(b,
                1);
            return
          }
        }
      };
      d.reinit = function() {
        for (var a in OpenAjax.hub.libraries)delete OpenAjax.hub.libraries[a];
        OpenAjax.hub.registerLibrary("OpenAjax", "http://openajax.org/hub", "1.0", {});
        delete OpenAjax._subscriptions;
        OpenAjax._subscriptions = {c:{},s:[]};
        delete OpenAjax._cleanup;
        OpenAjax._cleanup = [];
        OpenAjax._subIndex = 0;
        OpenAjax._pubDepth = 0
      }
    });
    OpenAjax.hub.registerLibrary("OpenAjax", "http://openajax.org/hub", "1.0", {})
  }
  OpenAjax.hub.registerLibrary("JavaScriptMVC", "http://JavaScriptMVC.com", "3.0", {})
});
;
steal.end();
steal.plugins("jquery/view", "jquery/lang/rsplit").then(function(g) {
  var p = function(a) {
    eval(a)
  },q = function(a) {
    return a.substr(0, a.length - 1)
  },l = g.String.rsplit,j = g.extend,r = g.isArray,m = function(a) {
    return a.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/"/g, '\\"')
  };
  escapeHTML = function(a) {
    return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&#34;").replace(/'/g, "&#39;")
  };
  EJS = function(a) {
    if (this.constructor != EJS) {
      var b = new EJS(a);
      return function(c, e) {
        return b.render(c,
            e)
      }
    }
    if (typeof a == "function") {
      this.template = {};
      this.template.process = a
    } else {
      j(this, EJS.options, a);
      this.template = s(this.text, this.type, this.name)
    }
  };
  g.EJS = EJS;
  EJS.prototype = {constructor:EJS,render:function(a, b) {
    a = a || {};
    this._extra_helpers = b;
    b = new EJS.Helpers(a, b || {});
    return this.template.process.call(a, a, b)
  }};
  EJS.text = function(a) {
    if (typeof a == "string")return a;
    if (a === null || a === undefined)return"";
    var b = a.hookup && function(c, e) {
      a.hookup.call(a, c, e)
    } || typeof a == "function" && a || r(a) && function(c, e) {
      for (var d =
          0; d < a.length; d++)a[d].hookup ? a[d].hookup(c, e) : a[d](c, e)
    };
    if (b)return"data-view-id='" + g.View.hookup(b) + "'";
    return a.toString ? a.toString() : ""
  };
  EJS.clean = function(a) {
    return typeof a == "string" ? escapeHTML(a) : ""
  };
  var n = function(a, b, c) {
    b = l(b, /\n/);
    for (var e = 0; e < b.length; e++)t(a, b[e], c)
  },t = function(a, b, c) {
    a.lines++;
    b = l(b, a.splitter);
    for (var e,d = 0; d < b.length; d++) {
      e = b[d];
      e !== null && c(e, a)
    }
  },u = function(a, b) {
    var c = {};
    j(c, {left:a + "%",right:"%" + b,dLeft:a + "%%",dRight:"%%" + b,eeLeft:a + "%==",eLeft:a + "%=",cmnt:a + "%#",
      cleanLeft:a + "%~",scan:n,lines:0});
    c.splitter = new RegExp("(" + [c.dLeft,c.dRight,c.eeLeft,c.eLeft,c.cleanLeft,c.cmnt,c.left,c.right + "\n",c.right,"\n"].join(")|(").replace(/\[/g, "\\[").replace(/\]/g, "\\]") + ")");
    return c
  },s = function(a, b, c) {
    a = a.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    b = b || "<";
    var e = new EJS.Buffer(["var ___v1ew = [];"], []),d = "",o = function(h) {
      e.push("___v1ew.push(", '"', m(h), '");')
    },i = null,k = function() {
      d = ""
    };
    n(u(b, b === "[" ? "]" : ">"), a || "", function(h, f) {
      if (i === null)switch (h) {
        case "\n":
          d += "\n";
          o(d);
          e.cr();
          k();
          break;
        case f.left:
        case f.eLeft:
        case f.eeLeft:
        case f.cleanLeft:
        case f.cmnt:
          i = h;
          d.length > 0 && o(d);
          k();
          break;
        case f.dLeft:
          d += f.left;
          break;
        default:
          d += h;
          break
      } else switch (h) {
        case f.right:
          switch (i) {
            case f.left:
              if (d[d.length - 1] == "\n") {
                d = q(d);
                e.push(d, ";");
                e.cr()
              } else e.push(d, ";");
              break;
            case f.cleanLeft:
              e.push("___v1ew.push(", "(jQuery.EJS.clean(", d, ")));");
              break;
            case f.eLeft:
              e.push("___v1ew.push(", "(jQuery.EJS.text(", d, ")));");
              break;
            case f.eeLeft:
              e.push("___v1ew.push(", "(jQuery.EJS.text(",
                  d, ")));");
              break
          }
          i = null;
          k();
          break;
        case f.dRight:
          d += f.right;
          break;
        default:
          d += h;
          break
      }
    });
    d.length > 0 && e.push("___v1ew.push(", '"', m(d) + '");');
    a = {out:"try { with(_VIEW) { with (_CONTEXT) {" + e.close() + " return ___v1ew.join('');}}}catch(e){e.lineNumber=null;throw e;}"};
    p.call(a, "this.process = (function(_CONTEXT,_VIEW){" + a.out + "});\r\n//@ sourceURL=" + c + ".js");
    return a
  };
  EJS.Buffer = function(a, b) {
    this.line = [];
    this.script = [];
    this.post = b;
    this.push.apply(this, a)
  };
  EJS.Buffer.prototype = {push:function() {
    this.line.push.apply(this.line,
        arguments)
  },cr:function() {
    this.script.push(this.line.join(""), "\n");
    this.line = []
  },close:function() {
    if (this.line.length > 0) {
      this.script.push(this.line.join(""));
      this.line = []
    }
    this.post.length && this.push.apply(this, this.post);
    this.script.push(";");
    return this.script.join("")
  }};
  EJS.options = {type:"<",ext:".ejs"};
  EJS.Helpers = function(a, b) {
    this._data = a;
    this._extras = b;
    j(this, b)
  };
  EJS.Helpers.prototype = {plugin:function() {
    var a = g.makeArray(arguments),b = a.shift();
    return function(c) {
      c = g(c);
      c[b].apply(c, a)
    }
  },view:function(a, b, c) {
    c = c || this._extras;
    b = b || this._data;
    return g.View(a, b, c)
  }};
  g.View.register({suffix:"ejs",script:function(a, b) {
    return"jQuery.EJS(function(_CONTEXT,_VIEW) { " + (new EJS({text:b})).template.out + " })"
  },renderer:function(a, b) {
    var c = new EJS({text:b,name:a});
    return function(e, d) {
      return c.render.call(c, e, d)
    }
  }})
});
;
steal.end();
steal.plugins("jquery").then(function(i) {
  var x = function(a) {
    return a.replace(/^\/\//, "").replace(/[\/\.]/g, "_")
  },y = 1,e,o,p;
  isDeferred = function(a) {
    return a && i.isFunction(a.always)
  };
  getDeferreds = function(a) {
    var b = [];
    if (isDeferred(a))return[a]; else for (var c in a)isDeferred(a[c]) && b.push(a[c]);
    return b
  };
  usefulPart = function(a) {
    return i.isArray(a) && a.length === 3 && a[1] === "success" ? a[0] : a
  };
  e = i.View = function(a, b, c, d) {
    if (typeof c === "function") {
      d = c;
      c = undefined
    }
    var f = getDeferreds(b);
    if (f.length) {
      var g = i.Deferred();
      f.push(p(a, true));
      i.when.apply(i, f).then(function(j) {
        var k = i.makeArray(arguments),l = k.pop()[0];
        if (isDeferred(b))b = usefulPart(j); else for (var m in b)if (isDeferred(b[m]))b[m] = usefulPart(k.shift());
        k = l(b, c);
        g.resolve(k);
        d && d(k)
      });
      return g.promise()
    } else {
      var h;
      f = typeof d === "function";
      g = p(a, f);
      if (f) {
        h = g;
        g.done(function(j) {
          d(j(b, c))
        })
      } else g.done(function(j) {
        h = j(b, c)
      });
      return h
    }
  };
  o = function(a, b) {
    if (!a.match(/[^\s]/))throw"$.View ERROR: There is no template or an empty template at " + b;
  };
  p = function(a, b) {
    return i.ajax({url:a,
      dataType:"view",async:b})
  };
  i.ajaxTransport("view", function(a, b) {
    a = b.url;
    var c = a.match(/\.[\w\d]+$/),d,f,g,h = a,j,k = function(l) {
      l = d.renderer(g, l);
      if (e.cache)e.cached[g] = l;
      return{view:l}
    };
    if (f = document.getElementById(a))c = f.type.match(/\/[\d\w]+$/)[0].replace(/^\//, ".");
    if (!c) {
      c = e.ext;
      h += e.ext
    }
    g = x(h);
    if (h.match(/^\/\//))h = typeof steal === "undefined" ? "/" + h.substr(2) : steal.root.join(h.substr(2));
    d = e.types[c];
    return{send:function(l, m) {
      if (e.cached[g])return m(200, "success", {view:e.cached[g]}); else if (f)m(200,
          "success", k(f.innerHTML)); else j = i.ajax({async:b.async,url:h,dataType:"text",error:function() {
        o("", h);
        m(404)
      },success:function(s) {
        o(s, h);
        m(200, "success", k(s))
      }})
    },abort:function() {
      j && j.abort()
    }}
  });
  i.extend(e, {hookups:{},hookup:function(a) {
    var b = ++y;
    e.hookups[b] = a;
    return b
  },cached:{},cache:true,register:function(a) {
    this.types["." + a.suffix] = a
  },types:{},ext:".ejs",registerScript:function(a, b, c) {
    return"$.View.preload('" + b + "'," + e.types["." + a].script(b, c) + ");"
  },preload:function(a, b) {
    e.cached[a] = function(c, d) {
      return b.call(c, c, d)
    }
  }});
  var t,n,u,v,w,q;
  t = function(a) {
    var b = i.fn[a];
    i.fn[a] = function() {
      var c = i.makeArray(arguments),d,f,g = this;
      if (u(c)) {
        if (d = v(c)) {
          f = c[d];
          c[d] = function(h) {
            n.call(g, [h], b);
            f.call(g, h)
          };
          e.apply(e, c);
          return this
        }
        c = e.apply(e, c);
        if (isDeferred(c)) {
          c.done(function(h) {
            n.call(g, [h], b)
          });
          return this
        } else c = [c]
      }
      return n.call(this, c, b)
    }
  };
  n = function(a, b) {
    var c;
    for (var d in e.hookups)break;
    if (d) {
      c = e.hookups;
      e.hookups = {};
      a[0] = i(a[0])
    }
    b = b.apply(this, a);
    d && w(a[0], c);
    return b
  };
  u = function(a) {
    var b =
        typeof a[1];
    return typeof a[0] == "string" && (b == "object" || b == "function") && !a[1].nodeType && !a[1].jquery
  };
  v = function(a) {
    return typeof a[3] === "function" ? 3 : typeof a[2] === "function" && 2
  };
  w = function(a, b) {
    var c,d = 0,f,g;
    a = a.filter(function() {
      return this.nodeType != 3
    });
    a = a.add("[data-view-id]", a);
    for (c = a.length; d < c; d++)if (a[d].getAttribute && (f = a[d].getAttribute("data-view-id")) && (g = b[f])) {
      g(a[d], f);
      delete b[f];
      a[d].removeAttribute("data-view-id")
    }
    i.extend(e.hookups, b)
  };
  q = ["prepend","append","after","before","text",
    "html","replaceWith","val"];
  for (var r = 0; r < q.length; r++)t(q[r])
});
;
steal.end();
steal.plugins("jquery/lang").then(function(f) {
  f.String.rsplit = function(a, e) {
    for (var b = e.exec(a),c = [],d; b !== null;) {
      d = b.index;
      if (d !== 0) {
        c.push(a.substring(0, d));
        a = a.slice(d)
      }
      c.push(b[0]);
      a = a.slice(b[0].length);
      b = e.exec(a)
    }
    a !== "" && c.push(a);
    return c
  }
});
;
steal.end();
steal.plugins("jquery/controller", "jquery/view").then(function() {
  jQuery.Controller.getFolder = function() {
    return jQuery.String.underscore(this.fullName.replace(/\./g, "/")).replace("/Controllers", "")
  };
  var g = function(a, b, c) {
    var d = a.fullName.replace(/\./g, "/"),e = d.indexOf("/Controllers/" + a.shortName) != -1;
    d = jQuery.String.underscore(d.replace("/Controllers/" + a.shortName, ""));
    a = a._shortName;
    var f = typeof b == "string" && b.match(/\.[\w\d]+$/) || jQuery.View.ext;
    if (typeof b == "string") {
      if (b.substr(0, 2) != "//")b = "//" +
          (new steal.File("views/" + (b.indexOf("/") !== -1 ? b : (e ? a + "/" : "") + b))).joinFrom(d) + f
    } else b || (b = "//" + (new steal.File("views/" + (e ? a + "/" : "") + c.replace(/\.|#/g, "").replace(/ /g, "_"))).joinFrom(d) + f);
    return b
  },h = function(a) {
    var b = {};
    if (a)if (jQuery.isArray(a))for (var c = 0; c < a.length; c++)jQuery.extend(b, a[c]); else jQuery.extend(b, a); else {
      if (this._default_helpers)b = this._default_helpers;
      a = window;
      c = this.Class.fullName.split(/\./);
      for (var d = 0; d < c.length; d++) {
        typeof a.Helpers == "object" && jQuery.extend(b, a.Helpers);
        a = a[c[d]]
      }
      typeof a.Helpers == "object" && jQuery.extend(b, a.Helpers);
      this._default_helpers = b
    }
    return b
  };
  jQuery.Controller.prototype.view = function(a, b, c) {
    if (typeof a != "string" && !c) {
      c = b;
      b = a;
      a = null
    }
    a = g(this.Class, a, this.called);
    b = b || this;
    c = h.call(this, c);
    return jQuery.View(a, b, c)
  }
});
;
steal.end();
steal.plugins("jquery/class", "jquery/lang").then(function() {
  var m = $.String.underscore,y = $.String.classize,q = $.isArray,r = $.makeArray,p = $.extend,j = $.each,z = /GET|POST|PUT|DELETE/i,k = function(a, b, c, e, f, d, g) {
    g = g || "json";
    var h = "";
    if (typeof a == "string") {
      var i = a.indexOf(" ");
      if (i > 2 && i < 7) {
        h = a.substr(0, i);
        if (z.test(h))d = h; else g = h;
        h = a.substr(i + 1)
      } else h = a
    }
    typeof b == "object" && (b = p({}, b));
    a = $.String.sub(h, b, true);
    return $.ajax({url:a,data:b,success:c,error:e,type:d || "post",dataType:g,fixture:f})
  },s = function(a, b) {
    var c = m(this.shortName),e = "-" + c + (a || "");
    return $.fixture && $.fixture[e] ? e : b || "//" + m(this.fullName).replace(/\.models\..*/, "").replace(/\./g, "/") + "/fixtures/" + c + (a || "") + ".json"
  },A = function(a, b) {
    a = a || {};
    var c = this.id;
    if (a[c] && a[c] !== b) {
      a["new" + $.String.capitalize(b)] = a[c];
      delete a[c]
    }
    a[c] = b;
    return a
  },t = function(a) {
    return new (a || $.Model.List || Array)
  },n = function(a) {
    return a[a.Class.id]
  },B = function(a) {
    for (var b = [],c = 0; c < a.length; c++)if (!a[c]["__u Nique"]) {
      b.push(a[c]);
      a[c]["__u Nique"] = true
    }
    for (c = 0; c <
        b.length; c++)delete b[c]["__u Nique"];
    return b
  },u = function(a, b, c, e, f) {
    var d = $.Deferred(),g = [a.attrs(),function(h) {
      a[f || b + "d"](h);
      d.resolveWith(a, [a,h,b])
    },function(h) {
      d.rejectWith(a, [h])
    }];
    b == "destroy" && g.shift();
    b !== "create" && g.unshift(n(a));
    d.then(c);
    d.fail(e);
    a.Class[b].apply(a.Class, g);
    return d.promise()
  },o = function(a) {
    return typeof a === "object" && a !== null && a
  },l = function(a) {
    return function() {
      $.fn[a].apply($([this]), arguments);
      return this
    }
  },v = l("bind");
  l = l("unbind");
  ajaxMethods = {create:function(a) {
    return function(b, c, e) {
      return k(a, b, c, e, "-restCreate")
    }
  },update:function(a) {
    return function(b, c, e, f) {
      return k(a, A.call(this, c, b), e, f, "-restUpdate", "put")
    }
  },destroy:function(a) {
    return function(b, c, e) {
      var f = {};
      f[this.id] = b;
      return k(a, f, c, e, "-restDestroy", "delete")
    }
  },findAll:function(a) {
    return function(b, c, e) {
      return k(a || this.shortName + "s.json", b, c, e, s.call(this, "s"), "get", "json " + this._shortName + ".models")
    }
  },findOne:function(a) {
    return function(b, c, e) {
      return k(a, b, c, e, s.call(this), "get", "json " + this._shortName + ".model")
    }
  }};
  jQuery.Class("jQuery.Model", {setup:function(a) {
    var b = this;
    j(["attributes","associations","validations"], function(f, d) {
      if (!b[d] || a[d] === b[d])b[d] = {}
    });
    if (a.convert != this.convert)this.convert = p(a.convert, this.convert);
    this._fullName = m(this.fullName.replace(/\./g, "_"));
    this._shortName = m(this.shortName);
    if (this.fullName.substr(0, 7) != "jQuery.") {
      if (this.listType)this.list = new this.listType([]);
      for (var c in ajaxMethods)if (typeof this[c] !== "function")this[c] = ajaxMethods[c](this[c]);
      c = {};
      var e = "* " + this._shortName +
          ".model";
      c[e + "s"] = this.callback("models");
      c[e] = this.callback("model");
      $.ajaxSetup({converters:c})
    }
  },attributes:{},model:function(a) {
    if (!a)return null;
    return new this(o(a[this._shortName]) || o(a.data) || o(a.attributes) || a)
  },models:function(a) {
    if (!a)return null;
    var b = t(this.List),c = q(a),e = c ? a : a.data,f = e.length,d = 0;
    for (b._use_call = true; d < f; d++)b.push(this.model(e[d]));
    if (!c)for (var g in a)if (g !== "data")b[g] = a[g];
    return b
  },id:"id",addAttr:function(a, b) {
    if (!this.associations[a]) {
      this.attributes[a] || (this.attributes[a] =
          b);
      return b
    }
  },_models:{},publish:function(a, b) {
    window.OpenAjax && OpenAjax.hub.publish(this._shortName + "." + a, b)
  },guessType:function() {
    return"string"
  },convert:{date:function(a) {
    return typeof a === "string" ? isNaN(Date.parse(a)) ? null : Date.parse(a) : a
  },number:function(a) {
    return parseFloat(a)
  },"boolean":function(a) {
    return Boolean(a)
  },"default":function(a, b, c) {
    return(b = $.String.getObject(c)) ? b(a) : a
  }},serialize:{"default":function(a) {
    return o(a) && a.serialize ? a.serialize() : a
  }},bind:v,unbind:l}, {setup:function(a) {
    this._init =
        true;
    this.attrs(p({}, this.Class.defaults, a));
    delete this._init
  },update:function(a, b, c) {
    this.attrs(a);
    return this.save(b, c)
  },errors:function(a) {
    if (a)a = q(a) ? a : r(arguments);
    var b = {},c = this,e = function(d, g) {
      j(g, function(h, i) {
        if (h = i.call(c)) {
          b.hasOwnProperty(d) || (b[d] = []);
          b[d].push(h)
        }
      })
    };
    j(a || this.Class.validations || {}, function(d, g) {
      if (typeof d == "number") {
        d = g;
        g = c.Class.validations[d]
      }
      e(d, g || [])
    });
    for (var f in b)if (b.hasOwnProperty(f))return b;
    return null
  },attr:function(a, b, c, e) {
    var f = y(a),d = "get" + f;
    if (b !==
        undefined) {
      this._setProperty(a, b, c, e, f);
      return this
    }
    return this[d] ? this[d]() : this[a]
  },bind:v,unbind:l,_setProperty:function(a, b, c, e, f) {
    f = "set" + f;
    var d = this[a],g = this,h = function(i) {
      e && e.call(g, i);
      $(g).triggerHandler("error." + a, i)
    };
    this[f] && (b = this[f](b, this.callback("_updateProperty", a, b, d, c, h), h)) === undefined || this._updateProperty(a, b, d, c, h)
  },_updateProperty:function(a, b, c, e, f) {
    var d = this.Class,g = d.attributes[a] || d.addAttr(a, d.guessType(b)),h = d.convert[g] || d.convert["default"],i = null,w = "",x = "updated.";
    e = e;
    b = this[a] = b === null ? null : h.call(d, b, function() {
    }, g);
    this._init || (i = this.errors(a));
    g = [b];
    h = [a,b,c];
    if (i) {
      w = x = "error.";
      e = f;
      h.splice(1, 0, i);
      g.unshift(i)
    }
    if (c !== b && !this._init) {
      !i && $(this).triggerHandler(w + a, g);
      $(this).triggerHandler(x + "attr", h)
    }
    e && e.apply(this, g);
    if (a === d.id && b !== null && d.list)if (c) {
      if (c != b) {
        d.list.remove(c);
        d.list.push(this)
      }
    } else d.list.push(this)
  },attrs:function(a) {
    var b;
    if (a) {
      var c = this.Class.id;
      for (b in a)b != c && this.attr(b, a[b]);
      c in a && this.attr(c, a[c])
    } else {
      a = {};
      for (b in this.Class.attributes)if (this.Class.attributes.hasOwnProperty(b))a[b] =
          this.attr(b)
    }
    return a
  },serialize:function() {
    var a = this.Class,b = a.attributes,c,e,f = {},d;
    attributes = {};
    for (d in b)if (b.hasOwnProperty(d)) {
      c = b[d];
      e = a.serialize[c] || a.serialize["default"];
      f[d] = e(this[d], c)
    }
    return f
  },isNew:function() {
    var a = n(this);
    return a === undefined || a === null
  },save:function(a, b) {
    return u(this, this.isNew() ? "create" : "update", a, b)
  },destroy:function(a, b) {
    return u(this, "destroy", a, b, "destroyed")
  },identity:function() {
    var a = n(this);
    return this.Class._fullName + "_" + (this.Class.escapeIdentity ?
        encodeURIComponent(a) : a)
  },elements:function(a) {
    return $("." + this.identity(), a)
  },publish:function(a, b) {
    this.Class.publish(a, b || this)
  },hookup:function(a) {
    var b = this.Class._shortName,c = $.data(a, "models") || $.data(a, "models", {});
    $(a).addClass(b + " " + this.identity());
    c[b] = this
  }});
  $.Model.wrapMany = $.Model.models;
  $.Model.wrap = $.Model.model;
  j(["created","updated","destroyed"], function(a, b) {
    $.Model.prototype[b] = function(c) {
      b === "destroyed" && this.Class.list && this.Class.list.remove(n(this));
      c && typeof c == "object" &&
      this.attrs(c.attrs ? c.attrs() : c);
      $(this).triggerHandler(b);
      this.publish(b, this);
      $([this.Class]).triggerHandler(b, this);
      return[this].concat(r(arguments))
    }
  });
  $.fn.models = function() {
    var a = [],b,c;
    this.each(function() {
      j($.data(this, "models") || {}, function(e, f) {
        b = b === undefined ? f.Class.List || null : f.Class.List === b ? b : null;
        a.push(f)
      })
    });
    c = t(b);
    c.push.apply(c, B(a));
    return c
  };
  $.fn.model = function(a) {
    if (a && a instanceof $.Model) {
      a.hookup(this[0]);
      return this
    } else return this.models.apply(this, arguments)[0]
  }
});
;
steal.end();
steal.plugins("jquery/dom").then(function(c) {
  c.ajaxPrefilter(function(a) {
    if (c.fixture.on) {
      x(a);
      if (a.fixture) {
        if (typeof a.fixture === "string" && c.fixture[a.fixture])a.fixture = c.fixture[a.fixture];
        if (typeof a.fixture == "string") {
          var b = a.fixture;
          if (/^\/\//.test(b))b = steal.root.join(a.fixture.substr(2));
          a.url = b;
          a.data = null;
          a.type = "GET";
          if (!a.error)a.error = function(d, e, g) {
            throw"fixtures.js Error " + e + " " + g;
          }
        } else a.dataTypes.splice(0, 0, "fixture")
      }
    }
  });
  c.ajaxTransport("fixture", function(a, b) {
    a.dataTypes.shift();
    var d = a.dataTypes[0],e;
    return{send:function(g, q) {
      e = setTimeout(function() {
        var i = a.fixture(b, a, g);
        if (!c.isArray(i)) {
          var m = [
            {}
          ];
          m[0][d] = i;
          i = m
        }
        typeof i[0] != "number" && i.unshift(200, "success");
        if (!i[2] || !i[2][d]) {
          m = {};
          m[d] = i[2];
          i[2] = m
        }
        q.apply(null, i)
      }, c.fixture.delay)
    },abort:function() {
      clearTimeout(e)
    }}
  });
  var v = /^(script|json|test|jsonp)$/,r = [],y = function(a, b, d) {
    a = c.extend({}, a);
    for (var e in b) {
      if (e !== "fixture")if (b[e] !== a[e])return false;
      d && delete a[e]
    }
    if (d)for (var g in a)return false;
    return true
  },w = function(a, b) {
    for (var d = 0; d < r.length; d++)if (y(a, r[d], b))return d;
    return-1
  },x = function(a) {
    var b = w(a);
    if (b > -1)a.fixture = r[b].fixture
  },t = function(a) {
    var b = a.data.id;
    b === undefined && a.url.replace(/\/(\d+)(\/|$)/g, function(d, e) {
      b = e
    });
    if (b === undefined)b = a.url.replace(/\/(\w+)(\/|$)/g, function(d, e) {
      if (e != "update")b = e
    });
    if (b === undefined)b = Math.round(Math.random() * 1E3);
    return b
  };
  c.fixture = function(a, b) {
    if (b !== undefined) {
      if (typeof a == "string")a = {url:a};
      var d = w(a, !!b);
      d >= -1 && r.splice(d, 1);
      if (b != null) {
        a.fixture = b;
        r.push(a)
      }
    }
  };
  c.extend(c.fixture, {"-restUpdate":function(a) {
    return[
      {id:t(a)},
      {location:a.url + "/" + t(a)}
    ]
  },"-restDestroy":function() {
    return{}
  },"-restCreate":function(a) {
    var b = parseInt(Math.random() * 1E5, 10);
    return[
      {id:b},
      {location:a.url + "/" + b}
    ]
  },make:function(a, b, d, e) {
    if (typeof a === "string")a = [a + "s",a];
    for (var g = c.fixture["~" + a[0]] = [],q = function(f) {
      for (var h = 0; h < g.length; h++)if (f == g[h].id)return g[h]
    },i = 0; i < b; i++) {
      var m = d(i, g);
      if (!m.id)m.id = i;
      g.push(m)
    }
    c.fixture["-" + a[0]] = function(f) {
      var h = g.slice(0);
      c.each((f.data.order ||
          []).slice(0).reverse(), function(z, u) {
        var k = u.split(" ");
        h = h.sort(function(n, o) {
          return k[1].toUpperCase() !== "ASC" ? n[k[0]] < o[k[0]] ? 1 : n[k[0]] == o[k[0]] ? 0 : -1 : n[k[0]] < o[k[0]] ? -1 : n[k[0]] == o[k[0]] ? 0 : 1
        })
      });
      c.each((f.data.group || []).slice(0).reverse(), function(z, u) {
        var k = u.split(" ");
        h = h.sort(function(n, o) {
          return n[k[0]] > o[k[0]]
        })
      });
      var j = parseInt(f.data.offset, 10) || 0,p = parseInt(f.data.limit, 10) || b - j,l = 0;
      for (var s in f.data) {
        l = 0;
        if (f.data[s] != undefined && (s.indexOf("Id") != -1 || s.indexOf("_id") != -1))for (; l < h.length;)if (f.data[s] !=
            h[l][s])h.splice(l, 1); else l++
      }
      if (e)for (l = 0; l < h.length;)if (e(h[l], f))l++; else h.splice(l, 1);
      return[
        {count:h.length,limit:f.data.limit,offset:f.data.offset,data:h.slice(j, j + p)}
      ]
    };
    c.fixture["-" + a[1]] = function(f) {
      return[q(f.data.id !== undefined ? f.data.id : f.data)]
    };
    c.fixture["-" + a[1] + "Update"] = function(f, h) {
      var j = t(f);
      c.extend(q(j), f.data);
      return c.fixture["-restUpdate"](f, h)
    };
    c.fixture["-" + a[1] + "Destroy"] = function(f, h) {
      for (var j = t(f),p = 0; p < g.length; p++)if (g[p].id == j) {
        g.splice(p, 1);
        break
      }
      c.extend(q(j),
          f.data);
      return c.fixture["-restDestroy"](f, h)
    };
    c.fixture["-" + a[1] + "Create"] = function(f, h) {
      var j = d(g.length, g);
      c.extend(j, f.data);
      if (!j.id)j.id = g.length;
      g.push(j);
      return c.fixture["-restCreate"](f, h)
    }
  },xhr:function(a) {
    return c.extend({}, {abort:c.noop,getAllResponseHeaders:function() {
      return""
    },getResponseHeader:function() {
      return""
    },open:c.noop,overrideMimeType:c.noop,readyState:4,responseText:"",responseXML:null,send:c.noop,setRequestHeader:c.noop,status:200,statusText:"OK"}, a)
  },on:true});
  c.fixture.delay =
      200;
  c.fixture["-handleFunction"] = function(a) {
    if (typeof a.fixture === "string" && c.fixture[a.fixture])a.fixture = c.fixture[a.fixture];
    if (typeof a.fixture == "function") {
      setTimeout(function() {
        a.success && a.success.apply(null, a.fixture(a, "success"));
        a.complete && a.complete.apply(null, a.fixture(a, "complete"))
      }, c.fixture.delay);
      return true
    }
    return false
  };
  c.get = function(a, b, d, e, g) {
    if (jQuery.isFunction(b)) {
      if (!v.test(e || "")) {
        g = e;
        e = d
      }
      d = b;
      b = null
    }
    if (jQuery.isFunction(b)) {
      g = e;
      e = d;
      d = b;
      b = null
    }
    return jQuery.ajax({type:"GET",
      url:a,data:b,success:d,dataType:e,fixture:g})
  };
  c.post = function(a, b, d, e, g) {
    if (jQuery.isFunction(b)) {
      if (!v.test(e || "")) {
        g = e;
        e = d
      }
      d = b;
      b = {}
    }
    return jQuery.ajax({type:"POST",url:a,data:b,success:d,dataType:e,fixture:g})
  }
});
;
steal.end();
steal.plugins("jquery");
;
steal.end();
steal.plugins("jquery/dom").then(function(g) {
  var j = /radio|checkbox/i,k = /[^\[\]]+/g,l = /^[\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?$/,m = function(d) {
    if (typeof d == "number")return true;
    if (typeof d != "string")return false;
    return d.match(l)
  };
  g.fn.extend({formParams:function(d) {
    if (this[0].nodeName.toLowerCase() == "form" && this[0].elements)return jQuery(jQuery.makeArray(this[0].elements)).getParams(d);
    return jQuery("input[name], textarea[name], select[name]", this[0]).getParams(d)
  },getParams:function(d) {
    var h = {},
        b;
    d = d === undefined ? true : d;
    this.each(function() {
      var c = this,i = c.type && c.type.toLowerCase();
      if (!(i == "submit" || !c.name)) {
        var a = c.name,e = g.data(c, "value") || g.fn.val.call([c]),f = j.test(c.type);
        a = a.match(k);
        c = !f || !!c.checked;
        if (d)if (m(e))e = parseFloat(e); else if (e === "true" || e === "false")e = Boolean(e);
        b = h;
        for (f = 0; f < a.length - 1; f++) {
          b[a[f]] || (b[a[f]] = {});
          b = b[a[f]]
        }
        a = a[a.length - 1];
        if (a in b && i === "checkbox") {
          g.isArray(b[a]) || (b[a] = b[a] === undefined ? [] : [b[a]]);
          c && b[a].push(e)
        } else if (c || !b[a])b[a] = c ? e : undefined
      }
    });
    return h
  }})
});
;
steal.end();
$.Model.extend("Cookbook.Models.Recipe", {findAll:function(a, b, c) {
  $.ajax({url:"/recipe",type:"get",dataType:"json",data:a,success:this.callback(["wrapMany",b]),error:c,fixture:"//cookbook/fixtures/recipes.json.get"})
},update:function(a, b, c, d) {
  $.ajax({url:"/recipes/" + a,type:"put",dataType:"json",data:b,success:c,error:d,fixture:"-restUpdate"})
},destroy:function(a, b, c) {
  $.ajax({url:"/recipes/" + a,type:"delete",dataType:"json",success:b,error:c,fixture:"-restDestroy"})
},create:function(a, b, c) {
  $.ajax({url:"/recipes",
    type:"post",dataType:"json",success:b,error:c,data:a,fixture:"-restCreate"})
}}, {isTasty:function() {
  return!/mushroom/.test(this.name + " " + this.description)
}});
;
steal.end();
$.Controller.extend("Cookbook.Controllers.Recipe", {onDocument:true}, {"{window} load":function() {
  if (!$("#recipe").length) {
    $(document.body).append($("<div/>").attr("id", "recipe"));
    Cookbook.Models.Recipe.findAll({}, this.callback("list"))
  }
},list:function(a) {
  $("#recipe").html(this.view("init", {recipes:a}))
},"form submit":function(a, b) {
  b.preventDefault();
  (new Cookbook.Models.Recipe(a.formParams())).save()
},"recipe.created subscribe":function(a, b) {
  $("#recipe tbody").append(this.view("list", {recipes:[b]}));
  $("#recipe form input[type!=submit]").val("")
},".edit click":function(a) {
  a = a.closest(".recipe").model();
  a.elements().html(this.view("edit", a))
},".cancel click":function(a) {
  this.show(a.closest(".recipe").model())
},".update click":function(a) {
  a = a.closest(".recipe");
  a.model().update(a.formParams())
},"recipe.updated subscribe":function(a, b) {
  this.show(b)
},show:function(a) {
  a.elements().html(this.view("show", a))
},".destroy click":function(a) {
  confirm("Are you sure you want to destroy?") && a.closest(".recipe").model().destroy()
},
  "recipe.destroyed subscribe":function(a, b) {
    b.elements().remove()
  }});
;
steal.end()