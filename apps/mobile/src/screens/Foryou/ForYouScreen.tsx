import React, {useCallback, useState,} from "react";

import {ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View,} from "react-native";
import {PublicationCard} from "@/src/components/publication/PublicationCard";
import {SafeAreaView} from "react-native-safe-area-context";

import {router} from "expo-router";

import {Ionicons} from "@expo/vector-icons";

import {colors} from "@/src/theme";

import {geAllPublications, likePublication, unlikePublication,} from "@niyya/api";

import {Publication,} from "@niyya/types";

import {useAuthStore,} from "@/src/store/authStore";


/*
 * Écran Pour Toi
 */
export const ForYouScreen = () => {
    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const [publications, setPublications] =
        useState<Publication[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);


    /*
     * Chargement des publications
     */
    const loadPublications = useCallback(
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
                    await geAllPublications(
                        accessToken,
                    );

                setPublications(
                    response.results,
                );
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des publications :",
                    error,
                );
            } finally {
                if (isRefresh) {
                    setRefreshing(false);
                } else {
                    setLoading(false);
                }
            }
        },
        [accessToken],
    );


    /*
     * Premier chargement
     */
    React.useEffect(() => {
        loadPublications();
    }, [loadPublications]);


    /*
     * Ouverture d'une publication
     */
    const handlePublicationPress = (
        publication: Publication,
    ) => {
        router.push(
            `/publications/${publication.id}`,
        );
    };


    /*
     * Création d'une publication
     */
    const handleCreatePublication = () => {
        router.push(
            "/new-publication",
        );
    };

    const [likingPublicationIds, setLikingPublicationIds] =
        useState<number[]>([]);

    const handleLike = async (
        publication: Publication,
    ) => {
        if (!accessToken) {
            return;
        }

        // Empêche plusieurs clics pendant la requête
        if (likingPublicationIds.includes(publication.id)) {
            return;
        }

        const wasLiked = publication.is_liked;
        const previousLikeCount = publication.like_count;

        // Ajoute la publication aux requêtes en cours
        setLikingPublicationIds((current) => [
            ...current,
            publication.id,
        ]);

        /*
         * Mise à jour immédiate de l'interface
         */
        setPublications((current) =>
            current.map((item) =>
                item.id === publication.id
                    ? {
                        ...item,
                        is_liked: !wasLiked,
                        like_count: wasLiked
                            ? Math.max(0, previousLikeCount - 1)
                            : previousLikeCount + 1,
                    }
                    : item,
            ),
        );

        try {
            /*
             * Requête backend
             */
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
        } catch (error) {
            console.error(
                "Erreur lors de la modification du like :",
                error,
            );

            /*
             * Le backend a échoué :
             * on restaure l'ancien état.
             */
            setPublications((current) =>
                current.map((item) =>
                    item.id === publication.id
                        ? {
                            ...item,
                            is_liked: wasLiked,
                            like_count: previousLikeCount,
                        }
                        : item,
                ),
            );
        } finally {
            /*
             * La requête est terminée
             */
            setLikingPublicationIds((current) =>
                current.filter(
                    (id) => id !== publication.id,
                ),
            );
        }
    };

    /*
     * Chargement
     */
    if (loading) {
        return (
            <SafeAreaView
                style={styles.container}
            >
                <View style={styles.loading}>
                    <ActivityIndicator
                        size="large"
                        color={colors.primary}
                    />
                </View>
            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView
            style={styles.container}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text
                    style={styles.logo}
                >
                    NiWo
                </Text>

                <Pressable
                    style={styles.notificationButton}
                    onPress={() => {
                        // TODO: écran notifications
                    }}
                    hitSlop={10}
                >
                    <Ionicons
                        name="notifications-outline"
                        size={25}
                        color={colors.black}
                    />

                    {/* Badge notifications */}
                    <View
                        style={
                            styles.notificationBadge
                        }
                    />
                </Pressable>
            </View>


            {/* Titre */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    Pour toi
                </Text>

                <Text
                    style={
                        styles.subtitle
                    }
                >
                    Découvre les publications de la communauté.
                </Text>
            </View>


            {/* Feed */}
            <FlatList
                data={publications}
                keyExtractor={(item) =>
                    item.id.toString()
                }
                renderItem={({ item }) => (
                    <PublicationCard
                        publication={item}
                        onPress={() =>
                            handlePublicationPress(
                                item,
                            )
                        }
                        onLike={() =>
                            handleLike(item)
                        }
                    />
                )}
                contentContainerStyle={[
                    styles.listContent,
                    publications.length === 0 &&
                        styles.emptyList,
                ]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
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
                ListEmptyComponent={
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
                                name="sparkles-outline"
                                size={32}
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
                            Rien à découvrir pour le moment
                        </Text>

                        <Text
                            style={
                                styles.emptyText
                            }
                        >
                            Les nouvelles publications
                            apparaîtront ici.
                        </Text>
                    </View>
                }
            />


            {/* Bouton créer */}
            <Pressable
                style={({ pressed }) => [
                    styles.floatingButton,
                    pressed &&
                        styles.floatingButtonPressed,
                ]}
                onPress={
                    handleCreatePublication
                }
            >
                <Ionicons
                    name="add"
                    size={30}
                    color={colors.white}
                />
            </Pressable>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },

    /*
     * Header
     */
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 8,
    },

    logo: {
        fontSize: 27,
        fontWeight: "800",
        color: colors.primary,
        letterSpacing: 0.5,
    },

    notificationButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },

    notificationBadge: {
        position: "absolute",
        top: 9,
        right: 9,
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#D9534F",
    },

    interactionContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 18,
    },

    likeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    likeText: {
        fontSize: 12,
        color: "#888",
        marginLeft: 6,
    },

    /*
     * Titre
     */
    titleContainer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 12,
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        color: colors.black,
    },

    subtitle: {
        fontSize: 14,
        color: "#888",
        marginTop: 5,
    },

    /*
     * Liste
     */
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 110,
    },

    emptyList: {
        flexGrow: 1,
    },

    /*
     * Publication
     */
    card: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: "#ECECEC",
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
    },

    cardPressed: {
        opacity: 0.7,
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    authorContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    authorCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#F5E9C8",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 11,
    },

    authorInitial: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.primary,
    },

    username: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.black,
    },

    date: {
        fontSize: 12,
        color: "#999",
        marginTop: 3,
    },

    caption: {
        fontSize: 16,
        lineHeight: 25,
        color: colors.black,
        marginTop: 16,
        marginBottom: 16,
    },

    cardFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
    },

    commentContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    commentText: {
        fontSize: 12,
        color: "#888",
        marginLeft: 6,
    },

    /*
     * Empty state
     */
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
    },

    emptyIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#FAF4E5",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.black,
        textAlign: "center",
    },

    emptyText: {
        fontSize: 14,
        lineHeight: 21,
        color: "#888",
        textAlign: "center",
        marginTop: 8,
    },

    /*
     * Bouton flottant
     */
    floatingButton: {
        position: "absolute",
        right: 24,
        bottom: 24,
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",

        elevation: 5,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },

    floatingButtonPressed: {
        opacity: 0.75,
    },

    /*
     * Loading
     */
    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
