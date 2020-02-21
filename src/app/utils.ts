import _ from 'underscore';
import * as moment from 'moment';
import { Time } from './sao/time';
import { Observable } from 'rxjs';
import { SDate } from './sao/date';
import { I18n } from './services/i18n';
import { SDateTime } from './sao/datetime';
import { Locker, DRIVERS } from 'angular-safeguard';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { DownloadDialogComponent } from './components/dialogs/download/download.dialog.component';
import { SelectionDialogComponent } from './components/dialogs/selection/selection.dialog.component';

const compare = (arr1: any[], arr2: any[]): boolean => {
    if (arr1.length != arr2.length) {
        return false;
    }
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
            if (!compare(arr1[i], arr2[i])) {
                return false;
            }
        } else if (arr1[i] != arr2[i]) {
            return false;
        }
    }
    return true;
};

const contains = (array1: any[], array2: any[]): boolean => {
    for (var i = 0; i < array1.length; i++) {
        if (compare(array1[i], array2)) {
            return true;
        }
    }
    return false;
};

// Find the intersection of two arrays.
// The arrays must be sorted.
const intersect = (a: any[], b: any[]): any[] => {
    var ai = 0, bi = 0;
    var result = [];
    while (ai < a.length && bi < b.length) {
        if (a[ai] < b[bi]) {
            ai++;
        } else if (a[ai] > b[bi]) {
            bi++;
        } else {
            result.push(a[ai]);
            ai++;
            bi++;
        }
    }
    return result;
};

const product = (array: any[], repeat: number): any[][] => {
    repeat = repeat || 1;
    var pools = [];
    var i = 0;
    while (i < repeat) {
        pools = pools.concat(array);
        i++;
    }
    var result = [[]];
    pools.map((pool: any) => {
        var tmp = [];
        result.map((x: any[]) => {
            pool.map((y: any) => {
                tmp.push(x.concat([y]));
            });
        });
        result = tmp;
    });
    return result;
};

const moment_format = (format: string): string => {
    return format
        .replace('%a', 'ddd')
        .replace('%A', 'dddd')
        .replace('%w', 'd')
        .replace('%d', 'DD')
        .replace('%b', 'MMM')
        .replace('%B', 'MMMM')
        .replace('%m', 'MM')
        .replace('%y', 'YY')
        .replace('%Y', 'YYYY')
        .replace('%H', 'HH')
        .replace('%I', 'hh')
        .replace('%p', 'A')
        .replace('%M', 'mm')
        .replace('%S', 'ss')
        .replace('%f', 'SSS')
        .replace('%z', 'ZZ')
        .replace('%Z', 'zz')
        .replace('%j', 'DDDD')
        .replace('%U', 'ww')
        .replace('%W', 'WW')
        .replace('%c', 'llll')
        .replace('%x', 'L')
        .replace('%X', 'LTS')
        .replace('%', '%%');
};

const date_format = (format: string, locker: Locker): string => {
    if (_.isEmpty(format)) {
        format = '%Y-%m-%d';
        if (locker.get(DRIVERS.LOCAL, 'user')) {
            var context = locker.get(DRIVERS.LOCAL, 'user');
            if (context.locale && context.locale.date) {
                format = context.locale.date;
            }
        }
    }
    return moment_format(format);
};

const format_time = (format: string, date: moment.Moment): string => {
    if (!date) {
        return '';
    }
    return date.format(moment_format(format));
};

const parse_time = (format: string, value: string): moment.Moment => {
    if (_.isEmpty(value)) {
        return null;
    }
    var getNumber = (pattern: string) => {
        var i = format.indexOf(pattern);
        if (~i) {
            var number = Number.parseInt(value.slice(i, i + pattern.length), 10);
            if (!Number.isNaN(number)) {
                return number;
            }
        }
        return 0;
    };
    return Time.init(getNumber('%H'), getNumber('%M'), getNumber('%S'), getNumber('%f'));
};

const format_date = (date_format: string, date: moment.Moment) => {
    if (!date) {
        return '';
    }
    return date.format(moment_format(date_format));
}

const parse_date = (date_format: string, value: string): moment.Moment => {
    var date = moment(value, moment_format(date_format));
    if (date.isValid()) {
        date = SDate.init(date.year(), date.month(), date.date());
    } else {
        date = null;
    }
    return date;
}

const format_datetime = (date_format: string, time_format: string, date: moment.Moment): string => {
    if (!date) {
        return '';
    }
    return date.format(moment_format(date_format + ' ' + time_format));
}

const parse_datetime = (date_format: string, time_format: string, value): moment.Moment => {
    var date = moment(value, moment_format(date_format + ' ' + time_format));
    if (date.isValid()) {
        date = SDateTime.init(date.year(), date.month(), date.date(), date.hour(), date.minute(), date.second(), date.millisecond());
    } else {
        date = null;
    }
    return date;
}

const download_file = (data: any, name: string, service: NbDialogService, i18n: I18n) => {
    var type = guess_mimetype(name ? name.split('.').pop() : undefined);
    var blob = new Blob([data], {type: type});

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, name);
        return;
    }

    var dialog: NbDialogRef<DownloadDialogComponent>;

    const cancel = () => {
        dialog.close();
    };

    const download = () => {
        window.open(blob_url, '_blank');
        dialog.close();
    }

    var blob_url = window.URL.createObjectURL(blob);

    dialog = service.open(DownloadDialogComponent, {
        closeOnEsc: true,
        context: {
            text: 'Do you want to download ' + name + '?',
            download: i18n.getText('Download', null),
            cancel: i18n.getText('Cancel', null),
            downloadOnClick: download,
            cancelOnClick: cancel
        }
    });
};

const guess_mimetype = (filename: string) => {
    if (/.*odt$/.test(filename)) {
        return 'application/vnd.oasis.opendocument.text';
    } else if (/.*ods$/.test(filename)) {
        return 'application/vnd.oasis.opendocument.spreadsheet';
    } else if (/.*pdf$/.test(filename)) {
        return 'application/pdf';
    } else if (/.*docx$/.test(filename)) {
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (/.*doc/.test(filename)) {
        return 'application/msword';
    } else if (/.*xlsx$/.test(filename)) {
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if (/.*xls/.test(filename)) {
        return 'application/vnd.ms-excel';
    } else {
        return 'application/octet-binary';
    }
};

const selection = (title: string, values: any, i18n: I18n, service: NbDialogService, alwaysask?: boolean): Observable<any>  => {
    if (alwaysask === undefined) {
        alwaysask = false;
    }

    if (_.isEmpty(values)) {
        return;
    }

    var keys = Object.keys(values).sort();
    if ((keys.length == 1) && (!alwaysask)) {
        var key = keys[0];
        return;
    }

    var dialog: NbDialogRef<SelectionDialogComponent>;

    const cancel = () => {
        dialog.close();
    };

    const ok = () => {
        dialog.close();
    }

    var context = {
        title: title || i18n.getText('Your selection:', null),
        text: 'Select one action?',
        keys,
        ok: i18n.getText('OK', null),
        cancel: i18n.getText('Cancel', ''),
        okOnClick: ok,
        cancelOnClick: cancel,
        selected: null
    };

    dialog = service.open(SelectionDialogComponent, {
        closeOnEsc: true,
        context: context
    });

    return Observable.create((observer) => {
        observer.next(keys[context.selected]);
        observer.complete();
    });
};

const forEachKeyInKeypath = (obj: any, keypath: string, callback: (obj: any, key: string, escape?: boolean) => any) => {
  if (!typeof keypath === 'string') {
    return undefined;
  }

  var key = ""
    , i
    , escape = false;

  for (i = 0; i < keypath.length; ++i) {
    switch (keypath[i]) {
      case '.':
        if (escape) {
          escape = false;
          key += '.';
        } else {
          obj = callback(obj, key, false);
          key = "";
        }
        break;

      case '\\':
        if (escape) {
          escape = false;
          key += '\\';
        } else {
          escape = true;
        }
        break;

      default:
        escape = false;
        key += keypath[i];
        break;
    }
  }

  return callback(obj, key, true);
};

const getDeepObjectValue = (obj: any, keypath: string) => {
  if (obj === Object(obj)) {
    return undefined;
  }

  return forEachKeyInKeypath(obj, keypath, (obj: any, key: string) => {
    if (obj === Object(obj)) {
      return obj[key];
    }
  });
}

const validate = (obj: any, constraints: any): any => {
    let validation: any = {};
    
    return validation;
}

export {
	compare,
    contains,
    intersect,
    product,
    moment_format,
    date_format,
    format_time,
    parse_time,
    parse_date,
    format_datetime,
    parse_datetime,
    download_file,
    guess_mimetype,
    selection,
    getDeepObjectValue
};
