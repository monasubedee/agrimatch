import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Icon, IconButton, Actionsheet, useDisclose, Divider, Image } from 'native-base';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import LoggedUserCredentials from '../../models/LoggedUserCredentials';
import io from 'socket.io-client';
import { baseUrl, chatUrl } from '../../utils/global';
import { chooseFromGallery, takePicture } from './media_utils';



const Chat = ({ navigation, route }) => {

    let chat_socket;

    const [messages, setMessages] = useState([]);
    const [close, setClose] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclose();


    useEffect(() => {
        chat_socket = io(`${baseUrl}/all_chats`);

        setMessages([]);

    }, []);


    const selectFromGallery = async () => {
        //onClose();
        const result = await chooseFromGallery();

        let obj = {
            user: {
                _id: LoggedUserCredentials.getUserId(),
                name: LoggedUserCredentials.getUserName()
            },
            createdAt: new Date(),
            _id: Math.round(Math.random() * 1000000),
            image: result.uri
        }


        onSend([obj]);

    }

    const takePictureFromCameraRoll = async () => {
        onClose();
        const result = await takePicture();

        let obj = {
            user: {
                _id: LoggedUserCredentials.getUserId(),
                name: LoggedUserCredentials.getUserName()
            },
            createdAt: new Date(),
            _id: Math.round(Math.random() * 1000000),
            image: result.uri
        }

        onSend([obj]);

    }



    const onSend = (messages = []) => {

        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages));
        sendMessage(messages[0]);
    }

    const sendMessage = async (message) => {
        const { chatType, user } = route.params.data;
        const { text,image} = message;
        const formData = new FormData();

        const receiver_ids = Array.isArray(user) ? user : [user];


        if (image) {
            const filename = image.split("/").pop();

            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            data.append("media", {
                uri: image,
                type,
                name: filename
            });
        }


        if (text && text.length > 0) {
            formData.append('text', text);
        }

        formData.append('senderId', LoggedUserCredentials.getUserId());
        formData.append('receiverIds', user[0]);
        formData.append('roomType', chatType);

        const config = {
            method: 'POST',
            headers: {
                Authorization: "Bearer " + LoggedUserCredentials.getAccessToken(),
                'Content-Type': 'multipart/form-data',

            },
            body: formData
        }
        const path = `${baseUrl}/chats/saveChat`;

        try {
            const res = await fetch(path, config);

            console.log('res is', res.status);
        } catch (error) {
            console.log(error);
        }


    }

    const renderInputToolBar = (props) => <InputToolbar {...props} onPressActionButton={onOpen} />


    const renderMessageImage = (props) => {
        return (
            <View>
                <Image
                    source={{ uri: props.currentMessage.image }}
                    resizeMode="contain"
                    alt="message-image"
                    style={{ width: 200, height: 200, resizeMode: 'cover', padding: 6, borderRadius: 15 }} />
            </View>
        )
    }

    useLayoutEffect(() => {

        const iconName = Platform.OS === 'android' ? 'arrow-back' : 'arrow-back-ios';
        navigation.setOptions({
            headerTitle: route.params.data.title,
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

    let currentUser = {
        '_id': LoggedUserCredentials.getUserId(),
        'name': LoggedUserCredentials.getUserName()
    }
    return (
        <>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                scrollToBottom
                user={currentUser}
                renderInputToolbar={renderInputToolBar}
                renderMessageImage={renderMessageImage}


            />
            <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content>
                    <Actionsheet.Item onPress={selectFromGallery}>Choose From Library</Actionsheet.Item>
                    <Divider />
                    <Actionsheet.Item onPress={takePictureFromCameraRoll}>Take Picture</Actionsheet.Item>
                    <Divider />
                    <Actionsheet.Item>Send Location</Actionsheet.Item>
                </Actionsheet.Content>
            </Actionsheet>
        </>
    )
}


export default Chat;