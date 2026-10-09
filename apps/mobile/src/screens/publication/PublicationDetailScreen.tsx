import React, {
    useCallback,
    useState,
} from "react";

import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
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
    reportPublication,
} from "@niyya/api";

import { useAuthStore } from "@/src/store/authStore";

import { CommentList } from "@/src/components/publication/CommentList";
import type { PublicationReportPost } from "@niyya/types";

type ReportReason = {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    backgroundColor: string;
};

const REPORT_REASONS: ReportReason[] = [
    { id: "sexual", title: "Propos ou contenu sexuel", description: "Contenu sexuel, suggestif ou inapproprié.", icon: "heart-dislike-outline", color: "#C65D57", backgroundColor: "#F9EDEC" },
    { id: "harassment", title: "Harcèlement ou intimidation", description: "Comportement agressif, intimidant ou répétitif.", icon: "warning-outline", color: "#B27A2B", backgroundColor: "#FAF3E5" },
    { id: "spam", title: "Spam ou comportement abusif", description: "Publications répétitives, publicité abusive ou comportement dérangeant.", icon: "megaphone-outline", color: "#8A6BAF", backgroundColor: "#F3EFF8" },
    { id: "other", title: "Autre problème", description: "Le motif de votre signalement ne correspond pas aux choix proposés.", icon: "flag-outline", color: colors.primary, backgroundColor: "#F1ECF8" },
];

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
    const [menuVisible, setMenuVisible] = useState(false);
    const [reportVisible, setReportVisible] = useState(false);
    const [selectedReportReason, setSelectedReportReason] = useState<ReportReason | null>(null);
    const [otherReason, setOtherReason] = useState("");
    const [reporting, setReporting] = useState(false);

    const openReport = () => {
        setMenuVisible(false);
        setSelectedReportReason(null);
        setOtherReason("");
        setReportVisible(true);
    };

    const closeReport = () => {
        if (reporting) return;
        setReportVisible(false);
        setSelectedReportReason(null);
        setOtherReason("");
    };

    const submitReport = async () => {
        if (!publication || !accessToken || !selectedReportReason || reporting) return;
        const reason = selectedReportReason.id === "other" ? otherReason.trim() : selectedReportReason.title;
        if (!reason) return;
        try {
            setReporting(true);
            const response = await reportPublication(publication.id, { reason } satisfies PublicationReportPost, accessToken);
            setReportVisible(false);
            Alert.alert("Signalement envoyé", response.detail || "Votre signalement a bien été transmis. Merci de contribuer à la sécurité de la communauté.");
        } catch (error) {
            console.error("Erreur lors du signalement de la publication :", error);
            Alert.alert("Impossible d'envoyer le signalement", "Une erreur est survenue pendant l'envoi. Vérifiez votre connexion et réessayez.");
        } finally {
            setReporting(false);
        }
    };

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
                        n&apos;existe plus ou
                        n&apos;est plus
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
                    <Pressable style={styles.headerButton} onPress={() => setMenuVisible(true)} hitSlop={8} accessibilityRole="button" accessibilityLabel="Options de la publication">
                        <Ionicons name="menu" size={25} color={colors.black} />
                    </Pressable>
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
                        <Pressable
                            onPress={() =>
                                router.push(
                                    `/profile/${publication.author.id}`,
                                )
                            }
                            accessibilityRole="button"
                            accessibilityLabel={`Voir le profil de ${publication.author.username}`}
                            hitSlop={6}
                        >
                            <Text
                                style={styles.username}
                            >
                                {publication.author.username}
                            </Text>
                        </Pressable>

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

            <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
                <Pressable style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
                    <View style={styles.menuCard}>
                        <TouchableOpacity style={styles.menuOption} onPress={openReport}>
                            <Ionicons name="flag-outline" size={19} color="#D9534F" />
                            <Text style={styles.menuOptionText}>Signaler la publication</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            <Modal visible={reportVisible} transparent animationType="slide" onRequestClose={closeReport}>
                <View style={styles.reportOverlay}>
                    <View style={styles.reportCard}>
                        <View style={styles.reportHeader}>
                            <View style={styles.reportIcon}><Ionicons name="flag-outline" size={22} color={colors.primary} /></View>
                            <TouchableOpacity onPress={closeReport} disabled={reporting} style={styles.closeButton}><Ionicons name="close" size={22} color={colors.textSecondary} /></TouchableOpacity>
                        </View>
                        <Text style={styles.reportTitle}>Signaler la publication</Text>
                        <Text style={styles.reportSubtitle}>Choisissez le motif qui correspond le mieux à la situation.</Text>
                        <ScrollView style={styles.reasonsList} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                            {REPORT_REASONS.map((reason) => {
                                const selected = selectedReportReason?.id === reason.id;
                                return <TouchableOpacity key={reason.id} style={[styles.reason, selected && styles.reasonSelected]} onPress={() => setSelectedReportReason(reason)} activeOpacity={0.75}>
                                    <View style={[styles.reasonIcon, { backgroundColor: reason.backgroundColor }]}><Ionicons name={reason.icon} size={20} color={reason.color} /></View>
                                    <View style={styles.reasonContent}><Text style={styles.reasonTitle}>{reason.title}</Text><Text style={styles.reasonDescription}>{reason.description}</Text></View>
                                    <View style={[styles.radio, selected && styles.radioSelected]}>{selected && <View style={styles.radioDot} />}</View>
                                </TouchableOpacity>;
                            })}
                            {selectedReportReason?.id === "other" && <View style={styles.otherReasonContainer}>
                                <Text style={styles.otherReasonLabel}>Expliquez-nous ce qui s'est passé</Text>
                                <TextInput value={otherReason} onChangeText={setOtherReason} placeholder="Décrivez le problème..." placeholderTextColor={colors.textMuted} multiline maxLength={2000} style={styles.reasonInput} textAlignVertical="top" editable={!reporting} />
                                <Text style={styles.characterCount}>{otherReason.length}/2000</Text>
                            </View>}
                        </ScrollView>
                        <View style={styles.reportInfo}><Ionicons name="shield-checkmark-outline" size={17} color={colors.primary} /><Text style={styles.reportInfoText}>Les signalements sont examinés avec attention par notre équipe.</Text></View>
                        <View style={styles.reportButtons}>
                            <TouchableOpacity style={styles.reportCancel} onPress={closeReport} disabled={reporting}><Text style={styles.reportCancelText}>Annuler</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.reportSubmit, (!selectedReportReason || (selectedReportReason.id === "other" && !otherReason.trim()) || reporting) && styles.reportSubmitDisabled]} onPress={submitReport} disabled={!selectedReportReason || (selectedReportReason.id === "other" && !otherReason.trim()) || reporting}>
                                {reporting ? <ActivityIndicator size="small" color={colors.white} /> : <><Ionicons name="paper-plane-outline" size={17} color={colors.white} /><Text style={styles.reportSubmitText}>Envoyer le signalement</Text></>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    menuOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "flex-start", alignItems: "flex-end", paddingTop: 54, paddingHorizontal: 16 },
    menuCard: { backgroundColor: colors.white, borderRadius: 12, padding: 6, minWidth: 225, elevation: 5 },
    menuOption: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 14, gap: 10 },
    menuOptionText: { color: colors.black, fontSize: 15, fontWeight: "600" },
    reportOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
    reportCard: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 22, paddingTop: 22, paddingBottom: 30, maxHeight: "90%" },
    reportHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
    reportIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#F1ECF8", alignItems: "center", justifyContent: "center" },
    closeButton: { padding: 8 },
    reportTitle: { fontSize: 21, fontWeight: "700", color: colors.black },
    reportSubtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 8, marginBottom: 14 },
    reasonsList: { flexShrink: 1 },
    reason: { flexDirection: "row", alignItems: "center", padding: 12, marginBottom: 8, borderRadius: 14, borderWidth: 1, borderColor: "#ECECEC" },
    reasonSelected: { borderColor: colors.primary, backgroundColor: "#FBF9FD" },
    reasonIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 11 },
    reasonContent: { flex: 1 },
    reasonTitle: { color: colors.black, fontWeight: "600", fontSize: 14 },
    reasonDescription: { color: colors.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 3 },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: "#C8C8C8", alignItems: "center", justifyContent: "center", marginLeft: 8 },
    radioSelected: { borderColor: colors.primary },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
    otherReasonContainer: { padding: 12, backgroundColor: "#FAFAFA", borderRadius: 12, marginBottom: 10 },
    otherReasonLabel: { fontSize: 14, fontWeight: "600", color: colors.black, marginBottom: 8 },
    reasonInput: { minHeight: 90, borderWidth: 1, borderColor: "#E5E5E5", borderRadius: 10, padding: 10, color: colors.black },
    characterCount: { textAlign: "right", color: colors.textSecondary, fontSize: 12, marginTop: 5 },
    reportInfo: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 14 },
    reportInfoText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
    reportButtons: { flexDirection: "row", gap: 10 },
    reportCancel: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 12, backgroundColor: "#F2F2F2" },
    reportCancelText: { color: colors.black, fontWeight: "600" },
    reportSubmit: { flex: 1.6, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 12, backgroundColor: colors.primary },
    reportSubmitDisabled: { opacity: 0.5 },
    reportSubmitText: { color: colors.white, fontSize: 13, fontWeight: "700" },
});
