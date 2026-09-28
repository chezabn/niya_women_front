import React, {useCallback, useState,} from "react";

import {
    ActivityIndicator,
    Alert,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import {SafeAreaView,} from "react-native-safe-area-context";

import {router, useFocusEffect, useLocalSearchParams,} from "expo-router";

import {Ionicons,} from "@expo/vector-icons";

import {
    blockUser,
    followUser,
    getUser,
    getUserPublications,
    isFollowing,
    likePublication,
    reportUser,
    unfollowUser,
    unlikePublication,
} from "@niyya/api";

import {Publication, User, UserReport,} from "@niyya/types";

import {colors,} from "@/src/theme";

import {useAuthStore,} from "@/src/store/authStore";

import {ProfileStats,} from "@/src/components/profile/ProfileStats";

import {ProfileBio,} from "@/src/components/profile/ProfileBio";

import {PublicationList,} from "@/src/components/profile/PublicationList";

import {Button,} from "@/src/components/ui/Button";


type ReportReason = {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    backgroundColor: string;
};


const REPORT_REASONS: ReportReason[] = [
    {
        id: "sexual",
        title: "Propos ou contenu sexuel",
        description:
            "Contenu sexuel, suggestif ou inapproprié.",
        icon: "heart-dislike-outline",
        color: "#C65D57",
        backgroundColor: "#F9EDEC",
    },
    {
        id: "harassment",
        title: "Harcèlement ou intimidation",
        description:
            "Comportement agressif, intimidant ou répétitif.",
        icon: "warning-outline",
        color: "#B27A2B",
        backgroundColor: "#FAF3E5",
    },
    {
        id: "spam",
        title: "Spam ou comportement abusif",
        description:
            "Publications répétitives, publicité abusive ou comportement dérangeant.",
        icon: "megaphone-outline",
        color: "#8A6BAF",
        backgroundColor: "#F3EFF8",
    },
    {
        id: "other",
        title: "Autre problème",
        description:
            "Le motif de votre signalement ne correspond pas aux choix proposés.",
        icon: "flag-outline",
        color: colors.primary,
        backgroundColor: "#F1ECF8",
    },
];


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

    const currentUserId =
        useAuthStore(
            (state) => state.user?.id,
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

    const [
        isUserFollowed,
        setIsUserFollowed,
    ] = useState(false);

    const [
        followLoading,
        setFollowLoading,
    ] = useState(false);

    const [
        menuVisible,
        setMenuVisible,
    ] = useState(false);

    const [
        blocking,
        setBlocking,
    ] = useState(false);

    const [
        reportVisible,
        setReportVisible,
    ] = useState(false);

    const [
        selectedReportReason,
        setSelectedReportReason,
    ] = useState<ReportReason | null>(null);

    const [
        otherReason,
        setOtherReason,
    ] = useState("");

    const [
        reporting,
        setReporting,
    ] = useState(false);


    const numericUserId =
        Number(userId);


    /*
     * Chargement du profil
     */
    const loadProfileData =
        useCallback(
            async () => {
                if (
                    !accessToken ||
                    !numericUserId
                ) {
                    setLoading(false);
                    return;
                }

                try {
                    setLoading(true);

                    const [
                        userResponse,
                        publicationsResponse,
                        followResponse,
                    ] = await Promise.all([
                        getUser(
                            numericUserId,
                            accessToken,
                        ),

                        getUserPublications(
                            numericUserId,
                            accessToken,
                        ),

                        numericUserId === currentUserId
                            ? Promise.resolve({
                                is_following: false,
                            })
                            : isFollowing(
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

                    setIsUserFollowed(
                        followResponse.is_following,
                    );
                } catch (error) {
                    console.error(
                        "Erreur lors du chargement du profil utilisateur :",
                        error,
                    );
                } finally {
                    setLoading(false);
                }
            },
            [
                accessToken,
                numericUserId,
                currentUserId,
            ],
        );


    /*
     * Suivre / ne plus suivre
     */
    const handleFollowPress = async () => {
        if (
            !accessToken ||
            !user ||
            followLoading
        ) {
            return;
        }

        setFollowLoading(true);

        try {
            if (isUserFollowed) {
                await unfollowUser(
                    user.id,
                    accessToken,
                );

                setIsUserFollowed(false);
            } else {
                await followUser(
                    user.id,
                    accessToken,
                );

                setIsUserFollowed(true);
            }
        } catch (error) {
            console.error(
                "Erreur lors de la modification de l’abonnement :",
                error,
            );
        } finally {
            setFollowLoading(false);
        }
    };


    /*
     * Bloquer l'utilisatrice
     */
    const handleBlockUser = async () => {
        if (
            !accessToken ||
            !user ||
            blocking
        ) {
            return;
        }

        try {
            setBlocking(true);

            await blockUser(
                user.id,
                accessToken,
            );

            setMenuVisible(false);

            router.back();
        } catch (error) {
            console.error(
                "Erreur lors du blocage de l’utilisatrice :",
                error,
            );

            Alert.alert(
                "Une erreur est survenue",
                "Impossible de bloquer cette utilisatrice.",
            );
        } finally {
            setBlocking(false);
        }
    };


    /*
     * Ouvrir le formulaire de signalement
     */
    const openReportModal = () => {
        setMenuVisible(false);
        setSelectedReportReason(null);
        setOtherReason("");
        setReportVisible(true);
    };


    /*
     * Fermer le formulaire de signalement
     */
    const closeReportModal = () => {
        if (reporting) {
            return;
        }

        setReportVisible(false);
        setSelectedReportReason(null);
        setOtherReason("");
    };


    /*
     * Sélection d'un motif
     */
    const handleReportReasonPress = (
        reason: ReportReason,
    ) => {
        setSelectedReportReason(reason);

        if (reason.id !== "other") {
            setOtherReason("");
        }
    };


    /*
     * Envoi du signalement
     */
    const submitReport = async () => {
        if (
            !accessToken ||
            !user ||
            reporting ||
            !selectedReportReason
        ) {
            return;
        }

        const reason =
            selectedReportReason.id === "other"
                ? otherReason.trim()
                : selectedReportReason.title;

        if (!reason) {
            return;
        }

        const reportData: UserReport = {
            user_id: user.id,
            reason,
        };

        try {
            setReporting(true);

            const response =
                await reportUser(
                    reportData,
                    accessToken,
                );

            setReportVisible(false);
            setSelectedReportReason(null);
            setOtherReason("");

            Alert.alert(
                "Signalement envoyé",
                response.detail ||
                    "Votre signalement a bien été transmis. Merci de contribuer à la sécurité de la communauté.",
            );
        } catch (error) {
            console.error(
                "Erreur lors du signalement de l’utilisatrice :",
                error,
            );

            Alert.alert(
                "Impossible d'envoyer le signalement",
                "Une erreur est survenue pendant l'envoi. Vérifiez votre connexion et réessayez.",
            );
        } finally {
            setReporting(false);
        }
    };


    /*
     * Rechargement lorsque l'écran reprend le focus
     */
    useFocusEffect(
        useCallback(() => {
            loadProfileData();
        }, [
            loadProfileData,
        ]),
    );


    /*
     * Pull-to-refresh
     */
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


    /*
     * Like / unlike
     */
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

        /*
         * Mise à jour optimiste
         */
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
     * Chargement
     */
    if (loading) {
        return (
            <SafeAreaView
                style={styles.container}
            >
                <View
                    style={
                        styles.loadingContainer
                    }
                >
                    <View
                        style={
                            styles.loadingIcon
                        }
                    >
                        <Ionicons
                            name="person-outline"
                            size={25}
                            color={
                                colors.primary
                            }
                        />
                    </View>

                    <ActivityIndicator
                        size="small"
                        color={
                            colors.primary
                        }
                        style={
                            styles.loadingIndicator
                        }
                    />

                    <Text
                        style={
                            styles.loadingText
                        }
                    >
                        Chargement du profil...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }


    /*
     * Profil introuvable
     */
    if (!user) {
        return (
            <SafeAreaView
                style={styles.container}
            >
                <View
                    style={
                        styles.errorContainer
                    }
                >
                    <View
                        style={
                            styles.errorIcon
                        }
                    >
                        <Ionicons
                            name="person-outline"
                            size={30}
                            color={
                                colors.primary
                            }
                        />
                    </View>

                    <Text
                        style={
                            styles.errorTitle
                        }
                    >
                        Profil introuvable
                    </Text>

                    <Text
                        style={
                            styles.errorText
                        }
                    >
                        Cette utilisatrice n&apos;est
                        plus disponible.
                    </Text>

                    <TouchableOpacity
                        style={
                            styles.errorButton
                        }
                        onPress={() =>
                            router.back()
                        }
                        activeOpacity={0.8}
                    >
                        <Text
                            style={
                                styles.errorButtonText
                            }
                        >
                            Retour
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
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

                {/* Header */}
                <View
                    style={styles.header}
                >
                    <TouchableOpacity
                        style={
                            styles.headerButton
                        }
                        onPress={() =>
                            router.back()
                        }
                        activeOpacity={0.7}
                        hitSlop={8}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={
                                colors.black
                            }
                        />
                    </TouchableOpacity>

                    <Text
                        style={
                            styles.headerUsername
                        }
                        numberOfLines={1}
                    >
                        @{user.username}
                    </Text>

                    <TouchableOpacity
                        style={
                            styles.headerButton
                        }
                        onPress={() =>
                            setMenuVisible(true)
                        }
                        activeOpacity={0.7}
                        hitSlop={8}
                    >
                        <Ionicons
                            name="menu"
                            size={25}
                            color={
                                colors.black
                            }
                        />
                    </TouchableOpacity>
                </View>


                {/* Profil */}
                <View
                    style={
                        styles.profileSection
                    }
                >
                    <View
                        style={
                            styles.avatar
                        }
                    >
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
                        style={
                            styles.identity
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


                {/* Suivre */}
                {user.id !== currentUserId && (
                    <View
                        style={
                            styles.friendButton
                        }
                    >
                        <Button
                            text={
                                isUserFollowed
                                    ? "Suivi"
                                    : "Suivre"
                            }
                            onPress={
                                handleFollowPress
                            }
                            isLoading={
                                followLoading
                            }
                            color={
                                isUserFollowed
                                    ? colors.white
                                    : colors.primary
                            }
                            textColor={
                                isUserFollowed
                                    ? colors.primary
                                    : colors.white
                            }
                        />
                    </View>
                )}


                {/* Statistiques */}
                <View
                    style={
                        styles.statsCard
                    }
                >
                    <ProfileStats
                        posts={
                            user.profile
                                .post_count
                        }
                        followers={
                            user.followers_count
                        }
                        following={
                            user.following_count
                        }
                    />
                </View>


                {/* Bio */}
                <View
                    style={
                        styles.bioSection
                    }
                >
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
                        showName={false}
                    />
                </View>


                {/* Publications */}
                <View
                    style={
                        styles.publicationsHeader
                    }
                >
                    <View
                        style={
                            styles.publicationsTitleRow
                        }
                    >
                        <Ionicons
                            name="grid-outline"
                            size={18}
                            color={
                                colors.primary
                            }
                        />

                        <Text
                            style={
                                styles.publicationsTitle
                            }
                        >
                            Publications
                        </Text>
                    </View>

                    <View
                        style={
                            styles.publicationsLine
                        }
                    />
                </View>


                {posts.length > 0 ? (
                    <PublicationList
                        posts={posts}
                        onPress={
                            handlePublicationPress
                        }
                        onLike={
                            handleLike
                        }
                    />
                ) : (
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
                            Cette utilisatrice
                            n&apos;a pas encore publié
                            de contenu.
                        </Text>
                    </View>
                )}
            </ScrollView>


            {/* Menu utilisateur */}
            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setMenuVisible(false)
                }
            >
                <TouchableOpacity
                    style={
                        styles.modalOverlay
                    }
                    activeOpacity={1}
                    onPress={() =>
                        setMenuVisible(false)
                    }
                >
                    <View
                        style={
                            styles.menuPosition
                        }
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {}}
                        >
                            <View
                                style={
                                    styles.menuCard
                                }
                            >
                                <View
                                    style={
                                        styles.menuHeader
                                    }
                                >
                                    <View
                                        style={
                                            styles.menuHeaderIcon
                                        }
                                    >
                                        <Ionicons
                                            name="person-outline"
                                            size={20}
                                            color={
                                                colors.primary
                                            }
                                        />
                                    </View>

                                    <View
                                        style={
                                            styles.menuHeaderText
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.menuTitle
                                            }
                                        >
                                            Options du profil
                                        </Text>

                                        <Text
                                            style={
                                                styles.menuSubtitle
                                            }
                                        >
                                            @{user.username}
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    style={
                                        styles.menuSeparator
                                    }
                                />

                                {/* Bloquer */}
                                <TouchableOpacity
                                    style={
                                        styles.menuAction
                                    }
                                    onPress={
                                        handleBlockUser
                                    }
                                    disabled={
                                        blocking
                                    }
                                    activeOpacity={
                                        0.7
                                    }
                                >
                                    <View
                                        style={
                                            styles.blockIcon
                                        }
                                    >
                                        {blocking ? (
                                            <ActivityIndicator
                                                size="small"
                                                color="#C65D57"
                                            />
                                        ) : (
                                            <Ionicons
                                                name="ban-outline"
                                                size={20}
                                                color="#C65D57"
                                            />
                                        )}
                                    </View>

                                    <View
                                        style={
                                            styles.menuActionText
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.blockTitle
                                            }
                                        >
                                            Bloquer cette utilisatrice
                                        </Text>

                                        <Text
                                            style={
                                                styles.menuActionDescription
                                            }
                                        >
                                            Vous ne verrez plus son profil,
                                            ses publications ni ses commentaires.
                                        </Text>
                                    </View>

                                    <Ionicons
                                        name="chevron-forward"
                                        size={18}
                                        color={
                                            colors.textMuted
                                        }
                                    />
                                </TouchableOpacity>

                                {/* Signaler */}
                                <TouchableOpacity
                                    style={
                                        styles.menuAction
                                    }
                                    onPress={
                                        openReportModal
                                    }
                                    activeOpacity={
                                        0.7
                                    }
                                >
                                    <View
                                        style={
                                            styles.reportIcon
                                        }
                                    >
                                        <Ionicons
                                            name="flag-outline"
                                            size={20}
                                            color={
                                                colors.primary
                                            }
                                        />
                                    </View>

                                    <View
                                        style={
                                            styles.menuActionText
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.reportTitle
                                            }
                                        >
                                            Signaler cette utilisatrice
                                        </Text>

                                        <Text
                                            style={
                                                styles.menuActionDescription
                                            }
                                        >
                                            Aidez-nous à maintenir une communauté
                                            respectueuse et sécurisée.
                                        </Text>
                                    </View>

                                    <Ionicons
                                        name="chevron-forward"
                                        size={18}
                                        color={
                                            colors.textMuted
                                        }
                                    />
                                </TouchableOpacity>

                                {/* Annuler */}
                                <TouchableOpacity
                                    style={
                                        styles.cancelButton
                                    }
                                    onPress={() =>
                                        setMenuVisible(
                                            false,
                                        )
                                    }
                                    activeOpacity={
                                        0.7
                                    }
                                >
                                    <Text
                                        style={
                                            styles.cancelButtonText
                                        }
                                    >
                                        Annuler
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>


            {/* Signalement */}
            <Modal
                visible={reportVisible}
                transparent
                animationType="slide"
                onRequestClose={
                    closeReportModal
                }
            >
                <View
                    style={
                        styles.reportModalOverlay
                    }
                >
                    <View
                        style={
                            styles.reportModalCard
                    }
                    >
                        {/* Header */}
                        <View
                            style={
                                styles.reportModalHeader
                            }
                        >
                            <View
                                style={
                                    styles.reportHeaderIcon
                                }
                            >
                                <Ionicons
                                    name="flag-outline"
                                    size={23}
                                    color={
                                        colors.primary
                                    }
                                />
                            </View>

                            <TouchableOpacity
                                style={
                                    styles.closeButton
                                }
                                onPress={
                                    closeReportModal
                                }
                                disabled={
                                    reporting
                                }
                            >
                                <Ionicons
                                    name="close"
                                    size={22}
                                    color={
                                        colors.textSecondary
                                    }
                                />
                            </TouchableOpacity>
                        </View>

                        <Text
                            style={
                                styles.reportModalTitle
                            }
                        >
                            Signaler @{user.username}
                        </Text>

                        <Text
                            style={
                                styles.reportModalSubtitle
                            }
                        >
                            Votre signalement sera transmis à
                            notre équipe de modération. Choisissez
                            le motif qui correspond le mieux à
                            la situation.
                        </Text>


                        {/* Motifs */}
                        <ScrollView
                            style={
                                styles.reportReasonsList
                            }
                            showsVerticalScrollIndicator={
                                false
                            }
                        >
                            {REPORT_REASONS.map(
                                (reason) => {
                                    const selected =
                                        selectedReportReason?.id ===
                                        reason.id;

                                    return (
                                        <TouchableOpacity
                                            key={
                                                reason.id
                                            }
                                            style={[
                                                styles.reportReason,
                                                selected &&
                                                    styles.reportReasonSelected,
                                            ]}
                                            onPress={() =>
                                                handleReportReasonPress(
                                                    reason,
                                                )
                                            }
                                            activeOpacity={
                                                0.75
                                            }
                                        >
                                            <View
                                                style={[
                                                    styles.reasonIcon,
                                                    {
                                                        backgroundColor:
                                                            reason.backgroundColor,
                                                    },
                                                ]}
                                            >
                                                <Ionicons
                                                    name={
                                                        reason.icon
                                                    }
                                                    size={20}
                                                    color={
                                                        reason.color
                                                    }
                                                />
                                            </View>

                                            <View
                                                style={
                                                    styles.reasonContent
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.reasonTitle
                                                    }
                                                >
                                                    {
                                                        reason.title
                                                    }
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.reasonDescription
                                                    }
                                                >
                                                    {
                                                        reason.description
                                                    }
                                                </Text>
                                            </View>

                                            <View
                                                style={[
                                                    styles.radio,
                                                    selected &&
                                                        styles.radioSelected,
                                                ]}
                                            >
                                                {selected && (
                                                    <View
                                                        style={
                                                            styles.radioDot
                                                        }
                                                    />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                },
                            )}

                            {/* Autre */}
                            {selectedReportReason?.id ===
                                "other" && (
                                <View
                                    style={
                                        styles.otherReasonContainer
                                    }
                                >
                                    <Text
                                        style={
                                            styles.otherReasonLabel
                                        }
                                    >
                                        Expliquez-nous ce qui s'est passé
                                    </Text>

                                    <Text
                                        style={
                                            styles.otherReasonHint
                                        }
                                    >
                                        Décrivez brièvement le problème
                                        afin que notre équipe puisse
                                        comprendre la situation.
                                    </Text>

                                    <TextInput
                                        value={
                                            otherReason
                                        }
                                        onChangeText={
                                            setOtherReason
                                        }
                                        placeholder="Décrivez le problème..."
                                        placeholderTextColor={
                                            colors.textMuted
                                        }
                                        multiline
                                        maxLength={2000}
                                        style={
                                            styles.reasonInput
                                        }
                                        textAlignVertical="top"
                                        editable={
                                            !reporting
                                        }
                                    />

                                    <Text
                                        style={
                                            styles.characterCount
                                        }
                                    >
                                        {otherReason.length}/2000
                                    </Text>
                                </View>
                            )}
                        </ScrollView>


                        {/* Information */}
                        <View
                            style={
                                styles.reportInfo
                            }
                        >
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={17}
                                color={
                                    colors.primary
                                }
                            />

                            <Text
                                style={
                                    styles.reportInfoText
                                }
                            >
                                Les signalements sont examinés
                                avec attention par notre équipe.
                            </Text>
                        </View>


                        {/* Boutons */}
                        <View
                            style={
                                styles.reportButtons
                            }
                        >
                            <TouchableOpacity
                                style={
                                    styles.reportCancelButton
                                }
                                onPress={
                                    closeReportModal
                                }
                                disabled={
                                    reporting
                                }
                                activeOpacity={
                                    0.7
                                }
                            >
                                <Text
                                    style={
                                        styles.reportCancelText
                                    }
                                >
                                    Annuler
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.reportSubmitButton,
                                    (
                                        !selectedReportReason ||
                                        (
                                            selectedReportReason.id ===
                                            "other" &&
                                            !otherReason.trim()
                                        ) ||
                                        reporting
                                    ) &&
                                        styles.reportSubmitButtonDisabled,
                                ]}
                                onPress={
                                    submitReport
                                }
                                disabled={
                                    !selectedReportReason ||
                                    (
                                        selectedReportReason.id ===
                                        "other" &&
                                        !otherReason.trim()
                                    ) ||
                                    reporting
                                }
                                activeOpacity={
                                    0.8
                                }
                            >
                                {reporting ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={
                                            colors.white
                                        }
                                    />
                                ) : (
                                    <>
                                        <Ionicons
                                            name="paper-plane-outline"
                                            size={17}
                                            color={
                                                colors.white
                                            }
                                        />

                                        <Text
                                            style={
                                                styles.reportSubmitText
                                            }
                                        >
                                            Envoyer le signalement
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}


const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor:
                colors.background,
        },

        content: {
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingTop: 4,
            paddingBottom: 40,
        },

        /*
         * Header
         */
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 4,
            paddingBottom: 18,
        },

        headerButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor:
                colors.white,
            borderWidth: 1,
            borderColor:
                colors.border,
            alignItems: "center",
            justifyContent: "center",
        },

        headerUsername: {
            flex: 1,
            marginHorizontal: 16,
            textAlign: "center",
            fontSize: 16,
            fontWeight: "700",
            color: colors.black,
        },

        /*
         * Chargement
         */
        loadingContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 40,
        },

        loadingIcon: {
            width: 56,
            height: 56,
            borderRadius: 18,
            backgroundColor:
                "#F8F0DE",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
        },

        loadingIndicator: {
            marginBottom: 10,
        },

        loadingText: {
            fontSize: 13,
            color: colors.textSecondary,
        },

        /*
         * Profil
         */
        profileSection: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
            paddingHorizontal: 4,
        },

        friendButton: {
            marginTop: -16,
            marginBottom: 12,
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
            borderColor:
                colors.border,
        },

        /*
         * Bio
         */
        bioSection: {
            paddingHorizontal: 4,
            marginBottom: 4,
        },

        /*
         * Publications
         */
        publicationsHeader: {
            marginTop: 8,
        },

        publicationsTitleRow: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
        },

        publicationsTitle: {
            fontSize: 17,
            fontWeight: "700",
            color: colors.black,
        },

        publicationsLine: {
            height: 1,
            backgroundColor:
                colors.border,
        },

        /*
         * Aucune publication
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
        },

        emptyText: {
            fontSize: 14,
            lineHeight: 20,
            color: colors.textSecondary,
            textAlign: "center",
        },

        /*
         * Menu
         */
        modalOverlay: {
            flex: 1,
            backgroundColor:
                "rgba(0, 0, 0, 0.18)",
        },

        menuPosition: {
            flex: 1,
            alignItems: "flex-end",
            paddingTop: 92,
            paddingRight: 16,
        },

        menuCard: {
            width: 310,
            backgroundColor:
                colors.white,
            borderRadius: 20,
            padding: 14,

            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 8,
            },
            shadowOpacity: 0.12,
            shadowRadius: 20,

            elevation: 8,
        },

        menuHeader: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 4,
            paddingVertical: 4,
        },

        menuHeaderIcon: {
            width: 40,
            height: 40,
            borderRadius: 13,
            backgroundColor:
                "#F8F0DE",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 11,
        },

        menuHeaderText: {
            flex: 1,
        },

        menuTitle: {
            fontSize: 15,
            fontWeight: "700",
            color: colors.black,
            marginBottom: 2,
        },

        menuSubtitle: {
            fontSize: 11,
            color: colors.textMuted,
        },

        menuSeparator: {
            height: 1,
            backgroundColor:
                colors.border,
            marginVertical: 12,
        },

        menuAction: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            paddingHorizontal: 4,
        },

        blockIcon: {
            width: 42,
            height: 42,
            borderRadius: 14,
            backgroundColor:
                "#F9EDEC",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 11,
        },

        reportIcon: {
            width: 42,
            height: 42,
            borderRadius: 14,
            backgroundColor:
                "#F1ECF8",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 11,
        },

        menuActionText: {
            flex: 1,
            paddingRight: 8,
        },

        blockTitle: {
            fontSize: 13,
            fontWeight: "700",
            color: "#C65D57",
            marginBottom: 3,
        },

        reportTitle: {
            fontSize: 13,
            fontWeight: "700",
            color: colors.primary,
            marginBottom: 3,
        },

        menuActionDescription: {
            fontSize: 11,
            lineHeight: 16,
            color: colors.textSecondary,
        },

        cancelButton: {
            marginTop: 8,
            height: 44,
            borderRadius: 13,
            backgroundColor:
                "#F7F7F7",
            alignItems: "center",
            justifyContent: "center",
        },

        cancelButtonText: {
            fontSize: 13,
            fontWeight: "600",
            color: colors.textSecondary,
        },

        /*
         * Signalement
         */
        reportModalOverlay: {
            flex: 1,
            backgroundColor:
                "rgba(0, 0, 0, 0.42)",
            justifyContent: "flex-end",
        },

        reportModalCard: {
            backgroundColor:
                colors.white,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 28,
            maxHeight: "92%",
        },

        reportModalHeader: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
        },

        reportHeaderIcon: {
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor:
                "#F1ECF8",
            alignItems: "center",
            justifyContent: "center",
        },

        closeButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor:
                colors.lightGray,
            alignItems: "center",
            justifyContent: "center",
        },

        reportModalTitle: {
            fontSize: 21,
            fontWeight: "800",
            color: colors.black,
            marginBottom: 8,
        },

        reportModalSubtitle: {
            fontSize: 13,
            lineHeight: 20,
            color: colors.textSecondary,
            marginBottom: 18,
        },

        reportReasonsList: {
            maxHeight: 390,
        },

        reportReason: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor:
                colors.border,
            borderRadius: 16,
            padding: 12,
            marginBottom: 10,
            backgroundColor:
                colors.white,
        },

        reportReasonSelected: {
            borderColor:
                colors.primary,
            backgroundColor:
                "#FBF9FD",
        },

        reasonIcon: {
            width: 42,
            height: 42,
            borderRadius: 13,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 11,
        },

        reasonContent: {
            flex: 1,
            paddingRight: 8,
        },

        reasonTitle: {
            fontSize: 13,
            fontWeight: "700",
            color: colors.black,
            marginBottom: 3,
        },

        reasonDescription: {
            fontSize: 11,
            lineHeight: 16,
            color: colors.textSecondary,
        },

        radio: {
            width: 21,
            height: 21,
            borderRadius: 11,
            borderWidth: 1.5,
            borderColor:
                colors.border,
            alignItems: "center",
            justifyContent: "center",
        },

        radioSelected: {
            borderColor:
                colors.primary,
        },

        radioDot: {
            width: 11,
            height: 11,
            borderRadius: 6,
            backgroundColor:
                colors.primary,
        },

        otherReasonContainer: {
            backgroundColor:
                "#FAFAFA",
            borderRadius: 16,
            padding: 14,
            marginTop: 2,
            marginBottom: 12,
            borderWidth: 1,
            borderColor:
                colors.border,
        },

        otherReasonLabel: {
            fontSize: 13,
            fontWeight: "700",
            color: colors.black,
            marginBottom: 4,
        },

        otherReasonHint: {
            fontSize: 11,
            lineHeight: 16,
            color: colors.textSecondary,
            marginBottom: 10,
        },

        reasonInput: {
            minHeight: 100,
            maxHeight: 160,
            borderWidth: 1,
            borderColor:
                colors.border,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 11,
            color: colors.black,
            backgroundColor:
                colors.white,
            fontSize: 13,
            lineHeight: 19,
        },

        characterCount: {
            fontSize: 10,
            color: colors.textMuted,
            textAlign: "right",
            marginTop: 5,
        },

        reportInfo: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor:
                "#F8F5FC",
            borderRadius: 13,
            paddingHorizontal: 12,
            paddingVertical: 10,
            marginTop: 12,
            marginBottom: 14,
        },

        reportInfoText: {
            flex: 1,
            marginLeft: 8,
            fontSize: 11,
            lineHeight: 16,
            color: colors.textSecondary,
        },

        reportButtons: {
            flexDirection: "row",
            gap: 10,
        },

        reportCancelButton: {
            flex: 0.35,
            height: 48,
            borderRadius: 14,
            backgroundColor:
                colors.lightGray,
            alignItems: "center",
            justifyContent: "center",
        },

        reportCancelText: {
            fontSize: 13,
            fontWeight: "700",
            color: colors.textSecondary,
        },

        reportSubmitButton: {
            flex: 0.65,
            height: 48,
            borderRadius: 14,
            backgroundColor:
                colors.primary,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
        },

        reportSubmitButtonDisabled: {
            opacity: 0.45,
        },

        reportSubmitText: {
            fontSize: 13,
            fontWeight: "700",
            color: colors.white,
        },

        /*
         * Erreur
         */
        errorContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 40,
        },

        errorIcon: {
            width: 64,
            height: 64,
            borderRadius: 21,
            backgroundColor:
                "#F8F0DE",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
        },

        errorTitle: {
            fontSize: 20,
            fontWeight: "700",
            color: colors.black,
            marginBottom: 7,
        },

        errorText: {
            fontSize: 14,
            lineHeight: 21,
            color: colors.textSecondary,
            textAlign: "center",
            marginBottom: 22,
        },

        errorButton: {
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 14,
            backgroundColor:
                colors.primary,
        },

        errorButtonText: {
            fontSize: 14,
            fontWeight: "600",
            color: colors.white,
        },
    });
