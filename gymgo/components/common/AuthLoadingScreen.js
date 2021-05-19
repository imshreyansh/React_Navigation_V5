import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import jwtDecode from 'jwt-decode'
import AuthLoader from '../../utils/resources/AuthLoader'
import { Text, View, AppState, Platform } from 'react-native';
import { getDesignationById, getUserDetailsById, pushToken, getUserByCredentials } from '../../utils/api/authorization'
import { ApnToFCM } from '../../utils/api/notifications'
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import i18n from 'i18n-js'

export default class AuthLoadingScreen extends React.Component {
  state = {
    loading: false,
    savedDesignation: '',
    doneFingerAuth: '',
    reactToken: '',
    navigation: '',
    getRole: '',
    status: ''
  }
  constructor() {
    super()
    this.callNav()
  }
  componentDidMount() {
    this._isMounted = true
    if (this._isMounted) {
      this.setState({ loading: true })
      if (Platform.OS === 'android') {
        PushNotification.configure({

          onRegister: (token) => {
            this.setState({
              reactToken: token
            })
          },
          // (required) Called when a remote or local notification is opened or received
          onNotification: async function (notification) {
            console.log("NOTIFICATION:", notification);
            const value = notification.foreground === true ? 'not' : 'go'
            if (AppState.currentState === 'background') {
              try {
                await AsyncStorage.setItem('NotificationNavigation', '');
                await AsyncStorage.setItem('NotificationNavigationForeground', value);
                await AsyncStorage.setItem('AppState', 'background');

              } catch (error) {
                console.log('AsyncStorage error: ' + error.message);
              }
            } else if (AppState.currentState === 'active') {
              try {
                await AsyncStorage.setItem('NotificationNavigation', notification.mobileCompo);
                await AsyncStorage.setItem('NotificationNavigationForeground', value);
                await AsyncStorage.setItem('AppState', 'active');

              } catch (error) {
                console.log('AsyncStorage error: ' + error.message);
              }
            }

            // process the notification here
            // required on iOS only 
          },
          // Android only
          senderID: "862510322387", //avaiable from firebase

          popInitialNotification: true,
          requestPermissions: true
        });
      } else {
        PushNotificationIOS.requestPermissions();
        PushNotificationIOS.addEventListener('register', (token) => {
          const arr = []
          arr.push(token)
          const obj = {
            application: 'com.pixelminditsolutions.gymnago',
            // sandbox: true, //For Environment/Development
            sandbox: false, //For Production
            apns_tokens: arr
          }
          ApnToFCM(obj).then(res => {
            if (res) {
              const reactToken = {
                token: res.data.results[0].registration_token
              }
              this.setState({
                reactToken
              })
              PushNotificationIOS.addEventListener('notification', (notification) => {
                const isClicked = notification.getData().userInteraction === 1;
                if (isClicked) {
                  // Navigate user to another screen
                } else {
                  // Do something else with push notification
                }
              });
            }
          })
        })
      }

    }


  }

  componentWillUnmount() {
    this._isMounted = false

  }

  callNav = async () => {
    const token = await AsyncStorage.getItem('authedToken')
    const userInfo = token === null || token === '' ? '' : jwtDecode(token)
    const { role } = this.props.route.params !== undefined ? this.props.route.params : ''
    const credential = token === null || token === '' ? '' : jwtDecode(token).credential
    console.log('0')

    userInfo === '' ?
      this.setState({
        loading: false,
        getRole: userInfo.designation
      }, () => {
        this.props.navigation.navigate('Auth')
      })

      : await getDesignationById(userInfo.designation).then(res => {
        if (res) {
          this.setState({
            savedDesignation: res.data.response.designationName
          }, () => {
            const reactToken = {
              reactToken: this.state.reactToken.token
            }
            pushToken(credential, reactToken).then(res => {
              if (res) {
                console.log('')
              }
            })
            if (i18n.locale === 'ar') {

              if (this.state.savedDesignation === 'Member') {
                getUserDetailsById(userInfo.credential).then(res => {
                  if (res) {
                    if (res.data.response.status === true) {
                      this.setState({
                        doneFingerAuth: res.data.response.doneFingerAuth,
                      }, () => {
                        if (userInfo !== '' && this.state.savedDesignation === 'Member' && this.state.doneFingerAuth === false) {
                          this.setState({
                            loading: false
                          })
                          this.props.navigation.navigate('NoPackageDrawerNavigatorArabic')
                        }
                        else if (userInfo !== '' && this.state.savedDesignation === 'Member' && this.state.doneFingerAuth !== false) {
                          this.setState({
                            loading: false
                          })
                          this.props.navigation.navigate('MainDrawerNavigatorArabic')
                        }

                        else if (role === 'Member' && this.state.doneFingerAuth === false) {
                          this.setState({
                            loading: false
                          })
                          this.props.navigation.navigate('NoPackageDrawerNavigatorArabic')

                        } else if (role === 'Member' && this.state.doneFingerAuth !== false) {
                          this.setState({
                            loading: false
                          })
                          this.props.navigation.navigate('MainDrawerNavigatorArabic')
                        }

                      })
                    } else {
                      this.setState({
                        loading: false
                      })
                      this.props.navigation.navigate('AuthStackNavigator')
                    }

                  }
                })
              } else if (this.state.savedDesignation === 'Trainer') {
                getUserByCredentials(userInfo.credential).then(res => {
                  if (res) {
                    if (res.data.response.userId.status === true) {
                      if (userInfo !== '' && this.state.savedDesignation === 'Trainer') {
                        this.setState({
                          loading: false
                        })
                        this.props.navigation.navigate('TrainerMainDrawerNavigatorArabic')
                      } else if (role === 'Trainer') {
                        this.setState({
                          loading: false
                        })
                        this.props.navigation.navigate('TrainerMainDrawerNavigatorArabic')
                      }
                    } else {
                      this.setState({
                        loading: false
                      })
                      this.props.navigation.navigate('AuthStackNavigator')
                    }
                  }
                })

              } else {
                if (userInfo !== '' && this.state.savedDesignation === 'System Admin') {
                  this.setState({
                    loading: false
                  })
                  this.props.navigation.navigate('AdminMainDrawerNavigatorArabic')
                } else if (role === 'System Admin') {
                  this.setState({
                    loading: false
                  })
                  this.props.navigation.navigate('AdminMainDrawerNavigatorArabic')
                }
              }
            } else {

              if (this.state.savedDesignation === 'Member') {
                getUserDetailsById(userInfo.credential).then(res => {
                  if (res) {
                    if (res.data.response.status === true) {
                      this.setState({
                        doneFingerAuth: res.data.response.doneFingerAuth,
                      }, () => {
                        if (userInfo !== '' && this.state.savedDesignation === 'Member' && this.state.doneFingerAuth === false) {
                          this.setState({
                            loading: false
                          })
                          this.props.navigation.navigate('NoPackageDrawerNavigator')
                        }
                        else if (userInfo !== '' && this.state.savedDesignation === 'Member' && this.state.doneFingerAuth !== false) {
                          this.setState({
                            loading: false
                          })
                          this.props.navigation.navigate('MemberDrawerWhenFingerAuthEnglish')
                        }

                        else if (role === 'Member' && this.state.doneFingerAuth === false) {
                          this.setState({
                            loading: false
                          })
                          this.props.navigation.navigate('NoPackageDrawerNavigator')

                        } else if (role === 'Member' && this.state.doneFingerAuth !== false) {
                          this.setState({
                            loading: false
                          })
                          this.props.navigation.navigate('MemberDrawerWhenFingerAuthEnglish')
                        }

                      })
                    } else {
                      this.setState({
                        loading: false
                      })
                      this.props.navigation.navigate('AuthStackNavigator')
                    }

                  }
                })
              } else if (this.state.savedDesignation === 'Trainer') {
                getUserByCredentials(userInfo.credential).then(res => {
                  if (res) {
                    if (res.data.response.userId.status === true) {
                      if (userInfo !== '' && this.state.savedDesignation === 'Trainer') {
                        this.setState({
                          loading: false
                        })
                        this.props.navigation.navigate('TrainerMainDrawerNavigator')
                      } else if (role === 'Trainer') {
                        this.setState({
                          loading: false
                        })
                        this.props.navigation.navigate('TrainerMainDrawerNavigator')
                      }
                    } else {
                      this.setState({
                        loading: false
                      })
                      this.props.navigation.navigate('AuthStackNavigator')
                    }
                  }
                })

              } else {
                if (userInfo !== '' && this.state.savedDesignation === 'System Admin') {
                  this.setState({
                    loading: false
                  })
                  this.props.navigation.navigate('AdminMainDrawerNavigator')
                } else if (role === 'System Admin') {
                  this.setState({
                    loading: false
                  })
                  this.props.navigation.navigate('AdminMainDrawerNavigator')
                }
              }
            }


          })
        } else {
          this.setState({
            loading: false
          })
          this.props.navigation.navigate('AuthStackNavigator')

        }
      })



  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <AuthLoader loading={this.state.loading} text='Loading' />

      </View>
    )
  }
}