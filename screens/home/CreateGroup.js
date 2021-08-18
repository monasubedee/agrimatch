import React, { useLayoutEffect, useState } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { IconButton, Icon, Container, Input, Button } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { baseUrl } from '../../utils/global';
import LoggedUserCredentials from '../../models/LoggedUserCredentials';

const CreateGroup = ({ navigation }) => {

    const [gpName, setGpName] = useState('');
    const [error, setError] = useState({
        isValidGpName: true,
        gpName: ''

    });
    const [isLoading, setLoading] = useState(false);

    const handleGroupNameChange = (val) => {
        if (val.trim().length === 0) {
            setError({
                ...error,
                isValidGpName: false,
                gpName: 'Enter your Group Name'
            });
            setGpName(val);
        }
        else {
            setError({
                ...error,
                isValidGpName: true,
                gpName: ''
            });
            setGpName(val);
        }

    }

    const createGroupChat = async () => {
        setLoading(true);
        if (gpName.trim().length === 0) {
            setLoading(false);
            setError({
                ...error,
                isValidGpName: false,
                gpName: 'Enter your Group Name'
            });

        }
        else {
            let token = LoggedUserCredentials.getAccessToken();
            let user = LoggedUserCredentials.getUserId();
            let location = LoggedUserCredentials.getLocation();

            let values = {
                'roomName': gpName.trim(),
                'user': user,
                'latitude':location.latitude,
                'longitude':location.longitude
            }
            try {
                const path = `${baseUrl}/chatrooms/createChatRoom`;

                const config = {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(values)
                }

                const response = await fetch(path, config);

                if (response.status === 201) {
                   
                    navigation.goBack();
                }
                else if (response.status === 409) {
                    setLoading(false);
                    setError({
                        ...error,
                        isValidGpName: false,
                        gpName: 'Group Name Already exists'
                    });
                }
                else {
                    setLoading(false);
                    setError({
                        ...error,
                        isValidGpName: false,
                        gpName: 'Something went wrong. Please Try Again.'
                    });
                }



            } catch (error) {
                console.log(error);
                setLoading(false);
                setError({
                    ...error,
                    isValidGpName: false,
                    gpName: 'No Internet Connection'
                })
            }
        }
    }

    useLayoutEffect(() => {

        const iconName = Platform.OS === 'android' ? 'arrow-back' : 'arrow-back-ios';
        navigation.setOptions({
            headerTitle: 'Create Group Chat',
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: '#369154'
            },

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
    return (
        <View style={styles.groupContainer}>
            <View>
                <Input
                    isFullWidth
                    isInvalid={!error.isValidGpName}
                    placeholder="Enter Group Name"
                    placeholderTextColor='#36454F'
                    variant="underlined"
                    onChangeText={(value) => handleGroupNameChange(value)}
                    _focus={{ borderColor: "#369154", marginLeft: "10px", marginRight: "10px" }}
                />
                {
                    !error.isValidGpName ? <Text style={styles.errorText}>{error.gpName}</Text> : null
                }
            </View>
            <View style={styles.textContainer}>
                <Text style={{ fontSize: 17 }}>
                    Farmers/Middlemen near you will be able to join this group for discussion
                </Text>
            </View>
            <View>
                <Button style={styles.createBtn} isLoading={isLoading} onPress={createGroupChat}>
                    CREATE
                </Button>
            </View>
        </View>


    )
}


const styles = StyleSheet.create({

    groupContainer: {
        marginTop: 15,
        paddingHorizontal: 20
    },
    textContainer: {
        marginTop: 25
    },
    errorText: {
        color: 'red',
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    createBtn: {
        backgroundColor: '#369154',
        marginTop: 20,
        width: '50%'
    }
})


export default CreateGroup;