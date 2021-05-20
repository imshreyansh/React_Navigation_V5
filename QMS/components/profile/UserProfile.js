import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, ImageBackground, StyleSheet } from 'react-native'
import Svg, { Ellipse, Defs, ClipPath, Image as SvgImage, Path } from 'react-native-svg'
import { h, w, width, height, Icon, transform, textAlign } from '../../utils/resources/helpers'
import image from '../../assets/images/image.jpg'
import main_img from '../../assets/images/profile_pic.jpg'
import i18n from 'i18n-js'

class UserProfile extends Component {
    state = {
        edit: false,
    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {

        }
    }


    componentWillUnmount() {
        this._isMounted = false

    }

    renderView = () => {
        if (this.state.edit) {
            return (

                <View style={{ width: w, marginTop: width / 30, paddingBottom: width / 30 }}>
                    <View style={{ flexDirection: 'row', width: w }}>
                        <View style={{ borderWidth: 2, borderColor: '#ddd', width: width / 10, marginLeft: width / 22, borderRadius: 8, height: width / 8 }}>
                            <Icon name='email' color='orange' size={width / 22} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} />
                        </View>
                        <View>
                            <Text style={{ marginLeft: width / 40, fontSize: width / 25, color: '#9e9e9e' }}> Email</Text>
                            <Text style={{ marginLeft: width / 40, fontSize: width / 28, width: w / 1.4, }}> mohamed123@gmail.com</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: w, marginTop: width / 30 }}>
                        <View style={{ borderWidth: 2, borderColor: '#ddd', width: width / 10, marginLeft: width / 22, borderRadius: 8, height: width / 8 }}>
                            <Icon name='mobile' color='orange' size={width / 22} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} />
                        </View>
                        <View>
                            <Text style={{ marginLeft: width / 40, fontSize: width / 25, color: '#9e9e9e' }}> Mobile Number</Text>
                            <Text style={{ marginLeft: width / 40, fontSize: width / 28, width: w / 1.4, }}> mohamed123@gmail.com</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: w, marginTop: width / 30 }}>
                        <View style={{ borderWidth: 2, borderColor: '#ddd', width: width / 10, marginLeft: width / 22, borderRadius: 8, height: width / 8 }}>
                            <Icon name='attendance' color='orange' size={width / 22} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} />
                        </View>
                        <View>
                            <Text style={{ marginLeft: width / 40, fontSize: width / 25, color: '#9e9e9e' }}> Personal ID</Text>
                            <Text style={{ marginLeft: width / 40, fontSize: width / 28, width: w / 1.4, }}> 658742145</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: w, marginTop: width / 30 }}>
                        <View style={{ borderWidth: 2, borderColor: '#ddd', width: width / 10, marginLeft: width / 22, borderRadius: 8, height: width / 8 }}>
                            <Icon name='calender' color='orange' size={width / 22} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} />
                        </View>
                        <View>
                            <Text style={{ marginLeft: width / 40, fontSize: width / 25, color: '#9e9e9e' }}> Date of Birth</Text>
                            <Text style={{ marginLeft: width / 40, fontSize: width / 28, width: w / 1.4, }}> 15/02/1992</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: w, marginTop: width / 30 }}>
                        <View style={{ borderWidth: 2, borderColor: '#ddd', width: width / 10, marginLeft: width / 22, borderRadius: 8, height: width / 8 }}>
                            <Icon name='gender' color='orange' size={width / 22} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} />
                        </View>
                        <View>
                            <Text style={{ marginLeft: width / 40, fontSize: width / 25, color: '#9e9e9e' }}> Gender</Text>
                            <Text style={{ marginLeft: width / 40, fontSize: width / 28, width: w / 1.4, }}> Male</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: w, marginTop: width / 30 }}>
                        <View style={{ borderWidth: 2, borderColor: '#ddd', width: width / 10, marginLeft: width / 22, borderRadius: 8, height: width / 8 }}>
                            <Icon name='navigation-transport' color='orange' size={width / 22} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} />
                        </View>
                        <View>
                            <Text style={{ marginLeft: width / 40, fontSize: width / 25, color: '#9e9e9e' }}> Address</Text>
                            <Text style={{ marginLeft: width / 40, fontSize: width / 28, width: w / 1.4, }}> Manama, Bahrain</Text>
                        </View>
                    </View>
                </View>
            )



        }
        else {
            return (
                <View style={{ width: w, marginTop: width / 30, paddingBottom: width / 30 }}>
                    <View style={{ flexDirection: 'row', width: w }}>
                        <View style={{ borderWidth: 2, borderColor: '#ddd', width: width / 10, marginLeft: width / 22, borderRadius: 8, height: width / 8 }}>
                            <Icon name='email' color='orange' size={width / 22} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} />
                        </View>
                        <View>
                            <Text style={{ marginLeft: width / 40, fontSize: width / 25, color: '#9e9e9e' }}> Email</Text>
                            <TextInput style={{ marginLeft: width / 40, fontSize: width / 28, width: w / 1.4, borderBottomWidth: 2, borderBottomColor: '#9e9e9e' }} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: w, marginTop: width / 30 }}>
                        <View style={{ borderWidth: 2, borderColor: '#ddd', width: width / 10, marginLeft: width / 22, borderRadius: 8, height: width / 8 }}>
                            <Icon name='mobile' color='orange' size={width / 22} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} />
                        </View>
                        <View>
                            <Text style={{ marginLeft: width / 40, fontSize: width / 25, color: '#9e9e9e' }}> Mobile Number</Text>
                            <TextInput style={{ marginLeft: width / 40, fontSize: width / 28, width: w / 1.4, borderBottomWidth: 2, borderBottomColor: '#9e9e9e' }} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: w, marginTop: width / 30 }}>
                        <View style={{ borderWidth: 2, borderColor: '#ddd', width: width / 10, marginLeft: width / 22, borderRadius: 8, height: width / 8 }}>
                            <Icon name='attendance' color='orange' size={width / 22} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} />
                        </View>
                        <View>
                            <Text style={{ marginLeft: width / 40, fontSize: width / 25, color: '#9e9e9e' }}> Personal ID</Text>
                            <TextInput style={{ marginLeft: width / 40, fontSize: width / 28, width: w / 1.4, borderBottomWidth: 2, borderBottomColor: '#9e9e9e' }} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: w, marginTop: width / 30 }}>
                        <View style={{ borderWidth: 2, borderColor: '#ddd', width: width / 10, marginLeft: width / 22, borderRadius: 8, height: width / 8 }}>
                            <Icon name='calender' color='orange' size={width / 22} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} />
                        </View>
                        <View>
                            <Text style={{ marginLeft: width / 40, fontSize: width / 25, color: '#9e9e9e' }}> Date of Birth</Text>
                            <TextInput style={{ marginLeft: width / 40, fontSize: width / 28, width: w / 1.4, borderBottomWidth: 2, borderBottomColor: '#9e9e9e' }} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: w, marginTop: width / 30 }}>
                        <View style={{ borderWidth: 2, borderColor: '#ddd', width: width / 10, marginLeft: width / 22, borderRadius: 8, height: width / 8 }}>
                            <Icon name='gender' color='orange' size={width / 22} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} />
                        </View>
                        <View>
                            <Text style={{ marginLeft: width / 40, fontSize: width / 25, color: '#9e9e9e' }}> Gender</Text>
                            <TextInput style={{ marginLeft: width / 40, fontSize: width / 28, width: w / 1.4, borderBottomWidth: 2, borderBottomColor: '#9e9e9e' }} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: w, marginTop: width / 30 }}>
                        <View style={{ borderWidth: 2, borderColor: '#ddd', width: width / 10, marginLeft: width / 22, borderRadius: 8, height: width / 8 }}>
                            <Icon name='navigation-transport' color='orange' size={width / 22} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} />
                        </View>
                        <View>
                            <Text style={{ marginLeft: width / 40, fontSize: width / 25, color: '#9e9e9e' }}> Address</Text>
                            <TextInput style={{ marginLeft: width / 40, fontSize: width / 28, width: w / 1.4, borderBottomWidth: 2, borderBottomColor: '#9e9e9e' }} />
                        </View>
                    </View>
                </View>
            );
        }
    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Image source={image} resizeMode='stretch' style={{ width: w, height: h / 2, position: 'absolute' }} />
                <ScrollView contentContainerStyle={{ paddingBottom: width / 50 }}>
                    <KeyboardAvoidingView>
                        <View style={styles.container}>
                            <Icon name='back' color='white' size={width / 20} style={{ marginTop: 'auto', marginBottom: 'auto' }} onPress={() => this.props.navigation.goBack()} />
                            <Text style={styles.Text}>My Profile</Text>
                        </View>
                        <View style={styles.scnd_view}>
                            <View style={styles.thrd_vw}>
                                <Image source={main_img} style={styles.img} />
                                <View style={{ width: width / 18, height: width / 18, backgroundColor: 'white', borderRadius: width / 36, top: height / -200, position: 'absolute', right: width / 2.5 }}>
                                    <Icon name='edit' color='#333' size={width / 30} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} />
                                </View>
                            </View>
                            <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                <Text style={{ fontSize: width / 22, fontWeight: 'bold', bottom: width / 20 }}>Mohammed Abdulla</Text>
                            </View>
                            <View style={{ width: w / 1.08, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                                <View style={{ width: w / 3.5, backgroundColor: '#9ccc65', padding: width / 30, borderRadius: 5 }}>
                                    <Text style={{ fontSize: width / 22, color: 'white', fontWeight: 'bold', textAlign: 'center', width: w / 5 }}>180</Text>
                                    <Text style={{ fontSize: width / 32, color: 'white', width: w / 5, textAlign: 'center' }}>Total</Text>
                                    <Text style={{ fontSize: width / 32, color: 'white', textAlign: 'center' }}>Appointments</Text>
                                </View>
                                <View style={{ width: w / 3.5, backgroundColor: '#7e57c2', padding: width / 30, borderRadius: 5 }}>
                                    <Text style={{ fontSize: width / 22, color: 'white', fontWeight: 'bold', textAlign: 'center', width: w / 5 }}>180</Text>
                                    <Text style={{ fontSize: width / 32, color: 'white', width: w / 5, textAlign: 'center' }}>Total</Text>
                                    <Text style={{ fontSize: width / 32, color: 'white', textAlign: 'center' }}>Appointments</Text>
                                </View>
                                <View style={{ width: w / 3.5, backgroundColor: '#ef5350', padding: width / 30, borderRadius: 5 }}>
                                    <Text style={{ fontSize: width / 22, color: 'white', fontWeight: 'bold', textAlign: 'center', width: w / 5 }}>180</Text>
                                    <Text style={{ fontSize: width / 32, color: 'white', width: w / 5, textAlign: 'center' }}>Total</Text>
                                    <Text style={{ fontSize: width / 32, color: 'white', textAlign: 'center' }}>Appointments</Text>
                                </View>
                            </View>
                            <View style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30 }}>
                                <Text style={{ fontSize: width / 22, color: '#333', fontWeight: 'bold' }}>My Information</Text>
                                <TouchableOpacity onPress={() => this.setState({ edit: true })}>
                                    <View style={{ width: w / 4, borderRadius: width / 20, borderWidth: 1, borderColor: 'orange', padding: width / 80 }}>
                                        <View style={{ flexDirection: 'row', width: w / 6.5, marginLeft: 'auto', marginRight: 'auto', justifyContent: 'space-between' }}>
                                            <Icon name='edit' color='orange' size={width / 22} style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                                            <Text style={{ fontSize: width / 25, color: 'orange', textAlign: 'center' }}>Edit</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                            </View>
                            {this.renderView()}
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </View >
        )
    }
}

export default UserProfile

const styles = StyleSheet.create({
    container: {
        width: w / 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: width / 17,
    },
    Text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: width / 22,
        marginLeft: width / 50
    },
    scnd_view: {
        backgroundColor: 'white',
        paddingBottom: width / 20,
        width: w,
        marginTop: h / 10,
        borderTopLeftRadius: width / 14,
        borderTopRightRadius: width / 14
    },

    thrd_vw: {
        bottom: height / 15,
        width: w,
        marginLeft: 'auto',
        marginRight: 'auto',
        justifyContent: 'center',
        alignItems: 'center',

    },
    img: {
        width: width / 3,
        height: width / 3,
        borderRadius: width / 6,
        borderWidth: 3,
        borderColor: 'white',
        marginLeft: 'auto',
        marginRight: 'auto',


    }

})