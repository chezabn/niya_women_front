import {
    useCallback,
    useState,
} from "react";

import {
    RefreshControl,
    ScrollView,
    StyleSheet,
} from "react-native";

import {
    SafeAreaView,
} from "react-native-safe-area-context";

import {
    router,
    useFocusEffect,
    useLocalSearchParams,
} from "expo-router";

import {
    getUser,
    getUserPublications,
    likePublication,
    unlikePublication,
} from "@niyya/api";

import {
    Publication,
    User,
} from "@niyya/types";

import {
    colors,
} from "@/src/theme";

import {
    useAuthStore,
} from "@/src/store/authStore";

import {
    UserProfileHeader,
} from "@/src/components/profile/UserProfileHeader";

import {
    ProfileStats,
} from "@/src/components/profile/ProfileStats";

import {
    ProfileBio,
} from "@/src/components/profile/ProfileBio";

import {
    PublicationList,
} from "@/src/components/profile/PublicationList";


export default function UserProfileScreen() {
    const {
        userId,
    } = useLocalSearchParams<{
        userId: string;
    }>();

    const accessToken =
        useAuthStore(
            (state) => state.accessToken,
        );

    const [
        user,
        setUser,
    ] = useState<User | null>(null);

    const [
        posts,
        setPosts,
    ] = useState<Publication[]>([]);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        likingPublicationIds,
        setLikingPublicationIds,
    ] = useState<number[]>([]);


    const numericUserId =
        Number(userId);


    const loadProfileData =
        useCallback(
            async () => {
                if (
                    !accessToken ||
                    !numericUserId
                ) {
                    return;
                }

                try {
                    const [
                        userResponse,
                        publicationsResponse,
                    ] = await Promise.all([
                        getUser(
                            numericUserId,
                            accessToken,
                        ),
                        getUserPublications(
                            numericUserId,
                            accessToken,
                        ),
                    ]);

                    setUser(
                        userResponse,
                    );

                    setPosts(
                        publicationsResponse.results,
                    );
                } catch (error) {
                    console.error(
                        "Erreur lors du chargement du profil utilisateur :",
                        error,
                    );
                }
            },
            [
                accessToken,
                numericUserId,
            ],
        );


    useFocusEffect(
        useCallback(() => {
            loadProfileData();
        }, [
            loadProfileData,
        ]),
    );


    const onRefresh =
        useCallback(
            async () => {
                setRefreshing(true);

                try {
                    await loadProfileData();
                } finally {
                    setRefreshing(false);
                }
            },
            [
                loadProfileData,
            ],
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

        setLikingPublicationIds(
            (current) => [
                ...current,
                publication.id,
            ],
        );


        setPosts(
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

            setPosts(
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
                showsVerticalScrollIndicator={
                    false
                }
                refreshControl={
                    <RefreshControl
                        refreshing={
                            refreshing
                        }
                        onRefresh={
                            onRefresh
                        }
                        tintColor={
                            colors.primary
                        }
                    />
                }
            >
                <UserProfileHeader
                    username={
                        user.username
                    }
                    onBack={() =>
                        router.back()
                    }
                />

                <ProfileStats
                    posts={
                        user.profile
                            .post_count
                    }
                    followers={0}
                    following={0}
                />

                <ProfileBio
                    firstName={
                        user.first_name
                    }
                    lastName={
                        user.last_name
                    }
                    bio={
                        user.profile.bio
                    }
                />

                <PublicationList
                    posts={posts}
                    onPress={
                        handlePublicationPress
                    }
                    onLike={
                        handleLike
                    }
                />
            </ScrollView>
        </SafeAreaView>
    );
}


const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
            colors.white,
        },

        content: {
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 32,
        },
    });