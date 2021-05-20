import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, ActionSheetIOS, TextInput, ScrollView, StyleSheet, Picker, Image, Linking, BackHandler } from 'react-native';
import boyImage from '../../assets/images/boy.jpg'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { Icon, width, height, w, h, transform, textAlign, textAlignForError, URL } from '../../utils/api/helpers'
import { getPackagesByID, getTrainerByBranchId } from '../../utils/api/package'
import { getUserDetailsById, getCurrency } from '../../utils/api/authorization'
import { getPeriodOfTrainer } from '../../utils/api/employee'
import sq from '../../assets/images/sq.jpg'
import { payOnline } from '../../utils/api/package'
import Loader from '../../utils/resources/Loader'
import i18n from 'i18n-js'


class PackageDetails extends Component {
    _isMounted = false

    state = {
        currency: '',
        subscriptions: [{ name: '1 Month' }, { name: '2 Month' }, { name: '3 Month' }],
        subscription: '',
        selectTrainers: [{ name: 'Yes' }, { name: 'No' }],
        selectTrainer: 'No',
        selectTrainere: '',
        renderPeriodPickers: [],
        renderPeriodPicker: null,
        renderPeriodPickere: '',
        count: [1, 2, 3, 4, 5],
        rating: 3,
        trainer: [],
        rtl: null,
        packageDetails: '',
        period: '',
        branchId: '',
        renderPeriod: false,
        authId: '',
        credId: '',
        loading: false,
        doneFingerAuth: '',
        navigation: '',
        oldPackageId: ''
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            if (this.props.navigation.getParam('pId') !== undefined) {
                this.setState({
                    oldPackageId: this.props.navigation.getParam('pId')
                })
            } else {
                this.setState({
                    oldPackageId: ''
                })
            }
            BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
            getCurrency().then(res => {
                if (res) {
                    this.setState({
                        currency: res.data.response
                    })
                }
            })
            getPackagesByID(this.props.navigation.getParam('id')).then(res => {
                if (res) {
                    this.setState({
                        packageDetails: res.data.response,
                        period: res.data.response.period
                    })
                }
            })

            AsyncStorage.getItem('authedToken').then(token => {
                const id = jwtDecode(token).credential
                const userId = jwtDecode(token).userId
                getUserDetailsById(id).then(res => {

                    if (res) {
                        this.setState({
                            question: res.data.response.questions ? true : false,
                            authId: userId,
                            credId: id,
                            branchId: res.data.response.branch._id,
                            doneFingerAuth: res.data.response.doneFingerAuth
                        }, () => {
                            if (this.state.doneFingerAuth !== false) {
                                this.setState({ navigation: 'RenewPackage' })
                            } else {
                                this.setState({ navigation: 'PackageHome' })
                            }
                            getTrainerByBranchId(this.state.branchId).then(res => {
                                if (res) {
                                    this.setState({
                                        trainer: res.data.response === null ? [] : res.data.response
                                    }, () =>
                                        this.state.trainer.map(train => {
                                            train.checked = false
                                        }))
                                }
                            })
                        })

                    }
                })
            })


        }

    }


    componentWillUnmount() {
        this._isMounted = false
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }
    onBackPress = () => {
        return true;
    }

    selectTrainerOption = (i) => {

        this.state.trainer.map((train, index) => {
            if (index === i) {
                train.checked = true
            } else {
                train.checked = false
            }
        })
        this.setState({
            trainer: this.state.trainer,
        }, () => {
            const trainerData = this.state.trainer.filter(check => check.checked === true)
            const data = {
                trainerName: trainerData[0]._id,
                branch: this.state.branchId
            }

            getPeriodOfTrainer(data).then(res => {
                if (res) {
                    this.setState({
                        renderPeriodPickers: res.data.response.filter(data => data.period.periodDays <= this.state.period.periodDays)
                    })
                }
            })
        })
    }

    showTrainerPicker = () => {
        const data = this.state.selectTrainers.map(l => l.name)
        data.push(i18n.t('pleaseSelect'))
        const len = data.length
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
            cancelButtonIndex: len - 1,
        },
            (buttonIndex) => {
                this.setState({ selectTrainer: data[buttonIndex] });
                if (this.state.selectTrainers[buttonIndex] !== undefined) {
                    this.setState({
                        selectTrainer: this.state.selectTrainers[buttonIndex].name,
                        selectTrainere: '',
                    })
                } else {
                    this.setState({
                        selectTrainer: '',
                        selectTrainere: 'Please Select'
                    })
                }
            });
    }
    renderSelectTrainer() {
        if (Platform.OS === 'android') {
            return (
                <View style={[this.state.selectTrainer !== '' ? styles.form : styles.forme, { transform: transform(), }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: 0 }}
                        selectedValue={this.state.selectTrainer}
                        onValueChange={(itemValue) => this.setState({ selectTrainer: itemValue })}>
                        <Picker.Item label={'Please Select'} value='' />
                        {
                            this.state.selectTrainers.map((v) => {
                                return <Picker.Item label={v.name} value={v.name} key={v.name} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showTrainerPicker()}>
                    <View style={[this.state.selectTrainer !== '' ? styles.form : styles.forme, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 20 }}>{this.state.selectTrainer}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }
    showrenderPeriodPicker = () => {
        const data = this.state.renderPeriodPickers.map(l => l.period.periodName)
        data.push(i18n.t('pleaseSelect'))
        const len = data.length
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
            cancelButtonIndex: len - 1,
        },
            (buttonIndex) => {
                this.setState({ renderPeriodPicker: data[buttonIndex] });
                if (this.state.renderPeriodPickers[buttonIndex] !== undefined) {
                    this.setState({
                        renderPeriodPicker: this.state.renderPeriodPickers[buttonIndex].period.periodName,
                        renderPeriodPickere: '',
                    })
                } else {
                    this.setState({
                        renderPeriodPicker: '',
                        renderPeriodPickere: 'Please Select'
                    })
                }
            });
    }

    renderPeriodPicker() {
        if (Platform.OS === 'android') {
            return (
                <View style={[this.state.renderPeriodPicker !== '' ? styles.form : styles.forme, { transform: transform() }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: 0 }}
                        selectedValue={this.state.renderPeriodPicker}
                        onValueChange={(itemValue) => this.setState({ renderPeriodPicker: itemValue })}>
                        <Picker.Item label={'Please Select'} value='' />
                        {
                            this.state.renderPeriodPickers.map((v) => {
                                return <Picker.Item label={v.period.periodName} value={v.period.periodName} key={v.period.periodName} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showrenderPeriodPicker()}>
                    <View style={[this.state.selectTrainer !== '' ? styles.form : styles.forme, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 20 }}>{this.state.renderPeriodPicker}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    renderTrainer = () => {
        if (this.state.selectTrainer === 'Yes') {

            return (

                this.state.trainer.map((data, i) => {
                    const image = `${URL}/${data.credentialId.avatar.path.replace(/\\/g, "/")}`
                    const userImage = JSON.parse(JSON.stringify({ uri: image }))
                    return (
                        <TouchableOpacity key={i} onPress={() => this.selectTrainerOption(i)}>
                            <View key={i} elevation={5} style={{ width: w / 1.1, paddingBottom: width / 30, marginLeft: 'auto', marginRight: 'auto', borderWidth: 1, borderRadius: 3, backgroundColor: 'white', borderColor: '#ddd', marginTop: width / 30, marginLeft: width / 30 }}>
                                <View style={{ flexDirection: 'row', marginTop: width / 30 }}>
                                    <Image source={userImage} style={{ width: width / 7, height: width / 7, borderRadius: width / 14, transform: transform(), borderWidth: 2, borderColor: 'grey', marginLeft: width / 30 }} />

                                    <View style={{ marginTop: width / 50, flexDirection: 'column', marginLeft: width / 30 }}>
                                        <Text numberOfLines={1} style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 28, width: w / 1.8, color: '#333' }}>{data.credentialId.userName}</Text>
                                        <View style={{ marginTop: width / 50, alignItems: 'center', flexDirection: 'row' }}>
                                            {this.state.count.map(number => {
                                                return (
                                                    <Icon key={number} name={data.ratingAvg >= number ? 'star-rating' : 'favorite'} size={width / 26} color="#ffc107" />
                                                )
                                            })}
                                            <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 36, color: '#333', paddingLeft: width / 50 }}>({data.rating.length})</Text>
                                        </View>
                                    </View>

                                    {data.checked === true ? <Icon name='transport-status' size={width / 20} style={{ left: width / 50, transform: transform() }} color="#7e57c2" /> : <View style={{ width: width / 20, height: width / 20, borderRadius: width / 40, borderWidth: 1, left: width / 50, borderColor: 'grey' }} />}

                                </View>

                            </View>
                        </TouchableOpacity>
                    )
                })
            )



        } else {
            return (
                <View></View>
            )
        }
    }

    onSubmit = () => {
        const trainerFeesArray = this.state.renderPeriodPickers.filter(id => id.period.periodName === this.state.renderPeriodPicker)
        const trainerFees = trainerFeesArray.length === 0 ? '' : trainerFeesArray[0].amount
        const trainerFeesId = trainerFeesArray.length === 0 ? '' : trainerFeesArray[0]._id
        const { selectTrainer, renderPeriodPicker } = this.state
        const data = this.state.trainer.filter(check => check.checked === true)
        const startDate = new Date()
        const endDate = new Date(new Date().setDate(startDate.getDate() + this.state.period.periodDays))


        const id = {
            trainerId: data.length === 0 ? '' : data[0]._id,
            packageId: this.props.navigation.getParam('id'),
            trainerFees,
            id: this.state.authId,
            credId: this.state.credId,
            trainerFeesId,
            didFingerAuth: this.state.doneFingerAuth,
            startDate,
            endDate
        }

        const idNoTrainer = {
            startDate,
            endDate,
            didFingerAuth: this.state.doneFingerAuth,
            id: this.state.authId,
            credId: this.state.credId,
            packageId: this.props.navigation.getParam('id'),

        }

        if (selectTrainer !== null || selectTrainer !== '') {
            if (this.state.selectTrainer === 'No') {
                this.state.oldPackageId !== '' ? this.props.navigation.navigate('PaymentIfQuestion', { idNoTrainer, flag: false, oldPackageId: this.state.oldPackageId }) : this.props.navigation.navigate('PaymentIfQuestion', { idNoTrainer, flag: false })
            } else if (id.trainerId !== '' && renderPeriodPicker !== null) {
                if (this.state.oldPackageId !== '') {
                    this.state.question === true ? this.props.navigation.navigate('PaymentIfQuestion', { id, flag: true, oldPackageId: this.state.oldPackageId }) : this.props.navigation.navigate('TrainerQuestionOne', { id, oldPackageId: this.state.oldPackageId })

                } else {
                    this.state.question === true ? this.props.navigation.navigate('PaymentIfQuestion', { id, flag: true }) : this.props.navigation.navigate('TrainerQuestionOne', { id })

                }
            } else if (this.state.selectTrainer === 'Yes' && renderPeriodPicker === null || selectTrainer === '') {
                alert(i18n.t('pleaseSelectTrainer'))
            } else {
                alert(i18n.t('pleaseSelectRequiredField'))
            }
        } else {
            alert(i18n.t('pleaseSelectRequiredField'))
        }
    }

    dropdownPeriod = () => {
        const data = this.state.trainer.filter(check => check.checked === true)
        if (data.length === 0) {
            return false
        } else {
            return true
            //Note that You have to call the api for the period data of dropdown inside the setState of selectTrainerOption by filtering the const data = this.state.trainer.filter(check => check.checked === true)

        }
    }

    renderButtons = () => {
        return (

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 3.5, marginTop: width / 18, marginLeft: width / 20 }}>
                <TouchableOpacity onPress={() => this.setState({ selectTrainer: 'Yes' })}>
                    <View style={{ flexDirection: 'row' }}>
                        {this.state.selectTrainer === 'Yes' ? <Icon name='transport-status' size={width / 22} style={{ transform: transform() }} color="#7e57c2" /> : <View style={{ width: width / 22, height: width / 22, borderRadius: width / 44, borderWidth: 1, borderColor: 'grey' }} />}
                        <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 30, color: '#333', marginLeft: width / 50 }}>{i18n.t('yes')}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({ selectTrainer: 'No' })}>
                    <View style={{ flexDirection: 'row' }}>
                        {this.state.selectTrainer === 'No' ? <Icon name='transport-status' size={width / 22} style={{ transform: transform() }} color="#7e57c2" /> : <View style={{ width: width / 22, height: width / 22, borderRadius: width / 44, borderWidth: 1, borderColor: 'grey' }} />}
                        <Text style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 30, color: '#333', marginLeft: width / 50 }}>{i18n.t('no')}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const { packageDetails, period } = this.state
        const img = packageDetails ? `${URL}/${packageDetails.image.path.replace(/\\/g, "/")}` : ''
        const packageImage = JSON.parse(JSON.stringify({ uri: img }))
        return (
            <View style={{ flex: 1, backgroundColor: '#eeeeee', transform: transform() }}>
                <Loader loading={this.state.loading} text='Loading' />
                <ScrollView contentContainerStyle={{ paddingBottom: width / 10 }}>
                    <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                            <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('packageDetails')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: w, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', transform: transform() }}>
                        <Image resizeMode='stretch' style={{ width: w, height: height / 2.8, marginLeft: 'auto', marginRight: 'auto', }} source={packageImage} />
                    </View>
                    <View style={{ width: w, backgroundColor: 'white', paddingBottom: width / 20, borderRadius: 3 }}>
                        <View style={{ marginLeft: width / 30 }}>
                            <Text style={{ fontSize: width / 20, color: '#333', marginTop: width / 30, width: w / 2, transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{packageDetails.packageName}</Text>
                        </View>
                        <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon name="calender" size={width / 20} color="#333" />
                                <Text style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), marginLeft: width / 50, width: w / 3 }}>{period.periodName}</Text>
                            </View>
                            <Text style={{ fontSize: width / 15, color: '#333', textAlign: textAlign(), fontWeight: 'bold', transform: transform(), width: w / 2.5, bottom: 5 }}>{this.state.currency} {packageDetails.amount ? (packageDetails.amount).toFixed(3) : ''}</Text>
                        </View>
                    </View>
                    <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.08, backgroundColor: 'white', marginTop: width / 30, paddingBottom: width / 20, borderRadius: 3 }}>
                        <Text style={{ fontSize: width / 25, color: 'grey', textAlign: 'center', fontWeight: 'bold', transform: transform(), width: w / 4, marginTop: width / 30 }}>{i18n.t('description')}</Text>
                        <View style={{ marginLeft: width / 30, marginTop: width / 50 }}>
                            <Text style={{ fontSize: width / 30, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.4 }}>{packageDetails.description}</Text>

                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', width: w / 1.08, backgroundColor: 'white', marginTop: width / 30, paddingBottom: width / 20, borderRadius: 3 }}>
                        <View style={{ alignItems: 'center', width: width / 12, height: width / 12, borderRadius: 2, backgroundColor: '#7e57c2', marginTop: width / 30, marginLeft: width / 30 }}>
                            <Icon name="trainers" size={width / 20} style={{ marginTop: 'auto', marginBottom: 'auto' }} color="white" />
                        </View>
                        <Text style={{ fontSize: width / 27, color: '#333', fontWeight: 'bold', marginLeft: width / 30, transform: transform(), textAlign: textAlign(), marginTop: width / 20, }}>{i18n.t('doYouWantTrainer')}</Text>
                        {this.renderButtons()}
                    </View>
                    <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: width / 30 }}>
                            {this.renderTrainer()}
                        </ScrollView>
                    </View>
                    {this.dropdownPeriod() !== false && this.state.selectTrainer === 'Yes' ?
                        <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.08, backgroundColor: 'white', marginTop: width / 30, paddingBottom: width / 20, borderRadius: 3 }}>
                            <Text style={{ fontSize: width / 25, color: '#333', marginLeft: width / 30, transform: transform(), textAlign: textAlign(), marginTop: width / 20, }}>{i18n.t('period')}</Text>

                            <View style={{ paddingLeft: width / 30 }}>{this.renderPeriodPicker()}</View>
                        </View> : <View></View>}
                    <TouchableOpacity onPress={() => this.onSubmit()}>
                        <View style={{ width: w / 1.2, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                            <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', transform: transform(), marginTop: width / 50 }}>{i18n.t('next')}</Text>
                        </View>
                    </TouchableOpacity>

                    {/* 
                    <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.1, backgroundColor: 'white', marginTop: width / 15, paddingBottom: width / 10, borderRadius: 3 }}>
                        <View style={{ width: w / 1.2, flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto' }}>
                            <View>
                                <Text style={{ fontSize: width / 20, color: '#333', marginTop: width / 30, width: w / 2, transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{packageDetails.packageName}</Text>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: width / 18, color: '#8bc34a', textAlign: 'center', fontWeight: 'bold', transform: transform(), width: w / 4 }}>{this.state.currency} {packageDetails.amount}</Text>
                                <Text style={{ fontSize: width / 30, color: '#333', transform: transform(), textAlign: 'center' }}>{period.periodName}</Text>
                            </View>
                        </View>
                        <View style={{ marginLeft: width / 30, marginTop: width / 20 }}>
                            <Text style={{ fontSize: width / 30, color: 'grey', transform: transform(), textAlign: textAlign(), width: w / 1.4 }}>{packageDetails.description}</Text>

                        </View>
                        <View style={{ marginLeft: width / 20, marginTop: width / 20 }}>
                            <Text style={{ fontSize: width / 22, color: '#333', marginTop: width / 30, transform: transform(), textAlign: textAlign(), width: w / 2 }}>Subscription</Text>
                            <Text style={{ marginTop: width / 50, fontSize: width / 24, color: '#d50000', transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>{period.periodDays} Days</Text>
                        </View>
                        <View style={{ marginLeft: width / 20, marginTop: width / 20 }}>
                            <Text style={{ fontSize: width / 22, color: '#333', marginTop: width / 30, transform: transform(), textAlign: textAlign(), width: w / 2 }}>Do you want trainer ?</Text>
                            {this.renderSelectTrainer()}
                            <Text style={{ transform: transform(), textAlign: textAlignForError(), color: 'red', fontSize: width / 30, top: 5, marginRight: width / 30 }}>{this.state.selectTrainer === '' ? 'Please Select' : ''}</Text>

                        </View>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.1 }}>
                                {this.state.selectTrainer === 'Yes' ? <Text style={{ fontSize: width / 25, color: '#333', marginTop: width / 30, transform: transform(), textAlign: textAlign(), marginLeft: width / 15 }}>Trainers</Text> : <View></View>}
                                {this.state.selectTrainer === 'Yes' ? <Text style={{ fontSize: width / 35, color: '#ddd', marginTop: width / 20, transform: transform(), textAlign: textAlign(), paddingRight: width / 60 }}>( Trainer fees excluded )</Text> : <View></View>}
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {this.renderTrainer()}
                            </ScrollView>
                        </View>
                        {this.dropdownPeriod() !== false && this.state.selectTrainer === 'Yes' ? <View style={{ paddingLeft: width / 30 }}>{this.renderPeriodPicker()}</View> : <View></View>}
                        <TouchableOpacity onPress={() => this.onSubmit()}>
                            <View style={{ width: w / 1.2, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginTop: width / 10, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                                <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', transform: transform(), marginTop: width / 50 }}>Next</Text>
                            </View>
                        </TouchableOpacity>
                    </View> */}
                </ScrollView>
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
        marginTop: width / 30,
        paddingLeft: 20,
        width: w / 1.2,
        borderColor: '#ddd',
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        height: width / 8,
    },
    forme: {
        marginTop: width / 30,
        paddingLeft: 20,
        width: w / 1.2,
        borderColor: 'red',
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        height: width / 8,
    },
})

export default PackageDetails