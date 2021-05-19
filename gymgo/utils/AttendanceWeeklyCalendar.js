import * as React from 'react';
import i18n from 'i18n-js';
import * as RN from 'react-native';
import { Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import { CalendarList } from 'react-native-calendars';
import { Icon, transform } from './api/helpers'
let w = Dimensions.get('window').width
let h = Dimensions.get('window').height
const isTablet = (h / w) > 1.6
let width = isTablet ? w : 500
let height = isTablet ? h : 900


class AttendanceCalendarWeekly extends React.Component {
    state = {
        week: [],
        firstDay: '',
        lastDay: '',
        showCalendar: false,
        no: ''

    };

    componentDidMount() {

        this.onWeekChanged()
    }

    months = [i18n.t("january"), i18n.t("february"), i18n.t("march"), i18n.t("april"), i18n.t("may"), i18n.t("june"), i18n.t("july"), i18n.t("august"), i18n.t("september"), i18n.t("october"), i18n.t("november"), i18n.t("december")];
    makeDateFormat = (date) => {
        let index = date.indexOf('T')
        let updateTime = "T00:00:00.000Z"
        let givenDate = date.slice(0, index)
        let newDate = givenDate + updateTime
        return newDate
    }
    makeDateFormate = (date) => {
        var myDate = new Date(date)
        myDate.setDate(myDate.getDate() + 1)
        var finalDate = new Date(myDate).toISOString()
        let index = finalDate.indexOf('T')
        let updateTime = "T00:00:00.000Z"
        let givenDate = finalDate.slice(0, index)
        let newDate = givenDate + updateTime
        return newDate
    }

    makeDateFormatew = (date) => {
        var myDate = new Date(date)
        myDate.setDate(myDate.getDate() - 1)
        var finalDate = new Date(myDate).toISOString()
        let index = finalDate.indexOf('T')
        let updateTime = "T00:00:00.000Z"
        let givenDate = finalDate.slice(0, index)
        let newDate = givenDate + updateTime
        return newDate
    }
    onWeekChanged = () => {
        var week = []
        var date = new Date()
        if (this.state.week.length === 0) {
            for (var i = 0; i < 7; i++) {
                week.push({ date: this.makeDateFormat(date.toISOString()), selected: false })
                date.setDate(date.getDate() + 1)
            }
        } else {
            for (var i = 0; i < 7; i++) {
                week.push({ date: this.makeDateFormate(date.toISOString()), selected: false })
                date.setDate(date.getDate() + 1)
            }
        }

        this.setState({
            week,
            firstDay: week[0].date,
            lastDay: week[6].date
        })
    }
    onPressCheck = (i) => {
        this.state.week.map((select, index) => {
            if (index === i) {
                select.selected = true
            } else {
                select.selected = false
            }
        })
        this.setState({
            week: this.state.week,
        }, () => {
            this.selectedDates()
        })
    }

    onPressCheckMulti = (i) => {
        this.state.week[i].selected = !this.state.week[i].selected
        this.setState({
            week: this.state.week,
        }, () => {
            this.selectedDates()
        })
    }

    onWeekIncrease = () => {
        var week = []
        var date = new Date(this.state.lastDay)
        if (this.state.week.length === 0) {
            for (var i = 0; i < 7; i++) {
                week.push({ date: this.makeDateFormat(date.toISOString()), selected: false })
                date.setDate(date.getDate() + 1)
            }
        } else {
            for (var i = 0; i < 7; i++) {
                week.push({ date: this.makeDateFormate(date.toISOString()), selected: false })
                date.setDate(date.getDate() + 1)
            }
        }

        this.setState({
            week,
            firstDay: week[0].date,
            lastDay: week[6].date
        }, () => {
            this.selectedDates()
        })
    }

    onWeekDecrease = () => {
        var week = []
        var date = new Date(this.state.firstDay)
        if (this.state.week.length === 0) {
            for (var i = 0; i < 7; i++) {
                week.push({ date: this.makeDateFormat(date.toISOString()), selected: false })
                date.setDate(date.getDate() + 1)
            }
        } else {
            for (var i = 0; i < 7; i++) {
                week.push({ date: this.makeDateFormatew(date.toISOString()), selected: false })
                date.setDate(date.getDate() - 1)
            }
        }

        this.setState({
            week: week.reverse(),
            firstDay: week[0].date,
            lastDay: week[6].date,
        }, () => {
            this.selectedDates()
        })
    }

    renderCalendar = () => {
        this.setState({
            showCalendar: !this.state.showCalendar
        })
    }

    onPressDay = (day) => {
        var week = []
        var date = new Date(day.dateString)
        if (this.state.week.length === 0) {
            for (var i = 0; i < 7; i++) {
                week.push({ date: this.makeDateFormat(date.toISOString()), selected: false })
                date.setDate(date.getDate() + 1)
            }
        } else {
            for (var i = 0; i < 7; i++) {
                week.push({ date: this.makeDateFormate(date.toISOString()), selected: false })
                date.setDate(date.getDate() + 1)
            }
        }

        this.setState({
            week,
            firstDay: week[0].date,
            lastDay: week[6].date,
            showCalendar: false
        })
    }

    selectedDates = () => {
        const date = {
            firstDay: this.state.firstDay,
            lastDay: this.state.lastDay,
        }

        this.props.getValue(date)
    }

    render() {
        const monthNumber = new Date().getMonth()
        const monthName = this.months[monthNumber]
        const currentYear = new Date().getFullYear()
        const monthNames = [i18n.t("january"), i18n.t("february"), i18n.t("march"), i18n.t("april"), i18n.t("may"), i18n.t("june"), i18n.t("july"), i18n.t("august"), i18n.t("september"), i18n.t("october"), i18n.t("november"), i18n.t("december")]

        const firstDay = new Date(this.state.firstDay).getDate()
        const firstDayYear = new Date(this.state.firstDay).getFullYear()
        const firstDayMonth = new Date(this.state.firstDay).getMonth() + 1
        const lastDay = new Date(this.state.lastDay).getDate()
        const lastDayYear = new Date(this.state.lastDay).getFullYear()
        const lastDayMonth = new Date(this.state.lastDay).getMonth() + 1

        return (
            <RN.View style={{ flex: 1 }}>
                <RN.View style={{ flexDirection: 'row', marginTop: width / 30, width: w / 1.8, justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto' }}>
                    <RN.View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.onWeekDecrease()}>
                            <Icon name='back-button' color='orange' size={width / 22} style={{
                                marginLeft: width / 30,
                                marginTop: width / 30,
                                fontSize: width / 28,
                            }} />
                        </TouchableOpacity>
                        <RN.Text
                            style={{
                                transform: transform(),
                                marginLeft: width / 60,
                                marginTop: width / 40,
                                fontSize: width / 25,
                                fontWeight: 'bold', color: 'orange'
                            }}>{`${firstDay}/${firstDayMonth}/${firstDayYear}`} - {`${lastDay}/${lastDayMonth}/${lastDayYear}`}
                        </RN.Text>
                        <TouchableOpacity onPress={() => this.onWeekIncrease()}>
                            <Icon name='right-arrow' color='orange' size={width / 22} style={{
                                marginLeft: width / 60,
                                marginTop: width / 30,
                                fontSize: width / 28,
                            }} />
                        </TouchableOpacity>
                    </RN.View>

                </RN.View>

            </RN.View>

        );
    }
}

export default AttendanceCalendarWeekly;
