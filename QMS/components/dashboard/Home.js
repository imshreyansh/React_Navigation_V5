import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, ImageBackground, StyleSheet, Picker, ActionSheetIOS, Modal } from 'react-native'
import { h, w, width, height, Icon, transform, textAlign, isTablet } from '../../utils/resources/helpers'
import { SearchBar } from 'react-native-elements';
import main_img from '../../assets/images/profile_pic.jpg'
import i18n from 'i18n-js'

class Home extends Component {
    state = {
        typeOfBranches: [{ branchName: 'Afghanistanknnjjjnkjnkjnkj' }, { branchName: 'India' }],
        branch: '',
        branchLabel: '',
        modalVisible: false,
        tickets: false,
        appointment: false
    }
    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {

        }
    }


    componentWillUnmount() {
        this._isMounted = false

    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    onBranchChange = () => {

    }

    showBranchPicker = () => {
        const data = this.state.typeOfBranches.map(l => l.branchName)
        const len = data.length
        ActionSheetIOS.showActionSheetWithOptions({
            options: data,
        },
            (buttonIndex) => {
                this.setState({ branch: data[buttonIndex] });
                if (this.state.typeOfBranches[buttonIndex] !== undefined) {
                    this.setState({
                        branch: this.state.typeOfBranches[buttonIndex].branchName,
                        branchLabel: this.state.typeOfBranches[buttonIndex].branchName
                    }, () => {
                        this.onBranchChange()
                    })
                } else {
                    this.setState({
                        branch: '',
                        branchLabel: ''
                    })
                }
            });
    }
    renderBranchPicker() {
        if (Platform.OS === 'android') {
            return (
                <View style={[styles.formSelling, { transform: transform(), }]}>
                    <Picker
                        mode='dropdown'
                        style={{ bottom: width / 50, width: w / 3, color: 'grey' }}
                        selectedValue={this.state.branch}
                        onValueChange={(itemValue) => this.setState({ branch: itemValue }, () => this.onBranchChange()
                        )}>
                        {
                            this.state.typeOfBranches.map((v) => {
                                return <Picker.Item label={v.branchName} value={v.branchName} key={v.branchName} />
                            })
                        }
                    </Picker>
                </View>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.showBranchPicker()}>
                    <View style={[styles.formSelling, { transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }], paddingRight: this.state.isRTL ? 10 : 0 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', marginBottom: 'auto' }}>
                            <Text numberOfLines={1} style={{ transform: transform(), left: width / 90, fontSize: width / 20, color: 'grey' }}>{this.state.branchLabel}</Text>
                            <Icon name='down-arrow' size={width / 20} style={{ right: width / 20 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    renderModalFilterButtons = () => {
        if (this.state.appointment === true) {
            return (
                <View style={{ marginTop: width / 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => this.setState({ appointment: true, tickets: false })}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: width / 15, height: width / 15, borderRadius: width / 30, backgroundColor: '#8bc34a', marginTop: 'auto', marginBottom: 'auto' }}>
                                <Icon name='approve-icon' color='white' size={width / 25} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} />
                            </View>
                            <Text style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 50, fontSize: width / 25, color: '#333', width: w / 3 }}>My Appointments</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ appointment: false, tickets: true })}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: width / 15, height: width / 15, borderRadius: width / 30, backgroundColor: 'white', borderWidth: 1, borderColor: 'grey', marginTop: 'auto', marginBottom: 'auto' }}>
                                    {/* <Icon name='approve-icon' color='white' size={width / 25} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} /> */}
                                </View>
                                <Text style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 50, fontSize: width / 25, color: '#333', width: w / 3 }}>My Tickets</Text>
                            </View>

                        </View>
                    </TouchableOpacity>
                </View>
            )
        } else if (this.state.tickets === true) {
            return (
                <View style={{ marginTop: width / 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => this.setState({ appointment: true, tickets: false })}>
                        <View style={{ flexDirection: 'row' }}>

                            <View style={{ width: width / 15, height: width / 15, borderRadius: width / 30, backgroundColor: 'white', borderWidth: 1, borderColor: 'grey', marginTop: 'auto', marginBottom: 'auto' }}>
                                {/* <Icon name='approve-icon' color='white' size={width / 25} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} /> */}
                            </View>
                            <Text style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 50, fontSize: width / 25, color: '#333', width: w / 3 }}>My Appointments</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ appointment: false, tickets: true })}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: width / 15, height: width / 15, borderRadius: width / 30, backgroundColor: '#8bc34a', marginTop: 'auto', marginBottom: 'auto' }}>
                                    <Icon name='approve-icon' color='white' size={width / 25} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} />
                                </View>
                                <Text style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 50, fontSize: width / 25, color: '#333', width: w / 3 }}>My Tickets</Text>
                            </View>

                        </View>
                    </TouchableOpacity>

                </View>
            )
        } else {
            return (
                <View style={{ marginTop: width / 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => this.setState({ appointment: true, tickets: false })}>

                        <View style={{ flexDirection: 'row' }}>

                            <View style={{ width: width / 15, height: width / 15, borderRadius: width / 30, backgroundColor: 'white', borderWidth: 1, borderColor: 'grey', marginTop: 'auto', marginBottom: 'auto' }}>
                                {/* <Icon name='approve-icon' color='white' size={width / 25} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} /> */}
                            </View>
                            <Text style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 50, fontSize: width / 25, color: '#333', width: w / 3 }}>My Appointments</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.setState({ appointment: false, tickets: true })}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: width / 15, height: width / 15, borderRadius: width / 30, backgroundColor: 'white', borderWidth: 1, borderColor: 'grey', marginTop: 'auto', marginBottom: 'auto' }}>
                                    {/* <Icon name='approve-icon' color='white' size={width / 25} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} /> */}
                                </View>
                                <Text style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 50, fontSize: width / 25, color: '#333', width: w / 3 }}>My Tickets</Text>
                            </View>

                        </View>
                    </TouchableOpacity>

                </View>
            )
        }
    }


    render() {
        return (

            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ backgroundColor: '#eee', paddingBottom: width / 30 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.08, marginLeft: 'auto', marginRight: 'auto', marginTop: width / 30 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity>
                                <Icon name='toggle' color='grey' size={width / 15} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: width / 22, color: 'grey', marginLeft: width / 40 }}>Home</Text>
                        </View>
                        {this.renderBranchPicker()}
                    </View>
                    <View style={{ marginTop: width / 20 }}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingRight: width / 30 }}
                        >
                            <View elevation={10} style={{
                                width: w / 2, marginLeft: width / 30, padding: width / 40, borderRadius: 3, backgroundColor: '#558b2f'
                            }}>
                                <View style={{ flexDirection: 'row', width: w / 2.2, marginLeft: 'auto', marginRight: 'auto' }}>
                                    <Icon name='student-section' color='white' size={width / 25} style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                                    <Text style={{ marginLeft: width / 60, width: w / 3, color: 'white' }}>Hospitals and Clinics</Text>
                                    <View style={{ width: width / 15, height: width / 15, borderRadius: width / 30, backgroundColor: 'white', marginTop: 'auto', marginBottom: 'auto' }}>
                                        <Text numberOfLines={1} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', color: '#333' }}>20</Text>
                                    </View>
                                </View>
                            </View>
                            <View elevation={10} style={{
                                width: w / 2, marginLeft: width / 30, padding: width / 40, borderRadius: 3, backgroundColor: '#ff8f00'
                            }}>
                                <View style={{ flexDirection: 'row', width: w / 2.2, marginLeft: 'auto', marginRight: 'auto' }}>
                                    <Icon name='student-section' color='white' size={width / 25} style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                                    <Text style={{ marginLeft: width / 60, width: w / 3, color: 'white' }}>Hospitals and Clinics</Text>
                                    <View style={{ width: width / 15, height: width / 15, borderRadius: width / 30, backgroundColor: 'white', marginTop: 'auto', marginBottom: 'auto' }}>
                                        <Text numberOfLines={1} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', color: '#333' }}>20</Text>
                                    </View>
                                </View>
                            </View>
                            <View elevation={10} style={{
                                width: w / 2, marginLeft: width / 30, padding: width / 40, borderRadius: 3, backgroundColor: '#4e342e'
                            }}>
                                <View style={{ flexDirection: 'row', width: w / 2.2, marginLeft: 'auto', marginRight: 'auto' }}>
                                    <Icon name='student-section' color='white' size={width / 25} style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                                    <Text style={{ marginLeft: width / 60, width: w / 3, color: 'white' }}>Hospitals and Clinics</Text>
                                    <View style={{ width: width / 15, height: width / 15, borderRadius: width / 30, backgroundColor: 'white', marginTop: 'auto', marginBottom: 'auto' }}>
                                        <Text numberOfLines={1} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', color: '#333' }}>20</Text>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View >
                    <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.08, flexDirection: 'row', justifyContent: 'space-between', marginTop: width / 20 }}>
                        <View style={{ transform: transform() }}>
                            <SearchBar
                                placeholder={i18n.t('search')}
                                placeholderTextColor='#D3D3D3'
                                onChangeText={this.updateSearch}
                                lightTheme
                                containerStyle={{ backgroundColor: 'white', borderWidth: 1, width: w / 1.6, height: isTablet === false ? width / 12 : width / 9, borderColor: '#C8C8C8', borderRadius: 5 }}
                                inputContainerStyle={{ backgroundColor: 'white', width: w / 1.8, height: height / 80 }}
                                inputStyle={{ textAlign: textAlign(), }}
                                searchIcon={{ size: width / 16 }}
                                value={this.state.search}
                            />
                        </View>

                        <View style={{ width: width / 8, padding: width / 30, backgroundColor: '#ddd', borderRadius: 5 }}>
                            <Icon name='reports' color='#333' size={width / 20} style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                        </View>
                        <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                            <View style={{ width: width / 8, padding: width / 30, backgroundColor: '#ddd', borderRadius: 5 }}>
                                <Icon name='filter' color='#333' size={width / 20} style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginLeft: width / 30, marginTop: width / 30 }}>
                    <Text style={{ fontSize: width / 22, fontWeight: 'bold', color: '#333' }}>Hospitals & Clinics</Text>
                </View>
                <View style={{ marginLeft: 'auto', marginRight: 'auto', width: w / 1.08, marginTop: width / 30 }}>
                    <View style={{ padding: width / 30, backgroundColor: '#eee', width: w / 1.1, borderRadius: 3 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: w / 1.2 }}>
                            <View style={{ flexDirection: 'row', width: w / 1.4 }}>
                                <Image source={main_img} resizeMode="stretch" style={{ width: width / 5, height: width / 5, marginTop: 'auto', marginBottom: 'auto' }} />
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={{ width: w / 2.2, marginLeft: width / 30, fontSize: width / 25, fontWeight: 'bold', color: '#333' }}>Bahrain Specialist Hospital</Text>
                                    <View style={{ borderWidth: 1, borderColor: '#ddd', backgroundColor: 'white', width: w / 3.5, flexDirection: 'row', backgroundColor: 'white', padding: width / 100, marginLeft: width / 30, marginTop: width / 50 }}>
                                        <View style={{ width: width / 15, height: width / 15, borderRadius: width / 30, backgroundColor: 'orange', marginTop: 'auto', marginBottom: 'auto' }}>
                                            <Text numberOfLines={1} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', color: 'white' }}>20</Text>
                                        </View>
                                        <Text style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: width / 50, fontSize: width / 32, color: 'grey' }}>Branches</Text>
                                    </View>
                                </View>
                            </View>
                            <Icon name='right-arrow' color='grey' size={width / 15} style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                        </View>
                    </View>
                </View>
                <Modal
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View elevation={10} style={{ borderTopLeftRadius: width / 18, borderWidth: 1, borderColor: '#ddd', borderTopRightRadius: width / 18, backgroundColor: 'white', paddingBottom: width / 30, width: w, position: 'absolute', bottom: 0, borderRadius: 5, transform: [{ rotateY: this.state.isRTL ? '180deg' : '0deg' }] }}>
                        <View style={{ marginTop: width / 30, width: w / 1.1, marginLeft: 'auto', marginRight: 'auto', justifyContent: 'flex-end', flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.setModalVisible(false)}>
                                <View style={{ width: width / 15, height: width / 15, borderRadius: width / 30, backgroundColor: 'red', marginTop: 'auto', marginBottom: 'auto' }}>
                                    <Icon name='reject-icon' color='white' size={width / 30} style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 'auto', marginRight: 'auto' }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: width / 30, width: w / 1.1, marginLeft: 'auto', marginRight: 'auto' }}>
                            {this.renderModalFilterButtons()}

                        </View>

                    </View>
                </Modal>
            </View >
        )
    }
}


const styles = StyleSheet.create({
    form: {
        marginTop: width / 50,
        width: w / 4,
        borderColor: '#eee',
        borderWidth: 1,
        backgroundColor: '#eee',
        borderRadius: 3,
        height: width / 12,
    },
    formSelling: {
        width: w / 3,
        borderRadius: 3,
        height: width / 10,
    }
})

export default Home