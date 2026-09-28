import { AdminGuardScreen }
    from "@/src/screens/Admin/AdminGuardScreen";
import { useLocalSearchParams } from "expo-router";

export default function Page() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const verificationId = Number(id);

    return <AdminGuardScreen verificationId={verificationId} />;
}
