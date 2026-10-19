export type MessagingUser = {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    avatar?: string | null;
};

export type Message = {
    id: number;
    conversation_id: number;
    sender: MessagingUser;
    content: string;
    created_at: string;
};

export type Conversation = {
    id: number;
    other_user?: MessagingUser;
    other_participant?: MessagingUser;
    user?: MessagingUser;
    participants?: MessagingUser[];
    last_message?: Message | null;
    updated_at?: string;
};

export type PaginatedMessages = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Message[];
};
