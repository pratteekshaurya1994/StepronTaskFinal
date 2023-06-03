import {Dimensions, Linking, Platform, Share} from 'react-native';
import * as ToastAlert from './ToastService';
import {Colors} from '../constants';
import Moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import {
	CameraOptions,
	ImageLibraryOptions,
	launchCamera,
	launchImageLibrary,
} from 'react-native-image-picker';
import moment from 'moment';
import queryString from 'query-string';


const options = {
	title: 'photoUpload',
	takePhotoButtonTitle: 'photoTake',
	chooseFromLibraryButtonTitle: 'photoLibrary',
	cancelButtonTitle: 'cancel',
	quality: 0.7,
	base64: true,
	maxWidth: 728,
};


export const CONTACTUS_PHONE_NUMBER = '+18187221230';
const parseQueryString = (q: string): any => {
	return queryString.parseUrl(q);
};

const isIOS = () => {
	return Platform.OS === 'ios';
};
const isAndroid = () => {
	return Platform.OS === 'android';
};
const isMaterialDesignWorks = () => {
	// @ts-ignore
	return Platform.OS === 'android' && Platform.Version > 21;
};
const getElevationStyle = (
	elevation: number,
	shadowColor: string = Colors.shadowColor,
): any => {
	return {
		elevation,
		shadowColor,
		shadowOffset: {width: 0, height: 0.5 * elevation},
		shadowOpacity: 0.3,
		shadowRadius: 0.8 * elevation,
	};
};

const getWidth = (screen: 'screen' | 'window' = 'screen') => {
	return Dimensions.get(screen).width;
};
const getHeight = (screen: 'screen' | 'window' = 'screen') => {
	return Dimensions.get(screen).height;
};

const getAuthHeader = (token: string) => {
	return {Authorization: 'Bearer ' + token};
};
const parseTime = (sec_num: number) => {
	let hours: any = Math.floor(sec_num / 3600);
	let minutes: any = Math.floor((sec_num - hours * 3600) / 60);
	let seconds: any = Math.floor(sec_num - hours * 3600 - minutes * 60);

	if (hours < 10) {
		hours = '0' + hours;
	}
	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	if (seconds < 10) {
		seconds = '0' + seconds;
	}
	return {hours, minutes, seconds};
};
const secondsToHHMMSS = (sec_num: number) => {
	// MM:SS
	const {hours, minutes, seconds} = parseTime(sec_num);
	return hours + ':' + minutes + ':' + seconds;
};
const secondsToMMSS = (sec_num: number) => {
	// MM:SS
	const {minutes, seconds} = parseTime(sec_num);
	return minutes + ':' + seconds;
};
const numberFormatter = (num: number, digits: number = 1) => {
	const si = [
		{value: 1, symbol: ''},
		{value: 1e3, symbol: 'k'},
		{value: 1e6, symbol: 'M'},
		{value: 1e9, symbol: 'G'},
		{value: 1e12, symbol: 'T'},
		{value: 1e15, symbol: 'P'},
		{value: 1e18, symbol: 'E'},
	];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	let i;
	for (i = si.length - 1; i > 0; i--) {
		if (num >= si[i].value) {
			break;
		}
	}

	return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
};
const namePrivacy = (name: string, show: boolean) => {
	if (name === '') {
		return '-';
	} else if (show) {
		return name;
	} else {
		const nameBits = name.split(' ');
		if (nameBits.length > 1) {
			return '**** ' + nameBits.pop();
		} else {
			return '****' + name.slice(name.length - 4);
		}
	}
};
const numberToCommas = (num: number) => {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
const getFormDataFromJSON = (json: any): FormData => {
	const payload = new FormData();
	for (const key in json) {
		if (json.hasOwnProperty(key)) {
			payload.append(key, json[key]);
		}
	}
	return payload;
};
const handleErrors = (err: any, setErrors: (errs: any) => void) => {
	if (err.errors) {
		if (Object.keys(err.errors).length > 0) {
			for (const key in err.errors) {
				if (err.errors.hasOwnProperty(key)) {
					setErrors((errs: any) => {
						const newErrors = {...errs};
						newErrors[key] = err.errors[key][0];
						return newErrors;
					});
				}
			}
		} else {
			ToastAlert.show(err.error || 'Oops... Something went wrong!');
		}
	} else {
		ToastAlert.show(err.error || 'Oops... Something went wrong!');
	}
};

const getColorScheme = () => {
	let colorScheme: 'light-content' | 'dark-content' = 'dark-content';
	// if (ENV.colorScheme === 'dark') {
	//     colorScheme = 'light-content'
	// }
	return colorScheme;
};

const tConvert = (time: any) => {
	// Check correct time format and split into components
	time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
		time,
	];

	if (time.length > 1) {
		// If time format correct
		time = time.slice(1); // Remove full string match value
		time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
		time[0] = +time[0] % 12 || 12; // Adjust hours
	}
	return time.join(''); // return adjusted time or original string
};

const openDocumentPicker = (types: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    DocumentPicker.pick({
      type: types,
      allowMultiSelection: false,
    })
      .then(resp => {
        if (resp && resp.length > 0) {
          const fileAsset = resp[0];
          const file = {
            uri: isAndroid()
              ? fileAsset.uri || ''
              : (fileAsset.uri || '').replace('file://', ''),
            type: fileAsset.type || '',
            name: fileAsset.name || 'image.jpg',
            size: fileAsset.size || 0,
          };
          console.log(fileAsset, 'size of the photo');
          // FileViewer.open(resp.uri);
          if (fileAsset.size && fileAsset.size <= 8000000) {
            resolve(file);
          } else {
            reject({
              didCancel: false,
              err: 'size of image should be less than 8MB',
            });
          }
        } else {
          reject({
            didCancel: false,
            err: 'Asset not selected',
          });
        }
      })
      .catch(err => {
        if (DocumentPicker.isCancel(err)) {
          reject({didCancel: true, err: 'User cancelled image picker'});
        } else if (err.errorCode) {
          console.log(err.errorMessage, 'Image Picker Error');
          reject({didCancel: false, err: err.errorCode});
        }
      });
  });
};

const openMedia = (
  options: ImageLibraryOptions | CameraOptions = {mediaType: 'photo'},
  mode: 'camera' | 'picker' = 'picker',
): Promise<any> => {
  const baseOptions: ImageLibraryOptions | CameraOptions = {
    mediaType: 'photo',
    maxHeight: 1024,
    selectionLimit: 1,
    maxWidth: 1024,
  };
  options = {...baseOptions, ...options};

  return new Promise((resolve, reject) => {
    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    let func = launchImageLibrary;
    if (mode === 'camera') {
      func = launchCamera;
    }
    func(options, response => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        reject({didCancel: true, err: 'User cancelled image picker'});
        ToastAlert.show('User cancelled image picker', response.errorMessage);
      } else if (response.errorCode) {
        console.log(response.errorMessage, 'Image Picker Error');
        reject({didCancel: false, err: response.errorCode});
      } else {
        if (response.assets && response.assets.length > 0) {
          const fileAsset = response.assets[0];
          const file = {
            uri: isAndroid()
              ? fileAsset.uri || ''
              : (fileAsset.uri || '').replace('file://', ''),
            type: fileAsset.type || '',
            name: fileAsset.fileName || 'image.jpg',
            fileSize: fileAsset.fileSize || 0,
          };
          console.log(response, 'file size of the photo');
          // if (fileAsset.fileSize && fileAsset.fileSize <= 8000000) {
          resolve(file);
          // } else {
          //   reject({
          //     didCancel: false,
          //     err: 'size of image should be less than 8MB',
          //   });
          // }

          // console.log(file);
          // You can also display the image using data:
          // const source = { uri: 'data:image/jpeg;base64,' + response.data };
          // console.log(source);
        } else {
          reject({
            didCancel: false,
            err: 'Asset not selected',
          });
        }
      }
    });
  });
};

const openLink = async (url:string) => {
  // check if the link is supported by the platform
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    // open the link in the user's preferred app
    await Linking.openURL(url);
  } else {
    console.log(`Cannot open link ${url}`);
  }
};

const onShare = async (title: string, link: string) => {
	return new Promise<any>(async (resolve, reject) => {
		try {
			const result = await Share.share(
				{
					url: link,
					title: title,
					message: title + '\n' + link,
				},
				{tintColor: Colors.primary},
			);
			// if (result.action === Share.sharedAction) {
			// 	if (result.activityType) {
			// 		// shared with activity type of result.activityType
			// 	} else {
			// 		// shared
			// 	}
			// } else if (result.action === Share.dismissedAction) {
			// 	// dismissed
			// }
			resolve(result);
		} catch (error: any) {
			ToastAlert.show(error.message);
			reject();
		}
	});
};

const getTimeLineDates = (
	timeLine: string,
	minDate: Moment.Moment,
	maxDate: Moment.Moment,
) => {
	const range: any = {};
	const currentDate = Moment();
	switch (timeLine) {
		case 'today':
			range.start_date = currentDate.format('YYYY-MM-DD');
			range.end_date = currentDate.format('YYYY-MM-DD');
			break;
		case 'week':
			range.start_date = Moment().subtract(1, 'week').format('YYYY-MM-DD');
			range.end_date = currentDate.format('YYYY-MM-DD');
			break;
		case 'month':
			range.start_date = Moment().subtract(1, 'month').format('YYYY-MM-DD');
			range.end_date = currentDate.format('YYYY-MM-DD');
			break;
		case 'life':
			range.start_date = Moment().subtract(100, 'years').format('YYYY-MM-DD');
			range.end_date = currentDate.format('YYYY-MM-DD');
			break;
		case 'custom':
			range.start_date = minDate.format('YYYY-MM-DD');
			range.end_date = maxDate.format('YYYY-MM-DD');
			break;
	}
	return range;
};
const openSMS = (phone: string, SMSText: string) => {
	const url =
		Platform.OS === 'android' ? `sms:${phone}?body=${SMSText}` : `sms:${phone}`;
	openLink(url);
};
const openCall = (phoneNumber: string) => {
	if (Platform.OS !== 'android') {
		phoneNumber = `telprompt:${phoneNumber}`;
	} else {
		phoneNumber = `tel:${phoneNumber}`;
	}
	openLink(phoneNumber);
};

const sortDatesByLatest = (arr: any[], fieldName: string) => {
	const newarr = arr.sort((a, b) => {
		return moment(b[fieldName]).diff(a[fieldName]);
	});

	return newarr;
};

export default {
	getColorScheme,
	isIOS,
	isAndroid,
	isMaterialDesignWorks,
	parseTime,
	secondsToHHMMSS,
	secondsToMMSS,
	getAuthHeader,
	getWidth,
	getHeight,
	numberFormatter,
	numberToCommas,
	namePrivacy,
	getFormDataFromJSON,
	handleErrors,
	getElevationStyle,
	openLink,
	onShare,
	getTimeLineDates,
	openCall,
	openSMS,
	openDocumentPicker,
	openMedia,
	sortDatesByLatest,
	tConvert,
	parseQueryString,
};
