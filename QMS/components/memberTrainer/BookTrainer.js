import React from 'react';
import { View, Text, ScrollView, Image, RefreshControl, TouchableOpacity, ImageBackground, ActionSheetIOS, Picker, StyleSheet, Platform, Modal, Alert } from 'react-native';
import boyImage from '../../assets/images/boy.jpg'
import Header from '../common/Header'
import { Icon, width, height, w, h, transform, textAlign, URL, setTime } from '../../utils/api/helpers'
import { getMemberById, getCurrency } from '../../utils/api/authorization'
import { getPackagesByID } from '../../utils/api/package'
import { getUniqueTrainerByBranch, getPeriodOfTrainer, bookATrainer } from '../../utils/api/employee'
import AsyncStorage from '@react-native-community/async-storage';
import trainerBg from '../../assets/images/trainerBg.jpg'
import jwtDecode from 'jwt-decode'
import alert from '../../assets/images/alert.png'
import DateTimePicker from "react-native-modal-datetime-picker";
import Loader from '../../utils/resources/Loader'
import i18n from 'i18n-js';

export default class BookTrainer extends React.Component {
    _isMounted = false

    state = {
        rtl: null,
        currency: '',
        userId: "",
        packages: [],
        package: '',
        packageLabel: i18n.t('pleaseSelect'),
        trainers: [],
        trainer: '',
        trainerLabel: i18n.t('pleaseSelect'),
        periods: [],
        period: '',
        periodLabel: i18n.t('pleaseSelect'),
        showDate: '',
        dateSelected: new Date(),
        visible: false,
        periodDays: 0,
        endDate: '',
        questions: true,
        periodOfPackage: 0,
        daysLeftForPackageToExpire: 0,
        showTrainer: false,
        modalVisible: false,
        accessBranches: [],
        selectedPackageEnd: new Date(),
        totalAmount: 0,
        loading: false,
        text: '',
        selectedPackageStart: new Date()
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            AsyncStorage.getItem('authedToken').then((token) => {
                const userId = jwtDecode(token).userId

                this.setState({
                    userId,

                }, () => {

                    this._onRefresh()
                })
            })
        }
    }


    componentWillUnmount() {
        this._isMounted = false
    }


    _onRefresh = () => {
        this.setState({
            refreshing: true
        })
        getMemberById(this.state.userId).then(res => {
            if (res) {
                this.setState({
                    refreshing: false,
                    packages: res.data.response.packageDetails.filter(data => (new Date().setHours(0, 0, 0, 0) <= new Date(data.extendDate ? data.extendDate : data.endDate) || !data.endDate) && data.paidStatus !== 'UnPaid'),
                    // questions: res.data.response.questions === undefined ? false : true
                }, () => {
                    getCurrency().then(res => {
                        if (res) {
                            this.setState({
                                currency: res.data.response
                            })
                        }
                    })
                })
            }
        })

    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title', 'To Eat'),
        }
    }

    calculateDays = (item) => {
        const showPackage = this.state.packages.filter(id => id._id === item)[0]
        if (showPackage.reactivationDate) {
            if (new Date() >= new Date(showPackage.reactivationDate)) {
                const dateOne = showPackage === undefined || showPackage === '' ? '' : new Date(new Date().setHours(0, 0, 0, 0));
                const dateTwo = showPackage === undefined || showPackage === '' ? '' : new Date(new Date(showPackage.extendDate).setHours(0, 0, 0, 0));
                const d = showPackage === undefined || showPackage === '' ? '' : dateTwo.getTime() - dateOne.getTime();
                const Difference_In_Days = showPackage === undefined || showPackage === '' ? '' : d / (1000 * 3600 * 24)
                this.setState({ daysLeftForPackageToExpire: Math.abs(Difference_In_Days) });
            } else {
                const dateOne = showPackage === undefined || showPackage === '' ? '' : new Date(new Date(showPackage.startDate).setHours(0, 0, 0, 0));
                const dateTwo = showPackage === undefined || showPackage === '' ? '' : new Date(new Date(showPackage.freezeDate).setHours(0, 0, 0, 0));
                const da = showPackage === undefined || showPackage === '' ? '' : dateTwo.getTime() - dateOne.getTime();
                const freeze = showPackage === undefined || showPackage === '' ? '' : da / (1000 * 3600 * 24)
                const Difference_In_Days = this.state.periodOfPackage === undefined || this.state.periodOfPackage === '' ? '' : this.state.periodOfPackage - freeze

                this.setState({ daysLeftForPackageToExpire: Math.abs(Difference_In_Days) });
            }
        } else {
            const dateOne = showPackage === undefined || showPackage === '' ? '' : new Date(new Date().setHours(0, 0, 0, 0));
            const dateTwo = showPackage === undefined || showPackage === '' ? '' : new Date(new Date(showPackage.extendDate ? showPackage.extendDate : showPackage.endDate).setHours(0, 0, 0, 0));
            const Difference_In_Time = showPackage === undefined || showPackage === '' ? '' : dateTwo.getTime() - dateOne.getTime();
            const Difference_In_Days = showPackage === undefined || showPackage === '' ? '' : Difference_In_Time / (1000 * 3600 * 24)

            this.setState({ daysLeftForPackageToExpire: Math.abs(Difference_In_Days) });
        }

    }


    onSelectpackage = (item) => {
        if (item !== '') {
            const periodDays = this.state.packages.filter(id => id._id === item)[0].packages.period.periodDays
            const endDate = this.state.packages.filter(id => id._id === item)[0].extendDate ? this.state.packages.filter(id => id._id === item)[0].extendDate : this.state.packages.filter(id => id._id === item)[0].endDate
            const startDate = this.state.packages.filter(id => id._id === item)[0].startDate
            this.setState({
                periodOfPackage: periodDays,
                selectedPackageEnd: endDate,
                selectedPackageStart: startDate,
                period: '',
                periodLabel: i18n.t('pleaseSelect'),
                trainer: '',
                trainerLabel: i18n.t('pleaseSelect'),
                totalAmount: 0,
                endDate: '',
                dateSelected: new Date(),
                showDate: '',
                showTrainer: false
            }, () => {
                this.calculateDays(item)
                this.getAllTrainer()
            })
        }

    }


    setModalVisible(visible, act) {
        if (act === 'api') {
            this.setState({ modalVisible: visible, text: i18n.t('youHaveSuccesfullyRequestedATrainer') });
        } else if (act === 'pop') {
            this.setState({
                modalVisible: visible,
                text: i18n.t('youAreNotAllowedToSelectTrainer')
            });
        } else if (this.state.text === i18n.t('youHaveSuccesfullyRequestedATrainer') && act === '') {
            this.setState({
                modalVisible: visible,
                text: i18n.t('eitherTrainer'),
                period: '',
                periodLabel: i18n.t('pleaseSelect'),
                package: '',
                packageLabel: i18n.t('pleaseSelect'),
                trainer: '',
                trainerLabel: i18n.t('pleaseSelect'),
                totalAmount: 0,
                endDate: '',
                dateSelected: new Date(),
                showDate: '',
                showTrainer: false
            }, () => {
                this.props.handlePressButton()
            });
        }
        else {
            this.setState({
                modalVisible: visible,
                text: i18n.t('eitherTrainer'),
                period: '',
                periodLabel: i18n.t('pleaseSelect'),
                package: '',
                packageLabel: i18n.t('pleaseSelect'),
                trainer: '',
                trainerLabel: i18n.t('pleaseSelect'),
                totalAmount: 0,
                endDate: '',
                dateSelected: new Date(),
                showDate: '',
                showTrainer: false
            });
        }
    }

    getAllTrainer = () => {
        const packages = this.state.packages.filter(id => id._id === this.state.package)[0]
        const arr = { branches: this.state.packages.filter(id => id._id === this.state.package)[0].packages.accessBranches }
        const trainer = packages.trainerDetails.filter(data => (new Date().setHours(0, 0, 0, 0) <= new Date(data.trainerExtend ? data.trainerExtend : data.trainerEnd) || !data.trainerEnd))
        if (trainer.length > 0) {
            this.setModalVisible(true, '')
        } else {
            getUniqueTrainerByBranch(arr).then(res => {
                if (res) {
                    this.setState({
                        trainers: res.data.response,
                        showTrainer: true,
                        accessBranches: arr.branches
                    })
                }

            })
        }

    }

    getPeriodOfTrainer = () => {
        if (this.state.trainer !== '') {
            const data = {
                trainerName: this.state.trainer,
                branches: this.state.accessBranches
            }
            console.log(this.state.daysLeftForPackageToExpire)
            getPeriodOfTrainer(data).then(res => {
                if (res) {
                    this.setState({
                        periods: res.data.response.filter(data => data.period.periodDays <= this.state.daysLeftForPackageToExpire + 1),
                    }, () => {
                        if (this.state.periods.length === 0) {
                            this.setState({
                                trainer: '',
                                trainerLabel: i18n.t('pleaseSelect'),
                                showTrainer: false,
                                period: '',
                                periodLabel: i18n.t('pleaseSelect'),
                                totalAmount: 0,
                                endDate: '',
                                dateSelected: new Date(),
                                showDate: '',
                            })
                        }
                    })
                }
            })
        } else {
            this.setState({
                showTrainer: false,
                package: '',
                packageLabel: i18n.t('pleaseSelect')
            })
        }
    }

    onGetAmount = () => {
        if (this.state.period !== '') {
            const totalAmount = this.state.periods.filter(data => data._id === this.state.period)[0].amount
            const periodDays = this.state.periods.filter(data => data._id === this.state.period)[0].period.periodDays
            this.setState({
                totalAmount,
                periodDays,
                endDate: '',
                dateSelected: new Date(),
                showDate: ''
            })
        }
    }

    showPackages = () => {
        const data = this.state.packages.map(l => `${l.packages.packageName} (${new Date(l.startDate).getDate()}/${new Date(l.startDate).getMonth() + 1}/${new Date(l.startDate).getFullYear()})`)

        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
        },
            (buttonIndex) => {
                this.setState({ packageLabel: data[buttonIndex] });
                if (this.state.packages[buttonIndex]) {
                    this.setState({
                        package: this.state.packages[buttonIndex]._id,
                        packageLabel: `${this.state.packages[buttonIndex].packages.packageName} ${`(${new Date(this.state.packages[buttonIndex].startDate).getDate()}/${new Date(this.state.packages[buttonIndex].startDate).getMonth() + 1}/${new Date(this.state.packages[buttonIndex].startDate).getFullYear()})`}`,
                    }, () => this.onSelectpackage(this.state.package))
                } else {
                    this.setState({
                        package: '',
                        packageLabel: i18n.t('pleaseSelect')
                    }, () => this.onSelectpackage(this.state.package))
                }
            });
    }

    renderPackages() {
        if (Platform.OS === 'android') {
            return (
                <View style={[styles.form, { transform: transform() }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: 2, color: '#333' }}
                        selectedValue={this.state.package}
                        onValueChange={(itemValue) => this.setState({ package: itemValue }, () => this.onSelectpackage(itemValue))}>
                        <Picker.Item label={i18n.t('pleaseSelect')} value='' />
                        {
                            this.state.packages.map((v, i) => {
                                return <Picker.Item label={`${v.packages.packageName} ${`(${new Date(v.startDate).getDate()}/${new Date(v.startDate).getMonth() + 1}/${new Date(v.startDate).getFullYear()})`}`} value={v._id} key={i} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showPackages()}>
                    <View style={[styles.form, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 23, color: '#333' }}>{this.state.packageLabel}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }


    showTrainers = () => {
        const data = this.state.trainers.map(l => l.credentialId.userName)
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
        },
            (buttonIndex) => {
                this.setState({ trainerLabel: data[buttonIndex] });
                if (this.state.trainers[buttonIndex]) {
                    this.setState({
                        trainer: this.state.trainers[buttonIndex]._id,
                        trainerLabel: this.state.trainers[buttonIndex].credentialId.userName,
                    }, () => {
                        this.getPeriodOfTrainer()
                    })
                } else {
                    this.setState({
                        trainer: '',
                        trainerLabel: i18n.t('pleaseSelect')
                    })
                }
            });
    }

    renderTrainers() {
        if (Platform.OS === 'android') {
            return (
                <View style={[styles.form, { transform: transform() }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: 2, color: '#333' }}
                        selectedValue={this.state.trainer}
                        onValueChange={(itemValue) => this.setState({ trainer: itemValue }, () => {
                            this.getPeriodOfTrainer()
                        })}>
                        <Picker.Item label={i18n.t('pleaseSelect')} value='' />
                        {
                            this.state.trainers.map((v, i) => {
                                return <Picker.Item label={v.credentialId.userName} value={v._id} key={i} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showTrainers()}>
                    <View style={[styles.form, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 23, color: '#333' }}>{this.state.trainerLabel}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    showPeriod = () => {
        const data = this.state.periods.map(l => l.period.periodName)
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
        },
            (buttonIndex) => {
                this.setState({ periodLabel: data[buttonIndex] });
                if (this.state.periods[buttonIndex]) {
                    this.setState({
                        period: this.state.periods[buttonIndex]._id,
                        periodLabel: this.state.periods[buttonIndex].period.periodName,
                    }, () => {
                        this.onGetAmount()
                    })
                } else {
                    this.setState({
                        period: '',
                        periodLabel: i18n.t('pleaseSelect')
                    })
                }
            });
    }

    renderPeriods() {
        if (Platform.OS === 'android') {
            return (
                <View style={[styles.form, { transform: transform() }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: 2, color: '#333' }}
                        selectedValue={this.state.period}
                        onValueChange={(itemValue) => this.setState({ period: itemValue }, () => {
                            this.onGetAmount()
                        })}>
                        <Picker.Item label={i18n.t('pleaseSelect')} value='' />
                        {
                            this.state.periods.map((v, i) => {
                                return <Picker.Item label={v.period.periodName} value={v._id} key={i} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showPeriod()}>
                    <View style={[styles.form, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 23, color: '#333' }}>{this.state.periodLabel}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }


    showDateTimePicker = () => {
        this.setState({ visible: true });
    }

    hideDateTimePicker = () => {
        this.setState({ visible: false });
    }

    handleDatePicked(date) {
        this.setState({
            dateSelected: new Date(date),
            showDate: date.toISOString().split('T')[0].split('-').reverse().join('/'),

        }, () => {
            this.calculateDate()
        })
        this.hideDateTimePicker()
    }

    calculateDate = () => {
        let date = new Date(this.state.dateSelected.getTime() + ((this.state.periodDays - 1) * 24 * 60 * 60 * 1000));
        if (new Date(this.state.selectedPackageEnd).setHours(0, 0, 0, 0) < new Date(date).setHours(0, 0, 0, 0)) {
            if (Platform.OS === 'android') {
                this.setModalVisible(true, 'pop')
            } else {
                setTimeout(() => {
                    Alert.alert(
                        "Alert",
                        i18n.t('eitherTrainer'),
                        [{
                            text: "Cancel",
                            onPress: () => this.setState({
                                period: '',
                                periodLabel: i18n.t('pleaseSelect'),
                                package: '',
                                packageLabel: i18n.t('pleaseSelect'),
                                trainer: '',
                                trainerLabel: i18n.t('pleaseSelect'),
                                totalAmount: 0,
                                endDate: '',
                                dateSelected: new Date(),
                                showDate: '',
                                showTrainer: false
                            }),
                            style: "cancel",
                        },]
                    );
                }, 1000)

            }
        } else {
            this.setState({
                endDate: date
            })
        }
    }

    onSubmit = () => {
        this.setState({
            loading: true
        })
        const trainerInfo = {
            memberId: this.state.userId,
            packageDetailsId: this.state.package,
            trainerDetails: {
                trainerFees: this.state.period,
                trainer: this.state.trainer,
                trainerStart: this.state.dateSelected,
                trainerEnd: this.state.endDate,
            }
        }

        bookATrainer(trainerInfo).then(res => {
            if (res) {
                this.setState({
                    loading: false,
                    period: '',
                    periodLabel: i18n.t('pleaseSelect'),
                    package: '',
                    packageLabel: i18n.t('pleaseSelect'),
                    trainer: '',
                    trainerLabel: i18n.t('pleaseSelect'),
                    totalAmount: 0,
                    endDate: '',
                    dateSelected: new Date(),
                    showDate: '',
                    showTrainer: false
                }, () => {
                    this.setModalVisible(true, 'api')
                })
            }
        })

    }



    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', transform: transform() }}>
                <Loader loading={this.state.loading} text='Loading' />
                <ScrollView contentContainerStyle={{ paddingBottom: width / 10 }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        progressBackgroundColor='#1976d2'
                        colors={['white', 'yellow']}
                    />}>
                    <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.08, marginTop: width / 30 }}>
                        <View style={{ marginTop: width / 30 }}>
                            <Text style={{ fontSize: width / 24, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('selectPackage')}</Text>
                            {this.renderPackages()}
                        </View>
                        {this.state.package !== '' && this.state.showTrainer === true ?
                            <View style={{ marginTop: width / 20 }}>
                                <Text style={{ fontSize: width / 24, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('selectTrainer')}</Text>
                                {this.renderTrainers()}
                            </View> : null}
                        {this.state.package !== '' && this.state.periods.length > 0 && this.state.showTrainer === true ?
                            <View style={{ marginTop: width / 20 }}>
                                <Text style={{ fontSize: width / 24, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('selectPeriod')}</Text>
                                {this.renderPeriods()}
                            </View> : null}
                        {this.state.package !== '' && this.state.showTrainer === true && this.state.period !== '' ?
                            <View style={{ marginTop: width / 20, width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', justifyContent: 'space-between', flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ fontSize: width / 24, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('startDate')}</Text>
                                    <TouchableOpacity onPress={() => this.showDateTimePicker()}>
                                        <View style={{ width: w / 3, padding: width / 30, borderWidth: 0.8, borderColor: '#ddd', backgroundColor: '#eee', borderRadius: 5, marginTop: width / 30 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 3.8 }}>
                                                <Text style={{ fontSize: width / 28, color: '#333', transform: transform(), textAlign: textAlign() }}>{this.state.showDate}</Text>
                                                <Icon name="calender" size={width / 22} color="#333" />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    isVisible={this.state.visible}
                                    mode='date'
                                    minimumDate={new Date(this.state.selectedPackageStart)}
                                    maximumDate={new Date(this.state.selectedPackageEnd)}
                                    onConfirm={(date) => this.handleDatePicked(date)}
                                    onCancel={() => this.hideDateTimePicker()}
                                />
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ fontSize: width / 24, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('endDate')}</Text>
                                    <View style={{ width: w / 3, padding: width / 30, borderWidth: 0.8, borderColor: '#ddd', backgroundColor: '#eee', borderRadius: 5, marginTop: width / 30 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 3.8 }}>
                                            <Text style={{ fontSize: width / 28, color: '#333', transform: transform(), textAlign: textAlign() }}>{this.state.endDate !== '' ? `${new Date(this.state.endDate).getDate()}/${new Date(this.state.endDate).getMonth() + 1}/${new Date(this.state.endDate).getFullYear()}` : ''}</Text>
                                            <Icon name="calender" size={width / 22} color="#333" />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            : null}
                        {this.state.package !== '' && this.state.showTrainer === true && this.state.period !== '' && this.state.endDate !== '' ?
                            <View>
                                <View style={{ marginTop: width / 20 }}>
                                    <Text style={{ fontSize: width / 15, color: 'red', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.currency} {this.state.totalAmount}</Text>
                                </View>
                                <View style={{ marginTop: width / 50, }}>
                                    <Text style={{ fontSize: width / 35, textAlign: 'center', color: 'grey', transform: transform(), textAlign: textAlign() }}>( {i18n.t('exclusiveOfVAT')} )</Text>
                                </View>
                                <TouchableOpacity onPress={() => this.onSubmit()}>
                                    <View style={{ width: w / 1.2, backgroundColor: '#edc006', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                                        <Text style={{ fontSize: width / 18, color: '#333', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50, transform: transform() }}>{i18n.t('payAtGym')}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            : null}
                    </View>
                </ScrollView>
                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                    animationType='slide'
                >
                    <View elevation={3} style={{ backgroundColor: '#ffebee', height: height / 2.5, width: width - 80, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <Image style={{ width: w / 5, height: width / 5, marginLeft: 'auto', marginRight: 'auto', marginTop: height / 30 }} source={alert} />
                        <Text style={{ fontSize: width / 22, color: '#333', textAlign: 'center', marginTop: height / 30, width: width - 100, marginLeft: 'auto', marginRight: 'auto' }}>{this.state.text}</Text>
                        <TouchableOpacity onPress={() => { this.setModalVisible(false, '') }}>
                            <View style={{ width: width / 8, height: width / 8, borderRadius: width / 16, backgroundColor: '#03a9f4', marginLeft: 'auto', marginRight: 'auto', marginTop: height / 30 }}>
                                <Icon name="close" size={width / 20} style={{ marginRight: 'auto', marginLeft: 'auto', marginTop: 'auto', marginBottom: 'auto' }} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: 'white',
        paddingBottom: width / 30
    },

    form: {

        paddingLeft: 20,
        width: w / 1.08,
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: '#eeeeee',
        borderRadius: 5,
        height: width / 8,
        borderWidth: 0.8,
        borderColor: '#ddd',
        marginTop: width / 30
    },
    forme: {

        paddingLeft: 20,
        width: w / 1.08,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderColor: 'red',
        borderWidth: 1,
        backgroundColor: '#eeeeee',
        borderRadius: 5,
        height: width / 8,
    },

})