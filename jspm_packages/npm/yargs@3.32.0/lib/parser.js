/* */ 
(function(process) {
  var camelCase = require('camelcase');
  var path = require('path');
  function increment(orig) {
    return orig !== undefined ? orig + 1 : 0;
  }
  module.exports = function(args, opts, y18n) {
    if (!opts)
      opts = {};
    var __ = y18n.__;
    var error = null;
    var flags = {
      arrays: {},
      bools: {},
      strings: {},
      counts: {},
      normalize: {},
      configs: {},
      defaulted: {}
    };
    ;
    [].concat(opts['array']).filter(Boolean).forEach(function(key) {
      flags.arrays[key] = true;
    });
    ;
    [].concat(opts['boolean']).filter(Boolean).forEach(function(key) {
      flags.bools[key] = true;
    });
    ;
    [].concat(opts.string).filter(Boolean).forEach(function(key) {
      flags.strings[key] = true;
    });
    ;
    [].concat(opts.count).filter(Boolean).forEach(function(key) {
      flags.counts[key] = true;
    });
    ;
    [].concat(opts.normalize).filter(Boolean).forEach(function(key) {
      flags.normalize[key] = true;
    });
    Object.keys(opts.config).forEach(function(k) {
      flags.configs[k] = opts.config[k];
    });
    var aliases = {};
    var newAliases = {};
    extendAliases(opts.key);
    extendAliases(opts.alias);
    extendAliases(opts.default);
    var defaults = opts['default'] || {};
    Object.keys(defaults).forEach(function(key) {
      if (/-/.test(key) && !opts.alias[key]) {
        aliases[key] = aliases[key] || [];
      }
      (aliases[key] || []).forEach(function(alias) {
        defaults[alias] = defaults[key];
      });
    });
    var argv = {_: []};
    Object.keys(flags.bools).forEach(function(key) {
      setArg(key, !(key in defaults) ? false : defaults[key]);
      setDefaulted(key);
    });
    var notFlags = [];
    if (args.indexOf('--') !== -1) {
      notFlags = args.slice(args.indexOf('--') + 1);
      args = args.slice(0, args.indexOf('--'));
    }
    for (var i = 0; i < args.length; i++) {
      var arg = args[i];
      var broken;
      var key;
      var letters;
      var m;
      var next;
      var value;
      if (arg.match(/^--.+=/)) {
        m = arg.match(/^--([^=]+)=([\s\S]*)$/);
        if (checkAllAliases(m[1], opts.narg)) {
          args.splice(i + 1, m[1], m[2]);
          i = eatNargs(i, m[1], args);
        } else if (checkAllAliases(m[1], flags.arrays) && args.length > i + 1) {
          args.splice(i + 1, m[1], m[2]);
          i = eatArray(i, m[1], args);
        } else {
          setArg(m[1], m[2]);
        }
      } else if (arg.match(/^--no-.+/)) {
        key = arg.match(/^--no-(.+)/)[1];
        setArg(key, false);
      } else if (arg.match(/^--.+/)) {
        key = arg.match(/^--(.+)/)[1];
        if (checkAllAliases(key, opts.narg)) {
          i = eatNargs(i, key, args);
        } else if (checkAllAliases(key, flags.arrays) && args.length > i + 1) {
          i = eatArray(i, key, args);
        } else {
          next = args[i + 1];
          if (next !== undefined && !next.match(/^-/) && !checkAllAliases(key, flags.bools) && !checkAllAliases(key, flags.counts)) {
            setArg(key, next);
            i++;
          } else if (/^(true|false)$/.test(next)) {
            setArg(key, next);
            i++;
          } else {
            setArg(key, defaultForType(guessType(key, flags)));
          }
        }
      } else if (arg.match(/^-.\..+=/)) {
        m = arg.match(/^-([^=]+)=([\s\S]*)$/);
        setArg(m[1], m[2]);
      } else if (arg.match(/^-.\..+/)) {
        next = args[i + 1];
        key = arg.match(/^-(.\..+)/)[1];
        if (next !== undefined && !next.match(/^-/) && !checkAllAliases(key, flags.bools) && !checkAllAliases(key, flags.counts)) {
          setArg(key, next);
          i++;
        } else {
          setArg(key, defaultForType(guessType(key, flags)));
        }
      } else if (arg.match(/^-[^-]+/)) {
        letters = arg.slice(1, -1).split('');
        broken = false;
        for (var j = 0; j < letters.length; j++) {
          next = arg.slice(j + 2);
          if (letters[j + 1] && letters[j + 1] === '=') {
            value = arg.slice(j + 3);
            key = letters[j];
            if (checkAllAliases(letters[j], opts.narg)) {
              args.splice(i + 1, 0, value);
              i = eatNargs(i, key, args);
            } else if (checkAllAliases(key, flags.arrays) && args.length > i + 1) {
              args.splice(i + 1, 0, value);
              i = eatArray(i, key, args);
            } else {
              setArg(key, value);
            }
            broken = true;
            break;
          }
          if (next === '-') {
            setArg(letters[j], next);
            continue;
          }
          if (/[A-Za-z]/.test(letters[j]) && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
            setArg(letters[j], next);
            broken = true;
            break;
          }
          if (letters[j + 1] && letters[j + 1].match(/\W/)) {
            setArg(letters[j], arg.slice(j + 2));
            broken = true;
            break;
          } else {
            setArg(letters[j], defaultForType(guessType(letters[j], flags)));
          }
        }
        key = arg.slice(-1)[0];
        if (!broken && key !== '-') {
          if (checkAllAliases(key, opts.narg)) {
            i = eatNargs(i, key, args);
          } else if (checkAllAliases(key, flags.arrays) && args.length > i + 1) {
            i = eatArray(i, key, args);
          } else {
            if (args[i + 1] && !/^(-|--)[^-]/.test(args[i + 1]) && !checkAllAliases(key, flags.bools) && !checkAllAliases(key, flags.counts)) {
              setArg(key, args[i + 1]);
              i++;
            } else if (args[i + 1] && /true|false/.test(args[i + 1])) {
              setArg(key, args[i + 1]);
              i++;
            } else {
              setArg(key, defaultForType(guessType(key, flags)));
            }
          }
        }
      } else {
        argv._.push(flags.strings['_'] || !isNumber(arg) ? arg : Number(arg));
      }
    }
    applyEnvVars(opts, argv, true);
    setConfig(argv);
    applyEnvVars(opts, argv, false);
    applyDefaultsAndAliases(argv, aliases, defaults);
    Object.keys(flags.counts).forEach(function(key) {
      setArg(key, defaults[key]);
    });
    notFlags.forEach(function(key) {
      argv._.push(key);
    });
    function eatNargs(i, key, args) {
      var toEat = checkAllAliases(key, opts.narg);
      if (args.length - (i + 1) < toEat)
        error = Error(__('Not enough arguments following: %s', key));
      for (var ii = i + 1; ii < (toEat + i + 1); ii++) {
        setArg(key, args[ii]);
      }
      return (i + toEat);
    }
    function eatArray(i, key, args) {
      for (var ii = i + 1; ii < args.length; ii++) {
        if (/^-/.test(args[ii]))
          break;
        i = ii;
        setArg(key, args[ii]);
      }
      return i;
    }
    function setArg(key, val) {
      unsetDefaulted(key);
      if (checkAllAliases(key, flags.bools) || checkAllAliases(key, flags.counts)) {
        if (typeof val === 'string')
          val = val === 'true';
      }
      if (/-/.test(key) && !(aliases[key] && aliases[key].length)) {
        var c = camelCase(key);
        aliases[key] = [c];
        newAliases[c] = true;
      }
      var value = !checkAllAliases(key, flags.strings) && isNumber(val) ? Number(val) : val;
      if (checkAllAliases(key, flags.counts)) {
        value = increment;
      }
      var splitKey = key.split('.');
      setKey(argv, splitKey, value);
      if (~key.indexOf('.') && aliases[key]) {
        aliases[key].forEach(function(x) {
          x = x.split('.');
          setKey(argv, x, value);
        });
      }
      ;
      (aliases[splitKey[0]] || []).forEach(function(x) {
        x = x.split('.');
        if (splitKey.length > 1) {
          var a = [].concat(splitKey);
          a.shift();
          x = x.concat(a);
        }
        setKey(argv, x, value);
      });
      var keys = [key].concat(aliases[key] || []);
      for (var i = 0,
          l = keys.length; i < l; i++) {
        if (flags.normalize[keys[i]]) {
          keys.forEach(function(key) {
            argv.__defineSetter__(key, function(v) {
              val = path.normalize(v);
            });
            argv.__defineGetter__(key, function() {
              return typeof val === 'string' ? path.normalize(val) : val;
            });
          });
          break;
        }
      }
    }
    function setConfig(argv) {
      var configLookup = {};
      applyDefaultsAndAliases(configLookup, aliases, defaults);
      Object.keys(flags.configs).forEach(function(configKey) {
        var configPath = argv[configKey] || configLookup[configKey];
        if (configPath) {
          try {
            var config = null;
            var resolvedConfigPath = path.resolve(process.cwd(), configPath);
            if (typeof flags.configs[configKey] === 'function') {
              try {
                config = flags.configs[configKey](resolvedConfigPath);
              } catch (e) {
                config = e;
              }
              if (config instanceof Error) {
                error = config;
                return;
              }
            } else {
              config = require(resolvedConfigPath);
            }
            Object.keys(config).forEach(function(key) {
              if (argv[key] === undefined || (flags.defaulted[key])) {
                delete argv[key];
                setArg(key, config[key]);
              }
            });
          } catch (ex) {
            if (argv[configKey])
              error = Error(__('Invalid JSON config file: %s', configPath));
          }
        }
      });
    }
    function applyEnvVars(opts, argv, configOnly) {
      if (typeof opts.envPrefix === 'undefined')
        return;
      var prefix = typeof opts.envPrefix === 'string' ? opts.envPrefix : '';
      Object.keys(process.env).forEach(function(envVar) {
        if (prefix === '' || envVar.lastIndexOf(prefix, 0) === 0) {
          var key = camelCase(envVar.substring(prefix.length));
          if (((configOnly && flags.configs[key]) || !configOnly) && (!(key in argv) || flags.defaulted[key])) {
            setArg(key, process.env[envVar]);
          }
        }
      });
    }
    function applyDefaultsAndAliases(obj, aliases, defaults) {
      Object.keys(defaults).forEach(function(key) {
        if (!hasKey(obj, key.split('.'))) {
          setKey(obj, key.split('.'), defaults[key]);
          ;
          (aliases[key] || []).forEach(function(x) {
            if (hasKey(obj, x.split('.')))
              return;
            setKey(obj, x.split('.'), defaults[key]);
          });
        }
      });
    }
    function hasKey(obj, keys) {
      var o = obj;
      keys.slice(0, -1).forEach(function(key) {
        o = (o[key] || {});
      });
      var key = keys[keys.length - 1];
      if (typeof o !== 'object')
        return false;
      else
        return key in o;
    }
    function setKey(obj, keys, value) {
      var o = obj;
      keys.slice(0, -1).forEach(function(key) {
        if (o[key] === undefined)
          o[key] = {};
        o = o[key];
      });
      var key = keys[keys.length - 1];
      if (value === increment) {
        o[key] = increment(o[key]);
      } else if (o[key] === undefined && checkAllAliases(key, flags.arrays)) {
        o[key] = Array.isArray(value) ? value : [value];
      } else if (o[key] === undefined || typeof o[key] === 'boolean') {
        o[key] = value;
      } else if (Array.isArray(o[key])) {
        o[key].push(value);
      } else {
        o[key] = [o[key], value];
      }
    }
    function extendAliases(obj) {
      Object.keys(obj || {}).forEach(function(key) {
        if (aliases[key])
          return;
        aliases[key] = [].concat(opts.alias[key] || []);
        aliases[key].concat(key).forEach(function(x) {
          if (/-/.test(x)) {
            var c = camelCase(x);
            aliases[key].push(c);
            newAliases[c] = true;
          }
        });
        aliases[key].forEach(function(x) {
          aliases[x] = [key].concat(aliases[key].filter(function(y) {
            return x !== y;
          }));
        });
      });
    }
    function checkAllAliases(key, flag) {
      var isSet = false;
      var toCheck = [].concat(aliases[key] || [], key);
      toCheck.forEach(function(key) {
        if (flag[key])
          isSet = flag[key];
      });
      return isSet;
    }
    function setDefaulted(key) {
      [].concat(aliases[key] || [], key).forEach(function(k) {
        flags.defaulted[k] = true;
      });
    }
    function unsetDefaulted(key) {
      [].concat(aliases[key] || [], key).forEach(function(k) {
        delete flags.defaulted[k];
      });
    }
    function defaultForType(type) {
      var def = {
        boolean: true,
        string: '',
        array: []
      };
      return def[type];
    }
    function guessType(key, flags) {
      var type = 'boolean';
      if (flags.strings && flags.strings[key])
        type = 'string';
      else if (flags.arrays && flags.arrays[key])
        type = 'array';
      return type;
    }
    function isNumber(x) {
      if (typeof x === 'number')
        return true;
      if (/^0x[0-9a-f]+$/i.test(x))
        return true;
      return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
    }
    return {
      argv: argv,
      aliases: aliases,
      error: error,
      newAliases: newAliases
    };
  };
})(require('process'));