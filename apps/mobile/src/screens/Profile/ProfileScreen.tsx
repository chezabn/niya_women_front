import { SafeAreaView } from "react-native-safe-area-context";
import {
    ScrollView,
    StyleSheet,
    RefreshControl,
} from "react-native";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { router } from "expo-router";

import {
    getMe,
    getMyPublications,
} from "@niyya/api";

import {
    Publication,
} from "@niyya/types";

import { colors } from "@/src/theme";

import { useAuthStore } from "@/src/store/authStore";

import { ProfileHeader } from "@/src/components/profile/ProfileHeader";
import { ProfileStats } from "@/src/components/profile/ProfileStats";
import { ProfileBio } from "@/src/components/profile/ProfileBio";
import { ProfileActionButtons } from "@/src/components/profile/ProfileActionButtons";
import { ProfileTabs } from "@/src/components/profile/ProfileTabs";
import { PostGrid } from "@/src/components/profile/ProfileGrid";

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

    const [refreshing, setRefreshing] =
        useState(false);

    const [posts, setPosts] = useState<
        Publication[]
    >([]);

    const handleEditProfile = () => {
        router.push("/profile/edit");
    };

    const handleSettings = () => {
        router.push("/profile/settings");
    };

    const refreshUser = useCallback(async () => {
        if (!accessToken) {
            return;
        }

        try {
            const freshUser =
                await getMe(accessToken);

            setUser(freshUser);
        } catch (error) {
            console.error(error);
        }
    }, [
        accessToken,
        setUser,
    ]);

    const refreshPosts = useCallback(async () => {
        if (!accessToken) {
            return;
        }

        try {
            const publications =
                await getMyPublications(
                    accessToken,
                );

            console.log(
                JSON.stringify(
                    publications,
                    null,
                    2,
                )
            );

            setPosts(publications);
        } catch (error) {
            console.error(error);
        }
    }, [accessToken]);

    const loadProfileData = useCallback(async () => {
        await Promise.all([
            refreshUser(),
            refreshPosts(),
        ]);
    }, [
        refreshUser,
        refreshPosts,
    ]);

    useEffect(() => {
        loadProfileData();
    }, [loadProfileData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);

        await loadProfileData();

        setRefreshing(false);
    }, [loadProfileData]);

    if (!user) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
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

                {activeTab === "posts" &&
                    posts.length > 0 && (
                        <PostGrid
                            posts={posts}
                        />
                    )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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