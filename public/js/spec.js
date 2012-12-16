var root = this;

root.context = root.describe;
root.xcontext = root.xdescribe;

/*
jasmine-fixture 1.0.5
Makes injecting HTML snippets into the DOM easy & clean!
site: https://github.com/searls/jasmine-fixture
*/


(function() {
  var createHTMLBlock;

  (function($) {
    var jasmineFixture, originalAffix, originalInject, originalJasmineFixture, root, _;
    root = this;
    originalJasmineFixture = root.jasmineFixture;
    originalInject = root.inject;
    originalAffix = root.affix;
    _ = function(list) {
      return {
        inject: function(iterator, memo) {
          var item, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = list.length; _i < _len; _i++) {
            item = list[_i];
            _results.push(memo = iterator(memo, item));
          }
          return _results;
        }
      };
    };
    root.jasmineFixture = function($) {
      var $whatsTheRootOf, applyAttributes, defaultConfiguration, defaults, init, injectContents, isReady, isString, itLooksLikeHtml, rootId, tidyUp;
      $.fn.affix = root.affix = function(selectorOptions) {
        var $top;
        $top = null;
        _(selectorOptions.split(/[ ](?=[^\]]*?(?:\[|$))/)).inject(function($parent, elementSelector) {
          var $el;
          if (elementSelector === ">") {
            return $parent;
          }
          $el = createHTMLBlock($, elementSelector).appendTo($parent);
          $top || ($top = $el);
          return $el;
        }, $whatsTheRootOf(this));
        return $top;
      };
      $whatsTheRootOf = function(that) {
        if (that.jquery != null) {
          return that;
        } else if ($('#jasmine_content').length > 0) {
          return $('#jasmine_content');
        } else {
          return $('<div id="jasmine_content"></div>').appendTo('body');
        }
      };
      afterEach(function() {
        return $('#jasmine_content').remove();
      });
      isReady = false;
      rootId = "specContainer";
      defaultConfiguration = {
        el: "div",
        cssClass: "",
        id: "",
        text: "",
        html: "",
        defaultAttribute: "class",
        attrs: {}
      };
      defaults = $.extend({}, defaultConfiguration);
      $.jasmine = {
        inject: function(arg, context) {
          var $toInject, config, parent;
          if (isReady !== true) {
            init();
          }
          parent = (context ? context : $("#" + rootId));
          $toInject = void 0;
          if (itLooksLikeHtml(arg)) {
            $toInject = $(arg);
          } else {
            config = $.extend({}, defaults, arg, {
              userString: arg
            });
            $toInject = $("<" + config.el + "></" + config.el + ">");
            applyAttributes($toInject, config);
            injectContents($toInject, config);
          }
          return $toInject.appendTo(parent);
        },
        configure: function(config) {
          return $.extend(defaults, config);
        },
        restoreDefaults: function() {
          return defaults = $.extend({}, defaultConfiguration);
        },
        noConflict: function() {
          root.jasmineFixture = originalJasmineFixture;
          root.inject = originalInject;
          root.affix = originalAffix;
          return this;
        }
      };
      $.fn.inject = function(html) {
        return $.jasmine.inject(html, $(this));
      };
      applyAttributes = function($html, config) {
        var attrs, key, _results;
        attrs = $.extend({}, {
          id: config.id,
          "class": config["class"] || config.cssClass
        }, config.attrs);
        if (isString(config.userString)) {
          attrs[config.defaultAttribute] = config.userString;
        }
        _results = [];
        for (key in attrs) {
          if (attrs[key]) {
            _results.push($html.attr(key, attrs[key]));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      injectContents = function($el, config) {
        if (config.text && config.html) {
          throw "Error: because they conflict, you may only configure inject() to set `html` or `text`, not both! \n\nHTML was: " + config.html + " \n\n Text was: " + config.text;
        } else if (config.text) {
          return $el.text(config.text);
        } else {
          if (config.html) {
            return $el.html(config.html);
          }
        }
      };
      itLooksLikeHtml = function(arg) {
        return isString(arg) && arg.indexOf("<") !== -1;
      };
      isString = function(arg) {
        return arg && arg.constructor === String;
      };
      init = function() {
        $("body").append("<div id=\"" + rootId + "\"></div>");
        return isReady = true;
      };
      tidyUp = function() {
        $("#" + rootId).remove();
        return isReady = false;
      };
      $(function($) {
        return init();
      });
      afterEach(function() {
        return tidyUp();
      });
      return $.jasmine;
    };
    if ($) {
      jasmineFixture = root.jasmineFixture($);
      return root.inject = root.inject || jasmineFixture.inject;
    }
  })(window.jQuery);

  createHTMLBlock = (function() {
    var bindData, bindEvents, parseAttributes, parseClasses, parseContents, parseEnclosure, parseReferences, parseVariableScope, regAttr, regAttrDfn, regAttrs, regCBrace, regClass, regClasses, regData, regDatas, regEvent, regEvents, regExclamation, regId, regReference, regTag, regTagNotContent, regZenTagDfn;
    createHTMLBlock = function($, ZenObject, data, functions, indexes) {
      var ZenCode, arr, block, blockAttrs, blockClasses, blockHTML, blockId, blockTag, blocks, el, el2, els, forScope, indexName, inner, len, obj, origZenCode, paren, result, ret, zc, zo;
      if ($.isPlainObject(ZenObject)) {
        ZenCode = ZenObject.main;
      } else {
        ZenCode = ZenObject;
        ZenObject = {
          main: ZenCode
        };
      }
      origZenCode = ZenCode;
      if (indexes === undefined) {
        indexes = {};
      }
      if (ZenCode.charAt(0) === "!" || $.isArray(data)) {
        if ($.isArray(data)) {
          forScope = ZenCode;
        } else {
          obj = parseEnclosure(ZenCode, "!");
          obj = obj.substring(obj.indexOf(":") + 1, obj.length - 1);
          forScope = parseVariableScope(ZenCode);
        }
        while (forScope.charAt(0) === "@") {
          forScope = parseVariableScope("!for:!" + parseReferences(forScope, ZenObject));
        }
        zo = ZenObject;
        zo.main = forScope;
        el = $();
        if (ZenCode.substring(0, 5) === "!for:" || $.isArray(data)) {
          if (!$.isArray(data) && obj.indexOf(":") > 0) {
            indexName = obj.substring(0, obj.indexOf(":"));
            obj = obj.substr(obj.indexOf(":") + 1);
          }
          arr = ($.isArray(data) ? data : data[obj]);
          zc = zo.main;
          if ($.isArray(arr) || $.isPlainObject(arr)) {
            $.map(arr, function(value, index) {
              var next;
              zo.main = zc;
              if (indexName !== undefined) {
                indexes[indexName] = index;
              }
              if (!$.isPlainObject(value)) {
                value = {
                  value: value
                };
              }
              next = createHTMLBlock($, zo, value, functions, indexes);
              if (el.length !== 0) {
                return $.each(next, function(index, value) {
                  return el.push(value);
                });
              }
            });
          }
          if (!$.isArray(data)) {
            ZenCode = ZenCode.substr(obj.length + 6 + forScope.length);
          } else {
            ZenCode = "";
          }
        } else if (ZenCode.substring(0, 4) === "!if:") {
          result = parseContents("!" + obj + "!", data, indexes);
          if (result !== "undefined" || result !== "false" || result !== "") {
            el = createHTMLBlock($, zo, data, functions, indexes);
          }
          ZenCode = ZenCode.substr(obj.length + 5 + forScope.length);
        }
        ZenObject.main = ZenCode;
      } else if (ZenCode.charAt(0) === "(") {
        paren = parseEnclosure(ZenCode, "(", ")");
        inner = paren.substring(1, paren.length - 1);
        ZenCode = ZenCode.substr(paren.length);
        zo = ZenObject;
        zo.main = inner;
        el = createHTMLBlock($, zo, data, functions, indexes);
      } else {
        blocks = ZenCode.match(regZenTagDfn);
        block = blocks[0];
        if (block.length === 0) {
          return "";
        }
        if (block.indexOf("@") >= 0) {
          ZenCode = parseReferences(ZenCode, ZenObject);
          zo = ZenObject;
          zo.main = ZenCode;
          return createHTMLBlock($, zo, data, functions, indexes);
        }
        block = parseContents(block, data, indexes);
        blockClasses = parseClasses($, block);
        if (regId.test(block)) {
          blockId = regId.exec(block)[1];
        }
        blockAttrs = parseAttributes(block, data);
        blockTag = (block.charAt(0) === "{" ? "span" : "div");
        if (ZenCode.charAt(0) !== "#" && ZenCode.charAt(0) !== "." && ZenCode.charAt(0) !== "{") {
          blockTag = regTag.exec(block)[1];
        }
        if (block.search(regCBrace) !== -1) {
          blockHTML = block.match(regCBrace)[1];
        }
        blockAttrs = $.extend(blockAttrs, {
          id: blockId,
          "class": blockClasses,
          html: blockHTML
        });
        el = $("<" + blockTag + ">", blockAttrs);
        el.attr(blockAttrs);
        el = bindEvents(block, el, functions);
        el = bindData(block, el, data);
        ZenCode = ZenCode.substr(blocks[0].length);
        ZenObject.main = ZenCode;
      }
      if (ZenCode.length > 0) {
        if (ZenCode.charAt(0) === ">") {
          if (ZenCode.charAt(1) === "(") {
            zc = parseEnclosure(ZenCode.substr(1), "(", ")");
            ZenCode = ZenCode.substr(zc.length + 1);
          } else if (ZenCode.charAt(1) === "!") {
            obj = parseEnclosure(ZenCode.substr(1), "!");
            forScope = parseVariableScope(ZenCode.substr(1));
            zc = obj + forScope;
            ZenCode = ZenCode.substr(zc.length + 1);
          } else {
            len = Math.max(ZenCode.indexOf("+"), ZenCode.length);
            zc = ZenCode.substring(1, len);
            ZenCode = ZenCode.substr(len);
          }
          zo = ZenObject;
          zo.main = zc;
          els = $(createHTMLBlock($, zo, data, functions, indexes));
          els.appendTo(el);
        }
        if (ZenCode.charAt(0) === "+") {
          zo = ZenObject;
          zo.main = ZenCode.substr(1);
          el2 = createHTMLBlock($, zo, data, functions, indexes);
          $.each(el2, function(index, value) {
            return el.push(value);
          });
        }
      }
      ret = el;
      return ret;
    };
    bindData = function(ZenCode, el, data) {
      var datas, i, split;
      if (ZenCode.search(regDatas) === 0) {
        return el;
      }
      datas = ZenCode.match(regDatas);
      if (datas === null) {
        return el;
      }
      i = 0;
      while (i < datas.length) {
        split = regData.exec(datas[i]);
        if (split[3] === undefined) {
          $(el).data(split[1], data[split[1]]);
        } else {
          $(el).data(split[1], data[split[3]]);
        }
        i++;
      }
      return el;
    };
    bindEvents = function(ZenCode, el, functions) {
      var bindings, fn, i, split;
      if (ZenCode.search(regEvents) === 0) {
        return el;
      }
      bindings = ZenCode.match(regEvents);
      if (bindings === null) {
        return el;
      }
      i = 0;
      while (i < bindings.length) {
        split = regEvent.exec(bindings[i]);
        if (split[2] === undefined) {
          fn = functions[split[1]];
        } else {
          fn = functions[split[2]];
        }
        $(el).bind(split[1], fn);
        i++;
      }
      return el;
    };
    parseAttributes = function(ZenBlock, data) {
      var attrStrs, attrs, i, parts;
      if (ZenBlock.search(regAttrDfn) === -1) {
        return undefined;
      }
      attrStrs = ZenBlock.match(regAttrDfn);
      attrs = {};
      i = 0;
      while (i < attrStrs.length) {
        parts = regAttr.exec(attrStrs[i]);
        attrs[parts[1]] = "";
        if (parts[3] !== undefined) {
          attrs[parts[1]] = parseContents(parts[3], data);
        }
        i++;
      }
      return attrs;
    };
    parseClasses = function($, ZenBlock) {
      var classes, clsString, i;
      ZenBlock = ZenBlock.match(regTagNotContent)[0];
      if (ZenBlock.search(regClasses) === -1) {
        return undefined;
      }
      classes = ZenBlock.match(regClasses);
      clsString = "";
      i = 0;
      while (i < classes.length) {
        clsString += " " + regClass.exec(classes[i])[1];
        i++;
      }
      return $.trim(clsString);
    };
    parseContents = function(ZenBlock, data, indexes) {
      var html;
      if (indexes === undefined) {
        indexes = {};
      }
      html = ZenBlock;
      if (data === undefined) {
        return html;
      }
      while (regExclamation.test(html)) {
        html = html.replace(regExclamation, function(str, str2) {
          var begChar, fn, val;
          begChar = "";
          if (str.indexOf("!for:") > 0 || str.indexOf("!if:") > 0) {
            return str;
          }
          if (str.charAt(0) !== "!") {
            begChar = str.charAt(0);
            str = str.substring(2, str.length - 1);
          }
          fn = new Function("data", "indexes", "var r=undefined;" + "with(data){try{r=" + str + ";}catch(e){}}" + "with(indexes){try{if(r===undefined)r=" + str + ";}catch(e){}}" + "return r;");
          val = unescape(fn(data, indexes));
          return begChar + val;
        });
      }
      html = html.replace(/\\./g, function(str) {
        return str.charAt(1);
      });
      return unescape(html);
    };
    parseEnclosure = function(ZenCode, open, close, count) {
      var index, ret;
      if (close === undefined) {
        close = open;
      }
      index = 1;
      if (count === undefined) {
        count = (ZenCode.charAt(0) === open ? 1 : 0);
      }
      if (count === 0) {
        return;
      }
      while (count > 0 && index < ZenCode.length) {
        if (ZenCode.charAt(index) === close && ZenCode.charAt(index - 1) !== "\\") {
          count--;
        } else {
          if (ZenCode.charAt(index) === open && ZenCode.charAt(index - 1) !== "\\") {
            count++;
          }
        }
        index++;
      }
      ret = ZenCode.substring(0, index);
      return ret;
    };
    parseReferences = function(ZenCode, ZenObject) {
      ZenCode = ZenCode.replace(regReference, function(str) {
        var fn;
        str = str.substr(1);
        fn = new Function("objs", "var r=\"\";" + "with(objs){try{" + "r=" + str + ";" + "}catch(e){}}" + "return r;");
        return fn(ZenObject, parseReferences);
      });
      return ZenCode;
    };
    parseVariableScope = function(ZenCode) {
      var forCode, rest, tag;
      if (ZenCode.substring(0, 5) !== "!for:" && ZenCode.substring(0, 4) !== "!if:") {
        return undefined;
      }
      forCode = parseEnclosure(ZenCode, "!");
      ZenCode = ZenCode.substr(forCode.length);
      if (ZenCode.charAt(0) === "(") {
        return parseEnclosure(ZenCode, "(", ")");
      }
      tag = ZenCode.match(regZenTagDfn)[0];
      ZenCode = ZenCode.substr(tag.length);
      if (ZenCode.length === 0 || ZenCode.charAt(0) === "+") {
        return tag;
      } else if (ZenCode.charAt(0) === ">") {
        rest = "";
        rest = parseEnclosure(ZenCode.substr(1), "(", ")", 1);
        return tag + ">" + rest;
      }
      return undefined;
    };
    regZenTagDfn = /([#\.\@]?[\w-]+|\[([\w-!?=:"']+(="([^"]|\\")+")? {0,})+\]|\~[\w$]+=[\w$]+|&[\w$]+(=[\w$]+)?|[#\.\@]?!([^!]|\\!)+!){0,}(\{([^\}]|\\\})+\})?/i;
    regTag = /(\w+)/i;
    regId = /#([\w-!]+)/i;
    regTagNotContent = /((([#\.]?[\w-]+)?(\[([\w!]+(="([^"]|\\")+")? {0,})+\])?)+)/i;
    regClasses = /(\.[\w-]+)/g;
    regClass = /\.([\w-]+)/i;
    regReference = /(@[\w$_][\w$_\d]+)/i;
    regAttrDfn = /(\[([\w-!]+(="?([^"]|\\")+"?)? {0,})+\])/ig;
    regAttrs = /([\w-!]+(="([^"]|\\")+")?)/g;
    regAttr = /([\w-!]+)(="?(([^"\]]|\\")+)"?)?/i;
    regCBrace = /\{(([^\}]|\\\})+)\}/i;
    regExclamation = /(?:([^\\]|^))!([^!]|\\!)+!/g;
    regEvents = /\~[\w$]+(=[\w$]+)?/g;
    regEvent = /\~([\w$]+)=([\w$]+)/i;
    regDatas = /&[\w$]+(=[\w$]+)?/g;
    regData = /&([\w$]+)(=([\w$]+))?/i;
    return createHTMLBlock;
  })();

}).call(this);


/*
jasmine-given 0.0.7
Adds a Given-When-Then DSL to jasmine as an alternative style for specs
site: https://github.com/searls/jasmine-given
*/


(function() {

  (function(jasmine) {
    var mostRecentlyUsed, o, root, stringifyExpectation;
    stringifyExpectation = function(expectation) {
      var matches;
      matches = expectation.toString().replace(/\n/g, '').match(/function\s?\(\)\s?{\s*(return\s+)?(.*?)(;)?\s*}/i);
      if (matches && matches.length >= 3) {
        return matches[2];
      } else {
        return "";
      }
    };
    beforeEach(function() {
      return this.addMatchers({
        toHaveReturnedFalseFromThen: function(context, n) {
          var exception, result;
          result = false;
          exception = void 0;
          try {
            result = this.actual.call(context);
          } catch (e) {
            exception = e;
          }
          this.message = function() {
            var msg;
            msg = "Then clause " + (n > 1 ? " #" + n : "") + " `" + (stringifyExpectation(this.actual)) + "` failed by ";
            if (exception) {
              msg += "throwing: " + exception.toString();
            } else {
              msg += "returning false";
            }
            return msg;
          };
          return result === false;
        }
      });
    });
    root = this;
    root.When = root.Given = function() {
      var assignResultTo, mostRecentlyUsed, setupFunction;
      setupFunction = o(arguments).firstThat(function(arg) {
        return o(arg).isFunction();
      });
      assignResultTo = o(arguments).firstThat(function(arg) {
        return o(arg).isString();
      });
      mostRecentlyUsed = root.Given;
      return beforeEach(function() {
        var context, result;
        context = jasmine.getEnv().currentSpec;
        result = setupFunction.call(context);
        if (assignResultTo) {
          if (!context[assignResultTo]) {
            return context[assignResultTo] = result;
          } else {
            throw new Error("Unfortunately, the variable '" + assignResultTo + "' is already assigned to: " + context[assignResultTo]);
          }
        }
      });
    };
    root.Then = function(expectationFunction) {
      var expectations, mostRecentlyUsed, subsequentThen;
      mostRecentlyUsed = root.Then;
      expectations = [expectationFunction];
      subsequentThen = function(additionalExpectation) {
        expectations.push(additionalExpectation);
        return this;
      };
      it("then " + (stringifyExpectation(expectations)), function() {
        var i, _results;
        i = 0;
        _results = [];
        while (i < expectations.length) {
          expect(expectations[i]).not.toHaveReturnedFalseFromThen(jasmine.getEnv().currentSpec, i + 1);
          _results.push(i++);
        }
        return _results;
      });
      return {
        Then: subsequentThen,
        And: subsequentThen
      };
    };
    mostRecentlyUsed = root.Given;
    root.And = function() {
      return mostRecentlyUsed.apply(this, jasmine.util.argsToArray(arguments));
    };
    return o = function(thing) {
      return {
        isFunction: function() {
          return Object.prototype.toString.call(thing) === "[object Function]";
        },
        isString: function() {
          return Object.prototype.toString.call(thing) === "[object String]";
        },
        firstThat: function(test) {
          var i;
          i = 0;
          while (i < thing.length) {
            if (test(thing[i]) === true) {
              return thing[i];
            }
            i++;
          }
          return void 0;
        }
      };
    };
  })(jasmine);

}).call(this);

// Generated by CoffeeScript 1.3.3

/*
jasmine-stealth 0.0.12
Makes Jasmine spies a bit more robust
site: https://github.com/searls/jasmine-stealth
*/


(function() {
  var Captor, fake, root, unfakes, whatToDoWhenTheSpyGetsCalled, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  root = this;

  _ = function(obj) {
    return {
      each: function(iterator) {
        var item, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = obj.length; _i < _len; _i++) {
          item = obj[_i];
          _results.push(iterator(item));
        }
        return _results;
      },
      isFunction: function() {
        return Object.prototype.toString.call(obj) === "[object Function]";
      },
      isString: function() {
        return Object.prototype.toString.call(obj) === "[object String]";
      }
    };
  };

  root.spyOnConstructor = function(owner, classToFake, methodsToSpy) {
    var fakeClass, spies;
    if (methodsToSpy == null) {
      methodsToSpy = [];
    }
    if (_(methodsToSpy).isString()) {
      methodsToSpy = [methodsToSpy];
    }
    spies = {
      constructor: jasmine.createSpy("" + classToFake + "'s constructor")
    };
    fakeClass = (function() {

      function _Class() {
        spies.constructor.apply(this, arguments);
      }

      return _Class;

    })();
    _(methodsToSpy).each(function(methodName) {
      spies[methodName] = jasmine.createSpy("" + classToFake + "#" + methodName);
      return fakeClass.prototype[methodName] = function() {
        return spies[methodName].apply(this, arguments);
      };
    });
    fake(owner, classToFake, fakeClass);
    return spies;
  };

  unfakes = [];

  afterEach(function() {
    _(unfakes).each(function(u) {
      return u();
    });
    return unfakes = [];
  });

  fake = function(owner, thingToFake, newThing) {
    var originalThing;
    originalThing = owner[thingToFake];
    owner[thingToFake] = newThing;
    return unfakes.push(function() {
      return owner[thingToFake] = originalThing;
    });
  };

  root.stubFor = root.spyOn;

  jasmine.createStub = jasmine.createSpy;

  jasmine.createStubObj = function(baseName, stubbings) {
    var name, obj, stubbing;
    if (stubbings.constructor === Array) {
      return jasmine.createSpyObj(baseName, stubbings);
    } else {
      obj = {};
      for (name in stubbings) {
        stubbing = stubbings[name];
        obj[name] = jasmine.createSpy(baseName + "." + name);
        if (_(stubbing).isFunction()) {
          obj[name].andCallFake(stubbing);
        } else {
          obj[name].andReturn(stubbing);
        }
      }
      return obj;
    }
  };

  whatToDoWhenTheSpyGetsCalled = function(spy) {
    var matchesStub, priorStubbing;
    matchesStub = function(stubbing, args, context) {
      switch (stubbing.type) {
        case "args":
          return jasmine.getEnv().equals_(stubbing.ifThis, jasmine.util.argsToArray(args));
        case "context":
          return jasmine.getEnv().equals_(stubbing.ifThis, context);
      }
    };
    priorStubbing = spy.plan();
    return spy.andCallFake(function() {
      var i, stubbing;
      i = 0;
      while (i < spy._stealth_stubbings.length) {
        stubbing = spy._stealth_stubbings[i];
        if (matchesStub(stubbing, arguments, this)) {
          if (Object.prototype.toString.call(stubbing.thenThat) === "[object Function]") {
            return stubbing.thenThat();
          } else {
            return stubbing.thenThat;
          }
        }
        i++;
      }
      return priorStubbing;
    });
  };

  jasmine.Spy.prototype.whenContext = function(context) {
    var addStubbing, spy;
    spy = this;
    spy._stealth_stubbings || (spy._stealth_stubbings = []);
    whatToDoWhenTheSpyGetsCalled(spy);
    addStubbing = function(thenThat) {
      spy._stealth_stubbings.push({
        type: 'context',
        ifThis: context,
        thenThat: thenThat
      });
      return spy;
    };
    return {
      thenReturn: addStubbing,
      thenCallFake: addStubbing
    };
  };

  jasmine.Spy.prototype.when = function() {
    var addStubbing, ifThis, spy;
    spy = this;
    ifThis = jasmine.util.argsToArray(arguments);
    spy._stealth_stubbings || (spy._stealth_stubbings = []);
    whatToDoWhenTheSpyGetsCalled(spy);
    addStubbing = function(thenThat) {
      spy._stealth_stubbings.push({
        type: 'args',
        ifThis: ifThis,
        thenThat: thenThat
      });
      return spy;
    };
    return {
      thenReturn: addStubbing,
      thenCallFake: addStubbing
    };
  };

  jasmine.Spy.prototype.mostRecentCallThat = function(callThat, context) {
    var i;
    i = this.calls.length - 1;
    while (i >= 0) {
      if (callThat.call(context || this, this.calls[i]) === true) {
        return this.calls[i];
      }
      i--;
    }
  };

  jasmine.Matchers.ArgThat = (function(_super) {

    __extends(ArgThat, _super);

    function ArgThat(matcher) {
      this.matcher = matcher;
    }

    ArgThat.prototype.jasmineMatches = function(actual) {
      return this.matcher(actual);
    };

    return ArgThat;

  })(jasmine.Matchers.Any);

  jasmine.Matchers.ArgThat.prototype.matches = jasmine.Matchers.ArgThat.prototype.jasmineMatches;

  jasmine.argThat = function(expected) {
    return new jasmine.Matchers.ArgThat(expected);
  };

  jasmine.Matchers.Capture = (function(_super) {

    __extends(Capture, _super);

    function Capture(captor) {
      this.captor = captor;
    }

    Capture.prototype.jasmineMatches = function(actual) {
      this.captor.value = actual;
      return true;
    };

    return Capture;

  })(jasmine.Matchers.Any);

  jasmine.Matchers.Capture.prototype.matches = jasmine.Matchers.Capture.prototype.jasmineMatches;

  Captor = (function() {

    function Captor() {}

    Captor.prototype.capture = function() {
      return new jasmine.Matchers.Capture(this);
    };

    return Captor;

  })();

  jasmine.captor = function() {
    return new Captor();
  };

}).call(this);

(function() {

  describe(".helloText", function() {
    When(function() {
      return this.result = helloText();
    });
    return Then(function() {
      return expect(this.result).toEqual("Hello, World!");
    });
  });

}).call(this);
