import React, { useLayoutEffect } from 'react';
import { Text, View, StyleSheet, Platform, FlatList } from 'react-native';
import { IconButton, Icon, Image } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import defaultImage from '../../assets/images/icon.png';


const MessageContainer = ({ navigation }) => {

    useLayoutEffect(() => {

        const iconName = Platform.OS === 'android' ? 'arrow-back' : 'arrow-back-ios';
        navigation.setOptions({
            headerTitle: "Messages",
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

    const DATA = [
        {
            id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
            name: 'Mona',
            text: 'You: I am fine.N u? .Sat'

        },
        {
            id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
            name: 'Chandra Subedi',
            text: 'You: I am fine.N u? .Sat'

        },
        {
            id: '58694a0f-3da1-471f-bd96-145571e29d72',
            name: 'Sobakar Sbd',
            text: 'You: I am fine.N u? .Sat'
        },
    ];


    const renderItem = ({ item }) => (

        <View>
            <View style={styles.messageContainer}>
                <View style={styles.imageWrapper}>
                    <Image style={styles.image} source={defaultImage} alt="image" />
                </View>
                <View style={styles.textMessage}>
                    <View>
                        <Text style={{ fontSize: 20 }}>
                            Mona
                        </Text>
                    </View>
                    <View>
                        <Text style={{ color: 'gray', fontSize: 14 }}>
                            You: okie  .Sun
                        </Text>
                    </View>

                </View>

            </View>
            <View style={styles.borderBottom}>

            </View>
        </View>


    );

    return (
        <View style={styles.container}>
            <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>


    )
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        height: '100%'

    },
    messageContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 15,
        paddingLeft: 15,


    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 50
    },
    textMessage: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 17
    },
    borderBottom: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingTop: 7,
        marginHorizontal: 8
    }
})

export default MessageContainer;