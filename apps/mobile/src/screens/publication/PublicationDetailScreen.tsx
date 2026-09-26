import React, {
    useCallback,
    useState,
} from "react";

import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
    router,
    useFocusEffect,
    useLocalSearchParams,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/src/theme";
import { Button } from "@/src/components/ui/Button";

import { Publication } from "@niyya/types";

import {
    getMyPublication,
    deletePublication,
    likePublication,
    unlikePublication,
} from "@niyya/api";

import { useAuthStore } from "@/src/store/authStore";

import { CommentList } from "@/src/components/publication/CommentList";

const getPublicationById = async (
    id: string,
    accessToken: string,
): Promise<Publication> => {
    return getMyPublication(
        accessToken,
        Number(id),
    );
};

const deletePublicationById = async (
    id: number,
    accessToken: string,
): Promise<void> => {
    await deletePublication(
        accessToken,
        id,
    );
};

export const PublicationDetailScreen = () => {
    const { id } =
        useLocalSearchParams<{
            id: string;
        }>();

    const accessToken =
        useAuthStore(
            (state) =>
                state.accessToken,
        );

    const user =
        useAuthStore(
            (state) =>
                state.user,
        );

    const [
        publication,
        setPublication,
    ] = useState<
        Publication | null
    >(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        liking,
        setLiking,
    ] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const loadPublication =
                async () => {
                    if (
                        !id ||
                        !accessToken
                    ) {
                        setLoading(false);
                        return;
                    }

                    try {
                        setLoading(true);

                        const data =
                            await getPublicationById(
                                id,
                                accessToken,
                            );

                        setPublication(data);
                    } catch (error) {
                        console.error(
                            "Erreur lors du chargement de la publication :",
                            error,
                        );
                    } finally {
                        setLoading(false);
                    }
                };

            loadPublication();
        }, [
            id,
            accessToken,
        ]),
    );

    const isOwner =
        !!user &&
        !!publication &&
        user.id ===
        publication.author.id;

    /**
     * Like / unlike optimiste.
     *
     * On met immédiatement à jour l'interface,
     * puis on synchronise avec le backend.
     *
     * En cas d'erreur, on restaure l'état précédent.
     */
    const handleLike = async () => {
        if (
            !publication ||
            !accessToken ||
            liking
        ) {
            return;
        }

        const wasLiked =
            publication.is_liked;

        const previousLikeCount =
            publication.like_count;

        // Mise à jour immédiate de l'interface.
        setPublication(
            (current) => {
                if (!current) {
                    return current;
                }

                return {
                    ...current,
                    is_liked: !wasLiked,
                    like_count: wasLiked
                        ? Math.max(
                            0,
                            previousLikeCount - 1,
                        )
                        : previousLikeCount + 1,
                };
            },
        );

        setLiking(true);

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
        } catch (error) {
            console.error(
                "Erreur lors de la modification du like :",
                error,
            );

            // Rollback si l'API échoue.
            setPublication(
                (current) => {
                    if (!current) {
                        return current;
                    }

                    return {
                        ...current,
                        is_liked: wasLiked,
                        like_count:
                        previousLikeCount,
                    };
                },
            );
        } finally {
            setLiking(false);
        }
    };

    const handleDelete = () => {
        if (
            !publication ||
            !accessToken ||
            !isOwner
        ) {
            return;
        }

        Alert.alert(
            "Supprimer la publication",
            "Voulez-vous vraiment supprimer cette publication ?",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deletePublicationById(
                                publication.id,
                                accessToken,
                            );

                            router.back();
                        } catch (error) {
                            console.error(
                                "Erreur lors de la suppression de la publication :",
                                error,
                            );

                            Alert.alert(
                                "Erreur",
                                "Impossible de supprimer cette publication.",
                            );
                        }
                    },
                },
            ],
        );
    };

    const handleEdit = () => {
        if (
            !publication ||
            !isOwner
        ) {
            return;
        }

        router.push(
            `/publications/${publication.id}/edit`,
        );
    };

    if (loading) {
        return (
            <SafeAreaView
                style={styles.container}
            >
                <View
                    style={styles.loading}
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

    if (!publication) {
        return (
            <SafeAreaView
                style={styles.container}
            >
                <View
                    style={styles.loading}
                >
                    <Ionicons
                        name="document-text-outline"
                        size={42}
                        color="#B5B5B5"
                    />

                    <Text
                        style={
                            styles.notFoundTitle
                        }
                    >
                        Publication
                        introuvable
                    </Text>

                    <Text
                        style={
                            styles.notFoundText
                        }
                    >
                        Cette publication
                        n'existe plus ou
                        n'est plus
                        accessible.
                    </Text>

                    <Pressable
                        onPress={() =>
                            router.back()
                        }
                        style={
                            styles.backLink
                        }
                    >
                        <Text
                            style={
                                styles.backLinkText
                            }
                        >
                            Retour
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    const authorInitial =
        publication.author.username
            .charAt(0)
            .toUpperCase();

    return (
        <SafeAreaView
            style={styles.container}
        >
            {/* Header */}
            <View
                style={styles.header}
            >
                <Pressable
                    style={
                        styles.headerButton
                    }
                    onPress={() =>
                        router.back()
                    }
                    hitSlop={8}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={
                            colors.black
                        }
                    />
                </Pressable>

                <Text
                    style={styles.headerTitle}
                >
                    Publication
                </Text>

                {isOwner ? (
                    <Pressable
                        style={
                            styles.headerButton
                        }
                        onPress={
                            handleDelete
                        }
                        hitSlop={8}
                    >
                        <Ionicons
                            name="trash-outline"
                            size={22}
                            color="#D9534F"
                        />
                    </Pressable>
                ) : (
                    <View
                        style={
                            styles.headerButton
                        }
                    />
                )}
            </View>

            <ScrollView
                contentContainerStyle={
                    styles.content
                }
                showsVerticalScrollIndicator={
                    false
                }
                keyboardShouldPersistTaps="handled"
            >
                {/* Author */}
                <View
                    style={
                        styles.authorContainer
                    }
                >
                    <View
                        style={
                            styles.authorAvatar
                        }
                    >
                        <Text
                            style={
                                styles.authorAvatarText
                            }
                        >
                            {authorInitial}
                        </Text>
                    </View>

                    <View
                        style={
                            styles.authorInfo
                        }
                    >
                        <Text
                            style={
                                styles.username
                            }
                        >
                            {
                                publication
                                    .author
                                    .username
                            }
                        </Text>

                        <Text
                            style={
                                styles.date
                            }
                        >
                            {formatDate(
                                publication.created_at,
                            )}
                        </Text>
                    </View>
                </View>

                {/* Publication */}
                <View
                    style={
                        styles.publicationCard
                    }
                >
                    {publication.caption ? (
                        <Text
                            style={
                                styles.caption
                            }
                        >
                            {
                                publication.caption
                            }
                        </Text>
                    ) : (
                        <Text
                            style={
                                styles.emptyCaption
                            }
                        >
                            Cette publication
                            ne contient pas
                            de texte.
                        </Text>
                    )}

                    {publication.is_edited && (
                        <View
                            style={
                                styles.editedBadge
                            }
                        >
                            <Ionicons
                                name="create-outline"
                                size={14}
                                color={
                                    colors.primary
                                }
                            />

                            <Text
                                style={
                                    styles.editedText
                                }
                            >
                                Modifiée
                            </Text>
                        </View>
                    )}
                </View>

                {/* Interactions */}
                <View
                    style={
                        styles.interactions
                    }
                >
                    <Pressable
                        style={
                            styles.likeButton
                        }
                        onPress={
                            handleLike
                        }
                        disabled={liking}
                        hitSlop={8}
                    >
                        {liking ? (
                            <ActivityIndicator
                                size="small"
                                color={
                                    publication.is_liked
                                        ? "#E88A9A"
                                        : "#777"
                                }
                            />
                        ) : (
                            <Ionicons
                                name={
                                    publication.is_liked
                                        ? "heart"
                                        : "heart-outline"
                                }
                                size={25}
                                color={
                                    publication.is_liked
                                        ? "#E88A9A"
                                        : "#777"
                                }
                            />
                        )}

                        <Text
                            style={[
                                styles.likeCount,
                                publication.is_liked &&
                                styles.likeCountActive,
                            ]}
                        >
                            {publication.like_count}
                        </Text>

                        <Text
                            style={
                                styles.likeLabel
                            }
                        >
                            {publication.like_count ===
                            1
                                ? "J'aime"
                                : "J'aime"}
                        </Text>
                    </Pressable>

                    <View
                        style={
                            styles.commentStatus
                        }
                    >
                        <Ionicons
                            name="chatbubble-outline"
                            size={21}
                            color="#888"
                        />

                        <Text
                            style={
                                styles.commentStatusText
                            }
                        >
                            {publication
                                .comments_enabled
                                ? "Commentaires"
                                : "Commentaires désactivés"}
                        </Text>
                    </View>
                </View>

                {/* Divider */}
                <View
                    style={styles.divider}
                />

                {/* Comments */}
                {publication.comments_enabled ? (
                    <View
                        style={
                            styles.commentsSection
                        }
                    >
                        <Text
                            style={
                                styles.sectionTitle
                            }
                        >
                            Commentaires
                        </Text>

                        <CommentList
                            publicationId={
                                publication.id
                            }
                            publicationAuthorId={
                                publication
                                    .author
                                    .id
                            }
                        />
                    </View>
                ) : (
                    <View
                        style={
                            styles.commentsDisabled
                        }
                    >
                        <Ionicons
                            name="chatbubble-ellipses-outline"
                            size={24}
                            color="#B0B0B0"
                        />

                        <Text
                            style={
                                styles.commentsDisabledText
                            }
                        >
                            Les commentaires
                            sont désactivés
                            pour cette
                            publication.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Edit button */}
            {isOwner && (
                <View
                    style={styles.bottom}
                >
                    <Button
                        text="Modifier la publication"
                        onPress={
                            handleEdit
                        }
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

const formatDate = (
    date: string,
) => {
    return new Date(
        date,
    ).toLocaleDateString(
        "fr-FR",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        },
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
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor:
            "#F0F0F0",
        backgroundColor:
        colors.white,
    },

    headerButton: {
        width: 42,
        height: 42,
        alignItems: "center",
        justifyContent:
            "center",
    },

    headerTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.black,
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 22,
        paddingBottom: 40,
    },

    authorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 22,
    },

    authorAvatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor:
        colors.primary,
        alignItems: "center",
        justifyContent:
            "center",
        marginRight: 12,
    },

    authorAvatarText: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.white,
    },

    authorInfo: {
        flex: 1,
    },

    username: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.black,
    },

    date: {
        fontSize: 13,
        color: "#8A8A8A",
        marginTop: 3,
    },

    publicationCard: {
        backgroundColor:
            "#FAFAFA",
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: "#F0F0F0",
    },

    caption: {
        fontSize: 18,
        lineHeight: 28,
        color: colors.black,
    },

    emptyCaption: {
        fontSize: 15,
        fontStyle: "italic",
        lineHeight: 22,
        color: "#999",
    },

    editedBadge: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 18,
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 8,
        backgroundColor:
            "#FBF5E7",
    },

    editedText: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.primary,
        marginLeft: 5,
    },

    interactions: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:
            "space-between",
        paddingVertical: 18,
    },

    likeButton: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 36,
    },

    likeCount: {
        fontSize: 14,
        fontWeight: "700",
        color: "#777",
        marginLeft: 8,
    },

    likeCountActive: {
        color: "#E88A9A",
    },

    likeLabel: {
        fontSize: 13,
        color: "#888",
        marginLeft: 5,
    },

    commentStatus: {
        flexDirection: "row",
        alignItems: "center",
        maxWidth: "55%",
    },

    commentStatusText: {
        fontSize: 13,
        color: "#888",
        marginLeft: 7,
    },

    divider: {
        height: 1,
        backgroundColor:
            "#ECECEC",
        marginBottom: 20,
    },

    commentsSection: {
        paddingBottom: 20,
    },

    sectionTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.black,
        marginBottom: 14,
    },

    commentsDisabled: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 18,
        paddingHorizontal: 4,
    },

    commentsDisabledText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        color: "#999",
        marginLeft: 10,
    },

    bottom: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
        borderTopWidth: 1,
        borderTopColor:
            "#ECECEC",
        backgroundColor:
        colors.white,
    },

    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent:
            "center",
    },

    notFoundTitle: {
        marginTop: 14,
        fontSize: 18,
        fontWeight: "700",
        color: colors.black,
    },

    notFoundText: {
        marginTop: 6,
        fontSize: 14,
        lineHeight: 20,
        color: "#888",
        textAlign: "center",
        paddingHorizontal: 40,
    },

    backLink: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },

    backLinkText: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.primary,
    },
});