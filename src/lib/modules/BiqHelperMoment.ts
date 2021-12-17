import * as moment_ from 'moment';

const moment = moment_;

export default class BiqHelperMoment {

  _rootRef = null;

  constructor(_rootRef) {
    this._rootRef = _rootRef;
  }

  /**
   * Get day relative to current day, i.e: "Kemarin", "Hari ini"
   * @param p_obj Parameter {date_target, date_current}
   * @returns Return string
   */
  getDayRelative(pObj) {
    let ret = '';
    const params = {
      date_target: null, // Moment date of target to compare
      date_current: null // Moment date of current day
    };

    Object.assign(params, pObj);

    if (this._rootRef.isNull(params.date_target) || this._rootRef.isNull(params.date_current)) {
      return ret;
    }

    const dateYesterday = moment(params.date_current).subtract(1, 'days');

    if (params.date_current.isSame(params.date_target, 'day')) {
      ret = 'Hari ini';
    } else if (params.date_target.isSame(dateYesterday, 'day')) {
      ret = 'Kemarin';
    } else {
      ret = params.date_target.format('dddd');
    }

    return ret;
  }

  /**
   * Get moment() object relative to server date
   */
  now() {
    return moment();
  }


  countDown(pObj) {

    const params = {
      current_dt: moment().valueOf(), // UNIX TIME STAMP
      compared_dt: moment().add(0.1, 'minutes').valueOf(), // UNIX TIME STAMP
      interval: 1000,
      callback_update: null,
      callback_done: null
    };

    Object.assign(params, pObj);

    const timeDiff = params.compared_dt - params.current_dt;
    let duration: any = moment.duration(timeDiff);

    if (timeDiff <= 0) {
      return;
    }

    const interval = setInterval(() => {

      duration = moment.duration(duration - params.interval, 'milliseconds');


      if (typeof params.callback_update === 'function') {
        params.callback_update(duration);
      }

      if (duration.days() === 0 && duration.hours() === 0 && duration.minutes() === 0 && duration.seconds() === 0 && duration.milliseconds() <= 0) {
        clearInterval(interval);
        if (typeof params.callback_done === 'function') {
          params.callback_done();
        }
      }

    }, params.interval);

    return {
      stop
    };

    function stop() {
      clearInterval(interval);
    }

  } // countDown()

}
