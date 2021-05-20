import React from 'react';
import { View, Text, Platform, Image, ScrollView, TouchableOpacity, RefreshControl, ImageBackground, Modal, AppState } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import image from '../../assets/images/curvedImage.png'
import notifyBell from '../../assets/images/notifyBell.png'
import sampleNotify from '../../assets/images/sampleNotify.png'
import Svg, { Ellipse, Defs, ClipPath, Image as SvgImage } from 'react-native-svg'
import { Icon, width, height, w, h, transform, textAlign, URL, paddingRightHome } from '../../utils/api/helpers'
// import { DrawerActions } from 'react-navigation-drawer';
import { getUserDetailsById, getMemberById } from '../../utils/api/authorization'
import { getPackagesByID, startPackage } from '../../utils/api/package'
import { getAllOffer } from '../../utils/api/rewards'
import { getUserNotification, readUserNotifications, clearUserNotifications } from '../../utils/api/notifications'
import Loader from '../../utils/resources/Loader'
import blue from '../../assets/images/blue.jpg'
import cash from '../../assets/images/cash.png'
import red from '../../assets/images/red.jpg'
import green from '../../assets/images/green.jpg'
import io from 'socket.io-client'
let socket
const ENDPOINT = `https://skoolgo.pixelmindit.com:5000/notification`
import i18n from 'i18n-js'

export default class HomePage extends React.Component {
  _isMounted = false

  state = {
    contents: [],
    offers: [],
    rtl: null,
    userId: "",
    userDetails: "",
    userCredentials: "",
    avatar: '',
    packages: [],
    showPackage: '',
    showIndex: 0,
    packageDetails: '',
    periodPackage: '',
    showStart: true,
    currentPackage: '',
    memberId: '',
    endPeriodDate: '',
    refreshing: false,
    loading: false,
    notification: [],
    modalVisible: false,
    allExpired: false,
    notificationRead: [],
    modalVisibleTwo: false,
    Difference_In_Days: ''

  }
  componentDidMount() {
    this.currentPackage()
    this._isMounted = true
    if (this._isMounted) {
      AsyncStorage.getItem('NotificationNavigationForeground').then(values => {
        if (values === 'go' && values !== 'not' && values !== 'null') {
          AsyncStorage.getItem('AppState').then(status => {
            if (status === 'active' && AppState.currentState === 'active') {
              AsyncStorage.getItem('NotificationNavigation').then((id) => {
                if (id !== '' || id !== null || id !== undefined) {
                  this.props.navigation.navigate(id)
                  AsyncStorage.removeItem('NotificationNavigation')
                  AsyncStorage.removeItem('AppState')
                  AsyncStorage.removeItem('NotificationNavigationForeground')
                }
              })
            }

          })
        }
      })


      AsyncStorage.getItem('authedToken').then((token) => {
        const userId = jwtDecode(token).credential
        const memberId = jwtDecode(token).userId
        this.setState({
          userId,
          memberId
        }, () => {
          socket = io(ENDPOINT, { query: { userId: this.state.userId } })
          socket.on('getNotification', data => {
            this.setState({
              notification: data.filter(d => d.notificationType === 'Mobile').reverse(),
              notificationRead: data.filter(d => (d.notificationType === 'Mobile' && d.read === false))
            })
          })
          this._onRefresh()

          getMemberById(this.state.memberId).then(res => {
            if (res) {
              this.setState({
                currentPackage: res.data.response.packageDetails[0],
                endPeriodDate: res.data.response.packageDetails[0].packages.period.periodDays
              })
            }
          })
          const data = {
            userId: this.state.userId,
            notificationType: 'Mobile'
          }

          getUserNotification(data).then(res => {
            if (res) {
              this.setState({
                notification: res.data.response,
                notificationRead: res.data.response.filter(d => d.read === false)
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
  static navigationOptions = ({ navigation }) => {
    return {
      tabBarLabel: i18n.t('home')
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  setModalVisibleTwo(visible) {
    this.setState({ modalVisibleTwo: visible });
  }

  openContent = (id) => {
    if (id === 1) {
      this.props.navigation.navigate('Workouts')
    } else if (id === 2) {
      this.props.navigation.navigate('DietPlanScreen')
    } else if (id === 3) {
      this.props.navigation.navigate('MyTrainerTab')
    } else if (id === 4) {
      this.props.navigation.navigate('ClassHome')
    } else if (id === 5) {
      this.props.navigation.navigate('MenuItems')
    } else if (id === 6) {
      this.props.navigation.navigate('RenewPackage')
    } else if (id === 7) {
      this.props.navigation.navigate('SchedulePage')
    } else if (id === 8) {
      this.props.navigation.navigate('MemberAttendance')
    } else if (id === 9) {
      this.props.navigation.navigate('BookAppointmentNavigator')
    }
  }

  currentPackage = () => {
    this.setState({ showPackage: this.state.packages[0], showIndex: 0 }, () => {
      if (this.state.showPackage) {
        this.calculateDays()
      }
    })
  }

  currentPackageRight = () => {
    if (this.state.showIndex < this.state.packages.length - 1) {
      this.setState({ showPackage: this.state.packages[this.state.showIndex + 1], showIndex: this.state.showIndex + 1 }, () => {
        if (this.state.showPackage !== undefined) {

          getPackagesByID(this.state.showPackage.packages).then(res => {
            if (res) {
              this.setState({
                packageDetails: res.data.response,
                periodPackage: res.data.response.period
              }, () => {
                if (this.state.packages.length > 0) {
                  this.calculateDays()
                }
              })
            }
          })
        } else {
          this.setState({
            refreshing: false,
            allExpired: true
          })
        }
      })
    }
    // else {
    //   this.currentPackage()
    // }
  }
  currentPackageLeft = () => {
    if (this.state.showIndex > 0) {
      this.setState({ showPackage: this.state.packages[this.state.showIndex - 1], showIndex: this.state.showIndex - 1 }, () => {
        if (this.state.showPackage !== undefined) {
          getPackagesByID(this.state.showPackage.packages).then(res => {
            if (res) {
              this.setState({
                packageDetails: res.data.response,
                periodPackage: res.data.response.period
              }, () => {
                if (this.state.packages.length > 0) {
                  this.calculateDays()
                }
              })
            }
          })
        } else {
          this.setState({
            refreshing: false,
            allExpired: true
          })
        }

      })
    }
  }

  calculateDays = () => {
    if (this.state.showPackage.reactivationDate) {
      if (new Date() >= new Date(this.state.showPackage.reactivationDate)) {
        const dateOne = this.state.showPackage === undefined || this.state.showPackage === '' ? '' : new Date(new Date().setHours(0, 0, 0, 0));
        const dateTwo = this.state.showPackage === undefined || this.state.showPackage === '' ? '' : new Date(new Date(this.state.showPackage.extendDate).setHours(0, 0, 0, 0));
        const d = this.state.showPackage === undefined || this.state.showPackage === '' ? '' : dateTwo.getTime() - dateOne.getTime();
        const Difference_In_Days = this.state.showPackage === undefined || this.state.showPackage === '' ? '' : d / (1000 * 3600 * 24)
        this.setState({ Difference_In_Days: Math.abs(Difference_In_Days) });
      } else {
        const dateOne = this.state.showPackage === undefined || this.state.showPackage === '' ? '' : new Date(new Date(this.state.showPackage.startDate).setHours(0, 0, 0, 0));
        const dateTwo = this.state.showPackage === undefined || this.state.showPackage === '' ? '' : new Date(new Date(this.state.showPackage.freezeDate).setHours(0, 0, 0, 0));
        const da = this.state.showPackage === undefined || this.state.showPackage === '' ? '' : dateTwo.getTime() - dateOne.getTime();
        const freeze = this.state.showPackage === undefined || this.state.showPackage === '' ? '' : da / (1000 * 3600 * 24)
        const Difference_In_Days = this.state.packageDetails === undefined || this.state.packageDetails === '' ? '' : this.state.packageDetails.period.periodDays - freeze
        this.setState({ Difference_In_Days: Math.abs(Difference_In_Days) });
      }
    } else {
      const dateOne = this.state.showPackage === undefined || this.state.showPackage === '' ? '' : new Date(new Date().setHours(0, 0, 0, 0));
      const dateTwo = this.state.showPackage === undefined || this.state.showPackage === '' ? '' : new Date(new Date(this.state.showPackage.extendDate ? this.state.showPackage.extendDate : this.state.showPackage.endDate).setHours(0, 0, 0, 0));
      const Difference_In_Time = this.state.showPackage === undefined || this.state.showPackage === '' ? '' : dateTwo.getTime() - dateOne.getTime();
      const Difference_In_Days = this.state.showPackage === undefined || this.state.showPackage === '' ? '' : Difference_In_Time / (1000 * 3600 * 24)
      this.setState({ Difference_In_Days: Math.abs(Difference_In_Days) });
    }

  }

  _onRefresh = () => {
    this.setState({
      refreshing: true
    })

    getAllOffer().then(res => {

      if (res) {
        this.setState({
          offers: res.data.response === null ? [] : res.data.response.filter(data => new Date().setHours(0, 0, 0, 0) <= new Date(data.endDate)),
        })
      }
    })

    getUserDetailsById(this.state.userId).then(res => {
      if (res) {
        this.setState({
          userDetails: res.data.response,
          userCredentials: res.data.response.credentialId,
          avatar: `${URL}/${res.data.response.credentialId.avatar.path.replace(/\\/g, "/")}`,
          packages: res.data.response.packageDetails.filter(data => (new Date().setHours(0, 0, 0, 0) <= new Date(data.extendDate ? data.extendDate : data.endDate) || !data.endDate)),
        }, () => {
          this.setState({
            showPackage: this.state.packages[0],
            contents: this.state.packages.length > 0 ? [{ id: 1, name: i18n.t('myWorkouts'), icon: 'workouts', backgroundColor: 'orange' }, { id: 2, name: i18n.t('myDietPlan'), icon: 'diet-plans', backgroundColor: '#69f0ae' }, { id: 3, name: i18n.t('myTrainers'), icon: 'trainers', backgroundColor: '#b39ddb' }, { id: 7, name: i18n.t('mySchedule'), icon: 'Schedule', backgroundColor: '#ffd740' }, { id: 4, name: i18n.t('classes'), icon: 'classes', backgroundColor: '#5c6bc0' }, { id: 5, name: i18n.t('gymShop'), icon: 'web-shop', backgroundColor: '#d50000' }, { id: 6, name: i18n.t('myPackages'), icon: 'packages', backgroundColor: '#2196f3' }, { id: 8, name: i18n.t('attendance'), icon: 'attendance', backgroundColor: '#00695c' }, { id: 9, name: i18n.t('bookAppointment'), icon: 'invoices', backgroundColor: '#e91e63' }]
              : [{ id: 7, name: i18n.t('mySchedule'), icon: 'Schedule', backgroundColor: '#ffd740' }, { id: 4, name: i18n.t('classes'), icon: 'classes', backgroundColor: '#5c6bc0' }, { id: 5, name: i18n.t('gymShop'), icon: 'web-shop', backgroundColor: '#d50000' }, { id: 6, name: i18n.t('myPackages'), icon: 'packages', backgroundColor: '#2196f3' }]
          }, () => {
            if (this.state.showPackage !== undefined) {
              getPackagesByID(this.state.showPackage.packages).then(res => {
                if (res) {
                  this.setState({
                    packageDetails: res.data.response,
                    periodPackage: res.data.response.period,
                    refreshing: false
                  }, () => {
                    this.currentPackage()
                  })
                }
              })
            } else {
              this.setState({
                refreshing: false,
                allExpired: true
              })
            }

          })

        })
      }
    })
  }
  // 9900088892
  startPackage = () => {
    const { showPackage, periodPackage, packageDetails } = this.state
    if (showPackage.trainerFees && showPackage.trainer) {
      const startDate = new Date(new Date().setHours(0, 0, 0, 0))
      const endDate = new Date(new Date(new Date().setDate(startDate.getDate() + this.state.periodPackage.periodDays)).setHours(0, 0, 0, 0))
      const trainerEnd = new Date(new Date(new Date().setDate(startDate.getDate() + showPackage.trainerFees.period.periodDays)).setHours(0, 0, 0, 0))
      const data = {
        packageDetailId: showPackage._id,
        startDate,
        endDate,
        memberId: this.state.memberId,
        trainerStart: startDate,
        trainerEnd,
        trainer: showPackage.trainer
      }

      this.setState({
        loading: true
      })
      startPackage(data).then(res => {
        if (res) {

          this.setState({
            showStart: false,
            loading: false
          }, () => {
            this._onRefresh()
          })
        }
      })
    } else {
      const startDate = new Date(new Date().setHours(0, 0, 0, 0))
      const endDate = new Date(new Date(new Date().setDate(startDate.getDate() + this.state.periodPackage.periodDays)).setHours(0, 0, 0, 0))
      const data = {
        packageDetailId: showPackage._id,
        startDate,
        endDate,
        memberId: this.state.memberId,
      }

      this.setState({
        loading: true
      })
      startPackage(data).then(res => {
        if (res) {

          this.setState({
            showStart: false,
            loading: false
          }, () => {
            this._onRefresh()
          })
        }
      })
    }

  }

  setStatusNotification = (id, nav) => {
    const data = []
    data.push(id)
    const obj = {
      ids: data,
      userId: this.state.userId
    }
    socket.emit('readRequest', obj)
    this.setModalVisible(false)
    this.props.navigation.navigate(nav)
  }

  clearNotifications = () => {
    const datas = {
      userId: this.state.userId,
    }
    clearUserNotifications(datas).then(res => {
      if (res) {
        const data = {
          userId: this.state.userId,
          notificationType: 'Mobile'
        }
        getUserNotification(data).then(res => {
          if (res) {
            this.setState({
              notification: res.data.response,
              notificationRead: res.data.response.filter(d => d.read === false)
            })
          }
        })
      }
    })
  }

  render() {
    const endDate = this.state.showPackage === undefined || this.state.showPackage === '' ? '' : `${new Date(this.state.showPackage.extendDate ? this.state.showPackage.extendDate : this.state.showPackage.endDate).getDate()}/${new Date(this.state.showPackage.extendDate ? this.state.showPackage.extendDate : this.state.showPackage.endDate).getMonth() + 1}/${new Date(this.state.showPackage.extendDate ? this.state.showPackage.extendDate : this.state.showPackage.endDate).getFullYear()}`
    // const startDate = this.state.showPackage === undefined || this.state.showPackage === '' ? '' : `${new Date(this.state.showPackage.reactivationDate ? this.state.showPackage.reactivationDate : this.state.showPackage.startDate).getDate()}/${new Date(this.state.showPackage.reactivationDate ? this.state.showPackage.reactivationDate : this.state.showPackage.startDate).getMonth() + 1}/${new Date(this.state.showPackage.reactivationDate ? this.state.showPackage.reactivationDate : this.state.showPackage.startDate).getFullYear()}`
    const startDate = this.state.showPackage === undefined || this.state.showPackage === '' ? '' : `${new Date(this.state.showPackage.startDate).getDate()}/${new Date(this.state.showPackage.startDate).getMonth() + 1}/${new Date(this.state.showPackage.startDate).getFullYear()}`

    const userImage = JSON.parse(JSON.stringify({ uri: this.state.avatar }))
    return (
      <View style={{ transform: transform(), backgroundColor: '#eeeeee', flex: 1 }}>
        <Loader loading={this.state.loading} text='Loading' />

        <Svg height={Platform.OS === 'ios' ? '38%' : '36%'} width='100%'>
          <Defs>
            <ClipPath id="clip">
              <Ellipse
                cx={w / 2}
                cy={h / 8}
                rx={w / 1.5}
                ry={h / 4.5}
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
        <View style={{ position: 'absolute' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: width / 20, paddingBottom: h / 100, width: w }}>
            {/* <TouchableOpacity onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}>
              <Icon name='toggle' color='white' size={width / 15} />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => this.setModalVisible(true)}>
              <View>
                <View>
                  <Icon name='notification' color='white' size={width / 15} />
                  {this.state.notificationRead.length > 0 ? <View style={{ width: width / 25, height: width / 25, backgroundColor: 'red', position: 'absolute', borderRadius: width / 50, top: -5, right: -2 }} /> : <View></View>}
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'center', transform: transform() }}>
            <Image source={userImage} style={{ width: width / 5, height: width / 5, borderRadius: width / 10, borderWidth: 2, borderColor: 'white' }} />
            <Text style={{ fontSize: width / 22, color: 'white', fontWeight: 'bold', marginTop: Platform.OS === 'ios' ? width / 30 : 0 }}>{this.state.userCredentials.userName}</Text>
            <Text style={{ fontSize: width / 28, color: 'white' }}>{i18n.t('memberId')}: {this.state.userDetails.memberId}</Text>
          </View>
        </View>


        <View elevation={3} style={{ bottom: Platform.OS === 'ios' ? h / 30 : h / 20, margin: width / 15, marginTop: 0, marginBottom: 0, width: w / 1.2, backgroundColor: 'white', borderRadius: 4, padding: width / 50, transform: transform(), marginLeft: 'auto', marginRight: 'auto', }}>
          <View style={{ flexDirection: 'row', width: w / 1.3, justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', }}>
            <TouchableOpacity onPress={() => this.currentPackageLeft()}>
              <Icon name='back-button' color='grey' size={width / 20} style={{ marginTop: 'auto', marginBottom: 'auto' }} />
            </TouchableOpacity>
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.6, marginLeft: 'auto', marginRight: 'auto' }}>
                {(this.state.allExpired === false) ? <View style={{ width: w / 5 }}>
                  <Text numberOfLines={2} style={{ fontSize: width / 25, color: '#212121', }}>{this.state.packageDetails.packageName}</Text>
                  <Text style={{ fontSize: width / 32, color: '#333', textAlign: 'left', width: w / 5 }}>{this.state.periodPackage.periodDays} {i18n.t('days')}</Text>
                </View>
                  : <View style={{ width: w / 5 }}>
                    <Text numberOfLines={2} style={{ fontSize: width / 25, color: '#212121', }}>{i18n.t('noPackages')}</Text>
                  </View>}

                {(this.state.allExpired === true) ?
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('RenewPackage')}>
                    <View style={{ borderRadius: 3, width: width / 2.5, paddingBottom: width / 40, paddingTop: width / 40, backgroundColor: "red" }}>
                      <Text style={{ fontSize: width / 25, color: 'white', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', fontWeight: 'bold' }}>{i18n.t('renew')}</Text>
                    </View>
                  </TouchableOpacity>
                  : (this.state.showPackage === undefined || !this.state.showPackage.endDate) ?
                    <TouchableOpacity onPress={() => this.state.showPackage.paidStatus === "UnPaid" ? this.setModalVisibleTwo(true) : this.startPackage()}>
                      <View>
                        <View style={{ borderRadius: 3, width: width / 2.5, paddingBottom: width / 40, paddingTop: width / 40, backgroundColor: "#8bc34a" }}>
                          <Text style={{ fontSize: width / 25, color: 'white', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', fontWeight: 'bold' }}>{i18n.t('startPackage')}</Text>
                        </View></View></TouchableOpacity> :
                    <View style={{ width: w / 5 }}>
                      <Text style={{ fontSize: width / 15, color: '#8bc34a', fontWeight: 'bold', textAlign: 'center' }}>{Math.round(this.state.Difference_In_Days)}</Text>
                      <Text style={{ fontSize: width / 30, color: '#333', textAlign: 'center', bottom: width / 100 }}>{i18n.t('daysLeft')}</Text>
                    </View>


                }
              </View>
              {(this.state.allExpired !== true && (this.state.showPackage !== undefined)) ?
                this.state.showPackage.endDate ?

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.5, marginLeft: 'auto', marginRight: 'auto', }}>
                    <View style={{ width: w / 5, marginLeft: width / 40, paddingTop: width / 60 }}>
                      <Text style={{ fontSize: width / 30, color: '#333' }}>{i18n.t('startOn')}</Text>
                      <Text style={{ fontSize: width / 30, color: '#f58020', fontWeight: 'bold', width: w / 5, textAlign: textAlign(), }}>{startDate}</Text>
                    </View>
                    <View style={{ width: w / 5, marginLeft: width / 40, paddingTop: width / 60 }}>
                      <Text style={{ fontSize: width / 30, color: '#333' }}>{i18n.t('expiryOn')}</Text>
                      <Text style={{ fontSize: width / 30, color: '#f58020', fontWeight: 'bold', width: w / 5, textAlign: textAlign(), }}>{endDate}</Text>
                    </View>

                  </View>
                  : <View></View> : <View></View>}

            </View>
            <TouchableOpacity onPress={() => this.currentPackageRight()}>
              <Icon name='right-arrow' color='grey' size={width / 20} style={{ marginTop: 'auto', marginBottom: 'auto' }} />
            </TouchableOpacity>
          </View>
        </View>



        <ScrollView showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
            progressBackgroundColor='#1976d2'
            colors={['white', 'yellow']}
          />}>
          <View style={{ padding: width / 10, paddingTop: width / 60, paddingBottom: width / 30, flexDirection: 'row', flexWrap: 'wrap', bottom: height / 50, justifyContent: 'space-between', alignItems: 'center' }}>
            {this.state.contents.map((a, i) => {
              return (
                <TouchableOpacity key={i} onPress={() => this.openContent(a.id)}>
                  <View elevation={3} style={{ transform: transform(), flexDirection: 'row', width: w / 2.6, height: height / 12, marginTop: width / 30, justifyContent: 'space-between', backgroundColor: 'white', borderBottomWidth: 4, borderBottomColor: a.backgroundColor, borderRadius: 3 }}>
                    <View style={{ width: w / 2.8, transform: transform(), justifyContent: 'space-between', flexDirection: 'row', marginLeft: 'auto', marginRight: 'auto', }}>
                      <View style={{ width: width / 10, height: width / 10, borderRadius: width / 20, backgroundColor: a.backgroundColor, marginTop: 'auto', marginBottom: 'auto', justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name={a.icon} color='white' size={width / 18} style={{ transform: transform() }} />
                      </View>
                      <Text style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign(), marginTop: 'auto', marginBottom: 'auto', width: w / 4 }}>{a.name}</Text>
                    </View>
                  </View>
                  {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: width / 15 }}>
                    <View style={{ width: width / 10, height: width / 10, borderRadius: width / 20, backgroundColor: a.backgroundColor, justifyContent: 'center', alignItems: 'center' }}>
                      <Icon name={a.icon} color='white' size={width / 18} style={{ transform: transform() }} />
                    </View>
                    <View style={{ width: width / 30 }} />
                    <Text style={{ fontSize: width / 25, color: '#333', width: width / 4.5, transform: transform(), textAlign: textAlign() }}>{a.name}</Text>
                  </View> */}
                </TouchableOpacity>
              )
            })}
          </View>
          <View style={{ marginLeft: width / 20, marginBottom: width / 30 }}>
            {this.state.offers.length > 0 ? <Text style={{ fontSize: width / 25, color: '#333', transform: transform(), textAlign: textAlign() }}>{i18n.t('offers')}</Text> : null}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {this.state.offers.map((data, i) => {

                const offer = `${URL}/${data.product.image.path.replace(/\\/g, "/")}`
                const offerImage = JSON.parse(JSON.stringify({ uri: offer }))

                function getImage(e) {
                  if (e !== undefined) {
                    if (e % 3 === 0) {
                      return blue
                    } else if (e % 3 === 1) {
                      return red
                    } else {
                      return green
                    }
                  }

                }
                return (
                  <ImageBackground source={getImage(i)} imageStyle={{ borderRadius: 5 }} key={i} style={{ paddingBottom: width / 50, paddingTop: width / 50, width: this.state.offers.length === 1 ? width / 1.1 : width / 1.5, marginRight: width / 20, marginTop: width / 30, borderRadius: 4 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', width: this.state.offers.length === 1 ? width / 1.15 : width / 1.6 }}>
                      <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: width / 12, color: 'white', fontWeight: 'bold', transform: transform() }}>{data.offerPercentage}%</Text>
                        <Text style={{ fontSize: width / 25, color: 'white', marginLeft: width / 50, transform: transform() }}>{i18n.t('off')}</Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: width / 28, transform: transform(), color: 'white', width: this.state.offers.length === 1 ? width / 2.5 : width / 4, marginLeft: width / 70 }}>{data.offerName}</Text>
                      </View>
                      <Image resizeMode='stretch' source={offerImage} style={{ transform: transform(), width: this.state.offers.length === 1 ? width / 5 : width / 6.5, height: this.state.offers.length === 1 ? width / 5 : width / 6.5, borderRadius: 2, }} />

                    </View>
                  </ImageBackground>
                )
              })}
            </ScrollView>
          </View>
        </ScrollView>
        <Modal transparent={false}

          visible={this.state.modalVisible}>
          <View style={{ backgroundColor: 'white', height: h / 1.02, width: w, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, paddingBottom: width / 30 }}>
            <View style={{ borderBottomWidth: 1.5, borderBottomColor: '#ddd', width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', marginTop: Platform.OS === 'android' ? 0 : width / 30 }}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => this.setModalVisible(false)}>
                  <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                  <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', fontWeight: 'bold', }}>{i18n.t('notifications')}</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ top: width / 30, fontSize: width / 18, color: '#333', fontWeight: 'bold', right: width / 50 }}>({this.state.notification.length})</Text>

            </View>
            <ScrollView contentContainerStyle={{ backgroundColor: "white", paddingBottom: width / 30 }}>


              {this.state.notification.length > 0 ? this.state.notification.map((data, i) => {
                var shours = new Date(data.time).getHours()
                var sminutes = new Date(data.time).getMinutes()
                var sampm = shours >= 12 ? 'PM' : 'AM'
                shours = shours % 12
                shours = shours ? shours : 12  // the hour '0' should be '12'
                var startTime = shours + ':' + `${("0" + sminutes).slice(-2)}` + ' ' + sampm
                var today = new Date();
                var Christmas = new Date(data.time);
                var diffMs = (today - Christmas); // milliseconds between now & Christmas
                var diffDays = Math.floor(diffMs / 86400000); // days
                var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
                var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                const leftReminderDays = diffDays + " days"
                const leftReminderHours = diffHrs + " hour"
                const leftReminderMinutes = diffMins + " minute"
                const final = diffDays > 0 ? leftReminderDays : diffHrs > 0 ? leftReminderHours : diffMins >= 0 ? leftReminderMinutes : ''
                return (
                  <TouchableOpacity key={i} onPress={() => this.setStatusNotification(data._id, data.mobileCompo)}>
                    <View elevation={data.read === true ? 0 : 2} style={{ width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', backgroundColor: data.read === true ? '#ddd' : 'white', padding: width / 80, marginTop: width / 30, borderWidth: 0.5, borderColor: '#ddd', borderRadius: 3 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: width / 8, height: width / 8, borderRadius: width / 16, backgroundColor: data.backgroundColor }}>
                          <Icon name={data.icon} size={width / 12} color={data.color} style={{ transform: transform(), marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} />
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                          <Text style={{ marginLeft: width / 50, fontSize: width / 28, fontWeight: 'bold', color: '#616161', width: w / 1.5 }}>{data.title}</Text>
                          <Text style={{ marginLeft: width / 50, fontSize: width / 32, fontWeight: 'bold', color: '#9e9e9e' }}>{final} ago</Text>
                          <View style={{ justifyContent: 'flex-end', width: w / 1.4, flexDirection: 'row' }}>
                            <Text style={{ fontSize: width / 35, color: 'red' }}>{new Date(data.date).getDate()}/{new Date(data.date).getMonth() + 1}/{new Date(data.date).getFullYear()}, {startTime}</Text>
                          </View>
                        </View>

                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }) : <View style={{ height: width / 0.7, width: w / 1.1, justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', }}>
                <View style={{ marginTop: width / 2.5 }}>
                  <Image source={notifyBell} style={{ width: width / 5, height: width / 5, marginLeft: 'auto', marginRight: 'auto', }} />
                  <Text style={{ textAlign: 'center', fontSize: width / 24, color: '#333', fontWeight: 'bold', marginTop: width / 50 }}>{i18n.t('noNotify')}</Text>
                  <Text style={{ textAlign: 'center', fontSize: width / 28, color: '#333', marginTop: width / 50 }}>{i18n.t('notify')}</Text>
                </View>
              </View>}
            </ScrollView>
            {this.state.notification.length > 0 ? <TouchableOpacity onPress={() => this.clearNotifications()}>
              <View style={{ padding: width / 50, width: w / 3, backgroundColor: '#00c853', marginLeft: 'auto', marginRight: 'auto', borderRadius: 5, marginTop: width / 40 }}>
                <Text style={{ fontSize: width / 28, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>{i18n.t('clearAll')}</Text>
              </View>
            </TouchableOpacity> : <View></View>}
          </View>
        </Modal>

        <Modal transparent={true}
          visible={this.state.modalVisibleTwo}
          animationType='slide'
        >
          <View elevation={3} style={{ borderColor: '#80cbc4', borderWidth: 0.5, backgroundColor: '#e0f2f1', height: height / 3, width: width - 80, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
            <Image style={{ width: w / 5, height: width / 5, marginLeft: 'auto', marginRight: 'auto', marginTop: height / 50 }} source={cash} />
            <Text style={{ fontSize: width / 22, color: '#333', textAlign: 'center', marginTop: height / 50 }}>{i18n.t('firstPay')}</Text>
            <TouchableOpacity onPress={() => { this.setModalVisibleTwo(false) }}>
              <View style={{ width: width / 8, height: width / 8, borderRadius: width / 16, backgroundColor: '#1b5e20', marginLeft: 'auto', marginRight: 'auto', marginTop: height / 50 }}>
                <Icon name="close" size={width / 20} style={{ marginRight: 'auto', marginLeft: 'auto', marginTop: 'auto', marginBottom: 'auto' }} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View >
    )
  }
}


{/* <View elevation={3} style={{ bottom: Platform.OS === 'ios' ? h / 30 : h / 20, margin: width / 15, marginTop: 0, marginBottom: 0, backgroundColor: 'white', borderRadius: 4, padding: width / 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', transform: transform() }}>


<TouchableOpacity onPress={() => this.currentPackageLeft()}>
  <Icon name='back-button' color='grey' size={width / 20} />
</TouchableOpacity>
{(this.state.allExpired === false) ? <View style={{ width: w / 5 }}>
  <Text numberOfLines={2} style={{ fontSize: width / 25, color: '#212121', }}>{this.state.packageDetails.packageName}</Text>
  <Text style={{ fontSize: width / 32, color: '#333', textAlign: 'left', width: w / 5 }}>{this.state.periodPackage.periodDays} {i18n.t('days')}</Text>
</View>
  : <View style={{ width: w / 5 }}>
    <Text numberOfLines={2} style={{ fontSize: width / 25, color: '#212121', }}>{i18n.t('noPackages')}</Text>
  </View>}

{(this.state.allExpired === true) ?
  <TouchableOpacity onPress={() => this.props.navigation.navigate('RenewPackage')}>
    <View style={{ borderRadius: 3, width: width / 2.5, paddingBottom: width / 40, paddingTop: width / 40, backgroundColor: "red" }}>
      <Text style={{ fontSize: width / 25, color: 'white', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', fontWeight: 'bold' }}>{i18n.t('renew')}</Text>
    </View>
  </TouchableOpacity>
  : (this.state.showPackage === undefined || !this.state.showPackage.endDate) ?
    <TouchableOpacity onPress={() => this.state.showPackage.paidStatus === "UnPaid" ? alert(i18n.t('firstPay')) : this.startPackage()}>
      <View>
        <View style={{ borderRadius: 3, width: width / 2.5, paddingBottom: width / 40, paddingTop: width / 40, backgroundColor: "#8bc34a" }}>
          <Text style={{ fontSize: width / 25, color: 'white', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', fontWeight: 'bold' }}>{i18n.t('startPackage')}</Text>
        </View></View></TouchableOpacity> :
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ width: w / 5 }}>
        <Text style={{ fontSize: width / 15, color: '#8bc34a', fontWeight: 'bold', textAlign: 'center' }}>{Math.floor(Difference_In_Days) + 1}</Text>
        <Text style={{ fontSize: width / 30, color: '#333', textAlign: 'center', bottom: width / 100 }}>{i18n.t('daysLeft')}</Text>
      </View>

      <View style={{ width: w / 5, marginLeft: width / 40, paddingTop: width / 30 }}>
        <Text style={{ fontSize: width / 30, color: '#333' }}>{i18n.t('expiryOn')}</Text>
        <Text style={{ fontSize: width / 30, color: '#f58020', fontWeight: 'bold', width: w / 5, textAlign: textAlign(), }}>{endDate}</Text>
      </View>
    </View>
}

<TouchableOpacity onPress={() => this.currentPackageRight()}>
  <Icon name='right-arrow' color='grey' size={width / 20} />
</TouchableOpacity>

</View> */}