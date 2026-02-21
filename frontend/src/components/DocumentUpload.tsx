'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
    IconUpload as Upload,
    IconFile as FileText,
    IconFileSpreadsheet as FileSpreadsheet,
    IconFileCode as FileCode,
    IconFile as File,
    IconX as X,
    IconCheckCircle as CheckCircle2,
    IconAlertCircle as AlertCircle,
    IconLoader as Loader2,
} from './icons';
import { uploadDocument } from '@/lib/api';
import type { DocumentInfo } from '@/lib/api';
import ScanningBadge from './ScanningBadge';

interface DocumentUploadProps {
    conversationId: string;
    documents: DocumentInfo[];
    onDocumentUploaded: (doc: DocumentInfo) => void;
    onDocumentDeleted: (id: string) => void;
}

const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    const iconStyle = { filter: 'drop-shadow(0 0 5px rgba(249, 115, 22, 0.4))' }; // Subtle orange glow

    switch (ext) {
        case 'pdf':
            return <FileText size={16} className="text-orange-500" style={iconStyle} />;
        case 'csv':
        case 'xlsx':
        case 'xls':
            return <FileSpreadsheet size={16} className="text-orange-500" style={iconStyle} />;
        case 'doc':
        case 'docx':
            return <FileText size={16} className="text-orange-500" style={iconStyle} />;
        case 'txt':
        case 'md':
        case 'json': // Added 'json'
            return <FileCode size={16} className="text-orange-400" style={iconStyle} />; // Changed to FileCode
        default:
            return <File size={16} className="text-zinc-500" />;
    }
};

const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function DocumentUpload({
    conversationId,
    documents,
    onDocumentUploaded,
    onDocumentDeleted,
}: DocumentUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadingName, setUploadingName] = useState('');

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            for (const file of acceptedFiles) {
                setUploading(true);
                setUploadingName(file.name);
                setProgress(0);

                try {
                    const doc = await uploadDocument(file, conversationId, (p) => setProgress(p));
                    onDocumentUploaded(doc);
                } catch (err) {
                    console.error('Upload failed:', err);
                } finally {
                    setUploading(false);
                    setProgress(0);
                    setUploadingName('');
                }
            }
        },
        [conversationId, onDocumentUploaded]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
            'text/csv': ['.csv'],
            'text/markdown': ['.md'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/json': ['.json'],
        },
    });

    return (
        <div className="flex flex-col gap-3">
            {/* Drop Zone */}
            <div
                {...getRootProps()}
                className={`rounded-2xl border flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 group overflow-hidden relative ${isDragActive ? 'border-white/40 bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
            >
                <input {...getInputProps()} />
                <motion.div
                    animate={{
                        scale: isDragActive ? 1.05 : 1,
                        y: isDragActive ? -3 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 flex flex-col items-center"
                >
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 bg-black/40 border border-white/5 group-hover:scale-110 group-hover:-translate-y-1"
                    >
                        <Upload
                            size={20}
                            className="text-white"
                        />
                    </div>
                    <p className="text-sm font-medium mb-1 text-white">
                        {isDragActive ? 'Drop files now' : 'Click or drag files'}
                    </p>
                    <p className="text-xs text-zinc-500">
                        PDF, DOCX, TXT, CSV (Max 10MB)
                    </p>
                </motion.div>
            </div>

            {/* Upload Progress */}
            <AnimatePresence>
                {uploading && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-xl p-3 overflow-hidden bg-white/5 border border-white/5 mt-2"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Loader2
                                size={14}
                                className="animate-spin text-white"
                            />
                            <span className="text-xs font-medium truncate flex-1 text-white">
                                {uploadingName}
                            </span>
                            <span className="text-xs text-zinc-400">
                                {progress}%
                            </span>
                        </div>
                        <div className="h-1 rounded-full overflow-hidden bg-black/40">
                            <motion.div
                                className="h-full rounded-full bg-orange-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Document List */}
            <div className="flex flex-col gap-2 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                <AnimatePresence mode='popLayout'>
                    {documents.map((doc) => (
                        <motion.div
                            key={doc.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex items-center gap-3 p-3 rounded-xl group relative overflow-hidden bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300"
                        >
                            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                                {getFileIcon(doc.name)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate text-white">
                                    {doc.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <ScanningBadge
                                        className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-900 border border-white/5 text-zinc-400"
                                    >
                                        {doc.name.split('.').pop()}
                                    </ScanningBadge>
                                    <span className="text-xs text-zinc-500">
                                        {formatSize(doc.size)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {doc.status === 'READY' && (
                                    <span title="Ready" className="flex items-center justify-center w-6 h-6 rounded-full"
                                        style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                                        <CheckCircle2 size={14} className="text-green-500" />
                                    </span>
                                )}
                                {doc.status === 'PROCESSING' && (
                                    <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent)' }} />
                                )}
                                {doc.status === 'ERROR' && (
                                    <AlertCircle size={16} style={{ color: 'var(--error)' }} />
                                )}

                                <button
                                    onClick={() => onDocumentDeleted(doc.id)}
                                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 hover:text-red-500"
                                    style={{ color: 'var(--text-tertiary)' }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {documents.length === 0 && !uploading && (
                    <div className="text-center py-4 opacity-50">
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>No documents uploaded yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
