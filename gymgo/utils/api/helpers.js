import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/fonts/selection.json';
import { Dimensions } from 'react-native'
import i18n from 'i18n-js'

export const URL = 'https://skoolgo.pixelmindit.com:5000'
// export const URL = 'http://192.168.1.102:5800'
export const rtl = i18n.locale === 'ar' ? true : false

export const transform = () => {
  return [{ rotateY: i18n.locale === 'ar' ? '180deg' : '0deg' }]
}

export const textAlign = () => {
  return i18n.locale === 'ar' ? 'right' : 'left'
}

export const textAlignMember = () => {
  return i18n.locale === 'ar' ? 'left' : 'right'
}

export const textAlignForError = () => {
  return i18n.locale === 'ar' ? 'left' : 'right'
}

export const paddingRight = () => {
  return i18n.locale === 'ar' ? width / 30 : 0
}

export const paddingLeft = () => {
  return i18n.locale === 'ar' ? width / 30 : 0
}

export const marginLeft = () => {
  return i18n.locale === 'ar' ? width / 30 : 0
}

export const paddingRightHome = () => {
  return i18n.locale === 'ar' ? width / 20 : 0
}

export const paddingLeftBMI = () => {
  return i18n.locale !== 'ar' && isTablet === true ? width / 10 : i18n.locale !== 'ar' && isTablet === false ? width / 8 : 0
}

export const paddingRightBMI = () => {
  return i18n.locale === 'ar' && isTablet === true ? width / 10 : i18n.locale !== 'ar' && isTablet === false ? width / 8 : 0
}

export const paddingLeftWater = () => {
  return i18n.locale !== 'ar' && isTablet === true ? width / 30 : i18n.locale !== 'ar' && isTablet === false ? width / 25 : 0
}

export const paddingRightWater = () => {
  return i18n.locale === 'ar' && isTablet === true ? width / 30 : i18n.locale !== 'ar' && isTablet === false ? width / 25 : 0
}

export const Icon = createIconSetFromIcoMoon(icoMoonConfig);

export const w = Dimensions.get('window').width
export const h = Dimensions.get('window').height
export const width = (h / w) > 1.6 ? w : 500
export const height = (h / w) > 1.6 ? h : 900
export const isTablet = (h / w) > 1.6
export const monthFullNames = ['january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december']

export const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export const dateInDDMMYYYY = (date) => {
  if (date instanceof Date && !isNaN(date)) {
    return `${("0" + date.getDate()).slice(-2)}-${("0" + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`
  } else {
    return ''
  }
}

export const dateToDDMMYYYY = (date) => {
  var dateStart = new Date(date)
  if (dateStart instanceof Date && !isNaN(dateStart)) {
    return `${("0" + (dateStart.getDate())).slice(-2)}/${("0" + (dateStart.getMonth() + 1)).slice(-2)}/${dateStart.getFullYear()}`
  } else {
    return ''
  }
}

export const dateToHHMM = (date) => {
  var dateStart = new Date(date)
  if (dateStart instanceof Date && !isNaN(dateStart)) {
    return `${dateStart.toLocaleTimeString('en-US').slice(0, -6)}:${dateStart.toLocaleTimeString('en-US').slice(-2)}`
  } else {
    return ''
  }
}

export const AMPM = (time) => {
  var shours = new Date(time).getHours()
  var sminutes = new Date(time).getMinutes()
  var sampm = shours >= 12 ? 'PM' : 'AM'
  shours = shours % 12
  shours = shours ? shours : 12  // the hour '0' should be '12'
  return `${shours + ':' + `${("0" + sminutes).slice(-2)}` + ' ' + sampm}`
}


export const setTime = (date) => {
  if (date) {
    var myDate = new Date(date);
    myDate.setHours(0, 0, 0, 0)
    return myDate.toISOString()
  }
}

export const getPageWiseData = (pageNumber, fullData, dataPerPage) => {                // Here value 5 is dataPerPage
  if (!pageNumber) {
    pageNumber = 1
  }
  if (pageNumber && fullData && fullData.length > 0) {
    const pagedData = fullData.filter((data, i) => (data) && (i < (dataPerPage ? dataPerPage * pageNumber : 5 * pageNumber)) && (i >= (dataPerPage ? dataPerPage * (pageNumber - 1) : 5 * (pageNumber - 1))))
    return pagedData
  } else {
    return []
  }
}