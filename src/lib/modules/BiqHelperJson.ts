export default class BiqHelperJson {

  _rootRef = null;

  constructor(_rootRef) {
    this._rootRef = _rootRef;
  }

  parse(val) {
    let ret = {};

    if (!this._rootRef.isNull(val)) {

      switch (typeof val) {

        case 'object':
          ret = Object.assign({}, val);
          break;

        case 'string':
          try {
            ret = JSON.parse(val);
          } catch (e) {
            console.error(e.message);
          }
          break;
        default:
          ret = {};

      }

    }

    return ret;

  } // parse()

  pathIsNull(jsonObj, jsonPath) {
    if (arguments.length < 2) {
      console.error('biqHelper.JSONPathIsNull() : Parameter is invalid');
      return;
    }

    const jsonPathSplit = jsonPath.split('.');

    let pathValid = true;

    let curPath = Object.assign({}, jsonObj);
    if (this._rootRef.isNull(curPath)) {
      return true;
    }

    for (let i = 0; i < jsonPathSplit.length; i++) {

      if (this._rootRef.isNull(curPath)) {
        return true;
      }

      if (curPath.hasOwnProperty(jsonPathSplit[i])) {
        curPath = curPath[jsonPathSplit[i]];
      } else {
        pathValid = false;
        break;
      }
    }

    return !pathValid;

  }

  pathValueGet(jsonObj, jsonPath, nullDefault?) {
    if (arguments.length < 2) {
      console.error('biqHelper.JSONPathIsNull() : Parameter is invalid');
      return;
    }

    if (this.pathIsNull(jsonObj, jsonPath) && typeof nullDefault !== 'undefined') {
      return nullDefault;
    } else if (this.pathIsNull(jsonObj, jsonPath)) {
      return null;
    }

    const jsonPathSplit = jsonPath.split('.');

    let curPath = Object.assign({}, jsonObj);

    for (let i = 0; i < jsonPathSplit.length; i++) {
      if (curPath.hasOwnProperty(jsonPathSplit[i])) {
        curPath = curPath[jsonPathSplit[i]];
      }
    }

    if (this._rootRef.isNull(curPath) && typeof nullDefault !== 'undefined') {
      curPath = nullDefault;
    }

    return curPath;

  }

  pathValueGetMulti() {
    if (arguments.length < 2) {
      console.error('biqHelper.JSONPathIsNull() : Parameter is invalid');
      return;
    }

    const jsonObj = arguments[0]; // JSON object
    const jsonPathArr = arguments[1]; // Array of String of json key ( not path / 1 level depth ) eg: [key1, key2, key3]

    const ret = {};

    for (let i = 0; i < jsonPathArr.length; i++) {
      ret[jsonPathArr[i]] = this.pathValueGet(jsonObj, jsonPathArr[i]);
    }

    return ret;

  }

  isEqualShallow(a, b) {
    let ret = true;
    try {
      for (const key in a) {
        if (a[key] !== b[key]) {
          ret = false;
        }
      }

      for (const key in b) {
        if (b[key] !== a[key]) {
          ret = false;
        }
      }

    } catch (e) {
      console.error(e.message);
      ret = false;
    }
    return ret;
  }

  tryParseJSONObject(jsonString: string, arrayIfEmpty:boolean = true) : Array<any> | Object {
    try {
      var o = JSON.parse(jsonString);
      if (o && typeof o === "object") {
        return o;
      }
    }
    catch (e) {
      return arrayIfEmpty ? [] : {};
    }

    return arrayIfEmpty ? [] : {};
  }

}
