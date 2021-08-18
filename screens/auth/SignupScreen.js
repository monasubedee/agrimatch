import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, View, Platform } from 'react-native';
import myanmarPhoneNumber from 'myanmar-phonenumber';
import { FormControl, Input, Image, Center, Select, VStack, Button, CheckIcon } from 'native-base';
import Logo from '../../assets/images/logo.png';
import UserDetailModal from './UserDetailModal';
import { userUrl } from '../../utils/global';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const SignupScreen = ({ navigation }, props) => {
    const [data, setData] = useState({
        userType: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        isLoading: false,
        isValidUserType: true,
        isValidPhoneNumber: true,
        isValidPassword: true,
        isValidConfirmPassword: true,
        userTypeErrorText: '',
        phoneNumberErrorText: '',
        passwordErrorText: '',
        confirmPasswordErrorText: '',
        errorText: ''
    });
    const [show, setShow] = useState(false);


    const handleUserTypeChange = (val) => {
        if (val.trim().length === 0) {
            setData({
                ...data,
                userType: val,
                isValidUserType: false,
                userTypeErrorText: 'Please Select User Type'
            })
        }
        else {
            setData({
                ...data,
                userType: val,
                isValidUserType: true,
                userTypeErrorText: ''
            })
        }

    }


    const handlePhoneNumberChange = (val) => {
        if (val.trim().length === 0) {
            setData({
                ...data,
                phoneNumber: val,
                isValidPhoneNumber: false,
                phoneNumberErrorText: 'Enter your Phone Number'

            })
        }
        else if (!myanmarPhoneNumber.isValidMMPhoneNumber(val)) {
            setData({
                ...data,
                phoneNumber: val,
                isValidPhoneNumber: false,
                phoneNumberErrorText: 'Enter valid Phone Number'
            })
        }
        else {
            setData({
                ...data,
                phoneNumber: val,
                isValidPhoneNumber: true,
                phoneNumberErrorText: ''
            })
        }

    }

    const handlePasswordChange = (val) => {
        if (val.trim().length === 0) {
            setData({
                ...data,
                password: val,
                isValidPassword: false,
                passwordErrorText: 'Enter your password'
            })
        }
        else {
            setData({
                ...data,
                password: val,
                isValidPassword: true,
                passwordErrorText: ''
            })
        }
    }

    const handleConfirmPasswordChange = (val) => {
        if (val.trim().length === 0) {
            setData({
                ...data,
                confirmPassword: val,
                isValidConfirmPassword: false,
                confirmPasswordErrorText: 'Please Repeat your password'
            })
        }
        else {
            setData({
                ...data,
                confirmPassword: val,
                isValidConfirmPassword: true,
                confirmPasswordErrorText: ''
            })
        }
    }

    const handleValidUserType = (val) => {
        if (val.trim().length === 0) {
            setData({
                ...data,
                isValidUserType: false,
                userTypeErrorText: 'Please Select User Type'
            })
        }
        else {
            setData({
                ...data,
                isValidUserType: true,
                userTypeErrorText: ''
            })
        }
    }

    const handleValidPhoneNumber = (val) => {
        if (val.trim().length === 0) {
            setData({
                ...data,
                isValidPhoneNumber: false,
                phoneNumberErrorText: 'Enter your Phone Number'

            })
        }
        else if (!myanmarPhoneNumber.isValidMMPhoneNumber(val)) {
            setData({
                ...data,
                isValidPhoneNumber: false,
                phoneNumberErrorText: 'Enter valid Phone Number'

            })
        }
        else {
            setData({
                ...data,
                isValidPhoneNumber: true,
                phoneNumberErrorText: ''

            })
        }
    }

    const handleValidPassword = (val) => {
        if (val.trim().length === 0) {
            setData({
                ...data,
                isValidPassword: false,
                passwordErrorText: 'Enter your password'
            })
        }
        else {
            setData({
                ...data,
                isValidPassword: true,
                passwordErrorText: ''

            })
        }
    }

    const handleValidConfirmPassword = (val) => {
        if (val.trim().length === 0) {
            setData({
                ...data,
                isValidConfirmPassword: false,
                confirmPasswordErrorText: 'Please Repeat your password'
            })
        }
        else if (data.password !== val) {
            setData({
                ...data,
                isValidConfirmPassword: false,
                confirmPasswordErrorText: 'Passwords do not match'
            })
        }
        else {
            setData({
                ...data,
                isValidConfirmPassword: true,
                confirmPasswordErrorText: ''

            })
        }
    }

    const checkPhoneNumberExits = async () => {

        setData({
            ...data,
            isLoading: true
        })

        if (data.userType === "") {
            setData({
                ...data,
                isValidUserType: false,
                userTypeErrorText: 'Please Select User Type'
            })
        }
        else if (data.phoneNumber.trim().length === 0) {
            setData({
                ...data,
                isValidPhoneNumber: false,
                phoneNumberErrorText: 'Enter your Phone Number'
            })
        }
        else if (!myanmarPhoneNumber.isValidMMPhoneNumber(data.phoneNumber)) {
            setData({
                ...data,
                isValidPhoneNumber: false,
                phoneNumberErrorText: 'Enter Valid Phone Number'
            })
        }
        else if (data.password.trim().length === 0) {
            setData({
                ...data,
                isValidPassword: false,
                passwordErrorText: 'Enter your password'
            })
        }
        else if (data.confirmPassword.trim().length === 0) {
            setData({
                ...data,
                isValidConfirmPassword: false,
                confirmPasswordErrorText: 'Please Repeat your password'
            })
        }
        else if (data.password !== data.confirmPassword) {
            setData({
                ...data,
                isValidConfirmPassword: false,
                confirmPasswordErrorText: 'Passwords do not match'
            })
        }
        else {
            let phoneNumber = data.phoneNumber;
            let userType = data.userType;
            const data_values = {
                'phoneNumber': phoneNumber,
                'userType': userType
            };

            const config = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data_values)
            };

            const path = userUrl + '/checkPhNumber';

            try {
                // if (data.isValidUserType && data.isValidPhoneNumber && data.isValidPassword && data.isValidConfirmPassword) {
                const response = await fetch(path, config);

                if (response.status === 409) {
                    setData({
                        ...data,
                        isValidPhoneNumber: false,
                        isLoading: false,
                        phoneNumberErrorText: 'Phone Number Already Exists'
                    })
                }
                else if (response.status === 200) {
                    setData({
                        ...data,
                        isLoading: false,
                        isValidPhoneNumber: true,
                        phoneNumberErrorText: ''
                    });

                    setShow(true);


                }

                else {
                    setData({
                        ...data,
                        isLoading: false,
                        isValidPhoneNumber: false,
                        phoneNumberErrorText: 'Something went wrong. Please Try Again.'
                    })
                }

            }

            //else {
            // setData({
            //     ...data,
            //     isLoading: false,
            //     errorText: 'Something went wrong. Please Try Again.For sure'
            // })
            // }

            // }
            catch (err) {
                console.log(err);
                setData({
                    ...data,
                    errorText: 'No Internet Connection',
                    isLoading: false
                })
            }

        }

    }

    return (
        <KeyboardAwareScrollView enableOnAndroid>
            <View style={styles.signup_wrapper}>
                <Center>
                    <Image style={styles.logo_image} source={Logo} alt="icon-image" size={'xl'} />

                    <View style={styles.form_container}>
                        <FormControl isInvalid={!data.isValidUserType}>
                            <VStack alignItems="center" space={4}>
                                <Select
                                    minWidth={350}
                                    selectedValue={data.userType}
                                    accessibilityLabel="Select User Type"
                                    placeholder="Select User Type"
                                    placeholderTextColor='#36454F'
                                    variant="underlined"
                                    onValueChange={(value) => handleUserTypeChange(value)}
                                    onEndEditing={(e) => handleValidUserType(e.nativeEvent.text)}
                                    _selectedItem={{
                                        endIcon: <CheckIcon size={4} />,
                                    }}
                                >
                                    <Select.Item label="Farmer" value="Farmer" />
                                    <Select.Item label="Middleman" value="Middleman" />
                                </Select>
                            </VStack>
                            {
                                !data.isValidUserType ? <Text style={styles.errorText}>{data.userTypeErrorText}</Text> : null
                            }

                        </FormControl>
                        <FormControl isInvalid={!data.isValidPhoneNumber}>
                            <Input
                                style={styles.input}
                                placeholder="Phone Number"
                                placeholderTextColor='#36454F'
                                variant="underlined"
                                minWidth={350}
                                keyboardType="phone-pad"
                                _focus={{ borderColor: "#369154" }}
                                onChangeText={(val) => handlePhoneNumberChange(val)}
                                onEndEditing={(e) => handleValidPhoneNumber(e.nativeEvent.text)}

                            />
                            {
                                !data.isValidPhoneNumber ? <Text style={styles.errorText}>{data.phoneNumberErrorText}</Text> : null
                            }
                        </FormControl>
                        <FormControl isInvalid={!data.isValidPassword}>
                            <Input
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor='#36454F'
                                variant="underlined"
                                minWidth={350}
                                secureTextEntry
                                _focus={{ borderColor: "#369154" }}
                                onChangeText={(val) => handlePasswordChange(val)}
                                onEndEditing={(e) => handleValidPassword(e.nativeEvent.text)}
                            />
                            {
                                !data.isValidPassword ? <Text style={styles.errorText}>{data.passwordErrorText}</Text> : null
                            }

                        </FormControl>
                        <FormControl isInvalid={!data.isValidConfirmPassword}>
                            <Input
                                style={styles.input}
                                placeholder="Confirm Password"
                                placeholderTextColor='#36454F'
                                variant="underlined"
                                minWidth={350}
                                secureTextEntry
                                _focus={{ borderColor: "#369154" }}
                                onChangeText={(val) => handleConfirmPasswordChange(val)}
                                onEndEditing={(e) => handleValidConfirmPassword(e.nativeEvent.text)}
                            />
                            {
                                !data.isValidConfirmPassword ? <Text style={styles.errorText}>{data.confirmPasswordErrorText}</Text> : null
                            }

                            {
                                data.errorText && data.errorText.length > 0 ? <Text style={styles.errorText}>{data.errorText}</Text> : null
                            }
                        </FormControl>


                        <Button
                            isLoading={data.isLoading}
                            onPress={() => checkPhoneNumberExits()}
                            style={styles.button}>
                            Next
                        </Button>
                        <View style={styles.have_account}>
                            <Text style={styles.btn_font}>
                                Already have an account? <Text onPress={() => navigation.navigate('SignIn')} style={styles.signin_link}>Sign in here</Text>
                            </Text>
                        </View>
                    </View>


                </Center>
            </View>
            <UserDetailModal param={data} show={show} setShow={setShow} />

        </KeyboardAwareScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'

    },
    signup_wrapper: {
        marginTop: 60,
        fontFamily: 'Roboto'
    },
    logo_image: {
        width: 220,
        height: 150
    },
    form_container: {
        marginTop: 70
    },
    button: {
        backgroundColor: '#369154',
        marginTop: 30,
        marginHorizontal: Platform.OS === 'android' ? 10 : 0,

    },
    btn_font: {
        fontSize: 15,
        marginTop: 6
    },
    signin_link: {
        fontFamily: 'Roboto-bold'
    },
    errorText: {
        color: '#ff0000',
        fontSize: 13,
        marginLeft: 10,
        marginTop: 5
    },
    have_account: {
        marginLeft: Platform.OS === 'android' ? 10 : 0,
        marginTop: 8
    }

})


export default SignupScreen;