export type NotificationType = "like" | "comment" | "follow";

export interface UserNotification {
    id: number;
    notification_type: NotificationType;
    actor_id: number;
    actor_username: string;
    publication_id: number | null;
    created_at: string;
    read_at: string | null;
    is_read: boolean;
}

export interface NotificationListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: UserNotification[];
}
