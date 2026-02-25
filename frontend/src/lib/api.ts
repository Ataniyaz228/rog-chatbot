const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

// ——— Auth Helpers ———

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
}

function authHeaders(): Record<string, string> {
    const token = getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// ——— Auth API ———

export interface AuthResponse {
    token: string;
    username: string;
    email: string;
}

export async function loginUser(username: string, password: string, rememberMe: boolean): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, rememberMe }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(err.error || 'Login failed');
    }
    return res.json();
}

export async function registerUser(username: string, email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Registration failed' }));
        throw new Error(err.error || 'Registration failed');
    }
    return res.json();
}

export async function getCurrentUser(token: string): Promise<{ username: string; email: string; createdAt?: string }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
}

// ——— Chat API ———

export interface ChatRequest {
    message: string;
    conversationId?: string;
}

export interface SourceReference {
    documentName: string;
    section?: string;
    snippet: string;
    relevanceScore: number;
}

export interface ChatResponse {
    answer: string;
    conversationId: string;
    sources: SourceReference[];
}

export interface DocumentInfo {
    id: string;
    name: string;
    type: string;
    size: number;
    totalChunks: number;
    conversationId: string;
    uploadedAt: string;
    status: 'PROCESSING' | 'READY' | 'ERROR';
}

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    sources?: SourceReference[];
    timestamp: string;
}

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    documentIds: string[];
    createdAt: string;
    updatedAt: string;
}

export async function sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error(`Chat failed: ${res.statusText}`);
    return res.json();
}

export async function uploadDocument(
    file: File,
    conversationId: string,
    onProgress?: (progress: number) => void
): Promise<DocumentInfo> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversationId', conversationId);

    const token = getToken();
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable && onProgress) {
                onProgress(Math.round((e.loaded / e.total) * 100));
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(new Error(`Upload failed: ${xhr.statusText}`));
            }
        });

        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        xhr.open('POST', `${API_BASE}/documents/upload`);
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        xhr.send(formData);
    });
}

export async function getDocuments(conversationId: string): Promise<DocumentInfo[]> {
    const res = await fetch(`${API_BASE}/documents?conversationId=${conversationId}`, {
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch documents: ${res.statusText}`);
    return res.json();
}

export async function deleteDocument(documentId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/documents/${documentId}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to delete document: ${res.statusText}`);
}

export async function getConversations(): Promise<Conversation[]> {
    const res = await fetch(`${API_BASE}/conversations`, {
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch conversations: ${res.statusText}`);
    return res.json();
}

export async function getConversation(id: string): Promise<Conversation> {
    const res = await fetch(`${API_BASE}/conversations/${id}`, {
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to fetch conversation: ${res.statusText}`);
    return res.json();
}

export async function deleteConversation(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/conversations/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to delete conversation: ${res.statusText}`);
}
