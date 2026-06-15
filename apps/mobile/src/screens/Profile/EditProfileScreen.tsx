import React, {useState} from "react";
import {ScrollView, StyleSheet, Text, View,} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {updateMe} from "@niyya/api";

import {Input} from "@/src/components/ui/Input";
import {Button} from "@/src/components/ui/Button";
import {colors} from "@/src/theme";

import {useAuthStore} from "@/src/store/authStore";
import {router} from "expo-router";

export const EditProfileScreen = () => {
    const user = useAuthStore(
        (state) => state.user,
    );

    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const setUser = useAuthStore(
        (state) => state.setUser,
    );

    const [firstName, setFirstName] = useState(
        user?.first_name ?? "",
    );

    const [lastName, setLastName] = useState(
        user?.last_name ?? "",
    );

    const [bio, setBio] = useState(
        user?.profile?.bio ?? "",
    );

    const handleSave = async () => {
        try {
            if (!accessToken) {
                return;
            }

            const updatedUser = await updateMe(
                {
                    first_name: firstName,
                    last_name: lastName,
                    bio,
                },
                accessToken,
            );

            setUser(updatedUser);

            router.replace("/profile");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>
                    Modifier mon profil
                </Text>

                <Input
                    placeholder="Prénom"
                    value={firstName}
                    onChangeText={setFirstName}
                />

                <Input
                    placeholder="Nom"
                    value={lastName}
                    onChangeText={setLastName}
                />

                <Input
                    placeholder="Adresse email"
                    editable={false}
                    style={{
                        backgroundColor: "#F3F4F6",
                        color: "#9CA3AF",
                    }}
                />

                <Input
                    placeholder="Bio"
                    value={bio}
                    onChangeText={setBio}
                    multiline
                />

                <View style={styles.buttonContainer}>
                    <Button
                        text="Enregistrer"
                        onPress={handleSave}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },

    content: {
        padding: 24,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 24,
        textAlign: "center",
    },

    buttonContainer: {
        marginTop: 24,
    },
});