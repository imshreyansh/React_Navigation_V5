import React from 'react';
import { View, Text, Platform, Image, ScrollView, TouchableOpacity, ImageBackground, Modal, ActionSheetIOS, Picker, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import report from '../../../assets/images/report.png'
import { Icon, width, height, w, h, transform, textAlign, URL, getPageWiseData, dateToDDMMYYYY, AMPM } from '../../../utils/api/helpers'
import { DrawerActions } from 'react-navigation-drawer';
import { getUserByCredentials } from '../../../utils/api/authorization'
import Pie from 'react-native-pie'
import DateTimePicker from "react-native-modal-datetime-picker";
import { getAllBranch, getCurrency } from '../../../utils/api/authorization'
import { getDashboardTotalSales, getSystemYear, getReport } from '../../../utils/api/adminDashboard'
import i18n from 'i18n-js'
import { showMessage } from 'react-native-flash-message';

export default class Reports extends React.Component {
    _isMounted = false

    state = {
        rtl: null,
        currency: '',
        userDetails: "",
        userCredentials: "",
        avatar: '',
        employeeIdUser: '',
        memberDetails: '',
        typeOfBranches: [],
        branch: '',
        branchLabel: i18n.t('all'),
        typeOfYear: [],
        salesYear: new Date().getFullYear(),
        showDate: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
        dateSelected: new Date(),
        visible: false,
        transactionType: [{ percentage: 80, color: 'red' }, { percentage: 20, color: 'green' }],
        transactionTypeTotal: 20,
        transactionTypeData: '',
        salesByBranch: [{ percentage: 80, color: 'red' }, { percentage: 20, color: 'green' }],
        salesByBranchTotal: 30,
        salesByBranchData: '',
        totalAmount: 0,
        showAll: false,
        POSAmount: 0.000,
        PackagesAmount: 0.000,
        ClassesAmount: 0.000,
        FreezeAmount: 0.000,
        tableData: [],
        allTable: [],
        pageNumber: 1,
        allPages: [],
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
                                    this.onTotalSalesPie()
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
        this.setState({
            showAll: false
        })
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
            showDate: `${new Date(date).getDate()}/${new Date(date).getMonth() + 1}/${new Date(date).getFullYear()}`,
            showAll: false
        }, () => {
            this.onTotalSalesPie()
        })
        this.hideDateTimePicker()
    }

    colorGenerate = (l) => {
        for (let i = 0; i < l; i++) {
            return `${'#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)}`
        }
    }
    generate = (branch) => {
        const reportInfo = {
            reportType: 'Sales',
            reportName: 'General Sales',
            branch: branch === '' ? '' : branch,
            fromDate: this.state.dateSelected,
            toDate: this.state.dateSelected,
        }
        getReport(reportInfo).then(res => {
            if (res) {
                this.setState({
                    transactionTypeData: res.data.response.transactionType,
                    salesByBranchData: res.data.response.branches,
                    tableData: res.data.response.response,
                    allTable: getPageWiseData(this.state.pageNumber, this.getAllData(res.data.response.response), 5),
                    showAll: true
                }, () => {
                    const allPages = []
                    for (let i = 0; i < Math.ceil((this.getAllData(res.data.response.response)).length / 5); i++) {
                        allPages.push(i)
                    }
                    const totalAmount = []
                    const totalAmountSales = []

                    this.state.salesByBranchData.forEach(d => {
                        totalAmountSales.push(d.amount)
                    })
                    const totalSales = totalAmountSales.reduce((a, b) => a + b)


                    this.state.transactionTypeData.forEach(d => {
                        totalAmount.push(d.amount)
                    })
                    const total = totalAmount.reduce((a, b) => a + b)
                    this.setState({
                        POSAmount: this.state.transactionTypeData.filter(d => d.transactionName === 'POS')[0].amount,
                        PackagesAmount: this.state.transactionTypeData.filter(d => d.transactionName === 'Packages')[0].amount,
                        ClassesAmount: this.state.transactionTypeData.filter(d => d.transactionName === 'Classes')[0].amount,
                        FreezeAmount: this.state.transactionTypeData.filter(d => d.transactionName === 'Freeze')[0].amount,
                        transactionTypeTotal: total,
                        salesByBranchTotal: totalSales,
                        allPages
                    }, () => {

                        const transactionType = []
                        const salesByBranch = []

                        this.state.salesByBranchData.forEach(d => {
                            salesByBranch.push({ percentage: isNaN(Math.round((d.amount / this.state.salesByBranchTotal) * 100)) ? 0 : Math.round((d.amount / this.state.salesByBranchTotal) * 100), color: this.colorGenerate(this.state.salesByBranchData.length), branchName: d.branchName, amount: d.amount })
                        })

                        this.state.transactionTypeData.forEach(d => {
                            transactionType.push({ percentage: isNaN(Math.round((d.amount / this.state.transactionTypeTotal) * 100)) ? 0 : Math.round((d.amount / this.state.transactionTypeTotal) * 100), color: d.transactionName === 'POS' ? '#dc3545' : d.transactionName === 'Classes' ? '#ffc107' : d.transactionName === 'Freeze' ? '#009688' : '#28a745' })
                        })
                        this.setState({
                            transactionType,
                            salesByBranch
                        })
                    })

                })
            }
        })
    }


    onTotalSalesPie = () => {
        const obj = {
            date: this.state.dateSelected,
            category: 'all',
            type: 'all'
        }
        getDashboardTotalSales(obj).then(res => {
            if (res) {
                let val = 0
                res.data.response.branches.forEach(d => {
                    val += d.amount
                })
                this.setState({
                    totalAmount: val,
                })
            } else {
                showMessage({
                    message: 'Something Went Wrong! Please try again',
                    type: "danger",
                })
            }
        })
    }

    colorTable = (i) => {
        if (i % 2 === 0) {
            return '#ddd'
        } else {
            return 'white'
        }
    }

    createDate = (d) => {
        if (isNaN(new Date(d))) {
            return 'NA'
        } else {
            return `${new Date(d).getDate()}/${new Date(d).getMonth() + 1}/${new Date(d).getFullYear()}`

        }
    }

    createTime = (t) => {
        var shours = new Date(t).getHours()
        var sminutes = new Date(t).getMinutes()
        var sampm = shours >= 12 ? 'PM' : 'AM'
        shours = shours % 12
        shours = shours ? shours : 12  // the hour '0' should be '12'
        return shours + ':' + `${("0" + sminutes).slice(-2)}` + ' ' + sampm
    }

    onClickArrowPage = (type, data, pn) => {
        if (type == 'neg' && this.state.pageNumber > 0) {
            this.setState({
                allTable: getPageWiseData(this.state.pageNumber - 1, data, 5),
            }, () => {
                this.setState({
                    pageNumber: this.state.pageNumber - 1
                })
            })
        } else if (type === 'pos') {
            this.setState({
                allTable: getPageWiseData(this.state.pageNumber + 1, data, 5),
            }, () => {
                this.setState({
                    pageNumber: this.state.pageNumber + 1
                })
            })
        } else {
            this.setState({
                allTable: getPageWiseData(pn, data, 5),
            }, () => {
                this.setState({
                    pageNumber: pn
                })
            })
        }
    }

    getAllData = (tableData) => {
        let tabledData = []
        let count = 1
        let totalPaidAmount = 0, totalCash = 0, totalCard = 0, totalDigital = 0, totalCheque = 0, totalDiscount = 0
        tableData.forEach(data => {
            if (data.transactionType === 'Packages') {
                const { memberId, credentialId: { userName }, branch, packageDetails, admissionDate, mobileNo, transactionType } = data
                packageDetails.forEach(doc => {
                    if (doc.Installments && doc.Installments.length) {
                        doc.Installments.forEach(installment => {
                            if (installment.paidStatus === 'Paid' && installment.display) {
                                totalPaidAmount += (installment.totalAmount ? +installment.totalAmount : 0)
                                totalCash += (installment.cashAmount ? +installment.cashAmount : 0)
                                totalCard += (installment.cardAmount ? +installment.cardAmount : 0)
                                totalDigital += (installment.digitalAmount ? +installment.digitalAmount : 0)
                                totalCheque += (installment.chequeAmount ? +installment.chequeAmount : 0)
                                totalDiscount += (installment.discount ? +installment.discount : 0)
                                tabledData.push({
                                    "SNo": count,
                                    "ReceiptNo": installment.orderNo,
                                    "DateAndTime": `${dateToDDMMYYYY(installment.dateOfPaid)} ${AMPM(installment.timeOfPaid)}`,
                                    "MemberID": memberId,
                                    "MemberName": userName ? userName : 'NA',
                                    "AdmissionDate": dateToDDMMYYYY(admissionDate),
                                    "MobileNo": mobileNo,
                                    // "Email ID": email,
                                    "Branch": doc.salesBranch.branchName,
                                    "TransactionType": transactionType,
                                    "Name": `${doc.packages.packageName} (${installment.installmentName})`,
                                    "PaidAmount": installment.totalAmount ? `${installment.totalAmount.toFixed(3)}` : '0.000',
                                    "Discount": installment.discount ? `${installment.discount.toFixed(3)}` : `0.000`,
                                    "Cash": installment.cashAmount ? `${installment.cashAmount.toFixed(3)}` : `0.000`,
                                    "Card": installment.cardAmount ? `${installment.cardAmount.toFixed(3)}` : `0.000`,
                                    "Digital": installment.digitalAmount ? `${installment.digitalAmount.toFixed(3)}` : `0.000`,
                                    "Cheque": installment.chequeAmount ? `${installment.chequeAmount.toFixed(3)}` : `0.000`,
                                    "DoneBy": installment.doneBy ? installment.doneBy.userName : 'NA'
                                })
                                count = count + 1
                            }
                        })
                    } else {
                        if ((doc.paidStatus === 'Paid' || doc.paidStatus === 'Installment') && doc.display) {
                            totalPaidAmount += (doc.totalAmount ? +doc.totalAmount : 0)
                            totalCash += (doc.cashAmount ? +doc.cashAmount : 0)
                            totalCard += (doc.cardAmount ? +doc.cardAmount : 0)
                            totalDigital += (doc.digitalAmount ? +doc.digitalAmount : 0)
                            totalCheque += (doc.chequeAmount ? +doc.chequeAmount : 0)
                            totalDiscount += (doc.discount ? +doc.discount : 0)
                            tabledData.push({
                                "SNo": count,
                                "ReceiptNo": doc.orderNo,
                                "DateAndTime": `${dateToDDMMYYYY(doc.dateOfPaid)} ${AMPM(doc.timeOfPaid)}`,
                                "MemberID": memberId,
                                "MemberName": userName ? userName : 'NA',
                                "AdmissionDate": dateToDDMMYYYY(admissionDate),
                                "MobileNo": mobileNo,
                                // "Email ID": email,
                                "Branch": doc.salesBranch.branchName,
                                "TransactionType": transactionType,
                                "Name": doc.packages.packageName,
                                "PaidAmount": doc.totalAmount ? `${doc.totalAmount.toFixed(3)}` : '0.000',
                                "Discount": doc.discount ? `${doc.discount.toFixed(3)}` : `0.000`,
                                "Cash": doc.cashAmount ? `${doc.cashAmount.toFixed(3)}` : `0.000`,
                                "Card": doc.cardAmount ? `${doc.cardAmount.toFixed(3)}` : `0.000`,
                                "Digital": doc.digitalAmount ? `${doc.digitalAmount.toFixed(3)}` : `0.000`,
                                "Cheque": doc.chequeAmount ? `${doc.chequeAmount.toFixed(3)}` : `0.000`,
                                "DoneBy": doc.doneBy ? doc.doneBy.userName : 'NA'
                            })
                            count = count + 1
                        }
                    }
                    if (doc.trainerDetails && doc.trainerDetails.length) {
                        doc.trainerDetails.forEach(trainerDetail => {
                            if (trainerDetail.Installments && trainerDetail.Installments.length) {
                                trainerDetail.Installments.forEach(installment => {
                                    if (installment.paidStatus === 'Paid' && installment.display) {
                                        totalPaidAmount += (installment.totalAmount ? +installment.totalAmount : 0)
                                        totalCash += (installment.cashAmount ? +installment.cashAmount : 0)
                                        totalCard += (installment.cardAmount ? +installment.cardAmount : 0)
                                        totalDigital += (installment.digitalAmount ? +installment.digitalAmount : 0)
                                        totalCheque += (installment.chequeAmount ? +installment.chequeAmount : 0)
                                        totalDiscount += (installment.discount ? +installment.discount : 0)
                                        tabledData.push({
                                            "SNo": count,
                                            "ReceiptNo": installment.orderNo,
                                            "DateAndTime": `${dateToDDMMYYYY(installment.dateOfPaid)} ${AMPM(installment.timeOfPaid)}`,
                                            "MemberID": memberId,
                                            "MemberName": userName ? userName : 'NA',
                                            "AdmissionDate": dateToDDMMYYYY(admissionDate),
                                            "MobileNo": mobileNo,
                                            // "Email ID": email,
                                            "Branch": doc.salesBranch.branchName,
                                            "TransactionType": transactionType,
                                            "Name": `${trainerDetail.trainer.credentialId.userName} (${installment.installmentName})`,
                                            "PaidAmount": installment.totalAmount ? `${installment.totalAmount.toFixed(3)}` : '0.000',
                                            "Discount": installment.discount ? `${installment.discount.toFixed(3)}` : `0.000`,
                                            "Cash": installment.cashAmount ? `${installment.cashAmount.toFixed(3)}` : `0.000`,
                                            "Card": installment.cardAmount ? `${installment.cardAmount.toFixed(3)}` : `0.000`,
                                            "Digital": installment.digitalAmount ? `${installment.digitalAmount.toFixed(3)}` : `0.000`,
                                            "Cheque": installment.chequeAmount ? `${installment.chequeAmount.toFixed(3)}` : `0.000`,
                                            "DoneBy": installment.doneBy ? installment.doneBy.userName : 'NA'
                                        })
                                        count = count + 1
                                    }
                                })
                            } else {
                                if ((trainerDetail.paidStatus === 'Paid' || trainerDetail.paidStatus === 'Installment') && trainerDetail.display) {
                                    totalPaidAmount += (trainerDetail.totalAmount ? +trainerDetail.totalAmount : 0)
                                    totalCash += (trainerDetail.cashAmount ? +trainerDetail.cashAmount : 0)
                                    totalCard += (trainerDetail.cardAmount ? +trainerDetail.cardAmount : 0)
                                    totalDigital += (trainerDetail.digitalAmount ? +trainerDetail.digitalAmount : 0)
                                    totalCheque += (trainerDetail.chequeAmount ? +trainerDetail.chequeAmount : 0)
                                    totalDiscount += (trainerDetail.discount ? +trainerDetail.discount : 0)
                                    tabledData.push({
                                        "SNo": count,
                                        "ReceiptNo": trainerDetail.orderNo,
                                        "DateAndTime": `${dateToDDMMYYYY(doc.dateOfPaid)} ${AMPM(doc.timeOfPaid)}`,
                                        "MemberID": memberId,
                                        "MemberName": userName ? userName : 'NA',
                                        "AdmissionDate": dateToDDMMYYYY(admissionDate),
                                        "MobileNo": mobileNo,
                                        // "Email ID": email,
                                        "Branch": doc.salesBranch.branchName,
                                        "TransactionType": transactionType,
                                        "Name": trainerDetail.trainer.credentialId.userName,
                                        "PaidAmount": trainerDetail.totalAmount ? `${trainerDetail.totalAmount.toFixed(3)}` : '0.000',
                                        "Discount": trainerDetail.discount ? `${trainerDetail.discount.toFixed(3)}` : `0.000`,
                                        "Cash": trainerDetail.cashAmount ? `${trainerDetail.cashAmount.toFixed(3)}` : `0.000`,
                                        "Card": trainerDetail.cardAmount ? `${trainerDetail.cardAmount.toFixed(3)}` : `0.000`,
                                        "Digital": trainerDetail.digitalAmount ? `${trainerDetail.digitalAmount.toFixed(3)}` : `0.000`,
                                        "Cheque": trainerDetail.chequeAmount ? `${trainerDetail.chequeAmount.toFixed(3)}` : `0.000`,
                                        "DoneBy": trainerDetail.doneBy ? trainerDetail.doneBy.userName : 'NA'
                                    })
                                    count = count + 1
                                }
                            }
                        })
                    }
                })
            }
            else if (data.transactionType === 'POS') {
                const { customerDetails: { member }, transactionType, branch, totalAmount, cashAmount, cardAmount, digitalAmount, chequeAmount, discount, dateOfPurchase, created_at } = data
                totalPaidAmount += (totalAmount ? +totalAmount : 0)
                totalCash += (cashAmount ? +cashAmount : 0)
                totalCard += (cardAmount ? +cardAmount : 0)
                totalDigital += (digitalAmount ? +digitalAmount : 0)
                totalCheque += (chequeAmount ? +chequeAmount : 0)
                totalDiscount += (discount ? +discount : 0)
                if (member) {
                    const { memberId, credentialId: { userName }, admissionDate, mobileNo } = member
                    tabledData.push({
                        "SNo": count,
                        "ReceiptNo": data.orderNo,
                        "DateAndTime": `${dateToDDMMYYYY(dateOfPurchase)} ${AMPM(created_at)}`,
                        "MemberID": memberId ? memberId : 'NA',
                        "MemberName": userName ? userName : 'NA',
                        "AdmissionDate": admissionDate ? dateToDDMMYYYY(admissionDate) : 'NA',
                        "MobileNo": mobileNo ? mobileNo : 'NA',
                        // "Email ID": email ? email : 'NA',
                        "Branch": branch.branchName,
                        "TransactionType": transactionType,
                        "Name": 'NA',
                        "PaidAmount": `${totalAmount.toFixed(3)}`,
                        "Discount": discount ? `${discount.toFixed(3)}` : `0.000`,
                        "Cash": `${cashAmount.toFixed(3)}`,
                        "Card": `${cardAmount.toFixed(3)}`,
                        "Digital": digitalAmount ? `${digitalAmount.toFixed(3)}` : `0.000`,
                        "Cheque": chequeAmount ? `${chequeAmount.toFixed(3)}` : `0.000`,
                        "DoneBy": data.doneBy ? data.doneBy.userName : 'NA'
                    })
                } else {
                    tabledData.push({
                        "SNo": count,
                        "ReceiptNo": data.orderNo,
                        "DateAndTime": `${dateToDDMMYYYY(dateOfPurchase)} ${AMPM(created_at)}`,
                        "MemberID": 'NA',
                        "MemberName": 'NA',
                        "AdmissionDate": 'NA',
                        "MobileNo": 'NA',
                        // "Email ID": 'NA',
                        "Branch": branch.branchName,
                        "TransactionType": transactionType,
                        "Name": 'NA',
                        "PaidAmount": `${totalAmount.toFixed(3)}`,
                        "Discount": discount ? `${discount.toFixed(3)}` : `0.000`,
                        "Cash": `${cashAmount.toFixed(3)}`,
                        "Card": `${cardAmount.toFixed(3)}`,
                        "Digital": digitalAmount ? `${digitalAmount.toFixed(3)}` : `0.000`,
                        "Cheque": chequeAmount ? `${chequeAmount.toFixed(3)}` : `0.000`,
                        "DoneBy": data.doneBy ? data.doneBy.userName : 'NA'
                    })
                }
                count = count + 1
            }
            else if (data.transactionType === 'Classes') {
                const { member: { memberId, credentialId: { userName }, admissionDate, mobileNo }, transactionType, totalAmount, cashAmount, cardAmount, digitalAmount, chequeAmount, discount, dateOfPurchase, created_at, classId: { branch, className } } = data
                totalPaidAmount += (totalAmount ? +totalAmount : 0)
                totalCash += (cashAmount ? +cashAmount : 0)
                totalCard += (cardAmount ? +cardAmount : 0)
                totalDigital += (digitalAmount ? +digitalAmount : 0)
                totalCheque += (chequeAmount ? +chequeAmount : 0)
                totalDiscount += (discount ? +discount : 0)
                tabledData.push({
                    "SNo": count,
                    "ReceiptNo": data.orderNo,
                    "DateAndTime": `${dateToDDMMYYYY(dateOfPurchase)} ${AMPM(created_at)}`,
                    "MemberID": memberId,
                    "MemberName": userName ? userName : 'NA',
                    "AdmissionDate": dateToDDMMYYYY(admissionDate),
                    "MobileNo": mobileNo,
                    // "Email ID": email,
                    "Branch": branch.branchName,
                    "TransactionType": transactionType,
                    "Name": className,
                    "PaidAmount": totalAmount ? `${totalAmount.toFixed(3)}` : '0.000',
                    "Discount": discount ? `${discount.toFixed(3)}` : `0.000`,
                    "Cash": cashAmount ? `${cashAmount.toFixed(3)}` : '0.000',
                    "Card": cardAmount ? `${cardAmount.toFixed(3)}` : '0.000',
                    "Digital": digitalAmount ? `${digitalAmount.toFixed(3)}` : `0.000`,
                    "Cheque": chequeAmount ? `${chequeAmount.toFixed(3)}` : `0.000`,
                    "DoneBy": data.doneBy ? data.doneBy.userName : 'NA'
                })
                count = count + 1
            } else if (data.transactionType === 'Freeze') {
                const { memberId: member, transactionType, branch, totalAmount, cashAmount, cardAmount, digitalAmount, chequeAmount, discount, dateOfPurchase, created_at } = data
                totalPaidAmount += (totalAmount ? +totalAmount : 0)
                totalCash += (cashAmount ? +cashAmount : 0)
                totalCard += (cardAmount ? +cardAmount : 0)
                totalDigital += (digitalAmount ? +digitalAmount : 0)
                totalCheque += (chequeAmount ? +chequeAmount : 0)
                totalDiscount += (discount ? +discount : 0)
                const { memberId, credentialId: { userName }, admissionDate, mobileNo } = member
                tabledData.push({
                    "SNo": count,
                    "ReceiptNo": data.orderNo,
                    "DateAndTime": `${dateToDDMMYYYY(dateOfPurchase)} ${AMPM(created_at)}`,
                    "MemberID": memberId ? memberId : 'NA',
                    "MemberName": userName ? userName : 'NA',
                    "AdmissionDate": admissionDate ? dateToDDMMYYYY(admissionDate) : 'NA',
                    "MobileNo": mobileNo ? mobileNo : 'NA',
                    // "Email ID": email ? email : 'NA',
                    "Branch": branch.branchName,
                    "TransactionType": transactionType,
                    "Name": 'NA',
                    "PaidAmount": totalAmount ? `${totalAmount.toFixed(3)}` : `0.000`,
                    "Discount": `0.000`,
                    "Cash": cashAmount ? `${cashAmount.toFixed(3)}` : `0.000`,
                    "Card": cardAmount ? `${cardAmount.toFixed(3)}` : `0.000`,
                    "Digital": digitalAmount ? `${digitalAmount.toFixed(3)}` : `0.000`,
                    "Cheque": chequeAmount ? `${chequeAmount.toFixed(3)}` : `0.000`,
                    "DoneBy": data.doneBy ? data.doneBy.userName : 'NA'
                })
                count = count + 1
            }
        })
        tabledData.push({
            "SNo": '',
            "ReceiptNo": '',
            "DateAndTime": ``,
            "MemberID": '',
            "MemberName": '',
            "AdmissionDate": '',
            "MobileNo": '',
            // "Email ID": email,
            "Branch": '',
            "TransactionType": 'Grand Total',
            "Name": '',
            "PaidAmount": `${this.state.currency} ${totalPaidAmount.toFixed(3)}`,
            "Discount": `${this.state.currency} ${totalDiscount.toFixed(3)}`,
            "Cash": `${this.state.currency} ${totalCash.toFixed(3)}`,
            "Card": `${this.state.currency} ${totalCard.toFixed(3)}`,
            "Digital": `${this.state.currency} ${totalDigital.toFixed(3)}`,
            "Cheque": `${this.state.currency} ${totalCheque.toFixed(3)}`,
            "DoneBy": ''
        })
        return tabledData
    }

    render() {
        return (
            <View style={{ transform: transform(), backgroundColor: 'white', flex: 1 }}>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30, backgroundColor: 'white' }}>
                    <View elevation={3} style={{ width: w, height: width / 7, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />
                            </TouchableOpacity>

                            <Text style={{ marginLeft: width / 30, top: width / 30, fontSize: width / 18, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('reports')}</Text>
                        </View>
                    </View>
                    <View style={{ width: w / 1.1, flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 80 }}>
                        <View style={{ backgroundColor: 'orange', width: w / 10, height: width / 10, marginTop: width / 30, borderTopLeftRadius: 3, borderBottomLeftRadius: 3 }}>
                            <Icon name='notify-branch' size={width / 15} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} color="white" />
                        </View>
                        {this.renderSellingProductsPicker()}
                    </View>
                    <View style={{ marginTop: width / 30, width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontSize: width / 22, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 2, fontWeight: 'bold' }}>{i18n.t('generalSales')}</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.showDateTimePicker()}>
                            <View style={{ flexDirection: 'row', marginTop: 'auto', marginBottom: 'auto' }}>
                                <Icon name="calender" size={width / 18} color="red" />
                                <View style={{ marginLeft: width / 50, flexDirection: 'column' }}>
                                    <Text style={{ fontSize: width / 22, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.showDate}</Text>
                                </View>
                                <Icon name="down-arrow" size={width / 18} style={{ marginLeft: width / 50, marginTop: 'auto', marginBottom: 'auto' }} color="#333" />
                            </View>
                        </TouchableOpacity>
                        <DateTimePicker
                            isVisible={this.state.visible}
                            mode='date'
                            onConfirm={(date) => this.handleDatePicked(date)}
                            onCancel={() => this.hideDateTimePicker()}
                        />
                    </View>
                    <View style={{ marginTop: width / 20, marginLeft: 'auto', marginRight: 'auto' }}>
                        <Text style={{ fontSize: width / 18, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: 'center' }}>{i18n.t('totalAmount')}</Text>
                        <Text style={{ fontSize: width / 12, color: '#2196f3', fontWeight: 'bold', transform: transform(), textAlign: 'center' }}>{this.state.currency} {isNaN(this.state.totalAmount) ? "0.000" : (this.state.totalAmount).toFixed(3)}</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.generate(this.state.branch)}>
                        <View style={{ width: w / 1.5, backgroundColor: '#edc006', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                            <Text style={{ fontSize: width / 18, color: '#333', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50, transform: transform() }}>{i18n.t('generateReport')}</Text>
                        </View>
                    </TouchableOpacity>
                    {this.state.showAll ?
                        <View>
                            <View style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, paddingBottom: width / 30, borderWidth: 1, borderColor: '#ddd', borderRadius: 3 }}>
                                <Text style={{ fontSize: width / 24, marginLeft: width / 30, color: 'grey', fontWeight: 'bold', marginTop: width / 50, transform: transform(), textAlign: textAlign() }}>{i18n.t('salesByTransactionType')}</Text>
                                <View style={{ borderBottomWidth: 1, width: w / 1.09, marginLeft: 'auto', marginRight: 'auto', borderBottomColor: '#ddd', marginTop: width / 80 }} />
                                <View style={{ marginTop: width / 30, alignItems: 'center', justifyContent: 'center', }}>
                                    <Pie
                                        radius={width / 4.2}
                                        innerRadius={width / 6.5}
                                        sections={this.state.transactionType}
                                        strokeCap={'butt'}

                                    />
                                    <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width: w / 1.09, marginLeft: 'auto', marginRight: 'auto' }}>
                                        <Text style={{ fontSize: width / 28, color: 'grey', transform: transform(), textAlign: textAlign() }}>{this.state.currency}</Text>
                                        <Text style={{ fontWeight: 'bold', fontSize: width / 20, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 4, textAlign: 'center' }}>{(this.state.transactionTypeTotal).toFixed(3)}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', width: w / 1.15, marginLeft: 'auto', marginRight: 'auto' }}>
                                    <View style={{ marginTop: width / 30, flexDirection: 'row' }}>
                                        < View style={{ width: width / 25, height: width / 25, backgroundColor: '#28a745', marginTop: 'auto', marginBottom: 'auto' }} />
                                        <Text style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: '#333', marginLeft: width / 80, marginTop: 'auto', marginBottom: 'auto', width: w / 6 }}>{i18n.t('packages')}</Text>
                                        <Text style={{ fontSize: width / 28, transform: transform(), textAlign: textAlign(), color: '#333', marginTop: 'auto', marginBottom: 'auto', fontWeight: 'bold', width: w / 5 }}>({this.state.PackagesAmount === null ? '0.000' : (this.state.PackagesAmount).toFixed(3)})</Text>
                                    </View>
                                    <View style={{ marginTop: width / 30, flexDirection: 'row' }}>
                                        < View style={{ width: width / 25, height: width / 25, backgroundColor: '#dc3545', marginTop: 'auto', marginBottom: 'auto' }} />
                                        <Text style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: '#333', marginLeft: width / 80, marginTop: 'auto', marginBottom: 'auto', width: w / 6 }}>{i18n.t('pointOfSales')}</Text>
                                        <Text style={{ fontSize: width / 28, transform: transform(), textAlign: textAlign(), color: '#333', marginTop: 'auto', marginBottom: 'auto', fontWeight: 'bold', width: w / 6 }}>({this.state.POSAmount === null ? '0.000' : (this.state.POSAmount).toFixed(3)})</Text>
                                    </View>
                                    <View style={{ marginTop: width / 30, flexDirection: 'row' }}>
                                        < View style={{ width: width / 25, height: width / 25, backgroundColor: '#ffc107', marginTop: 'auto', marginBottom: 'auto' }} />
                                        <Text style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: '#333', marginLeft: width / 80, marginTop: 'auto', marginBottom: 'auto', width: w / 6 }}>{i18n.t('classes')}</Text>
                                        <Text style={{ fontSize: width / 28, transform: transform(), textAlign: textAlign(), color: '#333', marginTop: 'auto', marginBottom: 'auto', fontWeight: 'bold', width: w / 6 }}>({this.state.ClassesAmount === null ? '0.000' : (this.state.ClassesAmount).toFixed(3)})</Text>
                                    </View>
                                    <View style={{ marginTop: width / 30, flexDirection: 'row' }}>
                                        < View style={{ width: width / 25, height: width / 25, backgroundColor: '#009688', marginTop: 'auto', marginBottom: 'auto' }} />
                                        <Text style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: '#333', marginLeft: width / 80, marginTop: 'auto', marginBottom: 'auto', width: w / 6 }}>{i18n.t('freeze')}</Text>
                                        <Text style={{ fontSize: width / 28, transform: transform(), textAlign: textAlign(), color: '#333', marginTop: 'auto', marginBottom: 'auto', fontWeight: 'bold', width: w / 6 }}>({this.state.FreezeAmount === null ? '0.000' : (this.state.FreezeAmount).toFixed(3)})</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, paddingBottom: width / 30, borderWidth: 1, borderColor: '#ddd', borderRadius: 3 }}>
                                <Text style={{ fontSize: width / 24, marginLeft: width / 30, color: 'grey', fontWeight: 'bold', marginTop: width / 50, transform: transform(), textAlign: textAlign() }}>{i18n.t('salesByBranch')}</Text>
                                <View style={{ borderBottomWidth: 1, width: w / 1.09, marginLeft: 'auto', marginRight: 'auto', borderBottomColor: '#ddd', marginTop: width / 80 }} />
                                <View style={{ marginTop: width / 30, alignItems: 'center', justifyContent: 'center', }}>
                                    <Pie
                                        radius={width / 4.2}
                                        innerRadius={width / 6.5}
                                        sections={this.state.salesByBranch}
                                        strokeCap={'butt'}

                                    />
                                    <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width: w / 1.09, marginLeft: 'auto', marginRight: 'auto' }}>
                                        <Text style={{ fontSize: width / 28, color: 'grey', transform: transform(), textAlign: textAlign() }}>{this.state.currency}</Text>
                                        <Text style={{ fontWeight: 'bold', fontSize: width / 20, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 4, textAlign: 'center' }}>{this.state.salesByBranchTotal === null ? '0.000' : (this.state.salesByBranchTotal).toFixed(3)}</Text>
                                    </View>
                                </View>
                                {this.state.salesByBranch.map((d, i) => {
                                    return (
                                        <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', width: w / 1.15, marginLeft: 'auto', marginRight: 'auto' }}>
                                            <View style={{ marginTop: width / 30, flexDirection: 'row' }}>
                                                < View style={{ width: width / 25, height: width / 25, backgroundColor: d.color, marginTop: 'auto', marginBottom: 'auto' }} />
                                                <Text style={{ fontSize: width / 30, transform: transform(), textAlign: textAlign(), color: '#333', marginLeft: width / 80, marginTop: 'auto', marginBottom: 'auto', width: w / 6 }}>{d.branchName}</Text>
                                                <Text style={{ fontSize: width / 28, transform: transform(), textAlign: textAlign(), color: '#333', marginTop: 'auto', marginBottom: 'auto', fontWeight: 'bold', width: w / 5 }}>({d.amount ? (d.amount).toFixed(3) : ''})</Text>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ paddingRight: width / 30 }}>
                                <View style={{ marginTop: width / 20, borderWidth: 1, marginLeft: width / 50, padding: width / 50, borderColor: '#ddd', borderRadius: 3 }}>
                                    <View style={{ flexDirection: 'row', marginTop: width / 30 }}>
                                        <View style={{ marginLeft: width / 50 }}>
                                            <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#3075BE', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('sno')}</Text>
                                        </View>
                                        <View style={{ marginLeft: width / 50 }}>
                                            <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#3075BE', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('receiptNo')}</Text>
                                        </View>
                                        <View style={{ marginLeft: width / 50 }}>
                                            <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#3075BE', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('dateAndTime')}</Text>
                                        </View>
                                        <View style={{ marginLeft: width / 50 }}>
                                            <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#3075BE', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('memberId')}</Text>
                                        </View>
                                        <View style={{ marginLeft: width / 50 }}>
                                            <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#3075BE', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('memberName')}</Text>
                                        </View>
                                        <View style={{ marginLeft: width / 50 }}>
                                            <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#3075BE', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('admissionDate')}</Text>
                                        </View>
                                        <View style={{ marginLeft: width / 50 }}>
                                            <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#3075BE', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('mobile')}</Text>
                                        </View>
                                        <View style={{ marginLeft: width / 50 }}>
                                            <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#3075BE', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('branch')}</Text>
                                        </View>
                                        <View style={{ marginLeft: width / 50 }}>
                                            <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#3075BE', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('transactionType')}</Text>
                                        </View>
                                        <View style={{ marginLeft: width / 50 }}>
                                            <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#3075BE', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('discount')}</Text>
                                        </View>
                                        <View style={{ marginLeft: width / 50 }}>
                                            <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#3075BE', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('name')}</Text>
                                        </View>
                                        <View style={{ marginLeft: width / 50 }}>
                                            <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#3075BE', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('paidAmount')}</Text>
                                        </View>
                                        <View style={{ marginLeft: width / 50 }}>
                                            <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#3075BE', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('cash')}</Text>
                                        </View>
                                        <View style={{ marginLeft: width / 50 }}>
                                            <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#3075BE', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('card')}</Text>
                                        </View>
                                        <View style={{ marginLeft: width / 50 }}>
                                            <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#3075BE', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('digital')}</Text>
                                        </View>
                                        <View style={{ marginLeft: width / 50 }}>
                                            <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#3075BE', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('cheque')}</Text>
                                        </View>
                                        <View style={{ marginLeft: width / 50 }}>
                                            <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#3075BE', fontWeight: 'bold', fontSize: width / 28 }}>{i18n.t('doneBy')}</Text>
                                        </View>
                                    </View>

                                    {this.state.allTable.map((d, i) => {
                                        return (
                                            <View style={{ flexDirection: 'row', marginTop: width / 30, backgroundColor: this.colorTable(i) }}>
                                                <View style={{ marginLeft: width / 50 }}>
                                                    <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{d.SNo}</Text>
                                                </View>
                                                <View style={{ marginLeft: width / 50 }}>
                                                    <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{d.ReceiptNo}</Text>
                                                </View>
                                                <View style={{ marginLeft: width / 50 }}>
                                                    <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{d.DateAndTime}</Text>
                                                </View>
                                                <View style={{ marginLeft: width / 50 }}>
                                                    <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{d.MemberID}</Text>
                                                </View>
                                                <View style={{ marginLeft: width / 50 }}>
                                                    <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{d.MemberName}</Text>
                                                </View>
                                                <View style={{ marginLeft: width / 50 }}>
                                                    <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{d.AdmissionDate}</Text>
                                                </View>
                                                <View style={{ marginLeft: width / 50 }}>
                                                    <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{d.MobileNo}</Text>
                                                </View>
                                                <View style={{ marginLeft: width / 50 }}>
                                                    <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{d.Branch}</Text>
                                                </View>
                                                <View style={{ marginLeft: width / 50 }}>
                                                    <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{d.TransactionType}</Text>
                                                </View>
                                                <View style={{ marginLeft: width / 50 }}>
                                                    <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{d.Discount}</Text>
                                                </View>
                                                <View style={{ marginLeft: width / 50 }}>
                                                    <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{d.Name}</Text>
                                                </View>
                                                <View style={{ marginLeft: width / 50 }}>
                                                    <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{d.PaidAmount}</Text>
                                                </View>
                                                <View style={{ marginLeft: width / 50 }}>
                                                    <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{d.Cash}</Text>
                                                </View>
                                                <View style={{ marginLeft: width / 50 }}>
                                                    <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{d.Card}</Text>
                                                </View>
                                                <View style={{ marginLeft: width / 50 }}>
                                                    <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{d.Digital}</Text>
                                                </View>
                                                <View style={{ marginLeft: width / 50 }}>
                                                    <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{d.Cheque}</Text>
                                                </View>
                                                <View style={{ marginLeft: width / 50 }}>
                                                    <Text style={{ width: w / 4, transform: transform(), textAlign: 'center', color: '#333', fontWeight: 'bold', fontSize: width / 28 }}>{d.DoneBy}</Text>
                                                </View>
                                            </View>
                                        )

                                    })}

                                    <View style={{ flexDirection: 'row', marginTop: width / 20, marginLeft: width / 50 }}>
                                        {(this.state.allPages[0] + 1) < this.state.pageNumber ? <TouchableOpacity onPress={() => this.onClickArrowPage('neg', this.getAllData(this.state.tableData))}><Icon name="back-button" size={width / 18} style={{ marginTop: 'auto', marginBottom: 'auto' }} color="#333" /></TouchableOpacity> : <Icon name="back-button" size={width / 18} style={{ marginTop: 'auto', marginBottom: 'auto' }} color="#ddd" />}
                                        {this.state.allPages.map((d, i) => {
                                            return (
                                                <TouchableOpacity onPress={() => this.onClickArrowPage('pn', this.getAllData(this.state.tableData), d + 1)}>
                                                    <View key={i} style={{ marginLeft: width / 50 }}>
                                                        <View key={i} style={{ padding: width / 50, width: w / 8, backgroundColor: this.state.pageNumber === (d + 1) ? '#3075BE' : 'white', borderRadius: 8, borderWidth: this.state.pageNumber === (d + 1) ? 0 : 0.8, borderColor: this.state.pageNumber === (d + 1) ? '#3075BE' : '#333' }}>
                                                            <Text style={{ transform: transform(), textAlign: 'center', color: this.state.pageNumber === (d + 1) ? 'white' : '#333', fontWeight: 'bold', fontSize: width / 30 }}>{d + 1}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        })}
                                        {this.state.allPages[this.state.allPages.length - 1] >= this.state.pageNumber ? <TouchableOpacity onPress={() => this.onClickArrowPage('pos', this.getAllData(this.state.tableData))}><Icon name="right-arrow" size={width / 18} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 50 }} color="#333" /></TouchableOpacity> : <Icon name="right-arrow" size={width / 18} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 50 }} color="#ddd" />}
                                    </View>
                                </View>
                            </ScrollView>
                        </View> : <View></View>
                    }
                </ScrollView>
            </View >
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
    },
    formTotalSales: {
        width: w / 3,
        borderColor: '#ddd',
        borderWidth: 1,
        backgroundColor: '#ddd',
        borderRadius: 3,
        height: width / 12,
    }
})