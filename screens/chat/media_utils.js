
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';



export const chooseFromGallery = async () => {
    if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.cancelled) {
            return result;
        }

    }
}

export const takePicture = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
        return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
        return result;
    }

}