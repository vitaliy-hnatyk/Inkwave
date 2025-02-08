!function () {
    "use strict";

    function t(t, e) {
        function checkValueChanged(key, newValue, oldValue) {
            // Only broadcast rebind event if value actually changed
            if (newValue !== oldValue) {
                t.$broadcast("$$rebind::" + key);
            }
        }

        // Watch each property in the notifier object for changes
        Object.keys(e).forEach((function(key) {
            // Set up watcher with deep object comparison if value is an object
            t.$watch(e[key], 
                checkValueChanged.bind(null, key),
                "object" == typeof t[e[key]]
            );
        }));
    }

    function e(t) {
        function e(t, e, i) {
            return function (t, n, r) {
                // Initialize variables for parsing
                var parsedParts, currentPart, parsedExpression, finalExpression, notifierKeys;
                
                // Return original if not a string or doesn't match expected format
                if ("string" != typeof n || !e.test(n)) return t.call(this, n, r);
                
                // Split by colon and process parts
                parsedParts = n.split(":");
                notifierKeys = [];
                
                while (parsedParts.length) {
                    if ((currentPart = parsedParts.shift()) && currentPart.trim()) {
                        // If part doesn't match notifier key format, treat rest as expression
                        if (!i.test(currentPart)) {
                            finalExpression = [currentPart].concat(parsedParts).join(":");
                            break;
                        }
                        notifierKeys.push(currentPart);
                    }
                }
                
                // Get final expression from last notifier key if needed
                finalExpression || (finalExpression = notifierKeys.splice(-1, 1)[0]);
                
                // Parse expression and set up watch delegate
                parsedExpression = t.call(this, "::" + finalExpression, r);
                parsedExpression.$$watchDelegate = function(t, e) {
                    function setupNotifierListeners(scope, listener) {
                        e.forEach(function(key) {
                            scope.$on("$$rebind::" + key, listener);
                        });
                    }

                    if (t.$$watchDelegate.wrapped) return t.$$watchDelegate;
                    
                    var wrappedDelegate = function(originalDelegate, scope, newVal, oldVal, forceWatch) {
                        var boundFn = originalDelegate.bind(this, scope, newVal, oldVal, forceWatch);
                        setupNotifierListeners(scope, boundFn);
                        return boundFn();
                    }.bind(this, t.$$watchDelegate);
                    
                    wrappedDelegate.wrapped = true;
                    return wrappedDelegate;
                }(parsedExpression, notifierKeys);
                
                return parsedExpression;
            }.bind(null, t)
        }

        e.$inject = ["$delegate", "bindNotifierRegex", "bindNotifierKeyRegex"], t.decorator("$parse", e)
    }

    e.$inject = ["$provide"], angular.module("angular.bind.notifier", []).constant("bindNotifierKeyRegex", /^[a-zA-Z0-9][\w-]*$/).constant("bindNotifierRegex", /^[\s]*:([a-zA-Z0-9][\w-]*):(.+\n?)+$/).factory("$Notifier", (function () {
        return function (e, i) {
            if (!e) throw new Error("No $scope given");
            if (!i) throw new Error("No notifier object given");
            t(e, i)
        }
    })).directive("bindNotifier", (function () {
        return {
            restrict: "A", scope: !0, compile: function (e, i) {
                var n = {};
                return i.bindNotifier.replace(/[\{\}\s]/g, "").split(",").forEach((function (t) {
                    var e = t.split(":");
                    n[e[0]] = e[1]
                })), function (e) {
                    t(e, n)
                }
            }
        }
    })).config(e)
}();
var fabric = fabric || {version: "3.4.0"};
if ("undefined" != typeof exports ? exports.fabric = fabric : "function" == typeof define && define.amd && define([], (function () {
    return fabric
})), "undefined" != typeof document && "undefined" != typeof window) document instanceof ("undefined" != typeof HTMLDocument ? HTMLDocument : Document) ? fabric.document = document : fabric.document = document.implementation.createHTMLDocument(""), fabric.window = window; else {
    var jsdom = require("jsdom"),
        virtualWindow = new jsdom.JSDOM(decodeURIComponent("%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E"), {
            features: {FetchExternalResources: ["img"]},
            resources: "usable"
        }).window;
    fabric.document = virtualWindow.document, fabric.jsdomImplForWrapper = require("jsdom/lib/jsdom/living/generated/utils").implForWrapper, fabric.nodeCanvas = require("jsdom/lib/jsdom/utils").Canvas, fabric.window = virtualWindow, DOMParser = fabric.window.DOMParser
}

function resizeCanvasIfNeeded(t) {
    var e = t.targetCanvas, i = e.width, n = e.height, r = t.destinationWidth, o = t.destinationHeight;
    i === r && n === o || (e.width = r, e.height = o)
}

function copyGLTo2DDrawImage(t, e) {
    var i = t.canvas, n = e.targetCanvas, r = n.getContext("2d");
    r.translate(0, n.height), r.scale(1, -1);
    var o = i.height - n.height;
    r.drawImage(i, 0, o, n.width, n.height, 0, 0, n.width, n.height)
}

function copyGLTo2DPutImageData(t, e) {
    var i = e.targetCanvas.getContext("2d"), n = e.destinationWidth, r = e.destinationHeight, o = n * r * 4,
        s = new Uint8Array(this.imageBuffer, 0, o), a = new Uint8ClampedArray(this.imageBuffer, 0, o);
    t.readPixels(0, 0, n, r, t.RGBA, t.UNSIGNED_BYTE, s);
    var c = new ImageData(a, n, r);
    i.putImageData(c, 0, 0)
}

fabric.isTouchSupported = "ontouchstart" in fabric.window || "ontouchstart" in fabric.document || fabric.window && fabric.window.navigator && 0 < fabric.window.navigator.maxTouchPoints, fabric.isLikelyNode = "undefined" != typeof Buffer && "undefined" == typeof window, fabric.SHARED_ATTRIBUTES = ["display", "transform", "fill", "fill-opacity", "fill-rule", "opacity", "stroke", "stroke-dasharray", "stroke-linecap", "stroke-dashoffset", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "id", "paint-order", "vector-effect", "instantiated_by_use", "clip-path"], fabric.DPI = 96, fabric.reNum = "(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:[eE][-+]?\\d+)?)", fabric.fontPaths = {}, fabric.iMatrix = [1, 0, 0, 1, 0, 0], fabric.perfLimitSizeTotal = 2097152, fabric.maxCacheSideLimit = 4096, fabric.minCacheSideLimit = 256, fabric.charWidthsCache = {}, fabric.textureSize = 2048, fabric.disableStyleCopyPaste = !1, fabric.enableGLFiltering = !0, fabric.devicePixelRatio = fabric.window.devicePixelRatio || fabric.window.webkitDevicePixelRatio || fabric.window.mozDevicePixelRatio || 1, fabric.browserShadowBlurConstant = 1, fabric.arcToSegmentsCache = {}, fabric.boundsOfCurveCache = {}, fabric.cachesBoundsOfCurve = !0, fabric.forceGLPutImageData = !1, fabric.initFilterBackend = function () {
    return fabric.enableGLFiltering && fabric.isWebglSupported && fabric.isWebglSupported(fabric.textureSize) ? (console.log("max texture size: " + fabric.maxTextureSize), new fabric.WebglFilterBackend({tileSize: fabric.textureSize})) : fabric.Canvas2dFilterBackend ? new fabric.Canvas2dFilterBackend : void 0
}, "undefined" != typeof document && "undefined" != typeof window && (window.fabric = fabric), function () {
    function t(t, e) {
        if (this.__eventListeners[t]) {
            var i = this.__eventListeners[t];
            e ? i[i.indexOf(e)] = !1 : fabric.util.array.fill(i, !1)
        }
    }

    function e(t, e) {
        if (this.__eventListeners || (this.__eventListeners = {}), 1 === arguments.length) for (var i in t) this.on(i, t[i]); else this.__eventListeners[t] || (this.__eventListeners[t] = []), this.__eventListeners[t].push(e);
        return this
    }

    function i(e, i) {
        if (!this.__eventListeners) return this;
        if (0 === arguments.length) for (e in this.__eventListeners) t.call(this, e); else if (1 === arguments.length && "object" == typeof e) for (var n in e) t.call(this, n, e[n]); else t.call(this, e, i);
        return this
    }

    function n(t, e) {
        if (!this.__eventListeners) return this;
        var i = this.__eventListeners[t];
        if (!i) return this;
        for (var n = 0, r = i.length; n < r; n++) i[n] && i[n].call(this, e || {});
        return this.__eventListeners[t] = i.filter((function (t) {
            return !1 !== t
        })), this
    }

    fabric.Observable = {observe: e, stopObserving: i, fire: n, on: e, off: i, trigger: n}
}(), fabric.Collection = {
    _objects: [], add: function () {
        if (this._objects.push.apply(this._objects, arguments), this._onObjectAdded)
            for (var t = 0, e = arguments.length; t < e; t++)
               if( arguments[t] ) this._onObjectAdded(arguments[t]);
        return this.renderOnAddRemove && this.requestRenderAll(), this
    }, insertAt: function (t, e, i) {
        var n = this._objects;
        return i ? n[e] = t : n.splice(e, 0, t), this._onObjectAdded && this._onObjectAdded(t), this.renderOnAddRemove && this.requestRenderAll(), this
    }, remove: function () {
        for (var t, e = this._objects, i = !1, n = 0, r = arguments.length; n < r; n++) -1 !== (t = e.indexOf(arguments[n])) && (i = !0, e.splice(t, 1), this._onObjectRemoved && this._onObjectRemoved(arguments[n]));
        return this.renderOnAddRemove && i && this.requestRenderAll(), this
    }, forEachObject: function (t, e) {
        for (var i = this.getObjects(), n = 0, r = i.length; n < r; n++) t.call(e, i[n], n, i);
        return this
    }, getObjects: function (t) {
        return void 0 === t ? this._objects.concat() : this._objects.filter((function (e) {
            return e.type === t
        }))
    }, item: function (t) {
        return this._objects[t]
    }, isEmpty: function () {
        return 0 === this._objects.length
    }, size: function () {
        return this._objects.length
    }, contains: function (t) {
        return -1 < this._objects.indexOf(t)
    }, complexity: function () {
        return this._objects.reduce((function (t, e) {
            return t + (e.complexity ? e.complexity() : 0)
        }), 0)
    }
}, fabric.CommonMethods = {
    _setOptions: function (t) {
        for (var e in t) this.set(e, t[e])
    }, _initGradient: function (t, e) {
        !t || !t.colorStops || t instanceof fabric.Gradient || this.set(e, new fabric.Gradient(t))
    }, _initPattern: function (t, e, i) {
        !t || !t.source || t instanceof fabric.Pattern ? i && i() : this.set(e, new fabric.Pattern(t, i))
    }, _initClipping: function (t) {
        if (t.clipTo && "string" == typeof t.clipTo) {
            var e = fabric.util.getFunctionBody(t.clipTo);
            void 0 !== e && (this.clipTo = new Function("ctx", e))
        }
    }, _setObject: function (t) {
        for (var e in t) this._set(e, t[e])
    }, set: function (t, e) {
        return "object" == typeof t ? this._setObject(t) : "function" == typeof e && "clipTo" !== t ? this._set(t, e(this.get(t))) : this._set(t, e), this
    }, _set: function (t, e) {
        this[t] = e
    }, toggle: function (t) {
        var e = this.get(t);
        return "boolean" == typeof e && this.set(t, !e), this
    }, get: function (t) {
        return this[t]
    }
}, function (t) {
    var e = Math.sqrt, i = Math.atan2, n = Math.pow, r = Math.PI / 180, o = Math.PI / 2;
    fabric.util = {
        cos: function (t) {
            if (0 === t) return 1;
            switch (t < 0 && (t = -t), t / o) {
                case 1:
                case 3:
                    return 0;
                case 2:
                    return -1
            }
            return Math.cos(t)
        }, sin: function (t) {
            if (0 === t) return 0;
            var e = 1;
            switch (t < 0 && (e = -1), t / o) {
                case 1:
                    return e;
                case 2:
                    return 0;
                case 3:
                    return -e
            }
            return Math.sin(t)
        }, removeFromArray: function (t, e) {
            var i = t.indexOf(e);
            return -1 !== i && t.splice(i, 1), t
        }, getRandomInt: function (t, e) {
            return Math.floor(Math.random() * (e - t + 1)) + t
        }, degreesToRadians: function (t) {
            return t * r
        }, radiansToDegrees: function (t) {
            return t / r
        }, rotatePoint: function (t, e, i) {
            t.subtractEquals(e);
            var n = fabric.util.rotateVector(t, i);
            return new fabric.Point(n.x, n.y).addEquals(e)
        }, rotateVector: function (t, e) {
            var i = fabric.util.sin(e), n = fabric.util.cos(e);
            return {x: t.x * n - t.y * i, y: t.x * i + t.y * n}
        }, transformPoint: function (t, e, i) {
            return i ? new fabric.Point(e[0] * t.x + e[2] * t.y, e[1] * t.x + e[3] * t.y) : new fabric.Point(e[0] * t.x + e[2] * t.y + e[4], e[1] * t.x + e[3] * t.y + e[5])
        }, makeBoundingBoxFromPoints: function (t, e) {
            if (e) for (var i = 0; i < t.length; i++) t[i] = fabric.util.transformPoint(t[i], e);
            var n = [t[0].x, t[1].x, t[2].x, t[3].x], r = fabric.util.array.min(n), o = fabric.util.array.max(n) - r,
                s = [t[0].y, t[1].y, t[2].y, t[3].y], a = fabric.util.array.min(s);
            return {left: r, top: a, width: o, height: fabric.util.array.max(s) - a}
        }, invertTransform: function (t) {
            var e = 1 / (t[0] * t[3] - t[1] * t[2]), i = [e * t[3], -e * t[1], -e * t[2], e * t[0]],
                n = fabric.util.transformPoint({x: t[4], y: t[5]}, i, !0);
            return i[4] = -n.x, i[5] = -n.y, i
        }, toFixed: function (t, e) {
            return parseFloat(Number(t).toFixed(e))
        }, parseUnit: function (t, e) {
            var i = /\D{0,2}$/.exec(t), n = parseFloat(t);
            switch (e || (e = fabric.Text.DEFAULT_SVG_FONT_SIZE), i[0]) {
                case"mm":
                    return n * fabric.DPI / 25.4;
                case"cm":
                    return n * fabric.DPI / 2.54;
                case"in":
                    return n * fabric.DPI;
                case"pt":
                    return n * fabric.DPI / 72;
                case"pc":
                    return n * fabric.DPI / 72 * 12;
                case"em":
                    return n * e;
                default:
                    return n
            }
        }, falseFunction: function () {
            return !1
        }, getKlass: function (t, e) {
            return t = fabric.util.string.camelize(t.charAt(0).toUpperCase() + t.slice(1)), fabric.util.resolveNamespace(e)[t]
        }, getSvgAttributes: function (t) {
            var e = ["instantiated_by_use", "style", "id", "class"];
            switch (t) {
                case"linearGradient":
                    e = e.concat(["x1", "y1", "x2", "y2", "gradientUnits", "gradientTransform"]);
                    break;
                case"radialGradient":
                    e = e.concat(["gradientUnits", "gradientTransform", "cx", "cy", "r", "fx", "fy", "fr"]);
                    break;
                case"stop":
                    e = e.concat(["offset", "stop-color", "stop-opacity"])
            }
            return e
        }, resolveNamespace: function (e) {
            if (!e) return fabric;
            var i, n = e.split("."), r = n.length, o = t || fabric.window;
            for (i = 0; i < r; ++i) o = o[n[i]];
            return o
        }, loadImage: function (t, e, i, n) {
            if (t) {
                var r = fabric.util.createImage(), o = function () {
                    e && e.call(i, r), r = r.onload = r.onerror = null
                };
                r.onload = o, r.onerror = function () {
                    fabric.log("Error loading " + r.src), e && e.call(i, null, !0), r = r.onload = r.onerror = null
                }, 0 !== t.indexOf("data") && n && (r.crossOrigin = n), "data:image/svg" === t.substring(0, 14) && (r.onload = null, fabric.util.loadImageInDom(r, o)), r.src = t
            } else e && e.call(i, t)
        }, loadImageInDom: function (t, e) {
            var i = fabric.document.createElement("div");
            i.style.width = i.style.height = "1px", i.style.left = i.style.top = "-100%", i.style.position = "absolute", i.appendChild(t), fabric.document.querySelector("body").appendChild(i), t.onload = function () {
                e(), i.parentNode.removeChild(i), i = null
            }
        }, enlivenObjects: function (t, e, i, n) {
            var r = [], o = 0, s = (t = t || []).length;

            function a() {
                ++o === s && e && e(r.filter((function (t) {
                    return t
                })))
            }

            s ? t.forEach((function (t, e) {
                t && t.type ? fabric.util.getKlass(t.type, i).fromObject(t, (function (i, o) {
                    o || (r[e] = i), n && n(t, i, o), a()
                })) : a()
            })) : e && e(r)
        }, enlivenPatterns: function (t, e) {
            function i() {
                ++r === o && e && e(n)
            }

            var n = [], r = 0, o = (t = t || []).length;
            o ? t.forEach((function (t, e) {
                t && t.source ? new fabric.Pattern(t, (function (t) {
                    n[e] = t, i()
                })) : (n[e] = t, i())
            })) : e && e(n)
        }, groupSVGElements: function (t, e, i) {
            var n;
            return t && 1 === t.length ? t[0] : (e && (e.width && e.height ? e.centerPoint = {
                x: e.width / 2,
                y: e.height / 2
            } : (delete e.width, delete e.height)), n = new fabric.Group(t, e), void 0 !== i && (n.sourcePath = i), n)
        }, populateWithProperties: function (t, e, i) {
            if (i && "[object Array]" === Object.prototype.toString.call(i)) for (var n = 0, r = i.length; n < r; n++) i[n] in t && (e[i[n]] = t[i[n]])
        }, drawDashedLine: function (t, n, r, o, s, a) {
            var c = o - n, l = s - r, h = e(c * c + l * l), u = i(l, c), f = a.length, d = 0, p = !0;
            for (t.save(), t.translate(n, r), t.moveTo(0, 0), t.rotate(u), n = 0; n < h;) h < (n += a[d++ % f]) && (n = h), t[p ? "lineTo" : "moveTo"](n, 0), p = !p;
            t.restore()
        }, createCanvasElement: function () {
            return fabric.document.createElement("canvas")
        }, copyCanvasElement: function (t) {
            var e = fabric.util.createCanvasElement();
            return e.width = t.width, e.height = t.height, e.getContext("2d").drawImage(t, 0, 0), e
        }, toDataURL: function (t, e, i) {
            return t.toDataURL("image/" + e, i)
        }, createImage: function () {
            return fabric.document.createElement("img")
        }, clipContext: function (t, e) {
            e.save(), e.beginPath(), t.clipTo(e), e.clip()
        }, multiplyTransformMatrices: function (t, e, i) {
            return [t[0] * e[0] + t[2] * e[1], t[1] * e[0] + t[3] * e[1], t[0] * e[2] + t[2] * e[3], t[1] * e[2] + t[3] * e[3], i ? 0 : t[0] * e[4] + t[2] * e[5] + t[4], i ? 0 : t[1] * e[4] + t[3] * e[5] + t[5]]
        }, qrDecompose: function (t) {
            var o = i(t[1], t[0]), s = n(t[0], 2) + n(t[1], 2), a = e(s), c = (t[0] * t[3] - t[2] * t[1]) / a,
                l = i(t[0] * t[2] + t[1] * t[3], s);
            return {angle: o / r, scaleX: a, scaleY: c, skewX: l / r, skewY: 0, translateX: t[4], translateY: t[5]}
        }, calcRotateMatrix: function (t) {
            if (!t.angle) return fabric.iMatrix.concat();
            var e = fabric.util.degreesToRadians(t.angle), i = fabric.util.cos(e), n = fabric.util.sin(e);
            return [i, n, -n, i, 0, 0]
        }, calcDimensionsMatrix: function (t) {
            var e = void 0 === t.scaleX ? 1 : t.scaleX, i = void 0 === t.scaleY ? 1 : t.scaleY,
                n = [t.flipX ? -e : e, 0, 0, t.flipY ? -i : i, 0, 0], r = fabric.util.multiplyTransformMatrices,
                o = fabric.util.degreesToRadians;
            return t.skewX && (n = r(n, [1, 0, Math.tan(o(t.skewX)), 1], !0)), t.skewY && (n = r(n, [1, Math.tan(o(t.skewY)), 0, 1], !0)), n
        }, composeMatrix: function (t) {
            var e = [1, 0, 0, 1, t.translateX || 0, t.translateY || 0], i = fabric.util.multiplyTransformMatrices;
            return t.angle && (e = i(e, fabric.util.calcRotateMatrix(t))), (t.scaleX || t.scaleY || t.skewX || t.skewY || t.flipX || t.flipY) && (e = i(e, fabric.util.calcDimensionsMatrix(t))), e
        }, customTransformMatrix: function (t, e, i) {
            return fabric.util.composeMatrix({scaleX: t, scaleY: e, skewX: i})
        }, resetObjectTransform: function (t) {
            t.scaleX = 1, t.scaleY = 1, t.skewX = 0, t.skewY = 0, t.flipX = !1, t.flipY = !1, t.rotate(0)
        }, saveObjectTransform: function (t) {
            return {
                scaleX: t.scaleX,
                scaleY: t.scaleY,
                skewX: t.skewX,
                skewY: t.skewY,
                angle: t.angle,
                left: t.left,
                flipX: t.flipX,
                flipY: t.flipY,
                top: t.top
            }
        }, getFunctionBody: function (t) {
            return (String(t).match(/function[^{]*\{([\s\S]*)\}/) || {})[1]
        }, isTransparent: function (t, e, i, n) {
            0 < n && (n < e ? e -= n : e = 0, n < i ? i -= n : i = 0);
            var r, o = !0, s = t.getImageData(e, i, 2 * n || 1, 2 * n || 1), a = s.data.length;
            for (r = 3; r < a && !1 != (o = s.data[r] <= 0); r += 4) ;
            return s = null, o
        }, parsePreserveAspectRatioAttribute: function (t) {
            var e, i = "meet", n = t.split(" ");
            return n && n.length && ("meet" !== (i = n.pop()) && "slice" !== i ? (e = i, i = "meet") : n.length && (e = n.pop())), {
                meetOrSlice: i,
                alignX: "none" !== e ? e.slice(1, 4) : "none",
                alignY: "none" !== e ? e.slice(5, 8) : "none"
            }
        }, clearFabricFontCache: function (t) {
            (t = (t || "").toLowerCase()) ? fabric.charWidthsCache[t] && delete fabric.charWidthsCache[t] : fabric.charWidthsCache = {}
        }, limitDimsByArea: function (t, e) {
            var i = Math.sqrt(e * t), n = Math.floor(e / i);
            return {x: Math.floor(i), y: n}
        }, capValue: function (t, e, i) {
            return Math.max(t, Math.min(e, i))
        }, findScaleToFit: function (t, e) {
            return Math.min(e.width / t.width, e.height / t.height)
        }, findScaleToCover: function (t, e) {
            return Math.max(e.width / t.width, e.height / t.height)
        }, matrixToSVG: function (t) {
            return "matrix(" + t.map((function (t) {
                return fabric.util.toFixed(t, fabric.Object.NUM_FRACTION_DIGITS)
            })).join(" ") + ")"
        }
    }
}("undefined" != typeof exports ? exports : this), function () {
    var t = Array.prototype.join;

    function e(e, n, r, o, s, a, c) {
        var l = t.call(arguments);
        if (fabric.arcToSegmentsCache[l]) return fabric.arcToSegmentsCache[l];
        var h = Math.PI, u = c * h / 180, f = fabric.util.sin(u), d = fabric.util.cos(u), p = 0, g = 0,
            v = -d * e * .5 - f * n * .5, m = -d * n * .5 + f * e * .5, _ = (r = Math.abs(r)) * r,
            b = (o = Math.abs(o)) * o, y = m * m, x = v * v, w = _ * b - _ * y - b * x, C = 0;
        if (w < 0) {
            var S = Math.sqrt(1 - w / (_ * b));
            r *= S, o *= S
        } else C = (s === a ? -1 : 1) * Math.sqrt(w / (_ * y + b * x));
        var T = C * r * m / o, O = -C * o * v / r, E = d * T - f * O + .5 * e, k = f * T + d * O + .5 * n,
            P = i(1, 0, (v - T) / r, (m - O) / o), j = i((v - T) / r, (m - O) / o, (-v - T) / r, (-m - O) / o);
        0 === a && 0 < j ? j -= 2 * h : 1 === a && j < 0 && (j += 2 * h);
        for (var A, M, D, I, L, F, R, B, z, X, W, Y, H, U, N, G, V, $ = Math.ceil(Math.abs(j / h * 2)), q = [], K = j / $, J = 8 / 3 * Math.sin(K / 4) * Math.sin(K / 4) / Math.sin(K / 2), Q = P + K, Z = 0; Z < $; Z++) q[Z] = (A = P, M = Q, D = d, I = f, L = r, F = o, R = E, B = k, z = J, X = p, W = g, Y = fabric.util.cos(A), [X + z * (-D * L * (H = fabric.util.sin(A)) - I * F * Y), W + z * (-I * L * H + D * F * Y), (G = D * L * (U = fabric.util.cos(M)) - I * F * (N = fabric.util.sin(M)) + R) + z * (D * L * N + I * F * U), (V = I * L * U + D * F * N + B) + z * (I * L * N - D * F * U), G, V]), p = q[Z][4], g = q[Z][5], P = Q, Q += K;
        return fabric.arcToSegmentsCache[l] = q
    }

    function i(t, e, i, n) {
        var r = Math.atan2(e, t), o = Math.atan2(n, i);
        return r <= o ? o - r : 2 * Math.PI - (r - o)
    }

    function n(e, i, n, r, o, s, a, c) {
        var l;
        if (fabric.cachesBoundsOfCurve && (l = t.call(arguments), fabric.boundsOfCurveCache[l])) return fabric.boundsOfCurveCache[l];
        var h, u, f, d, p, g, v, m, _ = Math.sqrt, b = Math.min, y = Math.max, x = Math.abs, w = [], C = [[], []];
        u = 6 * e - 12 * n + 6 * o, h = -3 * e + 9 * n - 9 * o + 3 * a, f = 3 * n - 3 * e;
        for (var S = 0; S < 2; ++S) if (0 < S && (u = 6 * i - 12 * r + 6 * s, h = -3 * i + 9 * r - 9 * s + 3 * c, f = 3 * r - 3 * i), x(h) < 1e-12) {
            if (x(u) < 1e-12) continue;
            0 < (d = -f / u) && d < 1 && w.push(d)
        } else (v = u * u - 4 * f * h) < 0 || (0 < (p = (-u + (m = _(v))) / (2 * h)) && p < 1 && w.push(p), 0 < (g = (-u - m) / (2 * h)) && g < 1 && w.push(g));
        for (var T, O, E, k = w.length, P = k; k--;) T = (E = 1 - (d = w[k])) * E * E * e + 3 * E * E * d * n + 3 * E * d * d * o + d * d * d * a, C[0][k] = T, O = E * E * E * i + 3 * E * E * d * r + 3 * E * d * d * s + d * d * d * c, C[1][k] = O;
        C[0][P] = e, C[1][P] = i, C[0][P + 1] = a, C[1][P + 1] = c;
        var j = [{x: b.apply(null, C[0]), y: b.apply(null, C[1])}, {x: y.apply(null, C[0]), y: y.apply(null, C[1])}];
        return fabric.cachesBoundsOfCurve && (fabric.boundsOfCurveCache[l] = j), j
    }

    fabric.util.drawArc = function (t, i, n, r) {
        for (var o = r[0], s = r[1], a = r[2], c = r[3], l = r[4], h = [[], [], [], []], u = e(r[5] - i, r[6] - n, o, s, c, l, a), f = 0, d = u.length; f < d; f++) h[f][0] = u[f][0] + i, h[f][1] = u[f][1] + n, h[f][2] = u[f][2] + i, h[f][3] = u[f][3] + n, h[f][4] = u[f][4] + i, h[f][5] = u[f][5] + n, t.bezierCurveTo.apply(t, h[f])
    }, fabric.util.getBoundsOfArc = function (t, i, r, o, s, a, c, l, h) {
        for (var u, f = 0, d = 0, p = [], g = e(l - t, h - i, r, o, a, c, s), v = 0, m = g.length; v < m; v++) u = n(f, d, g[v][0], g[v][1], g[v][2], g[v][3], g[v][4], g[v][5]), p.push({
            x: u[0].x + t,
            y: u[0].y + i
        }), p.push({x: u[1].x + t, y: u[1].y + i}), f = g[v][4], d = g[v][5];
        return p
    }, fabric.util.getBoundsOfCurve = n
}(), function () {
    var t = Array.prototype.slice;

    function e(t, e, i) {
        if (t && 0 !== t.length) {
            var n = t.length - 1, r = e ? t[n][e] : t[n];
            if (e) for (; n--;) i(t[n][e], r) && (r = t[n][e]); else for (; n--;) i(t[n], r) && (r = t[n]);
            return r
        }
    }

    fabric.util.array = {
        fill: function (t, e) {
            for (var i = t.length; i--;) t[i] = e;
            return t
        }, invoke: function (e, i) {
            for (var n = t.call(arguments, 2), r = [], o = 0, s = e.length; o < s; o++) r[o] = n.length ? e[o][i].apply(e[o], n) : e[o][i].call(e[o]);
            return r
        }, min: function (t, i) {
            return e(t, i, (function (t, e) {
                return t < e
            }))
        }, max: function (t, i) {
            return e(t, i, (function (t, e) {
                return e <= t
            }))
        }
    }
}(), function () {
    function t(e, i, n) {
        if (n) if (!fabric.isLikelyNode && i instanceof Element) e = i; else if (i instanceof Array) {
            e = [];
            for (var r = 0, o = i.length; r < o; r++) e[r] = t({}, i[r], n)
        } else if (i && "object" == typeof i) for (var s in i) "canvas" === s ? e[s] = t({}, i[s]) : i.hasOwnProperty(s) && (e[s] = t({}, i[s], n)); else e = i; else for (var s in i) e[s] = i[s];
        return e
    }

    fabric.util.object = {
        extend: t, clone: function (e, i) {
            return t({}, e, i)
        }
    }, fabric.util.object.extend(fabric.util, fabric.Observable)
}(), function () {
    function t(t, e) {
        var i = t.charCodeAt(e);
        if (isNaN(i)) return "";
        if (i < 55296 || 57343 < i) return t.charAt(e);
        if (55296 <= i && i <= 56319) {
            if (t.length <= e + 1) throw "High surrogate without following low surrogate";
            var n = t.charCodeAt(e + 1);
            if (n < 56320 || 57343 < n) throw "High surrogate without following low surrogate";
            return t.charAt(e) + t.charAt(e + 1)
        }
        if (0 === e) throw "Low surrogate without preceding high surrogate";
        var r = t.charCodeAt(e - 1);
        if (r < 55296 || 56319 < r) throw "Low surrogate without preceding high surrogate";
        return !1
    }

    fabric.util.string = {
        camelize: function (t) {
            return t.replace(/-+(.)?/g, (function (t, e) {
                return e ? e.toUpperCase() : ""
            }))
        }, capitalize: function (t, e) {
            return t.charAt(0).toUpperCase() + (e ? t.slice(1) : t.slice(1).toLowerCase())
        }, escapeXml: function (t) {
            return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }, graphemeSplit: function (e) {
            var i, n = 0, r = [];
            for (n = 0; n < e.length; n++) !1 !== (i = t(e, n)) && r.push(i);
            return r
        }
    }
}(), function () {
    var t = Array.prototype.slice, e = function () {
    }, i = function () {
        for (var t in {toString: 1}) if ("toString" === t) return !1;
        return !0
    }(), n = function (t, e, n) {
        for (var r in e) r in t.prototype && "function" == typeof t.prototype[r] && -1 < (e[r] + "").indexOf("callSuper") ? t.prototype[r] = function (t) {
            return function () {
                var i = this.constructor.superclass;
                this.constructor.superclass = n;
                var r = e[t].apply(this, arguments);
                if (this.constructor.superclass = i, "initialize" !== t) return r
            }
        }(r) : t.prototype[r] = e[r], i && (e.toString !== Object.prototype.toString && (t.prototype.toString = e.toString), e.valueOf !== Object.prototype.valueOf && (t.prototype.valueOf = e.valueOf))
    };

    function r() {
    }

    function o(e) {
        for (var i = null, n = this; n.constructor.superclass;) {
            var r = n.constructor.superclass.prototype[e];
            if (n[e] !== r) {
                i = r;
                break
            }
            n = n.constructor.superclass.prototype
        }
        return i ? 1 < arguments.length ? i.apply(this, t.call(arguments, 1)) : i.call(this) : console.log("tried to callSuper " + e + ", method not found in prototype chain", this)
    }

    fabric.util.createClass = function () {
        var i = null, s = t.call(arguments, 0);

        function a() {
            this.initialize.apply(this, arguments)
        }

        "function" == typeof s[0] && (i = s.shift()), a.superclass = i, a.subclasses = [], i && (r.prototype = i.prototype, a.prototype = new r, i.subclasses.push(a));
        for (var c = 0, l = s.length; c < l; c++) n(a, s[c], i);
        return a.prototype.initialize || (a.prototype.initialize = e), (a.prototype.constructor = a).prototype.callSuper = o, a
    }
}(), function () {
    var t = !!fabric.document.createElement("div").attachEvent;
    fabric.util.addListener = function (e, i, n, r) {
        e && e.addEventListener(i, n, !t && r)
    }, fabric.util.removeListener = function (e, i, n, r) {
        e && e.removeEventListener(i, n, !t && r)
    }, fabric.util.getPointer = function (t) {
        var e, i, n = t.target, r = fabric.util.getScrollLeftTop(n),
            o = (i = (e = t).changedTouches) && i[0] ? i[0] : e;
        return {x: o.clientX + r.left, y: o.clientY + r.top}
    }
}(), function () {
    var t = fabric.document.createElement("div"), e = "string" == typeof t.style.opacity,
        i = "string" == typeof t.style.filter, n = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/, r = function (t) {
            return t
        };
    e ? r = function (t, e) {
        return t.style.opacity = e, t
    } : i && (r = function (t, e) {
        var i = t.style;
        return t.currentStyle && !t.currentStyle.hasLayout && (i.zoom = 1), n.test(i.filter) ? (e = .9999 <= e ? "" : "alpha(opacity=" + 100 * e + ")", i.filter = i.filter.replace(n, e)) : i.filter += " alpha(opacity=" + 100 * e + ")", t
    }), fabric.util.setStyle = function (t, e) {
        var i = t.style;
        if (!i) return t;
        if ("string" == typeof e) return t.style.cssText += ";" + e, -1 < e.indexOf("opacity") ? r(t, e.match(/opacity:\s*(\d?\.?\d*)/)[1]) : t;
        for (var n in e) "opacity" === n ? r(t, e[n]) : i["float" === n || "cssFloat" === n ? void 0 === i.styleFloat ? "cssFloat" : "styleFloat" : n] = e[n];
        return t
    }
}(), function () {
    var t, e, i, n, r = Array.prototype.slice, o = function (t) {
        return r.call(t, 0)
    };
    try {
        t = o(fabric.document.childNodes) instanceof Array
    } catch (t) {
    }

    function s(t, e) {
        var i = fabric.document.createElement(t);
        for (var n in e) "class" === n ? i.className = e[n] : "for" === n ? i.htmlFor = e[n] : i.setAttribute(n, e[n]);
        return i
    }

    function a(t) {
        for (var e = 0, i = 0, n = fabric.document.documentElement, r = fabric.document.body || {
            scrollLeft: 0,
            scrollTop: 0
        }; t && (t.parentNode || t.host) && ((t = t.parentNode || t.host) === fabric.document ? (e = r.scrollLeft || n.scrollLeft || 0, i = r.scrollTop || n.scrollTop || 0) : (e += t.scrollLeft || 0, i += t.scrollTop || 0), 1 !== t.nodeType || "fixed" !== t.style.position);) ;
        return {left: e, top: i}
    }

    t || (o = function (t) {
        for (var e = new Array(t.length), i = t.length; i--;) e[i] = t[i];
        return e
    }), e = fabric.document.defaultView && fabric.document.defaultView.getComputedStyle ? function (t, e) {
        var i = fabric.document.defaultView.getComputedStyle(t, null);
        return i ? i[e] : void 0
    } : function (t, e) {
        var i = t.style[e];
        return !i && t.currentStyle && (i = t.currentStyle[e]), i
    }, i = fabric.document.documentElement.style, n = "userSelect" in i ? "userSelect" : "MozUserSelect" in i ? "MozUserSelect" : "WebkitUserSelect" in i ? "WebkitUserSelect" : "KhtmlUserSelect" in i ? "KhtmlUserSelect" : "", fabric.util.makeElementUnselectable = function (t) {
        return void 0 !== t.onselectstart && (t.onselectstart = fabric.util.falseFunction), n ? t.style[n] = "none" : "string" == typeof t.unselectable && (t.unselectable = "on"), t
    }, fabric.util.makeElementSelectable = function (t) {
        return void 0 !== t.onselectstart && (t.onselectstart = null), n ? t.style[n] = "" : "string" == typeof t.unselectable && (t.unselectable = ""), t
    }, fabric.util.getScript = function (t, e) {
        var i = fabric.document.getElementsByTagName("head")[0], n = fabric.document.createElement("script"), r = !0;
        n.onload = n.onreadystatechange = function (t) {
            if (r) {
                if ("string" == typeof this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState) return;
                r = !1, e(t || fabric.window.event), n = n.onload = n.onreadystatechange = null
            }
        }, n.src = t, i.appendChild(n)
    }, fabric.util.getById = function (t) {
        return "string" == typeof t ? fabric.document.getElementById(t) : t
    }, fabric.util.toArray = o, fabric.util.makeElement = s, fabric.util.addClass = function (t, e) {
        t && -1 === (" " + t.className + " ").indexOf(" " + e + " ") && (t.className += (t.className ? " " : "") + e)
    }, fabric.util.wrapElement = function (t, e, i) {
        return "string" == typeof e && (e = s(e, i)), t.parentNode && t.parentNode.replaceChild(e, t), e.appendChild(t), e
    }, fabric.util.getScrollLeftTop = a, fabric.util.getElementOffset = function (t) {
        var i, n, r = t && t.ownerDocument, o = {left: 0, top: 0}, s = {left: 0, top: 0},
            c = {borderLeftWidth: "left", borderTopWidth: "top", paddingLeft: "left", paddingTop: "top"};
        if (!r) return s;
        for (var l in c) s[c[l]] += parseInt(e(t, l), 10) || 0;
        return i = r.documentElement, void 0 !== t.getBoundingClientRect && (o = t.getBoundingClientRect()), n = a(t), {
            left: o.left + n.left - (i.clientLeft || 0) + s.left,
            top: o.top + n.top - (i.clientTop || 0) + s.top
        }
    }, fabric.util.getElementStyle = e, fabric.util.getNodeCanvas = function (t) {
        var e = fabric.jsdomImplForWrapper(t);
        return e._canvas || e._image
    }, fabric.util.cleanUpJsdomNode = function (t) {
        if (fabric.isLikelyNode) {
            var e = fabric.jsdomImplForWrapper(t);
            e && (e._image = null, e._canvas = null, e._currentSrc = null, e._attributes = null, e._classList = null)
        }
    }
}(), function () {
    function t() {
    }

    fabric.util.request = function (e, i) {
        i || (i = {});
        var n, r, o = i.method ? i.method.toUpperCase() : "GET", s = i.onComplete || function () {
        }, a = new fabric.window.XMLHttpRequest, c = i.body || i.parameters;
        return a.onreadystatechange = function () {
            4 === a.readyState && (s(a), a.onreadystatechange = t)
        }, "GET" === o && (c = null, "string" == typeof i.parameters && (n = e, r = i.parameters, e = n + (/\?/.test(n) ? "&" : "?") + r)), a.open(o, e, !0), "POST" !== o && "PUT" !== o || a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), a.send(c), a
    }
}(), fabric.log = function () {
}, fabric.warn = function () {
}, "undefined" != typeof console && ["log", "warn"].forEach((function (t) {
    void 0 !== console[t] && "function" == typeof console[t].apply && (fabric[t] = function () {
        return console[t].apply(console, arguments)
    })
})), function () {
    function t() {
        return !1
    }

    function e(t, e, i, n) {
        return -i * Math.cos(t / n * (Math.PI / 2)) + i + e
    }

    var i = fabric.window.requestAnimationFrame || fabric.window.webkitRequestAnimationFrame || fabric.window.mozRequestAnimationFrame || fabric.window.oRequestAnimationFrame || fabric.window.msRequestAnimationFrame || function (t) {
        return fabric.window.setTimeout(t, 1e3 / 60)
    }, n = fabric.window.cancelAnimationFrame || fabric.window.clearTimeout;

    function r() {
        return i.apply(fabric.window, arguments)
    }

    fabric.util.animate = function (i) {
        r((function (n) {
            i || (i = {});
            var o, s = n || +new Date, a = i.duration || 500, c = s + a, l = i.onChange || t, h = i.abort || t,
                u = i.onComplete || t, f = i.easing || e, d = "startValue" in i ? i.startValue : 0,
                p = "endValue" in i ? i.endValue : 100, g = i.byValue || p - d;
            i.onStart && i.onStart(), function t(e) {
                o = e || +new Date;
                var i = c < o ? a : o - s, n = i / a, v = f(i, d, g, a), m = Math.abs((v - d) / g);
                if (!h()) return c < o ? (l(p, 1, 1), void u(p, 1, 1)) : (l(v, m, n), void r(t));
                u(p, 1, 1)
            }(s)
        }))
    }, fabric.util.requestAnimFrame = r, fabric.util.cancelAnimFrame = function () {
        return n.apply(fabric.window, arguments)
    }
}(), fabric.util.animateColor = function (t, e, i, n) {
    var r = new fabric.Color(t).getSource(), o = new fabric.Color(e).getSource();
    n = n || {}, fabric.util.animate(fabric.util.object.extend(n, {
        duration: i || 500,
        startValue: r,
        endValue: o,
        byValue: o,
        easing: function (t, e, i, r) {
            var o, s, a, c;
            return o = e, s = i, a = n.colorEasing ? n.colorEasing(t, r) : 1 - Math.cos(t / r * (Math.PI / 2)), c = "rgba(" + parseInt(o[0] + a * (s[0] - o[0]), 10) + "," + parseInt(o[1] + a * (s[1] - o[1]), 10) + "," + parseInt(o[2] + a * (s[2] - o[2]), 10), (c += "," + (o && s ? parseFloat(o[3] + a * (s[3] - o[3])) : 1)) + ")"
        }
    }))
}, function () {
    function t(t, e, i, n) {
        return t < Math.abs(e) ? (t = e, n = i / 4) : n = 0 === e && 0 === t ? i / (2 * Math.PI) * Math.asin(1) : i / (2 * Math.PI) * Math.asin(e / t), {
            a: t,
            c: e,
            p: i,
            s: n
        }
    }

    function e(t, e, i) {
        return t.a * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * i - t.s) * (2 * Math.PI) / t.p)
    }

    function i(t, e, i, r) {
        return i - n(r - t, 0, i, r) + e
    }

    function n(t, e, i, n) {
        return (t /= n) < 1 / 2.75 ? i * (7.5625 * t * t) + e : t < 2 / 2.75 ? i * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + e : t < 2.5 / 2.75 ? i * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + e : i * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + e
    }

    fabric.util.ease = {
        easeInQuad: function (t, e, i, n) {
            return i * (t /= n) * t + e
        }, easeOutQuad: function (t, e, i, n) {
            return -i * (t /= n) * (t - 2) + e
        }, easeInOutQuad: function (t, e, i, n) {
            return (t /= n / 2) < 1 ? i / 2 * t * t + e : -i / 2 * (--t * (t - 2) - 1) + e
        }, easeInCubic: function (t, e, i, n) {
            return i * (t /= n) * t * t + e
        }, easeOutCubic: function (t, e, i, n) {
            return i * ((t = t / n - 1) * t * t + 1) + e
        }, easeInOutCubic: function (t, e, i, n) {
            return (t /= n / 2) < 1 ? i / 2 * t * t * t + e : i / 2 * ((t -= 2) * t * t + 2) + e
        }, easeInQuart: function (t, e, i, n) {
            return i * (t /= n) * t * t * t + e
        }, easeOutQuart: function (t, e, i, n) {
            return -i * ((t = t / n - 1) * t * t * t - 1) + e
        }, easeInOutQuart: function (t, e, i, n) {
            return (t /= n / 2) < 1 ? i / 2 * t * t * t * t + e : -i / 2 * ((t -= 2) * t * t * t - 2) + e
        }, easeInQuint: function (t, e, i, n) {
            return i * (t /= n) * t * t * t * t + e
        }, easeOutQuint: function (t, e, i, n) {
            return i * ((t = t / n - 1) * t * t * t * t + 1) + e
        }, easeInOutQuint: function (t, e, i, n) {
            return (t /= n / 2) < 1 ? i / 2 * t * t * t * t * t + e : i / 2 * ((t -= 2) * t * t * t * t + 2) + e
        }, easeInSine: function (t, e, i, n) {
            return -i * Math.cos(t / n * (Math.PI / 2)) + i + e
        }, easeOutSine: function (t, e, i, n) {
            return i * Math.sin(t / n * (Math.PI / 2)) + e
        }, easeInOutSine: function (t, e, i, n) {
            return -i / 2 * (Math.cos(Math.PI * t / n) - 1) + e
        }, easeInExpo: function (t, e, i, n) {
            return 0 === t ? e : i * Math.pow(2, 10 * (t / n - 1)) + e
        }, easeOutExpo: function (t, e, i, n) {
            return t === n ? e + i : i * (1 - Math.pow(2, -10 * t / n)) + e
        }, easeInOutExpo: function (t, e, i, n) {
            return 0 === t ? e : t === n ? e + i : (t /= n / 2) < 1 ? i / 2 * Math.pow(2, 10 * (t - 1)) + e : i / 2 * (2 - Math.pow(2, -10 * --t)) + e
        }, easeInCirc: function (t, e, i, n) {
            return -i * (Math.sqrt(1 - (t /= n) * t) - 1) + e
        }, easeOutCirc: function (t, e, i, n) {
            return i * Math.sqrt(1 - (t = t / n - 1) * t) + e
        }, easeInOutCirc: function (t, e, i, n) {
            return (t /= n / 2) < 1 ? -i / 2 * (Math.sqrt(1 - t * t) - 1) + e : i / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + e
        }, easeInElastic: function (i, n, r, o) {
            var s = 0;
            return 0 === i ? n : 1 == (i /= o) ? n + r : (s || (s = .3 * o), -e(t(r, r, s, 1.70158), i, o) + n)
        }, easeOutElastic: function (e, i, n, r) {
            var o = 0;
            if (0 === e) return i;
            if (1 == (e /= r)) return i + n;
            o || (o = .3 * r);
            var s = t(n, n, o, 1.70158);
            return s.a * Math.pow(2, -10 * e) * Math.sin((e * r - s.s) * (2 * Math.PI) / s.p) + s.c + i
        }, easeInOutElastic: function (i, n, r, o) {
            var s = 0;
            if (0 === i) return n;
            if (2 == (i /= o / 2)) return n + r;
            s || (s = o * (.3 * 1.5));
            var a = t(r, r, s, 1.70158);
            return i < 1 ? -.5 * e(a, i, o) + n : a.a * Math.pow(2, -10 * (i -= 1)) * Math.sin((i * o - a.s) * (2 * Math.PI) / a.p) * .5 + a.c + n
        }, easeInBack: function (t, e, i, n, r) {
            return void 0 === r && (r = 1.70158), i * (t /= n) * t * ((r + 1) * t - r) + e
        }, easeOutBack: function (t, e, i, n, r) {
            return void 0 === r && (r = 1.70158), i * ((t = t / n - 1) * t * ((r + 1) * t + r) + 1) + e
        }, easeInOutBack: function (t, e, i, n, r) {
            return void 0 === r && (r = 1.70158), (t /= n / 2) < 1 ? i / 2 * (t * t * ((1 + (r *= 1.525)) * t - r)) + e : i / 2 * ((t -= 2) * t * ((1 + (r *= 1.525)) * t + r) + 2) + e
        }, easeInBounce: i, easeOutBounce: n, easeInOutBounce: function (t, e, r, o) {
            return t < o / 2 ? .5 * i(2 * t, 0, r, o) + e : .5 * n(2 * t - o, 0, r, o) + .5 * r + e
        }
    }
}(), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.object.extend, n = e.util.object.clone, r = e.util.toFixed,
        o = e.util.parseUnit, s = e.util.multiplyTransformMatrices, a = {
            cx: "left",
            x: "left",
            r: "radius",
            cy: "top",
            y: "top",
            display: "visible",
            visibility: "visible",
            transform: "transformMatrix",
            "fill-opacity": "fillOpacity",
            "fill-rule": "fillRule",
            "font-family": "fontFamily",
            "font-size": "fontSize",
            "font-style": "fontStyle",
            "font-weight": "fontWeight",
            "letter-spacing": "charSpacing",
            "paint-order": "paintFirst",
            "stroke-dasharray": "strokeDashArray",
            "stroke-dashoffset": "strokeDashOffset",
            "stroke-linecap": "strokeLineCap",
            "stroke-linejoin": "strokeLineJoin",
            "stroke-miterlimit": "strokeMiterLimit",
            "stroke-opacity": "strokeOpacity",
            "stroke-width": "strokeWidth",
            "text-decoration": "textDecoration",
            "text-anchor": "textAnchor",
            opacity: "opacity",
            "clip-path": "clipPath",
            "clip-rule": "clipRule",
            "vector-effect": "strokeUniform"
        }, c = {stroke: "strokeOpacity", fill: "fillOpacity"};

    function l(t, i, n, r) {
        var a, c = "[object Array]" === Object.prototype.toString.call(i);
        if ("fill" !== t && "stroke" !== t || "none" !== i) if ("vector-effect" === t) i = "non-scaling-stroke" === i; else if ("strokeDashArray" === t) i = "none" === i ? null : i.replace(/,/g, " ").split(/\s+/).map(parseFloat); else if ("transformMatrix" === t) i = n && n.transformMatrix ? s(n.transformMatrix, e.parseTransformAttribute(i)) : e.parseTransformAttribute(i); else if ("visible" === t) i = "none" !== i && "hidden" !== i, n && !1 === n.visible && (i = !1); else if ("opacity" === t) i = parseFloat(i), n && void 0 !== n.opacity && (i *= n.opacity); else if ("textAnchor" === t) i = "start" === i ? "left" : "end" === i ? "right" : "center"; else if ("charSpacing" === t) a = o(i, r) / r * 1e3; else if ("paintFirst" === t) {
            var l = i.indexOf("fill"), h = i.indexOf("stroke");
            i = "fill", (-1 < l && -1 < h && h < l || -1 === l && -1 < h) && (i = "stroke")
        } else {
            if ("href" === t || "xlink:href" === t) return i;
            a = c ? i.map(o) : o(i, r)
        } else i = "";
        return !c && isNaN(a) ? i : a
    }

    function h(t) {
        return new RegExp("^(" + t.join("|") + ")\\b", "i")
    }

    function u(t, e) {
        var i, n, r, o, s = [];
        for (r = 0, o = e.length; r < o; r++) i = e[r], n = t.getElementsByTagName(i), s = s.concat(Array.prototype.slice.call(n));
        return s
    }

    function f(t, e) {
        var i, n = !0;
        return (i = d(t, e.pop())) && e.length && (n = function (t, e) {
            for (var i, n = !0; t.parentNode && 1 === t.parentNode.nodeType && e.length;) n && (i = e.pop()), n = d(t = t.parentNode, i);
            return 0 === e.length
        }(t, e)), i && n && 0 === e.length
    }

    function d(t, e) {
        var i, n, r = t.nodeName, o = t.getAttribute("class"), s = t.getAttribute("id");
        if (i = new RegExp("^" + r, "i"), e = e.replace(i, ""), s && e.length && (i = new RegExp("#" + s + "(?![a-zA-Z\\-]+)", "i"), e = e.replace(i, "")), o && e.length) for (n = (o = o.split(" ")).length; n--;) i = new RegExp("\\." + o[n] + "(?![a-zA-Z\\-]+)", "i"), e = e.replace(i, "");
        return 0 === e.length
    }

    function p(t, e) {
        var i;
        if (t.getElementById && (i = t.getElementById(e)), i) return i;
        var n, r, o, s = t.getElementsByTagName("*");
        for (r = 0, o = s.length; r < o; r++) if (e === (n = s[r]).getAttribute("id")) return n
    }

    e.svgValidTagNamesRegEx = h(["path", "circle", "polygon", "polyline", "ellipse", "rect", "line", "image", "text"]), e.svgViewBoxElementsRegEx = h(["symbol", "image", "marker", "pattern", "view", "svg"]), e.svgInvalidAncestorsRegEx = h(["pattern", "defs", "symbol", "metadata", "clipPath", "mask", "desc"]), e.svgValidParentsRegEx = h(["symbol", "g", "a", "svg", "clipPath", "defs"]), e.cssRules = {}, e.gradientDefs = {}, e.clipPaths = {}, e.parseTransformAttribute = function () {
        function t(t, i, n) {
            t[n] = Math.tan(e.util.degreesToRadians(i[0]))
        }

        var i = e.iMatrix, n = e.reNum, r = "(?:\\s+,?\\s*|,\\s*)",
            o = "(?:(?:(matrix)\\s*\\(\\s*(" + n + ")" + r + "(" + n + ")" + r + "(" + n + ")" + r + "(" + n + ")" + r + "(" + n + ")" + r + "(" + n + ")\\s*\\))|(?:(translate)\\s*\\(\\s*(" + n + ")(?:" + r + "(" + n + "))?\\s*\\))|(?:(scale)\\s*\\(\\s*(" + n + ")(?:" + r + "(" + n + "))?\\s*\\))|(?:(rotate)\\s*\\(\\s*(" + n + ")(?:" + r + "(" + n + ")" + r + "(" + n + "))?\\s*\\))|(?:(skewX)\\s*\\(\\s*(" + n + ")\\s*\\))|(?:(skewY)\\s*\\(\\s*(" + n + ")\\s*\\)))",
            s = new RegExp("^\\s*(?:(?:" + o + "(?:" + r + "*" + o + ")*)?)\\s*$"), a = new RegExp(o, "g");
        return function (n) {
            var r = i.concat(), c = [];
            if (!n || n && !s.test(n)) return r;
            n.replace(a, (function (n) {
                var s, a, l, h, u, f, d, p, g, v, m, _, b = new RegExp(o).exec(n).filter((function (t) {
                    return !!t
                })), y = b[1], x = b.slice(2).map(parseFloat);
                switch (y) {
                    case"translate":
                        _ = x, (m = r)[4] = _[0], 2 === _.length && (m[5] = _[1]);
                        break;
                    case"rotate":
                        x[0] = e.util.degreesToRadians(x[0]), u = r, f = x, d = e.util.cos(f[0]), p = e.util.sin(f[0]), v = g = 0, 3 === f.length && (g = f[1], v = f[2]), u[0] = d, u[1] = p, u[2] = -p, u[3] = d, u[4] = g - (d * g - p * v), u[5] = v - (p * g + d * v);
                        break;
                    case"scale":
                        s = r, l = (a = x)[0], h = 2 === a.length ? a[1] : a[0], s[0] = l, s[3] = h;
                        break;
                    case"skewX":
                        t(r, x, 2);
                        break;
                    case"skewY":
                        t(r, x, 1);
                        break;
                    case"matrix":
                        r = x
                }
                c.push(r.concat()), r = i.concat()
            }));
            for (var l = c[0]; 1 < c.length;) c.shift(), l = e.util.multiplyTransformMatrices(l, c[0]);
            return l
        }
    }();
    var g = new RegExp("^\\s*(" + e.reNum + "+)\\s*,?\\s*(" + e.reNum + "+)\\s*,?\\s*(" + e.reNum + "+)\\s*,?\\s*(" + e.reNum + "+)\\s*$");

    function v(t) {
        var i, n, r, s, a, c, l = t.getAttribute("viewBox"), h = 1, u = 1, f = t.getAttribute("width"),
            d = t.getAttribute("height"), p = t.getAttribute("x") || 0, v = t.getAttribute("y") || 0,
            m = t.getAttribute("preserveAspectRatio") || "",
            _ = !l || !e.svgViewBoxElementsRegEx.test(t.nodeName) || !(l = l.match(g)),
            b = !f || !d || "100%" === f || "100%" === d, y = _ && b, x = {}, w = "", C = 0, S = 0;
        if (x.width = 0, x.height = 0, x.toBeParsed = y) return x;
        if (_) return x.width = o(f), x.height = o(d), x;
        if (i = -parseFloat(l[1]), n = -parseFloat(l[2]), r = parseFloat(l[3]), s = parseFloat(l[4]), x.minX = i, x.minY = n, x.viewBoxWidth = r, x.viewBoxHeight = s, b ? (x.width = r, x.height = s) : (x.width = o(f), x.height = o(d), h = x.width / r, u = x.height / s), "none" !== (m = e.util.parsePreserveAspectRatioAttribute(m)).alignX && ("meet" === m.meetOrSlice && (u = h = u < h ? u : h), "slice" === m.meetOrSlice && (u = h = u < h ? h : u), C = x.width - r * h, S = x.height - s * h, "Mid" === m.alignX && (C /= 2), "Mid" === m.alignY && (S /= 2), "Min" === m.alignX && (C = 0), "Min" === m.alignY && (S = 0)), 1 === h && 1 === u && 0 === i && 0 === n && 0 === p && 0 === v) return x;
        if ((p || v) && (w = " translate(" + o(p) + " " + o(v) + ") "), a = w + " matrix(" + h + " 0 0 " + u + " " + (i * h + C) + " " + (n * u + S) + ") ", x.viewboxTransform = e.parseTransformAttribute(a), "svg" === t.nodeName) {
            for (c = t.ownerDocument.createElement("g"); t.firstChild;) c.appendChild(t.firstChild);
            t.appendChild(c)
        } else a = (c = t).getAttribute("transform") + a;
        return c.setAttribute("transform", a), x
    }

    function m(t, e) {
        var i = "xlink:href", n = p(t, e.getAttribute(i).substr(1));
        if (n && n.getAttribute(i) && m(t, n), ["gradientTransform", "x1", "x2", "y1", "y2", "gradientUnits", "cx", "cy", "r", "fx", "fy"].forEach((function (t) {
            n && !e.hasAttribute(t) && n.hasAttribute(t) && e.setAttribute(t, n.getAttribute(t))
        })), !e.children.length) for (var r = n.cloneNode(!0); r.firstChild;) e.appendChild(r.firstChild);
        e.removeAttribute(i)
    }

    e.parseSVGDocument = function (t, i, r, o) {
        if (t) {
            !function (t) {
                for (var e = u(t, ["use", "svg:use"]), i = 0; e.length && i < e.length;) {
                    var n, r, o, s, a = e[i], c = (a.getAttribute("xlink:href") || a.getAttribute("href")).substr(1),
                        l = a.getAttribute("x") || 0, h = a.getAttribute("y") || 0, f = p(t, c).cloneNode(!0),
                        d = (f.getAttribute("transform") || "") + " translate(" + l + ", " + h + ")", g = e.length;
                    if (v(f), /^svg$/i.test(f.nodeName)) {
                        var m = f.ownerDocument.createElement("g");
                        for (r = 0, s = (o = f.attributes).length; r < s; r++) n = o.item(r), m.setAttribute(n.nodeName, n.nodeValue);
                        for (; f.firstChild;) m.appendChild(f.firstChild);
                        f = m
                    }
                    for (r = 0, s = (o = a.attributes).length; r < s; r++) "x" !== (n = o.item(r)).nodeName && "y" !== n.nodeName && "xlink:href" !== n.nodeName && "href" !== n.nodeName && ("transform" === n.nodeName ? d = n.nodeValue + " " + d : f.setAttribute(n.nodeName, n.nodeValue));
                    f.setAttribute("transform", d), f.setAttribute("instantiated_by_use", "1"), f.removeAttribute("id"), a.parentNode.replaceChild(f, a), e.length === g && i++
                }
            }(t);
            var s, a, c = e.Object.__uid++, l = v(t), h = e.util.toArray(t.getElementsByTagName("*"));
            if (l.crossOrigin = o && o.crossOrigin, l.svgUid = c, 0 === h.length && e.isLikelyNode) {
                var f = [];
                for (s = 0, a = (h = t.selectNodes('//*[name(.)!="svg"]')).length; s < a; s++) f[s] = h[s];
                h = f
            }
            var d = h.filter((function (t) {
                return v(t), e.svgValidTagNamesRegEx.test(t.nodeName.replace("svg:", "")) && !function (t, e) {
                    for (; t && (t = t.parentNode);) if (t.nodeName && e.test(t.nodeName.replace("svg:", "")) && !t.getAttribute("instantiated_by_use")) return !0;
                    return !1
                }(t, e.svgInvalidAncestorsRegEx)
            }));
            if (!d || d && !d.length) i && i([], {}); else {
                var g = {};
                h.filter((function (t) {
                    return "clipPath" === t.nodeName.replace("svg:", "")
                })).forEach((function (t) {
                    var i = t.getAttribute("id");
                    g[i] = e.util.toArray(t.getElementsByTagName("*")).filter((function (t) {
                        return e.svgValidTagNamesRegEx.test(t.nodeName.replace("svg:", ""))
                    }))
                })), e.gradientDefs[c] = e.getGradientDefs(t), e.cssRules[c] = e.getCSSRules(t), e.clipPaths[c] = g, e.parseElements(d, (function (t, n) {
                    i && (i(t, l, n, h), delete e.gradientDefs[c], delete e.cssRules[c], delete e.clipPaths[c])
                }), n(l), r, o)
            }
        }
    };
    var _ = new RegExp("(normal|italic)?\\s*(normal|small-caps)?\\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(" + e.reNum + "(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|" + e.reNum + "))?\\s+(.*)");
    i(e, {
        parseFontDeclaration: function (t, e) {
            var i = t.match(_);
            if (i) {
                var n = i[1], r = i[3], s = i[4], a = i[5], c = i[6];
                n && (e.fontStyle = n), r && (e.fontWeight = isNaN(parseFloat(r)) ? r : parseFloat(r)), s && (e.fontSize = o(s)), c && (e.fontFamily = c), a && (e.lineHeight = "normal" === a ? 1 : a)
            }
        }, getGradientDefs: function (t) {
            var e, i = u(t, ["linearGradient", "radialGradient", "svg:linearGradient", "svg:radialGradient"]), n = 0,
                r = {};
            for (n = i.length; n--;) (e = i[n]).getAttribute("xlink:href") && m(t, e), r[e.getAttribute("id")] = e;
            return r
        }, parseAttributes: function (t, n, s) {
            if (t) {
                var h, u, d, p = {};
                void 0 === s && (s = t.getAttribute("svgUid")), t.parentNode && e.svgValidParentsRegEx.test(t.parentNode.nodeName) && (p = e.parseAttributes(t.parentNode, n, s));
                var g = n.reduce((function (e, i) {
                    return (h = t.getAttribute(i)) && (e[i] = h), e
                }), {});
                g = i(g, i(function (t, i) {
                    var n = {};
                    for (var r in e.cssRules[i]) if (f(t, r.split(" "))) for (var o in e.cssRules[i][r]) n[o] = e.cssRules[i][r][o];
                    return n
                }(t, s), e.parseStyleAttribute(t))), u = d = p.fontSize || e.Text.DEFAULT_SVG_FONT_SIZE, g["font-size"] && (g["font-size"] = u = o(g["font-size"], d));
                var v, m, _, b = {};
                for (var y in g) m = l(v = (_ = y) in a ? a[_] : _, g[y], p, u), b[v] = m;
                b && b.font && e.parseFontDeclaration(b.font, b);
                var x = i(p, b);
                return e.svgValidParentsRegEx.test(t.nodeName) ? x : function (t) {
                    for (var i in c) if (void 0 !== t[c[i]] && "" !== t[i]) {
                        if (void 0 === t[i]) {
                            if (!e.Object.prototype[i]) continue;
                            t[i] = e.Object.prototype[i]
                        }
                        if (0 !== t[i].indexOf("url(")) {
                            var n = new e.Color(t[i]);
                            t[i] = n.setAlpha(r(n.getAlpha() * t[c[i]], 2)).toRgba()
                        }
                    }
                    return t
                }(x)
            }
        }, parseElements: function (t, i, n, r, o) {
            new e.ElementsParser(t, i, n, r, o).parse()
        }, parseStyleAttribute: function (t) {
            var e, i, n, r = {}, o = t.getAttribute("style");
            return o && ("string" == typeof o ? (e = r, o.replace(/;\s*$/, "").split(";").forEach((function (t) {
                var r = t.split(":");
                i = r[0].trim().toLowerCase(), n = r[1].trim(), e[i] = n
            }))) : function (t, e) {
                var i, n;
                for (var r in t) void 0 !== t[r] && (i = r.toLowerCase(), n = t[r], e[i] = n)
            }(o, r)), r
        }, parsePointsAttribute: function (t) {
            if (!t) return null;
            var e, i, n = [];
            for (e = 0, i = (t = (t = t.replace(/,/g, " ").trim()).split(/\s+/)).length; e < i; e += 2) n.push({
                x: parseFloat(t[e]),
                y: parseFloat(t[e + 1])
            });
            return n
        }, getCSSRules: function (t) {
            var i, n, r = t.getElementsByTagName("style"), o = {};
            for (i = 0, n = r.length; i < n; i++) {
                var s = r[i].textContent || r[i].text;
                "" !== (s = s.replace(/\/\*[\s\S]*?\*\//g, "")).trim() && s.match(/[^{]*\{[\s\S]*?\}/g).map((function (t) {
                    return t.trim()
                })).forEach((function (t) {
                    var r = t.match(/([\s\S]*?)\s*\{([^}]*)\}/), s = {},
                        a = r[2].trim().replace(/;$/, "").split(/\s*;\s*/);
                    for (i = 0, n = a.length; i < n; i++) {
                        var c = a[i].split(/\s*:\s*/), l = c[0], h = c[1];
                        s[l] = h
                    }
                    (t = r[1]).split(",").forEach((function (t) {
                        "" !== (t = t.replace(/^svg/i, "").trim()) && (o[t] ? e.util.object.extend(o[t], s) : o[t] = e.util.object.clone(s))
                    }))
                }))
            }
            return o
        }, loadSVGFromURL: function (t, i, n, r) {
            t = t.replace(/^\n\s*/, "").trim(), new e.util.request(t, {
                method: "get", onComplete: function (t) {
                    var o = t.responseXML;
                    if (o && !o.documentElement && e.window.ActiveXObject && t.responseText && ((o = new ActiveXObject("Microsoft.XMLDOM")).async = "false", o.loadXML(t.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, ""))), !o || !o.documentElement) return i && i(null), !1;
                    e.parseSVGDocument(o.documentElement, (function (t, e, n, r) {
                        i && i(t, e, n, r)
                    }), n, r)
                }
            })
        }, loadSVGFromString: function (t, i, n, r) {
            var o;
            if (t = t.trim(), void 0 !== e.window.DOMParser) {
                var s = new e.window.DOMParser;
                s && s.parseFromString && (o = s.parseFromString(t, "text/xml"))
            } else e.window.ActiveXObject && ((o = new ActiveXObject("Microsoft.XMLDOM")).async = "false", o.loadXML(t.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, "")));
            e.parseSVGDocument(o.documentElement, (function (t, e, n, r) {
                i(t, e, n, r)
            }), n, r)
        }
    })
}("undefined" != typeof exports ? exports : this), fabric.ElementsParser = function (t, e, i, n, r) {
    this.elements = t, this.callback = e, this.options = i, this.reviver = n, this.svgUid = i && i.svgUid || 0, this.parsingOptions = r, this.regexUrl = /^url\(['"]?#([^'"]+)['"]?\)/g
}, function (t) {
    t.parse = function () {
        this.instances = new Array(this.elements.length), this.numElements = this.elements.length, this.createObjects()
    }, t.createObjects = function () {
        var t = this;
        this.elements.forEach((function (e, i) {
            e.setAttribute("svgUid", t.svgUid), t.createObject(e, i)
        }))
    }, t.findTag = function (t) {
        return fabric[fabric.util.string.capitalize(t.tagName.replace("svg:", ""))]
    }, t.createObject = function (t, e) {
        var i = this.findTag(t);
        if (i && i.fromElement) try {
            i.fromElement(t, this.createCallback(e, t), this.options)
        } catch (t) {
            fabric.log(t)
        } else this.checkIfDone()
    }, t.createCallback = function (t, e) {
        var i = this;
        return function (n) {
            var r;
            i.resolveGradient(n, e, "fill"), i.resolveGradient(n, e, "stroke"), n instanceof fabric.Image && n._originalElement && (r = n.parsePreserveAspectRatioAttribute(e)), n._removeTransformMatrix(r), i.resolveClipPath(n), i.reviver && i.reviver(e, n), i.instances[t] = n, i.checkIfDone()
        }
    }, t.extractPropertyDefinition = function (t, e, i) {
        var n = t[e];
        if (/^url\(/.test(n)) {
            var r = this.regexUrl.exec(n)[1];
            return this.regexUrl.lastIndex = 0, fabric[i][this.svgUid][r]
        }
    }, t.resolveGradient = function (t, e, i) {
        var n = this.extractPropertyDefinition(t, i, "gradientDefs");
        if (n) {
            var r = e.getAttribute(i + "-opacity"), o = fabric.Gradient.fromElement(n, t, r, this.options);
            t.set(i, o)
        }
    }, t.createClipPathCallback = function (t, e) {
        return function (t) {
            t._removeTransformMatrix(), t.fillRule = t.clipRule, e.push(t)
        }
    }, t.resolveClipPath = function (t) {
        var e, i, n, r, o = this.extractPropertyDefinition(t, "clipPath", "clipPaths");
        if (o) {
            n = [], i = fabric.util.invertTransform(t.calcTransformMatrix());
            for (var s = 0; s < o.length; s++) e = o[s], this.findTag(e).fromElement(e, this.createClipPathCallback(t, n), this.options);
            o = 1 === n.length ? n[0] : new fabric.Group(n), r = fabric.util.multiplyTransformMatrices(i, o.calcTransformMatrix());
            var a = fabric.util.qrDecompose(r);
            o.flipX = !1, o.flipY = !1, o.set("scaleX", a.scaleX), o.set("scaleY", a.scaleY), o.angle = a.angle, o.skewX = a.skewX, o.skewY = 0, o.setPositionByOrigin({
                x: a.translateX,
                y: a.translateY
            }, "center", "center"), t.clipPath = o
        } else delete t.clipPath
    }, t.checkIfDone = function () {
        0 == --this.numElements && (this.instances = this.instances.filter((function (t) {
            return null != t
        })), this.callback(this.instances, this.elements))
    }
}(fabric.ElementsParser.prototype), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {});

    function i(t, e) {
        this.x = t, this.y = e
    }

    e.Point ? e.warn("fabric.Point is already defined") : (e.Point = i).prototype = {
        type: "point", constructor: i, add: function (t) {
            return new i(this.x + t.x, this.y + t.y)
        }, addEquals: function (t) {
            return this.x += t.x, this.y += t.y, this
        }, scalarAdd: function (t) {
            return new i(this.x + t, this.y + t)
        }, scalarAddEquals: function (t) {
            return this.x += t, this.y += t, this
        }, subtract: function (t) {
            return new i(this.x - t.x, this.y - t.y)
        }, subtractEquals: function (t) {
            return this.x -= t.x, this.y -= t.y, this
        }, scalarSubtract: function (t) {
            return new i(this.x - t, this.y - t)
        }, scalarSubtractEquals: function (t) {
            return this.x -= t, this.y -= t, this
        }, multiply: function (t) {
            return new i(this.x * t, this.y * t)
        }, multiplyEquals: function (t) {
            return this.x *= t, this.y *= t, this
        }, divide: function (t) {
            return new i(this.x / t, this.y / t)
        }, divideEquals: function (t) {
            return this.x /= t, this.y /= t, this
        }, eq: function (t) {
            return this.x === t.x && this.y === t.y
        }, lt: function (t) {
            return this.x < t.x && this.y < t.y
        }, lte: function (t) {
            return this.x <= t.x && this.y <= t.y
        }, gt: function (t) {
            return this.x > t.x && this.y > t.y
        }, gte: function (t) {
            return this.x >= t.x && this.y >= t.y
        }, lerp: function (t, e) {
            return void 0 === e && (e = .5), e = Math.max(Math.min(1, e), 0), new i(this.x + (t.x - this.x) * e, this.y + (t.y - this.y) * e)
        }, distanceFrom: function (t) {
            var e = this.x - t.x, i = this.y - t.y;
            return Math.sqrt(e * e + i * i)
        }, midPointFrom: function (t) {
            return this.lerp(t)
        }, min: function (t) {
            return new i(Math.min(this.x, t.x), Math.min(this.y, t.y))
        }, max: function (t) {
            return new i(Math.max(this.x, t.x), Math.max(this.y, t.y))
        }, toString: function () {
            return this.x + "," + this.y
        }, setXY: function (t, e) {
            return this.x = t, this.y = e, this
        }, setX: function (t) {
            return this.x = t, this
        }, setY: function (t) {
            return this.y = t, this
        }, setFromPoint: function (t) {
            return this.x = t.x, this.y = t.y, this
        }, swap: function (t) {
            var e = this.x, i = this.y;
            this.x = t.x, this.y = t.y, t.x = e, t.y = i
        }, clone: function () {
            return new i(this.x, this.y)
        }
    }
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {});

    function i(t) {
        this.status = t, this.points = []
    }

    e.Intersection ? e.warn("fabric.Intersection is already defined") : (e.Intersection = i, e.Intersection.prototype = {
        constructor: i,
        appendPoint: function (t) {
            return this.points.push(t), this
        },
        appendPoints: function (t) {
            return this.points = this.points.concat(t), this
        }
    }, e.Intersection.intersectLineLine = function (t, n, r, o) {
        var s, a = (o.x - r.x) * (t.y - r.y) - (o.y - r.y) * (t.x - r.x),
            c = (n.x - t.x) * (t.y - r.y) - (n.y - t.y) * (t.x - r.x),
            l = (o.y - r.y) * (n.x - t.x) - (o.x - r.x) * (n.y - t.y);
        if (0 !== l) {
            var h = a / l, u = c / l;
            0 <= h && h <= 1 && 0 <= u && u <= 1 ? (s = new i("Intersection")).appendPoint(new e.Point(t.x + h * (n.x - t.x), t.y + h * (n.y - t.y))) : s = new i
        } else s = new i(0 === a || 0 === c ? "Coincident" : "Parallel");
        return s
    }, e.Intersection.intersectLinePolygon = function (t, e, n) {
        var r, o, s, a, c = new i, l = n.length;
        for (a = 0; a < l; a++) r = n[a], o = n[(a + 1) % l], s = i.intersectLineLine(t, e, r, o), c.appendPoints(s.points);
        return 0 < c.points.length && (c.status = "Intersection"), c
    }, e.Intersection.intersectPolygonPolygon = function (t, e) {
        var n, r = new i, o = t.length;
        for (n = 0; n < o; n++) {
            var s = t[n], a = t[(n + 1) % o], c = i.intersectLinePolygon(s, a, e);
            r.appendPoints(c.points)
        }
        return 0 < r.points.length && (r.status = "Intersection"), r
    }, e.Intersection.intersectPolygonRectangle = function (t, n, r) {
        var o = n.min(r), s = n.max(r), a = new e.Point(s.x, o.y), c = new e.Point(o.x, s.y),
            l = i.intersectLinePolygon(o, a, t), h = i.intersectLinePolygon(a, s, t),
            u = i.intersectLinePolygon(s, c, t), f = i.intersectLinePolygon(c, o, t), d = new i;
        return d.appendPoints(l.points), d.appendPoints(h.points), d.appendPoints(u.points), d.appendPoints(f.points), 0 < d.points.length && (d.status = "Intersection"), d
    })
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {});

    function i(t) {
        t ? this._tryParsingColor(t) : this.setSource([0, 0, 0, 1])
    }

    function n(t, e, i) {
        return i < 0 && (i += 1), 1 < i && (i -= 1), i < 1 / 6 ? t + 6 * (e - t) * i : i < .5 ? e : i < 2 / 3 ? t + (e - t) * (2 / 3 - i) * 6 : t
    }

    e.Color ? e.warn("fabric.Color is already defined.") : (e.Color = i, e.Color.prototype = {
        _tryParsingColor: function (t) {
            var e;
            t in i.colorNameMap && (t = i.colorNameMap[t]), "transparent" === t && (e = [255, 255, 255, 0]), e || (e = i.sourceFromHex(t)), e || (e = i.sourceFromRgb(t)), e || (e = i.sourceFromHsl(t)), e || (e = [0, 0, 0, 1]), e && this.setSource(e)
        }, _rgbToHsl: function (t, i, n) {
            t /= 255, i /= 255, n /= 255;
            var r, o, s, a = e.util.array.max([t, i, n]), c = e.util.array.min([t, i, n]);
            if (s = (a + c) / 2, a === c) r = o = 0; else {
                var l = a - c;
                switch (o = .5 < s ? l / (2 - a - c) : l / (a + c), a) {
                    case t:
                        r = (i - n) / l + (i < n ? 6 : 0);
                        break;
                    case i:
                        r = (n - t) / l + 2;
                        break;
                    case n:
                        r = (t - i) / l + 4
                }
                r /= 6
            }
            return [Math.round(360 * r), Math.round(100 * o), Math.round(100 * s)]
        }, getSource: function () {
            return this._source
        }, setSource: function (t) {
            this._source = t
        }, toRgb: function () {
            var t = this.getSource();
            return "rgb(" + t[0] + "," + t[1] + "," + t[2] + ")"
        }, toRgba: function () {
            var t = this.getSource();
            return "rgba(" + t[0] + "," + t[1] + "," + t[2] + "," + t[3] + ")"
        }, toHsl: function () {
            var t = this.getSource(), e = this._rgbToHsl(t[0], t[1], t[2]);
            return "hsl(" + e[0] + "," + e[1] + "%," + e[2] + "%)"
        }, toHsla: function () {
            var t = this.getSource(), e = this._rgbToHsl(t[0], t[1], t[2]);
            return "hsla(" + e[0] + "," + e[1] + "%," + e[2] + "%," + t[3] + ")"
        }, toHex: function () {
            var t, e, i, n = this.getSource();
            return t = 1 === (t = n[0].toString(16)).length ? "0" + t : t, e = 1 === (e = n[1].toString(16)).length ? "0" + e : e, i = 1 === (i = n[2].toString(16)).length ? "0" + i : i, t.toUpperCase() + e.toUpperCase() + i.toUpperCase()
        }, toHexa: function () {
            var t, e = this.getSource();
            return t = 1 === (t = (t = Math.round(255 * e[3])).toString(16)).length ? "0" + t : t, this.toHex() + t.toUpperCase()
        }, getAlpha: function () {
            return this.getSource()[3]
        }, setAlpha: function (t) {
            var e = this.getSource();
            return e[3] = t, this.setSource(e), this
        }, toGrayscale: function () {
            var t = this.getSource(), e = parseInt((.3 * t[0] + .59 * t[1] + .11 * t[2]).toFixed(0), 10), i = t[3];
            return this.setSource([e, e, e, i]), this
        }, toBlackWhite: function (t) {
            var e = this.getSource(), i = (.3 * e[0] + .59 * e[1] + .11 * e[2]).toFixed(0), n = e[3];
            return t = t || 127, i = Number(i) < Number(t) ? 0 : 255, this.setSource([i, i, i, n]), this
        }, overlayWith: function (t) {
            t instanceof i || (t = new i(t));
            var e, n = [], r = this.getAlpha(), o = this.getSource(), s = t.getSource();
            for (e = 0; e < 3; e++) n.push(Math.round(.5 * o[e] + .5 * s[e]));
            return n[3] = r, this.setSource(n), this
        }
    }, e.Color.reRGBa = /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*((?:\d*\.?\d+)?)\s*)?\)$/i, e.Color.reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/i, e.Color.reHex = /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i, e.Color.colorNameMap = {
        aliceblue: "#F0F8FF",
        antiquewhite: "#FAEBD7",
        aqua: "#00FFFF",
        aquamarine: "#7FFFD4",
        azure: "#F0FFFF",
        beige: "#F5F5DC",
        bisque: "#FFE4C4",
        black: "#000000",
        blanchedalmond: "#FFEBCD",
        blue: "#0000FF",
        blueviolet: "#8A2BE2",
        brown: "#A52A2A",
        burlywood: "#DEB887",
        cadetblue: "#5F9EA0",
        chartreuse: "#7FFF00",
        chocolate: "#D2691E",
        coral: "#FF7F50",
        cornflowerblue: "#6495ED",
        cornsilk: "#FFF8DC",
        crimson: "#DC143C",
        cyan: "#00FFFF",
        darkblue: "#00008B",
        darkcyan: "#008B8B",
        darkgoldenrod: "#B8860B",
        darkgray: "#A9A9A9",
        darkgrey: "#A9A9A9",
        darkgreen: "#006400",
        darkkhaki: "#BDB76B",
        darkmagenta: "#8B008B",
        darkolivegreen: "#556B2F",
        darkorange: "#FF8C00",
        darkorchid: "#9932CC",
        darkred: "#8B0000",
        darksalmon: "#E9967A",
        darkseagreen: "#8FBC8F",
        darkslateblue: "#483D8B",
        darkslategray: "#2F4F4F",
        darkslategrey: "#2F4F4F",
        darkturquoise: "#00CED1",
        darkviolet: "#9400D3",
        deeppink: "#FF1493",
        deepskyblue: "#00BFFF",
        dimgray: "#696969",
        dimgrey: "#696969",
        dodgerblue: "#1E90FF",
        firebrick: "#B22222",
        floralwhite: "#FFFAF0",
        forestgreen: "#228B22",
        fuchsia: "#FF00FF",
        gainsboro: "#DCDCDC",
        ghostwhite: "#F8F8FF",
        gold: "#FFD700",
        goldenrod: "#DAA520",
        gray: "#808080",
        grey: "#808080",
        green: "#008000",
        greenyellow: "#ADFF2F",
        honeydew: "#F0FFF0",
        hotpink: "#FF69B4",
        indianred: "#CD5C5C",
        indigo: "#4B0082",
        ivory: "#FFFFF0",
        khaki: "#F0E68C",
        lavender: "#E6E6FA",
        lavenderblush: "#FFF0F5",
        lawngreen: "#7CFC00",
        lemonchiffon: "#FFFACD",
        lightblue: "#ADD8E6",
        lightcoral: "#F08080",
        lightcyan: "#E0FFFF",
        lightgoldenrodyellow: "#FAFAD2",
        lightgray: "#D3D3D3",
        lightgrey: "#D3D3D3",
        lightgreen: "#90EE90",
        lightpink: "#FFB6C1",
        lightsalmon: "#FFA07A",
        lightseagreen: "#20B2AA",
        lightskyblue: "#87CEFA",
        lightslategray: "#778899",
        lightslategrey: "#778899",
        lightsteelblue: "#B0C4DE",
        lightyellow: "#FFFFE0",
        lime: "#00FF00",
        limegreen: "#32CD32",
        linen: "#FAF0E6",
        magenta: "#FF00FF",
        maroon: "#800000",
        mediumaquamarine: "#66CDAA",
        mediumblue: "#0000CD",
        mediumorchid: "#BA55D3",
        mediumpurple: "#9370DB",
        mediumseagreen: "#3CB371",
        mediumslateblue: "#7B68EE",
        mediumspringgreen: "#00FA9A",
        mediumturquoise: "#48D1CC",
        mediumvioletred: "#C71585",
        midnightblue: "#191970",
        mintcream: "#F5FFFA",
        mistyrose: "#FFE4E1",
        moccasin: "#FFE4B5",
        navajowhite: "#FFDEAD",
        navy: "#000080",
        oldlace: "#FDF5E6",
        olive: "#808000",
        olivedrab: "#6B8E23",
        orange: "#FFA500",
        orangered: "#FF4500",
        orchid: "#DA70D6",
        palegoldenrod: "#EEE8AA",
        palegreen: "#98FB98",
        paleturquoise: "#AFEEEE",
        palevioletred: "#DB7093",
        papayawhip: "#FFEFD5",
        peachpuff: "#FFDAB9",
        peru: "#CD853F",
        pink: "#FFC0CB",
        plum: "#DDA0DD",
        powderblue: "#B0E0E6",
        purple: "#800080",
        rebeccapurple: "#663399",
        red: "#FF0000",
        rosybrown: "#BC8F8F",
        royalblue: "#4169E1",
        saddlebrown: "#8B4513",
        salmon: "#FA8072",
        sandybrown: "#F4A460",
        seagreen: "#2E8B57",
        seashell: "#FFF5EE",
        sienna: "#A0522D",
        silver: "#C0C0C0",
        skyblue: "#87CEEB",
        slateblue: "#6A5ACD",
        slategray: "#708090",
        slategrey: "#708090",
        snow: "#FFFAFA",
        springgreen: "#00FF7F",
        steelblue: "#4682B4",
        tan: "#D2B48C",
        teal: "#008080",
        thistle: "#D8BFD8",
        tomato: "#FF6347",
        turquoise: "#40E0D0",
        violet: "#EE82EE",
        wheat: "#F5DEB3",
        white: "#FFFFFF",
        whitesmoke: "#F5F5F5",
        yellow: "#FFFF00",
        yellowgreen: "#9ACD32"
    }, e.Color.fromRgb = function (t) {
        return i.fromSource(i.sourceFromRgb(t))
    }, e.Color.sourceFromRgb = function (t) {
        var e = t.match(i.reRGBa);
        if (e) {
            var n = parseInt(e[1], 10) / (/%$/.test(e[1]) ? 100 : 1) * (/%$/.test(e[1]) ? 255 : 1),
                r = parseInt(e[2], 10) / (/%$/.test(e[2]) ? 100 : 1) * (/%$/.test(e[2]) ? 255 : 1),
                o = parseInt(e[3], 10) / (/%$/.test(e[3]) ? 100 : 1) * (/%$/.test(e[3]) ? 255 : 1);
            return [parseInt(n, 10), parseInt(r, 10), parseInt(o, 10), e[4] ? parseFloat(e[4]) : 1]
        }
    }, e.Color.fromRgba = i.fromRgb, e.Color.fromHsl = function (t) {
        return i.fromSource(i.sourceFromHsl(t))
    }, e.Color.sourceFromHsl = function (t) {
        var e = t.match(i.reHSLa);
        if (e) {
            var r, o, s, a = (parseFloat(e[1]) % 360 + 360) % 360 / 360,
                c = parseFloat(e[2]) / (/%$/.test(e[2]) ? 100 : 1), l = parseFloat(e[3]) / (/%$/.test(e[3]) ? 100 : 1);
            if (0 === c) r = o = s = l; else {
                var h = l <= .5 ? l * (c + 1) : l + c - l * c, u = 2 * l - h;
                r = n(u, h, a + 1 / 3), o = n(u, h, a), s = n(u, h, a - 1 / 3)
            }
            return [Math.round(255 * r), Math.round(255 * o), Math.round(255 * s), e[4] ? parseFloat(e[4]) : 1]
        }
    }, e.Color.fromHsla = i.fromHsl, e.Color.fromHex = function (t) {
        return i.fromSource(i.sourceFromHex(t))
    }, e.Color.sourceFromHex = function (t) {
        if (t.match(i.reHex)) {
            var e = t.slice(t.indexOf("#") + 1), n = 3 === e.length || 4 === e.length,
                r = 8 === e.length || 4 === e.length, o = n ? e.charAt(0) + e.charAt(0) : e.substring(0, 2),
                s = n ? e.charAt(1) + e.charAt(1) : e.substring(2, 4),
                a = n ? e.charAt(2) + e.charAt(2) : e.substring(4, 6),
                c = r ? n ? e.charAt(3) + e.charAt(3) : e.substring(6, 8) : "FF";
            return [parseInt(o, 16), parseInt(s, 16), parseInt(a, 16), parseFloat((parseInt(c, 16) / 255).toFixed(2))]
        }
    }, e.Color.fromSource = function (t) {
        var e = new i;
        return e.setSource(t), e
    })
}("undefined" != typeof exports ? exports : this), function () {
    function t(t, e) {
        var i, n, r, o, s = t.getAttribute("style"), a = t.getAttribute("offset") || 0;
        if (a = (a = parseFloat(a) / (/%$/.test(a) ? 100 : 1)) < 0 ? 0 : 1 < a ? 1 : a, s) {
            var c = s.split(/\s*;\s*/);
            for ("" === c[c.length - 1] && c.pop(), o = c.length; o--;) {
                var l = c[o].split(/\s*:\s*/), h = l[0].trim(), u = l[1].trim();
                "stop-color" === h ? i = u : "stop-opacity" === h && (r = u)
            }
        }
        return i || (i = t.getAttribute("stop-color") || "rgb(0,0,0)"), r || (r = t.getAttribute("stop-opacity")), n = (i = new fabric.Color(i)).getAlpha(), r = isNaN(parseFloat(r)) ? 1 : parseFloat(r), r *= n * e, {
            offset: a,
            color: i.toRgb(),
            opacity: r
        }
    }

    var e = fabric.util.object.clone;

    function i(t, e, i, n) {
        var r, o;
        Object.keys(e).forEach((function (t) {
            "Infinity" === (r = e[t]) ? o = 1 : "-Infinity" === r ? o = 0 : (o = parseFloat(e[t], 10), "string" == typeof r && /^(\d+\.\d+)%|(\d+)%$/.test(r) && (o *= .01, "pixels" === n && ("x1" !== t && "x2" !== t && "r2" !== t || (o *= i.viewBoxWidth || i.width), "y1" !== t && "y2" !== t || (o *= i.viewBoxHeight || i.height)))), e[t] = o
        }))
    }

    fabric.Gradient = fabric.util.createClass({
        offsetX: 0,
        offsetY: 0,
        gradientTransform: null,
        gradientUnits: "pixels",
        type: "linear",
        initialize: function (t) {
            t || (t = {}), t.coords || (t.coords = {});
            var e, i = this;
            Object.keys(t).forEach((function (e) {
                i[e] = t[e]
            })), this.id ? this.id += "_" + fabric.Object.__uid++ : this.id = fabric.Object.__uid++, e = {
                x1: t.coords.x1 || 0,
                y1: t.coords.y1 || 0,
                x2: t.coords.x2 || 0,
                y2: t.coords.y2 || 0
            }, "radial" === this.type && (e.r1 = t.coords.r1 || 0, e.r2 = t.coords.r2 || 0), this.coords = e, this.colorStops = t.colorStops.slice()
        },
        addColorStop: function (t) {
            for (var e in t) {
                var i = new fabric.Color(t[e]);
                this.colorStops.push({offset: parseFloat(e), color: i.toRgb(), opacity: i.getAlpha()})
            }
            return this
        },
        toObject: function (t) {
            var e = {
                type: this.type,
                coords: this.coords,
                colorStops: this.colorStops,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                gradientUnits: this.gradientUnits,
                gradientTransform: this.gradientTransform ? this.gradientTransform.concat() : this.gradientTransform
            };
            return fabric.util.populateWithProperties(this, e, t), e
        },
        toSVG: function (t, i) {
            var n, r, o, s, a = e(this.coords, !0), c = (i = i || {}, e(this.colorStops, !0)), l = a.r1 > a.r2,
                h = this.gradientTransform ? this.gradientTransform.concat() : fabric.iMatrix.concat(),
                u = -this.offsetX, f = -this.offsetY, d = !!i.additionalTransform,
                p = "pixels" === this.gradientUnits ? "userSpaceOnUse" : "objectBoundingBox";
            if (c.sort((function (t, e) {
                return t.offset - e.offset
            })), "objectBoundingBox" === p ? (u /= t.width, f /= t.height) : (u += t.width / 2, f += t.height / 2), "path" === t.type && (u -= t.pathOffset.x, f -= t.pathOffset.y), h[4] -= u, h[5] -= f, s = 'id="SVGID_' + this.id + '" gradientUnits="' + p + '"', s += ' gradientTransform="' + (d ? i.additionalTransform + " " : "") + fabric.util.matrixToSVG(h) + '" ', "linear" === this.type ? o = ["<linearGradient ", s, ' x1="', a.x1, '" y1="', a.y1, '" x2="', a.x2, '" y2="', a.y2, '">\n'] : "radial" === this.type && (o = ["<radialGradient ", s, ' cx="', l ? a.x1 : a.x2, '" cy="', l ? a.y1 : a.y2, '" r="', l ? a.r1 : a.r2, '" fx="', l ? a.x2 : a.x1, '" fy="', l ? a.y2 : a.y1, '">\n']), "radial" === this.type) {
                if (l) for ((c = c.concat()).reverse(), n = 0, r = c.length; n < r; n++) c[n].offset = 1 - c[n].offset;
                var g = Math.min(a.r1, a.r2);
                if (0 < g) {
                    var v = g / Math.max(a.r1, a.r2);
                    for (n = 0, r = c.length; n < r; n++) c[n].offset += v * (1 - c[n].offset)
                }
            }
            for (n = 0, r = c.length; n < r; n++) {
                var m = c[n];
                o.push("<stop ", 'offset="', 100 * m.offset + "%", '" style="stop-color:', m.color, void 0 !== m.opacity ? ";stop-opacity: " + m.opacity : ";", '"/>\n')
            }
            return o.push("linear" === this.type ? "</linearGradient>\n" : "</radialGradient>\n"), o.join("")
        },
        toLive: function (t) {
            var e, i, n, r = fabric.util.object.clone(this.coords);
            if (this.type) {
                for ("linear" === this.type ? e = t.createLinearGradient(r.x1, r.y1, r.x2, r.y2) : "radial" === this.type && (e = t.createRadialGradient(r.x1, r.y1, r.r1, r.x2, r.y2, r.r2)), i = 0, n = this.colorStops.length; i < n; i++) {
                    var o = this.colorStops[i].color, s = this.colorStops[i].opacity, a = this.colorStops[i].offset;
                    void 0 !== s && (o = new fabric.Color(o).setAlpha(s).toRgba()), e.addColorStop(a, o)
                }
                return e
            }
        }
    }), fabric.util.object.extend(fabric.Gradient, {
        fromElement: function (e, n, r, o) {
            var s = parseFloat(r) / (/%$/.test(r) ? 100 : 1);
            s = s < 0 ? 0 : 1 < s ? 1 : s, isNaN(s) && (s = 1);
            var a, c, l, h, u, f, d = e.getElementsByTagName("stop"),
                p = "userSpaceOnUse" === e.getAttribute("gradientUnits") ? "pixels" : "percentage",
                g = e.getAttribute("gradientTransform") || "", v = [], m = 0, _ = 0;
            for ("linearGradient" === e.nodeName || "LINEARGRADIENT" === e.nodeName ? (a = "linear", c = {
                x1: (f = e).getAttribute("x1") || 0,
                y1: f.getAttribute("y1") || 0,
                x2: f.getAttribute("x2") || "100%",
                y2: f.getAttribute("y2") || 0
            }) : (a = "radial", c = {
                x1: (u = e).getAttribute("fx") || u.getAttribute("cx") || "50%",
                y1: u.getAttribute("fy") || u.getAttribute("cy") || "50%",
                r1: 0,
                x2: u.getAttribute("cx") || "50%",
                y2: u.getAttribute("cy") || "50%",
                r2: u.getAttribute("r") || "50%"
            }), l = d.length; l--;) v.push(t(d[l], s));
            return h = fabric.parseTransformAttribute(g), i(0, c, o, p), "pixels" === p && (m = -n.left, _ = -n.top), new fabric.Gradient({
                id: e.getAttribute("id"),
                type: a,
                coords: c,
                colorStops: v,
                gradientUnits: p,
                gradientTransform: h,
                offsetX: m,
                offsetY: _
            })
        }, forObject: function (t, e) {
            return e || (e = {}), i(0, e.coords, e.gradientUnits, {
                viewBoxWidth: 100,
                viewBoxHeight: 100
            }), new fabric.Gradient(e)
        }
    })
}(), function () {
    "use strict";
    var t = fabric.util.toFixed;
    fabric.Pattern = fabric.util.createClass({
        repeat: "repeat", offsetX: 0, offsetY: 0, crossOrigin: "", patternTransform: null, initialize: function (t, e) {
            if (t || (t = {}), this.id = fabric.Object.__uid++, this.setOptions(t), !t.source || t.source && "string" != typeof t.source) e && e(this); else if (void 0 !== fabric.util.getFunctionBody(t.source)) this.source = new Function(fabric.util.getFunctionBody(t.source)), e && e(this); else {
                var i = this;
                this.source = fabric.util.createImage(), fabric.util.loadImage(t.source, (function (t) {
                    i.source = t, e && e(i)
                }), null, this.crossOrigin)
            }
        }, toObject: function (e) {
            var i, n, r = fabric.Object.NUM_FRACTION_DIGITS;
            return "function" == typeof this.source ? i = String(this.source) : "string" == typeof this.source.src ? i = this.source.src : "object" == typeof this.source && this.source.toDataURL && (i = this.source.toDataURL()), n = {
                type: "pattern",
                source: i,
                repeat: this.repeat,
                crossOrigin: this.crossOrigin,
                offsetX: t(this.offsetX, r),
                offsetY: t(this.offsetY, r),
                patternTransform: this.patternTransform ? this.patternTransform.concat() : null
            }, fabric.util.populateWithProperties(this, n, e), n
        }, toSVG: function (t) {
            var e = "function" == typeof this.source ? this.source() : this.source, i = e.width / t.width,
                n = e.height / t.height, r = this.offsetX / t.width, o = this.offsetY / t.height, s = "";
            return "repeat-x" !== this.repeat && "no-repeat" !== this.repeat || (n = 1, o && (n += Math.abs(o))), "repeat-y" !== this.repeat && "no-repeat" !== this.repeat || (i = 1, r && (i += Math.abs(r))), e.src ? s = e.src : e.toDataURL && (s = e.toDataURL()), '<pattern id="SVGID_' + this.id + '" x="' + r + '" y="' + o + '" width="' + i + '" height="' + n + '">\n<image x="0" y="0" width="' + e.width + '" height="' + e.height + '" xlink:href="' + s + '"></image>\n</pattern>\n'
        }, setOptions: function (t) {
            for (var e in t) this[e] = t[e]
        }, toLive: function (t) {
            var e = "function" == typeof this.source ? this.source() : this.source;
            if (!e) return "";
            if (void 0 !== e.src) {
                if (!e.complete) return "";
                if (0 === e.naturalWidth || 0 === e.naturalHeight) return ""
            }
            return t.createPattern(e, this.repeat)
        }
    })
}(), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.toFixed;
    e.Shadow ? e.warn("fabric.Shadow is already defined.") : (e.Shadow = e.util.createClass({
        color: "rgb(0,0,0)",
        blur: 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: !1,
        includeDefaultValues: !0,
        nonScaling: !1,
        initialize: function (t) {
            for (var i in "string" == typeof t && (t = this._parseShadow(t)), t) this[i] = t[i];
            this.id = e.Object.__uid++
        },
        _parseShadow: function (t) {
            var i = t.trim(), n = e.Shadow.reOffsetsAndBlur.exec(i) || [];
            return {
                color: (i.replace(e.Shadow.reOffsetsAndBlur, "") || "rgb(0,0,0)").trim(),
                offsetX: parseInt(n[1], 10) || 0,
                offsetY: parseInt(n[2], 10) || 0,
                blur: parseInt(n[3], 10) || 0
            }
        },
        toString: function () {
            return [this.offsetX, this.offsetY, this.blur, this.color].join("px ")
        },
        toSVG: function (t) {
            var n = 40, r = 40, o = e.Object.NUM_FRACTION_DIGITS,
                s = e.util.rotateVector({x: this.offsetX, y: this.offsetY}, e.util.degreesToRadians(-t.angle)),
                a = new e.Color(this.color);
            return t.width && t.height && (n = 100 * i((Math.abs(s.x) + this.blur) / t.width, o) + 20, r = 100 * i((Math.abs(s.y) + this.blur) / t.height, o) + 20), t.flipX && (s.x *= -1), t.flipY && (s.y *= -1), '<filter id="SVGID_' + this.id + '" y="-' + r + '%" height="' + (100 + 2 * r) + '%" x="-' + n + '%" width="' + (100 + 2 * n) + '%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="' + i(this.blur ? this.blur / 2 : 0, o) + '"></feGaussianBlur>\n\t<feOffset dx="' + i(s.x, o) + '" dy="' + i(s.y, o) + '" result="oBlur" ></feOffset>\n\t<feFlood flood-color="' + a.toRgb() + '" flood-opacity="' + a.getAlpha() + '"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n'
        },
        toObject: function () {
            if (this.includeDefaultValues) return {
                color: this.color,
                blur: this.blur,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                affectStroke: this.affectStroke,
                nonScaling: this.nonScaling
            };
            var t = {}, i = e.Shadow.prototype;
            return ["color", "blur", "offsetX", "offsetY", "affectStroke", "nonScaling"].forEach((function (e) {
                this[e] !== i[e] && (t[e] = this[e])
            }), this), t
        }
    }), e.Shadow.reOffsetsAndBlur = /(?:\s|^)(-?\d+(?:px)?(?:\s?|$))?(-?\d+(?:px)?(?:\s?|$))?(\d+(?:px)?)?(?:\s?|$)(?:$|\s)/)
}("undefined" != typeof exports ? exports : this), function () {
    "use strict";
    if (fabric.StaticCanvas) fabric.warn("fabric.StaticCanvas is already defined."); else {
        var t = fabric.util.object.extend, e = fabric.util.getElementOffset, i = fabric.util.removeFromArray,
            n = fabric.util.toFixed, r = fabric.util.transformPoint, o = fabric.util.invertTransform,
            s = fabric.util.getNodeCanvas, a = fabric.util.createCanvasElement,
            c = new Error("Could not initialize `canvas` element");
        fabric.StaticCanvas = fabric.util.createClass(fabric.CommonMethods, {
            initialize: function (t, e) {
                e || (e = {}), this.renderAndResetBound = this.renderAndReset.bind(this), this.requestRenderAllBound = this.requestRenderAll.bind(this), this._initStatic(t, e)
            },
            backgroundColor: "",
            backgroundImage: null,
            overlayColor: "",
            overlayImage: null,
            includeDefaultValues: !0,
            stateful: !1,
            renderOnAddRemove: !0,
            clipTo: null,
            controlsAboveOverlay: !1,
            allowTouchScrolling: !1,
            imageSmoothingEnabled: !0,
            viewportTransform: fabric.iMatrix.concat(),
            backgroundVpt: !0,
            overlayVpt: !0,
            onBeforeScaleRotate: function () {
            },
            enableRetinaScaling: !0,
            vptCoords: {},
            skipOffscreen: !0,
            clipPath: void 0,
            _initStatic: function (t, e) {
                var i = this.requestRenderAllBound;
                this._objects = [], this._createLowerCanvas(t), this._initOptions(e), this._setImageSmoothing(), this.interactive || this._initRetinaScaling(), e.overlayImage && this.setOverlayImage(e.overlayImage, i), e.backgroundImage && this.setBackgroundImage(e.backgroundImage, i), e.backgroundColor && this.setBackgroundColor(e.backgroundColor, i), e.overlayColor && this.setOverlayColor(e.overlayColor, i), this.calcOffset()
            },
            _isRetinaScaling: function () {
                return 1 !== fabric.devicePixelRatio && this.enableRetinaScaling
            },
            getRetinaScaling: function () {
                return this._isRetinaScaling() ? fabric.devicePixelRatio : 1
            },
            _initRetinaScaling: function () {
                this._isRetinaScaling() && (this.lowerCanvasEl.setAttribute("width", this.width * fabric.devicePixelRatio), this.lowerCanvasEl.setAttribute("height", this.height * fabric.devicePixelRatio), this.contextContainer.scale(fabric.devicePixelRatio, fabric.devicePixelRatio))
            },
            calcOffset: function () {
                return this._offset = e(this.lowerCanvasEl), this
            },
            setOverlayImage: function (t, e, i) {
                return this.__setBgOverlayImage("overlayImage", t, e, i)
            },
            setBackgroundImage: function (t, e, i) {
                return this.__setBgOverlayImage("backgroundImage", t, e, i)
            },
            setOverlayColor: function (t, e) {
                return this.__setBgOverlayColor("overlayColor", t, e)
            },
            setBackgroundColor: function (t, e) {
                return this.__setBgOverlayColor("backgroundColor", t, e)
            },
            _setImageSmoothing: function () {
                var t = this.getContext();
                t.imageSmoothingEnabled = t.imageSmoothingEnabled || t.webkitImageSmoothingEnabled || t.mozImageSmoothingEnabled || t.msImageSmoothingEnabled || t.oImageSmoothingEnabled, t.imageSmoothingEnabled = this.imageSmoothingEnabled
            },
            __setBgOverlayImage: function (t, e, i, n) {
                return "string" == typeof e ? fabric.util.loadImage(e, (function (e) {
                    if (e) {
                        var r = new fabric.Image(e, n);
                        (this[t] = r).canvas = this
                    }
                    i && i(e)
                }), this, n && n.crossOrigin) : (n && e.setOptions(n), (this[t] = e) && (e.canvas = this), i && i(e)), this
            },
            __setBgOverlayColor: function (t, e, i) {
                return this[t] = e, this._initGradient(e, t), this._initPattern(e, t, i), this
            },
            _createCanvasElement: function () {
                var t = a();
                if (!t) throw c;
                if (t.style || (t.style = {}), void 0 === t.getContext) throw c;
                return t
            },
            _initOptions: function (t) {
                var e = this.lowerCanvasEl;
                this._setOptions(t), this.width = this.width || parseInt(e.width, 10) || 0, this.height = this.height || parseInt(e.height, 10) || 0, this.lowerCanvasEl.style && (e.width = this.width, e.height = this.height, e.style.width = this.width + "px", e.style.height = this.height + "px", this.viewportTransform = this.viewportTransform.slice())
            },
            _createLowerCanvas: function (t) {
                t && t.getContext ? this.lowerCanvasEl = t : this.lowerCanvasEl = fabric.util.getById(t) || this._createCanvasElement(), fabric.util.addClass(this.lowerCanvasEl, "lower-canvas"), this.interactive && this._applyCanvasStyle(this.lowerCanvasEl), this.contextContainer = this.lowerCanvasEl.getContext("2d")
            },
            getWidth: function () {
                return this.width
            },
            getHeight: function () {
                return this.height
            },
            setWidth: function (t, e) {
                return this.setDimensions({width: t}, e)
            },
            setHeight: function (t, e) {
                return this.setDimensions({height: t}, e)
            },
            setDimensions: function (t, e) {
                var i;
                for (var n in e = e || {}, t) i = t[n], e.cssOnly || (this._setBackstoreDimension(n, t[n]), i += "px", this.hasLostContext = !0), e.backstoreOnly || this._setCssDimension(n, i);
                return this._isCurrentlyDrawing && this.freeDrawingBrush && this.freeDrawingBrush._setBrushStyles(), this._initRetinaScaling(), this._setImageSmoothing(), this.calcOffset(), e.cssOnly || this.requestRenderAll(), this
            },
            _setBackstoreDimension: function (t, e) {
                return this.lowerCanvasEl[t] = e, this.upperCanvasEl && (this.upperCanvasEl[t] = e), this.cacheCanvasEl && (this.cacheCanvasEl[t] = e), this[t] = e, this
            },
            _setCssDimension: function (t, e) {
                return this.lowerCanvasEl.style[t] = e, this.upperCanvasEl && (this.upperCanvasEl.style[t] = e), this.wrapperEl && (this.wrapperEl.style[t] = e), this
            },
            getZoom: function () {
                return this.viewportTransform[0]
            },
            setViewportTransform: function (t) {
                var e, i, n, r = this._activeObject;
                for (this.viewportTransform = t, i = 0, n = this._objects.length; i < n; i++) (e = this._objects[i]).group || e.setCoords(!1, !0);
                return r && "activeSelection" === r.type && r.setCoords(!1, !0), this.calcViewportBoundaries(), this.renderOnAddRemove && this.requestRenderAll(), this
            },
            zoomToPoint: function (t, e) {
                var i = t, n = this.viewportTransform.slice(0);
                t = r(t, o(this.viewportTransform)), n[0] = e, n[3] = e;
                var s = r(t, n);
                return n[4] += i.x - s.x, n[5] += i.y - s.y, this.setViewportTransform(n)
            },
            setZoom: function (t) {
                return this.zoomToPoint(new fabric.Point(0, 0), t), this
            },
            absolutePan: function (t) {
                var e = this.viewportTransform.slice(0);
                return e[4] = -t.x, e[5] = -t.y, this.setViewportTransform(e)
            },
            relativePan: function (t) {
                return this.absolutePan(new fabric.Point(-t.x - this.viewportTransform[4], -t.y - this.viewportTransform[5]))
            },
            getElement: function () {
                return this.lowerCanvasEl
            },
            _onObjectAdded: function (t) {
                this.stateful && t.setupState(), t._set("canvas", this), t.setCoords(), this.fire("object:added", {target: t}), t.fire("added")
            },
            _onObjectRemoved: function (t) {
                this.fire("object:removed", {target: t}), t.fire("removed"), delete t.canvas
            },
            clearContext: function (t) {
                return t.clearRect(0, 0, this.width, this.height), this
            },
            getContext: function () {
                return this.contextContainer
            },
            clear: function () {
                return this._objects.length = 0, this.backgroundImage = null, this.overlayImage = null, this.backgroundColor = "", this.overlayColor = "", this._hasITextHandlers && (this.off("mouse:up", this._mouseUpITextHandler), this._iTextInstances = null, this._hasITextHandlers = !1), this.clearContext(this.contextContainer), this.fire("canvas:cleared"), this.renderOnAddRemove && this.requestRenderAll(), this
            },
            renderAll: function () {
                var t = this.contextContainer;
                return this.renderCanvas(t, this._objects), this
            },
            renderAndReset: function () {
                this.isRendering = 0, this.renderAll()
            },
            requestRenderAll: function () {
                return this.isRendering || (this.isRendering = fabric.util.requestAnimFrame(this.renderAndResetBound)), this
            },
            calcViewportBoundaries: function () {
                var t = {}, e = this.width, i = this.height, n = o(this.viewportTransform);
                return t.tl = r({x: 0, y: 0}, n), t.br = r({
                    x: e,
                    y: i
                }, n), t.tr = new fabric.Point(t.br.x, t.tl.y), t.bl = new fabric.Point(t.tl.x, t.br.y), this.vptCoords = t
            },
            cancelRequestedRender: function () {
                this.isRendering && (fabric.util.cancelAnimFrame(this.isRendering), this.isRendering = 0)
            },
            renderCanvas: function (t, e) {
                var i = this.viewportTransform, n = this.clipPath;
                this.cancelRequestedRender(), this.calcViewportBoundaries(), this.clearContext(t), this.fire("before:render", {ctx: t}), this.clipTo && fabric.util.clipContext(this, t), this._renderBackground(t), t.save(), t.transform(i[0], i[1], i[2], i[3], i[4], i[5]), this._renderObjects(t, e), t.restore(), !this.controlsAboveOverlay && this.interactive && this.drawControls(t), this.clipTo && t.restore(), n && (n.canvas = this, n.shouldCache(), n._transformDone = !0, n.renderCache({forClipping: !0}), this.drawClipPathOnCanvas(t)), this._renderOverlay(t), this.controlsAboveOverlay && this.interactive && this.drawControls(t), this.fire("after:render", {ctx: t})
            },
            drawClipPathOnCanvas: function (t) {
                var e = this.viewportTransform, i = this.clipPath;
                t.save(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5]), t.globalCompositeOperation = "destination-in", i.transform(t), t.scale(1 / i.zoomX, 1 / i.zoomY), t.drawImage(i._cacheCanvas, -i.cacheTranslationX, -i.cacheTranslationY), t.restore()
            },
            _renderObjects: function (t, e) {
                var i, n;
                for (i = 0, n = e.length; i < n; ++i) e[i] && e[i].render(t)
            },
            _renderBackgroundOrOverlay: function (t, e) {
                var i = this[e + "Color"], n = this[e + "Image"], r = this.viewportTransform, o = this[e + "Vpt"];
                if (i || n) {
                    if (i) {
                        t.save(), t.beginPath(), t.moveTo(0, 0), t.lineTo(this.width, 0), t.lineTo(this.width, this.height), t.lineTo(0, this.height), t.closePath(), t.fillStyle = i.toLive ? i.toLive(t, this) : i, o && t.transform(r[0], r[1], r[2], r[3], r[4] + (i.offsetX || 0), r[5] + (i.offsetY || 0));
                        var s = i.gradientTransform || i.patternTransform;
                        s && t.transform(s[0], s[1], s[2], s[3], s[4], s[5]), t.fill(), t.restore()
                    }
                    n && (t.save(), o && t.transform(r[0], r[1], r[2], r[3], r[4], r[5]), n.render(t), t.restore())
                }
            },
            _renderBackground: function (t) {
                this._renderBackgroundOrOverlay(t, "background")
            },
            _renderOverlay: function (t) {
                this._renderBackgroundOrOverlay(t, "overlay")
            },
            getCenter: function () {
                return {top: this.height / 2, left: this.width / 2}
            },
            centerObjectH: function (t) {
                return this._centerObject(t, new fabric.Point(this.getCenter().left, t.getCenterPoint().y))
            },
            centerObjectV: function (t) {
                return this._centerObject(t, new fabric.Point(t.getCenterPoint().x, this.getCenter().top))
            },
            centerObject: function (t) {
                var e = this.getCenter();
                return this._centerObject(t, new fabric.Point(e.left, e.top))
            },
            viewportCenterObject: function (t) {
                var e = this.getVpCenter();
                return this._centerObject(t, e)
            },
            viewportCenterObjectH: function (t) {
                var e = this.getVpCenter();
                return this._centerObject(t, new fabric.Point(e.x, t.getCenterPoint().y)), this
            },
            viewportCenterObjectV: function (t) {
                var e = this.getVpCenter();
                return this._centerObject(t, new fabric.Point(t.getCenterPoint().x, e.y))
            },
            getVpCenter: function () {
                var t = this.getCenter(), e = o(this.viewportTransform);
                return r({x: t.left, y: t.top}, e)
            },
            _centerObject: function (t, e) {
                return t.setPositionByOrigin(e, "center", "center"), t.setCoords(), this.renderOnAddRemove && this.requestRenderAll(), this
            },
            toDatalessJSON: function (t) {
                return this.toDatalessObject(t)
            },
            toObject: function (t) {
                return this._toObjectMethod("toObject", t)
            },
            toDatalessObject: function (t) {
                return this._toObjectMethod("toDatalessObject", t)
            },
            _toObjectMethod: function (e, i) {
                var n = this.clipPath, r = {version: fabric.version, objects: this._toObjects(e, i)};
                return n && (r.clipPath = this._toObject(this.clipPath, e, i)), t(r, this.__serializeBgOverlay(e, i)), fabric.util.populateWithProperties(this, r, i), r
            },
            _toObjects: function (t, e) {
                return this._objects.filter((function (t) {
                    return !t.excludeFromExport
                })).map((function (i) {
                    return this._toObject(i, t, e)
                }), this)
            },
            _toObject: function (t, e, i) {
                var n;
                this.includeDefaultValues || (n = t.includeDefaultValues, t.includeDefaultValues = !1);
                var r = t[e](i);
                return this.includeDefaultValues || (t.includeDefaultValues = n), r
            },
            __serializeBgOverlay: function (t, e) {
                var i = {}, n = this.backgroundImage, r = this.overlayImage;
                return this.backgroundColor && (i.background = this.backgroundColor.toObject ? this.backgroundColor.toObject(e) : this.backgroundColor), this.overlayColor && (i.overlay = this.overlayColor.toObject ? this.overlayColor.toObject(e) : this.overlayColor), n && !n.excludeFromExport && (i.backgroundImage = this._toObject(n, t, e)), r && !r.excludeFromExport && (i.overlayImage = this._toObject(r, t, e)), i
            },
            svgViewportTransformation: !0,
            toSVG: function (t, e) {
                t || (t = {}), t.reviver = e;
                var i = [];
                return this._setSVGPreamble(i, t), this._setSVGHeader(i, t), this.clipPath && i.push('<g clip-path="url(#' + this.clipPath.clipPathId + ')" >\n'), this._setSVGBgOverlayColor(i, "background"), this._setSVGBgOverlayImage(i, "backgroundImage", e), this._setSVGObjects(i, e), this.clipPath && i.push("</g>\n"), this._setSVGBgOverlayColor(i, "overlay"), this._setSVGBgOverlayImage(i, "overlayImage", e), i.push("</svg>"), i.join("")
            },
            _setSVGPreamble: function (t, e) {
                e.suppressPreamble || t.push('<?xml version="1.0" encoding="', e.encoding || "UTF-8", '" standalone="no" ?>\n', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ', '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n')
            },
            _setSVGHeader: function (t, e) {
                var i, r = e.width || this.width, o = e.height || this.height,
                    s = 'viewBox="0 0 ' + this.width + " " + this.height + '" ', a = fabric.Object.NUM_FRACTION_DIGITS;
                e.viewBox ? s = 'viewBox="' + e.viewBox.x + " " + e.viewBox.y + " " + e.viewBox.width + " " + e.viewBox.height + '" ' : this.svgViewportTransformation && (i = this.viewportTransform, s = 'viewBox="' + n(-i[4] / i[0], a) + " " + n(-i[5] / i[3], a) + " " + n(this.width / i[0], a) + " " + n(this.height / i[3], a) + '" '), t.push("<svg ", 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', r, '" ', 'height="', o, '" ', s, 'xml:space="preserve">\n', "<desc>Created with Plasfy Editor</desc>\n", "<defs>\n", this.createSVGFontFacesMarkup(), this.createSVGRefElementsMarkup(), this.createSVGClipPathMarkup(e), "</defs>\n")
            },
            createSVGClipPathMarkup: function (t) {
                var e = this.clipPath;
                return e ? (e.clipPathId = "CLIPPATH_" + fabric.Object.__uid++, '<clipPath id="' + e.clipPathId + '" >\n' + this.clipPath.toClipPathSVG(t.reviver) + "</clipPath>\n") : ""
            },
            createSVGRefElementsMarkup: function () {
                var t = this;
                return ["background", "overlay"].map((function (e) {
                    var i = t[e + "Color"];
                    if (i && i.toLive) {
                        var n = t[e + "Vpt"], r = t.viewportTransform,
                            o = {width: t.width / (n ? r[0] : 1), height: t.height / (n ? r[3] : 1)};
                        return i.toSVG(o, {additionalTransform: n ? fabric.util.matrixToSVG(r) : ""})
                    }
                })).join("")
            },
            createSVGFontFacesMarkup: function () {
                var t, e, i, n, r, o, s, a, c = "", l = {}, h = fabric.fontPaths, u = this._objects;
                for (s = 0, a = u.length; s < a; s++) if (e = (t = u[s]).fontFamily, -1 !== t.type.indexOf("text") && !l[e] && h[e] && (l[e] = !0, t.styles)) for (r in i = t.styles) for (o in n = i[r]) !l[e = n[o].fontFamily] && h[e] && (l[e] = !0);
                for (var f in l) c += ["\t\t@font-face {\n", "\t\t\tfont-family: '", f, "';\n", "\t\t\tsrc: url('", h[f], "');\n", "\t\t}\n"].join("");
                return c && (c = ['\t<style type="text/css">', "<![CDATA[\n", c, "]]>", "</style>\n"].join("")), c
            },
            _setSVGObjects: function (t, e) {
                var i, n, r, o = this._objects;
                for (n = 0, r = o.length; n < r; n++) (i = o[n]).excludeFromExport || this._setSVGObject(t, i, e)
            },
            _setSVGObject: function (t, e, i) {
                t.push(e.toSVG(i))
            },
            _setSVGBgOverlayImage: function (t, e, i) {
                this[e] && !this[e].excludeFromExport && this[e].toSVG && t.push(this[e].toSVG(i))
            },
            _setSVGBgOverlayColor: function (t, e) {
                var i = this[e + "Color"], n = this.viewportTransform, r = this.width, o = this.height;
                if (i) if (i.toLive) {
                    var s = i.repeat, a = fabric.util.invertTransform(n),
                        c = this[e + "Vpt"] ? fabric.util.matrixToSVG(a) : "";
                    t.push('<rect transform="' + c + " translate(", r / 2, ",", o / 2, ')"', ' x="', i.offsetX - r / 2, '" y="', i.offsetY - o / 2, '" ', 'width="', "repeat-y" === s || "no-repeat" === s ? i.source.width : r, '" height="', "repeat-x" === s || "no-repeat" === s ? i.source.height : o, '" fill="url(#SVGID_' + i.id + ')"', "></rect>\n")
                } else t.push('<rect x="0" y="0" width="' + r + '" height="' + o + '" ', 'fill="', i, '"', "></rect>\n")
            },
            sendToBack: function (t) {
                if (!t) return this;
                var e, n, r, o = this._activeObject;
                if (t === o && "activeSelection" === t.type) for (e = (r = o._objects).length; e--;) n = r[e], i(this._objects, n), this._objects.unshift(n); else i(this._objects, t), this._objects.unshift(t);
                return this.renderOnAddRemove && this.requestRenderAll(), this
            },
            bringToFront: function (t) {
                if (!t) return this;
                var e, n, r, o = this._activeObject;
                if (t === o && "activeSelection" === t.type) for (r = o._objects, e = 0; e < r.length; e++) n = r[e], i(this._objects, n), this._objects.push(n); else i(this._objects, t), this._objects.push(t);
                return this.renderOnAddRemove && this.requestRenderAll(), this
            },
            sendBackwards: function (t, e) {
                if (!t) return this;
                var n, r, o, s, a, c = this._activeObject, l = 0;
                if (t === c && "activeSelection" === t.type) for (a = c._objects, n = 0; n < a.length; n++) r = a[n], 0 + l < (o = this._objects.indexOf(r)) && (s = o - 1, i(this._objects, r), this._objects.splice(s, 0, r)), l++; else 0 !== (o = this._objects.indexOf(t)) && (s = this._findNewLowerIndex(t, o, e), i(this._objects, t), this._objects.splice(s, 0, t));
                return this.renderOnAddRemove && this.requestRenderAll(), this
            },
            _findNewLowerIndex: function (t, e, i) {
                var n, r;
                if (i) {
                    for (r = (n = e) - 1; 0 <= r; --r) if (t.intersectsWithObject(this._objects[r]) || t.isContainedWithinObject(this._objects[r]) || this._objects[r].isContainedWithinObject(t)) {
                        n = r;
                        break
                    }
                } else n = e - 1;
                return n
            },
            bringForward: function (t, e) {
                if (!t) return this;
                var n, r, o, s, a, c = this._activeObject, l = 0;
                if (t === c && "activeSelection" === t.type) for (n = (a = c._objects).length; n--;) r = a[n], (o = this._objects.indexOf(r)) < this._objects.length - 1 - l && (s = o + 1, i(this._objects, r), this._objects.splice(s, 0, r)), l++; else (o = this._objects.indexOf(t)) !== this._objects.length - 1 && (s = this._findNewUpperIndex(t, o, e), i(this._objects, t), this._objects.splice(s, 0, t));
                return this.renderOnAddRemove && this.requestRenderAll(), this
            },
            _findNewUpperIndex: function (t, e, i) {
                var n, r, o;
                if (i) {
                    for (r = (n = e) + 1, o = this._objects.length; r < o; ++r) if (t.intersectsWithObject(this._objects[r]) || t.isContainedWithinObject(this._objects[r]) || this._objects[r].isContainedWithinObject(t)) {
                        n = r;
                        break
                    }
                } else n = e + 1;
                return n
            },
            moveTo: function (t, e) {
                return i(this._objects, t), this._objects.splice(e, 0, t), this.renderOnAddRemove && this.requestRenderAll()
            },
            dispose: function () {
                return this.isRendering && (fabric.util.cancelAnimFrame(this.isRendering), this.isRendering = 0), this.forEachObject((function (t) {
                    t.dispose && t.dispose()
                })), this._objects = [], this.backgroundImage && this.backgroundImage.dispose && this.backgroundImage.dispose(), this.backgroundImage = null, this.overlayImage && this.overlayImage.dispose && this.overlayImage.dispose(), this.overlayImage = null, this._iTextInstances = null, this.contextContainer = null, fabric.util.cleanUpJsdomNode(this.lowerCanvasEl), this.lowerCanvasEl = void 0, this
            },
            toString: function () {
                return "#<fabric.Canvas (" + this.complexity() + "): { objects: " + this._objects.length + " }>"
            }
        }), t(fabric.StaticCanvas.prototype, fabric.Observable), t(fabric.StaticCanvas.prototype, fabric.Collection), t(fabric.StaticCanvas.prototype, fabric.DataURLExporter), t(fabric.StaticCanvas, {
            EMPTY_JSON: '{"objects": [], "background": "white"}',
            supports: function (t) {
                var e = a();
                if (!e || !e.getContext) return null;
                var i = e.getContext("2d");
                return i && "setLineDash" === t ? void 0 !== i.setLineDash : null
            }
        }), fabric.StaticCanvas.prototype.toJSON = fabric.StaticCanvas.prototype.toObject, fabric.isLikelyNode && (fabric.StaticCanvas.prototype.createPNGStream = function () {
            var t = s(this.lowerCanvasEl);
            return t && t.createPNGStream()
        }, fabric.StaticCanvas.prototype.createJPEGStream = function (t) {
            var e = s(this.lowerCanvasEl);
            return e && e.createJPEGStream(t)
        })
    }
}(), fabric.BaseBrush = fabric.util.createClass({
    color: "rgb(0, 0, 0)",
    width: 1,
    shadow: null,
    strokeLineCap: "round",
    strokeLineJoin: "round",
    strokeMiterLimit: 10,
    strokeDashArray: null,
    setShadow: function (t) {
        return this.shadow = new fabric.Shadow(t), this
    },
    _setBrushStyles: function () {
        var t = this.canvas.contextTop;
        t.strokeStyle = this.color, t.lineWidth = this.width, t.lineCap = this.strokeLineCap, t.miterLimit = this.strokeMiterLimit, t.lineJoin = this.strokeLineJoin, fabric.StaticCanvas.supports("setLineDash") && t.setLineDash(this.strokeDashArray || [])
    },
    _saveAndTransform: function (t) {
        var e = this.canvas.viewportTransform;
        t.save(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5])
    },
    _setShadow: function () {
        if (this.shadow) {
            var t = this.canvas.contextTop, e = this.canvas.getZoom();
            t.shadowColor = this.shadow.color, t.shadowBlur = this.shadow.blur * e, t.shadowOffsetX = this.shadow.offsetX * e, t.shadowOffsetY = this.shadow.offsetY * e
        }
    },
    needsFullRender: function () {
        return new fabric.Color(this.color).getAlpha() < 1 || !!this.shadow
    },
    _resetShadow: function () {
        var t = this.canvas.contextTop;
        t.shadowColor = "", t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0
    }
}), fabric.PencilBrush = fabric.util.createClass(fabric.BaseBrush, {
    decimate: .4, initialize: function (t) {
        this.canvas = t, this._points = []
    }, _drawSegment: function (t, e, i) {
        var n = e.midPointFrom(i);
        return t.quadraticCurveTo(e.x, e.y, n.x, n.y), n
    }, onMouseDown: function (t, e) {
        this.canvas._isMainEvent(e.e) && (this._prepareForDrawing(t), this._captureDrawingPath(t), this._render())
    }, onMouseMove: function (t, e) {
        if (this.canvas._isMainEvent(e.e) && this._captureDrawingPath(t) && 1 < this._points.length) if (this.needsFullRender()) this.canvas.clearContext(this.canvas.contextTop), this._render(); else {
            var i = this._points, n = i.length, r = this.canvas.contextTop;
            this._saveAndTransform(r), this.oldEnd && (r.beginPath(), r.moveTo(this.oldEnd.x, this.oldEnd.y)), this.oldEnd = this._drawSegment(r, i[n - 2], i[n - 1], !0), r.stroke(), r.restore()
        }
    }, onMouseUp: function (t) {
        return !this.canvas._isMainEvent(t.e) || (this.oldEnd = void 0, this._finalizeAndAddPath(), !1)
    }, _prepareForDrawing: function (t) {
        var e = new fabric.Point(t.x, t.y);
        this._reset(), this._addPoint(e), this.canvas.contextTop.moveTo(e.x, e.y)
    }, _addPoint: function (t) {
        return !(1 < this._points.length && t.eq(this._points[this._points.length - 1]) || (this._points.push(t), 0))
    }, _reset: function () {
        this._points = [], this._setBrushStyles(), this._setShadow()
    }, _captureDrawingPath: function (t) {
        var e = new fabric.Point(t.x, t.y);
        return this._addPoint(e)
    }, _render: function () {
        var t, e, i = this.canvas.contextTop, n = this._points[0], r = this._points[1];
        if (this._saveAndTransform(i), i.beginPath(), 2 === this._points.length && n.x === r.x && n.y === r.y) {
            var o = this.width / 1e3;
            n = new fabric.Point(n.x, n.y), r = new fabric.Point(r.x, r.y), n.x -= o, r.x += o
        }
        for (i.moveTo(n.x, n.y), t = 1, e = this._points.length; t < e; t++) this._drawSegment(i, n, r), n = this._points[t], r = this._points[t + 1];
        i.lineTo(n.x, n.y), i.stroke(), i.restore()
    }, convertPointsToSVGPath: function (t) {
        var e, i = [], n = this.width / 1e3, r = new fabric.Point(t[0].x, t[0].y), o = new fabric.Point(t[1].x, t[1].y),
            s = t.length, a = 1, c = 0, l = 2 < s;
        for (l && (a = t[2].x < o.x ? -1 : t[2].x === o.x ? 0 : 1, c = t[2].y < o.y ? -1 : t[2].y === o.y ? 0 : 1), i.push("M ", r.x - a * n, " ", r.y - c * n, " "), e = 1; e < s; e++) {
            if (!r.eq(o)) {
                var h = r.midPointFrom(o);
                i.push("Q ", r.x, " ", r.y, " ", h.x, " ", h.y, " ")
            }
            r = t[e], e + 1 < t.length && (o = t[e + 1])
        }
        return l && (a = r.x > t[e - 2].x ? 1 : r.x === t[e - 2].x ? 0 : -1, c = r.y > t[e - 2].y ? 1 : r.y === t[e - 2].y ? 0 : -1), i.push("L ", r.x + a * n, " ", r.y + c * n), i
    }, createPath: function (t) {
        var e = new fabric.Path(t, {
            fill: null,
            stroke: this.color,
            strokeWidth: this.width,
            strokeLineCap: this.strokeLineCap,
            strokeMiterLimit: this.strokeMiterLimit,
            strokeLineJoin: this.strokeLineJoin,
            strokeDashArray: this.strokeDashArray
        });
        return this.shadow && (this.shadow.affectStroke = !0, e.setShadow(this.shadow)), e
    }, decimatePoints: function (t, e) {
        if (t.length <= 2) return t;
        var i, n = this.canvas.getZoom(), r = Math.pow(e / n, 2), o = t.length - 1, s = t[0], a = [s];
        for (i = 1; i < o; i++) r <= Math.pow(s.x - t[i].x, 2) + Math.pow(s.y - t[i].y, 2) && (s = t[i], a.push(s));
        return 1 === a.length && a.push(new fabric.Point(a[0].x, a[0].y)), a
    }, _finalizeAndAddPath: function () {
        this.canvas.contextTop.closePath(), this.decimate && (this._points = this.decimatePoints(this._points, this.decimate));
        var t = this.convertPointsToSVGPath(this._points).join("");
        if ("M 0 0 Q 0 0 0 0 L 0 0" !== t) {
            var e = this.createPath(t);
            this.canvas.clearContext(this.canvas.contextTop), this.canvas.add(e), this.canvas.renderAll(), e.setCoords(), this._resetShadow(), this.canvas.fire("path:created", {path: e})
        } else this.canvas.requestRenderAll()
    }
}), fabric.CircleBrush = fabric.util.createClass(fabric.BaseBrush, {
    width: 10, initialize: function (t) {
        this.canvas = t, this.points = []
    }, drawDot: function (t) {
        var e = this.addPoint(t), i = this.canvas.contextTop;
        this._saveAndTransform(i), this.dot(i, e), i.restore()
    }, dot: function (t, e) {
        t.fillStyle = e.fill, t.beginPath(), t.arc(e.x, e.y, e.radius, 0, 2 * Math.PI, !1), t.closePath(), t.fill()
    }, onMouseDown: function (t) {
        this.points.length = 0, this.canvas.clearContext(this.canvas.contextTop), this._setShadow(), this.drawDot(t)
    }, _render: function () {
        var t, e, i = this.canvas.contextTop, n = this.points;
        for (this._saveAndTransform(i), t = 0, e = n.length; t < e; t++) this.dot(i, n[t]);
        i.restore()
    }, onMouseMove: function (t) {
        this.needsFullRender() ? (this.canvas.clearContext(this.canvas.contextTop), this.addPoint(t), this._render()) : this.drawDot(t)
    }, onMouseUp: function () {
        var t, e, i = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = !1;
        var n = [];
        for (t = 0, e = this.points.length; t < e; t++) {
            var r = this.points[t], o = new fabric.Circle({
                radius: r.radius,
                left: r.x,
                top: r.y,
                originX: "center",
                originY: "center",
                fill: r.fill
            });
            this.shadow && o.setShadow(this.shadow), n.push(o)
        }
        var s = new fabric.Group(n);
        s.canvas = this.canvas, this.canvas.add(s), this.canvas.fire("path:created", {path: s}), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderOnAddRemove = i, this.canvas.requestRenderAll()
    }, addPoint: function (t) {
        var e = new fabric.Point(t.x, t.y),
            i = fabric.util.getRandomInt(Math.max(0, this.width - 20), this.width + 20) / 2,
            n = new fabric.Color(this.color).setAlpha(fabric.util.getRandomInt(0, 100) / 100).toRgba();
        return e.radius = i, e.fill = n, this.points.push(e), e
    }
}), fabric.SprayBrush = fabric.util.createClass(fabric.BaseBrush, {
    width: 10,
    density: 20,
    dotWidth: 1,
    dotWidthVariance: 1,
    randomOpacity: !1,
    optimizeOverlapping: !0,
    initialize: function (t) {
        this.canvas = t, this.sprayChunks = []
    },
    onMouseDown: function (t) {
        this.sprayChunks.length = 0, this.canvas.clearContext(this.canvas.contextTop), this._setShadow(), this.addSprayChunk(t), this.render(this.sprayChunkPoints)
    },
    onMouseMove: function (t) {
        this.addSprayChunk(t), this.render(this.sprayChunkPoints)
    },
    onMouseUp: function () {
        var t = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = !1;
        for (var e = [], i = 0, n = this.sprayChunks.length; i < n; i++) for (var r = this.sprayChunks[i], o = 0, s = r.length; o < s; o++) {
            var a = new fabric.Rect({
                width: r[o].width,
                height: r[o].width,
                left: r[o].x + 1,
                top: r[o].y + 1,
                originX: "center",
                originY: "center",
                fill: this.color
            });
            e.push(a)
        }
        this.optimizeOverlapping && (e = this._getOptimizedRects(e));
        var c = new fabric.Group(e);
        this.shadow && c.setShadow(this.shadow), this.canvas.add(c), this.canvas.fire("path:created", {path: c}), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderOnAddRemove = t, this.canvas.requestRenderAll()
    },
    _getOptimizedRects: function (t) {
        var e, i, n, r = {};
        for (i = 0, n = t.length; i < n; i++) r[e = t[i].left + "" + t[i].top] || (r[e] = t[i]);
        var o = [];
        for (e in r) o.push(r[e]);
        return o
    },
    render: function (t) {
        var e, i, n = this.canvas.contextTop;
        for (n.fillStyle = this.color, this._saveAndTransform(n), e = 0, i = t.length; e < i; e++) {
            var r = t[e];
            void 0 !== r.opacity && (n.globalAlpha = r.opacity), n.fillRect(r.x, r.y, r.width, r.width)
        }
        n.restore()
    },
    _render: function () {
        var t, e, i = this.canvas.contextTop;
        for (i.fillStyle = this.color, this._saveAndTransform(i), t = 0, e = this.sprayChunks.length; t < e; t++) this.render(this.sprayChunks[t]);
        i.restore()
    },
    addSprayChunk: function (t) {
        this.sprayChunkPoints = [];
        var e, i, n, r, o = this.width / 2;
        for (r = 0; r < this.density; r++) {
            e = fabric.util.getRandomInt(t.x - o, t.x + o), i = fabric.util.getRandomInt(t.y - o, t.y + o), n = this.dotWidthVariance ? fabric.util.getRandomInt(Math.max(1, this.dotWidth - this.dotWidthVariance), this.dotWidth + this.dotWidthVariance) : this.dotWidth;
            var s = new fabric.Point(e, i);
            s.width = n, this.randomOpacity && (s.opacity = fabric.util.getRandomInt(0, 100) / 100), this.sprayChunkPoints.push(s)
        }
        this.sprayChunks.push(this.sprayChunkPoints)
    }
}), fabric.PatternBrush = fabric.util.createClass(fabric.PencilBrush, {
    getPatternSrc: function () {
        var t = fabric.util.createCanvasElement(), e = t.getContext("2d");
        return t.width = t.height = 25, e.fillStyle = this.color, e.beginPath(), e.arc(10, 10, 10, 0, 2 * Math.PI, !1), e.closePath(), e.fill(), t
    }, getPatternSrcFunction: function () {
        return String(this.getPatternSrc).replace("this.color", '"' + this.color + '"')
    }, getPattern: function () {
        return this.canvas.contextTop.createPattern(this.source || this.getPatternSrc(), "repeat")
    }, _setBrushStyles: function () {
        this.callSuper("_setBrushStyles"), this.canvas.contextTop.strokeStyle = this.getPattern()
    }, createPath: function (t) {
        var e = this.callSuper("createPath", t), i = e._getLeftTopCoords().scalarAdd(e.strokeWidth / 2);
        return e.stroke = new fabric.Pattern({
            source: this.source || this.getPatternSrcFunction(),
            offsetX: -i.x,
            offsetY: -i.y
        }), e
    }
}), function () {
    var t = fabric.util.getPointer, e = fabric.util.degreesToRadians, i = fabric.util.radiansToDegrees, n = Math.atan2,
        r = Math.abs, o = fabric.StaticCanvas.supports("setLineDash");
    for (var s in fabric.Canvas = fabric.util.createClass(fabric.StaticCanvas, {
        initialize: function (t, e) {
            e || (e = {}), this.renderAndResetBound = this.renderAndReset.bind(this), this.requestRenderAllBound = this.requestRenderAll.bind(this), this._initStatic(t, e), this._initInteractive(), this._createCacheCanvas()
        },
        uniScaleTransform: !1,
        uniScaleKey: "shiftKey",
        centeredScaling: !1,
        centeredRotation: !1,
        centeredKey: "altKey",
        altActionKey: "shiftKey",
        interactive: !0,
        selection: !0,
        selectionKey: "shiftKey",
        altSelectionKey: null,
        selectionColor: "rgba(100, 100, 255, 0.3)",
        selectionDashArray: [],
        selectionBorderColor: "rgba(255, 255, 255, 0.3)",
        selectionLineWidth: 1,
        selectionFullyContained: !1,
        hoverCursor: "move",
        moveCursor: "move",
        defaultCursor: "default",
        freeDrawingCursor: "crosshair",
        rotationCursor: "crosshair",
        notAllowedCursor: "not-allowed",
        containerClass: "canvas-container",
        perPixelTargetFind: !1,
        targetFindTolerance: 0,
        skipTargetFind: !1,
        isDrawingMode: !1,
        preserveObjectStacking: !1,
        snapAngle: 0,
        snapThreshold: null,
        stopContextMenu: !1,
        fireRightClick: !1,
        fireMiddleClick: !1,
        _initInteractive: function () {
            this._currentTransform = null, this._groupSelector = null, this._initWrapperElement(), this._createUpperCanvas(), this._initEventListeners(), this._initRetinaScaling(), this.freeDrawingBrush = fabric.PencilBrush && new fabric.PencilBrush(this), this.calcOffset()
        },
        _chooseObjectsToRender: function () {
            var t, e, i, n = this.getActiveObjects();
            if (0 < n.length && !this.preserveObjectStacking) {
                e = [], i = [];
                for (var r = 0, o = this._objects.length; r < o; r++) t = this._objects[r], -1 === n.indexOf(t) ? e.push(t) : i.push(t);
                1 < n.length && (this._activeObject._objects = i), e.push.apply(e, i)
            } else e = this._objects;
            return e
        },
        renderAll: function () {
            !this.contextTopDirty || this._groupSelector || this.isDrawingMode || (this.clearContext(this.contextTop), this.contextTopDirty = !1), this.hasLostContext && this.renderTopLayer(this.contextTop);
            var t = this.contextContainer;
            return this.renderCanvas(t, this._chooseObjectsToRender()), this
        },
        renderTopLayer: function (t) {
            t.save(), this.isDrawingMode && this._isCurrentlyDrawing && (this.freeDrawingBrush && this.freeDrawingBrush._render(), this.contextTopDirty = !0), this.selection && this._groupSelector && (this._drawSelection(t), this.contextTopDirty = !0), t.restore()
        },
        renderTop: function () {
            var t = this.contextTop;
            return this.clearContext(t), this.renderTopLayer(t), this.fire("after:render"), this
        },
        _resetCurrentTransform: function () {
            var t = this._currentTransform;
            t.target.set({
                scaleX: t.original.scaleX,
                scaleY: t.original.scaleY,
                skewX: t.original.skewX,
                skewY: t.original.skewY,
                left: t.original.left,
                top: t.original.top
            }), this._shouldCenterTransform(t.target) ? ("center" !== t.originX && ("right" === t.originX ? t.mouseXSign = -1 : t.mouseXSign = 1), "center" !== t.originY && ("bottom" === t.originY ? t.mouseYSign = -1 : t.mouseYSign = 1), t.originX = "center", t.originY = "center") : (t.originX = t.original.originX, t.originY = t.original.originY)
        },
        containsPoint: function (t, e, i) {
            var n, r = i || this.getPointer(t, !0);
            return n = e.group && e.group === this._activeObject && "activeSelection" === e.group.type ? this._normalizePointer(e.group, r) : {
                x: r.x,
                y: r.y
            }, e.containsPoint(n) || e._findTargetCorner(r)
        },
        _normalizePointer: function (t, e) {
            var i = t.calcTransformMatrix(), n = fabric.util.invertTransform(i), r = this.restorePointerVpt(e);
            return fabric.util.transformPoint(r, n)
        },
        isTargetTransparent: function (t, e, i) {
            if (t.shouldCache() && t._cacheCanvas && t !== this._activeObject) {
                var n = this._normalizePointer(t, {x: e, y: i}), r = Math.max(t.cacheTranslationX + n.x * t.zoomX, 0),
                    o = Math.max(t.cacheTranslationY + n.y * t.zoomY, 0);
                return fabric.util.isTransparent(t._cacheContext, Math.round(r), Math.round(o), this.targetFindTolerance)
            }
            var s = this.contextCache, a = t.selectionBackgroundColor, c = this.viewportTransform;
            return t.selectionBackgroundColor = "", this.clearContext(s), s.save(), s.transform(c[0], c[1], c[2], c[3], c[4], c[5]), t.render(s), s.restore(), t === this._activeObject && t._renderControls(s, {
                hasBorders: !1,
                transparentCorners: !1
            }, {hasBorders: !1}), t.selectionBackgroundColor = a, fabric.util.isTransparent(s, e, i, this.targetFindTolerance)
        },
        _isSelectionKeyPressed: function (t) {
            return "[object Array]" === Object.prototype.toString.call(this.selectionKey) ? !!this.selectionKey.find((function (e) {
                return !0 === t[e]
            })) : t[this.selectionKey]
        },
        _shouldClearSelection: function (t, e) {
            var i = this.getActiveObjects(), n = this._activeObject;
            return !e || e && n && 1 < i.length && -1 === i.indexOf(e) && n !== e && !this._isSelectionKeyPressed(t) || e && !e.evented || e && !e.selectable && n && n !== e
        },
        _shouldCenterTransform: function (t) {
            if (t) {
                var e, i = this._currentTransform;
                return "scale" === i.action || "scaleX" === i.action || "scaleY" === i.action ? e = this.centeredScaling || t.centeredScaling : "rotate" === i.action && (e = this.centeredRotation || t.centeredRotation), e ? !i.altKey : i.altKey
            }
        },
        _getOriginFromCorner: function (t, e) {
            var i = {x: t.originX, y: t.originY};
            return "ml" === e || "tl" === e || "bl" === e ? i.x = "right" : "mr" !== e && "tr" !== e && "br" !== e || (i.x = "left"), "tl" === e || "mt" === e || "tr" === e ? i.y = "bottom" : "bl" !== e && "mb" !== e && "br" !== e || (i.y = "top"), i
        },
        _getActionFromCorner: function (t, e, i) {
            if (!e || !t) return "drag";
            switch (e) {
                case"mtr":
                    return "rotate";
                case"ml":
                case"mr":
                    return i[this.altActionKey] ? "skewY" : "scaleX";
                case"mt":
                case"mb":
                    return i[this.altActionKey] ? "skewX" : "scaleY";
                default:
                    return "scale"
            }
        },
        _setupCurrentTransform: function (t, i, n) {
            if (i) {
                var r = this.getPointer(t), o = i._findTargetCorner(this.getPointer(t, !0)),
                    s = this._getActionFromCorner(n, o, t, i), a = this._getOriginFromCorner(i, o);
                this._currentTransform = {
                    target: i,
                    action: s,
                    corner: o,
                    scaleX: i.scaleX,
                    scaleY: i.scaleY,
                    skewX: i.skewX,
                    skewY: i.skewY,
                    offsetX: r.x - i.left,
                    offsetY: r.y - i.top,
                    originX: a.x,
                    originY: a.y,
                    ex: r.x,
                    ey: r.y,
                    lastX: r.x,
                    lastY: r.y,
                    theta: e(i.angle),
                    width: i.width * i.scaleX,
                    mouseXSign: 1,
                    mouseYSign: 1,
                    shiftKey: t.shiftKey,
                    altKey: t[this.centeredKey],
                    original: fabric.util.saveObjectTransform(i)
                }, this._currentTransform.original.originX = a.x, this._currentTransform.original.originY = a.y, this._resetCurrentTransform(), this._beforeTransform(t)
            }
        },
        _translateObject: function (t, e) {
            var i = this._currentTransform, n = i.target, r = t - i.offsetX, o = e - i.offsetY,
                s = !n.get("lockMovementX") && n.left !== r, a = !n.get("lockMovementY") && n.top !== o;
            return s && n.set("left", r), a && n.set("top", o), s || a
        },
        _changeSkewTransformOrigin: function (t, e, i) {
            var n = "originX", r = {0: "center"}, o = e.target.skewX, s = "left", a = "right",
                c = "mt" === e.corner || "ml" === e.corner ? 1 : -1, l = 1;
            t = 0 < t ? 1 : -1, "y" === i && (o = e.target.skewY, s = "top", a = "bottom", n = "originY"), r[-1] = s, r[1] = a, e.target.flipX && (l *= -1), e.target.flipY && (l *= -1), 0 === o ? (e.skewSign = -c * t * l, e[n] = r[-t]) : (o = 0 < o ? 1 : -1, e.skewSign = o, e[n] = r[o * c * l])
        },
        _skewObject: function (t, e, i) {
            var n, r = this._currentTransform, o = r.target, s = o.get("lockSkewingX"), a = o.get("lockSkewingY");
            if (s && "x" === i || a && "y" === i) return !1;
            var c, l, h = o.getCenterPoint(), u = o.toLocalPoint(new fabric.Point(t, e), "center", "center")[i],
                f = o.toLocalPoint(new fabric.Point(r.lastX, r.lastY), "center", "center")[i],
                d = o._getTransformedDimensions();
            return this._changeSkewTransformOrigin(u - f, r, i), c = o.toLocalPoint(new fabric.Point(t, e), r.originX, r.originY)[i], l = o.translateToOriginPoint(h, r.originX, r.originY), n = this._setObjectSkew(c, r, i, d), r.lastX = t, r.lastY = e, o.setPositionByOrigin(l, r.originX, r.originY), n
        },
        _setObjectSkew: function (t, e, i, n) {
            var r, o, s, a, c, l, h, u, f, d, p = e.target, g = e.skewSign;
            return "x" === i ? (c = "y", l = "Y", h = "X", f = 0, d = p.skewY) : (c = "x", l = "X", h = "Y", f = p.skewX, d = 0), a = p._getTransformedDimensions(f, d), (u = 2 * Math.abs(t) - a[i]) <= 2 ? r = 0 : (r = g * Math.atan(u / p["scale" + h] / (a[c] / p["scale" + l])), r = fabric.util.radiansToDegrees(r)), o = p["skew" + h] !== r, p.set("skew" + h, r), 0 !== p["skew" + l] && (s = p._getTransformedDimensions(), r = n[c] / s[c] * p["scale" + l], p.set("scale" + l, r)), o
        },
        _scaleObject: function (t, e, i) {
            var n = this._currentTransform, r = n.target, o = r.lockScalingX, s = r.lockScalingY, a = r.lockScalingFlip;
            if (o && s) return !1;
            var c, l = r.translateToOriginPoint(r.getCenterPoint(), n.originX, n.originY),
                h = r.toLocalPoint(new fabric.Point(t, e), n.originX, n.originY), u = r._getTransformedDimensions();
            return this._setLocalMouse(h, n), c = this._setObjectScale(h, n, o, s, i, a, u), r.setPositionByOrigin(l, n.originX, n.originY), c
        },
        _setObjectScale: function (t, e, i, n, r, o, s) {
            var a = e.target, c = !1, l = !1, h = !1, u = t.x * a.scaleX / s.x, f = t.y * a.scaleY / s.y,
                d = a.scaleX !== u, p = a.scaleY !== f;
            if (e.newScaleX = u, e.newScaleY = f, "x" === r && a instanceof fabric.Textbox) {
                var g = a.width * (t.x / s.x);
                return g >= a.getMinWidth() && (h = g !== a.width, a.set("width", g), h)
            }
            return o && u <= 0 && u < a.scaleX && (c = !0, t.x = 0), o && f <= 0 && f < a.scaleY && (l = !0, t.y = 0), "equally" !== r || i || n ? r ? "x" !== r || a.get("lockUniScaling") ? "y" !== r || a.get("lockUniScaling") || l || n || a.set("scaleY", f) && (h = p) : c || i || a.set("scaleX", u) && (h = d) : (c || i || a.set("scaleX", u) && (h = h || d), l || n || a.set("scaleY", f) && (h = h || p)) : h = this._scaleObjectEqually(t, a, e, s), c || l || this._flipObject(e, r), h
        },
        _scaleObjectEqually: function (t, e, i, n) {
            var r, o, s, a = t.y + t.x, c = n.y * i.original.scaleY / e.scaleY + n.x * i.original.scaleX / e.scaleX,
                l = t.x < 0 ? -1 : 1, h = t.y < 0 ? -1 : 1;
            return o = l * Math.abs(i.original.scaleX * a / c), s = h * Math.abs(i.original.scaleY * a / c), r = o !== e.scaleX || s !== e.scaleY, e.set("scaleX", o), e.set("scaleY", s), r
        },
        _flipObject: function (t, e) {
            t.newScaleX < 0 && "y" !== e && ("left" === t.originX ? t.originX = "right" : "right" === t.originX && (t.originX = "left")), t.newScaleY < 0 && "x" !== e && ("top" === t.originY ? t.originY = "bottom" : "bottom" === t.originY && (t.originY = "top"))
        },
        _setLocalMouse: function (t, e) {
            var i = e.target, n = this.getZoom(), o = i.padding / n;
            "right" === e.originX ? t.x *= -1 : "center" === e.originX && (t.x *= 2 * e.mouseXSign, t.x < 0 && (e.mouseXSign = -e.mouseXSign)), "bottom" === e.originY ? t.y *= -1 : "center" === e.originY && (t.y *= 2 * e.mouseYSign, t.y < 0 && (e.mouseYSign = -e.mouseYSign)), r(t.x) > o ? t.x < 0 ? t.x += o : t.x -= o : t.x = 0, r(t.y) > o ? t.y < 0 ? t.y += o : t.y -= o : t.y = 0
        },
        _rotateObject: function (t, e) {
            var r = this._currentTransform, o = r.target,
                s = o.translateToOriginPoint(o.getCenterPoint(), r.originX, r.originY);
            if (o.lockRotation) return !1;
            var a = n(r.ey - s.y, r.ex - s.x), c = n(e - s.y, t - s.x), l = i(c - a + r.theta), h = !0;
            if (0 < o.snapAngle) {
                var u = o.snapAngle, f = o.snapThreshold || u, d = Math.ceil(l / u) * u, p = Math.floor(l / u) * u;
                Math.abs(l - p) < f ? l = p : Math.abs(l - d) < f && (l = d)
            }
            return l < 0 && (l = 360 + l), l %= 360, o.angle === l ? h = !1 : (o.angle = l, o.setPositionByOrigin(s, r.originX, r.originY)), h
        },
        setCursor: function (t) {
            this.upperCanvasEl.style.cursor = t
        },
        _drawSelection: function (t) {
            var e = this._groupSelector, i = e.left, n = e.top, s = r(i), a = r(n);
            if (this.selectionColor && (t.fillStyle = this.selectionColor, t.fillRect(e.ex - (0 < i ? 0 : -i), e.ey - (0 < n ? 0 : -n), s, a)), this.selectionLineWidth && this.selectionBorderColor) if (t.lineWidth = this.selectionLineWidth, t.strokeStyle = this.selectionBorderColor, 1 < this.selectionDashArray.length && !o) {
                var c = e.ex + .5 - (0 < i ? 0 : s), l = e.ey + .5 - (0 < n ? 0 : a);
                t.beginPath(), fabric.util.drawDashedLine(t, c, l, c + s, l, this.selectionDashArray), fabric.util.drawDashedLine(t, c, l + a - 1, c + s, l + a - 1, this.selectionDashArray), fabric.util.drawDashedLine(t, c, l, c, l + a, this.selectionDashArray), fabric.util.drawDashedLine(t, c + s - 1, l, c + s - 1, l + a, this.selectionDashArray), t.closePath(), t.stroke()
            } else fabric.Object.prototype._setLineDash.call(this, t, this.selectionDashArray), t.strokeRect(e.ex + .5 - (0 < i ? 0 : s), e.ey + .5 - (0 < n ? 0 : a), s, a)
        },
        findTarget: function (t, e) {
            if (!this.skipTargetFind) {
                var i, n, r = this.getPointer(t, !0), o = this._activeObject, s = this.getActiveObjects();
                if (this.targets = [], 1 < s.length && !e && o === this._searchPossibleTargets([o], r)) return o;
                if (1 === s.length && o._findTargetCorner(r)) return o;
                if (1 === s.length && o === this._searchPossibleTargets([o], r)) {
                    if (!this.preserveObjectStacking) return o;
                    i = o, n = this.targets, this.targets = []
                }
                var a = this._searchPossibleTargets(this._objects, r);
                return t[this.altSelectionKey] && a && i && a !== i && (a = i, this.targets = n), a
            }
        },
        _checkTarget: function (t, e, i) {
            if (e && e.visible && e.evented && this.containsPoint(null, e, t)) {
                if (!this.perPixelTargetFind && !e.perPixelTargetFind || e.isEditing) return !0;
                if (!this.isTargetTransparent(e, i.x, i.y)) return !0
            }
        },
        _searchPossibleTargets: function (t, e) {
            for (var i, n, r = t.length; r--;) {
                var o = t[r],
                    s = o.group && "activeSelection" !== o.group.type ? this._normalizePointer(o.group, e) : e;
                if (this._checkTarget(s, o, e)) {
                    (i = t[r]).subTargetCheck && i instanceof fabric.Group && (n = this._searchPossibleTargets(i._objects, e)) && this.targets.push(n);
                    break
                }
            }
            return i
        },
        restorePointerVpt: function (t) {
            return fabric.util.transformPoint(t, fabric.util.invertTransform(this.viewportTransform))
        },
        getPointer: function (e, i) {
            if (this._absolutePointer && !i) return this._absolutePointer;
            if (this._pointer && i) return this._pointer;
            var n, r = t(e), o = this.upperCanvasEl, s = o.getBoundingClientRect(), a = s.width || 0, c = s.height || 0;
            return a && c || ("top" in s && "bottom" in s && (c = Math.abs(s.top - s.bottom)), "right" in s && "left" in s && (a = Math.abs(s.right - s.left))), this.calcOffset(), r.x = r.x - this._offset.left, r.y = r.y - this._offset.top, i || (r = this.restorePointerVpt(r)), n = 0 === a || 0 === c ? {
                width: 1,
                height: 1
            } : {width: o.width / a, height: o.height / c}, {x: r.x * n.width, y: r.y * n.height}
        },
        _createUpperCanvas: function () {
            var t = this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/, "");
            this.upperCanvasEl ? this.upperCanvasEl.className = "" : this.upperCanvasEl = this._createCanvasElement(), fabric.util.addClass(this.upperCanvasEl, "upper-canvas " + t), this.wrapperEl.appendChild(this.upperCanvasEl), this._copyCanvasStyle(this.lowerCanvasEl, this.upperCanvasEl), this._applyCanvasStyle(this.upperCanvasEl), this.contextTop = this.upperCanvasEl.getContext("2d")
        },
        _createCacheCanvas: function () {
            this.cacheCanvasEl = this._createCanvasElement(), this.cacheCanvasEl.setAttribute("width", this.width), this.cacheCanvasEl.setAttribute("height", this.height), this.contextCache = this.cacheCanvasEl.getContext("2d")
        },
        _initWrapperElement: function () {
            this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, "div", {class: this.containerClass}), fabric.util.setStyle(this.wrapperEl, {
                width: this.width + "px",
                height: this.height + "px",
                position: "relative"
            }), fabric.util.makeElementUnselectable(this.wrapperEl)
        },
        _applyCanvasStyle: function (t) {
            var e = this.width || t.width, i = this.height || t.height;
            fabric.util.setStyle(t, {
                position: "absolute",
                width: e + "px",
                height: i + "px",
                left: 0,
                top: 0,
                "touch-action": this.allowTouchScrolling ? "manipulation" : "none",
                "-ms-touch-action": this.allowTouchScrolling ? "manipulation" : "none"
            }), t.width = e, t.height = i, fabric.util.makeElementUnselectable(t)
        },
        _copyCanvasStyle: function (t, e) {
            e.style.cssText = t.style.cssText
        },
        getSelectionContext: function () {
            return this.contextTop
        },
        getSelectionElement: function () {
            return this.upperCanvasEl
        },
        getActiveObject: function () {
            return this._activeObject
        },
        getActiveObjects: function () {
            var t = this._activeObject;
            return t ? "activeSelection" === t.type && t._objects ? t._objects.slice(0) : [t] : []
        },
        _onObjectRemoved: function (t) {
            t === this._activeObject && (this.fire("before:selection:cleared", {target: t}), this._discardActiveObject(), this.fire("selection:cleared", {target: t}), t.fire("deselected")), this._hoveredTarget === t && (this._hoveredTarget = null), this.callSuper("_onObjectRemoved", t)
        },
        _fireSelectionEvents: function (t, e) {
            var i = !1, n = this.getActiveObjects(), r = [], o = [], s = {e: e};
            t.forEach((function (t) {
                -1 === n.indexOf(t) && (i = !0, t.fire("deselected", s), o.push(t))
            })), n.forEach((function (e) {
                -1 === t.indexOf(e) && (i = !0, e.fire("selected", s), r.push(e))
            })), 0 < t.length && 0 < n.length ? (s.selected = r, s.deselected = o, s.updated = r[0] || o[0], s.target = this._activeObject, i && this.fire("selection:updated", s)) : 0 < n.length ? (1 === n.length && (s.target = r[0], this.fire("object:selected", s)), s.selected = r, s.target = this._activeObject, this.fire("selection:created", s)) : 0 < t.length && (s.deselected = o, this.fire("selection:cleared", s))
        },
        setActiveObject: function (t, e) {
            var i = this.getActiveObjects();
            return this._setActiveObject(t, e), this._fireSelectionEvents(i, e), this
        },
        _setActiveObject: function (t, e) {
            return this._activeObject !== t && !!this._discardActiveObject(e, t) && !t.onSelect({e: e}) && (this._activeObject = t, !0)
        },
        _discardActiveObject: function (t, e) {
            var i = this._activeObject;
            if (i) {
                if (i.onDeselect({e: t, object: e})) return !1;
                this._activeObject = null
            }
            return !0
        },
        discardActiveObject: function (t) {
            var e = this.getActiveObjects(), i = this.getActiveObject();
            return e.length && this.fire("before:selection:cleared", {
                target: i,
                e: t
            }), this._discardActiveObject(t), this._fireSelectionEvents(e, t), this
        },
        dispose: function () {
            var t = this.wrapperEl;
            return this.removeListeners(), t.removeChild(this.upperCanvasEl), t.removeChild(this.lowerCanvasEl), this.contextCache = null, this.contextTop = null, ["upperCanvasEl", "cacheCanvasEl"].forEach(function (t) {
                fabric.util.cleanUpJsdomNode(this[t]), this[t] = void 0
            }.bind(this)), t.parentNode && t.parentNode.replaceChild(this.lowerCanvasEl, this.wrapperEl), delete this.wrapperEl, fabric.StaticCanvas.prototype.dispose.call(this), this
        },
        clear: function () {
            return this.discardActiveObject(), this.clearContext(this.contextTop), this.callSuper("clear")
        },
        drawControls: function (t) {
            var e = this._activeObject;
            e && e._renderControls(t)
        },
        _toObject: function (t, e, i) {
            var n = this._realizeGroupTransformOnObject(t), r = this.callSuper("_toObject", t, e, i);
            return this._unwindGroupTransformOnObject(t, n), r
        },
        _realizeGroupTransformOnObject: function (t) {
            if (t.group && "activeSelection" === t.group.type && this._activeObject === t.group) {
                var e = {};
                return ["angle", "flipX", "flipY", "left", "scaleX", "scaleY", "skewX", "skewY", "top"].forEach((function (i) {
                    e[i] = t[i]
                })), this._activeObject.realizeTransform(t), e
            }
            return null
        },
        _unwindGroupTransformOnObject: function (t, e) {
            e && t.set(e)
        },
        _setSVGObject: function (t, e, i) {
            var n = this._realizeGroupTransformOnObject(e);
            this.callSuper("_setSVGObject", t, e, i), this._unwindGroupTransformOnObject(e, n)
        },
        setViewportTransform: function (t) {
            this.renderOnAddRemove && this._activeObject && this._activeObject.isEditing && this._activeObject.clearContextTop(), fabric.StaticCanvas.prototype.setViewportTransform.call(this, t)
        }
    }), fabric.StaticCanvas) "prototype" !== s && (fabric.Canvas[s] = fabric.StaticCanvas[s])
}(), function () {
    var t = {mt: 0, tr: 1, mr: 2, br: 3, mb: 4, bl: 5, ml: 6, tl: 7}, e = fabric.util.addListener,
        i = fabric.util.removeListener, n = {passive: !1};

    function r(t, e) {
        return t.button && t.button === e - 1
    }

    fabric.util.object.extend(fabric.Canvas.prototype, {
        cursorMap: ["n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize", "nw-resize"],
        mainTouchId: null,
        _initEventListeners: function () {
            this.removeListeners(), this._bindEvents(), this.addOrRemove(e, "add")
        },
        _getEventPrefix: function () {
            return this.enablePointerEvents ? "pointer" : "mouse"
        },
        addOrRemove: function (t, e) {
            var i = this.upperCanvasEl, r = this._getEventPrefix();
            t(fabric.window, "resize", this._onResize), t(i, r + "down", this._onMouseDown), t(i, r + "move", this._onMouseMove, n), t(i, r + "out", this._onMouseOut), t(i, r + "enter", this._onMouseEnter), t(i, "wheel", this._onMouseWheel), t(i, "contextmenu", this._onContextMenu), t(i, "dblclick", this._onDoubleClick), t(i, "dragover", this._onDragOver), t(i, "dragenter", this._onDragEnter), t(i, "dragleave", this._onDragLeave), t(i, "drop", this._onDrop), this.enablePointerEvents || t(i, "touchstart", this._onTouchStart, n), "undefined" != typeof eventjs && e in eventjs && (eventjs[e](i, "gesture", this._onGesture), eventjs[e](i, "drag", this._onDrag), eventjs[e](i, "orientation", this._onOrientationChange), eventjs[e](i, "shake", this._onShake), eventjs[e](i, "longpress", this._onLongPress))
        },
        removeListeners: function () {
            this.addOrRemove(i, "remove");
            var t = this._getEventPrefix();
            i(fabric.document, t + "up", this._onMouseUp), i(fabric.document, "touchend", this._onTouchEnd, n), i(fabric.document, t + "move", this._onMouseMove, n), i(fabric.document, "touchmove", this._onMouseMove, n)
        },
        _bindEvents: function () {
            this.eventsBound || (this._onMouseDown = this._onMouseDown.bind(this), this._onTouchStart = this._onTouchStart.bind(this), this._onMouseMove = this._onMouseMove.bind(this), this._onMouseUp = this._onMouseUp.bind(this), this._onTouchEnd = this._onTouchEnd.bind(this), this._onResize = this._onResize.bind(this), this._onGesture = this._onGesture.bind(this), this._onDrag = this._onDrag.bind(this), this._onShake = this._onShake.bind(this), this._onLongPress = this._onLongPress.bind(this), this._onOrientationChange = this._onOrientationChange.bind(this), this._onMouseWheel = this._onMouseWheel.bind(this), this._onMouseOut = this._onMouseOut.bind(this), this._onMouseEnter = this._onMouseEnter.bind(this), this._onContextMenu = this._onContextMenu.bind(this), this._onDoubleClick = this._onDoubleClick.bind(this), this._onDragOver = this._onDragOver.bind(this), this._onDragEnter = this._simpleEventHandler.bind(this, "dragenter"), this._onDragLeave = this._simpleEventHandler.bind(this, "dragleave"), this._onDrop = this._simpleEventHandler.bind(this, "drop"), this.eventsBound = !0)
        },
        _onGesture: function (t, e) {
            this.__onTransformGesture && this.__onTransformGesture(t, e)
        },
        _onDrag: function (t, e) {
            this.__onDrag && this.__onDrag(t, e)
        },
        _onMouseWheel: function (t) {
            this.__onMouseWheel(t)
        },
        _onMouseOut: function (t) {
            var e = this._hoveredTarget;
            this.fire("mouse:out", {
                target: e,
                e: t
            }), this._hoveredTarget = null, e && e.fire("mouseout", {e: t}), this._iTextInstances && this._iTextInstances.forEach((function (t) {
                t.isEditing && t.hiddenTextarea.focus()
            }))
        },
        _onMouseEnter: function (t) {
            this.currentTransform || this.findTarget(t) || (this.fire("mouse:over", {
                target: null,
                e: t
            }), this._hoveredTarget = null)
        },
        _onOrientationChange: function (t, e) {
            this.__onOrientationChange && this.__onOrientationChange(t, e)
        },
        _onShake: function (t, e) {
            this.__onShake && this.__onShake(t, e)
        },
        _onLongPress: function (t, e) {
            this.__onLongPress && this.__onLongPress(t, e)
        },
        _onDragOver: function (t) {
            t.preventDefault();
            var e = this._simpleEventHandler("dragover", t);
            this._fireEnterLeaveEvents(e, t)
        },
        _onContextMenu: function (t) {
            return this.stopContextMenu && (t.stopPropagation(), t.preventDefault()), !1
        },
        _onDoubleClick: function (t) {
            this._cacheTransformEventData(t), this._handleEvent(t, "dblclick"), this._resetTransformEventData(t)
        },
        getPointerId: function (t) {
            var e = t.changedTouches;
            return e ? e[0] && e[0].identifier : this.enablePointerEvents ? t.pointerId : -1
        },
        _isMainEvent: function (t) {
            return !0 === t.isPrimary || !1 !== t.isPrimary && ("touchend" === t.type && 0 === t.touches.length || !t.changedTouches || t.changedTouches[0].identifier === this.mainTouchId)
        },
        _onTouchStart: function (t) {
            t.preventDefault(), null === this.mainTouchId && (this.mainTouchId = this.getPointerId(t)), this.__onMouseDown(t), this._resetTransformEventData();
            var r = this.upperCanvasEl, o = this._getEventPrefix();
            e(fabric.document, "touchend", this._onTouchEnd, n), e(fabric.document, "touchmove", this._onMouseMove, n), i(r, o + "down", this._onMouseDown)
        },
        _onMouseDown: function (t) {
            this.__onMouseDown(t), this._resetTransformEventData();
            var r = this.upperCanvasEl, o = this._getEventPrefix();
            i(r, o + "move", this._onMouseMove, n), e(fabric.document, o + "up", this._onMouseUp), e(fabric.document, o + "move", this._onMouseMove, n)
        },
        _onTouchEnd: function (t) {
            if (!(0 < t.touches.length)) {
                this.__onMouseUp(t), this._resetTransformEventData(), this.mainTouchId = null;
                var r = this._getEventPrefix();
                i(fabric.document, "touchend", this._onTouchEnd, n), i(fabric.document, "touchmove", this._onMouseMove, n);
                var o = this;
                this._willAddMouseDown && clearTimeout(this._willAddMouseDown), this._willAddMouseDown = setTimeout((function () {
                    e(o.upperCanvasEl, r + "down", o._onMouseDown), o._willAddMouseDown = 0
                }), 400)
            }
        },
        _onMouseUp: function (t) {
            this.__onMouseUp(t), this._resetTransformEventData();
            var r = this.upperCanvasEl, o = this._getEventPrefix();
            this._isMainEvent(t) && (i(fabric.document, o + "up", this._onMouseUp), i(fabric.document, o + "move", this._onMouseMove, n), e(r, o + "move", this._onMouseMove, n))
        },
        _onMouseMove: function (t) {
            !this.allowTouchScrolling && t.preventDefault && t.preventDefault(), this.__onMouseMove(t)
        },
        _onResize: function () {
            this.calcOffset()
        },
        _shouldRender: function (t) {
            var e = this._activeObject;
            return !!(!!e != !!t || e && t && e !== t) || (e && e.isEditing, !1)
        },
        __onMouseUp: function (t) {
            var e, i = this._currentTransform, n = this._groupSelector, o = !1, s = !n || 0 === n.left && 0 === n.top;
            if (this._cacheTransformEventData(t), e = this._target, this._handleEvent(t, "up:before"), !r(t, 3)) return r(t, 2) ? (this.fireMiddleClick && this._handleEvent(t, "up", 2, s), void this._resetTransformEventData()) : void (this.isDrawingMode && this._isCurrentlyDrawing ? this._onMouseUpInDrawingMode(t) : this._isMainEvent(t) && (i && (this._finalizeCurrentTransform(t), o = i.actionPerformed), s || (this._maybeGroupObjects(t), o || (o = this._shouldRender(e))), e && (e.isMoving = !1), this._setCursorFromEvent(t, e), this._handleEvent(t, "up", 1, s), this._groupSelector = null, this._currentTransform = null, e && (e.__corner = 0), o ? this.requestRenderAll() : s || this.renderTop()));
            this.fireRightClick && this._handleEvent(t, "up", 3, s)
        },
        _simpleEventHandler: function (t, e) {
            var i = this.findTarget(e), n = this.targets, r = {e: e, target: i, subTargets: n};
            if (this.fire(t, r), i && i.fire(t, r), !n) return i;
            for (var o = 0; o < n.length; o++) n[o].fire(t, r);
            return i
        },
        _handleEvent: function (t, e, i, n) {
            var r = this._target, o = this.targets || [], s = {
                e: t,
                target: r,
                subTargets: o,
                button: i || 1,
                isClick: n || !1,
                pointer: this._pointer,
                absolutePointer: this._absolutePointer,
                transform: this._currentTransform
            };
            this.fire("mouse:" + e, s), r && r.fire("mouse" + e, s);
            for (var a = 0; a < o.length; a++) o[a].fire("mouse" + e, s)
        },
        _finalizeCurrentTransform: function (t) {
            var e, i = this._currentTransform, n = i.target, r = {e: t, target: n, transform: i};
            n._scaling && (n._scaling = !1), n.setCoords(), (i.actionPerformed || this.stateful && n.hasStateChanged()) && (i.actionPerformed && (e = this._addEventOptions(r, i), this._fire(e, r)), this._fire("modified", r))
        },
        _addEventOptions: function (t, e) {
            var i, n;
            switch (e.action) {
                case"scaleX":
                    i = "scaled", n = "x";
                    break;
                case"scaleY":
                    i = "scaled", n = "y";
                    break;
                case"skewX":
                    i = "skewed", n = "x";
                    break;
                case"skewY":
                    i = "skewed", n = "y";
                    break;
                case"scale":
                    i = "scaled", n = "equally";
                    break;
                case"rotate":
                    i = "rotated";
                    break;
                case"drag":
                    i = "moved"
            }
            return t.by = n, i
        },
        _onMouseDownInDrawingMode: function (t) {
            this._isCurrentlyDrawing = !0, this.getActiveObject() && this.discardActiveObject(t).requestRenderAll(), this.clipTo && fabric.util.clipContext(this, this.contextTop);
            var e = this.getPointer(t);
            this.freeDrawingBrush.onMouseDown(e, {e: t, pointer: e}), this._handleEvent(t, "down")
        },
        _onMouseMoveInDrawingMode: function (t) {
            if (this._isCurrentlyDrawing) {
                var e = this.getPointer(t);
                this.freeDrawingBrush.onMouseMove(e, {e: t, pointer: e})
            }
            this.setCursor(this.freeDrawingCursor), this._handleEvent(t, "move")
        },
        _onMouseUpInDrawingMode: function (t) {
            this.clipTo && this.contextTop.restore();
            var e = this.getPointer(t);
            this._isCurrentlyDrawing = this.freeDrawingBrush.onMouseUp({e: t, pointer: e}), this._handleEvent(t, "up")
        },
        __onMouseDown: function (t) {
            this._cacheTransformEventData(t), this._handleEvent(t, "down:before");
            var e = this._target;
            if (r(t, 3)) this.fireRightClick && this._handleEvent(t, "down", 3); else if (r(t, 2)) this.fireMiddleClick && this._handleEvent(t, "down", 2); else if (this.isDrawingMode) this._onMouseDownInDrawingMode(t); else if (this._isMainEvent(t) && !this._currentTransform) {
                var i = this._pointer;
                this._previousPointer = i;
                var n = this._shouldRender(e), o = this._shouldGroup(t, e);
                if (this._shouldClearSelection(t, e) ? this.discardActiveObject(t) : o && (this._handleGrouping(t, e), e = this._activeObject), !this.selection || e && (e.selectable || e.isEditing || e === this._activeObject) || (this._groupSelector = {
                    ex: i.x,
                    ey: i.y,
                    top: 0,
                    left: 0
                }), e) {
                    var s = e === this._activeObject;
                    e.selectable && this.setActiveObject(e, t), e !== this._activeObject || !e.__corner && o || this._setupCurrentTransform(t, e, s)
                }
                this._handleEvent(t, "down"), (n || o) && this.requestRenderAll()
            }
        },
        _resetTransformEventData: function () {
            this._target = null, this._pointer = null, this._absolutePointer = null
        },
        _cacheTransformEventData: function (t) {
            this._resetTransformEventData(), this._pointer = this.getPointer(t, !0), this._absolutePointer = this.restorePointerVpt(this._pointer), this._target = this._currentTransform ? this._currentTransform.target : this.findTarget(t) || null
        },
        _beforeTransform: function (t) {
            var e = this._currentTransform;
            this.stateful && e.target.saveState(), this.fire("before:transform", {
                e: t,
                transform: e
            }), e.corner && this.onBeforeScaleRotate(e.target)
        },
        __onMouseMove: function (t) {
            var e, i;
            if (this._handleEvent(t, "move:before"), this._cacheTransformEventData(t), this.isDrawingMode) this._onMouseMoveInDrawingMode(t); else if (this._isMainEvent(t)) {
                var n = this._groupSelector;
                n ? (i = this._pointer, n.left = i.x - n.ex, n.top = i.y - n.ey, this.renderTop()) : this._currentTransform ? this._transformObject(t) : (e = this.findTarget(t) || null, this._setCursorFromEvent(t, e), this._fireOverOutEvents(e, t)), this._handleEvent(t, "move"), this._resetTransformEventData()
            }
        },
        _fireOverOutEvents: function (t, e) {
            this.fireSyntheticInOutEvents(t, e, {
                targetName: "_hoveredTarget",
                canvasEvtOut: "mouse:out",
                evtOut: "mouseout",
                canvasEvtIn: "mouse:over",
                evtIn: "mouseover"
            })
        },
        _fireEnterLeaveEvents: function (t, e) {
            this.fireSyntheticInOutEvents(t, e, {
                targetName: "_draggedoverTarget",
                evtOut: "dragleave",
                evtIn: "dragenter"
            })
        },
        fireSyntheticInOutEvents: function (t, e, i) {
            var n, r, o, s = this[i.targetName], a = s !== t, c = i.canvasEvtIn, l = i.canvasEvtOut;
            a && (n = {e: e, target: t, previousTarget: s}, r = {
                e: e,
                target: s,
                nextTarget: t
            }, this[i.targetName] = t), o = t && a, s && a && (l && this.fire(l, r), s.fire(i.evtOut, r)), o && (c && this.fire(c, n), t.fire(i.evtIn, n))
        },
        __onMouseWheel: function (t) {
            this._cacheTransformEventData(t), this._handleEvent(t, "wheel"), this._resetTransformEventData()
        },
        _transformObject: function (t) {
            var e = this.getPointer(t), i = this._currentTransform;
            i.reset = !1, i.target.isMoving = !0, i.shiftKey = t.shiftKey, i.altKey = t[this.centeredKey], this._beforeScaleTransform(t, i), this._performTransformAction(t, i, e), i.actionPerformed && this.requestRenderAll()
        },
        _performTransformAction: function (t, e, i) {
            var n = i.x, r = i.y, o = e.action, s = !1, a = {target: e.target, e: t, transform: e, pointer: i};
            "rotate" === o ? (s = this._rotateObject(n, r)) && this._fire("rotating", a) : "scale" === o ? (s = this._onScale(t, e, n, r)) && this._fire("scaling", a) : "scaleX" === o ? (s = this._scaleObject(n, r, "x")) && this._fire("scaling", a) : "scaleY" === o ? (s = this._scaleObject(n, r, "y")) && this._fire("scaling", a) : "skewX" === o ? (s = this._skewObject(n, r, "x")) && this._fire("skewing", a) : "skewY" === o ? (s = this._skewObject(n, r, "y")) && this._fire("skewing", a) : (s = this._translateObject(n, r)) && (this._fire("moving", a), this.setCursor(a.target.moveCursor || this.moveCursor)), e.actionPerformed = e.actionPerformed || s
        },
        _fire: function (t, e) {
            this.fire("object:" + t, e), e.target.fire(t, e)
        },
        _beforeScaleTransform: function (t, e) {
            if ("scale" === e.action || "scaleX" === e.action || "scaleY" === e.action) {
                var i = this._shouldCenterTransform(e.target);
                (i && ("center" !== e.originX || "center" !== e.originY) || !i && "center" === e.originX && "center" === e.originY) && (this._resetCurrentTransform(), e.reset = !0)
            }
        },
        _onScale: function (t, e, i, n) {
            return this._isUniscalePossible(t, e.target) ? (e.currentAction = "scale", this._scaleObject(i, n)) : (e.reset || "scale" !== e.currentAction || this._resetCurrentTransform(), e.currentAction = "scaleEqually", this._scaleObject(i, n, "equally"))
        },
        _isUniscalePossible: function (t, e) {
            return (t[this.uniScaleKey] || this.uniScaleTransform) && !e.get("lockUniScaling")
        },
        _setCursorFromEvent: function (t, e) {
            if (!e) return this.setCursor(this.defaultCursor), !1;
            var i = e.hoverCursor || this.hoverCursor,
                n = this._activeObject && "activeSelection" === this._activeObject.type ? this._activeObject : null,
                r = (!n || !n.contains(e)) && e._findTargetCorner(this.getPointer(t, !0));
            r ? this.setCursor(this.getCornerCursor(r, e, t)) : this.setCursor(i)
        },
        getCornerCursor: function (e, i, n) {
            return this.actionIsDisabled(e, i, n) ? this.notAllowedCursor : e in t ? this._getRotatedCornerCursor(e, i, n) : "mtr" === e && i.hasRotatingPoint ? this.rotationCursor : this.defaultCursor
        },
        actionIsDisabled: function (t, e, i) {
            return "mt" === t || "mb" === t ? i[this.altActionKey] ? e.lockSkewingX : e.lockScalingY : "ml" === t || "mr" === t ? i[this.altActionKey] ? e.lockSkewingY : e.lockScalingX : "mtr" === t ? e.lockRotation : this._isUniscalePossible(i, e) ? e.lockScalingX && e.lockScalingY : e.lockScalingX || e.lockScalingY
        },
        _getRotatedCornerCursor: function (e, i, n) {
            var r = Math.round(i.angle % 360 / 45);
            return r < 0 && (r += 8), r += t[e], n[this.altActionKey] && t[e] % 2 == 0 && (r += 2), r %= 8, this.cursorMap[r]
        }
    })
}(), function () {
    var t = Math.min, e = Math.max;
    fabric.util.object.extend(fabric.Canvas.prototype, {
        _shouldGroup: function (t, e) {
            var i = this._activeObject;
            return i && this._isSelectionKeyPressed(t) && e && e.selectable && this.selection && (i !== e || "activeSelection" === i.type) && !e.onSelect({e: t})
        }, _handleGrouping: function (t, e) {
            var i = this._activeObject;
            i.__corner || (e !== i || (e = this.findTarget(t, !0)) && e.selectable) && (i && "activeSelection" === i.type ? this._updateActiveSelection(e, t) : this._createActiveSelection(e, t))
        }, _updateActiveSelection: function (t, e) {
            var i = this._activeObject, n = i._objects.slice(0);
            i.contains(t) ? (i.removeWithUpdate(t), this._hoveredTarget = t, 1 === i.size() && this._setActiveObject(i.item(0), e)) : (i.addWithUpdate(t), this._hoveredTarget = i), this._fireSelectionEvents(n, e)
        }, _createActiveSelection: function (t, e) {
            var i = this.getActiveObjects(), n = this._createGroup(t);
            this._hoveredTarget = n, this._setActiveObject(n, e), this._fireSelectionEvents(i, e)
        }, _createGroup: function (t) {
            var e = this._objects,
                i = e.indexOf(this._activeObject) < e.indexOf(t) ? [this._activeObject, t] : [t, this._activeObject];
            return this._activeObject.isEditing && this._activeObject.exitEditing(), new fabric.ActiveSelection(i, {canvas: this})
        }, _groupSelectedObjects: function (t) {
            var e, i = this._collectObjects(t);
            1 === i.length ? this.setActiveObject(i[0], t) : 1 < i.length && (e = new fabric.ActiveSelection(i.reverse(), {canvas: this}), this.setActiveObject(e, t))
        }, _collectObjects: function (i) {
            for (var n, r = [], o = this._groupSelector.ex, s = this._groupSelector.ey, a = o + this._groupSelector.left, c = s + this._groupSelector.top, l = new fabric.Point(t(o, a), t(s, c)), h = new fabric.Point(e(o, a), e(s, c)), u = !this.selectionFullyContained, f = o === a && s === c, d = this._objects.length; d-- && !((n = this._objects[d]) && n.selectable && n.visible && (u && n.intersectsWithRect(l, h) || n.isContainedWithinRect(l, h) || u && n.containsPoint(l) || u && n.containsPoint(h)) && (r.push(n), f));) ;
            return 1 < r.length && (r = r.filter((function (t) {
                return !t.onSelect({e: i})
            }))), r
        }, _maybeGroupObjects: function (t) {
            this.selection && this._groupSelector && this._groupSelectedObjects(t), this.setCursor(this.defaultCursor), this._groupSelector = null
        }
    })
}(), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    toDataURL: function (t) {
        t || (t = {});
        var e = t.format || "png", i = t.quality || 1,
            n = (t.multiplier || 1) * (t.enableRetinaScaling ? this.getRetinaScaling() : 1),
            r = this.toCanvasElement(n, t);
        return fabric.util.toDataURL(r, e, i)
    }, toCanvasElement: function (t, e) {
        t = t || 1;
        var i = ((e = e || {}).width || this.width) * t, n = (e.height || this.height) * t, r = this.getZoom(),
            o = this.width, s = this.height, a = r * t, c = this.viewportTransform, l = (c[4] - (e.left || 0)) * t,
            h = (c[5] - (e.top || 0)) * t, u = this.interactive, f = [a, 0, 0, a, l, h], d = this.enableRetinaScaling,
            p = fabric.util.createCanvasElement(), g = this.contextTop;
        return p.width = i, p.height = n, this.contextTop = null, this.enableRetinaScaling = !1, this.interactive = !1, this.viewportTransform = f, this.width = i, this.height = n, this.calcViewportBoundaries(), this.renderCanvas(p.getContext("2d"), this._objects), this.viewportTransform = c, this.width = o, this.height = s, this.calcViewportBoundaries(), this.interactive = u, this.enableRetinaScaling = d, this.contextTop = g, p
    }
}), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    loadFromDatalessJSON: function (t, e, i) {
        return this.loadFromJSON(t, e, i)
    }, loadFromJSON: function (t, e, i) {
        if (t) {
            var n = "string" == typeof t ? JSON.parse(t) : fabric.util.object.clone(t), r = this, o = n.clipPath,
                s = this.renderOnAddRemove;
            return this.renderOnAddRemove = !1, delete n.clipPath, this._enlivenObjects(n.objects, (function (t) {
                r.clear(), r._setBgOverlay(n, (function () {
                    o ? r._enlivenObjects([o], (function (i) {
                        r.clipPath = i[0], r.__setupCanvas.call(r, n, t, s, e)
                    })) : r.__setupCanvas.call(r, n, t, s, e)
                }))
            }), i), this
        }
    }, __setupCanvas: function (t, e, i, n) {
        var r = this;
        e.forEach((function (t, e) {
            r.insertAt(t, e)
        })), this.renderOnAddRemove = i, delete t.objects, delete t.backgroundImage, delete t.overlayImage, delete t.background, delete t.overlay, this._setOptions(t), this.renderAll(), n && n()
    }, _setBgOverlay: function (t, e) {
        var i = {backgroundColor: !1, overlayColor: !1, backgroundImage: !1, overlayImage: !1};
        if (t.backgroundImage || t.overlayImage || t.background || t.overlay) {
            var n = function () {
                i.backgroundImage && i.overlayImage && i.backgroundColor && i.overlayColor && e && e()
            };
            this.__setBgOverlay("backgroundImage", t.backgroundImage, i, n), this.__setBgOverlay("overlayImage", t.overlayImage, i, n), this.__setBgOverlay("backgroundColor", t.background, i, n), this.__setBgOverlay("overlayColor", t.overlay, i, n)
        } else e && e()
    }, __setBgOverlay: function (t, e, i, n) {
        var r = this;
        if (!e) return i[t] = !0, void (n && n());
        "backgroundImage" === t || "overlayImage" === t ? fabric.util.enlivenObjects([e], (function (e) {
            r[t] = e[0], i[t] = !0, n && n()
        })) : this["set" + fabric.util.string.capitalize(t, !0)](e, (function () {
            i[t] = !0, n && n()
        }))
    }, _enlivenObjects: function (t, e, i) {
        t && 0 !== t.length ? fabric.util.enlivenObjects(t, (function (t) {
            e && e(t)
        }), null, i) : e && e([])
    }, _toDataURL: function (t, e) {
        this.clone((function (i) {
            e(i.toDataURL(t))
        }))
    }, _toDataURLWithMultiplier: function (t, e, i) {
        this.clone((function (n) {
            i(n.toDataURLWithMultiplier(t, e))
        }))
    }, clone: function (t, e) {
        var i = JSON.stringify(this.toJSON(e));
        this.cloneWithoutData((function (e) {
            e.loadFromJSON(i, (function () {
                t && t(e)
            }))
        }))
    }, cloneWithoutData: function (t) {
        var e = fabric.util.createCanvasElement();
        e.width = this.width, e.height = this.height;
        var i = new fabric.Canvas(e);
        i.clipTo = this.clipTo, this.backgroundImage ? (i.setBackgroundImage(this.backgroundImage.src, (function () {
            i.renderAll(), t && t(i)
        })), i.backgroundImageOpacity = this.backgroundImageOpacity, i.backgroundImageStretch = this.backgroundImageStretch) : t && t(i)
    }
}), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.object.extend, n = e.util.object.clone, r = e.util.toFixed,
        o = e.util.string.capitalize, s = e.util.degreesToRadians, a = e.StaticCanvas.supports("setLineDash"),
        c = !e.isLikelyNode;
    e.Object || (e.Object = e.util.createClass(e.CommonMethods, {
        type: "object",
        originX: "left",
        originY: "top",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        flipX: !1,
        flipY: !1,
        opacity: 1,
        angle: 0,
        skewX: 0,
        skewY: 0,
        cornerSize: 13,
        transparentCorners: !0,
        hoverCursor: null,
        moveCursor: null,
        padding: 0,
        borderColor: "rgba(102,153,255,0.75)",
        borderDashArray: null,
        cornerColor: "rgba(102,153,255,0.5)",
        cornerStrokeColor: null,
        cornerStyle: "rect",
        cornerDashArray: null,
        centeredScaling: !1,
        centeredRotation: !0,
        fill: "rgb(0,0,0)",
        fillRule: "nonzero",
        globalCompositeOperation: "source-over",
        backgroundColor: "",
        selectionBackgroundColor: "",
        stroke: null,
        strokeWidth: 1,
        strokeDashArray: null,
        strokeDashOffset: 0,
        strokeLineCap: "butt",
        strokeLineJoin: "miter",
        strokeMiterLimit: 4,
        shadow: null,
        borderOpacityWhenMoving: .4,
        borderScaleFactor: 1,
        transformMatrix: null,
        minScaleLimit: 0,
        selectable: !0,
        evented: !0,
        visible: !0,
        hasControls: !0,
        hasBorders: !0,
        hasRotatingPoint: !0,
        rotatingPointOffset: 40,
        perPixelTargetFind: !1,
        includeDefaultValues: !0,
        clipTo: null,
        lockMovementX: !1,
        lockMovementY: !1,
        lockRotation: !1,
        lockScalingX: !1,
        lockScalingY: !1,
        lockUniScaling: !1,
        lockSkewingX: !1,
        lockSkewingY: !1,
        lockScalingFlip: !1,
        excludeFromExport: !1,
        objectCaching: c,
        statefullCache: !1,
        noScaleCache: !0,
        strokeUniform: !1,
        dirty: !0,
        __corner: 0,
        paintFirst: "fill",
        stateProperties: "top left width height scaleX scaleY flipX flipY originX originY transformMatrix stroke strokeWidth strokeDashArray strokeLineCap strokeDashOffset strokeLineJoin strokeMiterLimit angle opacity fill globalCompositeOperation shadow clipTo visible backgroundColor skewX skewY fillRule paintFirst clipPath strokeUniform".split(" "),
        cacheProperties: "fill stroke strokeWidth strokeDashArray width height paintFirst strokeUniform strokeLineCap strokeDashOffset strokeLineJoin strokeMiterLimit backgroundColor clipPath".split(" "),
        clipPath: void 0,
        inverted: !1,
        absolutePositioned: !1,
        initialize: function (t) {
            t && this.setOptions(t)
        },
        _createCacheCanvas: function () {
            this._cacheProperties = {}, this._cacheCanvas = e.util.createCanvasElement(), this._cacheContext = this._cacheCanvas.getContext("2d"), this._updateCacheCanvas(), this.dirty = !0
        },
        _limitCacheSize: function (t) {
            var i = e.perfLimitSizeTotal, n = t.width, r = t.height, o = e.maxCacheSideLimit, s = e.minCacheSideLimit;
            if (n <= o && r <= o && n * r <= i) return n < s && (t.width = s), r < s && (t.height = s), t;
            var a = n / r, c = e.util.limitDimsByArea(a, i), l = e.util.capValue, h = l(s, c.x, o), u = l(s, c.y, o);
            return h < n && (t.zoomX /= n / h, t.width = h, t.capped = !0), u < r && (t.zoomY /= r / u, t.height = u, t.capped = !0), t
        },
        _getCacheCanvasDimensions: function () {
            var t = this.getTotalObjectScaling(), e = this._getTransformedDimensions(0, 0),
                i = e.x * t.scaleX / this.scaleX, n = e.y * t.scaleY / this.scaleY;
            return {width: i + 2, height: n + 2, zoomX: t.scaleX, zoomY: t.scaleY, x: i, y: n}
        },
        _updateCacheCanvas: function () {
            var t = this.canvas;
            if (this.noScaleCache && t && t._currentTransform) {
                var i = t._currentTransform.target, n = t._currentTransform.action;
                if (this === i && n.slice && "scale" === n.slice(0, 5)) return !1
            }
            var r, o, s = this._cacheCanvas, a = this._limitCacheSize(this._getCacheCanvasDimensions()),
                c = e.minCacheSideLimit, l = a.width, h = a.height, u = a.zoomX, f = a.zoomY,
                d = l !== this.cacheWidth || h !== this.cacheHeight, p = this.zoomX !== u || this.zoomY !== f,
                g = d || p, v = 0, m = 0, _ = !1;
            if (d) {
                var b = this._cacheCanvas.width, y = this._cacheCanvas.height, x = b < l || y < h;
                _ = x || (l < .9 * b || h < .9 * y) && c < b && c < y, x && !a.capped && (c < l || c < h) && (v = .1 * l, m = .1 * h)
            }
            return !!g && (_ ? (s.width = Math.ceil(l + v), s.height = Math.ceil(h + m)) : (this._cacheContext.setTransform(1, 0, 0, 1, 0, 0), this._cacheContext.clearRect(0, 0, s.width, s.height)), r = a.x / 2, o = a.y / 2, this.cacheTranslationX = Math.round(s.width / 2 - r) + r, this.cacheTranslationY = Math.round(s.height / 2 - o) + o, this.cacheWidth = l, this.cacheHeight = h, this._cacheContext.translate(this.cacheTranslationX, this.cacheTranslationY), this._cacheContext.scale(u, f), this.zoomX = u, this.zoomY = f, !0)
        },
        setOptions: function (t) {
            this._setOptions(t), this._initGradient(t.fill, "fill"), this._initGradient(t.stroke, "stroke"), this._initClipping(t), this._initPattern(t.fill, "fill"), this._initPattern(t.stroke, "stroke")
        },
        transform: function (t) {
            var e;
            e = this.group && !this.group._transformDone ? this.calcTransformMatrix() : this.calcOwnMatrix(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5])
        },
        toObject: function (t) {
            var i = e.Object.NUM_FRACTION_DIGITS, n = {
                type: this.type,
                version: e.version,
                originX: this.originX,
                originY: this.originY,
                left: r(this.left, i),
                top: r(this.top, i),
                width: r(this.width, i),
                height: r(this.height, i),
                fill: this.fill && this.fill.toObject ? this.fill.toObject() : this.fill,
                stroke: this.stroke && this.stroke.toObject ? this.stroke.toObject() : this.stroke,
                strokeWidth: r(this.strokeWidth, i),
                strokeDashArray: this.strokeDashArray ? this.strokeDashArray.concat() : this.strokeDashArray,
                strokeLineCap: this.strokeLineCap,
                strokeDashOffset: this.strokeDashOffset,
                strokeLineJoin: this.strokeLineJoin,
                strokeMiterLimit: r(this.strokeMiterLimit, i),
                scaleX: r(this.scaleX, i),
                scaleY: r(this.scaleY, i),
                angle: r(this.angle, i),
                flipX: this.flipX,
                flipY: this.flipY,
                opacity: r(this.opacity, i),
                shadow: this.shadow && this.shadow.toObject ? this.shadow.toObject() : this.shadow,
                visible: this.visible,
                clipTo: this.clipTo && String(this.clipTo),
                backgroundColor: this.backgroundColor,
                fillRule: this.fillRule,
                paintFirst: this.paintFirst,
                globalCompositeOperation: this.globalCompositeOperation,
                transformMatrix: this.transformMatrix ? this.transformMatrix.concat() : null,
                skewX: r(this.skewX, i),
                skewY: r(this.skewY, i)
            };
            return this.clipPath && (n.clipPath = this.clipPath.toObject(t), n.clipPath.inverted = this.clipPath.inverted, n.clipPath.absolutePositioned = this.clipPath.absolutePositioned), e.util.populateWithProperties(this, n, t), this.includeDefaultValues || (n = this._removeDefaultValues(n)), n
        },
        toDatalessObject: function (t) {
            return this.toObject(t)
        },
        _removeDefaultValues: function (t) {
            var i = e.util.getKlass(t.type).prototype;
            return i.stateProperties.forEach((function (e) {
                "left" !== e && "top" !== e && (t[e] === i[e] && delete t[e], "[object Array]" === Object.prototype.toString.call(t[e]) && "[object Array]" === Object.prototype.toString.call(i[e]) && 0 === t[e].length && 0 === i[e].length && delete t[e])
            })), t
        },
        toString: function () {
            return "#<fabric." + o(this.type) + ">"
        },
        getObjectScaling: function () {
            var t = this.scaleX, e = this.scaleY;
            if (this.group) {
                var i = this.group.getObjectScaling();
                t *= i.scaleX, e *= i.scaleY
            }
            return {scaleX: t, scaleY: e}
        },
        getTotalObjectScaling: function () {
            var t = this.getObjectScaling(), e = t.scaleX, i = t.scaleY;
            if (this.canvas) {
                var n = this.canvas.getZoom(), r = this.canvas.getRetinaScaling();
                e *= n * r, i *= n * r
            }
            return {scaleX: e, scaleY: i}
        },
        getObjectOpacity: function () {
            var t = this.opacity;
            return this.group && (t *= this.group.getObjectOpacity()), t
        },
        _set: function (t, i) {
            var n = "scaleX" === t || "scaleY" === t, r = this[t] !== i, o = !1;
            return n && (i = this._constrainScale(i)), "scaleX" === t && i < 0 ? (this.flipX = !this.flipX, i *= -1) : "scaleY" === t && i < 0 ? (this.flipY = !this.flipY, i *= -1) : "shadow" !== t || !i || i instanceof e.Shadow ? "dirty" === t && this.group && this.group.set("dirty", i) : i = new e.Shadow(i), this[t] = i, r && (o = this.group && this.group.isOnACache(), -1 < this.cacheProperties.indexOf(t) ? (this.dirty = !0, o && this.group.set("dirty", !0)) : o && -1 < this.stateProperties.indexOf(t) && this.group.set("dirty", !0)), this
        },
        setOnGroup: function () {
        },
        getViewportTransform: function () {
            return this.canvas && this.canvas.viewportTransform ? this.canvas.viewportTransform : e.iMatrix.concat()
        },
        isNotVisible: function () {
            return 0 === this.opacity || 0 === this.width && 0 === this.height && 0 === this.strokeWidth || !this.visible
        },
        render: function (t) {
            this.isNotVisible() || this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen() || (t.save(), this._setupCompositeOperation(t), this.drawSelectionBackground(t), this.transform(t), this._setOpacity(t), this._setShadow(t, this), this.transformMatrix && t.transform.apply(t, this.transformMatrix), this.clipTo && e.util.clipContext(this, t), this.shouldCache() ? (this.renderCache(), this.drawCacheOnCanvas(t)) : (this._removeCacheCanvas(), this.dirty = !1, this.drawObject(t), this.objectCaching && this.statefullCache && this.saveState({propertySet: "cacheProperties"})), this.clipTo && t.restore(), t.restore())
        },
        renderCache: function (t) {
            t = t || {}, this._cacheCanvas || this._createCacheCanvas(), this.isCacheDirty() && (this.statefullCache && this.saveState({propertySet: "cacheProperties"}), this.drawObject(this._cacheContext, t.forClipping), this.dirty = !1)
        },
        _removeCacheCanvas: function () {
            this._cacheCanvas = null, this.cacheWidth = 0, this.cacheHeight = 0
        },
        hasStroke: function () {
            return this.stroke && "transparent" !== this.stroke && 0 !== this.strokeWidth
        },
        hasFill: function () {
            return this.fill && "transparent" !== this.fill
        },
        needsItsOwnCache: function () {
            return !("stroke" !== this.paintFirst || !this.hasFill() || !this.hasStroke() || "object" != typeof this.shadow) || !!this.clipPath
        },
        shouldCache: function () {
            return this.ownCaching = this.needsItsOwnCache() || this.objectCaching && (!this.group || !this.group.isOnACache()), this.ownCaching
        },
        willDrawShadow: function () {
            return !!this.shadow && (0 !== this.shadow.offsetX || 0 !== this.shadow.offsetY)
        },
        drawClipPathOnCache: function (t) {
            var i = this.clipPath;
            if (t.save(), i.inverted ? t.globalCompositeOperation = "destination-out" : t.globalCompositeOperation = "destination-in", i.absolutePositioned) {
                var n = e.util.invertTransform(this.calcTransformMatrix());
                t.transform(n[0], n[1], n[2], n[3], n[4], n[5])
            }
            i.transform(t), t.scale(1 / i.zoomX, 1 / i.zoomY), t.drawImage(i._cacheCanvas, -i.cacheTranslationX, -i.cacheTranslationY), t.restore()
        },
        drawObject: function (t, e) {
            var i = this.fill, n = this.stroke;
            e ? (this.fill = "black", this.stroke = "", this._setClippingProperties(t)) : (this._renderBackground(t), this._setStrokeStyles(t, this), this._setFillStyles(t, this)), this._render(t), this._drawClipPath(t), this.fill = i, this.stroke = n
        },
        _drawClipPath: function (t) {
            var e = this.clipPath;
            e && (e.canvas = this.canvas, e.shouldCache(), e._transformDone = !0, e.renderCache({forClipping: !0}), this.drawClipPathOnCache(t))
        },
        drawCacheOnCanvas: function (t) {
            t.scale(1 / this.zoomX, 1 / this.zoomY), t.drawImage(this._cacheCanvas, -this.cacheTranslationX, -this.cacheTranslationY)
        },
        isCacheDirty: function (t) {
            if (this.isNotVisible()) return !1;
            if (this._cacheCanvas && !t && this._updateCacheCanvas()) return !0;
            if (this.dirty || this.clipPath && this.clipPath.absolutePositioned || this.statefullCache && this.hasStateChanged("cacheProperties")) {
                if (this._cacheCanvas && !t) {
                    var e = this.cacheWidth / this.zoomX, i = this.cacheHeight / this.zoomY;
                    this._cacheContext.clearRect(-e / 2, -i / 2, e, i)
                }
                return !0
            }
            return !1
        },
        _renderBackground: function (t) {
            if (this.backgroundColor) {
                var e = this._getNonTransformedDimensions();
                t.fillStyle = this.backgroundColor, t.fillRect(-e.x / 2, -e.y / 2, e.x, e.y), this._removeShadow(t)
            }
        },
        _setOpacity: function (t) {
            this.group && !this.group._transformDone ? t.globalAlpha = this.getObjectOpacity() : t.globalAlpha *= this.opacity
        },
        _setStrokeStyles: function (t, e) {
            e.stroke && (t.lineWidth = e.strokeWidth, t.lineCap = e.strokeLineCap, t.lineDashOffset = e.strokeDashOffset, t.lineJoin = e.strokeLineJoin, t.miterLimit = e.strokeMiterLimit, t.strokeStyle = e.stroke.toLive ? e.stroke.toLive(t, this) : e.stroke)
        },
        _setFillStyles: function (t, e) {
            e.fill && (t.fillStyle = e.fill.toLive ? e.fill.toLive(t, this) : e.fill)
        },
        _setClippingProperties: function (t) {
            t.globalAlpha = 1, t.strokeStyle = "transparent", t.fillStyle = "#000000"
        },
        _setLineDash: function (t, e, i) {
            e && (1 & e.length && e.push.apply(e, e), a ? t.setLineDash(e) : i && i(t), this.strokeUniform && t.setLineDash(t.getLineDash().map((function (e) {
                return e * t.lineWidth
            }))))
        },
        _renderControls: function (t, i) {
            var n, r, o, a = this.getViewportTransform(), c = this.calcTransformMatrix();
            r = void 0 !== (i = i || {}).hasBorders ? i.hasBorders : this.hasBorders, o = void 0 !== i.hasControls ? i.hasControls : this.hasControls, c = e.util.multiplyTransformMatrices(a, c), n = e.util.qrDecompose(c), t.save(), t.translate(n.translateX, n.translateY), t.lineWidth = 1 * this.borderScaleFactor, this.group || (t.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1), i.forActiveSelection ? (t.rotate(s(n.angle)), r && this.drawBordersInGroup(t, n, i)) : (t.rotate(s(this.angle)), r && this.drawBorders(t, i)), o && this.drawControls(t, i), t.restore()
        },
        _setShadow: function (t) {
            if (this.shadow) {
                var i, n = this.shadow, r = this.canvas, o = r && r.viewportTransform[0] || 1,
                    s = r && r.viewportTransform[3] || 1;
                i = n.nonScaling ? {
                    scaleX: 1,
                    scaleY: 1
                } : this.getObjectScaling(), r && r._isRetinaScaling() && (o *= e.devicePixelRatio, s *= e.devicePixelRatio), t.shadowColor = n.color, t.shadowBlur = n.blur * e.browserShadowBlurConstant * (o + s) * (i.scaleX + i.scaleY) / 4, t.shadowOffsetX = n.offsetX * o * i.scaleX, t.shadowOffsetY = n.offsetY * s * i.scaleY
            }
        },
        _removeShadow: function (t) {
            this.shadow && (t.shadowColor = "", t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0)
        },
        _applyPatternGradientTransform: function (t, e) {
            if (!e || !e.toLive) return {offsetX: 0, offsetY: 0};
            var i = e.gradientTransform || e.patternTransform, n = -this.width / 2 + e.offsetX || 0,
                r = -this.height / 2 + e.offsetY || 0;
            return "percentage" === e.gradientUnits ? t.transform(this.width, 0, 0, this.height, n, r) : t.transform(1, 0, 0, 1, n, r), i && t.transform(i[0], i[1], i[2], i[3], i[4], i[5]), {
                offsetX: n,
                offsetY: r
            }
        },
        _renderPaintInOrder: function (t) {
            "stroke" === this.paintFirst ? (this._renderStroke(t), this._renderFill(t)) : (this._renderFill(t), this._renderStroke(t))
        },
        _render: function () {
        },
        _renderFill: function (t) {
            this.fill && (t.save(), this._applyPatternGradientTransform(t, this.fill), "evenodd" === this.fillRule ? t.fill("evenodd") : t.fill(), t.restore())
        },
        _renderStroke: function (t) {
            this.stroke && 0 !== this.strokeWidth && (this.shadow && !this.shadow.affectStroke && this._removeShadow(t), t.save(), this.strokeUniform && t.scale(1 / this.scaleX, 1 / this.scaleY), this._setLineDash(t, this.strokeDashArray, this._renderDashedStroke), this.stroke.toLive && "percentage" === this.stroke.gradientUnits ? this._applyPatternForTransformedGradient(t, this.stroke) : this._applyPatternGradientTransform(t, this.stroke), t.stroke(), t.restore())
        },
        _applyPatternForTransformedGradient: function (t, i) {
            var n, r = this._limitCacheSize(this._getCacheCanvasDimensions()), o = e.util.createCanvasElement(),
                s = this.canvas.getRetinaScaling(), a = r.x / this.scaleX / s, c = r.y / this.scaleY / s;
            o.width = a, o.height = c, (n = o.getContext("2d")).beginPath(), n.moveTo(0, 0), n.lineTo(a, 0), n.lineTo(a, c), n.lineTo(0, c), n.closePath(), n.translate(a / 2, c / 2), n.scale(r.zoomX / this.scaleX / s, r.zoomY / this.scaleY / s), this._applyPatternGradientTransform(n, i), n.fillStyle = i.toLive(t), n.fill(), t.translate(-this.width / 2 - this.strokeWidth / 2, -this.height / 2 - this.strokeWidth / 2), t.scale(s * this.scaleX / r.zoomX, s * this.scaleY / r.zoomY), t.strokeStyle = n.createPattern(o, "no-repeat")
        },
        _findCenterFromElement: function () {
            return {x: this.left + this.width / 2, y: this.top + this.height / 2}
        },
        _assignTransformMatrixProps: function () {
            if (this.transformMatrix) {
                var t = e.util.qrDecompose(this.transformMatrix);
                this.flipX = !1, this.flipY = !1, this.set("scaleX", t.scaleX), this.set("scaleY", t.scaleY), this.angle = t.angle, this.skewX = t.skewX, this.skewY = 0
            }
        },
        _removeTransformMatrix: function (t) {
            var i = this._findCenterFromElement();
            this.transformMatrix && (this._assignTransformMatrixProps(), i = e.util.transformPoint(i, this.transformMatrix)), this.transformMatrix = null, t && (this.scaleX *= t.scaleX, this.scaleY *= t.scaleY, this.cropX = t.cropX, this.cropY = t.cropY, i.x += t.offsetLeft, i.y += t.offsetTop, this.width = t.width, this.height = t.height), this.setPositionByOrigin(i, "center", "center")
        },
        clone: function (t, i) {
            var n = this.toObject(i);
            this.constructor.fromObject ? this.constructor.fromObject(n, t) : e.Object._fromObject("Object", n, t)
        },
        cloneAsImage: function (t, i) {
            var n = this.toCanvasElement(i);
            return t && t(new e.Image(n)), this
        },
        toCanvasElement: function (t) {
            t || (t = {});
            var i = e.util, n = i.saveObjectTransform(this), r = this.shadow, o = Math.abs,
                s = (t.multiplier || 1) * (t.enableRetinaScaling ? e.devicePixelRatio : 1);
            t.withoutTransform && i.resetObjectTransform(this), t.withoutShadow && (this.shadow = null);
            var a, c, l = e.util.createCanvasElement(), h = this.getBoundingRect(!0, !0), u = this.shadow,
                f = {x: 0, y: 0};
            u && (c = u.blur, a = u.nonScaling ? {
                scaleX: 1,
                scaleY: 1
            } : this.getObjectScaling(), f.x = 2 * Math.round(o(u.offsetX) + c) * o(a.scaleX), f.y = 2 * Math.round(o(u.offsetY) + c) * o(a.scaleY)), l.width = h.width + f.x, l.height = h.height + f.y, l.width += l.width % 2 ? 2 - l.width % 2 : 0, l.height += l.height % 2 ? 2 - l.height % 2 : 0;
            var d = new e.StaticCanvas(l, {enableRetinaScaling: !1, renderOnAddRemove: !1, skipOffscreen: !1});
            "jpeg" === t.format && (d.backgroundColor = "#fff"), this.setPositionByOrigin(new e.Point(d.width / 2, d.height / 2), "center", "center");
            var p = this.canvas;
            d.add(this);
            var g = d.toCanvasElement(s || 1, t);
            return this.shadow = r, this.canvas = p, this.set(n).setCoords(), d._objects = [], d.dispose(), d = null, g
        },
        toDataURL: function (t) {
            return t || (t = {}), e.util.toDataURL(this.toCanvasElement(t), t.format || "png", t.quality || 1)
        },
        isType: function (t) {
            return this.type === t
        },
        complexity: function () {
            return 1
        },
        toJSON: function (t) {
            return this.toObject(t)
        },
        setGradient: function (t, i) {
            i || (i = {});
            var n = {colorStops: []};
            return n.type = i.type || (i.r1 || i.r2 ? "radial" : "linear"), n.coords = {
                x1: i.x1,
                y1: i.y1,
                x2: i.x2,
                y2: i.y2
            }, n.gradientUnits = i.gradientUnits || "pixels", (i.r1 || i.r2) && (n.coords.r1 = i.r1, n.coords.r2 = i.r2), n.gradientTransform = i.gradientTransform, e.Gradient.prototype.addColorStop.call(n, i.colorStops), this.set(t, e.Gradient.forObject(this, n))
        },
        setPatternFill: function (t, i) {
            return this.set("fill", new e.Pattern(t, i))
        },
        setShadow: function (t) {
            return this.set("shadow", t ? new e.Shadow(t) : null)
        },
        setColor: function (t) {
            return this.set("fill", t), this
        },
        rotate: function (t) {
            var e = ("center" !== this.originX || "center" !== this.originY) && this.centeredRotation;
            return e && this._setOriginToCenter(), this.set("angle", t), e && this._resetOrigin(), this
        },
        centerH: function () {
            return this.canvas && this.canvas.centerObjectH(this), this
        },
        viewportCenterH: function () {
            return this.canvas && this.canvas.viewportCenterObjectH(this), this
        },
        centerV: function () {
            return this.canvas && this.canvas.centerObjectV(this), this
        },
        viewportCenterV: function () {
            return this.canvas && this.canvas.viewportCenterObjectV(this), this
        },
        center: function () {
            return this.canvas && this.canvas.centerObject(this), this
        },
        viewportCenter: function () {
            return this.canvas && this.canvas.viewportCenterObject(this), this
        },
        getLocalPointer: function (t, i) {
            i = i || this.canvas.getPointer(t);
            var n = new e.Point(i.x, i.y), r = this._getLeftTopCoords();
            return this.angle && (n = e.util.rotatePoint(n, r, s(-this.angle))), {x: n.x - r.x, y: n.y - r.y}
        },
        _setupCompositeOperation: function (t) {
            this.globalCompositeOperation && (t.globalCompositeOperation = this.globalCompositeOperation)
        }
    }), e.util.createAccessors && e.util.createAccessors(e.Object), i(e.Object.prototype, e.Observable), e.Object.NUM_FRACTION_DIGITS = 2, e.Object._fromObject = function (t, i, r, o) {
        var s = e[t];
        i = n(i, !0), e.util.enlivenPatterns([i.fill, i.stroke], (function (t) {
            void 0 !== t[0] && (i.fill = t[0]), void 0 !== t[1] && (i.stroke = t[1]), e.util.enlivenObjects([i.clipPath], (function (t) {
                i.clipPath = t[0];
                var e = o ? new s(i[o], i) : new s(i);
                r && r(e)
            }))
        }))
    }, e.Object.__uid = 0)
}("undefined" != typeof exports ? exports : this), function () {
    var t = fabric.util.degreesToRadians, e = {left: -.5, center: 0, right: .5}, i = {top: -.5, center: 0, bottom: .5};
    fabric.util.object.extend(fabric.Object.prototype, {
        translateToGivenOrigin: function (t, n, r, o, s) {
            var a, c, l, h = t.x, u = t.y;
            return "string" == typeof n ? n = e[n] : n -= .5, "string" == typeof o ? o = e[o] : o -= .5, "string" == typeof r ? r = i[r] : r -= .5, "string" == typeof s ? s = i[s] : s -= .5, c = s - r, ((a = o - n) || c) && (l = this._getTransformedDimensions(), h = t.x + a * l.x, u = t.y + c * l.y), new fabric.Point(h, u)
        }, translateToCenterPoint: function (e, i, n) {
            var r = this.translateToGivenOrigin(e, i, n, "center", "center");
            return this.angle ? fabric.util.rotatePoint(r, e, t(this.angle)) : r
        }, translateToOriginPoint: function (e, i, n) {
            var r = this.translateToGivenOrigin(e, "center", "center", i, n);
            return this.angle ? fabric.util.rotatePoint(r, e, t(this.angle)) : r
        }, getCenterPoint: function () {
            var t = new fabric.Point(this.left, this.top);
            return this.translateToCenterPoint(t, this.originX, this.originY)
        }, getPointByOrigin: function (t, e) {
            var i = this.getCenterPoint();
            return this.translateToOriginPoint(i, t, e)
        }, toLocalPoint: function (e, i, n) {
            var r, o, s = this.getCenterPoint();
            return r = void 0 !== i && void 0 !== n ? this.translateToGivenOrigin(s, "center", "center", i, n) : new fabric.Point(this.left, this.top), o = new fabric.Point(e.x, e.y), this.angle && (o = fabric.util.rotatePoint(o, s, -t(this.angle))), o.subtractEquals(r)
        }, setPositionByOrigin: function (t, e, i) {
            var n = this.translateToCenterPoint(t, e, i),
                r = this.translateToOriginPoint(n, this.originX, this.originY);
            this.set("left", r.x), this.set("top", r.y)
        }, adjustPosition: function (i) {
            var n, r, o = t(this.angle), s = this.getScaledWidth(), a = fabric.util.cos(o) * s,
                c = fabric.util.sin(o) * s;
            n = "string" == typeof this.originX ? e[this.originX] : this.originX - .5, r = "string" == typeof i ? e[i] : i - .5, this.left += a * (r - n), this.top += c * (r - n), this.setCoords(), this.originX = i
        }, _setOriginToCenter: function () {
            this._originalOriginX = this.originX, this._originalOriginY = this.originY;
            var t = this.getCenterPoint();
            this.originX = "center", this.originY = "center", this.left = t.x, this.top = t.y
        }, _resetOrigin: function () {
            var t = this.translateToOriginPoint(this.getCenterPoint(), this._originalOriginX, this._originalOriginY);
            this.originX = this._originalOriginX, this.originY = this._originalOriginY, this.left = t.x, this.top = t.y, this._originalOriginX = null, this._originalOriginY = null
        }, _getLeftTopCoords: function () {
            return this.translateToOriginPoint(this.getCenterPoint(), "left", "top")
        }
    })
}(), function () {
    var t = fabric.util.degreesToRadians, e = fabric.util.multiplyTransformMatrices, i = fabric.util.transformPoint;
    fabric.util.object.extend(fabric.Object.prototype, {
        oCoords: null, aCoords: null, ownMatrixCache: null, matrixCache: null, getCoords: function (t, e) {
            this.oCoords || this.setCoords();
            var i, n = t ? this.aCoords : this.oCoords;
            return i = e ? this.calcCoords(t) : n, [new fabric.Point(i.tl.x, i.tl.y), new fabric.Point(i.tr.x, i.tr.y), new fabric.Point(i.br.x, i.br.y), new fabric.Point(i.bl.x, i.bl.y)]
        }, intersectsWithRect: function (t, e, i, n) {
            var r = this.getCoords(i, n);
            return "Intersection" === fabric.Intersection.intersectPolygonRectangle(r, t, e).status
        }, intersectsWithObject: function (t, e, i) {
            return "Intersection" === fabric.Intersection.intersectPolygonPolygon(this.getCoords(e, i), t.getCoords(e, i)).status || t.isContainedWithinObject(this, e, i) || this.isContainedWithinObject(t, e, i)
        }, isContainedWithinObject: function (t, e, i) {
            for (var n = this.getCoords(e, i), r = 0, o = t._getImageLines(i ? t.calcCoords(e) : e ? t.aCoords : t.oCoords); r < 4; r++) if (!t.containsPoint(n[r], o)) return !1;
            return !0
        }, isContainedWithinRect: function (t, e, i, n) {
            var r = this.getBoundingRect(i, n);
            return r.left >= t.x && r.left + r.width <= e.x && r.top >= t.y && r.top + r.height <= e.y
        }, containsPoint: function (t, e, i, n) {
            e = e || this._getImageLines(n ? this.calcCoords(i) : i ? this.aCoords : this.oCoords);
            var r = this._findCrossPoints(t, e);
            return 0 !== r && r % 2 == 1
        }, isOnScreen: function (t) {
            if (!this.canvas) return !1;
            for (var e, i = this.canvas.vptCoords.tl, n = this.canvas.vptCoords.br, r = this.getCoords(!0, t), o = 0; o < 4; o++) if ((e = r[o]).x <= n.x && e.x >= i.x && e.y <= n.y && e.y >= i.y) return !0;
            return !!this.intersectsWithRect(i, n, !0, t) || this._containsCenterOfCanvas(i, n, t)
        }, _containsCenterOfCanvas: function (t, e, i) {
            var n = {x: (t.x + e.x) / 2, y: (t.y + e.y) / 2};
            return !!this.containsPoint(n, null, !0, i)
        }, isPartiallyOnScreen: function (t) {
            if (!this.canvas) return !1;
            var e = this.canvas.vptCoords.tl, i = this.canvas.vptCoords.br;
            return !!this.intersectsWithRect(e, i, !0, t) || this._containsCenterOfCanvas(e, i, t)
        }, _getImageLines: function (t) {
            return {
                topline: {o: t.tl, d: t.tr},
                rightline: {o: t.tr, d: t.br},
                bottomline: {o: t.br, d: t.bl},
                leftline: {o: t.bl, d: t.tl}
            }
        }, _findCrossPoints: function (t, e) {
            var i, n, r, o = 0;
            for (var s in e) if (!((r = e[s]).o.y < t.y && r.d.y < t.y || r.o.y >= t.y && r.d.y >= t.y || (r.o.x === r.d.x && r.o.x >= t.x ? n = r.o.x : (i = (r.d.y - r.o.y) / (r.d.x - r.o.x), n = -(t.y - 0 * t.x - (r.o.y - i * r.o.x)) / (0 - i)), n >= t.x && (o += 1), 2 !== o))) break;
            return o
        }, getBoundingRect: function (t, e) {
            var i = this.getCoords(t, e);
            return fabric.util.makeBoundingBoxFromPoints(i)
        }, getScaledWidth: function () {
            return this._getTransformedDimensions().x
        }, getScaledHeight: function () {
            return this._getTransformedDimensions().y
        }, _constrainScale: function (t) {
            return Math.abs(t) < this.minScaleLimit ? t < 0 ? -this.minScaleLimit : this.minScaleLimit : 0 === t ? 1e-4 : t
        }, scale: function (t) {
            return this._set("scaleX", t), this._set("scaleY", t), this.setCoords()
        }, scaleToWidth: function (t, e) {
            var i = this.getBoundingRect(e).width / this.getScaledWidth();
            return this.scale(t / this.width / i)
        }, scaleToHeight: function (t, e) {
            var i = this.getBoundingRect(e).height / this.getScaledHeight();
            return this.scale(t / this.height / i)
        }, calcCoords: function (n) {
            var r = this._calcRotateMatrix(), o = this._calcTranslateMatrix(), s = e(o, r),
                a = this.getViewportTransform(), c = n ? s : e(a, s), l = this._getTransformedDimensions(), h = l.x / 2,
                u = l.y / 2, f = i({x: -h, y: -u}, c), d = i({x: h, y: -u}, c), p = i({x: -h, y: u}, c),
                g = i({x: h, y: u}, c);
            if (!n) {
                var v = this.padding, m = t(this.angle), _ = fabric.util.cos(m), b = fabric.util.sin(m), y = _ * v,
                    x = b * v, w = y + x, C = y - x;
                v && (f.x -= C, f.y -= w, d.x += w, d.y -= C, p.x -= w, p.y += C, g.x += C, g.y += w);
                var S = new fabric.Point((f.x + p.x) / 2, (f.y + p.y) / 2),
                    T = new fabric.Point((d.x + f.x) / 2, (d.y + f.y) / 2),
                    O = new fabric.Point((g.x + d.x) / 2, (g.y + d.y) / 2),
                    E = new fabric.Point((g.x + p.x) / 2, (g.y + p.y) / 2),
                    k = new fabric.Point(T.x + b * this.rotatingPointOffset, T.y - _ * this.rotatingPointOffset)
            }
            var P = {tl: f, tr: d, br: g, bl: p};
            return n || (P.ml = S, P.mt = T, P.mr = O, P.mb = E, P.mtr = k), P
        }, setCoords: function (t, e) {
            return this.oCoords = this.calcCoords(t), e || (this.aCoords = this.calcCoords(!0)), t || this._setCornerCoords && this._setCornerCoords(), this
        }, _calcRotateMatrix: function () {
            return fabric.util.calcRotateMatrix(this)
        }, _calcTranslateMatrix: function () {
            var t = this.getCenterPoint();
            return [1, 0, 0, 1, t.x, t.y]
        }, transformMatrixKey: function (t) {
            var e = "_", i = "";
            return !t && this.group && (i = this.group.transformMatrixKey(t) + e), i + this.top + e + this.left + e + this.scaleX + e + this.scaleY + e + this.skewX + e + this.skewY + e + this.angle + e + this.originX + e + this.originY + e + this.width + e + this.height + e + this.strokeWidth + this.flipX + this.flipY
        }, calcTransformMatrix: function (t) {
            if (t) return this.calcOwnMatrix();
            var i = this.transformMatrixKey(), n = this.matrixCache || (this.matrixCache = {});
            if (n.key === i) return n.value;
            var r = this.calcOwnMatrix();
            return this.group && (r = e(this.group.calcTransformMatrix(), r)), n.key = i, n.value = r
        }, calcOwnMatrix: function () {
            var t = this.transformMatrixKey(!0), e = this.ownMatrixCache || (this.ownMatrixCache = {});
            if (e.key === t) return e.value;
            var i = this._calcTranslateMatrix();
            return this.translateX = i[4], this.translateY = i[5], e.key = t, e.value = fabric.util.composeMatrix(this), e.value
        }, _calcDimensionsTransformMatrix: function (t, e, i) {
            return fabric.util.calcDimensionsMatrix({
                skewX: t,
                skewY: e,
                scaleX: this.scaleX * (i && this.flipX ? -1 : 1),
                scaleY: this.scaleY * (i && this.flipY ? -1 : 1)
            })
        }, _getNonTransformedDimensions: function () {
            var t = this.strokeWidth;
            return {x: this.width + t, y: this.height + t}
        }, _getTransformedDimensions: function (t, e) {
            void 0 === t && (t = this.skewX), void 0 === e && (e = this.skewY);
            var i, n, r = this._getNonTransformedDimensions(), o = 0 === t && 0 === e;
            if (this.strokeUniform ? (i = this.width, n = this.height) : (i = r.x, n = r.y), o) return this._finalizeDimensions(i * this.scaleX, n * this.scaleY);
            var s = [{x: -(i /= 2), y: -(n /= 2)}, {x: i, y: -n}, {x: -i, y: n}, {x: i, y: n}],
                a = fabric.util.calcDimensionsMatrix({
                    scaleX: this.scaleX,
                    scaleY: this.scaleY,
                    skewX: this.skewX,
                    skewY: this.skewY
                }), c = fabric.util.makeBoundingBoxFromPoints(s, a);
            return this._finalizeDimensions(c.width, c.height)
        }, _finalizeDimensions: function (t, e) {
            return this.strokeUniform ? {x: t + this.strokeWidth, y: e + this.strokeWidth} : {x: t, y: e}
        }, _calculateCurrentDimensions: function () {
            var t = this.getViewportTransform(), e = this._getTransformedDimensions();
            return fabric.util.transformPoint(e, t, !0).scalarAdd(2 * this.padding)
        }
    })
}(), fabric.util.object.extend(fabric.Object.prototype, {
    sendToBack: function () {
        return this.group ? fabric.StaticCanvas.prototype.sendToBack.call(this.group, this) : this.canvas.sendToBack(this), this
    }, bringToFront: function () {
        return this.group ? fabric.StaticCanvas.prototype.bringToFront.call(this.group, this) : this.canvas.bringToFront(this), this
    }, sendBackwards: function (t) {
        return this.group ? fabric.StaticCanvas.prototype.sendBackwards.call(this.group, this, t) : this.canvas.sendBackwards(this, t), this
    }, bringForward: function (t) {
        return this.group ? fabric.StaticCanvas.prototype.bringForward.call(this.group, this, t) : this.canvas.bringForward(this, t), this
    }, moveTo: function (t) {
        return this.group && "activeSelection" !== this.group.type ? fabric.StaticCanvas.prototype.moveTo.call(this.group, this, t) : this.canvas.moveTo(this, t), this
    }
}), function () {
    function t(t, e) {
        if (e) {
            if (e.toLive) return t + ": url(#SVGID_" + e.id + "); ";
            var i = new fabric.Color(e), n = t + ": " + i.toRgb() + "; ", r = i.getAlpha();
            return 1 !== r && (n += t + "-opacity: " + r.toString() + "; "), n
        }
        return t + ": none; "
    }

    var e = fabric.util.toFixed;
    fabric.util.object.extend(fabric.Object.prototype, {
        getSvgStyles: function (e) {
            var i = this.fillRule ? this.fillRule : "nonzero", n = this.strokeWidth ? this.strokeWidth : "0",
                r = this.strokeDashArray ? this.strokeDashArray.join(" ") : "none",
                o = this.strokeDashOffset ? this.strokeDashOffset : "0",
                s = this.strokeLineCap ? this.strokeLineCap : "butt",
                a = this.strokeLineJoin ? this.strokeLineJoin : "miter",
                c = this.strokeMiterLimit ? this.strokeMiterLimit : "4",
                l = void 0 !== this.opacity ? this.opacity : "1", h = this.visible ? "" : " visibility: hidden;",
                u = e ? "" : this.getSvgFilter(), f = t("fill", this.fill);
            return [t("stroke", this.stroke), "stroke-width: ", n, "; ", "stroke-dasharray: ", r, "; ", "stroke-linecap: ", s, "; ", "stroke-dashoffset: ", o, "; ", "stroke-linejoin: ", a, "; ", "stroke-miterlimit: ", c, "; ", f, "fill-rule: ", i, "; ", "opacity: ", l, ";", u, h].join("")
        }, getSvgSpanStyles: function (e, i) {
            var n = "; ",
                r = e.fontFamily ? "font-family: " + (-1 === e.fontFamily.indexOf("'") && -1 === e.fontFamily.indexOf('"') ? "'" + e.fontFamily + "'" : e.fontFamily) + n : "",
                o = e.strokeWidth ? "stroke-width: " + e.strokeWidth + n : "",
                s = e.fontSize ? "font-size: " + e.fontSize + "px" + n : "",
                a = e.fontStyle ? "font-style: " + e.fontStyle + n : "",
                c = e.fontWeight ? "font-weight: " + e.fontWeight + n : "", l = e.fill ? t("fill", e.fill) : "",
                h = e.stroke ? t("stroke", e.stroke) : "", u = this.getSvgTextDecoration(e);
            return u && (u = "text-decoration: " + u + n), [h, o, r, s, a, c, u, l, e.deltaY ? "baseline-shift: " + -e.deltaY + "; " : "", i ? "white-space: pre; " : ""].join("")
        }, getSvgTextDecoration: function (t) {
            return "overline" in t || "underline" in t || "linethrough" in t ? (t.overline ? "overline " : "") + (t.underline ? "underline " : "") + (t.linethrough ? "line-through " : "") : ""
        }, getSvgFilter: function () {
            return this.shadow ? "filter: url(#SVGID_" + this.shadow.id + ");" : ""
        }, getSvgCommons: function () {
            return [this.id ? 'id="' + this.id + '" ' : "", this.clipPath ? 'clip-path="url(#' + this.clipPath.clipPathId + ')" ' : ""].join("")
        }, getSvgTransform: function (t, e) {
            var i = t ? this.calcTransformMatrix() : this.calcOwnMatrix();
            return 'transform="' + fabric.util.matrixToSVG(i) + (e || "") + this.getSvgTransformMatrix() + '" '
        }, getSvgTransformMatrix: function () {
            return this.transformMatrix ? " " + fabric.util.matrixToSVG(this.transformMatrix) : ""
        }, _setSVGBg: function (t) {
            if (this.backgroundColor) {
                var i = fabric.Object.NUM_FRACTION_DIGITS;
                t.push("\t\t<rect ", this._getFillAttributes(this.backgroundColor), ' x="', e(-this.width / 2, i), '" y="', e(-this.height / 2, i), '" width="', e(this.width, i), '" height="', e(this.height, i), '"></rect>\n')
            }
        }, toSVG: function (t) {
            return this._createBaseSVGMarkup(this._toSVG(t), {reviver: t})
        }, toClipPathSVG: function (t) {
            return "\t" + this._createBaseClipPathSVGMarkup(this._toSVG(t), {reviver: t})
        }, _createBaseClipPathSVGMarkup: function (t, e) {
            var i = (e = e || {}).reviver, n = e.additionalTransform || "",
                r = [this.getSvgTransform(!0, n), this.getSvgCommons()].join(""), o = t.indexOf("COMMON_PARTS");
            return t[o] = r, i ? i(t.join("")) : t.join("")
        }, _createBaseSVGMarkup: function (t, e) {
            var i, n, r = (e = e || {}).noStyle, o = e.reviver, s = r ? "" : 'style="' + this.getSvgStyles() + '" ',
                a = e.withShadow ? 'style="' + this.getSvgFilter() + '" ' : "", c = this.clipPath,
                l = this.strokeUniform ? 'vector-effect="non-scaling-stroke" ' : "", h = c && c.absolutePositioned,
                u = this.stroke, f = this.fill, d = this.shadow, p = [], g = t.indexOf("COMMON_PARTS"),
                v = e.additionalTransform;
            return c && (c.clipPathId = "CLIPPATH_" + fabric.Object.__uid++, n = '<clipPath id="' + c.clipPathId + '" >\n' + c.toClipPathSVG(o) + "</clipPath>\n"), h && p.push('<g flag-clip="1" ', a, this.getSvgCommons(), " >\n"), p.push("<g ", this.getSvgTransform(!1), h ? "" : a + this.getSvgCommons(), " >\n"), i = [s, l, r ? "" : this.addPaintOrder(), " ", v ? 'transform="' + v + '" ' : ""].join(""), t[g] = i, f && f.toLive && p.push(f.toSVG(this)), u && u.toLive && p.push(u.toSVG(this)), d && p.push(d.toSVG(this)), c && p.push(n), p.push(t.join("")), p.push("</g>\n"), h && p.push("</g>\n"), o ? o(p.join("")) : p.join("")
        }, addPaintOrder: function () {
            return "fill" !== this.paintFirst ? ' paint-order="' + this.paintFirst + '" ' : ""
        }
    })
}(), function () {
    var t = fabric.util.object.extend, e = "stateProperties";

    function i(e, i, n) {
        var r = {};
        n.forEach((function (t) {
            r[t] = e[t]
        })), t(e[i], r, !0)
    }

    fabric.util.object.extend(fabric.Object.prototype, {
        hasStateChanged: function (t) {
            var i = "_" + (t = t || e);
            return Object.keys(this[i]).length < this[t].length || !function t(e, i, n) {
                if (e === i) return !0;
                if (Array.isArray(e)) {
                    if (!Array.isArray(i) || e.length !== i.length) return !1;
                    for (var r = 0, o = e.length; r < o; r++) if (!t(e[r], i[r])) return !1;
                    return !0
                }
                if (e && "object" == typeof e) {
                    var s, a = Object.keys(e);
                    if (!i || "object" != typeof i || !n && a.length !== Object.keys(i).length) return !1;
                    for (r = 0, o = a.length; r < o; r++) if ("canvas" !== (s = a[r]) && !t(e[s], i[s])) return !1;
                    return !0
                }
            }(this[i], this, !0)
        }, saveState: function (t) {
            var n = t && t.propertySet || e, r = "_" + n;
            return this[r] ? (i(this, r, this[n]), t && t.stateProperties && i(this, r, t.stateProperties), this) : this.setupState(t)
        }, setupState: function (t) {
            var i = (t = t || {}).propertySet || e;
            return this["_" + (t.propertySet = i)] = {}, this.saveState(t), this
        }
    })
}(), function () {
    var t = fabric.util.degreesToRadians;
    fabric.util.object.extend(fabric.Object.prototype, {
        _controlsVisibility: null, _findTargetCorner: function (t) {
            if (!this.hasControls || this.group || !this.canvas || this.canvas._activeObject !== this) return !1;
            var e, i, n = t.x, r = t.y;
            for (var o in this.__corner = 0, this.oCoords) if (this.isControlVisible(o) && ("mtr" !== o || this.hasRotatingPoint) && (!this.get("lockUniScaling") || "mt" !== o && "mr" !== o && "mb" !== o && "ml" !== o) && (i = this._getImageLines(this.oCoords[o].corner), 0 !== (e = this._findCrossPoints({
                x: n,
                y: r
            }, i)) && e % 2 == 1)) return this.__corner = o;
            return !1
        }, _setCornerCoords: function () {
            var e, i, n = this.oCoords, r = t(45 - this.angle), o = .707106 * this.cornerSize,
                s = o * fabric.util.cos(r), a = o * fabric.util.sin(r);
            for (var c in n) e = n[c].x, i = n[c].y, n[c].corner = {
                tl: {x: e - a, y: i - s},
                tr: {x: e + s, y: i - a},
                bl: {x: e - s, y: i + a},
                br: {x: e + a, y: i + s}
            }
        }, drawSelectionBackground: function (e) {
            if (!this.selectionBackgroundColor || this.canvas && !this.canvas.interactive || this.canvas && this.canvas._activeObject !== this) return this;
            e.save();
            var i = this.getCenterPoint(), n = this._calculateCurrentDimensions(), r = this.canvas.viewportTransform;
            return e.translate(i.x, i.y), e.scale(1 / r[0], 1 / r[3]), e.rotate(t(this.angle)), e.fillStyle = this.selectionBackgroundColor, e.fillRect(-n.x / 2, -n.y / 2, n.x, n.y), e.restore(), this
        }, drawBorders: function (t, e) {
            e = e || {};
            var i = this._calculateCurrentDimensions(), n = 1 / this.borderScaleFactor, r = i.x + n, o = i.y + n,
                s = void 0 !== e.hasRotatingPoint ? e.hasRotatingPoint : this.hasRotatingPoint,
                a = void 0 !== e.hasControls ? e.hasControls : this.hasControls,
                c = void 0 !== e.rotatingPointOffset ? e.rotatingPointOffset : this.rotatingPointOffset;
            if (t.save(), t.strokeStyle = e.borderColor || this.borderColor, this._setLineDash(t, e.borderDashArray || this.borderDashArray, null), t.strokeRect(-r / 2, -o / 2, r, o), s && this.isControlVisible("mtr") && a) {
                var l = -o / 2;
                t.beginPath(), t.moveTo(0, l), t.lineTo(0, l - c), t.stroke()
            }
            return t.restore(), this
        }, drawBordersInGroup: function (t, e, i) {
            i = i || {};
            var n = this._getNonTransformedDimensions(),
                r = fabric.util.composeMatrix({scaleX: e.scaleX, scaleY: e.scaleY, skewX: e.skewX}),
                o = fabric.util.transformPoint(n, r), s = 1 / this.borderScaleFactor, a = o.x + s, c = o.y + s;
            return t.save(), this._setLineDash(t, i.borderDashArray || this.borderDashArray, null), t.strokeStyle = i.borderColor || this.borderColor, t.strokeRect(-a / 2, -c / 2, a, c), t.restore(), this
        }, drawControls: function (t, e) {
            e = e || {};
            var i = this._calculateCurrentDimensions(), n = i.x, r = i.y, o = e.cornerSize || this.cornerSize,
                s = -(n + o) / 2, a = -(r + o) / 2,
                c = void 0 !== e.transparentCorners ? e.transparentCorners : this.transparentCorners,
                l = void 0 !== e.hasRotatingPoint ? e.hasRotatingPoint : this.hasRotatingPoint,
                h = c ? "stroke" : "fill";
            return t.save(), t.strokeStyle = t.fillStyle = e.cornerColor || this.cornerColor, this.transparentCorners || (t.strokeStyle = e.cornerStrokeColor || this.cornerStrokeColor), this._setLineDash(t, e.cornerDashArray || this.cornerDashArray, null), this._drawControl("tl", t, h, s, a, e), this._drawControl("tr", t, h, s + n, a, e), this._drawControl("bl", t, h, s, a + r, e), this._drawControl("br", t, h, s + n, a + r, e), this.get("lockUniScaling") || (this._drawControl("mt", t, h, s + n / 2, a, e), this._drawControl("mb", t, h, s + n / 2, a + r, e), this._drawControl("mr", t, h, s + n, a + r / 2, e), this._drawControl("ml", t, h, s, a + r / 2, e)), l && this._drawControl("mtr", t, h, s + n / 2, a - this.rotatingPointOffset, e), t.restore(), this
        }, _drawControl: function (t, e, i, n, r, o) {
            if (o = o || {}, this.isControlVisible(t)) {
                var s = this.cornerSize, a = !this.transparentCorners && this.cornerStrokeColor;
                if ("circle" === (o.cornerStyle || this.cornerStyle)) e.beginPath(), e.arc(n + s / 2, r + s / 2, s / 2, 0, 2 * Math.PI, !1), e[i](), a && e.stroke(); else this.transparentCorners || e.clearRect(n, r, s, s), e[i + "Rect"](n, r, s, s), a && e.strokeRect(n, r, s, s)
            }
        }, isControlVisible: function (t) {
            return this._getControlsVisibility()[t]
        }, setControlVisible: function (t, e) {
            return this._getControlsVisibility()[t] = e, this
        }, setControlsVisibility: function (t) {
            for (var e in t || (t = {}), t) this.setControlVisible(e, t[e]);
            return this
        }, _getControlsVisibility: function () {
            return this._controlsVisibility || (this._controlsVisibility = {
                tl: !0,
                tr: !0,
                br: !0,
                bl: !0,
                ml: !0,
                mt: !0,
                mr: !0,
                mb: !0,
                mtr: !0
            }), this._controlsVisibility
        }, onDeselect: function () {
        }, onSelect: function () {
        }
    })
}(), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    FX_DURATION: 500, fxCenterObjectH: function (t, e) {
        var i = function () {
        }, n = (e = e || {}).onComplete || i, r = e.onChange || i, o = this;
        return fabric.util.animate({
            startValue: t.left,
            endValue: this.getCenter().left,
            duration: this.FX_DURATION,
            onChange: function (e) {
                t.set("left", e), o.requestRenderAll(), r()
            },
            onComplete: function () {
                t.setCoords(), n()
            }
        }), this
    }, fxCenterObjectV: function (t, e) {
        var i = function () {
        }, n = (e = e || {}).onComplete || i, r = e.onChange || i, o = this;
        return fabric.util.animate({
            startValue: t.top,
            endValue: this.getCenter().top,
            duration: this.FX_DURATION,
            onChange: function (e) {
                t.set("top", e), o.requestRenderAll(), r()
            },
            onComplete: function () {
                t.setCoords(), n()
            }
        }), this
    }, fxRemove: function (t, e) {
        var i = function () {
        }, n = (e = e || {}).onComplete || i, r = e.onChange || i, o = this;
        return fabric.util.animate({
            startValue: t.opacity,
            endValue: 0,
            duration: this.FX_DURATION,
            onChange: function (e) {
                t.set("opacity", e), o.requestRenderAll(), r()
            },
            onComplete: function () {
                o.remove(t), n()
            }
        }), this
    }
}), fabric.util.object.extend(fabric.Object.prototype, {
    animate: function () {
        if (arguments[0] && "object" == typeof arguments[0]) {
            var t, e, i = [];
            for (t in arguments[0]) i.push(t);
            for (var n = 0, r = i.length; n < r; n++) t = i[n], e = n !== r - 1, this._animate(t, arguments[0][t], arguments[1], e)
        } else this._animate.apply(this, arguments);
        return this
    }, _animate: function (t, e, i, n) {
        var r, o = this;
        e = e.toString(), i = i ? fabric.util.object.clone(i) : {}, ~t.indexOf(".") && (r = t.split("."));
        var s = r ? this.get(r[0])[r[1]] : this.get(t);
        "from" in i || (i.from = s), e = ~e.indexOf("=") ? s + parseFloat(e.replace("=", "")) : parseFloat(e), fabric.util.animate({
            startValue: i.from,
            endValue: e,
            byValue: i.by,
            easing: i.easing,
            duration: i.duration,
            abort: i.abort && function () {
                return i.abort.call(o)
            },
            onChange: function (e, s, a) {
                r ? o[r[0]][r[1]] = e : o.set(t, e), n || i.onChange && i.onChange(e, s, a)
            },
            onComplete: function (t, e, r) {
                n || (o.setCoords(), i.onComplete && i.onComplete(t, e, r))
            }
        })
    }
}), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.object.extend, n = e.util.object.clone,
        r = {x1: 1, x2: 1, y1: 1, y2: 1}, o = e.StaticCanvas.supports("setLineDash");

    function s(t, e) {
        var i = t.origin, n = t.axis1, r = t.axis2, o = t.dimension, s = e.nearest, a = e.center, c = e.farthest;
        return function () {
            switch (this.get(i)) {
                case s:
                    return Math.min(this.get(n), this.get(r));
                case a:
                    return Math.min(this.get(n), this.get(r)) + .5 * this.get(o);
                case c:
                    return Math.max(this.get(n), this.get(r))
            }
        }
    }

    e.Line ? e.warn("fabric.Line is already defined") : (e.Line = e.util.createClass(e.Object, {
        type: "line",
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        cacheProperties: e.Object.prototype.cacheProperties.concat("x1", "x2", "y1", "y2"),
        initialize: function (t, e) {
            t || (t = [0, 0, 0, 0]), this.callSuper("initialize", e), this.set("x1", t[0]), this.set("y1", t[1]), this.set("x2", t[2]), this.set("y2", t[3]), this._setWidthHeight(e)
        },
        _setWidthHeight: function (t) {
            t || (t = {}), this.width = Math.abs(this.x2 - this.x1), this.height = Math.abs(this.y2 - this.y1), this.left = "left" in t ? t.left : this._getLeftToOriginX(), this.top = "top" in t ? t.top : this._getTopToOriginY()
        },
        _set: function (t, e) {
            return this.callSuper("_set", t, e), void 0 !== r[t] && this._setWidthHeight(), this
        },
        _getLeftToOriginX: s({origin: "originX", axis1: "x1", axis2: "x2", dimension: "width"}, {
            nearest: "left",
            center: "center",
            farthest: "right"
        }),
        _getTopToOriginY: s({origin: "originY", axis1: "y1", axis2: "y2", dimension: "height"}, {
            nearest: "top",
            center: "center",
            farthest: "bottom"
        }),
        _render: function (t) {
            if (t.beginPath(), !this.strokeDashArray || this.strokeDashArray && o) {
                var e = this.calcLinePoints();
                t.moveTo(e.x1, e.y1), t.lineTo(e.x2, e.y2)
            }
            t.lineWidth = this.strokeWidth;
            var i = t.strokeStyle;
            t.strokeStyle = this.stroke || t.fillStyle, this.stroke && this._renderStroke(t), t.strokeStyle = i
        },
        _renderDashedStroke: function (t) {
            var i = this.calcLinePoints();
            t.beginPath(), e.util.drawDashedLine(t, i.x1, i.y1, i.x2, i.y2, this.strokeDashArray), t.closePath()
        },
        _findCenterFromElement: function () {
            return {x: (this.x1 + this.x2) / 2, y: (this.y1 + this.y2) / 2}
        },
        toObject: function (t) {
            return i(this.callSuper("toObject", t), this.calcLinePoints())
        },
        _getNonTransformedDimensions: function () {
            var t = this.callSuper("_getNonTransformedDimensions");
            return "butt" === this.strokeLineCap && (0 === this.width && (t.y -= this.strokeWidth), 0 === this.height && (t.x -= this.strokeWidth)), t
        },
        calcLinePoints: function () {
            var t = this.x1 <= this.x2 ? -1 : 1, e = this.y1 <= this.y2 ? -1 : 1, i = t * this.width * .5,
                n = e * this.height * .5;
            return {x1: i, x2: t * this.width * -.5, y1: n, y2: e * this.height * -.5}
        },
        _toSVG: function () {
            var t = this.calcLinePoints();
            return ["<line ", "COMMON_PARTS", 'x1="', t.x1, '" y1="', t.y1, '" x2="', t.x2, '" y2="', t.y2, '" />\n']
        }
    }), e.Line.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("x1 y1 x2 y2".split(" ")), e.Line.fromElement = function (t, n, r) {
        r = r || {};
        var o = e.parseAttributes(t, e.Line.ATTRIBUTE_NAMES), s = [o.x1 || 0, o.y1 || 0, o.x2 || 0, o.y2 || 0];
        n(new e.Line(s, i(o, r)))
    }, e.Line.fromObject = function (t, i) {
        var r = n(t, !0);
        r.points = [t.x1, t.y1, t.x2, t.y2], e.Object._fromObject("Line", r, (function (t) {
            delete t.points, i && i(t)
        }), "points")
    })
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = Math.PI;
    e.Circle ? e.warn("fabric.Circle is already defined.") : (e.Circle = e.util.createClass(e.Object, {
        type: "circle",
        radius: 0,
        startAngle: 0,
        endAngle: 2 * i,
        cacheProperties: e.Object.prototype.cacheProperties.concat("radius", "startAngle", "endAngle"),
        _set: function (t, e) {
            return this.callSuper("_set", t, e), "radius" === t && this.setRadius(e), this
        },
        toObject: function (t) {
            return this.callSuper("toObject", ["radius", "startAngle", "endAngle"].concat(t))
        },
        _toSVG: function () {
            var t, n = (this.endAngle - this.startAngle) % (2 * i);
            if (n > 2 * i && (n = 0), n < .001 && (n = 0), 0 === n) t = ["<circle ", "COMMON_PARTS", 'cx="0" cy="0" ', 'r="', this.radius, '" />\n']; else {
                var r = e.util.cos(this.startAngle) * this.radius, o = e.util.sin(this.startAngle) * this.radius,
                    s = e.util.cos(this.endAngle) * this.radius, a = e.util.sin(this.endAngle) * this.radius,
                    c = i < n ? "1" : "0";
                t = ['<path d="M ' + r + " " + o, " A " + this.radius + " " + this.radius, " 0 ", +c + " 1", " " + s + " " + a, '" ', "COMMON_PARTS", " />\n"]
            }
            return t
        },
        _render: function (t) {
            t.beginPath(), t.arc(0, 0, this.radius, this.startAngle, this.endAngle, !1), this._renderPaintInOrder(t)
        },
        getRadiusX: function () {
            return this.get("radius") * this.get("scaleX")
        },
        getRadiusY: function () {
            return this.get("radius") * this.get("scaleY")
        },
        setRadius: function (t) {
            return this.radius = t, this.set("width", 2 * t).set("height", 2 * t)
        }
    }), e.Circle.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("cx cy r".split(" ")), e.Circle.fromElement = function (t, i) {
        var n, r = e.parseAttributes(t, e.Circle.ATTRIBUTE_NAMES);
        if (!("radius" in (n = r) && 0 <= n.radius)) throw new Error("value of `r` attribute is required and can not be negative");
        r.left = (r.left || 0) - r.radius, r.top = (r.top || 0) - r.radius, i(new e.Circle(r))
    }, e.Circle.fromObject = function (t, i) {
        return e.Object._fromObject("Circle", t, i)
    })
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {});
    e.Triangle ? e.warn("fabric.Triangle is already defined") : (e.Triangle = e.util.createClass(e.Object, {
        type: "triangle",
        width: 100,
        height: 100,
        _render: function (t) {
            var e = this.width / 2, i = this.height / 2;
            t.beginPath(), t.moveTo(-e, i), t.lineTo(0, -i), t.lineTo(e, i), t.closePath(), this._renderPaintInOrder(t)
        },
        _renderDashedStroke: function (t) {
            var i = this.width / 2, n = this.height / 2;
            t.beginPath(), e.util.drawDashedLine(t, -i, n, 0, -n, this.strokeDashArray), e.util.drawDashedLine(t, 0, -n, i, n, this.strokeDashArray), e.util.drawDashedLine(t, i, n, -i, n, this.strokeDashArray), t.closePath()
        },
        _toSVG: function () {
            var t = this.width / 2, e = this.height / 2;
            return ["<polygon ", "COMMON_PARTS", 'points="', [-t + " " + e, "0 " + -e, t + " " + e].join(","), '" />']
        }
    }), e.Triangle.fromObject = function (t, i) {
        return e.Object._fromObject("Triangle", t, i)
    })
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = 2 * Math.PI;
    e.Ellipse ? e.warn("fabric.Ellipse is already defined.") : (e.Ellipse = e.util.createClass(e.Object, {
        type: "ellipse",
        rx: 0,
        ry: 0,
        cacheProperties: e.Object.prototype.cacheProperties.concat("rx", "ry"),
        initialize: function (t) {
            this.callSuper("initialize", t), this.set("rx", t && t.rx || 0), this.set("ry", t && t.ry || 0)
        },
        _set: function (t, e) {
            switch (this.callSuper("_set", t, e), t) {
                case"rx":
                    this.rx = e, this.set("width", 2 * e);
                    break;
                case"ry":
                    this.ry = e, this.set("height", 2 * e)
            }
            return this
        },
        getRx: function () {
            return this.get("rx") * this.get("scaleX")
        },
        getRy: function () {
            return this.get("ry") * this.get("scaleY")
        },
        toObject: function (t) {
            return this.callSuper("toObject", ["rx", "ry"].concat(t))
        },
        _toSVG: function () {
            return ["<ellipse ", "COMMON_PARTS", 'cx="0" cy="0" ', 'rx="', this.rx, '" ry="', this.ry, '" />\n']
        },
        _render: function (t) {
            t.beginPath(), t.save(), t.transform(1, 0, 0, this.ry / this.rx, 0, 0), t.arc(0, 0, this.rx, 0, i, !1), t.restore(), this._renderPaintInOrder(t)
        }
    }), e.Ellipse.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("cx cy rx ry".split(" ")), e.Ellipse.fromElement = function (t, i) {
        var n = e.parseAttributes(t, e.Ellipse.ATTRIBUTE_NAMES);
        n.left = (n.left || 0) - n.rx, n.top = (n.top || 0) - n.ry, i(new e.Ellipse(n))
    }, e.Ellipse.fromObject = function (t, i) {
        return e.Object._fromObject("Ellipse", t, i)
    })
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.object.extend;
    e.Rect ? e.warn("fabric.Rect is already defined") : (e.Rect = e.util.createClass(e.Object, {
        stateProperties: e.Object.prototype.stateProperties.concat("rx", "ry"),
        type: "rect",
        rx: 0,
        ry: 0,
        cacheProperties: e.Object.prototype.cacheProperties.concat("rx", "ry"),
        initialize: function (t) {
            this.callSuper("initialize", t), this._initRxRy()
        },
        _initRxRy: function () {
            this.rx && !this.ry ? this.ry = this.rx : this.ry && !this.rx && (this.rx = this.ry)
        },
        _render: function (t) {
            var e = this.rx ? Math.min(this.rx, this.width / 2) : 0,
                i = this.ry ? Math.min(this.ry, this.height / 2) : 0, n = this.width, r = this.height,
                o = -this.width / 2, s = -this.height / 2, a = 0 !== e || 0 !== i, c = .4477152502;
            t.beginPath(), t.moveTo(o + e, s), t.lineTo(o + n - e, s), a && t.bezierCurveTo(o + n - c * e, s, o + n, s + c * i, o + n, s + i), t.lineTo(o + n, s + r - i), a && t.bezierCurveTo(o + n, s + r - c * i, o + n - c * e, s + r, o + n - e, s + r), t.lineTo(o + e, s + r), a && t.bezierCurveTo(o + c * e, s + r, o, s + r - c * i, o, s + r - i), t.lineTo(o, s + i), a && t.bezierCurveTo(o, s + c * i, o + c * e, s, o + e, s), t.closePath(), this._renderPaintInOrder(t)
        },
        _renderDashedStroke: function (t) {
            var i = -this.width / 2, n = -this.height / 2, r = this.width, o = this.height;
            t.beginPath(), e.util.drawDashedLine(t, i, n, i + r, n, this.strokeDashArray), e.util.drawDashedLine(t, i + r, n, i + r, n + o, this.strokeDashArray), e.util.drawDashedLine(t, i + r, n + o, i, n + o, this.strokeDashArray), e.util.drawDashedLine(t, i, n + o, i, n, this.strokeDashArray), t.closePath()
        },
        toObject: function (t) {
            return this.callSuper("toObject", ["rx", "ry"].concat(t))
        },
        _toSVG: function () {
            return ["<rect ", "COMMON_PARTS", 'x="', -this.width / 2, '" y="', -this.height / 2, '" rx="', this.rx, '" ry="', this.ry, '" width="', this.width, '" height="', this.height, '" />\n']
        }
    }), e.Rect.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("x y rx ry width height".split(" ")), e.Rect.fromElement = function (t, n, r) {
        if (!t) return n(null);
        r = r || {};
        var o = e.parseAttributes(t, e.Rect.ATTRIBUTE_NAMES);
        o.left = o.left || 0, o.top = o.top || 0, o.height = o.height || 0, o.width = o.width || 0;
        var s = new e.Rect(i(r ? e.util.object.clone(r) : {}, o));
        s.visible = s.visible && 0 < s.width && 0 < s.height, n(s)
    }, e.Rect.fromObject = function (t, i) {
        return e.Object._fromObject("Rect", t, i)
    })
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.object.extend, n = e.util.array.min, r = e.util.array.max,
        o = e.util.toFixed;
    e.Polyline ? e.warn("fabric.Polyline is already defined") : (e.Polyline = e.util.createClass(e.Object, {
        type: "polyline",
        points: null,
        cacheProperties: e.Object.prototype.cacheProperties.concat("points"),
        initialize: function (t, e) {
            e = e || {}, this.points = t || [], this.callSuper("initialize", e), this._setPositionDimensions(e)
        },
        _setPositionDimensions: function (t) {
            var e, i = this._calcDimensions(t);
            this.width = i.width, this.height = i.height, t.fromSVG || (e = this.translateToGivenOrigin({
                x: i.left - this.strokeWidth / 2,
                y: i.top - this.strokeWidth / 2
            }, "left", "top", this.originX, this.originY)), void 0 === t.left && (this.left = t.fromSVG ? i.left : e.x), void 0 === t.top && (this.top = t.fromSVG ? i.top : e.y), this.pathOffset = {
                x: i.left + this.width / 2,
                y: i.top + this.height / 2
            }
        },
        _calcDimensions: function () {
            var t = this.points, e = n(t, "x") || 0, i = n(t, "y") || 0;
            return {left: e, top: i, width: (r(t, "x") || 0) - e, height: (r(t, "y") || 0) - i}
        },
        toObject: function (t) {
            return i(this.callSuper("toObject", t), {points: this.points.concat()})
        },
        _toSVG: function () {
            for (var t = [], i = this.pathOffset.x, n = this.pathOffset.y, r = e.Object.NUM_FRACTION_DIGITS, s = 0, a = this.points.length; s < a; s++) t.push(o(this.points[s].x - i, r), ",", o(this.points[s].y - n, r), " ");
            return ["<" + this.type + " ", "COMMON_PARTS", 'points="', t.join(""), '" />\n']
        },
        commonRender: function (t) {
            var e, i = this.points.length, n = this.pathOffset.x, r = this.pathOffset.y;
            if (!i || isNaN(this.points[i - 1].y)) return !1;
            t.beginPath(), t.moveTo(this.points[0].x - n, this.points[0].y - r);
            for (var o = 0; o < i; o++) e = this.points[o], t.lineTo(e.x - n, e.y - r);
            return !0
        },
        _render: function (t) {
            this.commonRender(t) && this._renderPaintInOrder(t)
        },
        _renderDashedStroke: function (t) {
            var i, n;
            t.beginPath();
            for (var r = 0, o = this.points.length; r < o; r++) i = this.points[r], n = this.points[r + 1] || i, e.util.drawDashedLine(t, i.x, i.y, n.x, n.y, this.strokeDashArray)
        },
        complexity: function () {
            return this.get("points").length
        }
    }), e.Polyline.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(), e.Polyline.fromElementGenerator = function (t) {
        return function (n, r, o) {
            if (!n) return r(null);
            o || (o = {});
            var s = e.parsePointsAttribute(n.getAttribute("points")), a = e.parseAttributes(n, e[t].ATTRIBUTE_NAMES);
            a.fromSVG = !0, r(new e[t](s, i(a, o)))
        }
    }, e.Polyline.fromElement = e.Polyline.fromElementGenerator("Polyline"), e.Polyline.fromObject = function (t, i) {
        return e.Object._fromObject("Polyline", t, i, "points")
    })
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {});
    e.Polygon ? e.warn("fabric.Polygon is already defined") : (e.Polygon = e.util.createClass(e.Polyline, {
        type: "polygon",
        _render: function (t) {
            this.commonRender(t) && (t.closePath(), this._renderPaintInOrder(t))
        },
        _renderDashedStroke: function (t) {
            this.callSuper("_renderDashedStroke", t), t.closePath()
        }
    }), e.Polygon.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(), e.Polygon.fromElement = e.Polyline.fromElementGenerator("Polygon"), e.Polygon.fromObject = function (t, i) {
        return e.Object._fromObject("Polygon", t, i, "points")
    })
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.array.min, n = e.util.array.max, r = e.util.object.extend,
        o = Object.prototype.toString, s = e.util.drawArc, a = e.util.toFixed,
        c = {m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7}, l = {m: "l", M: "L"};
    e.Path ? e.warn("fabric.Path is already defined") : (e.Path = e.util.createClass(e.Object, {
        type: "path",
        path: null,
        cacheProperties: e.Object.prototype.cacheProperties.concat("path", "fillRule"),
        stateProperties: e.Object.prototype.stateProperties.concat("path"),
        initialize: function (t, i) {
            i = i || {}, this.callSuper("initialize", i), t || (t = []);
            var n = "[object Array]" === o.call(t);
            this.path = n ? t : t.match && t.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi), this.path && (n || (this.path = this._parsePath()), e.Polyline.prototype._setPositionDimensions.call(this, i))
        },
        _renderPathCommands: function (t) {
            var e, i, n, r = null, o = 0, a = 0, c = 0, l = 0, h = 0, u = 0, f = -this.pathOffset.x,
                d = -this.pathOffset.y;
            t.beginPath();
            for (var p = 0, g = this.path.length; p < g; ++p) {
                switch ((e = this.path[p])[0]) {
                    case"l":
                        c += e[1], l += e[2], t.lineTo(c + f, l + d);
                        break;
                    case"L":
                        c = e[1], l = e[2], t.lineTo(c + f, l + d);
                        break;
                    case"h":
                        c += e[1], t.lineTo(c + f, l + d);
                        break;
                    case"H":
                        c = e[1], t.lineTo(c + f, l + d);
                        break;
                    case"v":
                        l += e[1], t.lineTo(c + f, l + d);
                        break;
                    case"V":
                        l = e[1], t.lineTo(c + f, l + d);
                        break;
                    case"m":
                        o = c += e[1], a = l += e[2], t.moveTo(c + f, l + d);
                        break;
                    case"M":
                        o = c = e[1], a = l = e[2], t.moveTo(c + f, l + d);
                        break;
                    case"c":
                        i = c + e[5], n = l + e[6], h = c + e[3], u = l + e[4], t.bezierCurveTo(c + e[1] + f, l + e[2] + d, h + f, u + d, i + f, n + d), c = i, l = n;
                        break;
                    case"C":
                        c = e[5], l = e[6], h = e[3], u = e[4], t.bezierCurveTo(e[1] + f, e[2] + d, h + f, u + d, c + f, l + d);
                        break;
                    case"s":
                        i = c + e[3], n = l + e[4], null === r[0].match(/[CcSs]/) ? (h = c, u = l) : (h = 2 * c - h, u = 2 * l - u), t.bezierCurveTo(h + f, u + d, c + e[1] + f, l + e[2] + d, i + f, n + d), h = c + e[1], u = l + e[2], c = i, l = n;
                        break;
                    case"S":
                        i = e[3], n = e[4], null === r[0].match(/[CcSs]/) ? (h = c, u = l) : (h = 2 * c - h, u = 2 * l - u), t.bezierCurveTo(h + f, u + d, e[1] + f, e[2] + d, i + f, n + d), c = i, l = n, h = e[1], u = e[2];
                        break;
                    case"q":
                        i = c + e[3], n = l + e[4], h = c + e[1], u = l + e[2], t.quadraticCurveTo(h + f, u + d, i + f, n + d), c = i, l = n;
                        break;
                    case"Q":
                        i = e[3], n = e[4], t.quadraticCurveTo(e[1] + f, e[2] + d, i + f, n + d), c = i, l = n, h = e[1], u = e[2];
                        break;
                    case"t":
                        i = c + e[1], n = l + e[2], null === r[0].match(/[QqTt]/) ? (h = c, u = l) : (h = 2 * c - h, u = 2 * l - u), t.quadraticCurveTo(h + f, u + d, i + f, n + d), c = i, l = n;
                        break;
                    case"T":
                        i = e[1], n = e[2], null === r[0].match(/[QqTt]/) ? (h = c, u = l) : (h = 2 * c - h, u = 2 * l - u), t.quadraticCurveTo(h + f, u + d, i + f, n + d), c = i, l = n;
                        break;
                    case"a":
                        s(t, c + f, l + d, [e[1], e[2], e[3], e[4], e[5], e[6] + c + f, e[7] + l + d]), c += e[6], l += e[7];
                        break;
                    case"A":
                        s(t, c + f, l + d, [e[1], e[2], e[3], e[4], e[5], e[6] + f, e[7] + d]), c = e[6], l = e[7];
                        break;
                    case"z":
                    case"Z":
                        c = o, l = a, t.closePath()
                }
                r = e
            }
        },
        _render: function (t) {
            this._renderPathCommands(t), this._renderPaintInOrder(t)
        },
        toString: function () {
            return "#<fabric.Path (" + this.complexity() + '): { "top": ' + this.top + ', "left": ' + this.left + " }>"
        },
        toObject: function (t) {
            return r(this.callSuper("toObject", t), {
                path: this.path.map((function (t) {
                    return t.slice()
                }))
            })
        },
        toDatalessObject: function (t) {
            var e = this.toObject(["sourcePath"].concat(t));
            return e.sourcePath && delete e.path, e
        },
        _toSVG: function () {
            return ["<path ", "COMMON_PARTS", 'd="', this.path.map((function (t) {
                return t.join(" ")
            })).join(" "), '" stroke-linecap="round" ', "/>\n"]
        },
        _getOffsetTransform: function () {
            var t = e.Object.NUM_FRACTION_DIGITS;
            return " translate(" + a(-this.pathOffset.x, t) + ", " + a(-this.pathOffset.y, t) + ")"
        },
        toClipPathSVG: function (t) {
            var e = this._getOffsetTransform();
            return "\t" + this._createBaseClipPathSVGMarkup(this._toSVG(), {reviver: t, additionalTransform: e})
        },
        toSVG: function (t) {
            var e = this._getOffsetTransform();
            return this._createBaseSVGMarkup(this._toSVG(), {reviver: t, additionalTransform: e})
        },
        complexity: function () {
            return this.path.length
        },
        _parsePath: function () {
            for (var t, e, i, n, r, o = [], s = [], a = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi, h = 0, u = this.path.length; h < u; h++) {
                for (n = (t = this.path[h]).slice(1).trim(), s.length = 0; i = a.exec(n);) s.push(i[0]);
                r = [t.charAt(0)];
                for (var f = 0, d = s.length; f < d; f++) e = parseFloat(s[f]), isNaN(e) || r.push(e);
                var p = r[0], g = c[p.toLowerCase()], v = l[p] || p;
                if (r.length - 1 > g) for (var m = 1, _ = r.length; m < _; m += g) o.push([p].concat(r.slice(m, m + g))), p = v; else o.push(r)
            }
            return o
        },
        _calcDimensions: function () {
            for (var t, r, o, s, a = [], c = [], l = null, h = 0, u = 0, f = 0, d = 0, p = 0, g = 0, v = 0, m = this.path.length; v < m; ++v) {
                switch ((t = this.path[v])[0]) {
                    case"l":
                        f += t[1], d += t[2], s = [];
                        break;
                    case"L":
                        f = t[1], d = t[2], s = [];
                        break;
                    case"h":
                        f += t[1], s = [];
                        break;
                    case"H":
                        f = t[1], s = [];
                        break;
                    case"v":
                        d += t[1], s = [];
                        break;
                    case"V":
                        d = t[1], s = [];
                        break;
                    case"m":
                        h = f += t[1], u = d += t[2], s = [];
                        break;
                    case"M":
                        h = f = t[1], u = d = t[2], s = [];
                        break;
                    case"c":
                        r = f + t[5], o = d + t[6], p = f + t[3], g = d + t[4], s = e.util.getBoundsOfCurve(f, d, f + t[1], d + t[2], p, g, r, o), f = r, d = o;
                        break;
                    case"C":
                        p = t[3], g = t[4], s = e.util.getBoundsOfCurve(f, d, t[1], t[2], p, g, t[5], t[6]), f = t[5], d = t[6];
                        break;
                    case"s":
                        r = f + t[3], o = d + t[4], null === l[0].match(/[CcSs]/) ? (p = f, g = d) : (p = 2 * f - p, g = 2 * d - g), s = e.util.getBoundsOfCurve(f, d, p, g, f + t[1], d + t[2], r, o), p = f + t[1], g = d + t[2], f = r, d = o;
                        break;
                    case"S":
                        r = t[3], o = t[4], null === l[0].match(/[CcSs]/) ? (p = f, g = d) : (p = 2 * f - p, g = 2 * d - g), s = e.util.getBoundsOfCurve(f, d, p, g, t[1], t[2], r, o), f = r, d = o, p = t[1], g = t[2];
                        break;
                    case"q":
                        r = f + t[3], o = d + t[4], p = f + t[1], g = d + t[2], s = e.util.getBoundsOfCurve(f, d, p, g, p, g, r, o), f = r, d = o;
                        break;
                    case"Q":
                        p = t[1], g = t[2], s = e.util.getBoundsOfCurve(f, d, p, g, p, g, t[3], t[4]), f = t[3], d = t[4];
                        break;
                    case"t":
                        r = f + t[1], o = d + t[2], null === l[0].match(/[QqTt]/) ? (p = f, g = d) : (p = 2 * f - p, g = 2 * d - g), s = e.util.getBoundsOfCurve(f, d, p, g, p, g, r, o), f = r, d = o;
                        break;
                    case"T":
                        r = t[1], o = t[2], null === l[0].match(/[QqTt]/) ? (p = f, g = d) : (p = 2 * f - p, g = 2 * d - g), s = e.util.getBoundsOfCurve(f, d, p, g, p, g, r, o), f = r, d = o;
                        break;
                    case"a":
                        s = e.util.getBoundsOfArc(f, d, t[1], t[2], t[3], t[4], t[5], t[6] + f, t[7] + d), f += t[6], d += t[7];
                        break;
                    case"A":
                        s = e.util.getBoundsOfArc(f, d, t[1], t[2], t[3], t[4], t[5], t[6], t[7]), f = t[6], d = t[7];
                        break;
                    case"z":
                    case"Z":
                        f = h, d = u
                }
                l = t, s.forEach((function (t) {
                    a.push(t.x), c.push(t.y)
                })), a.push(f), c.push(d)
            }
            var _ = i(a) || 0, b = i(c) || 0;
            return {left: _, top: b, width: (n(a) || 0) - _, height: (n(c) || 0) - b}
        }
    }), e.Path.fromObject = function (t, i) {
        if ("string" == typeof t.sourcePath) {
            var n = t.sourcePath;
            e.loadSVGFromURL(n, (function (e) {
                var n = e[0];
                n.setOptions(t), i && i(n)
            }))
        } else e.Object._fromObject("Path", t, i, "path")
    }, e.Path.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(["d"]), e.Path.fromElement = function (t, i, n) {
        var o = e.parseAttributes(t, e.Path.ATTRIBUTE_NAMES);
        o.fromSVG = !0, i(new e.Path(o.d, r(o, n)))
    })
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.array.min, n = e.util.array.max;
    e.Group || (e.Group = e.util.createClass(e.Object, e.Collection, {
        type: "group",
        strokeWidth: 0,
        subTargetCheck: !1,
        cacheProperties: [],
        useSetOnGroup: !1,
        initialize: function (t, e, i) {
            e = e || {}, this._objects = [], i && this.callSuper("initialize", e), this._objects = t || [];
            for (var n = this._objects.length; n--;) this._objects[n].group = this;
            if (i) this._updateObjectsACoords(); else {
                var r = e && e.centerPoint;
                void 0 !== e.originX && (this.originX = e.originX), void 0 !== e.originY && (this.originY = e.originY), r || this._calcBounds(), this._updateObjectsCoords(r), delete e.centerPoint, this.callSuper("initialize", e)
            }
            this.setCoords()
        },
        _updateObjectsACoords: function () {
            for (var t = this._objects.length; t--;) this._objects[t].setCoords(!0, !0)
        },
        _updateObjectsCoords: function (t) {
            t = t || this.getCenterPoint();
            for (var e = this._objects.length; e--;) this._updateObjectCoords(this._objects[e], t)
        },
        _updateObjectCoords: function (t, e) {
            var i = t.left, n = t.top;
            t.set({left: i - e.x, top: n - e.y}), t.group = this, t.setCoords(!0, !0)
        },
        toString: function () {
            return "#<fabric.Group: (" + this.complexity() + ")>"
        },
        addWithUpdate: function (t) {
            return this._restoreObjectsState(), e.util.resetObjectTransform(this), t && (this._objects.push(t), t.group = this, t._set("canvas", this.canvas)), this._calcBounds(), this._updateObjectsCoords(), this.setCoords(), this.dirty = !0, this
        },
        removeWithUpdate: function (t) {
            return this._restoreObjectsState(), e.util.resetObjectTransform(this), this.remove(t), this._calcBounds(), this._updateObjectsCoords(), this.setCoords(), this.dirty = !0, this
        },
        _onObjectAdded: function (t) {
            this.dirty = !0, t.group = this, t._set("canvas", this.canvas)
        },
        _onObjectRemoved: function (t) {
            this.dirty = !0, delete t.group
        },
        _set: function (t, i) {
            var n = this._objects.length;
            if (this.useSetOnGroup) for (; n--;) this._objects[n].setOnGroup(t, i);
            if ("canvas" === t) for (; n--;) this._objects[n]._set(t, i);
            e.Object.prototype._set.call(this, t, i)
        },
        toObject: function (t) {
            var i = this.includeDefaultValues, n = this._objects.map((function (e) {
                var n = e.includeDefaultValues;
                e.includeDefaultValues = i;
                var r = e.toObject(t);
                return e.includeDefaultValues = n, r
            })), r = e.Object.prototype.toObject.call(this, t);
            return r.objects = n, r
        },
        toDatalessObject: function (t) {
            var i, n = this.sourcePath;
            if (n) i = n; else {
                var r = this.includeDefaultValues;
                i = this._objects.map((function (e) {
                    var i = e.includeDefaultValues;
                    e.includeDefaultValues = r;
                    var n = e.toDatalessObject(t);
                    return e.includeDefaultValues = i, n
                }))
            }
            var o = e.Object.prototype.toDatalessObject.call(this, t);
            return o.objects = i, o
        },
        render: function (t) {
            this._transformDone = !0, this.callSuper("render", t), this._transformDone = !1
        },
        shouldCache: function () {
            var t = e.Object.prototype.shouldCache.call(this);
            if (t) for (var i = 0, n = this._objects.length; i < n; i++) if (this._objects[i].willDrawShadow()) return this.ownCaching = !1;
            return t
        },
        willDrawShadow: function () {
            if (this.shadow) return e.Object.prototype.willDrawShadow.call(this);
            for (var t = 0, i = this._objects.length; t < i; t++) if (this._objects[t].willDrawShadow()) return !0;
            return !1
        },
        isOnACache: function () {
            return this.ownCaching || this.group && this.group.isOnACache()
        },
        drawObject: function (t) {
            for (var e = 0, i = this._objects.length; e < i; e++) this._objects[e].render(t);
            this._drawClipPath(t)
        },
        isCacheDirty: function (t) {
            if (this.callSuper("isCacheDirty", t)) return !0;
            if (!this.statefullCache) return !1;
            for (var e = 0, i = this._objects.length; e < i; e++) if (this._objects[e].isCacheDirty(!0)) {
                if (this._cacheCanvas) {
                    var n = this.cacheWidth / this.zoomX, r = this.cacheHeight / this.zoomY;
                    this._cacheContext.clearRect(-n / 2, -r / 2, n, r)
                }
                return !0
            }
            return !1
        },
        _restoreObjectsState: function () {
            return this._objects.forEach(this._restoreObjectState, this), this
        },
        realizeTransform: function (t) {
            var i = t.calcTransformMatrix(), n = e.util.qrDecompose(i), r = new e.Point(n.translateX, n.translateY);
            return t.flipX = !1, t.flipY = !1, t.set("scaleX", n.scaleX), t.set("scaleY", n.scaleY), t.skewX = n.skewX, t.skewY = n.skewY, t.angle = n.angle, t.setPositionByOrigin(r, "center", "center"), t
        },
        _restoreObjectState: function (t) {
            return this.realizeTransform(t), t.setCoords(), delete t.group, this
        },
        destroy: function () {
            return this._objects.forEach((function (t) {
                t.set("dirty", !0)
            })), this._restoreObjectsState()
        },
        toActiveSelection: function () {
            if (this.canvas) {
                var t = this._objects, i = this.canvas;
                this._objects = [];
                var n = this.toObject();
                delete n.objects;
                var r = new e.ActiveSelection([]);
                return r.set(n), r.type = "activeSelection", i.remove(this), t.forEach((function (t) {
                    t.group = r, t.dirty = !0, i.add(t)
                })), r.canvas = i, r._objects = t, (i._activeObject = r).setCoords(), r
            }
        },
        ungroupOnCanvas: function () {
            return this._restoreObjectsState()
        },
        setObjectsCoords: function () {
            return this.forEachObject((function (t) {
                t.setCoords(!0, !0)
            })), this
        },
        _calcBounds: function (t) {
            for (var e, i, n, r = [], o = [], s = ["tr", "br", "bl", "tl"], a = 0, c = this._objects.length, l = s.length; a < c; ++a) for ((e = this._objects[a]).setCoords(!0), n = 0; n < l; n++) i = s[n], r.push(e.oCoords[i].x), o.push(e.oCoords[i].y);
            this._getBounds(r, o, t)
        },
        _getBounds: function (t, r, o) {
            var s = new e.Point(i(t), i(r)), a = new e.Point(n(t), n(r)), c = s.y || 0, l = s.x || 0,
                h = a.x - s.x || 0, u = a.y - s.y || 0;
            this.width = h, this.height = u, o || this.setPositionByOrigin({x: l, y: c}, "left", "top")
        },
        _toSVG: function (t) {
            for (var e = ["<g ", "COMMON_PARTS", " >\n"], i = 0, n = this._objects.length; i < n; i++) e.push("\t\t", this._objects[i].toSVG(t));
            return e.push("</g>\n"), e
        },
        getSvgStyles: function () {
            var t = void 0 !== this.opacity && 1 !== this.opacity ? "opacity: " + this.opacity + ";" : "",
                e = this.visible ? "" : " visibility: hidden;";
            return [t, this.getSvgFilter(), e].join("")
        },
        toClipPathSVG: function (t) {
            for (var e = [], i = 0, n = this._objects.length; i < n; i++) e.push("\t", this._objects[i].toClipPathSVG(t));
            return this._createBaseClipPathSVGMarkup(e, {reviver: t})
        }
    }), e.Group.fromObject = function (t, i) {
        e.util.enlivenObjects(t.objects, (function (n) {
            e.util.enlivenObjects([t.clipPath], (function (r) {
                var o = e.util.object.clone(t, !0);
                o.clipPath = r[0], delete o.objects, i && i(new e.Group(n, o, !0))
            }))
        }))
    })
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {});
    e.ActiveSelection || (e.ActiveSelection = e.util.createClass(e.Group, {
        type: "activeSelection", initialize: function (t, i) {
            i = i || {}, this._objects = t || [];
            for (var n = this._objects.length; n--;) this._objects[n].group = this;
            i.originX && (this.originX = i.originX), i.originY && (this.originY = i.originY), this._calcBounds(), this._updateObjectsCoords(), e.Object.prototype.initialize.call(this, i), this.setCoords()
        }, toGroup: function () {
            var t = this._objects.concat();
            this._objects = [];
            var i = e.Object.prototype.toObject.call(this), n = new e.Group([]);
            if (delete i.type, n.set(i), t.forEach((function (t) {
                t.canvas.remove(t), t.group = n
            })), n._objects = t, !this.canvas) return n;
            var r = this.canvas;
            return r.add(n), (r._activeObject = n).setCoords(), n
        }, onDeselect: function () {
            return this.destroy(), !1
        }, toString: function () {
            return "#<fabric.ActiveSelection: (" + this.complexity() + ")>"
        }, shouldCache: function () {
            return !1
        }, isOnACache: function () {
            return !1
        }, _renderControls: function (t, e, i) {
            t.save(), t.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1, this.callSuper("_renderControls", t, e), void 0 === (i = i || {}).hasControls && (i.hasControls = !1), void 0 === i.hasRotatingPoint && (i.hasRotatingPoint = !1), i.forActiveSelection = !0;
            for (var n = 0, r = this._objects.length; n < r; n++) this._objects[n]._renderControls(t, i);
            t.restore()
        }
    }), e.ActiveSelection.fromObject = function (t, i) {
        e.util.enlivenObjects(t.objects, (function (n) {
            delete t.objects, i && i(new e.ActiveSelection(n, t, !0))
        }))
    })
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = fabric.util.object.extend;
    t.fabric || (t.fabric = {}), t.fabric.Image ? fabric.warn("fabric.Image is already defined.") : (fabric.Image = fabric.util.createClass(fabric.Object, {
        type: "image",
        crossOrigin: "",
        strokeWidth: 0,
        srcFromAttribute: !1,
        _lastScaleX: 1,
        _lastScaleY: 1,
        _filterScalingX: 1,
        _filterScalingY: 1,
        minimumScaleTrigger: .5,
        stateProperties: fabric.Object.prototype.stateProperties.concat("cropX", "cropY"),
        cacheKey: "",
        cropX: 0,
        cropY: 0,
        initialize: function (t, e) {
            e || (e = {}), this.filters = [], this.cacheKey = "texture" + fabric.Object.__uid++, this.callSuper("initialize", e), this._initElement(t, e)
        },
        getElement: function () {
            return this._element || {}
        },
        setElement: function (t, e) {
            return this.removeTexture(this.cacheKey), this.removeTexture(this.cacheKey + "_filtered"), this._element = t, this._originalElement = t, this._initConfig(e), 0 !== this.filters.length && this.applyFilters(), this.resizeFilter && this.applyResizeFilters(), this
        },
        removeTexture: function (t) {
            var e = fabric.filterBackend;
            e && e.evictCachesForKey && e.evictCachesForKey(t)
        },
        dispose: function () {
            this.removeTexture(this.cacheKey), this.removeTexture(this.cacheKey + "_filtered"), this._cacheContext = void 0, ["_originalElement", "_element", "_filteredEl", "_cacheCanvas"].forEach(function (t) {
                fabric.util.cleanUpJsdomNode(this[t]), this[t] = void 0
            }.bind(this))
        },
        setCrossOrigin: function (t) {
            return this.crossOrigin = t, this._element.crossOrigin = t, this
        },
        getOriginalSize: function () {
            var t = this.getElement();
            return {width: t.naturalWidth || t.width, height: t.naturalHeight || t.height}
        },
        _stroke: function (t) {
            if (this.stroke && 0 !== this.strokeWidth) {
                var e = this.width / 2, i = this.height / 2;
                t.beginPath(), t.moveTo(-e, -i), t.lineTo(e, -i), t.lineTo(e, i), t.lineTo(-e, i), t.lineTo(-e, -i), t.closePath()
            }
        },
        _renderDashedStroke: function (t) {
            var e = -this.width / 2, i = -this.height / 2, n = this.width, r = this.height;
            t.save(), this._setStrokeStyles(t, this), t.beginPath(), fabric.util.drawDashedLine(t, e, i, e + n, i, this.strokeDashArray), fabric.util.drawDashedLine(t, e + n, i, e + n, i + r, this.strokeDashArray), fabric.util.drawDashedLine(t, e + n, i + r, e, i + r, this.strokeDashArray), fabric.util.drawDashedLine(t, e, i + r, e, i, this.strokeDashArray), t.closePath(), t.restore()
        },
        toObject: function (t) {
            var i = [];
            this.filters.forEach((function (t) {
                t && i.push(t.toObject())
            }));
            var n = e(this.callSuper("toObject", ["crossOrigin", "cropX", "cropY"].concat(t)), {
                src: this.getSrc(),
                filters: i
            });
            return this.resizeFilter && (n.resizeFilter = this.resizeFilter.toObject()), n
        },
        hasCrop: function () {
            return this.cropX || this.cropY || this.width < this._element.width || this.height < this._element.height
        },
        _toSVG: function () {
            var t, e = [], i = [], n = -this.width / 2, r = -this.height / 2, o = "";
            if (this.hasCrop()) {
                var s = fabric.Object.__uid++;
                e.push('<clipPath id="imageCrop_' + s + '">\n', '\t<rect x="' + n + '" y="' + r + '" width="' + this.width + '" height="' + this.height + '" />\n', "</clipPath>\n"), o = ' clip-path="url(#imageCrop_' + s + ')" '
            }
            if (i.push("\t<image ", "COMMON_PARTS", 'xlink:href="', this.getSvgSrc(!0), '" x="', n - this.cropX, '" y="', r - this.cropY, '" width="', this._element.width || this._element.naturalWidth, '" height="', this._element.height || this._element.height, '"', o, "></image>\n"), this.stroke || this.strokeDashArray) {
                var a = this.fill;
                this.fill = null, t = ["\t<rect ", 'x="', n, '" y="', r, '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '"/>\n'], this.fill = a
            }
            return "fill" !== this.paintFirst ? e.concat(t, i) : e.concat(i, t)
        },
        getSrc: function (t) {
            var e = t ? this._element : this._originalElement;
            return e ? e.toDataURL ? e.toDataURL() : this.srcFromAttribute ? e.getAttribute("src") : e.src : this.src || ""
        },
        setSrc: function (t, e, i) {
            return fabric.util.loadImage(t, (function (t) {
                this.setElement(t, i), this._setWidthHeight(), e && e(this)
            }), this, i && i.crossOrigin), this
        },
        toString: function () {
            return '#<fabric.Image: { src: "' + this.getSrc() + '" }>'
        },
        applyResizeFilters: function () {
            var t = this.resizeFilter, e = this.minimumScaleTrigger, i = this.getTotalObjectScaling(), n = i.scaleX,
                r = i.scaleY, o = this._filteredEl || this._originalElement;
            if (this.group && this.set("dirty", !0), !t || e < n && e < r) return this._element = o, this._filterScalingX = 1, this._filterScalingY = 1, this._lastScaleX = n, void (this._lastScaleY = r);
            fabric.filterBackend || (fabric.filterBackend = fabric.initFilterBackend());
            var s = fabric.util.createCanvasElement(),
                a = this._filteredEl ? this.cacheKey + "_filtered" : this.cacheKey, c = o.width, l = o.height;
            s.width = c, s.height = l, this._element = s, this._lastScaleX = t.scaleX = n, this._lastScaleY = t.scaleY = r, fabric.filterBackend.applyFilters([t], o, c, l, this._element, a), this._filterScalingX = s.width / this._originalElement.width, this._filterScalingY = s.height / this._originalElement.height
        },
        applyFilters: function (t) {
            if (t = (t = t || this.filters || []).filter((function (t) {
                return t && !t.isNeutralState()
            })), this.set("dirty", !0), this.removeTexture(this.cacheKey + "_filtered"), 0 === t.length) return this._element = this._originalElement, this._filteredEl = null, this._filterScalingX = 1, this._filterScalingY = 1, this;
            var e = this._originalElement, i = e.naturalWidth || e.width, n = e.naturalHeight || e.height;
            if (this._element === this._originalElement) {
                var r = fabric.util.createCanvasElement();
                r.width = i, r.height = n, this._element = r, this._filteredEl = r
            } else this._element = this._filteredEl, this._filteredEl.getContext("2d").clearRect(0, 0, i, n), this._lastScaleX = 1, this._lastScaleY = 1;
            return fabric.filterBackend || (fabric.filterBackend = fabric.initFilterBackend()), fabric.filterBackend.applyFilters(t, this._originalElement, i, n, this._element, this.cacheKey), this._originalElement.width === this._element.width && this._originalElement.height === this._element.height || (this._filterScalingX = this._element.width / this._originalElement.width, this._filterScalingY = this._element.height / this._originalElement.height), this
        },
        _render: function (t) {
            !0 !== this.isMoving && this.resizeFilter && this._needsResize() && this.applyResizeFilters(), this._stroke(t), this._renderPaintInOrder(t)
        },
        shouldCache: function () {
            return this.needsItsOwnCache()
        },
        _renderFill: function (t) {
            var e = this._element, i = this.width, n = this.height,
                r = Math.min(e.naturalWidth || e.width, i * this._filterScalingX),
                o = Math.min(e.naturalHeight || e.height, n * this._filterScalingY), s = -i / 2, a = -n / 2,
                c = Math.max(0, this.cropX * this._filterScalingX), l = Math.max(0, this.cropY * this._filterScalingY);
            e && t.drawImage(e, c, l, r, o, s, a, i, n)
        },
        _needsResize: function () {
            var t = this.getTotalObjectScaling();
            return t.scaleX !== this._lastScaleX || t.scaleY !== this._lastScaleY
        },
        _resetWidthHeight: function () {
            this.set(this.getOriginalSize())
        },
        _initElement: function (t, e) {
            this.setElement(fabric.util.getById(t), e), fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS)
        },
        _initConfig: function (t) {
            t || (t = {}), this.setOptions(t), this._setWidthHeight(t), this._element && this.crossOrigin && (this._element.crossOrigin = this.crossOrigin)
        },
        _initFilters: function (t, e) {
            t && t.length ? fabric.util.enlivenObjects(t, (function (t) {
                e && e(t)
            }), "fabric.Image.filters") : e && e()
        },
        _setWidthHeight: function (t) {
            t || (t = {});
            var e = this.getElement();
            this.width = t.width || e.naturalWidth || e.width || 0, this.height = t.height || e.naturalHeight || e.height || 0
        },
        parsePreserveAspectRatioAttribute: function () {
            var t, e = fabric.util.parsePreserveAspectRatioAttribute(this.preserveAspectRatio || ""),
                i = this._element.width, n = this._element.height, r = 1, o = 1, s = 0, a = 0, c = 0, l = 0,
                h = this.width, u = this.height, f = {width: h, height: u};
            return !e || "none" === e.alignX && "none" === e.alignY ? (r = h / i, o = u / n) : ("meet" === e.meetOrSlice && (t = (h - i * (r = o = fabric.util.findScaleToFit(this._element, f))) / 2, "Min" === e.alignX && (s = -t), "Max" === e.alignX && (s = t), t = (u - n * o) / 2, "Min" === e.alignY && (a = -t), "Max" === e.alignY && (a = t)), "slice" === e.meetOrSlice && (t = i - h / (r = o = fabric.util.findScaleToCover(this._element, f)), "Mid" === e.alignX && (c = t / 2), "Max" === e.alignX && (c = t), t = n - u / o, "Mid" === e.alignY && (l = t / 2), "Max" === e.alignY && (l = t), i = h / r, n = u / o)), {
                width: i,
                height: n,
                scaleX: r,
                scaleY: o,
                offsetLeft: s,
                offsetTop: a,
                cropX: c,
                cropY: l
            }
        }
    }), fabric.Image.CSS_CANVAS = "canvas-img", fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc, fabric.Image.fromObject = function (t, e) {
        var i = fabric.util.object.clone(t);
        fabric.util.loadImage(i.src, (function (t, n) {
            n ? e && e(null, n) : fabric.Image.prototype._initFilters.call(i, i.filters, (function (n) {
                i.filters = n || [], fabric.Image.prototype._initFilters.call(i, [i.resizeFilter], (function (n) {
                    i.resizeFilter = n[0], fabric.util.enlivenObjects([i.clipPath], (function (n) {
                        i.clipPath = n[0];
                        var r = new fabric.Image(t, i);
                        e(r)
                    }))
                }))
            }))
        }), null, i.crossOrigin)
    }, fabric.Image.fromURL = function (t, e, i) {
        fabric.util.loadImage(t, (function (t) {
            e && e(new fabric.Image(t, i))
        }), null, i && i.crossOrigin)
    }, fabric.Image.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x y width height preserveAspectRatio xlink:href crossOrigin".split(" ")), fabric.Image.fromElement = function (t, i, n) {
        var r = fabric.parseAttributes(t, fabric.Image.ATTRIBUTE_NAMES);
        fabric.Image.fromURL(r["xlink:href"], i, e(n ? fabric.util.object.clone(n) : {}, r))
    })
}("undefined" != typeof exports ? exports : this), fabric.util.object.extend(fabric.Object.prototype, {
    _getAngleValueForStraighten: function () {
        var t = this.angle % 360;
        return 0 < t ? 90 * Math.round((t - 1) / 90) : 90 * Math.round(t / 90)
    }, straighten: function () {
        return this.rotate(this._getAngleValueForStraighten()), this
    }, fxStraighten: function (t) {
        var e = function () {
        }, i = (t = t || {}).onComplete || e, n = t.onChange || e, r = this;
        return fabric.util.animate({
            startValue: this.get("angle"),
            endValue: this._getAngleValueForStraighten(),
            duration: this.FX_DURATION,
            onChange: function (t) {
                r.rotate(t), n()
            },
            onComplete: function () {
                r.setCoords(), i()
            }
        }), this
    }
}), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    straightenObject: function (t) {
        return t.straighten(), this.requestRenderAll(), this
    }, fxStraightenObject: function (t) {
        return t.fxStraighten({onChange: this.requestRenderAllBound}), this
    }
}), function () {
    "use strict";
    fabric.isWebglSupported = function (t) {
        if (fabric.isLikelyNode) return !1;
        t = t || fabric.WebglFilterBackend.prototype.tileSize;
        var e, i, n, r = document.createElement("canvas"),
            o = r.getContext("webgl") || r.getContext("experimental-webgl"), s = !1;
        if (o) {
            fabric.maxTextureSize = o.getParameter(o.MAX_TEXTURE_SIZE), s = fabric.maxTextureSize >= t;
            for (var a = ["highp", "mediump", "lowp"], c = 0; c < 3; c++) if (i = "precision " + a[c] + " float;\nvoid main(){}", n = (e = o).createShader(e.FRAGMENT_SHADER), e.shaderSource(n, i), e.compileShader(n), e.getShaderParameter(n, e.COMPILE_STATUS)) {
                fabric.webGlPrecision = a[c];
                break
            }
        }
        return this.isSupported = s
    }, (fabric.WebglFilterBackend = function (t) {
        t && t.tileSize && (this.tileSize = t.tileSize), this.setupGLContext(this.tileSize, this.tileSize), this.captureGPUInfo()
    }).prototype = {
        tileSize: 2048, resources: {}, setupGLContext: function (t, e) {
            this.dispose(), this.createWebGLCanvas(t, e), this.aPosition = new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]), this.chooseFastestCopyGLTo2DMethod(t, e)
        }, chooseFastestCopyGLTo2DMethod: function (t, e) {
            var i, n = void 0 !== window.performance;
            try {
                new ImageData(1, 1), i = !0
            } catch (t) {
                i = !1
            }
            var r = "undefined" != typeof ArrayBuffer, o = "undefined" != typeof Uint8ClampedArray;
            if (n && i && r && o) {
                var s = fabric.util.createCanvasElement(), a = new ArrayBuffer(t * e * 4);
                if (fabric.forceGLPutImageData) return this.imageBuffer = a, void (this.copyGLTo2D = copyGLTo2DPutImageData);
                var c, l, h = {imageBuffer: a, destinationWidth: t, destinationHeight: e, targetCanvas: s};
                s.width = t, s.height = e, c = window.performance.now(), copyGLTo2DDrawImage.call(h, this.gl, h), l = window.performance.now() - c, c = window.performance.now(), copyGLTo2DPutImageData.call(h, this.gl, h), window.performance.now() - c < l ? (this.imageBuffer = a, this.copyGLTo2D = copyGLTo2DPutImageData) : this.copyGLTo2D = copyGLTo2DDrawImage
            }
        }, createWebGLCanvas: function (t, e) {
            var i = fabric.util.createCanvasElement();
            i.width = t, i.height = e;
            var n = {alpha: !0, premultipliedAlpha: !1, depth: !1, stencil: !1, antialias: !1},
                r = i.getContext("webgl", n);
            r || (r = i.getContext("experimental-webgl", n)), r && (r.clearColor(0, 0, 0, 0), this.canvas = i, this.gl = r)
        }, applyFilters: function (t, e, i, n, r, o) {
            var s, a = this.gl;
            o && (s = this.getCachedTexture(o, e));
            var c = {
                originalWidth: e.width || e.originalWidth,
                originalHeight: e.height || e.originalHeight,
                sourceWidth: i,
                sourceHeight: n,
                destinationWidth: i,
                destinationHeight: n,
                context: a,
                sourceTexture: this.createTexture(a, i, n, !s && e),
                targetTexture: this.createTexture(a, i, n),
                originalTexture: s || this.createTexture(a, i, n, !s && e),
                passes: t.length,
                webgl: !0,
                aPosition: this.aPosition,
                programCache: this.programCache,
                pass: 0,
                filterBackend: this,
                targetCanvas: r
            }, l = a.createFramebuffer();
            return a.bindFramebuffer(a.FRAMEBUFFER, l), t.forEach((function (t) {
                t && t.applyTo(c)
            })), resizeCanvasIfNeeded(c), this.copyGLTo2D(a, c), a.bindTexture(a.TEXTURE_2D, null), a.deleteTexture(c.sourceTexture), a.deleteTexture(c.targetTexture), a.deleteFramebuffer(l), r.getContext("2d").setTransform(1, 0, 0, 1, 0, 0), c
        }, dispose: function () {
            this.canvas && (this.canvas = null, this.gl = null), this.clearWebGLCaches()
        }, clearWebGLCaches: function () {
            this.programCache = {}, this.textureCache = {}
        }, createTexture: function (t, e, i, n) {
            var r = t.createTexture();
            return t.bindTexture(t.TEXTURE_2D, r), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.NEAREST), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.NEAREST), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), n ? t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, n) : t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, e, i, 0, t.RGBA, t.UNSIGNED_BYTE, null), r
        }, getCachedTexture: function (t, e) {
            if (this.textureCache[t]) return this.textureCache[t];
            var i = this.createTexture(this.gl, e.width, e.height, e);
            return this.textureCache[t] = i
        }, evictCachesForKey: function (t) {
            this.textureCache[t] && (this.gl.deleteTexture(this.textureCache[t]), delete this.textureCache[t])
        }, copyGLTo2D: copyGLTo2DDrawImage, captureGPUInfo: function () {
            if (this.gpuInfo) return this.gpuInfo;
            var t = this.gl, e = {renderer: "", vendor: ""};
            if (!t) return e;
            var i = t.getExtension("WEBGL_debug_renderer_info");
            if (i) {
                var n = t.getParameter(i.UNMASKED_RENDERER_WEBGL), r = t.getParameter(i.UNMASKED_VENDOR_WEBGL);
                n && (e.renderer = n.toLowerCase()), r && (e.vendor = r.toLowerCase())
            }
            return this.gpuInfo = e
        }
    }
}(), function () {
    "use strict";
    var t = function () {
    };
    (fabric.Canvas2dFilterBackend = function () {
    }).prototype = {
        evictCachesForKey: t,
        dispose: t,
        clearWebGLCaches: t,
        resources: {},
        applyFilters: function (t, e, i, n, r) {
            var o = r.getContext("2d");
            o.drawImage(e, 0, 0, i, n);
            var s = {
                sourceWidth: i,
                sourceHeight: n,
                imageData: o.getImageData(0, 0, i, n),
                originalEl: e,
                originalImageData: o.getImageData(0, 0, i, n),
                canvasEl: r,
                ctx: o,
                filterBackend: this
            };
            return t.forEach((function (t) {
                t.applyTo(s)
            })), s.imageData.width === i && s.imageData.height === n || (r.width = s.imageData.width, r.height = s.imageData.height), o.putImageData(s.imageData, 0, 0), s
        }
    }
}(), fabric.Image = fabric.Image || {}, fabric.Image.filters = fabric.Image.filters || {}, fabric.Image.filters.BaseFilter = fabric.util.createClass({
    type: "BaseFilter",
    vertexSource: "attribute vec2 aPosition;\nvarying vec2 vTexCoord;\nvoid main() {\nvTexCoord = aPosition;\ngl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n}",
    fragmentSource: "precision highp float;\nvarying vec2 vTexCoord;\nuniform sampler2D uTexture;\nvoid main() {\ngl_FragColor = texture2D(uTexture, vTexCoord);\n}",
    initialize: function (t) {
        t && this.setOptions(t)
    },
    setOptions: function (t) {
        for (var e in t) this[e] = t[e]
    },
    createProgram: function (t, e, i) {
        e = e || this.fragmentSource, i = i || this.vertexSource, "highp" !== fabric.webGlPrecision && (e = e.replace(/precision highp float/g, "precision " + fabric.webGlPrecision + " float"));
        var n = t.createShader(t.VERTEX_SHADER);
        if (t.shaderSource(n, i), t.compileShader(n), !t.getShaderParameter(n, t.COMPILE_STATUS)) throw new Error("Vertex shader compile error for " + this.type + ": " + t.getShaderInfoLog(n));
        var r = t.createShader(t.FRAGMENT_SHADER);
        if (t.shaderSource(r, e), t.compileShader(r), !t.getShaderParameter(r, t.COMPILE_STATUS)) throw new Error("Fragment shader compile error for " + this.type + ": " + t.getShaderInfoLog(r));
        var o = t.createProgram();
        if (t.attachShader(o, n), t.attachShader(o, r), t.linkProgram(o), !t.getProgramParameter(o, t.LINK_STATUS)) throw new Error('Shader link error for "${this.type}" ' + t.getProgramInfoLog(o));
        var s = this.getAttributeLocations(t, o), a = this.getUniformLocations(t, o) || {};
        return a.uStepW = t.getUniformLocation(o, "uStepW"), a.uStepH = t.getUniformLocation(o, "uStepH"), {
            program: o,
            attributeLocations: s,
            uniformLocations: a
        }
    },
    getAttributeLocations: function (t, e) {
        return {aPosition: t.getAttribLocation(e, "aPosition")}
    },
    getUniformLocations: function () {
        return {}
    },
    sendAttributeData: function (t, e, i) {
        var n = e.aPosition, r = t.createBuffer();
        t.bindBuffer(t.ARRAY_BUFFER, r), t.enableVertexAttribArray(n), t.vertexAttribPointer(n, 2, t.FLOAT, !1, 0, 0), t.bufferData(t.ARRAY_BUFFER, i, t.STATIC_DRAW)
    },
    _setupFrameBuffer: function (t) {
        var e, i, n = t.context;
        1 < t.passes ? (e = t.destinationWidth, i = t.destinationHeight, t.sourceWidth === e && t.sourceHeight === i || (n.deleteTexture(t.targetTexture), t.targetTexture = t.filterBackend.createTexture(n, e, i)), n.framebufferTexture2D(n.FRAMEBUFFER, n.COLOR_ATTACHMENT0, n.TEXTURE_2D, t.targetTexture, 0)) : (n.bindFramebuffer(n.FRAMEBUFFER, null), n.finish())
    },
    _swapTextures: function (t) {
        t.passes--, t.pass++;
        var e = t.targetTexture;
        t.targetTexture = t.sourceTexture, t.sourceTexture = e
    },
    isNeutralState: function () {
        var t = this.mainParameter, e = fabric.Image.filters[this.type].prototype;
        if (t) {
            if (Array.isArray(e[t])) {
                for (var i = e[t].length; i--;) if (this[t][i] !== e[t][i]) return !1;
                return !0
            }
            return e[t] === this[t]
        }
        return !1
    },
    applyTo: function (t) {
        t.webgl ? (this._setupFrameBuffer(t), this.applyToWebGL(t), this._swapTextures(t)) : this.applyTo2d(t)
    },
    retrieveShader: function (t) {
        return t.programCache.hasOwnProperty(this.type) || (t.programCache[this.type] = this.createProgram(t.context)), t.programCache[this.type]
    },
    applyToWebGL: function (t) {
        var e = t.context, i = this.retrieveShader(t);
        0 === t.pass && t.originalTexture ? e.bindTexture(e.TEXTURE_2D, t.originalTexture) : e.bindTexture(e.TEXTURE_2D, t.sourceTexture), e.useProgram(i.program), this.sendAttributeData(e, i.attributeLocations, t.aPosition), e.uniform1f(i.uniformLocations.uStepW, 1 / t.sourceWidth), e.uniform1f(i.uniformLocations.uStepH, 1 / t.sourceHeight), this.sendUniformData(e, i.uniformLocations), e.viewport(0, 0, t.destinationWidth, t.destinationHeight), e.drawArrays(e.TRIANGLE_STRIP, 0, 4)
    },
    bindAdditionalTexture: function (t, e, i) {
        t.activeTexture(i), t.bindTexture(t.TEXTURE_2D, e), t.activeTexture(t.TEXTURE0)
    },
    unbindAdditionalTexture: function (t, e) {
        t.activeTexture(e), t.bindTexture(t.TEXTURE_2D, null), t.activeTexture(t.TEXTURE0)
    },
    getMainParameter: function () {
        return this[this.mainParameter]
    },
    setMainParameter: function (t) {
        this[this.mainParameter] = t
    },
    sendUniformData: function () {
    },
    createHelpLayer: function (t) {
        if (!t.helpLayer) {
            var e = document.createElement("canvas");
            e.width = t.sourceWidth, e.height = t.sourceHeight, t.helpLayer = e
        }
    },
    toObject: function () {
        var t = {type: this.type}, e = this.mainParameter;
        return e && (t[e] = this[e]), t
    },
    toJSON: function () {
        return this.toObject()
    }
}), fabric.Image.filters.BaseFilter.fromObject = function (t, e) {
    var i = new fabric.Image.filters[t.type](t);
    return e && e(i), i
}, function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, n = e.util.createClass;
    i.ColorMatrix = n(i.BaseFilter, {
        type: "ColorMatrix",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nvarying vec2 vTexCoord;\nuniform mat4 uColorMatrix;\nuniform vec4 uConstants;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor *= uColorMatrix;\ncolor += uConstants;\ngl_FragColor = color;\n}",
        matrix: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
        mainParameter: "matrix",
        colorsOnly: !0,
        initialize: function (t) {
            this.callSuper("initialize", t), this.matrix = this.matrix.slice(0)
        },
        applyTo2d: function (t) {
            var e, i, n, r, o, s = t.imageData.data, a = s.length, c = this.matrix, l = this.colorsOnly;
            for (o = 0; o < a; o += 4) e = s[o], i = s[o + 1], n = s[o + 2], l ? (s[o] = e * c[0] + i * c[1] + n * c[2] + 255 * c[4], s[o + 1] = e * c[5] + i * c[6] + n * c[7] + 255 * c[9], s[o + 2] = e * c[10] + i * c[11] + n * c[12] + 255 * c[14]) : (r = s[o + 3], s[o] = e * c[0] + i * c[1] + n * c[2] + r * c[3] + 255 * c[4], s[o + 1] = e * c[5] + i * c[6] + n * c[7] + r * c[8] + 255 * c[9], s[o + 2] = e * c[10] + i * c[11] + n * c[12] + r * c[13] + 255 * c[14], s[o + 3] = e * c[15] + i * c[16] + n * c[17] + r * c[18] + 255 * c[19])
        },
        getUniformLocations: function (t, e) {
            return {
                uColorMatrix: t.getUniformLocation(e, "uColorMatrix"),
                uConstants: t.getUniformLocation(e, "uConstants")
            }
        },
        sendUniformData: function (t, e) {
            var i = this.matrix,
                n = [i[0], i[1], i[2], i[3], i[5], i[6], i[7], i[8], i[10], i[11], i[12], i[13], i[15], i[16], i[17], i[18]],
                r = [i[4], i[9], i[14], i[19]];
            t.uniformMatrix4fv(e.uColorMatrix, !1, n), t.uniform4fv(e.uConstants, r)
        }
    }), e.Image.filters.ColorMatrix.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, n = e.util.createClass;
    i.Brightness = n(i.BaseFilter, {
        type: "Brightness",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uBrightness;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor.rgb += uBrightness;\ngl_FragColor = color;\n}",
        brightness: 0,
        mainParameter: "brightness",
        applyTo2d: function (t) {
            if (0 !== this.brightness) {
                var e, i = t.imageData.data, n = i.length, r = Math.round(255 * this.brightness);
                for (e = 0; e < n; e += 4) i[e] = i[e] + r, i[e + 1] = i[e + 1] + r, i[e + 2] = i[e + 2] + r
            }
        },
        getUniformLocations: function (t, e) {
            return {uBrightness: t.getUniformLocation(e, "uBrightness")}
        },
        sendUniformData: function (t, e) {
            t.uniform1f(e.uBrightness, this.brightness)
        }
    }), e.Image.filters.Brightness.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.object.extend, n = e.Image.filters, r = e.util.createClass;
    n.Convolute = r(n.BaseFilter, {
        type: "Convolute", opaque: !1, matrix: [0, 0, 0, 0, 1, 0, 0, 0, 0], fragmentSource: {
            Convolute_3_1: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[9];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 3.0; h+=1.0) {\nfor (float w = 0.0; w < 3.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 1), uStepH * (h - 1));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 3.0 + w)];\n}\n}\ngl_FragColor = color;\n}",
            Convolute_3_0: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[9];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 3.0; h+=1.0) {\nfor (float w = 0.0; w < 3.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 1.0), uStepH * (h - 1.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 3.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}",
            Convolute_5_1: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[25];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 5.0; h+=1.0) {\nfor (float w = 0.0; w < 5.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 5.0 + w)];\n}\n}\ngl_FragColor = color;\n}",
            Convolute_5_0: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[25];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 5.0; h+=1.0) {\nfor (float w = 0.0; w < 5.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 5.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}",
            Convolute_7_1: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[49];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 7.0; h+=1.0) {\nfor (float w = 0.0; w < 7.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 7.0 + w)];\n}\n}\ngl_FragColor = color;\n}",
            Convolute_7_0: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[49];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 7.0; h+=1.0) {\nfor (float w = 0.0; w < 7.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 7.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}",
            Convolute_9_1: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[81];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 9.0; h+=1.0) {\nfor (float w = 0.0; w < 9.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 9.0 + w)];\n}\n}\ngl_FragColor = color;\n}",
            Convolute_9_0: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[81];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 9.0; h+=1.0) {\nfor (float w = 0.0; w < 9.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 9.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}"
        }, retrieveShader: function (t) {
            var e = Math.sqrt(this.matrix.length), i = this.type + "_" + e + "_" + (this.opaque ? 1 : 0),
                n = this.fragmentSource[i];
            return t.programCache.hasOwnProperty(i) || (t.programCache[i] = this.createProgram(t.context, n)), t.programCache[i]
        }, applyTo2d: function (t) {
            var e, i, n, r, o, s, a, c, l, h, u, f, d, p = t.imageData, g = p.data, v = this.matrix,
                m = Math.round(Math.sqrt(v.length)), _ = Math.floor(m / 2), b = p.width, y = p.height,
                x = t.ctx.createImageData(b, y), w = x.data, C = this.opaque ? 1 : 0;
            for (u = 0; u < y; u++) for (h = 0; h < b; h++) {
                for (o = 4 * (u * b + h), d = r = n = i = e = 0; d < m; d++) for (f = 0; f < m; f++) s = h + f - _, (a = u + d - _) < 0 || y < a || s < 0 || b < s || (c = 4 * (a * b + s), l = v[d * m + f], e += g[c] * l, i += g[c + 1] * l, n += g[c + 2] * l, C || (r += g[c + 3] * l));
                w[o] = e, w[o + 1] = i, w[o + 2] = n, w[o + 3] = C ? g[o + 3] : r
            }
            t.imageData = x
        }, getUniformLocations: function (t, e) {
            return {
                uMatrix: t.getUniformLocation(e, "uMatrix"),
                uOpaque: t.getUniformLocation(e, "uOpaque"),
                uHalfSize: t.getUniformLocation(e, "uHalfSize"),
                uSize: t.getUniformLocation(e, "uSize")
            }
        }, sendUniformData: function (t, e) {
            t.uniform1fv(e.uMatrix, this.matrix)
        }, toObject: function () {
            return i(this.callSuper("toObject"), {opaque: this.opaque, matrix: this.matrix})
        }
    }), e.Image.filters.Convolute.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, n = e.util.createClass;
    i.Grayscale = n(i.BaseFilter, {
        type: "Grayscale",
        fragmentSource: {
            average: "precision highp float;\nuniform sampler2D uTexture;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat average = (color.r + color.b + color.g) / 3.0;\ngl_FragColor = vec4(average, average, average, color.a);\n}",
            lightness: "precision highp float;\nuniform sampler2D uTexture;\nuniform int uMode;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 col = texture2D(uTexture, vTexCoord);\nfloat average = (max(max(col.r, col.g),col.b) + min(min(col.r, col.g),col.b)) / 2.0;\ngl_FragColor = vec4(average, average, average, col.a);\n}",
            luminosity: "precision highp float;\nuniform sampler2D uTexture;\nuniform int uMode;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 col = texture2D(uTexture, vTexCoord);\nfloat average = 0.21 * col.r + 0.72 * col.g + 0.07 * col.b;\ngl_FragColor = vec4(average, average, average, col.a);\n}"
        },
        mode: "average",
        mainParameter: "mode",
        applyTo2d: function (t) {
            var e, i, n = t.imageData.data, r = n.length, o = this.mode;
            for (e = 0; e < r; e += 4) "average" === o ? i = (n[e] + n[e + 1] + n[e + 2]) / 3 : "lightness" === o ? i = (Math.min(n[e], n[e + 1], n[e + 2]) + Math.max(n[e], n[e + 1], n[e + 2])) / 2 : "luminosity" === o && (i = .21 * n[e] + .72 * n[e + 1] + .07 * n[e + 2]), n[e] = i, n[e + 1] = i, n[e + 2] = i
        },
        retrieveShader: function (t) {
            var e = this.type + "_" + this.mode;
            if (!t.programCache.hasOwnProperty(e)) {
                var i = this.fragmentSource[this.mode];
                t.programCache[e] = this.createProgram(t.context, i)
            }
            return t.programCache[e]
        },
        getUniformLocations: function (t, e) {
            return {uMode: t.getUniformLocation(e, "uMode")}
        },
        sendUniformData: function (t, e) {
            t.uniform1i(e.uMode, 1)
        },
        isNeutralState: function () {
            return !1
        }
    }), e.Image.filters.Grayscale.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, n = e.util.createClass;
    i.Invert = n(i.BaseFilter, {
        type: "Invert",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform int uInvert;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nif (uInvert == 1) {\ngl_FragColor = vec4(1.0 - color.r,1.0 -color.g,1.0 -color.b,color.a);\n} else {\ngl_FragColor = color;\n}\n}",
        invert: !0,
        mainParameter: "invert",
        applyTo2d: function (t) {
            var e, i = t.imageData.data, n = i.length;
            for (e = 0; e < n; e += 4) i[e] = 255 - i[e], i[e + 1] = 255 - i[e + 1], i[e + 2] = 255 - i[e + 2]
        },
        isNeutralState: function () {
            return !this.invert
        },
        getUniformLocations: function (t, e) {
            return {uInvert: t.getUniformLocation(e, "uInvert")}
        },
        sendUniformData: function (t, e) {
            t.uniform1i(e.uInvert, this.invert)
        }
    }), e.Image.filters.Invert.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.object.extend, n = e.Image.filters, r = e.util.createClass;
    n.Noise = r(n.BaseFilter, {
        type: "Noise",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uStepH;\nuniform float uNoise;\nuniform float uSeed;\nvarying vec2 vTexCoord;\nfloat rand(vec2 co, float seed, float vScale) {\nreturn fract(sin(dot(co.xy * vScale ,vec2(12.9898 , 78.233))) * 43758.5453 * (seed + 0.01) / 2.0);\n}\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor.rgb += (0.5 - rand(vTexCoord, uSeed, 0.1 / uStepH)) * uNoise;\ngl_FragColor = color;\n}",
        mainParameter: "noise",
        noise: 0,
        applyTo2d: function (t) {
            if (0 !== this.noise) {
                var e, i, n = t.imageData.data, r = n.length, o = this.noise;
                for (e = 0, r = n.length; e < r; e += 4) i = (.5 - Math.random()) * o, n[e] += i, n[e + 1] += i, n[e + 2] += i
            }
        },
        getUniformLocations: function (t, e) {
            return {uNoise: t.getUniformLocation(e, "uNoise"), uSeed: t.getUniformLocation(e, "uSeed")}
        },
        sendUniformData: function (t, e) {
            t.uniform1f(e.uNoise, this.noise / 255), t.uniform1f(e.uSeed, Math.random())
        },
        toObject: function () {
            return i(this.callSuper("toObject"), {noise: this.noise})
        }
    }), e.Image.filters.Noise.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, n = e.util.createClass;
    i.Pixelate = n(i.BaseFilter, {
        type: "Pixelate",
        blocksize: 4,
        mainParameter: "blocksize",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uBlocksize;\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nfloat blockW = uBlocksize * uStepW;\nfloat blockH = uBlocksize * uStepW;\nint posX = int(vTexCoord.x / blockW);\nint posY = int(vTexCoord.y / blockH);\nfloat fposX = float(posX);\nfloat fposY = float(posY);\nvec2 squareCoords = vec2(fposX * blockW, fposY * blockH);\nvec4 color = texture2D(uTexture, squareCoords);\ngl_FragColor = color;\n}",
        applyTo2d: function (t) {
            var e, i, n, r, o, s, a, c, l, h, u, f = t.imageData, d = f.data, p = f.height, g = f.width;
            for (i = 0; i < p; i += this.blocksize) for (n = 0; n < g; n += this.blocksize) for (r = d[e = 4 * i * g + 4 * n], o = d[e + 1], s = d[e + 2], a = d[e + 3], h = Math.min(i + this.blocksize, p), u = Math.min(n + this.blocksize, g), c = i; c < h; c++) for (l = n; l < u; l++) d[e = 4 * c * g + 4 * l] = r, d[e + 1] = o, d[e + 2] = s, d[e + 3] = a
        },
        isNeutralState: function () {
            return 1 === this.blocksize
        },
        getUniformLocations: function (t, e) {
            return {
                uBlocksize: t.getUniformLocation(e, "uBlocksize"),
                uStepW: t.getUniformLocation(e, "uStepW"),
                uStepH: t.getUniformLocation(e, "uStepH")
            }
        },
        sendUniformData: function (t, e) {
            t.uniform1f(e.uBlocksize, this.blocksize)
        }
    }), e.Image.filters.Pixelate.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.object.extend, n = e.Image.filters, r = e.util.createClass;
    n.RemoveColor = r(n.BaseFilter, {
        type: "RemoveColor",
        color: "#FFFFFF",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform vec4 uLow;\nuniform vec4 uHigh;\nvarying vec2 vTexCoord;\nvoid main() {\ngl_FragColor = texture2D(uTexture, vTexCoord);\nif(all(greaterThan(gl_FragColor.rgb,uLow.rgb)) && all(greaterThan(uHigh.rgb,gl_FragColor.rgb))) {\ngl_FragColor.a = 0.0;\n}\n}",
        distance: .02,
        useAlpha: !1,
        applyTo2d: function (t) {
            var i, n, r, o, s = t.imageData.data, a = 255 * this.distance, c = new e.Color(this.color).getSource(),
                l = [c[0] - a, c[1] - a, c[2] - a], h = [c[0] + a, c[1] + a, c[2] + a];
            for (i = 0; i < s.length; i += 4) n = s[i], r = s[i + 1], o = s[i + 2], l[0] < n && l[1] < r && l[2] < o && n < h[0] && r < h[1] && o < h[2] && (s[i + 3] = 0)
        },
        getUniformLocations: function (t, e) {
            return {uLow: t.getUniformLocation(e, "uLow"), uHigh: t.getUniformLocation(e, "uHigh")}
        },
        sendUniformData: function (t, i) {
            var n = new e.Color(this.color).getSource(), r = parseFloat(this.distance),
                o = [0 + n[0] / 255 - r, 0 + n[1] / 255 - r, 0 + n[2] / 255 - r, 1],
                s = [n[0] / 255 + r, n[1] / 255 + r, n[2] / 255 + r, 1];
            t.uniform4fv(i.uLow, o), t.uniform4fv(i.uHigh, s)
        },
        toObject: function () {
            return i(this.callSuper("toObject"), {color: this.color, distance: this.distance})
        }
    }), e.Image.filters.RemoveColor.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, n = e.util.createClass, r = {
        Brownie: [.5997, .34553, -.27082, 0, .186, -.0377, .86095, .15059, 0, -.1449, .24113, -.07441, .44972, 0, -.02965, 0, 0, 0, 1, 0],
        Vintage: [.62793, .32021, -.03965, 0, .03784, .02578, .64411, .03259, 0, .02926, .0466, -.08512, .52416, 0, .02023, 0, 0, 0, 1, 0],
        Kodachrome: [1.12855, -.39673, -.03992, 0, .24991, -.16404, 1.08352, -.05498, 0, .09698, -.16786, -.56034, 1.60148, 0, .13972, 0, 0, 0, 1, 0],
        Technicolor: [1.91252, -.85453, -.09155, 0, .04624, -.30878, 1.76589, -.10601, 0, -.27589, -.2311, -.75018, 1.84759, 0, .12137, 0, 0, 0, 1, 0],
        Polaroid: [1.438, -.062, -.062, 0, 0, -.122, 1.378, -.122, 0, 0, -.016, -.016, 1.483, 0, 0, 0, 0, 0, 1, 0],
        Sepia: [.393, .769, .189, 0, 0, .349, .686, .168, 0, 0, .272, .534, .131, 0, 0, 0, 0, 0, 1, 0],
        BlackWhite: [1.5, 1.5, 1.5, 0, -1, 1.5, 1.5, 1.5, 0, -1, 1.5, 1.5, 1.5, 0, -1, 0, 0, 0, 1, 0]
    };
    for (var o in r) i[o] = n(i.ColorMatrix, {
        type: o,
        matrix: r[o],
        mainParameter: !1,
        colorsOnly: !0
    }), e.Image.filters[o].fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric, i = e.Image.filters, n = e.util.createClass;
    i.BlendColor = n(i.BaseFilter, {
        type: "BlendColor",
        color: "#F95C63",
        mode: "multiply",
        alpha: 1,
        fragmentSource: {
            multiply: "gl_FragColor.rgb *= uColor.rgb;\n",
            screen: "gl_FragColor.rgb = 1.0 - (1.0 - gl_FragColor.rgb) * (1.0 - uColor.rgb);\n",
            add: "gl_FragColor.rgb += uColor.rgb;\n",
            diff: "gl_FragColor.rgb = abs(gl_FragColor.rgb - uColor.rgb);\n",
            subtract: "gl_FragColor.rgb -= uColor.rgb;\n",
            lighten: "gl_FragColor.rgb = max(gl_FragColor.rgb, uColor.rgb);\n",
            darken: "gl_FragColor.rgb = min(gl_FragColor.rgb, uColor.rgb);\n",
            exclusion: "gl_FragColor.rgb += uColor.rgb - 2.0 * (uColor.rgb * gl_FragColor.rgb);\n",
            overlay: "if (uColor.r < 0.5) {\ngl_FragColor.r *= 2.0 * uColor.r;\n} else {\ngl_FragColor.r = 1.0 - 2.0 * (1.0 - gl_FragColor.r) * (1.0 - uColor.r);\n}\nif (uColor.g < 0.5) {\ngl_FragColor.g *= 2.0 * uColor.g;\n} else {\ngl_FragColor.g = 1.0 - 2.0 * (1.0 - gl_FragColor.g) * (1.0 - uColor.g);\n}\nif (uColor.b < 0.5) {\ngl_FragColor.b *= 2.0 * uColor.b;\n} else {\ngl_FragColor.b = 1.0 - 2.0 * (1.0 - gl_FragColor.b) * (1.0 - uColor.b);\n}\n",
            tint: "gl_FragColor.rgb *= (1.0 - uColor.a);\ngl_FragColor.rgb += uColor.rgb;\n"
        },
        buildSource: function (t) {
            return "precision highp float;\nuniform sampler2D uTexture;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ngl_FragColor = color;\nif (color.a > 0.0) {\n" + this.fragmentSource[t] + "}\n}"
        },
        retrieveShader: function (t) {
            var e, i = this.type + "_" + this.mode;
            return t.programCache.hasOwnProperty(i) || (e = this.buildSource(this.mode), t.programCache[i] = this.createProgram(t.context, e)), t.programCache[i]
        },
        applyTo2d: function (t) {
            var i, n, r, o, s, a, c, l = t.imageData.data, h = l.length, u = 1 - this.alpha;
            i = (c = new e.Color(this.color).getSource())[0] * this.alpha, n = c[1] * this.alpha, r = c[2] * this.alpha;
            for (var f = 0; f < h; f += 4) switch (o = l[f], s = l[f + 1], a = l[f + 2], this.mode) {
                case"multiply":
                    l[f] = o * i / 255, l[f + 1] = s * n / 255, l[f + 2] = a * r / 255;
                    break;
                case"screen":
                    l[f] = 255 - (255 - o) * (255 - i) / 255, l[f + 1] = 255 - (255 - s) * (255 - n) / 255, l[f + 2] = 255 - (255 - a) * (255 - r) / 255;
                    break;
                case"add":
                    l[f] = o + i, l[f + 1] = s + n, l[f + 2] = a + r;
                    break;
                case"diff":
                case"difference":
                    l[f] = Math.abs(o - i), l[f + 1] = Math.abs(s - n), l[f + 2] = Math.abs(a - r);
                    break;
                case"subtract":
                    l[f] = o - i, l[f + 1] = s - n, l[f + 2] = a - r;
                    break;
                case"darken":
                    l[f] = Math.min(o, i), l[f + 1] = Math.min(s, n), l[f + 2] = Math.min(a, r);
                    break;
                case"lighten":
                    l[f] = Math.max(o, i), l[f + 1] = Math.max(s, n), l[f + 2] = Math.max(a, r);
                    break;
                case"overlay":
                    l[f] = i < 128 ? 2 * o * i / 255 : 255 - 2 * (255 - o) * (255 - i) / 255, l[f + 1] = n < 128 ? 2 * s * n / 255 : 255 - 2 * (255 - s) * (255 - n) / 255, l[f + 2] = r < 128 ? 2 * a * r / 255 : 255 - 2 * (255 - a) * (255 - r) / 255;
                    break;
                case"exclusion":
                    l[f] = i + o - 2 * i * o / 255, l[f + 1] = n + s - 2 * n * s / 255, l[f + 2] = r + a - 2 * r * a / 255;
                    break;
                case"tint":
                    l[f] = i + o * u, l[f + 1] = n + s * u, l[f + 2] = r + a * u
            }
        },
        getUniformLocations: function (t, e) {
            return {uColor: t.getUniformLocation(e, "uColor")}
        },
        sendUniformData: function (t, i) {
            var n = new e.Color(this.color).getSource();
            n[0] = this.alpha * n[0] / 255, n[1] = this.alpha * n[1] / 255, n[2] = this.alpha * n[2] / 255, n[3] = this.alpha, t.uniform4fv(i.uColor, n)
        },
        toObject: function () {
            return {type: this.type, color: this.color, mode: this.mode, alpha: this.alpha}
        }
    }), e.Image.filters.BlendColor.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric, i = e.Image.filters, n = e.util.createClass;
    i.BlendImage = n(i.BaseFilter, {
        type: "BlendImage",
        image: null,
        mode: "multiply",
        alpha: 1,
        vertexSource: "attribute vec2 aPosition;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nuniform mat3 uTransformMatrix;\nvoid main() {\nvTexCoord = aPosition;\nvTexCoord2 = (uTransformMatrix * vec3(aPosition, 1.0)).xy;\ngl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n}",
        fragmentSource: {
            multiply: "precision highp float;\nuniform sampler2D uTexture;\nuniform sampler2D uImage;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec4 color2 = texture2D(uImage, vTexCoord2);\ncolor.rgba *= color2.rgba;\ngl_FragColor = color;\n}",
            mask: "precision highp float;\nuniform sampler2D uTexture;\nuniform sampler2D uImage;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec4 color2 = texture2D(uImage, vTexCoord2);\ncolor.a = color2.a;\ngl_FragColor = color;\n}"
        },
        retrieveShader: function (t) {
            var e = this.type + "_" + this.mode, i = this.fragmentSource[this.mode];
            return t.programCache.hasOwnProperty(e) || (t.programCache[e] = this.createProgram(t.context, i)), t.programCache[e]
        },
        applyToWebGL: function (t) {
            var e = t.context, i = this.createTexture(t.filterBackend, this.image);
            this.bindAdditionalTexture(e, i, e.TEXTURE1), this.callSuper("applyToWebGL", t), this.unbindAdditionalTexture(e, e.TEXTURE1)
        },
        createTexture: function (t, e) {
            return t.getCachedTexture(e.cacheKey, e._element)
        },
        calculateMatrix: function () {
            var t = this.image, e = t._element.width, i = t._element.height;
            return [1 / t.scaleX, 0, 0, 0, 1 / t.scaleY, 0, -t.left / e, -t.top / i, 1]
        },
        applyTo2d: function (t) {
            var i, n, r, o, s, a, c, l, h, u, f, d = t.imageData, p = t.filterBackend.resources, g = d.data,
                v = g.length, m = d.width, _ = d.height, b = this.image;
            p.blendImage || (p.blendImage = e.util.createCanvasElement()), u = (h = p.blendImage).getContext("2d"), h.width !== m || h.height !== _ ? (h.width = m, h.height = _) : u.clearRect(0, 0, m, _), u.setTransform(b.scaleX, 0, 0, b.scaleY, b.left, b.top), u.drawImage(b._element, 0, 0, m, _), f = u.getImageData(0, 0, m, _).data;
            for (var y = 0; y < v; y += 4) switch (s = g[y], a = g[y + 1], c = g[y + 2], l = g[y + 3], i = f[y], n = f[y + 1], r = f[y + 2], o = f[y + 3], this.mode) {
                case"multiply":
                    g[y] = s * i / 255, g[y + 1] = a * n / 255, g[y + 2] = c * r / 255, g[y + 3] = l * o / 255;
                    break;
                case"mask":
                    g[y + 3] = o
            }
        },
        getUniformLocations: function (t, e) {
            return {
                uTransformMatrix: t.getUniformLocation(e, "uTransformMatrix"),
                uImage: t.getUniformLocation(e, "uImage")
            }
        },
        sendUniformData: function (t, e) {
            var i = this.calculateMatrix();
            t.uniform1i(e.uImage, 1), t.uniformMatrix3fv(e.uTransformMatrix, !1, i)
        },
        toObject: function () {
            return {type: this.type, image: this.image && this.image.toObject(), mode: this.mode, alpha: this.alpha}
        }
    }), e.Image.filters.BlendImage.fromObject = function (t, i) {
        e.Image.fromObject(t.image, (function (n) {
            var r = e.util.object.clone(t);
            r.image = n, i(new e.Image.filters.BlendImage(r))
        }))
    }
}("undefined" != typeof exports ? exports : this), function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = Math.pow, n = Math.floor, r = Math.sqrt, o = Math.abs, s = Math.round,
        a = Math.sin, c = Math.ceil, l = e.Image.filters, h = e.util.createClass;
    l.Resize = h(l.BaseFilter, {
        type: "Resize",
        resizeType: "hermite",
        scaleX: 1,
        scaleY: 1,
        lanczosLobes: 3,
        getUniformLocations: function (t, e) {
            return {uDelta: t.getUniformLocation(e, "uDelta"), uTaps: t.getUniformLocation(e, "uTaps")}
        },
        sendUniformData: function (t, e) {
            t.uniform2fv(e.uDelta, this.horizontal ? [1 / this.width, 0] : [0, 1 / this.height]), t.uniform1fv(e.uTaps, this.taps)
        },
        retrieveShader: function (t) {
            var e = this.getFilterWindow(), i = this.type + "_" + e;
            if (!t.programCache.hasOwnProperty(i)) {
                var n = this.generateShader(e);
                t.programCache[i] = this.createProgram(t.context, n)
            }
            return t.programCache[i]
        },
        getFilterWindow: function () {
            var t = this.tempScale;
            return Math.ceil(this.lanczosLobes / t)
        },
        getTaps: function () {
            for (var t = this.lanczosCreate(this.lanczosLobes), e = this.tempScale, i = this.getFilterWindow(), n = new Array(i), r = 1; r <= i; r++) n[r - 1] = t(r * e);
            return n
        },
        generateShader: function (t) {
            for (var e = new Array(t), i = this.fragmentSourceTOP, n = 1; n <= t; n++) e[n - 1] = n + ".0 * uDelta";
            return i += "uniform float uTaps[" + t + "];\n", i += "void main() {\n", i += "  vec4 color = texture2D(uTexture, vTexCoord);\n", i += "  float sum = 1.0;\n", e.forEach((function (t, e) {
                i += "  color += texture2D(uTexture, vTexCoord + " + t + ") * uTaps[" + e + "];\n", i += "  color += texture2D(uTexture, vTexCoord - " + t + ") * uTaps[" + e + "];\n", i += "  sum += 2.0 * uTaps[" + e + "];\n"
            })), i += "  gl_FragColor = color / sum;\n", i += "}"
        },
        fragmentSourceTOP: "precision highp float;\nuniform sampler2D uTexture;\nuniform vec2 uDelta;\nvarying vec2 vTexCoord;\n",
        applyTo: function (t) {
            t.webgl ? (t.passes++, this.width = t.sourceWidth, this.horizontal = !0, this.dW = Math.round(this.width * this.scaleX), this.dH = t.sourceHeight, this.tempScale = this.dW / this.width, this.taps = this.getTaps(), t.destinationWidth = this.dW, this._setupFrameBuffer(t), this.applyToWebGL(t), this._swapTextures(t), t.sourceWidth = t.destinationWidth, this.height = t.sourceHeight, this.horizontal = !1, this.dH = Math.round(this.height * this.scaleY), this.tempScale = this.dH / this.height, this.taps = this.getTaps(), t.destinationHeight = this.dH, this._setupFrameBuffer(t), this.applyToWebGL(t), this._swapTextures(t), t.sourceHeight = t.destinationHeight) : this.applyTo2d(t)
        },
        isNeutralState: function () {
            return 1 === this.scaleX && 1 === this.scaleY
        },
        lanczosCreate: function (t) {
            return function (e) {
                if (t <= e || e <= -t) return 0;
                if (e < 1.1920929e-7 && -1.1920929e-7 < e) return 1;
                var i = (e *= Math.PI) / t;
                return a(e) / e * a(i) / i
            }
        },
        applyTo2d: function (t) {
            var e = t.imageData, i = this.scaleX, n = this.scaleY;
            this.rcpScaleX = 1 / i, this.rcpScaleY = 1 / n;
            var r, o = e.width, a = e.height, c = s(o * i), l = s(a * n);
            "sliceHack" === this.resizeType ? r = this.sliceByTwo(t, o, a, c, l) : "hermite" === this.resizeType ? r = this.hermiteFastResize(t, o, a, c, l) : "bilinear" === this.resizeType ? r = this.bilinearFiltering(t, o, a, c, l) : "lanczos" === this.resizeType && (r = this.lanczosResize(t, o, a, c, l)), t.imageData = r
        },
        sliceByTwo: function (t, i, r, o, s) {
            var a, c, l = t.imageData, h = !1, u = !1, f = .5 * i, d = .5 * r, p = e.filterBackend.resources, g = 0,
                v = 0, m = i, _ = 0;
            for (p.sliceByTwo || (p.sliceByTwo = document.createElement("canvas")), ((a = p.sliceByTwo).width < 1.5 * i || a.height < r) && (a.width = 1.5 * i, a.height = r), (c = a.getContext("2d")).clearRect(0, 0, 1.5 * i, r), c.putImageData(l, 0, 0), o = n(o), s = n(s); !h || !u;) r = d, o < n(.5 * (i = f)) ? f = n(.5 * f) : (f = o, h = !0), s < n(.5 * d) ? d = n(.5 * d) : (d = s, u = !0), c.drawImage(a, g, v, i, r, m, _, f, d), g = m, v = _, _ += d;
            return c.getImageData(g, v, o, s)
        },
        lanczosResize: function (t, e, s, a, l) {
            var h = t.imageData.data, u = t.ctx.createImageData(a, l), f = u.data,
                d = this.lanczosCreate(this.lanczosLobes), p = this.rcpScaleX, g = this.rcpScaleY,
                v = 2 / this.rcpScaleX, m = 2 / this.rcpScaleY, _ = c(p * this.lanczosLobes / 2),
                b = c(g * this.lanczosLobes / 2), y = {}, x = {}, w = {};
            return function t(c) {
                var C, S, T, O, E, k, P, j, A, M, D;
                for (x.x = (c + .5) * p, w.x = n(x.x), C = 0; C < l; C++) {
                    for (x.y = (C + .5) * g, w.y = n(x.y), A = j = P = k = E = 0, S = w.x - _; S <= w.x + _; S++) if (!(S < 0 || e <= S)) {
                        M = n(1e3 * o(S - x.x)), y[M] || (y[M] = {});
                        for (var I = w.y - b; I <= w.y + b; I++) I < 0 || s <= I || (D = n(1e3 * o(I - x.y)), y[M][D] || (y[M][D] = d(r(i(M * v, 2) + i(D * m, 2)) / 1e3)), 0 < (T = y[M][D]) && (E += T, k += T * h[O = 4 * (I * e + S)], P += T * h[O + 1], j += T * h[O + 2], A += T * h[O + 3]))
                    }
                    f[O = 4 * (C * a + c)] = k / E, f[O + 1] = P / E, f[O + 2] = j / E, f[O + 3] = A / E
                }
                return ++c < a ? t(c) : u
            }(0)
        },
        bilinearFiltering: function (t, e, i, r, o) {
            var s, a, c, l, h, u, f, d, p, g = 0, v = this.rcpScaleX, m = this.rcpScaleY, _ = 4 * (e - 1),
                b = t.imageData.data, y = t.ctx.createImageData(r, o), x = y.data;
            for (c = 0; c < o; c++) for (l = 0; l < r; l++) for (h = v * l - (s = n(v * l)), u = m * c - (a = n(m * c)), p = 4 * (a * e + s), f = 0; f < 4; f++) d = b[p + f] * (1 - h) * (1 - u) + b[p + 4 + f] * h * (1 - u) + b[p + _ + f] * u * (1 - h) + b[p + _ + 4 + f] * h * u, x[g++] = d;
            return y
        },
        hermiteFastResize: function (t, e, i, s, a) {
            for (var l = this.rcpScaleX, h = this.rcpScaleY, u = c(l / 2), f = c(h / 2), d = t.imageData.data, p = t.ctx.createImageData(s, a), g = p.data, v = 0; v < a; v++) for (var m = 0; m < s; m++) {
                for (var _ = 4 * (m + v * s), b = 0, y = 0, x = 0, w = 0, C = 0, S = 0, T = 0, O = (v + .5) * h, E = n(v * h); E < (v + 1) * h; E++) for (var k = o(O - (E + .5)) / f, P = (m + .5) * l, j = k * k, A = n(m * l); A < (m + 1) * l; A++) {
                    var M = o(P - (A + .5)) / u, D = r(j + M * M);
                    1 < D && D < -1 || 0 < (b = 2 * D * D * D - 3 * D * D + 1) && (T += b * d[3 + (M = 4 * (A + E * e))], x += b, d[M + 3] < 255 && (b = b * d[M + 3] / 250), w += b * d[M], C += b * d[M + 1], S += b * d[M + 2], y += b)
                }
                g[_] = w / y, g[_ + 1] = C / y, g[_ + 2] = S / y, g[_ + 3] = T / x
            }
            return p
        },
        toObject: function () {
            return {
                type: this.type,
                scaleX: this.scaleX,
                scaleY: this.scaleY,
                resizeType: this.resizeType,
                lanczosLobes: this.lanczosLobes
            }
        }
    }), e.Image.filters.Resize.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this),function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, n = e.util.createClass;
    i.Contrast = n(i.BaseFilter, {
        type: "Contrast",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uContrast;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat contrastF = 1.015 * (uContrast + 1.0) / (1.0 * (1.015 - uContrast));\ncolor.rgb = contrastF * (color.rgb - 0.5) + 0.5;\ngl_FragColor = color;\n}",
        contrast: 0,
        mainParameter: "contrast",
        applyTo2d: function (t) {
            if (0 !== this.contrast) {
                var e, i = t.imageData.data, n = i.length, r = Math.floor(255 * this.contrast),
                    o = 259 * (r + 255) / (255 * (259 - r));
                for (e = 0; e < n; e += 4) i[e] = o * (i[e] - 128) + 128, i[e + 1] = o * (i[e + 1] - 128) + 128, i[e + 2] = o * (i[e + 2] - 128) + 128
            }
        },
        getUniformLocations: function (t, e) {
            return {uContrast: t.getUniformLocation(e, "uContrast")}
        },
        sendUniformData: function (t, e) {
            t.uniform1f(e.uContrast, this.contrast)
        }
    }), e.Image.filters.Contrast.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this),function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, n = e.util.createClass;
    i.Saturation = n(i.BaseFilter, {
        type: "Saturation",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform float uSaturation;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat rgMax = max(color.r, color.g);\nfloat rgbMax = max(rgMax, color.b);\ncolor.r += rgbMax != color.r ? (rgbMax - color.r) * uSaturation : 0.00;\ncolor.g += rgbMax != color.g ? (rgbMax - color.g) * uSaturation : 0.00;\ncolor.b += rgbMax != color.b ? (rgbMax - color.b) * uSaturation : 0.00;\ngl_FragColor = color;\n}",
        saturation: 0,
        mainParameter: "saturation",
        applyTo2d: function (t) {
            if (0 !== this.saturation) {
                var e, i, n = t.imageData.data, r = n.length, o = -this.saturation;
                for (e = 0; e < r; e += 4) i = Math.max(n[e], n[e + 1], n[e + 2]), n[e] += i !== n[e] ? (i - n[e]) * o : 0, n[e + 1] += i !== n[e + 1] ? (i - n[e + 1]) * o : 0, n[e + 2] += i !== n[e + 2] ? (i - n[e + 2]) * o : 0
            }
        },
        getUniformLocations: function (t, e) {
            return {uSaturation: t.getUniformLocation(e, "uSaturation")}
        },
        sendUniformData: function (t, e) {
            t.uniform1f(e.uSaturation, -this.saturation)
        }
    }), e.Image.filters.Saturation.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this),function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, n = e.util.createClass;
    i.Blur = n(i.BaseFilter, {
        type: "Blur",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform vec2 uDelta;\nvarying vec2 vTexCoord;\nconst float nSamples = 15.0;\nvec3 v3offset = vec3(12.9898, 78.233, 151.7182);\nfloat random(vec3 scale) {\nreturn fract(sin(dot(gl_FragCoord.xyz, scale)) * 43758.5453);\n}\nvoid main() {\nvec4 color = vec4(0.0);\nfloat total = 0.0;\nfloat offset = random(v3offset);\nfor (float t = -nSamples; t <= nSamples; t++) {\nfloat percent = (t + offset - 0.5) / nSamples;\nfloat weight = 1.0 - abs(percent);\ncolor += texture2D(uTexture, vTexCoord + uDelta * percent) * weight;\ntotal += weight;\n}\ngl_FragColor = color / total;\n}",
        blur: 0,
        mainParameter: "blur",
        applyTo: function (t) {
            t.webgl ? (this.aspectRatio = t.sourceWidth / t.sourceHeight, t.passes++, this._setupFrameBuffer(t), this.horizontal = !0, this.applyToWebGL(t), this._swapTextures(t), this._setupFrameBuffer(t), this.horizontal = !1, this.applyToWebGL(t), this._swapTextures(t)) : this.applyTo2d(t)
        },
        applyTo2d: function (t) {
            t.imageData = this.simpleBlur(t)
        },
        simpleBlur: function (t) {
            var i, n, r = t.filterBackend.resources, o = t.imageData.width, s = t.imageData.height;
            r.blurLayer1 || (r.blurLayer1 = e.util.createCanvasElement(), r.blurLayer2 = e.util.createCanvasElement()), i = r.blurLayer1, n = r.blurLayer2, i.width === o && i.height === s || (n.width = i.width = o, n.height = i.height = s);
            var a, c, l, h, u = i.getContext("2d"), f = n.getContext("2d"), d = .06 * this.blur * .5;
            for (u.putImageData(t.imageData, 0, 0), f.clearRect(0, 0, o, s), h = -15; h <= 15; h++) l = d * (c = h / 15) * o + (a = (Math.random() - .5) / 4), f.globalAlpha = 1 - Math.abs(c), f.drawImage(i, l, a), u.drawImage(n, 0, 0), f.globalAlpha = 1, f.clearRect(0, 0, n.width, n.height);
            for (h = -15; h <= 15; h++) l = d * (c = h / 15) * s + (a = (Math.random() - .5) / 4), f.globalAlpha = 1 - Math.abs(c), f.drawImage(i, a, l), u.drawImage(n, 0, 0), f.globalAlpha = 1, f.clearRect(0, 0, n.width, n.height);
            t.ctx.drawImage(i, 0, 0);
            var p = t.ctx.getImageData(0, 0, i.width, i.height);
            return u.globalAlpha = 1, u.clearRect(0, 0, i.width, i.height), p
        },
        getUniformLocations: function (t, e) {
            return {delta: t.getUniformLocation(e, "uDelta")}
        },
        sendUniformData: function (t, e) {
            var i = this.chooseRightDelta();
            t.uniform2fv(e.delta, i)
        },
        chooseRightDelta: function () {
            var t, e = 1, i = [0, 0];
            return this.horizontal ? 1 < this.aspectRatio && (e = 1 / this.aspectRatio) : this.aspectRatio < 1 && (e = this.aspectRatio), t = e * this.blur * .12, this.horizontal ? i[0] = t : i[1] = t, i
        }
    }), i.Blur.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this),function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, n = e.util.createClass;
    i.Gamma = n(i.BaseFilter, {
        type: "Gamma",
        fragmentSource: "precision highp float;\nuniform sampler2D uTexture;\nuniform vec3 uGamma;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec3 correction = (1.0 / uGamma);\ncolor.r = pow(color.r, correction.r);\ncolor.g = pow(color.g, correction.g);\ncolor.b = pow(color.b, correction.b);\ngl_FragColor = color;\ngl_FragColor.rgb *= color.a;\n}",
        gamma: [1, 1, 1],
        mainParameter: "gamma",
        initialize: function (t) {
            this.gamma = [1, 1, 1], i.BaseFilter.prototype.initialize.call(this, t)
        },
        applyTo2d: function (t) {
            var e, i = t.imageData.data, n = this.gamma, r = i.length, o = 1 / n[0], s = 1 / n[1], a = 1 / n[2];
            for (this.rVals || (this.rVals = new Uint8Array(256), this.gVals = new Uint8Array(256), this.bVals = new Uint8Array(256)), e = 0, r = 256; e < r; e++) this.rVals[e] = 255 * Math.pow(e / 255, o), this.gVals[e] = 255 * Math.pow(e / 255, s), this.bVals[e] = 255 * Math.pow(e / 255, a);
            for (e = 0, r = i.length; e < r; e += 4) i[e] = this.rVals[i[e]], i[e + 1] = this.gVals[i[e + 1]], i[e + 2] = this.bVals[i[e + 2]]
        },
        getUniformLocations: function (t, e) {
            return {uGamma: t.getUniformLocation(e, "uGamma")}
        },
        sendUniformData: function (t, e) {
            t.uniform3fv(e.uGamma, this.gamma)
        }
    }), e.Image.filters.Gamma.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this),function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, n = e.util.createClass;
    i.Composed = n(i.BaseFilter, {
        type: "Composed", subFilters: [], initialize: function (t) {
            this.callSuper("initialize", t), this.subFilters = this.subFilters.slice(0)
        }, applyTo: function (t) {
            t.passes += this.subFilters.length - 1, this.subFilters.forEach((function (e) {
                e.applyTo(t)
            }))
        }, toObject: function () {
            return e.util.object.extend(this.callSuper("toObject"), {
                subFilters: this.subFilters.map((function (t) {
                    return t.toObject()
                }))
            })
        }, isNeutralState: function () {
            return !this.subFilters.some((function (t) {
                return !t.isNeutralState()
            }))
        }
    }), e.Image.filters.Composed.fromObject = function (t, i) {
        var n = (t.subFilters || []).map((function (t) {
            return new e.Image.filters[t.type](t)
        })), r = new e.Image.filters.Composed({subFilters: n});
        return i && i(r), r
    }
}("undefined" != typeof exports ? exports : this),function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.Image.filters, n = e.util.createClass;
    i.HueRotation = n(i.ColorMatrix, {
        type: "HueRotation",
        rotation: 0,
        mainParameter: "rotation",
        calculateMatrix: function () {
            var t = this.rotation * Math.PI, i = e.util.cos(t), n = e.util.sin(t), r = Math.sqrt(1 / 3) * n, o = 1 - i;
            this.matrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0], this.matrix[0] = i + o / 3, this.matrix[1] = 1 / 3 * o - r, this.matrix[2] = 1 / 3 * o + r, this.matrix[5] = 1 / 3 * o + r, this.matrix[6] = i + 1 / 3 * o, this.matrix[7] = 1 / 3 * o - r, this.matrix[10] = 1 / 3 * o - r, this.matrix[11] = 1 / 3 * o + r, this.matrix[12] = i + 1 / 3 * o
        },
        isNeutralState: function (t) {
            return this.calculateMatrix(), i.BaseFilter.prototype.isNeutralState.call(this, t)
        },
        applyTo: function (t) {
            this.calculateMatrix(), i.BaseFilter.prototype.applyTo.call(this, t)
        }
    }), e.Image.filters.HueRotation.fromObject = e.Image.filters.BaseFilter.fromObject
}("undefined" != typeof exports ? exports : this),
function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {}), i = e.util.object.clone;
    e.Text ? e.warn("fabric.Text is already defined") : (e.Text = e.util.createClass(e.Object, {
        _dimensionAffectingProps: ["fontSize", "fontWeight", "fontFamily", "fontStyle", "lineHeight", "text", "charSpacing", "textAlign", "styles"],
        _reNewline: /\r?\n/,
        _reSpacesAndTabs: /[ \t\r]/g,
        _reSpaceAndTab: /[ \t\r]/,
        _reWords: /\S+/g,
        type: "text",
        fontSize: 40,
        fontWeight: "normal",
        fontFamily: "Times New Roman",
        underline: !1,
        overline: !1,
        linethrough: !1,
        textAlign: "left",
        fontStyle: "normal",
        lineHeight: 1.16,
        superscript: {size: .6, baseline: -.35},
        subscript: {size: .6, baseline: .11},
        textBackgroundColor: "",
        stateProperties: e.Object.prototype.stateProperties.concat("fontFamily", "fontWeight", "fontSize", "text", "underline", "overline", "linethrough", "textAlign", "fontStyle", "lineHeight", "textBackgroundColor", "charSpacing", "styles"),
        cacheProperties: e.Object.prototype.cacheProperties.concat("fontFamily", "fontWeight", "fontSize", "text", "underline", "overline", "linethrough", "textAlign", "fontStyle", "lineHeight", "textBackgroundColor", "charSpacing", "styles"),
        stroke: null,
        shadow: null,
        _fontSizeFraction: .222,
        offsets: {underline: .1, linethrough: -.315, overline: -.88},
        _fontSizeMult: 1.13,
        charSpacing: 0,
        styles: null,
        _measuringContext: null,
        deltaY: 0,
        _styleProperties: ["stroke", "strokeWidth", "fill", "fontFamily", "fontSize", "fontWeight", "fontStyle", "underline", "overline", "linethrough", "deltaY", "textBackgroundColor"],
        __charBounds: [],
        CACHE_FONT_SIZE: 400,
        MIN_TEXT_WIDTH: 2,
        initialize: function (t, e) {
            this.styles = e && e.styles || {}, this.text = t, this.__skipDimension = !0, this.callSuper("initialize", e), this.__skipDimension = !1, this.initDimensions(), this.setCoords(), this.setupState({propertySet: "_dimensionAffectingProps"})
        },
        getMeasuringContext: function () {
            return e._measuringContext || (e._measuringContext = this.canvas && this.canvas.contextCache || e.util.createCanvasElement().getContext("2d")), e._measuringContext
        },
        _splitText: function () {
            var t = this._splitTextIntoLines(this.text);
            return this.textLines = t.lines, this._textLines = t.graphemeLines, this._unwrappedTextLines = t._unwrappedLines, this._text = t.graphemeText, t
        },
        initDimensions: function () {
            this.__skipDimension || (this._splitText(), this._clearCache(), this.width = this.calcTextWidth() || this.cursorWidth || this.MIN_TEXT_WIDTH, -1 !== this.textAlign.indexOf("justify") && this.enlargeSpaces(), this.height = this.calcTextHeight(), this.saveState({propertySet: "_dimensionAffectingProps"}))
        },
        enlargeSpaces: function () {
            for (var t, e, i, n, r, o, s, a = 0, c = this._textLines.length; a < c; a++) if (("justify" === this.textAlign || a !== c - 1 && !this.isEndOfWrapping(a)) && (n = 0, r = this._textLines[a], (e = this.getLineWidth(a)) < this.width && (s = this.textLines[a].match(this._reSpacesAndTabs)))) {
                i = s.length, t = (this.width - e) / i;
                for (var l = 0, h = r.length; l <= h; l++) o = this.__charBounds[a][l], this._reSpaceAndTab.test(r[l]) ? (o.width += t, o.kernedWidth += t, o.left += n, n += t) : o.left += n
            }
        },
        isEndOfWrapping: function (t) {
            return t === this._textLines.length - 1
        },
        missingNewlineOffset: function () {
            return 1
        },
        toString: function () {
            return "#<fabric.Text (" + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>'
        },
        _getCacheCanvasDimensions: function () {
            var t = this.callSuper("_getCacheCanvasDimensions"), e = this.fontSize;
            return t.width += e * t.zoomX, t.height += e * t.zoomY, t
        },
        _render: function (t) {
            this._setTextStyles(t), this._renderTextLinesBackground(t), this._renderTextDecoration(t, "underline"), this._renderText(t), this._renderTextDecoration(t, "overline"), this._renderTextDecoration(t, "linethrough")
        },
        _renderText: function (t) {
            "stroke" === this.paintFirst ? (this._renderTextStroke(t), this._renderTextFill(t)) : (this._renderTextFill(t), this._renderTextStroke(t))
        },
        _setTextStyles: function (t, e, i) {
            t.textBaseline = "alphabetic", t.font = this._getFontDeclaration(e, i)
        },
        calcTextWidth: function () {
            for (var t = this.getLineWidth(0), e = 1, i = this._textLines.length; e < i; e++) {
                var n = this.getLineWidth(e);
                t < n && (t = n)
            }
            return t
        },
        _renderTextLine: function (t, e, i, n, r, o) {
            this._renderChars(t, e, i, n, r, o)
        },
        _renderTextLinesBackground: function (t) {
            if (this.textBackgroundColor || this.styleHas("textBackgroundColor")) {
                for (var e, i, n, r, o, s, a = 0, c = t.fillStyle, l = this._getLeftOffset(), h = this._getTopOffset(), u = 0, f = 0, d = 0, p = this._textLines.length; d < p; d++) if (e = this.getHeightOfLine(d), this.textBackgroundColor || this.styleHas("textBackgroundColor", d)) {
                    n = this._textLines[d], i = this._getLineLeftOffset(d), u = f = 0, r = this.getValueOfPropertyAt(d, 0, "textBackgroundColor");
                    for (var g = 0, v = n.length; g < v; g++) o = this.__charBounds[d][g], (s = this.getValueOfPropertyAt(d, g, "textBackgroundColor")) !== r ? ((t.fillStyle = r) && t.fillRect(l + i + u, h + a, f, e / this.lineHeight), u = o.left, f = o.width, r = s) : f += o.kernedWidth;
                    s && (t.fillStyle = s, t.fillRect(l + i + u, h + a, f, e / this.lineHeight)), a += e
                } else a += e;
                t.fillStyle = c, this._removeShadow(t)
            }
        },
        getFontCache: function (t) {
            var i = t.fontFamily.toLowerCase();
            e.charWidthsCache[i] || (e.charWidthsCache[i] = {});
            var n = e.charWidthsCache[i], r = t.fontStyle.toLowerCase() + "_" + (t.fontWeight + "").toLowerCase();
            return n[r] || (n[r] = {}), n[r]
        },
        _applyCharStyles: function (t, e, i, n, r) {
            this._setFillStyles(e, r), this._setStrokeStyles(e, r), e.font = this._getFontDeclaration(r)
        },
        _measureChar: function (t, e, i, n) {
            var r, o, s, a, c = this.getFontCache(e), l = i + t,
                h = this._getFontDeclaration(e) === this._getFontDeclaration(n), u = e.fontSize / this.CACHE_FONT_SIZE;
            if (i && void 0 !== c[i] && (s = c[i]), void 0 !== c[t] && (a = r = c[t]), h && void 0 !== c[l] && (a = (o = c[l]) - s), void 0 === r || void 0 === s || void 0 === o) {
                var f = this.getMeasuringContext();
                this._setTextStyles(f, e, !0)
            }
            return void 0 === r && (a = r = f.measureText(t).width, c[t] = r), void 0 === s && h && i && (s = f.measureText(i).width, c[i] = s), h && void 0 === o && (o = f.measureText(l).width, a = (c[l] = o) - s), {
                width: r * u,
                kernedWidth: a * u
            }
        },
        getHeightOfChar: function (t, e) {
            return this.getValueOfPropertyAt(t, e, "fontSize")
        },
        measureLine: function (t) {
            var e = this._measureLine(t);
            return 0 !== this.charSpacing && (e.width -= this._getWidthOfCharSpacing()), e.width < 0 && (e.width = 0), e
        },
        _measureLine: function (t) {
            var e, i, n, r, o = 0, s = this._textLines[t], a = new Array(s.length);
            for (this.__charBounds[t] = a, e = 0; e < s.length; e++) i = s[e], r = this._getGraphemeBox(i, t, e, n), o += (a[e] = r).kernedWidth, n = i;
            return a[e] = {left: r ? r.left + r.width : 0, width: 0, kernedWidth: 0, height: this.fontSize}, {
                width: o,
                numOfSpaces: 0
            }
        },
        _getGraphemeBox: function (t, e, i, n, r) {
            var o, s = this.getCompleteStyleDeclaration(e, i), a = n ? this.getCompleteStyleDeclaration(e, i - 1) : {},
                c = this._measureChar(t, s, n, a), l = c.kernedWidth, h = c.width;
            0 !== this.charSpacing && (h += o = this._getWidthOfCharSpacing(), l += o);
            var u = {width: h, left: 0, height: s.fontSize, kernedWidth: l, deltaY: s.deltaY};
            if (0 < i && !r) {
                var f = this.__charBounds[e][i - 1];
                u.left = f.left + f.width + c.kernedWidth - c.width
            }
            return u
        },
        getHeightOfLine: function (t) {
            if (this.__lineHeights[t]) return this.__lineHeights[t];
            for (var e = this._textLines[t], i = this.getHeightOfChar(t, 0), n = 1, r = e.length; n < r; n++) i = Math.max(this.getHeightOfChar(t, n), i);
            return this.__lineHeights[t] = i * this.lineHeight * this._fontSizeMult
        },
        calcTextHeight: function () {
            for (var t, e = 0, i = 0, n = this._textLines.length; i < n; i++) t = this.getHeightOfLine(i), e += i === n - 1 ? t / this.lineHeight : t;
            return e
        },
        _getLeftOffset: function () {
            return -this.width / 2
        },
        _getTopOffset: function () {
            return -this.height / 2
        },
        _renderTextCommon: function (t, e) {
            t.save();
            for (var i = 0, n = this._getLeftOffset(), r = this._getTopOffset(), o = this._applyPatternGradientTransform(t, "fillText" === e ? this.fill : this.stroke), s = 0, a = this._textLines.length; s < a; s++) {
                var c = this.getHeightOfLine(s), l = c / this.lineHeight, h = this._getLineLeftOffset(s);
                this._renderTextLine(e, t, this._textLines[s], n + h - o.offsetX, r + i + l - o.offsetY, s), i += c
            }
            t.restore()
        },
        _renderTextFill: function (t) {
            (this.fill || this.styleHas("fill")) && this._renderTextCommon(t, "fillText")
        },
        _renderTextStroke: function (t) {
            (this.stroke && 0 !== this.strokeWidth || !this.isEmptyStyles()) && (this.shadow && !this.shadow.affectStroke && this._removeShadow(t), t.save(), this._setLineDash(t, this.strokeDashArray), t.beginPath(), this._renderTextCommon(t, "strokeText"), t.closePath(), t.restore())
        },
        _renderChars: function (t, e, i, n, r, o) {
            var s, a, c, l, h = this.getHeightOfLine(o), u = -1 !== this.textAlign.indexOf("justify"), f = "", d = 0,
                p = !u && 0 === this.charSpacing && this.isEmptyStyles(o);
            if (e.save(), r -= h * this._fontSizeFraction / this.lineHeight, p) return this._renderChar(t, e, o, 0, this.textLines[o], n, r, h), void e.restore();
            for (var g = 0, v = i.length - 1; g <= v; g++) l = g === v || this.charSpacing, f += i[g], c = this.__charBounds[o][g], 0 === d ? (n += c.kernedWidth - c.width, d += c.width) : d += c.kernedWidth, u && !l && this._reSpaceAndTab.test(i[g]) && (l = !0), l || (s = s || this.getCompleteStyleDeclaration(o, g), a = this.getCompleteStyleDeclaration(o, g + 1), l = this._hasStyleChanged(s, a)), l && (this._renderChar(t, e, o, g, f, n, r, h), f = "", s = a, n += d, d = 0);
            e.restore()
        },
        _renderChar: function (t, e, i, n, r, o, s) {
            var a = this._getStyleDeclaration(i, n), c = this.getCompleteStyleDeclaration(i, n),
                l = "fillText" === t && c.fill, h = "strokeText" === t && c.stroke && c.strokeWidth;
            (h || l) && (a && e.save(), this._applyCharStyles(t, e, i, n, c), a && a.textBackgroundColor && this._removeShadow(e), a && a.deltaY && (s += a.deltaY), l && e.fillText(r, o, s), h && e.strokeText(r, o, s), a && e.restore())
        },
        setSuperscript: function (t, e) {
            return this._setScript(t, e, this.superscript)
        },
        setSubscript: function (t, e) {
            return this._setScript(t, e, this.subscript)
        },
        _setScript: function (t, e, i) {
            var n = this.get2DCursorLocation(t, !0),
                r = this.getValueOfPropertyAt(n.lineIndex, n.charIndex, "fontSize"),
                o = this.getValueOfPropertyAt(n.lineIndex, n.charIndex, "deltaY"),
                s = {fontSize: r * i.size, deltaY: o + r * i.baseline};
            return this.setSelectionStyles(s, t, e), this
        },
        _hasStyleChanged: function (t, e) {
            return t.fill !== e.fill || t.stroke !== e.stroke || t.strokeWidth !== e.strokeWidth || t.fontSize !== e.fontSize || t.fontFamily !== e.fontFamily || t.fontWeight !== e.fontWeight || t.fontStyle !== e.fontStyle || t.deltaY !== e.deltaY
        },
        _hasStyleChangedForSvg: function (t, e) {
            return this._hasStyleChanged(t, e) || t.overline !== e.overline || t.underline !== e.underline || t.linethrough !== e.linethrough
        },
        _getLineLeftOffset: function (t) {
            var e = this.getLineWidth(t);
            return "center" === this.textAlign ? (this.width - e) / 2 : "right" === this.textAlign ? this.width - e : "justify-center" === this.textAlign && this.isEndOfWrapping(t) ? (this.width - e) / 2 : "justify-right" === this.textAlign && this.isEndOfWrapping(t) ? this.width - e : 0
        },
        _clearCache: function () {
            this.__lineWidths = [], this.__lineHeights = [], this.__charBounds = []
        },
        _shouldClearDimensionCache: function () {
            var t = this._forceClearCache;
            return t || (t = this.hasStateChanged("_dimensionAffectingProps")), t && (this.dirty = !0, this._forceClearCache = !1), t
        },
        getLineWidth: function (t) {
            return this.__lineWidths[t] ? this.__lineWidths[t] : (e = "" === this._textLines[t] ? 0 : this.measureLine(t).width, this.__lineWidths[t] = e);
            var e
        },
        _getWidthOfCharSpacing: function () {
            return 0 !== this.charSpacing ? this.fontSize * this.charSpacing / 1e3 : 0
        },
        getValueOfPropertyAt: function (t, e, i) {
            var n = this._getStyleDeclaration(t, e);
            return n && void 0 !== n[i] ? n[i] : this[i]
        },
        _renderTextDecoration: function (t, e) {
            if (this[e] || this.styleHas(e)) {
                for (var i, n, r, o, s, a, c, l, h, u, f, d, p, g, v, m, _ = this._getLeftOffset(), b = this._getTopOffset(), y = this._getWidthOfCharSpacing(), x = 0, w = this._textLines.length; x < w; x++) if (i = this.getHeightOfLine(x), this[e] || this.styleHas(e, x)) {
                    c = this._textLines[x], g = i / this.lineHeight, o = this._getLineLeftOffset(x), f = u = 0, l = this.getValueOfPropertyAt(x, 0, e), m = this.getValueOfPropertyAt(x, 0, "fill"), h = b + g * (1 - this._fontSizeFraction), n = this.getHeightOfChar(x, 0), s = this.getValueOfPropertyAt(x, 0, "deltaY");
                    for (var C = 0, S = c.length; C < S; C++) d = this.__charBounds[x][C], p = this.getValueOfPropertyAt(x, C, e), v = this.getValueOfPropertyAt(x, C, "fill"), r = this.getHeightOfChar(x, C), a = this.getValueOfPropertyAt(x, C, "deltaY"), (p !== l || v !== m || r !== n || a !== s) && 0 < f ? (t.fillStyle = m, l && m && t.fillRect(_ + o + u, h + this.offsets[e] * n + s, f, this.fontSize / 15), u = d.left, f = d.width, l = p, m = v, n = r, s = a) : f += d.kernedWidth;
                    t.fillStyle = v, p && v && t.fillRect(_ + o + u, h + this.offsets[e] * n + s, f - y, this.fontSize / 15), b += i
                } else b += i;
                this._removeShadow(t)
            }
        },
        _getFontDeclaration: function (t, i) {
            var n = t || this, r = this.fontFamily, o = -1 < e.Text.genericFonts.indexOf(r.toLowerCase()),
                s = void 0 === r || -1 < r.indexOf("'") || -1 < r.indexOf(",") || -1 < r.indexOf('"') || o ? n.fontFamily : '"' + n.fontFamily + '"';
            return [e.isLikelyNode ? n.fontWeight : n.fontStyle, e.isLikelyNode ? n.fontStyle : n.fontWeight, i ? this.CACHE_FONT_SIZE + "px" : n.fontSize + "px", s].join(" ")
        },
        render: function (t) {
            this.visible && (this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen() || (this._shouldClearDimensionCache() && this.initDimensions(), this.callSuper("render", t)))
        },
        _splitTextIntoLines: function (t) {
            for (var i = t.split(this._reNewline), n = new Array(i.length), r = ["\n"], o = [], s = 0; s < i.length; s++) n[s] = e.util.string.graphemeSplit(i[s]), o = o.concat(n[s], r);
            return o.pop(), {_unwrappedLines: n, lines: i, graphemeText: o, graphemeLines: n}
        },
        toObject: function (t) {
            var e = ["text", "fontSize", "fontWeight", "fontFamily", "fontStyle", "lineHeight", "underline", "overline", "linethrough", "textAlign", "textBackgroundColor", "charSpacing"].concat(t),
                n = this.callSuper("toObject", e);
            return n.styles = i(this.styles, !0), n
        },
        set: function (t, e) {
            this.callSuper("set", t, e);
            var i = !1;
            if ("object" == typeof t) for (var n in t) i = i || -1 !== this._dimensionAffectingProps.indexOf(n); else i = -1 !== this._dimensionAffectingProps.indexOf(t);
            return i && (this.initDimensions(), this.setCoords()), this
        },
        complexity: function () {
            return 1
        }
    }), e.Text.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("x y dx dy font-family font-style font-weight font-size letter-spacing text-decoration text-anchor".split(" ")), e.Text.DEFAULT_SVG_FONT_SIZE = 16, e.Text.fromElement = function (t, n, r) {
        if (!t) return n(null);
        var o = e.parseAttributes(t, e.Text.ATTRIBUTE_NAMES), s = o.textAnchor || "left";
        if ((r = e.util.object.extend(r ? i(r) : {}, o)).top = r.top || 0, r.left = r.left || 0, o.textDecoration) {
            var a = o.textDecoration;
            -1 !== a.indexOf("underline") && (r.underline = !0), -1 !== a.indexOf("overline") && (r.overline = !0), -1 !== a.indexOf("line-through") && (r.linethrough = !0), delete r.textDecoration
        }
        "dx" in o && (r.left += o.dx), "dy" in o && (r.top += o.dy), "fontSize" in r || (r.fontSize = e.Text.DEFAULT_SVG_FONT_SIZE);
        var c = "";
        "textContent" in t ? c = t.textContent : "firstChild" in t && null !== t.firstChild && "data" in t.firstChild && null !== t.firstChild.data && (c = t.firstChild.data), c = c.replace(/^\s+|\s+$|\n+/g, "").replace(/\s+/g, " ");
        var l = r.strokeWidth;
        r.strokeWidth = 0;
        var h = new e.Text(c, r), u = h.getScaledHeight() / h.height,
            f = ((h.height + h.strokeWidth) * h.lineHeight - h.height) * u, d = h.getScaledHeight() + f, p = 0;
        "center" === s && (p = h.getScaledWidth() / 2), "right" === s && (p = h.getScaledWidth()), h.set({
            left: h.left - p,
            top: h.top - (d - h.fontSize * (.07 + h._fontSizeFraction)) / h.lineHeight,
            strokeWidth: void 0 !== l ? l : 1
        }), n(h)
    }, e.Text.fromObject = function (t, i) {
        return e.Object._fromObject("Text", t, i, "text")
    }, e.Text.genericFonts = ["sans-serif", "serif", "cursive", "fantasy", "monospace"], e.util.createAccessors && e.util.createAccessors(e.Text))
}("undefined" != typeof exports ? exports : this),
fabric.util.object.extend(fabric.Text.prototype, {
    isEmptyStyles: function (t) {
        if (!this.styles) return !0;
        if (void 0 !== t && !this.styles[t]) return !0;
        var e = void 0 === t ? this.styles : {line: this.styles[t]};
        for (var i in e) for (var n in e[i]) for (var r in e[i][n]) return !1;
        return !0
    }, styleHas: function (t, e) {
        if (!this.styles || !t || "" === t) return !1;
        if (void 0 !== e && !this.styles[e]) return !1;
        var i = void 0 === e ? this.styles : {0: this.styles[e]};
        for (var n in i) for (var r in i[n]) if (void 0 !== i[n][r][t]) return !0;
        return !1
    }, cleanStyle: function (t) {
        if (!this.styles || !t || "" === t) return !1;
        var e, i, n = this.styles, r = 0, o = !0, s = 0;
        for (var a in n) {
            for (var c in e = 0, n[a]) {
                var l;
                r++, (l = n[a][c]).hasOwnProperty(t) ? (i ? l[t] !== i && (o = !1) : i = l[t], l[t] === this[t] && delete l[t]) : o = !1, 0 !== Object.keys(l).length ? e++ : delete n[a][c]
            }
            0 === e && delete n[a]
        }
        for (var h = 0; h < this._textLines.length; h++) s += this._textLines[h].length;
        o && r === s && (this[t] = i, this.removeStyle(t))
    }, removeStyle: function (t) {
        if (this.styles && t && "" !== t) {
            var e, i, n, r = this.styles;
            for (i in r) {
                for (n in e = r[i]) delete e[n][t], 0 === Object.keys(e[n]).length && delete e[n];
                0 === Object.keys(e).length && delete r[i]
            }
        }
    }, _extendStyles: function (t, e) {
        var i = this.get2DCursorLocation(t);
        this._getLineStyle(i.lineIndex) || this._setLineStyle(i.lineIndex), this._getStyleDeclaration(i.lineIndex, i.charIndex) || this._setStyleDeclaration(i.lineIndex, i.charIndex, {}), fabric.util.object.extend(this._getStyleDeclaration(i.lineIndex, i.charIndex), e)
    }, get2DCursorLocation: function (t, e) {
        void 0 === t && (t = this.selectionStart);
        for (var i = e ? this._unwrappedTextLines : this._textLines, n = i.length, r = 0; r < n; r++) {
            if (t <= i[r].length) return {lineIndex: r, charIndex: t};
            t -= i[r].length + this.missingNewlineOffset(r)
        }
        return {lineIndex: r - 1, charIndex: i[r - 1].length < t ? i[r - 1].length : t}
    }, getSelectionStyles: function (t, e, i) {
        void 0 === t && (t = this.selectionStart || 0), void 0 === e && (e = this.selectionEnd || t);
        for (var n = [], r = t; r < e; r++) n.push(this.getStyleAtPosition(r, i));
        return n
    }, getStyleAtPosition: function (t, e) {
        var i = this.get2DCursorLocation(t);
        return (e ? this.getCompleteStyleDeclaration(i.lineIndex, i.charIndex) : this._getStyleDeclaration(i.lineIndex, i.charIndex)) || {}
    }, setSelectionStyles: function (t, e, i) {
        void 0 === e && (e = this.selectionStart || 0), void 0 === i && (i = this.selectionEnd || e);
        for (var n = e; n < i; n++) this._extendStyles(n, t);
        return this._forceClearCache = !0, this
    }, _getStyleDeclaration: function (t, e) {
        var i = this.styles && this.styles[t];
        return i ? i[e] : null
    }, getCompleteStyleDeclaration: function (t, e) {
        for (var i, n = this._getStyleDeclaration(t, e) || {}, r = {}, o = 0; o < this._styleProperties.length; o++) r[i = this._styleProperties[o]] = void 0 === n[i] ? this[i] : n[i];
        return r
    }, _setStyleDeclaration: function (t, e, i) {
        this.styles[t][e] = i
    }, _deleteStyleDeclaration: function (t, e) {
        delete this.styles[t][e]
    }, _getLineStyle: function (t) {
        return !!this.styles[t]
    }, _setLineStyle: function (t) {
        this.styles[t] = {}
    }, _deleteLineStyle: function (t) {
        delete this.styles[t]
    }
}),
function () {
    function t(t) {
        t.textDecoration && (-1 < t.textDecoration.indexOf("underline") && (t.underline = !0), -1 < t.textDecoration.indexOf("line-through") && (t.linethrough = !0), -1 < t.textDecoration.indexOf("overline") && (t.overline = !0), delete t.textDecoration)
    }

    fabric.IText = fabric.util.createClass(fabric.Text, fabric.Observable, {
        type: "i-text",
        selectionStart: 0,
        selectionEnd: 0,
        selectionColor: "rgba(17,119,255,0.3)",
        isEditing: !1,
        editable: !0,
        editingBorderColor: "rgba(102,153,255,0.25)",
        cursorWidth: 2,
        cursorColor: "#333",
        cursorDelay: 1e3,
        cursorDuration: 600,
        caching: !0,
        _reSpace: /\s|\n/,
        _currentCursorOpacity: 0,
        _selectionDirection: null,
        _abortCursorAnimation: !1,
        __widthOfSpace: [],
        inCompositionMode: !1,
        initialize: function (t, e) {
            this.callSuper("initialize", t, e), this.initBehavior()
        },
        setSelectionStart: function (t) {
            t = Math.max(t, 0), this._updateAndFire("selectionStart", t)
        },
        setSelectionEnd: function (t) {
            t = Math.min(t, this.text.length), this._updateAndFire("selectionEnd", t)
        },
        _updateAndFire: function (t, e) {
            this[t] !== e && (this._fireSelectionChanged(), this[t] = e), this._updateTextarea()
        },
        _fireSelectionChanged: function () {
            this.fire("selection:changed"), this.canvas && this.canvas.fire("text:selection:changed", {target: this})
        },
        initDimensions: function () {
            this.isEditing && this.initDelayedCursor(), this.clearContextTop(), this.callSuper("initDimensions")
        },
        render: function (t) {
            this.clearContextTop(), this.callSuper("render", t), this.cursorOffsetCache = {}, this.renderCursorOrSelection()
        },
        _render: function (t) {
            this.callSuper("_render", t)
        },
        clearContextTop: function (t) {
            if (this.isEditing && this.canvas && this.canvas.contextTop) {
                var e = this.canvas.contextTop, i = this.canvas.viewportTransform;
                e.save(), e.transform(i[0], i[1], i[2], i[3], i[4], i[5]), this.transform(e), this.transformMatrix && e.transform.apply(e, this.transformMatrix), this._clearTextArea(e), t || e.restore()
            }
        },
        renderCursorOrSelection: function () {
            if (this.isEditing && this.canvas && this.canvas.contextTop) {
                var t = this._getCursorBoundaries(), e = this.canvas.contextTop;
                this.clearContextTop(!0), this.selectionStart === this.selectionEnd ? this.renderCursor(t, e) : this.renderSelection(t, e), e.restore()
            }
        },
        _clearTextArea: function (t) {
            var e = this.width + 4, i = this.height + 4;
            t.clearRect(-e / 2, -i / 2, e, i)
        },
        _getCursorBoundaries: function (t) {
            void 0 === t && (t = this.selectionStart);
            var e = this._getLeftOffset(), i = this._getTopOffset(), n = this._getCursorBoundariesOffsets(t);
            return {left: e, top: i, leftOffset: n.left, topOffset: n.top}
        },
        _getCursorBoundariesOffsets: function (t) {
            if (this.cursorOffsetCache && "top" in this.cursorOffsetCache) return this.cursorOffsetCache;
            var e, i, n, r, o = 0, s = 0, a = this.get2DCursorLocation(t);
            n = a.charIndex, i = a.lineIndex;
            for (var c = 0; c < i; c++) o += this.getHeightOfLine(c);
            e = this._getLineLeftOffset(i);
            var l = this.__charBounds[i][n];
            return l && (s = l.left), 0 !== this.charSpacing && n === this._textLines[i].length && (s -= this._getWidthOfCharSpacing()), r = {
                top: o,
                left: e + (0 < s ? s : 0)
            }, this.cursorOffsetCache = r, this.cursorOffsetCache
        },
        renderCursor: function (t, e) {
            var i = this.get2DCursorLocation(), n = i.lineIndex, r = 0 < i.charIndex ? i.charIndex - 1 : 0,
                o = this.getValueOfPropertyAt(n, r, "fontSize"), s = this.scaleX * this.canvas.getZoom(),
                a = this.cursorWidth / s, c = t.topOffset, l = this.getValueOfPropertyAt(n, r, "deltaY");
            c += (1 - this._fontSizeFraction) * this.getHeightOfLine(n) / this.lineHeight - o * (1 - this._fontSizeFraction), this.inCompositionMode && this.renderSelection(t, e), e.fillStyle = this.getValueOfPropertyAt(n, r, "fill"), e.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity, e.fillRect(t.left + t.leftOffset - a / 2, c + t.top + l, a, o)
        },
        renderSelection: function (t, e) {
            for (var i = this.inCompositionMode ? this.hiddenTextarea.selectionStart : this.selectionStart, n = this.inCompositionMode ? this.hiddenTextarea.selectionEnd : this.selectionEnd, r = -1 !== this.textAlign.indexOf("justify"), o = this.get2DCursorLocation(i), s = this.get2DCursorLocation(n), a = o.lineIndex, c = s.lineIndex, l = o.charIndex < 0 ? 0 : o.charIndex, h = s.charIndex < 0 ? 0 : s.charIndex, u = a; u <= c; u++) {
                var f, d = this._getLineLeftOffset(u) || 0, p = this.getHeightOfLine(u), g = 0, v = 0;
                if (u === a && (g = this.__charBounds[a][l].left), a <= u && u < c) v = r && !this.isEndOfWrapping(u) ? this.width : this.getLineWidth(u) || 5; else if (u === c) if (0 === h) v = this.__charBounds[c][h].left; else {
                    var m = this._getWidthOfCharSpacing();
                    v = this.__charBounds[c][h - 1].left + this.__charBounds[c][h - 1].width - m
                }
                f = p, (this.lineHeight < 1 || u === c && 1 < this.lineHeight) && (p /= this.lineHeight), this.inCompositionMode ? (e.fillStyle = this.compositionColor || "black", e.fillRect(t.left + d + g, t.top + t.topOffset + p, v - g, 1)) : (e.fillStyle = this.selectionColor, e.fillRect(t.left + d + g, t.top + t.topOffset, v - g, p)), t.topOffset += f
            }
        },
        getCurrentCharFontSize: function () {
            var t = this._getCurrentCharIndex();
            return this.getValueOfPropertyAt(t.l, t.c, "fontSize")
        },
        getCurrentCharColor: function () {
            var t = this._getCurrentCharIndex();
            return this.getValueOfPropertyAt(t.l, t.c, "fill")
        },
        _getCurrentCharIndex: function () {
            var t = this.get2DCursorLocation(this.selectionStart, !0), e = 0 < t.charIndex ? t.charIndex - 1 : 0;
            return {l: t.lineIndex, c: e}
        }
    }), fabric.IText.fromObject = function (e, i) {
        if (t(e), e.styles) for (var n in e.styles) for (var r in e.styles[n]) t(e.styles[n][r]);
        fabric.Object._fromObject("IText", e, i, "text")
    }
}(),
function () {
    var t = fabric.util.object.clone;
    fabric.util.object.extend(fabric.IText.prototype, {
        initBehavior: function () {
            this.initAddedHandler(), this.initRemovedHandler(), this.initCursorSelectionHandlers(), this.initDoubleClickSimulation(), this.mouseMoveHandler = this.mouseMoveHandler.bind(this)
        }, onDeselect: function () {
            this.isEditing && this.exitEditing(), this.selected = !1
        }, initAddedHandler: function () {
            var t = this;
            this.on("added", (function () {
                var e = t.canvas;
                e && (e._hasITextHandlers || (e._hasITextHandlers = !0, t._initCanvasHandlers(e)), e._iTextInstances = e._iTextInstances || [], e._iTextInstances.push(t))
            }))
        }, initRemovedHandler: function () {
            var t = this;
            this.on("removed", (function () {
                var e = t.canvas;
                e && (e._iTextInstances = e._iTextInstances || [], fabric.util.removeFromArray(e._iTextInstances, t), 0 === e._iTextInstances.length && (e._hasITextHandlers = !1, t._removeCanvasHandlers(e)))
            }))
        }, _initCanvasHandlers: function (t) {
            t._mouseUpITextHandler = function () {
                t._iTextInstances && t._iTextInstances.forEach((function (t) {
                    t.__isMousedown = !1
                }))
            }, t.on("mouse:up", t._mouseUpITextHandler)
        }, _removeCanvasHandlers: function (t) {
            t.off("mouse:up", t._mouseUpITextHandler)
        }, _tick: function () {
            this._currentTickState = this._animateCursor(this, 1, this.cursorDuration, "_onTickComplete")
        }, _animateCursor: function (t, e, i, n) {
            var r;
            return r = {
                isAborted: !1, abort: function () {
                    this.isAborted = !0
                }
            }, t.animate("_currentCursorOpacity", e, {
                duration: i, onComplete: function () {
                    r.isAborted || t[n]()
                }, onChange: function () {
                    t.canvas && t.selectionStart === t.selectionEnd && t.renderCursorOrSelection()
                }, abort: function () {
                    return r.isAborted
                }
            }), r
        }, _onTickComplete: function () {
            var t = this;
            this._cursorTimeout1 && clearTimeout(this._cursorTimeout1), this._cursorTimeout1 = setTimeout((function () {
                t._currentTickCompleteState = t._animateCursor(t, 0, this.cursorDuration / 2, "_tick")
            }), 100)
        }, initDelayedCursor: function (t) {
            var e = this, i = t ? 0 : this.cursorDelay;
            this.abortCursorAnimation(), this._currentCursorOpacity = 1, this._cursorTimeout2 = setTimeout((function () {
                e._tick()
            }), i)
        }, abortCursorAnimation: function () {
            var t = this._currentTickState || this._currentTickCompleteState, e = this.canvas;
            this._currentTickState && this._currentTickState.abort(), this._currentTickCompleteState && this._currentTickCompleteState.abort(), clearTimeout(this._cursorTimeout1), clearTimeout(this._cursorTimeout2), this._currentCursorOpacity = 0, t && e && e.clearContext(e.contextTop || e.contextContainer)
        }, selectAll: function () {
            return this.selectionStart = 0, this.selectionEnd = this._text.length, this._fireSelectionChanged(), this._updateTextarea(), this
        }, getSelectedText: function () {
            return this._text.slice(this.selectionStart, this.selectionEnd).join("")
        }, findWordBoundaryLeft: function (t) {
            var e = 0, i = t - 1;
            if (this._reSpace.test(this._text[i])) for (; this._reSpace.test(this._text[i]);) e++, i--;
            for (; /\S/.test(this._text[i]) && -1 < i;) e++, i--;
            return t - e
        }, findWordBoundaryRight: function (t) {
            var e = 0, i = t;
            if (this._reSpace.test(this._text[i])) for (; this._reSpace.test(this._text[i]);) e++, i++;
            for (; /\S/.test(this._text[i]) && i < this._text.length;) e++, i++;
            return t + e
        }, findLineBoundaryLeft: function (t) {
            for (var e = 0, i = t - 1; !/\n/.test(this._text[i]) && -1 < i;) e++, i--;
            return t - e
        }, findLineBoundaryRight: function (t) {
            for (var e = 0, i = t; !/\n/.test(this._text[i]) && i < this._text.length;) e++, i++;
            return t + e
        }, searchWordBoundary: function (t, e) {
            for (var i = this._reSpace.test(this._text[t]) ? t - 1 : t, n = this._text[i], r = /[ \n\.,;!\?\-]/; !r.test(n) && 0 < i && i < this._text.length;) i += e, n = this._text[i];
            return r.test(n) && "\n" !== n && (i += 1 === e ? 0 : 1), i
        }, selectWord: function (t) {
            t = t || this.selectionStart;
            var e = this.searchWordBoundary(t, -1), i = this.searchWordBoundary(t, 1);
            this.selectionStart = e, this.selectionEnd = i, this._fireSelectionChanged(), this._updateTextarea(), this.renderCursorOrSelection()
        }, selectLine: function (t) {
            t = t || this.selectionStart;
            var e = this.findLineBoundaryLeft(t), i = this.findLineBoundaryRight(t);
            return this.selectionStart = e, this.selectionEnd = i, this._fireSelectionChanged(), this._updateTextarea(), this
        }, enterEditing: function (t) {
            if (!this.isEditing && this.editable) return this.canvas && (this.canvas.calcOffset(), this.exitEditingOnOthers(this.canvas)), this.isEditing = !0, this.initHiddenTextarea(t), this.hiddenTextarea.focus(), this.hiddenTextarea.value = this.text, this._updateTextarea(), this._saveEditingProps(), this._setEditingProps(), this._textBeforeEdit = this.text, this._tick(), this.fire("editing:entered"), this._fireSelectionChanged(), this.canvas && (this.canvas.fire("text:editing:entered", {target: this}), this.initMouseMoveHandler(), this.canvas.requestRenderAll()), this
        }, exitEditingOnOthers: function (t) {
            t._iTextInstances && t._iTextInstances.forEach((function (t) {
                t.selected = !1, t.isEditing && t.exitEditing()
            }))
        }, initMouseMoveHandler: function () {
            this.canvas.on("mouse:move", this.mouseMoveHandler)
        }, mouseMoveHandler: function (t) {
            if (this.__isMousedown && this.isEditing) {
                var e = this.getSelectionStartFromPointer(t.e), i = this.selectionStart, n = this.selectionEnd;
                (e === this.__selectionStartOnMouseDown && i !== n || i !== e && n !== e) && (e > this.__selectionStartOnMouseDown ? (this.selectionStart = this.__selectionStartOnMouseDown, this.selectionEnd = e) : (this.selectionStart = e, this.selectionEnd = this.__selectionStartOnMouseDown), this.selectionStart === i && this.selectionEnd === n || (this.restartCursorIfNeeded(), this._fireSelectionChanged(), this._updateTextarea(), this.renderCursorOrSelection()))
            }
        }, _setEditingProps: function () {
            this.hoverCursor = "text", this.canvas && (this.canvas.defaultCursor = this.canvas.moveCursor = "text"), this.borderColor = this.editingBorderColor, this.hasControls = this.selectable = !1, this.lockMovementX = this.lockMovementY = !0
        }, fromStringToGraphemeSelection: function (t, e, i) {
            var n = i.slice(0, t), r = fabric.util.string.graphemeSplit(n).length;
            if (t === e) return {selectionStart: r, selectionEnd: r};
            var o = i.slice(t, e);
            return {selectionStart: r, selectionEnd: r + fabric.util.string.graphemeSplit(o).length}
        }, fromGraphemeToStringSelection: function (t, e, i) {
            var n = i.slice(0, t).join("").length;
            return t === e ? {selectionStart: n, selectionEnd: n} : {
                selectionStart: n,
                selectionEnd: n + i.slice(t, e).join("").length
            }
        }, _updateTextarea: function () {
            if (this.cursorOffsetCache = {}, this.hiddenTextarea) {
                if (!this.inCompositionMode) {
                    var t = this.fromGraphemeToStringSelection(this.selectionStart, this.selectionEnd, this._text);
                    this.hiddenTextarea.selectionStart = t.selectionStart, this.hiddenTextarea.selectionEnd = t.selectionEnd
                }
                this.updateTextareaPosition()
            }
        }, updateFromTextArea: function () {
            if (this.hiddenTextarea) {
                this.cursorOffsetCache = {}, this.text = this.hiddenTextarea.value, this._shouldClearDimensionCache() && (this.initDimensions(), this.setCoords());
                var t = this.fromStringToGraphemeSelection(this.hiddenTextarea.selectionStart, this.hiddenTextarea.selectionEnd, this.hiddenTextarea.value);
                this.selectionEnd = this.selectionStart = t.selectionEnd, this.inCompositionMode || (this.selectionStart = t.selectionStart), this.updateTextareaPosition()
            }
        }, updateTextareaPosition: function () {
            if (this.selectionStart === this.selectionEnd) {
                var t = this._calcTextareaPosition();
                this.hiddenTextarea.style.left = t.left, this.hiddenTextarea.style.top = t.top
            }
        }, _calcTextareaPosition: function () {
            if (!this.canvas) return {x: 1, y: 1};
            var t = this.inCompositionMode ? this.compositionStart : this.selectionStart,
                e = this._getCursorBoundaries(t), i = this.get2DCursorLocation(t), n = i.lineIndex, r = i.charIndex,
                o = this.getValueOfPropertyAt(n, r, "fontSize") * this.lineHeight, s = e.leftOffset,
                a = this.calcTransformMatrix(), c = {x: e.left + s, y: e.top + e.topOffset + o},
                l = this.canvas.upperCanvasEl, h = l.width, u = l.height, f = h - o, d = u - o, p = l.clientWidth / h,
                g = l.clientHeight / u;
            return c = fabric.util.transformPoint(c, a), (c = fabric.util.transformPoint(c, this.canvas.viewportTransform)).x *= p, c.y *= g, c.x < 0 && (c.x = 0), c.x > f && (c.x = f), c.y < 0 && (c.y = 0), c.y > d && (c.y = d), c.x += this.canvas._offset.left, c.y += this.canvas._offset.top, {
                left: c.x + "px",
                top: c.y + "px",
                fontSize: o + "px",
                charHeight: o
            }
        }, _saveEditingProps: function () {
            this._savedProps = {
                hasControls: this.hasControls,
                borderColor: this.borderColor,
                lockMovementX: this.lockMovementX,
                lockMovementY: this.lockMovementY,
                hoverCursor: this.hoverCursor,
                selectable: this.selectable,
                defaultCursor: this.canvas && this.canvas.defaultCursor,
                moveCursor: this.canvas && this.canvas.moveCursor
            }
        }, _restoreEditingProps: function () {
            this._savedProps && (this.hoverCursor = this._savedProps.hoverCursor, this.hasControls = this._savedProps.hasControls, this.borderColor = this._savedProps.borderColor, this.selectable = this._savedProps.selectable, this.lockMovementX = this._savedProps.lockMovementX, this.lockMovementY = this._savedProps.lockMovementY, this.canvas && (this.canvas.defaultCursor = this._savedProps.defaultCursor, this.canvas.moveCursor = this._savedProps.moveCursor))
        }, exitEditing: function () {
            var t = this._textBeforeEdit !== this.text;
            return this.selected = !1, this.isEditing = !1, this.selectionEnd = this.selectionStart, this.hiddenTextarea && (this.hiddenTextarea.blur && this.hiddenTextarea.blur(), this.canvas && this.hiddenTextarea.parentNode.removeChild(this.hiddenTextarea), this.hiddenTextarea = null), this.abortCursorAnimation(), this._restoreEditingProps(), this._currentCursorOpacity = 0, this._shouldClearDimensionCache() && (this.initDimensions(), this.setCoords()), this.fire("editing:exited"), t && this.fire("modified"), this.canvas && (this.canvas.off("mouse:move", this.mouseMoveHandler), this.canvas.fire("text:editing:exited", {target: this}), t && this.canvas.fire("object:modified", {target: this})), this
        }, _removeExtraneousStyles: function () {
            for (var t in this.styles) this._textLines[t] || delete this.styles[t]
        }, removeStyleFromTo: function (t, e) {
            var i, n, r = this.get2DCursorLocation(t, !0), o = this.get2DCursorLocation(e, !0), s = r.lineIndex,
                a = r.charIndex, c = o.lineIndex, l = o.charIndex;
            if (s !== c) {
                if (this.styles[s]) for (i = a; i < this._unwrappedTextLines[s].length; i++) delete this.styles[s][i];
                if (this.styles[c]) for (i = l; i < this._unwrappedTextLines[c].length; i++) (n = this.styles[c][i]) && (this.styles[s] || (this.styles[s] = {}), this.styles[s][a + i - l] = n);
                for (i = s + 1; i <= c; i++) delete this.styles[i];
                this.shiftLineStyles(c, s - c)
            } else if (this.styles[s]) {
                n = this.styles[s];
                var h, u, f = l - a;
                for (i = a; i < l; i++) delete n[i];
                for (u in this.styles[s]) l <= (h = parseInt(u, 10)) && (n[h - f] = n[u], delete n[u])
            }
        }, shiftLineStyles: function (e, i) {
            var n = t(this.styles);
            for (var r in this.styles) {
                var o = parseInt(r, 10);
                e < o && (this.styles[o + i] = n[o], n[o - i] || delete this.styles[o])
            }
        }, restartCursorIfNeeded: function () {
            this._currentTickState && !this._currentTickState.isAborted && this._currentTickCompleteState && !this._currentTickCompleteState.isAborted || this.initDelayedCursor()
        }, insertNewlineStyleObject: function (e, i, n, r) {
            var o, s = {}, a = !1;
            for (var c in n || (n = 1), this.shiftLineStyles(e, n), this.styles[e] && (o = this.styles[e][0 === i ? i : i - 1]), this.styles[e]) {
                var l = parseInt(c, 10);
                i <= l && (a = !0, s[l - i] = this.styles[e][c], delete this.styles[e][c])
            }
            for (a ? this.styles[e + n] = s : delete this.styles[e + n]; 1 < n;) n--, r && r[n] ? this.styles[e + n] = {0: t(r[n])} : o ? this.styles[e + n] = {0: t(o)} : delete this.styles[e + n];
            this._forceClearCache = !0
        }, insertCharStyleObject: function (e, i, n, r) {
            this.styles || (this.styles = {});
            var o = this.styles[e], s = o ? t(o) : {};
            for (var a in n || (n = 1), s) {
                var c = parseInt(a, 10);
                i <= c && (o[c + n] = s[c], s[c - n] || delete o[c])
            }
            if (this._forceClearCache = !0, r) for (; n--;) Object.keys(r[n]).length && (this.styles[e] || (this.styles[e] = {}), this.styles[e][i + n] = t(r[n])); else if (o) for (var l = o[i ? i - 1 : 1]; l && n--;) this.styles[e][i + n] = t(l)
        }, insertNewStyleBlock: function (t, e, i) {
            for (var n = this.get2DCursorLocation(e, !0), r = [0], o = 0, s = 0; s < t.length; s++) "\n" === t[s] ? r[++o] = 0 : r[o]++;
            for (0 < r[0] && (this.insertCharStyleObject(n.lineIndex, n.charIndex, r[0], i), i = i && i.slice(r[0] + 1)), o && this.insertNewlineStyleObject(n.lineIndex, n.charIndex + r[0], o), s = 1; s < o; s++) 0 < r[s] ? this.insertCharStyleObject(n.lineIndex + s, 0, r[s], i) : i && (this.styles[n.lineIndex + s][0] = i[0]), i = i && i.slice(r[s] + 1);
            0 < r[s] && this.insertCharStyleObject(n.lineIndex + s, 0, r[s], i)
        }, setSelectionStartEndWithShift: function (t, e, i) {
            i <= t ? (e === t ? this._selectionDirection = "left" : "right" === this._selectionDirection && (this._selectionDirection = "left", this.selectionEnd = t), this.selectionStart = i) : t < i && i < e ? "right" === this._selectionDirection ? this.selectionEnd = i : this.selectionStart = i : (e === t ? this._selectionDirection = "right" : "left" === this._selectionDirection && (this._selectionDirection = "right", this.selectionStart = e), this.selectionEnd = i)
        }, setSelectionInBoundaries: function () {
            var t = this.text.length;
            this.selectionStart > t ? this.selectionStart = t : this.selectionStart < 0 && (this.selectionStart = 0), this.selectionEnd > t ? this.selectionEnd = t : this.selectionEnd < 0 && (this.selectionEnd = 0)
        }
    })
}(),
fabric.util.object.extend(fabric.IText.prototype, {
    initDoubleClickSimulation: function () {
        this.__lastClickTime = +new Date, this.__lastLastClickTime = +new Date, this.__lastPointer = {}, this.on("mousedown", this.onMouseDown)
    }, onMouseDown: function (t) {
        if (this.canvas) {
            this.__newClickTime = +new Date;
            var e = t.pointer;
            this.isTripleClick(e) && (this.fire("tripleclick", t), this._stopEvent(t.e)), this.__lastLastClickTime = this.__lastClickTime, this.__lastClickTime = this.__newClickTime, this.__lastPointer = e, this.__lastIsEditing = this.isEditing, this.__lastSelected = this.selected
        }
    }, isTripleClick: function (t) {
        return this.__newClickTime - this.__lastClickTime < 500 && this.__lastClickTime - this.__lastLastClickTime < 500 && this.__lastPointer.x === t.x && this.__lastPointer.y === t.y
    }, _stopEvent: function (t) {
        t.preventDefault && t.preventDefault(), t.stopPropagation && t.stopPropagation()
    }, initCursorSelectionHandlers: function () {
        this.initMousedownHandler(), this.initMouseupHandler(), this.initClicks()
    }, initClicks: function () {
        this.on("mousedblclick", (function (t) {
            this.selectWord(this.getSelectionStartFromPointer(t.e))
        })), this.on("tripleclick", (function (t) {
            this.selectLine(this.getSelectionStartFromPointer(t.e))
        }))
    }, _mouseDownHandler: function (t) {
        !this.canvas || !this.editable || t.e.button && 1 !== t.e.button || (this.__isMousedown = !0, this.selected && this.setCursorByClick(t.e), this.isEditing && (this.__selectionStartOnMouseDown = this.selectionStart, this.selectionStart === this.selectionEnd && this.abortCursorAnimation(), this.renderCursorOrSelection()))
    }, _mouseDownHandlerBefore: function (t) {
        !this.canvas || !this.editable || t.e.button && 1 !== t.e.button || this === this.canvas._activeObject && (this.selected = !0)
    }, initMousedownHandler: function () {
        this.on("mousedown", this._mouseDownHandler), this.on("mousedown:before", this._mouseDownHandlerBefore)
    }, initMouseupHandler: function () {
        this.on("mouseup", this.mouseUpHandler)
    }, mouseUpHandler: function (t) {
        if (this.__isMousedown = !1, !(!this.editable || this.group || t.transform && t.transform.actionPerformed || t.e.button && 1 !== t.e.button)) {
            if (this.canvas) {
                var e = this.canvas._activeObject;
                if (e && e !== this) return
            }
            this.__lastSelected && !this.__corner ? (this.selected = !1, this.__lastSelected = !1, this.enterEditing(t.e), this.selectionStart === this.selectionEnd ? this.initDelayedCursor(!0) : this.renderCursorOrSelection()) : this.selected = !0
        }
    }, setCursorByClick: function (t) {
        var e = this.getSelectionStartFromPointer(t), i = this.selectionStart, n = this.selectionEnd;
        t.shiftKey ? this.setSelectionStartEndWithShift(i, n, e) : (this.selectionStart = e, this.selectionEnd = e), this.isEditing && (this._fireSelectionChanged(), this._updateTextarea())
    }, getSelectionStartFromPointer: function (t) {
        for (var e = this.getLocalPointer(t), i = 0, n = 0, r = 0, o = 0, s = 0, a = 0, c = this._textLines.length; a < c && r <= e.y; a++) r += this.getHeightOfLine(a) * this.scaleY, 0 < (s = a) && (o += this._textLines[a - 1].length + this.missingNewlineOffset(a - 1));
        n = this._getLineLeftOffset(s) * this.scaleX;
        for (var l = 0, h = this._textLines[s].length; l < h && (i = n, (n += this.__charBounds[s][l].kernedWidth * this.scaleX) <= e.x); l++) o++;
        return this._getNewSelectionStartFromOffset(e, i, n, o, h)
    }, _getNewSelectionStartFromOffset: function (t, e, i, n, r) {
        var o = t.x - e, s = i - t.x, a = n + (o < s || s < 0 ? 0 : 1);
        return this.flipX && (a = r - a), a > this._text.length && (a = this._text.length), a
    }
}),
fabric.util.object.extend(fabric.IText.prototype, {
    initHiddenTextarea: function () {
        this.hiddenTextarea = fabric.document.createElement("textarea"), this.hiddenTextarea.setAttribute("autocapitalize", "off"), this.hiddenTextarea.setAttribute("autocorrect", "off"), this.hiddenTextarea.setAttribute("autocomplete", "off"), this.hiddenTextarea.setAttribute("spellcheck", "false"), this.hiddenTextarea.setAttribute("data-fabric-hiddentextarea", ""), this.hiddenTextarea.setAttribute("wrap", "off");
        var t = this._calcTextareaPosition();
        this.hiddenTextarea.style.cssText = "position: absolute; top: " + t.top + "; left: " + t.left + "; z-index: -999; opacity: 0; width: 1px; height: 1px; font-size: 1px; paddingｰtop: " + t.fontSize + ";", fabric.document.body.appendChild(this.hiddenTextarea), fabric.util.addListener(this.hiddenTextarea, "keydown", this.onKeyDown.bind(this)), fabric.util.addListener(this.hiddenTextarea, "keyup", this.onKeyUp.bind(this)), fabric.util.addListener(this.hiddenTextarea, "input", this.onInput.bind(this)), fabric.util.addListener(this.hiddenTextarea, "copy", this.copy.bind(this)), fabric.util.addListener(this.hiddenTextarea, "cut", this.copy.bind(this)), fabric.util.addListener(this.hiddenTextarea, "paste", this.paste.bind(this)), fabric.util.addListener(this.hiddenTextarea, "compositionstart", this.onCompositionStart.bind(this)), fabric.util.addListener(this.hiddenTextarea, "compositionupdate", this.onCompositionUpdate.bind(this)), fabric.util.addListener(this.hiddenTextarea, "compositionend", this.onCompositionEnd.bind(this)), !this._clickHandlerInitialized && this.canvas && (fabric.util.addListener(this.canvas.upperCanvasEl, "click", this.onClick.bind(this)), this._clickHandlerInitialized = !0)
    },
    keysMap: {
        9: "exitEditing",
        27: "exitEditing",
        33: "moveCursorUp",
        34: "moveCursorDown",
        35: "moveCursorRight",
        36: "moveCursorLeft",
        37: "moveCursorLeft",
        38: "moveCursorUp",
        39: "moveCursorRight",
        40: "moveCursorDown"
    },
    ctrlKeysMapUp: {67: "copy", 88: "cut"},
    ctrlKeysMapDown: {65: "selectAll"},
    onClick: function () {
        this.hiddenTextarea && this.hiddenTextarea.focus()
    },
    onKeyDown: function (t) {
        if (this.isEditing && !this.inCompositionMode) {
            if (t.keyCode in this.keysMap) this[this.keysMap[t.keyCode]](t); else {
                if (!(t.keyCode in this.ctrlKeysMapDown) || !t.ctrlKey && !t.metaKey) return;
                this[this.ctrlKeysMapDown[t.keyCode]](t)
            }
            t.stopImmediatePropagation(), t.preventDefault(), 33 <= t.keyCode && t.keyCode <= 40 ? (this.clearContextTop(), this.renderCursorOrSelection()) : this.canvas && this.canvas.requestRenderAll()
        }
    },
    onKeyUp: function (t) {
        !this.isEditing || this._copyDone || this.inCompositionMode ? this._copyDone = !1 : t.keyCode in this.ctrlKeysMapUp && (t.ctrlKey || t.metaKey) && (this[this.ctrlKeysMapUp[t.keyCode]](t), t.stopImmediatePropagation(), t.preventDefault(), this.canvas && this.canvas.requestRenderAll())
    },
    onInput: function (t) {
        var e = this.fromPaste;
        if (this.fromPaste = !1, t && t.stopPropagation(), this.isEditing) {
            var i, n, r = this._splitTextIntoLines(this.hiddenTextarea.value).graphemeText, o = this._text.length,
                s = r.length, a = s - o;
            if ("" === this.hiddenTextarea.value) return this.styles = {}, this.updateFromTextArea(), this.fire("changed"), void (this.canvas && (this.canvas.fire("text:changed", {target: this}), this.canvas.requestRenderAll()));
            var c = this.fromStringToGraphemeSelection(this.hiddenTextarea.selectionStart, this.hiddenTextarea.selectionEnd, this.hiddenTextarea.value),
                l = this.selectionStart > c.selectionStart;
            this.selectionStart !== this.selectionEnd ? (i = this._text.slice(this.selectionStart, this.selectionEnd), a += this.selectionEnd - this.selectionStart) : s < o && (i = l ? this._text.slice(this.selectionEnd + a, this.selectionEnd) : this._text.slice(this.selectionStart, this.selectionStart - a)), n = r.slice(c.selectionEnd - a, c.selectionEnd), i && i.length && (this.selectionStart !== this.selectionEnd ? this.removeStyleFromTo(this.selectionStart, this.selectionEnd) : l ? this.removeStyleFromTo(this.selectionEnd - i.length, this.selectionEnd) : this.removeStyleFromTo(this.selectionEnd, this.selectionEnd + i.length)), n.length && (e && n.join("") === fabric.copiedText && !fabric.disableStyleCopyPaste ? this.insertNewStyleBlock(n, this.selectionStart, fabric.copiedTextStyle) : this.insertNewStyleBlock(n, this.selectionStart)), this.updateFromTextArea(), this.fire("changed"), this.canvas && (this.canvas.fire("text:changed", {target: this}), this.canvas.requestRenderAll())
        }
    },
    onCompositionStart: function () {
        this.inCompositionMode = !0
    },
    onCompositionEnd: function () {
        this.inCompositionMode = !1
    },
    onCompositionUpdate: function (t) {
        this.compositionStart = t.target.selectionStart, this.compositionEnd = t.target.selectionEnd, this.updateTextareaPosition()
    },
    copy: function () {
        this.selectionStart !== this.selectionEnd && (fabric.copiedText = this.getSelectedText(), fabric.disableStyleCopyPaste ? fabric.copiedTextStyle = null : fabric.copiedTextStyle = this.getSelectionStyles(this.selectionStart, this.selectionEnd, !0), this._copyDone = !0)
    },
    paste: function () {
        this.fromPaste = !0
    },
    _getClipboardData: function (t) {
        return t && t.clipboardData || fabric.window.clipboardData
    },
    _getWidthBeforeCursor: function (t, e) {
        var i, n = this._getLineLeftOffset(t);
        return 0 < e && (n += (i = this.__charBounds[t][e - 1]).left + i.width), n
    },
    getDownCursorOffset: function (t, e) {
        var i = this._getSelectionForOffset(t, e), n = this.get2DCursorLocation(i), r = n.lineIndex;
        if (r === this._textLines.length - 1 || t.metaKey || 34 === t.keyCode) return this._text.length - i;
        var o = n.charIndex, s = this._getWidthBeforeCursor(r, o), a = this._getIndexOnLine(r + 1, s);
        return this._textLines[r].slice(o).length + a + 1 + this.missingNewlineOffset(r)
    },
    _getSelectionForOffset: function (t, e) {
        return t.shiftKey && this.selectionStart !== this.selectionEnd && e ? this.selectionEnd : this.selectionStart
    },
    getUpCursorOffset: function (t, e) {
        var i = this._getSelectionForOffset(t, e), n = this.get2DCursorLocation(i), r = n.lineIndex;
        if (0 === r || t.metaKey || 33 === t.keyCode) return -i;
        var o = n.charIndex, s = this._getWidthBeforeCursor(r, o), a = this._getIndexOnLine(r - 1, s),
            c = this._textLines[r].slice(0, o), l = this.missingNewlineOffset(r - 1);
        return -this._textLines[r - 1].length + a - c.length + (1 - l)
    },
    _getIndexOnLine: function (t, e) {
        for (var i, n, r = this._textLines[t], o = this._getLineLeftOffset(t), s = 0, a = 0, c = r.length; a < c; a++) if (e < (o += i = this.__charBounds[t][a].width)) {
            n = !0;
            var l = o - i, h = o, u = Math.abs(l - e);
            s = Math.abs(h - e) < u ? a : a - 1;
            break
        }
        return n || (s = r.length - 1), s
    },
    moveCursorDown: function (t) {
        this.selectionStart >= this._text.length && this.selectionEnd >= this._text.length || this._moveCursorUpOrDown("Down", t)
    },
    moveCursorUp: function (t) {
        0 === this.selectionStart && 0 === this.selectionEnd || this._moveCursorUpOrDown("Up", t)
    },
    _moveCursorUpOrDown: function (t, e) {
        var i = this["get" + t + "CursorOffset"](e, "right" === this._selectionDirection);
        e.shiftKey ? this.moveCursorWithShift(i) : this.moveCursorWithoutShift(i), 0 !== i && (this.setSelectionInBoundaries(), this.abortCursorAnimation(), this._currentCursorOpacity = 1, this.initDelayedCursor(), this._fireSelectionChanged(), this._updateTextarea())
    },
    moveCursorWithShift: function (t) {
        var e = "left" === this._selectionDirection ? this.selectionStart + t : this.selectionEnd + t;
        return this.setSelectionStartEndWithShift(this.selectionStart, this.selectionEnd, e), 0 !== t
    },
    moveCursorWithoutShift: function (t) {
        return t < 0 ? (this.selectionStart += t, this.selectionEnd = this.selectionStart) : (this.selectionEnd += t, this.selectionStart = this.selectionEnd), 0 !== t
    },
    moveCursorLeft: function (t) {
        0 === this.selectionStart && 0 === this.selectionEnd || this._moveCursorLeftOrRight("Left", t)
    },
    _move: function (t, e, i) {
        var n;
        if (t.altKey) n = this["findWordBoundary" + i](this[e]); else {
            if (!t.metaKey && 35 !== t.keyCode && 36 !== t.keyCode) return this[e] += "Left" === i ? -1 : 1, !0;
            n = this["findLineBoundary" + i](this[e])
        }
        if (void 0 !== typeof n && this[e] !== n) return this[e] = n, !0
    },
    _moveLeft: function (t, e) {
        return this._move(t, e, "Left")
    },
    _moveRight: function (t, e) {
        return this._move(t, e, "Right")
    },
    moveCursorLeftWithoutShift: function (t) {
        var e = !0;
        return this._selectionDirection = "left", this.selectionEnd === this.selectionStart && 0 !== this.selectionStart && (e = this._moveLeft(t, "selectionStart")), this.selectionEnd = this.selectionStart, e
    },
    moveCursorLeftWithShift: function (t) {
        return "right" === this._selectionDirection && this.selectionStart !== this.selectionEnd ? this._moveLeft(t, "selectionEnd") : 0 !== this.selectionStart ? (this._selectionDirection = "left", this._moveLeft(t, "selectionStart")) : void 0
    },
    moveCursorRight: function (t) {
        this.selectionStart >= this._text.length && this.selectionEnd >= this._text.length || this._moveCursorLeftOrRight("Right", t)
    },
    _moveCursorLeftOrRight: function (t, e) {
        var i = "moveCursor" + t + "With";
        this._currentCursorOpacity = 1, e.shiftKey ? i += "Shift" : i += "outShift", this[i](e) && (this.abortCursorAnimation(), this.initDelayedCursor(), this._fireSelectionChanged(), this._updateTextarea())
    },
    moveCursorRightWithShift: function (t) {
        return "left" === this._selectionDirection && this.selectionStart !== this.selectionEnd ? this._moveRight(t, "selectionStart") : this.selectionEnd !== this._text.length ? (this._selectionDirection = "right", this._moveRight(t, "selectionEnd")) : void 0
    },
    moveCursorRightWithoutShift: function (t) {
        var e = !0;
        return this._selectionDirection = "right", this.selectionStart === this.selectionEnd ? (e = this._moveRight(t, "selectionStart"), this.selectionEnd = this.selectionStart) : this.selectionStart = this.selectionEnd, e
    },
    removeChars: function (t, e) {
        void 0 === e && (e = t + 1), this.removeStyleFromTo(t, e), this._text.splice(t, e - t), this.text = this._text.join(""), this.set("dirty", !0), this._shouldClearDimensionCache() && (this.initDimensions(), this.setCoords()), this._removeExtraneousStyles()
    },
    insertChars: function (t, e, i, n) {
        void 0 === n && (n = i), i < n && this.removeStyleFromTo(i, n);
        var r = fabric.util.string.graphemeSplit(t);
        this.insertNewStyleBlock(r, i, e), this._text = [].concat(this._text.slice(0, i), r, this._text.slice(n)), this.text = this._text.join(""), this.set("dirty", !0), this._shouldClearDimensionCache() && (this.initDimensions(), this.setCoords()), this._removeExtraneousStyles()
    }
}),
function () {
    var t = fabric.util.toFixed, e = /  +/g;
    fabric.util.object.extend(fabric.Text.prototype, {
        _toSVG: function () {
            var t = this._getSVGLeftTopOffsets(), e = this._getSVGTextAndBg(t.textTop, t.textLeft);
            return this._wrapSVGTextAndBg(e)
        }, toSVG: function (t) {
            return this._createBaseSVGMarkup(this._toSVG(), {reviver: t, noStyle: !0, withShadow: !0})
        }, _getSVGLeftTopOffsets: function () {
            return {textLeft: -this.width / 2, textTop: -this.height / 2, lineTop: this.getHeightOfLine(0)}
        }, _wrapSVGTextAndBg: function (t) {
            var e = this.getSvgTextDecoration(this);
            return [t.textBgRects.join(""), '\t\t<text xml:space="preserve" ', this.fontFamily ? 'font-family="' + this.fontFamily.replace(/"/g, "'") + '" ' : "", this.fontSize ? 'font-size="' + this.fontSize + '" ' : "", this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : "", this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : "", e ? 'text-decoration="' + e + '" ' : "", 'style="', this.getSvgStyles(!0), '"', this.addPaintOrder(), " >", t.textSpans.join(""), "</text>\n"]
        }, _getSVGTextAndBg: function (t, e) {
            var i, n = [], r = [], o = t;
            this._setSVGBg(r);
            for (var s = 0, a = this._textLines.length; s < a; s++) i = this._getLineLeftOffset(s), (this.textBackgroundColor || this.styleHas("textBackgroundColor", s)) && this._setSVGTextLineBg(r, s, e + i, o), this._setSVGTextLineText(n, s, e + i, o), o += this.getHeightOfLine(s);
            return {textSpans: n, textBgRects: r}
        }, _createTextCharSpan: function (i, n, r, o) {
            var s = i !== i.trim() || i.match(e), a = this.getSvgSpanStyles(n, s), c = a ? 'style="' + a + '"' : "",
                l = n.deltaY, h = "", u = fabric.Object.NUM_FRACTION_DIGITS;
            return l && (h = ' dy="' + t(l, u) + '" '), ['<tspan x="', t(r, u), '" y="', t(o, u), '" ', h, c, ">", fabric.util.string.escapeXml(i), "</tspan>"].join("")
        }, _setSVGTextLineText: function (t, e, i, n) {
            var r, o, s, a, c, l = this.getHeightOfLine(e), h = -1 !== this.textAlign.indexOf("justify"), u = "", f = 0,
                d = this._textLines[e];
            n += l * (1 - this._fontSizeFraction) / this.lineHeight;
            for (var p = 0, g = d.length - 1; p <= g; p++) c = p === g || this.charSpacing, u += d[p], s = this.__charBounds[e][p], 0 === f ? (i += s.kernedWidth - s.width, f += s.width) : f += s.kernedWidth, h && !c && this._reSpaceAndTab.test(d[p]) && (c = !0), c || (r = r || this.getCompleteStyleDeclaration(e, p), o = this.getCompleteStyleDeclaration(e, p + 1), c = this._hasStyleChangedForSvg(r, o)), c && (a = this._getStyleDeclaration(e, p) || {}, t.push(this._createTextCharSpan(u, a, i, n)), u = "", r = o, i += f, f = 0)
        }, _pushTextBgRect: function (e, i, n, r, o, s) {
            var a = fabric.Object.NUM_FRACTION_DIGITS;
            e.push("\t\t<rect ", this._getFillAttributes(i), ' x="', t(n, a), '" y="', t(r, a), '" width="', t(o, a), '" height="', t(s, a), '"></rect>\n')
        }, _setSVGTextLineBg: function (t, e, i, n) {
            for (var r, o, s = this._textLines[e], a = this.getHeightOfLine(e) / this.lineHeight, c = 0, l = 0, h = this.getValueOfPropertyAt(e, 0, "textBackgroundColor"), u = 0, f = s.length; u < f; u++) r = this.__charBounds[e][u], (o = this.getValueOfPropertyAt(e, u, "textBackgroundColor")) !== h ? (h && this._pushTextBgRect(t, h, i + l, n, c, a), l = r.left, c = r.width, h = o) : c += r.kernedWidth;
            o && this._pushTextBgRect(t, o, i + l, n, c, a)
        }, _getFillAttributes: function (t) {
            var e = t && "string" == typeof t ? new fabric.Color(t) : "";
            return e && e.getSource() && 1 !== e.getAlpha() ? 'opacity="' + e.getAlpha() + '" fill="' + e.setAlpha(1).toRgb() + '"' : 'fill="' + t + '"'
        }, _getSVGLineTopOffset: function (t) {
            for (var e, i = 0, n = 0; n < t; n++) i += this.getHeightOfLine(n);
            return e = this.getHeightOfLine(n), {
                lineTop: i,
                offset: (this._fontSizeMult - this._fontSizeFraction) * e / (this.lineHeight * this._fontSizeMult)
            }
        }, getSvgStyles: function (t) {
            return fabric.Object.prototype.getSvgStyles.call(this, t) + " white-space: pre;"
        }
    })
}(),
function (t) {
    "use strict";
    var e = t.fabric || (t.fabric = {});
    e.Textbox = e.util.createClass(e.IText, e.Observable, {
        type: "textbox",
        minWidth: 20,
        dynamicMinWidth: 2,
        __cachedLines: null,
        lockScalingFlip: !0,
        noScaleCache: !1,
        _dimensionAffectingProps: e.Text.prototype._dimensionAffectingProps.concat("width"),
        _wordJoiners: /[ \t\r]/,
        splitByGrapheme: !1,
        initDimensions: function () {
            this.__skipDimension || (this.isEditing && this.initDelayedCursor(), this.clearContextTop(), this._clearCache(), this.dynamicMinWidth = 0, this._styleMap = this._generateStyleMap(this._splitText()), this.dynamicMinWidth > this.width && this._set("width", this.dynamicMinWidth), -1 !== this.textAlign.indexOf("justify") && this.enlargeSpaces(), this.height = this.calcTextHeight(), this.saveState({propertySet: "_dimensionAffectingProps"}))
        },
        _generateStyleMap: function (t) {
            for (var e = 0, i = 0, n = 0, r = {}, o = 0; o < t.graphemeLines.length; o++) "\n" === t.graphemeText[n] && 0 < o ? (i = 0, n++, e++) : !this.splitByGrapheme && this._reSpaceAndTab.test(t.graphemeText[n]) && 0 < o && (i++, n++), r[o] = {
                line: e,
                offset: i
            }, n += t.graphemeLines[o].length, i += t.graphemeLines[o].length;
            return r
        },
        styleHas: function (t, i) {
            if (this._styleMap && !this.isWrapping) {
                var n = this._styleMap[i];
                n && (i = n.line)
            }
            return e.Text.prototype.styleHas.call(this, t, i)
        },
        isEmptyStyles: function (t) {
            var e, i, n = 0, r = !1, o = this._styleMap[t], s = this._styleMap[t + 1];
            for (var a in o && (t = o.line, n = o.offset), s && (r = s.line === t, e = s.offset), i = void 0 === t ? this.styles : {line: this.styles[t]}) for (var c in i[a]) if (n <= c && (!r || c < e)) for (var l in i[a][c]) return !1;
            return !0
        },
        _getStyleDeclaration: function (t, e) {
            if (this._styleMap && !this.isWrapping) {
                var i = this._styleMap[t];
                if (!i) return null;
                t = i.line, e = i.offset + e
            }
            return this.callSuper("_getStyleDeclaration", t, e)
        },
        _setStyleDeclaration: function (t, e, i) {
            var n = this._styleMap[t];
            t = n.line, e = n.offset + e, this.styles[t][e] = i
        },
        _deleteStyleDeclaration: function (t, e) {
            var i = this._styleMap[t];
            t = i.line, e = i.offset + e, delete this.styles[t][e]
        },
        _getLineStyle: function (t) {
            var e = this._styleMap[t];
            return !!this.styles[e.line]
        },
        _setLineStyle: function (t) {
            var e = this._styleMap[t];
            this.styles[e.line] = {}
        },
        _wrapText: function (t, e) {
            var i, n = [];
            for (this.isWrapping = !0, i = 0; i < t.length; i++) n = n.concat(this._wrapLine(t[i], i, e));
            return this.isWrapping = !1, n
        },
        _measureWord: function (t, e, i) {
            var n, r = 0;
            i = i || 0;
            for (var o = 0, s = t.length; o < s; o++) r += this._getGraphemeBox(t[o], e, o + i, n, !0).kernedWidth, n = t[o];
            return r
        },
        _wrapLine: function (t, i, n, r) {
            var o = 0, s = this.splitByGrapheme, a = [], c = [],
                l = s ? e.util.string.graphemeSplit(t) : t.split(this._wordJoiners), h = "", u = 0, f = s ? "" : " ",
                d = 0, p = 0, g = 0, v = !0, m = s ? 0 : this._getWidthOfCharSpacing();
            r = r || 0, 0 === l.length && l.push([]), n -= r;
            for (var _ = 0; _ < l.length; _++) h = s ? l[_] : e.util.string.graphemeSplit(l[_]), d = this._measureWord(h, i, u), u += h.length, n <= (o += p + d - m) && !v ? (a.push(c), c = [], o = d, v = !0) : o += m, v || s || c.push(f), c = c.concat(h), p = this._measureWord([f], i, u), u++, v = !1, g < d && (g = d);
            return _ && a.push(c), g + r > this.dynamicMinWidth && (this.dynamicMinWidth = g - m + r), a
        },
        isEndOfWrapping: function (t) {
            return !this._styleMap[t + 1] || this._styleMap[t + 1].line !== this._styleMap[t].line
        },
        missingNewlineOffset: function (t) {
            return this.splitByGrapheme ? this.isEndOfWrapping(t) ? 1 : 0 : 1
        },
        _splitTextIntoLines: function (t) {
            for (var i = e.Text.prototype._splitTextIntoLines.call(this, t), n = this._wrapText(i.lines, this.width), r = new Array(n.length), o = 0; o < n.length; o++) r[o] = n[o].join("");
            return i.lines = r, i.graphemeLines = n, i
        },
        getMinWidth: function () {
            return Math.max(this.minWidth, this.dynamicMinWidth)
        },
        _removeExtraneousStyles: function () {
            var t = {};
            for (var e in this._styleMap) this._textLines[e] && (t[this._styleMap[e].line] = 1);
            for (var e in this.styles) t[e] || delete this.styles[e]
        },
        toObject: function (t) {
            return this.callSuper("toObject", ["minWidth", "splitByGrapheme"].concat(t))
        }
    }), e.Textbox.fromObject = function (t, i) {
        return e.Object._fromObject("Textbox", t, i, "text")
    }
}("undefined" != typeof exports ? exports : this),
function (t, e) {
    "function" == typeof define && define.amd ? define(["jquery"], (function (t) {
        return e(t)
    })) : "object" == typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
}(0,
    (function (t) {
    function e(t) {
        this.$container, this.constraints = null, this.__$tooltip, this.__init(t)
    }

    function i(e, i) {
        var n = !0;
        return t.each(e, (function (t, r) {
            return void 0 === i[t] || e[t] !== i[t] ? (n = !1, !1) : void 0
        })), n
    }

    function n(e) {
        var i = e.attr("id"), n = i ? s.window.document.getElementById(i) : null;
        return n ? n === e[0] : t.contains(s.window.document.body, e[0])
    }

    var r = {
        animation: "fade",
        animationDuration: 350,
        content: null,
        contentAsHTML: !1,
        contentCloning: !1,
        debug: !0,
        delay: 300,
        delayTouch: [300, 500],
        functionInit: null,
        functionBefore: null,
        functionReady: null,
        functionAfter: null,
        functionFormat: null,
        IEmin: 6,
        interactive: !1,
        multiple: !1,
        parent: "body",
        plugins: ["sideTip"],
        repositionOnScroll: !1,
        restoration: "none",
        selfDestruction: !0,
        theme: [],
        timer: 0,
        trackerInterval: 500,
        trackOrigin: !1,
        trackTooltip: !1,
        trigger: "hover",
        triggerClose: {click: !1, mouseleave: !1, originClick: !1, scroll: !1, tap: !1, touchleave: !1},
        triggerOpen: {click: !1, mouseenter: !1, tap: !1, touchstart: !1},
        updateAnimation: "rotate",
        zIndex: 9999999
    }, o = "undefined" != typeof window ? window : null, s = {
        hasTouchCapability: !(!o || !("ontouchstart" in o || o.DocumentTouch && o.document instanceof o.DocumentTouch || o.navigator.maxTouchPoints)),
        hasTransitions: function () {
            if (!o) return !1;
            var t = (o.document.body || o.document.documentElement).style, e = "transition",
                i = ["Moz", "Webkit", "Khtml", "O", "ms"];
            if ("string" == typeof t[e]) return !0;
            e = e.charAt(0).toUpperCase() + e.substr(1);
            for (var n = 0; n < i.length; n++) if ("string" == typeof t[i[n] + e]) return !0;
            return !1
        }(),
        IE: !1,
        semVer: "4.1.6",
        window: o
    }, a = function () {
        this.__$emitterPrivate = t({}), this.__$emitterPublic = t({}), this.__instancesLatestArr = [], this.__plugins = {}, this._env = s
    };
    a.prototype = {
        __bridge: function (e, i, n) {
            if (!i[n]) {
                var o = function () {
                };
                o.prototype = e;
                var s = new o;
                s.__init && s.__init(i), t.each(e, (function (t, e) {
                    0 != t.indexOf("__") && (i[t] ? r.debug && console.log("The " + t + " method of the " + n + " plugin conflicts with another plugin or native methods") : (i[t] = function () {
                        return s[t].apply(s, Array.prototype.slice.apply(arguments))
                    }, i[t].bridged = s))
                })), i[n] = s
            }
            return this
        }, __setWindow: function (t) {
            return s.window = t, this
        }, _getRuler: function (t) {
            return new e(t)
        }, _off: function () {
            return this.__$emitterPrivate.off.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)), this
        }, _on: function () {
            return this.__$emitterPrivate.on.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)), this
        }, _one: function () {
            return this.__$emitterPrivate.one.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)), this
        }, _plugin: function (e) {
            var i = this;
            if ("string" == typeof e) {
                var n = e, r = null;
                return n.indexOf(".") > 0 ? r = i.__plugins[n] : t.each(i.__plugins, (function (t, e) {
                    return e.name.substring(e.name.length - n.length - 1) == "." + n ? (r = e, !1) : void 0
                })), r
            }
            if (e.name.indexOf(".") < 0) throw new Error("Plugins must be namespaced");
            return i.__plugins[e.name] = e, e.core && i.__bridge(e.core, i, e.name), this
        }, _trigger: function () {
            var t = Array.prototype.slice.apply(arguments);
            return "string" == typeof t[0] && (t[0] = {type: t[0]}), this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate, t), this.__$emitterPublic.trigger.apply(this.__$emitterPublic, t), this
        }, instances: function (e) {
            var i = [];
            return t(e || ".tooltipstered").each((function () {
                var e = t(this), n = e.data("tooltipster-ns");
                n && t.each(n, (function (t, n) {
                    i.push(e.data(n))
                }))
            })), i
        }, instancesLatest: function () {
            return this.__instancesLatestArr
        }, off: function () {
            return this.__$emitterPublic.off.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this
        }, on: function () {
            return this.__$emitterPublic.on.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this
        }, one: function () {
            return this.__$emitterPublic.one.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this
        }, origins: function (e) {
            return t((e ? e + " " : "") + ".tooltipstered").toArray()
        }, setDefaults: function (e) {
            return t.extend(r, e), this
        }, triggerHandler: function () {
            return this.__$emitterPublic.triggerHandler.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this
        }
    }, t.tooltipster = new a, t.Tooltipster = function (e, i) {
        this.__callbacks = {
            close: [],
            open: []
        }, this.__closingTime, this.__Content, this.__contentBcr, this.__destroyed = !1, this.__destroying = !1, this.__$emitterPrivate = t({}), this.__$emitterPublic = t({}), this.__enabled = !0, this.__garbageCollector, this.__Geometry, this.__lastPosition, this.__namespace = "tooltipster-" + Math.round(1e6 * Math.random()), this.__options, this.__$originParents, this.__pointerIsOverOrigin = !1, this.__previousThemes = [], this.__state = "closed", this.__timeouts = {
            close: [],
            open: null
        }, this.__touchEvents = [], this.__tracker = null, this._$origin, this._$tooltip, this.__init(e, i)
    }, t.Tooltipster.prototype = {
        __init: function (e, i) {
            var n = this;
            if (n._$origin = t(e), n.__options = t.extend(!0, {}, r, i), n.__optionsFormat(), !s.IE || s.IE >= n.__options.IEmin) {
                var o = null;
                if (void 0 === n._$origin.data("tooltipster-initialTitle") && (void 0 === (o = n._$origin.attr("title")) && (o = null), n._$origin.data("tooltipster-initialTitle", o)), null !== n.__options.content) n.__contentSet(n.__options.content); else {
                    var a, c = n._$origin.attr("data-tooltip-content");
                    c && (a = t(c)), a && a[0] ? n.__contentSet(a.first()) : n.__contentSet(o)
                }
                n._$origin.removeAttr("title").addClass("tooltipstered"), n.__prepareOrigin(), n.__prepareGC(), t.each(n.__options.plugins, (function (t, e) {
                    n._plug(e)
                })), s.hasTouchCapability && t("body").on("touchmove." + n.__namespace + "-triggerOpen", (function (t) {
                    n._touchRecordEvent(t)
                })), n._on("created", (function () {
                    n.__prepareTooltip()
                }))._on("repositioned", (function (t) {
                    n.__lastPosition = t.position
                }))
            } else n.__options.disabled = !0
        }, __contentInsert: function () {
            var t = this, e = t._$tooltip.find(".tooltipster-content"), i = t.__Content;
            return t._trigger({
                type: "format", content: t.__Content, format: function (t) {
                    i = t
                }
            }), t.__options.functionFormat && (i = t.__options.functionFormat.call(t, t, {origin: t._$origin[0]}, t.__Content)), "string" != typeof i || t.__options.contentAsHTML ? e.empty().append(i) : e.text(i), t
        }, __contentSet: function (e) {
            return e instanceof t && this.__options.contentCloning && (e = e.clone(!0)), this.__Content = e, this._trigger({
                type: "updated",
                content: e
            }), this
        }, __destroyError: function () {
            throw new Error("This tooltip has been destroyed and cannot execute your method call.")
        }, __geometry: function () {
            var e = this, i = e._$origin, n = e._$origin.is("area");
            if (n) {
                var r = e._$origin.parent().attr("name");
                i = t('img[usemap="#' + r + '"]')
            }
            var o = i[0].getBoundingClientRect(), a = t(s.window.document), c = t(s.window), l = i, h = {
                available: {document: null, window: null},
                document: {size: {height: a.height(), width: a.width()}},
                window: {
                    scroll: {
                        left: s.window.scrollX || s.window.document.documentElement.scrollLeft,
                        top: s.window.scrollY || s.window.document.documentElement.scrollTop
                    }, size: {height: c.height(), width: c.width()}
                },
                origin: {
                    fixedLineage: !1,
                    offset: {},
                    size: {height: o.bottom - o.top, width: o.right - o.left},
                    usemapImage: n ? i[0] : null,
                    windowOffset: {bottom: o.bottom, left: o.left, right: o.right, top: o.top}
                }
            };
            if (n) {
                var u = e._$origin.attr("shape"), f = e._$origin.attr("coords");
                if (f && (f = f.split(","), t.map(f, (function (t, e) {
                    f[e] = parseInt(t)
                }))), "default" != u) switch (u) {
                    case"circle":
                        var d = f[0], p = f[1], g = f[2], v = p - g, m = d - g;
                        h.origin.size.height = 2 * g, h.origin.size.width = h.origin.size.height, h.origin.windowOffset.left += m, h.origin.windowOffset.top += v;
                        break;
                    case"rect":
                        var _ = f[0], b = f[1], y = f[2], x = f[3];
                        h.origin.size.height = x - b, h.origin.size.width = y - _, h.origin.windowOffset.left += _, h.origin.windowOffset.top += b;
                        break;
                    case"poly":
                        for (var w = 0, C = 0, S = 0, T = 0, O = "even", E = 0; E < f.length; E++) {
                            var k = f[E];
                            "even" == O ? (k > S && (S = k, 0 === E && (w = S)), w > k && (w = k), O = "odd") : (k > T && (T = k, 1 == E && (C = T)), C > k && (C = k), O = "even")
                        }
                        h.origin.size.height = T - C, h.origin.size.width = S - w, h.origin.windowOffset.left += w, h.origin.windowOffset.top += C
                }
            }
            for (e._trigger({
                type: "geometry",
                edit: function (t) {
                    h.origin.size.height = t.height, h.origin.windowOffset.left = t.left, h.origin.windowOffset.top = t.top, h.origin.size.width = t.width
                },
                geometry: {
                    height: h.origin.size.height,
                    left: h.origin.windowOffset.left,
                    top: h.origin.windowOffset.top,
                    width: h.origin.size.width
                }
            }), h.origin.windowOffset.right = h.origin.windowOffset.left + h.origin.size.width, h.origin.windowOffset.bottom = h.origin.windowOffset.top + h.origin.size.height, h.origin.offset.left = h.origin.windowOffset.left + h.window.scroll.left, h.origin.offset.top = h.origin.windowOffset.top + h.window.scroll.top, h.origin.offset.bottom = h.origin.offset.top + h.origin.size.height, h.origin.offset.right = h.origin.offset.left + h.origin.size.width, h.available.document = {
                bottom: {
                    height: h.document.size.height - h.origin.offset.bottom,
                    width: h.document.size.width
                },
                left: {height: h.document.size.height, width: h.origin.offset.left},
                right: {height: h.document.size.height, width: h.document.size.width - h.origin.offset.right},
                top: {height: h.origin.offset.top, width: h.document.size.width}
            }, h.available.window = {
                bottom: {
                    height: Math.max(h.window.size.height - Math.max(h.origin.windowOffset.bottom, 0), 0),
                    width: h.window.size.width
                },
                left: {height: h.window.size.height, width: Math.max(h.origin.windowOffset.left, 0)},
                right: {
                    height: h.window.size.height,
                    width: Math.max(h.window.size.width - Math.max(h.origin.windowOffset.right, 0), 0)
                },
                top: {height: Math.max(h.origin.windowOffset.top, 0), width: h.window.size.width}
            }; "html" != l[0].tagName.toLowerCase();) {
                if ("fixed" == l.css("position")) {
                    h.origin.fixedLineage = !0;
                    break
                }
                l = l.parent()
            }
            return h
        }, __optionsFormat: function () {
            return "number" == typeof this.__options.animationDuration && (this.__options.animationDuration = [this.__options.animationDuration, this.__options.animationDuration]), "number" == typeof this.__options.delay && (this.__options.delay = [this.__options.delay, this.__options.delay]), "number" == typeof this.__options.delayTouch && (this.__options.delayTouch = [this.__options.delayTouch, this.__options.delayTouch]), "string" == typeof this.__options.theme && (this.__options.theme = [this.__options.theme]), "string" == typeof this.__options.parent && (this.__options.parent = t(this.__options.parent)), "hover" == this.__options.trigger ? (this.__options.triggerOpen = {
                mouseenter: !0,
                touchstart: !0
            }, this.__options.triggerClose = {
                mouseleave: !0,
                originClick: !0,
                touchleave: !0
            }) : "click" == this.__options.trigger && (this.__options.triggerOpen = {
                click: !0,
                tap: !0
            }, this.__options.triggerClose = {click: !0, tap: !0}), this._trigger("options"), this
        }, __prepareGC: function () {
            var e = this;
            return e.__options.selfDestruction ? e.__garbageCollector = setInterval((function () {
                var i = (new Date).getTime();
                e.__touchEvents = t.grep(e.__touchEvents, (function (t, e) {
                    return i - t.time > 6e4
                })), n(e._$origin) || e.destroy()
            }), 2e4) : clearInterval(e.__garbageCollector), e
        }, __prepareOrigin: function () {
            var t = this;
            if (t._$origin.off("." + t.__namespace + "-triggerOpen"), s.hasTouchCapability && t._$origin.on("touchstart." + t.__namespace + "-triggerOpen touchend." + t.__namespace + "-triggerOpen touchcancel." + t.__namespace + "-triggerOpen", (function (e) {
                t._touchRecordEvent(e)
            })), t.__options.triggerOpen.click || t.__options.triggerOpen.tap && s.hasTouchCapability) {
                var e = "";
                t.__options.triggerOpen.click && (e += "click." + t.__namespace + "-triggerOpen "), t.__options.triggerOpen.tap && s.hasTouchCapability && (e += "touchend." + t.__namespace + "-triggerOpen"), t._$origin.on(e, (function (e) {
                    t._touchIsMeaningfulEvent(e) && t._open(e)
                }))
            }
            if (t.__options.triggerOpen.mouseenter || t.__options.triggerOpen.touchstart && s.hasTouchCapability) {
                e = "";
                t.__options.triggerOpen.mouseenter && (e += "mouseenter." + t.__namespace + "-triggerOpen "), t.__options.triggerOpen.touchstart && s.hasTouchCapability && (e += "touchstart." + t.__namespace + "-triggerOpen"), t._$origin.on(e, (function (e) {
                    !t._touchIsTouchEvent(e) && t._touchIsEmulatedEvent(e) || (t.__pointerIsOverOrigin = !0, t._openShortly(e))
                }))
            }
            if (t.__options.triggerClose.mouseleave || t.__options.triggerClose.touchleave && s.hasTouchCapability) {
                e = "";
                t.__options.triggerClose.mouseleave && (e += "mouseleave." + t.__namespace + "-triggerOpen "), t.__options.triggerClose.touchleave && s.hasTouchCapability && (e += "touchend." + t.__namespace + "-triggerOpen touchcancel." + t.__namespace + "-triggerOpen"), t._$origin.on(e, (function (e) {
                    t._touchIsMeaningfulEvent(e) && (t.__pointerIsOverOrigin = !1)
                }))
            }
            return t
        }, __prepareTooltip: function () {
            var e = this, i = e.__options.interactive ? "auto" : "";
            return e._$tooltip.attr("id", e.__namespace).css({
                "pointer-events": i,
                zIndex: e.__options.zIndex
            }), t.each(e.__previousThemes, (function (t, i) {
                e._$tooltip.removeClass(i)
            })), t.each(e.__options.theme, (function (t, i) {
                e._$tooltip.addClass(i)
            })), e.__previousThemes = t.merge([], e.__options.theme), e
        }, __scrollHandler: function (e) {
            var i = this;
            if (i.__options.triggerClose.scroll) i._close(e); else {
                if (e.target === s.window.document) i.__Geometry.origin.fixedLineage || i.__options.repositionOnScroll && i.reposition(e); else {
                    var n = i.__geometry(), r = !1;
                    if ("fixed" != i._$origin.css("position") && i.__$originParents.each((function (e, i) {
                        var o = t(i), s = o.css("overflow-x"), a = o.css("overflow-y");
                        if ("visible" != s || "visible" != a) {
                            var c = i.getBoundingClientRect();
                            if ("visible" != s && (n.origin.windowOffset.left < c.left || n.origin.windowOffset.right > c.right)) return r = !0, !1;
                            if ("visible" != a && (n.origin.windowOffset.top < c.top || n.origin.windowOffset.bottom > c.bottom)) return r = !0, !1
                        }
                        return "fixed" != o.css("position") && void 0
                    })), r) i._$tooltip.css("visibility", "hidden"); else if (i._$tooltip.css("visibility", "visible"), i.__options.repositionOnScroll) i.reposition(e); else {
                        var o = n.origin.offset.left - i.__Geometry.origin.offset.left,
                            a = n.origin.offset.top - i.__Geometry.origin.offset.top;
                        i._$tooltip.css({left: i.__lastPosition.coord.left + o, top: i.__lastPosition.coord.top + a})
                    }
                }
                i._trigger({type: "scroll", event: e})
            }
            return i
        }, __stateSet: function (t) {
            return this.__state = t, this._trigger({type: "state", state: t}), this
        }, __timeoutsClear: function () {
            return clearTimeout(this.__timeouts.open), this.__timeouts.open = null, t.each(this.__timeouts.close, (function (t, e) {
                clearTimeout(e)
            })), this.__timeouts.close = [], this
        }, __trackerStart: function () {
            var t = this, e = t._$tooltip.find(".tooltipster-content");
            return t.__options.trackTooltip && (t.__contentBcr = e[0].getBoundingClientRect()), t.__tracker = setInterval((function () {
                if (n(t._$origin) && n(t._$tooltip)) {
                    if (t.__options.trackOrigin) {
                        var r = t.__geometry(), o = !1;
                        i(r.origin.size, t.__Geometry.origin.size) && (t.__Geometry.origin.fixedLineage ? i(r.origin.windowOffset, t.__Geometry.origin.windowOffset) && (o = !0) : i(r.origin.offset, t.__Geometry.origin.offset) && (o = !0)), o || (t.__options.triggerClose.mouseleave ? t._close() : t.reposition())
                    }
                    if (t.__options.trackTooltip) {
                        var s = e[0].getBoundingClientRect();
                        s.height === t.__contentBcr.height && s.width === t.__contentBcr.width || (t.reposition(), t.__contentBcr = s)
                    }
                } else t._close()
            }), t.__options.trackerInterval), t
        }, _close: function (e, i) {
            var n = this, r = !0;
            if (n._trigger({
                type: "close", event: e, stop: function () {
                    r = !1
                }
            }), r || n.__destroying) {
                i && n.__callbacks.close.push(i), n.__callbacks.open = [], n.__timeoutsClear();
                var o = function () {
                    t.each(n.__callbacks.close, (function (t, i) {
                        i.call(n, n, {event: e, origin: n._$origin[0]})
                    })), n.__callbacks.close = []
                };
                if ("closed" != n.__state) {
                    var a = !0, c = (new Date).getTime() + n.__options.animationDuration[1];
                    if ("disappearing" == n.__state && c > n.__closingTime && (a = !1), a) {
                        n.__closingTime = c, "disappearing" != n.__state && n.__stateSet("disappearing");
                        var l = function () {
                            clearInterval(n.__tracker), n._trigger({
                                type: "closing",
                                event: e
                            }), n._$tooltip.off("." + n.__namespace + "-triggerClose").removeClass("tooltipster-dying"), t(s.window).off("." + n.__namespace + "-triggerClose"), n.__$originParents.each((function (e, i) {
                                t(i).off("scroll." + n.__namespace + "-triggerClose")
                            })), n.__$originParents = null, t("body").off("." + n.__namespace + "-triggerClose"), n._$origin.off("." + n.__namespace + "-triggerClose"), n._off("dismissable"), n.__stateSet("closed"), n._trigger({
                                type: "after",
                                event: e
                            }), n.__options.functionAfter && n.__options.functionAfter.call(n, n, {
                                event: e,
                                origin: n._$origin[0]
                            }), o()
                        };
                        s.hasTransitions ? (n._$tooltip.css({
                            "-moz-animation-duration": n.__options.animationDuration[1] + "ms",
                            "-ms-animation-duration": n.__options.animationDuration[1] + "ms",
                            "-o-animation-duration": n.__options.animationDuration[1] + "ms",
                            "-webkit-animation-duration": n.__options.animationDuration[1] + "ms",
                            "animation-duration": n.__options.animationDuration[1] + "ms",
                            "transition-duration": n.__options.animationDuration[1] + "ms"
                        }), n._$tooltip.clearQueue().removeClass("tooltipster-show").addClass("tooltipster-dying"), n.__options.animationDuration[1] > 0 && n._$tooltip.delay(n.__options.animationDuration[1]), n._$tooltip.queue(l)) : n._$tooltip.stop().fadeOut(n.__options.animationDuration[1], l)
                    }
                } else o()
            }
            return n
        }, _off: function () {
            return this.__$emitterPrivate.off.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)), this
        }, _on: function () {
            return this.__$emitterPrivate.on.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)), this
        }, _one: function () {
            return this.__$emitterPrivate.one.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)), this
        }, _open: function (e, i) {
            var r = this;
            if (!r.__destroying && n(r._$origin) && r.__enabled) {
                var o = !0;
                if ("closed" == r.__state && (r._trigger({
                    type: "before", event: e, stop: function () {
                        o = !1
                    }
                }), o && r.__options.functionBefore && (o = r.__options.functionBefore.call(r, r, {
                    event: e,
                    origin: r._$origin[0]
                }))), !1 !== o && null !== r.__Content) {
                    i && r.__callbacks.open.push(i), r.__callbacks.close = [], r.__timeoutsClear();
                    var a, c = function () {
                        "stable" != r.__state && r.__stateSet("stable"), t.each(r.__callbacks.open, (function (t, e) {
                            e.call(r, r, {origin: r._$origin[0], tooltip: r._$tooltip[0]})
                        })), r.__callbacks.open = []
                    };
                    if ("closed" !== r.__state) a = 0, "disappearing" === r.__state ? (r.__stateSet("appearing"), s.hasTransitions ? (r._$tooltip.clearQueue().removeClass("tooltipster-dying").addClass("tooltipster-show"), r.__options.animationDuration[0] > 0 && r._$tooltip.delay(r.__options.animationDuration[0]), r._$tooltip.queue(c)) : r._$tooltip.stop().fadeIn(c)) : "stable" == r.__state && c(); else {
                        if (r.__stateSet("appearing"), a = r.__options.animationDuration[0], r.__contentInsert(), r.reposition(e, !0), s.hasTransitions ? (r._$tooltip.addClass("tooltipster-" + r.__options.animation).addClass("tooltipster-initial").css({
                            "-moz-animation-duration": r.__options.animationDuration[0] + "ms",
                            "-ms-animation-duration": r.__options.animationDuration[0] + "ms",
                            "-o-animation-duration": r.__options.animationDuration[0] + "ms",
                            "-webkit-animation-duration": r.__options.animationDuration[0] + "ms",
                            "animation-duration": r.__options.animationDuration[0] + "ms",
                            "transition-duration": r.__options.animationDuration[0] + "ms"
                        }), setTimeout((function () {
                            "closed" != r.__state && (r._$tooltip.addClass("tooltipster-show").removeClass("tooltipster-initial"), r.__options.animationDuration[0] > 0 && r._$tooltip.delay(r.__options.animationDuration[0]), r._$tooltip.queue(c))
                        }), 0)) : r._$tooltip.css("display", "none").fadeIn(r.__options.animationDuration[0], c), r.__trackerStart(), t(s.window).on("resize." + r.__namespace + "-triggerClose", (function (e) {
                            var i = t(document.activeElement);
                            (i.is("input") || i.is("textarea")) && t.contains(r._$tooltip[0], i[0]) || r.reposition(e)
                        })).on("scroll." + r.__namespace + "-triggerClose", (function (t) {
                            r.__scrollHandler(t)
                        })), r.__$originParents = r._$origin.parents(), r.__$originParents.each((function (e, i) {
                            t(i).on("scroll." + r.__namespace + "-triggerClose", (function (t) {
                                r.__scrollHandler(t)
                            }))
                        })), r.__options.triggerClose.mouseleave || r.__options.triggerClose.touchleave && s.hasTouchCapability) {
                            r._on("dismissable", (function (t) {
                                t.dismissable ? t.delay ? (f = setTimeout((function () {
                                    r._close(t.event)
                                }), t.delay), r.__timeouts.close.push(f)) : r._close(t) : clearTimeout(f)
                            }));
                            var l = r._$origin, h = "", u = "", f = null;
                            r.__options.interactive && (l = l.add(r._$tooltip)), r.__options.triggerClose.mouseleave && (h += "mouseenter." + r.__namespace + "-triggerClose ", u += "mouseleave." + r.__namespace + "-triggerClose "), r.__options.triggerClose.touchleave && s.hasTouchCapability && (h += "touchstart." + r.__namespace + "-triggerClose", u += "touchend." + r.__namespace + "-triggerClose touchcancel." + r.__namespace + "-triggerClose"), l.on(u, (function (t) {
                                if (r._touchIsTouchEvent(t) || !r._touchIsEmulatedEvent(t)) {
                                    var e = "mouseleave" == t.type ? r.__options.delay : r.__options.delayTouch;
                                    r._trigger({delay: e[1], dismissable: !0, event: t, type: "dismissable"})
                                }
                            })).on(h, (function (t) {
                                !r._touchIsTouchEvent(t) && r._touchIsEmulatedEvent(t) || r._trigger({
                                    dismissable: !1,
                                    event: t,
                                    type: "dismissable"
                                })
                            }))
                        }
                        r.__options.triggerClose.originClick && r._$origin.on("click." + r.__namespace + "-triggerClose", (function (t) {
                            r._touchIsTouchEvent(t) || r._touchIsEmulatedEvent(t) || r._close(t)
                        })), (r.__options.triggerClose.click || r.__options.triggerClose.tap && s.hasTouchCapability) && setTimeout((function () {
                            if ("closed" != r.__state) {
                                var e = "";
                                r.__options.triggerClose.click && (e += "click." + r.__namespace + "-triggerClose "), r.__options.triggerClose.tap && s.hasTouchCapability && (e += "touchend." + r.__namespace + "-triggerClose"), t("body").on(e, (function (e) {
                                    r._touchIsMeaningfulEvent(e) && (r._touchRecordEvent(e), r.__options.interactive && t.contains(r._$tooltip[0], e.target) || r._close(e))
                                })), r.__options.triggerClose.tap && s.hasTouchCapability && t("body").on("touchstart." + r.__namespace + "-triggerClose", (function (t) {
                                    r._touchRecordEvent(t)
                                }))
                            }
                        }), 0), r._trigger("ready"), r.__options.functionReady && r.__options.functionReady.call(r, r, {
                            origin: r._$origin[0],
                            tooltip: r._$tooltip[0]
                        })
                    }
                    if (r.__options.timer > 0) {
                        f = setTimeout((function () {
                            r._close()
                        }), r.__options.timer + a);
                        r.__timeouts.close.push(f)
                    }
                }
            }
            return r
        }, _openShortly: function (t) {
            var e = this, i = !0;
            if ("stable" != e.__state && "appearing" != e.__state && !e.__timeouts.open && (e._trigger({
                type: "start",
                event: t,
                stop: function () {
                    i = !1
                }
            }), i)) {
                var n = 0 == t.type.indexOf("touch") ? e.__options.delayTouch : e.__options.delay;
                n[0] ? e.__timeouts.open = setTimeout((function () {
                    e.__timeouts.open = null, e.__pointerIsOverOrigin && e._touchIsMeaningfulEvent(t) ? (e._trigger("startend"), e._open(t)) : e._trigger("startcancel")
                }), n[0]) : (e._trigger("startend"), e._open(t))
            }
            return e
        }, _optionsExtract: function (e, i) {
            var n = this, r = t.extend(!0, {}, i), o = n.__options[e];
            return o || (o = {}, t.each(i, (function (t, e) {
                var i = n.__options[t];
                void 0 !== i && (o[t] = i)
            }))), t.each(r, (function (e, i) {
                void 0 !== o[e] && ("object" != typeof i || i instanceof Array || null == i || "object" != typeof o[e] || o[e] instanceof Array || null == o[e] ? r[e] = o[e] : t.extend(r[e], o[e]))
            })), r
        }, _plug: function (e) {
            var i = t.tooltipster._plugin(e);
            if (!i) throw new Error('The "' + e + '" plugin is not defined');
            return i.instance && t.tooltipster.__bridge(i.instance, this, i.name), this
        }, _touchIsEmulatedEvent: function (t) {
            for (var e = !1, i = (new Date).getTime(), n = this.__touchEvents.length - 1; n >= 0; n--) {
                var r = this.__touchEvents[n];
                if (!(i - r.time < 500)) break;
                r.target === t.target && (e = !0)
            }
            return e
        }, _touchIsMeaningfulEvent: function (t) {
            return this._touchIsTouchEvent(t) && !this._touchSwiped(t.target) || !this._touchIsTouchEvent(t) && !this._touchIsEmulatedEvent(t)
        }, _touchIsTouchEvent: function (t) {
            return 0 == t.type.indexOf("touch")
        }, _touchRecordEvent: function (t) {
            return this._touchIsTouchEvent(t) && (t.time = (new Date).getTime(), this.__touchEvents.push(t)), this
        }, _touchSwiped: function (t) {
            for (var e = !1, i = this.__touchEvents.length - 1; i >= 0; i--) {
                var n = this.__touchEvents[i];
                if ("touchmove" == n.type) {
                    e = !0;
                    break
                }
                if ("touchstart" == n.type && t === n.target) break
            }
            return e
        }, _trigger: function () {
            var e = Array.prototype.slice.apply(arguments);
            return "string" == typeof e[0] && (e[0] = {type: e[0]}), e[0].instance = this, e[0].origin = this._$origin ? this._$origin[0] : null, e[0].tooltip = this._$tooltip ? this._$tooltip[0] : null, this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate, e), t.tooltipster._trigger.apply(t.tooltipster, e), this.__$emitterPublic.trigger.apply(this.__$emitterPublic, e), this
        }, _unplug: function (e) {
            var i = this;
            if (i[e]) {
                var n = t.tooltipster._plugin(e);
                n.instance && t.each(n.instance, (function (t, n) {
                    i[t] && i[t].bridged === i[e] && delete i[t]
                })), i[e].__destroy && i[e].__destroy(), delete i[e]
            }
            return i
        }, close: function (t) {
            return this.__destroyed ? this.__destroyError() : this._close(null, t), this
        }, content: function (t) {
            var e = this;
            if (void 0 === t) return e.__Content;
            if (e.__destroyed) e.__destroyError(); else if (e.__contentSet(t), null !== e.__Content) {
                if ("closed" !== e.__state && (e.__contentInsert(), e.reposition(), e.__options.updateAnimation)) if (s.hasTransitions) {
                    var i = e.__options.updateAnimation;
                    e._$tooltip.addClass("tooltipster-update-" + i), setTimeout((function () {
                        "closed" != e.__state && e._$tooltip.removeClass("tooltipster-update-" + i)
                    }), 1e3)
                } else e._$tooltip.fadeTo(200, .5, (function () {
                    "closed" != e.__state && e._$tooltip.fadeTo(200, 1)
                }))
            } else e._close();
            return e
        }, destroy: function () {
            var e = this;
            return e.__destroyed ? e.__destroyError() : e.__destroying || (e.__destroying = !0, e._close(null, (function () {
                e._trigger("destroy"), e.__destroying = !1, e.__destroyed = !0, e._$origin.removeData(e.__namespace).off("." + e.__namespace + "-triggerOpen"), t("body").off("." + e.__namespace + "-triggerOpen");
                var i = e._$origin.data("tooltipster-ns");
                if (i) if (1 === i.length) {
                    var n = null;
                    "previous" == e.__options.restoration ? n = e._$origin.data("tooltipster-initialTitle") : "current" == e.__options.restoration && (n = "string" == typeof e.__Content ? e.__Content : t("<div></div>").append(e.__Content).html()), n && e._$origin.attr("title", n), e._$origin.removeClass("tooltipstered"), e._$origin.removeData("tooltipster-ns").removeData("tooltipster-initialTitle")
                } else i = t.grep(i, (function (t, i) {
                    return t !== e.__namespace
                })), e._$origin.data("tooltipster-ns", i);
                e._trigger("destroyed"), e._off(), e.off(), e.__Content = null, e.__$emitterPrivate = null, e.__$emitterPublic = null, e.__options.parent = null, e._$origin = null, e._$tooltip = null, t.tooltipster.__instancesLatestArr = t.grep(t.tooltipster.__instancesLatestArr, (function (t, i) {
                    return e !== t
                })), clearInterval(e.__garbageCollector)
            }))), e
        }, disable: function () {
            return this.__destroyed ? (this.__destroyError(), this) : (this._close(), this.__enabled = !1, this)
        }, elementOrigin: function () {
            return this.__destroyed ? void this.__destroyError() : this._$origin[0]
        }, elementTooltip: function () {
            return this._$tooltip ? this._$tooltip[0] : null
        }, enable: function () {
            return this.__enabled = !0, this
        }, hide: function (t) {
            return this.close(t)
        }, instance: function () {
            return this
        }, off: function () {
            return this.__destroyed || this.__$emitterPublic.off.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this
        }, on: function () {
            return this.__destroyed ? this.__destroyError() : this.__$emitterPublic.on.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this
        }, one: function () {
            return this.__destroyed ? this.__destroyError() : this.__$emitterPublic.one.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this
        }, open: function (t) {
            return this.__destroyed || this.__destroying ? this.__destroyError() : this._open(null, t), this
        }, option: function (e, i) {
            return void 0 === i ? this.__options[e] : (this.__destroyed ? this.__destroyError() : (this.__options[e] = i, this.__optionsFormat(), t.inArray(e, ["trigger", "triggerClose", "triggerOpen"]) >= 0 && this.__prepareOrigin(), "selfDestruction" === e && this.__prepareGC()), this)
        }, reposition: function (t, e) {
            var i = this;
            return i.__destroyed ? i.__destroyError() : "closed" != i.__state && n(i._$origin) && (e || n(i._$tooltip)) && (e || i._$tooltip.detach(), i.__Geometry = i.__geometry(), i._trigger({
                type: "reposition",
                event: t,
                helper: {geo: i.__Geometry}
            })), i
        }, show: function (t) {
            return this.open(t)
        }, status: function () {
            return {
                destroyed: this.__destroyed,
                destroying: this.__destroying,
                enabled: this.__enabled,
                open: "closed" !== this.__state,
                state: this.__state
            }
        }, triggerHandler: function () {
            return this.__destroyed ? this.__destroyError() : this.__$emitterPublic.triggerHandler.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this
        }
    }, t.fn.tooltipster = function () {
        var e = Array.prototype.slice.apply(arguments),
            i = "You are using a single HTML element as content for several tooltips. You probably want to set the contentCloning option to TRUE.";
        if (0 === this.length) return this;
        if ("string" == typeof e[0]) {
            var n = "#*$~&";
            return this.each((function () {
                var r = t(this).data("tooltipster-ns"), o = r ? t(this).data(r[0]) : null;
                if (!o) throw new Error("You called Tooltipster's \"" + e[0] + '" method on an uninitialized element');
                if ("function" != typeof o[e[0]]) throw new Error('Unknown method "' + e[0] + '"');
                this.length > 1 && "content" == e[0] && (e[1] instanceof t || "object" == typeof e[1] && null != e[1] && e[1].tagName) && !o.__options.contentCloning && o.__options.debug && console.log(i);
                var s = o[e[0]](e[1], e[2]);
                return s !== o || "instance" === e[0] ? (n = s, !1) : void 0
            })), "#*$~&" !== n ? n : this
        }
        t.tooltipster.__instancesLatestArr = [];
        var o = e[0] && void 0 !== e[0].multiple, s = o && e[0].multiple || !o && r.multiple,
            a = e[0] && void 0 !== e[0].content, c = a && e[0].content || !a && r.content,
            l = e[0] && void 0 !== e[0].contentCloning, h = l && e[0].contentCloning || !l && r.contentCloning,
            u = e[0] && void 0 !== e[0].debug, f = u && e[0].debug || !u && r.debug;
        return this.length > 1 && (c instanceof t || "object" == typeof c && null != c && c.tagName) && !h && f && console.log(i), this.each((function () {
            var i = !1, n = t(this), r = n.data("tooltipster-ns"), o = null;
            r ? s ? i = !0 : f && (console.log("Tooltipster: one or more tooltips are already attached to the element below. Ignoring."), console.log(this)) : i = !0, i && (o = new t.Tooltipster(this, e[0]), r || (r = []), r.push(o.__namespace), n.data("tooltipster-ns", r), n.data(o.__namespace, o), o.__options.functionInit && o.__options.functionInit.call(o, o, {origin: this}), o._trigger("init")), t.tooltipster.__instancesLatestArr.push(o)
        })), this
    }, e.prototype = {
        __init: function (e) {
            this.__$tooltip = e, this.__$tooltip.css({
                left: 0,
                overflow: "hidden",
                position: "absolute",
                top: 0
            }).find(".tooltipster-content").css("overflow", "auto"), this.$container = t('<div class="tooltipster-ruler"></div>').append(this.__$tooltip).appendTo("body")
        }, __forceRedraw: function () {
            var t = this.__$tooltip.parent();
            this.__$tooltip.detach(), this.__$tooltip.appendTo(t)
        }, constrain: function (t, e) {
            return this.constraints = {width: t, height: e}, this.__$tooltip.css({
                display: "block",
                height: "",
                overflow: "auto",
                width: t
            }), this
        }, destroy: function () {
            this.__$tooltip.detach().find(".tooltipster-content").css({
                display: "",
                overflow: ""
            }), this.$container.remove()
        }, free: function () {
            return this.constraints = null, this.__$tooltip.css({
                display: "",
                height: "",
                overflow: "visible",
                width: ""
            }), this
        }, measure: function () {
            this.__forceRedraw();
            var t = this.__$tooltip[0].getBoundingClientRect(),
                e = {size: {height: t.height || t.bottom, width: t.width || t.right}};
            if (this.constraints) {
                var i = this.__$tooltip.find(".tooltipster-content"), n = this.__$tooltip.outerHeight(),
                    r = i[0].getBoundingClientRect(), o = {
                        height: n <= this.constraints.height,
                        width: t.width <= this.constraints.width && r.width >= i[0].scrollWidth - 1
                    };
                e.fits = o.height && o.width
            }
            return s.IE && s.IE <= 11 && e.size.width !== s.window.document.documentElement.clientWidth && (e.size.width = Math.ceil(e.size.width) + 1), e
        }
    };
    var c = navigator.userAgent.toLowerCase();
    -1 != c.indexOf("msie") ? s.IE = parseInt(c.split("msie")[1]) : -1 !== c.toLowerCase().indexOf("trident") && -1 !== c.indexOf(" rv:11") ? s.IE = 11 : -1 != c.toLowerCase().indexOf("edge/") && (s.IE = parseInt(c.toLowerCase().split("edge/")[1]));
    var l = "tooltipster.sideTip";
    return t.tooltipster._plugin({
        name: l, instance: {
            __defaults: function () {
                return {
                    arrow: !0,
                    distance: 6,
                    functionPosition: null,
                    maxWidth: null,
                    minIntersection: 16,
                    minWidth: 0,
                    position: null,
                    side: "top",
                    viewportAware: !0
                }
            }, __init: function (t) {
                var e = this;
                e.__instance = t, e.__namespace = "tooltipster-sideTip-" + Math.round(1e6 * Math.random()), e.__previousState = "closed", e.__options, e.__optionsFormat(), e.__instance._on("state." + e.__namespace, (function (t) {
                    "closed" == t.state ? e.__close() : "appearing" == t.state && "closed" == e.__previousState && e.__create(), e.__previousState = t.state
                })), e.__instance._on("options." + e.__namespace, (function () {
                    e.__optionsFormat()
                })), e.__instance._on("reposition." + e.__namespace, (function (t) {
                    e.__reposition(t.event, t.helper)
                }))
            }, __close: function () {
                this.__instance.content() instanceof t && this.__instance.content().detach(), this.__instance._$tooltip.remove(), this.__instance._$tooltip = null
            }, __create: function () {
                var e = t('<div class="tooltipster-base tooltipster-sidetip"><div class="tooltipster-box"><div class="tooltipster-content"></div></div><div class="tooltipster-arrow"><div class="tooltipster-arrow-uncropped"><div class="tooltipster-arrow-border"></div><div class="tooltipster-arrow-background"></div></div></div></div>');
                this.__options.arrow || e.find(".tooltipster-box").css("margin", 0).end().find(".tooltipster-arrow").hide(), this.__options.minWidth && e.css("min-width", this.__options.minWidth + "px"), this.__options.maxWidth && e.css("max-width", this.__options.maxWidth + "px"), this.__instance._$tooltip = e, this.__instance._trigger("created")
            }, __destroy: function () {
                this.__instance._off("." + self.__namespace)
            }, __optionsFormat: function () {
                var e = this;
                if (e.__options = e.__instance._optionsExtract(l, e.__defaults()), e.__options.position && (e.__options.side = e.__options.position), "object" != typeof e.__options.distance && (e.__options.distance = [e.__options.distance]), e.__options.distance.length < 4 && (void 0 === e.__options.distance[1] && (e.__options.distance[1] = e.__options.distance[0]), void 0 === e.__options.distance[2] && (e.__options.distance[2] = e.__options.distance[0]), void 0 === e.__options.distance[3] && (e.__options.distance[3] = e.__options.distance[1]), e.__options.distance = {
                    top: e.__options.distance[0],
                    right: e.__options.distance[1],
                    bottom: e.__options.distance[2],
                    left: e.__options.distance[3]
                }), "string" == typeof e.__options.side) {
                    e.__options.side = [e.__options.side, {
                        top: "bottom",
                        right: "left",
                        bottom: "top",
                        left: "right"
                    }[e.__options.side]], "left" == e.__options.side[0] || "right" == e.__options.side[0] ? e.__options.side.push("top", "bottom") : e.__options.side.push("right", "left")
                }
                6 === t.tooltipster._env.IE && !0 !== e.__options.arrow && (e.__options.arrow = !1)
            }, __reposition: function (e, i) {
                var n, r = this, o = r.__targetFind(i), s = [];
                r.__instance._$tooltip.detach();
                var a = r.__instance._$tooltip.clone(), c = t.tooltipster._getRuler(a), l = !1,
                    h = r.__instance.option("animation");
                switch (h && a.removeClass("tooltipster-" + h), t.each(["window", "document"], (function (n, h) {
                    var u = null;
                    if (r.__instance._trigger({
                        container: h, helper: i, satisfied: l, takeTest: function (t) {
                            u = t
                        }, results: s, type: "positionTest"
                    }), 1 == u || 0 != u && 0 == l && ("window" != h || r.__options.viewportAware)) for (n = 0; n < r.__options.side.length; n++) {
                        var f = {horizontal: 0, vertical: 0}, d = r.__options.side[n];
                        "top" == d || "bottom" == d ? f.vertical = r.__options.distance[d] : f.horizontal = r.__options.distance[d], r.__sideChange(a, d), t.each(["natural", "constrained"], (function (t, n) {
                            if (u = null, r.__instance._trigger({
                                container: h,
                                event: e,
                                helper: i,
                                mode: n,
                                results: s,
                                satisfied: l,
                                side: d,
                                takeTest: function (t) {
                                    u = t
                                },
                                type: "positionTest"
                            }), 1 == u || 0 != u && 0 == l) {
                                var a = {
                                        container: h,
                                        distance: f,
                                        fits: null,
                                        mode: n,
                                        outerSize: null,
                                        side: d,
                                        size: null,
                                        target: o[d],
                                        whole: null
                                    },
                                    p = ("natural" == n ? c.free() : c.constrain(i.geo.available[h][d].width - f.horizontal, i.geo.available[h][d].height - f.vertical)).measure();
                                if (a.size = p.size, a.outerSize = {
                                    height: p.size.height + f.vertical,
                                    width: p.size.width + f.horizontal
                                }, "natural" == n ? i.geo.available[h][d].width >= a.outerSize.width && i.geo.available[h][d].height >= a.outerSize.height ? a.fits = !0 : a.fits = !1 : a.fits = p.fits, "window" == h && (a.fits ? a.whole = "top" == d || "bottom" == d ? i.geo.origin.windowOffset.right >= r.__options.minIntersection && i.geo.window.size.width - i.geo.origin.windowOffset.left >= r.__options.minIntersection : i.geo.origin.windowOffset.bottom >= r.__options.minIntersection && i.geo.window.size.height - i.geo.origin.windowOffset.top >= r.__options.minIntersection : a.whole = !1), s.push(a), a.whole) l = !0; else if ("natural" == a.mode && (a.fits || a.size.width <= i.geo.available[h][d].width)) return !1
                            }
                        }))
                    }
                })), r.__instance._trigger({
                    edit: function (t) {
                        s = t
                    }, event: e, helper: i, results: s, type: "positionTested"
                }), s.sort((function (t, e) {
                    if (t.whole && !e.whole) return -1;
                    if (!t.whole && e.whole) return 1;
                    if (t.whole && e.whole) {
                        var i = r.__options.side.indexOf(t.side);
                        return (n = r.__options.side.indexOf(e.side)) > i ? -1 : i > n ? 1 : "natural" == t.mode ? -1 : 1
                    }
                    if (t.fits && !e.fits) return -1;
                    if (!t.fits && e.fits) return 1;
                    if (t.fits && e.fits) {
                        var n;
                        i = r.__options.side.indexOf(t.side);
                        return (n = r.__options.side.indexOf(e.side)) > i ? -1 : i > n ? 1 : "natural" == t.mode ? -1 : 1
                    }
                    return "document" == t.container && "bottom" == t.side && "natural" == t.mode ? -1 : 1
                })), (n = s[0]).coord = {}, n.side) {
                    case"left":
                    case"right":
                        n.coord.top = Math.floor(n.target - n.size.height / 2);
                        break;
                    case"bottom":
                    case"top":
                        n.coord.left = Math.floor(n.target - n.size.width / 2)
                }
                switch (n.side) {
                    case"left":
                        n.coord.left = i.geo.origin.windowOffset.left - n.outerSize.width;
                        break;
                    case"right":
                        n.coord.left = i.geo.origin.windowOffset.right + n.distance.horizontal;
                        break;
                    case"top":
                        n.coord.top = i.geo.origin.windowOffset.top - n.outerSize.height;
                        break;
                    case"bottom":
                        n.coord.top = i.geo.origin.windowOffset.bottom + n.distance.vertical
                }
                "window" == n.container ? "top" == n.side || "bottom" == n.side ? n.coord.left < 0 ? i.geo.origin.windowOffset.right - this.__options.minIntersection >= 0 ? n.coord.left = 0 : n.coord.left = i.geo.origin.windowOffset.right - this.__options.minIntersection - 1 : n.coord.left > i.geo.window.size.width - n.size.width && (i.geo.origin.windowOffset.left + this.__options.minIntersection <= i.geo.window.size.width ? n.coord.left = i.geo.window.size.width - n.size.width : n.coord.left = i.geo.origin.windowOffset.left + this.__options.minIntersection + 1 - n.size.width) : n.coord.top < 0 ? i.geo.origin.windowOffset.bottom - this.__options.minIntersection >= 0 ? n.coord.top = 0 : n.coord.top = i.geo.origin.windowOffset.bottom - this.__options.minIntersection - 1 : n.coord.top > i.geo.window.size.height - n.size.height && (i.geo.origin.windowOffset.top + this.__options.minIntersection <= i.geo.window.size.height ? n.coord.top = i.geo.window.size.height - n.size.height : n.coord.top = i.geo.origin.windowOffset.top + this.__options.minIntersection + 1 - n.size.height) : (n.coord.left > i.geo.window.size.width - n.size.width && (n.coord.left = i.geo.window.size.width - n.size.width), n.coord.left < 0 && (n.coord.left = 0)), r.__sideChange(a, n.side), i.tooltipClone = a[0], i.tooltipParent = r.__instance.option("parent").parent[0], i.mode = n.mode, i.whole = n.whole, i.origin = r.__instance._$origin[0], i.tooltip = r.__instance._$tooltip[0], delete n.container, delete n.fits, delete n.mode, delete n.outerSize, delete n.whole, n.distance = n.distance.horizontal || n.distance.vertical;
                var u, f, d, p = t.extend(!0, {}, n);
                if (r.__instance._trigger({
                    edit: function (t) {
                        n = t
                    }, event: e, helper: i, position: p, type: "position"
                }), r.__options.functionPosition) {
                    var g = r.__options.functionPosition.call(r, r.__instance, i, p);
                    g && (n = g)
                }
                c.destroy(), "top" == n.side || "bottom" == n.side ? (u = {
                    prop: "left",
                    val: n.target - n.coord.left
                }, f = n.size.width - this.__options.minIntersection) : (u = {
                    prop: "top",
                    val: n.target - n.coord.top
                }, f = n.size.height - this.__options.minIntersection), u.val < this.__options.minIntersection ? u.val = this.__options.minIntersection : u.val > f && (u.val = f), d = i.geo.origin.fixedLineage ? i.geo.origin.windowOffset : {
                    left: i.geo.origin.windowOffset.left + i.geo.window.scroll.left,
                    top: i.geo.origin.windowOffset.top + i.geo.window.scroll.top
                }, n.coord = {
                    left: d.left + (n.coord.left - i.geo.origin.windowOffset.left),
                    top: d.top + (n.coord.top - i.geo.origin.windowOffset.top)
                }, r.__sideChange(r.__instance._$tooltip, n.side), i.geo.origin.fixedLineage ? r.__instance._$tooltip.css("position", "fixed") : r.__instance._$tooltip.css("position", ""), r.__instance._$tooltip.css({
                    left: n.coord.left,
                    top: n.coord.top,
                    height: n.size.height,
                    width: n.size.width
                }).find(".tooltipster-arrow").css({
                    left: "",
                    top: ""
                }).css(u.prop, u.val), r.__instance._$tooltip.appendTo(r.__instance.option("parent")), r.__instance._trigger({
                    type: "repositioned",
                    event: e,
                    position: n
                })
            }, __sideChange: function (t, e) {
                t.removeClass("tooltipster-bottom").removeClass("tooltipster-left").removeClass("tooltipster-right").removeClass("tooltipster-top").addClass("tooltipster-" + e)
            }, __targetFind: function (t) {
                var e = {}, i = this.__instance._$origin[0].getClientRects();
                i.length > 1 && (1 == this.__instance._$origin.css("opacity") && (this.__instance._$origin.css("opacity", .99), i = this.__instance._$origin[0].getClientRects(), this.__instance._$origin.css("opacity", 1)));
                if (i.length < 2) e.top = Math.floor(t.geo.origin.windowOffset.left + t.geo.origin.size.width / 2), e.bottom = e.top, e.left = Math.floor(t.geo.origin.windowOffset.top + t.geo.origin.size.height / 2), e.right = e.left; else {
                    var n = i[0];
                    e.top = Math.floor(n.left + (n.right - n.left) / 2), n = i.length > 2 ? i[Math.ceil(i.length / 2) - 1] : i[0], e.right = Math.floor(n.top + (n.bottom - n.top) / 2), n = i[i.length - 1], e.bottom = Math.floor(n.left + (n.right - n.left) / 2), n = i.length > 2 ? i[Math.ceil((i.length + 1) / 2) - 1] : i[i.length - 1], e.left = Math.floor(n.top + (n.bottom - n.top) / 2)
                }
                return e
            }
        }
    }), t
})),
function (t) {
    var e;

    function i() {
        var t = Error.apply(this, arguments);
        t.name = this.name = "FlashError", this.stack = t.stack, this.message = t.message
    }

    function r() {
        var t = Error.apply(this, arguments);
        t.name = this.name = "WebcamError", this.stack = t.stack, this.message = t.message
    }

    var o = function () {
    };
    o.prototype = Error.prototype, i.prototype = new o, r.prototype = new o;
    var s = {
        version: "1.0.25",
        protocol: location.protocol.match(/https/i) ? "https" : "http",
        loaded: !1,
        live: !1,
        userMedia: !0,
        iOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !t.MSStream,
        params: {
            width: 0,
            height: 0,
            dest_width: 0,
            dest_height: 0,
            image_format: "jpeg",
            jpeg_quality: 90,
            enable_flash: !0,
            force_flash: !1,
            flip_horiz: !1,
            fps: 30,
            upload_name: "webcam",
            constraints: null,
            swfURL: "",
            flashNotDetectedText: "ERROR: No Adobe Flash Player detected.  Webcam.js relies on Flash for browsers that do not support getUserMedia (like yours).",
            noInterfaceFoundText: "No supported webcam interface found.",
            unfreeze_snap: !0,
            iosPlaceholderText: "Click here to open camera.",
            user_callback: null,
            user_canvas: null
        },
        errors: {FlashError: i, WebcamError: r},
        hooks: {},
        init: function () {
            var e = this;
            this.mediaDevices = navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? navigator.mediaDevices : navigator.mozGetUserMedia || navigator.webkitGetUserMedia ? {
                getUserMedia: function (t) {
                    return new Promise((function (e, i) {
                        (navigator.mozGetUserMedia || navigator.webkitGetUserMedia).call(navigator, t, e, i)
                    }))
                }
            } : null, t.URL = t.URL || t.webkitURL || t.mozURL || t.msURL, this.userMedia = this.userMedia && !!this.mediaDevices && !!t.URL, this.iOS && (this.userMedia = null), navigator.userAgent.match(/Firefox\D+(\d+)/) && parseInt(RegExp.$1, 10) < 21 && (this.userMedia = null), this.userMedia && t.addEventListener("beforeunload", (function (t) {
                e.reset()
            }))
        },
        exifOrientation: function (t) {
            var e = new DataView(t);
            if (255 != e.getUint8(0) || 216 != e.getUint8(1)) return console.log("Not a valid JPEG file"), 0;
            for (var i = 2; i < t.byteLength;) {
                if (255 != e.getUint8(i)) return console.log("Not a valid marker at offset " + i + ", found: " + e.getUint8(i)), 0;
                if (225 == e.getUint8(i + 1)) {
                    i += 4;
                    var r = "";
                    for (n = 0; n < 4; n++) r += String.fromCharCode(e.getUint8(i + n));
                    if ("Exif" != r) return console.log("Not valid EXIF data found"), 0;
                    i += 6;
                    var o = null;
                    if (18761 == e.getUint16(i)) o = !1; else {
                        if (19789 != e.getUint16(i)) return console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)"), 0;
                        o = !0
                    }
                    if (42 != e.getUint16(i + 2, !o)) return console.log("Not valid TIFF data! (no 0x002A)"), 0;
                    var s = e.getUint32(i + 4, !o);
                    if (s < 8) return console.log("Not valid TIFF data! (First offset less than 8)", e.getUint32(i + 4, !o)), 0;
                    for (var a = i + s, c = e.getUint16(a, !o), l = 0; l < c; l++) {
                        var h = a + 12 * l + 2;
                        if (274 == e.getUint16(h, !o)) {
                            var u = e.getUint16(h + 2, !o), f = e.getUint32(h + 4, !o);
                            if (3 != u && 1 != f) return console.log("Invalid EXIF orientation value type (" + u + ") or count (" + f + ")"), 0;
                            var d = e.getUint16(h + 8, !o);
                            return d < 1 || d > 8 ? (console.log("Invalid EXIF orientation value (" + d + ")"), 0) : d
                        }
                    }
                } else i += 2 + e.getUint16(i + 2)
            }
            return 0
        },
        fixOrientation: function (t, e, i) {
            var n = new Image;
            n.addEventListener("load", (function (t) {
                var r = document.createElement("canvas"), o = r.getContext("2d");
                switch (e < 5 ? (r.width = n.width, r.height = n.height) : (r.width = n.height, r.height = n.width), e) {
                    case 2:
                        o.transform(-1, 0, 0, 1, n.width, 0);
                        break;
                    case 3:
                        o.transform(-1, 0, 0, -1, n.width, n.height);
                        break;
                    case 4:
                        o.transform(1, 0, 0, -1, 0, n.height);
                        break;
                    case 5:
                        o.transform(0, 1, 1, 0, 0, 0);
                        break;
                    case 6:
                        o.transform(0, 1, -1, 0, n.height, 0);
                        break;
                    case 7:
                        o.transform(0, -1, -1, 0, n.height, n.width);
                        break;
                    case 8:
                        o.transform(0, -1, 1, 0, 0, n.width)
                }
                o.drawImage(n, 0, 0), i.src = r.toDataURL()
            }), !1), n.src = t
        },
        attach: function (i) {
            if ("string" == typeof i && (i = document.getElementById(i) || document.querySelector(i)), !i) return this.dispatch("error", new r("Could not locate DOM element to attach to."));
            this.container = i, i.innerHTML = "";
            var n = document.createElement("div");
            if (i.appendChild(n), this.peg = n, this.params.width || (this.params.width = i.offsetWidth), this.params.height || (this.params.height = i.offsetHeight), !this.params.width || !this.params.height) return this.dispatch("error", new r("No width and/or height for webcam.  Please call set() first, or attach to a visible element."));
            this.params.dest_width || (this.params.dest_width = this.params.width), this.params.dest_height || (this.params.dest_height = this.params.height), this.userMedia = void 0 === e ? this.userMedia : e, this.params.force_flash && (e = this.userMedia, this.userMedia = null), "number" != typeof this.params.fps && (this.params.fps = 30);
            var o = this.params.width / this.params.dest_width, a = this.params.height / this.params.dest_height;
            if (this.userMedia) {
                var c = document.createElement("video");
                c.setAttribute("autoplay", "autoplay"), c.style.width = this.params.dest_width + "px", c.style.height = this.params.dest_height + "px", 1 == o && 1 == a || (i.style.overflow = "hidden", c.style.webkitTransformOrigin = "0px 0px", c.style.mozTransformOrigin = "0px 0px", c.style.msTransformOrigin = "0px 0px", c.style.oTransformOrigin = "0px 0px", c.style.transformOrigin = "0px 0px", c.style.webkitTransform = "scaleX(" + o + ") scaleY(" + a + ")", c.style.mozTransform = "scaleX(" + o + ") scaleY(" + a + ")", c.style.msTransform = "scaleX(" + o + ") scaleY(" + a + ")", c.style.oTransform = "scaleX(" + o + ") scaleY(" + a + ")", c.style.transform = "scaleX(" + o + ") scaleY(" + a + ")"), i.appendChild(c), this.video = c;
                var l = this;
                this.mediaDevices.getUserMedia({
                    audio: !1,
                    video: this.params.constraints || {
                        mandatory: {
                            minWidth: this.params.dest_width,
                            minHeight: this.params.dest_height
                        }
                    }
                }).then((function (e) {
                    c.onloadedmetadata = function (t) {
                        l.stream = e, l.loaded = !0, l.live = !0, l.dispatch("load"), l.dispatch("live"), l.flip()
                    }, "srcObject" in c ? c.srcObject = e : c.src = t.URL.createObjectURL(e)
                })).catch((function (t) {
                    l.params.enable_flash && l.detectFlash() ? setTimeout((function () {
                        l.params.force_flash = 1, l.attach(i)
                    }), 1) : l.dispatch("error", t)
                }))
            } else if (this.iOS) {
                (p = document.createElement("div")).id = this.container.id + "-ios_div", p.className = "webcamjs-ios-placeholder", p.style.width = this.params.width + "px", p.style.height = this.params.height + "px", p.style.textAlign = "center", p.style.display = "table-cell", p.style.verticalAlign = "middle", p.style.backgroundRepeat = "no-repeat", p.style.backgroundSize = "contain", p.style.backgroundPosition = "center";
                var h = document.createElement("span");
                h.className = "webcamjs-ios-text", h.innerHTML = this.params.iosPlaceholderText, p.appendChild(h);
                var u = document.createElement("img");
                u.id = this.container.id + "-ios_img", u.style.width = this.params.dest_width + "px", u.style.height = this.params.dest_height + "px", u.style.display = "none", p.appendChild(u);
                var f = document.createElement("input");
                f.id = this.container.id + "-ios_input", f.setAttribute("type", "file"), f.setAttribute("accept", "image/*"), f.setAttribute("capture", "camera");
                l = this;
                var d = this.params;
                f.addEventListener("change", (function (t) {
                    if (t.target.files.length > 0 && 0 == t.target.files[0].type.indexOf("image/")) {
                        var e = URL.createObjectURL(t.target.files[0]), i = new Image;
                        i.addEventListener("load", (function (t) {
                            var e = document.createElement("canvas");
                            e.width = d.dest_width, e.height = d.dest_height;
                            var n = e.getContext("2d");
                            ratio = Math.min(i.width / d.dest_width, i.height / d.dest_height);
                            var r = d.dest_width * ratio, o = d.dest_height * ratio, s = (i.width - r) / 2,
                                a = (i.height - o) / 2;
                            n.drawImage(i, s, a, r, o, 0, 0, d.dest_width, d.dest_height);
                            var c = e.toDataURL();
                            u.src = c, p.style.backgroundImage = "url('" + c + "')"
                        }), !1);
                        var n = new FileReader;
                        n.addEventListener("load", (function (t) {
                            var n = l.exifOrientation(t.target.result);
                            n > 1 ? l.fixOrientation(e, n, i) : i.src = e
                        }), !1);
                        var r = new XMLHttpRequest;
                        r.open("GET", e, !0), r.responseType = "blob", r.onload = function (t) {
                            200 != this.status && 0 !== this.status || n.readAsArrayBuffer(this.response)
                        }, r.send()
                    }
                }), !1), f.style.display = "none", i.appendChild(f), p.addEventListener("click", (function (t) {
                    d.user_callback ? l.snap(d.user_callback, d.user_canvas) : (f.style.display = "block", f.focus(), f.click(), f.style.display = "none")
                }), !1), i.appendChild(p), this.loaded = !0, this.live = !0
            } else if (this.params.enable_flash && this.detectFlash()) {
                var p;
                t.Webcam = s, (p = document.createElement("div")).innerHTML = this.getSWFHTML(), i.appendChild(p)
            } else this.dispatch("error", new r(this.params.noInterfaceFoundText));
            if (this.params.crop_width && this.params.crop_height) {
                var g = Math.floor(this.params.crop_width * o), v = Math.floor(this.params.crop_height * a);
                i.style.width = g + "px", i.style.height = v + "px", i.style.overflow = "hidden", i.scrollLeft = Math.floor(this.params.width / 2 - g / 2), i.scrollTop = Math.floor(this.params.height / 2 - v / 2)
            } else i.style.width = this.params.width + "px", i.style.height = this.params.height + "px"
        },
        reset: function () {
            if (this.preview_active && this.unfreeze(), this.unflip(), this.userMedia) {
                if (this.stream) if (this.stream.getVideoTracks) {
                    var t = this.stream.getVideoTracks();
                    t && t[0] && t[0].stop && t[0].stop()
                } else this.stream.stop && this.stream.stop();
                delete this.stream, delete this.video
            }
            if (!0 !== this.userMedia && this.loaded && !this.iOS) {
                var e = this.getMovie();
                e && e._releaseCamera && e._releaseCamera()
            }
            this.container && (this.container.innerHTML = "", delete this.container), this.loaded = !1, this.live = !1
        },
        set: function () {
            if (1 == arguments.length) for (var t in arguments[0]) this.params[t] = arguments[0][t]; else this.params[arguments[0]] = arguments[1]
        },
        on: function (t, e) {
            t = t.replace(/^on/i, "").toLowerCase(), this.hooks[t] || (this.hooks[t] = []), this.hooks[t].push(e)
        },
        off: function (t, e) {
            if (t = t.replace(/^on/i, "").toLowerCase(), this.hooks[t]) if (e) {
                var i = this.hooks[t].indexOf(e);
                i > -1 && this.hooks[t].splice(i, 1)
            } else this.hooks[t] = []
        },
        dispatch: function () {
            var e, n = arguments[0].replace(/^on/i, "").toLowerCase(), o = Array.prototype.slice.call(arguments, 1);
            if (this.hooks[n] && this.hooks[n].length) {
                for (var s = 0, a = this.hooks[n].length; s < a; s++) {
                    var c = this.hooks[n][s];
                    "function" == typeof c ? c.apply(this, o) : "object" == typeof c && 2 == c.length ? c[0][c[1]].apply(c[0], o) : t[c] && t[c].apply(t, o)
                }
                return !0
            }
            return "error" == n && (e = o[0] instanceof i || o[0] instanceof r ? o[0].message : "Could not access webcam: " + o[0].name + ": " + o[0].message + " " + o[0].toString(), alert("Webcam.js Error: " + e)), !1
        },
        setSWFLocation: function (t) {
            this.set("swfURL", t)
        },
        detectFlash: function () {
            var e = "Shockwave Flash", i = "application/x-shockwave-flash", n = t, r = navigator, o = !1;
            if (void 0 !== r.plugins && "object" == typeof r.plugins[e]) r.plugins[e].description && void 0 !== r.mimeTypes && r.mimeTypes[i] && r.mimeTypes[i].enabledPlugin && (o = !0); else if (void 0 !== n.ActiveXObject) try {
                var s = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                if (s) s.GetVariable("$version") && (o = !0)
            } catch (t) {
            }
            return o
        },
        getSWFHTML: function () {
            var e = "", n = this.params.swfURL;
            if (location.protocol.match(/file/)) return this.dispatch("error", new i("Flash does not work from local disk.  Please run from a web server.")), '<h3 style="color:red">ERROR: the Webcam.js Flash fallback does not work from local disk.  Please run it from a web server.</h3>';
            if (!this.detectFlash()) return this.dispatch("error", new i("Adobe Flash Player not found.  Please install from get.adobe.com/flashplayer and try again.")), '<h3 style="color:red">' + this.params.flashNotDetectedText + "</h3>";
            if (!n) {
                for (var r = "", o = document.getElementsByTagName("script"), s = 0, a = o.length; s < a; s++) {
                    var c = o[s].getAttribute("src");
                    c && c.match(/\/webcam(\.min)?\.js/) && (r = c.replace(/\/webcam(\.min)?\.js.*$/, ""), s = a)
                }
                n = r ? r + "/webcam.swf" : "webcam.swf"
            }
            t.localStorage && !localStorage.getItem("visited") && (this.params.new_user = 1, localStorage.setItem("visited", 1));
            var l = "";
            for (var h in this.params) l && (l += "&"), l += h + "=" + escape(this.params[h]);
            return e += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" type="application/x-shockwave-flash" codebase="' + this.protocol + '://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + this.params.width + '" height="' + this.params.height + '" id="webcam_movie_obj" align="middle"><param name="wmode" value="opaque" /><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + n + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + l + '"/><embed id="webcam_movie_embed" src="' + n + '" wmode="opaque" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + this.params.width + '" height="' + this.params.height + '" name="webcam_movie_embed" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + l + '"></embed></object>'
        },
        getMovie: function () {
            if (!this.loaded) return this.dispatch("error", new i("Flash Movie is not loaded yet"));
            var t = document.getElementById("webcam_movie_obj");
            return t && t._snap || (t = document.getElementById("webcam_movie_embed")), t || this.dispatch("error", new i("Cannot locate Flash movie in DOM")), t
        },
        freeze: function () {
            var t = this, e = this.params;
            this.preview_active && this.unfreeze();
            var i = this.params.width / this.params.dest_width, n = this.params.height / this.params.dest_height;
            this.unflip();
            var r = e.crop_width || e.dest_width, o = e.crop_height || e.dest_height,
                s = document.createElement("canvas");
            s.width = r, s.height = o;
            var a = s.getContext("2d");
            this.preview_canvas = s, this.preview_context = a, 1 == i && 1 == n || (s.style.webkitTransformOrigin = "0px 0px", s.style.mozTransformOrigin = "0px 0px", s.style.msTransformOrigin = "0px 0px", s.style.oTransformOrigin = "0px 0px", s.style.transformOrigin = "0px 0px", s.style.webkitTransform = "scaleX(" + i + ") scaleY(" + n + ")", s.style.mozTransform = "scaleX(" + i + ") scaleY(" + n + ")", s.style.msTransform = "scaleX(" + i + ") scaleY(" + n + ")", s.style.oTransform = "scaleX(" + i + ") scaleY(" + n + ")", s.style.transform = "scaleX(" + i + ") scaleY(" + n + ")"), this.snap((function () {
                s.style.position = "relative", s.style.left = t.container.scrollLeft + "px", s.style.top = t.container.scrollTop + "px", t.container.insertBefore(s, t.peg), t.container.style.overflow = "hidden", t.preview_active = !0
            }), s)
        },
        unfreeze: function () {
            this.preview_active && (this.container.removeChild(this.preview_canvas), delete this.preview_context, delete this.preview_canvas, this.preview_active = !1, this.flip())
        },
        flip: function () {
            if (this.params.flip_horiz) {
                var t = this.container.style;
                t.webkitTransform = "scaleX(-1)", t.mozTransform = "scaleX(-1)", t.msTransform = "scaleX(-1)", t.oTransform = "scaleX(-1)", t.transform = "scaleX(-1)", t.filter = "FlipH", t.msFilter = "FlipH"
            }
        },
        unflip: function () {
            if (this.params.flip_horiz) {
                var t = this.container.style;
                t.webkitTransform = "scaleX(1)", t.mozTransform = "scaleX(1)", t.msTransform = "scaleX(1)", t.oTransform = "scaleX(1)", t.transform = "scaleX(1)", t.filter = "", t.msFilter = ""
            }
        },
        savePreview: function (t, e) {
            var i = this.params, n = this.preview_canvas, r = this.preview_context;
            e && e.getContext("2d").drawImage(n, 0, 0);
            t(e ? null : n.toDataURL("image/" + i.image_format, i.jpeg_quality / 100), n, r), this.params.unfreeze_snap && this.unfreeze()
        },
        snap: function (t, e) {
            t || (t = this.params.user_callback), e || (e = this.params.user_canvas);
            var i = this.params;
            if (!this.loaded) return this.dispatch("error", new r("Webcam is not loaded yet"));
            if (!t) return this.dispatch("error", new r("Please provide a callback function or canvas to snap()"));
            if (this.preview_active) return this.savePreview(t, e), null;
            var n = document.createElement("canvas");
            n.width = this.params.dest_width, n.height = this.params.dest_height;
            var o = n.getContext("2d");
            this.params.flip_horiz && (o.translate(i.dest_width, 0), o.scale(-1, 1));
            var s = function () {
                if (this.src && this.width && this.height && o.drawImage(this, 0, 0, i.dest_width, i.dest_height), i.crop_width && i.crop_height) {
                    var r = document.createElement("canvas");
                    r.width = i.crop_width, r.height = i.crop_height;
                    var s = r.getContext("2d");
                    s.drawImage(n, Math.floor(i.dest_width / 2 - i.crop_width / 2), Math.floor(i.dest_height / 2 - i.crop_height / 2), i.crop_width, i.crop_height, 0, 0, i.crop_width, i.crop_height), o = s, n = r
                }
                e && e.getContext("2d").drawImage(n, 0, 0);
                t(e ? null : n.toDataURL("image/" + i.image_format, i.jpeg_quality / 100), n, o)
            };
            if (this.userMedia) o.drawImage(this.video, 0, 0, this.params.dest_width, this.params.dest_height), s(); else if (this.iOS) {
                var a = document.getElementById(this.container.id + "-ios_div"),
                    c = document.getElementById(this.container.id + "-ios_img"),
                    l = document.getElementById(this.container.id + "-ios_input");
                iFunc = function (t) {
                    s.call(c), c.removeEventListener("load", iFunc), a.style.backgroundImage = "none", c.removeAttribute("src"), l.value = null
                }, l.value ? iFunc(null) : (c.addEventListener("load", iFunc), l.style.display = "block", l.focus(), l.click(), l.style.display = "none")
            } else {
                var h = this.getMovie()._snap();
                (c = new Image).onload = s, c.src = "data:image/" + this.params.image_format + ";base64," + h
            }
            return null
        },
        configure: function (t) {
            t || (t = "camera"), this.getMovie()._configure(t)
        },
        flashNotify: function (t, e) {
            switch (t) {
                case"flashLoadComplete":
                    this.loaded = !0, this.dispatch("load");
                    break;
                case"cameraLive":
                    this.live = !0, this.dispatch("live");
                    break;
                case"error":
                    this.dispatch("error", new i(e))
            }
        },
        b64ToUint6: function (t) {
            return t > 64 && t < 91 ? t - 65 : t > 96 && t < 123 ? t - 71 : t > 47 && t < 58 ? t + 4 : 43 === t ? 62 : 47 === t ? 63 : 0
        },
        base64DecToArr: function (t, e) {
            for (var i, n, r = t.replace(/[^A-Za-z0-9\+\/]/g, ""), o = r.length, s = e ? Math.ceil((3 * o + 1 >> 2) / e) * e : 3 * o + 1 >> 2, a = new Uint8Array(s), c = 0, l = 0, h = 0; h < o; h++) if (n = 3 & h, c |= this.b64ToUint6(r.charCodeAt(h)) << 18 - 6 * n, 3 === n || o - h == 1) {
                for (i = 0; i < 3 && l < s; i++, l++) a[l] = c >>> (16 >>> i & 24) & 255;
                c = 0
            }
            return a
        },
        upload: function (t, e, i) {
            var n = this.params.upload_name || "webcam", r = "";
            if (!t.match(/^data\:image\/(\w+)/)) throw "Cannot locate image format in Data URI";
            r = RegExp.$1;
            var o = t.replace(/^data\:image\/\w+\;base64\,/, ""), a = new XMLHttpRequest;
            a.open("POST", e, !0), a.upload && a.upload.addEventListener && a.upload.addEventListener("progress", (function (t) {
                if (t.lengthComputable) {
                    var e = t.loaded / t.total;
                    s.dispatch("uploadProgress", e, t)
                }
            }), !1);
            var c = this;
            a.onload = function () {
                i && i.apply(c, [a.status, a.responseText, a.statusText]), s.dispatch("uploadComplete", a.status, a.responseText, a.statusText)
            };
            var l = new Blob([this.base64DecToArr(o)], {type: "image/" + r}), h = new FormData;
            h.append(n, l, n + "." + r.replace(/e/, "")), a.send(h)
        }
    };
    s.init(), "function" == typeof define && define.amd ? define((function () {
        return s
    })) : "object" == typeof module && module.exports ? module.exports = s : t.Webcam = s
}(window),
function () {
    "use strict";
    var t, e = [];

    function i() {
        for (; e.length;) e[0](), e.shift()
    }

    function n(t) {
        this.a = r, this.b = void 0, this.f = [];
        var e = this;
        try {
            t((function (t) {
                s(e, t)
            }), (function (t) {
                a(e, t)
            }))
        } catch (t) {
            a(e, t)
        }
    }

    t = function () {
        setTimeout(i)
    };
    var r = 2;

    function o(t) {
        return new n((function (e) {
            e(t)
        }))
    }

    function s(t, e) {
        if (t.a == r) {
            if (e == t) throw new TypeError;
            var i = !1;
            try {
                var n = e && e.then;
                if (null != e && "object" == typeof e && "function" == typeof n) return void n.call(e, (function (e) {
                    i || s(t, e), i = !0
                }), (function (e) {
                    i || a(t, e), i = !0
                }))
            } catch (e) {
                return void (i || a(t, e))
            }
            t.a = 0, t.b = e, c(t)
        }
    }

    function a(t, e) {
        if (t.a == r) {
            if (e == t) throw new TypeError;
            t.a = 1, t.b = e, c(t)
        }
    }

    function c(i) {
        !function (i) {
            e.push(i), 1 == e.length && t()
        }((function () {
            if (i.a != r) for (; i.f.length;) {
                var t = (o = i.f.shift())[0], e = o[1], n = o[2], o = o[3];
                try {
                    0 == i.a ? n("function" == typeof t ? t.call(void 0, i.b) : i.b) : 1 == i.a && ("function" == typeof e ? n(e.call(void 0, i.b)) : o(i.b))
                } catch (t) {
                    o(t)
                }
            }
        }))
    }

    n.prototype.g = function (t) {
        return this.c(void 0, t)
    }, n.prototype.c = function (t, e) {
        var i = this;
        return new n((function (n, r) {
            i.f.push([t, e, n, r]), c(i)
        }))
    }, window.Promise || (window.Promise = n, window.Promise.resolve = o, window.Promise.reject = function (t) {
        return new n((function (e, i) {
            i(t)
        }))
    }, window.Promise.race = function (t) {
        return new n((function (e, i) {
            for (var n = 0; n < t.length; n += 1) o(t[n]).c(e, i)
        }))
    }, window.Promise.all = function (t) {
        return new n((function (e, i) {
            function n(i) {
                return function (n) {
                    s[i] = n, (r += 1) == t.length && e(s)
                }
            }

            var r = 0, s = [];
            0 == t.length && e(s);
            for (var a = 0; a < t.length; a += 1) o(t[a]).c(n(a), i)
        }))
    }, window.Promise.prototype.then = n.prototype.c, window.Promise.prototype.catch = n.prototype.g)
}(),
function () {
    function t(t, e) {
        document.addEventListener ? t.addEventListener("scroll", e, !1) : t.attachEvent("scroll", e)
    }

    function e(t) {
        this.a = document.createElement("div"), this.a.setAttribute("aria-hidden", "true"), this.a.appendChild(document.createTextNode(t)), this.b = document.createElement("span"), this.c = document.createElement("span"), this.h = document.createElement("span"), this.f = document.createElement("span"), this.g = -1, this.b.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;", this.c.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;", this.f.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;", this.h.style.cssText = "display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;", this.b.appendChild(this.h), this.c.appendChild(this.f), this.a.appendChild(this.b), this.a.appendChild(this.c)
    }

    function i(t, e) {
        t.a.style.cssText = "max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:" + e + ";"
    }

    function n(t) {
        var e = t.a.offsetWidth, i = e + 100;
        return t.f.style.width = i + "px", t.c.scrollLeft = i, t.b.scrollLeft = t.b.scrollWidth + 100, t.g !== e && (t.g = e, !0)
    }

    function r(e, i) {
        function r() {
            var t = o;
            n(t) && t.a.parentNode && i(t.g)
        }

        var o = e;
        t(e.b, r), t(e.c, r), n(e)
    }

    function o(t, e) {
        var i = e || {};
        this.family = t, this.style = i.style || "normal", this.weight = i.weight || "normal", this.stretch = i.stretch || "normal"
    }

    var s = null, a = null, c = null, l = null;

    function h() {
        return null === l && (l = !!document.fonts), l
    }

    function u() {
        if (null === c) {
            var t = document.createElement("div");
            try {
                t.style.font = "condensed 100px sans-serif"
            } catch (t) {
            }
            c = "" !== t.style.font
        }
        return c
    }

    function f(t, e) {
        return [t.style, t.weight, u() ? t.stretch : "", "100px", e].join(" ")
    }

    o.prototype.load = function (t, n) {
        var o = this, c = t || "BESbswy", l = 0, u = n || 3e3, d = (new Date).getTime();
        return new Promise((function (t, n) {
            if (h() && !function () {
                if (null === a) if (h() && /Apple/.test(window.navigator.vendor)) {
                    var t = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent);
                    a = !!t && 603 > parseInt(t[1], 10)
                } else a = !1;
                return a
            }()) {
                var p = new Promise((function (t, e) {
                    !function i() {
                        (new Date).getTime() - d >= u ? e() : document.fonts.load(f(o, '"' + o.family + '"'), c).then((function (e) {
                            1 <= e.length ? t() : setTimeout(i, 25)
                        }), (function () {
                            e()
                        }))
                    }()
                })), g = new Promise((function (t, e) {
                    l = setTimeout(e, u)
                }));
                Promise.race([g, p]).then((function () {
                    clearTimeout(l), t(o)
                }), (function () {
                    n(o)
                }))
            } else !function (t) {
                document.body ? t() : document.addEventListener ? document.addEventListener("DOMContentLoaded", (function e() {
                    document.removeEventListener("DOMContentLoaded", e), t()
                })) : document.attachEvent("onreadystatechange", (function e() {
                    "interactive" != document.readyState && "complete" != document.readyState || (document.detachEvent("onreadystatechange", e), t())
                }))
            }((function () {
                function a() {
                    var e;
                    (e = -1 != v && -1 != m || -1 != v && -1 != _ || -1 != m && -1 != _) && ((e = v != m && v != _ && m != _) || (null === s && (e = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent), s = !!e && (536 > parseInt(e[1], 10) || 536 === parseInt(e[1], 10) && 11 >= parseInt(e[2], 10))), e = s && (v == b && m == b && _ == b || v == y && m == y && _ == y || v == x && m == x && _ == x)), e = !e), e && (w.parentNode && w.parentNode.removeChild(w), clearTimeout(l), t(o))
                }

                var h = new e(c), p = new e(c), g = new e(c), v = -1, m = -1, _ = -1, b = -1, y = -1, x = -1,
                    w = document.createElement("div");
                w.dir = "ltr", i(h, f(o, "sans-serif")), i(p, f(o, "serif")), i(g, f(o, "monospace")), w.appendChild(h.a), w.appendChild(p.a), w.appendChild(g.a), document.body.appendChild(w), b = h.a.offsetWidth, y = p.a.offsetWidth, x = g.a.offsetWidth, function t() {
                    if ((new Date).getTime() - d >= u) w.parentNode && w.parentNode.removeChild(w), n(o); else {
                        var e = document.hidden;
                        !0 !== e && void 0 !== e || (v = h.a.offsetWidth, m = p.a.offsetWidth, _ = g.a.offsetWidth, a()), l = setTimeout(t, 50)
                    }
                }(), r(h, (function (t) {
                    v = t, a()
                })), i(h, f(o, '"' + o.family + '",sans-serif')), r(p, (function (t) {
                    m = t, a()
                })), i(p, f(o, '"' + o.family + '",serif')), r(g, (function (t) {
                    _ = t, a()
                })), i(g, f(o, '"' + o.family + '",monospace'))
            }))
        }))
    }, "object" == typeof module ? module.exports = o : (window.FontFaceObserver = o, window.FontFaceObserver.prototype.load = o.prototype.load)
}(),
function t(e, i, n) {
    function r(s, a) {
        if (!i[s]) {
            if (!e[s]) {
                var c = "function" == typeof require && require;
                if (!a && c) return c(s, !0);
                if (o) return o(s, !0);
                var l = new Error("Cannot find module '" + s + "'");
                throw l.code = "MODULE_NOT_FOUND", l
            }
            var h = i[s] = {exports: {}};
            e[s][0].call(h.exports, (function (t) {
                var i = e[s][1][t];
                return r(i || t)
            }), h, h.exports, t, e, i, n)
        }
        return i[s].exports
    }

    for (var o = "function" == typeof require && require, s = 0; s < n.length; s++) r(n[s]);
    return r
}({
    1: [function (t, e, i) {
        "use strict";

        function n(t) {
            t.fn.perfectScrollbar = function (t) {
                return this.each((function () {
                    if ("object" == typeof t || void 0 === t) {
                        var e = t;
                        o.get(this) || r.initialize(this, e)
                    } else {
                        var i = t;
                        "update" === i ? r.update(this) : "destroy" === i && r.destroy(this)
                    }
                }))
            }
        }

        var r = t("../main"), o = t("../plugin/instances");
        if ("function" == typeof define && define.amd) define(["jquery"], n); else {
            var s = window.jQuery ? window.jQuery : window.$;
            void 0 !== s && n(s)
        }
        e.exports = n
    }, {"../main": 6, "../plugin/instances": 17}],
    2: [function (t, e, i) {
        "use strict";
        var n = {
            create: function (t, e) {
                var i = document.createElement(t);
                return i.className = e, i
            }, appendTo: function (t, e) {
                return e.appendChild(t), t
            }
        };
        n.css = function (t, e, i) {
            return "object" == typeof e ? function (t, e) {
                for (var i in e) {
                    var n = e[i];
                    "number" == typeof n && (n = n.toString() + "px"), t.style[i] = n
                }
                return t
            }(t, e) : void 0 === i ? function (t, e) {
                return window.getComputedStyle(t)[e]
            }(t, e) : function (t, e, i) {
                return "number" == typeof i && (i = i.toString() + "px"), t.style[e] = i, t
            }(t, e, i)
        }, n.matches = function (t, e) {
            return void 0 !== t.matches ? t.matches(e) : t.msMatchesSelector(e)
        }, n.remove = function (t) {
            void 0 !== t.remove ? t.remove() : t.parentNode && t.parentNode.removeChild(t)
        }, n.queryChildren = function (t, e) {
            return Array.prototype.filter.call(t.childNodes, (function (t) {
                return n.matches(t, e)
            }))
        }, e.exports = n
    }, {}],
    3: [function (t, e, i) {
        "use strict";
        var n = function (t) {
            this.element = t, this.events = {}
        };
        n.prototype.bind = function (t, e) {
            void 0 === this.events[t] && (this.events[t] = []), this.events[t].push(e), this.element.addEventListener(t, e, !1)
        }, n.prototype.unbind = function (t, e) {
            var i = void 0 !== e;
            this.events[t] = this.events[t].filter((function (n) {
                return !(!i || n === e) || (this.element.removeEventListener(t, n, !1), !1)
            }), this)
        }, n.prototype.unbindAll = function () {
            for (var t in this.events) this.unbind(t)
        };
        var r = function () {
            this.eventElements = []
        };
        r.prototype.eventElement = function (t) {
            var e = this.eventElements.filter((function (e) {
                return e.element === t
            }))[0];
            return void 0 === e && (e = new n(t), this.eventElements.push(e)), e
        }, r.prototype.bind = function (t, e, i) {
            this.eventElement(t).bind(e, i)
        }, r.prototype.unbind = function (t, e, i) {
            this.eventElement(t).unbind(e, i)
        }, r.prototype.unbindAll = function () {
            for (var t = 0; t < this.eventElements.length; t++) this.eventElements[t].unbindAll()
        }, r.prototype.once = function (t, e, i) {
            var n = this.eventElement(t), r = function (t) {
                n.unbind(e, r), i(t)
            };
            n.bind(e, r)
        }, e.exports = r
    }, {}],
    4: [function (t, e, i) {
        "use strict";
        e.exports = function () {
            function t() {
                return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
            }

            return function () {
                return t() + t() + "-" + t() + "-" + t() + "-" + t() + "-" + t() + t() + t()
            }
        }()
    }, {}],
    5: [function (t, e, i) {
        "use strict";

        function n(t) {
            return ["ps--in-scrolling"].concat(void 0 === t ? ["ps--x", "ps--y"] : ["ps--" + t])
        }

        var r = t("./dom"), o = i.toInt = function (t) {
            return parseInt(t, 10) || 0
        };
        i.isEditable = function (t) {
            return r.matches(t, "input,[contenteditable]") || r.matches(t, "select,[contenteditable]") || r.matches(t, "textarea,[contenteditable]") || r.matches(t, "button,[contenteditable]")
        }, i.removePsClasses = function (t) {
            for (var e = 0; e < t.classList.length; e++) {
                var i = t.classList[e];
                0 === i.indexOf("ps-") && t.classList.remove(i)
            }
        }, i.outerWidth = function (t) {
            return o(r.css(t, "width")) + o(r.css(t, "paddingLeft")) + o(r.css(t, "paddingRight")) + o(r.css(t, "borderLeftWidth")) + o(r.css(t, "borderRightWidth"))
        }, i.startScrolling = function (t, e) {
            for (var i = n(e), r = 0; r < i.length; r++) t.classList.add(i[r])
        }, i.stopScrolling = function (t, e) {
            for (var i = n(e), r = 0; r < i.length; r++) t.classList.remove(i[r])
        }, i.env = {
            isWebKit: "undefined" != typeof document && "WebkitAppearance" in document.documentElement.style,
            supportsTouch: "undefined" != typeof window && ("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch),
            supportsIePointer: "undefined" != typeof window && null !== window.navigator.msMaxTouchPoints
        }
    }, {"./dom": 2}],
    6: [function (t, e, i) {
        "use strict";
        var n = t("./plugin/destroy"), r = t("./plugin/initialize"), o = t("./plugin/update");
        e.exports = {initialize: r, update: o, destroy: n}
    }, {"./plugin/destroy": 8, "./plugin/initialize": 16, "./plugin/update": 20}],
    7: [function (t, e, i) {
        "use strict";
        e.exports = function () {
            return {
                handlers: ["click-rail", "drag-scrollbar", "keyboard", "wheel", "touch"],
                maxScrollbarLength: null,
                minScrollbarLength: null,
                scrollXMarginOffset: 0,
                scrollYMarginOffset: 0,
                suppressScrollX: !1,
                suppressScrollY: !1,
                swipePropagation: !0,
                swipeEasing: !0,
                useBothWheelAxes: !1,
                wheelPropagation: !1,
                wheelSpeed: 1,
                theme: "default"
            }
        }
    }, {}],
    8: [function (t, e, i) {
        "use strict";
        var n = t("../lib/helper"), r = t("../lib/dom"), o = t("./instances");
        e.exports = function (t) {
            var e = o.get(t);
            e && (e.event.unbindAll(), r.remove(e.scrollbarX), r.remove(e.scrollbarY), r.remove(e.scrollbarXRail), r.remove(e.scrollbarYRail), n.removePsClasses(t), o.remove(t))
        }
    }, {"../lib/dom": 2, "../lib/helper": 5, "./instances": 17}],
    9: [function (t, e, i) {
        "use strict";
        var n = t("../instances"), r = t("../update-geometry"), o = t("../update-scroll");
        e.exports = function (t) {
            !function (t, e) {
                function i(t) {
                    return t.getBoundingClientRect()
                }

                var n = function (t) {
                    t.stopPropagation()
                };
                e.event.bind(e.scrollbarY, "click", n), e.event.bind(e.scrollbarYRail, "click", (function (n) {
                    var s = n.pageY - window.pageYOffset - i(e.scrollbarYRail).top > e.scrollbarYTop ? 1 : -1;
                    o(t, "top", t.scrollTop + s * e.containerHeight), r(t), n.stopPropagation()
                })), e.event.bind(e.scrollbarX, "click", n), e.event.bind(e.scrollbarXRail, "click", (function (n) {
                    var s = n.pageX - window.pageXOffset - i(e.scrollbarXRail).left > e.scrollbarXLeft ? 1 : -1;
                    o(t, "left", t.scrollLeft + s * e.containerWidth), r(t), n.stopPropagation()
                }))
            }(t, n.get(t))
        }
    }, {"../instances": 17, "../update-geometry": 18, "../update-scroll": 19}],
    10: [function (t, e, i) {
        "use strict";
        var n = t("../../lib/helper"), r = t("../../lib/dom"), o = t("../instances"), s = t("../update-geometry"),
            a = t("../update-scroll");
        e.exports = function (t) {
            var e = o.get(t);
            (function (t, e) {
                function i(i) {
                    var r = o + i * e.railXRatio,
                        s = Math.max(0, e.scrollbarXRail.getBoundingClientRect().left) + e.railXRatio * (e.railXWidth - e.scrollbarXWidth);
                    e.scrollbarXLeft = r < 0 ? 0 : r > s ? s : r;
                    var c = n.toInt(e.scrollbarXLeft * (e.contentWidth - e.containerWidth) / (e.containerWidth - e.railXRatio * e.scrollbarXWidth)) - e.negativeScrollAdjustment;
                    a(t, "left", c)
                }

                var o = null, c = null, l = function (e) {
                    i(e.pageX - c), s(t), e.stopPropagation(), e.preventDefault()
                }, h = function () {
                    n.stopScrolling(t, "x"), e.event.unbind(e.ownerDocument, "mousemove", l)
                };
                e.event.bind(e.scrollbarX, "mousedown", (function (i) {
                    c = i.pageX, o = n.toInt(r.css(e.scrollbarX, "left")) * e.railXRatio, n.startScrolling(t, "x"), e.event.bind(e.ownerDocument, "mousemove", l), e.event.once(e.ownerDocument, "mouseup", h), i.stopPropagation(), i.preventDefault()
                }))
            })(t, e), function (t, e) {
                function i(i) {
                    var r = o + i * e.railYRatio,
                        s = Math.max(0, e.scrollbarYRail.getBoundingClientRect().top) + e.railYRatio * (e.railYHeight - e.scrollbarYHeight);
                    e.scrollbarYTop = r < 0 ? 0 : r > s ? s : r;
                    var c = n.toInt(e.scrollbarYTop * (e.contentHeight - e.containerHeight) / (e.containerHeight - e.railYRatio * e.scrollbarYHeight));
                    a(t, "top", c)
                }

                var o = null, c = null, l = function (e) {
                    i(e.pageY - c), s(t), e.stopPropagation(), e.preventDefault()
                }, h = function () {
                    n.stopScrolling(t, "y"), e.event.unbind(e.ownerDocument, "mousemove", l)
                };
                e.event.bind(e.scrollbarY, "mousedown", (function (i) {
                    c = i.pageY, o = n.toInt(r.css(e.scrollbarY, "top")) * e.railYRatio, n.startScrolling(t, "y"), e.event.bind(e.ownerDocument, "mousemove", l), e.event.once(e.ownerDocument, "mouseup", h), i.stopPropagation(), i.preventDefault()
                }))
            }(t, e)
        }
    }, {
        "../../lib/dom": 2,
        "../../lib/helper": 5,
        "../instances": 17,
        "../update-geometry": 18,
        "../update-scroll": 19
    }],
    11: [function (t, e, i) {
        "use strict";

        function n(t, e) {
            var i = !1;
            e.event.bind(t, "mouseenter", (function () {
                i = !0
            })), e.event.bind(t, "mouseleave", (function () {
                i = !1
            }));
            var n = !1;
            e.event.bind(e.ownerDocument, "keydown", (function (s) {
                if (!(s.isDefaultPrevented && s.isDefaultPrevented() || s.defaultPrevented)) {
                    var l = o.matches(e.scrollbarX, ":focus") || o.matches(e.scrollbarY, ":focus");
                    if (i || l) {
                        var h = document.activeElement ? document.activeElement : e.ownerDocument.activeElement;
                        if (h) {
                            if ("IFRAME" === h.tagName) h = h.contentDocument.activeElement; else for (; h.shadowRoot;) h = h.shadowRoot.activeElement;
                            if (r.isEditable(h)) return
                        }
                        var u = 0, f = 0;
                        switch (s.which) {
                            case 37:
                                u = s.metaKey ? -e.contentWidth : s.altKey ? -e.containerWidth : -30;
                                break;
                            case 38:
                                f = s.metaKey ? e.contentHeight : s.altKey ? e.containerHeight : 30;
                                break;
                            case 39:
                                u = s.metaKey ? e.contentWidth : s.altKey ? e.containerWidth : 30;
                                break;
                            case 40:
                                f = s.metaKey ? -e.contentHeight : s.altKey ? -e.containerHeight : -30;
                                break;
                            case 33:
                                f = 90;
                                break;
                            case 32:
                                f = s.shiftKey ? 90 : -90;
                                break;
                            case 34:
                                f = -90;
                                break;
                            case 35:
                                f = s.ctrlKey ? -e.contentHeight : -e.containerHeight;
                                break;
                            case 36:
                                f = s.ctrlKey ? t.scrollTop : e.containerHeight;
                                break;
                            default:
                                return
                        }
                        c(t, "top", t.scrollTop - f), c(t, "left", t.scrollLeft + u), a(t), n = function (i, n) {
                            var r = t.scrollTop;
                            if (0 === i) {
                                if (!e.scrollbarYActive) return !1;
                                if (0 === r && n > 0 || r >= e.contentHeight - e.containerHeight && n < 0) return !e.settings.wheelPropagation
                            }
                            var o = t.scrollLeft;
                            if (0 === n) {
                                if (!e.scrollbarXActive) return !1;
                                if (0 === o && i < 0 || o >= e.contentWidth - e.containerWidth && i > 0) return !e.settings.wheelPropagation
                            }
                            return !0
                        }(u, f), n && s.preventDefault()
                    }
                }
            }))
        }

        var r = t("../../lib/helper"), o = t("../../lib/dom"), s = t("../instances"), a = t("../update-geometry"),
            c = t("../update-scroll");
        e.exports = function (t) {
            n(t, s.get(t))
        }
    }, {
        "../../lib/dom": 2,
        "../../lib/helper": 5,
        "../instances": 17,
        "../update-geometry": 18,
        "../update-scroll": 19
    }],
    12: [function (t, e, i) {
        "use strict";

        function n(t, e) {
            function i(i) {
                if (!i.ctrlKey && !i.metaKey) {
                    var r = function (t) {
                        var e = t.deltaX, i = -1 * t.deltaY;
                        return void 0 !== e && void 0 !== i || (e = -1 * t.wheelDeltaX / 6, i = t.wheelDeltaY / 6), t.deltaMode && 1 === t.deltaMode && (e *= 10, i *= 10), e != e && i != i && (e = 0, i = t.wheelDelta), t.shiftKey ? [-i, -e] : [e, i]
                    }(i), a = r[0], c = r[1];
                    (function (e, i) {
                        var n = t.querySelector("textarea:hover, select[multiple]:hover, .ps-child:hover");
                        if (n) {
                            var r = window.getComputedStyle(n);
                            if (![r.overflow, r.overflowX, r.overflowY].join("").match(/(scroll|auto)/)) return !1;
                            var o = n.scrollHeight - n.clientHeight;
                            if (o > 0 && !(0 === n.scrollTop && i > 0 || n.scrollTop === o && i < 0)) return !0;
                            var s = n.scrollLeft - n.clientWidth;
                            if (s > 0 && !(0 === n.scrollLeft && e < 0 || n.scrollLeft === s && e > 0)) return !0
                        }
                        return !1
                    })(a, c) || (n = !1, e.settings.useBothWheelAxes ? e.scrollbarYActive && !e.scrollbarXActive ? (s(t, "top", c ? t.scrollTop - c * e.settings.wheelSpeed : t.scrollTop + a * e.settings.wheelSpeed), n = !0) : e.scrollbarXActive && !e.scrollbarYActive && (s(t, "left", a ? t.scrollLeft + a * e.settings.wheelSpeed : t.scrollLeft - c * e.settings.wheelSpeed), n = !0) : (s(t, "top", t.scrollTop - c * e.settings.wheelSpeed), s(t, "left", t.scrollLeft + a * e.settings.wheelSpeed)), o(t), n = n || function (i, n) {
                        var r = t.scrollTop;
                        if (0 === i) {
                            if (!e.scrollbarYActive) return !1;
                            if (0 === r && n > 0 || r >= e.contentHeight - e.containerHeight && n < 0) return !e.settings.wheelPropagation
                        }
                        var o = t.scrollLeft;
                        if (0 === n) {
                            if (!e.scrollbarXActive) return !1;
                            if (0 === o && i < 0 || o >= e.contentWidth - e.containerWidth && i > 0) return !e.settings.wheelPropagation
                        }
                        return !0
                    }(a, c), n && (i.stopPropagation(), i.preventDefault()))
                }
            }

            var n = !1;
            void 0 !== window.onwheel ? e.event.bind(t, "wheel", i) : void 0 !== window.onmousewheel && e.event.bind(t, "mousewheel", i)
        }

        var r = t("../instances"), o = t("../update-geometry"), s = t("../update-scroll");
        e.exports = function (t) {
            n(t, r.get(t))
        }
    }, {"../instances": 17, "../update-geometry": 18, "../update-scroll": 19}],
    13: [function (t, e, i) {
        "use strict";
        var n = t("../instances"), r = t("../update-geometry");
        e.exports = function (t) {
            !function (t, e) {
                e.event.bind(t, "scroll", (function () {
                    r(t)
                }))
            }(t, n.get(t))
        }
    }, {"../instances": 17, "../update-geometry": 18}],
    14: [function (t, e, i) {
        "use strict";

        function n(t, e) {
            function i() {
                c || (c = setInterval((function () {
                    return o.get(t) ? (a(t, "top", t.scrollTop + l.top), a(t, "left", t.scrollLeft + l.left), void s(t)) : void clearInterval(c)
                }), 50))
            }

            function n() {
                c && (clearInterval(c), c = null), r.stopScrolling(t)
            }

            var c = null, l = {top: 0, left: 0}, h = !1;
            e.event.bind(e.ownerDocument, "selectionchange", (function () {
                t.contains(function () {
                    var t = window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : "";
                    return 0 === t.toString().length ? null : t.getRangeAt(0).commonAncestorContainer
                }()) ? h = !0 : (h = !1, n())
            })), e.event.bind(window, "mouseup", (function () {
                h && (h = !1, n())
            })), e.event.bind(window, "keyup", (function () {
                h && (h = !1, n())
            })), e.event.bind(window, "mousemove", (function (e) {
                if (h) {
                    var o = {x: e.pageX, y: e.pageY}, s = {
                        left: t.offsetLeft,
                        right: t.offsetLeft + t.offsetWidth,
                        top: t.offsetTop,
                        bottom: t.offsetTop + t.offsetHeight
                    };
                    o.x < s.left + 3 ? (l.left = -5, r.startScrolling(t, "x")) : o.x > s.right - 3 ? (l.left = 5, r.startScrolling(t, "x")) : l.left = 0, o.y < s.top + 3 ? (l.top = s.top + 3 - o.y < 5 ? -5 : -20, r.startScrolling(t, "y")) : o.y > s.bottom - 3 ? (l.top = o.y - s.bottom + 3 < 5 ? 5 : 20, r.startScrolling(t, "y")) : l.top = 0, 0 === l.top && 0 === l.left ? n() : i()
                }
            }))
        }

        var r = t("../../lib/helper"), o = t("../instances"), s = t("../update-geometry"), a = t("../update-scroll");
        e.exports = function (t) {
            n(t, o.get(t))
        }
    }, {"../../lib/helper": 5, "../instances": 17, "../update-geometry": 18, "../update-scroll": 19}],
    15: [function (t, e, i) {
        "use strict";
        var n = t("../../lib/helper"), r = t("../instances"), o = t("../update-geometry"), s = t("../update-scroll");
        e.exports = function (t) {
            (n.env.supportsTouch || n.env.supportsIePointer) && function (t, e, i, n) {
                function a(i, n) {
                    var r = t.scrollTop, o = t.scrollLeft, s = Math.abs(i), a = Math.abs(n);
                    if (a > s) {
                        if (n < 0 && r === e.contentHeight - e.containerHeight || n > 0 && 0 === r) return !e.settings.swipePropagation
                    } else if (s > a && (i < 0 && o === e.contentWidth - e.containerWidth || i > 0 && 0 === o)) return !e.settings.swipePropagation;
                    return !0
                }

                function c(e, i) {
                    s(t, "top", t.scrollTop - i), s(t, "left", t.scrollLeft - e), o(t)
                }

                function l() {
                    y = !0
                }

                function h() {
                    y = !1
                }

                function u(t) {
                    return t.targetTouches ? t.targetTouches[0] : t
                }

                function f(t) {
                    return !(t.pointerType && "pen" === t.pointerType && 0 === t.buttons || (!t.targetTouches || 1 !== t.targetTouches.length) && (!t.pointerType || "mouse" === t.pointerType || t.pointerType === t.MSPOINTER_TYPE_MOUSE))
                }

                function d(t) {
                    if (f(t)) {
                        x = !0;
                        var e = u(t);
                        v.pageX = e.pageX, v.pageY = e.pageY, m = (new Date).getTime(), null !== b && clearInterval(b), t.stopPropagation()
                    }
                }

                function p(t) {
                    if (!x && e.settings.swipePropagation && d(t), !y && x && f(t)) {
                        var i = u(t), n = {pageX: i.pageX, pageY: i.pageY}, r = n.pageX - v.pageX,
                            o = n.pageY - v.pageY;
                        c(r, o), v = n;
                        var s = (new Date).getTime(), l = s - m;
                        l > 0 && (_.x = r / l, _.y = o / l, m = s), a(r, o) && (t.stopPropagation(), t.preventDefault())
                    }
                }

                function g() {
                    !y && x && (x = !1, e.settings.swipeEasing && (clearInterval(b), b = setInterval((function () {
                        return r.get(t) && (_.x || _.y) ? Math.abs(_.x) < .01 && Math.abs(_.y) < .01 ? void clearInterval(b) : (c(30 * _.x, 30 * _.y), _.x *= .8, void (_.y *= .8)) : void clearInterval(b)
                    }), 10)))
                }

                var v = {}, m = 0, _ = {}, b = null, y = !1, x = !1;
                i ? (e.event.bind(window, "touchstart", l), e.event.bind(window, "touchend", h), e.event.bind(t, "touchstart", d), e.event.bind(t, "touchmove", p), e.event.bind(t, "touchend", g)) : n && (window.PointerEvent ? (e.event.bind(window, "pointerdown", l), e.event.bind(window, "pointerup", h), e.event.bind(t, "pointerdown", d), e.event.bind(t, "pointermove", p), e.event.bind(t, "pointerup", g)) : window.MSPointerEvent && (e.event.bind(window, "MSPointerDown", l), e.event.bind(window, "MSPointerUp", h), e.event.bind(t, "MSPointerDown", d), e.event.bind(t, "MSPointerMove", p), e.event.bind(t, "MSPointerUp", g)))
            }(t, r.get(t), n.env.supportsTouch, n.env.supportsIePointer)
        }
    }, {"../../lib/helper": 5, "../instances": 17, "../update-geometry": 18, "../update-scroll": 19}],
    16: [function (t, e, i) {
        "use strict";
        var n = t("./instances"), r = t("./update-geometry"), o = {
            "click-rail": t("./handler/click-rail"),
            "drag-scrollbar": t("./handler/drag-scrollbar"),
            keyboard: t("./handler/keyboard"),
            wheel: t("./handler/mouse-wheel"),
            touch: t("./handler/touch"),
            selection: t("./handler/selection")
        }, s = t("./handler/native-scroll");
        e.exports = function (t, e) {
            t.classList.add("ps");
            var i = n.add(t, "object" == typeof e ? e : {});
            t.classList.add("ps--theme_" + i.settings.theme), i.settings.handlers.forEach((function (e) {
                o[e](t)
            })), s(t), r(t)
        }
    }, {
        "./handler/click-rail": 9,
        "./handler/drag-scrollbar": 10,
        "./handler/keyboard": 11,
        "./handler/mouse-wheel": 12,
        "./handler/native-scroll": 13,
        "./handler/selection": 14,
        "./handler/touch": 15,
        "./instances": 17,
        "./update-geometry": 18
    }],
    17: [function (t, e, i) {
        "use strict";

        function n(t, e) {
            function i() {
                t.classList.add("ps--focus")
            }

            function n() {
                t.classList.remove("ps--focus")
            }

            var r = this;
            for (var l in r.settings = s(), e) r.settings[l] = e[l];
            r.containerWidth = null, r.containerHeight = null, r.contentWidth = null, r.contentHeight = null, r.isRtl = "rtl" === a.css(t, "direction"), r.isNegativeScroll = function () {
                var e, i = t.scrollLeft;
                return t.scrollLeft = -1, e = t.scrollLeft < 0, t.scrollLeft = i, e
            }(), r.negativeScrollAdjustment = r.isNegativeScroll ? t.scrollWidth - t.clientWidth : 0, r.event = new c, r.ownerDocument = t.ownerDocument || document, r.scrollbarXRail = a.appendTo(a.create("div", "ps__scrollbar-x-rail"), t), r.scrollbarX = a.appendTo(a.create("div", "ps__scrollbar-x"), r.scrollbarXRail), r.scrollbarX.setAttribute("tabindex", 0), r.event.bind(r.scrollbarX, "focus", i), r.event.bind(r.scrollbarX, "blur", n), r.scrollbarXActive = null, r.scrollbarXWidth = null, r.scrollbarXLeft = null, r.scrollbarXBottom = o.toInt(a.css(r.scrollbarXRail, "bottom")), r.isScrollbarXUsingBottom = r.scrollbarXBottom == r.scrollbarXBottom, r.scrollbarXTop = r.isScrollbarXUsingBottom ? null : o.toInt(a.css(r.scrollbarXRail, "top")), r.railBorderXWidth = o.toInt(a.css(r.scrollbarXRail, "borderLeftWidth")) + o.toInt(a.css(r.scrollbarXRail, "borderRightWidth")), a.css(r.scrollbarXRail, "display", "block"), r.railXMarginWidth = o.toInt(a.css(r.scrollbarXRail, "marginLeft")) + o.toInt(a.css(r.scrollbarXRail, "marginRight")), a.css(r.scrollbarXRail, "display", ""), r.railXWidth = null, r.railXRatio = null, r.scrollbarYRail = a.appendTo(a.create("div", "ps__scrollbar-y-rail"), t), r.scrollbarY = a.appendTo(a.create("div", "ps__scrollbar-y"), r.scrollbarYRail), r.scrollbarY.setAttribute("tabindex", 0), r.event.bind(r.scrollbarY, "focus", i), r.event.bind(r.scrollbarY, "blur", n), r.scrollbarYActive = null, r.scrollbarYHeight = null, r.scrollbarYTop = null, r.scrollbarYRight = o.toInt(a.css(r.scrollbarYRail, "right")), r.isScrollbarYUsingRight = r.scrollbarYRight == r.scrollbarYRight, r.scrollbarYLeft = r.isScrollbarYUsingRight ? null : o.toInt(a.css(r.scrollbarYRail, "left")), r.scrollbarYOuterWidth = r.isRtl ? o.outerWidth(r.scrollbarY) : null, r.railBorderYWidth = o.toInt(a.css(r.scrollbarYRail, "borderTopWidth")) + o.toInt(a.css(r.scrollbarYRail, "borderBottomWidth")), a.css(r.scrollbarYRail, "display", "block"), r.railYMarginHeight = o.toInt(a.css(r.scrollbarYRail, "marginTop")) + o.toInt(a.css(r.scrollbarYRail, "marginBottom")), a.css(r.scrollbarYRail, "display", ""), r.railYHeight = null, r.railYRatio = null
        }

        function r(t) {
            return t.getAttribute("data-ps-id")
        }

        var o = t("../lib/helper"), s = t("./default-setting"), a = t("../lib/dom"), c = t("../lib/event-manager"),
            l = t("../lib/guid"), h = {};
        i.add = function (t, e) {
            var i = l();
            return function (t, e) {
                t.setAttribute("data-ps-id", e)
            }(t, i), h[i] = new n(t, e), h[i]
        }, i.remove = function (t) {
            delete h[r(t)], function (t) {
                t.removeAttribute("data-ps-id")
            }(t)
        }, i.get = function (t) {
            return h[r(t)]
        }
    }, {"../lib/dom": 2, "../lib/event-manager": 3, "../lib/guid": 4, "../lib/helper": 5, "./default-setting": 7}],
    18: [function (t, e, i) {
        "use strict";

        function n(t, e) {
            return t.settings.minScrollbarLength && (e = Math.max(e, t.settings.minScrollbarLength)), t.settings.maxScrollbarLength && (e = Math.min(e, t.settings.maxScrollbarLength)), e
        }

        var r = t("../lib/helper"), o = t("../lib/dom"), s = t("./instances"), a = t("./update-scroll");
        e.exports = function (t) {
            var e, i = s.get(t);
            i.containerWidth = t.clientWidth, i.containerHeight = t.clientHeight, i.contentWidth = t.scrollWidth, i.contentHeight = t.scrollHeight, t.contains(i.scrollbarXRail) || ((e = o.queryChildren(t, ".ps__scrollbar-x-rail")).length > 0 && e.forEach((function (t) {
                o.remove(t)
            })), o.appendTo(i.scrollbarXRail, t)), t.contains(i.scrollbarYRail) || ((e = o.queryChildren(t, ".ps__scrollbar-y-rail")).length > 0 && e.forEach((function (t) {
                o.remove(t)
            })), o.appendTo(i.scrollbarYRail, t)), !i.settings.suppressScrollX && i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth ? (i.scrollbarXActive = !0, i.railXWidth = i.containerWidth - i.railXMarginWidth, i.railXRatio = i.containerWidth / i.railXWidth, i.scrollbarXWidth = n(i, r.toInt(i.railXWidth * i.containerWidth / i.contentWidth)), i.scrollbarXLeft = r.toInt((i.negativeScrollAdjustment + t.scrollLeft) * (i.railXWidth - i.scrollbarXWidth) / (i.contentWidth - i.containerWidth))) : i.scrollbarXActive = !1, !i.settings.suppressScrollY && i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight ? (i.scrollbarYActive = !0, i.railYHeight = i.containerHeight - i.railYMarginHeight, i.railYRatio = i.containerHeight / i.railYHeight, i.scrollbarYHeight = n(i, r.toInt(i.railYHeight * i.containerHeight / i.contentHeight)), i.scrollbarYTop = r.toInt(t.scrollTop * (i.railYHeight - i.scrollbarYHeight) / (i.contentHeight - i.containerHeight))) : i.scrollbarYActive = !1, i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth && (i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth), i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight && (i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight), function (t, e) {
                var i = {width: e.railXWidth};
                e.isRtl ? i.left = e.negativeScrollAdjustment + t.scrollLeft + e.containerWidth - e.contentWidth : i.left = t.scrollLeft, e.isScrollbarXUsingBottom ? i.bottom = e.scrollbarXBottom - t.scrollTop : i.top = e.scrollbarXTop + t.scrollTop, o.css(e.scrollbarXRail, i);
                var n = {top: t.scrollTop, height: e.railYHeight};
                e.isScrollbarYUsingRight ? e.isRtl ? n.right = e.contentWidth - (e.negativeScrollAdjustment + t.scrollLeft) - e.scrollbarYRight - e.scrollbarYOuterWidth : n.right = e.scrollbarYRight - t.scrollLeft : e.isRtl ? n.left = e.negativeScrollAdjustment + t.scrollLeft + 2 * e.containerWidth - e.contentWidth - e.scrollbarYLeft - e.scrollbarYOuterWidth : n.left = e.scrollbarYLeft + t.scrollLeft, o.css(e.scrollbarYRail, n), o.css(e.scrollbarX, {
                    left: e.scrollbarXLeft,
                    width: e.scrollbarXWidth - e.railBorderXWidth
                }), o.css(e.scrollbarY, {top: e.scrollbarYTop, height: e.scrollbarYHeight - e.railBorderYWidth})
            }(t, i), i.scrollbarXActive ? t.classList.add("ps--active-x") : (t.classList.remove("ps--active-x"), i.scrollbarXWidth = 0, i.scrollbarXLeft = 0, a(t, "left", 0)), i.scrollbarYActive ? t.classList.add("ps--active-y") : (t.classList.remove("ps--active-y"), i.scrollbarYHeight = 0, i.scrollbarYTop = 0, a(t, "top", 0))
        }
    }, {"../lib/dom": 2, "../lib/helper": 5, "./instances": 17, "./update-scroll": 19}],
    19: [function (t, e, i) {
        "use strict";
        var n = t("./instances"), r = function (t) {
            var e = document.createEvent("Event");
            return e.initEvent(t, !0, !0), e
        };
        e.exports = function (t, e, i) {
            if (void 0 === t) throw "You must provide an element to the update-scroll function";
            if (void 0 === e) throw "You must provide an axis to the update-scroll function";
            if (void 0 === i) throw "You must provide a value to the update-scroll function";
            "top" === e && i <= 0 && (t.scrollTop = i = 0, t.dispatchEvent(r("ps-y-reach-start"))), "left" === e && i <= 0 && (t.scrollLeft = i = 0, t.dispatchEvent(r("ps-x-reach-start")));
            var o = n.get(t);
            "top" === e && i >= o.contentHeight - o.containerHeight && ((i = o.contentHeight - o.containerHeight) - t.scrollTop <= 2 ? i = t.scrollTop : t.scrollTop = i, t.dispatchEvent(r("ps-y-reach-end"))), "left" === e && i >= o.contentWidth - o.containerWidth && ((i = o.contentWidth - o.containerWidth) - t.scrollLeft <= 2 ? i = t.scrollLeft : t.scrollLeft = i, t.dispatchEvent(r("ps-x-reach-end"))), void 0 === o.lastTop && (o.lastTop = t.scrollTop), void 0 === o.lastLeft && (o.lastLeft = t.scrollLeft), "top" === e && i < o.lastTop && t.dispatchEvent(r("ps-scroll-up")), "top" === e && i > o.lastTop && t.dispatchEvent(r("ps-scroll-down")), "left" === e && i < o.lastLeft && t.dispatchEvent(r("ps-scroll-left")), "left" === e && i > o.lastLeft && t.dispatchEvent(r("ps-scroll-right")), "top" === e && i !== o.lastTop && (t.scrollTop = o.lastTop = i, t.dispatchEvent(r("ps-scroll-y"))), "left" === e && i !== o.lastLeft && (t.scrollLeft = o.lastLeft = i, t.dispatchEvent(r("ps-scroll-x")))
        }
    }, {"./instances": 17}],
    20: [function (t, e, i) {
        "use strict";
        var n = t("../lib/helper"), r = t("../lib/dom"), o = t("./instances"), s = t("./update-geometry"),
            a = t("./update-scroll");
        e.exports = function (t) {
            var e = o.get(t);
            e && (e.negativeScrollAdjustment = e.isNegativeScroll ? t.scrollWidth - t.clientWidth : 0, r.css(e.scrollbarXRail, "display", "block"), r.css(e.scrollbarYRail, "display", "block"), e.railXMarginWidth = n.toInt(r.css(e.scrollbarXRail, "marginLeft")) + n.toInt(r.css(e.scrollbarXRail, "marginRight")), e.railYMarginHeight = n.toInt(r.css(e.scrollbarYRail, "marginTop")) + n.toInt(r.css(e.scrollbarYRail, "marginBottom")), r.css(e.scrollbarXRail, "display", "none"), r.css(e.scrollbarYRail, "display", "none"), s(t), a(t, "top", t.scrollTop), a(t, "left", t.scrollLeft), r.css(e.scrollbarXRail, "display", ""), r.css(e.scrollbarYRail, "display", ""))
        }
    }, {"../lib/dom": 2, "../lib/helper": 5, "./instances": 17, "./update-geometry": 18, "./update-scroll": 19}]
}, {}, [1]),function (t, e) {
    "use strict";
    t.module("angularSpectrumColorpicker", []).directive("spectrumColorpicker", (function () {
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                fallbackValue: "=",
                disabled: "=?",
                format: "=?",
                options: "=?",
                triggerId: "@?",
                palette: "=?",
                onChange: "&?",
                onShow: "&?",
                onHide: "&?",
                onMove: "&?",
                onBeforeShow: "&?",
                onChangeOptions: "=?",
                onShowOptions: "=?",
                onHideOptions: "=?",
                onMoveOptions: "=?"
            },
            replace: !0,
            templateUrl: "directive.html",
            link: function (e, i, n, r) {
                function o(t) {
                    var i = t;
                    return i && (i = t.toString(e.format)), i
                }

                function s(i) {
                    t.isFunction(e.onChange) && e.onChange({color: i})
                }

                function a(i) {
                    var n = e.fallbackValue;
                    i ? n = o(i) : t.isUndefined(e.fallbackValue) && (n = i), r.$setViewValue(n), s(n)
                }

                var c = i.find("input"), l = function () {
                    return c.spectrum("toggle"), !1
                }, h = {color: r.$viewValue}, u = {};
                t.forEach({change: "onChange", move: "onMove", hide: "onHide", show: "onShow"}, (function (i, n) {
                    var r = e[i + "Options"];
                    u[n] = function (n) {
                        return (!r || r.update) && function (t) {
                            e.$evalAsync((function () {
                                a(t)
                            }))
                        }(n), "change" !== i && t.isFunction(e[i]) ? e[i]({color: o(n)}) : null
                    }
                })), t.isFunction(e.onBeforeShow) && (u.beforeShow = function (t) {
                    return e.onBeforeShow({color: o(t)})
                }), e.palette && (u.palette = e.palette);
                var f = t.extend({}, h, e.options, u);
                e.triggerId && t.element(document.body).on("click", "#" + e.triggerId, l), r.$render = function () {
                    c.spectrum("set", r.$viewValue || ""), s(r.$viewValue)
                }, f.color && (c.spectrum("set", f.color || ""), a(f.color)), c.spectrum(f), e.$on("$destroy", (function () {
                    e.triggerId && t.element(document.body).off("click", "#" + e.triggerId, l)
                })), i.on("$destroy", (function () {
                    c.spectrum("destroy")
                })), t.isDefined(f.disabled) && (e.disabled = !!f.disabled), e.$watch("disabled", (function (t) {
                    c.spectrum(t ? "disable" : "enable")
                })), e.$watch("palette", (function (t) {
                    c.spectrum("option", "palette", t)
                }), !0)
            }
        }
    })), t.module("angularSpectrumColorpicker").run(["$templateCache", function (t) {
        t.put("directive.html", '<span><input class="input-small"></span>')
    }])
}(window.angular),
function (t) {
    function e(t, e) {
        if (!(t.originalEvent.touches.length > 1)) {
            t.preventDefault();
            var i = t.originalEvent.changedTouches[0], n = document.createEvent("MouseEvents");
            n.initMouseEvent(e, !0, !0, window, 1, i.screenX, i.screenY, i.clientX, i.clientY, !1, !1, !1, !1, 0, null), t.target.dispatchEvent(n)
        }
    }

    if (t.support.touch = "ontouchend" in document, t.support.touch) {
        var i, n = t.ui.mouse.prototype, r = n._mouseInit, o = n._mouseDestroy;
        n._touchStart = function (t) {
            !i && this._mouseCapture(t.originalEvent.changedTouches[0]) && (i = !0, this._touchMoved = !1, e(t, "mouseover"), e(t, "mousemove"), e(t, "mousedown"))
        }, n._touchMove = function (t) {
            i && (this._touchMoved = !0, e(t, "mousemove"))
        }, n._touchEnd = function (t) {
            i && (e(t, "mouseup"), e(t, "mouseout"), this._touchMoved || e(t, "click"), i = !1)
        }, n._mouseInit = function () {
            var e = this;
            e.element.bind({
                touchstart: t.proxy(e, "_touchStart"),
                touchmove: t.proxy(e, "_touchMove"),
                touchend: t.proxy(e, "_touchEnd")
            }), r.call(e)
        }, n._mouseDestroy = function () {
            var e = this;
            e.element.unbind({
                touchstart: t.proxy(e, "_touchStart"),
                touchmove: t.proxy(e, "_touchMove"),
                touchend: t.proxy(e, "_touchEnd")
            }), o.call(e)
        }
    }
}(jQuery),
function () {
    function t(t, e, i) {
        switch (i.length) {
            case 0:
                return t.call(e);
            case 1:
                return t.call(e, i[0]);
            case 2:
                return t.call(e, i[0], i[1]);
            case 3:
                return t.call(e, i[0], i[1], i[2])
        }
        return t.apply(e, i)
    }

    function e(t, e, i, n) {
        for (var r = -1, o = null == t ? 0 : t.length; ++r < o;) {
            var s = t[r];
            e(n, s, i(s), t)
        }
        return n
    }

    function i(t, e) {
        for (var i = -1, n = null == t ? 0 : t.length; ++i < n && !1 !== e(t[i], i, t);) ;
        return t
    }

    function n(t, e) {
        for (var i = null == t ? 0 : t.length; i-- && !1 !== e(t[i], i, t);) ;
        return t
    }

    function r(t, e) {
        for (var i = -1, n = null == t ? 0 : t.length; ++i < n;) if (!e(t[i], i, t)) return !1;
        return !0
    }

    function o(t, e) {
        for (var i = -1, n = null == t ? 0 : t.length, r = 0, o = []; ++i < n;) {
            var s = t[i];
            e(s, i, t) && (o[r++] = s)
        }
        return o
    }

    function s(t, e) {
        return !(null == t || !t.length) && -1 < g(t, e, 0)
    }

    function a(t, e, i) {
        for (var n = -1, r = null == t ? 0 : t.length; ++n < r;) if (i(e, t[n])) return !0;
        return !1
    }

    function c(t, e) {
        for (var i = -1, n = null == t ? 0 : t.length, r = Array(n); ++i < n;) r[i] = e(t[i], i, t);
        return r
    }

    function l(t, e) {
        for (var i = -1, n = e.length, r = t.length; ++i < n;) t[r + i] = e[i];
        return t
    }

    function h(t, e, i, n) {
        var r = -1, o = null == t ? 0 : t.length;
        for (n && o && (i = t[++r]); ++r < o;) i = e(i, t[r], r, t);
        return i
    }

    function u(t, e, i, n) {
        var r = null == t ? 0 : t.length;
        for (n && r && (i = t[--r]); r--;) i = e(i, t[r], r, t);
        return i
    }

    function f(t, e) {
        for (var i = -1, n = null == t ? 0 : t.length; ++i < n;) if (e(t[i], i, t)) return !0;
        return !1
    }

    function d(t, e, i) {
        var n;
        return i(t, (function (t, i, r) {
            if (e(t, i, r)) return n = i, !1
        })), n
    }

    function p(t, e, i, n) {
        var r = t.length;
        for (i += n ? 1 : -1; n ? i-- : ++i < r;) if (e(t[i], i, t)) return i;
        return -1
    }

    function g(t, e, i) {
        if (e == e) t:{
            --i;
            for (var n = t.length; ++i < n;) if (t[i] === e) {
                t = i;
                break t
            }
            t = -1
        } else t = p(t, m, i);
        return t
    }

    function v(t, e, i, n) {
        --i;
        for (var r = t.length; ++i < r;) if (n(t[i], e)) return i;
        return -1
    }

    function m(t) {
        return t != t
    }

    function _(t, e) {
        var i = null == t ? 0 : t.length;
        return i ? w(t, e) / i : B
    }

    function b(t) {
        return function (e) {
            return null == e ? F : e[t]
        }
    }

    function y(t) {
        return function (e) {
            return null == t ? F : t[e]
        }
    }

    function x(t, e, i, n, r) {
        return r(t, (function (t, r, o) {
            i = n ? (n = !1, t) : e(i, t, r, o)
        })), i
    }

    function w(t, e) {
        for (var i, n = -1, r = t.length; ++n < r;) {
            var o = e(t[n]);
            o !== F && (i = i === F ? o : i + o)
        }
        return i
    }

    function C(t, e) {
        for (var i = -1, n = Array(t); ++i < t;) n[i] = e(i);
        return n
    }

    function S(t) {
        return function (e) {
            return t(e)
        }
    }

    function T(t, e) {
        return c(e, (function (e) {
            return t[e]
        }))
    }

    function O(t, e) {
        return t.has(e)
    }

    function E(t, e) {
        for (var i = -1, n = t.length; ++i < n && -1 < g(e, t[i], 0);) ;
        return i
    }

    function k(t, e) {
        for (var i = t.length; i-- && -1 < g(e, t[i], 0);) ;
        return i
    }

    function P(t) {
        return "\\" + jt[t]
    }

    function j(t) {
        var e = -1, i = Array(t.size);
        return t.forEach((function (t, n) {
            i[++e] = [n, t]
        })), i
    }

    function A(t, e) {
        return function (i) {
            return t(e(i))
        }
    }

    function M(t, e) {
        for (var i = -1, n = t.length, r = 0, o = []; ++i < n;) {
            var s = t[i];
            s !== e && "__lodash_placeholder__" !== s || (t[i] = "__lodash_placeholder__", o[r++] = i)
        }
        return o
    }

    function D(t) {
        var e = -1, i = Array(t.size);
        return t.forEach((function (t) {
            i[++e] = t
        })), i
    }

    function I(t) {
        if (Tt.test(t)) {
            for (var e = Ct.lastIndex = 0; Ct.test(t);) ++e;
            t = e
        } else t = Vt(t);
        return t
    }

    function L(t) {
        return Tt.test(t) ? t.match(Ct) || [] : t.split("")
    }

    var F, R = 1 / 0, B = NaN,
        z = [["ary", 128], ["bind", 1], ["bindKey", 2], ["curry", 8], ["curryRight", 16], ["flip", 512], ["partial", 32], ["partialRight", 64], ["rearg", 256]],
        X = /\b__p\+='';/g, W = /\b(__p\+=)''\+/g, Y = /(__e\(.*?\)|\b__t\))\+'';/g, H = /&(?:amp|lt|gt|quot|#39);/g,
        U = /[&<>"']/g, N = RegExp(H.source), G = RegExp(U.source), V = /<%-([\s\S]+?)%>/g, $ = /<%([\s\S]+?)%>/g,
        q = /<%=([\s\S]+?)%>/g, K = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, J = /^\w*$/,
        Q = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
        Z = /[\\^$.*+?()[\]{}|]/g, tt = RegExp(Z.source), et = /^\s+|\s+$/g, it = /^\s+/, nt = /\s+$/,
        rt = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, ot = /\{\n\/\* \[wrapped with (.+)\] \*/, st = /,? & /,
        at = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, ct = /\\(\\)?/g, lt = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
        ht = /\w*$/, ut = /^[-+]0x[0-9a-f]+$/i, ft = /^0b[01]+$/i, dt = /^\[object .+?Constructor\]$/,
        pt = /^0o[0-7]+$/i, gt = /^(?:0|[1-9]\d*)$/, vt = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, mt = /($^)/,
        _t = /['\n\r\u2028\u2029\\]/g,
        bt = "[\\ufe0e\\ufe0f]?(?:[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|\\ud83c[\\udffb-\\udfff])?(?:\\u200d(?:[^\\ud800-\\udfff]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff])[\\ufe0e\\ufe0f]?(?:[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|\\ud83c[\\udffb-\\udfff])?)*",
        yt = "(?:[\\u2700-\\u27bf]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff])" + bt,
        xt = RegExp("['’]", "g"), wt = RegExp("[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]", "g"),
        Ct = RegExp("\\ud83c[\\udffb-\\udfff](?=\\ud83c[\\udffb-\\udfff])|(?:[^\\ud800-\\udfff][\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]?|[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\ud800-\\udfff])" + bt, "g"),
        St = RegExp(["[A-Z\\xc0-\\xd6\\xd8-\\xde]?[a-z\\xdf-\\xf6\\xf8-\\xff]+(?:['’](?:d|ll|m|re|s|t|ve))?(?=[\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000]|[A-Z\\xc0-\\xd6\\xd8-\\xde]|$)|(?:[A-Z\\xc0-\\xd6\\xd8-\\xde]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=[\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000]|[A-Z\\xc0-\\xd6\\xd8-\\xde](?:[a-z\\xdf-\\xf6\\xf8-\\xff]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])|$)|[A-Z\\xc0-\\xd6\\xd8-\\xde]?(?:[a-z\\xdf-\\xf6\\xf8-\\xff]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?:['’](?:d|ll|m|re|s|t|ve))?|[A-Z\\xc0-\\xd6\\xd8-\\xde]+(?:['’](?:D|LL|M|RE|S|T|VE))?|\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])|\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])|\\d+", yt].join("|"), "g"),
        Tt = RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]"),
        Ot = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
        Et = "Array Buffer DataView Date Error Float32Array Float64Array Function Int8Array Int16Array Int32Array Map Math Object Promise RegExp Set String Symbol TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array WeakMap _ clearTimeout isFinite parseInt setTimeout".split(" "),
        kt = {};
    kt["[object Float32Array]"] = kt["[object Float64Array]"] = kt["[object Int8Array]"] = kt["[object Int16Array]"] = kt["[object Int32Array]"] = kt["[object Uint8Array]"] = kt["[object Uint8ClampedArray]"] = kt["[object Uint16Array]"] = kt["[object Uint32Array]"] = !0, kt["[object Arguments]"] = kt["[object Array]"] = kt["[object ArrayBuffer]"] = kt["[object Boolean]"] = kt["[object DataView]"] = kt["[object Date]"] = kt["[object Error]"] = kt["[object Function]"] = kt["[object Map]"] = kt["[object Number]"] = kt["[object Object]"] = kt["[object RegExp]"] = kt["[object Set]"] = kt["[object String]"] = kt["[object WeakMap]"] = !1;
    var Pt = {};
    Pt["[object Arguments]"] = Pt["[object Array]"] = Pt["[object ArrayBuffer]"] = Pt["[object DataView]"] = Pt["[object Boolean]"] = Pt["[object Date]"] = Pt["[object Float32Array]"] = Pt["[object Float64Array]"] = Pt["[object Int8Array]"] = Pt["[object Int16Array]"] = Pt["[object Int32Array]"] = Pt["[object Map]"] = Pt["[object Number]"] = Pt["[object Object]"] = Pt["[object RegExp]"] = Pt["[object Set]"] = Pt["[object String]"] = Pt["[object Symbol]"] = Pt["[object Uint8Array]"] = Pt["[object Uint8ClampedArray]"] = Pt["[object Uint16Array]"] = Pt["[object Uint32Array]"] = !0, Pt["[object Error]"] = Pt["[object Function]"] = Pt["[object WeakMap]"] = !1;
    var jt = {"\\": "\\", "'": "'", "\n": "n", "\r": "r", "\u2028": "u2028", "\u2029": "u2029"}, At = parseFloat,
        Mt = parseInt, Dt = "object" == typeof global && global && global.Object === Object && global,
        It = "object" == typeof self && self && self.Object === Object && self,
        Lt = Dt || It || Function("return this")(),
        Ft = "object" == typeof exports && exports && !exports.nodeType && exports,
        Rt = Ft && "object" == typeof module && module && !module.nodeType && module, Bt = Rt && Rt.exports === Ft,
        zt = Bt && Dt.process, Xt = function () {
            try {
                var t = Rt && Rt.f && Rt.f("util").types;
                return t || zt && zt.binding && zt.binding("util")
            } catch (t) {
            }
        }(), Wt = Xt && Xt.isArrayBuffer, Yt = Xt && Xt.isDate, Ht = Xt && Xt.isMap, Ut = Xt && Xt.isRegExp,
        Nt = Xt && Xt.isSet, Gt = Xt && Xt.isTypedArray, Vt = b("length"), $t = y({
            "À": "A",
            "Á": "A",
            "Â": "A",
            "Ã": "A",
            "Ä": "A",
            "Å": "A",
            "à": "a",
            "á": "a",
            "â": "a",
            "ã": "a",
            "ä": "a",
            "å": "a",
            "Ç": "C",
            "ç": "c",
            "Ð": "D",
            "ð": "d",
            "È": "E",
            "É": "E",
            "Ê": "E",
            "Ë": "E",
            "è": "e",
            "é": "e",
            "ê": "e",
            "ë": "e",
            "Ì": "I",
            "Í": "I",
            "Î": "I",
            "Ï": "I",
            "ì": "i",
            "í": "i",
            "î": "i",
            "ï": "i",
            "Ñ": "N",
            "ñ": "n",
            "Ò": "O",
            "Ó": "O",
            "Ô": "O",
            "Õ": "O",
            "Ö": "O",
            "Ø": "O",
            "ò": "o",
            "ó": "o",
            "ô": "o",
            "õ": "o",
            "ö": "o",
            "ø": "o",
            "Ù": "U",
            "Ú": "U",
            "Û": "U",
            "Ü": "U",
            "ù": "u",
            "ú": "u",
            "û": "u",
            "ü": "u",
            "Ý": "Y",
            "ý": "y",
            "ÿ": "y",
            "Æ": "Ae",
            "æ": "ae",
            "Þ": "Th",
            "þ": "th",
            "ß": "ss",
            "Ā": "A",
            "Ă": "A",
            "Ą": "A",
            "ā": "a",
            "ă": "a",
            "ą": "a",
            "Ć": "C",
            "Ĉ": "C",
            "Ċ": "C",
            "Č": "C",
            "ć": "c",
            "ĉ": "c",
            "ċ": "c",
            "č": "c",
            "Ď": "D",
            "Đ": "D",
            "ď": "d",
            "đ": "d",
            "Ē": "E",
            "Ĕ": "E",
            "Ė": "E",
            "Ę": "E",
            "Ě": "E",
            "ē": "e",
            "ĕ": "e",
            "ė": "e",
            "ę": "e",
            "ě": "e",
            "Ĝ": "G",
            "Ğ": "G",
            "Ġ": "G",
            "Ģ": "G",
            "ĝ": "g",
            "ğ": "g",
            "ġ": "g",
            "ģ": "g",
            "Ĥ": "H",
            "Ħ": "H",
            "ĥ": "h",
            "ħ": "h",
            "Ĩ": "I",
            "Ī": "I",
            "Ĭ": "I",
            "Į": "I",
            "İ": "I",
            "ĩ": "i",
            "ī": "i",
            "ĭ": "i",
            "į": "i",
            "ı": "i",
            "Ĵ": "J",
            "ĵ": "j",
            "Ķ": "K",
            "ķ": "k",
            "ĸ": "k",
            "Ĺ": "L",
            "Ļ": "L",
            "Ľ": "L",
            "Ŀ": "L",
            "Ł": "L",
            "ĺ": "l",
            "ļ": "l",
            "ľ": "l",
            "ŀ": "l",
            "ł": "l",
            "Ń": "N",
            "Ņ": "N",
            "Ň": "N",
            "Ŋ": "N",
            "ń": "n",
            "ņ": "n",
            "ň": "n",
            "ŋ": "n",
            "Ō": "O",
            "Ŏ": "O",
            "Ő": "O",
            "ō": "o",
            "ŏ": "o",
            "ő": "o",
            "Ŕ": "R",
            "Ŗ": "R",
            "Ř": "R",
            "ŕ": "r",
            "ŗ": "r",
            "ř": "r",
            "Ś": "S",
            "Ŝ": "S",
            "Ş": "S",
            "Š": "S",
            "ś": "s",
            "ŝ": "s",
            "ş": "s",
            "š": "s",
            "Ţ": "T",
            "Ť": "T",
            "Ŧ": "T",
            "ţ": "t",
            "ť": "t",
            "ŧ": "t",
            "Ũ": "U",
            "Ū": "U",
            "Ŭ": "U",
            "Ů": "U",
            "Ű": "U",
            "Ų": "U",
            "ũ": "u",
            "ū": "u",
            "ŭ": "u",
            "ů": "u",
            "ű": "u",
            "ų": "u",
            "Ŵ": "W",
            "ŵ": "w",
            "Ŷ": "Y",
            "ŷ": "y",
            "Ÿ": "Y",
            "Ź": "Z",
            "Ż": "Z",
            "Ž": "Z",
            "ź": "z",
            "ż": "z",
            "ž": "z",
            "Ĳ": "IJ",
            "ĳ": "ij",
            "Œ": "Oe",
            "œ": "oe",
            "ŉ": "'n",
            "ſ": "s"
        }), qt = y({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}),
        Kt = y({"&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'"}), Jt = function y(bt) {
            function yt(t) {
                if ($n(t) && !Fs(t) && !(t instanceof Dt)) {
                    if (t instanceof jt) return t;
                    if (Fr.call(t, "__wrapped__")) return yn(t)
                }
                return new jt(t)
            }

            function Ct() {
            }

            function jt(t, e) {
                this.__wrapped__ = t, this.__actions__ = [], this.__chain__ = !!e, this.__index__ = 0, this.__values__ = F
            }

            function Dt(t) {
                this.__wrapped__ = t, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = 4294967295, this.__views__ = []
            }

            function It(t) {
                var e = -1, i = null == t ? 0 : t.length;
                for (this.clear(); ++e < i;) {
                    var n = t[e];
                    this.set(n[0], n[1])
                }
            }

            function Ft(t) {
                var e = -1, i = null == t ? 0 : t.length;
                for (this.clear(); ++e < i;) {
                    var n = t[e];
                    this.set(n[0], n[1])
                }
            }

            function Rt(t) {
                var e = -1, i = null == t ? 0 : t.length;
                for (this.clear(); ++e < i;) {
                    var n = t[e];
                    this.set(n[0], n[1])
                }
            }

            function zt(t) {
                var e = -1, i = null == t ? 0 : t.length;
                for (this.__data__ = new Rt; ++e < i;) this.add(t[e])
            }

            function Xt(t) {
                this.size = (this.__data__ = new Ft(t)).size
            }

            function Vt(t, e) {
                var i, n = Fs(t), r = !n && Ls(t), o = !n && !r && Bs(t), s = !n && !r && !o && Hs(t),
                    a = (r = (n = n || r || o || s) ? C(t.length, jr) : []).length;
                for (i in t) !e && !Fr.call(t, i) || n && ("length" == i || o && ("offset" == i || "parent" == i) || s && ("buffer" == i || "byteLength" == i || "byteOffset" == i) || an(i, a)) || r.push(i);
                return r
            }

            function Qt(t) {
                var e = t.length;
                return e ? t[Ue(0, e - 1)] : F
            }

            function Zt(t, e) {
                return vn(yi(t), ce(e, 0, t.length))
            }

            function te(t) {
                return vn(yi(t))
            }

            function ee(t, e, i) {
                (i === F || Xn(t[e], i)) && (i !== F || e in t) || se(t, e, i)
            }

            function ie(t, e, i) {
                var n = t[e];
                Fr.call(t, e) && Xn(n, i) && (i !== F || e in t) || se(t, e, i)
            }

            function ne(t, e) {
                for (var i = t.length; i--;) if (Xn(t[i][0], e)) return i;
                return -1
            }

            function re(t, e, i, n) {
                return Lo(t, (function (t, r, o) {
                    e(n, t, i(t), o)
                })), n
            }

            function oe(t, e) {
                return t && xi(e, cr(e), t)
            }

            function se(t, e, i) {
                "__proto__" == e && to ? to(t, e, {configurable: !0, enumerable: !0, value: i, writable: !0}) : t[e] = i
            }

            function ae(t, e) {
                for (var i = -1, n = e.length, r = Cr(n), o = null == t; ++i < n;) r[i] = o ? F : sr(t, e[i]);
                return r
            }

            function ce(t, e, i) {
                return t == t && (i !== F && (t = t <= i ? t : i), e !== F && (t = t >= e ? t : e)), t
            }

            function le(t, e, n, r, o, s) {
                var a, c = 1 & e, l = 2 & e, h = 4 & e;
                if (n && (a = o ? n(t, r, o, s) : n(t)), a !== F) return a;
                if (!Vn(t)) return t;
                if (r = Fs(t)) {
                    if (a = function (t) {
                        var e = t.length, i = new t.constructor(e);
                        return e && "string" == typeof t[0] && Fr.call(t, "index") && (i.index = t.index, i.input = t.input), i
                    }(t), !c) return yi(t, a)
                } else {
                    var u = Go(t), f = "[object Function]" == u || "[object GeneratorFunction]" == u;
                    if (Bs(t)) return pi(t, c);
                    if ("[object Object]" == u || "[object Arguments]" == u || f && !o) {
                        if (a = l || f ? {} : on(t), !c) return l ? function (t, e) {
                            return xi(t, No(t), e)
                        }(t, function (t, e) {
                            return t && xi(e, lr(e), t)
                        }(a, t)) : function (t, e) {
                            return xi(t, Uo(t), e)
                        }(t, oe(a, t))
                    } else {
                        if (!Pt[u]) return o ? t : {};
                        a = function (t, e, i) {
                            var n = t.constructor;
                            switch (e) {
                                case"[object ArrayBuffer]":
                                    return gi(t);
                                case"[object Boolean]":
                                case"[object Date]":
                                    return new n(+t);
                                case"[object DataView]":
                                    return e = i ? gi(t.buffer) : t.buffer, new t.constructor(e, t.byteOffset, t.byteLength);
                                case"[object Float32Array]":
                                case"[object Float64Array]":
                                case"[object Int8Array]":
                                case"[object Int16Array]":
                                case"[object Int32Array]":
                                case"[object Uint8Array]":
                                case"[object Uint8ClampedArray]":
                                case"[object Uint16Array]":
                                case"[object Uint32Array]":
                                    return vi(t, i);
                                case"[object Map]":
                                case"[object Set]":
                                    return new n;
                                case"[object Number]":
                                case"[object String]":
                                    return new n(t);
                                case"[object RegExp]":
                                    return (e = new t.constructor(t.source, ht.exec(t))).lastIndex = t.lastIndex, e;
                                case"[object Symbol]":
                                    return Mo ? kr(Mo.call(t)) : {}
                            }
                        }(t, u, c)
                    }
                }
                if (s || (s = new Xt), o = s.get(t)) return o;
                if (s.set(t, a), Ys(t)) return t.forEach((function (i) {
                    a.add(le(i, e, n, i, t, s))
                })), a;
                if (Xs(t)) return t.forEach((function (i, r) {
                    a.set(r, le(i, e, n, r, t, s))
                })), a;
                l = h ? l ? Ki : qi : l ? lr : cr;
                var d = r ? F : l(t);
                return i(d || t, (function (i, r) {
                    d && (i = t[r = i]), ie(a, r, le(i, e, n, r, t, s))
                })), a
            }

            function he(t, e, i) {
                var n = i.length;
                if (null == t) return !n;
                for (t = kr(t); n--;) {
                    var r = i[n], o = e[r], s = t[r];
                    if (s === F && !(r in t) || !o(s)) return !1
                }
                return !0
            }

            function ue(t, e, i) {
                if ("function" != typeof t) throw new Ar("Expected a function");
                return qo((function () {
                    t.apply(F, i)
                }), e)
            }

            function fe(t, e, i, n) {
                var r = -1, o = s, l = !0, h = t.length, u = [], f = e.length;
                if (!h) return u;
                i && (e = c(e, S(i))), n ? (o = a, l = !1) : 200 <= e.length && (o = O, l = !1, e = new zt(e));
                t:for (; ++r < h;) {
                    var d = t[r], p = null == i ? d : i(d);
                    d = n || 0 !== d ? d : 0;
                    if (l && p == p) {
                        for (var g = f; g--;) if (e[g] === p) continue t;
                        u.push(d)
                    } else o(e, p, n) || u.push(d)
                }
                return u
            }

            function de(t, e) {
                var i = !0;
                return Lo(t, (function (t, n, r) {
                    return i = !!e(t, n, r)
                })), i
            }

            function pe(t, e, i) {
                for (var n = -1, r = t.length; ++n < r;) {
                    var o = t[n], s = e(o);
                    if (null != s && (a === F ? s == s && !Qn(s) : i(s, a))) var a = s, c = o
                }
                return c
            }

            function ge(t, e) {
                var i = [];
                return Lo(t, (function (t, n, r) {
                    e(t, n, r) && i.push(t)
                })), i
            }

            function ve(t, e, i, n, r) {
                var o = -1, s = t.length;
                for (i || (i = sn), r || (r = []); ++o < s;) {
                    var a = t[o];
                    0 < e && i(a) ? 1 < e ? ve(a, e - 1, i, n, r) : l(r, a) : n || (r[r.length] = a)
                }
                return r
            }

            function me(t, e) {
                return t && Ro(t, e, cr)
            }

            function _e(t, e) {
                return t && Bo(t, e, cr)
            }

            function be(t, e) {
                return o(e, (function (e) {
                    return Un(t[e])
                }))
            }

            function ye(t, e) {
                for (var i = 0, n = (e = fi(e, t)).length; null != t && i < n;) t = t[mn(e[i++])];
                return i && i == n ? t : F
            }

            function xe(t, e, i) {
                return e = e(t), Fs(t) ? e : l(e, i(t))
            }

            function we(t) {
                if (null == t) t = t === F ? "[object Undefined]" : "[object Null]"; else if (Zr && Zr in kr(t)) {
                    var e = Fr.call(t, Zr), i = t[Zr];
                    try {
                        t[Zr] = F;
                        var n = !0
                    } catch (t) {
                    }
                    var r = zr.call(t);
                    n && (e ? t[Zr] = i : delete t[Zr]), t = r
                } else t = zr.call(t);
                return t
            }

            function Ce(t, e) {
                return t > e
            }

            function Se(t, e) {
                return null != t && Fr.call(t, e)
            }

            function Te(t, e) {
                return null != t && e in kr(t)
            }

            function Oe(t, e, i) {
                for (var n = i ? a : s, r = t[0].length, o = t.length, l = o, h = Cr(o), u = 1 / 0, f = []; l--;) {
                    var d = t[l];
                    l && e && (d = c(d, S(e))), u = fo(d.length, u), h[l] = !i && (e || 120 <= r && 120 <= d.length) ? new zt(l && d) : F
                }
                d = t[0];
                var p = -1, g = h[0];
                t:for (; ++p < r && f.length < u;) {
                    var v = d[p], m = e ? e(v) : v;
                    v = i || 0 !== v ? v : 0;
                    if (g ? !O(g, m) : !n(f, m, i)) {
                        for (l = o; --l;) {
                            var _ = h[l];
                            if (_ ? !O(_, m) : !n(t[l], m, i)) continue t
                        }
                        g && g.push(m), f.push(v)
                    }
                }
                return f
            }

            function Ee(e, i, n) {
                return null == (i = null == (e = 2 > (i = fi(i, e)).length ? e : ye(e, Je(i, 0, -1))) ? e : e[mn(Tn(i))]) ? F : t(i, e, n)
            }

            function ke(t) {
                return $n(t) && "[object Arguments]" == we(t)
            }

            function Pe(t, e, i, n, r) {
                if (t === e) e = !0; else if (null == t || null == e || !$n(t) && !$n(e)) e = t != t && e != e; else t:{
                    var o, s, a = Fs(t), c = Fs(e),
                        l = "[object Object]" == (o = "[object Arguments]" == (o = a ? "[object Array]" : Go(t)) ? "[object Object]" : o);
                    c = "[object Object]" == (s = "[object Arguments]" == (s = c ? "[object Array]" : Go(e)) ? "[object Object]" : s);
                    if ((s = o == s) && Bs(t)) {
                        if (!Bs(e)) {
                            e = !1;
                            break t
                        }
                        a = !0, l = !1
                    }
                    if (s && !l) r || (r = new Xt), e = a || Hs(t) ? Vi(t, e, i, n, Pe, r) : function (t, e, i, n, r, o, s) {
                        switch (i) {
                            case"[object DataView]":
                                if (t.byteLength != e.byteLength || t.byteOffset != e.byteOffset) break;
                                t = t.buffer, e = e.buffer;
                            case"[object ArrayBuffer]":
                                if (t.byteLength != e.byteLength || !o(new Nr(t), new Nr(e))) break;
                                return !0;
                            case"[object Boolean]":
                            case"[object Date]":
                            case"[object Number]":
                                return Xn(+t, +e);
                            case"[object Error]":
                                return t.name == e.name && t.message == e.message;
                            case"[object RegExp]":
                            case"[object String]":
                                return t == e + "";
                            case"[object Map]":
                                var a = j;
                            case"[object Set]":
                                if (a || (a = D), t.size != e.size && !(1 & n)) break;
                                return (i = s.get(t)) ? i == e : (n |= 2, s.set(t, e), e = Vi(a(t), a(e), n, r, o, s), s.delete(t), e);
                            case"[object Symbol]":
                                if (Mo) return Mo.call(t) == Mo.call(e)
                        }
                        return !1
                    }(t, e, o, i, n, Pe, r); else {
                        if (!(1 & i) && (a = l && Fr.call(t, "__wrapped__"), o = c && Fr.call(e, "__wrapped__"), a || o)) {
                            t = a ? t.value() : t, e = o ? e.value() : e, r || (r = new Xt), e = Pe(t, e, i, n, r);
                            break t
                        }
                        if (s) e:if (r || (r = new Xt), a = 1 & i, o = qi(t), c = o.length, s = qi(e).length, c == s || a) {
                            for (l = c; l--;) {
                                var h = o[l];
                                if (!(a ? h in e : Fr.call(e, h))) {
                                    e = !1;
                                    break e
                                }
                            }
                            if ((s = r.get(t)) && r.get(e)) e = s == e; else {
                                s = !0, r.set(t, e), r.set(e, t);
                                for (var u = a; ++l < c;) {
                                    var f = t[h = o[l]], d = e[h];
                                    if (n) var p = a ? n(d, f, h, e, t, r) : n(f, d, h, t, e, r);
                                    if (p === F ? f !== d && !Pe(f, d, i, n, r) : !p) {
                                        s = !1;
                                        break
                                    }
                                    u || (u = "constructor" == h)
                                }
                                s && !u && ((i = t.constructor) != (n = e.constructor) && "constructor" in t && "constructor" in e && !("function" == typeof i && i instanceof i && "function" == typeof n && n instanceof n) && (s = !1)), r.delete(t), r.delete(e), e = s
                            }
                        } else e = !1; else e = !1
                    }
                }
                return e
            }

            function je(t, e, i, n) {
                var r = i.length, o = r, s = !n;
                if (null == t) return !o;
                for (t = kr(t); r--;) {
                    var a = i[r];
                    if (s && a[2] ? a[1] !== t[a[0]] : !(a[0] in t)) return !1
                }
                for (; ++r < o;) {
                    var c = (a = i[r])[0], l = t[c], h = a[1];
                    if (s && a[2]) {
                        if (l === F && !(c in t)) return !1
                    } else {
                        if (a = new Xt, n) var u = n(l, h, c, t, e, a);
                        if (u === F ? !Pe(h, l, 3, n, a) : !u) return !1
                    }
                }
                return !0
            }

            function Ae(t) {
                return !(!Vn(t) || Br && Br in t) && (Un(t) ? Yr : dt).test(_n(t))
            }

            function Me(t) {
                return "function" == typeof t ? t : null == t ? vr : "object" == typeof t ? Fs(t) ? Re(t[0], t[1]) : Fe(t) : yr(t)
            }

            function De(t) {
                if (!un(t)) return ho(t);
                var e, i = [];
                for (e in kr(t)) Fr.call(t, e) && "constructor" != e && i.push(e);
                return i
            }

            function Ie(t, e) {
                return t < e
            }

            function Le(t, e) {
                var i = -1, n = Wn(t) ? Cr(t.length) : [];
                return Lo(t, (function (t, r, o) {
                    n[++i] = e(t, r, o)
                })), n
            }

            function Fe(t) {
                var e = en(t);
                return 1 == e.length && e[0][2] ? fn(e[0][0], e[0][1]) : function (i) {
                    return i === t || je(i, t, e)
                }
            }

            function Re(t, e) {
                return ln(t) && e == e && !Vn(e) ? fn(mn(t), e) : function (i) {
                    var n = sr(i, t);
                    return n === F && n === e ? ar(i, t) : Pe(e, n, 3)
                }
            }

            function Be(t, e, i, n, r) {
                t !== e && Ro(e, (function (o, s) {
                    if (Vn(o)) {
                        r || (r = new Xt);
                        var a = r, c = "__proto__" == s ? F : t[s], l = "__proto__" == s ? F : e[s];
                        if (p = a.get(l)) ee(t, s, p); else {
                            var h = (p = n ? n(c, l, s + "", t, e, a) : F) === F;
                            if (h) {
                                var u = Fs(l), f = !u && Bs(l), d = !u && !f && Hs(l), p = l;
                                u || f || d ? Fs(c) ? p = c : Yn(c) ? p = yi(c) : f ? (h = !1, p = pi(l, !0)) : d ? (h = !1, p = vi(l, !0)) : p = [] : Kn(l) || Ls(l) ? (p = c, Ls(c) ? p = rr(c) : (!Vn(c) || i && Un(c)) && (p = on(l))) : h = !1
                            }
                            h && (a.set(l, p), Be(p, l, i, n, a), a.delete(l)), ee(t, s, p)
                        }
                    } else (a = n ? n("__proto__" == s ? F : t[s], o, s + "", t, e, r) : F) === F && (a = o), ee(t, s, a)
                }), lr)
            }

            function ze(t, e) {
                var i = t.length;
                if (i) return an(e += 0 > e ? i : 0, i) ? t[e] : F
            }

            function Xe(t, e, i) {
                var n = -1;
                return e = c(e.length ? e : [vr], S(Zi())), t = Le(t, (function (t) {
                    return {
                        a: c(e, (function (e) {
                            return e(t)
                        })), b: ++n, c: t
                    }
                })), function (t, e) {
                    var i = t.length;
                    for (t.sort(e); i--;) t[i] = t[i].c;
                    return t
                }(t, (function (t, e) {
                    var n;
                    t:{
                        n = -1;
                        for (var r = t.a, o = e.a, s = r.length, a = i.length; ++n < s;) {
                            var c = mi(r[n], o[n]);
                            if (c) {
                                n = n >= a ? c : c * ("desc" == i[n] ? -1 : 1);
                                break t
                            }
                        }
                        n = t.b - e.b
                    }
                    return n
                }))
            }

            function We(t, e, i) {
                for (var n = -1, r = e.length, o = {}; ++n < r;) {
                    var s = e[n], a = ye(t, s);
                    i(a, s) && qe(o, fi(s, t), a)
                }
                return o
            }

            function Ye(t, e, i, n) {
                var r = n ? v : g, o = -1, s = e.length, a = t;
                for (t === e && (e = yi(e)), i && (a = c(t, S(i))); ++o < s;) {
                    var l = 0, h = e[o];
                    for (h = i ? i(h) : h; -1 < (l = r(a, h, l, n));) a !== t && Kr.call(a, l, 1), Kr.call(t, l, 1)
                }
                return t
            }

            function He(t, e) {
                for (var i = t ? e.length : 0, n = i - 1; i--;) {
                    var r = e[i];
                    if (i == n || r !== o) {
                        var o = r;
                        an(r) ? Kr.call(t, r, 1) : oi(t, r)
                    }
                }
            }

            function Ue(t, e) {
                return t + oo(vo() * (e - t + 1))
            }

            function Ne(t, e) {
                var i = "";
                if (!t || 1 > e || 9007199254740991 < e) return i;
                do {
                    e % 2 && (i += t), (e = oo(e / 2)) && (t += t)
                } while (e);
                return i
            }

            function Ge(t, e) {
                return Ko(dn(t, e, vr), t + "")
            }

            function Ve(t) {
                return Qt(ur(t))
            }

            function $e(t, e) {
                var i = ur(t);
                return vn(i, ce(e, 0, i.length))
            }

            function qe(t, e, i, n) {
                if (!Vn(t)) return t;
                for (var r = -1, o = (e = fi(e, t)).length, s = o - 1, a = t; null != a && ++r < o;) {
                    var c = mn(e[r]), l = i;
                    if (r != s) {
                        var h = a[c];
                        (l = n ? n(h, c, a) : F) === F && (l = Vn(h) ? h : an(e[r + 1]) ? [] : {})
                    }
                    ie(a, c, l), a = a[c]
                }
                return t
            }

            function Ke(t) {
                return vn(ur(t))
            }

            function Je(t, e, i) {
                var n = -1, r = t.length;
                for (0 > e && (e = -e > r ? 0 : r + e), 0 > (i = i > r ? r : i) && (i += r), r = e > i ? 0 : i - e >>> 0, e >>>= 0, i = Cr(r); ++n < r;) i[n] = t[n + e];
                return i
            }

            function Qe(t, e) {
                var i;
                return Lo(t, (function (t, n, r) {
                    return !(i = e(t, n, r))
                })), !!i
            }

            function Ze(t, e, i) {
                var n = 0, r = null == t ? n : t.length;
                if ("number" == typeof e && e == e && 2147483647 >= r) {
                    for (; n < r;) {
                        var o = n + r >>> 1, s = t[o];
                        null !== s && !Qn(s) && (i ? s <= e : s < e) ? n = o + 1 : r = o
                    }
                    return r
                }
                return ti(t, e, vr, i)
            }

            function ti(t, e, i, n) {
                e = i(e);
                for (var r = 0, o = null == t ? 0 : t.length, s = e != e, a = null === e, c = Qn(e), l = e === F; r < o;) {
                    var h = oo((r + o) / 2), u = i(t[h]), f = u !== F, d = null === u, p = u == u, g = Qn(u);
                    (s ? n || p : l ? p && (n || f) : a ? p && f && (n || !d) : c ? p && f && !d && (n || !g) : !d && !g && (n ? u <= e : u < e)) ? r = h + 1 : o = h
                }
                return fo(o, 4294967294)
            }

            function ei(t, e) {
                for (var i = -1, n = t.length, r = 0, o = []; ++i < n;) {
                    var s = t[i], a = e ? e(s) : s;
                    if (!i || !Xn(a, c)) {
                        var c = a;
                        o[r++] = 0 === s ? 0 : s
                    }
                }
                return o
            }

            function ii(t) {
                return "number" == typeof t ? t : Qn(t) ? B : +t
            }

            function ni(t) {
                if ("string" == typeof t) return t;
                if (Fs(t)) return c(t, ni) + "";
                if (Qn(t)) return Do ? Do.call(t) : "";
                var e = t + "";
                return "0" == e && 1 / t == -R ? "-0" : e
            }

            function ri(t, e, i) {
                var n = -1, r = s, o = t.length, c = !0, l = [], h = l;
                if (i) c = !1, r = a; else if (200 <= o) {
                    if (r = e ? null : Yo(t)) return D(r);
                    c = !1, r = O, h = new zt
                } else h = e ? [] : l;
                t:for (; ++n < o;) {
                    var u = t[n], f = e ? e(u) : u;
                    u = i || 0 !== u ? u : 0;
                    if (c && f == f) {
                        for (var d = h.length; d--;) if (h[d] === f) continue t;
                        e && h.push(f), l.push(u)
                    } else r(h, f, i) || (h !== l && h.push(f), l.push(u))
                }
                return l
            }

            function oi(t, e) {
                return null == (t = 2 > (e = fi(e, t)).length ? t : ye(t, Je(e, 0, -1))) || delete t[mn(Tn(e))]
            }

            function si(t, e, i, n) {
                for (var r = t.length, o = n ? r : -1; (n ? o-- : ++o < r) && e(t[o], o, t);) ;
                return i ? Je(t, n ? 0 : o, n ? o + 1 : r) : Je(t, n ? o + 1 : 0, n ? r : o)
            }

            function ai(t, e) {
                var i = t;
                return i instanceof Dt && (i = i.value()), h(e, (function (t, e) {
                    return e.func.apply(e.thisArg, l([t], e.args))
                }), i)
            }

            function ci(t, e, i) {
                var n = t.length;
                if (2 > n) return n ? ri(t[0]) : [];
                for (var r = -1, o = Cr(n); ++r < n;) for (var s = t[r], a = -1; ++a < n;) a != r && (o[r] = fe(o[r] || s, t[a], e, i));
                return ri(ve(o, 1), e, i)
            }

            function li(t, e, i) {
                for (var n = -1, r = t.length, o = e.length, s = {}; ++n < r;) i(s, t[n], n < o ? e[n] : F);
                return s
            }

            function hi(t) {
                return Yn(t) ? t : []
            }

            function ui(t) {
                return "function" == typeof t ? t : vr
            }

            function fi(t, e) {
                return Fs(t) ? t : ln(t, e) ? [t] : Jo(or(t))
            }

            function di(t, e, i) {
                var n = t.length;
                return i = i === F ? n : i, !e && i >= n ? t : Je(t, e, i)
            }

            function pi(t, e) {
                if (e) return t.slice();
                var i = t.length;
                i = Gr ? Gr(i) : new t.constructor(i);
                return t.copy(i), i
            }

            function gi(t) {
                var e = new t.constructor(t.byteLength);
                return new Nr(e).set(new Nr(t)), e
            }

            function vi(t, e) {
                return new t.constructor(e ? gi(t.buffer) : t.buffer, t.byteOffset, t.length)
            }

            function mi(t, e) {
                if (t !== e) {
                    var i = t !== F, n = null === t, r = t == t, o = Qn(t), s = e !== F, a = null === e, c = e == e,
                        l = Qn(e);
                    if (!a && !l && !o && t > e || o && s && c && !a && !l || n && s && c || !i && c || !r) return 1;
                    if (!n && !o && !l && t < e || l && i && r && !n && !o || a && i && r || !s && r || !c) return -1
                }
                return 0
            }

            function _i(t, e, i, n) {
                var r = -1, o = t.length, s = i.length, a = -1, c = e.length, l = uo(o - s, 0), h = Cr(c + l);
                for (n = !n; ++a < c;) h[a] = e[a];
                for (; ++r < s;) (n || r < o) && (h[i[r]] = t[r]);
                for (; l--;) h[a++] = t[r++];
                return h
            }

            function bi(t, e, i, n) {
                var r = -1, o = t.length, s = -1, a = i.length, c = -1, l = e.length, h = uo(o - a, 0), u = Cr(h + l);
                for (n = !n; ++r < h;) u[r] = t[r];
                for (h = r; ++c < l;) u[h + c] = e[c];
                for (; ++s < a;) (n || r < o) && (u[h + i[s]] = t[r++]);
                return u
            }

            function yi(t, e) {
                var i = -1, n = t.length;
                for (e || (e = Cr(n)); ++i < n;) e[i] = t[i];
                return e
            }

            function xi(t, e, i, n) {
                var r = !i;
                i || (i = {});
                for (var o = -1, s = e.length; ++o < s;) {
                    var a = e[o], c = n ? n(i[a], t[a], a, i, t) : F;
                    c === F && (c = t[a]), r ? se(i, a, c) : ie(i, a, c)
                }
                return i
            }

            function wi(t, i) {
                return function (n, r) {
                    var o = Fs(n) ? e : re, s = i ? i() : {};
                    return o(n, t, Zi(r, 2), s)
                }
            }

            function Ci(t) {
                return Ge((function (e, i) {
                    var n = -1, r = i.length, o = 1 < r ? i[r - 1] : F, s = 2 < r ? i[2] : F;
                    o = 3 < t.length && "function" == typeof o ? (r--, o) : F;
                    for (s && cn(i[0], i[1], s) && (o = 3 > r ? F : o, r = 1), e = kr(e); ++n < r;) (s = i[n]) && t(e, s, n, o);
                    return e
                }))
            }

            function Si(t, e) {
                return function (i, n) {
                    if (null == i) return i;
                    if (!Wn(i)) return t(i, n);
                    for (var r = i.length, o = e ? r : -1, s = kr(i); (e ? o-- : ++o < r) && !1 !== n(s[o], o, s);) ;
                    return i
                }
            }

            function Ti(t) {
                return function (e, i, n) {
                    for (var r = -1, o = kr(e), s = (n = n(e)).length; s--;) {
                        var a = n[t ? s : ++r];
                        if (!1 === i(o[a], a, o)) break
                    }
                    return e
                }
            }

            function Oi(t) {
                return function (e) {
                    e = or(e);
                    var i = Tt.test(e) ? L(e) : F, n = i ? i[0] : e.charAt(0);
                    return e = i ? di(i, 1).join("") : e.slice(1), n[t]() + e
                }
            }

            function Ei(t) {
                return function (e) {
                    return h(pr(dr(e).replace(xt, "")), t, "")
                }
            }

            function ki(t) {
                return function () {
                    switch ((e = arguments).length) {
                        case 0:
                            return new t;
                        case 1:
                            return new t(e[0]);
                        case 2:
                            return new t(e[0], e[1]);
                        case 3:
                            return new t(e[0], e[1], e[2]);
                        case 4:
                            return new t(e[0], e[1], e[2], e[3]);
                        case 5:
                            return new t(e[0], e[1], e[2], e[3], e[4]);
                        case 6:
                            return new t(e[0], e[1], e[2], e[3], e[4], e[5]);
                        case 7:
                            return new t(e[0], e[1], e[2], e[3], e[4], e[5], e[6])
                    }
                    var e, i = Io(t.prototype);
                    return Vn(e = t.apply(i, e)) ? e : i
                }
            }

            function Pi(e, i, n) {
                var r = ki(e);
                return function o() {
                    for (var s = arguments.length, a = Cr(s), c = s, l = Qi(o); c--;) a[c] = arguments[c];
                    return (s -= (c = 3 > s && a[0] !== l && a[s - 1] !== l ? [] : M(a, l)).length) < n ? Xi(e, i, Mi, o.placeholder, F, a, c, F, F, n - s) : t(this && this !== Lt && this instanceof o ? r : e, this, a)
                }
            }

            function ji(t) {
                return function (e, i, n) {
                    var r = kr(e);
                    if (!Wn(e)) {
                        var o = Zi(i, 3);
                        e = cr(e), i = function (t) {
                            return o(r[t], t, r)
                        }
                    }
                    return -1 < (i = t(e, i, n)) ? r[o ? e[i] : i] : F
                }
            }

            function Ai(t) {
                return $i((function (e) {
                    var i = e.length, n = i, r = jt.prototype.thru;
                    for (t && e.reverse(); n--;) {
                        if ("function" != typeof (s = e[n])) throw new Ar("Expected a function");
                        if (r && !o && "wrapper" == Ji(s)) var o = new jt([], !0)
                    }
                    for (n = o ? n : i; ++n < i;) {
                        var s, a = "wrapper" == (r = Ji(s = e[n])) ? Ho(s) : F;
                        o = a && hn(a[0]) && 424 == a[1] && !a[4].length && 1 == a[9] ? o[Ji(a[0])].apply(o, a[3]) : 1 == s.length && hn(s) ? o[r]() : o.thru(s)
                    }
                    return function () {
                        var t = (r = arguments)[0];
                        if (o && 1 == r.length && Fs(t)) return o.plant(t).value();
                        for (var n = 0, r = i ? e[n].apply(this, r) : t; ++n < i;) r = e[n].call(this, r);
                        return r
                    }
                }))
            }

            function Mi(t, e, i, n, r, o, s, a, c, l) {
                var h = 128 & e, u = 1 & e, f = 2 & e, d = 24 & e, p = 512 & e, g = f ? F : ki(t);
                return function v() {
                    for (var m = arguments.length, _ = Cr(m), b = m; b--;) _[b] = arguments[b];
                    if (d) {
                        var y, x = Qi(v);
                        b = _.length;
                        for (y = 0; b--;) _[b] === x && ++y
                    }
                    if (n && (_ = _i(_, n, r, d)), o && (_ = bi(_, o, s, d)), m -= y, d && m < l) return x = M(_, x), Xi(t, e, Mi, v.placeholder, i, _, x, a, c, l - m);
                    if (x = u ? i : this, b = f ? x[t] : t, m = _.length, a) {
                        y = _.length;
                        for (var w = fo(a.length, y), C = yi(_); w--;) {
                            var S = a[w];
                            _[w] = an(S, y) ? C[S] : F
                        }
                    } else p && 1 < m && _.reverse();
                    return h && c < m && (_.length = c), this && this !== Lt && this instanceof v && (b = g || ki(b)), b.apply(x, _)
                }
            }

            function Di(t, e) {
                return function (i, n) {
                    return function (t, e, i) {
                        var n = {};
                        return me(t, (function (t, r, o) {
                            e(n, i(t), r, o)
                        })), n
                    }(i, t, e(n))
                }
            }

            function Ii(t, e) {
                return function (i, n) {
                    var r;
                    if (i === F && n === F) return e;
                    if (i !== F && (r = i), n !== F) {
                        if (r === F) return n;
                        "string" == typeof i || "string" == typeof n ? (i = ni(i), n = ni(n)) : (i = ii(i), n = ii(n)), r = t(i, n)
                    }
                    return r
                }
            }

            function Li(e) {
                return $i((function (i) {
                    return i = c(i, S(Zi())), Ge((function (n) {
                        var r = this;
                        return e(i, (function (e) {
                            return t(e, r, n)
                        }))
                    }))
                }))
            }

            function Fi(t, e) {
                var i = (e = e === F ? " " : ni(e)).length;
                return 2 > i ? i ? Ne(e, t) : e : (i = Ne(e, ro(t / I(e))), Tt.test(e) ? di(L(i), 0, t).join("") : i.slice(0, t))
            }

            function Ri(e, i, n, r) {
                var o = 1 & i, s = ki(e);
                return function i() {
                    for (var a = -1, c = arguments.length, l = -1, h = r.length, u = Cr(h + c), f = this && this !== Lt && this instanceof i ? s : e; ++l < h;) u[l] = r[l];
                    for (; c--;) u[l++] = arguments[++a];
                    return t(f, o ? n : this, u)
                }
            }

            function Bi(t) {
                return function (e, i, n) {
                    n && "number" != typeof n && cn(e, i, n) && (i = n = F), e = tr(e), i === F ? (i = e, e = 0) : i = tr(i), n = n === F ? e < i ? 1 : -1 : tr(n);
                    var r = -1;
                    i = uo(ro((i - e) / (n || 1)), 0);
                    for (var o = Cr(i); i--;) o[t ? i : ++r] = e, e += n;
                    return o
                }
            }

            function zi(t) {
                return function (e, i) {
                    return "string" == typeof e && "string" == typeof i || (e = nr(e), i = nr(i)), t(e, i)
                }
            }

            function Xi(t, e, i, n, r, o, s, a, c, l) {
                var h = 8 & e;
                return 4 & (e = (e | (h ? 32 : 64)) & ~(h ? 64 : 32)) || (e &= -4), r = [t, e, r, h ? o : F, h ? s : F, o = h ? F : o, s = h ? F : s, a, c, l], i = i.apply(F, r), hn(t) && $o(i, r), i.placeholder = n, pn(i, t, e)
            }

            function Wi(t) {
                var e = Er[t];
                return function (t, i) {
                    if (t = nr(t), i = null == i ? 0 : fo(er(i), 292)) {
                        var n = (or(t) + "e").split("e");
                        return +((n = (or(n = e(n[0] + "e" + (+n[1] + i))) + "e").split("e"))[0] + "e" + (+n[1] - i))
                    }
                    return e(t)
                }
            }

            function Yi(t) {
                return function (e) {
                    var i = Go(e);
                    return "[object Map]" == i ? j(e) : "[object Set]" == i ? function (t) {
                        var e = -1, i = Array(t.size);
                        return t.forEach((function (t) {
                            i[++e] = [t, t]
                        })), i
                    }(e) : function (t, e) {
                        return c(e, (function (e) {
                            return [e, t[e]]
                        }))
                    }(e, t(e))
                }
            }

            function Hi(t, e, i, n, r, o, s, a) {
                var c = 2 & e;
                if (!c && "function" != typeof t) throw new Ar("Expected a function");
                var l = n ? n.length : 0;
                if (l || (e &= -97, n = r = F), s = s === F ? s : uo(er(s), 0), a = a === F ? a : er(a), l -= r ? r.length : 0, 64 & e) {
                    var h = n, u = r;
                    n = r = F
                }
                var f = c ? F : Ho(t);
                return o = [t, e, i, n, r, h, u, o, s, a], f && (e = (i = o[1]) | (t = f[1]), n = 128 == t && 8 == i || 128 == t && 256 == i && o[7].length <= f[8] || 384 == t && f[7].length <= f[8] && 8 == i, 131 > e || n) && (1 & t && (o[2] = f[2], e |= 1 & i ? 0 : 4), (i = f[3]) && (n = o[3], o[3] = n ? _i(n, i, f[4]) : i, o[4] = n ? M(o[3], "__lodash_placeholder__") : f[4]), (i = f[5]) && (n = o[5], o[5] = n ? bi(n, i, f[6]) : i, o[6] = n ? M(o[5], "__lodash_placeholder__") : f[6]), (i = f[7]) && (o[7] = i), 128 & t && (o[8] = null == o[8] ? f[8] : fo(o[8], f[8])), null == o[9] && (o[9] = f[9]), o[0] = f[0], o[1] = e), t = o[0], e = o[1], i = o[2], n = o[3], r = o[4], !(a = o[9] = o[9] === F ? c ? 0 : t.length : uo(o[9] - l, 0)) && 24 & e && (e &= -25), pn((f ? zo : $o)(e && 1 != e ? 8 == e || 16 == e ? Pi(t, e, a) : 32 != e && 33 != e || r.length ? Mi.apply(F, o) : Ri(t, e, i, n) : function (t, e, i) {
                    var n = 1 & e, r = ki(t);
                    return function e() {
                        return (this && this !== Lt && this instanceof e ? r : t).apply(n ? i : this, arguments)
                    }
                }(t, e, i), o), t, e)
            }

            function Ui(t, e, i, n) {
                return t === F || Xn(t, Dr[i]) && !Fr.call(n, i) ? e : t
            }

            function Ni(t, e, i, n, r, o) {
                return Vn(t) && Vn(e) && (o.set(e, t), Be(t, e, F, Ni, o), o.delete(e)), t
            }

            function Gi(t) {
                return Kn(t) ? F : t
            }

            function Vi(t, e, i, n, r, o) {
                var s = 1 & i, a = t.length;
                if (a != (c = e.length) && !(s && c > a)) return !1;
                if ((c = o.get(t)) && o.get(e)) return c == e;
                var c = -1, l = !0, h = 2 & i ? new zt : F;
                for (o.set(t, e), o.set(e, t); ++c < a;) {
                    var u = t[c], d = e[c];
                    if (n) var p = s ? n(d, u, c, e, t, o) : n(u, d, c, t, e, o);
                    if (p !== F) {
                        if (p) continue;
                        l = !1;
                        break
                    }
                    if (h) {
                        if (!f(e, (function (t, e) {
                            if (!O(h, e) && (u === t || r(u, t, i, n, o))) return h.push(e)
                        }))) {
                            l = !1;
                            break
                        }
                    } else if (u !== d && !r(u, d, i, n, o)) {
                        l = !1;
                        break
                    }
                }
                return o.delete(t), o.delete(e), l
            }

            function $i(t) {
                return Ko(dn(t, F, Cn), t + "")
            }

            function qi(t) {
                return xe(t, cr, Uo)
            }

            function Ki(t) {
                return xe(t, lr, No)
            }

            function Ji(t) {
                for (var e = t.name + "", i = To[e], n = Fr.call(To, e) ? i.length : 0; n--;) {
                    var r = i[n], o = r.func;
                    if (null == o || o == t) return r.name
                }
                return e
            }

            function Qi(t) {
                return (Fr.call(yt, "placeholder") ? yt : t).placeholder
            }

            function Zi() {
                var t = (t = yt.iteratee || mr) === mr ? Me : t;
                return arguments.length ? t(arguments[0], arguments[1]) : t
            }

            function tn(t, e) {
                var i = t.__data__, n = typeof e;
                return ("string" == n || "number" == n || "symbol" == n || "boolean" == n ? "__proto__" !== e : null === e) ? i["string" == typeof e ? "string" : "hash"] : i.map
            }

            function en(t) {
                for (var e = cr(t), i = e.length; i--;) {
                    var n = e[i], r = t[n];
                    e[i] = [n, r, r == r && !Vn(r)]
                }
                return e
            }

            function nn(t, e) {
                var i = null == t ? F : t[e];
                return Ae(i) ? i : F
            }

            function rn(t, e, i) {
                for (var n = -1, r = (e = fi(e, t)).length, o = !1; ++n < r;) {
                    var s = mn(e[n]);
                    if (!(o = null != t && i(t, s))) break;
                    t = t[s]
                }
                return o || ++n != r ? o : !!(r = null == t ? 0 : t.length) && Gn(r) && an(s, r) && (Fs(t) || Ls(t))
            }

            function on(t) {
                return "function" != typeof t.constructor || un(t) ? {} : Io(Vr(t))
            }

            function sn(t) {
                return Fs(t) || Ls(t) || !!(Jr && t && t[Jr])
            }

            function an(t, e) {
                var i = typeof t;
                return !!(e = null == e ? 9007199254740991 : e) && ("number" == i || "symbol" != i && gt.test(t)) && -1 < t && 0 == t % 1 && t < e
            }

            function cn(t, e, i) {
                if (!Vn(i)) return !1;
                var n = typeof e;
                return !!("number" == n ? Wn(i) && an(e, i.length) : "string" == n && e in i) && Xn(i[e], t)
            }

            function ln(t, e) {
                if (Fs(t)) return !1;
                var i = typeof t;
                return !("number" != i && "symbol" != i && "boolean" != i && null != t && !Qn(t)) || J.test(t) || !K.test(t) || null != e && t in kr(e)
            }

            function hn(t) {
                var e = Ji(t), i = yt[e];
                return "function" == typeof i && e in Dt.prototype && (t === i || !!(e = Ho(i)) && t === e[0])
            }

            function un(t) {
                var e = t && t.constructor;
                return t === ("function" == typeof e && e.prototype || Dr)
            }

            function fn(t, e) {
                return function (i) {
                    return null != i && i[t] === e && (e !== F || t in kr(i))
                }
            }

            function dn(e, i, n) {
                return i = uo(i === F ? e.length - 1 : i, 0), function () {
                    for (var r = arguments, o = -1, s = uo(r.length - i, 0), a = Cr(s); ++o < s;) a[o] = r[i + o];
                    for (o = -1, s = Cr(i + 1); ++o < i;) s[o] = r[o];
                    return s[i] = n(a), t(e, this, s)
                }
            }

            function pn(t, e, i) {
                var n = e + "";
                e = Ko;
                var r, o = bn;
                return i = o(r = (r = n.match(ot)) ? r[1].split(st) : [], i), (o = i.length) && (i[r = o - 1] = (1 < o ? "& " : "") + i[r], i = i.join(2 < o ? ", " : " "), n = n.replace(rt, "{\n/* [wrapped with " + i + "] */\n")), e(t, n)
            }

            function gn(t) {
                var e = 0, i = 0;
                return function () {
                    var n = po(), r = 16 - (n - i);
                    if (i = n, 0 < r) {
                        if (800 <= ++e) return arguments[0]
                    } else e = 0;
                    return t.apply(F, arguments)
                }
            }

            function vn(t, e) {
                var i = -1, n = (r = t.length) - 1;
                for (e = e === F ? r : e; ++i < e;) {
                    var r, o = t[r = Ue(i, n)];
                    t[r] = t[i], t[i] = o
                }
                return t.length = e, t
            }

            function mn(t) {
                if ("string" == typeof t || Qn(t)) return t;
                var e = t + "";
                return "0" == e && 1 / t == -R ? "-0" : e
            }

            function _n(t) {
                if (null != t) {
                    try {
                        return Lr.call(t)
                    } catch (t) {
                    }
                    return t + ""
                }
                return ""
            }

            function bn(t, e) {
                return i(z, (function (i) {
                    var n = "_." + i[0];
                    e & i[1] && !s(t, n) && t.push(n)
                })), t.sort()
            }

            function yn(t) {
                if (t instanceof Dt) return t.clone();
                var e = new jt(t.__wrapped__, t.__chain__);
                return e.__actions__ = yi(t.__actions__), e.__index__ = t.__index__, e.__values__ = t.__values__, e
            }

            function xn(t, e, i) {
                var n = null == t ? 0 : t.length;
                return n ? (0 > (i = null == i ? 0 : er(i)) && (i = uo(n + i, 0)), p(t, Zi(e, 3), i)) : -1
            }

            function wn(t, e, i) {
                var n = null == t ? 0 : t.length;
                if (!n) return -1;
                var r = n - 1;
                return i !== F && (r = er(i), r = 0 > i ? uo(n + r, 0) : fo(r, n - 1)), p(t, Zi(e, 3), r, !0)
            }

            function Cn(t) {
                return null != t && t.length ? ve(t, 1) : []
            }

            function Sn(t) {
                return t && t.length ? t[0] : F
            }

            function Tn(t) {
                var e = null == t ? 0 : t.length;
                return e ? t[e - 1] : F
            }

            function On(t, e) {
                return t && t.length && e && e.length ? Ye(t, e) : t
            }

            function En(t) {
                return null == t ? t : mo.call(t)
            }

            function kn(t) {
                if (!t || !t.length) return [];
                var e = 0;
                return t = o(t, (function (t) {
                    if (Yn(t)) return e = uo(t.length, e), !0
                })), C(e, (function (e) {
                    return c(t, b(e))
                }))
            }

            function Pn(e, i) {
                if (!e || !e.length) return [];
                var n = kn(e);
                return null == i ? n : c(n, (function (e) {
                    return t(i, F, e)
                }))
            }

            function jn(t) {
                return (t = yt(t)).__chain__ = !0, t
            }

            function An(t, e) {
                return e(t)
            }

            function Mn(t, e) {
                return (Fs(t) ? i : Lo)(t, Zi(e, 3))
            }

            function Dn(t, e) {
                return (Fs(t) ? n : Fo)(t, Zi(e, 3))
            }

            function In(t, e) {
                return (Fs(t) ? c : Le)(t, Zi(e, 3))
            }

            function Ln(t, e, i) {
                return e = i ? F : e, e = t && null == e ? t.length : e, Hi(t, 128, F, F, F, F, e)
            }

            function Fn(t, e) {
                var i;
                if ("function" != typeof e) throw new Ar("Expected a function");
                return t = er(t), function () {
                    return 0 < --t && (i = e.apply(this, arguments)), 1 >= t && (e = F), i
                }
            }

            function Rn(t, e, i) {
                function n(e) {
                    var i = c, n = l;
                    return c = l = F, p = e, u = t.apply(n, i)
                }

                function r(t) {
                    var i = t - d;
                    return t -= p, d === F || i >= e || 0 > i || v && t >= h
                }

                function o() {
                    var t = Ss();
                    if (r(t)) return s(t);
                    var i, n = qo;
                    i = t - p, t = e - (t - d), i = v ? fo(t, h - i) : t, f = n(o, i)
                }

                function s(t) {
                    return f = F, m && c ? n(t) : (c = l = F, u)
                }

                function a() {
                    var t = Ss(), i = r(t);
                    if (c = arguments, l = this, d = t, i) {
                        if (f === F) return p = t = d, f = qo(o, e), g ? n(t) : u;
                        if (v) return f = qo(o, e), n(d)
                    }
                    return f === F && (f = qo(o, e)), u
                }

                var c, l, h, u, f, d, p = 0, g = !1, v = !1, m = !0;
                if ("function" != typeof t) throw new Ar("Expected a function");
                return e = nr(e) || 0, Vn(i) && (g = !!i.leading, h = (v = "maxWait" in i) ? uo(nr(i.maxWait) || 0, e) : h, m = "trailing" in i ? !!i.trailing : m), a.cancel = function () {
                    f !== F && Wo(f), p = 0, c = d = l = f = F
                }, a.flush = function () {
                    return f === F ? u : s(Ss())
                }, a
            }

            function Bn(t, e) {
                function i() {
                    var n = arguments, r = e ? e.apply(this, n) : n[0], o = i.cache;
                    return o.has(r) ? o.get(r) : (n = t.apply(this, n), i.cache = o.set(r, n) || o, n)
                }

                if ("function" != typeof t || null != e && "function" != typeof e) throw new Ar("Expected a function");
                return i.cache = new (Bn.Cache || Rt), i
            }

            function zn(t) {
                if ("function" != typeof t) throw new Ar("Expected a function");
                return function () {
                    var e = arguments;
                    switch (e.length) {
                        case 0:
                            return !t.call(this);
                        case 1:
                            return !t.call(this, e[0]);
                        case 2:
                            return !t.call(this, e[0], e[1]);
                        case 3:
                            return !t.call(this, e[0], e[1], e[2])
                    }
                    return !t.apply(this, e)
                }
            }

            function Xn(t, e) {
                return t === e || t != t && e != e
            }

            function Wn(t) {
                return null != t && Gn(t.length) && !Un(t)
            }

            function Yn(t) {
                return $n(t) && Wn(t)
            }

            function Hn(t) {
                if (!$n(t)) return !1;
                var e = we(t);
                return "[object Error]" == e || "[object DOMException]" == e || "string" == typeof t.message && "string" == typeof t.name && !Kn(t)
            }

            function Un(t) {
                return !!Vn(t) && ("[object Function]" == (t = we(t)) || "[object GeneratorFunction]" == t || "[object AsyncFunction]" == t || "[object Proxy]" == t)
            }

            function Nn(t) {
                return "number" == typeof t && t == er(t)
            }

            function Gn(t) {
                return "number" == typeof t && -1 < t && 0 == t % 1 && 9007199254740991 >= t
            }

            function Vn(t) {
                var e = typeof t;
                return null != t && ("object" == e || "function" == e)
            }

            function $n(t) {
                return null != t && "object" == typeof t
            }

            function qn(t) {
                return "number" == typeof t || $n(t) && "[object Number]" == we(t)
            }

            function Kn(t) {
                return !(!$n(t) || "[object Object]" != we(t)) && (null === (t = Vr(t)) || "function" == typeof (t = Fr.call(t, "constructor") && t.constructor) && t instanceof t && Lr.call(t) == Xr)
            }

            function Jn(t) {
                return "string" == typeof t || !Fs(t) && $n(t) && "[object String]" == we(t)
            }

            function Qn(t) {
                return "symbol" == typeof t || $n(t) && "[object Symbol]" == we(t)
            }

            function Zn(t) {
                if (!t) return [];
                if (Wn(t)) return Jn(t) ? L(t) : yi(t);
                if (Qr && t[Qr]) {
                    t = t[Qr]();
                    for (var e, i = []; !(e = t.next()).done;) i.push(e.value);
                    return i
                }
                return ("[object Map]" == (e = Go(t)) ? j : "[object Set]" == e ? D : ur)(t)
            }

            function tr(t) {
                return t ? (t = nr(t)) === R || t === -R ? 17976931348623157e292 * (0 > t ? -1 : 1) : t == t ? t : 0 : 0 === t ? t : 0
            }

            function er(t) {
                var e = (t = tr(t)) % 1;
                return t == t ? e ? t - e : t : 0
            }

            function ir(t) {
                return t ? ce(er(t), 0, 4294967295) : 0
            }

            function nr(t) {
                if ("number" == typeof t) return t;
                if (Qn(t)) return B;
                if (Vn(t) && (t = Vn(t = "function" == typeof t.valueOf ? t.valueOf() : t) ? t + "" : t), "string" != typeof t) return 0 === t ? t : +t;
                t = t.replace(et, "");
                var e = ft.test(t);
                return e || pt.test(t) ? Mt(t.slice(2), e ? 2 : 8) : ut.test(t) ? B : +t
            }

            function rr(t) {
                return xi(t, lr(t))
            }

            function or(t) {
                return null == t ? "" : ni(t)
            }

            function sr(t, e, i) {
                return (t = null == t ? F : ye(t, e)) === F ? i : t
            }

            function ar(t, e) {
                return null != t && rn(t, e, Te)
            }

            function cr(t) {
                return Wn(t) ? Vt(t) : De(t)
            }

            function lr(t) {
                if (Wn(t)) t = Vt(t, !0); else if (Vn(t)) {
                    var e, i = un(t), n = [];
                    for (e in t) ("constructor" != e || !i && Fr.call(t, e)) && n.push(e);
                    t = n
                } else {
                    if (e = [], null != t) for (i in kr(t)) e.push(i);
                    t = e
                }
                return t
            }

            function hr(t, e) {
                if (null == t) return {};
                var i = c(Ki(t), (function (t) {
                    return [t]
                }));
                return e = Zi(e), We(t, i, (function (t, i) {
                    return e(t, i[0])
                }))
            }

            function ur(t) {
                return null == t ? [] : T(t, cr(t))
            }

            function fr(t) {
                return ga(or(t).toLowerCase())
            }

            function dr(t) {
                return (t = or(t)) && t.replace(vt, $t).replace(wt, "")
            }

            function pr(t, e, i) {
                return t = or(t), (e = i ? F : e) === F ? Ot.test(t) ? t.match(St) || [] : t.match(at) || [] : t.match(e) || []
            }

            function gr(t) {
                return function () {
                    return t
                }
            }

            function vr(t) {
                return t
            }

            function mr(t) {
                return Me("function" == typeof t ? t : le(t, 1))
            }

            function _r(t, e, n) {
                var r = cr(e), o = be(e, r);
                null != n || Vn(e) && (o.length || !r.length) || (n = e, e = t, t = this, o = be(e, cr(e)));
                var s = !(Vn(n) && "chain" in n && !n.chain), a = Un(t);
                return i(o, (function (i) {
                    var n = e[i];
                    t[i] = n, a && (t.prototype[i] = function () {
                        var e = this.__chain__;
                        if (s || e) {
                            var i = t(this.__wrapped__);
                            return (i.__actions__ = yi(this.__actions__)).push({
                                func: n,
                                args: arguments,
                                thisArg: t
                            }), i.__chain__ = e, i
                        }
                        return n.apply(t, l([this.value()], arguments))
                    })
                })), t
            }

            function br() {
            }

            function yr(t) {
                return ln(t) ? b(mn(t)) : function (t) {
                    return function (e) {
                        return ye(e, t)
                    }
                }(t)
            }

            function xr() {
                return []
            }

            function wr() {
                return !1
            }

            var Cr = (bt = null == bt ? Lt : Jt.defaults(Lt.Object(), bt, Jt.pick(Lt, Et))).Array, Sr = bt.Date,
                Tr = bt.Error, Or = bt.Function, Er = bt.Math, kr = bt.Object, Pr = bt.RegExp, jr = bt.String,
                Ar = bt.TypeError, Mr = Cr.prototype, Dr = kr.prototype, Ir = bt["__core-js_shared__"],
                Lr = Or.prototype.toString, Fr = Dr.hasOwnProperty, Rr = 0, Br = function () {
                    var t = /[^.]+$/.exec(Ir && Ir.keys && Ir.keys.IE_PROTO || "");
                    return t ? "Symbol(src)_1." + t : ""
                }(), zr = Dr.toString, Xr = Lr.call(kr), Wr = Lt._,
                Yr = Pr("^" + Lr.call(Fr).replace(Z, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
                Hr = Bt ? bt.Buffer : F, Ur = bt.Symbol, Nr = bt.Uint8Array, Gr = Hr ? Hr.g : F,
                Vr = A(kr.getPrototypeOf, kr), $r = kr.create, qr = Dr.propertyIsEnumerable, Kr = Mr.splice,
                Jr = Ur ? Ur.isConcatSpreadable : F, Qr = Ur ? Ur.iterator : F, Zr = Ur ? Ur.toStringTag : F,
                to = function () {
                    try {
                        var t = nn(kr, "defineProperty");
                        return t({}, "", {}), t
                    } catch (t) {
                    }
                }(), eo = bt.clearTimeout !== Lt.clearTimeout && bt.clearTimeout,
                io = Sr && Sr.now !== Lt.Date.now && Sr.now, no = bt.setTimeout !== Lt.setTimeout && bt.setTimeout,
                ro = Er.ceil, oo = Er.floor, so = kr.getOwnPropertySymbols, ao = Hr ? Hr.isBuffer : F, co = bt.isFinite,
                lo = Mr.join, ho = A(kr.keys, kr), uo = Er.max, fo = Er.min, po = Sr.now, go = bt.parseInt, vo = Er.random,
                mo = Mr.reverse, _o = nn(bt, "DataView"), bo = nn(bt, "Map"), yo = nn(bt, "Promise"), xo = nn(bt, "Set"),
                wo = nn(bt, "WeakMap"), Co = nn(kr, "create"), So = wo && new wo, To = {}, Oo = _n(_o), Eo = _n(bo),
                ko = _n(yo), Po = _n(xo), jo = _n(wo), Ao = Ur ? Ur.prototype : F, Mo = Ao ? Ao.valueOf : F,
                Do = Ao ? Ao.toString : F, Io = function () {
                    function t() {
                    }

                    return function (e) {
                        return Vn(e) ? $r ? $r(e) : (t.prototype = e, e = new t, t.prototype = F, e) : {}
                    }
                }();
            yt.templateSettings = {
                escape: V,
                evaluate: $,
                interpolate: q,
                variable: "",
                imports: {_: yt}
            }, yt.prototype = Ct.prototype, yt.prototype.constructor = yt, jt.prototype = Io(Ct.prototype), jt.prototype.constructor = jt, Dt.prototype = Io(Ct.prototype), Dt.prototype.constructor = Dt, It.prototype.clear = function () {
                this.__data__ = Co ? Co(null) : {}, this.size = 0
            }, It.prototype.delete = function (t) {
                return t = this.has(t) && delete this.__data__[t], this.size -= t ? 1 : 0, t
            }, It.prototype.get = function (t) {
                var e = this.__data__;
                return Co ? "__lodash_hash_undefined__" === (t = e[t]) ? F : t : Fr.call(e, t) ? e[t] : F
            }, It.prototype.has = function (t) {
                var e = this.__data__;
                return Co ? e[t] !== F : Fr.call(e, t)
            }, It.prototype.set = function (t, e) {
                var i = this.__data__;
                return this.size += this.has(t) ? 0 : 1, i[t] = Co && e === F ? "__lodash_hash_undefined__" : e, this
            }, Ft.prototype.clear = function () {
                this.__data__ = [], this.size = 0
            }, Ft.prototype.delete = function (t) {
                var e = this.__data__;
                return !(0 > (t = ne(e, t)) || (t == e.length - 1 ? e.pop() : Kr.call(e, t, 1), --this.size, 0))
            }, Ft.prototype.get = function (t) {
                var e = this.__data__;
                return 0 > (t = ne(e, t)) ? F : e[t][1]
            }, Ft.prototype.has = function (t) {
                return -1 < ne(this.__data__, t)
            }, Ft.prototype.set = function (t, e) {
                var i = this.__data__, n = ne(i, t);
                return 0 > n ? (++this.size, i.push([t, e])) : i[n][1] = e, this
            }, Rt.prototype.clear = function () {
                this.size = 0, this.__data__ = {hash: new It, map: new (bo || Ft), string: new It}
            }, Rt.prototype.delete = function (t) {
                return t = tn(this, t).delete(t), this.size -= t ? 1 : 0, t
            }, Rt.prototype.get = function (t) {
                return tn(this, t).get(t)
            }, Rt.prototype.has = function (t) {
                return tn(this, t).has(t)
            }, Rt.prototype.set = function (t, e) {
                var i = tn(this, t), n = i.size;
                return i.set(t, e), this.size += i.size == n ? 0 : 1, this
            }, zt.prototype.add = zt.prototype.push = function (t) {
                return this.__data__.set(t, "__lodash_hash_undefined__"), this
            }, zt.prototype.has = function (t) {
                return this.__data__.has(t)
            }, Xt.prototype.clear = function () {
                this.__data__ = new Ft, this.size = 0
            }, Xt.prototype.delete = function (t) {
                var e = this.__data__;
                return t = e.delete(t), this.size = e.size, t
            }, Xt.prototype.get = function (t) {
                return this.__data__.get(t)
            }, Xt.prototype.has = function (t) {
                return this.__data__.has(t)
            }, Xt.prototype.set = function (t, e) {
                var i = this.__data__;
                if (i instanceof Ft) {
                    var n = i.__data__;
                    if (!bo || 199 > n.length) return n.push([t, e]), this.size = ++i.size, this;
                    i = this.__data__ = new Rt(n)
                }
                return i.set(t, e), this.size = i.size, this
            };
            var Lo = Si(me), Fo = Si(_e, !0), Ro = Ti(), Bo = Ti(!0), zo = So ? function (t, e) {
                return So.set(t, e), t
            } : vr, Xo = to ? function (t, e) {
                return to(t, "toString", {configurable: !0, enumerable: !1, value: gr(e), writable: !0})
            } : vr, Wo = eo || function (t) {
                return Lt.clearTimeout(t)
            }, Yo = xo && 1 / D(new xo([, -0]))[1] == R ? function (t) {
                return new xo(t)
            } : br, Ho = So ? function (t) {
                return So.get(t)
            } : br, Uo = so ? function (t) {
                return null == t ? [] : (t = kr(t), o(so(t), (function (e) {
                    return qr.call(t, e)
                })))
            } : xr, No = so ? function (t) {
                for (var e = []; t;) l(e, Uo(t)), t = Vr(t);
                return e
            } : xr, Go = we;
            (_o && "[object DataView]" != Go(new _o(new ArrayBuffer(1))) || bo && "[object Map]" != Go(new bo) || yo && "[object Promise]" != Go(yo.resolve()) || xo && "[object Set]" != Go(new xo) || wo && "[object WeakMap]" != Go(new wo)) && (Go = function (t) {
                var e = we(t);
                if (t = (t = "[object Object]" == e ? t.constructor : F) ? _n(t) : "") switch (t) {
                    case Oo:
                        return "[object DataView]";
                    case Eo:
                        return "[object Map]";
                    case ko:
                        return "[object Promise]";
                    case Po:
                        return "[object Set]";
                    case jo:
                        return "[object WeakMap]"
                }
                return e
            });
            var Vo = Ir ? Un : wr, $o = gn(zo), qo = no || function (t, e) {
                return Lt.setTimeout(t, e)
            }, Ko = gn(Xo), Jo = function (t) {
                var e = (t = Bn(t, (function (t) {
                    return 500 === e.size && e.clear(), t
                }))).cache;
                return t
            }((function (t) {
                var e = [];
                return 46 === t.charCodeAt(0) && e.push(""), t.replace(Q, (function (t, i, n, r) {
                    e.push(n ? r.replace(ct, "$1") : i || t)
                })), e
            })), Qo = Ge((function (t, e) {
                return Yn(t) ? fe(t, ve(e, 1, Yn, !0)) : []
            })), Zo = Ge((function (t, e) {
                var i = Tn(e);
                return Yn(i) && (i = F), Yn(t) ? fe(t, ve(e, 1, Yn, !0), Zi(i, 2)) : []
            })), ts = Ge((function (t, e) {
                var i = Tn(e);
                return Yn(i) && (i = F), Yn(t) ? fe(t, ve(e, 1, Yn, !0), F, i) : []
            })), es = Ge((function (t) {
                var e = c(t, hi);
                return e.length && e[0] === t[0] ? Oe(e) : []
            })), is = Ge((function (t) {
                var e = Tn(t), i = c(t, hi);
                return e === Tn(i) ? e = F : i.pop(), i.length && i[0] === t[0] ? Oe(i, Zi(e, 2)) : []
            })), ns = Ge((function (t) {
                var e = Tn(t), i = c(t, hi);
                return (e = "function" == typeof e ? e : F) && i.pop(), i.length && i[0] === t[0] ? Oe(i, F, e) : []
            })), rs = Ge(On), os = $i((function (t, e) {
                var i = null == t ? 0 : t.length, n = ae(t, e);
                return He(t, c(e, (function (t) {
                    return an(t, i) ? +t : t
                })).sort(mi)), n
            })), ss = Ge((function (t) {
                return ri(ve(t, 1, Yn, !0))
            })), as = Ge((function (t) {
                var e = Tn(t);
                return Yn(e) && (e = F), ri(ve(t, 1, Yn, !0), Zi(e, 2))
            })), cs = Ge((function (t) {
                var e = "function" == typeof (e = Tn(t)) ? e : F;
                return ri(ve(t, 1, Yn, !0), F, e)
            })), ls = Ge((function (t, e) {
                return Yn(t) ? fe(t, e) : []
            })), hs = Ge((function (t) {
                return ci(o(t, Yn))
            })), us = Ge((function (t) {
                var e = Tn(t);
                return Yn(e) && (e = F), ci(o(t, Yn), Zi(e, 2))
            })), fs = Ge((function (t) {
                var e = "function" == typeof (e = Tn(t)) ? e : F;
                return ci(o(t, Yn), F, e)
            })), ds = Ge(kn), ps = Ge((function (t) {
                var e = "function" == typeof (e = 1 < (e = t.length) ? t[e - 1] : F) ? (t.pop(), e) : F;
                return Pn(t, e)
            })), gs = $i((function (t) {
                function e(e) {
                    return ae(e, t)
                }

                var i = t.length, n = i ? t[0] : 0, r = this.__wrapped__;
                return !(1 < i || this.__actions__.length) && r instanceof Dt && an(n) ? ((r = r.slice(n, +n + (i ? 1 : 0))).__actions__.push({
                    func: An,
                    args: [e],
                    thisArg: F
                }), new jt(r, this.__chain__).thru((function (t) {
                    return i && !t.length && t.push(F), t
                }))) : this.thru(e)
            })), vs = wi((function (t, e, i) {
                Fr.call(t, i) ? ++t[i] : se(t, i, 1)
            })), ms = ji(xn), _s = ji(wn), bs = wi((function (t, e, i) {
                Fr.call(t, i) ? t[i].push(e) : se(t, i, [e])
            })), ys = Ge((function (e, i, n) {
                var r = -1, o = "function" == typeof i, s = Wn(e) ? Cr(e.length) : [];
                return Lo(e, (function (e) {
                    s[++r] = o ? t(i, e, n) : Ee(e, i, n)
                })), s
            })), xs = wi((function (t, e, i) {
                se(t, i, e)
            })), ws = wi((function (t, e, i) {
                t[i ? 0 : 1].push(e)
            }), (function () {
                return [[], []]
            })), Cs = Ge((function (t, e) {
                if (null == t) return [];
                var i = e.length;
                return 1 < i && cn(t, e[0], e[1]) ? e = [] : 2 < i && cn(e[0], e[1], e[2]) && (e = [e[0]]), Xe(t, ve(e, 1), [])
            })), Ss = io || function () {
                return Lt.Date.now()
            }, Ts = Ge((function (t, e, i) {
                var n = 1;
                if (i.length) {
                    var r = M(i, Qi(Ts));
                    n = 32 | n
                }
                return Hi(t, n, e, i, r)
            })), Os = Ge((function (t, e, i) {
                var n = 3;
                if (i.length) {
                    var r = M(i, Qi(Os));
                    n = 32 | n
                }
                return Hi(e, n, t, i, r)
            })), Es = Ge((function (t, e) {
                return ue(t, 1, e)
            })), ks = Ge((function (t, e, i) {
                return ue(t, nr(e) || 0, i)
            }));
            Bn.Cache = Rt;
            var Ps = Ge((function (e, i) {
                var n = (i = 1 == i.length && Fs(i[0]) ? c(i[0], S(Zi())) : c(ve(i, 1), S(Zi()))).length;
                return Ge((function (r) {
                    for (var o = -1, s = fo(r.length, n); ++o < s;) r[o] = i[o].call(this, r[o]);
                    return t(e, this, r)
                }))
            })), js = Ge((function (t, e) {
                return Hi(t, 32, F, e, M(e, Qi(js)))
            })), As = Ge((function (t, e) {
                return Hi(t, 64, F, e, M(e, Qi(As)))
            })), Ms = $i((function (t, e) {
                return Hi(t, 256, F, F, F, e)
            })), Ds = zi(Ce), Is = zi((function (t, e) {
                return t >= e
            })), Ls = ke(function () {
                return arguments
            }()) ? ke : function (t) {
                return $n(t) && Fr.call(t, "callee") && !qr.call(t, "callee")
            }, Fs = Cr.isArray, Rs = Wt ? S(Wt) : function (t) {
                return $n(t) && "[object ArrayBuffer]" == we(t)
            }, Bs = ao || wr, zs = Yt ? S(Yt) : function (t) {
                return $n(t) && "[object Date]" == we(t)
            }, Xs = Ht ? S(Ht) : function (t) {
                return $n(t) && "[object Map]" == Go(t)
            }, Ws = Ut ? S(Ut) : function (t) {
                return $n(t) && "[object RegExp]" == we(t)
            }, Ys = Nt ? S(Nt) : function (t) {
                return $n(t) && "[object Set]" == Go(t)
            }, Hs = Gt ? S(Gt) : function (t) {
                return $n(t) && Gn(t.length) && !!kt[we(t)]
            }, Us = zi(Ie), Ns = zi((function (t, e) {
                return t <= e
            })), Gs = Ci((function (t, e) {
                if (un(e) || Wn(e)) xi(e, cr(e), t); else for (var i in e) Fr.call(e, i) && ie(t, i, e[i])
            })), Vs = Ci((function (t, e) {
                xi(e, lr(e), t)
            })), $s = Ci((function (t, e, i, n) {
                xi(e, lr(e), t, n)
            })), qs = Ci((function (t, e, i, n) {
                xi(e, cr(e), t, n)
            })), Ks = $i(ae), Js = Ge((function (t, e) {
                t = kr(t);
                var i = -1, n = e.length;
                for ((r = 2 < n ? e[2] : F) && cn(e[0], e[1], r) && (n = 1); ++i < n;) for (var r, o = lr(r = e[i]), s = -1, a = o.length; ++s < a;) {
                    var c = o[s], l = t[c];
                    (l === F || Xn(l, Dr[c]) && !Fr.call(t, c)) && (t[c] = r[c])
                }
                return t
            })), Qs = Ge((function (e) {
                return e.push(F, Ni), t(na, F, e)
            })), Zs = Di((function (t, e, i) {
                null != e && "function" != typeof e.toString && (e = zr.call(e)), t[e] = i
            }), gr(vr)), ta = Di((function (t, e, i) {
                null != e && "function" != typeof e.toString && (e = zr.call(e)), Fr.call(t, e) ? t[e].push(i) : t[e] = [i]
            }), Zi), ea = Ge(Ee), ia = Ci((function (t, e, i) {
                Be(t, e, i)
            })), na = Ci((function (t, e, i, n) {
                Be(t, e, i, n)
            })), ra = $i((function (t, e) {
                var i = {};
                if (null == t) return i;
                var n = !1;
                e = c(e, (function (e) {
                    return e = fi(e, t), n || (n = 1 < e.length), e
                })), xi(t, Ki(t), i), n && (i = le(i, 7, Gi));
                for (var r = e.length; r--;) oi(i, e[r]);
                return i
            })), oa = $i((function (t, e) {
                return null == t ? {} : function (t, e) {
                    return We(t, e, (function (e, i) {
                        return ar(t, i)
                    }))
                }(t, e)
            })), sa = Yi(cr), aa = Yi(lr), ca = Ei((function (t, e, i) {
                return e = e.toLowerCase(), t + (i ? fr(e) : e)
            })), la = Ei((function (t, e, i) {
                return t + (i ? "-" : "") + e.toLowerCase()
            })), ha = Ei((function (t, e, i) {
                return t + (i ? " " : "") + e.toLowerCase()
            })), ua = Oi("toLowerCase"), fa = Ei((function (t, e, i) {
                return t + (i ? "_" : "") + e.toLowerCase()
            })), da = Ei((function (t, e, i) {
                return t + (i ? " " : "") + ga(e)
            })), pa = Ei((function (t, e, i) {
                return t + (i ? " " : "") + e.toUpperCase()
            })), ga = Oi("toUpperCase"), va = Ge((function (e, i) {
                try {
                    return t(e, F, i)
                } catch (t) {
                    return Hn(t) ? t : new Tr(t)
                }
            })), ma = $i((function (t, e) {
                return i(e, (function (e) {
                    e = mn(e), se(t, e, Ts(t[e], t))
                })), t
            })), _a = Ai(), ba = Ai(!0), ya = Ge((function (t, e) {
                return function (i) {
                    return Ee(i, t, e)
                }
            })), xa = Ge((function (t, e) {
                return function (i) {
                    return Ee(t, i, e)
                }
            })), wa = Li(c), Ca = Li(r), Sa = Li(f), Ta = Bi(), Oa = Bi(!0), Ea = Ii((function (t, e) {
                return t + e
            }), 0), ka = Wi("ceil"), Pa = Ii((function (t, e) {
                return t / e
            }), 1), ja = Wi("floor"), Aa = Ii((function (t, e) {
                return t * e
            }), 1), Ma = Wi("round"), Da = Ii((function (t, e) {
                return t - e
            }), 0);
            return yt.after = function (t, e) {
                if ("function" != typeof e) throw new Ar("Expected a function");
                return t = er(t), function () {
                    if (1 > --t) return e.apply(this, arguments)
                }
            }, yt.ary = Ln, yt.assign = Gs, yt.assignIn = Vs, yt.assignInWith = $s, yt.assignWith = qs, yt.at = Ks, yt.before = Fn, yt.bind = Ts, yt.bindAll = ma, yt.bindKey = Os, yt.castArray = function () {
                if (!arguments.length) return [];
                var t = arguments[0];
                return Fs(t) ? t : [t]
            }, yt.chain = jn, yt.chunk = function (t, e, i) {
                if (e = (i ? cn(t, e, i) : e === F) ? 1 : uo(er(e), 0), !(i = null == t ? 0 : t.length) || 1 > e) return [];
                for (var n = 0, r = 0, o = Cr(ro(i / e)); n < i;) o[r++] = Je(t, n, n += e);
                return o
            }, yt.compact = function (t) {
                for (var e = -1, i = null == t ? 0 : t.length, n = 0, r = []; ++e < i;) {
                    var o = t[e];
                    o && (r[n++] = o)
                }
                return r
            }, yt.concat = function () {
                var t = arguments.length;
                if (!t) return [];
                for (var e = Cr(t - 1), i = arguments[0]; t--;) e[t - 1] = arguments[t];
                return l(Fs(i) ? yi(i) : [i], ve(e, 1))
            }, yt.cond = function (e) {
                var i = null == e ? 0 : e.length, n = Zi();
                return e = i ? c(e, (function (t) {
                    if ("function" != typeof t[1]) throw new Ar("Expected a function");
                    return [n(t[0]), t[1]]
                })) : [], Ge((function (n) {
                    for (var r = -1; ++r < i;) {
                        var o = e[r];
                        if (t(o[0], this, n)) return t(o[1], this, n)
                    }
                }))
            }, yt.conforms = function (t) {
                return function (t) {
                    var e = cr(t);
                    return function (i) {
                        return he(i, t, e)
                    }
                }(le(t, 1))
            }, yt.constant = gr, yt.countBy = vs, yt.create = function (t, e) {
                var i = Io(t);
                return null == e ? i : oe(i, e)
            }, yt.curry = function t(e, i, n) {
                return (e = Hi(e, 8, F, F, F, F, F, i = n ? F : i)).placeholder = t.placeholder, e
            }, yt.curryRight = function t(e, i, n) {
                return (e = Hi(e, 16, F, F, F, F, F, i = n ? F : i)).placeholder = t.placeholder, e
            }, yt.debounce = Rn, yt.defaults = Js, yt.defaultsDeep = Qs, yt.defer = Es, yt.delay = ks, yt.difference = Qo, yt.differenceBy = Zo, yt.differenceWith = ts, yt.drop = function (t, e, i) {
                var n = null == t ? 0 : t.length;
                return n ? Je(t, 0 > (e = i || e === F ? 1 : er(e)) ? 0 : e, n) : []
            }, yt.dropRight = function (t, e, i) {
                var n = null == t ? 0 : t.length;
                return n ? Je(t, 0, 0 > (e = n - (e = i || e === F ? 1 : er(e))) ? 0 : e) : []
            }, yt.dropRightWhile = function (t, e) {
                return t && t.length ? si(t, Zi(e, 3), !0, !0) : []
            }, yt.dropWhile = function (t, e) {
                return t && t.length ? si(t, Zi(e, 3), !0) : []
            }, yt.fill = function (t, e, i, n) {
                var r = null == t ? 0 : t.length;
                if (!r) return [];
                for (i && "number" != typeof i && cn(t, e, i) && (i = 0, n = r), r = t.length, 0 > (i = er(i)) && (i = -i > r ? 0 : r + i), 0 > (n = n === F || n > r ? r : er(n)) && (n += r), n = i > n ? 0 : ir(n); i < n;) t[i++] = e;
                return t
            }, yt.filter = function (t, e) {
                return (Fs(t) ? o : ge)(t, Zi(e, 3))
            }, yt.flatMap = function (t, e) {
                return ve(In(t, e), 1)
            }, yt.flatMapDeep = function (t, e) {
                return ve(In(t, e), R)
            }, yt.flatMapDepth = function (t, e, i) {
                return i = i === F ? 1 : er(i), ve(In(t, e), i)
            }, yt.flatten = Cn, yt.flattenDeep = function (t) {
                return null != t && t.length ? ve(t, R) : []
            }, yt.flattenDepth = function (t, e) {
                return null != t && t.length ? ve(t, e = e === F ? 1 : er(e)) : []
            }, yt.flip = function (t) {
                return Hi(t, 512)
            }, yt.flow = _a, yt.flowRight = ba, yt.fromPairs = function (t) {
                for (var e = -1, i = null == t ? 0 : t.length, n = {}; ++e < i;) {
                    var r = t[e];
                    n[r[0]] = r[1]
                }
                return n
            }, yt.functions = function (t) {
                return null == t ? [] : be(t, cr(t))
            }, yt.functionsIn = function (t) {
                return null == t ? [] : be(t, lr(t))
            }, yt.groupBy = bs, yt.initial = function (t) {
                return null != t && t.length ? Je(t, 0, -1) : []
            }, yt.intersection = es, yt.intersectionBy = is, yt.intersectionWith = ns, yt.invert = Zs, yt.invertBy = ta, yt.invokeMap = ys, yt.iteratee = mr, yt.keyBy = xs, yt.keys = cr, yt.keysIn = lr, yt.map = In, yt.mapKeys = function (t, e) {
                var i = {};
                return e = Zi(e, 3), me(t, (function (t, n, r) {
                    se(i, e(t, n, r), t)
                })), i
            }, yt.mapValues = function (t, e) {
                var i = {};
                return e = Zi(e, 3), me(t, (function (t, n, r) {
                    se(i, n, e(t, n, r))
                })), i
            }, yt.matches = function (t) {
                return Fe(le(t, 1))
            }, yt.matchesProperty = function (t, e) {
                return Re(t, le(e, 1))
            }, yt.memoize = Bn, yt.merge = ia, yt.mergeWith = na, yt.method = ya, yt.methodOf = xa, yt.mixin = _r, yt.negate = zn, yt.nthArg = function (t) {
                return t = er(t), Ge((function (e) {
                    return ze(e, t)
                }))
            }, yt.omit = ra, yt.omitBy = function (t, e) {
                return hr(t, zn(Zi(e)))
            }, yt.once = function (t) {
                return Fn(2, t)
            }, yt.orderBy = function (t, e, i, n) {
                return null == t ? [] : (Fs(e) || (e = null == e ? [] : [e]), Fs(i = n ? F : i) || (i = null == i ? [] : [i]), Xe(t, e, i))
            }, yt.over = wa, yt.overArgs = Ps, yt.overEvery = Ca, yt.overSome = Sa, yt.partial = js, yt.partialRight = As, yt.partition = ws, yt.pick = oa, yt.pickBy = hr, yt.property = yr, yt.propertyOf = function (t) {
                return function (e) {
                    return null == t ? F : ye(t, e)
                }
            }, yt.pull = rs, yt.pullAll = On, yt.pullAllBy = function (t, e, i) {
                return t && t.length && e && e.length ? Ye(t, e, Zi(i, 2)) : t
            }, yt.pullAllWith = function (t, e, i) {
                return t && t.length && e && e.length ? Ye(t, e, F, i) : t
            }, yt.pullAt = os, yt.range = Ta, yt.rangeRight = Oa, yt.rearg = Ms, yt.reject = function (t, e) {
                return (Fs(t) ? o : ge)(t, zn(Zi(e, 3)))
            }, yt.remove = function (t, e) {
                var i = [];
                if (!t || !t.length) return i;
                var n = -1, r = [], o = t.length;
                for (e = Zi(e, 3); ++n < o;) {
                    var s = t[n];
                    e(s, n, t) && (i.push(s), r.push(n))
                }
                return He(t, r), i
            }, yt.rest = function (t, e) {
                if ("function" != typeof t) throw new Ar("Expected a function");
                return Ge(t, e = e === F ? e : er(e))
            }, yt.reverse = En,yt.sampleSize = function (t, e, i) {
                return e = (i ? cn(t, e, i) : e === F) ? 1 : er(e), (Fs(t) ? Zt : $e)(t, e)
            },yt.set = function (t, e, i) {
                return null == t ? t : qe(t, e, i)
            },yt.setWith = function (t, e, i, n) {
                return n = "function" == typeof n ? n : F, null == t ? t : qe(t, e, i, n)
            },yt.shuffle = function (t) {
                return (Fs(t) ? te : Ke)(t)
            },yt.slice = function (t, e, i) {
                var n = null == t ? 0 : t.length;
                return n ? (i && "number" != typeof i && cn(t, e, i) ? (e = 0, i = n) : (e = null == e ? 0 : er(e), i = i === F ? n : er(i)), Je(t, e, i)) : []
            },yt.sortBy = Cs,yt.sortedUniq = function (t) {
                return t && t.length ? ei(t) : []
            },yt.sortedUniqBy = function (t, e) {
                return t && t.length ? ei(t, Zi(e, 2)) : []
            },yt.split = function (t, e, i) {
                return i && "number" != typeof i && cn(t, e, i) && (e = i = F), (i = i === F ? 4294967295 : i >>> 0) ? (t = or(t)) && ("string" == typeof e || null != e && !Ws(e)) && (!(e = ni(e)) && Tt.test(t)) ? di(L(t), 0, i) : t.split(e, i) : []
            },yt.spread = function (e, i) {
                if ("function" != typeof e) throw new Ar("Expected a function");
                return i = null == i ? 0 : uo(er(i), 0), Ge((function (n) {
                    var r = n[i];
                    return n = di(n, 0, i), r && l(n, r), t(e, this, n)
                }))
            },yt.tail = function (t) {
                var e = null == t ? 0 : t.length;
                return e ? Je(t, 1, e) : []
            },yt.take = function (t, e, i) {
                return t && t.length ? Je(t, 0, 0 > (e = i || e === F ? 1 : er(e)) ? 0 : e) : []
            },yt.takeRight = function (t, e, i) {
                var n = null == t ? 0 : t.length;
                return n ? Je(t, 0 > (e = n - (e = i || e === F ? 1 : er(e))) ? 0 : e, n) : []
            },yt.takeRightWhile = function (t, e) {
                return t && t.length ? si(t, Zi(e, 3), !1, !0) : []
            },yt.takeWhile = function (t, e) {
                return t && t.length ? si(t, Zi(e, 3)) : []
            },yt.tap = function (t, e) {
                return e(t), t
            },yt.throttle = function (t, e, i) {
                var n = !0, r = !0;
                if ("function" != typeof t) throw new Ar("Expected a function");
                return Vn(i) && (n = "leading" in i ? !!i.leading : n, r = "trailing" in i ? !!i.trailing : r), Rn(t, e, {
                    leading: n,
                    maxWait: e,
                    trailing: r
                })
            },yt.thru = An,yt.toArray = Zn,yt.toPairs = sa,yt.toPairsIn = aa,yt.toPath = function (t) {
                return Fs(t) ? c(t, mn) : Qn(t) ? [t] : yi(Jo(or(t)))
            },yt.toPlainObject = rr,yt.transform = function (t, e, n) {
                var r = Fs(t), o = r || Bs(t) || Hs(t);
                if (e = Zi(e, 4), null == n) {
                    var s = t && t.constructor;
                    n = o ? r ? new s : [] : Vn(t) && Un(s) ? Io(Vr(t)) : {}
                }
                return (o ? i : me)(t, (function (t, i, r) {
                    return e(n, t, i, r)
                })), n
            },yt.unary = function (t) {
                return Ln(t, 1)
            },yt.union = ss,yt.unionBy = as,yt.unionWith = cs,yt.uniq = function (t) {
                return t && t.length ? ri(t) : []
            },yt.uniqBy = function (t, e) {
                return t && t.length ? ri(t, Zi(e, 2)) : []
            },yt.uniqWith = function (t, e) {
                return e = "function" == typeof e ? e : F, t && t.length ? ri(t, F, e) : []
            },yt.unset = function (t, e) {
                return null == t || oi(t, e)
            },yt.unzip = kn,yt.unzipWith = Pn,yt.update = function (t, e, i) {
                return null == t ? t : qe(t, e, ui(i)(ye(t, e)), void 0)
            },yt.updateWith = function (t, e, i, n) {
                return n = "function" == typeof n ? n : F, null != t && (t = qe(t, e, ui(i)(ye(t, e)), n)), t
            },yt.values = ur,yt.valuesIn = function (t) {
                return null == t ? [] : T(t, lr(t))
            },yt.without = ls,yt.words = pr,yt.wrap = function (t, e) {
                return js(ui(e), t)
            },yt.xor = hs,yt.xorBy = us,yt.xorWith = fs,yt.zip = ds,yt.zipObject = function (t, e) {
                return li(t || [], e || [], ie)
            },yt.zipObjectDeep = function (t, e) {
                return li(t || [], e || [], qe)
            },yt.zipWith = ps,yt.entries = sa,yt.entriesIn = aa,yt.extend = Vs,yt.extendWith = $s,_r(yt, yt),yt.add = Ea,yt.attempt = va,yt.camelCase = ca,yt.capitalize = fr,yt.ceil = ka,yt.clamp = function (t, e, i) {
                return i === F && (i = e, e = F), i !== F && (i = (i = nr(i)) == i ? i : 0), e !== F && (e = (e = nr(e)) == e ? e : 0), ce(nr(t), e, i)
            },yt.clone = function (t) {
                return le(t, 4)
            },yt.cloneDeep = function (t) {
                return le(t, 5)
            },yt.cloneDeepWith = function (t, e) {
                return le(t, 5, e = "function" == typeof e ? e : F)
            },yt.cloneWith = function (t, e) {
                return le(t, 4, e = "function" == typeof e ? e : F)
            },yt.conformsTo = function (t, e) {
                return null == e || he(t, e, cr(e))
            },yt.deburr = dr,yt.defaultTo = function (t, e) {
                return null == t || t != t ? e : t
            },yt.divide = Pa,yt.endsWith = function (t, e, i) {
                t = or(t), e = ni(e);
                var n = t.length;
                n = i = i === F ? n : ce(er(i), 0, n);
                return 0 <= (i -= e.length) && t.slice(i, n) == e
            },yt.eq = Xn,yt.escape = function (t) {
                return (t = or(t)) && G.test(t) ? t.replace(U, qt) : t
            },yt.escapeRegExp = function (t) {
                return (t = or(t)) && tt.test(t) ? t.replace(Z, "\\$&") : t
            },yt.every = function (t, e, i) {
                var n = Fs(t) ? r : de;
                return i && cn(t, e, i) && (e = F), n(t, Zi(e, 3))
            },yt.find = ms,yt.findIndex = xn,yt.findKey = function (t, e) {
                return d(t, Zi(e, 3), me)
            },yt.findLast = _s,yt.findLastIndex = wn,yt.findLastKey = function (t, e) {
                return d(t, Zi(e, 3), _e)
            },yt.floor = ja,yt.forEach = Mn,yt.forEachRight = Dn,yt.forIn = function (t, e) {
                return null == t ? t : Ro(t, Zi(e, 3), lr)
            },yt.forInRight = function (t, e) {
                return null == t ? t : Bo(t, Zi(e, 3), lr)
            },yt.forOwn = function (t, e) {
                return t && me(t, Zi(e, 3))
            },yt.forOwnRight = function (t, e) {
                return t && _e(t, Zi(e, 3))
            },yt.get = sr,yt.gt = Ds,yt.gte = Is,yt.has = function (t, e) {
                return null != t && rn(t, e, Se)
            },yt.hasIn = ar,yt.head = Sn,yt.identity = vr,yt.includes = function (t, e, i, n) {
                return t = Wn(t) ? t : ur(t), i = i && !n ? er(i) : 0, n = t.length, 0 > i && (i = uo(n + i, 0)), Jn(t) ? i <= n && -1 < t.indexOf(e, i) : !!n && -1 < g(t, e, i)
            },yt.indexOf = function (t, e, i) {
                var n = null == t ? 0 : t.length;
                return n ? (0 > (i = null == i ? 0 : er(i)) && (i = uo(n + i, 0)), g(t, e, i)) : -1
            },yt.inRange = function (t, e, i) {
                return e = tr(e), i === F ? (i = e, e = 0) : i = tr(i), (t = nr(t)) >= fo(e, i) && t < uo(e, i)
            },yt.invoke = ea,yt.isArguments = Ls,yt.isArray = Fs,yt.isArrayBuffer = Rs,yt.isArrayLike = Wn,yt.isArrayLikeObject = Yn,yt.isBoolean = function (t) {
                return !0 === t || !1 === t || $n(t) && "[object Boolean]" == we(t)
            },yt.isBuffer = Bs,yt.isDate = zs,yt.isElement = function (t) {
                return $n(t) && 1 === t.nodeType && !Kn(t)
            },yt.isEmpty = function (t) {
                if (null == t) return !0;
                if (Wn(t) && (Fs(t) || "string" == typeof t || "function" == typeof t.splice || Bs(t) || Hs(t) || Ls(t))) return !t.length;
                var e = Go(t);
                if ("[object Map]" == e || "[object Set]" == e) return !t.size;
                if (un(t)) return !De(t).length;
                for (var i in t) if (Fr.call(t, i)) return !1;
                return !0
            },yt.isEqual = function (t, e) {
                return Pe(t, e)
            },yt.isEqualWith = function (t, e, i) {
                var n = (i = "function" == typeof i ? i : F) ? i(t, e) : F;
                return n === F ? Pe(t, e, F, i) : !!n
            },yt.isError = Hn,yt.isFinite = function (t) {
                return "number" == typeof t && co(t)
            },yt.isFunction = Un,yt.isInteger = Nn,yt.isLength = Gn,yt.isMap = Xs,yt.isMatch = function (t, e) {
                return t === e || je(t, e, en(e))
            },yt.isMatchWith = function (t, e, i) {
                return i = "function" == typeof i ? i : F, je(t, e, en(e), i)
            },yt.isNaN = function (t) {
                return qn(t) && t != +t
            },yt.isNative = function (t) {
                if (Vo(t)) throw new Tr("Unsupported core-js use. Try https://npms.io/search?q=ponyfill.");
                return Ae(t)
            },yt.isNil = function (t) {
                return null == t
            },yt.isNull = function (t) {
                return null === t
            },yt.isNumber = qn,yt.isObject = Vn,yt.isObjectLike = $n,yt.isPlainObject = Kn,yt.isRegExp = Ws,yt.isSafeInteger = function (t) {
                return Nn(t) && -9007199254740991 <= t && 9007199254740991 >= t
            },yt.isSet = Ys,yt.isString = Jn,yt.isSymbol = Qn,yt.isTypedArray = Hs,yt.isUndefined = function (t) {
                return t === F
            },yt.isWeakMap = function (t) {
                return $n(t) && "[object WeakMap]" == Go(t)
            },yt.isWeakSet = function (t) {
                return $n(t) && "[object WeakSet]" == we(t)
            },yt.join = function (t, e) {
                return null == t ? "" : lo.call(t, e)
            },yt.kebabCase = la,yt.last = Tn,yt.lastIndexOf = function (t, e, i) {
                var n = null == t ? 0 : t.length;
                if (!n) return -1;
                var r = n;
                if (i !== F && (r = 0 > (r = er(i)) ? uo(n + r, 0) : fo(r, n - 1)), e == e) {
                    for (i = r + 1; i-- && t[i] !== e;) ;
                    t = i
                } else t = p(t, m, r, !0);
                return t
            },yt.lowerCase = ha,yt.lowerFirst = ua,yt.lt = Us,yt.lte = Ns,yt.max = function (t) {
                return t && t.length ? pe(t, vr, Ce) : F
            },yt.maxBy = function (t, e) {
                return t && t.length ? pe(t, Zi(e, 2), Ce) : F
            },yt.mean = function (t) {
                return _(t, vr)
            },yt.meanBy = function (t, e) {
                return _(t, Zi(e, 2))
            },yt.min = function (t) {
                return t && t.length ? pe(t, vr, Ie) : F
            },yt.minBy = function (t, e) {
                return t && t.length ? pe(t, Zi(e, 2), Ie) : F
            },yt.stubArray = xr,yt.stubFalse = wr,yt.stubObject = function () {
                return {}
            },yt.stubString = function () {
                return ""
            },yt.stubTrue = function () {
                return !0
            },yt.multiply = Aa,yt.nth = function (t, e) {
                return t && t.length ? ze(t, er(e)) : F
            },yt.noConflict = function () {
                return Lt._ === this && (Lt._ = Wr), this
            },yt.noop = br,yt.now = Ss,yt.pad = function (t, e, i) {
                t = or(t);
                var n = (e = er(e)) ? I(t) : 0;
                return !e || n >= e ? t : Fi(oo(e = (e - n) / 2), i) + t + Fi(ro(e), i)
            },yt.padEnd = function (t, e, i) {
                t = or(t);
                var n = (e = er(e)) ? I(t) : 0;
                return e && n < e ? t + Fi(e - n, i) : t
            },yt.padStart = function (t, e, i) {
                t = or(t);
                var n = (e = er(e)) ? I(t) : 0;
                return e && n < e ? Fi(e - n, i) + t : t
            },yt.parseInt = function (t, e, i) {
                return i || null == e ? e = 0 : e && (e = +e), go(or(t).replace(it, ""), e || 0)
            },yt.random = function (t, e, i) {
                if (i && "boolean" != typeof i && cn(t, e, i) && (e = i = F), i === F && ("boolean" == typeof e ? (i = e, e = F) : "boolean" == typeof t && (i = t, t = F)), t === F && e === F ? (t = 0, e = 1) : (t = tr(t), e === F ? (e = t, t = 0) : e = tr(e)), t > e) {
                    var n = t;
                    t = e, e = n
                }
                return i || t % 1 || e % 1 ? (i = vo(), fo(t + i * (e - t + At("1e-" + ((i + "").length - 1))), e)) : Ue(t, e)
            },yt.reduce = function (t, e, i) {
                var n = Fs(t) ? h : x, r = 3 > arguments.length;
                return n(t, Zi(e, 4), i, r, Lo)
            },yt.reduceRight = function (t, e, i) {
                var n = Fs(t) ? u : x, r = 3 > arguments.length;
                return n(t, Zi(e, 4), i, r, Fo)
            },yt.repeat = function (t, e, i) {
                return e = (i ? cn(t, e, i) : e === F) ? 1 : er(e), Ne(or(t), e)
            },yt.replace = function () {
                var t = arguments, e = or(t[0]);
                return 3 > t.length ? e : e.replace(t[1], t[2])
            },yt.result = function (t, e, i) {
                var n = -1, r = (e = fi(e, t)).length;
                for (r || (r = 1, t = F); ++n < r;) {
                    var o = null == t ? F : t[mn(e[n])];
                    o === F && (n = r, o = i), t = Un(o) ? o.call(t) : o
                }
                return t
            },yt.round = Ma,yt.runInContext = y,yt.sample = function (t) {
                return (Fs(t) ? Qt : Ve)(t)
            },yt.size = function (t) {
                if (null == t) return 0;
                if (Wn(t)) return Jn(t) ? I(t) : t.length;
                var e = Go(t);
                return "[object Map]" == e || "[object Set]" == e ? t.size : De(t).length
            },yt.snakeCase = fa,yt.some = function (t, e, i) {
                var n = Fs(t) ? f : Qe;
                return i && cn(t, e, i) && (e = F), n(t, Zi(e, 3))
            },yt.sortedIndex = function (t, e) {
                return Ze(t, e)
            },yt.sortedIndexBy = function (t, e, i) {
                return ti(t, e, Zi(i, 2))
            },yt.sortedIndexOf = function (t, e) {
                var i = null == t ? 0 : t.length;
                if (i) {
                    var n = Ze(t, e);
                    if (n < i && Xn(t[n], e)) return n
                }
                return -1
            },yt.sortedLastIndex = function (t, e) {
                return Ze(t, e, !0)
            },yt.sortedLastIndexBy = function (t, e, i) {
                return ti(t, e, Zi(i, 2), !0)
            },yt.sortedLastIndexOf = function (t, e) {
                if (null != t && t.length) {
                    var i = Ze(t, e, !0) - 1;
                    if (Xn(t[i], e)) return i
                }
                return -1
            },yt.startCase = da,yt.startsWith = function (t, e, i) {
                return t = or(t), i = null == i ? 0 : ce(er(i), 0, t.length), e = ni(e), t.slice(i, i + e.length) == e
            },yt.subtract = Da,yt.sum = function (t) {
                return t && t.length ? w(t, vr) : 0
            },yt.sumBy = function (t, e) {
                return t && t.length ? w(t, Zi(e, 2)) : 0
            },yt.template = function (t, e, i) {
                var n = yt.templateSettings;
                i && cn(t, e, i) && (e = F), t = or(t), e = $s({}, e, n, Ui);
                var r, o, s = cr(i = $s({}, e.imports, n.imports, Ui)), a = T(i, s), c = 0;
                i = e.interpolate || mt;
                var l = "__p+='";
                i = Pr((e.escape || mt).source + "|" + i.source + "|" + (i === q ? lt : mt).source + "|" + (e.evaluate || mt).source + "|$", "g");
                var h = "sourceURL" in e ? "//# sourceURL=" + e.sourceURL + "\n" : "";
                if (t.replace(i, (function (e, i, n, s, a, h) {
                    return n || (n = s), l += t.slice(c, h).replace(_t, P), i && (r = !0, l += "'+__e(" + i + ")+'"), a && (o = !0, l += "';" + a + ";\n__p+='"), n && (l += "'+((__t=(" + n + "))==null?'':__t)+'"), c = h + e.length, e
                })), l += "';", (e = e.variable) || (l = "with(obj){" + l + "}"), l = (o ? l.replace(X, "") : l).replace(W, "$1").replace(Y, "$1;"), l = "function(" + (e || "obj") + "){" + (e ? "" : "obj||(obj={});") + "var __t,__p=''" + (r ? ",__e=_.escape" : "") + (o ? ",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}" : ";") + l + "return __p}", (e = va((function () {
                    return Or(s, h + "return " + l).apply(F, a)
                }))).source = l, Hn(e)) throw e;
                return e
            },yt.times = function (t, e) {
                if (1 > (t = er(t)) || 9007199254740991 < t) return [];
                var i = 4294967295, n = fo(t, 4294967295);
                for (t -= 4294967295, n = C(n, e = Zi(e)); ++i < t;) e(i);
                return n
            },yt.toFinite = tr,yt.toInteger = er,yt.toLength = ir,yt.toLower = function (t) {
                return or(t).toLowerCase()
            },yt.toNumber = nr,yt.toSafeInteger = function (t) {
                return t ? ce(er(t), -9007199254740991, 9007199254740991) : 0 === t ? t : 0
            },yt.toString = or,yt.toUpper = function (t) {
                return or(t).toUpperCase()
            },yt.trim = function (t, e, i) {
                return (t = or(t)) && (i || e === F) ? t.replace(et, "") : t && (e = ni(e)) ? di(t = L(t), e = E(t, i = L(e)), i = k(t, i) + 1).join("") : t
            },yt.trimEnd = function (t, e, i) {
                return (t = or(t)) && (i || e === F) ? t.replace(nt, "") : t && (e = ni(e)) ? di(t = L(t), 0, e = k(t, L(e)) + 1).join("") : t
            },yt.trimStart = function (t, e, i) {
                return (t = or(t)) && (i || e === F) ? t.replace(it, "") : t && (e = ni(e)) ? di(t = L(t), e = E(t, L(e))).join("") : t
            },yt.truncate = function (t, e) {
                var i = 30, n = "...";
                if (Vn(e)) {
                    var r = "separator" in e ? e.separator : r;
                    i = "length" in e ? er(e.length) : i, n = "omission" in e ? ni(e.omission) : n
                }
                var o = (t = or(t)).length;
                if (Tt.test(t)) {
                    var s = L(t);
                    o = s.length
                }
                if (i >= o) return t;
                if (1 > (o = i - I(n))) return n;
                if (i = s ? di(s, 0, o).join("") : t.slice(0, o), r === F) return i + n;
                if (s && (o += i.length - o), Ws(r)) {
                    if (t.slice(o).search(r)) {
                        var a = i;
                        for (r.global || (r = Pr(r.source, or(ht.exec(r)) + "g")), r.lastIndex = 0; s = r.exec(a);) var c = s.index;
                        i = i.slice(0, c === F ? o : c)
                    }
                } else t.indexOf(ni(r), o) != o && (-1 < (r = i.lastIndexOf(r)) && (i = i.slice(0, r)));
                return i + n
            },yt.unescape = function (t) {
                return (t = or(t)) && N.test(t) ? t.replace(H, Kt) : t
            },yt.uniqueId = function (t) {
                var e = ++Rr;
                return or(t) + e
            },yt.upperCase = pa,yt.upperFirst = ga,yt.each = Mn,yt.eachRight = Dn,yt.first = Sn,_r(yt, function () {
                var t = {};
                return me(yt, (function (e, i) {
                    Fr.call(yt.prototype, i) || (t[i] = e)
                })), t
            }(), {chain: !1}),yt.VERSION = "4.17.10",i("bind bindKey curry curryRight partial partialRight".split(" "), (function (t) {
                yt[t].placeholder = yt
            })),i(["drop", "take"], (function (t, e) {
                Dt.prototype[t] = function (i) {
                    i = i === F ? 1 : uo(er(i), 0);
                    var n = this.__filtered__ && !e ? new Dt(this) : this.clone();
                    return n.__filtered__ ? n.__takeCount__ = fo(i, n.__takeCount__) : n.__views__.push({
                        size: fo(i, 4294967295),
                        type: t + (0 > n.__dir__ ? "Right" : "")
                    }), n
                }, Dt.prototype[t + "Right"] = function (e) {
                    return this.reverse()[t](e).reverse()
                }
            })),i(["filter", "map", "takeWhile"], (function (t, e) {
                var i = e + 1, n = 1 == i || 3 == i;
                Dt.prototype[t] = function (t) {
                    var e = this.clone();
                    return e.__iteratees__.push({iteratee: Zi(t, 3), type: i}), e.__filtered__ = e.__filtered__ || n, e
                }
            })),i(["head", "last"], (function (t, e) {
                var i = "take" + (e ? "Right" : "");
                Dt.prototype[t] = function () {
                    return this[i](1).value()[0]
                }
            })),i(["initial", "tail"], (function (t, e) {
                var i = "drop" + (e ? "" : "Right");
                Dt.prototype[t] = function () {
                    return this.__filtered__ ? new Dt(this) : this[i](1)
                }
            })),Dt.prototype.compact = function () {
                return this.filter(vr)
            },Dt.prototype.find = function (t) {
                return this.filter(t).head()
            },Dt.prototype.findLast = function (t) {
                return this.reverse().find(t)
            },Dt.prototype.invokeMap = Ge((function (t, e) {
                return "function" == typeof t ? new Dt(this) : this.map((function (i) {
                    return Ee(i, t, e)
                }))
            })),Dt.prototype.reject = function (t) {
                return this.filter(zn(Zi(t)))
            },Dt.prototype.slice = function (t, e) {
                t = er(t);
                var i = this;
                return i.__filtered__ && (0 < t || 0 > e) ? new Dt(i) : (0 > t ? i = i.takeRight(-t) : t && (i = i.drop(t)), e !== F && (i = 0 > (e = er(e)) ? i.dropRight(-e) : i.take(e - t)), i)
            },Dt.prototype.takeRightWhile = function (t) {
                return this.reverse().takeWhile(t).reverse()
            },Dt.prototype.toArray = function () {
                return this.take(4294967295)
            },me(Dt.prototype, (function (t, e) {
                var i = /^(?:filter|find|map|reject)|While$/.test(e), n = /^(?:head|last)$/.test(e),
                    r = yt[n ? "take" + ("last" == e ? "Right" : "") : e], o = n || /^find/.test(e);
                r && (yt.prototype[e] = function () {
                    function e(t) {
                        return t = r.apply(yt, l([t], a)), n && f ? t[0] : t
                    }

                    var s = this.__wrapped__, a = n ? [1] : arguments, c = s instanceof Dt, h = a[0], u = c || Fs(s);
                    u && i && "function" == typeof h && 1 != h.length && (c = u = !1);
                    var f = this.__chain__, d = !!this.__actions__.length;
                    h = o && !f, c = c && !d;
                    return !o && u ? (s = c ? s : new Dt(this), (s = t.apply(s, a)).__actions__.push({
                        func: An,
                        args: [e],
                        thisArg: F
                    }), new jt(s, f)) : h && c ? t.apply(this, a) : (s = this.thru(e), h ? n ? s.value()[0] : s.value() : s)
                })
            })),i("pop push shift sort splice unshift".split(" "), (function (t) {
                var e = Mr[t], i = /^(?:push|sort|unshift)$/.test(t) ? "tap" : "thru", n = /^(?:pop|shift)$/.test(t);
                yt.prototype[t] = function () {
                    var t = arguments;
                    if (n && !this.__chain__) {
                        var r = this.value();
                        return e.apply(Fs(r) ? r : [], t)
                    }
                    return this[i]((function (i) {
                        return e.apply(Fs(i) ? i : [], t)
                    }))
                }
            })),me(Dt.prototype, (function (t, e) {
                var i = yt[e];
                if (i) {
                    var n = i.name + "";
                    (To[n] || (To[n] = [])).push({name: e, func: i})
                }
            })),To[Mi(F, 2).name] = [{name: "wrapper", func: F}],Dt.prototype.clone = function () {
                var t = new Dt(this.__wrapped__);
                return t.__actions__ = yi(this.__actions__), t.__dir__ = this.__dir__, t.__filtered__ = this.__filtered__, t.__iteratees__ = yi(this.__iteratees__), t.__takeCount__ = this.__takeCount__, t.__views__ = yi(this.__views__), t
            },Dt.prototype.reverse = function () {
                if (this.__filtered__) {
                    var t = new Dt(this);
                    t.__dir__ = -1, t.__filtered__ = !0
                } else (t = this.clone()).__dir__ *= -1;
                return t
            },Dt.prototype.value = function () {
                var t, e = this.__wrapped__.value(), i = this.__dir__, n = Fs(e), r = 0 > i, o = n ? e.length : 0;
                t = o;
                for (var s = this.__views__, a = 0, c = -1, l = s.length; ++c < l;) {
                    var h = s[c], u = h.size;
                    switch (h.type) {
                        case"drop":
                            a += u;
                            break;
                        case"dropRight":
                            t -= u;
                            break;
                        case"take":
                            t = fo(t, a + u);
                            break;
                        case"takeRight":
                            a = uo(a, t - u)
                    }
                }
                if (s = (t = {
                    start: a,
                    end: t
                }).start, t = (a = t.end) - s, s = r ? a : s - 1, c = (a = this.__iteratees__).length, l = 0, h = fo(t, this.__takeCount__), !n || !r && o == t && h == t) return ai(e, this.__actions__);
                n = [];
                t:for (; t-- && l < h;) {
                    for (r = -1, o = e[s += i]; ++r < c;) {
                        u = (f = a[r]).type;
                        var f = (0, f.iteratee)(o);
                        if (2 == u) o = f; else if (!f) {
                            if (1 == u) continue t;
                            break t
                        }
                    }
                    n[l++] = o
                }
                return n
            },yt.prototype.at = gs,yt.prototype.chain = function () {
                return jn(this)
            },yt.prototype.commit = function () {
                return new jt(this.value(), this.__chain__)
            },yt.prototype.next = function () {
                this.__values__ === F && (this.__values__ = Zn(this.value()));
                var t = this.__index__ >= this.__values__.length;
                return {done: t, value: t ? F : this.__values__[this.__index__++]}
            },yt.prototype.plant = function (t) {
                for (var e, i = this; i instanceof Ct;) {
                    var n = yn(i);
                    n.__index__ = 0, n.__values__ = F, e ? r.__wrapped__ = n : e = n;
                    var r = n;
                    i = i.__wrapped__
                }
                return r.__wrapped__ = t, e
            },yt.prototype.reverse = function () {
                var t = this.__wrapped__;
                return t instanceof Dt ? (this.__actions__.length && (t = new Dt(this)), (t = t.reverse()).__actions__.push({
                    func: An,
                    args: [En],
                    thisArg: F
                }), new jt(t, this.__chain__)) : this.thru(En)
            },yt.prototype.toJSON = yt.prototype.valueOf = yt.prototype.value = function () {
                return ai(this.__wrapped__, this.__actions__)
            },yt.prototype.first = yt.prototype.head,Qr && (yt.prototype[Qr] = function () {
                return this
            }),yt
        }();
    "function" == typeof define && "object" == typeof define.amd && define.amd ? (Lt._ = Jt, define((function () {
        return Jt
    }))) : Rt ? ((Rt.exports = Jt)._ = Jt, Ft._ = Jt) : Lt._ = Jt
}.call(this),function (t) {
    var e = t.fabric || (t.fabric = {}), i = e.util.object.extend;
    e.util.object.clone;
    if (e.CurvedText) e.warn("fabric.CurvedText is already defined"); else {
        var n = e.Text.prototype.stateProperties.concat();
        n.push("radius", "spacing", "reverse", "effect", "range", "largeFont", "smallFont");
        var r = e.Text.prototype._dimensionAffectingProps.concat(["radius", "spacing", "reverse", "fill", "effect", "width", "height", "range", "fontSize", "shadow", "largeFont", "smallFont"]),
            o = ["backgroundColor", "textBackgroundColor", "textDecoration", "stroke", "strokeWidth", "shadow", "fontWeight", "fontStyle", "strokeWidth", "textAlign"];
        e.CurvedText = e.util.createClass(e.Text, e.Collection, {
            type: "curvedText",
            radius: 50,
            range: 5,
            smallFont: 10,
            largeFont: 30,
            effect: "curved",
            spacing: 20,
            reverse: !1,
            stateProperties: n,
            _dimensionAffectingProps: r,
            _isRendering: 0,
            complexity: function () {
                this.callSuper("complexity")
            },
            initialize: function (t, i) {
                i || (i = {}), this.__skipDimension = !0, delete i.text, this.setOptions(i), this.__skipDimension = !1, this.callSuper("initialize", t, i), this.letters = new e.Group([], {
                    selectable: !1,
                    padding: 0
                }), this.setText(t)
            },
            setText: function (t) {
                if (this.letters) {
                    for (; this.letters.size();) this.letters.remove(this.letters.item(0));
                    for (var i = 0; i < t.length; i++) void 0 === this.letters.item(i) ? this.letters.add(new e.IText(t[i])) : this.letters.item(i).text = t[i]
                }
                this.text = t;
                for (i = this.letters.size(); i--;) {
                    this.letters.item(i).set({
                        objectCaching: !1,
                        fill: this.fill,
                        stroke: this.stroke,
                        strokeWidth: this.strokeWidth,
                        fontFamily: this.fontFamily,
                        fontSize: this.fontSize,
                        fontStyle: this.fontStyle,
                        fontWeight: this.fontWeight,
                        underline: this.underline,
                        overline: this.overline,
                        linethrough: this.linethrough,
                        lineHeight: this.lineHeight
                    })
                }
                this._updateLetters(), this.canvas && this.canvas.renderAll()
            },
            _initDimensions: function (t) {
                if (!this.__skipDimension) {
                    t || (t = e.util.createCanvasElement().getContext("2d"), this._setTextStyles(t)), this._textLines = this.text.split(this._reNewline), this._clearCache();
                    var i = this.textAlign;
                    this.textAlign = "left", this.width = this.get("width"), this.textAlign = i, this.height = this.get("height"), this._updateLetters()
                }
            },
            _updateLetters: function () {
                var t = e.util.getRandomInt(100, 999);
                if (this._isRendering = t, this.letters && this.text) {
                    var i = 0, n = 0, r = 0, s = parseInt(this.spacing), a = 0;
                    if ("curved" === this.effect) {
                        for (var c = 0, l = this.text.length; c < l; c++) r += this.letters.item(c).width + s;
                        r -= s
                    } else "arc" === this.effect && (a = (this.letters.item(0).fontSize + s) / this.radius / (Math.PI / 180), r = (this.text.length + 1) * (this.letters.item(0).fontSize + s));
                    i = -r / 2 / this.radius / (Math.PI / 180), this.reverse && (i = -i);
                    var h = 0, u = this.reverse ? -1 : 1, f = 0, d = 0;
                    for (c = 0, l = this.text.length; c < l; c++) {
                        if (t !== this._isRendering) return;
                        for (var p in o) this.letters.item(c).set(p, this.get(p));
                        if (this.letters.item(c).set("left", h), this.letters.item(c).set("top", 0), this.letters.item(c).set("angle", 0), this.letters.item(c).set("padding", 0), "curved" === this.effect) f = (this.letters.item(c).width + s) / this.radius / (Math.PI / 180), n = (i = u * (u * i + d)) * (Math.PI / 180), d = f, this.letters.item(c).set("angle", i), this.letters.item(c).set("top", -1 * u * (Math.cos(n) * this.radius)), this.letters.item(c).set("left", u * (Math.sin(n) * this.radius)), this.letters.item(c).set("padding", 0), this.letters.item(c).set("selectable", !1); else if ("arc" === this.effect) n = (i = u * (u * i + a)) * (Math.PI / 180), this.letters.item(c).set("top", -1 * u * (Math.cos(n) * this.radius)), this.letters.item(c).set("left", u * (Math.sin(n) * this.radius)), this.letters.item(c).set("padding", 0), this.letters.item(c).set("selectable", !1); else if ("STRAIGHT" === this.effect) this.letters.item(c).set("left", h), this.letters.item(c).set("top", 0), this.letters.item(c).set("angle", 0), h += this.letters.item(c).get("width"), this.letters.item(c).set("padding", 0), this.letters.item(c).set({
                            borderColor: "red",
                            cornerColor: "green",
                            cornerSize: 6,
                            transparentCorners: !1
                        }), this.letters.item(c).set("selectable", !1); else if ("smallToLarge" === this.effect) {
                            var g = parseInt(this.smallFont), v = (b = parseInt(this.largeFont)) - g,
                                m = Math.ceil(this.text.length / 2), _ = g + c * (y = v / this.text.length);
                            this.letters.item(c).set("fontSize", _), this.letters.item(c).set("left", h), h += this.letters.item(c).get("width"), this.letters.item(c).set("padding", 0), this.letters.item(c).set("selectable", !1), this.letters.item(c).set("top", -1 * this.letters.item(c).get("fontSize") + c)
                        } else if ("largeToSmallTop" === this.effect) {
                            g = parseInt(this.largeFont), v = (b = parseInt(this.smallFont)) - g, m = Math.ceil(this.text.length / 2), _ = g + c * (y = v / this.text.length);
                            this.letters.item(c).set("fontSize", _), this.letters.item(c).set("left", h), h += this.letters.item(c).get("width"), this.letters.item(c).set("padding", 0), this.letters.item(c).set({
                                borderColor: "red",
                                cornerColor: "green",
                                cornerSize: 6,
                                transparentCorners: !1
                            }), this.letters.item(c).set("padding", 0), this.letters.item(c).set("selectable", !1), this.letters.item(c).top = -1 * this.letters.item(c).get("fontSize") + c / this.text.length
                        } else if ("largeToSmallBottom" === this.effect) {
                            g = parseInt(this.largeFont), v = (b = parseInt(this.smallFont)) - g, m = Math.ceil(this.text.length / 2), _ = g + c * (y = v / this.text.length);
                            this.letters.item(c).set("fontSize", _), this.letters.item(c).set("left", h), h += this.letters.item(c).get("width"), this.letters.item(c).set("padding", 0), this.letters.item(c).set({
                                borderColor: "red",
                                cornerColor: "green",
                                cornerSize: 6,
                                transparentCorners: !1
                            }), this.letters.item(c).set("padding", 0), this.letters.item(c).set("selectable", !1), this.letters.item(c).top = -1 * this.letters.item(c).get("fontSize") - c
                        } else if ("bulge" === this.effect) {
                            g = parseInt(this.smallFont), v = (b = parseInt(this.largeFont)) - g, m = Math.ceil(this.text.length / 2);
                            var b, y = v / (this.text.length - m);
                            if (c < m) _ = g + c * y; else _ = b - (c - m + 1) * y;
                            this.letters.item(c).set("fontSize", _), this.letters.item(c).set("left", h), h += this.letters.item(c).get("width"), this.letters.item(c).set("padding", 0), this.letters.item(c).set("selectable", !1), this.letters.item(c).set("top", -1 * this.letters.item(c).get("height") / 2)
                        }
                    }
                    var x = this.letters.get("scaleX"), w = this.letters.get("scaleY"), C = this.letters.get("angle");
                    this.letters.set("scaleX", 1), this.letters.set("scaleY", 1), this.letters.set("angle", 0), this.letters._calcBounds(), this.letters._updateObjectsCoords(), this.letters.set("scaleX", x), this.letters.set("scaleY", w), this.letters.set("angle", C), this.width = this.letters.width, this.height = this.letters.height, this.letters.left = -this.letters.width / 2, this.letters.top = -this.letters.height / 2
                }
            },
            render: function (t) {
                if (this.visible && this.letters) {
                    t.save(), this.transform(t);
                    Math.max(this.scaleX, this.scaleY);
                    this.clipTo && e.util.clipContext(this, t);
                    for (var i = 0, n = this.letters.size(); i < n; i++) {
                        var r = this.letters.item(i);
                        r.borderScaleFactor, r.hasRotatingPoint;
                        r.visible && r.render(t)
                    }
                    this.clipTo && t.restore(), t.restore(), this.setCoords()
                }
            },
            _set: function (t, e) {
                if ("text" !== t) {
                    if (this.callSuper("_set", t, e), this.text && this.letters) {
                        if (-1 === ["angle", "left", "top", "scaleX", "scaleY", "width", "height"].indexOf(t)) for (var i = this.letters.size(); i--;) this.letters.item(i).set(t, e);
                        -1 !== this._dimensionAffectingProps.indexOf(t) && (this._updateLetters(), this.setCoords())
                    }
                } else this.setText(e)
            },
            initDimensions: function () {
            },
            toObject: function (t) {
                var e = i(this.callSuper("toObject", t), {
                    radius: this.radius,
                    spacing: this.spacing,
                    reverse: this.reverse,
                    effect: this.effect,
                    range: this.range,
                    smallFont: this.smallFont,
                    largeFont: this.largeFont,
                    rtl: this.rtl
                });
                return this.includeDefaultValues || this._removeDefaultValues(e), e
            },
            toString: function () {
                return "#<fabric.CurvedText (" + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '", "radius": "' + this.radius + '", "spacing": "' + this.spacing + '", "reverse": "' + this.reverse + '" }>'
            },
            toSVG: function (t) {
                var e = ["<g ", 'transform="', this.getSvgTransform(), '">'];
                if (this.letters) for (var i = 0, n = this.letters.size(); i < n; i++) e.push(this.letters.item(i).toSVG(t));
                return e.push("</g>"), t ? t(e.join("")) : e.join("")
            }
        }), e.CurvedText.fromObject = function (t, i) {
            return e.Object._fromObject("CurvedText", t, i, "text")
        }, e.CurvedText.async = !1
    }
}("undefined" != typeof exports ? exports : this),function (t) {
    t.attrFn = t.attrFn || {};
    var e = "ontouchstart" in window, i = {
        tap_pixel_range: 5,
        swipe_h_threshold: 50,
        swipe_v_threshold: 50,
        taphold_threshold: 750,
        doubletap_int: 500,
        shake_threshold: 15,
        touch_capable: e,
        orientation_support: "orientation" in window && "onorientationchange" in window,
        startevent: e ? "touchstart" : "mousedown",
        endevent: e ? "touchend" : "mouseup",
        moveevent: e ? "touchmove" : "mousemove",
        tapevent: e ? "tap" : "click",
        scrollevent: e ? "touchmove" : "scroll",
        hold_timer: null,
        tap_timer: null
    };
    t.touch = {}, t.isTouchCapable = function () {
        return i.touch_capable
    }, t.getStartEvent = function () {
        return i.startevent
    }, t.getEndEvent = function () {
        return i.endevent
    }, t.getMoveEvent = function () {
        return i.moveevent
    }, t.getTapEvent = function () {
        return i.tapevent
    }, t.getScrollEvent = function () {
        return i.scrollevent
    }, t.touch.setSwipeThresholdX = function (t) {
        if ("number" != typeof t) throw new Error("Threshold parameter must be a type of number");
        i.swipe_h_threshold = t
    }, t.touch.setSwipeThresholdY = function (t) {
        if ("number" != typeof t) throw new Error("Threshold parameter must be a type of number");
        i.swipe_v_threshold = t
    }, t.touch.setDoubleTapInt = function (t) {
        if ("number" != typeof t) throw new Error("Interval parameter must be a type of number");
        i.doubletap_int = t
    }, t.touch.setTapHoldThreshold = function (t) {
        if ("number" != typeof t) throw new Error("Threshold parameter must be a type of number");
        i.taphold_threshold = t
    }, t.touch.setTapRange = function (t) {
        if ("number" != typeof t) throw new Error("Ranger parameter must be a type of number");
        i.tap_pixel_range = threshold
    }, t.each(["tapstart", "tapend", "tapmove", "tap", "singletap", "doubletap", "taphold", "swipe", "swipeup", "swiperight", "swipedown", "swipeleft", "swipeend", "scrollstart", "scrollend", "orientationchange", "tap2", "taphold2"], (function (e, i) {
        t.fn[i] = function (t) {
            return t ? this.on(i, t) : this.trigger(i)
        }, t.attrFn[i] = !0
    })), t.event.special.tapstart = {
        setup: function () {
            var e = this, n = t(e);
            n.on(i.startevent, (function t(r) {
                if (n.data("callee", t), r.which && 1 !== r.which) return !1;
                var o = r.originalEvent, s = {
                    position: {
                        x: i.touch_capable ? o.touches[0].pageX : r.pageX,
                        y: i.touch_capable ? o.touches[0].pageY : r.pageY
                    },
                    offset: {
                        x: i.touch_capable ? Math.round(o.changedTouches[0].pageX - (n.offset() ? n.offset().left : 0)) : Math.round(r.pageX - (n.offset() ? n.offset().left : 0)),
                        y: i.touch_capable ? Math.round(o.changedTouches[0].pageY - (n.offset() ? n.offset().top : 0)) : Math.round(r.pageY - (n.offset() ? n.offset().top : 0))
                    },
                    time: Date.now(),
                    target: r.target
                };
                return m(e, "tapstart", r, s), !0
            }))
        }, remove: function () {
            t(this).off(i.startevent, t(this).data.callee)
        }
    }, t.event.special.tapmove = {
        setup: function () {
            var e = this, n = t(e);
            n.on(i.moveevent, (function t(r) {
                n.data("callee", t);
                var o = r.originalEvent, s = {
                    position: {
                        x: i.touch_capable ? o.touches[0].pageX : r.pageX,
                        y: i.touch_capable ? o.touches[0].pageY : r.pageY
                    },
                    offset: {
                        x: i.touch_capable ? Math.round(o.changedTouches[0].pageX - (n.offset() ? n.offset().left : 0)) : Math.round(r.pageX - (n.offset() ? n.offset().left : 0)),
                        y: i.touch_capable ? Math.round(o.changedTouches[0].pageY - (n.offset() ? n.offset().top : 0)) : Math.round(r.pageY - (n.offset() ? n.offset().top : 0))
                    },
                    time: Date.now(),
                    target: r.target
                };
                return m(e, "tapmove", r, s), !0
            }))
        }, remove: function () {
            t(this).off(i.moveevent, t(this).data.callee)
        }
    }, t.event.special.tapend = {
        setup: function () {
            var e = this, n = t(e);
            n.on(i.endevent, (function t(r) {
                n.data("callee", t);
                var o = r.originalEvent, s = {
                    position: {
                        x: i.touch_capable ? o.changedTouches[0].pageX : r.pageX,
                        y: i.touch_capable ? o.changedTouches[0].pageY : r.pageY
                    },
                    offset: {
                        x: i.touch_capable ? Math.round(o.changedTouches[0].pageX - (n.offset() ? n.offset().left : 0)) : Math.round(r.pageX - (n.offset() ? n.offset().left : 0)),
                        y: i.touch_capable ? Math.round(o.changedTouches[0].pageY - (n.offset() ? n.offset().top : 0)) : Math.round(r.pageY - (n.offset() ? n.offset().top : 0))
                    },
                    time: Date.now(),
                    target: r.target
                };
                return m(e, "tapend", r, s), !0
            }))
        }, remove: function () {
            t(this).off(i.endevent, t(this).data.callee)
        }
    }, t.event.special.taphold = {
        setup: function () {
            var e, n = this, r = t(n), o = {x: 0, y: 0}, s = 0, a = 0;
            r.on(i.startevent, (function t(c) {
                if (c.which && 1 !== c.which) return !1;
                r.data("tapheld", !1), e = c.target;
                var l = c.originalEvent, h = Date.now();
                i.touch_capable ? l.touches[0].pageX : c.pageX, i.touch_capable ? l.touches[0].pageY : c.pageY, i.touch_capable ? (l.touches[0].pageX, l.touches[0].target.offsetLeft) : c.offsetX, i.touch_capable ? (l.touches[0].pageY, l.touches[0].target.offsetTop) : c.offsetY, o.x = c.originalEvent.targetTouches ? c.originalEvent.targetTouches[0].pageX : c.pageX, o.y = c.originalEvent.targetTouches ? c.originalEvent.targetTouches[0].pageY : c.pageY, s = o.x, a = o.y;
                var u = r.parent().data("threshold") ? r.parent().data("threshold") : r.data("threshold"),
                    f = void 0 !== u && !1 !== u && parseInt(u) ? parseInt(u) : i.taphold_threshold;
                return i.hold_timer = window.setTimeout((function () {
                    var u = o.x - s, f = o.y - a;
                    if (c.target == e && (o.x == s && o.y == a || u >= -i.tap_pixel_range && u <= i.tap_pixel_range && f >= -i.tap_pixel_range && f <= i.tap_pixel_range)) {
                        r.data("tapheld", !0);
                        for (var d = Date.now() - h, p = c.originalEvent.targetTouches ? c.originalEvent.targetTouches : [c], g = [], v = 0; v < p.length; v++) {
                            var _ = {
                                position: {
                                    x: i.touch_capable ? l.changedTouches[v].pageX : c.pageX,
                                    y: i.touch_capable ? l.changedTouches[v].pageY : c.pageY
                                },
                                offset: {
                                    x: i.touch_capable ? Math.round(l.changedTouches[v].pageX - (r.offset() ? r.offset().left : 0)) : Math.round(c.pageX - (r.offset() ? r.offset().left : 0)),
                                    y: i.touch_capable ? Math.round(l.changedTouches[v].pageY - (r.offset() ? r.offset().top : 0)) : Math.round(c.pageY - (r.offset() ? r.offset().top : 0))
                                },
                                time: Date.now(),
                                target: c.target,
                                duration: d
                            };
                            g.push(_)
                        }
                        var b = 2 == p.length ? "taphold2" : "taphold";
                        r.data("callee1", t), m(n, b, c, g)
                    }
                }), f), !0
            })).on(i.endevent, (function t() {
                r.data("callee2", t), r.data("tapheld", !1), window.clearTimeout(i.hold_timer)
            })).on(i.moveevent, (function t(e) {
                r.data("callee3", t), s = e.originalEvent.targetTouches ? e.originalEvent.targetTouches[0].pageX : e.pageX, a = e.originalEvent.targetTouches ? e.originalEvent.targetTouches[0].pageY : e.pageY
            }))
        }, remove: function () {
            t(this).off(i.startevent, t(this).data.callee1).off(i.endevent, t(this).data.callee2).off(i.moveevent, t(this).data.callee3)
        }
    }, t.event.special.doubletap = {
        setup: function () {
            var e, n, r = this, o = t(r), s = null, a = !1;
            o.on(i.startevent, (function e(r) {
                return !(r.which && 1 !== r.which || (o.data("doubletapped", !1), r.target, o.data("callee1", e), n = r.originalEvent, s || (s = {
                    position: {
                        x: i.touch_capable ? n.touches[0].pageX : r.pageX,
                        y: i.touch_capable ? n.touches[0].pageY : r.pageY
                    },
                    offset: {
                        x: i.touch_capable ? Math.round(n.changedTouches[0].pageX - (o.offset() ? o.offset().left : 0)) : Math.round(r.pageX - (o.offset() ? o.offset().left : 0)),
                        y: i.touch_capable ? Math.round(n.changedTouches[0].pageY - (o.offset() ? o.offset().top : 0)) : Math.round(r.pageY - (o.offset() ? o.offset().top : 0))
                    },
                    time: Date.now(),
                    target: r.target,
                    element: r.originalEvent.srcElement,
                    index: t(r.target).index()
                }), 0))
            })).on(i.endevent, (function c(l) {
                var h = Date.now(), u = h - (o.data("lastTouch") || h + 1);
                if (window.clearTimeout(e), o.data("callee2", c), u < i.doubletap_int && t(l.target).index() == s.index && u > 100) {
                    o.data("doubletapped", !0), window.clearTimeout(i.tap_timer);
                    var f = {
                        position: {
                            x: i.touch_capable ? l.originalEvent.changedTouches[0].pageX : l.pageX,
                            y: i.touch_capable ? l.originalEvent.changedTouches[0].pageY : l.pageY
                        },
                        offset: {
                            x: i.touch_capable ? Math.round(n.changedTouches[0].pageX - (o.offset() ? o.offset().left : 0)) : Math.round(l.pageX - (o.offset() ? o.offset().left : 0)),
                            y: i.touch_capable ? Math.round(n.changedTouches[0].pageY - (o.offset() ? o.offset().top : 0)) : Math.round(l.pageY - (o.offset() ? o.offset().top : 0))
                        },
                        time: Date.now(),
                        target: l.target,
                        element: l.originalEvent.srcElement,
                        index: t(l.target).index()
                    }, d = {firstTap: s, secondTap: f, interval: f.time - s.time};
                    a || (m(r, "doubletap", l, d), s = null), a = !0, window.setTimeout((function () {
                        a = !1
                    }), i.doubletap_int)
                } else o.data("lastTouch", h), e = window.setTimeout((function () {
                    s = null, window.clearTimeout(e)
                }), i.doubletap_int, [l]);
                o.data("lastTouch", h)
            }))
        }, remove: function () {
            t(this).off(i.startevent, t(this).data.callee1).off(i.endevent, t(this).data.callee2)
        }
    }, t.event.special.singletap = {
        setup: function () {
            var e = this, n = t(e), r = null, o = null, s = {x: 0, y: 0};
            n.on(i.startevent, (function t(e) {
                return !(e.which && 1 !== e.which || (o = Date.now(), r = e.target, n.data("callee1", t), s.x = e.originalEvent.targetTouches ? e.originalEvent.targetTouches[0].pageX : e.pageX, s.y = e.originalEvent.targetTouches ? e.originalEvent.targetTouches[0].pageY : e.pageY, 0))
            })).on(i.endevent, (function t(a) {
                if (n.data("callee2", t), a.target == r) {
                    var c = a.originalEvent.changedTouches ? a.originalEvent.changedTouches[0].pageX : a.pageX,
                        l = a.originalEvent.changedTouches ? a.originalEvent.changedTouches[0].pageY : a.pageY;
                    i.tap_timer = window.setTimeout((function () {
                        var t = s.x - c, r = s.y - l;
                        if (!n.data("doubletapped") && !n.data("tapheld") && (s.x == c && s.y == l || t >= -i.tap_pixel_range && t <= i.tap_pixel_range && r >= -i.tap_pixel_range && r <= i.tap_pixel_range)) {
                            var h = a.originalEvent, u = {
                                position: {
                                    x: i.touch_capable ? h.changedTouches[0].pageX : a.pageX,
                                    y: i.touch_capable ? h.changedTouches[0].pageY : a.pageY
                                },
                                offset: {
                                    x: i.touch_capable ? Math.round(h.changedTouches[0].pageX - (n.offset() ? n.offset().left : 0)) : Math.round(a.pageX - (n.offset() ? n.offset().left : 0)),
                                    y: i.touch_capable ? Math.round(h.changedTouches[0].pageY - (n.offset() ? n.offset().top : 0)) : Math.round(a.pageY - (n.offset() ? n.offset().top : 0))
                                },
                                time: Date.now(),
                                target: a.target
                            };
                            u.time - o < i.taphold_threshold && m(e, "singletap", a, u)
                        }
                    }), i.doubletap_int)
                }
            }))
        }, remove: function () {
            t(this).off(i.startevent, t(this).data.callee1).off(i.endevent, t(this).data.callee2)
        }
    }, t.event.special.tap = {
        setup: function () {
            var e, n, r = this, o = t(r), s = !1, a = null, c = {x: 0, y: 0};
            o.on(i.startevent, (function t(i) {
                return o.data("callee1", t), !(i.which && 1 !== i.which || (s = !0, c.x = i.originalEvent.targetTouches ? i.originalEvent.targetTouches[0].pageX : i.pageX, c.y = i.originalEvent.targetTouches ? i.originalEvent.targetTouches[0].pageY : i.pageY, e = Date.now(), a = i.target, n = i.originalEvent.targetTouches ? i.originalEvent.targetTouches : [i], 0))
            })).on(i.endevent, (function t(l) {
                o.data("callee2", t);
                var h = l.originalEvent.targetTouches ? l.originalEvent.changedTouches[0].pageX : l.pageX,
                    u = l.originalEvent.targetTouches ? l.originalEvent.changedTouches[0].pageY : l.pageY, f = c.x - h,
                    d = c.y - u;
                if (a == l.target && s && Date.now() - e < i.taphold_threshold && (c.x == h && c.y == u || f >= -i.tap_pixel_range && f <= i.tap_pixel_range && d >= -i.tap_pixel_range && d <= i.tap_pixel_range)) {
                    for (var p = l.originalEvent, g = [], v = 0; v < n.length; v++) {
                        var _ = {
                            position: {
                                x: i.touch_capable ? p.changedTouches[v].pageX : l.pageX,
                                y: i.touch_capable ? p.changedTouches[v].pageY : l.pageY
                            },
                            offset: {
                                x: i.touch_capable ? Math.round(p.changedTouches[v].pageX - (o.offset() ? o.offset().left : 0)) : Math.round(l.pageX - (o.offset() ? o.offset().left : 0)),
                                y: i.touch_capable ? Math.round(p.changedTouches[v].pageY - (o.offset() ? o.offset().top : 0)) : Math.round(l.pageY - (o.offset() ? o.offset().top : 0))
                            },
                            time: Date.now(),
                            target: l.target
                        };
                        g.push(_)
                    }
                    var b = 2 == n.length ? "tap2" : "tap";
                    m(r, b, l, g)
                }
            }))
        }, remove: function () {
            t(this).off(i.startevent, t(this).data.callee1).off(i.endevent, t(this).data.callee2)
        }
    }, t.event.special.swipe = {
        setup: function () {
            var e, n = t(this), r = !1, o = !1, s = {x: 0, y: 0}, a = {x: 0, y: 0};
            n.on(i.startevent, (function o(c) {
                (n = t(c.currentTarget)).data("callee1", o), s.x = c.originalEvent.targetTouches ? c.originalEvent.targetTouches[0].pageX : c.pageX, s.y = c.originalEvent.targetTouches ? c.originalEvent.targetTouches[0].pageY : c.pageY, a.x = s.x, a.y = s.y, r = !0;
                var l = c.originalEvent;
                e = {
                    position: {
                        x: i.touch_capable ? l.touches[0].pageX : c.pageX,
                        y: i.touch_capable ? l.touches[0].pageY : c.pageY
                    },
                    offset: {
                        x: i.touch_capable ? Math.round(l.changedTouches[0].pageX - (n.offset() ? n.offset().left : 0)) : Math.round(c.pageX - (n.offset() ? n.offset().left : 0)),
                        y: i.touch_capable ? Math.round(l.changedTouches[0].pageY - (n.offset() ? n.offset().top : 0)) : Math.round(c.pageY - (n.offset() ? n.offset().top : 0))
                    },
                    time: Date.now(),
                    target: c.target
                }
            })), n.on(i.moveevent, (function c(l) {
                var h;
                (n = t(l.currentTarget)).data("callee2", c), a.x = l.originalEvent.targetTouches ? l.originalEvent.targetTouches[0].pageX : l.pageX, a.y = l.originalEvent.targetTouches ? l.originalEvent.targetTouches[0].pageY : l.pageY;
                var u = n.parent().data("xthreshold") ? n.parent().data("xthreshold") : n.data("xthreshold"),
                    f = n.parent().data("ythreshold") ? n.parent().data("ythreshold") : n.data("ythreshold"),
                    d = void 0 !== u && !1 !== u && parseInt(u) ? parseInt(u) : i.swipe_h_threshold,
                    p = void 0 !== f && !1 !== f && parseInt(f) ? parseInt(f) : i.swipe_v_threshold;
                if (s.y > a.y && s.y - a.y > p && (h = "swipeup"), s.x < a.x && a.x - s.x > d && (h = "swiperight"), s.y < a.y && a.y - s.y > p && (h = "swipedown"), s.x > a.x && s.x - a.x > d && (h = "swipeleft"), null != h && r) {
                    s.x = 0, s.y = 0, a.x = 0, a.y = 0, r = !1;
                    var g = l.originalEvent, v = {
                        position: {
                            x: i.touch_capable ? g.touches[0].pageX : l.pageX,
                            y: i.touch_capable ? g.touches[0].pageY : l.pageY
                        },
                        offset: {
                            x: i.touch_capable ? Math.round(g.changedTouches[0].pageX - (n.offset() ? n.offset().left : 0)) : Math.round(l.pageX - (n.offset() ? n.offset().left : 0)),
                            y: i.touch_capable ? Math.round(g.changedTouches[0].pageY - (n.offset() ? n.offset().top : 0)) : Math.round(l.pageY - (n.offset() ? n.offset().top : 0))
                        },
                        time: Date.now(),
                        target: l.target
                    }, m = Math.abs(e.position.x - v.position.x), _ = Math.abs(e.position.y - v.position.y), b = {
                        startEvnt: e,
                        endEvnt: v,
                        direction: h.replace("swipe", ""),
                        xAmount: m,
                        yAmount: _,
                        duration: v.time - e.time
                    };
                    o = !0, n.trigger("swipe", b).trigger(h, b)
                }
            })), n.on(i.endevent, (function s(a) {
                var c = "";
                if ((n = t(a.currentTarget)).data("callee3", s), o) {
                    var l = n.data("xthreshold"), h = n.data("ythreshold"),
                        u = void 0 !== l && !1 !== l && parseInt(l) ? parseInt(l) : i.swipe_h_threshold,
                        f = void 0 !== h && !1 !== h && parseInt(h) ? parseInt(h) : i.swipe_v_threshold,
                        d = a.originalEvent, p = {
                            position: {
                                x: i.touch_capable ? d.changedTouches[0].pageX : a.pageX,
                                y: i.touch_capable ? d.changedTouches[0].pageY : a.pageY
                            },
                            offset: {
                                x: i.touch_capable ? Math.round(d.changedTouches[0].pageX - (n.offset() ? n.offset().left : 0)) : Math.round(a.pageX - (n.offset() ? n.offset().left : 0)),
                                y: i.touch_capable ? Math.round(d.changedTouches[0].pageY - (n.offset() ? n.offset().top : 0)) : Math.round(a.pageY - (n.offset() ? n.offset().top : 0))
                            },
                            time: Date.now(),
                            target: a.target
                        };
                    e.position.y > p.position.y && e.position.y - p.position.y > f && (c = "swipeup"), e.position.x < p.position.x && p.position.x - e.position.x > u && (c = "swiperight"), e.position.y < p.position.y && p.position.y - e.position.y > f && (c = "swipedown"), e.position.x > p.position.x && e.position.x - p.position.x > u && (c = "swipeleft");
                    var g = Math.abs(e.position.x - p.position.x), v = Math.abs(e.position.y - p.position.y), m = {
                        startEvnt: e,
                        endEvnt: p,
                        direction: c.replace("swipe", ""),
                        xAmount: g,
                        yAmount: v,
                        duration: p.time - e.time
                    };
                    n.trigger("swipeend", m)
                }
                r = !1, o = !1
            }))
        }, remove: function () {
            t(this).off(i.startevent, t(this).data.callee1).off(i.moveevent, t(this).data.callee2).off(i.endevent, t(this).data.callee3)
        }
    }, t.event.special.scrollstart = {
        setup: function () {
            var e, n, r = this, o = t(r);

            function s(t, i) {
                m(r, (e = i) ? "scrollstart" : "scrollend", t)
            }

            o.on(i.scrollevent, (function t(i) {
                o.data("callee", t), e || s(i, !0), clearTimeout(n), n = setTimeout((function () {
                    s(i, !1)
                }), 50)
            }))
        }, remove: function () {
            t(this).off(i.scrollevent, t(this).data.callee)
        }
    };
    var n, r, o, s, a = t(window), c = {0: !0, 180: !0};
    if (i.orientation_support) {
        var l = window.innerWidth || a.width(), h = window.innerHeight || a.height();
        o = l > h && l - h > 50, s = c[window.orientation], (o && s || !o && !s) && (c = {"-90": !0, 90: !0})
    }

    function u() {
        var t = n();
        t !== r && (r = t, a.trigger("orientationchange"))
    }

    t.event.special.orientationchange = {
        setup: function () {
            return !i.orientation_support && (r = n(), a.on("throttledresize", u), !0)
        }, teardown: function () {
            return !i.orientation_support && (a.off("throttledresize", u), !0)
        }, add: function (t) {
            var e = t.handler;
            t.handler = function (t) {
                return t.orientation = n(), e.apply(this, arguments)
            }
        }
    }, t.event.special.orientationchange.orientation = n = function () {
        var t = document.documentElement;
        return (i.orientation_support ? c[window.orientation] : t && t.clientWidth / t.clientHeight < 1.1) ? "portrait" : "landscape"
    }, t.event.special.throttledresize = {
        setup: function () {
            t(this).on("resize", g)
        }, teardown: function () {
            t(this).off("resize", g)
        }
    };
    var f, d, p, g = function () {
        d = Date.now(), (p = d - v) >= 250 ? (v = d, t(this).trigger("throttledresize")) : (f && window.clearTimeout(f), f = window.setTimeout(u, 250 - p))
    }, v = 0;

    function m(e, i, n, r) {
        var o = n.type;
        n.type = i, t.event.dispatch.call(e, n, r), n.type = o
    }

    t.each({
        scrollend: "scrollstart",
        swipeup: "swipe",
        swiperight: "swipe",
        swipedown: "swipe",
        swipeleft: "swipe",
        swipeend: "swipe",
        tap2: "tap",
        taphold2: "taphold"
    }, (function (e, i) {
        t.event.special[e] = {
            setup: function () {
                t(this).on(i, t.noop)
            }
        }
    }))
}(jQuery),function (t, e) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", e) : "object" == typeof module && module.exports ? module.exports = e() : t.EvEmitter = e()
}("undefined" != typeof window ? window : this, (function () {
    function t() {
    }

    var e = t.prototype;
    return e.on = function (t, e) {
        if (t && e) {
            var i = this._events = this._events || {}, n = i[t] = i[t] || [];
            return -1 == n.indexOf(e) && n.push(e), this
        }
    }, e.once = function (t, e) {
        if (t && e) {
            this.on(t, e);
            var i = this._onceEvents = this._onceEvents || {};
            return (i[t] = i[t] || {})[e] = !0, this
        }
    }, e.off = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            var n = i.indexOf(e);
            return -1 != n && i.splice(n, 1), this
        }
    }, e.emitEvent = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            i = i.slice(0), e = e || [];
            for (var n = this._onceEvents && this._onceEvents[t], r = 0; r < i.length; r++) {
                var o = i[r];
                n && n[o] && (this.off(t, o), delete n[o]), o.apply(this, e)
            }
            return this
        }
    }, e.allOff = function () {
        delete this._events, delete this._onceEvents
    }, t
})),function (t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter"], (function (i) {
        return e(t, i)
    })) : "object" == typeof module && module.exports ? module.exports = e(t, require("ev-emitter")) : t.imagesLoaded = e(t, t.EvEmitter)
}("undefined" != typeof window ? window : this, (function (t, e) {
    function i(t, e) {
        for (var i in e) t[i] = e[i];
        return t
    }

    function n(t, e, r) {
        if (!(this instanceof n)) return new n(t, e, r);
        var o = t;
        return "string" == typeof t && (o = document.querySelectorAll(t)), o ? (this.elements = function (t) {
            return Array.isArray(t) ? t : "object" == typeof t && "number" == typeof t.length ? c.call(t) : [t]
        }(o), this.options = i({}, this.options), "function" == typeof e ? r = e : i(this.options, e), r && this.on("always", r), this.getImages(), s && (this.jqDeferred = new s.Deferred), void setTimeout(this.check.bind(this))) : void a.error("Bad element for imagesLoaded " + (o || t))
    }

    function r(t) {
        this.img = t
    }

    function o(t, e) {
        this.url = t, this.element = e, this.img = new Image
    }

    var s = t.jQuery, a = t.console, c = Array.prototype.slice;
    n.prototype = Object.create(e.prototype), n.prototype.options = {}, n.prototype.getImages = function () {
        this.images = [], this.elements.forEach(this.addElementImages, this)
    }, n.prototype.addElementImages = function (t) {
        "IMG" == t.nodeName && this.addImage(t), !0 === this.options.background && this.addElementBackgroundImages(t);
        var e = t.nodeType;
        if (e && l[e]) {
            for (var i = t.querySelectorAll("img"), n = 0; n < i.length; n++) {
                var r = i[n];
                this.addImage(r)
            }
            if ("string" == typeof this.options.background) {
                var o = t.querySelectorAll(this.options.background);
                for (n = 0; n < o.length; n++) {
                    var s = o[n];
                    this.addElementBackgroundImages(s)
                }
            }
        }
    };
    var l = {1: !0, 9: !0, 11: !0};
    return n.prototype.addElementBackgroundImages = function (t) {
        var e = getComputedStyle(t);
        if (e) for (var i = /url\((['"])?(.*?)\1\)/gi, n = i.exec(e.backgroundImage); null !== n;) {
            var r = n && n[2];
            r && this.addBackground(r, t), n = i.exec(e.backgroundImage)
        }
    }, n.prototype.addImage = function (t) {
        var e = new r(t);
        this.images.push(e)
    }, n.prototype.addBackground = function (t, e) {
        var i = new o(t, e);
        this.images.push(i)
    }, n.prototype.check = function () {
        function t(t, i, n) {
            setTimeout((function () {
                e.progress(t, i, n)
            }))
        }

        var e = this;
        return this.progressedCount = 0, this.hasAnyBroken = !1, this.images.length ? void this.images.forEach((function (e) {
            e.once("progress", t), e.check()
        })) : void this.complete()
    }, n.prototype.progress = function (t, e, i) {
        this.progressedCount++, this.hasAnyBroken = this.hasAnyBroken || !t.isLoaded, this.emitEvent("progress", [this, t, e]), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, t), this.progressedCount == this.images.length && this.complete(), this.options.debug && a && a.log("progress: " + i, t, e)
    }, n.prototype.complete = function () {
        var t = this.hasAnyBroken ? "fail" : "done";
        if (this.isComplete = !0, this.emitEvent(t, [this]), this.emitEvent("always", [this]), this.jqDeferred) {
            var e = this.hasAnyBroken ? "reject" : "resolve";
            this.jqDeferred[e](this)
        }
    }, r.prototype = Object.create(e.prototype), r.prototype.check = function () {
        return this.getIsImageComplete() ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image, this.proxyImage.addEventListener("load", this), this.proxyImage.addEventListener("error", this), this.img.addEventListener("load", this), this.img.addEventListener("error", this), void (this.proxyImage.src = this.img.src))
    }, r.prototype.getIsImageComplete = function () {
        return this.img.complete && this.img.naturalWidth
    }, r.prototype.confirm = function (t, e) {
        this.isLoaded = t, this.emitEvent("progress", [this, this.img, e])
    }, r.prototype.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }, r.prototype.onload = function () {
        this.confirm(!0, "onload"), this.unbindEvents()
    }, r.prototype.onerror = function () {
        this.confirm(!1, "onerror"), this.unbindEvents()
    }, r.prototype.unbindEvents = function () {
        this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, o.prototype = Object.create(r.prototype), o.prototype.check = function () {
        this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url, this.getIsImageComplete() && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents())
    }, o.prototype.unbindEvents = function () {
        this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, o.prototype.confirm = function (t, e) {
        this.isLoaded = t, this.emitEvent("progress", [this, this.element, e])
    }, n.makeJQueryPlugin = function (e) {
        (e = e || t.jQuery) && ((s = e).fn.imagesLoaded = function (t, e) {
            return new n(this, t, e).jqDeferred.promise(s(this))
        })
    }, n.makeJQueryPlugin(), n
})),function (t, e) {
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery-bridget", ["jquery"], (function (i) {
        return e(t, i)
    })) : "object" == typeof module && module.exports ? module.exports = e(t, require("jquery")) : t.jQueryBridget = e(t, t.jQuery)
}(window, (function (t, e) {
    "use strict";

    function i(i, o, a) {
        function c(t, e, n) {
            var r, o = "$()." + i + '("' + e + '")';
            return t.each((function (t, c) {
                var l = a.data(c, i);
                if (l) {
                    var h = l[e];
                    if (h && "_" != e.charAt(0)) {
                        var u = h.apply(l, n);
                        r = void 0 === r ? u : r
                    } else s(o + " is not a valid method")
                } else s(i + " not initialized. Cannot call methods, i.e. " + o)
            })), void 0 !== r ? r : t
        }

        function l(t, e) {
            t.each((function (t, n) {
                var r = a.data(n, i);
                r ? (r.option(e), r._init()) : (r = new o(n, e), a.data(n, i, r))
            }))
        }

        (a = a || e || t.jQuery) && (o.prototype.option || (o.prototype.option = function (t) {
            a.isPlainObject(t) && (this.options = a.extend(!0, this.options, t))
        }), a.fn[i] = function (t) {
            if ("string" == typeof t) {
                var e = r.call(arguments, 1);
                return c(this, t, e)
            }
            return l(this, t), this
        }, n(a))
    }

    function n(t) {
        !t || t && t.bridget || (t.bridget = i)
    }

    var r = Array.prototype.slice, o = t.console, s = void 0 === o ? function () {
    } : function (t) {
        o.error(t)
    };
    return n(e || t.jQuery), i
})),function (t, e) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", e) : "object" == typeof module && module.exports ? module.exports = e() : t.EvEmitter = e()
}("undefined" != typeof window ? window : this, (function () {
    function t() {
    }

    var e = t.prototype;
    return e.on = function (t, e) {
        if (t && e) {
            var i = this._events = this._events || {}, n = i[t] = i[t] || [];
            return -1 == n.indexOf(e) && n.push(e), this
        }
    }, e.once = function (t, e) {
        if (t && e) {
            this.on(t, e);
            var i = this._onceEvents = this._onceEvents || {};
            return (i[t] = i[t] || {})[e] = !0, this
        }
    }, e.off = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            var n = i.indexOf(e);
            return -1 != n && i.splice(n, 1), this
        }
    }, e.emitEvent = function (t, e) {
        var i = this._events && this._events[t];
        if (i && i.length) {
            i = i.slice(0), e = e || [];
            for (var n = this._onceEvents && this._onceEvents[t], r = 0; r < i.length; r++) {
                var o = i[r];
                n && n[o] && (this.off(t, o), delete n[o]), o.apply(this, e)
            }
            return this
        }
    }, e.allOff = function () {
        delete this._events, delete this._onceEvents
    }, t
})),function (t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("get-size/get-size", [], (function () {
        return e()
    })) : "object" == typeof module && module.exports ? module.exports = e() : t.getSize = e()
}(window, (function () {
    "use strict";

    function t(t) {
        var e = parseFloat(t);
        return -1 == t.indexOf("%") && !isNaN(e) && e
    }

    function e(t) {
        var e = getComputedStyle(t);
        return e || o("Style returned " + e + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), e
    }

    function i() {
        if (!c) {
            c = !0;
            var i = document.createElement("div");
            i.style.width = "200px", i.style.padding = "1px 2px 3px 4px", i.style.borderStyle = "solid", i.style.borderWidth = "1px 2px 3px 4px", i.style.boxSizing = "border-box";
            var o = document.body || document.documentElement;
            o.appendChild(i);
            var s = e(i);
            n.isBoxSizeOuter = r = 200 == t(s.width), o.removeChild(i)
        }
    }

    function n(n) {
        if (i(), "string" == typeof n && (n = document.querySelector(n)), n && "object" == typeof n && n.nodeType) {
            var o = e(n);
            if ("none" == o.display) return function () {
                for (var t = {
                    width: 0,
                    height: 0,
                    innerWidth: 0,
                    innerHeight: 0,
                    outerWidth: 0,
                    outerHeight: 0
                }, e = 0; a > e; e++) t[s[e]] = 0;
                return t
            }();
            var c = {};
            c.width = n.offsetWidth, c.height = n.offsetHeight;
            for (var l = c.isBorderBox = "border-box" == o.boxSizing, h = 0; a > h; h++) {
                var u = s[h], f = o[u], d = parseFloat(f);
                c[u] = isNaN(d) ? 0 : d
            }
            var p = c.paddingLeft + c.paddingRight, g = c.paddingTop + c.paddingBottom,
                v = c.marginLeft + c.marginRight, m = c.marginTop + c.marginBottom,
                _ = c.borderLeftWidth + c.borderRightWidth, b = c.borderTopWidth + c.borderBottomWidth, y = l && r,
                x = t(o.width);
            !1 !== x && (c.width = x + (y ? 0 : p + _));
            var w = t(o.height);
            return !1 !== w && (c.height = w + (y ? 0 : g + b)), c.innerWidth = c.width - (p + _), c.innerHeight = c.height - (g + b), c.outerWidth = c.width + v, c.outerHeight = c.height + m, c
        }
    }

    var r, o = "undefined" == typeof console ? function () {
        } : function (t) {
            console.error(t)
        },
        s = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"],
        a = s.length, c = !1;
    return n
})),function (t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("desandro-matches-selector/matches-selector", e) : "object" == typeof module && module.exports ? module.exports = e() : t.matchesSelector = e()
}(window, (function () {
    "use strict";
    var t = function () {
        var t = window.Element.prototype;
        if (t.matches) return "matches";
        if (t.matchesSelector) return "matchesSelector";
        for (var e = ["webkit", "moz", "ms", "o"], i = 0; i < e.length; i++) {
            var n = e[i] + "MatchesSelector";
            if (t[n]) return n
        }
    }();
    return function (e, i) {
        return e[t](i)
    }
})),function (t, e) {
    "function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["desandro-matches-selector/matches-selector"], (function (i) {
        return e(t, i)
    })) : "object" == typeof module && module.exports ? module.exports = e(t, require("desandro-matches-selector")) : t.fizzyUIUtils = e(t, t.matchesSelector)
}(window, (function (t, e) {
    var i = {
        extend: function (t, e) {
            for (var i in e) t[i] = e[i];
            return t
        }, modulo: function (t, e) {
            return (t % e + e) % e
        }, makeArray: function (t) {
            var e = [];
            if (Array.isArray(t)) e = t; else if (t && "object" == typeof t && "number" == typeof t.length) for (var i = 0; i < t.length; i++) e.push(t[i]); else e.push(t);
            return e
        }, removeFrom: function (t, e) {
            var i = t.indexOf(e);
            -1 != i && t.splice(i, 1)
        }, getParent: function (t, i) {
            for (; t.parentNode && t != document.body;) if (t = t.parentNode, e(t, i)) return t
        }, getQueryElement: function (t) {
            return "string" == typeof t ? document.querySelector(t) : t
        }, handleEvent: function (t) {
            var e = "on" + t.type;
            this[e] && this[e](t)
        }, filterFindElements: function (t, n) {
            t = i.makeArray(t);
            var r = [];
            return t.forEach((function (t) {
                if (t instanceof HTMLElement) {
                    if (!n) return void r.push(t);
                    e(t, n) && r.push(t);
                    for (var i = t.querySelectorAll(n), o = 0; o < i.length; o++) r.push(i[o])
                }
            })), r
        }, debounceMethod: function (t, e, i) {
            var n = t.prototype[e], r = e + "Timeout";
            t.prototype[e] = function () {
                var t = this[r];
                t && clearTimeout(t);
                var e = arguments, o = this;
                this[r] = setTimeout((function () {
                    n.apply(o, e), delete o[r]
                }), i || 100)
            }
        }, docReady: function (t) {
            var e = document.readyState;
            "complete" == e || "interactive" == e ? setTimeout(t) : document.addEventListener("DOMContentLoaded", t)
        }, toDashed: function (t) {
            return t.replace(/(.)([A-Z])/g, (function (t, e, i) {
                return e + "-" + i
            })).toLowerCase()
        }
    }, n = t.console;
    return i.htmlInit = function (e, r) {
        i.docReady((function () {
            var o = i.toDashed(r), s = "data-" + o, a = document.querySelectorAll("[" + s + "]"),
                c = document.querySelectorAll(".js-" + o), l = i.makeArray(a).concat(i.makeArray(c)),
                h = s + "-options", u = t.jQuery;
            l.forEach((function (t) {
                var i, o = t.getAttribute(s) || t.getAttribute(h);
                try {
                    i = o && JSON.parse(o)
                } catch (e) {
                    return void (n && n.error("Error parsing " + s + " on " + t.className + ": " + e))
                }
                var a = new e(t, i);
                u && u.data(t, r, a)
            }))
        }))
    }, i
})),function (t, e) {
    "function" == typeof define && define.amd ? define("outlayer/item", ["ev-emitter/ev-emitter", "get-size/get-size"], e) : "object" == typeof module && module.exports ? module.exports = e(require("ev-emitter"), require("get-size")) : (t.Outlayer = {}, t.Outlayer.Item = e(t.EvEmitter, t.getSize))
}(window, (function (t, e) {
    "use strict";

    function i(t, e) {
        t && (this.element = t, this.layout = e, this.position = {x: 0, y: 0}, this._create())
    }

    var n = document.documentElement.style, r = "string" == typeof n.transition ? "transition" : "WebkitTransition",
        o = "string" == typeof n.transform ? "transform" : "WebkitTransform",
        s = {WebkitTransition: "webkitTransitionEnd", transition: "transitionend"}[r], a = {
            transform: o,
            transition: r,
            transitionDuration: r + "Duration",
            transitionProperty: r + "Property",
            transitionDelay: r + "Delay"
        }, c = i.prototype = Object.create(t.prototype);
    c.constructor = i, c._create = function () {
        this._transn = {ingProperties: {}, clean: {}, onEnd: {}}, this.css({position: "absolute"})
    }, c.handleEvent = function (t) {
        var e = "on" + t.type;
        this[e] && this[e](t)
    }, c.getSize = function () {
        this.size = e(this.element)
    }, c.css = function (t) {
        var e = this.element.style;
        for (var i in t) {
            e[a[i] || i] = t[i]
        }
    }, c.getPosition = function () {
        var t = getComputedStyle(this.element), e = this.layout._getOption("originLeft"),
            i = this.layout._getOption("originTop"), n = t[e ? "left" : "right"], r = t[i ? "top" : "bottom"],
            o = this.layout.size, s = -1 != n.indexOf("%") ? parseFloat(n) / 100 * o.width : parseInt(n, 10),
            a = -1 != r.indexOf("%") ? parseFloat(r) / 100 * o.height : parseInt(r, 10);
        s = isNaN(s) ? 0 : s, a = isNaN(a) ? 0 : a, s -= e ? o.paddingLeft : o.paddingRight, a -= i ? o.paddingTop : o.paddingBottom, this.position.x = s, this.position.y = a
    }, c.layoutPosition = function () {
        var t = this.layout.size, e = {}, i = this.layout._getOption("originLeft"),
            n = this.layout._getOption("originTop"), r = i ? "paddingLeft" : "paddingRight", o = i ? "left" : "right",
            s = i ? "right" : "left", a = this.position.x + t[r];
        e[o] = this.getXValue(a), e[s] = "";
        var c = n ? "paddingTop" : "paddingBottom", l = n ? "top" : "bottom", h = n ? "bottom" : "top",
            u = this.position.y + t[c];
        e[l] = this.getYValue(u), e[h] = "", this.css(e), this.emitEvent("layout", [this])
    }, c.getXValue = function (t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && !e ? t / this.layout.size.width * 100 + "%" : t + "px"
    }, c.getYValue = function (t) {
        var e = this.layout._getOption("horizontal");
        return this.layout.options.percentPosition && e ? t / this.layout.size.height * 100 + "%" : t + "px"
    }, c._transitionTo = function (t, e) {
        this.getPosition();
        var i = this.position.x, n = this.position.y, r = parseInt(t, 10), o = parseInt(e, 10),
            s = r === this.position.x && o === this.position.y;
        if (this.setPosition(t, e), !s || this.isTransitioning) {
            var a = t - i, c = e - n, l = {};
            l.transform = this.getTranslate(a, c), this.transition({
                to: l,
                onTransitionEnd: {transform: this.layoutPosition},
                isCleaning: !0
            })
        } else this.layoutPosition()
    }, c.getTranslate = function (t, e) {
        return "translate3d(" + (t = this.layout._getOption("originLeft") ? t : -t) + "px, " + (e = this.layout._getOption("originTop") ? e : -e) + "px, 0)"
    }, c.goTo = function (t, e) {
        this.setPosition(t, e), this.layoutPosition()
    }, c.moveTo = c._transitionTo, c.setPosition = function (t, e) {
        this.position.x = parseInt(t, 10), this.position.y = parseInt(e, 10)
    }, c._nonTransition = function (t) {
        for (var e in this.css(t.to), t.isCleaning && this._removeStyles(t.to), t.onTransitionEnd) t.onTransitionEnd[e].call(this)
    }, c.transition = function (t) {
        if (parseFloat(this.layout.options.transitionDuration)) {
            var e = this._transn;
            for (var i in t.onTransitionEnd) e.onEnd[i] = t.onTransitionEnd[i];
            for (i in t.to) e.ingProperties[i] = !0, t.isCleaning && (e.clean[i] = !0);
            if (t.from) {
                this.css(t.from);
                this.element.offsetHeight;
                null
            }
            this.enableTransition(t.to), this.css(t.to), this.isTransitioning = !0
        } else this._nonTransition(t)
    };
    var l = "opacity," + function (t) {
        return t.replace(/([A-Z])/g, (function (t) {
            return "-" + t.toLowerCase()
        }))
    }(o);
    c.enableTransition = function () {
        if (!this.isTransitioning) {
            var t = this.layout.options.transitionDuration;
            t = "number" == typeof t ? t + "ms" : t, this.css({
                transitionProperty: l,
                transitionDuration: t,
                transitionDelay: this.staggerDelay || 0
            }), this.element.addEventListener(s, this, !1)
        }
    }, c.onwebkitTransitionEnd = function (t) {
        this.ontransitionend(t)
    }, c.onotransitionend = function (t) {
        this.ontransitionend(t)
    };
    var h = {"-webkit-transform": "transform"};
    c.ontransitionend = function (t) {
        if (t.target === this.element) {
            var e = this._transn, i = h[t.propertyName] || t.propertyName;
            if (delete e.ingProperties[i], function (t) {
                for (var e in t) return !1;
                return !0
            }(e.ingProperties) && this.disableTransition(), i in e.clean && (this.element.style[t.propertyName] = "", delete e.clean[i]), i in e.onEnd) e.onEnd[i].call(this), delete e.onEnd[i];
            this.emitEvent("transitionEnd", [this])
        }
    }, c.disableTransition = function () {
        this.removeTransitionStyles(), this.element.removeEventListener(s, this, !1), this.isTransitioning = !1
    }, c._removeStyles = function (t) {
        var e = {};
        for (var i in t) e[i] = "";
        this.css(e)
    };
    var u = {transitionProperty: "", transitionDuration: "", transitionDelay: ""};
    return c.removeTransitionStyles = function () {
        this.css(u)
    }, c.stagger = function (t) {
        t = isNaN(t) ? 0 : t, this.staggerDelay = t + "ms"
    }, c.removeElem = function () {
        this.element.parentNode.removeChild(this.element), this.css({display: ""}), this.emitEvent("remove", [this])
    }, c.remove = function () {
        return r && parseFloat(this.layout.options.transitionDuration) ? (this.once("transitionEnd", (function () {
            this.removeElem()
        })), void this.hide()) : void this.removeElem()
    }, c.reveal = function () {
        delete this.isHidden, this.css({display: ""});
        var t = this.layout.options, e = {};
        e[this.getHideRevealTransitionEndProperty("visibleStyle")] = this.onRevealTransitionEnd, this.transition({
            from: t.hiddenStyle,
            to: t.visibleStyle,
            isCleaning: !0,
            onTransitionEnd: e
        })
    }, c.onRevealTransitionEnd = function () {
        this.isHidden || this.emitEvent("reveal")
    }, c.getHideRevealTransitionEndProperty = function (t) {
        var e = this.layout.options[t];
        if (e.opacity) return "opacity";
        for (var i in e) return i
    }, c.hide = function () {
        this.isHidden = !0, this.css({display: ""});
        var t = this.layout.options, e = {};
        e[this.getHideRevealTransitionEndProperty("hiddenStyle")] = this.onHideTransitionEnd, this.transition({
            from: t.visibleStyle,
            to: t.hiddenStyle,
            isCleaning: !0,
            onTransitionEnd: e
        })
    }, c.onHideTransitionEnd = function () {
        this.isHidden && (this.css({display: "none"}), this.emitEvent("hide"))
    }, c.destroy = function () {
        this.css({position: "", left: "", right: "", top: "", bottom: "", transition: "", transform: ""})
    }, i
})),function (t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define("outlayer/outlayer", ["ev-emitter/ev-emitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item"], (function (i, n, r, o) {
        return e(t, i, n, r, o)
    })) : "object" == typeof module && module.exports ? module.exports = e(t, require("ev-emitter"), require("get-size"), require("fizzy-ui-utils"), require("./item")) : t.Outlayer = e(t, t.EvEmitter, t.getSize, t.fizzyUIUtils, t.Outlayer.Item)
}(window, (function (t, e, i, n, r) {
    "use strict";

    function o(t, e) {
        var i = n.getQueryElement(t);
        if (i) {
            this.element = i, c && (this.$element = c(this.element)), this.options = n.extend({}, this.constructor.defaults), this.option(e);
            var r = ++h;
            this.element.outlayerGUID = r, u[r] = this, this._create(), this._getOption("initLayout") && this.layout()
        } else a && a.error("Bad element for " + this.constructor.namespace + ": " + (i || t))
    }

    function s(t) {
        function e() {
            t.apply(this, arguments)
        }

        return e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e
    }

    var a = t.console, c = t.jQuery, l = function () {
    }, h = 0, u = {};
    o.namespace = "outlayer", o.Item = r, o.defaults = {
        containerStyle: {position: "relative"},
        initLayout: !0,
        originLeft: !0,
        originTop: !0,
        resize: !0,
        resizeContainer: !0,
        transitionDuration: "0.4s",
        hiddenStyle: {opacity: 0, transform: "scale(0.001)"},
        visibleStyle: {opacity: 1, transform: "scale(1)"}
    };
    var f = o.prototype;
    n.extend(f, e.prototype), f.option = function (t) {
        n.extend(this.options, t)
    }, f._getOption = function (t) {
        var e = this.constructor.compatOptions[t];
        return e && void 0 !== this.options[e] ? this.options[e] : this.options[t]
    }, o.compatOptions = {
        initLayout: "isInitLayout",
        horizontal: "isHorizontal",
        layoutInstant: "isLayoutInstant",
        originLeft: "isOriginLeft",
        originTop: "isOriginTop",
        resize: "isResizeBound",
        resizeContainer: "isResizingContainer"
    }, f._create = function () {
        this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), n.extend(this.element.style, this.options.containerStyle), this._getOption("resize") && this.bindResize()
    }, f.reloadItems = function () {
        this.items = this._itemize(this.element.children)
    }, f._itemize = function (t) {
        for (var e = this._filterFindItemElements(t), i = this.constructor.Item, n = [], r = 0; r < e.length; r++) {
            var o = new i(e[r], this);
            n.push(o)
        }
        return n
    }, f._filterFindItemElements = function (t) {
        return n.filterFindElements(t, this.options.itemSelector)
    }, f.getItemElements = function () {
        return this.items.map((function (t) {
            return t.element
        }))
    }, f.layout = function () {
        this._resetLayout(), this._manageStamps();
        var t = this._getOption("layoutInstant"), e = void 0 !== t ? t : !this._isLayoutInited;
        this.layoutItems(this.items, e), this._isLayoutInited = !0
    }, f._init = f.layout, f._resetLayout = function () {
        this.getSize()
    }, f.getSize = function () {
        this.size = i(this.element)
    }, f._getMeasurement = function (t, e) {
        var n, r = this.options[t];
        r ? ("string" == typeof r ? n = this.element.querySelector(r) : r instanceof HTMLElement && (n = r), this[t] = n ? i(n)[e] : r) : this[t] = 0
    }, f.layoutItems = function (t, e) {
        t = this._getItemsForLayout(t), this._layoutItems(t, e), this._postLayout()
    }, f._getItemsForLayout = function (t) {
        return t.filter((function (t) {
            return !t.isIgnored
        }))
    }, f._layoutItems = function (t, e) {
        if (this._emitCompleteOnItems("layout", t), t && t.length) {
            var i = [];
            t.forEach((function (t) {
                var n = this._getItemLayoutPosition(t);
                n.item = t, n.isInstant = e || t.isLayoutInstant, i.push(n)
            }), this), this._processLayoutQueue(i)
        }
    }, f._getItemLayoutPosition = function () {
        return {x: 0, y: 0}
    }, f._processLayoutQueue = function (t) {
        this.updateStagger(), t.forEach((function (t, e) {
            this._positionItem(t.item, t.x, t.y, t.isInstant, e)
        }), this)
    }, f.updateStagger = function () {
        var t = this.options.stagger;
        return null == t ? void (this.stagger = 0) : (this.stagger = function (t) {
            if ("number" == typeof t) return t;
            var e = t.match(/(^\d*\.?\d*)(\w*)/), i = e && e[1], n = e && e[2];
            return i.length ? (i = parseFloat(i)) * (d[n] || 1) : 0
        }(t), this.stagger)
    }, f._positionItem = function (t, e, i, n, r) {
        n ? t.goTo(e, i) : (t.stagger(r * this.stagger), t.moveTo(e, i))
    }, f._postLayout = function () {
        this.resizeContainer()
    }, f.resizeContainer = function () {
        if (this._getOption("resizeContainer")) {
            var t = this._getContainerSize();
            t && (this._setContainerMeasure(t.width, !0), this._setContainerMeasure(t.height, !1))
        }
    }, f._getContainerSize = l, f._setContainerMeasure = function (t, e) {
        if (void 0 !== t) {
            var i = this.size;
            i.isBorderBox && (t += e ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth), t = Math.max(t, 0), this.element.style[e ? "width" : "height"] = t + "px"
        }
    }, f._emitCompleteOnItems = function (t, e) {
        function i() {
            r.dispatchEvent(t + "Complete", null, [e])
        }

        function n() {
            ++s == o && i()
        }

        var r = this, o = e.length;
        if (e && o) {
            var s = 0;
            e.forEach((function (e) {
                e.once(t, n)
            }))
        } else i()
    }, f.dispatchEvent = function (t, e, i) {
        var n = e ? [e].concat(i) : i;
        if (this.emitEvent(t, n), c) if (this.$element = this.$element || c(this.element), e) {
            var r = c.Event(e);
            r.type = t, this.$element.trigger(r, i)
        } else this.$element.trigger(t, i)
    }, f.ignore = function (t) {
        var e = this.getItem(t);
        e && (e.isIgnored = !0)
    }, f.unignore = function (t) {
        var e = this.getItem(t);
        e && delete e.isIgnored
    }, f.stamp = function (t) {
        (t = this._find(t)) && (this.stamps = this.stamps.concat(t), t.forEach(this.ignore, this))
    }, f.unstamp = function (t) {
        (t = this._find(t)) && t.forEach((function (t) {
            n.removeFrom(this.stamps, t), this.unignore(t)
        }), this)
    }, f._find = function (t) {
        return t ? ("string" == typeof t && (t = this.element.querySelectorAll(t)), t = n.makeArray(t)) : void 0
    }, f._manageStamps = function () {
        this.stamps && this.stamps.length && (this._getBoundingRect(), this.stamps.forEach(this._manageStamp, this))
    }, f._getBoundingRect = function () {
        var t = this.element.getBoundingClientRect(), e = this.size;
        this._boundingRect = {
            left: t.left + e.paddingLeft + e.borderLeftWidth,
            top: t.top + e.paddingTop + e.borderTopWidth,
            right: t.right - (e.paddingRight + e.borderRightWidth),
            bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth)
        }
    }, f._manageStamp = l, f._getElementOffset = function (t) {
        var e = t.getBoundingClientRect(), n = this._boundingRect, r = i(t);
        return {
            left: e.left - n.left - r.marginLeft,
            top: e.top - n.top - r.marginTop,
            right: n.right - e.right - r.marginRight,
            bottom: n.bottom - e.bottom - r.marginBottom
        }
    }, f.handleEvent = n.handleEvent, f.bindResize = function () {
        t.addEventListener("resize", this), this.isResizeBound = !0
    }, f.unbindResize = function () {
        t.removeEventListener("resize", this), this.isResizeBound = !1
    }, f.onresize = function () {
        this.resize()
    }, n.debounceMethod(o, "onresize", 100), f.resize = function () {
        this.isResizeBound && this.needsResizeLayout() && this.layout()
    }, f.needsResizeLayout = function () {
        var t = i(this.element);
        return this.size && t && t.innerWidth !== this.size.innerWidth
    }, f.addItems = function (t) {
        var e = this._itemize(t);
        return e.length && (this.items = this.items.concat(e)), e
    }, f.appended = function (t) {
        var e = this.addItems(t);
        e.length && (this.layoutItems(e, !0), this.reveal(e))
    }, f.prepended = function (t) {
        var e = this._itemize(t);
        if (e.length) {
            var i = this.items.slice(0);
            this.items = e.concat(i), this._resetLayout(), this._manageStamps(), this.layoutItems(e, !0), this.reveal(e), this.layoutItems(i)
        }
    }, f.reveal = function (t) {
        if (this._emitCompleteOnItems("reveal", t), t && t.length) {
            var e = this.updateStagger();
            t.forEach((function (t, i) {
                t.stagger(i * e), t.reveal()
            }))
        }
    }, f.hide = function (t) {
        if (this._emitCompleteOnItems("hide", t), t && t.length) {
            var e = this.updateStagger();
            t.forEach((function (t, i) {
                t.stagger(i * e), t.hide()
            }))
        }
    }, f.revealItemElements = function (t) {
        var e = this.getItems(t);
        this.reveal(e)
    }, f.hideItemElements = function (t) {
        var e = this.getItems(t);
        this.hide(e)
    }, f.getItem = function (t) {
        for (var e = 0; e < this.items.length; e++) {
            var i = this.items[e];
            if (i.element == t) return i
        }
    }, f.getItems = function (t) {
        t = n.makeArray(t);
        var e = [];
        return t.forEach((function (t) {
            var i = this.getItem(t);
            i && e.push(i)
        }), this), e
    }, f.remove = function (t) {
        var e = this.getItems(t);
        this._emitCompleteOnItems("remove", e), e && e.length && e.forEach((function (t) {
            t.remove(), n.removeFrom(this.items, t)
        }), this)
    }, f.destroy = function () {
        var t = this.element.style;
        t.height = "", t.position = "", t.width = "", this.items.forEach((function (t) {
            t.destroy()
        })), this.unbindResize();
        var e = this.element.outlayerGUID;
        delete u[e], delete this.element.outlayerGUID, c && c.removeData(this.element, this.constructor.namespace)
    }, o.data = function (t) {
        var e = (t = n.getQueryElement(t)) && t.outlayerGUID;
        return e && u[e]
    }, o.create = function (t, e) {
        var i = s(o);
        return i.defaults = n.extend({}, o.defaults), n.extend(i.defaults, e), i.compatOptions = n.extend({}, o.compatOptions), i.namespace = t, i.data = o.data, i.Item = s(r), n.htmlInit(i, t), c && c.bridget && c.bridget(t, i), i
    };
    var d = {ms: 1, s: 1e3};
    return o.Item = r, o
})),function (t, e) {
    "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size"], e) : "object" == typeof module && module.exports ? module.exports = e(require("outlayer"), require("get-size")) : t.Masonry = e(t.Outlayer, t.getSize)
}(window, (function (t, e) {
    var i = t.create("masonry");
    i.compatOptions.fitWidth = "isFitWidth";
    var n = i.prototype;
    return n._resetLayout = function () {
        this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns(), this.colYs = [];
        for (var t = 0; t < this.cols; t++) this.colYs.push(0);
        this.maxY = 0, this.horizontalColIndex = 0
    }, n.measureColumns = function () {
        if (this.getContainerWidth(), !this.columnWidth) {
            var t = this.items[0], i = t && t.element;
            this.columnWidth = i && e(i).outerWidth || this.containerWidth
        }
        var n = this.columnWidth += this.gutter, r = this.containerWidth + this.gutter, o = r / n, s = n - r % n;
        o = Math[s && 1 > s ? "round" : "floor"](o), this.cols = Math.max(o, 1)
    }, n.getContainerWidth = function () {
        var t = this._getOption("fitWidth") ? this.element.parentNode : this.element, i = e(t);
        this.containerWidth = i && i.innerWidth
    }, n._getItemLayoutPosition = function (t) {
        t.getSize();
        var e = t.size.outerWidth % this.columnWidth,
            i = Math[e && 1 > e ? "round" : "ceil"](t.size.outerWidth / this.columnWidth);
        i = Math.min(i, this.cols);
        for (var n = this[this.options.horizontalOrder ? "_getHorizontalColPosition" : "_getTopColPosition"](i, t), r = {
            x: this.columnWidth * n.col,
            y: n.y
        }, o = n.y + t.size.outerHeight, s = i + n.col, a = n.col; s > a; a++) this.colYs[a] = o;
        return r
    }, n._getTopColPosition = function (t) {
        var e = this._getTopColGroup(t), i = Math.min.apply(Math, e);
        return {col: e.indexOf(i), y: i}
    }, n._getTopColGroup = function (t) {
        if (2 > t) return this.colYs;
        for (var e = [], i = this.cols + 1 - t, n = 0; i > n; n++) e[n] = this._getColGroupY(n, t);
        return e
    }, n._getColGroupY = function (t, e) {
        if (2 > e) return this.colYs[t];
        var i = this.colYs.slice(t, t + e);
        return Math.max.apply(Math, i)
    }, n._getHorizontalColPosition = function (t, e) {
        var i = this.horizontalColIndex % this.cols;
        i = t > 1 && i + t > this.cols ? 0 : i;
        var n = e.size.outerWidth && e.size.outerHeight;
        return this.horizontalColIndex = n ? i + t : this.horizontalColIndex, {col: i, y: this._getColGroupY(i, t)}
    }, n._manageStamp = function (t) {
        var i = e(t), n = this._getElementOffset(t), r = this._getOption("originLeft") ? n.left : n.right,
            o = r + i.outerWidth, s = Math.floor(r / this.columnWidth);
        s = Math.max(0, s);
        var a = Math.floor(o / this.columnWidth);
        a -= o % this.columnWidth ? 0 : 1, a = Math.min(this.cols - 1, a);
        for (var c = (this._getOption("originTop") ? n.top : n.bottom) + i.outerHeight, l = s; a >= l; l++) this.colYs[l] = Math.max(c, this.colYs[l])
    }, n._getContainerSize = function () {
        this.maxY = Math.max.apply(Math, this.colYs);
        var t = {height: this.maxY};
        return this._getOption("fitWidth") && (t.width = this._getContainerFitWidth()), t
    }, n._getContainerFitWidth = function () {
        for (var t = 0, e = this.cols; --e && 0 === this.colYs[e];) t++;
        return (this.cols - t) * this.columnWidth - this.gutter
    }, n.needsResizeLayout = function () {
        var t = this.containerWidth;
        return this.getContainerWidth(), t != this.containerWidth
    }, i
}));
var qrcode = function () {
    var t = function (t, e) {
        var i = t, n = r[e], s = null, c = 0, l = null, v = [], m = {}, b = function (t, e) {
            s = function (t) {
                for (var e = new Array(t), i = 0; i < t; i += 1) {
                    e[i] = new Array(t);
                    for (var n = 0; n < t; n += 1) e[i][n] = null
                }
                return e
            }(c = 4 * i + 17), y(0, 0), y(c - 7, 0), y(0, c - 7), w(), x(), S(t, e), 7 <= i && C(t), null == l && (l = O(i, n, v)), T(l, e)
        }, y = function (t, e) {
            for (var i = -1; i <= 7; i += 1) if (!(t + i <= -1 || c <= t + i)) for (var n = -1; n <= 7; n += 1) e + n <= -1 || c <= e + n || (s[t + i][e + n] = 0 <= i && i <= 6 && (0 == n || 6 == n) || 0 <= n && n <= 6 && (0 == i || 6 == i) || 2 <= i && i <= 4 && 2 <= n && n <= 4)
        }, x = function () {
            for (var t = 8; t < c - 8; t += 1) null == s[t][6] && (s[t][6] = t % 2 == 0);
            for (var e = 8; e < c - 8; e += 1) null == s[6][e] && (s[6][e] = e % 2 == 0)
        }, w = function () {
            for (var t = o.getPatternPosition(i), e = 0; e < t.length; e += 1) for (var n = 0; n < t.length; n += 1) {
                var r = t[e], a = t[n];
                if (null == s[r][a]) for (var c = -2; c <= 2; c += 1) for (var l = -2; l <= 2; l += 1) s[r + c][a + l] = -2 == c || 2 == c || -2 == l || 2 == l || 0 == c && 0 == l
            }
        }, C = function (t) {
            for (var e = o.getBCHTypeNumber(i), n = 0; n < 18; n += 1) {
                var r = !t && 1 == (e >> n & 1);
                s[Math.floor(n / 3)][n % 3 + c - 8 - 3] = r
            }
            for (n = 0; n < 18; n += 1) r = !t && 1 == (e >> n & 1), s[n % 3 + c - 8 - 3][Math.floor(n / 3)] = r
        }, S = function (t, e) {
            for (var i = n << 3 | e, r = o.getBCHTypeInfo(i), a = 0; a < 15; a += 1) {
                var l = !t && 1 == (r >> a & 1);
                a < 6 ? s[a][8] = l : a < 8 ? s[a + 1][8] = l : s[c - 15 + a][8] = l
            }
            for (a = 0; a < 15; a += 1) l = !t && 1 == (r >> a & 1), a < 8 ? s[8][c - a - 1] = l : a < 9 ? s[8][15 - a - 1 + 1] = l : s[8][15 - a - 1] = l;
            s[c - 8][8] = !t
        }, T = function (t, e) {
            for (var i = -1, n = c - 1, r = 7, a = 0, l = o.getMaskFunction(e), h = c - 1; 0 < h; h -= 2) for (6 == h && (h -= 1); ;) {
                for (var u = 0; u < 2; u += 1) if (null == s[n][h - u]) {
                    var f = !1;
                    a < t.length && (f = 1 == (t[a] >>> r & 1)), l(n, h - u) && (f = !f), s[n][h - u] = f, -1 == (r -= 1) && (a += 1, r = 7)
                }
                if ((n += i) < 0 || c <= n) {
                    n -= i, i = -i;
                    break
                }
            }
        }, O = function (t, e, i) {
            for (var n = h.getRSBlocks(t, e), r = u(), s = 0; s < i.length; s += 1) {
                var c = i[s];
                r.put(c.getMode(), 4), r.put(c.getLength(), o.getLengthInBits(c.getMode(), t)), c.write(r)
            }
            var l = 0;
            for (s = 0; s < n.length; s += 1) l += n[s].dataCount;
            if (r.getLengthInBits() > 8 * l) throw "code length overflow. (" + r.getLengthInBits() + ">" + 8 * l + ")";
            for (r.getLengthInBits() + 4 <= 8 * l && r.put(0, 4); r.getLengthInBits() % 8 != 0;) r.putBit(!1);
            for (; !(r.getLengthInBits() >= 8 * l || (r.put(236, 8), r.getLengthInBits() >= 8 * l));) r.put(17, 8);
            return function (t, e) {
                for (var i = 0, n = 0, r = 0, s = new Array(e.length), c = new Array(e.length), l = 0; l < e.length; l += 1) {
                    var h = e[l].dataCount, u = e[l].totalCount - h;
                    n = Math.max(n, h), r = Math.max(r, u), s[l] = new Array(h);
                    for (var f = 0; f < s[l].length; f += 1) s[l][f] = 255 & t.getBuffer()[f + i];
                    i += h;
                    var d = o.getErrorCorrectPolynomial(u), p = a(s[l], d.getLength() - 1).mod(d);
                    for (c[l] = new Array(d.getLength() - 1), f = 0; f < c[l].length; f += 1) {
                        var g = f + p.getLength() - c[l].length;
                        c[l][f] = 0 <= g ? p.getAt(g) : 0
                    }
                }
                var v = 0;
                for (f = 0; f < e.length; f += 1) v += e[f].totalCount;
                var m = new Array(v), _ = 0;
                for (f = 0; f < n; f += 1) for (l = 0; l < e.length; l += 1) f < s[l].length && (m[_] = s[l][f], _ += 1);
                for (f = 0; f < r; f += 1) for (l = 0; l < e.length; l += 1) f < c[l].length && (m[_] = c[l][f], _ += 1);
                return m
            }(r, n)
        };
        return m.addData = function (t, e) {
            var i = null;
            switch (e = e || "Byte") {
                case"Numeric":
                    i = f(t);
                    break;
                case"Alphanumeric":
                    i = d(t);
                    break;
                case"Byte":
                    i = p(t);
                    break;
                case"Kanji":
                    i = g(t);
                    break;
                default:
                    throw "mode:" + e
            }
            v.push(i), l = null
        }, m.isDark = function (t, e) {
            if (t < 0 || c <= t || e < 0 || c <= e) throw t + "," + e;
            return s[t][e]
        }, m.getModuleCount = function () {
            return c
        }, m.make = function () {
            if (i < 1) {
                for (var t = 1; t < 40; t++) {
                    for (var e = h.getRSBlocks(t, n), r = u(), s = 0; s < v.length; s++) {
                        var a = v[s];
                        r.put(a.getMode(), 4), r.put(a.getLength(), o.getLengthInBits(a.getMode(), t)), a.write(r)
                    }
                    var c = 0;
                    for (s = 0; s < e.length; s++) c += e[s].dataCount;
                    if (r.getLengthInBits() <= 8 * c) break
                }
                i = t
            }
            b(!1, function () {
                for (var t = 0, e = 0, i = 0; i < 8; i += 1) {
                    b(!0, i);
                    var n = o.getLostPoint(m);
                    (0 == i || n < t) && (t = n, e = i)
                }
                return e
            }())
        }, m.createTableTag = function (t, e) {
            t = t || 2;
            var i = "";
            i += '<table style="', i += " border-width: 0px; border-style: none;", i += " border-collapse: collapse;", i += " padding: 0px; margin: " + (e = void 0 === e ? 4 * t : e) + "px;", i += '">', i += "<tbody>";
            for (var n = 0; n < m.getModuleCount(); n += 1) {
                i += "<tr>";
                for (var r = 0; r < m.getModuleCount(); r += 1) i += '<td style="', i += " border-width: 0px; border-style: none;", i += " border-collapse: collapse;", i += " padding: 0px; margin: 0px;", i += " width: " + t + "px;", i += " height: " + t + "px;", i += " background-color: ", i += m.isDark(n, r) ? "#000000" : "#ffffff", i += ";", i += '"/>';
                i += "</tr>"
            }
            return (i += "</tbody>") + "</table>"
        }, m.createSvgTag = function (t, e) {
            t = t || 4, e = void 0 === e ? 4 * t : e, e = 0;
            var i, n, r, o, s = m.getModuleCount() * t + 2 * e, a = "";
            for (o = "l" + t + ",0 0," + t + " -" + t + ",0 0,-" + t + "z ", a += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', a += ' width="' + s + 'px"', a += ' height="' + s + 'px"', a += ' viewBox="0 0 ' + s + " " + s + '" ', a += ' preserveAspectRatio="xMinYMin meet">', a += '<path d="', n = 0; n < m.getModuleCount(); n += 1) for (r = n * t + e, i = 0; i < m.getModuleCount(); i += 1) m.isDark(n, i) && (a += "M" + (i * t + e) + "," + r + o);
            return (a += '" stroke="transparent" fill="black"/>') + "</svg>"
        }, m.createImgTag = function (t, e) {
            t = t || 2, e = void 0 === e ? 4 * t : e;
            var i = m.getModuleCount() * t + 2 * e, n = e, r = i - e;
            return _(i, i, (function (e, i) {
                if (n <= e && e < r && n <= i && i < r) {
                    var o = Math.floor((e - n) / t), s = Math.floor((i - n) / t);
                    return m.isDark(s, o) ? 0 : 1
                }
                return 1
            }))
        }, m
    };
    t.stringToBytes = (t.stringToBytesFuncs = {
        default: function (t) {
            for (var e = [], i = 0; i < t.length; i += 1) {
                var n = t.charCodeAt(i);
                e.push(255 & n)
            }
            return e
        }
    }).default, t.createStringToBytes = function (t, e) {
        var i = function () {
            for (var i = m(t), n = function () {
                var t = i.read();
                if (-1 == t) throw "eof";
                return t
            }, r = 0, o = {}; ;) {
                var s = i.read();
                if (-1 == s) break;
                var a = n(), c = n() << 8 | n();
                o[String.fromCharCode(s << 8 | a)] = c, r += 1
            }
            if (r != e) throw r + " != " + e;
            return o
        }(), n = "?".charCodeAt(0);
        return function (t) {
            for (var e = [], r = 0; r < t.length; r += 1) {
                var o = t.charCodeAt(r);
                if (o < 128) e.push(o); else {
                    var s = i[t.charAt(r)];
                    "number" == typeof s ? (255 & s) == s ? e.push(s) : (e.push(s >>> 8), e.push(255 & s)) : e.push(n)
                }
            }
            return e
        }
    };
    var e, i, n, r = {L: 1, M: 0, Q: 3, H: 2},
        o = (e = [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]], n = function (t) {
            for (var e = 0; 0 != t;) e += 1, t >>>= 1;
            return e
        }, (i = {}).getBCHTypeInfo = function (t) {
            for (var e = t << 10; 0 <= n(e) - n(1335);) e ^= 1335 << n(e) - n(1335);
            return 21522 ^ (t << 10 | e)
        }, i.getBCHTypeNumber = function (t) {
            for (var e = t << 12; 0 <= n(e) - n(7973);) e ^= 7973 << n(e) - n(7973);
            return t << 12 | e
        }, i.getPatternPosition = function (t) {
            return e[t - 1]
        }, i.getMaskFunction = function (t) {
            switch (t) {
                case 0:
                    return function (t, e) {
                        return (t + e) % 2 == 0
                    };
                case 1:
                    return function (t, e) {
                        return t % 2 == 0
                    };
                case 2:
                    return function (t, e) {
                        return e % 3 == 0
                    };
                case 3:
                    return function (t, e) {
                        return (t + e) % 3 == 0
                    };
                case 4:
                    return function (t, e) {
                        return (Math.floor(t / 2) + Math.floor(e / 3)) % 2 == 0
                    };
                case 5:
                    return function (t, e) {
                        return t * e % 2 + t * e % 3 == 0
                    };
                case 6:
                    return function (t, e) {
                        return (t * e % 2 + t * e % 3) % 2 == 0
                    };
                case 7:
                    return function (t, e) {
                        return (t * e % 3 + (t + e) % 2) % 2 == 0
                    };
                default:
                    throw "bad maskPattern:" + t
            }
        }, i.getErrorCorrectPolynomial = function (t) {
            for (var e = a([1], 0), i = 0; i < t; i += 1) e = e.multiply(a([1, s.gexp(i)], 0));
            return e
        }, i.getLengthInBits = function (t, e) {
            if (1 <= e && e < 10) switch (t) {
                case 1:
                    return 10;
                case 2:
                    return 9;
                case 4:
                case 8:
                    return 8;
                default:
                    throw "mode:" + t
            } else if (e < 27) switch (t) {
                case 1:
                    return 12;
                case 2:
                    return 11;
                case 4:
                    return 16;
                case 8:
                    return 10;
                default:
                    throw "mode:" + t
            } else {
                if (!(e < 41)) throw "type:" + e;
                switch (t) {
                    case 1:
                        return 14;
                    case 2:
                        return 13;
                    case 4:
                        return 16;
                    case 8:
                        return 12;
                    default:
                        throw "mode:" + t
                }
            }
        }, i.getLostPoint = function (t) {
            for (var e = t.getModuleCount(), i = 0, n = 0; n < e; n += 1) for (var r = 0; r < e; r += 1) {
                for (var o = 0, s = t.isDark(n, r), a = -1; a <= 1; a += 1) if (!(n + a < 0 || e <= n + a)) for (var c = -1; c <= 1; c += 1) r + c < 0 || e <= r + c || 0 == a && 0 == c || s == t.isDark(n + a, r + c) && (o += 1);
                5 < o && (i += 3 + o - 5)
            }
            for (n = 0; n < e - 1; n += 1) for (r = 0; r < e - 1; r += 1) {
                var l = 0;
                t.isDark(n, r) && (l += 1), t.isDark(n + 1, r) && (l += 1), t.isDark(n, r + 1) && (l += 1), t.isDark(n + 1, r + 1) && (l += 1), 0 != l && 4 != l || (i += 3)
            }
            for (n = 0; n < e; n += 1) for (r = 0; r < e - 6; r += 1) t.isDark(n, r) && !t.isDark(n, r + 1) && t.isDark(n, r + 2) && t.isDark(n, r + 3) && t.isDark(n, r + 4) && !t.isDark(n, r + 5) && t.isDark(n, r + 6) && (i += 40);
            for (r = 0; r < e; r += 1) for (n = 0; n < e - 6; n += 1) t.isDark(n, r) && !t.isDark(n + 1, r) && t.isDark(n + 2, r) && t.isDark(n + 3, r) && t.isDark(n + 4, r) && !t.isDark(n + 5, r) && t.isDark(n + 6, r) && (i += 40);
            var h = 0;
            for (r = 0; r < e; r += 1) for (n = 0; n < e; n += 1) t.isDark(n, r) && (h += 1);
            return i + Math.abs(100 * h / e / e - 50) / 5 * 10
        }, i), s = function () {
            for (var t = new Array(256), e = new Array(256), i = 0; i < 8; i += 1) t[i] = 1 << i;
            for (i = 8; i < 256; i += 1) t[i] = t[i - 4] ^ t[i - 5] ^ t[i - 6] ^ t[i - 8];
            for (i = 0; i < 255; i += 1) e[t[i]] = i;
            var n = {
                glog: function (t) {
                    if (t < 1) throw "glog(" + t + ")";
                    return e[t]
                }, gexp: function (e) {
                    for (; e < 0;) e += 255;
                    for (; 256 <= e;) e -= 255;
                    return t[e]
                }
            };
            return n
        }();

    function a(t, e) {
        if (void 0 === t.length) throw t.length + "/" + e;
        var i = function () {
            for (var i = 0; i < t.length && 0 == t[i];) i += 1;
            for (var n = new Array(t.length - i + e), r = 0; r < t.length - i; r += 1) n[r] = t[r + i];
            return n
        }(), n = {
            getAt: function (t) {
                return i[t]
            }, getLength: function () {
                return i.length
            }, multiply: function (t) {
                for (var e = new Array(n.getLength() + t.getLength() - 1), i = 0; i < n.getLength(); i += 1) for (var r = 0; r < t.getLength(); r += 1) e[i + r] ^= s.gexp(s.glog(n.getAt(i)) + s.glog(t.getAt(r)));
                return a(e, 0)
            }, mod: function (t) {
                if (n.getLength() - t.getLength() < 0) return n;
                for (var e = s.glog(n.getAt(0)) - s.glog(t.getAt(0)), i = new Array(n.getLength()), r = 0; r < n.getLength(); r += 1) i[r] = n.getAt(r);
                for (r = 0; r < t.getLength(); r += 1) i[r] ^= s.gexp(s.glog(t.getAt(r)) + e);
                return a(i, 0).mod(t)
            }
        };
        return n
    }

    var c, l,
        h = (c = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12, 7, 37, 13], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]], (l = {}).getRSBlocks = function (t, e) {
            var i = function (t, e) {
                switch (e) {
                    case r.L:
                        return c[4 * (t - 1) + 0];
                    case r.M:
                        return c[4 * (t - 1) + 1];
                    case r.Q:
                        return c[4 * (t - 1) + 2];
                    case r.H:
                        return c[4 * (t - 1) + 3];
                    default:
                        return
                }
            }(t, e);
            if (void 0 === i) throw "bad rs block @ typeNumber:" + t + "/errorCorrectionLevel:" + e;
            for (var n, o, s = i.length / 3, a = [], l = 0; l < s; l += 1) for (var h = i[3 * l + 0], u = i[3 * l + 1], f = i[3 * l + 2], d = 0; d < h; d += 1) a.push((n = f, o = void 0, (o = {}).totalCount = u, o.dataCount = n, o));
            return a
        }, l), u = function () {
            var t = [], e = 0, i = {
                getBuffer: function () {
                    return t
                }, getAt: function (e) {
                    var i = Math.floor(e / 8);
                    return 1 == (t[i] >>> 7 - e % 8 & 1)
                }, put: function (t, e) {
                    for (var n = 0; n < e; n += 1) i.putBit(1 == (t >>> e - n - 1 & 1))
                }, getLengthInBits: function () {
                    return e
                }, putBit: function (i) {
                    var n = Math.floor(e / 8);
                    t.length <= n && t.push(0), i && (t[n] |= 128 >>> e % 8), e += 1
                }
            };
            return i
        }, f = function (t) {
            var e = t, i = {
                getMode: function () {
                    return 1
                }, getLength: function (t) {
                    return e.length
                }, write: function (t) {
                    for (var i = e, r = 0; r + 2 < i.length;) t.put(n(i.substring(r, r + 3)), 10), r += 3;
                    r < i.length && (i.length - r == 1 ? t.put(n(i.substring(r, r + 1)), 4) : i.length - r == 2 && t.put(n(i.substring(r, r + 2)), 7))
                }
            }, n = function (t) {
                for (var e = 0, i = 0; i < t.length; i += 1) e = 10 * e + r(t.charAt(i));
                return e
            }, r = function (t) {
                if ("0" <= t && t <= "9") return t.charCodeAt(0) - "0".charCodeAt(0);
                throw "illegal char :" + t
            };
            return i
        }, d = function (t) {
            var e = t, i = {
                getMode: function () {
                    return 2
                }, getLength: function (t) {
                    return e.length
                }, write: function (t) {
                    for (var i = e, r = 0; r + 1 < i.length;) t.put(45 * n(i.charAt(r)) + n(i.charAt(r + 1)), 11), r += 2;
                    r < i.length && t.put(n(i.charAt(r)), 6)
                }
            }, n = function (t) {
                if ("0" <= t && t <= "9") return t.charCodeAt(0) - "0".charCodeAt(0);
                if ("A" <= t && t <= "Z") return t.charCodeAt(0) - "A".charCodeAt(0) + 10;
                switch (t) {
                    case" ":
                        return 36;
                    case"$":
                        return 37;
                    case"%":
                        return 38;
                    case"*":
                        return 39;
                    case"+":
                        return 40;
                    case"-":
                        return 41;
                    case".":
                        return 42;
                    case"/":
                        return 43;
                    case":":
                        return 44;
                    default:
                        throw "illegal char :" + t
                }
            };
            return i
        }, p = function (e) {
            var i = t.stringToBytes(e), n = {
                getMode: function () {
                    return 4
                }, getLength: function (t) {
                    return i.length
                }, write: function (t) {
                    for (var e = 0; e < i.length; e += 1) t.put(i[e], 8)
                }
            };
            return n
        }, g = function (e) {
            var i = t.stringToBytesFuncs.SJIS;
            if (!i) throw "sjis not supported.";
            !function (t, e) {
                var n = i("友");
                if (2 != n.length || 38726 != (n[0] << 8 | n[1])) throw "sjis not supported."
            }();
            var n = i(e), r = {
                getMode: function () {
                    return 8
                }, getLength: function (t) {
                    return ~~(n.length / 2)
                }, write: function (t) {
                    for (var e = n, i = 0; i + 1 < e.length;) {
                        var r = (255 & e[i]) << 8 | 255 & e[i + 1];
                        if (33088 <= r && r <= 40956) r -= 33088; else {
                            if (!(57408 <= r && r <= 60351)) throw "illegal char at " + (i + 1) + "/" + r;
                            r -= 49472
                        }
                        r = 192 * (r >>> 8 & 255) + (255 & r), t.put(r, 13), i += 2
                    }
                    if (i < e.length) throw "illegal char at " + (i + 1)
                }
            };
            return r
        }, v = function () {
            var t = [], e = {
                writeByte: function (e) {
                    t.push(255 & e)
                }, writeShort: function (t) {
                    e.writeByte(t), e.writeByte(t >>> 8)
                }, writeBytes: function (t, i, n) {
                    i = i || 0, n = n || t.length;
                    for (var r = 0; r < n; r += 1) e.writeByte(t[r + i])
                }, writeString: function (t) {
                    for (var i = 0; i < t.length; i += 1) e.writeByte(t.charCodeAt(i))
                }, toByteArray: function () {
                    return t
                }, toString: function () {
                    var e = "";
                    e += "[";
                    for (var i = 0; i < t.length; i += 1) 0 < i && (e += ","), e += t[i];
                    return e + "]"
                }
            };
            return e
        }, m = function (t) {
            var e = t, i = 0, n = 0, r = 0, o = {
                read: function () {
                    for (; r < 8;) {
                        if (i >= e.length) {
                            if (0 == r) return -1;
                            throw "unexpected end of file./" + r
                        }
                        var t = e.charAt(i);
                        if (i += 1, "=" == t) return r = 0, -1;
                        t.match(/^\s$/) || (n = n << 6 | s(t.charCodeAt(0)), r += 6)
                    }
                    var o = n >>> r - 8 & 255;
                    return r -= 8, o
                }
            }, s = function (t) {
                if (65 <= t && t <= 90) return t - 65;
                if (97 <= t && t <= 122) return t - 97 + 26;
                if (48 <= t && t <= 57) return t - 48 + 52;
                if (43 == t) return 62;
                if (47 == t) return 63;
                throw "c:" + t
            };
            return o
        }, _ = function (t, e, i, n) {
            for (var r, o, s, a, c, l, h, u, f = (s = r = t, a = o = e, c = new Array(r * o), l = {
                setPixel: function (t, e, i) {
                    c[e * s + t] = i
                }, write: function (t) {
                    t.writeString("GIF87a"), t.writeShort(s), t.writeShort(a), t.writeByte(128), t.writeByte(0), t.writeByte(0), t.writeByte(0), t.writeByte(0), t.writeByte(0), t.writeByte(255), t.writeByte(255), t.writeByte(255), t.writeString(","), t.writeShort(0), t.writeShort(0), t.writeShort(s), t.writeShort(a), t.writeByte(0);
                    var e = h(2);
                    t.writeByte(2);
                    for (var i = 0; 255 < e.length - i;) t.writeByte(255), t.writeBytes(e, i, 255), i += 255;
                    t.writeByte(e.length - i), t.writeBytes(e, i, e.length - i), t.writeByte(0), t.writeString(";")
                }
            }, h = function (t) {
                for (var e = 1 << t, i = 1 + (1 << t), n = t + 1, r = u(), o = 0; o < e; o += 1) r.add(String.fromCharCode(o));
                r.add(String.fromCharCode(e)), r.add(String.fromCharCode(i));
                var s, a, l, h = v(), f = (s = h, l = a = 0, {
                    write: function (t, e) {
                        if (t >>> e != 0) throw "length over";
                        for (; 8 <= a + e;) s.writeByte(255 & (t << a | l)), e -= 8 - a, t >>>= 8 - a, a = l = 0;
                        l |= t << a, a += e
                    }, flush: function () {
                        0 < a && s.writeByte(l)
                    }
                });
                f.write(e, n);
                var d = 0, p = String.fromCharCode(c[d]);
                for (d += 1; d < c.length;) {
                    var g = String.fromCharCode(c[d]);
                    d += 1, r.contains(p + g) ? p += g : (f.write(r.indexOf(p), n), r.size() < 4095 && (r.size() == 1 << n && (n += 1), r.add(p + g)), p = g)
                }
                return f.write(r.indexOf(p), n), f.write(i, n), f.flush(), h.toByteArray()
            }, u = function () {
                var t = {}, e = 0, i = {
                    add: function (n) {
                        if (i.contains(n)) throw "dup key:" + n;
                        t[n] = e, e += 1
                    }, size: function () {
                        return e
                    }, indexOf: function (e) {
                        return t[e]
                    }, contains: function (e) {
                        return void 0 !== t[e]
                    }
                };
                return i
            }, l), d = 0; d < e; d += 1) for (var p = 0; p < t; p += 1) f.setPixel(p, d, i(p, d));
            var g = v();
            f.write(g);
            for (var m, _, b, y, x, w, C, S = (b = _ = m = 0, y = "", w = function (t) {
                y += String.fromCharCode(C(63 & t))
            }, C = function (t) {
                if (t < 0) ; else {
                    if (t < 26) return 65 + t;
                    if (t < 52) return t - 26 + 97;
                    if (t < 62) return t - 52 + 48;
                    if (62 == t) return 43;
                    if (63 == t) return 47
                }
                throw "n:" + t
            }, (x = {}).writeByte = function (t) {
                for (m = m << 8 | 255 & t, _ += 8, b += 1; 6 <= _;) w(m >>> _ - 6), _ -= 6
            }, x.flush = function () {
                if (0 < _ && (w(m << 6 - _), _ = m = 0), b % 3 != 0) for (var t = 3 - b % 3, e = 0; e < t; e += 1) y += "="
            }, x.toString = function () {
                return y
            }, x), T = g.toByteArray(), O = 0; O < T.length; O += 1) S.writeByte(T[O]);
            S.flush();
            var E = "";
            return E += "<img", E += ' src="', E += "data:image/gif;base64,", E += S, E += '"', E += ' width="', E += t, E += '"', E += ' height="', E += e, E += '"', n && (E += ' alt="', E += n, E += '"'), E + "/>"
        };
    return t
}();
qrcode.stringToBytesFuncs["UTF-8"] = function (t) {
    return function (t) {
        for (var e = [], i = 0; i < t.length; i++) {
            var n = t.charCodeAt(i);
            n < 128 ? e.push(n) : n < 2048 ? e.push(192 | n >> 6, 128 | 63 & n) : n < 55296 || 57344 <= n ? e.push(224 | n >> 12, 128 | n >> 6 & 63, 128 | 63 & n) : (i++, n = 65536 + ((1023 & n) << 10 | 1023 & t.charCodeAt(i)), e.push(240 | n >> 18, 128 | n >> 12 & 63, 128 | n >> 6 & 63, 128 | 63 & n))
        }
        return e
    }(t)
}, function (t) {
    "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports && (module.exports = t())
}((function () {
    return qrcode
})), function (t) {
    "function" == typeof define && define.amd ? define(["jquery"], t) : "object" == typeof exports && "object" == typeof module ? module.exports = t(require("jquery")) : t(jQuery)
}((function (t, e) {
    var i = {
            beforeShow: h,
            move: h,
            change: h,
            show: h,
            hide: h,
            color: !1,
            flat: !1,
            showInput: !1,
            allowEmpty: !1,
            showButtons: !0,
            clickoutFiresChange: !0,
            showInitial: !1,
            showPalette: !1,
            showPaletteOnly: !1,
            hideAfterPaletteSelect: !0,
            togglePaletteOnly: !1,
            showSelectionPalette: !0,
            localStorageKey: !1,
            appendTo: "body",
            maxSelectionSize: 7,
            cancelText: "cancel",
            chooseText: "choose",
            togglePaletteMoreText: "more",
            togglePaletteLessText: "less",
            clearText: "Clear Color Selection",
            noColorSelectedText: "No Color Selected",
            preferredFormat: !1,
            className: "",
            containerClassName: "",
            replacerClassName: "",
            showAlpha: !0,
            theme: "sp-light",
            palette: [["#ffffff", "#000000", "#ff0000", "#ff8000", "#ffff00", "#008000", "#0000ff", "#4b0082", "#9400d3"]],
            selectionPalette: [],
            disabled: !1,
            offset: null
        }, n = [], r = !!/msie/i.exec(window.navigator.userAgent), o = function () {
            function t(t, e) {
                return !!~("" + t).indexOf(e)
            }

            var e = document.createElement("div").style;
            return e.cssText = "background-color:rgba(0,0,0,.5)", t(e.backgroundColor, "rgba") || t(e.backgroundColor, "hsla")
        }(),
        s = ["<div class='sp-replacer'>", "<div class='sp-preview'><div class='sp-preview-inner'></div></div>", "<div class='sp-dd'>&#9660;</div>", "</div>"].join(""),
        a = function () {
            var t = "";
            if (r) for (var e = 1; e <= 6; e++) t += "<div class='sp-" + e + "'></div>";
            return ["<div class='sp-container sp-hidden'>", "<div class='sp-palette-container'>", "<div class='sp-palette sp-thumb sp-cf'></div>", "<div class='sp-palette-button-container sp-cf'>", "<button type='button' class='sp-palette-toggle'></button>", "</div>", "</div>", "<div class='sp-picker-container'>", "<div class='sp-top sp-cf'>", "<div class='sp-fill'></div>", "<div class='sp-top-inner'>", "<div class='sp-color'>", "<div class='sp-sat'>", "<div class='sp-val'>", "<div class='sp-dragger'></div>", "</div>", "</div>", "</div>", "<div class='sp-clear sp-clear-display'>", "</div>", "<div class='sp-hue'>", "<div class='sp-slider'></div>", t, "</div>", "</div>", "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>", "</div>", "<div class='sp-input-container sp-cf'>", "<input class='sp-input' type='text' spellcheck='false'  />", "</div>", "<div class='sp-initial sp-thumb sp-cf'></div>", "<div class='sp-button-container sp-cf'>", "<a class='sp-cancel' href='#'></a>", "<button type='button' class='sp-choose'></button>", "</div>", "</div>", "</div>"].join("")
        }();

    function c(e, i, n, r) {
        for (var s = [], a = 0; a < e.length; a++) {
            var c = e[a];
            if (c) {
                var l = tinycolor(c), h = l.toHsl().l < .5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
                h += tinycolor.equals(i, c) ? " sp-thumb-active" : "";
                var u = l.toString(r.preferredFormat || "rgb"),
                    f = o ? "background-color:" + l.toRgbString() : "filter:" + l.toFilter();
                s.push('<span title="' + u + '" data-color="' + l.toRgbString() + '" class="' + h + '"><span class="sp-thumb-inner" style="' + f + ';" /></span>')
            } else {
                s.push(t("<div />").append(t('<span data-color="" style="background-color:transparent;" class="sp-clear-display"></span>').attr("title", r.noColorSelectedText)).html())
            }
        }
        return "<div class='sp-cf " + n + "'>" + s.join("") + "</div>"
    }

    function l(l, h) {
        var g, v, m, _, b = function (e, n) {
                var r = t.extend({}, i, e);
                return r.callbacks = {
                    move: f(r.move, n),
                    change: f(r.change, n),
                    show: f(r.show, n),
                    hide: f(r.hide, n),
                    beforeShow: f(r.beforeShow, n)
                }, r
            }(h, l), y = b.flat, x = b.showSelectionPalette, w = b.localStorageKey, C = b.theme, S = b.callbacks,
            T = (g = Ht, v = 10, function () {
                var t = this, e = arguments, i = function () {
                    _ = null, g.apply(t, e)
                };
                m && clearTimeout(_), !m && _ || (_ = setTimeout(i, v))
            }), O = !1, E = !1, k = 0, P = 0, j = 0, A = 0, M = 0, D = 0, I = 0, L = 0, F = 0, R = 0, B = 1, z = [],
            X = [], W = {}, Y = b.selectionPalette.slice(0), H = b.maxSelectionSize, U = "sp-dragging", N = null,
            G = l.ownerDocument, V = (G.body, t(l)), $ = !1, q = t(a, G).addClass(C),
            K = q.find(".sp-picker-container"), J = q.find(".sp-color"), Q = q.find(".sp-dragger"),
            Z = q.find(".sp-hue"), tt = q.find(".sp-slider"), et = q.find(".sp-alpha-inner"), it = q.find(".sp-alpha"),
            nt = q.find(".sp-alpha-handle"), rt = q.find(".sp-input"), ot = q.find(".sp-palette"),
            st = q.find(".sp-initial"), at = q.find(".sp-cancel"), ct = q.find(".sp-clear"), lt = q.find(".sp-choose"),
            ht = q.find(".sp-palette-toggle"), ut = V.is("input"), ft = ut && "color" === V.attr("type") && p(),
            dt = ut && !y, pt = dt ? t(s).addClass(C).addClass(b.className).addClass(b.replacerClassName) : t([]),
            gt = dt ? pt : V, vt = pt.find(".sp-preview-inner"), mt = b.color || ut && V.val(), _t = !1,
            bt = b.preferredFormat, yt = !b.showButtons || b.clickoutFiresChange, xt = !mt, wt = b.allowEmpty && !ft;

        function Ct() {
            if (b.showPaletteOnly && (b.showPalette = !0), ht.text(b.showPaletteOnly ? b.togglePaletteMoreText : b.togglePaletteLessText), b.palette) {
                z = b.palette.slice(0), X = t.isArray(z[0]) ? z : [z], W = {};
                for (var e = 0; e < X.length; e++) for (var i = 0; i < X[e].length; i++) {
                    var n = tinycolor(X[e][i]).toRgbString();
                    W[n] = !0
                }
            }
            q.toggleClass("sp-flat", y), q.toggleClass("sp-input-disabled", !b.showInput), q.toggleClass("sp-alpha-enabled", b.showAlpha), q.toggleClass("sp-clear-enabled", wt), q.toggleClass("sp-buttons-disabled", !b.showButtons), q.toggleClass("sp-palette-buttons-disabled", !b.togglePaletteOnly), q.toggleClass("sp-palette-disabled", !b.showPalette), q.toggleClass("sp-palette-only", b.showPaletteOnly), q.toggleClass("sp-initial-disabled", !b.showInitial), q.addClass(b.className).addClass(b.containerClassName), Ht()
        }

        function St() {
            if (w && window.localStorage) {
                try {
                    var e = window.localStorage[w].split(",#");
                    e.length > 1 && (delete window.localStorage[w], t.each(e, (function (t, e) {
                        Tt(e)
                    })))
                } catch (t) {
                }
                try {
                    Y = window.localStorage[w].split(";")
                } catch (t) {
                }
            }
        }

        function Tt(e) {
            if (x) {
                var i = tinycolor(e).toRgbString();
                if (!W[i] && -1 === t.inArray(i, Y)) for (Y.push(i); Y.length > H;) Y.shift();
                if (w && window.localStorage) try {
                    window.localStorage[w] = Y.join(";")
                } catch (t) {
                }
            }
        }

        function Ot() {
            var e = Bt(), i = t.map(X, (function (t, i) {
                return c(t, e, "sp-palette-row sp-palette-row-" + i, b)
            }));
            St(), Y && i.push(c(function () {
                var t = [];
                if (b.showPalette) for (var e = 0; e < Y.length; e++) {
                    var i = tinycolor(Y[e]).toRgbString();
                    W[i] || t.push(Y[e])
                }
                return t.reverse().slice(0, b.maxSelectionSize)
            }(), e, "sp-palette-row sp-palette-row-selection", b)), ot.html(i.join(""))
        }

        function Et() {
            if (b.showInitial) {
                var t = _t, e = Bt();
                st.html(c([t, e], e, "sp-palette-row-initial", b))
            }
        }

        function kt() {
            (P <= 0 || k <= 0 || A <= 0) && Ht(), E = !0, q.addClass(U), N = null, V.trigger("dragstart.spectrum", [Bt()])
        }

        function Pt() {
            E = !1, q.removeClass(U), V.trigger("dragstop.spectrum", [Bt()])
        }

        function jt() {
            var t = rt.val();
            if (null !== t && "" !== t || !wt) {
                var e = tinycolor(t);
                e.isValid() ? (Rt(e), Yt(!0)) : rt.addClass("sp-validation-error")
            } else Rt(null), Yt(!0)
        }

        function At() {
            O ? Lt() : Mt()
        }

        function Mt() {
            var e = t.Event("beforeShow.spectrum");
            O ? Ht() : (V.trigger(e, [Bt()]), !1 === S.beforeShow(Bt()) || e.isDefaultPrevented() || (!function () {
                for (var t = 0; t < n.length; t++) n[t] && n[t].hide()
            }(), O = !0, t(G).bind("keydown.spectrum", Dt), t(G).bind("click.spectrum", It), t(window).bind("resize.spectrum", T), pt.addClass("sp-active"), q.removeClass("sp-hidden"), Ht(), Xt(), _t = Bt(), Et(), S.show(_t), V.trigger("show.spectrum", [_t])))
        }

        function Dt(t) {
            27 === t.keyCode && Lt()
        }

        function It(t) {
            2 != t.button && (E || (yt ? Yt(!0) : Ft(), Lt()))
        }

        function Lt() {
            O && !y && (O = !1, t(G).unbind("keydown.spectrum", Dt), t(G).unbind("click.spectrum", It), t(window).unbind("resize.spectrum", T), pt.removeClass("sp-active"), q.addClass("sp-hidden"), S.hide(Bt()), V.trigger("hide.spectrum", [Bt()]))
        }

        function Ft() {
            Rt(_t, !0)
        }

        function Rt(t, e) {
            var i, n;
            tinycolor.equals(t, Bt()) ? Xt() : (!t && wt ? xt = !0 : (xt = !1, n = (i = tinycolor(t)).toHsv(), L = n.h % 360 / 360, F = n.s, R = n.v, B = n.a), Xt(), i && i.isValid() && !e && (bt = b.preferredFormat || i.getFormat()))
        }

        function Bt(t) {
            return t = t || {}, wt && xt ? null : tinycolor.fromRatio({
                h: L,
                s: F,
                v: R,
                a: Math.round(100 * B) / 100
            }, {format: t.format || bt})
        }

        function zt() {
            Xt(), S.move(Bt()), V.trigger("move.spectrum", [Bt()])
        }

        function Xt() {
            rt.removeClass("sp-validation-error"), Wt();
            var t = tinycolor.fromRatio({h: L, s: 1, v: 1});
            J.css("background-color", t.toHexString());
            var e = bt;
            B < 1 && (0 !== B || "name" !== e) && ("hex" !== e && "hex3" !== e && "hex6" !== e && "name" !== e || (e = "rgb"));
            var i = Bt({format: e}), n = "";
            if (vt.removeClass("sp-clear-display"), vt.css("background-color", "transparent"), !i && wt) vt.addClass("sp-clear-display"); else {
                var s = i.toHexString(), a = i.toRgbString();
                if (o || 1 === i.alpha ? vt.css("background-color", a) : (vt.css("background-color", "transparent"), vt.css("filter", i.toFilter())), b.showAlpha) {
                    var c = i.toRgb();
                    c.a = 0;
                    var l = tinycolor(c).toRgbString(), h = "linear-gradient(left, " + l + ", " + s + ")";
                    r ? et.css("filter", tinycolor(l).toFilter({gradientType: 1}, s)) : (et.css("background", "-webkit-" + h), et.css("background", "-moz-" + h), et.css("background", "-ms-" + h), et.css("background", "linear-gradient(to right, " + l + ", " + s + ")"))
                }
                n = i.toString(e)
            }
            b.showInput && rt.val(n), b.showPalette && Ot(), Et()
        }

        function Wt() {
            var t = F, e = R;
            if (wt && xt) nt.hide(), tt.hide(), Q.hide(); else {
                nt.show(), tt.show(), Q.show();
                var i = t * k, n = P - e * P;
                i = Math.max(-j, Math.min(k - j, i - j)), n = Math.max(-j, Math.min(P - j, n - j)), Q.css({
                    top: n + "px",
                    left: i + "px"
                });
                var r = B * M;
                nt.css({left: r - D / 2 + "px"});
                var o = L * A;
                tt.css({top: o - I + "px"})
            }
        }

        function Yt(t) {
            var e = Bt(), i = "", n = !tinycolor.equals(e, _t);
            e && (i = e.toString(bt), Tt(e)), ut && V.val(i), t && n && (S.change(e), V.trigger("change", [e]))
        }

        function Ht() {
            O && (k = J.width(), P = J.height(), j = Q.height(), Z.width(), A = Z.height(), I = tt.height(), M = it.width(), D = nt.width(), y || (q.css("position", "absolute"), b.offset ? q.offset(b.offset) : q.offset(function (e, i) {
                var n = 0, r = e.outerWidth(), o = e.outerHeight(), s = i.outerHeight(), a = e[0].ownerDocument,
                    c = a.documentElement, l = c.clientWidth + t(a).scrollLeft(), h = c.clientHeight + t(a).scrollTop(),
                    u = i.offset();
                return u.top += s, u.left -= Math.min(u.left, u.left + r > l && l > r ? Math.abs(u.left + r - l) : 0), u.top -= Math.min(u.top, u.top + o > h && h > o ? Math.abs(o + s - n) : n), u
            }(q, gt))), Wt(), b.showPalette && Ot(), V.trigger("reflow.spectrum"))
        }

        function Ut() {
            Lt(), $ = !0, V.attr("disabled", !0), gt.addClass("sp-disabled")
        }

        !function () {
            if (r && q.find("*:not(input)").attr("unselectable", "on"), Ct(), dt && V.after(pt).hide(), wt || ct.hide(), y) V.after(q).hide(); else {
                var e = "parent" === b.appendTo ? V.parent() : t(b.appendTo);
                1 !== e.length && (e = t("body")), e.append(q)
            }

            function i(e) {
                return e.data && e.data.ignore ? (Rt(t(e.target).closest(".sp-thumb-el").data("color")), zt()) : (Rt(t(e.target).closest(".sp-thumb-el").data("color")), zt(), Yt(!0), b.hideAfterPaletteSelect && Lt()), !1
            }

            St(), gt.bind("click.spectrum touchstart.spectrum", (function (e) {
                $ || At(), e.stopPropagation(), t(e.target).is("input") || e.preventDefault()
            })), (V.is(":disabled") || !0 === b.disabled) && Ut(), q.click(u), rt.change(jt), rt.bind("paste", (function () {
                setTimeout(jt, 1)
            })), rt.keydown((function (t) {
                13 == t.keyCode && jt()
            })), at.text(b.cancelText), at.bind("click.spectrum", (function (t) {
                t.stopPropagation(), t.preventDefault(), Ft(), Lt()
            })), ct.attr("title", b.clearText), ct.bind("click.spectrum", (function (t) {
                t.stopPropagation(), t.preventDefault(), xt = !0, zt(), y && Yt(!0)
            })), lt.text(b.chooseText), lt.bind("click.spectrum", (function (t) {
                t.stopPropagation(), t.preventDefault(), r && rt.is(":focus") && rt.trigger("change"), rt.hasClass("sp-validation-error") || (Yt(!0), Lt())
            })), ht.text(b.showPaletteOnly ? b.togglePaletteMoreText : b.togglePaletteLessText), ht.bind("click.spectrum", (function (t) {
                t.stopPropagation(), t.preventDefault(), b.showPaletteOnly = !b.showPaletteOnly, b.showPaletteOnly || y || q.css("left", "-=" + (K.outerWidth(!0) + 5)), Ct()
            })), d(it, (function (t, e, i) {
                B = t / M, xt = !1, i.shiftKey && (B = Math.round(10 * B) / 10), zt()
            }), kt, Pt), d(Z, (function (t, e) {
                L = parseFloat(e / A), xt = !1, b.showAlpha || (B = 1), zt()
            }), kt, Pt), d(J, (function (t, e, i) {
                if (i.shiftKey) {
                    if (!N) {
                        var n = F * k, r = P - R * P, o = Math.abs(t - n) > Math.abs(e - r);
                        N = o ? "x" : "y"
                    }
                } else N = null;
                var s = !N || "y" === N;
                (!N || "x" === N) && (F = parseFloat(t / k)), s && (R = parseFloat((P - e) / P)), xt = !1, b.showAlpha || (B = 1), zt()
            }), kt, Pt), mt ? (Rt(mt), Xt(), bt = b.preferredFormat || tinycolor(mt).format, Tt(mt)) : Xt(), y && Mt();
            var n = r ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
            ot.delegate(".sp-thumb-el", n, i), st.delegate(".sp-thumb-el:nth-child(1)", n, {ignore: !0}, i)
        }();
        var Nt = {
            show: Mt, hide: Lt, toggle: At, reflow: Ht, option: function (i, n) {
                return i === e ? t.extend({}, b) : n === e ? b[i] : (b[i] = n, "preferredFormat" === i && (bt = b.preferredFormat), void Ct())
            }, enable: function () {
                $ = !1, V.attr("disabled", !1), gt.removeClass("sp-disabled")
            }, disable: Ut, offset: function (t) {
                b.offset = t, Ht()
            }, set: function (t) {
                Rt(t), Yt()
            }, get: Bt, destroy: function () {
                V.show(), gt.unbind("click.spectrum touchstart.spectrum"), q.remove(), pt.remove(), n[Nt.id] = null
            }, container: q
        };
        return Nt.id = n.push(Nt) - 1, Nt
    }

    function h() {
    }

    function u(t) {
        t.stopPropagation()
    }

    function f(t, e) {
        var i = Array.prototype.slice, n = i.call(arguments, 2);
        return function () {
            return t.apply(e, n.concat(i.call(arguments)))
        }
    }

    function d(e, i, n, o) {
        i = i || function () {
        }, n = n || function () {
        }, o = o || function () {
        };
        var s = document, a = !1, c = {}, l = 0, h = 0, u = "ontouchstart" in window, f = {};

        function d(t) {
            t.stopPropagation && t.stopPropagation(), t.preventDefault && t.preventDefault(), t.returnValue = !1
        }

        function p(t) {
            if (a) {
                if (r && s.documentMode < 9 && !t.button) return g();
                var n = t.originalEvent && t.originalEvent.touches && t.originalEvent.touches[0],
                    o = n && n.pageX || t.pageX, f = n && n.pageY || t.pageY, p = Math.max(0, Math.min(o - c.left, h)),
                    v = Math.max(0, Math.min(f - c.top, l));
                u && d(t), i.apply(e, [p, v, t])
            }
        }

        function g() {
            a && (t(s).unbind(f), t(s.body).removeClass("sp-dragging"), setTimeout((function () {
                o.apply(e, arguments)
            }), 0)), a = !1
        }

        f.selectstart = d, f.dragstart = d, f["touchmove mousemove"] = p, f["touchend mouseup"] = g, t(e).bind("touchstart mousedown", (function (i) {
            var r = i.which ? 3 == i.which : 2 == i.button;
            r || a || !1 !== n.apply(e, arguments) && (a = !0, l = t(e).height(), h = t(e).width(), c = t(e).offset(), t(s).bind(f), t(s.body).addClass("sp-dragging"), p(i), d(i))
        }))
    }

    function p() {
        return t.fn.spectrum.inputTypeColorSupport()
    }

    var g = "spectrum.id";
    t.fn.spectrum = function (e, i) {
        if ("string" == typeof e) {
            var r = this, o = Array.prototype.slice.call(arguments, 1);
            return this.each((function () {
                var i = n[t(this).data(g)];
                if (i) {
                    var s = i[e];
                    if (!s) throw new Error("Spectrum: no such method: '" + e + "'");
                    "get" == e ? r = i.get() : "container" == e ? r = i.container : "option" == e ? r = i.option.apply(i, o) : "destroy" == e ? (i.destroy(), t(this).removeData(g)) : s.apply(i, o)
                }
            })), r
        }
        return this.spectrum("destroy").each((function () {
            var i = l(this, t.extend({}, e, t(this).data()));
            t(this).data(g, i.id)
        }))
    }, t.fn.spectrum.load = !0, t.fn.spectrum.loadOpts = {}, t.fn.spectrum.draggable = d, t.fn.spectrum.defaults = i, t.fn.spectrum.inputTypeColorSupport = function e() {
        if (void 0 === e._cachedResult) {
            var i = t("<input type='color'/>")[0];
            e._cachedResult = "color" === i.type && "" !== i.value
        }
        return e._cachedResult
    }, t.spectrum = {}, t.spectrum.localization = {}, t.spectrum.palettes = {}, t.fn.spectrum.processNativeColorInputs = function () {
        var e = t("input[type=color]");
        e.length && !p() && e.spectrum({preferredFormat: "hex6"})
    }, function () {
        var t = /^[\s,#]+/, e = /\s+$/, i = 0, n = Math, r = n.round, o = n.min, s = n.max, a = n.random,
            c = function (a, l) {
                if (l = l || {}, (a = a || "") instanceof c) return a;
                if (!(this instanceof c)) return new c(a, l);
                var h = function (i) {
                    var r = {r: 0, g: 0, b: 0}, a = 1, c = !1, l = !1;
                    "string" == typeof i && (i = function (i) {
                        i = i.replace(t, "").replace(e, "").toLowerCase();
                        var n, r = !1;
                        if (O[i]) i = O[i], r = !0; else if ("transparent" == i) return {
                            r: 0,
                            g: 0,
                            b: 0,
                            a: 0,
                            format: "name"
                        };
                        return (n = B.rgb.exec(i)) ? {r: n[1], g: n[2], b: n[3]} : (n = B.rgba.exec(i)) ? {
                            r: n[1],
                            g: n[2],
                            b: n[3],
                            a: n[4]
                        } : (n = B.hsl.exec(i)) ? {h: n[1], s: n[2], l: n[3]} : (n = B.hsla.exec(i)) ? {
                            h: n[1],
                            s: n[2],
                            l: n[3],
                            a: n[4]
                        } : (n = B.hsv.exec(i)) ? {h: n[1], s: n[2], v: n[3]} : (n = B.hsva.exec(i)) ? {
                            h: n[1],
                            s: n[2],
                            v: n[3],
                            a: n[4]
                        } : (n = B.hex8.exec(i)) ? {
                            a: I(n[1]),
                            r: A(n[2]),
                            g: A(n[3]),
                            b: A(n[4]),
                            format: r ? "name" : "hex8"
                        } : (n = B.hex6.exec(i)) ? {
                            r: A(n[1]),
                            g: A(n[2]),
                            b: A(n[3]),
                            format: r ? "name" : "hex"
                        } : !!(n = B.hex3.exec(i)) && {
                            r: A(n[1] + "" + n[1]),
                            g: A(n[2] + "" + n[2]),
                            b: A(n[3] + "" + n[3]),
                            format: r ? "name" : "hex"
                        }
                    }(i));
                    "object" == typeof i && (i.hasOwnProperty("r") && i.hasOwnProperty("g") && i.hasOwnProperty("b") ? (h = i.r, u = i.g, f = i.b, r = {
                        r: 255 * P(h, 255),
                        g: 255 * P(u, 255),
                        b: 255 * P(f, 255)
                    }, c = !0, l = "%" === String(i.r).substr(-1) ? "prgb" : "rgb") : i.hasOwnProperty("h") && i.hasOwnProperty("s") && i.hasOwnProperty("v") ? (i.s = D(i.s), i.v = D(i.v), r = function (t, e, i) {
                        t = 6 * P(t, 360), e = P(e, 100), i = P(i, 100);
                        var r = n.floor(t), o = t - r, s = i * (1 - e), a = i * (1 - o * e), c = i * (1 - (1 - o) * e),
                            l = r % 6;
                        return {
                            r: 255 * [i, a, s, s, c, i][l],
                            g: 255 * [c, i, i, a, s, s][l],
                            b: 255 * [s, s, c, i, i, a][l]
                        }
                    }(i.h, i.s, i.v), c = !0, l = "hsv") : i.hasOwnProperty("h") && i.hasOwnProperty("s") && i.hasOwnProperty("l") && (i.s = D(i.s), i.l = D(i.l), r = function (t, e, i) {
                        var n, r, o;

                        function s(t, e, i) {
                            return i < 0 && (i += 1), i > 1 && (i -= 1), i < 1 / 6 ? t + 6 * (e - t) * i : i < .5 ? e : i < 2 / 3 ? t + (e - t) * (2 / 3 - i) * 6 : t
                        }

                        if (t = P(t, 360), e = P(e, 100), i = P(i, 100), 0 === e) n = r = o = i; else {
                            var a = i < .5 ? i * (1 + e) : i + e - i * e, c = 2 * i - a;
                            n = s(c, a, t + 1 / 3), r = s(c, a, t), o = s(c, a, t - 1 / 3)
                        }
                        return {r: 255 * n, g: 255 * r, b: 255 * o}
                    }(i.h, i.s, i.l), c = !0, l = "hsl"), i.hasOwnProperty("a") && (a = i.a));
                    var h, u, f;
                    return a = k(a), {
                        ok: c,
                        format: i.format || l,
                        r: o(255, s(r.r, 0)),
                        g: o(255, s(r.g, 0)),
                        b: o(255, s(r.b, 0)),
                        a: a
                    }
                }(a);
                this._originalInput = a, this._r = h.r, this._g = h.g, this._b = h.b, this._a = h.a, this._roundA = r(100 * this._a) / 100, this._format = l.format || h.format, this._gradientType = l.gradientType, this._r < 1 && (this._r = r(this._r)), this._g < 1 && (this._g = r(this._g)), this._b < 1 && (this._b = r(this._b)), this._ok = h.ok, this._tc_id = i++
            };

        function l(t, e, i) {
            t = P(t, 255), e = P(e, 255), i = P(i, 255);
            var n, r, a = s(t, e, i), c = o(t, e, i), l = (a + c) / 2;
            if (a == c) n = r = 0; else {
                var h = a - c;
                switch (r = l > .5 ? h / (2 - a - c) : h / (a + c), a) {
                    case t:
                        n = (e - i) / h + (e < i ? 6 : 0);
                        break;
                    case e:
                        n = (i - t) / h + 2;
                        break;
                    case i:
                        n = (t - e) / h + 4
                }
                n /= 6
            }
            return {h: n, s: r, l: l}
        }

        function h(t, e, i) {
            t = P(t, 255), e = P(e, 255), i = P(i, 255);
            var n, r, a = s(t, e, i), c = o(t, e, i), l = a, h = a - c;
            if (r = 0 === a ? 0 : h / a, a == c) n = 0; else {
                switch (a) {
                    case t:
                        n = (e - i) / h + (e < i ? 6 : 0);
                        break;
                    case e:
                        n = (i - t) / h + 2;
                        break;
                    case i:
                        n = (t - e) / h + 4
                }
                n /= 6
            }
            return {h: n, s: r, v: l}
        }

        function u(t, e, i, n) {
            var o = [M(r(t).toString(16)), M(r(e).toString(16)), M(r(i).toString(16))];
            return n && o[0].charAt(0) == o[0].charAt(1) && o[1].charAt(0) == o[1].charAt(1) && o[2].charAt(0) == o[2].charAt(1) ? o[0].charAt(0) + o[1].charAt(0) + o[2].charAt(0) : o.join("")
        }

        function f(t, e, i, n) {
            var o;
            return [M((o = n, Math.round(255 * parseFloat(o)).toString(16))), M(r(t).toString(16)), M(r(e).toString(16)), M(r(i).toString(16))].join("")
        }

        function d(t, e) {
            e = 0 === e ? 0 : e || 10;
            var i = c(t).toHsl();
            return i.s -= e / 100, i.s = j(i.s), c(i)
        }

        function p(t, e) {
            e = 0 === e ? 0 : e || 10;
            var i = c(t).toHsl();
            return i.s += e / 100, i.s = j(i.s), c(i)
        }

        function g(t) {
            return c(t).desaturate(100)
        }

        function v(t, e) {
            e = 0 === e ? 0 : e || 10;
            var i = c(t).toHsl();
            return i.l += e / 100, i.l = j(i.l), c(i)
        }

        function m(t, e) {
            e = 0 === e ? 0 : e || 10;
            var i = c(t).toRgb();
            return i.r = s(0, o(255, i.r - r(-e / 100 * 255))), i.g = s(0, o(255, i.g - r(-e / 100 * 255))), i.b = s(0, o(255, i.b - r(-e / 100 * 255))), c(i)
        }

        function _(t, e) {
            e = 0 === e ? 0 : e || 10;
            var i = c(t).toHsl();
            return i.l -= e / 100, i.l = j(i.l), c(i)
        }

        function b(t, e) {
            var i = c(t).toHsl(), n = (r(i.h) + e) % 360;
            return i.h = n < 0 ? 360 + n : n, c(i)
        }

        function y(t) {
            var e = c(t).toHsl();
            return e.h = (e.h + 180) % 360, c(e)
        }

        function x(t) {
            var e = c(t).toHsl(), i = e.h;
            return [c(t), c({h: (i + 120) % 360, s: e.s, l: e.l}), c({h: (i + 240) % 360, s: e.s, l: e.l})]
        }

        function w(t) {
            var e = c(t).toHsl(), i = e.h;
            return [c(t), c({h: (i + 90) % 360, s: e.s, l: e.l}), c({
                h: (i + 180) % 360,
                s: e.s,
                l: e.l
            }), c({h: (i + 270) % 360, s: e.s, l: e.l})]
        }

        function C(t) {
            var e = c(t).toHsl(), i = e.h;
            return [c(t), c({h: (i + 72) % 360, s: e.s, l: e.l}), c({h: (i + 216) % 360, s: e.s, l: e.l})]
        }

        function S(t, e, i) {
            e = e || 6, i = i || 30;
            var n = c(t).toHsl(), r = 360 / i, o = [c(t)];
            for (n.h = (n.h - (r * e >> 1) + 720) % 360; --e;) n.h = (n.h + r) % 360, o.push(c(n));
            return o
        }

        function T(t, e) {
            e = e || 6;
            for (var i = c(t).toHsv(), n = i.h, r = i.s, o = i.v, s = [], a = 1 / e; e--;) s.push(c({
                h: n,
                s: r,
                v: o
            })), o = (o + a) % 1;
            return s
        }

        c.prototype = {
            isDark: function () {
                return this.getBrightness() < 128
            }, isLight: function () {
                return !this.isDark()
            }, isValid: function () {
                return this._ok
            }, getOriginalInput: function () {
                return this._originalInput
            }, getFormat: function () {
                return this._format
            }, getAlpha: function () {
                return this._a
            }, getBrightness: function () {
                var t = this.toRgb();
                return (299 * t.r + 587 * t.g + 114 * t.b) / 1e3
            }, setAlpha: function (t) {
                return this._a = k(t), this._roundA = r(100 * this._a) / 100, this
            }, toHsv: function () {
                var t = h(this._r, this._g, this._b);
                return {h: 360 * t.h, s: t.s, v: t.v, a: this._a}
            }, toHsvString: function () {
                var t = h(this._r, this._g, this._b), e = r(360 * t.h), i = r(100 * t.s), n = r(100 * t.v);
                return 1 == this._a ? "hsv(" + e + ", " + i + "%, " + n + "%)" : "hsva(" + e + ", " + i + "%, " + n + "%, " + this._roundA + ")"
            }, toHsl: function () {
                var t = l(this._r, this._g, this._b);
                return {h: 360 * t.h, s: t.s, l: t.l, a: this._a}
            }, toHslString: function () {
                var t = l(this._r, this._g, this._b), e = r(360 * t.h), i = r(100 * t.s), n = r(100 * t.l);
                return 1 == this._a ? "hsl(" + e + ", " + i + "%, " + n + "%)" : "hsla(" + e + ", " + i + "%, " + n + "%, " + this._roundA + ")"
            }, toHex: function (t) {
                return u(this._r, this._g, this._b, t)
            }, toHexString: function (t) {
                return "#" + this.toHex(t)
            }, toHex8: function () {
                return f(this._r, this._g, this._b, this._a)
            }, toHex8String: function () {
                return "#" + this.toHex8()
            }, toRgb: function () {
                return {r: r(this._r), g: r(this._g), b: r(this._b), a: this._a}
            }, toRgbString: function () {
                return 1 == this._a ? "rgb(" + r(this._r) + ", " + r(this._g) + ", " + r(this._b) + ")" : "rgba(" + r(this._r) + ", " + r(this._g) + ", " + r(this._b) + ", " + this._roundA + ")"
            }, toPercentageRgb: function () {
                return {
                    r: r(100 * P(this._r, 255)) + "%",
                    g: r(100 * P(this._g, 255)) + "%",
                    b: r(100 * P(this._b, 255)) + "%",
                    a: this._a
                }
            }, toPercentageRgbString: function () {
                return 1 == this._a ? "rgb(" + r(100 * P(this._r, 255)) + "%, " + r(100 * P(this._g, 255)) + "%, " + r(100 * P(this._b, 255)) + "%)" : "rgba(" + r(100 * P(this._r, 255)) + "%, " + r(100 * P(this._g, 255)) + "%, " + r(100 * P(this._b, 255)) + "%, " + this._roundA + ")"
            }, toName: function () {
                return 0 === this._a ? "transparent" : !(this._a < 1) && (E[u(this._r, this._g, this._b, !0)] || !1)
            }, toFilter: function (t) {
                var e = "#" + f(this._r, this._g, this._b, this._a), i = e,
                    n = this._gradientType ? "GradientType = 1, " : "";
                t && (i = c(t).toHex8String());
                return "progid:DXImageTransform.Microsoft.gradient(" + n + "startColorstr=" + e + ",endColorstr=" + i + ")"
            }, toString: function (t) {
                var e = !!t;
                t = t || this._format;
                var i = !1, n = this._a < 1 && this._a >= 0;
                return e || !n || "hex" !== t && "hex6" !== t && "hex3" !== t && "name" !== t ? ("rgb" === t && (i = this.toRgbString()), "prgb" === t && (i = this.toPercentageRgbString()), "hex" !== t && "hex6" !== t || (i = this.toHexString()), "hex3" === t && (i = this.toHexString(!0)), "hex8" === t && (i = this.toHex8String()), "name" === t && (i = this.toName()), "hsl" === t && (i = this.toHslString()), "hsv" === t && (i = this.toHsvString()), i || this.toHexString()) : "name" === t && 0 === this._a ? this.toName() : this.toRgbString()
            }, _applyModification: function (t, e) {
                var i = t.apply(null, [this].concat([].slice.call(e)));
                return this._r = i._r, this._g = i._g, this._b = i._b, this.setAlpha(i._a), this
            }, lighten: function () {
                return this._applyModification(v, arguments)
            }, brighten: function () {
                return this._applyModification(m, arguments)
            }, darken: function () {
                return this._applyModification(_, arguments)
            }, desaturate: function () {
                return this._applyModification(d, arguments)
            }, saturate: function () {
                return this._applyModification(p, arguments)
            }, greyscale: function () {
                return this._applyModification(g, arguments)
            }, spin: function () {
                return this._applyModification(b, arguments)
            }, _applyCombination: function (t, e) {
                return t.apply(null, [this].concat([].slice.call(e)))
            }, analogous: function () {
                return this._applyCombination(S, arguments)
            }, complement: function () {
                return this._applyCombination(y, arguments)
            }, monochromatic: function () {
                return this._applyCombination(T, arguments)
            }, splitcomplement: function () {
                return this._applyCombination(C, arguments)
            }, triad: function () {
                return this._applyCombination(x, arguments)
            }, tetrad: function () {
                return this._applyCombination(w, arguments)
            }
        }, c.fromRatio = function (t, e) {
            if ("object" == typeof t) {
                var i = {};
                for (var n in t) t.hasOwnProperty(n) && (i[n] = "a" === n ? t[n] : D(t[n]));
                t = i
            }
            return c(t, e)
        }, c.equals = function (t, e) {
            return !(!t || !e) && c(t).toRgbString() == c(e).toRgbString()
        }, c.random = function () {
            return c.fromRatio({r: a(), g: a(), b: a()})
        }, c.mix = function (t, e, i) {
            i = 0 === i ? 0 : i || 50;
            var n, r = c(t).toRgb(), o = c(e).toRgb(), s = i / 100, a = 2 * s - 1, l = o.a - r.a,
                h = 1 - (n = ((n = a * l == -1 ? a : (a + l) / (1 + a * l)) + 1) / 2),
                u = {r: o.r * n + r.r * h, g: o.g * n + r.g * h, b: o.b * n + r.b * h, a: o.a * s + r.a * (1 - s)};
            return c(u)
        }, c.readability = function (t, e) {
            var i = c(t), n = c(e), r = i.toRgb(), o = n.toRgb(), s = i.getBrightness(), a = n.getBrightness(),
                l = Math.max(r.r, o.r) - Math.min(r.r, o.r) + Math.max(r.g, o.g) - Math.min(r.g, o.g) + Math.max(r.b, o.b) - Math.min(r.b, o.b);
            return {brightness: Math.abs(s - a), color: l}
        }, c.isReadable = function (t, e) {
            var i = c.readability(t, e);
            return i.brightness > 125 && i.color > 500
        }, c.mostReadable = function (t, e) {
            for (var i = null, n = 0, r = !1, o = 0; o < e.length; o++) {
                var s = c.readability(t, e[o]), a = s.brightness > 125 && s.color > 500,
                    l = s.brightness / 125 * 3 + s.color / 500;
                (a && !r || a && r && l > n || !a && !r && l > n) && (r = a, n = l, i = c(e[o]))
            }
            return i
        };
        var O = c.names = {
            aliceblue: "f0f8ff",
            antiquewhite: "faebd7",
            aqua: "0ff",
            aquamarine: "7fffd4",
            azure: "f0ffff",
            beige: "f5f5dc",
            bisque: "ffe4c4",
            black: "000",
            blanchedalmond: "ffebcd",
            blue: "00f",
            blueviolet: "8a2be2",
            brown: "a52a2a",
            burlywood: "deb887",
            burntsienna: "ea7e5d",
            cadetblue: "5f9ea0",
            chartreuse: "7fff00",
            chocolate: "d2691e",
            coral: "ff7f50",
            cornflowerblue: "6495ed",
            cornsilk: "fff8dc",
            crimson: "dc143c",
            cyan: "0ff",
            darkblue: "00008b",
            darkcyan: "008b8b",
            darkgoldenrod: "b8860b",
            darkgray: "a9a9a9",
            darkgreen: "006400",
            darkgrey: "a9a9a9",
            darkkhaki: "bdb76b",
            darkmagenta: "8b008b",
            darkolivegreen: "556b2f",
            darkorange: "ff8c00",
            darkorchid: "9932cc",
            darkred: "8b0000",
            darksalmon: "e9967a",
            darkseagreen: "8fbc8f",
            darkslateblue: "483d8b",
            darkslategray: "2f4f4f",
            darkslategrey: "2f4f4f",
            darkturquoise: "00ced1",
            darkviolet: "9400d3",
            deeppink: "ff1493",
            deepskyblue: "00bfff",
            dimgray: "696969",
            dimgrey: "696969",
            dodgerblue: "1e90ff",
            firebrick: "b22222",
            floralwhite: "fffaf0",
            forestgreen: "228b22",
            fuchsia: "f0f",
            gainsboro: "dcdcdc",
            ghostwhite: "f8f8ff",
            gold: "ffd700",
            goldenrod: "daa520",
            gray: "808080",
            green: "008000",
            greenyellow: "adff2f",
            grey: "808080",
            honeydew: "f0fff0",
            hotpink: "ff69b4",
            indianred: "cd5c5c",
            indigo: "4b0082",
            ivory: "fffff0",
            khaki: "f0e68c",
            lavender: "e6e6fa",
            lavenderblush: "fff0f5",
            lawngreen: "7cfc00",
            lemonchiffon: "fffacd",
            lightblue: "add8e6",
            lightcoral: "f08080",
            lightcyan: "e0ffff",
            lightgoldenrodyellow: "fafad2",
            lightgray: "d3d3d3",
            lightgreen: "90ee90",
            lightgrey: "d3d3d3",
            lightpink: "ffb6c1",
            lightsalmon: "ffa07a",
            lightseagreen: "20b2aa",
            lightskyblue: "87cefa",
            lightslategray: "789",
            lightslategrey: "789",
            lightsteelblue: "b0c4de",
            lightyellow: "ffffe0",
            lime: "0f0",
            limegreen: "32cd32",
            linen: "faf0e6",
            magenta: "f0f",
            maroon: "800000",
            mediumaquamarine: "66cdaa",
            mediumblue: "0000cd",
            mediumorchid: "ba55d3",
            mediumpurple: "9370db",
            mediumseagreen: "3cb371",
            mediumslateblue: "7b68ee",
            mediumspringgreen: "00fa9a",
            mediumturquoise: "48d1cc",
            mediumvioletred: "c71585",
            midnightblue: "191970",
            mintcream: "f5fffa",
            mistyrose: "ffe4e1",
            moccasin: "ffe4b5",
            navajowhite: "ffdead",
            navy: "000080",
            oldlace: "fdf5e6",
            olive: "808000",
            olivedrab: "6b8e23",
            orange: "ffa500",
            orangered: "ff4500",
            orchid: "da70d6",
            palegoldenrod: "eee8aa",
            palegreen: "98fb98",
            paleturquoise: "afeeee",
            palevioletred: "db7093",
            papayawhip: "ffefd5",
            peachpuff: "ffdab9",
            peru: "cd853f",
            pink: "ffc0cb",
            plum: "dda0dd",
            powderblue: "b0e0e6",
            purple: "800080",
            rebeccapurple: "663399",
            red: "f00",
            rosybrown: "bc8f8f",
            royalblue: "4169e1",
            saddlebrown: "8b4513",
            salmon: "fa8072",
            sandybrown: "f4a460",
            seagreen: "2e8b57",
            seashell: "fff5ee",
            sienna: "a0522d",
            silver: "c0c0c0",
            skyblue: "87ceeb",
            slateblue: "6a5acd",
            slategray: "708090",
            slategrey: "708090",
            snow: "fffafa",
            springgreen: "00ff7f",
            steelblue: "4682b4",
            tan: "d2b48c",
            teal: "008080",
            thistle: "d8bfd8",
            tomato: "ff6347",
            turquoise: "40e0d0",
            violet: "ee82ee",
            wheat: "f5deb3",
            white: "fff",
            whitesmoke: "f5f5f5",
            yellow: "ff0",
            yellowgreen: "9acd32"
        }, E = c.hexNames = function (t) {
            var e = {};
            for (var i in t) t.hasOwnProperty(i) && (e[t[i]] = i);
            return e
        }(O);

        function k(t) {
            return t = parseFloat(t), (isNaN(t) || t < 0 || t > 1) && (t = 1), t
        }

        function P(t, e) {
            (function (t) {
                return "string" == typeof t && -1 != t.indexOf(".") && 1 === parseFloat(t)
            })(t) && (t = "100%");
            var i = function (t) {
                return "string" == typeof t && -1 != t.indexOf("%")
            }(t);
            return t = o(e, s(0, parseFloat(t))), i && (t = parseInt(t * e, 10) / 100), n.abs(t - e) < 1e-6 ? 1 : t % e / parseFloat(e)
        }

        function j(t) {
            return o(1, s(0, t))
        }

        function A(t) {
            return parseInt(t, 16)
        }

        function M(t) {
            return 1 == t.length ? "0" + t : "" + t
        }

        function D(t) {
            return t <= 1 && (t = 100 * t + "%"), t
        }

        function I(t) {
            return A(t) / 255
        }

        var L, F, R,
            B = (F = "[\\s|\\(]+(" + (L = "(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)") + ")[,|\\s]+(" + L + ")[,|\\s]+(" + L + ")\\s*\\)?", R = "[\\s|\\(]+(" + L + ")[,|\\s]+(" + L + ")[,|\\s]+(" + L + ")[,|\\s]+(" + L + ")\\s*\\)?", {
                rgb: new RegExp("rgb" + F),
                rgba: new RegExp("rgba" + R),
                hsl: new RegExp("hsl" + F),
                hsla: new RegExp("hsla" + R),
                hsv: new RegExp("hsv" + F),
                hsva: new RegExp("hsva" + R),
                hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
                hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
            });
        window.tinycolor = c
    }(), t((function () {
        t.fn.spectrum.load && t.fn.spectrum.processNativeColorInputs()
    }))
})), function (t) {
    function e(n) {
        if (i[n]) return i[n].exports;
        var r = i[n] = {i: n, l: !1, exports: {}};
        return t[n].call(r.exports, r, r.exports, e), r.l = !0, r.exports
    }

    var i = {};
    e.m = t, e.c = i, e.i = function (t) {
        return t
    }, e.d = function (t, e, i) {
        Object.defineProperty(t, e, {configurable: !1, enumerable: !0, get: i})
    }, e.n = function (t) {
        var i = t && t.__esModule ? function () {
            return t.default
        } : function () {
            return t
        };
        return e.d(i, "a", i), i
    }, e.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, e.p = "", e(e.s = 42)
}([function (t, e) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0});
    e.default = function t(e, i) {
        (function (t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        })(this, t), this.data = e, this.text = i.text || e, this.options = i
    }
}, function (t, e) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0});
    var i = function () {
        function t() {
            (function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            })(this, t), this.startBin = "101", this.endBin = "101", this.middleBin = "01010", this.Lbinary = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"], this.Gbinary = ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"], this.Rbinary = ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"]
        }

        return t.prototype.encode = function (t, e, i) {
            var n = "";
            i = i || "";
            for (var r = 0; r < t.length; r++) "L" == e[r] ? n += this.Lbinary[t[r]] : "G" == e[r] ? n += this.Gbinary[t[r]] : "R" == e[r] && (n += this.Rbinary[t[r]]), r < t.length - 1 && (n += i);
            return n
        }, t
    }();
    e.default = i
}, function (t, e, i) {
    "use strict";

    function n(t, e) {
        for (var i = 0; i < e; i++) t = "0" + t;
        return t
    }

    Object.defineProperty(e, "__esModule", {value: !0});
    var r = function (t) {
        return t && t.__esModule ? t : {default: t}
    }(i(0)), o = function (t) {
        function e(i, n) {
            return function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, e), function (t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }(this, t.call(this, i, n))
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e.prototype.encode = function () {
            for (var t = "110", e = 0; e < this.data.length; e++) {
                var i = parseInt(this.data[e]).toString(2);
                i = n(i, 4 - i.length);
                for (var r = 0; r < i.length; r++) t += "0" == i[r] ? "100" : "110"
            }
            return {data: t += "1001", text: this.text}
        }, e.prototype.valid = function () {
            return -1 !== this.data.search(/^[0-9]+$/)
        }, e
    }(r.default);
    e.default = o
}, function (t, e) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0}), e.default = function (t, e) {
        var i, n = {};
        for (i in t) t.hasOwnProperty(i) && (n[i] = t[i]);
        for (i in e) e.hasOwnProperty(i) && void 0 !== e[i] && (n[i] = e[i]);
        return n
    }
}, function (t, e, i) {
    "use strict";

    function n(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
    }

    function r(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || "object" != typeof e && "function" != typeof e ? t : e
    }

    function o(t, e) {
        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
        t.prototype = Object.create(e && e.prototype, {
            constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
    }

    Object.defineProperty(e, "__esModule", {value: !0});
    var s = function (t) {
        return t && t.__esModule ? t : {default: t}
    }(i(0)), a = function (t) {
        function e(i, o) {
            n(this, e);
            var s = r(this, t.call(this, i.substring(1), o));
            s.bytes = [];
            for (var a = 0; a < i.length; ++a) s.bytes.push(i.charCodeAt(a));
            return s.encodings = [740, 644, 638, 176, 164, 100, 224, 220, 124, 608, 604, 572, 436, 244, 230, 484, 260, 254, 650, 628, 614, 764, 652, 902, 868, 836, 830, 892, 844, 842, 752, 734, 590, 304, 112, 94, 416, 128, 122, 672, 576, 570, 464, 422, 134, 496, 478, 142, 910, 678, 582, 768, 762, 774, 880, 862, 814, 896, 890, 818, 914, 602, 930, 328, 292, 200, 158, 68, 62, 424, 412, 232, 218, 76, 74, 554, 616, 978, 556, 146, 340, 212, 182, 508, 268, 266, 956, 940, 938, 758, 782, 974, 400, 310, 118, 512, 506, 960, 954, 502, 518, 886, 966, 668, 680, 692, 5379], s
        }

        return o(e, t), e.prototype.encode = function () {
            var t, e = this.bytes, i = e.shift() - 105;
            if (103 === i) t = this.nextA(e, 1); else if (104 === i) t = this.nextB(e, 1); else {
                if (105 !== i) throw new c;
                t = this.nextC(e, 1)
            }
            return {
                text: this.text == this.data ? this.text.replace(/[^\x20-\x7E]/g, "") : this.text,
                data: this.getEncoding(i) + t.result + this.getEncoding((t.checksum + i) % 103) + this.getEncoding(106)
            }
        }, e.prototype.getEncoding = function (t) {
            return this.encodings[t] ? (this.encodings[t] + 1e3).toString(2) : ""
        }, e.prototype.valid = function () {
            return -1 !== this.data.search(/^[\x00-\x7F\xC8-\xD3]+$/)
        }, e.prototype.nextA = function (t, e) {
            if (t.length <= 0) return {result: "", checksum: 0};
            var i, n;
            if (t[0] >= 200) n = t[0] - 105, t.shift(), 99 === n ? i = this.nextC(t, e + 1) : 100 === n ? i = this.nextB(t, e + 1) : 98 === n ? (t[0] = t[0] > 95 ? t[0] - 96 : t[0], i = this.nextA(t, e + 1)) : i = this.nextA(t, e + 1); else {
                var r = t[0];
                n = r < 32 ? r + 64 : r - 32, t.shift(), i = this.nextA(t, e + 1)
            }
            var o = n * e;
            return {result: this.getEncoding(n) + i.result, checksum: o + i.checksum}
        }, e.prototype.nextB = function (t, e) {
            if (t.length <= 0) return {result: "", checksum: 0};
            var i, n;
            t[0] >= 200 ? (n = t[0] - 105, t.shift(), 99 === n ? i = this.nextC(t, e + 1) : 101 === n ? i = this.nextA(t, e + 1) : 98 === n ? (t[0] = t[0] < 32 ? t[0] + 96 : t[0], i = this.nextB(t, e + 1)) : i = this.nextB(t, e + 1)) : (n = t[0] - 32, t.shift(), i = this.nextB(t, e + 1));
            var r = n * e;
            return {result: this.getEncoding(n) + i.result, checksum: r + i.checksum}
        }, e.prototype.nextC = function (t, e) {
            if (t.length <= 0) return {result: "", checksum: 0};
            var i, n;
            t[0] >= 200 ? (n = t[0] - 105, t.shift(), i = 100 === n ? this.nextB(t, e + 1) : 101 === n ? this.nextA(t, e + 1) : this.nextC(t, e + 1)) : (n = 10 * (t[0] - 48) + t[1] - 48, t.shift(), t.shift(), i = this.nextC(t, e + 1));
            var r = n * e;
            return {result: this.getEncoding(n) + i.result, checksum: r + i.checksum}
        }, e
    }(s.default), c = function (t) {
        function e() {
            n(this, e);
            var i = r(this, t.call(this));
            return i.name = "InvalidStartCharacterException", i.message = "The encoding does not start with a start character.", i
        }

        return o(e, t), e
    }(Error);
    e.default = a
}, function (t, e) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0}), e.mod10 = function (t) {
        for (var e = 0, i = 0; i < t.length; i++) {
            var n = parseInt(t[i]);
            e += (i + t.length) % 2 == 0 ? n : 2 * n % 10 + Math.floor(2 * n / 10)
        }
        return (10 - e % 10) % 10
    }, e.mod11 = function (t) {
        for (var e = 0, i = [2, 3, 4, 5, 6, 7], n = 0; n < t.length; n++) {
            var r = parseInt(t[t.length - 1 - n]);
            e += i[n % i.length] * r
        }
        return (11 - e % 11) % 11
    }
}, function (t, e) {
    "use strict";

    function i(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
    }

    function n(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || "object" != typeof e && "function" != typeof e ? t : e
    }

    function r(t, e) {
        if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
        t.prototype = Object.create(e && e.prototype, {
            constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
    }

    Object.defineProperty(e, "__esModule", {value: !0});
    var o = function (t) {
        function e(r, o) {
            i(this, e);
            var s = n(this, t.call(this));
            return s.name = "InvalidInputException", s.symbology = r, s.input = o, s.message = '"' + s.input + '" is not a valid input for ' + s.symbology, s
        }

        return r(e, t), e
    }(Error), s = function (t) {
        function e() {
            i(this, e);
            var r = n(this, t.call(this));
            return r.name = "InvalidElementException", r.message = "Not supported type to render on", r
        }

        return r(e, t), e
    }(Error), a = function (t) {
        function e() {
            i(this, e);
            var r = n(this, t.call(this));
            return r.name = "NoElementException", r.message = "No element to render on.", r
        }

        return r(e, t), e
    }(Error);
    e.InvalidInputException = o, e.InvalidElementException = s, e.NoElementException = a
}, function (t, e) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0}), e.default = function (t) {
        var e = ["width", "height", "textMargin", "fontSize", "margin", "marginTop", "marginBottom", "marginLeft", "marginRight"];
        for (var i in e) e.hasOwnProperty(i) && ("string" == typeof t[i = e[i]] && (t[i] = parseInt(t[i], 10)));
        return "string" == typeof t.displayValue && (t.displayValue = "false" != t.displayValue), t
    }
}, function (t, e) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0});
    e.default = {
        width: 2,
        height: 100,
        format: "auto",
        displayValue: !0,
        fontOptions: "",
        font: "monospace",
        text: void 0,
        textAlign: "center",
        textPosition: "bottom",
        textMargin: 2,
        fontSize: 20,
        background: "#ffffff",
        lineColor: "#000000",
        margin: 10,
        marginTop: void 0,
        marginBottom: void 0,
        marginLeft: void 0,
        marginRight: void 0,
        valid: function () {
        }
    }
}, function (t, e, i) {
    "use strict";

    function n(t, e) {
        return e.height + (e.displayValue && t.text.length > 0 ? e.fontSize + e.textMargin : 0) + e.marginTop + e.marginBottom
    }

    function r(t, e, i) {
        if (i.displayValue && e < t) {
            if ("center" == i.textAlign) return Math.floor((t - e) / 2);
            if ("left" == i.textAlign) return 0;
            if ("right" == i.textAlign) return Math.floor(t - e)
        }
        return 0
    }

    function o(t, e, i) {
        var n;
        return (n = void 0 === i ? document.createElement("canvas").getContext("2d") : i).font = e.fontOptions + " " + e.fontSize + "px " + e.font, n.measureText(t).width
    }

    Object.defineProperty(e, "__esModule", {value: !0}), e.getTotalWidthOfEncodings = e.calculateEncodingAttributes = e.getBarcodePadding = e.getEncodingHeight = e.getMaximumHeightOfEncodings = void 0;
    var s = function (t) {
        return t && t.__esModule ? t : {default: t}
    }(i(3));
    e.getMaximumHeightOfEncodings = function (t) {
        for (var e = 0, i = 0; i < t.length; i++) t[i].height > e && (e = t[i].height);
        return e
    }, e.getEncodingHeight = n, e.getBarcodePadding = r, e.calculateEncodingAttributes = function (t, e, i) {
        for (var a = 0; a < t.length; a++) {
            var c, l = t[a], h = (0, s.default)(e, l.options);
            c = h.displayValue ? o(l.text, h, i) : 0;
            var u = l.data.length * h.width;
            l.width = Math.ceil(Math.max(c, u)), l.height = n(l, h), l.barcodePadding = r(c, u, h)
        }
    }, e.getTotalWidthOfEncodings = function (t) {
        for (var e = 0, i = 0; i < t.length; i++) e += t[i].width;
        return e
    }
}, function (t, e, i) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0});
    var n = i(20), r = i(19), o = i(26), s = i(29), a = i(28), c = i(34), l = i(36), h = i(35), u = i(27);
    e.default = {
        CODE39: n.CODE39,
        CODE128: r.CODE128,
        CODE128A: r.CODE128A,
        CODE128B: r.CODE128B,
        CODE128C: r.CODE128C,
        EAN13: o.EAN13,
        EAN8: o.EAN8,
        EAN5: o.EAN5,
        EAN2: o.EAN2,
        UPC: o.UPC,
        ITF14: s.ITF14,
        ITF: a.ITF,
        MSI: c.MSI,
        MSI10: c.MSI10,
        MSI11: c.MSI11,
        MSI1010: c.MSI1010,
        MSI1110: c.MSI1110,
        pharmacode: l.pharmacode,
        codabar: h.codabar,
        GenericBarcode: u.GenericBarcode
    }
}, function (t, e) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0});
    var i = function () {
        function t(e) {
            (function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            })(this, t), this.api = e
        }

        return t.prototype.handleCatch = function (t) {
            if ("InvalidInputException" !== t.name) throw t;
            if (this.api._options.valid === this.api._defaults.valid) throw t.message;
            this.api._options.valid(!1), this.api.render = function () {
            }
        }, t.prototype.wrapBarcodeCall = function (t) {
            try {
                var e = t.apply(void 0, arguments);
                return this.api._options.valid(!0), e
            } catch (t) {
                return this.handleCatch(t), this.api
            }
        }, t
    }();
    e.default = i
}, function (t, e) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0}), e.default = function (t) {
        return t.marginTop = t.marginTop || t.margin, t.marginBottom = t.marginBottom || t.margin, t.marginRight = t.marginRight || t.margin, t.marginLeft = t.marginLeft || t.margin, t
    }
}, function (t, e, i) {
    "use strict";

    function n(t) {
        return t && t.__esModule ? t : {default: t}
    }

    function r(t) {
        if ("string" == typeof t) return function (t) {
            var e = document.querySelectorAll(t);
            if (0 !== e.length) {
                for (var i = [], n = 0; n < e.length; n++) i.push(r(e[n]));
                return i
            }
        }(t);
        if (Array.isArray(t)) {
            for (var e = [], i = 0; i < t.length; i++) e.push(r(t[i]));
            return e
        }
        if ("undefined" != typeof HTMLCanvasElement && t instanceof HTMLImageElement) return function (t) {
            var e = document.createElement("canvas");
            return {
                element: e,
                options: (0, s.default)(t),
                renderer: a.default.CanvasRenderer,
                afterRender: function () {
                    t.setAttribute("src", e.toDataURL())
                }
            }
        }(t);
        if ("undefined" != typeof SVGElement && t instanceof SVGElement) return {
            element: t,
            options: (0, s.default)(t),
            renderer: a.default.SVGRenderer
        };
        if ("undefined" != typeof HTMLCanvasElement && t instanceof HTMLCanvasElement) return {
            element: t,
            options: (0, s.default)(t),
            renderer: a.default.CanvasRenderer
        };
        if (t && t.getContext) return {element: t, renderer: a.default.CanvasRenderer};
        if (t && "object" === (void 0 === t ? "undefined" : o(t)) && !t.nodeName) return {
            element: t,
            renderer: a.default.ObjectRenderer
        };
        throw new c.InvalidElementException
    }

    Object.defineProperty(e, "__esModule", {value: !0});
    var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
        return typeof t
    } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol ? "symbol" : typeof t
    }, s = n(i(37)), a = n(i(39)), c = i(6);
    e.default = r
}, function (t, e) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0}), e.default = function (t) {
        var e = [];
        return function t(i) {
            if (Array.isArray(i)) for (var n = 0; n < i.length; n++) t(i[n]); else i.text = i.text || "", i.data = i.data || "", e.push(i)
        }(t), e
    }
}, function (t, e, i) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0});
    var n = function (t) {
        return t && t.__esModule ? t : {default: t}
    }(i(4)), r = function (t) {
        function e(i, n) {
            return function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, e), function (t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }(this, t.call(this, String.fromCharCode(208) + i, n))
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e.prototype.valid = function () {
            return -1 !== this.data.search(/^[\x00-\x5F\xC8-\xCF]+$/)
        }, e
    }(n.default);
    e.default = r
}, function (t, e, i) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0});
    var n = function (t) {
        return t && t.__esModule ? t : {default: t}
    }(i(4)), r = function (t) {
        function e(i, n) {
            return function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, e), function (t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }(this, t.call(this, String.fromCharCode(209) + i, n))
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e.prototype.valid = function () {
            return -1 !== this.data.search(/^[\x20-\x7F\xC8-\xCF]+$/)
        }, e
    }(n.default);
    e.default = r
}, function (t, e, i) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0});
    var n = function (t) {
        return t && t.__esModule ? t : {default: t}
    }(i(4)), r = function (t) {
        function e(i, n) {
            return function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, e), function (t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }(this, t.call(this, String.fromCharCode(210) + i, n))
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e.prototype.valid = function () {
            return -1 !== this.data.search(/^(\xCF*[0-9]{2}\xCF*)+$/)
        }, e
    }(n.default);
    e.default = r
}, function (t, e, i) {
    "use strict";

    function n(t, e) {
        if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !e || "object" != typeof e && "function" != typeof e ? t : e
    }

    function r(t) {
        var e = t.match(/^([\x00-\x5F\xC8-\xCF]+?)(([0-9]{2}){2,})([^0-9]|$)/);
        if (e) return e[1] + String.fromCharCode(204) + s(t.substring(e[1].length));
        var i = t.match(/^[\x00-\x5F\xC8-\xCF]+/);
        return i[0].length === t.length ? t : i[0] + String.fromCharCode(205) + o(t.substring(i[0].length))
    }

    function o(t) {
        var e = t.match(/^([\x20-\x7F\xC8-\xCF]+?)(([0-9]{2}){2,})([^0-9]|$)/);
        if (e) return e[1] + String.fromCharCode(204) + s(t.substring(e[1].length));
        var i = t.match(/^[\x20-\x7F\xC8-\xCF]+/);
        return i[0].length === t.length ? t : i[0] + String.fromCharCode(206) + r(t.substring(i[0].length))
    }

    function s(t) {
        var e = t.match(/^(\xCF*[0-9]{2}\xCF*)+/)[0], i = e.length;
        return i === t.length ? t : (t = t.substring(i)).match(/^[\x00-\x5F\xC8-\xCF]*/)[0].length >= t.match(/^[\x20-\x7F\xC8-\xCF]*/)[0].length ? e + String.fromCharCode(206) + r(t) : e + String.fromCharCode(205) + o(t)
    }

    Object.defineProperty(e, "__esModule", {value: !0});
    var a = function (t) {
        return t && t.__esModule ? t : {default: t}
    }(i(4)), c = function (t) {
        function e(i, a) {
            if (function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, e), -1 !== i.search(/^[\x00-\x7F\xC8-\xD3]+$/)) var c = n(this, t.call(this, function (t) {
                var e = t.match(/^[\x00-\x5F\xC8-\xCF]*/)[0].length, i = t.match(/^[\x20-\x7F\xC8-\xCF]*/)[0].length;
                return (t.match(/^(\xCF*[0-9]{2}\xCF*)*/)[0].length >= 2 ? String.fromCharCode(210) + s(t) : e > i ? String.fromCharCode(208) + r(t) : String.fromCharCode(209) + o(t)).replace(/[\xCD\xCE]([^])[\xCD\xCE]/, (function (t, e) {
                    return String.fromCharCode(203) + e
                }))
            }(i), a)); else c = n(this, t.call(this, i, a));
            return n(c)
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e
    }(a.default);
    e.default = c
}, function (t, e, i) {
    "use strict";

    function n(t) {
        return t && t.__esModule ? t : {default: t}
    }

    Object.defineProperty(e, "__esModule", {value: !0}), e.CODE128C = e.CODE128B = e.CODE128A = e.CODE128 = void 0;
    var r = n(i(18)), o = n(i(15)), s = n(i(16)), a = n(i(17));
    e.CODE128 = r.default, e.CODE128A = o.default, e.CODE128B = s.default, e.CODE128C = a.default
}, function (t, e, i) {
    "use strict";

    function n(t) {
        return function (t) {
            return c[t].toString(2)
        }(r(t))
    }

    function r(t) {
        return a.indexOf(t)
    }

    Object.defineProperty(e, "__esModule", {value: !0}), e.CODE39 = void 0;
    var o = function (t) {
            return t && t.__esModule ? t : {default: t}
        }(i(0)), s = function (t) {
            function e(i, n) {
                return function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, e), i = i.toUpperCase(), n.mod43 && (i += function (t) {
                    return a[t]
                }(function (t) {
                    for (var e = 0, i = 0; i < t.length; i++) e += r(t[i]);
                    return e % 43
                }(i))), function (t, e) {
                    if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !e || "object" != typeof e && "function" != typeof e ? t : e
                }(this, t.call(this, i, n))
            }

            return function (t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
            }(e, t), e.prototype.encode = function () {
                for (var t = n("*"), e = 0; e < this.data.length; e++) t += n(this.data[e]) + "0";
                return {data: t += n("*"), text: this.text}
            }, e.prototype.valid = function () {
                return -1 !== this.data.search(/^[0-9A-Z\-\.\ \$\/\+\%]+$/)
            }, e
        }(o.default),
        a = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "-", ".", " ", "$", "/", "+", "%", "*"],
        c = [20957, 29783, 23639, 30485, 20951, 29813, 23669, 20855, 29789, 23645, 29975, 23831, 30533, 22295, 30149, 24005, 21623, 29981, 23837, 22301, 30023, 23879, 30545, 22343, 30161, 24017, 21959, 30065, 23921, 22385, 29015, 18263, 29141, 17879, 29045, 18293, 17783, 29021, 18269, 17477, 17489, 17681, 20753, 35770];
    e.CODE39 = s
}, function (t, e, i) {
    "use strict";

    function n(t) {
        return t && t.__esModule ? t : {default: t}
    }

    function r(t) {
        var e, i = 0;
        for (e = 0; e < 12; e += 2) i += parseInt(t[e]);
        for (e = 1; e < 12; e += 2) i += 3 * parseInt(t[e]);
        return (10 - i % 10) % 10
    }

    Object.defineProperty(e, "__esModule", {value: !0});
    var o = n(i(1)), s = function (t) {
        function e(i, n) {
            (function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            })(this, e), -1 !== i.search(/^[0-9]{12}$/) && (i += r(i));
            var o = function (t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }(this, t.call(this, i, n));
            return !n.flat && n.fontSize > 10 * n.width ? o.fontSize = 10 * n.width : o.fontSize = n.fontSize, o.guardHeight = n.height + o.fontSize / 2 + n.textMargin, o.lastChar = n.lastChar, o
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e.prototype.valid = function () {
            return -1 !== this.data.search(/^[0-9]{13}$/) && this.data[12] == r(this.data)
        }, e.prototype.encode = function () {
            return this.options.flat ? this.flatEncoding() : this.guardedEncoding()
        }, e.prototype.getStructure = function () {
            return ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"]
        }, e.prototype.guardedEncoding = function () {
            var t = new o.default, e = [], i = this.getStructure()[this.data[0]], n = this.data.substr(1, 6),
                r = this.data.substr(7, 6);
            return this.options.displayValue && e.push({
                data: "000000000000",
                text: this.text.substr(0, 1),
                options: {textAlign: "left", fontSize: this.fontSize}
            }), e.push({data: "101", options: {height: this.guardHeight}}), e.push({
                data: t.encode(n, i),
                text: this.text.substr(1, 6),
                options: {fontSize: this.fontSize}
            }), e.push({data: "01010", options: {height: this.guardHeight}}), e.push({
                data: t.encode(r, "RRRRRR"),
                text: this.text.substr(7, 6),
                options: {fontSize: this.fontSize}
            }), e.push({
                data: "101",
                options: {height: this.guardHeight}
            }), this.options.lastChar && this.options.displayValue && (e.push({data: "00"}), e.push({
                data: "00000",
                text: this.options.lastChar,
                options: {fontSize: this.fontSize}
            })), e
        }, e.prototype.flatEncoding = function () {
            var t = new o.default, e = "", i = this.getStructure()[this.data[0]];
            return e += "101", e += t.encode(this.data.substr(1, 6), i), e += "01010", e += t.encode(this.data.substr(7, 6), "RRRRRR"), {
                data: e += "101",
                text: this.text
            }
        }, e
    }(n(i(0)).default);
    e.default = s
}, function (t, e, i) {
    "use strict";

    function n(t) {
        return t && t.__esModule ? t : {default: t}
    }

    Object.defineProperty(e, "__esModule", {value: !0});
    var r = n(i(1)), o = function (t) {
        function e(i, n) {
            !function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, e);
            var r = function (t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }(this, t.call(this, i, n));
            return r.structure = ["LL", "LG", "GL", "GG"], r
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e.prototype.valid = function () {
            return -1 !== this.data.search(/^[0-9]{2}$/)
        }, e.prototype.encode = function () {
            var t = new r.default, e = this.structure[parseInt(this.data) % 4], i = "1011";
            return {data: i += t.encode(this.data, e, "01"), text: this.text}
        }, e
    }(n(i(0)).default);
    e.default = o
}, function (t, e, i) {
    "use strict";

    function n(t) {
        return t && t.__esModule ? t : {default: t}
    }

    Object.defineProperty(e, "__esModule", {value: !0});
    var r = n(i(1)), o = function (t) {
        function e(i, n) {
            !function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, e);
            var r = function (t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }(this, t.call(this, i, n));
            return r.structure = ["GGLLL", "GLGLL", "GLLGL", "GLLLG", "LGGLL", "LLGGL", "LLLGG", "LGLGL", "LGLLG", "LLGLG"], r
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e.prototype.valid = function () {
            return -1 !== this.data.search(/^[0-9]{5}$/)
        }, e.prototype.encode = function () {
            var t = new r.default, e = this.checksum(), i = "1011";
            return {data: i += t.encode(this.data, this.structure[e], "01"), text: this.text}
        }, e.prototype.checksum = function () {
            var t = 0;
            return t += 3 * parseInt(this.data[0]), t += 9 * parseInt(this.data[1]), t += 3 * parseInt(this.data[2]), t += 9 * parseInt(this.data[3]), (t += 3 * parseInt(this.data[4])) % 10
        }, e
    }(n(i(0)).default);
    e.default = o
}, function (t, e, i) {
    "use strict";

    function n(t) {
        return t && t.__esModule ? t : {default: t}
    }

    function r(t) {
        var e, i = 0;
        for (e = 0; e < 7; e += 2) i += 3 * parseInt(t[e]);
        for (e = 1; e < 7; e += 2) i += parseInt(t[e]);
        return (10 - i % 10) % 10
    }

    Object.defineProperty(e, "__esModule", {value: !0});
    var o = n(i(1)), s = function (t) {
        function e(i, n) {
            return function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, e), -1 !== i.search(/^[0-9]{7}$/) && (i += r(i)), function (t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }(this, t.call(this, i, n))
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e.prototype.valid = function () {
            return -1 !== this.data.search(/^[0-9]{8}$/) && this.data[7] == r(this.data)
        }, e.prototype.encode = function () {
            var t = new o.default, e = "", i = this.data.substr(0, 4), n = this.data.substr(4, 4);
            return e += t.startBin, e += t.encode(i, "LLLL"), e += t.middleBin, e += t.encode(n, "RRRR"), {
                data: e += t.endBin,
                text: this.text
            }
        }, e
    }(n(i(0)).default);
    e.default = s
}, function (t, e, i) {
    "use strict";

    function n(t) {
        return t && t.__esModule ? t : {default: t}
    }

    function r(t) {
        var e, i = 0;
        for (e = 1; e < 11; e += 2) i += parseInt(t[e]);
        for (e = 0; e < 11; e += 2) i += 3 * parseInt(t[e]);
        return (10 - i % 10) % 10
    }

    Object.defineProperty(e, "__esModule", {value: !0});
    var o = n(i(1)), s = function (t) {
        function e(i, n) {
            (function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            })(this, e), -1 !== i.search(/^[0-9]{11}$/) && (i += r(i));
            var o = function (t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }(this, t.call(this, i, n));
            return o.displayValue = n.displayValue, n.fontSize > 10 * n.width ? o.fontSize = 10 * n.width : o.fontSize = n.fontSize, o.guardHeight = n.height + o.fontSize / 2 + n.textMargin, o
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e.prototype.valid = function () {
            return -1 !== this.data.search(/^[0-9]{12}$/) && this.data[11] == r(this.data)
        }, e.prototype.encode = function () {
            return this.options.flat ? this.flatEncoding() : this.guardedEncoding()
        }, e.prototype.flatEncoding = function () {
            var t = new o.default, e = "";
            return e += "101", e += t.encode(this.data.substr(0, 6), "LLLLLL"), e += "01010", e += t.encode(this.data.substr(6, 6), "RRRRRR"), {
                data: e += "101",
                text: this.text
            }
        }, e.prototype.guardedEncoding = function () {
            var t = new o.default, e = [];
            return this.displayValue && e.push({
                data: "00000000",
                text: this.text.substr(0, 1),
                options: {textAlign: "left", fontSize: this.fontSize}
            }), e.push({
                data: "101" + t.encode(this.data[0], "L"),
                options: {height: this.guardHeight}
            }), e.push({
                data: t.encode(this.data.substr(1, 5), "LLLLL"),
                text: this.text.substr(1, 5),
                options: {fontSize: this.fontSize}
            }), e.push({
                data: "01010",
                options: {height: this.guardHeight}
            }), e.push({
                data: t.encode(this.data.substr(6, 5), "RRRRR"),
                text: this.text.substr(6, 5),
                options: {fontSize: this.fontSize}
            }), e.push({
                data: t.encode(this.data[11], "R") + "101",
                options: {height: this.guardHeight}
            }), this.displayValue && e.push({
                data: "00000000",
                text: this.text.substr(11, 1),
                options: {textAlign: "right", fontSize: this.fontSize}
            }), e
        }, e
    }(n(i(0)).default);
    e.default = s
}, function (t, e, i) {
    "use strict";

    function n(t) {
        return t && t.__esModule ? t : {default: t}
    }

    Object.defineProperty(e, "__esModule", {value: !0}), e.UPC = e.EAN2 = e.EAN5 = e.EAN8 = e.EAN13 = void 0;
    var r = n(i(21)), o = n(i(24)), s = n(i(23)), a = n(i(22)), c = n(i(25));
    e.EAN13 = r.default, e.EAN8 = o.default, e.EAN5 = s.default, e.EAN2 = a.default, e.UPC = c.default
}, function (t, e, i) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0}), e.GenericBarcode = void 0;
    var n = function (t) {
        return t && t.__esModule ? t : {default: t}
    }(i(0)), r = function (t) {
        function e(i, n) {
            return function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, e), function (t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }(this, t.call(this, i, n))
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e.prototype.encode = function () {
            return {data: "10101010101010101010101010101010101010101", text: this.text}
        }, e.prototype.valid = function () {
            return !0
        }, e
    }(n.default);
    e.GenericBarcode = r
}, function (t, e, i) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0}), e.ITF = void 0;
    var n = function (t) {
        return t && t.__esModule ? t : {default: t}
    }(i(0)), r = function (t) {
        function e(i, n) {
            !function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, e);
            var r = function (t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }(this, t.call(this, i, n));
            return r.binaryRepresentation = {
                0: "00110",
                1: "10001",
                2: "01001",
                3: "11000",
                4: "00101",
                5: "10100",
                6: "01100",
                7: "00011",
                8: "10010",
                9: "01010"
            }, r
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e.prototype.valid = function () {
            return -1 !== this.data.search(/^([0-9]{2})+$/)
        }, e.prototype.encode = function () {
            for (var t = "1010", e = 0; e < this.data.length; e += 2) t += this.calculatePair(this.data.substr(e, 2));
            return {data: t += "11101", text: this.text}
        }, e.prototype.calculatePair = function (t) {
            for (var e = "", i = this.binaryRepresentation[t[0]], n = this.binaryRepresentation[t[1]], r = 0; r < 5; r++) e += "1" == i[r] ? "111" : "1", e += "1" == n[r] ? "000" : "0";
            return e
        }, e
    }(n.default);
    e.ITF = r
}, function (t, e, i) {
    "use strict";

    function n(t) {
        for (var e = 0, i = 0; i < 13; i++) e += parseInt(t[i]) * (3 - i % 2 * 2);
        return 10 * Math.ceil(e / 10) - e
    }

    Object.defineProperty(e, "__esModule", {value: !0}), e.ITF14 = void 0;
    var r = function (t) {
        return t && t.__esModule ? t : {default: t}
    }(i(0)), o = function (t) {
        function e(i, r) {
            (function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            })(this, e), -1 !== i.search(/^[0-9]{13}$/) && (i += n(i));
            var o = function (t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }(this, t.call(this, i, r));
            return o.binaryRepresentation = {
                0: "00110",
                1: "10001",
                2: "01001",
                3: "11000",
                4: "00101",
                5: "10100",
                6: "01100",
                7: "00011",
                8: "10010",
                9: "01010"
            }, o
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e.prototype.valid = function () {
            return -1 !== this.data.search(/^[0-9]{14}$/) && this.data[13] == n(this.data)
        }, e.prototype.encode = function () {
            for (var t = "1010", e = 0; e < 14; e += 2) t += this.calculatePair(this.data.substr(e, 2));
            return {data: t += "11101", text: this.text}
        }, e.prototype.calculatePair = function (t) {
            for (var e = "", i = this.binaryRepresentation[t[0]], n = this.binaryRepresentation[t[1]], r = 0; r < 5; r++) e += "1" == i[r] ? "111" : "1", e += "1" == n[r] ? "000" : "0";
            return e
        }, e
    }(r.default);
    e.ITF14 = o
}, function (t, e, i) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0});
    var n = function (t) {
        return t && t.__esModule ? t : {default: t}
    }(i(2)), r = i(5), o = function (t) {
        function e(i, n) {
            return function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, e), function (t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }(this, t.call(this, i + (0, r.mod10)(i), n))
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e
    }(n.default);
    e.default = o
}, function (t, e, i) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0});
    var n = function (t) {
        return t && t.__esModule ? t : {default: t}
    }(i(2)), r = i(5), o = function (t) {
        function e(i, n) {
            return function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, e), i += (0, r.mod10)(i), i += (0, r.mod10)(i), function (t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }(this, t.call(this, i, n))
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e
    }(n.default);
    e.default = o
}, function (t, e, i) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0});
    var n = function (t) {
        return t && t.__esModule ? t : {default: t}
    }(i(2)), r = i(5), o = function (t) {
        function e(i, n) {
            return function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, e), function (t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }(this, t.call(this, i + (0, r.mod11)(i), n))
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e
    }(n.default);
    e.default = o
}, function (t, e, i) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0});
    var n = function (t) {
        return t && t.__esModule ? t : {default: t}
    }(i(2)), r = i(5), o = function (t) {
        function e(i, n) {
            return function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, e), i += (0, r.mod11)(i), i += (0, r.mod10)(i), function (t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }(this, t.call(this, i, n))
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e
    }(n.default);
    e.default = o
}, function (t, e, i) {
    "use strict";

    function n(t) {
        return t && t.__esModule ? t : {default: t}
    }

    Object.defineProperty(e, "__esModule", {value: !0}), e.MSI1110 = e.MSI1010 = e.MSI11 = e.MSI10 = e.MSI = void 0;
    var r = n(i(2)), o = n(i(30)), s = n(i(32)), a = n(i(31)), c = n(i(33));
    e.MSI = r.default, e.MSI10 = o.default, e.MSI11 = s.default, e.MSI1010 = a.default, e.MSI1110 = c.default
}, function (t, e, i) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0}), e.codabar = void 0;
    var n = function (t) {
        return t && t.__esModule ? t : {default: t}
    }(i(0)), r = function (t) {
        function e(i, n) {
            (function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            })(this, e), 0 === i.search(/^[0-9\-\$\:\.\+\/]+$/) && (i = "A" + i + "A");
            var r = function (t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }(this, t.call(this, i.toUpperCase(), n));
            return r.text = r.options.text || r.text.replace(/[A-D]/g, ""), r
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e.prototype.valid = function () {
            return -1 !== this.data.search(/^[A-D][0-9\-\$\:\.\+\/]+[A-D]$/)
        }, e.prototype.encode = function () {
            for (var t = [], e = this.getEncodings(), i = 0; i < this.data.length; i++) t.push(e[this.data.charAt(i)]), i !== this.data.length - 1 && t.push("0");
            return {text: this.text, data: t.join("")}
        }, e.prototype.getEncodings = function () {
            return {
                0: "101010011",
                1: "101011001",
                2: "101001011",
                3: "110010101",
                4: "101101001",
                5: "110101001",
                6: "100101011",
                7: "100101101",
                8: "100110101",
                9: "110100101",
                "-": "101001101",
                $: "101100101",
                ":": "1101011011",
                "/": "1101101011",
                ".": "1101101101",
                "+": "101100110011",
                A: "1011001001",
                B: "1010010011",
                C: "1001001011",
                D: "1010011001"
            }
        }, e
    }(n.default);
    e.codabar = r
}, function (t, e, i) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0}), e.pharmacode = void 0;
    var n = function (t) {
        return t && t.__esModule ? t : {default: t}
    }(i(0)), r = function (t) {
        function e(i, n) {
            !function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }(this, e);
            var r = function (t, e) {
                if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !e || "object" != typeof e && "function" != typeof e ? t : e
            }(this, t.call(this, i, n));
            return r.number = parseInt(i, 10), r
        }

        return function (t, e) {
            if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
            t.prototype = Object.create(e && e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
        }(e, t), e.prototype.encode = function () {
            for (var t = this.number, e = ""; !isNaN(t) && 0 != t;) t % 2 == 0 ? (e = "11100" + e, t = (t - 2) / 2) : (e = "100" + e, t = (t - 1) / 2);
            return {data: e = e.slice(0, -2), text: this.text}
        }, e.prototype.valid = function () {
            return this.number >= 3 && this.number <= 131070
        }, e
    }(n.default);
    e.pharmacode = r
}, function (t, e, i) {
    "use strict";

    function n(t) {
        return t && t.__esModule ? t : {default: t}
    }

    Object.defineProperty(e, "__esModule", {value: !0});
    var r = n(i(7)), o = n(i(8));
    e.default = function (t) {
        var e = {};
        for (var i in o.default) o.default.hasOwnProperty(i) && (t.hasAttribute("jsbarcode-" + i.toLowerCase()) && (e[i] = t.getAttribute("jsbarcode-" + i.toLowerCase())), t.hasAttribute("data-" + i.toLowerCase()) && (e[i] = t.getAttribute("data-" + i.toLowerCase())));
        return e.value = t.getAttribute("jsbarcode-value") || t.getAttribute("data-value"), (0, r.default)(e)
    }
}, function (t, e, i) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0});
    var n = function (t) {
        return t && t.__esModule ? t : {default: t}
    }(i(3)), r = i(9), o = function () {
        function t(e, i, n) {
            (function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            })(this, t), this.canvas = e, this.encodings = i, this.options = n
        }

        return t.prototype.render = function () {
            if (!this.canvas.getContext) throw new Error("The browser does not support canvas.");
            this.prepareCanvas();
            for (var t = 0; t < this.encodings.length; t++) {
                var e = (0, n.default)(this.options, this.encodings[t].options);
                this.drawCanvasBarcode(e, this.encodings[t]), this.drawCanvasText(e, this.encodings[t]), this.moveCanvasDrawing(this.encodings[t])
            }
            this.restoreCanvas()
        }, t.prototype.prepareCanvas = function () {
            var t = this.canvas.getContext("2d");
            t.save(), (0, r.calculateEncodingAttributes)(this.encodings, this.options, t);
            var e = (0, r.getTotalWidthOfEncodings)(this.encodings),
                i = (0, r.getMaximumHeightOfEncodings)(this.encodings);
            this.canvas.width = e + this.options.marginLeft + this.options.marginRight, this.canvas.height = i, t.clearRect(0, 0, this.canvas.width, this.canvas.height), this.options.background && (t.fillStyle = this.options.background, t.fillRect(0, 0, this.canvas.width, this.canvas.height)), t.translate(this.options.marginLeft, 0)
        }, t.prototype.drawCanvasBarcode = function (t, e) {
            var i, n = this.canvas.getContext("2d"), r = e.data;
            i = "top" == t.textPosition ? t.marginTop + t.fontSize + t.textMargin : t.marginTop, n.fillStyle = t.lineColor;
            for (var o = 0; o < r.length; o++) {
                var s = o * t.width + e.barcodePadding;
                "1" === r[o] ? n.fillRect(s, i, t.width, t.height) : r[o] && n.fillRect(s, i, t.width, t.height * r[o])
            }
        }, t.prototype.drawCanvasText = function (t, e) {
            var i, n, r = this.canvas.getContext("2d"), o = t.fontOptions + " " + t.fontSize + "px " + t.font;
            t.displayValue && (n = "top" == t.textPosition ? t.marginTop + t.fontSize - t.textMargin : t.height + t.textMargin + t.marginTop + t.fontSize, r.font = o, "left" == t.textAlign || e.barcodePadding > 0 ? (i = 0, r.textAlign = "left") : "right" == t.textAlign ? (i = e.width - 1, r.textAlign = "right") : (i = e.width / 2, r.textAlign = "center"), r.fillText(e.text, i, n))
        }, t.prototype.moveCanvasDrawing = function (t) {
            this.canvas.getContext("2d").translate(t.width, 0)
        }, t.prototype.restoreCanvas = function () {
            this.canvas.getContext("2d").restore()
        }, t
    }();
    e.default = o
}, function (t, e, i) {
    "use strict";

    function n(t) {
        return t && t.__esModule ? t : {default: t}
    }

    Object.defineProperty(e, "__esModule", {value: !0});
    var r = n(i(38)), o = n(i(41)), s = n(i(40));
    e.default = {CanvasRenderer: r.default, SVGRenderer: o.default, ObjectRenderer: s.default}
}, function (t, e) {
    "use strict";
    Object.defineProperty(e, "__esModule", {value: !0});
    var i = function () {
        function t(e, i, n) {
            (function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            })(this, t), this.object = e, this.encodings = i, this.options = n
        }

        return t.prototype.render = function () {
            this.object.encodings = this.encodings
        }, t
    }();
    e.default = i
}, function (t, e, i) {
    "use strict";

    function n(t, e, i) {
        var n = document.createElementNS(c, "g");
        return n.setAttribute("transform", "translate(" + t + ", " + e + ")"), i.appendChild(n), n
    }

    function r(t, e) {
        t.setAttribute("style", "fill:" + e.lineColor + ";")
    }

    function o(t, e, i, n, r) {
        var o = document.createElementNS(c, "rect");
        return o.setAttribute("x", t), o.setAttribute("y", e), o.setAttribute("width", i), o.setAttribute("height", n), r.appendChild(o), o
    }

    Object.defineProperty(e, "__esModule", {value: !0});
    var s = function (t) {
        return t && t.__esModule ? t : {default: t}
    }(i(3)), a = i(9), c = "http://www.w3.org/2000/svg", l = function () {
        function t(e, i, n) {
            (function (t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            })(this, t), this.svg = e, this.encodings = i, this.options = n
        }

        return t.prototype.render = function () {
            var t = this.options.marginLeft;
            this.prepareSVG();
            for (var e = 0; e < this.encodings.length; e++) {
                var i = this.encodings[e], o = (0, s.default)(this.options, i.options), a = n(t, o.marginTop, this.svg);
                r(a, o), this.drawSvgBarcode(a, o, i), this.drawSVGText(a, o, i), t += i.width
            }
        }, t.prototype.prepareSVG = function () {
            for (; this.svg.firstChild;) this.svg.removeChild(this.svg.firstChild);
            (0, a.calculateEncodingAttributes)(this.encodings, this.options);
            var t = (0, a.getTotalWidthOfEncodings)(this.encodings),
                e = (0, a.getMaximumHeightOfEncodings)(this.encodings),
                i = t + this.options.marginLeft + this.options.marginRight;
            this.setSvgAttributes(i, e), this.options.background && o(0, 0, i, e, this.svg).setAttribute("style", "fill:" + this.options.background + ";")
        }, t.prototype.drawSvgBarcode = function (t, e, i) {
            var n, r = i.data;
            n = "top" == e.textPosition ? e.fontSize + e.textMargin : 0;
            for (var s = 0, a = 0, c = 0; c < r.length; c++) a = c * e.width + i.barcodePadding, "1" === r[c] ? s++ : s > 0 && (o(a - e.width * s, n, e.width * s, e.height, t), s = 0);
            s > 0 && o(a - e.width * (s - 1), n, e.width * s, e.height, t)
        }, t.prototype.drawSVGText = function (t, e, i) {
            var n, r, o = document.createElementNS(c, "text");
            e.displayValue && (o.setAttribute("font-family", e.font), o.setAttribute("font-size", e.fontSize + "px"), r = "top" == e.textPosition ? e.fontSize - e.textMargin : e.height + e.textMargin + e.fontSize, "left" == e.textAlign || i.barcodePadding > 0 ? (n = 0, o.setAttribute("text-anchor", "start")) : "right" == e.textAlign ? (n = i.width - 1, o.setAttribute("text-anchor", "end")) : (n = i.width / 2, o.setAttribute("text-anchor", "middle")), o.setAttribute("x", n), o.setAttribute("y", r), o.appendChild(document.createTextNode(i.text)), t.appendChild(o))
        }, t.prototype.setSvgAttributes = function (t, e) {
            var i = this.svg;
            i.setAttribute("width", t + "px"), i.setAttribute("height", e + "px"), i.setAttribute("x", "0px"), i.setAttribute("y", "0px"), i.setAttribute("viewBox", "0 0 " + t + " " + e), i.setAttribute("xmlns", c), i.setAttribute("version", "1.1"), i.style.transform = "translate(0,0)"
        }, t
    }();
    e.default = l
}, function (t, e, i) {
    "use strict";

    function n(t) {
        return t && t.__esModule ? t : {default: t}
    }

    function r(t, e) {
        m.prototype[e] = m.prototype[e.toUpperCase()] = m.prototype[e.toLowerCase()] = function (i, n) {
            var r = this;
            return r._errorHandler.wrapBarcodeCall((function () {
                n.text = void 0 === n.text ? void 0 : "" + n.text;
                var s = (0, l.default)(r._options, n);
                s = (0, d.default)(s);
                var a = t[e], c = o(i, a, s);
                return r._encodings.push(c), r
            }))
        }
    }

    function o(t, e, i) {
        var n = new e(t = "" + t, i);
        if (!n.valid()) throw new g.InvalidInputException(n.constructor.name, t);
        var r = n.encode();
        r = (0, h.default)(r);
        for (var o = 0; o < r.length; o++) r[o].options = (0, l.default)(i, r[o].options);
        return r
    }

    function s() {
        return c.default.CODE128 ? "CODE128" : Object.keys(c.default)[0]
    }

    function a(t, e, i) {
        e = (0, h.default)(e);
        for (var n = 0; n < e.length; n++) e[n].options = (0, l.default)(i, e[n].options), (0, u.default)(e[n].options);
        (0, u.default)(i), new (0, t.renderer)(t.element, e, i).render(), t.afterRender && t.afterRender()
    }

    var c = n(i(10)), l = n(i(3)), h = n(i(14)), u = n(i(12)), f = n(i(13)), d = n(i(7)), p = n(i(11)), g = i(6),
        v = n(i(8)), m = function () {
        }, _ = function (t, e, i) {
            var n = new m;
            if (void 0 === t) throw Error("No element to render on was provided.");
            return n._renderProperties = (0, f.default)(t), n._encodings = [], n._options = v.default, n._errorHandler = new p.default(n), void 0 !== e && ((i = i || {}).format || (i.format = s()), n.options(i)[i.format](e, i).render()), n
        };
    for (var b in _.getModule = function (t) {
        return c.default[t]
    }, c.default) c.default.hasOwnProperty(b) && r(c.default, b);
    m.prototype.options = function (t) {
        return this._options = (0, l.default)(this._options, t), this
    }, m.prototype.blank = function (t) {
        var e = "0".repeat(t);
        return this._encodings.push({data: e}), this
    }, m.prototype.init = function () {
        var t;
        if (this._renderProperties) for (var e in Array.isArray(this._renderProperties) || (this._renderProperties = [this._renderProperties]), this._renderProperties) {
            t = this._renderProperties[e];
            var i = (0, l.default)(this._options, t.options);
            "auto" == i.format && (i.format = s()), this._errorHandler.wrapBarcodeCall((function () {
                var e = o(i.value, c.default[i.format.toUpperCase()], i);
                a(t, e, i)
            }))
        }
    }, m.prototype.render = function () {
        if (!this._renderProperties) throw new g.NoElementException;
        if (Array.isArray(this._renderProperties)) for (var t = 0; t < this._renderProperties.length; t++) a(this._renderProperties[t], this._encodings, this._options); else a(this._renderProperties, this._encodings, this._options);
        return this
    }, m.prototype._defaults = v.default, "undefined" != typeof window && (window.JsBarcode = _), "undefined" != typeof jQuery && (jQuery.fn.JsBarcode = function (t, e) {
        var i = [];
        return jQuery(this).each((function () {
            i.push(this)
        })), _(i, t, e)
    }), t.exports = _
}]), function (t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.Grapick = e() : t.Grapick = e()
}("undefined" != typeof self ? self : this, (function () {
    return function (t) {
        function e(n) {
            if (i[n]) return i[n].exports;
            var r = i[n] = {i: n, l: !1, exports: {}};
            return t[n].call(r.exports, r, r.exports, e), r.l = !0, r.exports
        }

        var i = {};
        return e.m = t, e.c = i, e.d = function (t, i, n) {
            e.o(t, i) || Object.defineProperty(t, i, {configurable: !1, enumerable: !0, get: n})
        }, e.n = function (t) {
            var i = t && t.__esModule ? function () {
                return t.default
            } : function () {
                return t
            };
            return e.d(i, "a", i), i
        }, e.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }, e.p = "", e(e.s = 1)
    }([function (t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {value: !0}), e.on = function (t, e, i) {
            e = e.split(/\s+/);
            for (var n = 0; n < e.length; ++n) t.addEventListener(e[n], i)
        }, e.off = function (t, e, i) {
            e = e.split(/\s+/);
            for (var n = 0; n < e.length; ++n) t.removeEventListener(e[n], i)
        }, e.isFunction = function (t) {
            return "function" == typeof t
        }, e.isDef = function (t) {
            return void 0 !== t
        }, e.getPointerEvent = function (t) {
            return t.touches && t.touches[0] || t
        }
    }, function (t, e, i) {
        "use strict";
        var n = function (t) {
            return t && t.__esModule ? t : {default: t}
        }(i(2));
        t.exports = function (t) {
            return new n.default(t)
        }
    }, function (t, e, i) {
        "use strict";

        function n(t) {
            return t && t.__esModule ? t : {default: t}
        }

        function r(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }

        function o(t, e) {
            if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !e || "object" != typeof e && "function" != typeof e ? t : e
        }

        Object.defineProperty(e, "__esModule", {value: !0});
        var s = function () {
            function t(t, e) {
                for (var i = 0; i < e.length; i++) {
                    var n = e[i];
                    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                }
            }

            return function (e, i, n) {
                return i && t(e.prototype, i), n && t(e, n), e
            }
        }(), a = n(i(3)), c = n(i(4)), l = i(0), h = function (t, e) {
            return t.position - e.position
        }, u = function (t) {
            return t + "-gradient("
        }, f = function (t) {
            function e() {
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                r(this, e);
                var i = o(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
                t = Object.assign({}, t);
                var n = {
                    pfx: "grp",
                    el: ".grp",
                    colorEl: "",
                    min: 0,
                    max: 100,
                    direction: "90deg",
                    type: "linear",
                    height: "30px",
                    width: "100%",
                    emptyColor: "#000",
                    onValuePos: function (t) {
                        return parseInt(t)
                    }
                };
                for (var s in n) s in t || (t[s] = n[s]);
                var a = t.el;
                if (!((a = "string" == typeof a ? document.querySelector(a) : a) instanceof HTMLElement)) throw "Element not found, given " + a;
                return i.el = a, i.handlers = [], i.options = t, i.on("handler:color:change", (function (t, e) {
                    return i.change(e)
                })), i.on("handler:position:change", (function (t, e) {
                    return i.change(e)
                })), i.on("handler:remove", (function (t) {
                    return i.change(1)
                })), i.on("handler:add", (function (t) {
                    return i.change(1)
                })), i.render(), i
            }

            return function (t, e) {
                if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
            }(e, t), s(e, [{
                key: "destroy", value: function () {
                    var t = this;
                    this.clear(), this.e = {}, ["el", "handlers", "options", "colorPicker"].forEach((function (e) {
                        return t[e] = 0
                    })), ["previewEl", "wrapperEl", "sandEl"].forEach((function (e) {
                        var i = t[e];
                        i && i.parentNode && i.parentNode.removeChild(i), delete t[e]
                    }))
                }
            }, {
                key: "setColorPicker", value: function (t) {
                    this.colorPicker = t
                }
            }, {
                key: "getValue", value: function (t, e) {
                    var i = this.getColorValue(), n = t || this.getType(),
                        r = ["top", "left", "bottom", "right", "center"], o = e || this.getDirection();
                    return ["linear", "repeating-linear"].indexOf(n) >= 0 && r.indexOf(o) >= 0 && (o = "center" === o ? "to right" : "to " + o), ["radial", "repeating-radial"].indexOf(n) >= 0 && r.indexOf(o) >= 0 && (o = "circle at " + o), i ? n + "-gradient(" + o + ", " + i + ")" : ""
                }
            }, {
                key: "getSafeValue", value: function (t, e) {
                    var i = this.previewEl, n = this.getValue(t, e);
                    if (!this.sandEl && (this.sandEl = document.createElement("div")), !i || !n) return "";
                    for (var r = this.sandEl.style, o = [n].concat(function (t) {
                        if (Array.isArray(t)) {
                            for (var e = 0, i = Array(t.length); e < t.length; e++) i[e] = t[e];
                            return i
                        }
                        return Array.from(t)
                    }(this.getPrefixedValues(t, e))), s = void 0, a = 0; a < o.length && (s = o[a], r.backgroundImage = s, r.backgroundImage != s); a++) ;
                    return r.backgroundImage
                }
            }, {
                key: "setValue", value: function () {
                    var t = this, e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
                        i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, n = this.type,
                        r = this.direction, o = e.indexOf("(") + 1, s = e.lastIndexOf(")"), a = e.substring(o, s),
                        c = a.split(/,(?![^(]*\)) /);
                    if (this.clear(i), a) {
                        c.length > 2 && (r = c.shift());
                        var l = void 0;
                        ["repeating-linear", "repeating-radial", "linear", "radial"].forEach((function (t) {
                            e.indexOf(u(t)) > -1 && !l && (l = 1, n = t)
                        })), this.setDirection(r, i), this.setType(n, i), c.forEach((function (e) {
                            var n = e.split(" "), r = parseFloat(n.pop()), o = n.join("");
                            t.addHandler(r, o, 0, i)
                        })), this.updatePreview()
                    } else this.updatePreview()
                }
            }, {
                key: "getColorValue", value: function () {
                    var t = this.handlers;
                    return t.sort(h), (t = 1 == t.length ? [t[0], t[0]] : t).map((function (t) {
                        return t.getValue()
                    })).join(", ")
                }
            }, {
                key: "getPrefixedValues", value: function (t, e) {
                    var i = this.getValue(t, e);
                    return ["-moz-", "-webkit-", "-o-", "-ms-"].map((function (t) {
                        return "" + t + i
                    }))
                }
            }, {
                key: "change", value: function () {
                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
                        e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                    this.updatePreview(), !e.silent && this.emit("change", t)
                }
            }, {
                key: "setDirection", value: function (t) {
                    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                    this.options.direction = t;
                    var i = e.complete, n = void 0 === i ? 1 : i;
                    this.change(n, e)
                }
            }, {
                key: "getDirection", value: function () {
                    return this.options.direction
                }
            }, {
                key: "setType", value: function (t) {
                    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                    this.options.type = t;
                    var i = e.complete, n = void 0 === i ? 1 : i;
                    this.change(n, e)
                }
            }, {
                key: "getType", value: function () {
                    return this.options.type
                }
            }, {
                key: "addHandler", value: function (t, e) {
                    var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1,
                        n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
                        r = new c.default(this, t, e, i, n);
                    return !n.silent && this.emit("handler:add", r), r
                }
            }, {
                key: "getHandler", value: function (t) {
                    return this.handlers[t]
                }
            }, {
                key: "getHandlers", value: function () {
                    return this.handlers
                }
            }, {
                key: "clear", value: function () {
                    for (var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, e = this.handlers, i = e.length - 1; i >= 0; i--) e[i].remove(t)
                }
            }, {
                key: "getSelected", value: function () {
                    for (var t = this.getHandlers(), e = 0; e < t.length; e++) {
                        var i = t[e];
                        if (i.isSelected()) return i
                    }
                    return null
                }
            }, {
                key: "updatePreview", value: function () {
                    var t = this.previewEl;
                    t && (t.style.backgroundImage = this.getValue("linear", "to right"))
                }
            }, {
                key: "initEvents", value: function () {
                    var t = this, e = this.previewEl;
                    e && (0, l.on)(e, "click", (function (i) {
                        var n = t.options, r = n.min, o = n.max, s = {w: e.clientWidth, h: e.clientHeight},
                            a = i.offsetX - e.clientLeft, c = i.offsetY - e.clientTop, l = a / s.w * 100;
                        if (!(l > o || l < r || c > s.h || c < 0)) {
                            var h = document.createElement("canvas"), u = h.getContext("2d");
                            h.width = s.w, h.height = s.h;
                            var f = u.createLinearGradient(0, 0, s.w, s.h);
                            t.getHandlers().forEach((function (t) {
                                return f.addColorStop(t.position / 100, t.color)
                            })), u.fillStyle = f, u.fillRect(0, 0, h.width, h.height), h.style.background = "black";
                            var d = h.getContext("2d").getImageData(a, c, 1, 1).data,
                                p = "rgba(" + d[0] + ", " + d[1] + ", " + d[2] + ", " + d[3] + ")",
                                g = "rgba(0, 0, 0, 0)" == p ? n.emptyColor : p;
                            t.addHandler(l, g)
                        }
                    }))
                }
            }, {
                key: "render", value: function () {
                    var t = this.options, e = this.el, i = t.pfx, n = t.height, r = t.width;
                    if (e) {
                        var o = i + "-wrapper", s = i + "-preview";
                        e.innerHTML = '\n      <div class="' + o + '">\n        <div class="' + s + '"></div>\n      </div>\n    ';
                        var a = e.querySelector("." + o), c = e.querySelector("." + s), l = a.style;
                        l.position = "relative", this.wrapperEl = a, this.previewEl = c, n && (l.height = n), r && (l.width = r), this.initEvents(), this.updatePreview()
                    }
                }
            }]), e
        }(a.default);
        e.default = f
    }, function (t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {value: !0});
        var n = function () {
            function t(t, e) {
                for (var i = 0; i < e.length; i++) {
                    var n = e[i];
                    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                }
            }

            return function (e, i, n) {
                return i && t(e.prototype, i), n && t(e, n), e
            }
        }(), r = function () {
            function t() {
                !function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t)
            }

            return n(t, [{
                key: "on", value: function (t, e, i) {
                    var n = this.e || (this.e = {});
                    return (n[t] || (n[t] = [])).push({fn: e, ctx: i}), this
                }
            }, {
                key: "once", value: function (t, e, i) {
                    function n() {
                        r.off(t, n), e.apply(i, arguments)
                    }

                    var r = this;
                    return n._ = e, this.on(t, n, i)
                }
            }, {
                key: "emit", value: function (t) {
                    for (var e = [].slice.call(arguments, 1), i = ((this.e || (this.e = {}))[t] || []).slice(), n = 0, r = i.length; n < r; n++) i[n].fn.apply(i[n].ctx, e);
                    return this
                }
            }, {
                key: "off", value: function (t, e) {
                    var i = this.e || (this.e = {}), n = i[t], r = [];
                    if (n && e) for (var o = 0, s = n.length; o < s; o++) n[o].fn !== e && n[o].fn._ !== e && r.push(n[o]);
                    return r.length ? i[t] = r : delete i[t], this
                }
            }]), t
        }();
        e.default = r
    }, function (t, e, i) {
        "use strict";

        function n(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }

        Object.defineProperty(e, "__esModule", {value: !0});
        var r = function () {
            function t(t, e) {
                for (var i = 0; i < e.length; i++) {
                    var n = e[i];
                    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                }
            }

            return function (e, i, n) {
                return i && t(e.prototype, i), n && t(e, n), e
            }
        }(), o = i(0), s = function () {
            function t(e) {
                var i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
                    r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "black",
                    o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1,
                    s = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {};
                n(this, t), e.getHandlers().push(this), this.gp = e, this.position = i, this.color = r, this.selected = 0, this.render(), o && this.select(s)
            }

            return r(t, [{
                key: "toJSON", value: function () {
                    return {position: this.position, selected: this.selected, color: this.color}
                }
            }, {
                key: "setColor", value: function (t) {
                    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
                    this.color = t, this.emit("handler:color:change", this, e)
                }
            }, {
                key: "setPosition", value: function (t) {
                    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1, i = this.getEl();
                    this.position = t, i && (i.style.left = t + "%"), this.emit("handler:position:change", this, e)
                }
            }, {
                key: "getColor", value: function () {
                    return this.color
                }
            }, {
                key: "getPosition", value: function () {
                    var t = this.position, e = this.gp.options.onValuePos;
                    return (0, o.isFunction)(e) ? e(t) : t
                }
            }, {
                key: "isSelected", value: function () {
                    return !!this.selected
                }
            }, {
                key: "getValue", value: function () {
                    return this.getColor() + " " + this.getPosition() + "%"
                }
            }, {
                key: "select", value: function () {
                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, e = this.getEl(),
                        i = this.gp.getHandlers();
                    !t.keepSelect && i.forEach((function (t) {
                        return t.deselect()
                    })), this.selected = 1;
                    var n = this.getSelectedCls();
                    e && (e.className += " " + n), this.emit("handler:select", this)
                }
            }, {
                key: "deselect", value: function () {
                    var t = this.getEl();
                    this.selected = 0;
                    var e = this.getSelectedCls();
                    t && (t.className = t.className.replace(e, "").trim()), this.emit("handler:deselect", this)
                }
            }, {
                key: "getSelectedCls", value: function () {
                    return this.gp.options.pfx + "-handler-selected"
                }
            }, {
                key: "remove", value: function () {
                    var t = this, e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                        i = this.cpFn, n = this.getEl(), r = this.gp.getHandlers(), s = r.splice(r.indexOf(this), 1)[0];
                    return n && n.parentNode.removeChild(n), !e.silent && this.emit("handler:remove", s), (0, o.isFunction)(i) && i(this), ["el", "gp"].forEach((function (e) {
                        return t[e] = 0
                    })), s
                }
            }, {
                key: "getEl", value: function () {
                    return this.el
                }
            }, {
                key: "initEvents", value: function () {
                    var t = this, e = this.getEl(), i = this.gp.previewEl, n = this.gp.options, r = n.min, s = n.max,
                        a = e.querySelector("[data-toggle=handler-close]"),
                        c = e.querySelector("[data-toggle=handler-color-c]"),
                        l = e.querySelector("[data-toggle=handler-color-wrap]"),
                        h = e.querySelector("[data-toggle=handler-color]"),
                        u = e.querySelector("[data-toggle=handler-drag]"), f = function (e) {
                            var i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1, n = e.target.value;
                            t.setColor(n, i), l && (l.style.backgroundColor = n)
                        };
                    if (c && (0, o.on)(c, "click", (function (t) {
                        return t.stopPropagation()
                    })), a && (0, o.on)(a, "click", (function (e) {
                        e.stopPropagation(), t.remove()
                    })), h && ((0, o.on)(h, "change", f), (0, o.on)(h, "input", (function (t) {
                        return f(t, 0)
                    }))), u) {
                        var d = 0, p = 0, g = 0, v = {}, m = {}, _ = {}, b = function (e) {
                            var i = (0, o.getPointerEvent)(e);
                            g = 1, _.x = i.clientX - m.x, _.y = i.clientY - m.y, d = 100 * _.x, d /= v.w, d = (d = (d = p + d) < r ? r : d) > s ? s : d, t.setPosition(d, 0), t.emit("handler:drag", t, d), (0, o.isDef)(e.button) && 0 === e.which && y(e)
                        }, y = function e(i) {
                            (0, o.off)(document, "touchmove mousemove", b), (0, o.off)(document, "touchend mouseup", e), g && (g = 0, t.setPosition(d), t.emit("handler:drag:end", t, d))
                        };
                        (0, o.on)(u, "touchstart mousedown", (function (e) {
                            if (!(0, o.isDef)(e.button) || 0 === e.button) {
                                t.select();
                                var n = (0, o.getPointerEvent)(e);
                                p = t.position, v.w = i.clientWidth, v.h = i.clientHeight, m.x = n.clientX, m.y = n.clientY, (0, o.on)(document, "touchmove mousemove", b), (0, o.on)(document, "touchend mouseup", y), t.emit("handler:drag:start", t)
                            }
                        })), (0, o.on)(u, "click", (function (t) {
                            return t.stopPropagation()
                        }))
                    }
                }
            }, {
                key: "emit", value: function () {
                    var t;
                    (t = this.gp).emit.apply(t, arguments)
                }
            }, {
                key: "render", value: function () {
                    var t = this.gp, e = t.options, i = t.previewEl, n = t.colorPicker, r = e.pfx, o = e.colorEl,
                        s = this.getColor();
                    if (i) {
                        var a = document.createElement("div"), c = a.style, l = r + "-handler";
                        return a.className = l, a.innerHTML = '\n      <div class="' + l + '-close-c">\n        <div class="' + l + '-close" data-toggle="handler-close">&Cross;</div>\n      </div>\n      <div class="' + l + '-drag" data-toggle="handler-drag"></div>\n      <div class="' + l + '-cp-c" data-toggle="handler-color-c">\n        ' + (o || '\n          <div class="' + l + '-cp-wrap" data-toggle="handler-color-wrap" style="background-color: ' + s + '">\n            <input type="color" data-toggle="handler-color" value="' + s + '">\n          </div>') + "\n      </div>\n    ", c.position = "absolute", c.top = 0, c.left = this.position + "%", i.appendChild(a), this.el = a, this.initEvents(), this.cpFn = n && n(this), a
                    }
                }
            }]), t
        }();
        e.default = s
    }])
})), angular.module("ui.sortable", []).value("uiSortableConfig", {items: "> [ng-repeat],> [data-ng-repeat],> [x-ng-repeat]"}).directive("uiSortable", ["uiSortableConfig", "$timeout", "$log", function (t, e, i) {
    return {
        require: "?ngModel",
        scope: {
            ngModel: "=",
            uiSortable: "=",
            create: "&uiSortableCreate",
            start: "&uiSortableStart",
            activate: "&uiSortableActivate",
            beforeStop: "&uiSortableBeforeStop",
            update: "&uiSortableUpdate",
            remove: "&uiSortableRemove",
            receive: "&uiSortableReceive",
            deactivate: "&uiSortableDeactivate",
            stop: "&uiSortableStop"
        },
        link: function (n, r, o, s) {
            var a, c;

            function l(t, e) {
                var i = "function" == typeof e;
                return "function" == typeof t && i ? function () {
                    t.apply(this, arguments), e.apply(this, arguments)
                } : i ? e : t
            }

            function h(t) {
                var e = t.data("ui-sortable");
                return e && "object" == typeof e && "ui-sortable" === e.widgetFullName ? e : null
            }

            function u(t) {
                t.children().each((function () {
                    var t = angular.element(this);
                    t.width(t.width())
                }))
            }

            function f(t, e) {
                return e
            }

            function d(e, i) {
                return y[e] ? ("stop" === e && (i = l(i, (function () {
                    n.$apply()
                })), i = l(i, v)), i = l(y[e], i)) : x[e] && (i = x[e](i)), i || "items" !== e && "ui-model-items" !== e || (i = t.items), i
            }

            function p(t, e, i) {
                angular.forEach(y, (function (t, e) {
                    e in _ || (_[e] = null)
                }));
                var n, r = null;
                e && angular.forEach(e, (function (e, i) {
                    if (!t || !(i in t)) {
                        if (i in b) return void (_[i] = "ui-floating" === i ? "auto" : d(i, void 0));
                        n || (n = angular.element.ui.sortable().options);
                        var o = n[i];
                        o = d(i, o), r || (r = {}), r[i] = o, _[i] = o
                    }
                }));
                return t = angular.extend({}, t), angular.forEach(t, (function (e, n) {
                    if (n in b) {
                        if ("ui-floating" !== n || !1 !== e && !0 !== e || !i || (i.floating = e), "ui-preserve-size" === n && (!1 === e || !0 === e)) {
                            var r = _.helper;
                            t.helper = function (t, e) {
                                return !0 === _["ui-preserve-size"] && u(e), (r || f).apply(this, arguments)
                            }
                        }
                        _[n] = d(n, e)
                    }
                })), angular.forEach(t, (function (t, e) {
                    e in b || (t = d(e, t), r || (r = {}), r[e] = t, _[e] = t)
                })), r
            }

            function g(t, e) {
                var i = null;
                return function (t, e) {
                    var i = t.sortable("option", "helper");
                    return "clone" === i || "function" == typeof i && e.item.sortable.isCustomHelperUsed()
                }(t, e) && "parent" === t.sortable("option", "appendTo") && (i = c), i
            }

            function v(t, e) {
                e.item.sortable._destroy()
            }

            function m(t) {
                return t.parent().find(_["ui-model-items"]).index(t)
            }

            var _ = {}, b = {"ui-floating": void 0, "ui-model-items": t.items, "ui-preserve-size": void 0}, y = {
                create: null,
                start: null,
                activate: null,
                beforeStop: null,
                update: null,
                remove: null,
                receive: null,
                deactivate: null,
                stop: null
            }, x = {helper: null};

            function w() {
                n.$watchCollection("ngModel", (function () {
                    e((function () {
                        h(r) && r.sortable("refresh")
                    }), 0, !1)
                })), y.start = function (t, e) {
                    if ("auto" === _["ui-floating"]) {
                        var i = e.item.siblings();
                        h(angular.element(t.target)).floating = /left|right/.test((n = i).css("float")) || /inline|table-cell/.test(n.css("display"))
                    }
                    var n, o = m(e.item);
                    e.item.sortable = {
                        model: s.$modelValue[o],
                        index: o,
                        source: r,
                        sourceList: e.item.parent(),
                        sourceModel: s.$modelValue,
                        cancel: function () {
                            e.item.sortable._isCanceled = !0
                        },
                        isCanceled: function () {
                            return e.item.sortable._isCanceled
                        },
                        isCustomHelperUsed: function () {
                            return !!e.item.sortable._isCustomHelperUsed
                        },
                        _isCanceled: !1,
                        _isCustomHelperUsed: e.item.sortable._isCustomHelperUsed,
                        _destroy: function () {
                            angular.forEach(e.item.sortable, (function (t, i) {
                                e.item.sortable[i] = void 0
                            }))
                        },
                        _connectedSortables: [],
                        _getElementContext: function (t) {
                            return function (t, e) {
                                for (var i = 0; i < t.length; i++) {
                                    var n = t[i];
                                    if (n.element[0] === e[0]) return n
                                }
                            }(this._connectedSortables, t)
                        }
                    }
                }, y.activate = function (t, e) {
                    var i = e.item.sortable.source === r, o = i ? e.item.sortable.sourceList : r,
                        s = {element: r, scope: n, isSourceContext: i, savedNodesOrigin: o};
                    e.item.sortable._connectedSortables.push(s), a = o.contents(), c = e.helper;
                    var l = function (t) {
                        var e = t.sortable("option", "placeholder");
                        if (e && e.element && "function" == typeof e.element) {
                            var i = e.element();
                            return angular.element(i)
                        }
                        return null
                    }(r);
                    if (l && l.length) {
                        var h = function (t, e) {
                            var i = _["ui-model-items"].replace(/[^,]*>/g, "");
                            return t.find('[class="' + e.attr("class") + '"]:not(' + i + ")")
                        }(r, l);
                        a = a.not(h)
                    }
                }, y.update = function (t, e) {
                    if (!e.item.sortable.received) {
                        e.item.sortable.dropindex = m(e.item);
                        var i = e.item.parent().closest("[ui-sortable], [data-ui-sortable], [x-ui-sortable]");
                        e.item.sortable.droptarget = i, e.item.sortable.droptargetList = e.item.parent();
                        var o = e.item.sortable._getElementContext(i);
                        e.item.sortable.droptargetModel = o.scope.ngModel, r.sortable("cancel")
                    }
                    var c = !e.item.sortable.received && g(r, e);
                    c && c.length && (a = a.not(c));
                    var l = e.item.sortable._getElementContext(r);
                    a.appendTo(l.savedNodesOrigin), e.item.sortable.received && (a = null), e.item.sortable.received && !e.item.sortable.isCanceled() && (n.$apply((function () {
                        s.$modelValue.splice(e.item.sortable.dropindex, 0, e.item.sortable.moved)
                    })), n.$emit("ui-sortable:moved", e))
                }, y.stop = function (t, e) {
                    var i = "dropindex" in e.item.sortable && !e.item.sortable.isCanceled();
                    if (i && !e.item.sortable.received) n.$apply((function () {
                        s.$modelValue.splice(e.item.sortable.dropindex, 0, s.$modelValue.splice(e.item.sortable.index, 1)[0])
                    })), n.$emit("ui-sortable:moved", e); else if (!i && !angular.equals(r.contents().toArray(), a.toArray())) {
                        var o = g(r, e);
                        o && o.length && (a = a.not(o));
                        var l = e.item.sortable._getElementContext(r);
                        a.appendTo(l.savedNodesOrigin)
                    }
                    a = null, c = null
                }, y.receive = function (t, e) {
                    e.item.sortable.received = !0
                }, y.remove = function (t, e) {
                    "dropindex" in e.item.sortable || (r.sortable("cancel"), e.item.sortable.cancel()), e.item.sortable.isCanceled() || n.$apply((function () {
                        e.item.sortable.moved = s.$modelValue.splice(e.item.sortable.index, 1)[0]
                    }))
                }, angular.forEach(y, (function (t, e) {
                    y[e] = l(y[e], (function () {
                        var t, i = n[e];
                        "function" == typeof i && ("uiSortable" + e.substring(0, 1).toUpperCase() + e.substring(1)).length && "function" == typeof (t = i()) && t.apply(this, arguments)
                    }))
                })), x.helper = function (t) {
                    return t && "function" == typeof t ? function (e, i) {
                        var n = i.sortable, o = m(i);
                        i.sortable = {
                            model: s.$modelValue[o],
                            index: o,
                            source: r,
                            sourceList: i.parent(),
                            sourceModel: s.$modelValue,
                            _restore: function () {
                                angular.forEach(i.sortable, (function (t, e) {
                                    i.sortable[e] = void 0
                                })), i.sortable = n
                            }
                        };
                        var a = t.apply(this, arguments);
                        return i.sortable._restore(), i.sortable._isCustomHelperUsed = i !== a, a
                    } : t
                }, n.$watchCollection("uiSortable", (function (t, e) {
                    var i = h(r);
                    if (i) {
                        var n = p(t, e, i);
                        n && r.sortable("option", n)
                    }
                }), !0), p(_)
            }

            function C() {
                return (!n.uiSortable || !n.uiSortable.disabled) && (s ? w() : i.info("ui.sortable: ngModel not provided!", r), r.sortable(_), C.cancelWatcher(), C.cancelWatcher = angular.noop, !0)
            }

            angular.extend(_, b, t, n.uiSortable), angular.element.fn && angular.element.fn.jquery ? (C.cancelWatcher = angular.noop, C() || (C.cancelWatcher = n.$watch("uiSortable.disabled", C))) : i.error("ui.sortable: jQuery should be included before AngularJS!")
        }
    }
}]), angular.module("ui.sortable.multiselection", []).constant("uiSortableMultiSelectionClass", "ui-sortable-selected").directive("uiSortableSelectable", ["uiSortableMultiSelectionClass", function (t) {
    return {
        link: function (e, i) {
            i.on("click", (function (e) {
                var i = angular.element(this), n = i.parent(), r = n.sortable("option", "multiSelectOnClick") || !1;
                if (!n.sortable("option", "disabled")) {
                    var o = n.sortable("option", "cancel"), s = n.sortable("option", "handle");
                    if (void 0 === o || !i.is(o)) {
                        if (s) {
                            var a = !1;
                            if (n.find(s).find("*").addBack().each((function () {
                                this === e.target && (a = !0)
                            })), !a) return
                        }
                        var c = n.data("uiSortableMultiSelectionState") || {}, l = c.lastIndex, h = i.index();
                        e.ctrlKey || e.metaKey || r ? i.toggleClass(t) : e.shiftKey && void 0 !== l && l >= 0 ? h > l ? n.children().slice(l, h + 1).addClass(t) : h < l && n.children().slice(h, l).addClass(t) : (n.children("." + t).not(i).removeClass(t), i.toggleClass(t)), c.lastIndex = h, n.data("uiSortableMultiSelectionState", c), n.trigger("ui-sortable-selectionschanged")
                    }
                }
            })), i.parent().on("$destroy", (function () {
                i.parent().removeData("uiSortableMultiSelectionState")
            }))
        }
    }
}]).factory("uiSortableMultiSelectionMethods", ["uiSortableMultiSelectionClass", function (t) {
    var e;

    function i(t, e, i) {
        return t < i && (void 0 === e || t < e && i <= e) ? i - 1 : i < t && void 0 !== e && e < t && e <= i ? i + 1 : i
    }

    function n(t, e, n) {
        for (var r = [], o = [], s = 0; s < t.length; s++) {
            var a = t[s];
            a < e ? r.push(i(e, n, a)) : e < a && o.push(i(e, n, a))
        }
        return {above: r, below: o}
    }

    function r(t, e) {
        for (var i = [], n = e.length - 1; n >= 0; n--) i.push(t.splice(e[n], 1)[0]);
        return i.reverse(), i
    }

    function o(t, e, i) {
        return {below: r(t, i), above: r(t, e)}
    }

    function s(t, e) {
        return e && "function" == typeof e ? function () {
            t.apply(this, arguments), e.apply(this, arguments)
        } : t
    }

    return {
        extendOptions: function (t) {
            t = t || {};
            var i = angular.extend({}, this, t);
            for (var n in t) t.hasOwnProperty(n) && this[n] && ("helper" === n ? i.helper = this.helper : i[n] = s(this[n], t[n]));
            return e = i["ui-selection-count"], i
        }, helper: function (i, n) {
            n.hasClass(t) || n.addClass(t).siblings().removeClass(t);
            var r = n.parent().children("." + t), o = n.siblings("." + t), s = angular.element.map(r, (function (t) {
                return angular.element(t).index()
            })), a = angular.element.map(o, (function (t) {
                return angular.element(t).index()
            }));
            n.sortableMultiSelect = {indexes: a, selectedIndexes: s};
            var c = s ? s.length : 0, l = r.clone();
            o.hide();
            var h = n[0].tagName, u = angular.element("<" + h + "/>");
            return e && c > 1 && u.addClass("ui-selection-count").attr("data-ui-selection-count", c), u.append(l)
        }, start: function (t, e) {
            e.item.sortableMultiSelect.sourceElement = e.item.parent();
            for (var i = e.item.sortable.sourceModel, n = e.item.sortableMultiSelect.indexes, r = e.item.sortableMultiSelect.selectedIndexes, o = [], s = [], a = 0, c = r.length; a < c; a++) {
                var l = r[a];
                s.push(i[l]), n.indexOf(l) >= 0 && o.push(i[l])
            }
            e.item.sortableMultiSelect.models = o, e.item.sortableMultiSelect.selectedModels = s
        }, update: function (e, i) {
            if (i.item.sortable.received) if (i.item.sortable.isCanceled()) i.item.sortableMultiSelect.sourceElement.find("> ." + t).show(); else {
                var n = i.item.sortable.droptargetModel, r = i.item.sortable.dropindex,
                    o = i.item.sortableMultiSelect.moved;
                Array.prototype.splice.apply(n, [r + 1, 0].concat(o.below)), Array.prototype.splice.apply(n, [r, 0].concat(o.above))
            }
        }, remove: function (e, i) {
            if (i.item.sortable.isCanceled()) i.item.sortableMultiSelect.sourceElement.find("> ." + t).show(); else {
                var r = i.item.sortable.sourceModel, s = i.item.sortable.index,
                    a = n(i.item.sortableMultiSelect.indexes, s);
                i.item.sortableMultiSelect.moved = o(r, a.above, a.below)
            }
        }, stop: function (e, i) {
            var r = i.item.sortableMultiSelect.sourceElement || i.item.parent();
            if (i.item.sortable.received || i.item.sortable.isCanceled()) i.item.sortable.isCanceled() && r.find("> ." + t).show(); else {
                var s = i.item.sortable.sourceModel, a = i.item.sortable.index, c = i.item.sortable.dropindex,
                    l = i.item.sortableMultiSelect.indexes;
                if (!l.length) return void i.item.removeClass("" + t);
                void 0 === c && (c = a);
                var h = n(l, a, c), u = s[c], f = o(s, h.above, h.below);
                Array.prototype.splice.apply(s, [s.indexOf(u) + 1, 0].concat(f.below)), Array.prototype.splice.apply(s, [s.indexOf(u), 0].concat(f.above)), i.item.parent().find("> ." + t).removeClass("" + t).show()
            }
        }
    }
}]);