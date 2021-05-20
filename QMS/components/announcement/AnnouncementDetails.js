import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground, RefreshControl } from 'react-native';
import Header from '../common/Header'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { getAnnouncementById, addReadByUser } from '../../utils/api/announcements'
import i18n from 'i18n-js';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'

export default class AnnouncementDetails extends React.Component {
    _isMounted = false
    state = {
        announcements: '',
        credId: '',
        read: false
    }


    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            AsyncStorage.getItem('authedToken').then((token) => {
                const credId = jwtDecode(token).credential

                this.setState({
                    credId
                }, () => {
                    const obj = {
                        id: this.props.navigation.getParam('id'),
                        user: this.state.credId,
                    }

                    addReadByUser(obj).then(res => {
                        if (res) {
                            this.setState({
                                read: true
                            })
                        }
                    })
                    getAnnouncementById(this.props.navigation.getParam('id')).then(res => {
                        if (res) {
                            this.setState({
                                announcements: res.data.response
                            })
                        }
                    })
                })

            })
        }

    }

    componentWillUnmount() {
        this._isMounted = false
    }






    render() {
        const { announcements } = this.state
        const monthNames = [i18n.t('Jan'), i18n.t('Feb'), i18n.t('Mar'), i18n.t('Apr'), i18n.t('May'), i18n.t('Jun'),
        i18n.t('Jul'), i18n.t('Aug'), i18n.t('Sep'), i18n.t('Oct'), i18n.t('Nov'), i18n.t('Dec')
        ]
        return (
            <View style={{ flex: 1, backgroundColor: '#eeeeee', transform: transform() }}>
                <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                        <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('announcementDetails')}</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                    <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, backgroundColor: 'white', paddingBottom: width / 30 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: w / 4.5, height: height / 7.5, borderTopLeftRadius: 3, borderBottomLeftRadius: 3, backgroundColor: announcements.color, marginTop: width / 30, marginLeft: width / 50 }}>
                                <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: width / 10, color: 'white', textAlign: 'center', transform: transform() }}>{new Date(announcements.startDate).getDate()}</Text>
                                <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: width / 30, color: 'white', textAlign: 'center', transform: transform() }}>{monthNames[new Date(announcements.startDate).getMonth()]} {new Date(announcements.startDate).getFullYear()}</Text>

                            </View>
                            <View style={{ width: w / 1.5, padding: width / 50, borderTopRightRadius: 3, borderBottomRightRadius: 3, marginTop: width / 30, }}>
                                <Text style={{ fontWeight: 'bold', fontSize: width / 28, color: '#333', width: w / 1.8, transform: transform(), textAlign: textAlign() }}>{announcements.title}</Text>
                                <Text style={{ fontSize: width / 30, color: '#333', width: w / 1.8, marginTop: width / 30, transform: transform(), textAlign: textAlign() }}>{announcements.description}</Text>

                            </View>

                        </View>
                    </View>
                </ScrollView>
            </View >
        )
    }
}