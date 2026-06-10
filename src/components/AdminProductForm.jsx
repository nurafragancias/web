import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, Image, Save, Upload } from 'lucide-react';
import './AdminProductForm.css';

const emptyProduct = {
  name: '',
  brand: '',
  description: '',
  category: 'masculino',
  images: [],
  variants: [
    { size: '5ml', price: 0 },
    { size: '100ml', price: 0 }
  ]
};

const normalizeProduct = (prod) => {
  if (!prod) return emptyProduct;
  const normalized = { ...prod };
  // Convert legacy single 'image' field to 'images' array
  if (!normalized.images || !Array.isArray(normalized.images)) {
    normalized.images = normalized.image ? [normalized.image] : [];
  }
  delete normalized.image;
  return normalized;
};

const AdminProductForm = ({ product, onSave, onCancel }) => {
  const [form, setForm] = useState(() => normalizeProduct(product));
  const fileInputRef = useRef(null);

  useEffect(() => {
    setForm(normalizeProduct(product));
  }, [product]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (index, field, value) => {
    setForm(prev => {
      const variants = [...prev.variants];
      variants[index] = { ...variants[index], [field]: field === 'price' ? Number(value) || 0 : value };
      return { ...prev, variants };
    });
  };

  const addVariant = () => {
    if (form.variants.length >= 3) return;
    setForm(prev => ({
      ...prev,
      variants: [...prev.variants, { size: '', price: 0 }]
    }));
  };

  const removeVariant = (index) => {
    if (form.variants.length <= 1) return;
    setForm(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm(prev => ({
          ...prev,
          images: [...prev.images, ev.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.brand.trim()) return;
    onSave(form);
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form__header">
        <h3>{product ? 'Editar Perfume' : 'Nuevo Perfume'}</h3>
        <button type="button" className="admin-form__close" onClick={onCancel}>
          <X size={18} />
        </button>
      </div>

      {/* Images Gallery */}
      <div className="admin-form__image-section">
        <label className="admin-form__image-label">Imágenes</label>
        <div className="admin-form__image-gallery">
          {form.images && form.images.map((img, index) => (
            <div key={index} className="admin-form__image-preview">
              <img src={img} alt={`Imagen ${index + 1}`} />
              <button
                type="button"
                className="admin-form__image-remove"
                onClick={() => removeImage(index)}
                title="Eliminar imagen"
              >
                <Trash2 size={14} />
              </button>
              <span className="admin-form__image-index">{index + 1}</span>
            </div>
          ))}
          <label className="admin-form__image-upload">
            <Upload size={22} />
            <span>Agregar</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              ref={fileInputRef}
              hidden
            />
          </label>
        </div>
      </div>

      {/* Fields */}
      <div className="admin-form__row">
        <div className="admin-form__field">
          <label>Nombre *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ej: Sauvage Elixir"
            required
          />
        </div>
        <div className="admin-form__field">
          <label>Marca *</label>
          <input
            type="text"
            value={form.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            placeholder="Ej: Dior"
            required
          />
        </div>
      </div>

      <div className="admin-form__field">
        <label>Descripción</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Notas olfativas, carácter de la fragancia..."
          rows={3}
        />
      </div>

      <div className="admin-form__field">
        <label>Categoría</label>
        <select
          value={form.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="unisex">Unisex</option>
        </select>
      </div>

      {/* Variants */}
      <div className="admin-form__variants">
        <div className="admin-form__variants-header">
          <label>Variantes (tamaño y precio)</label>
          {form.variants.length < 3 && (
            <button type="button" className="admin-form__add-variant" onClick={addVariant}>
              <Plus size={14} /> Agregar
            </button>
          )}
        </div>

        {form.variants.map((v, i) => (
          <div key={i} className="admin-form__variant-row">
            <input
              type="text"
              value={v.size}
              onChange={(e) => handleVariantChange(i, 'size', e.target.value)}
              placeholder="Tamaño (ej: 5ml)"
              className="admin-form__variant-size"
            />
            <div className="admin-form__variant-price-wrap">
              <span className="admin-form__currency">$</span>
              <input
                type="number"
                value={v.price || ''}
                onChange={(e) => handleVariantChange(i, 'price', e.target.value)}
                placeholder="Precio"
                className="admin-form__variant-price"
                min="0"
              />
            </div>
            {form.variants.length > 1 && (
              <button
                type="button"
                className="admin-form__remove-variant"
                onClick={() => removeVariant(i)}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="admin-form__actions">
        <button type="button" className="btn-outline-gold" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-gold">
          <Save size={16} />
          {product ? 'Guardar Cambios' : 'Crear Perfume'}
        </button>
      </div>
    </form>
  );
};

export default AdminProductForm;
