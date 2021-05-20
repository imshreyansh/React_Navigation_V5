import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { getUserDetailsById } from '../../utils/api/authorization'
import { getMemberWorkoutByDate, addMemberWorkoutAttendees, getMemberWorkoutAttendees } from '../../utils/api/getWorkoutAndDietMember'
import Header from '../common/Header'
import dumbbell from '../../assets/images/dumbbell.png'
import Loader from '../../utils/resources/Loader'
import { Icon, width, height, w, h, weekDays, monthFullNames, dateInDDMMYYYY, transform, textAlign, URL } from '../../utils/api/helpers'
import boyImage from '../../assets/images/loginBg.png'
import i18n from 'i18n-js';

export default class Workouts extends React.Component {
  _isMounted = false

  state = {
    abc: [1, 2, 3, 4, 5, 6, 7],
    currentDate: new Date(),
    date: new Date(),
    userId: '',
    workouts: [],
    cardios: [],
    loading: false,
    currentOffset: 0,
    workoutsId: '',
    cardiosId: '',
    buttonDisabled: true


  }
  componentDidMount() {
    this._isMounted = true
    if (this._isMounted) {
      AsyncStorage.getItem('authedToken').then((token) => {
        const userId = jwtDecode(token).userId
        this.setState({
          userId,

        }, () => {
          this.setState({
            loading: true
          })
          const data = {
            member: this.state.userId,
            dateOfWorkout: new Date(),

          }
          getMemberWorkoutByDate(data).then(res => {
            if (res) {
              this.setState({
                workoutsId: res.data.response[0] ? res.data.response[0]._id : [],
                cardiosId: res.data.response[1] ? res.data.response[1]._id : [],
                workouts: res.data.response[0] ? res.data.response[0].workouts : [],
                cardios: res.data.response[1] ? res.data.response[1].workouts : [],
                loading: false
              })
            }
          })
          const obj = {
            memberId: this.state.userId,

            date: new Date().setHours(0, 0, 0, 0)
          }
          getMemberWorkoutAttendees(obj).then(res => {
            if (res) {
              this.setState({
                buttonDisabled: res.data.response === 1 ? false : true
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
  onPressDate(date) {
    this.setState({
      date,
    }, () => {
      this.setState({
        loading: true
      })
      const data = {
        member: this.state.userId,
        dateOfWorkout: new Date(date),

      }
      getMemberWorkoutByDate(data).then(res => {
        if (res) {
          this.setState({
            workoutsId: res.data.response[0] ? res.data.response[0]._id : [],
            cardiosId: res.data.response[1] ? res.data.response[1]._id : [],
            workouts: res.data.response[0] ? res.data.response[0].workouts : [],
            cardios: res.data.response[1] ? res.data.response[1].workouts : [],
            loading: false

          })
        }
      })
      const obj = {
        memberId: this.state.userId,

        date: new Date()
      }
      getMemberWorkoutAttendees(obj).then(res => {
        if (res) {
          this.setState({
            buttonDisabled: res.data.response === 1 ? false : true
          })
        }
      })
    })
  }

  onGoBack() {
    this.props.navigation.goBack()
  }

  onPressStart = () => {
    this.setState({ loading: true })
    const arr = []
    if (this.state.workouts.length > 0 && this.state.cardios.length > 0) {
      arr.push(this.state.workoutsId, this.state.cardiosId)
    } else if (this.state.workouts.length > 0 && this.state.cardios.length <= 0) {
      arr.push(this.state.workoutsId)
    } else if (this.state.cardios.length > 0 && this.state.workouts.length <= 0) {
      arr.push(this.state.cardiosId)

    }

    const obj = {
      workout: arr,

      memberId: this.state.userId,

      date: new Date().setHours(0, 0, 0, 0)

    }

    addMemberWorkoutAttendees(obj).then(res => {
      if (res) {
        this.setState({
          loading: false,
          buttonDisabled: false
        })
      }
    })
  }
  render() {
    const showButton = new Date(this.state.date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)

    const { currentDate } = this.state
    const week = []
    for (var i = 0; i < 7; i++) {
      const first = currentDate.getDate() - currentDate.getDay()
      const firstday = new Date(currentDate.setDate(first))
      const lastday = new Date(currentDate.setDate(currentDate.getDate() + i))
      week.push(lastday)
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'white', transform: transform() }}>

        <Loader loading={this.state.loading} text='Loading' />
        <Header title={i18n.t('workouts')} icon='back-button' goBack={() => this.onGoBack()} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: width / 8 }}>

          <View style={{ padding: width / 30 }}>
            <Text style={{ fontSize: width / 25, color: '#333', transform: transform() }}>{i18n.t(monthFullNames[currentDate.getMonth()])}, {currentDate.getFullYear()}</Text>
            <View style={{ flexDirection: 'row', marginTop: width / 50 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {week.map(a => {
                  const day = a.getDay()
                  const date = a.getDate()
                  return (
                    <TouchableOpacity key={a} onPress={() => this.onPressDate(a)}>
                      <View style={{ padding: width / 50, alignItems: 'center', backgroundColor: date === this.state.date.getDate() ? '#f58020' : '#9e9e9e', marginRight: width / 50, borderRadius: 5, width: w / 6 }}>
                        <Text numberOfLines={1} style={{ fontSize: width / 25, color: '#fff', fontWeight: 'bold', transform: transform(), width: w / 8, textAlign: 'center' }}>{i18n.t(weekDays[day])}</Text>
                        <Text style={{ fontSize: width / 25, color: '#fff', fontWeight: 'bold', transform: transform() }}>{date}</Text>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 20 }} >
              <Text style={{ fontSize: width / 22, color: '#333', fontWeight: 'bold', marginTop: width / 30, transform: transform(), textAlign: textAlign() }}>{i18n.t('workoutsAndCardios')}</Text>
              <Text style={{ fontSize: width / 28, color: '#0d47a1', marginTop: width / 20, transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>{dateInDDMMYYYY(this.state.date)}</Text>
            </View>
            {this.state.cardios.length === 0 && this.state.workouts.length === 0 ?


              this.state.loading === true ? <View></View> : <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: height / 7 }}>
                <Image source={dumbbell} style={{ width: width / 3, height: width / 3, transform: transform() }} />
                <Text style={{ marginTop: width / 30, color: 'grey', fontSize: width / 25, transform: transform() }}>{i18n.t('noData')}</Text>
              </View> :
              <View style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: width / 20 }}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {this.state.workouts.map((data, i) => {
                    const urlImage = `${URL}/${data.workout.workoutsImages.path.replace(/\\/g, "/")}`
                    const video = JSON.parse(JSON.stringify({ uri: urlImage }))
                    return (
                      <View>
                        <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('WorkoutDetails', { title: data.workout.workoutName, id: data.workout._id, sets: data.sets, reps: data.reps, weight: data.weight, time: data.time, distance: data.distance })}>
                          <View style={{ width: w / 1.2, height: height / 2, marginLeft: width / 30, borderRadius: 5 }}>
                            <Image source={video} style={{ width: w / 1.2, height: height / 2, borderRadius: 5, transform: transform() }} />
                            <View opacity={0.5} style={{ borderBottomLeftRadius: 5, borderBottomRightRadius: 5, position: 'absolute', bottom: 0, width: w / 1.2, height: width / 5, backgroundColor: 'blue' }}>

                            </View>
                            <Text style={{ position: 'absolute', bottom: 0, marginLeft: width / 30, fontSize: width / 15, fontWeight: 'bold', color: 'white', marginBottom: width / 20, transform: transform() }}>{data.workout.workoutName}</Text>
                          </View>
                        </TouchableOpacity>

                        <View style={{ marginTop: width / 20, marginLeft: width / 30, width: w / 1.5, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ width: width / 5.5, height: width / 5.5, borderRadius: width / 11, borderWidth: 1, alignItems: 'center', borderColor: '#ddd' }}>
                            <Text style={{ marginTop: width / 40, fontSize: width / 24, color: 'orange', fontWeight: 'bold', transform: transform() }}>{data.sets}</Text>
                            <Text style={{ fontSize: width / 24, color: '#333', transform: transform() }}>{i18n.t('sets')}</Text>
                          </View>
                          <View style={{ width: width / 5.5, height: width / 5.5, borderRadius: width / 11, borderWidth: 1, alignItems: 'center', borderColor: '#ddd' }}>
                            <Text style={{ marginTop: width / 40, fontSize: width / 24, color: 'orange', fontWeight: 'bold', transform: transform() }}>{data.reps}</Text>
                            <Text style={{ fontSize: width / 24, color: '#333', transform: transform() }}>{i18n.t('reps')}</Text>
                          </View>
                          <View style={{ width: width / 5.5, height: width / 5.5, borderRadius: width / 11, borderWidth: 1, alignItems: 'center', borderColor: '#ddd' }}>
                            <Text style={{ marginTop: width / 40, fontSize: width / 24, color: 'orange', fontWeight: 'bold', transform: transform() }}>{data.weight}</Text>
                            <Text style={{ fontSize: width / 24, color: '#333', transform: transform() }}>{i18n.t('kg')}</Text>
                          </View>
                        </View>


                      </View>

                    )

                  })}

                  {this.state.cardios.map((data, i) => {
                    const urlImage = `${URL}/${data.workout.workoutsImages.path.replace(/\\/g, "/")}`
                    const video = JSON.parse(JSON.stringify({ uri: urlImage }))
                    return (
                      <View>
                        <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('WorkoutDetails', { title: data.workout.workoutName, id: data.workout._id, sets: data.sets, reps: data.reps, weight: data.weight, time: data.time, distance: data.distance })}>

                          <View style={{ width: w / 1.2, height: height / 2, marginLeft: width / 30, borderRadius: 5 }}>
                            <Image source={video} style={{ width: w / 1.2, height: height / 2, borderRadius: 5, transform: transform() }} />
                            <View opacity={0.5} style={{ borderBottomLeftRadius: 5, borderBottomRightRadius: 5, position: 'absolute', bottom: 0, width: w / 1.2, height: width / 5, backgroundColor: 'blue' }}>

                            </View>
                            <Text style={{ position: 'absolute', bottom: 0, marginLeft: width / 30, fontSize: width / 15, fontWeight: 'bold', color: 'white', marginBottom: width / 20, transform: transform() }}>{data.workout.workoutName}</Text>
                          </View>
                        </TouchableOpacity>

                        <View style={{ marginTop: width / 20, marginLeft: width / 30, width: w / 1.5, marginLeft: 'auto', marginRight: 'auto', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ width: width / 5.5, height: width / 5.5, borderRadius: width / 11, borderWidth: 1, alignItems: 'center', borderColor: '#ddd' }}>
                            <Text style={{ marginTop: width / 40, fontSize: width / 24, color: 'orange', fontWeight: 'bold', transform: transform() }}>{data.sets}</Text>
                            <Text style={{ fontSize: width / 24, color: '#333', transform: transform() }}>{i18n.t('sets')}</Text>
                          </View>
                          <View style={{ width: width / 5.5, height: width / 5.5, borderRadius: width / 11, borderWidth: 1, alignItems: 'center', borderColor: '#ddd' }}>
                            <Text style={{ marginTop: width / 40, fontSize: width / 24, color: 'orange', fontWeight: 'bold', transform: transform() }}>{data.reps}</Text>
                            <Text style={{ fontSize: width / 24, color: '#333', transform: transform() }}>{i18n.t('reps')}</Text>
                          </View>
                          <View style={{ width: width / 5.5, height: width / 5.5, borderRadius: width / 11, borderWidth: 1, alignItems: 'center', borderColor: '#ddd' }}>
                            <Text style={{ marginTop: width / 40, fontSize: width / 24, color: 'orange', fontWeight: 'bold', transform: transform() }}>{data.weight}</Text>
                            <Text style={{ fontSize: width / 24, color: '#333' }}>{i18n.t('kg')}</Text>
                          </View>
                          <View style={{ width: width / 5.5, height: width / 5.5, borderRadius: width / 11, marginTop: width / 30, borderWidth: 1, alignItems: 'center', borderColor: '#ddd' }}>
                            <Text style={{ marginTop: width / 40, fontSize: width / 24, color: 'orange', fontWeight: 'bold', transform: transform() }}>{data.time}</Text>
                            <Text style={{ fontSize: width / 24, color: '#333', transform: transform() }}>{i18n.t('time')}</Text>
                          </View>
                          <View style={{ width: width / 5.5, height: width / 5.5, borderRadius: width / 11, marginTop: width / 30, borderWidth: 1, alignItems: 'center', borderColor: '#ddd' }}>
                            <Text style={{ marginTop: width / 40, fontSize: width / 24, color: 'orange', fontWeight: 'bold', transform: transform() }}>{data.distance}</Text>
                            <Text style={{ fontSize: width / 24, color: '#333', transform: transform() }}>{i18n.t('km')}</Text>
                          </View>
                        </View>


                      </View>

                    )

                  })}

                </ScrollView>
              </View>

            }
          </View>


          {(this.state.cardios.length !== 0 || this.state.workouts.length !== 0) && showButton === true && this.state.buttonDisabled === true ?
            <TouchableOpacity onPress={() => this.onPressStart()}>
              <View style={{ width: w / 1.5, backgroundColor: '#9ccc65', paddingBottom: width / 50, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10 }}>
                <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50, transform: transform() }}>{i18n.t('startWorkout')}</Text>
              </View></TouchableOpacity> : <View></View>}


        </ScrollView>

      </View>
    )
  }
}