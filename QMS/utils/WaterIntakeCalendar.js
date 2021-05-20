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


class WaterIntakeCalendar extends React.Component {
    state = {
        week: [],
        firstDay: '',
        lastDay: '',
        showCalendar: false,
        no: '',
        type: 'increase'

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
            this.selectedDates(this.state.type)
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
            lastDay: week[6].date,
            type: 'increase'
        }, () => {
            this.selectedDates(this.state.type)
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
            type: 'increase'

        }, () => {
            this.selectedDates(this.state.type)
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
            showCalendar: false,
            type: 'increase'
        }, () => {
            this.selectedDates(this.state.type)
        })
    }

    selectedDates = (typ) => {
        const date = this.state.week.filter(dat => dat.selected === true)
        const week = this.state.week
        const type = typ
        this.props.getValue(date, week, type)
    }

    render() {
        const monthNumber = new Date().getMonth()
        const monthName = this.months[monthNumber]
        const currentYear = new Date().getFullYear()
        const monthNames = [i18n.t("january"), i18n.t("february"), i18n.t("march"), i18n.t("april"), i18n.t("may"), i18n.t("june"), i18n.t("july"), i18n.t("august"), i18n.t("september"), i18n.t("october"), i18n.t("november"), i18n.t("december")]

        const firstDay = new Date(this.state.firstDay).getDate()
        const firstDayYear = new Date(this.state.firstDay).getFullYear()
        const firstDayMonth = monthNames[parseInt(new Date(this.state.firstDay).getMonth())]
        const lastDay = new Date(this.state.lastDay).getDate()
        const lastDayYear = new Date(this.state.lastDay).getFullYear()
        const lastDayMonth = monthNames[parseInt(new Date(this.state.lastDay).getMonth())]

        return (
            <RN.View style={{ flex: 1 }}>
                <RN.View style={{ flexDirection: 'row', marginTop: width / 30, width: w / 1.1, justifyContent: 'space-between' }}>
                    <RN.View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.onWeekDecrease()}>
                            <Icon name='back-button' color='#333' size={width / 22} style={{
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
                                fontSize: width / 28,
                            }}>{`${firstDay} ${firstDayMonth} ${firstDayYear}`} - {`${lastDay} ${lastDayMonth} ${lastDayYear}`}
                        </RN.Text>
                        <TouchableOpacity onPress={() => this.onWeekIncrease()}>
                            <Icon name='right-arrow' color='#333' size={width / 22} style={{
                                marginLeft: width / 60,
                                marginTop: width / 30,
                                fontSize: width / 28,
                            }} />
                        </TouchableOpacity>
                    </RN.View>
                    <TouchableOpacity onPress={() => this.renderCalendar()}>
                        <Icon name='attendance' color='#333' size={width / 20} style={{
                            transform: transform(), marginLeft: width / 60,
                            marginTop: width / 30,

                        }} />
                    </TouchableOpacity>
                </RN.View>
                <RN.View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                    <ScrollView contentContainerStyle={{ paddingRight: width / 30 }} showsHorizontalScrollIndicator={false} horizontal={true}>
                        {this.state.showCalendar === false ? this.state.week.map((date, index) => {
                            const weeks = [i18n.t('sun'), i18n.t('mon'), i18n.t('tue'), i18n.t('wed'), i18n.t('thu'), i18n.t('fri'), i18n.t('sat')]
                            const nameOfWeek = weeks[new Date(date.date).getDay()]
                            return (
                                <TouchableOpacity key={index} onPress={() => this.onPressCheck(index)}>
                                    <RN.View
                                        style={{

                                            width: w / 8,
                                            paddingBottom: width / 18,
                                            paddingTop: 5,
                                            marginLeft: width / 30,
                                            marginTop: width / 20,
                                            backgroundColor: date.selected === false ? '#545351' : '#ff9800',
                                            borderRadius: 3,
                                        }}>
                                        <RN.Text
                                            style={{ textAlign: 'center', fontWeight: 'bold', color: 'white', top: 10, transform: transform() }}>
                                            {nameOfWeek}
                                        </RN.Text>
                                        <RN.Text
                                            style={{ textAlign: 'center', fontWeight: 'bold', color: 'white', top: 10, transform: transform() }}>
                                            {new Date(date.date).getDate()}
                                        </RN.Text>
                                    </RN.View>
                                </TouchableOpacity>

                            )
                        }) : <RN.View></RN.View>}

                    </ScrollView>
                    {this.state.showCalendar === true ? <RN.View style={{ justifyContent: 'center' }}>
                        <CalendarList
                            pastScrollRange={12}
                            futureScrollRange={12}
                            scrollEnabled={true}
                            showScrollIndicator={true}
                            horizontal={true}
                            onDayPress={(day) => this.onPressDay(day)}
                            selectedDayBackgroundColor={'#00adf5'}
                            style={{ transform: transform(), marginTop: width / 30, borderWidth: 1, borderColor: '#ddd' }}

                        />
                    </RN.View> : <RN.View></RN.View>}
                </RN.View>
            </RN.View>

        );
    }
}

export default WaterIntakeCalendar;
