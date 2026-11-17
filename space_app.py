"""Entrypoint for hosted deployment (e.g. Hugging Face Spaces, Docker).

Boots the Flask app, builds the FAISS vector store from docs/ + uploads/,
wires the chatbot into the Socket.IO handlers and serves on $PORT (7860).
"""
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, os.path.join(BASE_DIR, "src"))
os.chdir(BASE_DIR)

os.environ.setdefault('FLASK_ENV', 'production')
os.environ.setdefault('BEHIND_PROXY', '1')

from src import create_app  # noqa: E402
from src.document_processor import DocumentProcessor  # noqa: E402
from src.llm_rag import ChatbotLLM  # noqa: E402
from src.websocket import setup_websocket  # noqa: E402


def build_chatbot():
    processor = DocumentProcessor(docs_folder=os.path.join(BASE_DIR, 'docs'))
    processor.process_documents()

    # Also index anything already uploaded
    up = os.path.join(BASE_DIR, 'uploads')
    if os.path.isdir(up):
        p2 = DocumentProcessor(docs_folder=up)
        p2.process_documents()
        if p2.vector_store is not None:
            if processor.vector_store is not None:
                processor.vector_store.merge_from(p2.vector_store)
            else:
                processor.vector_store = p2.vector_store

    if processor.vector_store is None:
        print("WARNING: no documents indexed; chatbot will have no context")
        return None
    return ChatbotLLM(processor.vector_store, config_path=os.path.join(BASE_DIR, 'config.json'))


app = create_app(os.environ.get('FLASK_ENV', 'production'))
chatbot = build_chatbot()
if chatbot is None:
    class _Empty:
        def ask_question(self, question, language='en', conversation_history=None):
            return "No documents are indexed yet. Please upload a PDF first."

        def get_response(self, message=None, question=None, **kw):
            return self.ask_question(message or question or "")

        def get_smart_suggestions(self, previous_question, context, language='en'):
            return []

    chatbot = _Empty()

socketio = setup_websocket(app, chatbot)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', '7860'))
    socketio.run(app, host='0.0.0.0', port=port, debug=False, allow_unsafe_werkzeug=True)
