import React, { useState } from "react";

import {
    Alert,
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
    CommentUpdate,
} from "@niyya/types";

import {
    deleteComment,
    updateComment,
} from "@niyya/api";

interface CommentItemProps {
    comment: Comment;
    publicationAuthorId: number;
    currentUserId: number;
    accessToken: string;
    onCommentUpdated: () => void;
    onCommentDeleted: () => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    publicationAuthorId,
    currentUserId,
    accessToken,
    onCommentUpdated,
    onCommentDeleted,
}) => {
    const isPublicationAuthor =
        comment.author.id === publicationAuthorId;

    const isCommentAuthor =
        comment.author.id === currentUserId;

    const [isEditing, setIsEditing] =
        useState(false);

    const [description, setDescription] =
        useState(comment.description);

    const [saving, setSaving] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const handleEdit = () => {
        setDescription(
            comment.description,
        );

        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setDescription(
            comment.description,
        );

        setIsEditing(false);
    };

    const handleSave = async () => {
        const trimmedDescription =
            description.trim();

        if (
            !trimmedDescription ||
            saving
        ) {
            return;
        }

        const newComment: CommentUpdate = {
            description:
                trimmedDescription,
        };

        try {
            setSaving(true);

            await updateComment(
                accessToken,
                comment.id,
                newComment,
            );

            setIsEditing(false);

            onCommentUpdated();
        } catch (error) {
            console.error(
                "Erreur lors de la modification du commentaire :",
                error,
            );

            Alert.alert(
                "Erreur",
                "Impossible de modifier ce commentaire.",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        if (
            deleting ||
            !isCommentAuthor
        ) {
            return;
        }

        Alert.alert(
            "Supprimer le commentaire",
            "Voulez-vous vraiment supprimer ce commentaire ?",
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
                            setDeleting(true);

                            await deleteComment(
                                accessToken,
                                comment.id,
                            );

                            onCommentDeleted();
                        } catch (error) {
                            console.error(
                                "Erreur lors de la suppression du commentaire :",
                                error,
                            );

                            Alert.alert(
                                "Erreur",
                                "Impossible de supprimer ce commentaire.",
                            );
                        } finally {
                            setDeleting(false);
                        }
                    },
                },
            ],
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text
                    style={[
                        styles.username,
                        isPublicationAuthor &&
                            styles.publicationAuthorUsername,
                    ]}
                >
                    {comment.author.username}
                </Text>

                {isCommentAuthor && (
                    <View
                        style={
                            styles.actions
                        }
                    >
                        <TouchableOpacity
                            style={
                                styles.actionButton
                            }
                            onPress={
                                isEditing
                                    ? handleCancelEdit
                                    : handleEdit
                            }
                            disabled={
                                saving ||
                                deleting
                            }
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={
                                    isEditing
                                        ? "close-outline"
                                        : "pencil-outline"
                                }
                                size={19}
                                color={
                                    colors.black
                                }
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={
                                styles.actionButton
                            }
                            onPress={
                                handleDelete
                            }
                            disabled={
                                saving ||
                                deleting
                            }
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="trash-outline"
                                size={19}
                                color="#D9534F"
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {isEditing ? (
                <View
                    style={
                        styles.editContainer
                    }
                >
                    <TextInput
                        style={
                            styles.editInput
                        }
                        value={
                            description
                        }
                        onChangeText={
                            setDescription
                        }
                        multiline
                        maxLength={500}
                        autoFocus
                        editable={!saving}
                    />

                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                            (
                                !description.trim() ||
                                saving
                            ) &&
                                styles.disabledButton,
                        ]}
                        onPress={
                            handleSave
                        }
                        disabled={
                            !description.trim() ||
                            saving
                        }
                        activeOpacity={0.7}
                    >
                        {saving ? (
                            <Text
                                style={
                                    styles.saveButtonText
                                }
                            >
                                ...
                            </Text>
                        ) : (
                            <Text
                                style={
                                    styles.saveButtonText
                                }
                            >
                                Enregistrer
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            ) : (
                <Text
                    style={
                        styles.description
                    }
                >
                    {comment.description}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 14,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 5,
    },

    username: {
        flex: 1,
        fontSize: 15,
        fontWeight: "700",
        color: colors.black,
    },

    publicationAuthorUsername: {
        color: "#6BB6E8",
    },

    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginLeft: 10,
    },

    actionButton: {
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    },

    description: {
        fontSize: 15,
        lineHeight: 22,
        color: "#444",
    },

    editContainer: {
        marginTop: 4,
    },

    editInput: {
        minHeight: 70,
        maxHeight: 150,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        lineHeight: 22,
        color: colors.black,
        backgroundColor: "#FAFAFA",
        textAlignVertical: "top",
    },

    saveButton: {
        alignSelf: "flex-end",
        marginTop: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: colors.primary,
    },

    disabledButton: {
        opacity: 0.4,
    },

    saveButtonText: {
        color: colors.white,
        fontSize: 13,
        fontWeight: "600",
    },
});
