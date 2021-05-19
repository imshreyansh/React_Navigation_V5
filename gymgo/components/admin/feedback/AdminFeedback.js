import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Modal, RefreshControl, Image, Animated, ActionSheetIOS, Picker, StyleSheet } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, URL, paddingRightBMI, paddingLeftBMI, isTablet } from '../../../utils/api/helpers'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { getUserByCredentials, getAllBranch } from '../../../utils/api/authorization'
import { getFeedbackList } from '../../../utils/api/feedback'
import Loader from '../../../utils/resources/Loader'
import { showMessage, hideMessage } from "react-native-flash-message";
import Pie from 'react-native-pie'
import sq from '../../../assets/images/sq.jpg'
import { SearchBar } from 'react-native-elements';
import DateTimePicker from "react-native-modal-datetime-picker";
import boyImage from '../../../assets/images/boy.jpg'
import i18n from 'i18n-js';


class AdminFeedback extends Component {
    _isMounted = false

    state = {
        userDetails: '',
        userCredentials: '',
        refreshing: false,
        loading: false,
        allFeedbackPie: [{ percentage: 50, color: '#eee' }, { percentage: 50, color: '#dddddd' }],
        search: '',
        dateSelected: '',
        showDate: '',
        visible: false,
        type: i18n.t('all'),
        modalVisible: false,
        typeOfBranches: [],
        branch: '',
        branchLabel: i18n.t('all'),
        feedbackList: [],
        totalComplaints: 0,
        totalSuggestions: 0,
        totalComplaintsAndSuggestions: 0
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            const unsubscribe = this.props.navigation.addListener('didFocus', () => {
                AsyncStorage.getItem('authedToken').then((token) => {
                    const userId = jwtDecode(token).credential
                    this.setState({
                        userId,
                    }, () => {
                        this._onRefresh()
                    })
                })
            })
        }
    }


    componentWillUnmount() {
        this._isMounted = false
    }

    updateSearch = search => {
        if (search !== '') {
            this.setState({ search }, () => {
                this.onGetFeedBackList()
                // const items = this.state.searchItems.filter(data => data.itemName.toLowerCase().includes(search.toLowerCase()))
                // this.setState({ searchedItem: items })
            })
        } else {
            this.setState({
                searchedItem: [],
                search: '',
            }, () => this.onGetFeedBackList())
        }
    }

    onGetFeedBackList = () => {
        const obj = {
            branch: this.state.branch !== '' ? this.state.branch : 'all',
            date: this.state.dateSelected,
            mode: 'Manual',
            type: this.state.type === 'All' ? 'all' : this.state.type,
            search: this.state.search
        }
        getFeedbackList(obj).then(res => {
            if (res) {
                this.setState({
                    feedbackList: res.data.response.newResponse,
                    totalComplaints: res.data.response.complaint.completed + res.data.response.complaint.pending,
                    totalSuggestions: res.data.response.suggestion.completed + res.data.response.suggestion.pending,
                    totalComplaintsAndSuggestions: res.data.response.complaint.completed + res.data.response.complaint.pending + res.data.response.suggestion.completed + res.data.response.suggestion.pending
                }, () => {
                    if (this.state.feedbackList.length > 0) {
                        this.setState({
                            allFeedbackPie: [{ percentage: (this.state.totalSuggestions / this.state.totalComplaintsAndSuggestions) * 100, color: '#FAA10E' }, { percentage: (this.state.totalComplaints / this.state.totalComplaintsAndSuggestions) * 100, color: '#28A745' }]
                        })
                    } else {
                        this.setState({
                            totalComplaints: 0,
                            totalSuggestions: 0,
                            totalComplaintsAndSuggestions: 0,
                            allFeedbackPie: [{ percentage: 50, color: '#eee' }, { percentage: 50, color: '#dddddd' }]
                        })
                    }
                })
            }
        })
    }

    handleDatePicked(date) {
        this.setState({
            dateSelected: new Date(date),
            showDate: date.toISOString().split('T')[0].split('-').reverse().join('/'),

        }, () => this.onGetFeedBackList())
        this.hideDateTimePicker()
    }
    showDateTimePicker = () => {
        this.setState({ visible: true });
    }

    hideDateTimePicker = () => {
        this.setState({ visible: false });
    }

    _onRefresh = () => {
        this.setState({
            refreshing: true,

        })

        getUserByCredentials(this.state.userId).then(res => {
            if (res) {
                this.setState({
                    userDetails: res.data.response,
                    userCredentials: res.data.response.credentialId,
                    refreshing: false
                }, () => {
                    getAllBranch().then(res => {
                        if (res) {
                            this.setState({
                                typeOfBranches: res.data.response
                            }, () => {
                                this.onGetFeedBackList()
                            })
                        }
                    })
                })
            }
        })
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    onSelectType = (type) => {
        this.setState({ type: type }, () => this.onGetFeedBackList())
        this.setModalVisible(false)
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
                        this.onGetFeedBackList()
                    })
                } else {
                    this.setState({
                        branch: '',
                        branchLabel: i18n.t('all')
                    }, () => this.onGetFeedBackList())
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
                        onValueChange={(itemValue) => this.setState({ branch: itemValue }, () => this.onGetFeedBackList())}>
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
    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <Loader loading={this.state.loading} text='Registering User' />


                <View elevation={3} style={{ width: w, height: width / 7, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />
                        </TouchableOpacity>

                        <Text style={{ marginLeft: width / 30, top: width / 30, fontSize: width / 18, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('feedback')}</Text>
                    </View>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        progressBackgroundColor='#1976d2'
                        colors={['white', 'yellow']}
                    />}>
                    <View style={{ backgroundColor: 'white', width: w, padding: width / 50 }}>
                        <View style={{ width: w / 1.1, flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto' }}>
                            <View style={{ backgroundColor: 'orange', width: w / 10, height: width / 10, marginTop: width / 30, borderTopLeftRadius: 3, borderBottomLeftRadius: 3 }}>
                                <Icon name='notify-branch' size={width / 15} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} color="white" />
                            </View>
                            {this.renderSellingProductsPicker()}
                        </View>
                        <View style={{ marginTop: width / 30, alignItems: 'center', justifyContent: 'center', }}>
                            <Pie
                                radius={width / 4.2}
                                innerRadius={width / 6.5}
                                sections={this.state.allFeedbackPie}
                                strokeCap={'butt'}

                            />
                            <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width: w / 1.09, marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={{ fontSize: width / 28, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('total')}</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: width / 15, color: '#333', transform: transform(), textAlign: textAlign() }}>{this.state.totalComplaintsAndSuggestions}</Text>
                            </View>
                        </View>
                        <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.5, marginTop: width / 20, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', paddingBottom: width / 30 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ backgroundColor: '#28A745', width: w / 25, height: w / 25, marginTop: 'auto', marginBottom: 'auto' }} />
                                <Text style={{ fontSize: width / 30, marginLeft: width / 50, color: '#333', transform: transform(), textAlign: textAlign() }}>{i18n.t('complaints')}</Text>
                                <Text style={{ fontSize: width / 28, marginLeft: width / 50, color: '#28A745', fontWeight: 'bold', marginTop: 'auto', marginBottom: 'auto', transform: transform(), textAlign: textAlign() }}>{this.state.totalComplaints}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ backgroundColor: '#FAA10E', width: w / 25, height: w / 25, marginTop: 'auto', marginBottom: 'auto' }} />
                                <Text style={{ fontSize: width / 30, marginLeft: width / 50, color: '#333', transform: transform(), textAlign: textAlign() }}>{i18n.t('suggestions')}</Text>
                                <Text style={{ fontSize: width / 28, marginLeft: width / 50, color: '#FAA10E', fontWeight: 'bold', marginTop: 'auto', marginBottom: 'auto', transform: transform(), textAlign: textAlign() }}>{this.state.totalSuggestions}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginLeft: 'auto', marginRight: 'auto', transform: transform() }}>
                        <SearchBar
                            placeholder={i18n.t('search')}
                            placeholderTextColor='#D3D3D3'
                            onChangeText={this.updateSearch}
                            lightTheme
                            containerStyle={{ backgroundColor: 'white', borderWidth: 1, width: w / 1.1, height: isTablet === false ? width / 11 : width / 8, borderColor: '#C8C8C8', borderRadius: 5, marginTop: width / 30 }}
                            inputContainerStyle={{ backgroundColor: 'white', width: w / 1.3, height: height / 40, }}
                            inputStyle={{ textAlign: textAlign(), }}
                            searchIcon={{ size: width / 16 }}
                            value={this.state.search}
                        />
                    </View>
                    <View style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={() => this.showDateTimePicker()}>
                            <View style={{ width: w / 2.5, paddingTop: width / 50, paddingBottom: width / 80, backgroundColor: 'white', borderRadius: 3, borderWidth: 1, borderColor: '#ddd' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 2.8 }}>
                                    <Text style={{ fontSize: width / 28, marginLeft: width / 50, color: 'grey', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.showDate}</Text>
                                    <Icon name="calender" size={width / 22} color="grey" />

                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.setModalVisible(true) }}>
                            <View style={{ width: w / 2.5, paddingTop: width / 50, paddingBottom: width / 80, backgroundColor: 'white', borderRadius: 3, borderWidth: 1, borderColor: '#ddd' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 2.8 }}>
                                    <Text style={{ fontSize: width / 28, marginLeft: width / 50, color: 'grey', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{this.state.type}</Text>
                                    <Icon name="down-arrow" size={width / 22} color="grey" />

                                </View>
                            </View>
                        </TouchableOpacity>

                    </View>
                    <DateTimePicker
                        isVisible={this.state.visible}
                        mode='date'
                        onConfirm={(date) => this.handleDatePicked(date)}
                        onCancel={() => this.hideDateTimePicker()}
                    />
                    <View style={{ marginTop: width / 30, marginLeft: width / 30 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: width / 22, color: 'grey', transform: transform(), textAlign: textAlign() }}>Requests List</Text>
                    </View>
                    {this.state.feedbackList.map((d, i) => {
                        const avatar = d.member ? `${URL}/${d.member.credentialId.avatar.path.replace(/\\/g, "/")}` : ''
                        const userImage = JSON.parse(JSON.stringify({ uri: avatar }))
                        var shours = new Date(d.time).getHours()
                        var sminutes = new Date(d.time).getMinutes()
                        var sampm = shours >= 12 ? 'PM' : 'AM'
                        shours = shours % 12
                        shours = shours ? shours : 12  // the hour '0' should be '12'
                        var startTime = shours + ':' + `${("0" + sminutes).slice(-2)}` + ' ' + sampm
                        return (

                            <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('AdminFeedbackDetails', { id: d._id, statusBox: d.adminComment ? false : true })}>
                                <View elevation={1} style={{ marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto', width: w / 1.08, borderWidth: 1, borderColor: '#ddd', borderRadius: 3, paddingBottom: width / 30, backgroundColor: 'white' }}>
                                    <View style={{ width: w / 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ marginTop: width / 50, marginLeft: width / 50 }}>
                                                <Image source={userImage} style={{ width: width / 8, height: width / 8, borderRadius: width / 16, borderWidth: 2, borderColor: 'white' }} />
                                            </View>
                                            <View style={{ flexDirection: 'column', marginTop: width / 50, marginLeft: width / 50 }}>
                                                <View>
                                                    <Text style={{ color: 'grey', fontSize: width / 28, fontWeight: 'bold', width: w / 2, transform: transform(), textAlign: textAlign() }}>{d.member.credentialId.userName}</Text>
                                                </View>
                                                <View>
                                                    <Text style={{ color: '#283593', fontSize: width / 28, fontWeight: 'bold', width: w / 2, transform: transform(), textAlign: textAlign() }}>ID:{d.member.memberId}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ marginRight: width / 50, marginTop: 'auto', marginBottom: 'auto' }}>
                                            <Text style={{ fontSize: width / 26, fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{d.optionType}</Text>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: width / 30, borderWidth: 1, borderColor: '#ddd', width: w / 1.1, marginLeft: 'auto', marginRight: 'auto' }} />
                                    <View style={{ marginTop: width / 50, flexDirection: 'row', justifyContent: 'space-between', width: w / 1.08, }}>
                                        <View style={{ flexDirection: 'row', marginLeft: width / 50 }}>
                                            <Icon name="calender" size={width / 25} color="grey" />
                                            <Text style={{ fontSize: width / 32, marginLeft: width / 80, color: 'grey', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{new Date(d.date).getDate()}/{new Date(d.date).getMonth() + 1}/{new Date(d.date).getFullYear()}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: width / 50 }}>
                                            <Icon name="clock" size={width / 25} color="grey" />
                                            <Text style={{ fontSize: width / 32, marginLeft: width / 80, color: 'grey', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{startTime}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: width / 50 }}>
                                            <Text style={{ fontSize: width / 30, marginLeft: width / 80, color: 'red', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{d.status}</Text>
                                        </View>
                                        <View style={{ width: width / 18, height: width / 18, borderRadius: width / 36, backgroundColor: 'green', marginRight: width / 50 }}>
                                            <Icon name="right-arrow" size={width / 30} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} color="white" />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View elevation={10} style={{ backgroundColor: 'white', height: height / 3, width: width - 40, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width / 1.15, marginLeft: 'auto', marginRight: 'auto', borderBottomWidth: 0.5, paddingBottom: width / 60, borderBottomColor: '#333' }}>
                            <Text style={{ fontSize: width / 20, color: '#333', marginLeft: width / 30, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], textAlign: this.state.isRTL ? 'right' : 'left' }}>{i18n.t('types')}</Text>
                            <TouchableOpacity onPress={() => { this.setModalVisible(false) }}>
                                <Icon name="close" size={width / 20} style={{ marginRight: width / 30 }} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            <TouchableOpacity onPress={() => this.onSelectType('All')}>
                                <View style={{ marginTop: width / 50, marginLeft: width / 50, padding: width / 50, backgroundColor: '#ddd', width: width - 60 }}>
                                    <Text style={{ fontSize: width / 22, color: 'black', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('all')}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onSelectType('Complaints')}>
                                <View style={{ marginTop: width / 50, marginLeft: width / 50, padding: width / 50, backgroundColor: '#ddd', width: width - 60 }}>
                                    <Text style={{ fontSize: width / 22, color: 'black', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('complaints')}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onSelectType('Suggestions')}>
                                <View style={{ marginTop: width / 50, marginLeft: width / 50, padding: width / 50, backgroundColor: '#ddd', width: width - 60 }}>
                                    <Text style={{ fontSize: width / 22, color: 'black', fontWeight: 'bold', transform: transform(), textAlign: textAlign() }}>{i18n.t('suggestions')}</Text>
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </Modal>
                <View elevation={10} style={styles.fab}>
                    <TouchableOpacity style={{ transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], width: width / 7.5, height: width / 7.5, flexDirection: 'column', alignItems: 'center' }} onPress={() => this.props.navigation.navigate('AdminAddFeedback')}>
                        <Text style={styles.fabIcon}>+</Text>
                    </TouchableOpacity>
                </View>
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
    fab: {
        position: 'absolute',
        width: width / 7.5,
        height: width / 7.5,
        flexDirection: 'column',
        alignItems: 'center',
        left: w / 1.23,
        bottom: w / 20,
        backgroundColor: '#DC3545',
        borderRadius: width / 15,
    },

    fabIcon: {
        fontSize: width / 10.5,
        color: 'white',
    }
})

export default AdminFeedback