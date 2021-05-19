import * as React from 'react';
import i18n from 'i18n-js';
import * as RN from 'react-native';
import { Dimensions, ScrollView, TouchableOpacity, Modal, View, Text } from 'react-native'
import { CalendarList } from 'react-native-calendars';
import { Icon, transform } from './api/helpers'
let w = Dimensions.get('window').width
let h = Dimensions.get('window').height
const isTablet = (h / w) > 1.6
let width = isTablet ? w : 500
let height = isTablet ? h : 900


class BMICalendar extends React.Component {
    state = {
        week: [],
        firstDay: '',
        lastDay: '',
        showCalendar: false,
        no: '',
        modalVisible: false,

    };

    componentDidMount() {

        this.onWeekChanged()
        this.selectedDates()
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
            this.selectedDates('increase')
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
            this.selectedDates('increase')
        })
    }

    renderCalendar = () => {
        this.setModalVisible(true)
        this.setState({
            showCalendar: !this.state.showCalendar,
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
        }, () => {
            this.selectedDates('increase')
            this.setModalVisible(false)
        })
    }

    selectedDates = (typ) => {
        const date = this.state.week
        const type = typ
        this.props.getValue(date, type)
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {
        const monthNumber = new Date().getMonth()
        const monthName = this.months[monthNumber]
        const currentYear = new Date().getFullYear()
        const monthNames = [i18n.t("january"), i18n.t("february"), i18n.t("march"), i18n.t("april"), i18n.t("may"), i18n.t("june"), i18n.t("july"), i18n.t("august"), i18n.t("september"), i18n.t("october"), i18n.t("november"), i18n.t("december")]

        const firstDay = new Date(this.state.firstDay).getDate()
        const firstDayYear = new Date(this.state.firstDay).getFullYear()
        const firstDayMonth = parseInt(new Date(this.state.firstDay).getMonth())
        const lastDay = new Date(this.state.lastDay).getDate()
        const lastDayYear = new Date(this.state.lastDay).getFullYear()
        const lastDayMonth = parseInt(new Date(this.state.lastDay).getMonth())

        return (
            <RN.View style={{ flex: 1 }}>
                <RN.View style={{ flexDirection: 'row', width: w / 1.15, justifyContent: 'flex-end' }}>
                    <RN.View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.onWeekDecrease()}>
                            <Icon name='back-button' color='#333' size={width / 22} style={{
                                marginLeft: width / 60,
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
                            }}>{`${firstDay}/${firstDayMonth + 1}/${firstDayYear}`} - {`${lastDay}/${lastDayMonth + 1}/${lastDayYear}`}
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
                            marginTop: width / 50,

                        }} />
                    </TouchableOpacity>
                </RN.View>





                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View elevation={10} style={{ borderWidth: 1, borderColor: '#ddd', backgroundColor: 'white', height: height / 1.5, width: width - 40, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width / 1.15, marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0.5, paddingBottom: width / 60, borderBottomColor: '#333' }}>
                            <Text style={{ fontSize: width / 20, color: '#333', marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>Calendar</Text>
                            <TouchableOpacity onPress={() => { this.setModalVisible(false) }}>
                                <Icon name="close" size={width / 20} style={{ marginRight: width / 30 }} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <CalendarList
                            pastScrollRange={12}
                            futureScrollRange={12}
                            scrollEnabled={true}
                            showScrollIndicator={true}
                            horizontal={true}
                            onDayPress={(day) => this.onPressDay(day)}
                            selectedDayBackgroundColor={'#00adf5'}
                            style={{ height: height / 1.8 }}

                        />
                    </View>
                </Modal>

            </RN.View>

        );
    }
}

export default BMICalendar;
