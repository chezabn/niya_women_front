import * as ImagePicker from "expo-image-picker";

export const useImagePicker = () => {
    const pickFromGallery = async () => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            throw new Error("Permission galerie refusée");
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.8,
            allowsEditing: true,
        });

        if (result.canceled) {
            return null;
        }

        return result.assets[0];
    };

    const takePhoto = async () => {
        const permission =
            await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            throw new Error("Permission caméra refusée");
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            quality: 0.8,
            allowsEditing: true,
        });

        if (result.canceled) {
            return null;
        }

        return result.assets[0];
    };

    return {
        pickFromGallery,
        takePhoto,
    };
};