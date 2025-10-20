import { useState } from 'react';
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

        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(data.path);

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
      console.error('Error creating post:', error);
      alert('Erro ao criar publicação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-peanut-gray-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-peanut-lg">
        <div className="sticky top-0 bg-white dark:bg-peanut-gray-800 border-b border-peanut-gray-100 dark:border-peanut-gray-700 p-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-peanut-gray-800 dark:text-white">Nova publicação</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-peanut-sand dark:hover:bg-peanut-gray-700 rounded-2xl transition-colors"
          >
            <X className="w-5 h-5 text-peanut-gray-600 dark:text-peanut-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-peanut-gray-700 dark:text-peanut-gray-300 mb-3">
              Categoria
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2.5 px-4 rounded-2xl font-semibold transition-all ${
                    category === cat
                      ? 'bg-peanut-coral text-white shadow-peanut'
                      : 'bg-peanut-sand dark:bg-peanut-gray-700 text-peanut-gray-700 dark:text-peanut-gray-300 hover:bg-peanut-gray-200 dark:hover:bg-peanut-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-peanut-gray-700 dark:text-peanut-gray-300 mb-3">
              O que você quer compartilhar?
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border border-peanut-gray-200 dark:border-peanut-gray-700 bg-white dark:bg-peanut-gray-700 text-peanut-gray-900 dark:text-white focus:ring-2 focus:ring-peanut-coral focus:border-transparent transition-all resize-none placeholder:text-peanut-gray-400"
              placeholder="Compartilhe seu momento..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-peanut-gray-700 dark:text-peanut-gray-300 mb-3">
              Foto (opcional)
            </label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full rounded-2xl object-cover max-h-64"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-peanut transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-peanut-gray-300 dark:border-peanut-gray-600 rounded-2xl cursor-pointer hover:bg-peanut-sand/50 dark:hover:bg-peanut-gray-700/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 text-peanut-gray-400 mb-2" strokeWidth={2} />
                  <p className="text-sm text-peanut-gray-500 dark:text-peanut-gray-400 font-medium">
                    Clique para adicionar uma foto
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

          <button
            type="submit"
            disabled={loading || !caption}
            className="w-full bg-peanut-coral text-white py-3.5 px-6 rounded-3xl font-semibold hover:bg-peanut-coral-light shadow-peanut hover:shadow-peanut-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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
          </button>
        </form>
      </div>
    </div>
  );
};
