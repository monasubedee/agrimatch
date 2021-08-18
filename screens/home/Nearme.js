import React, { useLayoutEffect, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Platform, Linking, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Button, Icon, IconButton, Container } from 'native-base';
import { MaterialIcons } from "@expo/vector-icons";
import LoggedUserCredentials from '../../models/LoggedUserCredentials';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { baseUrl } from '../../utils/global';
import { Ionicons } from '@expo/vector-icons';



const Nearme = ({ navigation }) => {

    const userType = LoggedUserCredentials.getUserType();

    const [location, setLocation] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [screenLoading, setScreenLoading] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [middlemanCount, setMiddlemanCount] = useState('');
    const [farmerCount, setFarmerCount] = useState('');
    const [markers, setMarkers] = useState([]);
    const [showFarmer, setShowFarmer] = useState(false);
    const [showMiddleman, setShowMiddleman] = useState(false);
    const [isMiddlemanLoading, setMiddlemanLoading] = useState(false);
    const [isFarmerLoading, setFarmerLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});
    const [showGroupDialog, setShowGroupDialog] = useState(false);
    const [originShow, setOriginShow] = useState(false);


    const showFarmersNearBy = async () => {
        setFarmerLoading(true);
        const latitude = location.latitude;
        const longitude = location.longitude;
        const userId = LoggedUserCredentials.getUserId();

        const path = `${baseUrl}/locations/nearme?userType=Farmer&latitude=${latitude}&longitude=${longitude}&userId=${userId}`;


        const config = {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + LoggedUserCredentials.getAccessToken()
            },

        }

        try {
            const response = await fetch(path, config);

            if (response.status === 201) {
                const { singleUsers, groupUsers } = await response.json();
                const data = [...singleUsers, ...groupUsers];
                setMarkers(data);
                setFarmerCount(singleUsers.length);
                setFarmerLoading(false);
                setShowFarmer(true);
                setShowMiddleman(false);

            }
            else {
                console.log("error");
            }

        } catch (error) {
            console.log(error);
            setFarmerLoading(false);
        }

    }

    const showMiddlemenNearBy = async () => {

        setMiddlemanLoading(true);
        const latitude = location.latitude;
        const longitude = location.longitude;
        const userId = LoggedUserCredentials.getUserId();

        const path = `${baseUrl}/locations/nearme?userType=Middleman&latitude=${latitude}&longitude=${longitude}&userId=${userId}`;


        const config = {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + LoggedUserCredentials.getAccessToken()
            },

        }

        try {
            const response = await fetch(path, config);

            if (response.status === 201) {
                const { singleUsers, groupUsers } = await response.json();
                const data = [...singleUsers, ...groupUsers];
                setMarkers(data);
                setMiddlemanCount(singleUsers.length);
                setMiddlemanLoading(false);
                setShowMiddleman(true);
                setShowFarmer(false);

            }
            else {
                console.log('error');
            }

        } catch (error) {
            console.log(error);
            setMiddlemanLoading(false);
        }


    }


    const renderButtons = () => {

        if (showMiddleman) {
            return (
                <View style={styles.buttons}>
                    <View style={styles.showFarmer}>
                        <Button isLoading={isFarmerLoading} style={styles.bgButton} onPress={() => showFarmersNearBy()}>
                            <Text style={styles.textButton}>
                                Show Farmers Near Me
                            </Text>
                        </Button>
                    </View>

                    <View style={styles.showResult}>
                        <Text style={{ color: "#369154", fontSize: 15, marginTop: 7 }}>Now Showing Middlemen Near You</Text>
                        <Text style={{ color: "#369154", fontSize: 15, textAlign: 'center', marginTop: 3 }}>{middlemanCount} results found</Text>
                    </View>
                </View>
            )
        }
        else if (showFarmer) {
            return (
                <View style={styles.buttons}>
                    <View style={{}}>
                        <Text style={{ color: "#369154", fontSize: 15 }}>Now Showing Farmer Near You</Text>
                        <Text style={{ color: "#369154", fontSize: 15, textAlign: 'center' }}>{farmerCount} results found</Text>
                    </View>

                    <View style={styles.showMiddlemen}>
                        <Button isLoading={isMiddlemanLoading} style={styles.bgButton} onPress={() => showMiddlemenNearBy()}>
                            <Text style={styles.textButton}>
                                Show Middlemen Near Me
                            </Text>
                        </Button>
                    </View>
                </View>
            )
        }
        else {
            return (
                <View style={styles.buttons}>
                    <View style={styles.showFarmer}>
                        <Button isLoading={isFarmerLoading} style={styles.bgButton} onPress={() => showFarmersNearBy()}>
                            <Text style={styles.textButton}>
                                Show Farmers Near Me
                            </Text>
                        </Button>
                    </View>

                    <View style={styles.showMiddlemen}>
                        <Button isLoading={isMiddlemanLoading} style={styles.bgButton} onPress={() => showMiddlemenNearBy()}>
                            <Text style={styles.textButton}>
                                Show Middlemen Near Me
                            </Text>
                        </Button>
                    </View>
                </View>
            )
        }

    }

    const handleMarkerPress = (e, marker) => {
        setShowFarmer(false);
        setShowMiddleman(false);
        setShowGroupDialog(false);
        setSelectedUser(marker);
        setShowDialog(true);

    }

    const handleGroupChatPress = (e, marker) => {
        setShowFarmer(false);
        setShowMiddleman(false);
        setSelectedUser(marker);
        setShowDialog(false);
        setShowGroupDialog(true);

    }

    const callUser = () => {
        Linking.openURL(`tel:${selectedUser.user.phoneNumber}`)
    }



    const backToPrevScreen = () => {
        setShowMiddleman(false);
        setShowFarmer(false);
        setShowDialog(false);
        setShowGroupDialog(false);
        setMarkers([]);
    }

    const goToChatRoom = () => {

        const data = {
            chatType: selectedUser.chatType,
            user: []
        };

        if (selectedUser.chatType === 'SINGLE') {
            data['title'] = selectedUser.user.name;
            data['user'].push(selectedUser.user._id);

        }

        navigation.navigate('Chat', { data });


    }


    useLayoutEffect(() => {

        const iconName = Platform.OS === 'android' ? 'arrow-back' : 'arrow-back-ios';
        navigation.setOptions({
            headerTitle: 'Find People',
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: '#369154'
            },
            headerRight: () => (
                LoggedUserCredentials.getUserType() === 'Farmer' ?
                    <IconButton
                        onPress={() => goToCreateGroup()}
                        style={{ backgroundColor: 'transparent', marginRight: 10 }}
                        variant="solid"
                        icon={<Icon as={<MaterialIcons name='group-add' size={32} />} color="white" />}
                    />
                    :
                    null
            ),
            headerLeft: () => (

                <IconButton
                    style={{ backgroundColor: 'transparent' }}
                    onPress={() => navigation.goBack()}
                    variant="solid"
                    icon={<Icon size="sm" as={<MaterialIcons name={iconName} />} color="white" />}
                />

            )

        })
    }, []);


    useEffect(() => {
        getLocationAsync();
    }, [])

    const goToCreateGroup = () => {
        navigation.navigate('CreateGroup');
    }


    const getLocationAsync = async () => {
        setScreenLoading(true);
        let location;
        if (LoggedUserCredentials.getLocation()) {
            location = LoggedUserCredentials.getLocation();
        }
        else {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMessage('Permission to access location was denied');
                return;
            }
            const { coords } = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
            location = coords;
        }

        setLocation(location);
        setScreenLoading(false);


    }

    if (screenLoading) {
        return (
            <View style={styles.screenLoader}>
                <ActivityIndicator color="#369154" size="large" />
            </View>
        )
    }

    return (
        //<Container style={styles.container} >
        <View style={{ height: '100%' }}>
            <View style={{ height: '70%' }}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ width: Dimensions.get("screen").width, height: '100%' }}
                    showsUserLocation
                    initialRegion={{
                        latitude: location.latitude ? location.latitude : 0,
                        longitude: location.longitude ? location.longitude : 0,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02
                    }}

                >
                    {
                        markers.length > 0 && markers.map((marker, index) => {

                            if (marker.chatType === 'GROUP') {
                                return (
                                    <Marker
                                        onPress={(e) => handleGroupChatPress(e, marker)}
                                        key={index}
                                        coordinate={{
                                            latitude: marker.location.coordinates[1],
                                            longitude: marker.location.coordinates[0]
                                        }}
                                        title={marker.chatRoom.roomName}

                                    >
                                        <View style={styles.groupMarker}>
                                            <Icon
                                                as={Ionicons}
                                                name="people"
                                                color='#fff'
                                            />
                                        </View>

                                    </Marker>
                                )
                            }
                            else if (marker.chatType === 'SINGLE') {
                                return (
                                    <Marker
                                        onPress={(e) => handleMarkerPress(e, marker)}
                                        key={index}
                                        pinColor='#369154'
                                        coordinate={{
                                            latitude: marker.location.coordinates[1],
                                            longitude: marker.location.coordinates[0]
                                        }}
                                        title={marker.user !== null ? marker.user.name : ''}

                                    >
                                        <Icon name="person" as={Ionicons} color="#369154" />
                                    </Marker>
                                )
                            }

                        })
                    }


                </MapView>
            </View>
            <View style={styles.footer}>
                {
                    showMiddleman || showFarmer ?

                        <View style={styles.greeting}>
                            <View style={styles.dialogGreeting}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={styles.textInfo}>Hello, {LoggedUserCredentials.getUserName()} </Text>
                                </View>
                                <View style={{ display: 'flex', alignSelf: 'flex-end' }}>
                                    <Icon onPress={() => backToPrevScreen()} as={Ionicons} name="backspace" color="white" />
                                </View>
                            </View>

                        </View>
                        :
                        showDialog ?

                            <View style={styles.greeting}>
                                <View style={styles.dialogGreeting}>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={styles.textInfo}>{selectedUser.user.name} </Text>
                                    </View>
                                    <View style={{ display: 'flex', alignSelf: 'flex-end', marginRight: 10 }}>
                                        <Icon onPress={() => backToPrevScreen()} as={Ionicons} name="backspace" color="white" />
                                    </View>
                                </View>

                            </View>

                            :
                            showGroupDialog ?
                                <View style={styles.greeting}>
                                    <View style={styles.dialogGreeting}>
                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={styles.textInfo}>{selectedUser.chatRoom.roomName} </Text>
                                        </View>
                                        <View style={{ display: 'flex', alignSelf: 'flex-end', marginRight: 10 }}>
                                            <Icon onPress={() => backToPrevScreen()} as={Ionicons} name="backspace" color="white" />
                                        </View>
                                    </View>

                                </View>
                                :
                                <View style={styles.greeting_info}>
                                    <View>
                                        <Text style={styles.info_text}>Hello, {LoggedUserCredentials.getUserName()} </Text>
                                    </View>

                                </View>
                }
                {
                    showDialog ?

                        <View style={styles.footerContainer}>
                            <View style={styles.footerWrapper}>
                                <TouchableOpacity onPress={() => goToChatRoom()}>
                                    <View style={styles.tabContainer}>
                                        <IconButton
                                            style={styles.icon_button}
                                            variant="solid"
                                            icon={<Icon size="md" as={<Ionicons name="ios-chatbubbles" />} bgColor="#369154" color="white" />}
                                        />
                                        <Text style={styles.textStyle}>Message</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ marginRight: 12 }} onPress={() => callUser()}>
                                    <View style={styles.tabContainer}>
                                        <IconButton
                                            style={styles.icon_button}
                                            variant="solid"
                                            icon={<Icon size="md" as={<Ionicons name="call" />} bgColor="#369154" color="white" />}
                                        />
                                        <Text style={styles.textStyle}>Call</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <View style={styles.tabContainer}>
                                        <IconButton
                                            style={styles.icon_button}
                                            variant="solid"
                                            icon={<Icon size="md" as={<Ionicons name="eye" />} bgColor="#369154" color="white" />}
                                        />
                                        <Text style={styles.textStyle}>Crops</Text>
                                    </View>
                                </TouchableOpacity>


                            </View>

                        </View>

                        :
                        showGroupDialog ?
                            <View style={styles.dialogContainer}>
                                <View style={styles.dialogWrapper}>
                                    <View style={styles.icon_button}>
                                        <Icon name="people" color="#fff" style={{ alignSelf: 'center', paddingTop: 5 }} as={Ionicons} size='md' />
                                    </View>
                                    <View style={{ marginTop: 20, marginLeft: 20 }}>
                                        <Text style={{ fontSize: 15, color: '#369154' }}>{selectedUser.chatRoom.participants.length} people are in this group.</Text>
                                        {
                                            selectedUser.chatRoom.participants.includes(LoggedUserCredentials.getUserId()) ?
                                                <TouchableOpacity>
                                                    <View style={styles.chat_joinBlock}>
                                                        <Text style={{ color: 'white', alignSelf: 'center' }}>View Chat</Text>
                                                    </View>
                                                </TouchableOpacity>

                                                :
                                                <TouchableOpacity>
                                                    <View style={styles.chat_joinBlock}>
                                                        <Text style={{ color: 'white', alignSelf: 'center' }}>Join Chat</Text>
                                                    </View>
                                                </TouchableOpacity>

                                        }

                                    </View>

                                </View>
                            </View>

                            :

                            renderButtons()
                }



            </View>

        </View>


        //</Container>


    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        backgroundColor: '#fff',
        height: '100%'

    },
    greeting_info: {
        backgroundColor: '#369154',
        alignSelf: 'center',
        padding: 10,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',


    },
    greeting_dialog: {
        display: 'flex',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    greeting: {
        backgroundColor: '#369154',
        width: '100%',

    },
    textInfo: {
        color: 'white',
        fontSize: 18,
        marginLeft: 20

    },
    info_text: {
        color: 'white',
        fontSize: 18,

    },


    screenLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttons: {
        marginTop: 15,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',


    },
    showFarmer: {
        width: '70%',


    },
    showMiddlemen: {
        marginTop: 10,
        width: '70%',

    },
    dialogGreeting: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10

    },

    textButton: {
        fontSize: 15,
        color: '#369154',

    },
    bgButton: {
        backgroundColor: 'rgba(128, 128, 128,0.7)',
        height: 45,

    },

    greeting_text: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'

    },
    icon_btn: {
        marginRight: 10,
        backgroundColor: '#369154',


    },
    footerContainer: {
        alignSelf: 'center',
        width: '100%',
        marginTop: 20
    },
    footerWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#fff'

    },

    tabContainer: {
        //paddingHorizontal: 15,
        width: '100%',
        backgroundColor: '#fff'
    },
    icon_button: {
        backgroundColor: '#369154',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignSelf: 'center'
    },
    textStyle: {
        color: '#369451',
        alignSelf: 'center',
        fontSize: 16
    },
    dialogWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    chat_joinBlock: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#369154',
        borderRadius: 7
    },
    groupMarker:{
        width: 40,
        height: 40,
        borderRadius: 25,
        backgroundColor: '#369154',
        alignItems: "center",
        justifyContent: "center"
    }

})

export default Nearme;