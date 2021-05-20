import React, { Component } from "react";
import { AppRegistry, StyleSheet, Dimensions, View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { TabNavigator } from "react-navigation";
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode'
import property from '../../assets/images/property.png'
import gym from '../../assets/images/gym.png'
import { request, PERMISSIONS, check, RESULTS } from 'react-native-permissions';
import MapView, { Polyline as Poly } from 'react-native-maps';
import { Icon, width, height, w, h, transform, textAlign, URL } from '../../utils/api/helpers'
import { getCurrency, getBranchById } from '../../utils/api/authorization'
import Polyline from '@mapbox/polyline';
import i18n from 'i18n-js';

class Maps extends Component {
    _isMounted = false

    state = {
        latitude: null,
        longitude: null,
        userDetails: '',
        userCredentials: '',
        modalVisible: false,
        userId: '',
        error: null,
        coords: [],
        x: 'false',
        cordLatitude: '',
        cordLongitude: '',
        concat: null,
        branchCode: '',
        distance: '',
        time: ''
    }



    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            this.mapStart()
            getCurrency().then(res => {
                if (res) {
                    this.setState({
                        currency: res.data.response
                    })
                }
            })

        }
    }


    componentWillUnmount() {
        this._isMounted = false
    }


    setModalVisible(visible) {
        this.setState({ modalVisible: visible, forgotPass: '' });
    }


    getUserGeo = () => {
        getBranchById(this.props.navigation.getParam('id')).then(res => {
            if (res) {
                this.setState({
                    branchCode: res.data.response.geoCode,
                    cordLatitude: JSON.parse(res.data.response.geoCode.split(',')[0]),
                    cordLongitude: JSON.parse(res.data.response.geoCode.split(',')[1])
                }, () => {
                    this.mergeLot();
                })
            }
        })
    }

    mapStart = () => {
        if (Platform.OS === 'android') {
            // Instead of navigator.geolocation, just use Geolocation.
            check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
                .then(result => {
                    switch (result) {

                        case RESULTS.DENIED:
                            request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
                                if (result === 'granted') {
                                    Geolocation.watchPosition(
                                        (position) => {
                                            this.setState({
                                                latitude: position.coords.latitude,
                                                longitude: position.coords.longitude,
                                                error: null,
                                                region: {
                                                    latitude: position.coords.latitude,
                                                    longitude: position.coords.longitude,
                                                }
                                            }, () => {
                                                this.getUserGeo();
                                            })
                                        },
                                        (error) => {
                                            // See error code charts below.
                                            console.log(error.code, error.message);
                                        },
                                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                                    );
                                    Geolocation.getCurrentPosition(
                                        (position) => {
                                            this.setState({
                                                latitude: position.coords.latitude,
                                                longitude: position.coords.longitude,
                                                error: null,
                                                region: {
                                                    latitude: position.coords.latitude,
                                                    longitude: position.coords.longitude,
                                                }
                                            }, () => {
                                                this.getUserGeo();
                                            })
                                        },
                                        (error) => {
                                            // See error code charts below.
                                            console.log(error.code, error.message);
                                        },
                                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                                    );

                                }


                            });

                            break;
                        case RESULTS.GRANTED:
                            Geolocation.watchPosition(
                                (position) => {
                                    this.setState({
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude,
                                        error: null,
                                        region: {
                                            latitude: position.coords.latitude,
                                            longitude: position.coords.longitude,
                                        }
                                    }, () => {
                                        this.getUserGeo();
                                    })
                                },
                                (error) => {
                                    // See error code charts below.
                                    console.log(error.code, error.message);
                                },
                                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                            );
                            Geolocation.getCurrentPosition(
                                (position) => {
                                    this.setState({
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude,
                                        error: null,
                                        region: {
                                            latitude: position.coords.latitude,
                                            longitude: position.coords.longitude,
                                        }
                                    }, () => {
                                        this.getUserGeo();
                                    })
                                },
                                (error) => {
                                    // See error code charts below.
                                    console.log(error.code, error.message);
                                },
                                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                            );


                            break;
                        case RESULTS.BLOCKED:
                            Alert.alert('Allow the app for camera permissions from your phone settings');
                            break;
                    }
                })
        } else {
            check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
                .then(result => {

                    switch (result) {
                        case RESULTS.DENIED:
                            request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
                                if (result === 'granted') {
                                    Geolocation.watchPosition(
                                        (position) => {
                                            this.setState({
                                                latitude: position.coords.latitude,
                                                longitude: position.coords.longitude,
                                                error: null,
                                                region: {
                                                    latitude: position.coords.latitude,
                                                    longitude: position.coords.longitude,
                                                }
                                            }, () => {
                                                this.getUserGeo();
                                            })
                                        },
                                        (error) => {
                                            // See error code charts below.
                                            console.log(error.code, error.message);
                                        },
                                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                                    );
                                    Geolocation.getCurrentPosition(
                                        (position) => {
                                            this.setState({
                                                latitude: position.coords.latitude,
                                                longitude: position.coords.longitude,
                                                error: null,
                                                region: {
                                                    latitude: position.coords.latitude,
                                                    longitude: position.coords.longitude,
                                                }
                                            }, () => {
                                                this.getUserGeo();
                                            })
                                        },
                                        (error) => {
                                            // See error code charts below.
                                            console.log(error.code, error.message);
                                        },
                                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                                    );

                                }


                            });

                            break;
                        case RESULTS.GRANTED:
                            if (result === 'granted') {
                            Geolocation.watchPosition(
                                (position) => {
                                    this.setState({
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude,
                                        error: null,
                                        region: {
                                            latitude: position.coords.latitude,
                                            longitude: position.coords.longitude,
                                        }
                                    }, () => {
                                        this.getUserGeo();
                                    })
                                },
                                (error) => {
                                    // See error code charts below.
                                    console.log(error.code, error.message);
                                },
                                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                            );
                            Geolocation.getCurrentPosition(
                                position => {
                                    this.setState({
                                        latitude: position.coords.latitude,
                                        longitude: position.coords.longitude,
                                        error: null,
                                        region: {
                                            latitude: position.coords.latitude,
                                            longitude: position.coords.longitude,
                                        }
                                    }, () => {
                                        this.getUserGeo();
                                    })
                                  },
                                (error) => {
                                    // See error code charts below.
                                    console.log(error.code, error.message);
                                });

                            }
                            break;
                        case RESULTS.BLOCKED:
                            alert('Allow the app for location permissions from your phone settings');
                            break;
                    }
                })
        }
    }

    mergeLot() {
        if (this.state.latitude != null && this.state.longitude != null) {
            let concatLot = this.state.latitude + "," + this.state.longitude
            this.setState({
                concat: concatLot
            }, () => {
                this.getDirections(concatLot, this.state.branchCode);
            });
        }

    }

    async getDirections(startLoc, destinationLoc) {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=AIzaSyCOsyifA4MYEGZQo2AaAwhvsPqxFs3mafE`)
            let distTime = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${startLoc}&destinations=${destinationLoc}&key=AIzaSyCOsyifA4MYEGZQo2AaAwhvsPqxFs3mafE`)
            const distTimeJson = await distTime.json();
            let respJson = await resp.json();
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            })
            this.setState({ coords: coords, x: "true", distance: distTimeJson.rows[0].elements[0].distance.text, time: distTimeJson.rows[0].elements[0].duration.text, from: distTimeJson.origin_addresses[0], to: distTimeJson.destination_addresses[0] })

            return coords
        } catch (error) {
            this.setModalVisible(true)
            this.setState({ x: "error" })
            return error
        }
    }



    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <ScrollView contentContainerStyle={{ paddingBottom: width / 30 }}>
                    <View elevation={3} style={{ width: w, height: width / 6.5, backgroundColor: 'white', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="back-button" size={width / 15} style={{ top: width / 25, marginLeft: width / 30 }} color="#333" />

                            <Text style={{ marginLeft: width / 7, bottom: width / 30, fontSize: width / 18, color: '#333', textAlign: textAlign(), fontWeight: 'bold', }}>{i18n.t('maps')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        {!!this.state.latitude && !!this.state.longitude &&
                            <MapView style={{ height: h / 1.5, width: w }} initialRegion={{
                                latitude: this.state.latitude,
                                longitude: this.state.longitude,
                                latitudeDelta: 0.1,
                                longitudeDelta: 0.1
                            }} showsUserLocation={true}
                                followsUserLocation={true}
                                loadingEnabled={true}
                                showsUserLocationButton={true}>

                                {!!this.state.latitude && !!this.state.longitude && <MapView.Marker
                                    image={property}
                                    coordinate={{ "latitude": this.state.latitude, "longitude": this.state.longitude }}
                                    title={"Your Current Location"}
                                />}

                                {!!this.state.cordLatitude && !!this.state.cordLongitude && <MapView.Marker
                                    image={gym}
                                    coordinate={{ "latitude": this.state.cordLatitude, "longitude": this.state.cordLongitude }}
                                    title={"GYM"}
                                />}

                                {!!this.state.latitude && !!this.state.longitude && this.state.x == 'true' && <Poly
                                    coordinates={this.state.coords}
                                    strokeWidth={5}
                                    strokeColor="#0288d1" />
                                }

                                {!!this.state.latitude && !!this.state.longitude && this.state.x == 'error' && <Poly
                                    coordinates={[
                                        { latitude: this.state.latitude, longitude: this.state.longitude },
                                        { latitude: this.state.cordLatitude, longitude: this.state.cordLongitude },
                                    ]}
                                    strokeWidth={2}
                                    strokeColor="red" />
                                }

                            </MapView>
                        }
                    </View>
                    <View style={{ transform: transform(), width: w / 1.08, backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30, paddingBottom: width / 30, borderRadius: 3 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.1, borderBottomWidth: 0.5, borderBottomColor: '#ddd', paddingBottom: width / 30 }}>
                            <View style={{ flexDirection: 'row', width: w / 2.2 }}>
                                <Icon name="navigation-transport" size={width / 8} style={{ marginTop: width / 30, marginLeft: width / 30 }} color="orange" />
                                <View style={{ flexDirection: 'column', marginLeft: width / 50, }}>
                                    <Text style={{ fontSize: width / 30, marginTop: width / 30, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('distance')}</Text>
                                    <Text style={{ fontSize: width / 20, color: '#333', fontWeight: 'bold', width: w / 2.5, transform: transform(), textAlign: textAlign() }}>{this.state.distance}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', width: w / 2 }}>
                                <Icon name="time-icon" size={width / 8} style={{ marginTop: width / 30, marginLeft: width / 30, transform: transform() }} color="orange" />
                                <View style={{ flexDirection: 'column', marginLeft: width / 50 }}>
                                    <Text style={{ fontSize: width / 30, marginTop: width / 30, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('estTime')}</Text>
                                    <Text style={{ fontSize: width / 20, color: '#333', fontWeight: 'bold', width: w / 2.5, transform: transform(), textAlign: textAlign() }}>{this.state.time}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.1, borderBottomWidth: 0.5, borderBottomColor: '#ddd', paddingBottom: width / 30 }}>
                            <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                                <Text style={{ fontSize: width / 25, marginTop: width / 80, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('from')}</Text>
                                <Text style={{ fontSize: width / 30, marginTop: width / 80, color: '#333', width: w / 1.2, transform: transform(), textAlign: textAlign() }}>{this.state.from}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.1, borderBottomWidth: 0.5, borderBottomColor: '#ddd', paddingBottom: width / 30 }}>
                            <View style={{ flexDirection: 'column', marginLeft: width / 30 }}>
                                <Text style={{ fontSize: width / 25, marginTop: width / 80, color: 'grey', transform: transform(), textAlign: textAlign() }}>{i18n.t('to')}</Text>
                                <Text style={{ fontSize: width / 30, marginTop: width / 80, color: '#333', width: w / 1.2, transform: transform(), textAlign: textAlign() }}>{this.state.to}</Text>
                            </View>
                        </View>
                    </View>

                </ScrollView>
                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View elevation={10} style={{ borderWidth: 1, borderColor: '#ddd', backgroundColor: 'white', height: height / 2.5, width: width - 40, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 30, width: width / 1.15, marginLeft: 'auto', marginRight: 'auto', paddingBottom: width / 60, borderBottomColor: '#333' }}>

                        </View>
                        <Icon name="navigation-transport" size={width / 6} style={{ marginTop: width / 30, marginLeft: 'auto', marginRight: 'auto' }} color="red" />
                        <Text style={{ fontSize: width / 25, marginTop: width / 80, color: 'grey', width: width - 60, marginLeft: 'auto', marginRight: 'auto' }}>{i18n.t('sorry')}</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <View style={{ width: w / 2, backgroundColor: '#66bb6a', paddingBottom: width / 50, marginLeft: 'auto', marginRight: 'auto', borderRadius: width / 10, marginTop: width / 20 }}>
                                <Text style={{ fontSize: width / 18, color: 'white', fontWeight: 'bold', textAlign: 'center', marginTop: width / 50 }}>{i18n.t('cancel')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});

export default Maps;