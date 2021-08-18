import { Container, IconButton, Icon } from 'native-base';
import React, { useState, useEffect } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { userUrl } from '../../utils/global';
import LoggedUserCredentials from '../../models/LoggedUserCredentials';
import * as Location from 'expo-location';
import { AuthContext } from '../../components/context';


const HomeScreen = ({ navigation, route }) => {

    const { signOut } = React.useContext(AuthContext);

    const userName = LoggedUserCredentials.getUserName();
    const userType = LoggedUserCredentials.getUserType();


    const [selectedIndex, setSelectedIndex] = useState(userType === 'Farmer' ? 0 : 1);
    const [location, setLocation] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [screenLoading, setScreenLoading] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);
    const [userCount, setUserCount] = useState('');


    useEffect(() => {

        getLocationAsync();

    }, []);


    const getLocationAsync = async () => {
        setScreenLoading(true);
        const location = LoggedUserCredentials.getLocation();

        if (location) {
            setLocation(location);
            setScreenLoading(false);
            getNumberOfUsers();
        }
        else {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMessage('Permission to access location was denied');
                return;
            }

            const { coords } = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
            LoggedUserCredentials.setLocation(coords);
            setLocation(coords);
            setScreenLoading(false);
            getNumberOfUsers();
        }


    }



    const getNumberOfUsers = async () => {
        setLoading(true);

        const token = LoggedUserCredentials.getAccessToken();

        const path = `${userUrl}/getUserCount?userType=${userType}`;

        const config = {
            method: 'GET',
            headers: {

                Authorization: 'Bearer ' + token
            },

        };

        try {

            const res = await fetch(path, config);

            if (res.status === 200) {
                const { userCount } = await res.json();
                setUserCount(userCount);
                setLoading(false);

            }
            else {
                setLoading(false);
                setError(true);
            }

        } catch (error) {
            setLoading(false);
            setError(true);
        }



    }


    const _gotoChat = () => {
        navigation.navigate('Message');
    }

    const _gotoCrops = () => {
        navigation.navigate('Crop');
    }

    const _findNearby = () => {
        navigation.navigate('Nearme');
    }

    if (screenLoading) {
        return (
            <View style={styles.screenLoader}>
                <ActivityIndicator size="large" color="#369154" />
            </View>
        )
    }

    return (
        //<Container style={{ backgroundColor: '#fff',display:'flex',justifyContent:'center',alignItems:'center' }}>
        <View  >
            <View style={styles.tab_wrapper}>
                <SegmentedControlTab
                    values={["Farmer", 'Middleman']}
                    tabStyle={styles.tabStyle}
                    selectedIndex={selectedIndex}
                    activeTabStyle={styles.activeTabStyle}
                    tabTextStyle={styles.tabTextStyle}
                    onTabPress={() => signOut()}

                />
                <TouchableOpacity>
                    <View style={styles.noti_container}>
                        <IconButton
                            style={styles.noti_btn}
                            variant="solid"
                            icon={<Icon size="sm" as={<Ionicons name="notifications-outline" />} bgColor="#369154" color="white" />}
                        />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{ height: '100%' }}>
                <View style={styles.map}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={{ width: '100%', height: '100%' }}
                        showsUserLocation
                        initialRegion={{
                            latitude: location.latitude ? location.latitude : 0,
                            longitude: location.longitude ? location.longitude : 0,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.015
                        }}

                    />
                </View>
                <View style={styles.container}>
                    <View style={styles.footer}>
                        <View style={styles.greeting_info}>
                            <View>
                                <Text style={styles.info_text}>Hello, {userName}</Text>
                            </View>

                        </View>
                        {
                            isLoading ? <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 70 }}><ActivityIndicator color="#369154" large="large" /></View> :
                                isError ?
                                    <TouchableOpacity>
                                        <View style={styles.screenLoader}>
                                            <Icon name="wifi" color="black" style={{ fontSize: 40 }} />
                                            <Text>No Internet Connection !</Text>
                                            <Text>Tap To Retry</Text>
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    <>
                                        {userType === 'Farmer' ?

                                            <View style={styles.noOfUser}>
                                                <Text style={styles.userText}>
                                                    {
                                                        userCount > 1 ? `${userCount} Farmers are using Agrimatch!`
                                                            : `${userCount} Farmer is using Agrimatch!`
                                                    }
                                                </Text>
                                            </View>
                                            :
                                            <View style={styles.noOfUser}>
                                                <Text style={styles.userText}>
                                                    {
                                                        userCount > 1 ? `${userCount} Middlemen are using Agrimatch!`
                                                            : `${userCount} Middleman is using Agrimatch!`
                                                    }
                                                </Text>
                                            </View>
                                        }
                                        <View style={styles.footerContainer}>
                                            <View style={styles.footerWrapper}>
                                                <TouchableOpacity onPress={() => _gotoChat()}>
                                                    <View style={styles.tabContainer}>
                                                        <IconButton
                                                            style={styles.icon_btn}
                                                            variant="solid"
                                                            icon={<Icon size="md" as={<Ionicons name="ios-chatbubbles" />} bgColor="#369154" color="white" />}
                                                        />
                                                        <Text style={styles.textStyle}>Messages</Text>
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={() => _gotoCrops()}>
                                                    <View style={styles.tabContainer}>
                                                        <IconButton
                                                            style={styles.icon_btn}
                                                            variant="solid"
                                                            icon={<Icon size="md" as={<Ionicons name="add" />} bgColor="#369154" color="white" />}
                                                        />
                                                        {
                                                            userType === 'Farmer' ?
                                                                <Text style={styles.textStyle}>Sell Goods</Text>
                                                                :
                                                                <Text style={styles.textStyle}>Buy Goods</Text>

                                                        }
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => _findNearby()}>
                                                    <View style={styles.tabContainer}>
                                                        <IconButton
                                                            style={styles.icon_btn}
                                                            variant="solid"
                                                            icon={<Icon size="md" as={<Ionicons name="search" />} bgColor="#369154" color="white" />}
                                                        />
                                                        <Text style={styles.textStyle}>Find People</Text>
                                                    </View>
                                                </TouchableOpacity>


                                            </View>

                                        </View>
                                    </>

                        }

                    </View>
                </View>
            </View>



        </View>

        // </Container>



    )
}

const styles = StyleSheet.create({
    tab_wrapper: {
        width: '68%',
        position: 'absolute',
        zIndex: 999,
        paddingTop: Platform.OS === 'android' ? 40 : 30,
        alignSelf: 'center',
        // marginLeft:25
    },
    tabStyle: {
        borderColor: '#369154',

    },
    activeTabStyle: {
        backgroundColor: '#369154',
        borderColor: '#369154'
    },
    tabTextStyle: {
        color: '#369154'
    },
    noti_container: {
        width: '100%',
        display: 'flex',

    },

    noti_btn: {
        backgroundColor: '#369154',
        position: 'absolute',
        left: '100%',
        bottom: 0,
        zIndex: 999,
        borderRadius: 25,
        width: 40,
        height: 40,
        marginLeft: 8

    },
    map: {
        width: '100%',
        height: '70%'
    },
    container: {
        width: '100%',
        height: '30%',
        backgroundColor: '#fff'
    },
    screenLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    greeting_info: {
        backgroundColor: '#369154',
        alignSelf: 'center',
        padding: 13,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'

    },
    info_text: {
        color: 'white',
        fontSize: 18
    },
    noOfUser: {
        alignSelf: 'center',
        paddingVertical: 10
    },
    userText: {
        color: '#369154',
        fontSize: 16
    },
    footer: {
        width: '100%',
        backgroundColor: '#fff',
        //height:'30%',
    },
    footerContainer: {
        alignSelf: 'center',
        width: '100%'
    },
    footerWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff'

    },
    tabContainer: {
        paddingHorizontal: 15,
        width: '100%',
        backgroundColor: '#fff'
    },
    icon_btn: {
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
    }
})


export default HomeScreen;