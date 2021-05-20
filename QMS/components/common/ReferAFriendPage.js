import React from 'react';
import { View, Text, Linking, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import curvedImage from '../../assets/images/curvedImage.png'
import referIcon from '../../assets/images/referIcon.png'
import fb from '../../assets/images/fb.png'
import wa from '../../assets/images/wa.png'
import sms from '../../assets/images/sms.png'
import i18n from 'i18n-js'
import { generateCode } from '../../utils/api/rewards'
export default class ReferAFriendPage extends React.Component {
  state = {
    url: `Referrall Code`,
    member: '',
    referral: ''
  }
  static navigationOptions = ({ navigation }) => {
    return {
      tabBarLabel: i18n.t('referAFriend'),
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('authedToken').then((token) => {
      const memberId = jwtDecode(token).userId

      this.setState({
        memberId
      }, () => {
        const obj = {
          member: memberId,
          referPolicy: this.props.navigation.getParam('id')
        }
        generateCode(obj).then(res => {
          if (res) {
            this.setState({
              referral: res.data.response,
              url: `${i18n.t('referralCode')} ${res.data.response.code}`
            })
          }
        })
      })

    })
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#eeeeee', transform: transform() }}>
        <ScrollView contentContainerStyle={{ paddingBottom: width / 20 }}>
          <ImageBackground source={curvedImage} style={{ width: w, height: height / 2 }} >
            <View elevation={3} style={{ width: w, marginTop: height / 50 }}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon name="back-button" size={width / 15} style={{ marginLeft: width / 30 }} color="white" />
              </TouchableOpacity>
            </View>
            <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: height / 50 }}>
              <Image source={referIcon} style={{ transform: transform(), width: width / 3, height: width / 3, marginLeft: 'auto', marginRight: 'auto', }} />
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: width / 15, color: 'white', fontWeight: 'bold', width: w / 2, textAlign: 'center', transform: transform() }}>{i18n.t('referYour')}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: width / 25, color: 'white', width: w / 1.2, textAlign: 'center', transform: transform() }}>{i18n.t('shareCode')} {this.props.navigation.getParam('points')} {i18n.t('points')}</Text>
              </View>
            </View>
          </ImageBackground>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: width / 30 }}>
            <Text style={{ fontSize: width / 22, color: '#333', width: w / 1.2, textAlign: 'center', transform: transform() }}>{i18n.t('referralCode')}</Text>
            <View style={{ width: w / 2, padding: width / 30, backgroundColor: '#fdd835', marginTop: width / 30, borderRadius: 8, borderColor: 'grey', borderWidth: 1 }}>
              <Text style={{ fontSize: width / 18, color: '#333', width: w / 2.5, textAlign: 'center', transform: transform() }}>{this.state.referral.code}</Text>
            </View>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: height / 10 }}>
            <Text style={{ fontSize: width / 22, color: '#333', width: w / 1.2, textAlign: 'center', transform: transform() }}>{i18n.t('shareVia')}</Text>
          </View>
          <View style={{ flexDirection: 'row', width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20, justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => Linking.openURL(`sms:?body=${this.state.url}`)}>
              <View style={{ width: w / 3, padding: width / 30, backgroundColor: 'white', borderRadius: 3, borderColor: '#0d47a1', borderWidth: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 4, marginLeft: 'auto', marginRight: 'auto' }}>
                  <Image source={fb} style={{ transform: transform(), width: width / 18, height: width / 18, transform: transform() }} />
                  <Text style={{ fontSize: width / 28, color: '#0d47a1', transform: transform() }}>Facebook</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?text=${this.state.url}`)}>
              <View style={{ width: w / 3, padding: width / 30, backgroundColor: 'white', borderRadius: 3, borderColor: '#388e3c', borderWidth: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 4, marginLeft: 'auto', marginRight: 'auto' }}>
                  <Image source={wa} style={{ transform: transform(), width: width / 12, height: width / 18, transform: transform() }} />
                  <Text style={{ fontSize: width / 28, color: '#388e3c', transform: transform() }}>Whatsapp</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>

    )
  }
}