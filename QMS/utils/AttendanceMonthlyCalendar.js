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


class AttendanceMonthlyCalendar extends React.Component {
    state = {
        currentMonth: '',
        monthFirstDay: '',
        monthLastDay: ''

    };

    componentDidMount() {

    }



    onMonthIncrease = () => {
        var now = this.state.currentMonth === '' ? new Date() : new Date(this.state.currentMonth);
        if (now.getMonth() == 11) {
            var current = new Date(now.getFullYear() + 1, 0, 1);
        } else {
            var current = new Date(now.getFullYear(), now.getMonth() + 1, 2);
        }
        this.setState({
            currentMonth: current
        }, () => {
            this.getMonth()
        })
    }

    onMonthDecrease = () => {
        var now = this.state.currentMonth === '' ? new Date() : new Date(this.state.currentMonth);

        var current = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        this.setState({
            currentMonth: current
        }, () => {
            this.getMonthDecrease()
        })
    }

    getMonth = () => {
        var date = new Date(this.state.currentMonth);
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        this.setState({
            monthFirstDay: firstDay,
            monthLastDay: lastDay
        }, () => {
            this.selectedDates()
        })
    }

    getMonthDecrease = () => {
        var date = new Date(this.state.currentMonth);
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        this.setState({
            monthFirstDay: firstDay,
            monthLastDay: lastDay
        }, () => {
            this.selectedDates()
        })
    }

    selectedDates = () => {
        const monthDates = {
            firstDay: this.state.monthFirstDay,
            lastDay: this.state.monthLastDay,
        }

        this.props.getValue(monthDates)
    }

    render() {
        const monthNumber = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const monthNames = [i18n.t("january"), i18n.t("february"), i18n.t("march"), i18n.t("april"), i18n.t("may"), i18n.t("june"), i18n.t("july"), i18n.t("august"), i18n.t("september"), i18n.t("october"), i18n.t("november"), i18n.t("december")]



        return (
            <RN.View style={{ flex: 1 }}>
                <RN.View style={{ flexDirection: 'row', marginTop: width / 30, justifyContent: 'space-between' }}>
                    <RN.View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.onMonthDecrease()}>
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
                            }}>{this.state.currentMonth !== '' ? `${monthNames[parseInt(new Date(this.state.currentMonth).getMonth())]} ${new Date(this.state.currentMonth).getFullYear()}` : `${monthNames[parseInt(new Date().getMonth())]} ${new Date().getFullYear()}`}
                        </RN.Text>
                        <TouchableOpacity onPress={() => this.onMonthIncrease()}>
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

export default AttendanceMonthlyCalendar;
