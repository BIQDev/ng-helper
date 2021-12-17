export default class BiqHelperString {

  _rootRef = null;

  constructor(_rootRef) {
    this._rootRef = _rootRef;
  }

  capitalize(input) {
    const str = this._rootRef.isNull(input) ? '' : input;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  toInt(str) {
    try {
      return typeof str === 'string' ? parseInt(str, 10) : str;
    } catch (e) {
      return 0;
    }
  }

  toFloat(str) {
    try {
      return typeof str === 'string' ? parseFloat(str) : str;
    } catch (e) {
      return 0;
    }
  }

}
