import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, ImageBackground } from 'react-native'
import Svg, { Ellipse, Defs, ClipPath, Image as SvgImage, Path } from 'react-native-svg'
import { h, w, width, height, Icon, transform, textAlign } from '../../utils/resources/helpers'
import design from '../../assets/images/design.png'
import pixel from '../../assets/images/pixel.png'
import i18n from 'i18n-js'

class Login extends Component {
    state = {
        email: '',
        viewStatus: false,
        password: ''
    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {

        }
    }


    componentWillUnmount() {
        this._isMounted = false

    }

    render() {
        console.log(w)
        return (

            // {`M100.36,-200.17 C${w * 2.5},173.19 80.23,50.34 -16.08,500.95 L-37.52,211.67 L0.00,0.00 Z`}
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 50 }}>
                    <View style={{ position: 'absolute' }}>
                        <ImageBackground source={design} resizeMode='stretch' style={{ width: w, height: h / 1.8 }} >
                            <View style={{ width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', justifyContent: 'flex-end', marginTop: width / 30 }}>
                                <TouchableOpacity>
                                    <View style={{ flexDirection: 'row', width: w / 5, borderRadius: width / 12, backgroundColor: '#5c6bc0', padding: width / 100 }}>
                                        <Icon name='language' color='orange' size={width / 25} />
                                        <Text style={{ marginLeft: width / 80, color: 'white', fontSize: width / 32 }}>English</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginLeft: 'auto', marginRight: 'auto', bottom: h / 22 }}>
                                <Image source={pixel} resizeMode='contain' style={{ width: width / 1.5, height: width / 1.5 }} />
                            </View>
                        </ImageBackground>

                        {/* <View style={{ position: 'absolute' }}>
                            <Svg height={h / 1.5} width={w}>
                                <Defs>
                                    <ClipPath id="clip">

                                        <Path
                                            d={`M100.36,-200.17 C${w * 2.5},173.19 80.23,50.34 -16.08,500.95 L-37.52,211.67 L0.00,0.00 Z `}
                                            fill="none"
                                            stroke="blue"
                                            strokeWidth="5"
                                        />

                                    </ClipPath>

                                </Defs>

                                <SvgImage
                                    width="100%"
                                    height="100%"
                                    preserveAspectRatio="xMidYMid slice"
                                    href={image}
                                    clipPath="url(#clip)"
                                />
                            </Svg>
                        </View>

                        <View style={{ position: 'absolute', marginTop: width / 80 }}>
                            <Svg height={h / 1.5} width={w}>

                                <Path
                                    d={`M100.36,-200.17 C${w * 2.5},173.19 80.23,50.34 -16.08,500.95 L-${w * 8.5},211.67 L0.00,0.00 Z`}
                                    fill="none"
                                    stroke="#5c6bc0"
                                    strokeWidth='14'
                                />
                            </Svg>
                        </View> */}
                    </View>
                    <KeyboardAvoidingView style={{ flex: 1, }} behavior="padding" >
                        <View style={{ marginTop: h / 6 }}>



                            <View style={{ marginTop: h / 4, marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={{ fontSize: width / 18, fontWeight: 'bold' }}>Welcome</Text>
                            </View>
                            <View style={{ marginTop: width / 50, marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={{ fontSize: width / 25 }}>Sign In to continue using QMS App</Text>
                            </View>


                            <View style={{ marginTop: width / 30, width: w / 1.2, borderWidth: 1, borderColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#fafafa', flexDirection: 'row', borderRadius: width / 12 }}>
                                <Icon name="email" size={width / 18} style={{ top: width / 40, marginLeft: width / 30 }} color="grey" />
                                <TextInput
                                    autoCapitalize='none'
                                    onChangeText={(text) => this.setState({ email: text, })}
                                    value={this.state.email}
                                    style={{ fontSize: width / 25, transform: transform(), textAlign: textAlign(), color: '#333', width: w / 1.4, marginLeft: 'auto', marginRight: 'auto', height: width / 9, paddingLeft: 8 }}
                                    returnKeyType='next'
                                    placeholderTextColor='grey'
                                    placeholder={i18n.t('email')} />
                            </View>
                            <View style={{ marginTop: width / 30, width: w / 1.2, borderWidth: 1, borderColor: '#ddd', marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#fafafa', flexDirection: 'row', borderRadius: width / 12 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="password" size={width / 18} style={{ top: width / 40, marginLeft: width / 30 }} color="grey" />
                                    {this.state.viewStatus === true ?
                                        <TextInput
                                            autoCapitalize='none'
                                            onChangeText={(text) => this.setState({ password: text, })}
                                            value={this.state.password}
                                            style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.6, marginLeft: 'auto', marginRight: 'auto', height: width / 9, paddingLeft: 8 }}
                                            returnKeyType='next'
                                            placeholderTextColor='grey'
                                            placeholder={i18n.t('password')} /> :
                                        <TextInput
                                            secureTextEntry
                                            autoCapitalize='none'
                                            onChangeText={(text) => this.setState({ password: text, })}
                                            value={this.state.password}
                                            style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), width: w / 1.6, marginLeft: 'auto', marginRight: 'auto', height: width / 9, paddingLeft: 8 }}
                                            returnKeyType='next'
                                            placeholderTextColor='grey'
                                            placeholder={i18n.t('password')} />}
                                </View>
                                <TouchableOpacity onPress={() => this.setState({ viewStatus: !this.state.viewStatus })}>
                                    <Icon name={this.state.viewStatus === true ? "eye" : "pending"} size={width / 16} style={{ top: width / 40 }} color="grey" />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                                <View style={{ width: w / 1.2, marginTop: width / 20, marginLeft: 'auto', marginRight: 'auto', justifyContent: 'flex-end', flexDirection: 'row' }}>
                                    <Text style={{ fontSize: width / 24, color: '#333', fontWeight: 'bold', transform: transform(), }}>{i18n.t('forgotPassword')} ?</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.push('AuthLoadingScreen', { role: 'Member' })}>
                                <View style={{ width: w / 1.2, backgroundColor: 'orange', paddingBottom: width / 50, marginTop: width / 25, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 12 }}>
                                    <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 40, transform: transform(), }}>{i18n.t('login')}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ width: w / 1.2, marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={{ fontSize: width / 20, color: '#333', fontWeight: 'bold', transform: transform(), textAlign: 'center' }}>(Or)</Text>
                            </View>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('MobileLogin')}>
                                <View style={{ width: w / 1.2, marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon name='mobile' color='orange' size={width / 15} />
                                    <Text style={{ fontSize: width / 25, color: 'orange', fontWeight: 'bold', transform: transform(), textAlign: 'center', marginLeft: width / 50 }}>Login with Mobile Number</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, marginTop: width / 20, bottom: 0, marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={{ fontSize: width / 28, color: '#333', top: 5, transform: transform(), }}>{i18n.t('dontHaveAnAccount')}</Text>
                                <View style={{ flexDirection: 'column' }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
                                        <Text style={{ fontSize: width / 18, color: '#333', fontWeight: 'bold', transform: transform(), }}>{i18n.t('signUp')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </View >
        )
    }
}

export default Login