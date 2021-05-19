import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import { getUserDetailsById } from '../../utils/api/authorization'
import { getMemberDietByDate } from '../../utils/api/getWorkoutAndDietMember'
import Header from '../common/Header'
import { Icon, width, height, w, h, weekDays, monthFullNames, dateInDDMMYYYY, transform, textAlign, URL } from '../../utils/api/helpers'
import boyImage from '../../assets/images/boy.jpg'
import fruit from '../../assets/images/fruit.png'
import Loader from '../../utils/resources/Loader'
import i18n from 'i18n-js';

export default class DietPlanScreen extends React.Component {
  _isMounted = false

  state = {
    diets: [],
    currentDate: new Date(),
    date: new Date(),
    userId: '',
    loading: false
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
            dateOfDiet: new Date(),

          }
          getMemberDietByDate(data).then(res => {
            if (res) {
              this.setState({
                diets: res.data.response,
                loading: false
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
      date
    }, () => {
      this.setState({
        loading: true
      })
      const data = {
        member: this.state.userId,
        dateOfDiet: new Date(date),

      }
      getMemberDietByDate(data).then(res => {
        if (res) {
          this.setState({
            diets: res.data.response,
            loading: false
          })
        }
      })
    })
  }

  onGoBack() {
    this.props.navigation.goBack()
  }

  render() {
    const { currentDate } = this.state
    const week = []
    for (var i = 0; i < 7; i++) {
      const first = currentDate.getDate() - currentDate.getDay()
      const firstday = new Date(currentDate.setDate(first))
      const lastday = new Date(currentDate.setDate(currentDate.getDate() + i))
      week.push(lastday)
    }
    return (
      <View style={{ flex: 1, backgroundColor: '#eeeeee', transform: transform() }}>
        <Loader loading={this.state.loading} text='Loading' />
        <Header title={i18n.t('dietPlan')} icon='back-button' goBack={() => this.onGoBack()} />
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: width / 22, color: '#333', fontWeight: 'bold', marginTop: width / 30, transform: transform(), textAlign: textAlign() }}>{i18n.t('dietPlan')}</Text>
              <Text style={{ fontSize: width / 28, color: '#0d47a1', marginTop: width / 25, transform: transform(), textAlign: textAlign(), fontWeight: 'bold' }}>{dateInDDMMYYYY(this.state.date)}</Text>
            </View>
            {this.state.diets.length > 0 ?
              <View>
                {this.state.diets.map((diet, i) => {

                  var shours = new Date(diet.dietPlanSession.fromTime).getHours()
                  var sminutes = new Date(diet.dietPlanSession.fromTime).getMinutes()
                  var sampm = shours >= 12 ? 'PM' : 'AM'
                  shours = shours % 12
                  shours = shours ? shours : 12  // the hour '0' should be '12'
                  var startTime = shours + ':' + `${("0" + sminutes).slice(-2)}` + ' ' + sampm
                  var ehours = new Date(diet.dietPlanSession.toTime).getHours()
                  var eminutes = new Date(diet.dietPlanSession.toTime).getMinutes()
                  var eampm = ehours >= 12 ? 'PM' : 'AM'
                  ehours = ehours % 12
                  ehours = ehours ? ehours : 12  // the hour '0' should be '12'
                  var endTime = ehours + ':' + `${("0" + eminutes).slice(-2)}` + ' ' + eampm
                  const dietPlan = diet.dietPlan.map(id => id.foodItem.itemName)
                  const calories = diet.dietPlan.map(id => id.calories).reduce((a, b) => a + b)

                  function ico(d) {
                    if (d === "Breakfast") {
                      return `breakfast`
                    } else if (d === "Lunch") {
                      return `lunch`
                    } else {
                      return `dinner`
                    }
                  }

                  return (
                    <TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('DietPlanDetailsScreen', { title: diet.dietPlanSession.sessionName, id: diet._id, calories: calories })}>

                      <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.1, borderRadius: 3, paddingBottom: width / 30, backgroundColor: '#00bfa5', marginTop: width / 20 }}>
                        <View style={{ marginTop: width / 30, marginLeft: width / 30, flexDirection: 'row' }}>
                          <Icon name={ico(diet.dietPlanSession.sessionName)} size={width / 10} color='#424242' />
                          <Text style={{ fontWeight: 'bold', fontSize: width / 15, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30, color: 'white', transform: transform() }}>{diet.dietPlanSession.sessionName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2, marginTop: width / 30, marginLeft: width / 30 }}>
                          <View style={{ flexDirection: 'row' }}>
                            <Icon name='calories-icon' size={width / 10} style={{ marginTop: 'auto', marginBottom: 'auto' }} color='#424242' />
                            <View style={{ flexDirection: 'column' }}>
                              <Text style={{ fontSize: width / 24, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30, color: 'white', textAlign: 'center', transform: transform() }}>{i18n.t('calories')}</Text>
                              <Text style={{ fontWeight: 'bold', fontSize: width / 12, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30, color: '#fff176', textAlign: 'center', transform: transform() }}>{Math.round(calories)}</Text>
                            </View>
                          </View>
                          <View style={{ flexDirection: 'row' }}>
                            <Icon name='stop-watch' size={width / 15} style={{ marginTop: 'auto', marginBottom: 'auto' }} color='#424242' />
                            <Text style={{ fontWeight: 'bold', fontSize: width / 25, marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 30, color: '#fff176', transform: transform() }}>{startTime}-{endTime}</Text>

                          </View>
                        </View>

                      </View>
                    </TouchableOpacity>

                  )
                })}
              </View>


              : this.state.loading === true ? <View></View> : <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: height / 6 }}>
                <Image source={fruit} style={{ width: width / 5, height: width / 5, transform: transform() }} />
                <Text style={{ marginTop: width / 30, color: 'grey', fontSize: width / 25, transform: transform() }}>{i18n.t('noData')}</Text>
              </View>}

          </View>

        </ScrollView>

      </View >
    )
  }
}