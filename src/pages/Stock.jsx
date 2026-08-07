import { useState } from 'react';
import { useLocation } from 'wouter';
import BackButton from '../components/BackButton';
import Button from '../components/Button';
import Input from '../components/Input';

const Stock = () => {
    const [, setLocation] = useLocation();

    // Estados para los Inputs Inline
    const [addingCategory, setAddingCategory] = useState(false);
    const [addingSubCategoryTo, setAddingSubCategoryTo] = useState(null); // Guarda el ID de la categoría
    const [inlineInputValue, setInlineInputValue] = useState('');

    // Función para forzar solo números y simular el auto-guardado
    const handleNumberChange = (e, field, id) => {
        const value = e.target.value.replace(/\D/g, ''); // Remueve cualquier caracter no numérico
        // TODO: Aquí se despacharía la acción a Axios/Context para actualizar el estado global en tiempo real
        console.log(`Auto-guardando ${field} del producto ${id}: ${value}`);
    };

    const handleOpenModals = (modalName) => {
        // TODO: Implementar en la Etapa 10
        console.log(`Abriendo modal: ${modalName}`);
    };

    // Renderizador del formulario Inline
    const renderInlineForm = (onCancel, onAccept, placeholder) => (
        <div className="inline-form">
            <Input
                value={inlineInputValue}
                onChange={(e) => setInlineInputValue(e.target.value)}
                placeholder={placeholder}
            />
            <button className="btn-inline btn-inline--accept" onClick={onAccept}>
                <span className="material-icons">check</span>
            </button>
            <button className="btn-inline btn-inline--cancel" onClick={() => {
                setInlineInputValue('');
                onCancel();
            }}>
                <span className="material-icons">close</span>
            </button>
        </div>
    );

    return (
        <div className="stock">
            {/* Cabecera Especial de Stock */}
            <div className="header">
                <BackButton onClick={() => setLocation('/')} />

                <div className="stock__header-actions">
                    {/* Botón de Configurar Stock (Q3) */}
                    <button className="btn-edit" onClick={() => handleOpenModals('Configurar Stock')}>
                        <span className="material-symbols-outlined">
                            settings
                        </span>
                    </button>

                    {/* Botón de Nuevo Producto en la esquina superior derecha (Q1) */}
                    <button
                        className="shift-btn shift-btn--active"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.9rem' }}
                        onClick={() => handleOpenModals('Nuevo Producto')}
                    >
                        Nuevo Producto
                    </button>
                </div>
            </div>

            <h1 className="stock__main-title">Categorias</h1>

            {/* --- CATEGORÍA: GOMITAS --- */}
            <div className="stock__category">
                <h2 className="stock__category-title">Gomitas</h2>

                <div className="stock__grid-header">
                    <span>Nombre</span>
                    <span>Stock</span>
                    <span>Precio</span>
                    <span>Editar</span>
                </div>

                <div className="stock__row">
                    <span className="stock__name">Mogul frutillas</span>
                    <Input
                        className="input--stock"
                        defaultValue="20"
                        onChange={(e) => handleNumberChange(e, 'stock', 1)}
                    />
                    <div className="stock__price-wrapper">
                        <span>$</span>
                        <Input
                            className="input--stock"
                            defaultValue="2000"
                            onChange={(e) => handleNumberChange(e, 'precio', 1)}
                        />
                    </div>
                    <button className="btn-edit" onClick={() => handleOpenModals('Edición de Producto')}>
                        <span className="material-symbols-outlined">
                            edit
                        </span>
                    </button>
                </div>

                {addingSubCategoryTo === 'gomitas' ? (
                    renderInlineForm(() => setAddingSubCategoryTo(null), () => console.log('Subcategoría guardada'), 'Nombre subcategoría...')
                ) : (
                    <Button onClick={() => setAddingSubCategoryTo('gomitas')}>Nueva SubCategoria</Button>
                )}
            </div>

            {/* --- CATEGORÍA: ALFAJORES --- */}
            <div className="stock__category">
                <h2 className="stock__category-title">Alfajores</h2>

                <div className="stock__grid-header">
                    <span>Nombre</span>
                    <span>Stock</span>
                    <span>Precio</span>
                    <span>Editar</span>
                </div>

                <div className="stock__row">
                    <span className="stock__name">Tatin simple</span>
                    <Input className="input--stock" defaultValue="20" onChange={(e) => handleNumberChange(e, 'stock', 2)} />
                    <div className="stock__price-wrapper">
                        <span>$</span>
                        <Input className="input--stock" defaultValue="2000" onChange={(e) => handleNumberChange(e, 'precio', 2)} />
                    </div>
                    <button className="btn-edit" onClick={() => handleOpenModals('Edición de Producto')}>
                        <span className="material-symbols-outlined">
                            edit
                        </span>
                    </button>
                </div>

                {/* Subcategoría: Terrabusi */}
                <h3 className="stock__subcategory-title">Terrabusi</h3>

                <div className="stock__row">
                    <span className="stock__name">Terrabusi negro</span>
                    <Input className="input--stock" defaultValue="20" onChange={(e) => handleNumberChange(e, 'stock', 3)} />
                    <div className="stock__price-wrapper">
                        <span>$</span>
                        <Input className="input--stock" defaultValue="2000" onChange={(e) => handleNumberChange(e, 'precio', 3)} />
                    </div>
                    <button className="btn-edit" onClick={() => handleOpenModals('Edición de Producto')}>
                        <span className="material-symbols-outlined">
                            edit
                        </span>
                    </button>
                </div>

                <div className="stock__row">
                    <span className="stock__name">Terrabusi blanco</span>
                    <Input className="input--stock" defaultValue="20" onChange={(e) => handleNumberChange(e, 'stock', 4)} />
                    <div className="stock__price-wrapper">
                        <span>$</span>
                        <Input className="input--stock" defaultValue="2000" onChange={(e) => handleNumberChange(e, 'precio', 4)} />
                    </div>
                    <button className="btn-edit" onClick={() => handleOpenModals('Edición de Producto')}>
                        <span className="material-symbols-outlined">
                            edit
                        </span>
                    </button>
                </div>

                {addingSubCategoryTo === 'alfajores' ? (
                    renderInlineForm(() => setAddingSubCategoryTo(null), () => console.log('Subcategoría guardada'), 'Nombre subcategoría...')
                ) : (
                    <Button onClick={() => setAddingSubCategoryTo('alfajores')}>Nueva SubCategoria</Button>
                )}
            </div>

            {/* --- BOTÓN GLOBAL NUEVA CATEGORÍA --- */}
            <div style={{ marginTop: '2rem' }}>
                {addingCategory ? (
                    renderInlineForm(() => setAddingCategory(false), () => console.log('Categoría guardada'), 'Nombre categoría...')
                ) : (
                    <Button onClick={() => setAddingCategory(true)}>Nueva Categoria</Button>
                )}
            </div>

        </div>
    );
};

export default Stock;