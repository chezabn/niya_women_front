import {
    SafeAreaView,
} from "react-native-safe-area-context";

import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "@/src/store/authStore";
import { colors } from "@/src/theme";

const suggestedUsers = [
    {
        id: 1,
        username: "sarah",
    },
    {
        id: 2,
        username: "emma",
    },
    {
        id: 3,
        username: "camille",
    },
];

export default function HomeScreen() {
    const user = useAuthStore(
        (state) => state.user,
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={suggestedUsers}
                keyExtractor={(item) =>
                    item.id.toString()
                }
                ListHeaderComponent={
                    <>
                        <View style={styles.header}>
                            <Text style={styles.logo}>
                                NiWo
                            </Text>

                            <TouchableOpacity>
                                <Ionicons
                                    name="notifications-outline"
                                    size={24}
                                    color={colors.text}
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.welcome}>
                            Bonjour{" "}
                            {user?.first_name ||
                                user?.username} 👋
                        </Text>

                        <Text style={styles.subtitle}>
                            Découvrez de nouvelles femmes
                            inspirantes aujourd'hui.
                        </Text>

                        <Text style={styles.sectionTitle}>
                            Suggestions
                        </Text>
                    </>
                }
                renderItem={({ item }) => (
                    <View style={styles.userCard}>
                        <View>
                            <Text
                                style={
                                    styles.username
                                }
                            >
                                @{item.username}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={
                                styles.followButton
                            }
                        >
                            <Text
                                style={
                                    styles.followText
                                }
                            >
                                Suivre
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListFooterComponent={
                    <>
                        <Text
                            style={
                                styles.sectionTitle
                            }
                        >
                            Publications
                        </Text>

                        <View
                            style={
                                styles.placeholder
                            }
                        >
                            <Ionicons
                                name="newspaper-outline"
                                size={48}
                                color="#999"
                            />

                            <Text
                                style={
                                    styles.placeholderText
                                }
                            >
                                Les publications
                                arriveront bientôt
                            </Text>
                        </View>
                    </>
                }
                contentContainerStyle={
                    styles.content
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },

    content: {
        padding: 20,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },

    logo: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.primary,
    },

    welcome: {
        fontSize: 26,
        fontWeight: "700",
    },

    subtitle: {
        fontSize: 15,
        color: colors.textSecondary,
        marginTop: 6,
        marginBottom: 24,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
        marginTop: 12,
    },

    userCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        backgroundColor: "#F8F8F8",
        borderRadius: 12,

        padding: 16,
        marginBottom: 12,
    },

    username: {
        fontSize: 16,
        fontWeight: "600",
    },

    followButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },

    followText: {
        color: colors.white,
        fontWeight: "600",
    },

    placeholder: {
        alignItems: "center",
        justifyContent: "center",

        paddingVertical: 50,
    },

    placeholderText: {
        marginTop: 12,
        color: colors.textSecondary,
        textAlign: "center",
    },
});