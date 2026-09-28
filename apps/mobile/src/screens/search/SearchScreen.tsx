import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    router,
} from "expo-router";

import {
    SafeAreaView,
} from "react-native-safe-area-context";

import {
    Ionicons,
} from "@expo/vector-icons";

import {
    colors,
} from "@/src/theme";

import {
    useAuthStore,
} from "@/src/store/authStore";

import {
    searchUser,
} from "@niyya/api";

import {
    UserSearchResult,
} from "@niyya/types";


export default function SearchScreen() {
    const accessToken =
        useAuthStore(
            (state) => state.accessToken,
        );

    const [search, setSearch] =
        useState("");

    const [results, setResults] =
        useState<UserSearchResult[]>([]);

    const [loading, setLoading] =
        useState(false);


    const handleSearch =
        useCallback(
            async (value: string) => {
                if (!accessToken) {
                    return;
                }

                const query =
                    value.trim();

                if (query.length < 2) {
                    setResults([]);
                    return;
                }

                try {
                    setLoading(true);

                    const response =
                        await searchUser(
                            query,
                            accessToken,
                        );

                    setResults(
                        response.results,
                    );
                } catch (error) {
                    console.error(
                        "Erreur lors de la recherche des utilisatrices :",
                        error,
                    );

                    setResults([]);
                } finally {
                    setLoading(false);
                }
            },
            [accessToken],
        );


    useEffect(() => {
        const timeout =
            setTimeout(() => {
                handleSearch(search);
            }, 400);

        return () =>
            clearTimeout(timeout);
    }, [
        search,
        handleSearch,
    ]);


    const handleUserPress =
        (user: UserSearchResult) => {
            router.push(
                `/profile/${user.id}`,
            );
        };


    return (
        <SafeAreaView
            style={styles.container}
        >
            <View
                style={styles.header}
            >
                <Text
                    style={styles.title}
                >
                    Rechercher
                </Text>
            </View>


            <View
                style={styles.searchContainer}
            >
                <Ionicons
                    name="search"
                    size={22}
                    color={colors.textSecondary}
                />

                <TextInput
                    style={styles.input}
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Rechercher une utilisatrice..."
                    placeholderTextColor={
                        colors.textSecondary
                    }
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="search"
                />

                {search.length > 0 && (
                    <Pressable
                        onPress={() => {
                            setSearch("");
                            setResults([]);
                        }}
                    >
                        <Ionicons
                            name="close-circle"
                            size={20}
                            color={
                                colors.textSecondary
                            }
                        />
                    </Pressable>
                )}
            </View>


            {loading ? (
                <View
                    style={styles.center}
                >
                    <ActivityIndicator
                        size="small"
                        color={colors.primary}
                    />
                </View>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) =>
                        String(item.id)
                    }
                    contentContainerStyle={
                        results.length === 0
                            ? styles.emptyContainer
                            : styles.list
                    }
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.userRow}
                            onPress={() =>
                                handleUserPress(
                                    item,
                                )
                            }
                        >
                            <View
                                style={styles.avatar}
                            >
                                <Text
                                    style={
                                        styles.avatarText
                                    }
                                >
                                    {item.username
                                        .charAt(0)
                                        .toUpperCase()}
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.userInfo
                                }
                            >
                                <View
                                    style={
                                        styles.usernameRow
                                    }
                                >
                                    <Text
                                        style={
                                            styles.username
                                        }
                                    >
                                        @{item.username}
                                    </Text>

                                    {item.identity_verified && (
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={17}
                                            color={
                                                colors.primary
                                            }
                                        />
                                    )}
                                </View>
                            </View>

                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={
                                    colors.textSecondary
                                }
                            />
                        </Pressable>
                    )}
                    ListEmptyComponent={
                        search.trim().length < 2 ? (
                            <View>
                                <Ionicons
                                    name="search-outline"
                                    size={42}
                                    color={
                                        colors.textSecondary
                                    }
                                    style={
                                        styles.emptyIcon
                                    }
                                />

                                <Text
                                    style={
                                        styles.emptyTitle
                                    }
                                >
                                    Rechercher une utilisatrice
                                </Text>

                                <Text
                                    style={
                                        styles.emptyText
                                    }
                                >
                                    Saisissez au moins 2 caractères
                                    pour commencer votre recherche.
                                </Text>
                            </View>
                        ) : (
                            <View>
                                <Ionicons
                                    name="person-outline"
                                    size={42}
                                    color={
                                        colors.textSecondary
                                    }
                                    style={
                                        styles.emptyIcon
                                    }
                                />

                                <Text
                                    style={
                                        styles.emptyTitle
                                    }
                                >
                                    Aucune utilisatrice trouvée
                                </Text>

                                <Text
                                    style={
                                        styles.emptyText
                                    }
                                >
                                    Essayez avec un autre nom
                                    d'utilisateur.
                                </Text>
                            </View>
                        )
                    }
                />
            )}
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 16,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.text,
    },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 20,
        marginBottom: 16,
        paddingHorizontal: 14,
        height: 50,
        borderRadius: 14,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },

    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: colors.text,
    },

    list: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },

    userRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    avatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },

    avatarText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFFFFF",
    },

    userInfo: {
        flex: 1,
        marginLeft: 12,
    },

    usernameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    username: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
    },

    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    emptyContainer: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
    },

    emptyIcon: {
        alignSelf: "center",
        marginBottom: 12,
    },

    emptyTitle: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 8,
    },

    emptyText: {
        textAlign: "center",
        fontSize: 14,
        lineHeight: 21,
        color: colors.textSecondary,
    },
});