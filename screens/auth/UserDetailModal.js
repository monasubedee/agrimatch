import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Image, Input, Button, Modal, Icon } from 'native-base';
import default_propic from '../../assets/images/default_propic.png';
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import LoggedUserCredentials from '../../models/LoggedUserCredentials';
import { AuthContext } from '../../components/context';


const UserDetailModal = ({ param, show, setShow }) => {

    const { signUp } = React.useContext(AuthContext);

    const navigation = useNavigation();

    const [data, setData] = useState({
        email: '',
        name: '',
        gpa_cert_no: '',
        gpa_cert_pic: null,
        pro_pic: null,
        errorText: '',
        emailErrorText: '',
        nameErrorText: '',
        gpaCertNoErrorText: '',
        isValidGpaCertNo: true,
        isValidEmail: true,
        isValidName: true,
        isLoading: false
    });

    const [location, setLocation] = useState({});

    const [check, setCheck] = useState(false);

    const [errorMessage, setErrorMessage] = useState(null);


    // useEffect(() => {

    //     getLocationAsync();
    //     if(check){
    //         handleValidation();
    //     }

    // }, [check === true]);


    const openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });

        if (!pickerResult.cancelled) {
            setData({
                ...data,
                pro_pic: pickerResult.uri
            })
        }
    }


    const handleEmailChange = (val) => {
        let validationEmailString = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (val.trim().length === 0) {
            setData({
                ...data,
                email: val,
                isValidEmail: false,
                emailErrorText: 'Enter your email address'
            })
        }
        else if (!validationEmailString.test(val)) {
            setData({
                ...data,
                email: val,
                isValidEmail: false,
                emailErrorText: 'Enter valid email address'
            });
        }

        else {
            setData({
                ...data,
                email: val,
                isValidEmail: true,
                emailErrorText: ''
            });
        }
    }

    const handleNameChange = (val) => {
        if (val.trim().length === 0) {
            setData({
                ...data,
                name: val,
                isValidName: false,
                nameErrorText: 'Enter your Name'

            });

        }
        else {
            setData({
                ...data,
                name: val,
                isValidName: true,
                nameErrorText: ''
            })
        }

    }

    const handleValidEmail = (val) => {
        let validationEmailString = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (val.trim().length === 0) {
            setData({
                ...data,
                isValidEmail: false,
                emailErrorText: 'Enter your email address'
            })
        }
        else if (!validationEmailString.test(val)) {
            setData({
                ...data,
                isValidEmail: false,
                emailErrorText: 'Enter valid email address'
            })
        }
        else {
            setData({
                ...data,
                isValidEmail: true,
                emailErrorText: ''
            })
        }

    }

    const handleValidName = (val) => {
        if (val.trim().length === 0) {
            setData({
                ...data,
                isValidName: false,
                nameErrorText: 'Enter your name'
            })
        }
        else {
            setData({
                ...data,
                isValidName: true,
                nameErrorText: ''
            })
        }

    }

    const handleGpaCertNo = (val) => {
        if (val.trim().length === 0) {
            setData({
                ...data,
                gpa_cert_no: val,
                isValidGpaCertNo: false,
                gpaCertNoErrorText: 'Enter your Gpa Cert No'
            })
        }
        else {
            setData({
                ...data,
                gpa_cert_no: val,
                isValidGpaCertNo: true,
                gpaCertNoErrorText: ''
            })
        }
    }

    const handleValidGpaCertNo = (val) => {
        if (val.trim().length === 0) {
            setData({
                ...data,
                isValidGpaCertNo: false,
                gpaCertNoErrorText: 'Enter your Gpa Cert No'
            })
        }
        else {
            setData({
                ...data,
                isValidGpaCertNo: true,
                gpaCertNoErrorText: ''
            })
        }
    }


    const getLocationAsync = async () => {

        // if (location) {
        //     handleValidation();
        // }

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMessage('Permission to access location was denied');
            return;
        }
        const { coords } = await Location.getCurrentPositionAsync();
        setLocation(coords);
        LoggedUserCredentials.setLocation(coords);
        handleValidation();

    }

    const handleValidation = () => {

        if (data.email.trim() === "") {
            setData({
                ...data,
                isValidEmail: false,
                isLoading: false,
                emailErrorText: 'Enter your email address'
            });
        }
        else if (data.name.trim() === "") {
            setData({
                ...data,
                isValidName: false,
                isLoading: false,
                nameErrorText: 'Enter your name'
            })
        }
        else {
            setData({
                ...data,
                isLoading: true
            });

            signUp(data, param, location, setData);


        }

    }


    const proPic = data.pro_pic !== null ? { uri: data.pro_pic } : default_propic;


    return (
        <Modal
            isOpen={show}
            onClose={() => setShow(false)}

        >

            <ScrollView
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                style={styles.container}
            >
                <View style={styles.modal_wrapper}>
                    <View style={styles.image_container}>

                        <Image
                            style={styles.propic_image}
                            source={proPic}
                            alt="default-propic" />
                        <TouchableOpacity
                            onPress={openImagePickerAsync}
                            style={styles.uploadImage}>
                            <Icon
                                as={Ionicons}
                                name="camera"
                                style={styles.camera} />
                        </TouchableOpacity>


                    </View>
                    <View style={styles.form_wrapper}>
                        <Input
                            style={styles.input}
                            isInvalid={!data.isValidEmail}
                            placeholder="Email"
                            placeholderTextColor='#36454F'
                            keyboardType="email-address"
                            variant="underlined"
                            _focus={{ borderColor: "#369154", marginLeft: 3, marginRight: 3 }}
                            onChangeText={(val) => handleEmailChange(val)}
                            onEndEditing={(e) => handleValidEmail(e.nativeEvent.text)}

                        />
                        {
                            !data.isValidEmail ? <Text style={styles.errorText}>{data.emailErrorText}</Text> : null
                        }

                        <Input
                            style={styles.input}
                            isInvalid={!data.isValidName}
                            placeholder="Name"
                            placeholderTextColor='#36454F'
                            variant="underlined"
                            _focus={{ borderColor: "#369154", marginLeft: 3, marginRight: 3 }}
                            onChangeText={(val) => handleNameChange(val)}
                            onEndEditing={(e) => handleValidName(e.nativeEvent.text)}

                        />
                        {
                            !data.isValidName ? <Text style={styles.errorText}>{data.nameErrorText}</Text> : null
                        }

                        {
                            param.userType === 'Farmer' ?
                                <>
                                    <Input
                                        style={styles.input}
                                        isInvalid={!data.isValidGpaCertNo}
                                        placeholder="Gpa Cert No"
                                        placeholderTextColor='#36454F'
                                        variant="underlined"
                                        _focus={{ borderColor: "#369154", marginLeft: 3, marginRight: 3 }}
                                        onChangeText={(val) => handleGpaCertNo(val)}
                                        onEndEditing={(e) => handleValidGpaCertNo(e.nativeEvent.text)}
                                    // InputRightElement={<Icon style={styles.rightIcon} as={Ionicons} color='#369154' name="camera" />}

                                    />
                                    <Icon as={Ionicons} name="camera" style={styles.rightIcon} />
                                </>
                                : null
                        }
                        {
                            !data.isValidGpaCertNo ? <Text style={styles.errorText}>{data.gpaCertNoErrorText}</Text> : null
                        }
                        {
                            data.errorText && data.errorText.length > 0 ? <Text style={styles.showErrorText}>{data.errorText}</Text> : null
                        }

                        <TouchableOpacity>
                            <Button isLoading={data.isLoading} onPress={() => getLocationAsync()} style={styles.save_btn}>SAVE</Button>
                        </TouchableOpacity>



                    </View>
                </View>

            </ScrollView>

        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%'
    },
    modal_wrapper: {
        marginTop: 40,
        width: '100%'
    },
    propic_image: {
        width: 170,
        height: 170,
        borderRadius: 85,
        borderWidth: 1,
        borderColor: 'gray',

    },
    input: {
        marginLeft: 10,
        marginRight: 10
    },
    save_btn: {
        backgroundColor: '#369154',
        marginTop: 50,
        marginHorizontal: 15
    },
    form_wrapper: {
        marginTop: 30
    },
    uploadImage: {
        position: 'absolute',
        padding: 4,
        bottom: 0,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        width: '100%',


    },
    image_container: {
        width: 170,
        height: 170,
        borderRadius: 85,
        alignSelf: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "gray",

    },
    camera: {
        color: '#fff',
        alignSelf: 'center'

    },
    errorText: {
        color: '#ff0000',
        fontSize: 13,
        marginLeft: 10,
        marginTop: 5
    },
    showErrorText: {
        color: '#ff0000',
        fontSize: 15,
        textAlign: 'right',
        marginTop: 10
    },
    rightIcon: {
        position: 'absolute',
        top: '43%',
        right: 0,
        bottom: 0,
        marginRight: 20

    }
})


export default UserDetailModal;