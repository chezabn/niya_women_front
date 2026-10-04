import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/theme";

interface PaginationButtonProps {
    loading: boolean;
    onPress: () => void;
}

export function PaginationButton({ loading, onPress }: PaginationButtonProps) {
    return (
        <Pressable
            style={styles.button}
            onPress={onPress}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Voir plus"
        >
            {loading ? (
                <ActivityIndicator color={colors.primary} />
            ) : (
                <>
                    <Text style={styles.label}>Voir plus</Text>
                    <Ionicons name="chevron-down" size={18} color={colors.primary} />
                </>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        paddingHorizontal: 18,
        paddingVertical: 12,
        marginTop: 4,
        marginBottom: 18,
    },
    label: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: "600",
    },
});
