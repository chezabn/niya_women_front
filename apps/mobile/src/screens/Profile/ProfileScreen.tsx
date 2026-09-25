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
} from "expo-router";

import {
    getMe,
    getMyPublications,
} from "@niyya/api";

import {
    Publication,
} from "@niyya/types";

import { colors } from "@/src/theme";

import {
    useAuthStore,
} from "@/src/store/authStore";

import {
    ProfileHeader,
} from "@/src/components/profile/ProfileHeader";

import {
    ProfileStats,
} from "@/src/components/profile/ProfileStats";

import {
    ProfileBio,
} from "@/src/components/profile/ProfileBio";

import {
    ProfileActionButtons,
} from "@/src/components/profile/ProfileActionButtons";

import {
    ProfileTabs,
} from "@/src/components/profile/ProfileTabs";

import {
    PostGrid,
} from "@/src/components/profile/ProfileGrid";


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

    const [
        activeTab,
        setActiveTab,
    ] = useState<
        "posts" | "saved"
    >("posts");

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        posts,
        setPosts,
    ] = useState<Publication[]>([]);


    const handleEditProfile = () => {
        router.push(
            "/profile/edit",
        );
    };


    const handleJournal = () => {
        router.push(
            "/journal",
        );
    };

    const handlePublicationPress = (
        publication: Publication,
    ) => {
        router.push(
            `/publications/${publication.id}`,
        );
    };

    const handleSettings = () => {
        router.push(
            "/profile/settings",
        );
    };


    const refreshUser = useCallback(
        async () => {
            if (!accessToken) {
                return;
            }

            try {
                const freshUser =
                    await getMe(
                        accessToken,
                    );

                setUser(
                    freshUser,
                );
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

                setPosts(
                    response.results,
                );
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des publications :",
                    error,
                );
            }
        },
        [
            accessToken,
        ],
    );


    const loadProfileData =
        useCallback(
            async () => {
                await Promise.all([
                    refreshUser(),
                    refreshPosts(),
                ]);
            },
            [
                refreshUser,
                refreshPosts,
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
                setRefreshing(
                    true,
                );

                try {
                    await loadProfileData();
                } finally {
                    setRefreshing(
                        false,
                    );
                }
            },
            [
                loadProfileData,
            ],
        );


    if (!user) {
        return null;
    }


    return (
        <SafeAreaView
            style={
                styles.container
            }
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
                <ProfileHeader
                    username={
                        user.username
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

                <ProfileActionButtons
                    onEditProfile={
                        handleEditProfile
                    }
                    onJournal={
                        handleJournal
                    }
                    onSettings={
                        handleSettings
                    }
                />

                <ProfileTabs
                    activeTab={
                        activeTab
                    }
                    onChange={
                        setActiveTab
                    }
                />

                {activeTab ===
                    "posts" &&
                    posts.length > 0 && (
                        <PostGrid
                            posts={posts}
                            onPress={handlePublicationPress}
                        />
                    )}
            </ScrollView>
        </SafeAreaView>
    );
};


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
