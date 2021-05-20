import React, { Component } from 'react';
import { View, Text, ImageBackground, Dimensions, KeyboardAvoidingView, TouchableOpacity, TextInput, Modal, Image, ScrollView } from 'react-native';
import boyImage from '../../assets/images/sq.jpg'
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { CalendarList } from 'react-native-calendars';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { getUserDetailsById, getDesignationById } from '../../utils/api/authorization'
import { getMemberWorkoutByDate, getMemberDietByDate } from '../../utils/api/getWorkoutAndDietMember'
import Header from '../common/Header'
import dumbbell from '../../assets/images/dumbbell.png'
import Loader from '../../utils/resources/Loader'
import i18n from 'i18n-js';
import fruit from '../../assets/images/fruit.png'
import sq from '../../assets/images/sq.jpg'
import { getSchedule, getEventsByDate } from '../../utils/api/classes'


export default class SchedulePage extends React.Component {
  _isMounted = false

  state = {
    cale: new Date().toISOString().split('T')[0],
    rtl: null,
    today: '',
    abc: [1, 2, 3, 4, 5, 6, 7],
    currentDate: new Date(),
    date: new Date(),
    userId: '',
    workouts: [],
    cardios: [],
    loading: false,
    diets: [],
    allClasses: [],
    allEvents: [],
    designation: ''
  }
  componentDidMount() {
    this._isMounted = true
    if (this._isMounted) {
      AsyncStorage.getItem('authedToken').then((token) => {
        const userId = jwtDecode(token).userId
        const designation = jwtDecode(token).designation
        this.setState({
          userId,
          designation
        }, () => {
          getDesignationById(designation).then(res => {
            this.setState({
              designation: res.data.response.designationName
            }, () => {
              if (this.state.designation === 'Member') {
                this.memberFunction()

              }
            })
          })
        })
      })
    }

    const objDate = {
      date: new Date(),

    }
    getEventsByDate(objDate).then(res => {
      if (res) {
        this.setState({
          allEvents: res.data.response
        })
      }
    })

  }

  componentWillUnmount() {
    this._isMounted = false
  }


  onGoBack() {
    this.props.navigation.goBack()
  }


  memberFunction = () => {

    this.setState({
      loading: true,
    })
    const data = {
      member: this.state.userId,
      dateOfWorkout: new Date(),

    }
    getMemberWorkoutByDate(data).then(res => {
      if (res) {
        this.setState({
          workouts: res.data.response[0] ? res.data.response[0].workouts : [],
          cardios: res.data.response[1] ? res.data.response[1].workouts : [],
          loading: false
        })
      }
    })

    const Dietdata = {
      member: this.state.userId,
      dateOfDiet: new Date(),

    }
    getMemberDietByDate(Dietdata).then(res => {
      if (res) {
        this.setState({
          diets: res.data.response,
          loading: false
        })
      }
    })
    const classData = {
      member: this.state.userId,
      endDate: new Date().setHours(0, 0, 0, 0),
      startDate: new Date().setHours(0, 0, 0, 0)
    }
    getSchedule(classData).then(res => {
      if (res) {
        this.setState({
          allClasses: res.data.response,
          loading: false
        })
      }
    })
  }


  onPressDay = (day) => {

    this.setState({
      monthListVisible: false,
      visible: true,
      today: day,
      cale: new Date(day.dateString).toISOString().split('T')[0]

    }, () => {
      this.setState({
        loading: true
      })
      const data = {
        member: this.state.userId,
        dateOfWorkout: new Date(this.state.today.dateString),

      }

      const classData = {
        member: this.state.userId,
        endDate: new Date(this.state.today.dateString).setHours(0, 0, 0, 0),
        startDate: new Date(this.state.today.dateString).setHours(0, 0, 0, 0)
      }
      getSchedule(classData).then(res => {
        if (res) {
          this.setState({
            allClasses: res.data.response
          })
        }
      })
      getMemberWorkoutByDate(data).then(res => {
        if (res) {
          this.setState({
            workouts: res.data.response[0] ? res.data.response[0].workouts : [],
            cardios: res.data.response[1] ? res.data.response[1].workouts : [],
            loading: false

          })
        }
      })

      const Dietdata = {
        member: this.state.userId,
        dateOfDiet: new Date(this.state.today.dateString),

      }
      getMemberDietByDate(Dietdata).then(res => {
        if (res) {
          this.setState({
            diets: res.data.response,
            loading: false
          })
        }
      })

      const objDate = {
        date: new Date(this.state.today.dateString),

      }
      getEventsByDate(objDate).then(res => {
        if (res) {
          this.setState({
            allEvents: res.data.response
          })
        }
      })

    })
  }

  onChangeMonth = (month) => {

    setTimeout(() => {
      this.setState({
        monthListVisible: true,
        visible: false
      })
    }, 10)


  }

  render() {
    const weeks = [i18n.t('sun'), i18n.t('mon'), i18n.t('tue'), i18n.t('wed'), i18n.t('thu'), i18n.t('fri'), i18n.t('sat')]
    const monthNames = [i18n.t('Jan'), i18n.t('Feb'), i18n.t('Mar'), i18n.t('Apr'), i18n.t('May'), i18n.t('Jun'),
    i18n.t('Jul'), i18n.t('Aug'), i18n.t('Sep'), i18n.t('Oct'), i18n.t('Nov'), i18n.t('Dec')
    ]
    const mark = {
      [this.state.cale]: { selected: true, marked: true }
    }
    return (
      <View style={{ transform: transform(), flex: 1, backgroundColor: '#eeeeee' }}>
        <Loader loading={this.state.loading} text='Loading' />
        <ScrollView contentContainerStyle={{ paddingBottom: width / 20 }}>
          <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

              <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('schedule')}</Text>
            </TouchableOpacity>
          </View>
          <CalendarList
            // Callback which gets executed when visible months change in scroll view. Default = undefined
            onVisibleMonthsChange={(month) => this.onChangeMonth(month)}

            // Max amount of months allowed to scroll to the past. Default = 50
            pastScrollRange={12}
            // Max amount of months allowed to scroll to the future. Default = 50
            futureScrollRange={12}
            // Enable or disable scrolling of calendar list
            scrollEnabled={true}
            // Enable or disable vertical scroll indicator. Default = false
            showScrollIndicator={true}
            horizontal={true}
            markedDates={mark}
            // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
            onDayPress={(day) => this.onPressDay(day)}
            selectedDayBackgroundColor={'blue'}
            style={{ width: w / 1.05, transform: transform(), marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20 }}

          />
          <View elevation={2} style={{ width: w / 1.08, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 30, marginTop: width / 20, borderRadius: 3 }}>

            <Text style={{ fontSize: width / 18, color: '#03a9f4', transform: transform(), textAlign: 'center', top: width / 80, fontWeight: 'bold' }}>{this.state.today === '' ? `${weeks[new Date().getDay()]}, ${monthNames[new Date().getMonth()]} ${new Date().getDate()}` : `${weeks[new Date(this.state.today.dateString).getDay()]}, ${monthNames[new Date(this.state.today.dateString).getMonth()]} ${new Date(this.state.today.dateString).getDate()}`}</Text>
          </View>
          {this.state.designation !== '' && this.state.designation === 'Member' ?
            <View>
              {this.state.allClasses.length > 0 ? <View elevation={2} style={{ width: w / 1.08, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 30, marginTop: width / 80, borderRadius: 3 }}>
                <Text style={{ fontSize: width / 18, color: 'orange', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', marginTop: width / 30, marginLeft: width / 30 }}>{i18n.t('myClasses')}</Text>
                {this.state.allClasses.map((data, i) => {
                  const classImage = `${URL}/${data.image.path.replace(/\\/g, "/")}`
                  const classesImage = JSON.parse(JSON.stringify({ uri: classImage }))
                  var shours = new Date(data.startTime).getHours()
                  var sampm = shours >= 12 ? 'PM' : 'AM'
                  shours = shours % 12
                  shours = shours ? shours : 12  // the hour '0' should be '12'
                  var startTime = shours + ' ' + sampm

                  var ehours = new Date(data.endTime).getHours()
                  var eampm = ehours >= 12 ? 'PM' : 'AM'
                  ehours = ehours % 12
                  ehours = ehours ? ehours : 12  // the hour '0' should be '12'
                  var endTime = ehours + ' ' + eampm
                  return (
                    <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('ClassDetailsAfterBuy', { id: data._id })}>
                      <View style={{ marginTop: width / 30, height: height / 8, width: w / 1.2, marginLeft: 'auto', marginRight: 'auto', backgroundColor: data.color }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <View style={{ flexDirection: 'row' }}>
                            <Image resizeMode='stretch' style={{ width: w / 4.5, height: height / 8 }} source={classesImage} />
                            <View style={{ marginTop: width / 50, flexDirection: 'column', marginLeft: width / 30 }}>
                              <Text numberOfLines={1} style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 30, width: w / 3, color: 'white', fontWeight: 'bold' }}>{data.className}</Text>
                              <Text numberOfLines={3} style={{ transform: transform(), textAlign: textAlign(), fontSize: width / 35, color: 'white', width: w / 3, }}>{data.description}</Text>
                            </View>
                          </View>
                          <View style={{ backgroundColor: 'white', width: w / 4.8, height: height / 25, marginTop: 'auto', marginBottom: 'auto', right: width / 60 }}>
                            <Text style={{ transform: transform(), textAlign: 'center', fontSize: width / 35, width: w / 5, color: '#333', fontWeight: 'bold', marginTop: 'auto', marginBottom: 'auto' }}>{startTime} {i18n.t('to')} {endTime}</Text>

                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>

                  )
                })}



              </View> : <View></View>}
              {this.state.allEvents.length > 0 ?
                <View elevation={2} style={{ width: w / 1.08, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 30, marginTop: width / 80, borderRadius: 3 }}>
                  <Text style={{ fontSize: width / 18, color: 'orange', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', marginTop: width / 30, marginLeft: width / 30 }}>{i18n.t('events')}</Text>
                  <View style={{ width: w / 1.2, flexDirection: 'column', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 50 }}>
                    {this.state.allEvents.map((data, i) => {
                      return (
                        <View key={i} style={{ marginTop: width / 50 }}>
                          <View style={{ width: w / 1.2, paddingTop: width / 50, paddingBottom: width / 50, backgroundColor: '#0277bd' }}>
                            <Text style={{ fontSize: width / 22, color: 'white', transform: transform(), textAlign: 'center', fontWeight: 'bold' }}>{data.eventTitle}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, backgroundColor: '#29b6f6', }}>
                            <View style={{ width: w / 3.2, paddingTop: width / 50, paddingBottom: width / 50, backgroundColor: '#29b6f6', borderBottomLeftRadius: 5 }}>
                              <Text style={{ fontSize: width / 35, color: 'white', transform: transform(), textAlign: 'center', fontWeight: 'bold' }}>{i18n.t('from')}</Text>
                              <Text style={{ fontSize: width / 30, color: 'white', transform: transform(), textAlign: 'center', }}>{new Date(data.startDate).getDate()}/{new Date(data.startDate).getMonth() + 1}/{new Date(data.startDate).getFullYear()}</Text>

                            </View>
                            <View style={{ width: w / 3.2, paddingTop: width / 50, paddingBottom: width / 50, backgroundColor: '#29b6f6', borderBottomRightRadius: 5 }}>
                              <Text style={{ fontSize: width / 35, color: 'white', transform: transform(), textAlign: 'center', fontWeight: 'bold' }}>{i18n.t('to')}</Text>
                              <Text style={{ fontSize: width / 30, color: 'white', transform: transform(), textAlign: 'center', }}>{new Date(data.endDate).getDate()}/{new Date(data.endDate).getMonth() + 1}/{new Date(data.endDate).getFullYear()}</Text>


                            </View>
                          </View>
                        </View>
                      )
                    })}

                  </View>
                </View>
                : <View></View>
              }


              {this.state.cardios.length === 0 && this.state.workouts.length === 0 ?


                this.state.loading === true ? <View></View> : <View></View> :

                <View elevation={2} style={{ width: w / 1.08, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 30, borderRadius: 3, marginTop: width / 80, }}>
                  <Text style={{ fontSize: width / 18, color: 'orange', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', marginTop: width / 30, marginLeft: width / 30 }}>{i18n.t('workoutsAndCardios')}</Text>
                  <View style={{ width: w / 1.2, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', flexWrap: 'wrap', marginTop: width / 50 }}>
                    {this.state.workouts.map((data, i) => {
                      const urlImage = `${URL}/${data.workout.workoutsImages.path.replace(/\\/g, "/")}`
                      const video = JSON.parse(JSON.stringify({ uri: urlImage }))
                      return (
                        <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('WorkoutDetails', { title: data.workout.workoutName, id: data.workout._id, sets: data.sets, reps: data.reps, weight: data.weight, time: data.time, distance: data.distance })}>
                          <View style={{ width: w / 2.5, paddingTop: width / 50, paddingBottom: width / 50, backgroundColor: '#f5f5f5', marginTop: width / 50 }}>
                            <Text style={{ fontSize: width / 22, color: '#333', transform: transform(), textAlign: 'center' }}>{data.workout.workoutName}</Text>

                          </View>
                        </TouchableOpacity>
                      )
                    })}

                    {this.state.cardios.map((data, i) => {
                      const urlImage = `${URL}/${data.workout.workoutsImages.path.replace(/\\/g, "/")}`
                      const video = JSON.parse(JSON.stringify({ uri: urlImage }))
                      return (
                        <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('WorkoutDetails', { title: data.workout.workoutName, id: data.workout._id, sets: data.sets, reps: data.reps, weight: data.weight, time: data.time, distance: data.distance })}>
                          <View style={{ width: w / 2.5, paddingTop: width / 50, paddingBottom: width / 50, backgroundColor: '#f5f5f5', marginTop: width / 50 }}>
                            <Text style={{ fontSize: width / 22, color: '#333', transform: transform(), textAlign: 'center' }}>{data.workout.workoutName}</Text>

                          </View>
                        </TouchableOpacity>
                      )
                    })}

                  </View>
                </View>

              }

              {this.state.diets.length > 0 ? <View elevation={2} style={{ width: w / 1.08, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 30, marginTop: width / 80, borderRadius: 3 }}>
                <Text style={{ fontSize: width / 18, color: 'orange', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', marginTop: width / 30, marginLeft: width / 30 }}>{i18n.t('dietPlan')}</Text>
                <View style={{ width: w / 1.2, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', flexWrap: 'wrap', marginTop: width / 50 }}>
                  {this.state.diets.map((data, i) => {
                    const calories = data.dietPlan.map(id => id.calories).reduce((a, b) => a + b)

                    return (
                      <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('DietPlanDetailsScreen', { title: data.dietPlanSession.sessionName, id: data._id, calories: calories })}>
                        <View style={{ width: w / 2.5, paddingTop: width / 50, paddingBottom: width / 50, backgroundColor: '#f5f5f5', marginTop: width / 50 }}>
                          <Text style={{ fontSize: width / 22, color: '#333', transform: transform(), textAlign: 'center' }}>{data.dietPlanSession.sessionName}</Text>

                        </View>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View> : <View></View>}


            </View>
            :
            <View>
              {this.state.allEvents.length > 0 ?
                <View elevation={2} style={{ width: w / 1.08, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 30, marginTop: width / 80, borderRadius: 3 }}>
                  <Text style={{ fontSize: width / 18, color: 'orange', transform: transform(), textAlign: textAlign(), fontWeight: 'bold', marginTop: width / 30, marginLeft: width / 30 }}>{i18n.t('events')}</Text>
                  <View style={{ width: w / 1.2, flexDirection: 'column', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 50 }}>
                    {this.state.allEvents.map((data, i) => {
                      return (
                        <View key={i} style={{ marginTop: width / 50 }}>
                          <View style={{ width: w / 1.2, paddingTop: width / 50, paddingBottom: width / 50, backgroundColor: '#0277bd' }}>
                            <Text style={{ fontSize: width / 22, color: 'white', transform: transform(), textAlign: 'center', fontWeight: 'bold' }}>{data.eventTitle}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, backgroundColor: '#29b6f6', }}>
                            <View style={{ width: w / 3.2, paddingTop: width / 50, paddingBottom: width / 50, backgroundColor: '#29b6f6', borderBottomLeftRadius: 5 }}>
                              <Text style={{ fontSize: width / 35, color: 'white', transform: transform(), textAlign: 'center', fontWeight: 'bold' }}>{i18n.t('from')}</Text>
                              <Text style={{ fontSize: width / 30, color: 'white', transform: transform(), textAlign: 'center', }}>{new Date(data.startDate).getDate()}/{new Date(data.startDate).getMonth() + 1}/{new Date(data.startDate).getFullYear()}</Text>

                            </View>
                            <View style={{ width: w / 3.2, paddingTop: width / 50, paddingBottom: width / 50, backgroundColor: '#29b6f6', borderBottomRightRadius: 5 }}>
                              <Text style={{ fontSize: width / 35, color: 'white', transform: transform(), textAlign: 'center', fontWeight: 'bold' }}>{i18n.t('to')}</Text>
                              <Text style={{ fontSize: width / 30, color: 'white', transform: transform(), textAlign: 'center', }}>{new Date(data.endDate).getDate()}/{new Date(data.endDate).getMonth() + 1}/{new Date(data.endDate).getFullYear()}</Text>


                            </View>
                          </View>
                        </View>
                      )
                    })}

                  </View>
                </View>
                : <View></View>
              }
            </View>}

        </ScrollView>
      </View >
    )
  }
}