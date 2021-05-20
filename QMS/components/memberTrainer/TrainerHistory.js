import React from 'react';
import { View, Text, ScrollView, Image, RefreshControl, TouchableOpacity, ImageBackground } from 'react-native';
import boyImage from '../../assets/images/boy.jpg'
import Header from '../common/Header'
import { Icon, width, height, w, h, transform, textAlign, URL, setTime } from '../../utils/api/helpers'
import { getMemberById } from '../../utils/api/authorization'
import { getPackagesByID } from '../../utils/api/package'
import { starRating } from '../../utils/api/employee'
import AsyncStorage from '@react-native-community/async-storage';
import trainerBg from '../../assets/images/trainerBg.jpg'
import jwtDecode from 'jwt-decode'
import i18n from 'i18n-js';

export default class TrainerHistory extends React.Component {
    _isMounted = false

    state = {
        abc: [1, 2, 3, 4, 5, 6],
        rtl: null,
        userId: "",
        packages: [],
        stars: 2,
        trainer: [],
        refreshing: false,
        count: [1, 2, 3, 4, 5],
        view: null

    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            const willFocusSubscription = this.props.navigation.addListener(
                'willFocus',
                () => {
                    AsyncStorage.getItem('authedToken').then((token) => {
                        const userId = jwtDecode(token).userId

                        this.setState({
                            userId,

                        }, () => {
                            this._onRefresh()
                        })
                    })
                }
            )
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
                    packages: res.data.response.packageDetails,

                }, () => {
                    let map = new Map();
                    const trainers = []
                    this.state.packages.forEach(packages => {
                        if (packages.trainer && setTime(packages.trainerExtend ? packages.trainerExtend : packages.trainerEnd) < setTime(new Date())) {
                            map.set(packages.trainer._id, true);
                            trainers.push({ trainer: packages.trainer, trainerStart: packages.trainerStart, trainerEnd: packages.trainerEnd, trainerExtend: packages.trainerExtend })
                        }
                    })
                    this.setState({
                        trainer: trainers,
                        refreshing: false
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

    onRating = (stars, id) => {
        const obj = {
            employeeId: id,
            rating: {
                member: this.state.userId,
                star: stars
            },
        }
        starRating(obj).then(res => {
            if (res) {
                this._onRefresh()
            }
        })
    }

    onGoBack() {
        this.props.navigation.goBack()
    }

    returnView = (index, data) => {
        if (index === this.state.view) {
            return (
                <View style={{ width: w / 1.08, paddingBottom: width / 50, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, borderRadius: 2, borderTopWidth: 1, borderTopColor: '#ddd' }}>
                    <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', marginLeft: width / 50, marginTop: width / 30 }}>
                            <Icon name="email" size={width / 22} color="#1976d2" />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: width / 30, color: '#333', transform: transform(), textAlign: textAlign(), marginLeft: width / 80 }}>{i18n.t('email')}</Text>
                                <Text style={{ fontSize: width / 35, color: '#333', fontWeight: 'bold', width: w / 2.5, textAlign: textAlign(), transform: transform() }}>{data.trainer.credentialId.email}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: width / 50, marginTop: width / 30 }}>
                            <Icon name="call" size={width / 22} color="#1976d2" />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: width / 30, color: '#333', transform: transform(), textAlign: textAlign(), marginLeft: width / 80 }}>{i18n.t('mobile')}</Text>
                                <Text style={{ fontSize: width / 35, color: '#333', fontWeight: 'bold', textAlign: textAlign(), transform: transform(), width: w / 3 }}>{data.trainer.mobileNo}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', marginLeft: width / 50, marginTop: width / 30 }}>
                            <Icon name="calender" size={width / 22} color="#1976d2" />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: width / 30, color: '#333', transform: transform(), textAlign: textAlign(), marginLeft: width / 80 }}>{i18n.t('startOn')}</Text>
                                <Text style={{ fontSize: width / 35, color: '#333', fontWeight: 'bold', width: w / 2.5, textAlign: textAlign(), transform: transform() }}>{new Date(data.trainerStart).getDate()}/{new Date(data.trainerStart).getMonth() + 1}/{new Date(data.trainerStart).getFullYear()}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: width / 50, marginTop: width / 30 }}>
                            <Icon name="calender" size={width / 22} color="#1976d2" />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: width / 30, color: '#333', transform: transform(), textAlign: textAlign(), marginLeft: width / 80 }}>{i18n.t('expiredOn')}</Text>
                                <Text style={{ fontSize: width / 35, color: '#333', fontWeight: 'bold', textAlign: textAlign(), transform: transform(), width: w / 3 }}>{new Date(data.trainerExtend ? data.trainerExtend : data.trainerEnd).getDate()}/{new Date(data.trainerExtend ? data.trainerExtend : data.trainerEnd).getMonth() + 1}/{new Date(data.trainerExtend ? data.trainerExtend : data.trainerEnd).getFullYear()}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )
        } else {
            return null
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', transform: transform() }}>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 10 }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                        progressBackgroundColor='#1976d2'
                        colors={['white', 'yellow']}
                    />}>
                    <View style={{ padding: width / 30 }}>
                        {this.state.trainer ? this.state.trainer.map((data, i) => {
                            if (data !== undefined && data.trainer.credentialId !== undefined) {
                                const avatar = `${URL}/${data.trainer.credentialId.avatar.path.replace(/\\/g, "/")}`
                                const userImage = JSON.parse(JSON.stringify({ uri: avatar }))
                                const isThere = data.trainer.rating.filter(id => id.member === this.state.userId)

                                return (
                                    <View elevation={3} style={{ width: w / 1.08, paddingBottom: width / 30, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, borderRadius: 2 }}>
                                        <TouchableOpacity onPress={() => this.setState({ view: this.state.view === i ? null : i })}>
                                            <View style={{ width: w / 1.2, flexDirection: 'row', marginLeft: width / 50, marginTop: width / 50 }}>
                                                <Image source={userImage} style={{ width: width / 6, height: width / 6, borderRadius: width / 12, borderWidth: 2, borderColor: '#1976d2', transform: transform() }} />
                                                <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                                                    <Text style={{ fontSize: width / 22, color: '#333', fontWeight: 'bold', transform: transform(), marginTop: width / 50, width: w / 1.8, textAlign: textAlign() }}>{data.trainer.credentialId.userName}</Text>
                                                    <View style={{ width: width / 3, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: width / 50 }}>



                                                        {this.state.count.map(number => {

                                                            // const rating = isThere.length > 0 ? isThere[0].star : 0
                                                            const rating = data.trainer.ratingAvg ? data.trainer.ratingAvg : 0
                                                            {
                                                                return (

                                                                    <TouchableOpacity key={number} onPress={() => this.onRating(number, data.trainer._id)} style={{ transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                                                                        <Icon name='star-rating' size={width / 15} color={rating >= number ? "#ffd600" : '#ddd'} />
                                                                    </TouchableOpacity>
                                                                )
                                                            }

                                                        })}



                                                        <Text style={{ fontSize: width / 28, color: '#333', transform: transform(), marginLeft: width / 50 }}>({data.trainer.rating.length})</Text>
                                                    </View>

                                                </View>
                                                <Icon name="down-arrow" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                                            </View>
                                        </TouchableOpacity>
                                        {this.returnView(i, data)}
                                    </View>
                                )
                            }


                        }) : <View></View>}

                    </View>
                </ScrollView>
            </View>
        )
    }
}