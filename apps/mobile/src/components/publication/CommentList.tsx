import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/src/theme";

import {
    Comment,
    CommentCreate,
} from "@niyya/types";

import {
    createComment,
    getComments,
} from "@niyya/api";

import { useAuthStore } from "@/src/store/authStore";

import { CommentItem } from "./CommentItem";

interface CommentListProps {
    publicationId: number;
    publicationAuthorId: number;
}

export const CommentList: React.FC<CommentListProps> = ({
                                                            publicationId,
                                                            publicationAuthorId,
                                                        }) => {
    const accessToken =
        useAuthStore(
            (state) =>
                state.accessToken,
        );

    const [
        comments,
        setComments,
    ] = useState<Comment[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        description,
        setDescription,
    ] = useState("");

    const [
        sending,
        setSending,
    ] = useState(false);

    const loadComments =
        useCallback(
            async (
                isRefresh = false,
            ) => {
                if (!accessToken) {
                    return;
                }

                try {
                    if (isRefresh) {
                        setRefreshing(true);
                    } else {
                        setLoading(true);
                    }

                    const response =
                        await getComments(
                            publicationId,
                            accessToken,
                        );

                    setComments(
                        response.results,
                    );
                } catch (error) {
                    console.error(
                        "Erreur lors du chargement des commentaires :",
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
            [
                publicationId,
                accessToken,
            ],
        );

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    const handleSendComment =
        async () => {
            const trimmedDescription =
                description.trim();

            if (
                !trimmedDescription ||
                !accessToken ||
                sending
            ) {
                return;
            }

            const newComment: CommentCreate =
                {
                    publication:
                    publicationId,
                    description:
                    trimmedDescription,
                };

            try {
                setSending(true);

                await createComment(
                    newComment,
                    accessToken,
                );

                setDescription("");

                /*
                 * On recharge immédiatement
                 * les commentaires après la création.
                 */
                await loadComments(true);
            } catch (error) {
                console.error(
                    "Erreur lors de la création du commentaire :",
                    error,
                );
            } finally {
                setSending(false);
            }
        };

    const user = useAuthStore((state) => state.user);

    const renderComment = ({
        item,
    }: {
        item: Comment;
    }) => {
        if (!accessToken || !user) {
            return null;
        }

        return (
            <CommentItem
                comment={item}
                publicationAuthorId={
                    publicationAuthorId
                }
                currentUserId={user.id}
                accessToken={accessToken}
                onCommentUpdated={() =>
                    loadComments(true)
                }
                onCommentDeleted={() =>
                    loadComments(true)
                }
            />
        );
    };


    if (loading) {
        return (
            <View
                style={
                    styles.loading
                }
            >
                <ActivityIndicator
                    size="small"
                    color={
                        colors.primary
                    }
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View
                style={
                    styles.separator
                }
            />

            <Text
                style={
                    styles.title
                }
            >
                Commentaires
            </Text>

            <FlatList
                data={comments}
                keyExtractor={(
                    item,
                ) =>
                    item.id.toString()
                }
                renderItem={
                    renderComment
                }
                scrollEnabled={false}
                refreshing={
                    refreshing
                }
                onRefresh={() =>
                    loadComments(true)
                }
                ListEmptyComponent={
                    <Text
                        style={
                            styles.empty
                        }
                    >
                        Aucun commentaire pour
                        le moment.
                    </Text>
                }
            />

            <View
                style={
                    styles.inputContainer
                }
            >
                <TextInput
                    style={
                        styles.input
                    }
                    value={
                        description
                    }
                    onChangeText={
                        setDescription
                    }
                    placeholder="Écrire un commentaire..."
                    placeholderTextColor="#999"
                    multiline
                    maxLength={500}
                    editable={
                        !sending
                    }
                />

                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        (
                            !description.trim() ||
                            sending
                        ) &&
                        styles.sendButtonDisabled,
                    ]}
                    onPress={
                        handleSendComment
                    }
                    disabled={
                        !description.trim() ||
                        sending
                    }
                    activeOpacity={0.7}
                >
                    {sending ? (
                        <ActivityIndicator
                            size="small"
                            color={
                                colors.white
                            }
                        />
                    ) : (
                        <Ionicons
                            name="arrow-forward"
                            size={20}
                            color={
                                colors.white
                            }
                        />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 8,
    },

    separator: {
        height: 1,
        backgroundColor: "#DCDCDC",
        marginTop: 8,
        marginBottom: 20,
    },

    title: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.black,
        marginBottom: 4,
    },

    empty: {
        fontSize: 14,
        color: "#999",
        paddingVertical: 20,
    },

    loading: {
        paddingVertical: 30,
        alignItems: "center",
        justifyContent: "center",
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#ECECEC",
    },

    input: {
        flex: 1,
        minHeight: 44,
        maxHeight: 120,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        color: colors.black,
        backgroundColor: "#FAFAFA",
    },

    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginLeft: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
    },

    sendButtonDisabled: {
        opacity: 0.4,
    },
});