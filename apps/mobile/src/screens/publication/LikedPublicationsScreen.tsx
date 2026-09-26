import React, {
    useCallback,
    useState,
} from "react";

import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
    router,
    useFocusEffect,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import {
    geAllPublicationsLiked,
    likePublication,
    unlikePublication,
} from "@niyya/api";

import { Publication } from "@niyya/types";

import { colors } from "@/src/theme";

import { useAuthStore } from "@/src/store/authStore";

import { PublicationList } from "@/src/components/profile/PublicationList";

export const LikedPublicationsScreen = () => {
    const accessToken =
        useAuthStore(
            (state) =>
                state.accessToken,
        );

    const [
        publications,
        setPublications,
    ] = useState<Publication[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        likingPublicationIds,
        setLikingPublicationIds,
    ] = useState<number[]>([]);

    const loadPublications =
        useCallback(
            async (
                isRefresh = false,
            ) => {
                if (!accessToken) {
                    setLoading(false);
                    return;
                }

                try {
                    if (isRefresh) {
                        setRefreshing(true);
                    } else {
                        setLoading(true);
                    }

                    const response =
                        await geAllPublicationsLiked(
                            accessToken,
                        );

                    setPublications(
                        response.results,
                    );
                } catch (error) {
                    console.error(
                        "Erreur lors du chargement des publications aimées :",
                        error,
                    );
                } finally {
                    if (isRefresh) {
                        setRefreshing(
                            false,
                        );
                    } else {
                        setLoading(false);
                    }
                }
            },
            [accessToken],
        );

    useFocusEffect(
        useCallback(() => {
            loadPublications();
        }, [loadPublications]),
    );

    const handleLike = async (
        publication: Publication,
    ) => {
        if (!accessToken) {
            return;
        }

        if (
            likingPublicationIds.includes(
                publication.id,
            )
        ) {
            return;
        }

        const wasLiked =
            publication.is_liked;

        const previousLikeCount =
            publication.like_count;

        /*
         * Mise à jour optimiste.
         */
        setPublications(
            (current) =>
                current.map(
                    (item) =>
                        item.id ===
                        publication.id
                            ? {
                                ...item,
                                is_liked:
                                    !wasLiked,
                                like_count:
                                    wasLiked
                                        ? Math.max(
                                            0,
                                            previousLikeCount -
                                            1,
                                        )
                                        : previousLikeCount +
                                        1,
                            }
                            : item,
                ),
        );

        setLikingPublicationIds(
            (current) => [
                ...current,
                publication.id,
            ],
        );

        try {
            if (wasLiked) {
                await unlikePublication(
                    accessToken,
                    publication.id,
                );
            } else {
                await likePublication(
                    accessToken,
                    publication.id,
                );
            }

            /*
             * Si on vient de retirer le like,
             * la publication ne doit plus apparaître
             * dans "Mes publications aimées".
             */
            if (wasLiked) {
                setPublications(
                    (current) =>
                        current.filter(
                            (item) =>
                                item.id !==
                                publication.id,
                        ),
                );
            }
        } catch (error) {
            console.error(
                "Erreur lors de la modification du like :",
                error,
            );

            /*
             * Rollback si l'API échoue.
             */
            setPublications(
                (current) =>
                    current.map(
                        (item) =>
                            item.id ===
                            publication.id
                                ? {
                                    ...item,
                                    is_liked:
                                    wasLiked,
                                    like_count:
                                    previousLikeCount,
                                }
                                : item,
                    ),
            );
        } finally {
            setLikingPublicationIds(
                (current) =>
                    current.filter(
                        (id) =>
                            id !==
                            publication.id,
                    ),
            );
        }
    };

    const handlePublicationPress = (
        publication: Publication,
    ) => {
        router.push(
            `/publications/${publication.id}`,
        );
    };

    if (loading) {
        return (
            <SafeAreaView
                style={styles.container}
            >
                <View
                    style={styles.header}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={
                            colors.black
                        }
                        onPress={() =>
                            router.back()
                        }
                    />

                    <Text
                        style={
                            styles.headerTitle
                        }
                    >
                        Mon activité
                    </Text>

                    <View
                        style={
                            styles.headerSpacer
                        }
                    />
                </View>

                <View
                    style={
                        styles.loading
                    }
                >
                    <ActivityIndicator
                        size="large"
                        color={
                            colors.primary
                        }
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={styles.container}
        >
            <View
                style={styles.header}
            >
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color={colors.black}
                    onPress={() =>
                        router.back()
                    }
                />

                <Text
                    style={
                        styles.headerTitle
                    }
                >
                    Mon activité
                </Text>

                <View
                    style={
                        styles.headerSpacer
                    }
                />
            </View>

            {publications.length ===
            0 ? (
                <View
                    style={
                        styles.emptyContainer
                    }
                >
                    <View
                        style={
                            styles.emptyIcon
                        }
                    >
                        <Ionicons
                            name="heart-outline"
                            size={34}
                            color={
                                colors.primary
                            }
                        />
                    </View>

                    <Text
                        style={
                            styles.emptyTitle
                        }
                    >
                        Aucune publication
                        aimée
                    </Text>

                    <Text
                        style={
                            styles.emptyText
                        }
                    >
                        Les publications
                        que vous aimez
                        apparaîtront ici.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={publications}
                    keyExtractor={(
                        item,
                    ) =>
                        item.id.toString()
                    }
                    contentContainerStyle={
                        styles.listContent
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={
                                refreshing
                            }
                            onRefresh={() =>
                                loadPublications(
                                    true,
                                )
                            }
                            tintColor={
                                colors.primary
                            }
                        />
                    }
                    renderItem={({
                                     item,
                                 }) => (
                        <PublicationList
                            posts={[item]}
                            onPress={
                                handlePublicationPress
                            }
                            onLike={
                                handleLike
                            }
                        />
                    )}
                    showsVerticalScrollIndicator={
                        false
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
        colors.white,
    },

    header: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor:
            "#EEEEEE",
        backgroundColor:
        colors.white,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.black,
    },

    headerSpacer: {
        width: 24,
    },

    listContent: {
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 32,
    },

    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent:
            "center",
    },

    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent:
            "center",
        paddingHorizontal: 40,
    },

    emptyIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: "center",
        justifyContent:
            "center",
        backgroundColor:
            "#FBF5E7",
        marginBottom: 20,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.black,
        textAlign: "center",
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 14,
        lineHeight: 21,
        color: "#888",
        textAlign: "center",
        maxWidth: 300,
    },
});