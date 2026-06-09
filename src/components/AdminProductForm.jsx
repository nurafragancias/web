import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image, Save } from 'lucide-react';
import './AdminProductForm.css';

const emptyProduct = {
  name: '',
  brand: '',
  description: '',
  category: 'masculino',
  image: '',
  variants: [
    { size: '5ml', price: 0 },
    { size: '100ml', price: 0 }
  ]
};

const AdminProductForm = ({ product, onSave, onCancel }) => {
  const [form, setForm] = useState(product || emptyProduct);

  useEffect(() => {
    setForm(product || emptyProduct);
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
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      handleChange('image', ev.target.result);
    };
    reader.readAsDataURL(file);
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

      {/* Image */}
      <div className="admin-form__image-section">
        {form.image ? (
          <div className="admin-form__image-preview">
            <img src={form.image} alt="Preview" />
            <button type="button" className="admin-form__image-remove" onClick={() => handleChange('image', '')}>
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <label className="admin-form__image-upload">
            <Image size={24} />
            <span>Subir imagen</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </label>
        )}
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
