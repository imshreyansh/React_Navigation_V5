import React from 'react';
import { View, Text, Platform, Image, ScrollView, TouchableOpacity, ImageBackground, Modal, ActionSheetIOS, Picker, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import report from '../../assets/images/report.png'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { DrawerActions } from 'react-navigation-drawer';
import { getUserByCredentials } from '../../utils/api/authorization'
import Pie from 'react-native-pie'
import VerticalBarChartBranchSales from './VerticalBarChartBranchSales'
import VerticalBarChartRevenueDetails from './VerticalBarChartRevenueDetails'
import { getAllBranch, getCurrency } from '../../utils/api/authorization'
import { getMemberDashBoard, getPackageDistribution, getMostSellingStock, getSystemYear, getAllBranchSales, getMemberAttendanceDashboard } from '../../utils/api/adminDashboard'
import i18n from 'i18n-js'

export default class AdminHomePage extends React.Component {
    _isMounted = false

    state = {
        rtl: null,
        currency: '',
        userDetails: "",
        userCredentials: "",
        avatar: '',
        employeeIdUser: '',
        memberDetails: '',
        dataPackage: [],
        allPackageDistributions: [],
        typeOfMemberAttendance: [{ name: i18n.t("january"), id: 0 }, { name: i18n.t("february"), id: 1 }, { name: i18n.t("march"), id: 2 }, { name: i18n.t("april"), id: 3 }, { name: i18n.t("may"), id: 4 }, { name: i18n.t("june"), id: 5 }
            , { name: i18n.t("july"), id: 6 }, { name: i18n.t("august"), id: 7 }, { name: i18n.t("september"), id: 8 }, { name: i18n.t("october"), id: 9 }, { name: i18n.t("november"), id: 10 }, { name: i18n.t("december"), id: 11 }],
        memberAttendance: 0,
        dataAttendance: [],
        totalAttendance: 0,
        allMemberAttendance: [],
        typeOfBranches: [],
        branch: '',
        branchLabel: i18n.t('all'),
        typeOfYear: [],
        salesYear: new Date().getFullYear(),
        typeOfSalesMonth: [{ name: i18n.t("january") }, { name: i18n.t("february") }, { name: i18n.t("march") }, { name: i18n.t("april") }, { name: i18n.t("may") }, { name: i18n.t("june") }
            , { name: i18n.t("july") }, { name: i18n.t("august") }, { name: i18n.t("september") }, { name: i18n.t("october") }, { name: i18n.t("november") }, { name: i18n.t("december") }],
        salesMonth: '',
        DataBranchSales: [],
        totalBranchSales: [],
        branchMax: '',
        DataRevenueDetails: [],
        typeOfYearRevenue: [],
        revenueYear: new Date().getFullYear(),
        typeOfRevenueMonth: [{ name: 'All' }, { name: 'Packages' }, { name: 'POS' }, { name: 'Classes' }],
        revenueMonth: 'All',
        totalRevenueSales: [],
        revenueMax: '',
        mostSellingStock: [],
        memberAttendanceText: i18n.t("january")
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            AsyncStorage.getItem('authedToken').then((token) => {
                const employeeIdUser = jwtDecode(token).credential
                this.setState({
                    employeeIdUser
                }, () => {

                    getUserByCredentials(this.state.employeeIdUser).then(res => {
                        if (res) {
                            this.setState({
                                userDetails: res.data.response,
                                userCredentials: res.data.response,
                                avatar: `${URL}/${res.data.response.avatar.path.replace(/\\/g, "/")}`
                            })
                        }
                    })
                })
            })
            getCurrency().then(res => {
                if (res) {
                    this.setState({
                        currency: res.data.response
                    })
                }
            })
            getSystemYear().then(res => {
                if (res) {
                    const data = []
                    for (let i = new Date(res.data.response.year).getFullYear(); i <= new Date().getFullYear(); i++) {
                        data.push({ name: JSON.stringify(i) })
                    }
                    this.setState({ typeOfYear: data.reverse(), typeOfYearRevenue: data.reverse() }, () => {
                        getAllBranch().then(res => {
                            if (res) {
                                this.setState({
                                    typeOfBranches: res.data.response
                                }, () => {
                                    this.memberDashBoard()
                                    this.memberPackageDistribution()
                                    this.mostSellingStock()
                                    this.branchSales()
                                    this.revenueDetails()
                                    this.getMemberAttendance()
                                })
                            }
                        })
                    })
                }
            })

        }


    }

    componentWillUnmount() {
        this._isMounted = false
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }



    static navigationOptions = ({ navigation }) => {
        return {
            tabBarLabel: i18n.t('home'),

        }
    }


    showSellingProductsPicker = () => {
        const data = this.state.typeOfBranches.map(l => l.branchName)
        const len = data.length
        data.push(i18n.t('all'))
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
        },
            (buttonIndex) => {
                this.setState({ branch: data[buttonIndex] });
                if (this.state.typeOfBranches[buttonIndex] !== undefined) {
                    this.setState({
                        branch: this.state.typeOfBranches[buttonIndex]._id,
                        branchLabel: this.state.typeOfBranches[buttonIndex].branchName
                    }, () => {
                        this.onBranchChange()
                    })
                } else {
                    this.setState({
                        branch: '',
                        branchLabel: i18n.t('all')
                    }, () => {
                        this.onBranchChange()
                    })
                }
            });
    }
    renderSellingProductsPicker() {
        if (Platform.OS === 'android') {
            return (
                <View style={[styles.formSelling, {
                    transform: transform(), borderTopRightRadius: i18n.locale === 'ar' ? 0 : 3,
                    borderBottomRightRadius: i18n.locale === 'ar' ? 0 : 3, borderBottomLeftRadius: i18n.locale === 'ar' ? 3 : 0, borderTopLeftRadius: i18n.locale === 'ar' ? 3 : 0
                }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: width / 50, width: w / 1.24, color: 'white' }}
                        selectedValue={this.state.branch}
                        onValueChange={(itemValue) => this.setState({ branch: itemValue }, () => this.onBranchChange())}>
                        <Picker.Item label={i18n.t('all')} value='' />
                        {
                            this.state.typeOfBranches.map((v) => {
                                return <Picker.Item label={v.branchName} value={v._id} key={v._id} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showSellingProductsPicker()}>
                    <View style={[styles.formSelling, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 20, color: 'white' }}>{this.state.branchLabel}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    onBranchChange = () => {
        this.memberDashBoard()
        this.memberPackageDistribution()
        this.mostSellingStock()
        this.branchSales()
        this.revenueDetails()
        this.getMemberAttendance()
    }

    memberDashBoard = () => {
        const data = {
            branch: this.state.branch
        }
        getMemberDashBoard(data).then(res => {
            if (res) {
                this.setState({
                    memberDetails: res.data.response
                })
            }
        })
    }

    memberPackageDistribution = () => {
        const data = {
            branch: this.state.branch
        }
        getPackageDistribution(data).then(res => {
            if (res) {
                this.setState({
                    allPackageDistributions: res.data.response
                }, () => {
                    const data = []
                    this.state.allPackageDistributions.packages.map(d => {
                        data.push({ percentage: (d.count / this.state.allPackageDistributions.total) * 100, color: d.color })
                    })
                    this.setState({
                        dataPackage: data
                    })
                })
            }
        })
    }

    getMemberAttendance = () => {
        const data = {
            branch: this.state.branch,
            month: this.state.memberAttendance
        }
        getMemberAttendanceDashboard(data).then(res => {
            if (res) {
                this.setState({
                    allMemberAttendance: res.data.response
                }, () => {
                    const data = []
                    let total = 0
                    this.state.allMemberAttendance.map(d => {
                        total += d.data
                    })
                    this.state.allMemberAttendance.map(d => {
                        data.push({ percentage: (d.data === 0 ? total : d.data / total) * 100, color: d.name === 'Present' ? '#74C5E9' : '#3E53A3' })
                    })
                    this.setState({
                        dataAttendance: data,
                        totalAttendance: total
                    })
                })
            }
        })
    }

    mostSellingStock = () => {
        const data = {
            branch: this.state.branch
        }
        getMostSellingStock(data).then(res => {
            if (res) {
                this.setState({
                    mostSellingStock: res.data.response
                })
            }
        })
    }

    branchSales = () => {
        const obj = {
            branch: this.state.branch,
            year: parseInt(this.state.salesYear)
        }
        getAllBranchSales(obj).then(res => {
            if (res) {
                this.setState({
                    DataBranchSales: [{ length: res.data.response[0], sales: `${(res.data.response[0]).toFixed(1)}`, month: i18n.t("Jan") }, { length: res.data.response[1], sales: `${(res.data.response[1]).toFixed(1)}`, month: i18n.t("Feb") }, { length: res.data.response[2], sales: `${(res.data.response[2]).toFixed(1)}`, month: i18n.t("Mar") }, { length: res.data.response[3], sales: `${(res.data.response[3]).toFixed(1)}`, month: i18n.t("Apr") }, { length: res.data.response[4], sales: `${(res.data.response[4]).toFixed(1)}`, month: i18n.t("May") }, { length: res.data.response[5], sales: `${(res.data.response[5]).toFixed(1)}`, month: i18n.t("Jun") }
                        , { length: res.data.response[6], sales: `${(res.data.response[6]).toFixed(1)}`, month: i18n.t("Jul") }, { length: res.data.response[7], sales: `${(res.data.response[7]).toFixed(1)}`, month: i18n.t("Aug") }, { length: res.data.response[8], sales: `${(res.data.response[8]).toFixed(1)}`, month: i18n.t("Sep") }, { length: res.data.response[9], sales: `${(res.data.response[9]).toFixed(1)}`, month: i18n.t("Oct") }, { length: res.data.response[10], sales: `${(res.data.response[10]).toFixed(1)}`, month: i18n.t("Nov") }, { length: res.data.response[11], sales: `${(res.data.response[11]).toFixed(1)}`, month: i18n.t("Dec") }],
                    totalBranchSales: res.data.response,
                    branchMax: Math.max(...res.data.response.map(d => d)),
                })
            }
        })
    }

    revenueDetails = () => {
        const obj = {
            branch: this.state.branch,
            year: parseInt(this.state.revenueYear),
            category: this.state.revenueMonth
        }
        getAllBranchSales(obj).then(res => {
            if (res) {
                this.setState({
                    DataRevenueDetails: [{ length: res.data.response[0], sales: `${(res.data.response[0]).toFixed(1)}`, month: i18n.t("Jan") }, { length: res.data.response[1], sales: `${(res.data.response[1]).toFixed(1)}`, month: i18n.t("Feb") }, { length: res.data.response[2], sales: `${(res.data.response[2]).toFixed(1)}`, month: i18n.t("Mar") }, { length: res.data.response[3], sales: `${(res.data.response[3]).toFixed(1)}`, month: i18n.t("Apr") }, { length: res.data.response[4], sales: `${(res.data.response[4]).toFixed(1)}`, month: i18n.t("May") }, { length: res.data.response[5], sales: `${(res.data.response[5]).toFixed(1)}`, month: i18n.t("Jun") }
                        , { length: res.data.response[6], sales: `${(res.data.response[6]).toFixed(1)}`, month: i18n.t("Jul") }, { length: res.data.response[7], sales: `${(res.data.response[7]).toFixed(1)}`, month: i18n.t("Aug") }, { length: res.data.response[8], sales: `${(res.data.response[8]).toFixed(1)}`, month: i18n.t("Sep") }, { length: res.data.response[9], sales: `${(res.data.response[9]).toFixed(1)}`, month: i18n.t("Oct") }, { length: res.data.response[10], sales: `${(res.data.response[10]).toFixed(1)}`, month: i18n.t("Nov") }, { length: res.data.response[11], sales: `${(res.data.response[11]).toFixed(1)}`, month: i18n.t("Dec") }],
                    totalRevenueSales: res.data.response,
                    revenueMax: Math.max(...res.data.response.map(d => d)),
                })
            }
        })
    }

    showBranchSalesPickerYear = () => {
        const data = this.state.typeOfYear.map(l => l.name)
        const len = data.length
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
        },
            (buttonIndex) => {
                if (this.state.typeOfYear[buttonIndex] !== undefined) {
                    this.setState({
                        salesYear: this.state.typeOfYear[buttonIndex].name,
                    }, () => { this.branchSales() })
                } else {
                    this.setState({
                        salesYear: '',
                    })
                }
            });
    }
    renderBranchSalesPickerYear() {
        if (Platform.OS === 'android') {
            return (
                <View style={[styles.form, { transform: transform(), }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: width / 30, width: w / 3 }}
                        textColor='white'
                        selectedValue={this.state.salesYear}
                        onValueChange={(itemValue) => this.setState({ salesYear: itemValue }, () => { this.branchSales() })}>
                        {
                            this.state.typeOfYear.map((v) => {
                                return <Picker.Item label={v.name} value={v.name} key={v.name} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showBranchSalesPickerYear()}>
                    <View style={[styles.form, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 20 }}>{this.state.salesYear}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    // showBranchSalesPickerMonth = () => {
    //     const data = this.state.typeOfSalesMonth.map(l => l.name)
    //     const len = data.length
    //     ActionSheetIOS.showActionSheetWithOptions({
    //         options: data,
    //         cancelButtonIndex: len - 1,
    //     },
    //         (buttonIndex) => {
    //             this.setState({ salesMonth: data[buttonIndex] });
    //             if (this.state.typeOfSalesMonth[buttonIndex] !== undefined) {
    //                 this.setState({
    //                     salesMonth: this.state.typeOfSalesMonth[buttonIndex].name,
    //                 })
    //             } else {
    //                 this.setState({
    //                     salesMonth: '',
    //                 })
    //             }
    //         });
    // }
    // renderBranchSalesPickerMonth() {
    //     if (Platform.OS === 'android') {
    //         return (
    //             <View style={[styles.form, { transform: transform(), marginLeft: width / 30 }]}>
    //                 <Picker
    //                     mode='dropdown'
    //                     style={{ bottom: width / 30, width: w / 3 }}
    //                     selectedValue={this.state.salesMonth}
    //                     onValueChange={(itemValue) => this.setState({ salesMonth: itemValue })}>
    //                     {
    //                         this.state.typeOfSalesMonth.map((v) => {
    //                             return <Picker.Item label={v.name} value={v.name} key={v.name} />
    //                         })
    //                     }
    //                 </Picker>
    //             </View>
    //         )
    //     } else {
    //         return (
    //             <TouchableOpacity onPress={() => this.showTrainerPicker()}>
    //                 <View style={[styles.form, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
    //                     <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
    //                         <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 20 }}>{this.state.salesMonth}</Text>
    //                         <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
    //                     </View>
    //                 </View>
    //             </TouchableOpacity>
    //         )
    //     }
    // }

    showRevenuePickerYear = () => {
        const data = this.state.typeOfYearRevenue.map(l => l.name)
        const len = data.length
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
            cancelButtonIndex: len - 1,
        },
            (buttonIndex) => {
                this.setState({ revenueYear: data[buttonIndex] });
                if (this.state.typeOfYearRevenue[buttonIndex] !== undefined) {
                    this.setState({
                        revenueYear: this.state.typeOfYearRevenue[buttonIndex].name,
                    }, () => {
                        this.revenueDetails()
                    })
                } else {
                    this.setState({
                        revenueYear: '',
                    })
                }
            });
    }
    renderRevenuePickerYear() {
        if (Platform.OS === 'android') {
            return (
                <View style={[styles.form, { transform: transform(), }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: width / 30, width: w / 3 }}
                        selectedValue={this.state.revenueYear}
                        onValueChange={(itemValue) => this.setState({ revenueYear: itemValue }, () => { this.revenueDetails() })}>
                        {
                            this.state.typeOfYearRevenue.map((v) => {
                                return <Picker.Item label={v.name} value={v.name} key={v.name} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showRevenuePickerYear()}>
                    <View style={[styles.form, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 20 }}>{this.state.revenueYear}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    showRevenuePickerMonth = () => {
        const data = this.state.typeOfRevenueMonth.map(l => l.name)
        const len = data.length
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
        },
            (buttonIndex) => {
                this.setState({ revenueMonth: data[buttonIndex] });
                if (this.state.typeOfRevenueMonth[buttonIndex] !== undefined) {
                    this.setState({
                        revenueMonth: this.state.typeOfRevenueMonth[buttonIndex].name,
                    }, () => {
                        this.revenueDetails()

                    })
                } else {
                    this.setState({
                        revenueMonth: '',
                    })
                }
            });
    }
    renderRevenuePickerMonth() {
        if (Platform.OS === 'android') {
            return (
                <View style={[styles.form, { transform: transform(), marginLeft: width / 30 }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: width / 30, width: w / 3 }}
                        selectedValue={this.state.revenueMonth}
                        onValueChange={(itemValue) => this.setState({ revenueMonth: itemValue }, () => this.revenueDetails())}>
                        {
                            this.state.typeOfRevenueMonth.map((v) => {
                                return <Picker.Item label={v.name} value={v.name} key={v.name} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showRevenuePickerMonth()}>
                    <View style={[styles.form, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 20 }}>{this.state.revenueMonth}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }
    showMemberAttendancePicker = () => {
        const data = this.state.typeOfMemberAttendance.map(l => l.name)
        const len = data.length
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
        },
            (buttonIndex) => {
                if (this.state.typeOfMemberAttendance[buttonIndex] !== undefined) {
                    this.setState({
                        memberAttendance: this.state.typeOfMemberAttendance[buttonIndex].id,
                        memberAttendanceText: this.state.typeOfMemberAttendance[buttonIndex].name
                    }, () => this.getMemberAttendance())
                } else {
                    this.setState({
                        memberAttendance: '',
                    })
                }
            });
    }
    renderMemberAttendancePicker() {
        if (Platform.OS === 'android') {
            return (
                <View style={[styles.form, { transform: transform(), }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: width / 30, width: w / 3 }}
                        selectedValue={this.state.memberAttendance}
                        onValueChange={(itemValue) => this.setState({ memberAttendance: itemValue }, () => this.getMemberAttendance())}>
                        {
                            this.state.typeOfMemberAttendance.map((v, i) => {
                                return <Picker.Item label={v.name} value={i} key={v.name} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showMemberAttendancePicker()}>
                    <View style={[styles.form, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 20, width: w / 3.2 }}>{this.state.memberAttendanceText}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }




    render() {
        let totalBranchSalesValue = 0
        this.state.totalBranchSales.forEach(sale => totalBranchSalesValue += sale)
        const branchDifference = this.state.branchMax / 5
        const revenueDifference = this.state.revenueMax / 5
        return (
            <View style={{ transform: transform(), backgroundColor: 'white', flex: 1 }}>

                <View elevation={3} style={{ width: w, height: width / 7, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}>
                            <Icon name='toggle' size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />
                        </TouchableOpacity>

                        <Text style={{ marginLeft: width / 20, top: width / 30, fontSize: width / 18, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('dashboard')}</Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={{ paddingBottom: width / 30, backgroundColor: 'white' }}>
                    <View style={{ width: w / 1.1, flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 80 }}>
                        <View style={{ backgroundColor: 'orange', width: w / 10, height: width / 10, marginTop: width / 30, borderTopLeftRadius: 3, borderBottomLeftRadius: 3 }}>
                            <Icon name='notify-branch' size={width / 15} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} color="white" />
                        </View>
                        {this.renderSellingProductsPicker()}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 50 }}>
                        <View elevation={1.4} style={{ borderWidth: 1, paddingBottom: width / 50, width: w / 2.2, borderColor: '#ddd', borderRadius: 3, marginTop: width / 30, borderBottomWidth: 5, borderBottomColor: '#2196f3' }}>
                            <View style={{ width: w / 2.2, flexDirection: 'column', marginTop: width / 80 }}>
                                <Icon name='total-members' size={width / 12} style={{ marginLeft: width / 30 }} color="#2196f3" />
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ fontSize: width / 18, marginLeft: width / 30, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.memberDetails ? this.state.memberDetails.total : '0'}</Text>
                                    <Text style={{ fontSize: width / 28, marginLeft: width / 30, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('totalMembers')}</Text>
                                </View>
                            </View>
                        </View>
                        <View elevation={1.4} style={{ borderWidth: 1, paddingBottom: width / 50, width: w / 2.2, borderColor: '#ddd', borderRadius: 3, marginTop: width / 30, borderBottomWidth: 5, borderBottomColor: 'orange' }}>
                            <View style={{ width: w / 2.2, flexDirection: 'column', marginTop: width / 80 }}>
                                <Icon name='new-members' size={width / 12} style={{ marginLeft: width / 30 }} color="orange" />
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ fontSize: width / 18, marginLeft: width / 30, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.memberDetails ? this.state.memberDetails.newMember : '0'}</Text>
                                    <Text style={{ fontSize: width / 28, marginLeft: width / 30, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('newMembers')}</Text>
                                </View>
                            </View>
                        </View>
                        <View elevation={1.4} style={{ borderWidth: 1, paddingBottom: width / 50, width: w / 2.2, borderColor: '#ddd', borderRadius: 3, marginTop: width / 30, borderBottomWidth: 5, borderBottomColor: '#64dd17' }}>
                            <View style={{ width: w / 2.2, flexDirection: 'column', marginTop: width / 80 }}>
                                <Icon name='active-members' size={width / 12} style={{ marginLeft: width / 30 }} color="#64dd17" />
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ fontSize: width / 18, marginLeft: width / 30, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.memberDetails ? this.state.memberDetails.activeMember : '0'}</Text>
                                    <Text style={{ fontSize: width / 28, marginLeft: width / 30, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('activeMembers')}</Text>
                                </View>
                            </View>
                        </View>
                        <View elevation={1.4} style={{ borderWidth: 1, paddingBottom: width / 50, width: w / 2.2, borderColor: '#ddd', borderRadius: 3, marginTop: width / 30, borderBottomWidth: 5, borderBottomColor: 'red' }}>
                            <View style={{ width: w / 2.2, flexDirection: 'column', marginTop: width / 80 }}>
                                <Icon name='pending-members' size={width / 12} style={{ marginLeft: width / 30 }} color="red" />
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ fontSize: width / 18, marginLeft: width / 30, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.memberDetails ? this.state.memberDetails.pending : '0'}</Text>
                                    <Text style={{ fontSize: width / 28, marginLeft: width / 30, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('pendingMembers')}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View elevation={1.4} style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, paddingBottom: width / 30, borderWidth: 1, borderColor: '#ddd', borderRadius: 3 }}>
                        <Text style={{ fontSize: width / 24, marginLeft: width / 30, color: 'grey', fontWeight: 'bold', marginTop: width / 50, transform: transform(), textAlign: textAlign() }}>{i18n.t('packageDetails')}</Text>
                        <View style={{ borderBottomWidth: 1, width: w / 1.09, marginLeft: 'auto', marginRight: 'auto', borderBottomColor: '#ddd', marginTop: width / 80 }} />
                        <View style={{ marginTop: width / 30, alignItems: 'center', justifyContent: 'center', }}>
                            <Pie
                                radius={width / 4.2}
                                innerRadius={width / 6.5}
                                sections={this.state.dataPackage}
                                strokeCap={'butt'}

                            />
                            <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width: w / 1.09, marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={{ fontSize: width / 28, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('total')}</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: width / 15, color: '#333', transform: transform(), textAlign: textAlign() }}>{this.state.allPackageDistributions.total}</Text>
                            </View>
                        </View>
                        <View style={{ width: w / 1.3, marginTop: width / 20, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginLeft: width / 40 }}>

                            {this.state.allPackageDistributions !== undefined && this.state.allPackageDistributions.packages ? this.state.allPackageDistributions.packages.map((d, i) => {
                                return (
                                    <View key={i} style={{ flexDirection: 'row', marginTop: width / 50 }}>
                                        <View style={{ width: w / 3, flexDirection: 'row' }}>
                                            <View style={{ backgroundColor: d.color, width: w / 25, height: w / 25, marginTop: 'auto', marginBottom: 'auto' }} />
                                            <Text style={{ fontSize: width / 35, marginLeft: width / 80, color: '#333', width: w / 4.8, marginTop: 'auto', marginBottom: 'auto', transform: transform(), textAlign: textAlign() }}>{d.packageName}</Text>
                                            <Text style={{ fontSize: width / 35, color: d.color, marginLeft: width / 80, width: w / 7, fontWeight: 'bold', marginTop: 'auto', marginBottom: 'auto', transform: transform(), textAlign: textAlign() }}>{d.count} ({this.state.allPackageDistributions.total ? ((d.count / this.state.allPackageDistributions.total) * 100).toFixed(1) : '0'}%)</Text>
                                        </View>
                                    </View>


                                )
                            }) : <View></View>}
                        </View>

                        {/* <View style={{ width: w / 1.2, justifyContent: 'flex-end', flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.push('AdminPackageDetails')}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: width / 35, color: '#1976d2', transform: transform(), textAlign: textAlign() }}>{i18n.t('viewReport')}</Text>
                                    <Image style={{ width: width / 18, height: width / 18, marginLeft: width / 30, transform: transform() }} source={report} />
                                </View>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                    <View elevation={1.4} style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, paddingBottom: width / 30, borderWidth: 1, borderColor: '#ddd', borderRadius: 3 }}>
                        <Text style={{ fontSize: width / 24, marginLeft: width / 30, color: 'grey', fontWeight: 'bold', marginTop: width / 50, transform: transform(), textAlign: textAlign() }}>{i18n.t('branchSales')}</Text>
                        <View style={{ borderBottomWidth: 1, width: w / 1.09, marginLeft: 'auto', marginRight: 'auto', borderBottomColor: '#ddd', marginTop: width / 80 }} />
                        <View style={{ width: w / 1.1, justifyContent: 'flex-end', flexDirection: 'row' }}>
                            {this.renderBranchSalesPickerYear()}
                            {/* {this.renderBranchSalesPickerMonth()} */}
                        </View>
                        <View style={{ marginLeft: width / 30, marginTop: width / 30 }}>
                            <Text style={{ fontSize: width / 28, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('totalSales')}</Text>
                            <Text style={{ fontSize: width / 22, color: 'red', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.currency} {(totalBranchSalesValue).toFixed(1)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', transform: transform() }}>
                            <View style={{ flexDirection: 'column', height: height / 2.5, justifyContent: 'space-between', marginRight: width / 30 }}>
                                <View>
                                    <Text style={{ color: 'grey', fontSize: width / 30 }}>{this.state.branchMax ? Math.ceil(this.state.branchMax) : 100}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: 'grey', fontSize: width / 30 }}>{(branchDifference * 4).toFixed(0)}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: 'grey', fontSize: width / 30 }}>{(branchDifference * 3).toFixed(0)}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: 'grey', fontSize: width / 30 }}>{(branchDifference * 2).toFixed(0)}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: 'grey', fontSize: width / 30 }}>{(branchDifference).toFixed(0)}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: 'grey', fontSize: width / 30 }}>{0}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                    <VerticalBarChartBranchSales data={this.state.DataBranchSales} barMaxHeight={height / 2.8} barWidth={width / 8} />
                                </View>

                            </View>
                        </View>
                        {/* <View style={{ width: w / 1.2, justifyContent: 'flex-end', flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.push('AdminBranchSales')}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: width / 35, color: '#1976d2', transform: transform(), textAlign: textAlign() }}>{i18n.t('viewReport')}</Text>
                                    <Image style={{ width: width / 18, height: width / 18, marginLeft: width / 30, transform: transform() }} source={report} />
                                </View>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                    <View elevation={1.4} style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, paddingBottom: width / 30, borderWidth: 1, borderColor: '#ddd', borderRadius: 3 }}>
                        <Text style={{ fontSize: width / 24, marginLeft: width / 30, color: 'grey', fontWeight: 'bold', marginTop: width / 50, transform: transform(), textAlign: textAlign() }}>{i18n.t('revenueDetails')}</Text>
                        <View style={{ borderBottomWidth: 1, width: w / 1.09, marginLeft: 'auto', marginRight: 'auto', borderBottomColor: '#ddd', marginTop: width / 80 }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: w / 1.1 }}>
                            <View style={{ width: w / 1.4, justifyContent: 'space-between', flexDirection: 'row' }}>
                                <View>
                                    {this.renderRevenuePickerYear()}
                                </View>
                                <View>
                                    {this.renderRevenuePickerMonth()}
                                </View>
                            </View>
                        </View>

                        <View style={{ marginLeft: width / 30, marginTop: width / 30 }}>
                            <Text style={{ fontSize: width / 28, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('salesIn')}</Text>
                            <Text style={{ fontSize: width / 22, color: 'red', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.currency}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', transform: transform() }}>
                            <View style={{ flexDirection: 'column', height: height / 2.5, justifyContent: 'space-between', marginRight: width / 30 }}>
                                <View>
                                    <Text style={{ color: 'grey', fontSize: width / 30 }}>{this.state.revenueMax ? Math.ceil(this.state.revenueMax) : 100}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: 'grey', fontSize: width / 30 }}>{(revenueDifference * 4).toFixed(0)}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: 'grey', fontSize: width / 30 }}>{(revenueDifference * 3).toFixed(0)}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: 'grey', fontSize: width / 30 }}>{(revenueDifference * 4).toFixed(0)}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: 'grey', fontSize: width / 30 }}>{(revenueDifference).toFixed(0)}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: 'grey', fontSize: width / 30 }}>{0}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                    <VerticalBarChartRevenueDetails data={this.state.DataRevenueDetails} barMaxHeight={height / 2.8} barWidth={width / 8} />
                                </View>

                            </View>
                        </View>
                        {/* <View style={{ width: w / 1.2, justifyContent: 'flex-end', flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.push('AdminRevenueDetails')}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: width / 35, color: '#1976d2', transform: transform(), textAlign: textAlign() }}>{i18n.t('viewReport')}</Text>
                                    <Image style={{ width: width / 18, height: width / 18, marginLeft: width / 30, transform: transform() }} source={report} />
                                </View>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                    <View elevation={1.4} style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, paddingBottom: width / 30, borderWidth: 1, borderColor: '#ddd', borderRadius: 3 }}>
                        <Text style={{ fontSize: width / 24, marginLeft: width / 30, color: 'grey', fontWeight: 'bold', marginTop: width / 50, transform: transform(), textAlign: textAlign() }}>{i18n.t('memberAttendance')}</Text>
                        <View style={{ borderBottomWidth: 1, width: w / 1.09, marginLeft: 'auto', marginRight: 'auto', borderBottomColor: '#ddd', marginTop: width / 80 }} />
                        <View style={{ width: w / 1.2, justifyContent: 'flex-end', flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 80 }}>
                            {this.renderMemberAttendancePicker()}
                        </View>
                        <View style={{ marginTop: width / 30, alignItems: 'center', justifyContent: 'center', }}>
                            <Pie
                                radius={width / 4.2}
                                innerRadius={width / 6.5}
                                sections={this.state.dataAttendance}
                                strokeCap={'butt'}

                            />
                            <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width: w / 1.09, marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={{ fontSize: width / 28, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('total')}</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: width / 15, color: '#333', transform: transform(), textAlign: textAlign() }}>{this.state.memberDetails ? this.state.memberDetails.activeMember : '0'}</Text>
                            </View>
                        </View>
                        <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.5, marginTop: width / 20, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ backgroundColor: '#74C5E9', width: w / 25, height: w / 25, marginTop: 'auto', marginBottom: 'auto' }} />
                                <Text style={{ fontSize: width / 30, marginLeft: width / 50, color: '#333', transform: transform(), textAlign: textAlign() }}>{i18n.t('present')}</Text>
                                <Text style={{ fontSize: width / 28, marginLeft: width / 50, color: '#74C5E9', fontWeight: 'bold', marginTop: 'auto', marginBottom: 'auto', transform: transform(), textAlign: textAlign() }}>{this.state.allMemberAttendance.length > 0 ? (this.state.allMemberAttendance[0].data) : '0'}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ backgroundColor: '#3E53A3', width: w / 25, height: w / 25, marginTop: 'auto', marginBottom: 'auto' }} />
                                <Text style={{ fontSize: width / 30, marginLeft: width / 50, color: '#333', transform: transform(), textAlign: textAlign() }}>{i18n.t('absent')}</Text>
                                <Text style={{ fontSize: width / 28, marginLeft: width / 50, color: '#3E53A3', fontWeight: 'bold', marginTop: 'auto', marginBottom: 'auto', transform: transform(), textAlign: textAlign() }}>{this.state.allMemberAttendance.length > 0 ? (this.state.allMemberAttendance[1].data) : '0'}</Text>
                            </View>
                        </View>
                        {/* <View style={{ width: w / 1.2, justifyContent: 'flex-end', flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.push('AdminMemberAttendance')}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: width / 35, color: '#1976d2', transform: transform(), textAlign: textAlign() }}>{i18n.t('viewReport')}</Text>
                                    <Image style={{ width: width / 18, height: width / 18, marginLeft: width / 30, transform: transform() }} source={report} />
                                </View>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                    <View elevation={1.4} style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, paddingBottom: width / 30, borderWidth: 1, borderColor: '#ddd', borderRadius: 3 }}>
                        <Text style={{ fontSize: width / 24, marginLeft: width / 30, color: 'grey', fontWeight: 'bold', marginTop: width / 50, transform: transform(), textAlign: textAlign() }}>{i18n.t('mostSellingProducts')}</Text>
                        <View style={{ borderBottomWidth: 1, width: w / 1.09, marginLeft: 'auto', marginRight: 'auto', borderBottomColor: '#ddd', marginTop: width / 80 }} />

                        <View style={{ width: w / 1.15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <View style={{ width: w / 2.5 }}>
                                <Text style={{ fontSize: width / 28, color: 'black', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('productName')}</Text>
                            </View>
                            <View style={{ width: w / 4 }}>
                                <Text style={{ fontSize: width / 28, color: 'black', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('location')}</Text>
                            </View>
                            <View style={{ width: w / 4 }}>
                                <Text style={{ fontSize: width / 28, color: 'black', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('price')}</Text>
                            </View>
                        </View>
                        {this.state.mostSellingStock.map((d, i) => {
                            const avatar = `${URL}/${d.image.path.replace(/\\/g, "/")}`
                            const productImage = JSON.parse(JSON.stringify({ uri: avatar }))
                            return (
                                <View elevation={1} style={{ padding: width / 50, width: w / 1.15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, borderRadius: 3 }}>
                                    <View style={{ width: w / 2.5, flexDirection: 'row' }}>
                                        <Image style={{ width: width / 15, height: width / 15, transform: transform() }} source={productImage} />
                                        <Text style={{ fontSize: width / 32, color: '#333', marginLeft: width / 50, width: w / 4, marginTop: 'auto', marginBottom: 'auto', transform: transform(), textAlign: textAlign() }}>{d.itemName}</Text>
                                    </View>
                                    <View style={{ width: w / 4 }}>
                                        <Text style={{ fontSize: width / 32, color: '#333', width: w / 4.8, marginTop: 'auto', marginBottom: 'auto', transform: transform(), textAlign: textAlign() }}>{d.branch.branchName}</Text>
                                    </View>
                                    <View style={{ width: w / 4 }}>
                                        <Text style={{ fontSize: width / 32, color: 'orange', fontWeight: 'bold', width: w / 4.8, marginTop: 'auto', marginBottom: 'auto', transform: transform(), textAlign: textAlign() }}>{this.state.currency} {(d.sellingPrice * (d.originalQuantity - d.quantity)).toFixed(2)}</Text>
                                    </View>


                                </View>
                            )
                        })}

                        {/* <View style={{ width: w / 1.2, justifyContent: 'flex-end', flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.push('AdminMostSellingProduct')}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: width / 35, color: '#1976d2', transform: transform(), textAlign: textAlign() }}>{i18n.t('viewReport')}</Text>
                                    <Image style={{ width: width / 18, height: width / 18, marginLeft: width / 30, transform: transform() }} source={report} />
                                </View>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </ScrollView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    form: {
        marginTop: width / 30,
        width: w / 3,
        borderColor: '#ddd',
        borderWidth: 1,
        backgroundColor: '#ddd',
        borderRadius: 3,
        height: width / 12,
    },
    formSelling: {
        marginTop: width / 30,
        width: w / 1.24,
        backgroundColor: 'orange',

        height: width / 10,
    }
})