import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { getAllPackage } from '../../utils/api/package'
import { getCurrency } from '../../utils/api/authorization'
import sq from '../../assets/images/sq.jpg'
import i18n from 'i18n-js'

class TrainerPackage extends Component {
    _isMounted = false

    state = {
        currency: '',
        rtl: null,
        packages: []
    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {

            getCurrency().then(res => {
                if (res) {
                    this.setState({
                        currency: res.data.response
                    })
                }
            })
            getAllPackage().then(res => {
                if (res) {
                    this.setState({
                        packages: res.data.response === null ? [] : res.data.response.filter(data => new Date().setHours(0, 0, 0, 0) <= new Date(data.endDate))
                    })
                }
            })

        }
    }


    componentWillUnmount() {
        this._isMounted = false
    }




    render() {
        return (
            <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                    <View elevation={3} style={{ width: w, height: width / 7, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />
                            </TouchableOpacity>

                            <Text style={{ marginLeft: width / 30, top: width / 30, fontSize: width / 18, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: textAlign(), }}>{i18n.t('packages')}</Text>

                        </View>

                    </View>
                    {this.state.packages.map((data, i) => {
                        const img = `${URL}/${data.image.path.replace(/\\/g, "/")}`
                        const packageImage = JSON.parse(JSON.stringify({ uri: img }))
                        return (
                            <View>
                                <Image resizeMode='stretch' style={{ width: w / 1.1, height: height / 3, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20 }} source={packageImage} />
                                <View key={i} style={{ backgroundColor: data.color, width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', borderRadius: 3, paddingBottom: width / 20 }}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ width: w / 1.7, fontSize: width / 21, fontWeight: 'bold', color: 'white', marginLeft: width / 30, transform: transform(), textAlign: textAlign(), marginTop: width / 60 }}>{data.packageName}</Text>
                                        <Text numberOfLines={2} style={{ width: w / 1.2, color: 'white', fontSize: width / 32, marginLeft: width / 30, transform: transform(), textAlign: textAlign(), marginTop: width / 80 }}>{data.description}.</Text>

                                    </View>
                                    <View style={{ width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon name="attendance" size={width / 22} color="white" />
                                            <Text style={{ fontSize: width / 25, color: 'white', transform: transform(), textAlign: 'center', marginLeft: width / 50 }}>{data.period.periodName}</Text>
                                        </View>
                                        <Text style={{ fontSize: width / 18, color: 'white', textAlign: 'center', fontWeight: 'bold', transform: transform(), width: w / 4, bottom: 5 }}>{this.state.currency} {data.amount}</Text>
                                    </View>

                                </View>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        )
    }
}

export default TrainerPackage