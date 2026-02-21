const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

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
        headers: { 'Content-Type': 'application/json' },
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
        xhr.send(formData);
    });
}

export async function getDocuments(conversationId: string): Promise<DocumentInfo[]> {
    const res = await fetch(`${API_BASE}/documents?conversationId=${conversationId}`);
    if (!res.ok) throw new Error(`Failed to fetch documents: ${res.statusText}`);
    return res.json();
}

export async function deleteDocument(documentId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/documents/${documentId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete document: ${res.statusText}`);
}

export async function getConversations(): Promise<Conversation[]> {
    const res = await fetch(`${API_BASE}/conversations`);
    if (!res.ok) throw new Error(`Failed to fetch conversations: ${res.statusText}`);
    return res.json();
}

export async function getConversation(id: string): Promise<Conversation> {
    const res = await fetch(`${API_BASE}/conversations/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch conversation: ${res.statusText}`);
    return res.json();
}

export async function deleteConversation(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/conversations/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete conversation: ${res.statusText}`);
}
