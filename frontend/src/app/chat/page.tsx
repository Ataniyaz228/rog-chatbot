'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import ChatPanel from '@/components/ChatPanel';
import ProfilePanel from '@/components/ProfilePanel';
import {
    sendMessage,
    getConversations,
    deleteConversation,
    getDocuments,
    deleteDocument,
} from '@/lib/api';
import type { Message, Conversation, DocumentInfo } from '@/lib/api';

export default function ChatPage() {
    const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
    const router = useRouter();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [documents, setDocuments] = useState<DocumentInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeView, setActiveView] = useState<'chat' | 'profile'>('chat');

    const pendingIdRef = useRef<string | null>(null);
    const getPendingId = () => {
        if (!pendingIdRef.current) {
            pendingIdRef.current = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
        }
        return pendingIdRef.current;
    };

    const currentConversationId = activeId || getPendingId();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadConversations();
        }
    }, [isAuthenticated]);

    const loadConversations = async () => {
        try {
            const convs = await getConversations();
            setConversations(convs);
        } catch {
            // Backend might not be running yet
        }
    };

    const loadDocuments = async (convId: string) => {
        try {
            const docs = await getDocuments(convId);
            setDocuments(docs);
        } catch {
            setDocuments([]);
        }
    };

    const handleSelectConversation = useCallback(async (id: string) => {
        setActiveId(id);
        setActiveView('chat');
        const conv = conversations.find((c) => c.id === id);
        if (conv) {
            setMessages(conv.messages);
        }
        await loadDocuments(id);
    }, [conversations]);

    const handleNewChat = useCallback(() => {
        setActiveId(null);
        setActiveView('chat');
        setMessages([]);
        setDocuments([]);
        pendingIdRef.current = null;
    }, []);

    const handleDeleteConversation = useCallback(async (id: string) => {
        try {
            await deleteConversation(id);
            setConversations((prev) => prev.filter((c) => c.id !== id));
            if (activeId === id) {
                handleNewChat();
            }
        } catch (err) {
            console.error('Failed to delete conversation:', err);
        }
    }, [activeId, handleNewChat]);

    const handleSend = useCallback(async (message: string) => {
        const convId = activeId || getPendingId();
        const userMsg: Message = {
            role: 'user',
            content: message,
            timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const response = await sendMessage({
                message,
                conversationId: convId,
            });
            if (!activeId) {
                setActiveId(response.conversationId);
                pendingIdRef.current = null;
            }
            const assistantMsg: Message = {
                role: 'assistant',
                content: response.answer,
                sources: response.sources,
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
            await loadConversations();
        } catch (err) {
            console.error('Chat error:', err);
            const errorMsg: Message = {
                role: 'assistant',
                content: 'Sorry, an error occurred. Please make sure the backend server is running on port 8081.',
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    }, [activeId]);

    const handleDocumentUploaded = useCallback((doc: DocumentInfo) => {
        setDocuments((prev) => [...prev, doc]);
        if (!activeId) {
            setActiveId(doc.conversationId);
        }
        loadConversations();
    }, [activeId]);

    const handleDocumentDeleted = useCallback(async (docId: string) => {
        try {
            await deleteDocument(docId);
            setDocuments((prev) => prev.filter((d) => d.id !== docId));
        } catch (err) {
            console.error('Failed to delete document:', err);
        }
    }, []);

    const handleToggleSidebar = useCallback(() => setSidebarCollapsed(p => !p), []);

    if (authLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <div className="text-zinc-500 text-sm">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <div className="text-zinc-500 text-sm">Redirecting...</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-screen bg-transparent p-4 gap-4 overflow-hidden relative z-10 box-border">
            <Sidebar
                conversations={conversations}
                activeId={activeView === 'chat' ? activeId : null}
                onSelect={handleSelectConversation}
                onNew={handleNewChat}
                onDelete={handleDeleteConversation}
                collapsed={sidebarCollapsed}
                onToggle={handleToggleSidebar}
                onProfileClick={() => setActiveView('profile')}
            />

            {activeView === 'chat' ? (
                <ChatPanel
                    messages={messages}
                    isLoading={isLoading}
                    onSend={handleSend}
                    conversationId={currentConversationId}
                    documents={documents}
                    onDocumentUploaded={handleDocumentUploaded}
                    onDocumentDeleted={handleDocumentDeleted}
                />
            ) : (
                <ProfilePanel
                    conversations={conversations}
                    documents={documents}
                    onClearData={() => {
                        setConversations([]);
                        setDocuments([]);
                        handleNewChat();
                        setActiveView('chat');
                    }}
                />
            )}
        </div>
    );
}
