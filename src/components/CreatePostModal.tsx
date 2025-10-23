import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { X, Image as ImageIcon, Upload } from 'lucide-react';

type CreatePostModalProps = {
  onClose: () => void;
  onPostCreated: () => void;
};

const CATEGORIES = ['Look do dia', 'Desabafo', 'Fé', 'Dica de mãe'] as const;

export const CreatePostModal = ({ onClose, onPostCreated }: CreatePostModalProps) => {
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let imageUrl = null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from('posts').getPublicUrl(data.path);

        imageUrl = publicUrl;
      }

      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        caption,
        category,
        image_url: imageUrl,
      });

      if (error) throw error;

      onPostCreated();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error creating post:', error);
      }
      alert('Erro ao criar publicação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 glass backdrop-blur-xl border-b border-claude-gray-200/50 dark:border-claude-gray-800/50 px-6 py-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-claude-gray-900 dark:text-white">
            Nova publicação
          </h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2.5 hover:bg-claude-gray-100 dark:hover:bg-claude-gray-800 rounded-2xl transition-all duration-200"
          >
            <X className="w-5 h-5 text-claude-gray-600 dark:text-claude-gray-400" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-claude-gray-700 dark:text-claude-gray-300 mb-3">
              Categoria
            </label>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-3.5 px-5 rounded-2xl font-semibold transition-all duration-200 ${
                    category === cat
                      ? 'bg-gradient-to-r from-claude-orange-500 to-claude-orange-600 text-white shadow-claude'
                      : 'bg-claude-gray-100 dark:bg-claude-gray-800 text-claude-gray-700 dark:text-claude-gray-300 hover:bg-claude-gray-200 dark:hover:bg-claude-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-claude-gray-700 dark:text-claude-gray-300 mb-3">
              O que você quer compartilhar?
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
              rows={5}
              className="input resize-none"
              placeholder="Compartilhe seu momento..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-claude-gray-700 dark:text-claude-gray-300 mb-3">
              Foto (opcional)
            </label>
            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full object-cover max-h-80" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="absolute top-3 right-3 p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-claude transition-all hover:scale-110"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-claude-gray-300 dark:border-claude-gray-700 rounded-2xl cursor-pointer hover:bg-claude-gray-50 dark:hover:bg-claude-gray-800/50 transition-all duration-200 group">
                <div className="flex flex-col items-center justify-center py-6">
                  <ImageIcon
                    className="w-10 h-10 text-claude-gray-400 mb-3 group-hover:text-claude-orange-500 transition-colors"
                    strokeWidth={2}
                  />
                  <p className="text-sm text-claude-gray-600 dark:text-claude-gray-400 font-medium">
                    Clique para adicionar uma foto
                  </p>
                  <p className="text-xs text-claude-gray-500 dark:text-claude-gray-500 mt-1">
                    PNG, JPG até 10MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <motion.button
            whileHover={{ scale: loading || !caption ? 1 : 1.02 }}
            whileTap={{ scale: loading || !caption ? 1 : 0.98 }}
            type="submit"
            disabled={loading || !caption}
            className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2.5"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Publicando...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" strokeWidth={2.5} />
                Publicar
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};
