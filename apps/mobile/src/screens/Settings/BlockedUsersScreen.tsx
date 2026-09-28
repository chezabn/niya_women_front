import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { deblockUser, getAllBlockedUsers } from "@niyya/api";
import { UserPreview } from "@niyya/types";
import { colors } from "@/src/theme";
import { useAuthStore } from "@/src/store/authStore";

export const BlockedUsersScreen = () => {
    const accessToken = useAuthStore((state) => state.accessToken);
    const [users, setUsers] = useState<UserPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState<number | null>(null);

    const loadUsers = useCallback(async () => {
        if (!accessToken) { setLoading(false); return; }
        setLoading(true);
        try {
            const response = await getAllBlockedUsers(accessToken);
            setUsers(response.results);
        } catch (error) {
            console.error("Erreur lors du chargement des utilisatrices bloquées :", error);
            Alert.alert("Erreur", "Impossible de charger les utilisatrices bloquées.");
        } finally {
            setLoading(false);
        }
    }, [accessToken]);

    useFocusEffect(useCallback(() => { loadUsers(); }, [loadUsers]));

    const handleUnblock = async (user: UserPreview) => {
        if (!accessToken || removingId !== null) return;
        setRemovingId(user.id);
        try {
            await deblockUser(user.id, accessToken);
            setUsers((current) => current.filter((item) => item.id !== user.id));
        } catch (error) {
            console.error("Erreur lors du déblocage de l’utilisatrice :", error);
            Alert.alert("Erreur", "Impossible de débloquer cette utilisatrice.");
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={26} color={colors.black} />
                </Pressable>
                <Text style={styles.title}>Utilisatrices bloquées</Text>
                <View style={styles.spacer} />
            </View>
            {loading ? <ActivityIndicator style={styles.loader} size="large" color={colors.primary} /> : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={users.length === 0 ? styles.emptyContent : styles.listContent}
                    ListEmptyComponent={<Text style={styles.emptyText}>Aucune utilisatrice bloquée</Text>}
                    renderItem={({ item }) => (
                        <View style={styles.row}>
                            <View style={styles.identity}>
                                <Text style={styles.username}>@{item.username}</Text>
                                {(item.first_name || item.last_name) ? <Text style={styles.name}>{item.first_name} {item.last_name}</Text> : null}
                            </View>
                            <Pressable onPress={() => handleUnblock(item)} disabled={removingId !== null} hitSlop={12} style={styles.removeButton} accessibilityLabel={`Débloquer ${item.username}`}>
                                {removingId === item.id ? <ActivityIndicator size="small" color={colors.primary} /> : <Ionicons name="close-circle-outline" size={24} color={colors.textSecondary} />}
                            </Pressable>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
    header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12 },
    backButton: { width: 44, height: 44, justifyContent: "center" },
    title: { flex: 1, textAlign: "center", color: colors.black, fontSize: 18, fontWeight: "700" },
    spacer: { width: 44 },
    loader: { flex: 1 },
    listContent: { paddingHorizontal: 20 },
    emptyContent: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 24 },
    emptyText: { color: colors.textSecondary, fontSize: 15 },
    row: { minHeight: 68, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#EFEFEF" },
    identity: { flex: 1 },
    username: { color: colors.black, fontSize: 15, fontWeight: "600" },
    name: { marginTop: 3, color: colors.textSecondary, fontSize: 13 },
    removeButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
});
