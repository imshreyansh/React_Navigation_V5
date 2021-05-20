import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, ImageBackground, StyleSheet } from 'react-native'
import { h, w, width, height, Icon, transform, textAlign } from '../utils/resources/helpers'
import i18n from 'i18n-js'
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices,
    registerGlobals
} from 'react-native-webrtc';

const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
const pc = new RTCPeerConnection(configuration);
let isFront = true;


class Rtc extends Component {
    constructor(props) {
        super(props)

        this.state = {
            stream: '',

        }
        this.getUserMedia()

    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {

        }
    }


    componentWillUnmount() {
        this._isMounted = false

    }

    getUserMedia = () => {
        mediaDevices.enumerateDevices().then(sourceInfos => {
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
                    videoSourceId = sourceInfo.deviceId;
                }
            }
            mediaDevices.getUserMedia({
                audio: true,
                video: {
                    mandatory: {
                        minWidth: w, // Provide your own width, height and frame rate here
                        minHeight: height / 1.5,
                        minFrameRate: 30
                    },
                    facingMode: (isFront ? "user" : "environment"),
                    optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
                }
            })
                .then(stream => {
                    this.setState({ stream })
                })
                .catch(error => {
                    console.log(error)
                });
        })
    }

    render() {
        return (

            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <RTCView key={1}
                    mirror={false}
                    style={styles.rtcViewRemote}
                    objectFit='stretch' streamURL={this.state.stream && this.state.stream.toURL()} />

            </View >
        )
    }
}

export default Rtc
var styles = StyleSheet.create({

    rtcViewRemote: {
        width: w,
        height: h / 1.85,//dimensions.height / 2,
        backgroundColor: 'white',
    },
    rtcViewRemoteFull: {
        width: h,
        height: w / 1.02,//dimensions.height / 2,
        backgroundColor: 'white',

    },
    formText: {
        paddingLeft: width / 50,
        fontSize: width / 25,
        color: '#333'
    }

});
