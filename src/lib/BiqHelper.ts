import {Injectable} from '@angular/core';
import {interval} from 'rxjs';
import BiqHelperString from './modules/BiqHelperString';
import BiqHelperJson from './modules/BiqHelperJson';
import BiqHelperMoment from './modules/BiqHelperMoment';

// import $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class BiqHelper {

  string: BiqHelperString;
  JSON: BiqHelperJson;
  moment: BiqHelperMoment;

  constructor() {
    this.string = new BiqHelperString(this);
    this.JSON = new BiqHelperJson(this);
    this.moment = new BiqHelperMoment(this);
  }

  isNull(val) {
    let jsonIsEmpty = false;

    if (typeof val === 'object' && !Array.isArray(val)) {
      try {
        jsonIsEmpty = Object.keys(val).length === 0 && val.constructor === Object;
      } catch (e) {
      }
    }

    try {
      return typeof val === 'undefined' || (typeof val === 'string' && val.trim() === '') || val === null || (typeof val !== 'function' && val.length === 0) || jsonIsEmpty;
    } catch (e) {
      return true;
    }

  }

  isNullSome(...args) {
    let isNull = false;
    for (let i = 0; i < args.length; i++) {
      if (this.isNull(args[i])) {
        isNull = true;
        break;
      }
    }

    return isNull;
  }

  isNullAll(...args) {
    let isNull = true;
    for (let i = 0; i < args.length; i++) {
      if (!this.isNull(args[i])) {
        isNull = false;
        break;
      }
    }

    return isNull;
  }

  untillNotNull(pObj) {
    const limitDefault = 1000;
    let params = {
      valFn: null, // Value which got by returning Function ( Pass by reference ). Instead primitive value ( Pass by value )
      callback: null,
      callback_params: null,
      interval: 100,
      limit: limitDefault
    };

    params = pObj; // Pass by reference not using Object.assign
    if (!params.hasOwnProperty('limit')) {
      params.limit = limitDefault;
    }

    const interval$ = interval(params.interval);
    let repeat = 0;
    const intervalSubscribe = interval$.subscribe(() => {
      if (!this.isNull(params.valFn()) || repeat === params.limit) {
        params.callback(params.callback_params);
        intervalSubscribe.unsubscribe();
      }
      repeat++;
    });

  }

  assignDefault<T>(val: any, def = null): T {
    val = !this.isNull(val) ? val : def;
    return val;
  }

  browserDetect(uaStr) {
    let browser = 'Unknown';

    try {
      const ua = uaStr.match(/(opera|chrome|safari|firefox|msie|postmanruntime)\/?\s*(\.?\d+(\.\d+)*)/i);

      if (navigator.userAgent.match(/Edge/i) || navigator.userAgent.match(/Trident.*rv[ :]*11\./i)) {
        browser = 'msie';
      } else {
        browser = ua[1];
      }
    } catch (e) {
      console.error(`There was error when detecting browser: ${e.message}`);
      console.warn(`User-Agent: : ${uaStr}`);
    }

    return browser;
  }

  urlParamsGet(sParam) {
    const sPageURL = decodeURIComponent(window.location.search.substring(1));
    const sURLVariables = sPageURL.split('&');
    let sParameterName;
    let i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  }

  httpResponseIsError(key) {
    if (this.isNull(key)) {
      return false;
    }

    key = this.string.toInt(key);
    return key >= 400 && key < 600;
  }

  httpResponseIsSuccess(key) {
    if (this.isNull(key)) {
      return false;
    }

    key = this.string.toInt(key);
    return key >= 200 && key < 300;
  }

  numberFormat(input, prefix = '', opt = {}) {
    const params = {thousand_separator: '.', split_last_thousand: false};

    Object.assign(params, opt);

    input = this.isNull(input) ? 0 : input;

    const inputStrArr = input.toString().split('.');

    let ret: any = prefix + inputStrArr[0].replace(/\B(?=(\d{3})+(?!\d))/g, params.thousand_separator);

    if (params.split_last_thousand === true) {
      const lastThousandPos = ret.search(/(?:.(?!\d{3}))+$/);
      const lastThousand = ret.substring(lastThousandPos, ret.length);

      ret = [
        ret.replace(/(?:.(?!\d{3}))+$/, ''),
        lastThousand
      ];
    }

    const decimalSeparator = params.thousand_separator === '.' ? ',' : '.';

    if (inputStrArr.length === 2) {
      ret = ret + decimalSeparator + inputStrArr[1];
    }

    return ret;
  }

  dataURIToBlob(dataURI) {
    dataURI = dataURI.replace(/^data:/, '');

    const type = dataURI.match(/image\/[^;]+/);
    const base64 = dataURI.replace(/^[^,]+,/, '');
    const arrayBuffer = new ArrayBuffer(base64.length);
    const typedArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < base64.length; i++) {
      typedArray[i] = base64.charCodeAt(i);
    }

    return new Blob([arrayBuffer], {type});
  }

  objectIs(x, y) {
    // SameValue algorithm
    if (x === y) { // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      // eslint-disable-next-line
      return x !== x && y !== y;
    }
  }

  passwordTest(pObj) {
    const ret = {
      has_number: {value: false, label: 'Angka'},
      has_lower_case: {value: false, label: 'Huruf Kecil'},
      has_upper_case: {value: false, label: 'Huruf Besar'},
      has_special_char: {value: false, label: 'Karakter'},
      is_valid_min_length: {value: false, label: 'Minimal 8 karakter'}
    };

    const params = {
      val: '',
      min_length: 8
    };

    Object.assign(params, pObj);

    const password = params.val;

    ret.has_number.value = /\d/.test(password);
    ret.has_lower_case.value = /[a-z]/.test(password);
    ret.has_upper_case.value = /[A-Z]/.test(password);
    // eslint-disable-next-line
    ret.has_special_char.value = /[~!@#\$%\^&\*_\-\+=`\|\(\)\{\}\[\]:;"'<>,\.\?\/\\]/.test(password);
    ret.is_valid_min_length.value = password.length >= params.min_length;
    ret.is_valid_min_length.label = `Minimal ${params.min_length} karakter`;

    return ret;

  }

  arrayGen(number) {

    const ret = [];

    for (let i = 0; i < number; i++) {
      ret.push(i);
    }

    return ret;

  }

  urlIsValid(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i
      .test(value);
  }

  routeEncodeLower( categoryName ) {
    return encodeURIComponent(categoryName.replace(/ /g, '-').toLowerCase());
  }

  routeDecodeLower( categoryName ) {
    return decodeURIComponent(categoryName).replace(/-/g, ' ');
  }

  bitSizeConversion(str): {
    B: number;
    KB: number;
    MB: number;
  } {

    const ret = {
      B: 0,
      KB: 0,
      MB: 0
    };

    const sizeValue: number = this.string.toFloat(
      str.toLowerCase().replace(/[a-z]/g, '')
    );
    const sizeUnit: string = str.toLowerCase().replace(/[0-9.]/g, '');

    switch (sizeUnit) {
      case 'b':
        ret.B = sizeValue;
        ret.KB = sizeValue / 1000;
        ret.MB = sizeValue / 1000000;
        break;

      case 'kb':
        ret.B = sizeValue * 1000;
        ret.KB = sizeValue;
        ret.MB = sizeValue / 1000;
        break;

      case 'mb':
        ret.B = sizeValue * 1000000;
        ret.KB = sizeValue * 1000;
        ret.MB = sizeValue;
        break;
    }

    return ret;

  } // bitSizeConversion()

  fileNameExtension(filename) {
    return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
  }

} // class BiqHelper

export const biqHelper = new BiqHelper();
