import React, {
    useState,
} from "react";

import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    colors,
} from "@/src/theme";

interface Props {
    username: string;
    onEditProfile: () => void;
    onSettings: () => void;
}

export const ProfileHeader = ({
                                  username,
                                  onEditProfile,
                                  onSettings,
                              }: Props) => {
    const [
        menuVisible,
        setMenuVisible,
    ] = useState(false);


    const handleEditProfile = () => {
        setMenuVisible(false);

        onEditProfile();
    };


    const handleSettings = () => {
        setMenuVisible(false);

        onSettings();
    };


    return (
        <>
            <View style={styles.container}>
                <Text style={styles.username}>
                    {username}
                </Text>

                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() =>
                        setMenuVisible(true)
                    }
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="menu-outline"
                        size={30}
                        color={colors.black}
                    />
                </TouchableOpacity>
            </View>


            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setMenuVisible(false)
                }
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() =>
                        setMenuVisible(false)
                    }
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.menu}
                    >
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={
                                handleEditProfile
                            }
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color={colors.black}
                            />

                            <Text
                                style={
                                    styles.menuText
                                }
                            >
                                Modifier le profil
                            </Text>
                        </TouchableOpacity>


                        <View
                            style={
                                styles.separator
                            }
                        />


                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={
                                handleSettings
                            }
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="settings-outline"
                                size={20}
                                color={colors.black}
                            />

                            <Text
                                style={
                                    styles.menuText
                                }
                            >
                                Paramètres
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </>
    );
};


const styles =
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
        },

        username: {
            fontSize: 24,
            fontWeight: "700",
            color: colors.black,
        },

        menuButton: {
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
        },

        overlay: {
            flex: 1,
            backgroundColor:
                "rgba(0, 0, 0, 0.15)",
        },

        menu: {
            position: "absolute",
            top: 70,
            right: 16,
            minWidth: 220,
            backgroundColor: colors.white,
            borderRadius: 14,
            paddingVertical: 6,

            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 12,

            elevation: 6,
        },

        menuItem: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 14,
        },

        menuText: {
            marginLeft: 12,
            fontSize: 15,
            color: colors.black,
        },

        separator: {
            height: 1,
            backgroundColor: "#EEEEEE",
            marginHorizontal: 16,
        },
    });