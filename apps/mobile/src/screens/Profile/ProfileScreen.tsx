import { useCallback, useState } from "react";

import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
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
    getMe,
    getMyPublications,
    likePublication,
    unlikePublication,
} from "@niyya/api";

import { Publication } from "@niyya/types";

import { colors } from "@/src/theme";

import { useAuthStore } from "@/src/store/authStore";

import { ProfileHeader } from "@/src/components/profile/ProfileHeader";
import { ProfileStats } from "@/src/components/profile/ProfileStats";
import { ProfileBio } from "@/src/components/profile/ProfileBio";
import { ProfileActionButtons } from "@/src/components/profile/ProfileActionButtons";
import { ProfileTabs } from "@/src/components/profile/ProfileTabs";
import { PublicationList } from "@/src/components/profile/PublicationList";

export const ProfileScreen = () => {
    const user = useAuthStore(
        (state) => state.user,
    );

    const accessToken = useAuthStore(
        (state) => state.accessToken,
    );

    const setUser = useAuthStore(
        (state) => state.setUser,
    );

    const [activeTab, setActiveTab] = useState<
        "posts" | "saved"
    >("posts");

    const [refreshing, setRefreshing] = useState(false);

    const [loading, setLoading] = useState(true);

    const [posts, setPosts] = useState<Publication[]>([]);

    const [
        likingPublicationIds,
        setLikingPublicationIds,
    ] = useState<number[]>([]);

    const handleEditProfile = () => {
        router.push("/profile/edit");
    };

    const handleJournal = () => {
        router.push("/journal");
    };

    const handleSettings = () => {
        router.push("/profile/settings");
    };

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

        const wasLiked = publication.is_liked;

        const previousLikeCount =
            publication.like_count;

        setLikingPublicationIds(
            (current) => [
                ...current,
                publication.id,
            ],
        );

        /*
         * Mise à jour optimiste
         */
        setPosts(
            (current) =>
                current.map(
                    (item) =>
                        item.id === publication.id
                            ? {
                                ...item,
                                is_liked: !wasLiked,
                                like_count: wasLiked
                                    ? Math.max(
                                        0,
                                        previousLikeCount - 1,
                                    )
                                    : previousLikeCount + 1,
                            }
                            : item,
                ),
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
        } catch (error) {
            console.error(
                "Erreur lors de la modification du like :",
                error,
            );

            /*
             * Rollback
             */
            setPosts(
                (current) =>
                    current.map(
                        (item) =>
                            item.id === publication.id
                                ? {
                                    ...item,
                                    is_liked: wasLiked,
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
                            id !== publication.id,
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

    const refreshUser = useCallback(
        async () => {
            if (!accessToken) {
                return;
            }

            try {
                const freshUser = await getMe(
                    accessToken,
                );

                setUser(freshUser);
            } catch (error) {
                console.error(
                    "Erreur lors du chargement du profil :",
                    error,
                );
            }
        },
        [
            accessToken,
            setUser,
        ],
    );

    const refreshPosts = useCallback(
        async () => {
            if (!accessToken) {
                return;
            }

            try {
                const response =
                    await getMyPublications(
                        accessToken,
                    );

                setPosts(response.results);
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des publications :",
                    error,
                );
            }
        },
        [accessToken],
    );

    const loadProfileData = useCallback(
        async () => {
            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                await Promise.all([
                    refreshUser(),
                    refreshPosts(),
                ]);
            } finally {
                setLoading(false);
            }
        },
        [
            accessToken,
            refreshUser,
            refreshPosts,
        ],
    );

    useFocusEffect(
        useCallback(() => {
            loadProfileData();
        }, [loadProfileData]),
    );

    const onRefresh = useCallback(
        async () => {
            setRefreshing(true);

            try {
                await loadProfileData();
            } finally {
                setRefreshing(false);
            }
        },
        [loadProfileData],
    );

    if (loading && !user) {
        return (
            <SafeAreaView
                style={styles.container}
            >
                <View
                    style={styles.loadingContainer}
                >
                    <ActivityIndicator
                        size="large"
                        color={colors.primary}
                    />
                </View>
            </SafeAreaView>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <SafeAreaView
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={
                    styles.content
                }
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
            >
                {/* Header */}
                <ProfileHeader
                    username={user.username}
                    onEditProfile={
                        handleEditProfile
                    }
                    onSettings={
                        handleSettings
                    }
                />

                {/* Identité */}
                <View
                    style={styles.profileSection}
                >
                    <View style={styles.avatar}>
                        <Text
                            style={
                                styles.avatarText
                            }
                        >
                            {user.username
                                .charAt(0)
                                .toUpperCase()}
                        </Text>
                    </View>

                    <View
                        style={styles.identity}
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
                                @{user.username}
                            </Text>

                            {user.identity_verified && (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={19}
                                    color={
                                        colors.primary
                                    }
                                />
                            )}
                        </View>

                        <Text
                            style={
                                styles.fullName
                            }
                        >
                            {user.first_name}{" "}
                            {user.last_name}
                        </Text>
                    </View>
                </View>

                {/* Statistiques */}
                <View
                    style={styles.statsCard}
                >
                    <ProfileStats
                        posts={
                            user.profile
                                .post_count
                        }
                        followers={0}
                        following={0}
                    />
                </View>

                {/* Bio */}
                <View
                    style={styles.bioSection}
                >
                    <ProfileBio
                        firstName={
                            user.first_name
                        }
                        lastName={
                            user.last_name
                        }
                        bio={user.profile.bio}
                        showName={false}
                    />
                </View>

                {/* Actions */}
                <View
                    style={styles.actionsSection}
                >
                    <ProfileActionButtons
                        onJournal={handleJournal}
                    />
                </View>

                {/* Publications / Enregistrés */}
                <View
                    style={styles.tabsSection}
                >
                    <ProfileTabs
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />
                </View>

                {/* Publications */}
                {activeTab === "posts" &&
                    posts.length > 0 && (
                        <PublicationList
                            posts={posts}
                            onPress={
                                handlePublicationPress
                            }
                            onLike={handleLike}
                        />
                    )}

                {/* Aucun post */}
                {activeTab === "posts" &&
                    posts.length === 0 && (
                        <View
                            style={
                                styles.emptyPosts
                            }
                        >
                            <View
                                style={
                                    styles.emptyIconContainer
                                }
                            >
                                <Ionicons
                                    name="images-outline"
                                    size={28}
                                    color={
                                        colors.textMuted
                                    }
                                />
                            </View>

                            <Text
                                style={
                                    styles.emptyTitle
                                }
                            >
                                Aucune publication
                            </Text>

                            <Text
                                style={
                                    styles.emptyText
                                }
                            >
                                Vos publications
                                apparaîtront ici.
                            </Text>
                        </View>
                    )}

                {/* Enregistrés */}
                {activeTab === "saved" && (
                    <View
                        style={
                            styles.emptyPosts
                        }
                    >
                        <View
                            style={
                                styles.emptyIconContainer
                            }
                        >
                            <Ionicons
                                name="bookmark-outline"
                                size={28}
                                color={
                                    colors.textMuted
                                }
                            />
                        </View>

                        <Text
                            style={
                                styles.emptyTitle
                            }
                        >
                            Publications
                            enregistrées
                        </Text>

                        <Text
                            style={
                                styles.emptyText
                            }
                        >
                            Vos publications
                            enregistrées
                            apparaîtront ici.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
        colors.background,
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 40,
    },

    /*
     * Chargement
     */
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    /*
     * Identité
     */
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
        paddingHorizontal: 4,
    },

    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor:
        colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },

    avatarText: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.white,
    },

    identity: {
        flex: 1,
        marginLeft: 16,
    },

    usernameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 5,
    },

    username: {
        fontSize: 19,
        fontWeight: "700",
        color: colors.black,
    },

    fullName: {
        fontSize: 14,
        color: colors.textSecondary,
    },

    /*
     * Statistiques
     */
    statsCard: {
        backgroundColor:
        colors.white,
        borderRadius: 16,
        paddingVertical: 6,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },

    /*
     * Bio
     */
    bioSection: {
        paddingHorizontal: 4,
        marginBottom: 4,
    },

    /*
     * Bouton Mon journal
     */
    actionsSection: {
        marginTop: 4,
        marginBottom: 20,
    },

    /*
     * Tabs
     */
    tabsSection: {
        marginTop: 4,
    },

    /*
     * Aucun contenu
     */
    emptyPosts: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
        paddingVertical: 50,
    },

    emptyIconContainer: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor:
        colors.lightGray,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },

    emptyTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.black,
        marginBottom: 6,
        textAlign: "center",
    },

    emptyText: {
        fontSize: 14,
        lineHeight: 20,
        color: colors.textSecondary,
        textAlign: "center",
    },
});